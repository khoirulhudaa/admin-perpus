import { lang } from "@/core/libs";
import { useProfile } from "@/features/profile";
import { useSchoolDetail } from "@/features/schools";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { StatCard } from "../components/stat-card";
import { useLibrary, useLibraryMembers } from "../hooks";

export const LibraryOverview = ({
  baseUrl,
  formattedDate,
  tahun, // Add tahun prop
}: {
  baseUrl: string;
  formattedDate: any;
  tahun: string;
}) => {
  const [datas, setDatas] = useState<any>({});
  const profile = useProfile();
  const sekolahId = profile?.user?.sekolahId;
  const school = useSchoolDetail({ id: sekolahId || 1 });
  const { data: libraries, isLoading: isLoadingLibrary } = useLibrary({
    sekolahId,
    tanggal: formattedDate,
    tahun, // Pass tahun to useLibrary
  });

  const server = school?.data?.serverPerpustakaan;
  const {
    data: totalMembers,
    isLoading: isLoadingMembers,
    isError: membersError,
  } = useLibraryMembers({ server, sekolahId });

  useEffect(() => {
    if (libraries?.data) {
      setDatas(libraries.data);
    } else {
      setDatas({});
    }
  }, [libraries?.data, isLoadingLibrary]);

  const totalVisitors = Object?.values(datas).reduce(
    (total: number, records: any[]) => {
      return total + records.filter((r) => r.status === "masuk").length;
    },
    0
  );

  const totalLeave = Object?.values(datas).reduce(
    (total: number, records: any[]) => {
      return total + records.filter((r) => r.status === "keluar").length;
    },
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title={lang.text("amountOfVisitors") || "Total Visitors"}
        value={
          isLoadingLibrary ? (
            <FaSpinner className="animate-spin w-5 mt-2" />
          ) : (
            totalVisitors
          )
        }
        icon="👀"
      />
      <StatCard
        title={lang.text("amountOfReturn") || "Total Exits"}
        value={
          isLoadingLibrary ? (
            <FaSpinner className="animate-spin w-5 mt-2" />
          ) : (
            totalLeave
          )
        }
        icon="👀"
        color="#A388E8"
      />
      <StatCard
        title={lang.text("totalMembers") || "Total Members"}
        value={
          isLoadingMembers ? (
            <FaSpinner className="animate-spin w-5 mt-2" />
          ) : membersError ? (
            "0"
          ) : (
            totalMembers?.toString() ?? "0"
          )
        }
        icon="📈"
        type="members"
        color="#10B981"
      />
    </div>
  );
};