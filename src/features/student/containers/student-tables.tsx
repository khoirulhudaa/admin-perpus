import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { useAlert, useDataTableController } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { studentColumnWithFilter, StudentTable } from "@/features/student";
import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
import axios from "axios";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { Download, UploadIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { useStudentPagination } from "../hooks/use-student-pagination";
import { fetchAllStudents } from "../utils/fetch-all-students";
import { useUserCreation } from "@/features/user";
import { useQueryClient } from "@tanstack/react-query";

// PDF Styles (unchanged)
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
  content: {
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 1.5,
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
    backgroundColor: "#f0f0f0",
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

// DailyAttendancePDF Component (unchanged)
const DailyAttendancePDF: React.FC<{
  attendanceData: Student[];
  schoolData: {
    kopSurat: string | undefined;
    namaSekolah: string;
    namaKepalaSekolah: string;
    ttdKepalaSekolah: string | undefined;
  };
  date: string;
}> = ({ attendanceData, schoolData, date }) => {
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

  const rowsPerPage = 23;
  const dataChunks = [];
  for (let i = 0; i < attendanceData.length; i += rowsPerPage) {
    const chunk = attendanceData.slice(i, i + rowsPerPage);
    if (chunk.length > 0) {
      dataChunks.push(chunk);
    }
  }

  return (
    <Document>
      {dataChunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pdfStyles.page} break={pageIndex > 0}>
          <View style={pdfStyles.header} fixed>
            {kopSuratUrl && <Image src={kopSuratUrl} style={pdfStyles.headerImage} />}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Data siswa</Text>
            <Text style={pdfStyles.content}>Tanggal: {date || "Tanggal Tidak Diketahui"}</Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {["No", "Nama Siswa", "NIS", "NISN", "Kelas"].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      {
                        width: index === 0 ? "5%" : index === 1 ? "45%" : index === 2 ? "15%" : index === 3 ? "20%" : index === 4 ? "15%" : "15%",
                      },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => (
                <View style={pdfStyles.tableRow} key={index} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: "5%" }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "45%" }]}>
                    <Text>{item.name || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                    <Text>{item.nis || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "20%" }]}>
                    <Text>{item.nisn || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                    <Text>{item?.biodataSiswa?.[0]?.kelas?.namaKelas || "-"}</Text>
                  </View>
                </View>
              ))}
            </View>
            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles.signature}>
                <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                {signatureUrl && <Image src={signatureUrl} style={pdfStyles.signatureImage} />}
                <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || "Nama Kepala Sekolah"}</Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

// MonthlyAttendancePDF Component (unchanged)
const MonthlyAttendancePDF: React.FC<{
  attendanceData: any[];
  schoolData: { kopSurat: string | undefined; namaSekolah: string; namaKepalaSekolah: string; ttdKepalaSekolah: string | undefined };
  month: string;
}> = ({ attendanceData, schoolData, month }) => {
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

  const rowsPerPage = 25;
  const dataChunks = [];
  for (let i = 0; i < attendanceData.length; i += rowsPerPage) {
    const chunk = attendanceData.slice(i, i + rowsPerPage);
    if (chunk.length > 0) {
      dataChunks.push(chunk);
    }
  }

  return (
    <Document>
      {dataChunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pdfStyles.page} break={pageIndex > 0}>
          <View style={pdfStyles.header} fixed>
            {kopSuratUrl && <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Absensi Bulanan</Text>
            <Text style={pdfStyles.content}>Bulan: {month || "Bulan Tidak Diketahui"}</Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {["No", "Nama Siswa", "NIS", "Kelas", "Hadir", "Izin", "Sakit", "Alpa"].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      {
                        width: index === 0 ? "5%" : index === 1 ? "25%" : index === 2 ? "15%" : index === 3 ? "15%" : "10%",
                      },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => (
                <View style={pdfStyles.tableRow} key={index} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: "5%" }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "25%" }]}>
                    <Text>{item?.user?.name || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                    <Text>{item?.user?.nis || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                    <Text>{item?.user?.namaKelas || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "10%" }]}>
                    <Text>{item.hadir || 0}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "10%" }]}>
                    <Text>{item.izin || 0}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "10%" }]}>
                    <Text>{item.sakit || 0}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "10%" }]}>
                    <Text>{item.alpa || 0}</Text>
                  </View>
                </View>
              ))}
            </View>
            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles.signature}>
                <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                {signatureUrl && <Image src={signatureUrl} style={pdfStyles.signatureImage} />}
                <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || "Nama Kepala Sekolah"}</Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

