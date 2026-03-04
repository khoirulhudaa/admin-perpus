import { Alert, AlertDescription, AlertTitle, Button, lang } from "@/core/libs";
import { useProfile } from "@/features/profile";
import { useBiodataNew } from "@/features/user/hooks/use-biodata-new";
import { Loader, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { AttendanceDashboard } from "../components";

interface AttedancesReportProps {
  selectedSchool?: string;
}

export const AttedancesReport = ({ selectedSchool }: AttedancesReportProps) => {
  const [turn, setTurn] = useState<boolean>(false);
  const [missingStudents, setMissingStudents] = useState<
    { nis: string; name: string; kelas: string; email: string; image: string | null; noTlp: number; noTlpOrtu: number }[]
  >([]);

  const profile = useProfile();
  const {dataOld: biodataNew, queryOld} = useBiodataNew(); // Fallback to 55 if no schoolId
  
  console.log('dataold', biodataNew?.data)

  useEffect(() => {
    queryOld.refetch()
  }, [biodataNew.data])

  // Current and previous day stats
  const currentStats = biodataNew?.data
    ? {
        totalHadir: biodataNew.data.hari_ini_hadir,
        totalAlpa: biodataNew.data.hari_ini_alpha,
        totalSakit: biodataNew.data.hari_ini_sakit,
        totalDispensasi: biodataNew.data.hari_ini_dispen,
      }
    : { totalHadir: 0, totalAlpa: 0, totalSakit: 0, totalDispensasi: 0 };

  const lastStats = biodataNew?.data
    ? {
        totalHadir: biodataNew.data.kemarin_hadir,
        totalAlpa: biodataNew.data.kemarin_alpha,
        totalSakit: biodataNew.data.kemarin_sakit,
        totalDispensasi: biodataNew.data.kemarin_dispen,
      }
    : { totalHadir: 0, totalAlpa: 0, totalSakit: 0, totalDispensasi: 0 };

  // Calculate attendance changes
  const attendanceChanges = {
    hadir: calculateChange(currentStats.totalHadir, lastStats.totalHadir),
    alpa: calculateChange(currentStats.totalAlpa, lastStats.totalAlpa),
    sakit: calculateChange(currentStats.totalSakit, lastStats.totalSakit),
    dispensasi: calculateChange(currentStats.totalDispensasi, lastStats.totalDispensasi),
  };

  // Helper function to calculate percentage change
  function calculateChange(current: number, last: number) {
    if (current === last) {
      return { percentage: "0.0%", trend: "neutral" };
    }
    if (last === 0) {
      return {
        percentage: current > 0 ? "100.0%" : "-100.0%",
        trend: current > 0 ? "up" : "down",
      };
    }
    const change = ((current - last) / last) * 100;
    return {
      percentage: `${Math.abs(change).toFixed(1)}%`,
      trend: change > 0 ? "up" : "down",
    };
  }

  console.log('biodataNew.data', biodataNew.data)

  // Update missing students from tanpaKabarHariIni
  useEffect(() => {
    if (biodataNew?.data?.tanpaKabarHariIni) {
      const missing = biodataNew.data.tanpaKabarHariIni.map((student: any) => ({
        nis: student.nis || "-",
        name: student.name || "-",
        kelas: student.biodataSiswa?.[0]?.kelas?.namaKelas || "-",
        email: student.email || "-",
        image: student.foto || student.image || null,
        noTlp: student.noTlp || 0,
        noTlpOrtu: student.noTlpOrtu || 0,
      }));
      setMissingStudents(missing);
    } else {
      setMissingStudents([]);
    }
  }, [biodataNew?.data]);

  console.log('missong', missingStudents)

  const renderLoading = () => {
    if (biodataNew.isLoading) {
      return (
        <Alert className="mb-4">
          <Loader className="h-4 w-4 animate-spin" />
          <AlertTitle>{lang.text("loadData")}</AlertTitle>
          <AlertDescription className="text-gray-500">
            {lang.text("loadingData")}
          </AlertDescription>
        </Alert>
      );
    }
  };

  const handleRefetch = () => {
    setTurn(true);
    queryOld.refetch();
    setTimeout(() => setTurn(false), 1000);
  };

  return (
    <>
      <div className="mt-4 mb-12">
        {profile?.user?.role === "admin" && (
          <div className="absolute top-3 right-[10%] w-full flex justify-end items-center">
            <Button
              variant="outline"
              onClick={handleRefetch}
              className="ml-auto px-3"
            >
              <RefreshCcw
                className={
                  turn
                    ? "transform rotate-[120deg] duration-200"
                    : "transform rotate-[-120deg] duration-200 ease-in"
                }
              />
              <p>{lang.text("refresh")}</p>
            </Button>
          </div>
        )}
        {renderLoading()}
        <AttendanceDashboard
          stats={currentStats}
          changes={attendanceChanges}
          isLoading={biodataNew.isLoading}
          dataNoAccess={missingStudents}
        />
      </div>
    </>
  );
};