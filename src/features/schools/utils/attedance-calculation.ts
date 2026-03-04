// src/utils/attendanceUtils.ts
interface Attendance {
  statusKehadiran: string;
}

interface Student {
  attendance: Attendance;
}

interface AttendanceStats {
  totalHadir: number;
  totalAlpa: number;
  totalSakit: number;
  totalDispensasi: number;
}

// Tabel pencarian untuk memetakan status ke kunci statistik
const statusMap: { [key: string]: keyof AttendanceStats } = {
  hadir: 'totalHadir',
  alpa: 'totalAlpa',
  sakit: 'totalSakit',
  dispensasi: 'totalDispensasi',
};

export const calculateAttendanceStats = (data: Student[]): AttendanceStats => {
  // Inisialisasi stats
  const stats: AttendanceStats = {
    totalHadir: 0,
    totalAlpa: 0,
    totalSakit: 0,
    totalDispensasi: 0,
  };

  // Jika data kosong, kembalikan stats
  if (!data.length) {
    return stats;
  }

  // Iterasi setiap siswa
  data.forEach((student) => {
    // Pastikan attendance ada
    if (!student.absensis[0]) return;

    const status = student.absensis[0].statusKehadiran?.toLowerCase();
    const statKey = statusMap[status];
    if (statKey) {
      stats[statKey]++; // Tambah 1 ke statistik yang sesuai
    }
  });

  return stats;
};