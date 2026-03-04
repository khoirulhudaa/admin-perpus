interface Attendance {
    statusKehadiran: string;
  }
  
  interface Student {
    attendance?: Attendance;
  }
  
  interface AttendanceStats {
    totalHadir: number;
    totalAlpa: number;
    totalSakit: number;
    totalDispensasi: number;
  }
  
  // Lookup table to map status to stats key
  const statusMap: { [key: string]: keyof AttendanceStats } = {
    hadir: 'totalHadir',
    alpa: 'totalAlpa',
    sakit: 'totalSakit',
    dispensasi: 'totalDispensasi',
  };
  
  export const calculateAttendanceStats = (data: Student[]): AttendanceStats => {
    // Initialize stats
    const stats: AttendanceStats = {
      totalHadir: 0,
      totalAlpa: 0,
      totalSakit: 0,
      totalDispensasi: 0,
    };
  
    // Return zeroed stats if data is empty
    if (!data.length) {
      return stats;
    }
  
    // Count statuses from attendance
    data.forEach((student) => {
      if (!student.attendance) return; // Skip if no attendance
  
      const status = student.attendance.statusKehadiran?.toLowerCase();
      const statKey = statusMap[status];
      if (statKey) {
        stats[statKey]++;
      }
    });
  
    return stats;
  };