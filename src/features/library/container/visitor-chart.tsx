import { lang, Button, dayjs } from "@/core/libs";
import { useProfile } from "@/features/profile";
import { useSchoolDetail } from "@/features/schools";
import { useAlert } from "@/features/_global";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/libs";
import { Document, Image, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import { FaFilePdf } from "react-icons/fa";
import { getStaticFile } from "@/core/utils";
import { useLibrary } from "@/features/library/hooks";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// PDF styles
const pdfStyles = StyleSheet.create({
  page: {
    fontSize: 12,
    fontFamily: "Times-Roman",
  },
  header: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
  },
  headerImage: {
    width: 595,
    maxHeight: 150,
    objectFit: "contain",
  },
  contentWrapper: {
    paddingLeft: 32,
    paddingRight: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#6D28D9",
    color: "#FFFFFF",
  },
  signature: {
    marginTop: 50,
    alignItems: "flex-end",
  },
  signatureImage: {
    width: 120,
    height: "auto",
    maxHeight: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  signatureText: {
    textAlign: "center",
  },
});

interface VisitorEntry {
  id: number;
  userId: number;
  status: "masuk" | "keluar";
  waktuKunjungan: string;
  waktuKeluar: string | null;
  createdAt: string;
  updatedAt: string;
  durasiKunjungan: number | null;
  user: { id: number; email: string; [key: string]: any };
}

interface LibraryData {
  senin?: VisitorEntry[];
  selasa?: VisitorEntry[];
  rabu?: VisitorEntry[];
  kamis?: VisitorEntry[];
  jumat?: VisitorEntry[];
  sabtu?: VisitorEntry[];
  minggu?: VisitorEntry[];
}

interface SchoolData {
  namaSekolah: string;
  kopSurat: string | undefined;
  namaKepalaSekolah: string;
  ttdKepalaSekolah: string | undefined;
  tahun?: string;
}

// PDF component for visitor report
const VisitorReportPDF: React.FC<{
  visitorData: any[];
  schoolData: SchoolData;
  date: string;
}> = ({ visitorData, schoolData, date }) => {
  const kopSuratUrl = schoolData.kopSurat
    ? schoolData.kopSurat.startsWith("data:image")
      ? schoolData.kopSurat
      : `data:image/png;base64,${schoolData.kopSurat}`
    : undefined;

  const signatureUrl = schoolData.ttdKepalaSekolah
    ? schoolData.ttdKepalaSekolah.startsWith("data:image")
      ? schoolData.ttdKepalaSekolah
      : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
    : undefined;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header} fixed>
          {kopSuratUrl ? (
            <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
          ) : (
            <Text style={{ textAlign: "center", fontSize: 12 }}>Kop Surat Tidak Tersedia</Text>
          )}
        </View>
        <View style={pdfStyles.contentWrapper}>
          <Text style={pdfStyles.title}>Laporan Tren Pengunjung Perpustakaan Tahun {schoolData.tahun || "Tidak Diketahui"}</Text>
          <Text style={pdfStyles.subtitle}>
            Tanggal: {dayjs(date).format("DD MMMM YYYY") || "Tanggal Tidak Diketahui"}
          </Text>
          <Text style={pdfStyles.timestamp}>
            Dibuat: {dayjs().format("DD MMMM YYYY, HH:mm")} WIB
          </Text>
          <View style={pdfStyles.table}>
            <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
              {["Hari", "Masuk", "Keluar", "New Visitors", "Returning Visitors"].map(
                (header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      { width: "20%" },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                )
              )}
            </View>
            {visitorData.map((item: any, index: number) => (
              <View style={pdfStyles.tableRow} key={index} wrap={false}>
                <View style={[pdfStyles.tableCell, { width: "20%" }]}>
                  <Text>{item.hari}</Text>
                </View>
                <View style={[pdfStyles.tableCell, { width: "20%" }]}>
                  <Text>{item.masuk}</Text>
                </View>
                <View style={[pdfStyles.tableCell, { width: "20%" }]}>
                  <Text>{item.keluar}</Text>
                </View>
                <View style={[pdfStyles.tableCell, { width: "20%" }]}>
                  <Text>{item.newVisitors}</Text>
                </View>
                <View style={[pdfStyles.tableCell, { width: "20%" }]}>
                  <Text>{item.returningVisitors}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={pdfStyles.signature}>
            <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
            {signatureUrl && (
              <Image src={signatureUrl} style={pdfStyles.signatureImage} />
            )}
            <Text style={pdfStyles.signatureText}>
              {schoolData.namaKepalaSekolah || "Nama Kepala Sekolah"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const VisitorChart = ({ formattedDate, tahun }: { formattedDate?: string; tahun?: string }) => {
  const [datas, setDatas] = useState<LibraryData>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const profile = useProfile();
  const alert = useAlert();
  const { data: libraries, isLoading } = useLibrary({
    sekolahId: profile?.user?.sekolahId,
    tanggal: formattedDate,
    tahun,
  });
  const school = useSchoolDetail({
    id: profile?.user?.sekolahId,
  });

  // Debug logs
  console.log('VisitorChart useLibrary params:', { sekolahId: profile?.user?.sekolahId, tanggal: formattedDate, tahun });
  console.log('VisitorChart formattedDate:', formattedDate || 'No date selected');
  console.log('VisitorChart tahun:', tahun || 'No year selected');

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Update datas when libraries is available
  useEffect(() => {
    if (libraries && libraries.data) {
      setDatas(libraries.data);
    } else {
      setDatas({});
    }
  }, [libraries, isLoading, formattedDate, tahun]);

  // List of days in desired order
  const days = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
  const dayLabels = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  // Process data for chart
  const chartData = useMemo(() => {
    const masukData = days.map((day) => {
      const dayData = datas[day] || [];
      return dayData.filter((entry: VisitorEntry) => entry.status === "masuk").length;
    });

    const keluarData = days.map((day) => {
      const dayData = datas[day] || [];
      return dayData.filter((entry: VisitorEntry) => entry.status === "keluar").length;
    });

    const newVisitors = days.map((day, index) => {
      const dayData = datas[day] || [];
      const currentUserIds = new Set(dayData.map((entry: VisitorEntry) => entry.userId));
      let previousUserIds = new Set<number>();
      for (let i = 0; i < index; i++) {
        const prevDayData = datas[days[i]] || [];
        prevDayData.forEach((entry: VisitorEntry) => previousUserIds.add(entry.userId));
      }
      return dayData.filter((entry: VisitorEntry) => !previousUserIds.has(entry.userId)).length;
    });

    const returningVisitors = days.map((day, index) => {
      const dayData = datas[day] || [];
      let previousUserIds = new Set<number>();
      for (let i = 0; i < index; i++) {
        const prevDayData = datas[days[i]] || [];
        prevDayData.forEach((entry: VisitorEntry) => previousUserIds.add(entry.userId));
      }
      return dayData.filter((entry: VisitorEntry) => previousUserIds.has(entry.userId)).length;
    });

    return {
      labels: dayLabels,
      datasets: [
        {
          label: "Masuk",
          data: masukData,
          backgroundColor: "#6D28D9",
          borderRadius: 10,
          stack: "Stack 0",
        },
        {
          label: "Keluar",
          data: keluarData,
          backgroundColor: "#D946EF",
          borderRadius: 10,
          stack: "Stack 0",
        },
        {
          label: "New Visitors",
          data: newVisitors,
          backgroundColor: "#7C3AED",
          borderRadius: 10,
          stack: "Stack 0",
        },
        {
          label: "Returning Visitors",
          data: returningVisitors,
          backgroundColor: "#A5B4FC",
          borderRadius: 10,
          stack: "Stack 0",
        },
      ],
    };
  }, [datas]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 4,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 14,
        },
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? "#FFFFFF" : "#000000",
          font: {
            size: 12,
          },
        },
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      },
      y: {
        stacked: true,
        ticks: {
          stepSize: 1,
          color: isDarkMode ? "#FFFFFF" : "#000000",
          beginAtZero: true,
          font: {
            size: 12,
          },
        },
        grid: {
          color: isDarkMode ? "#4B5563" : "#E5E7EB",
        },
      },
    },
    elements: {
      bar: {
        maxBarThickness: 40,
      },
    },
  };

  // Function to download PDF
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      if (isLoading || school?.isLoading) {
        alert.error(lang.text("loadData"));
        return;
      }
      if (!libraries || !libraries.data || !chartData.labels.length) {
        alert.error(lang.text("emptyResult"));
        return;
      }
      if (!school || !school.data) {
        alert.error(lang.text("loadData"));
        return;
      }
      if (!formattedDate) {
        alert.error("Tanggal harus dipilih untuk menghasilkan laporan.");
        return;
      }

      // Prepare visitor data for PDF
      const visitorData = chartData.labels.map((label: string, index: number) => ({
        hari: label,
        masuk: chartData.datasets[0].data[index],
        keluar: chartData.datasets[1].data[index],
        newVisitors: chartData.datasets[2].data[index],
        returningVisitors: chartData.datasets[3].data[index],
      }));

      const doc = (
        <VisitorReportPDF
          visitorData={visitorData}
          schoolData={{
            namaSekolah: school.data.namaSekolah || "Nama Sekolah",
            kopSurat: school.data.kopSurat || undefined,
            namaKepalaSekolah: school.data.namaKepalaSekolah || "Nama Kepala Sekolah",
            ttdKepalaSekolah: school.data.ttdKepalaSekolah,
            tahun,
          }}
          date={formattedDate}
        />
      );

      const pdfInstance = pdf(doc);
      const pdfBlob = await pdfInstance.toBlob();

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Laporan-Pengunjung-${formattedDate ? dayjs(formattedDate, "DD-MM-YYYY").format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert.success(lang.text("successDownloadPDF"));
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert.error('Gagal download');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  console.log('tanggal select:', formattedDate)

  const formatDateToIndonesian = (dateStr) => {
    if (!dateStr || !/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      return "Tanggal Tidak Diketahui";
    }

    const [day, month, year] = dateStr.split("-");
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const monthIndex = parseInt(month) - 1;

    if (monthIndex < 0 || monthIndex > 11 || isNaN(monthIndex)) {
      return "Tanggal Tidak Diketahui";
    }

    return `${day} ${monthNames[monthIndex]} ${year}`;
  };

  return (
    <Card className="h-[560px] bg-white dark:bg-theme-color-primary/5">
      <CardHeader className="pb-6">
        <CardTitle className="text-lg font-semibold text-black dark:text-white">
          {lang.text("visitorTrendGraph")}
        </CardTitle>
        <CardDescription className="text-sm text-black dark:text-white">
          {formattedDate ? `Tanggal: ${formatDateToIndonesian(formattedDate)}` : `Tahun: ${tahun || "Semua Tahun"}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[450px] px-6 py-4 flex flex-col">
        {isLoading || school?.isLoading ? (
          <div className="text-center text-black dark:text-white">Loading...</div>
        ) : !libraries || !libraries.data ? (
          <div className="text-center text-black dark:text-white">No data available</div>
        ) : (
          <>
            <div className="flex-1">
              <Bar data={chartData} options={options} />
            </div>
            <Button
              className="mt-4 py-6 bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
              variant="outline"
              aria-label="download pdf"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF || isLoading || school?.isLoading || !formattedDate}
            >
              {isGeneratingPDF ? "Generating..." : lang.text("download")}
              <FaFilePdf className="ml-2" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};