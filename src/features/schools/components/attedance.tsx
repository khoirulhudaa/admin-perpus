import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  Input,
  lang,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/core/libs";
import React, { useState, useEffect } from "react";
import { FaEye, FaPhone, FaSpinner } from "react-icons/fa";
import AttendanceCard from "./attedance-card";

interface AttendanceStats {
  totalHadir: number;
  totalAlpa: number;
  totalSakit: number;
  totalDispensasi: number;
}

interface AttendanceChange {
  percentage: string;
  trend: "up" | "down" | "neutral";
}

interface AttendanceDashboardProps {
  stats: AttendanceStats;
  changes: {
    hadir: AttendanceChange;
    alpa: AttendanceChange;
    sakit: AttendanceChange;
    dispensasi: AttendanceChange;
  };
  isLoading: boolean;
  dataNoAccess?: { nis: string; name: string; kelas: string; email: string; image: string | null; noTlp: number; noTlpOrtu: number }[];
}

const formatWhatsAppNumber = (phone: number | undefined): string | null => {
  if (!phone) return null;
  const cleaned = phone.toString().replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    return `+62${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  return `+62${cleaned}`;
};

export const AttendanceDashboard: React.FC<AttendanceDashboardProps> = ({
  stats,
  changes,
  isLoading,
  dataNoAccess = [],
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isSheetOpen) {
      setSearchQuery("");
    }
  }, [isSheetOpen]);

  const sortedDataNoAccess = [...dataNoAccess].sort((a, b) => {
    const hasImageA = a.image && a.image.trim() ? 1 : 0;
    const hasImageB = b.image && b.image.trim() ? 1 : 0;
    return hasImageB - hasImageA;
  });

  const filteredDataNoAccess = sortedDataNoAccess.filter((student) =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('stats', stats)
  console.log('changes', changes)
  console.log('filteredDataNoAccess', filteredDataNoAccess)

  return (
    <div className="flex md:flex-row flex-col gap-4 w-full justify-between">
      <AttendanceCard
        isLoading={isLoading}
        label={lang.text("presence")}
        value={stats.totalHadir}
        percentage={changes.hadir.percentage}
        trend={changes.hadir.trend}
        bgColor={changes.hadir.trend === "neutral" ? "#FFC107" : "#0f4d3f"}
        textColor={changes.hadir.trend === "neutral" ? "#000000" : "#3ee07a"}
      />
      <AttendanceCard
        isLoading={isLoading}
        label={lang.text("absentee")}
        value={stats?.totalAlpa}
        percentage={changes.alpa.percentage}
        trend={changes.alpa.trend}
        bgColor={changes.alpa.trend === "neutral" ? "#FFC107" : "#6f1e2a"}
        textColor={changes.alpa.trend === "neutral" ? "#000000" : "#e04a6a"}
      />
      <AttendanceCard
        isLoading={isLoading}
        label={lang.text("sickness")}
        value={stats.totalSakit}
        percentage={changes.sakit.percentage}
        trend={changes.sakit.trend}
        bgColor={changes.sakit.trend === "neutral" ? "#FFC107" : "#0f4d3f"}
        textColor={changes.sakit.trend === "neutral" ? "#000000" : "#3ee07a"}
      />
      <AttendanceCard
        isLoading={isLoading}
        label={lang.text("dispensation")}
        value={stats.totalDispensasi}
        percentage={changes.dispensasi.percentage}
        trend={changes.dispensasi.trend}
        bgColor={changes.dispensasi.trend === "neutral" ? "#FFC107" : "#0f4d3f"}
        textColor={changes.dispensasi.trend === "neutral" ? "#000000" : "#3ee07a"}
      />
      <Card className="w-full bg-theme-color-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {lang.text("noReport")} ({lang.text("today")})
            </span>
            <span>😭</span>
          </div>
          <FaEye
            className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors active:scale-[0.98]"
            onClick={() => setIsSheetOpen(true)}
            aria-label="Lihat daftar siswa yang tidak hadir"
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-normal text-[#4BC0C0] text-foreground">
            {isLoading ? (
              <FaSpinner className="animate-spin duration-1500 opacity-30" />
            ) : (
              dataNoAccess.length
            )}
          </div>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-[100vw] md:w-[80vw] pr-4 pb-12 pt-12 md:max-w-[800px] md:min-w-[40vw] max-h-[100vh] overflow-y-auto text-white"
        >
          <SheetHeader>
            <SheetTitle>
              {lang.text("student")} - {lang.text("noReport")} {lang.text("today")}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Input
              placeholder={lang.text("search") || "Cari berdasarkan nama"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-6 bg-slate-800 text-white border-slate-600 focus:border-slate-400"
              aria-label="Cari siswa berdasarkan nama"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDataNoAccess.length > 0 ? (
                filteredDataNoAccess.map((student, index) => (
                  <Card
                    key={`no-access-${index}`}
                    className="border border-slate-600 h-[400px] text-white rounded-lg overflow-hidden"
                    aria-label={`Siswa ${student.name} (NIS: ${student.nis}, Kelas: ${student.kelas}) tidak hadir`}
                  >
                    <CardHeader className="p-0 h-[60%]">
                    <img
                      src={
                        student?.image && student.image.includes('/uploads') 
                          ? 'https://dev.kiraproject.id' + student.image 
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || "Siswa")}&background=fff&color=000`
                      }
                      alt={`Avatar ${student?.name || "Siswa"}`}
                      className="w-full h-full object-cover"
                    />
                    </CardHeader>
                    <CardContent className="p-4 pt-6 h-[40%] bg-theme-color-primary/5">
                      <div className="flex flex-col gap-2">
                        <p
                          className="text-white font-semibold truncate"
                          title={student.name}
                        >
                          {student.name || "-"}
                        </p>
                        <div className="w-full flex gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-slate-700 text-slate-200 px-2 py-1"
                            aria-label={`NIS siswa: ${student.nis || "-"}`}
                          >
                            NIS: {student.nis || "-"}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-slate-700 text-slate-200 px-2 py-1"
                            aria-label={`Kelas siswa: ${student.kelas || "-"}`}
                          >
                            Kelas: {student.kelas || "-"}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 border-t border-t-white/20 my-2 pt-3">
                          {student.noTlp ? (
                            <a
                              href={`https://wa.me/${formatWhatsAppNumber(student.noTlp)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-400 hover:underline flex items-center"
                              aria-label={`Hubungi ${student.name} via WhatsApp`}
                            >
                              <FaPhone />: {student.noTlp}
                            </a>
                          ) : (
                            <p className="flex">
                              <FaPhone />: -
                            </p>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-slate-400 col-span-2">
                  {searchQuery
                    ? "Tidak ada siswa yang cocok dengan pencarian."
                    : "Tidak ada siswa yang tidak hadir hari ini."}
                </p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};