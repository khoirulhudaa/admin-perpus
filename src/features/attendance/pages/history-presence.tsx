import { dayjs, lang } from "@/core/libs";
import { useClassroom } from "@/features/classroom";
import { useBiodataNew } from "@/features/user/hooks/use-biodata-new";
import { parseISO } from "date-fns";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa"; // Tambahkan FaExclamationTriangle
import { io } from "socket.io-client";
import AttendanceCard from "../components/attendanceCard";
import QRCodeDisplay from "../components/QrcodeDisplay";
import { generateQrCodeApi } from "../utils";

interface Attendance {
  user: {
    image: string;
    name: string;
    nisn: string;
  };
  kelas:
    | {
        namaKelas: string;
      }
    | string;
  absensis?: {
    statusKehadiran: string;
  }[];
}

// ✅ WebSocket Server
const WEBSOCKET_URL = "https://dev.kiraproject.id";

export function HistoryAttendance() {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isQrDisabled, setIsQrDisabled] = useState<boolean>(false);
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState<string | null>(null); // State baru untuk error
  const [notFound, setNotFound] = useState<boolean>(false); // State baru untuk error

  const classroom = useClassroom()
  const absenHariIni = useBiodataNew()

  console.log('absen hariiiini', absenHariIni?.dataOld?.data?.absenHariIni)

  // ✅ Inisialisasi WebSocket
  useEffect(() => {
    console.log("📡 Menghubungkan ke WebSocket...");
    const socket = io(WEBSOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ WebSocket Connected:", WEBSOCKET_URL);
      setError(null); // Reset error saat koneksi berhasil
    });

    socket.on("connect_error", (error) => {
      console.error("❌ WebSocket Connection Error:", error.message);
      setError("Gagal terhubung ke server. Silakan periksa koneksi Anda.");
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 WebSocket Disconnected:", reason);
      setError("Koneksi terputus. Mencoba menyambung kembali...");
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    // socket.on("absen-barcode", (data) => {
    //   console.log("📩 Data Absensi Bar/Baru:", data);
    //   setAttendanceData((prevData) => {
    //     const existingIndex = prevData.findIndex(
    //       (item) => item.user.nisn === data.user.nisn
    //     );

    //     if (existingIndex !== -1) {
    //       const updatedData = [...prevData];
    //       updatedData[existingIndex] = data;
    //       return updatedData;
    //     } else {
    //       return [...prevData, data];
    //     }
    //   });
    //   setError(null); // Reset error saat data diterima
    // });

    socket.on("absen-barcode", (data) => {
      console.log("📩 Data Absensi Bar/Baru:", data);
      setAttendanceData((prevData) => [...prevData, data]);
      setError(null); // Reset error saat data diterima
    });

    return () => {
      console.log("❌ Menutup koneksi WebSocket...");
      socket.disconnect();
    };
  }, []);

  console.log('attedance data history:', attendanceData)

  // ✅ Fungsi Generate QR Code
  const generateQrCode = async () => {
    setLoading(true);
    setIsQrDisabled(true);

    try {
      console.log("🔄 Generating QR Code...");
      setError(null); // Reset error
      const qrCode = await generateQrCodeApi();
      if (!qrCode) {
        setError("Gagal menghasilkan QR Code. Silakan coba lagi.");
        setIsQrDisabled(false);
      } else {
        setQrCodeData(qrCode);
        console.log("✅ QR Code berhasil dibuat:", qrCode);
        localStorage.setItem("qrCodeData", qrCode);
        localStorage.setItem("qrGeneratedDate", new Date().toISOString());
      }
    } catch (error) {
      console.error("❌ Error generating QR Code:", error);
      setError("Gagal menghasilkan QR Code. Silakan periksa koneksi Anda.");
      setIsQrDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mengecek apakah QR Code sudah pernah digenerate hari ini
  useEffect(() => {
    const savedQr = localStorage.getItem("qrCodeData");
    const savedDate = localStorage.getItem("qrGeneratedDate");

    if (savedQr && savedDate) {
      const lastGeneratedDate = parseISO(savedDate);
      const now = new Date();

      const resetTime = new Date(lastGeneratedDate);
      resetTime.setDate(resetTime.getDate() + 1);
      resetTime.setHours(6, 0, 0, 0);

      console.log("📅 QR Code dibuat pada:", lastGeneratedDate);
      console.log("⏰ QR Code akan reset pada:", resetTime);

      if (now >= resetTime) {
        console.log("🔄 Sudah melewati jam 6 pagi, reset QR Code!");
        localStorage.removeItem("qrCodeData");
        localStorage.removeItem("qrGeneratedDate");
        setQrCodeData(null);
        setIsQrDisabled(false);
      } else {
        console.log("✅ QR Code masih berlaku.");
        setQrCodeData(savedQr);
        setIsQrDisabled(true);
      }
    }
  }, []);

   const sortedAttendanceData = absenHariIni?.dataOld?.data?.absenHariIni.sort((a, b) => {
    const jamMasukA = a.jamMasuk;
    const jamMasukB = b.jamMasuk;

    if (jamMasukA && jamMasukB) {
      return dayjs(jamMasukB).tz("Asia/Jakarta").isAfter(dayjs(jamMasukA).tz("Asia/Jakarta")) ? 1 : -1;
    }
    if (jamMasukA) return -1;
    if (jamMasukB) return 1;
    return 0;
  });

  // Filter attendance data based on selected class
  const filteredAttendanceData = sortedAttendanceData
    ? selectedClass !== ""
      ? sortedAttendanceData.filter((data) =>
        data.namaKelas && data.namaKelas === selectedClass
      )
    : sortedAttendanceData
  : [];

  return (
    <div className="container mx-auto h-max p-4 relative">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        {lang.text('historyPresencce')}
      </h2>

      <QRCodeDisplay
        generateQrCode={generateQrCode}
        qrCodeData={qrCodeData}
        isDisabled={loading || isQrDisabled}
      />

      <div className="relative mt-6 z-[22]">  
        <div className="relative">
          <div className="w-full flex items-center gap-3">
            <div
              className="relative active:scale-[0.98] p-2 border rounded-md text-gray-200 bg-gray-700 dark:bg-gray-800 w-48 flex justify-between items-center cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{selectedClass || lang.text('allClasses')}</span>
              <span>{dropdownOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
            </div>
            <div className="py-2 px-3 rounded-md dark:text-gray-200 border border-gray-700 dark:bg-transaparent w-max">
              {lang.text('attendance')}: {filteredAttendanceData.length || 0}
            </div>
          </div>

          {dropdownOpen && (
            <div className="absolute mt-1 h-[400px] overflow-y-auto w-48 bg-gray-800 dark:bg-gray-900 rounded-md shadow-lg z-10">
              <div
                onClick={() => {
                  setSelectedClass("");
                  setDropdownOpen(false);
                }}
                className="p-2 cursor-pointer text-gray-200 hover:bg-gray-700 dark:text-white dark:hover:bg-gray-700"
              >
                {lang.text('allClasses')}
              </div>
              {classroom?.data?.map((className, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedClass(className?.namaKelas);
                    setDropdownOpen(false);
                  }}
                  className="p-2 cursor-pointer text-gray-200 hover:bg-gray-700 dark:text-white dark:hover:bg-gray-700"
                >
                  {className?.namaKelas}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 h-max pb-28">
          {error ? (
            <div className="w-full h-[30vh] border border-dashed border-white rounded-lg flex flex-col justify-center items-center mt-10 col-span-full">
              <img src="/files.png" alt='file icon' className="w-[120px]" />
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                {error}
              </p>
              <button
                onClick={() => {
                  // fetchClasses();
                  absenHariIni?.queryOld.refetch()
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {lang.text('tryAgain')}
              </button>
            </div>
          ): notFound ? (
             <div className="w-full h-[30vh] border border-dashed border-white rounded-lg flex flex-col justify-center items-center mt-10 col-span-full">
                <img src="/files.png" alt='file icon' className="w-[120px]" />
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                  {lang.text('notFoundDataByClass')}
                </p>
              </div>
          ) : filteredAttendanceData.length > 0 ? (
            filteredAttendanceData.map((data, index) => (
              <AttendanceCard key={index} data={data} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center mt-10 w-full col-span-full">
              {animationData ? (
                <Lottie animationData={animationData} className="w-64 h-64" />
              ) : (
                <div className="w-full h-[30vh] border border-dashed border-white rounded-lg flex flex-col justify-center items-center mt-10 col-span-full">
                  <img src="/files.png" alt='file icon' className="w-[120px]" />
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    {lang.text('waitingPresence')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}