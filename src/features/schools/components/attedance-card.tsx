import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  lang,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/libs";
import { useProfile } from "@/features/profile";
import { useBiodataNew } from "@/features/user/hooks/use-biodata-new";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { CrownIcon, TimerIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaEye,
  FaMinus,
  FaSpinner,
} from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

dayjs.extend(utc);
dayjs.extend(timezone);

interface AttendanceRecord {
  name: string;
  nis: string;
  namaKelas: string;
  noTlp?: string | null;
  nisn: string;
  biodataSiswaId: number;
  jamMasuk?: string;
}

interface AttendanceCardProps {
  label?: string;
  value?: number;
  percentage?: string;
  trend?: "up" | "down" | "neutral";
  bgColor?: string;
  textColor?: string;
  isLoading?: boolean;
  absenHariIni?: AttendanceRecord[];
  alphaHariIni?: AttendanceRecord[];
  sakitHariIni?: AttendanceRecord[];
  dispenHariIni?: AttendanceRecord[];
  palingAwal?: AttendanceRecord;
  palingAkhir?: AttendanceRecord;
  todayCounts?: { hadir: number; alpa: number; sakit: number; dispensasi: number };
  yesterdayCounts?: { hadir: number; alpa: number; sakit: number; dispensasi: number };
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  label,
  value,
  percentage,
  trend,
  bgColor,
  textColor,
  isLoading,
  absenHariIni = [],
  alphaHariIni = [],
  sakitHariIni = [],
  dispenHariIni = [],
  palingAwal,
  palingAkhir,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Map label to tab value
  const getTabValueFromLabel = (label?: string) => {
    switch (label?.toLowerCase()) {
      case lang.text("presence").toLowerCase():
        return "kehadiran";
      case lang.text("absentee").toLowerCase():
        return "alpa";
      case lang.text("sickness").toLowerCase():
        return "sakit";
      case lang.text("dispensation").toLowerCase():
      default:
        return "dispensasi";
    }
  };

  const [activeTab, setActiveTab] = useState(getTabValueFromLabel(label));

  const profile = useProfile();
  const {dataOld: biodatanew} = useBiodataNew();

  console.log('absensi attedance:', biodatanew)

  // Data untuk chart
  const chartData = useMemo(
    () => [
      { name: "Hadir", Hari_Ini: biodatanew?.data?.hari_ini_hadir, Kemarin: biodatanew?.data?.kemarin_hadir },
      { name: "Alpa", Hari_Ini: biodatanew?.data?.hari_ini_alpha, Kemarin: biodatanew?.data?.kemarin_alpha },
      { name: "Sakit", Hari_Ini: biodatanew?.data?.hari_ini_sakit, Kemarin: biodatanew?.data?.kemarin_sakit },
      {
        name: "Dispensasi",
        Hari_Ini: biodatanew?.data?.hari_ini_dispen,
        Kemarin: biodatanew?.data?.kemarin_dispen,
      },
    ],
    [biodatanew?.data]
  );

  // Filter data chart berdasarkan tab aktif
  const getFilteredChartData = () => {
    const statusMap = {
      kehadiran: "Hadir",
      alpa: "Alpa",
      sakit: "Sakit",
      dispensasi: "Dispensasi",
    };
    const statusLabel = statusMap[activeTab];
    return chartData.filter((item) => item.name === statusLabel);
  };

  // Fungsi untuk merender ikon tren
  const renderTrendIcon = () => {
    if (trend === "up") return <FaArrowUp />;
    if (trend === "down") return <FaArrowDown />;
    return <FaMinus />;
  };

  // Memoized filtered students berdasarkan tab aktif
  const filteredStudents = useMemo(() => {
    const studentsByTab = {
      kehadiran: absenHariIni,
      alpa: alphaHariIni,
      sakit: sakitHariIni,
      dispensasi: dispenHariIni,
    };
    return (
      studentsByTab[activeTab as keyof typeof studentsByTab]?.map((student) => ({
        name: student.name || "-",
        kelas: student.namaKelas || "-",
        nis: student.nis || "-",
        createdAt: student.jamMasuk || "-",
      })) || []
    );
  }, [activeTab, absenHariIni, alphaHariIni, sakitHariIni, dispenHariIni]);

  // Handle opening the sheet and setting the active tab
  const handleOpenSheet = () => {
    setActiveTab(getTabValueFromLabel(label));
    setIsSheetOpen(true);
  };

