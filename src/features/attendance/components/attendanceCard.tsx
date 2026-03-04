import { Badge, Card, CardContent, dayjs } from "@/core/libs";
import id from "dayjs/locale/id";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { motion } from "framer-motion";

// Aktifkan plugin utc dan timezone
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(id);

interface Attendance {
  user: {
    image: string;
    name: string | null | undefined; // Allow name to be optional
    nisn: string | null | undefined; // Allow nisn to be optional
  };
  kelas:
    | {
        namaKelas: string;
      }
    | string
    | null
    | undefined;
  absensis?: {
    statusKehadiran?: string; // Make statusKehadiran optional
    jamMasuk?: string; // Make jamMasuk optional
  }[];
}

interface AttendanceCardProps {
  data: Attendance;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ data }) => {
  // Fungsi untuk memformat jamMasuk
  const formatJamMasuk = (jamMasuk?: string | null) => {
    if (!jamMasuk) return "Tidak Tersedia"; // Handle undefined or null
    return dayjs(jamMasuk)
      .tz("Asia/Jakarta")
      .format("dddd, DD MMMM YYYY, HH:mm");
  };

  console.log('data user history', data)
  return (
    <motion.div
      whileHover={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full"
    >
      <Card
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 shadow-md hover:shadow-lg rounded-xl p-4 flex flex-col gap-4 transition-shadow duration-300"
        aria-label={`Attendance card for ${data.name ?? "Unknown"}`}
      >
        {/* 🔹 Profile Image */}
        <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-sm">
          <img
            // src={data.image.includes('/uploads') ? API_CONFIG.baseUrlOld+'/'+data?.user?.image  : "/defaultProfile.png"}
            src={data?.foto?.includes('/uploads') ? 'https://dev.kiraproject.id'+data?.foto  : "/defaultProfile.png"}
            alt={`${data.name ?? "Unknown"}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 🔹 Attendance Information */}
        <CardContent className="flex flex-col p-0 pt-4">
          <h3 className="text-lg font-semibold tracking-tight border-b border-white/10 pb-3 mb-3">
            {data.name ?? "Tidak Tersedia"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
            NISN: {data.nisn ?? "Tidak Tersedia"}
          </p>
          {/* <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Kelas:{" "}
            {data.kelas && typeof data.kelas === "object" && data.kelas.namaKelas
              ? data.kelas.namaKelas
              : typeof data.kelas === "string"
              ? data.kelas
              : "Tidak Tersedia"}
          </p> */}
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Kelas:{" "}
            {data.namaKelas
              ? data.namaKelas
              : "Tidak Tersedia"}
          </p>

          {/* 🔹 Status Kehadiran */}
          <motion.div
            className="mt-3 flex items-center gap-3"
            whileHover={{ opacity: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              className='py-1 px-3 text-sm font-semibold bg-green-500 text-white hover:bg-green-600'>
              Hadir
            </Badge>
            {/* <Badge
              className={`py-1 px-3 text-sm font-semibold ${
                data.absensis?.[0]?.statusKehadiran === "hadir"
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {data.absensis?.[0]?.statusKehadiran ?? "Tidak Hadir"}
            </Badge> */}
            <Badge className="py-1 px-3 text-sm font-semibold">
              {formatJamMasuk(data?.jamMasuk)}
            </Badge>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AttendanceCard;