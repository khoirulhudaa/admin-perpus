import { lang } from "@/core/libs";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { checkAttendance } from "./attedanceChecker";

interface GenerateAttendancePDFParams {
  studentParams: {
    page: number;
    size: number;
    sekolahId?: number;
    idKelas?: number;
    keyword?: string;
  };
  attendanceData: any;
  alert: any; // Tipe sesuai dengan useAlert
  nameSchool: string;
}

interface GenerateMonthlyAttendancePDFParams {
  studentParams: {
    page: number;
    size: number;
    sekolahId?: number;
    idKelas?: number;
    keyword?: string;
  };
  attendanceData: any;
  alert: any;
  nameSchool: string;
  month?: string; // Nama bulan, misalnya "May"
  year?: string; // Tahun ajaran, misalnya "2025/2026"
}

export const generateAttendancePDF = async ({
  studentParams,
  attendanceData,
  alert,
  nameSchool
}: GenerateAttendancePDFParams) => {
  if (!attendanceData) {
    alert.error("Tidak ada data kehadiran yang tersedia untuk diunduh");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert.error("Token tidak ditemukan, silakan login.");
      return;
    }

    const pdfParams = {
      ...studentParams,
      page: 1,
      size: 999,
    };

    console.log("Mengambil data PDF dengan parameter:", pdfParams);

    // Ambil data dari /api/user-siswa
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/user-siswa`,
      {
        params: pdfParams,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Respons API:", response.data);

    // Tangani struktur respons yang bervariasi
    const studentList = Array.isArray(response.data)
      ? response.data
      : response.data.data || response.data.results || response.data.students;
    if (!studentList || !Array.isArray(studentList)) {
      throw new Error("Data siswa tidak ditemukan dalam respons");
    }

    console.log("Daftar siswa:", studentList);

    const fullAttendanceResult = checkAttendance(attendanceData, studentList);
    console.log("Hasil kehadiran lengkap:", fullAttendanceResult);

    if (fullAttendanceResult.length === 0) {
      alert.error("Tidak ada data kehadiran yang tersedia untuk diunduh");
      return;
    }

    const doc = new jsPDF();
    const title = lang.text('reportStudentToday');

    // Format tanggal dan waktu saat ini
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const formattedDateTime = nameSchool + ' - ' + now.toLocaleString("id-ID", options);

    // Header tabel
    const headers = ["No", "Nama", "NIS", "NISN", "Waktu", "Kehadiran"];

    // Map data ke baris tabel
    const data = fullAttendanceResult.map((item: any, index: number) => [
      index + 1,
      item.name || "N/A",
      item.nis || "N/A",
      item.nisn || "N/A",
      item.status === "Hadir" ? item.jamMasuk || "-" : "-",
      item.status || "N/A",
    ]);

    // Tambahkan judul
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    // Tambahkan tanggal dan waktu
    doc.setFontSize(10);
    doc.text(formattedDateTime, 14, 28);

    // Tambahkan tabel
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 34,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 10 }, // No (narrow, just for numbering)
        1: { cellWidth: 50 }, // Nama (wide, for longer names)
        2: { cellWidth: 30 }, // NIS (medium, for shorter numbers)
        3: { cellWidth: 30 }, // NISN (medium, for shorter numbers)
        4: { cellWidth: 40 }, // Jam Masuk (wide, for date-time)
        5: { cellWidth: 30 }, // Kehadiran (medium, for "Hadir"/"Belum hadir")
      },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 2 },
    });

    doc.save("laporan_kehadiran_hari_ini.pdf");
  } catch (error: any) {
    console.error("Error saat membuat PDF:", error);
    alert.error(`Gagal membuat PDF: ${error.message || "Kesalahan tidak diketahui"}`);
  }
};

export const generateMonthlyAttendancePDF = async ({
  studentParams,
  attendanceData,
  alert,
  nameSchool,
  month = new Date().toLocaleString("en-US", { month: "long" }), // Default: bulan saat ini
  year = `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`, // Default: tahun ajaran saat ini
}: GenerateMonthlyAttendancePDFParams) => {
  if (!attendanceData || !attendanceData.length) {
    alert.error("Tidak ada data kehadiran bulanan yang tersedia untuk diunduh");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert.error("Token tidak ditemukan, silakan login.");
      return;
    }

    const pdfParams = {
      ...studentParams,
      page: 1,
      size: 999,
    };

    // Ambil data siswa dari /api/user-siswa
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/user-siswa`,
      {
        params: pdfParams,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Tangani struktur respons yang bervariasi
    const studentList = Array.isArray(response.data)
      ? response.data
      : response.data.data || response.data.results || response.data.students;
    console.log('student list', studentList)
    if (!studentList || !Array.isArray(studentList)) {
      throw new Error("Data siswa tidak ditemukan dalam respons");
    }

    // Filter data kehadiran bulanan berdasarkan bulan dan tahun
    const monthlyData = attendanceData
      .map((item: any) => ({
        ...item,
        kehadiranBulanan: item.kehadiranBulanan.filter(
          (bulanan: any) => bulanan.namaBulan === month && bulanan.tahunAjaran === year
        ),
      }))
      .filter((item: any) => item.kehadiranBulanan.length > 0);
      console.log('monthly', monthlyData)
    if (!monthlyData.length) {
      alert.error(`Tidak ada data kehadiran untuk bulan ${month} tahun ajaran ${year}`);
      return;
    }

    const doc = new jsPDF();
    const title = `${lang.text('ReportOverview')} - ${month} ${year}`;

    // Format tanggal dan waktu saat ini untuk header
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const formattedDateTime = `${nameSchool} - ${now.toLocaleString("id-ID", options)}`;

    // Header tabel
    const headers = [
      "No",
      "Nama",
      "NIS",
      // "NISN",
      "Hadir",
      "Sakit",
      "Izin",
      "Alpha",
    ];

    // Map data ke baris tabel
    const data = monthlyData.flatMap((item: any, index: number) =>
      item.kehadiranBulanan.map((bulanan: any) => {
        const student = studentList.find(
          (s: any) => s.biodataSiswa[0]?.id === bulanan.biodataSiswaId
        );
        console.log('student', student)
        return [
          index + 1,
          student?.name || "N/A",
          student?.nis || "N/A",
          // student?.nisn || "N/A",
          bulanan.jumlahMasukPerBulan || 0,
          bulanan.jumlahSakitPerBulan || 0,
          bulanan.jumlahIjinPerBulan || 0,
          bulanan.jumlahAlphaPerBulan || 0,
        ];
      })
    );

    if (!data.length) {
      alert.error("Tidak ada data kehadiran yang dapat ditampilkan");
      return;
    }

    // Tambahkan judul
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    // Tambahkan tanggal dan waktu
    doc.setFontSize(10);
    doc.text(formattedDateTime, 14, 28);

    // Tambahkan tabel
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 34,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 10 }, // No
        1: { cellWidth: 50 }, // Nama
        2: { cellWidth: 30 }, // NIS
        // 3: { cellWidth: 30 }, // NISN
        4: { cellWidth: 20 }, // Hadir
        5: { cellWidth: 20 }, // Sakit
        6: { cellWidth: 20 }, // Izin
        7: { cellWidth: 20 }, // Alpha
      },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 2 },
    });

    doc.save(`laporan_kehadiran_bulanan_${month}_${year}.pdf`);
  } catch (error: any) {
    console.error("Error saat membuat PDF bulanan:", error);
    alert.error(`Gagal membuat PDF: ${error.message || "Kesalahan tidak diketahui"}`);
  }
};