  return (
    <>
      <Card className="w-full bg-theme-color-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {label} ({lang.text("today")})
            </span>
            <span>
              {label === lang.text("presence")
                ? "😊"
                : label === lang.text("absentee")
                ? "😢"
                : label === lang.text("sickness")
                ? "🤒"
                : "🙏"}
            </span>
          </div>
          <FaEye
            className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleOpenSheet}
            aria-label={`Lihat detail ${label}`}
          />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-normal text-[#4BC0C0]">
              {isLoading || value === null || value === undefined ? (
                <FaSpinner className="animate-spin duration-1500 opacity-30" />
              ) : (
                value
              )}
            </div>
            {/* <Badge
              className="flex items-center gap-1 text-xs"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {percentage} {renderTrendIcon()}
            </Badge> */}
          </div>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-[100vw] md:w-[80vw] pr-5 pb-12 pt-12 md:max-w-[800px] md:min-w-[40vw] max-h-[100vh] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Informasi {label}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <FaSpinner className="animate-spin mr-2 text-blue-400" />
                <p className="text-sm text-muted-foreground">
                  {lang.text("loading")}
                </p>
              </div>
            ) : (
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="kehadiran">Hadir</TabsTrigger>
                  <TabsTrigger value="alpa">Alpa</TabsTrigger>
                  <TabsTrigger value="sakit">Sakit</TabsTrigger>
                  <TabsTrigger value="dispensasi">Dispensasi</TabsTrigger>
                </TabsList>

                {/* Chart Perbandingan */}
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={getFilteredChartData()}
                        margin={{ top: 8, right: 0, left: 8, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-muted"
                        />
                        <XAxis dataKey="name" className="text-foreground" />
                        <YAxis className="text-foreground" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "none",
                            color: "hsl(var(--foreground))",
                          }}
                          cursor={{ fill: "hsl(var(--muted))" }}
                        />
                        <Legend />
                        <Bar
                          dataKey="Hari_Ini"
                          fill="#4ade80"
                          name="Hari Ini"
                          barSize={30}
                        />
                        <Bar
                          dataKey="Kemarin"
                          fill="#FFD700"
                          name="Kemarin"
                          barSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Jumlah Siswa Hadir */}
                {activeTab === "kehadiran" && (
                  <Card className="mt-6">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">
                        Jumlah Siswa Hadir
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between gap-4">
                        <Badge
                          variant="outline"
                          className="w-full justify-between py-2 text-foreground"
                        >
                          <span className="text-sm">
                            Hari Ini: {biodatanew?.data?.hari_ini_hadir} siswa
                          </span>
                        </Badge>
                        <Badge
                          variant="outline"
                          className="w-full justify-between py-2 text-foreground"
                        >
                          <span className="text-sm">
                            Kemarin: {biodatanew?.data?.kemarin_hadir} siswa
                          </span>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <TabsContent value="kehadiran">
                  {/* Daftar Siswa Datang Paling Awal */}
                  <Card className="mt-6">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">
                        Siswa Datang Paling Awal
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {biodatanew?.data?.palingAwal ? (
                          <Badge
                            variant="outline"
                            className="flex items-center justify-between w-full py-2 px-3 border border-border text-foreground rounded-md"
                            aria-label={`Siswa ${biodatanew?.data?.palingAwal.name} (${biodatanew?.data?.palingAwal.namaKelas}, NIS: ${biodatanew?.data?.palingAwal.nis}) datang paling awal hari ini pada ${biodatanew?.data?.palingAwal.jamMasuk}`}
                          >
                            <div className="flex items-center gap-2 w-[59%]">
                              <CrownIcon className="w-5 h-5 text-yellow-500" />
                              <p
                                className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                                title={`${biodatanew?.data?.palingAwal.name} (${biodatanew?.data?.palingAwal.namaKelas}, NIS: ${biodatanew?.data?.palingAwal.nis})`}
                              >
                                <span className="mr-2">{biodatanew?.data?.palingAwal.name}</span>
                                (NIS: {biodatanew?.data?.palingAwal.nis})
                              </p>
                            </div>
                            <div className="flex items-center justify-end gap-2 w-[41%]">
                              <span className="min-w-[60px] text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                                {biodatanew?.data?.palingAwal.namaKelas ?? 'Kelas: -'}
                              </span>
                              <span className="min-w-[100px] text-center bg-green-600 text-white px-2 py-1 rounded-sm">
                                {biodatanew?.data?.palingAwal.jamMasuk
                                  ? dayjs(biodatanew?.data?.palingAwal.jamMasuk).format('HH:mm')
                                  : '-'}
                              </span>
                            </div>
                          </Badge>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Tidak ada data siswa yang hadir hari ini.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Daftar Siswa Datang Paling Akhir */}
                  <Card className="mt-6">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">
                        Siswa Datang Paling Akhir
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {biodatanew?.data?.palingAkhir ? (
                          <Badge
                            variant="outline"
                            className="flex items-center justify-between w-full py-2 px-3 border border-border text-foreground rounded-md"
                            aria-label={`Siswa ${biodatanew?.data?.palingAkhir.name} (${biodatanew?.data?.palingAkhir.namaKelas}, NIS: ${biodatanew?.data?.palingAkhir.nis}) datang paling akhir hari ini pada ${biodatanew?.data?.palingAkhir.jamMasuk}`}
                          >
                            <div className="flex items-center gap-2">
                              <TimerIcon className="w-[22.5px] h-[22.5px] text-red-500" />
                              <p
                                className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                                title={`${biodatanew?.data?.palingAkhir.name} (${biodatanew?.data?.palingAkhir.namaKelas}, NIS: ${biodatanew?.data?.palingAkhir.nis})`}
                              >
                                {biodatanew?.data?.palingAkhir.name} (NIS: {biodatanew?.data?.palingAkhir.nis})
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="min-w-[60px] text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                                {biodatanew?.data?.palingAkhir.namaKelas ?? 'Kelas: -'}
                              </span>
                              <span className="min-w-[100px] text-center bg-green-600 text-white px-2 py-1 rounded-sm">
                                {biodatanew?.data?.palingAkhir.jamMasuk
                                  ? dayjs(biodatanew?.data?.palingAkhir.jamMasuk).format('HH:mm')
                                  : '-'}
                              </span>
                            </div>
                          </Badge>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Tidak ada data siswa yang hadir hari ini.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alpa">
                  <Card className="mt-6">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">
                        Siswa Alpa Hari Ini
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {biodatanew?.data?.alphaHariIni.length > 0 ? (
                          biodatanew?.data?.alphaHariIni.map((student, index) => (
                            <Badge
                              key={`alpa-${student.nis}-${index}`}
                              variant="outline"
                              className="flex items-center justify-between w-full py-2 px-3 border border-white/20 text-foreground rounded-md"
                              aria-label={`Siswa ${student.name} (${student.namaKelas}, NIS: ${student.nis}) alpa hari ini`}
                            >
                              <p
                                className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                                title={`${student.name} (${student.namaKelas}, NIS: ${student.nis})`}
                              >
                                {student.name} (NIS: {student.nis})
                              </p>
                              <div className="min-w-[80px] w-max flex items-center justify-center text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                                <p className="w-max flex">
                                  {student.namaKelas || '-'}
                                </p>
                              </div>
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Tidak ada siswa yang alpa hari ini.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sakit">
                  <Card className="mt-6">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">
                        Siswa Sakit Hari Ini
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {biodatanew?.data?.sakitHariIni.length > 0 ? (
                          biodatanew?.data?.sakitHariIni.map((student, index) => (
                            <Badge
                              key={`sakit-${student.nis}-${index}`}
                              variant="outline"
                              className="flex items-center justify-between w-full py-2 px-3 border border-blue-600 text-foreground rounded-md"
                              aria-label={`Siswa ${student.name} (${student.namaKelas}, NIS: ${student.nis}) sakit hari ini`}
                            >
                              <p
                                className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                                title={`${student.name} (${student.namaKelas}, NIS: ${student.nis})`}
                              >
                                {student.name} (NIS: {student.nis})
                              </p>
                              <div className="min-w-[80px] w-max flex items-center justify-center text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                                <p className="w-max flex">
                                  {student.namaKelas || '-'}
                                </p>
                              </div>
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Tidak ada siswa yang sakit hari ini.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="dispensasi">
                  <Card className="mt-6">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">
                        Siswa Dispensasi Hari Ini
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {biodatanew?.data?.dispenHariIni.length > 0 ? (
                          biodatanew?.data?.dispenHariIni.map((student, index) => (
                            <Badge
                              key={`dispensasi-${student.nis}-${index}`}
                              variant="outline"
                              className="flex items-center justify-between w-full py-2 px-3 border border-green-600 text-foreground rounded-md"
                              aria-label={`Siswa ${student.name} (${student.namaKelas}, NIS: ${student.nis}) dispensasi hari ini`}
                            >
                              <p
                                className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                                title={`${student.name} (${student.namaKelas}, NIS: ${student.nis})`}
                              >
                                {student.name} (NIS: {student.nis})
                              </p>
                              <div className="min-w-[80px] w-max flex items-center justify-center text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                                <p className="w-max flex">
                                  {student.namaKelas || '-'}
                                </p>
                              </div>
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Tidak ada siswa yang dispensasi hari ini.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AttendanceCard;