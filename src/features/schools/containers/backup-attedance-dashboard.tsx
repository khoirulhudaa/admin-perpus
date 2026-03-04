import { useBiodata } from "@/features/user";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import AttendanceDashboard from "../components/attedance";
import { calculateAttendanceStats } from "../utils";
import { Alert, AlertDescription, AlertTitle, lang } from "@/core/libs";
import { Loader } from "lucide-react";

interface AttedancesReportProps {
  selectedSchool?: string;
  selectDate?: Date;
}

export const AttedancesReport = ({ selectedSchool, selectDate }: AttedancesReportProps) => {
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [selectedClass] = useState<string>('');

  const biodata = useBiodata();

  const formatTime = (time?: string) => {
    return time
      ? dayjs(time).tz('Asia/Jakarta').format('DD MMM YYYY, HH:mm:ss')
      : 'N/A';
  };

  // Filter data based on selectedSchool and skip empty absensis
  const filteredBySchool = useMemo(() => {
    if (!biodata.data || biodata.data.length === 0) return [];
    const filtered = biodata.data.filter(
      (student) =>
        student.absensis?.length > 0 &&
        (!selectedSchool || student.user?.sekolah?.namaSekolah === selectedSchool)
    );
    console.log("filteredBySchool:", filtered);
    return filtered;
  }, [biodata.data, selectedSchool]);

  // Determine the target date (today if selectDate is undefined, otherwise selectDate)
  const targetDate = useMemo(() => {
    return selectDate
      ? dayjs(selectDate).tz('Asia/Jakarta').startOf('day')
      : dayjs().tz('Asia/Jakarta').startOf('day');
  }, [selectDate]);

  // Filter data for the target date
  const specificDayData = useMemo(() => {
    const data = filteredBySchool
      .flatMap((student) =>
        student.absensis
          ?.filter((attendance) =>
            dayjs(attendance.jamMasuk)
              .tz('Asia/Jakarta')
              .isSame(targetDate, 'day')
          )
          .map((attendance) => ({
            ...student,
            attendance: {
              ...attendance,
              jamMasuk: formatTime(attendance.jamMasuk),
              jamPulang: formatTime(attendance.jamPulang),
            },
          }))
      )
      .filter((student) =>
        selectedClass ? student.kelas?.namaKelas === selectedClass : true
      ) || [];

    // console.log('specificDayData:', data);
    return data;
  }, [filteredBySchool, selectedClass, targetDate]);

  // Filter data for the previous day (relative to targetDate)
  const previousDayData = useMemo(() => {
    const previousDate = targetDate.subtract(1, 'day').startOf('day');
    const data = filteredBySchool
      .flatMap((student) =>
        student.absensis
          ?.filter((attendance) =>
            dayjs(attendance.jamMasuk)
              .tz('Asia/Jakarta')
              .isSame(previousDate, 'day')
          )
          .map((attendance) => ({
            ...student,
            attendance: {
              ...attendance,
              jamMasuk: formatTime(attendance.jamMasuk),
              jamPulang: formatTime(attendance.jamPulang),
            },
          }))
      )
      .filter((student) =>
        selectedClass ? student.kelas?.namaKelas === selectedClass : true
      ) || [];

    console.log('previousDayData:', data);
    return data;
  }, [filteredBySchool, selectedClass, targetDate]);

  // Calculate attendance stats for the target date
  const specificDayStats = useMemo(() => {
    const stats = calculateAttendanceStats(specificDayData);
    console.log('specificDayStats:', stats);
    return stats;
  }, [specificDayData]);

  // Calculate attendance stats for the previous day
  const previousDayStats = useMemo(() => {
    const stats = calculateAttendanceStats(previousDayData);
    console.log('previousDayStats:', stats);
    return stats;
  }, [previousDayData]);

  // Calculate percentage changes and trends
  const attendanceChanges = useMemo(() => {
    const calculateChange = (current: number, last: number) => {
      if (current === last) {
        return {
          percentage: '0.0%',
          trend: 'neutral',
        };
      }
      if (last === 0) {
        return {
          percentage: current > 0 ? '100.0%' : '-100.0%',
          trend: current > 0 ? 'up' : 'down',
        };
      }
      const change = ((current - last) / last) * 100;
      return {
        percentage: `${Math.abs(change).toFixed(1)}%`,
        trend: change > 0 ? 'up' : 'down',
      };
    };

    return {
      hadir: calculateChange(specificDayStats.totalHadir, previousDayStats.totalHadir),
      alpa: calculateChange(specificDayStats.totalAlpa, previousDayStats.totalAlpa),
      sakit: calculateChange(specificDayStats.totalSakit, previousDayStats.totalSakit),
      dispensasi: calculateChange(specificDayStats.totalDispensasi, previousDayStats.totalDispensasi),
    };
  }, [specificDayStats, previousDayStats]);

  // Update isStatsLoading based on biodata loading state
  useMemo(() => {
    if(!biodata.isLoading) {
      setIsStatsLoading(false)
    }
  }, [biodata.isLoading]);

  const renderLoading = () => {
    if (isStatsLoading) {
      return (
        <Alert className="mb-4">
          <Loader className="h-4 w-4 animate-spin" />
          <AlertTitle>{lang.text('loadData')}</AlertTitle>
          <AlertDescription className="text-gray-500">
            {lang.text('loadingData')}
          </AlertDescription>
        </Alert>
      );
    }
  };

  console.log('specificDayStats 1212', specificDayData)
  console.log('attendanceChanges', attendanceChanges)

  return (
    <>
      <div className="mt-4 mb-12">
        {renderLoading()}
        <AttendanceDashboard
          stats={specificDayStats}
          changes={attendanceChanges}
          isLoading={isStatsLoading}
        />
      </div>
    </>
  );
};