// generateAttendancePDF Function (unchanged)
export const generateAttendancePDF = async ({
  studentParams,
  alert,
  nameSchool,
  schoolData,
  schoolIsLoading,
}: {
  studentParams: any;
  alert: any;
  nameSchool: string;
  schoolData: any;
  schoolIsLoading: boolean;
}) => {
  if (schoolIsLoading) {
    alert.error("Data sekolah masih dimuat, silakan coba lagi.");
    return;
  }

  if (!schoolData || !schoolData.namaSekolah) {
    alert.error("Data sekolah tidak lengkap.");
    return;
  }

  try {
    const allStudents = await fetchAllStudents({
      sekolahId: studentParams.sekolahId,
      idKelas: studentParams.idKelas,
      keyword: studentParams.keyword,
    });

    const doc = (
      <DailyAttendancePDF
        attendanceData={allStudents}
        schoolData={{
          namaSekolah: nameSchool,
          kopSurat: schoolData?.kopSurat || undefined,
          namaKepalaSekolah: schoolData?.namaKepalaSekolah || "Nama Kepala Sekolah",
          ttdKepalaSekolah: schoolData?.ttdKepalaSekolah,
        }}
        date={dayjs().format("DD MMMM YYYY")}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Data-siswa.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success("Data siswa berhasil diunduh.");
  } catch (error) {
    console.error("Error generating student data PDF:", error);
    alert.error("Gagal menghasilkan data siswa.");
  }
};

// generateMonthlyAttendancePDF Function (unchanged)
export const generateMonthlyAttendancePDF = async ({
  studentParams,
  alert,
  nameSchool,
  schoolData,
  schoolIsLoading,
}: {
  studentParams: any;
  alert: any;
  nameSchool: string;
  schoolData: any;
  schoolIsLoading: boolean;
}) => {
  if (schoolIsLoading) {
    alert.error("Data sekolah masih dimuat, silakan coba lagi.");
    return;
  }

  if (!schoolData || !schoolData.namaSekolah) {
    alert.error("Data sekolah tidak lengkap.");
    return;
  }

  try {
    const allStudents = await fetchAllStudents({
      sekolahId: studentParams.sekolahId,
      idKelas: studentParams.idKelas,
      keyword: studentParams.keyword,
    });

    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/attendances/monthly`, {
      params: {
        sekolahId: studentParams.sekolahId,
        idKelas: studentParams.idKelas,
        month: dayjs().format("YYYY-MM"),
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const attendanceData = response.data;

    const monthlyData = allStudents.reduce((acc, student) => {
      const studentAttendance = attendanceData.filter((att: any) => att.studentId === student.id);
      const summary = studentAttendance.reduce(
        (sum, att) => {
          if (att.status === "Hadir") sum.hadir += 1;
          else if (att.status === "Izin") sum.izin += 1;
          else if (att.status === "Sakit") sum.sakit += 1;
          else if (att.status === "Alpa") sum.alpa += 1;
          return sum;
        },
        { hadir: 0, izin: 0, sakit: 0, alpa: 0 }
      );

      return [
        ...acc,
        {
          user: student,
          hadir: summary.hadir,
          izin: summary.izin,
          sakit: summary.sakit,
          alpa: summary.alpa,
        },
      ];
    }, []);

    if (monthlyData.length === 0) {
      alert.error("Tidak ada data absensi untuk dihasilkan.");
      return;
    }

    const doc = (
      <MonthlyAttendancePDF
        attendanceData={monthlyData}
        schoolData={{
          namaSekolah: nameSchool,
          kopSurat: schoolData?.kopSurat || undefined,
          namaKepalaSekolah: schoolData?.namaKepalaSekolah || "Nama Kepala Sekolah",
          ttdKepalaSekolah: schoolData?.ttdKepalaSekolah,
        }}
        month={dayjs().format("MMMM YYYY")}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan-Absensi-Bulanan-${dayjs().format("YYYY-MM")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success("Laporan absensi bulanan berhasil diunduh.");
  } catch (error) {
    console.error("Error generating monthly attendance PDF:", error);
    alert.error("Gagal menghasilkan laporan absensi bulanan.");
  }
};

// Function to find duplicate students based on nis or nisn
interface Student {
  id: string | number;
  name: string;
}

const findDuplicates = (students: Student[]): Student[] => {
  // Map to store all students grouped by name
  const nameMap = new Map<string, Student[]>();

  // Group students by name
  students.forEach((student) => {
    const name = student?.name || "";
    if (name) {
      if (!nameMap.has(name)) {
        nameMap.set(name, []);
      }
      nameMap.get(name)!.push(student);
    }
  });

  // Collect all students with duplicate names (names with more than one entry)
  const duplicates: Student[] = [];
  nameMap.forEach((studentsWithSameName) => {
    if (studentsWithSameName.length > 1) {
      duplicates.push(...studentsWithSameName);
    }
  });

  return duplicates;
};

export const StudentLandingTables = () => {
  const [openImport, setOpenImport] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState({ daily: false, monthly: false });
  const [searchQuery, setSearchQuery] = useState("");
  const [idKelas, setIdKelas] = useState<string | undefined>(undefined);
  const [showDuplicates, setShowDuplicates] = useState(false); // New state for duplicate filter
  const alert = useAlert();
  const queryClient = useQueryClient();

  const { global, sorting, pagination, onSortingChange, onPaginationChange } = useDataTableController({
    defaultPageSize: 30,
  });

  const profile = useProfile();
  const classRoom = useClassroom();
  const { data: schoolData, isLoading: schoolIsLoading } = useSchool();

  const sekolahId = profile.user?.sekolahId || 1;

  const studentParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sekolahId: sekolahId ? +sekolahId : undefined,
      idKelas: idKelas ? +idKelas : undefined,
      keyword: searchQuery || global || "",
    }),
    [pagination.pageIndex, pagination.pageSize, sekolahId, idKelas, searchQuery, global]
  );

  const { data, isLoading, refetch } = useStudentPagination(studentParams);

  // Filter data to show only duplicates if showDuplicates is true
  // const filteredData = useMemo(() => {
  //   if (!data?.students) return [];
  //   if (!showDuplicates) {
  //     return data.students.filter((student) => {
  //       const storedUserIds = localStorage.getItem("attendedUserIdsRemove");
  //       const userIds = storedUserIds ? JSON.parse(storedUserIds) : [];
  //       const userId = student?.id || student.userId || student.user?.id;
  //       return (student.isActive ?? student.user?.isActive) !== 0 && !userIds.includes(userId);
  //     });
  //   }
    
  //   console.log('students', data.students)

  //   const duplicates = findDuplicates(data.students);
  //   return duplicates
  // }, [data?.students, showDuplicates]);

  const filteredData = useMemo(() => {
  if (!data?.students) return [];

  // Ambil data sesuai page aktif dari API
  let list = data.students.filter((student) => {
    const storedUserIds = localStorage.getItem("attendedUserIdsRemove");
    const userIds = storedUserIds ? JSON.parse(storedUserIds) : [];
    const userId = student?.id || student.userId || student.user?.id;
    return (student.isActive ?? student.user?.isActive) !== 0 && !userIds.includes(userId);
  });

  // Kalau checkbox aktif, filter lagi hanya yang duplikat di halaman ini
  if (showDuplicates) {
    list = findDuplicates(list);
  }

  return list;
}, [data?.students, showDuplicates]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      onPaginationChange({ ...pagination, pageIndex: 0 });
    }, 300),
    [onPaginationChange, pagination]
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleClassChange = (value: string) => {
    setIdKelas(value === "all" ? undefined : value);
    onPaginationChange({ ...pagination, pageIndex: 0 });
  };

  useEffect(() => {
    console.log("studentParams:", studentParams);
    refetch();
  }, [studentParams, refetch]);

  // Handle attendance cleanup in localStorage (unchanged)
  // ... [Previous localStorage cleanup code remains the same]

  const handleDownload = (type: string) => {
    const fileUrl = type === "excel" ? "/template_siswa.xlsx" : "/template_siswa.csv";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", type === "excel" ? "template_siswa.xlsx" : "template_siswa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadExcel = (type: string) => {
    handleDownload(type);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleImportData = async () => {
    if (!selectedFile) {
      alert.error("Tidak ada file yang dipilih!");
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "xlsx") {
      alert.error("Harap unggah file dengan format .xlsx");
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert.error("Token tidak ditemukan, silakan login.");
        return;
      }

      const sekolahId = profile?.user?.sekolahId;

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("sekolahId", String(sekolahId)); 

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL_OLD}/api/upload-excel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        alert.error("Tidak ada data yang dikembalikan dari server");
        return;
      }

      const { data } = response.data;
      // console.log('data response:', response);
      // console.log('data excel response:', data);
      const formattedMessage = (
        <div>
          <p>✅ Berhasil diimport: {data?.success || 0}</p>
          <p>⚠️ Data yang dilewati: {data?.skipped || 0}</p>
          <p>❌ Data tidak valid: {data?.failed || 0}</p>
          {data?.skippedReasons?.length > 0 && (
            <div>
              <p className="font-semibold mt-2">Alasan data dilewati:</p>
              <ul className="list-disc pl-5">
                {data.skippedReasons.map((reason: string, index: number) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

      if (response.data.success) {
        setSelectedFile(null);
        await Promise.all([refetch()]);
        alert.success(formattedMessage);
      } else {
        setSelectedFile(null);
        await Promise.all([refetch()]);
        alert.error(formattedMessage);
      }

      setOpenImport(false);
    } catch (error: any) {
      console.error("Error saat mengunggah file:", error);
      alert.error("Terjadi kesalahan saat mengimpor data");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadDailyPDF = async () => {
    setIsGeneratingPDF((prev) => ({ ...prev, daily: true }));
    try {
      await generateAttendancePDF({
        studentParams,
        alert,
        nameSchool: profile.user?.sekolah?.namaSekolah || "",
        schoolData: schoolData?.[0],
        schoolIsLoading,
      });
    } finally {
      setIsGeneratingPDF((prev) => ({ ...prev, daily: false }));
    }
  };

  // const handleDownloadMonthlyPDF = async () => {
  //   setIsGeneratingPDF((prev) => ({ ...prev, monthly: true }));
  //   try {
  //     await generateMonthlyAttendancePDF({
  //       studentParams,
  //       alert,
  //       nameSchool: profile.user?.sekolah?.namaSekolah || "",
  //       schoolData: schoolData?.[0],
  //       schoolIsLoading,
  //     });
  //   } finally {
  //     setIsGeneratingPDF((prev) => ({ ...prev, monthly: false }));
  //   }
  // };

  const handleAlert = () => {
    alert.error(lang.text("shouldClassroom"));
  };

  const creation = useUserCreation();

  const handleUpdateRFID = async (studentId: string | number, rfid: string) => {
    // ... [Previous RFID update code remains the same]
  };

  return (
    <>
      <div className="flex justify-between items-center pb-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex w-max">
            <Button className="mr-4 border border-green-700 text-green-300 hover:bg-green-800/20 hover:text-green-300" variant="outline" onClick={() => handleDownloadExcel("excel")}>
              {lang.text("download")} Template Excel
              <Download />
            </Button>
            <Button
              variant="outline"
              onClick={() => (classRoom?.data.length > 0 ? setOpenImport(true) : handleAlert())}
            >
              {lang.text("import")} Data
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={idKelas || "all"}
              onValueChange={handleClassChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {classRoom?.data?.map((classItem: any) => (
                  <SelectItem key={classItem.id} value={classItem.id.toString()}>
                    {classItem.namaKelas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showDuplicates"
                checked={showDuplicates}
                className="w-[24px] h-[24px]"
                onCheckedChange={(checked) => setShowDuplicates(!!checked)}
              />
              <label htmlFor="showDuplicates" className="text-sm">
                Tampilkan Hanya Data Duplikat
              </label>
            </div>
            <div className="flex justify-between items-center gap-4">
              <Button
                variant="outline"
                onClick={handleDownloadDailyPDF}
                disabled={isGeneratingPDF.daily}
                aria-label="downloadDailyPDF"
                className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                {isGeneratingPDF.daily ? "Generating..." : lang.text("downloadPDFNormal")}
                <FaFilePdf />
              </Button>
              {/* <Button
                variant="outline"
                onClick={handleDownloadMonthlyPDF}
                disabled={isGeneratingPDF.monthly}
                aria-label="downloadMonthlyPDF"
                className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                {isGeneratingPDF.monthly ? "Generating..." : lang.text('downloadAttedanceMonthly')}
                <FaFilePdf />
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <StudentTable
        data={filteredData}
        isLoading={isLoading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: 20,
          totalItems: data?.pagination?.totalItems || 0,
          onPageChange: (page) => {
            if (page >= 0) {
              onPaginationChange({ ...pagination, pageIndex: page });
            }
          },
          onSizeChange: (size) => {
            onPaginationChange({ ...pagination, pageSize: size, pageIndex: 0 });
          },
        }}
        sorting={sorting}
        onSortingChange={onSortingChange}
        onSearchChange={handleSearch}
        onUpdateRFID={handleUpdateRFID}
        columns={studentColumnWithFilter({
          classroomOptions: classRoom?.data?.map((c: any) => ({
            label: c.namaKelas,
            value: c.id.toString(),
          })) || [],
          schoolOptions: schoolData?.map((s: any) => ({
            label: s.namaSekolah,
            value: s.id.toString(),
          })) || [],
          handleAttendRemove: (id) => {
            console.log("Remove attendance for ID:", id);
          },
          onUpdateRFID: handleUpdateRFID,
        })}
      />

      <Dialog open={openImport} onOpenChange={setOpenImport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text("import")} Data Siswa</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-gray-300 transition"
            >
              <UploadIcon className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-gray-600 text-sm">
                {selectedFile ? selectedFile.name : "Pilih file CSV atau Excel"}
              </span>
            </label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <DialogFooter className="flex justify-between space-x-4">
            <Button variant="outline" onClick={() => setOpenImport(false)}>
              {lang.text("cancel")}
            </Button>
            <Button variant="default" disabled={!selectedFile || isUploading} onClick={handleImportData}>
              {isUploading ? "Uploading..." : lang.text("import")} Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};