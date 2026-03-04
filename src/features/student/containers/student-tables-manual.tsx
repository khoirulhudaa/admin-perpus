// import { API_CONFIG, SERVICE_ENDPOINTS } from "@/core/configs";
// import {
//   Button,
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   Input,
//   lang,
// } from "@/core/libs";
// import { useAlert, useDataTableController } from "@/features/_global";
// import { useProfile } from "@/features/profile";
// import { useSchool } from "@/features/schools";
// import { checkAttendance, StudentTableManual, useAttedances } from "@/features/student";
// import { useBiodataNew } from "@/features/user/hooks/use-biodata-new";
// import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
// import axios from "axios";
// import dayjs from "dayjs";
// import { debounce } from "lodash";
// import { UploadIcon } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import { FaFilePdf } from "react-icons/fa";
// import { useStudentPagination } from "../hooks/use-student-pagination";

// // PDF styles (unchanged)
// const pdfStyles = StyleSheet.create({
//   page: {
//     fontSize: 12,
//     fontFamily: "Times-Roman",
//   },
//   header: {
//     position: "relative",
//     top: 0,
//     left: 0,
//     right: 0,
//     marginBottom: 20,
//   },
//   headerImage: {
//     width: 595,
//     maxHeight: 150,
//     objectFit: "contain",
//   },
//   contentWrapper: {
//     paddingLeft: 32,
//     paddingRight: 32,
//     marginTop: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 5,
//     textTransform: "uppercase",
//   },
//   content: {
//     marginBottom: 10,
//     textAlign: "center",
//     lineHeight: 1.5,
//   },
//   table: {
//     display: "flex",
//     flexDirection: "column",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: "#000",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#000",
//   },
//   tableCell: {
//     padding: 5,
//     borderRightWidth: 1,
//     borderRightColor: "#000",
//     textAlign: "center",
//   },
//   tableHeader: {
//     fontWeight: "bold",
//     backgroundColor: "#f0f0f0",
//   },
//   signature: {
//     marginTop: 50,
//     alignItems: "flex-end",
//   },
//   signatureImage: {
//     width: 120,
//     height: "auto",
//     maxHeight: 50,
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   signatureText: {
//     textAlign: "center",
//   },
// });

// // DailyAttendancePDF component (modified to handle missing statusKehadiran)
// const DailyAttendancePDF: React.FC<{
//   attendanceData: {
//     id: number;
//     name: string;
//     nis: string;
//     nisn: string;
//     namaKelas: string | null;
//     statusKehadiran?: string;
//     statusKehadiranHariIni?: string;
//   }[];
//   schoolData: {
//     kopSurat: string;
//     namaSekolah: string;
//     namaKepalaSekolah: string;
//     ttdKepalaSekolah: string | undefined;
//   };
//   date: string;
// }> = ({ attendanceData, schoolData, date }) => {
//   const kopSuratUrl = schoolData.kopSurat
//     ? schoolData.kopSurat.startsWith("data:image")
//       ? schoolData.kopSurat
//       : `data:image/png;base64,${schoolData.kopSurat}`
//     : undefined;

//   const signatureUrl = schoolData.ttdKepalaSekolah
//     ? schoolData.ttdKepalaSekolah.startsWith("data:image")
//       ? schoolData.ttdKepalaSekolah
//       : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
//     : undefined;

//   const rowsPerPage = 23;
//   const dataChunks = [];
//   for (let i = 0; i < attendanceData.length; i += rowsPerPage) {
//     const chunk = attendanceData.slice(i, i + rowsPerPage);
//     if (chunk.length > 0) {
//       dataChunks.push(chunk);
//     }
//   }

//   console.log("Data akan dicetak:", attendanceData);

//   return (
//     <Document>
//       {dataChunks.map((chunk, pageIndex) => (
//         <Page key={pageIndex} size="A4" style={pdfStyles.page} break={pageIndex > 0}>
//           <View style={pdfStyles.header} fixed>
//             {kopSuratUrl && <Image src={kopSuratUrl} style={pdfStyles.headerImage} />}
//           </View>
//           <View style={pdfStyles.contentWrapper}>
//             <Text style={pdfStyles.title}>Laporan Absensi Harian</Text>
//             <Text style={pdfStyles.content}>Tanggal: {date || "Tanggal Tidak Diketahui"}</Text>
//             <View style={pdfStyles.table}>
//               <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
//                 {["No", "Nama Siswa", "NIS", "NISN", "Kelas", "Status"].map((header, index) => (
//                   <View
//                     key={index}
//                     style={[
//                       pdfStyles.tableCell,
//                       pdfStyles.tableHeader,
//                       {
//                         width: index === 0 ? "7%" : index === 1 ? "33%" : index === 2 ? "15%" : index === 3 ? "15%" : index === 4 ? "18%" : "12%",
//                       },
//                     ]}
//                   >
//                     <Text>{header}</Text>
//                   </View>
//                 ))}
//               </View>
//               {chunk.map((item, index) => {
//                 const status = item?.statusKehadiran || item?.statusKehadiranHariIni || "-";
//                 return (
//                   <View
//                     style={[
//                       pdfStyles.tableRow,
//                       status === 'hadir' && {
//                         backgroundColor: '#22c55e', 
//                         color: '#ffffff',
//                       },
//                     ]}
//                     key={index}
//                     wrap={false}
//                   >
//                     <View style={[pdfStyles.tableCell, { width: "7%" }]}>
//                       <Text>{pageIndex * rowsPerPage + index + 1}</Text>
//                     </View>
//                     <View style={[pdfStyles.tableCell, { width: "33%" }]}>
//                       <Text>{item.name || "-"}</Text>
//                     </View>
//                     <View style={[pdfStyles.tableCell, { width: "15%" }]}>
//                       <Text>{item.nis || "-"}</Text>
//                     </View>
//                     <View style={[pdfStyles.tableCell, { width: "15%" }]}>
//                       <Text>{item.nisn || "-"}</Text>
//                     </View>
//                     <View style={[pdfStyles.tableCell, { width: "18%" }]}>
//                       <Text>{item.namaKelas || item?.biodataSiswa?.[0]?.kelas?.namaKelas || "-"}</Text>
//                     </View>
//                     <View style={[pdfStyles.tableCell, { width: "12%" }]}>
//                       <Text style={{ textTransform: 'uppercase' }}>{status}</Text>
//                     </View>
//                   </View>
//                 );
//               })}
//            </View>
//             {pageIndex === dataChunks.length - 1 && (
//               <View style={pdfStyles.signature}>
//                 <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
//                 {signatureUrl && (
//                   <Image src={signatureUrl} style={pdfStyles.signatureImage} />
//                 )}
//                 <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah'}</Text>
//               </View>
//             )}
//           </View>
//         </Page>
//       ))}
//     </Document>
//   );
// };

// // Function to fetch all pages of student data
// const fetchAllPages = async (endpoint: string, params: any, token: string) => {
//   let allData: any[] = [];
//   let currentPage = 1;
//   let totalPages = 1;

//   while (currentPage <= totalPages) {
//     const response = await axios.get(endpoint, {
//       params: { ...params, page: currentPage, size: 50 }, // Use pageSize 50 to match default
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.data?.data) {
//       allData = [...allData, ...response.data.data];
//       totalPages = response.data.pagination?.totalPages || 1;
//       currentPage++;
//     } else {
//       break;
//     }
//   }

//   return allData;
// };

// // Modified generateAttendancePDF to fetch all student data
// const generateAttendancePDF = async ({
//   studentParams,
//   alert,
//   nameSchool,
//   schoolData,
//   schoolIsLoading,
// }: {
//   studentParams: any;
//   alert: any;
//   nameSchool: string;
//   schoolData: any;
//   schoolIsLoading: boolean;
// }) => {
//   if (schoolIsLoading) {
//     alert.error("Data sekolah masih dimuat, silakan coba lagi.");
//     return;
//   }

//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert.error("Token tidak ditemukan, silakan login.");
//       return;
//     }

//     // Prepare parameters for fetching all data
//     const allDataParams = {
//       sekolahId: studentParams.sekolahId,
//       idKelas: studentParams.idKelas,
//       keyword: studentParams.keyword,
//     };

//     // Fetch all student data
//     const studentData = await fetchAllPages(
//       `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.student.list}`,
//       allDataParams,
//       token
//     );

//     if (!studentData || studentData.length === 0) {
//       alert.error("Tidak ada data siswa untuk dihasilkan.");
//       return;
//     }

//     console.log("All students:", studentData);

//     // Transform student data to match DailyAttendancePDF requirements
//     const allAttendanceData = studentData.map((student: any) => ({
//       id: student.id,
//       name: student.name || student.email.split("@")[0] || "-", // Fallback to email prefix if name is missing
//       nis: student.nis || "-",
//       nisn: student.nisn || "-",
//       namaKelas: student.namaKelas || student?.biodataSiswa?.[0]?.kelas?.namaKelas || "-",
//       statusKehadiran: student.statusKehadiran || student?.statusKehadiranHariIni || "-", // Assume statusKehadiran is in student data or default to "-"
//     }));

//     console.log("Processed attendance data:", allAttendanceData);

//     const doc = (
//       <DailyAttendancePDF
//         attendanceData={allAttendanceData}
//         schoolData={{
//           namaSekolah: nameSchool,
//           kopSurat: schoolData?.[0]?.kopSurat || "",
//           namaKepalaSekolah: schoolData?.[0]?.namaKepalaSekolah || "Nama Kepala Sekolah",
//           ttdKepalaSekolah: schoolData?.[0]?.ttdKepalaSekolah,
//         }}
//         date={dayjs().format("DD MMMM YYYY")}
//       />
//     );

//     const pdfInstance = pdf(doc);
//     const pdfBlob = await pdfInstance.toBlob();

//     const url = window.URL.createObjectURL(pdfBlob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `Laporan-Absensi-Harian-${dayjs().format("YYYY-MM-DD")}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);

//     alert.success("Laporan absensi harian berhasil diunduh.");
//   } catch (error) {
//     console.error("Error generating daily attendance PDF:", error);
//     alert.error("Gagal menghasilkan laporan absensi harian.");
//   }
// };

// export const StudentLandingTablesManual = () => {
//   const [openImport, setOpenImport] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
//   const [attendanceResult, setAttendanceResult] = useState<any[]>([]);
//   const [profileSchoolId, setProfileSchoolId] = useState<number | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const alert = useAlert();

//   const {
//     global,
//     sorting,
//     filter,
//     pagination,
//     onSortingChange,
//     onPaginationChange,
//   } = useDataTableController({ defaultPageSize: 50 });

//   const profile = useProfile();
//   const { dataOld: jumlahMasuk } = useBiodataNew();
//   const sekolahId = filter.find((f) => f.id === "sekolahId")?.value || profile.user?.sekolahId || 1;
//   const { data: schoolData, isLoading: schoolIsLoading } = useSchool();

//   const debouncedSearch = useMemo(
//     () =>
//       debounce((value: string) => {
//         setSearchQuery(value);
//         onPaginationChange({ ...pagination, pageIndex: 0 });
//       }, 300),
//     [onPaginationChange, pagination]
//   );

//   const handleSearch = (value: string) => {
//     setSearchQuery(value);
//     debouncedSearch(value);
//   };

//   useEffect(() => {
//     setProfileSchoolId(profile.user?.sekolahId || null);
//   }, [profile.user]);

//   useEffect(() => {
//     const currentDate = new Date().toISOString().split("T")[0];
//     const storedDate = localStorage.getItem("attendanceDate");
//     const storedUserIds = localStorage.getItem("attendedUserIds");
//     let userIds = storedUserIds ? JSON.parse(storedUserIds) : [];

//     if (storedDate !== currentDate) {
//       userIds = [];
//       localStorage.setItem("attendanceDate", currentDate);
//       localStorage.setItem("attendedUserIds", JSON.stringify(userIds));
//     }
//   }, []);

//   const attedances = profileSchoolId !== null ? useAttedances({ id: profileSchoolId }) : useAttedances();
//   const idKelas = filter.find((f) => f.id === "idKelas")?.value;
//   console.log('attedance check:', attedances)
//   const studentParams = useMemo(
//     () => ({
//       page: pagination.pageIndex + 1,
//       size: pagination.pageSize,
//       sekolahId: sekolahId ? +sekolahId : undefined,
//       idKelas: idKelas ? +idKelas : undefined,
//       keyword: searchQuery || global || "",
//     }),
//     [pagination.pageIndex, pagination.pageSize, sekolahId, idKelas, searchQuery, global]
//   );

//   const { data, isLoading, error, refetch } = useStudentPagination(studentParams);

//   useEffect(() => {
//     console.log("studentParams:", studentParams);
//     refetch();
//   }, [studentParams, refetch]);

//   useEffect(() => {
//     if (error) {
//       console.error("Error fetching student data:", error);
//       alert.error(`Gagal memuat data siswa: ${error.message}`);
//     }
//   }, [error, alert]);

//   useEffect(() => {
//     if (data?.pagination) {
//       console.log("API currentPage:", data.pagination.currentPage, "Expected page:", studentParams.page);
//       if (data.pagination.currentPage !== studentParams.page) {
//         console.warn(`API returned currentPage ${data.pagination.currentPage} but expected ${studentParams.page}`);
//         console.log("Data received:", data.students);
//       }
//     }
//   }, [data, studentParams.page]);

//   useMemo(() => {
//     if (attedances.isLoading || isLoading || !attedances.data || !data?.students) {
//       return;
//     }
//     const result = checkAttendance(attedances.data, data?.students);
//     setAttendanceResult(result);
//   }, [attedances.isLoading, attedances.data, isLoading, data?.students]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//     setSelectedFile(file);
//   };

//   const importData = async () => {
//     if (selectedFile) {
//       const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
//       if (fileExtension !== "xlsx") {
//         alert.error("Harap unggah file dengan format .xlsx");
//         return;
//       }

//       setIsUploading(true);

//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           alert.error("Token tidak ditemukan, silakan login.");
//           setIsUploading(false);
//           return;
//         }

//         const formData = new FormData();
//         formData.append("file", selectedFile);

//         const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload-excel`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.data) {
//           alert.error("Tidak ada data yang dikembalikan dari server");
//           setIsUploading(false);
//           return;
//         }

//         const { data } = response.data;

//         const formattedMessage = (
//           <div>
//             <p>✅ Berhasil diimport: {data?.success || 0}</p>
//             <p>⚠️ Data yang dilewati: {data?.skipped || 0}</p>
//             <p>❌ Data tidak valid: {data?.invalid || 0}</p>
//           </div>
//         );

//         if (response.data.success) {
//           setSelectedFile(null);
//           await Promise.all([attedances.query.refetch(), refetch()]);
//           alert.success(formattedMessage);
//         } else {
//           setSelectedFile(null);
//           await Promise.all([attedances.query.refetch(), refetch()]);
//           alert.error(formattedMessage);
//         }

//         setOpenImport(false);
//       } catch (error: any) {
//         console.log("Error saat mengunggah file:", error);
//         alert.error("Terjadi kesalahan saat mengimpor data");
//       } finally {
//         setIsUploading(false);
//       }
//     } else {
//       alert.error("Tidak ada file yang dipilih!");
//     }
//   };

//   const handleDownloadPDF = async () => {
//     setIsGeneratingPDF(true);
//     try {
//       await generateAttendancePDF({
//         studentParams,
//         alert,
//         nameSchool: profile.user?.sekolah?.namaSekolah || "",
//         schoolData,
//         schoolIsLoading,
//       });
//     } finally {
//       setIsGeneratingPDF(false);
//     }
//   };


//   return (
//     <>
//       <div className="flex justify-between items-center pb-4">
//         <div className="w-full flex justify-between">
//           <div className="flex items-center gap-4">
//             <Button variant="outline" aria-label="presentCount" className="hover:bg-transparent cursor-default">
//               {lang.text("presence")}: {jumlahMasuk?.data?.absenHariIni?.length || 0}
//             </Button>
//             <Button
//               variant="outline"
//               aria-label="refresh"
//               onClick={() => refetch()}
//               className="cursor-pointer active:scale-[0.98] hover:bg-white/10"
//             >
//               {lang.text("refresh")}
//             </Button>
//             <Input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => handleSearch(e.target.value)}
//               placeholder={lang.text("searchByNameOrNIS")}
//               className="w-[300px]"
//             />
//             <Button
//               variant="outline"
//               aria-label="downloadPDF"
//               onClick={handleDownloadPDF}
//               className="cursor-pointer active:scale-[0.98] bg-red-600 text-white hover:bg-red-700"
//               disabled={isGeneratingPDF}
//             >
//               {isGeneratingPDF ? "Generating..." : lang.text("downloadPDF")}
//               <FaFilePdf className="ml-2" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       <StudentTableManual
//         data={(data?.students || []).filter((student) => (student.isActive ?? student.user?.isActive) !== 0)}
//         isLoading={isLoading || attedances.isLoading}
//         pagination={{
//           pageIndex: pagination.pageIndex,
//           pageSize: pagination.pageSize,
//           totalItems: data?.pagination?.totalItems,
//           onPageChange: (page) => {
//             console.log("onPageChange called with page:", page);
//             if (page >= 0) {
//               onPaginationChange({ ...pagination, pageIndex: page });
//             }
//           },
//           onSizeChange: (size) => {
//             console.log("onSizeChange called with size:", size);
//             onPaginationChange({ ...pagination, pageSize: size, pageIndex: 0 });
//           },
//         }}
//         sorting={sorting}
//         onSortingChange={onSortingChange}
//         onSearchChange={handleSearch}
//       />

//       <Dialog open={openImport} onOpenChange={setOpenImport}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{lang.text("import")} Data Siswa</DialogTitle>
//           </DialogHeader>
//           <div className="flex flex-col items-center space-y-4">
//             <label
//               htmlFor="file-upload"
//               className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-gray-300 transition"
//             >
//               <UploadIcon className="w-10 h-10 text-gray-400 mb-2" />
//               <span className="text-gray-600 text-sm">
//                 {selectedFile ? selectedFile.name : "Pilih file CSV atau Excel"}
//               </span>
//             </label>
//             <Input
//               id="file-upload"
//               type="file"
//               accept=".csv, .xlsx"
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//           </div>
//           <DialogFooter className="flex justify-between space-x-4">
//             <Button variant="outline" onClick={() => setOpenImport(false)}>
//               {lang.text("cancel")}
//             </Button>
//             <Button variant="default" disabled={!selectedFile || isUploading} onClick={importData}>
//               {isUploading ? "Uploading..." : lang.text("import")} Data
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };
import { API_CONFIG, SERVICE_ENDPOINTS } from "@/core/configs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  lang,
} from "@/core/libs";
import { useAlert, useDataTableController } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { checkAttendance, StudentTableManual, useAttedances } from "@/features/student";
import { useBiodataNew } from "@/features/user/hooks/use-biodata-new";
import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
import axios from "axios";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { UploadIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { useStudentPagination } from "../hooks/use-student-pagination";

// PDF styles (unchanged)
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

// DailyAttendancePDF component (modified to include hadirCount)
const DailyAttendancePDF: React.FC<{
  attendanceData: {
    id: number;
    name: string;
    nis: string;
    nisn: string;
    namaKelas: string | null;
    statusKehadiran?: string;
    statusKehadiranHariIni?: string;
  }[];
  schoolData: {
    kopSurat: string;
    namaSekolah: string;
    namaKepalaSekolah: string;
    ttdKepalaSekolah: string | undefined;
  };
  date: string;
  hadirCount: number; // Added hadirCount prop
}> = ({ attendanceData, schoolData, date, hadirCount }) => {
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

  console.log("Data akan dicetak:", attendanceData);

  return (
    <Document>
      {dataChunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pdfStyles.page} break={pageIndex > 0}>
          <View style={pdfStyles.header} fixed>
            {kopSuratUrl && <Image src={kopSuratUrl} style={pdfStyles.headerImage} />}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Absensi Harian</Text>
            <Text style={pdfStyles.content}>
              Tanggal: {date || "Tanggal Tidak Diketahui"} (Total Siswa: {attendanceData.length}, Hadir: {hadirCount})
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {["No", "Nama Siswa", "NIS", "NISN", "Kelas", "Status"].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      {
                        width: index === 0 ? "7%" : index === 1 ? "33%" : index === 2 ? "15%" : index === 3 ? "15%" : index === 4 ? "18%" : "12%",
                      },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => {
                const status = item?.statusKehadiran || item?.statusKehadiranHariIni || "-";
                return (
                  <View
                    style={[
                      pdfStyles.tableRow,
                      status === 'hadir' && {
                        backgroundColor: '#22c55e', 
                        color: '#ffffff',
                      },
                    ]}
                    key={index}
                    wrap={false}
                  >
                    <View style={[pdfStyles.tableCell, { width: "7%" }]}>
                      <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                    </View>
                    <View style={[pdfStyles.tableCell, { width: "33%" }]}>
                      <Text>{item.name || "-"}</Text>
                    </View>
                    <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                      <Text>{item.nis || "-"}</Text>
                    </View>
                    <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                      <Text>{item.nisn || "-"}</Text>
                    </View>
                    <View style={[pdfStyles.tableCell, { width: "18%" }]}>
                      <Text>{item.namaKelas || item?.biodataSiswa?.[0]?.kelas?.namaKelas || "-"}</Text>
                    </View>
                    <View style={[pdfStyles.tableCell, { width: "12%" }]}>
                      <Text style={{ textTransform: 'uppercase' }}>{status}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles.signature}>
                <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                {signatureUrl && (
                  <Image src={signatureUrl} style={pdfStyles.signatureImage} />
                )}
                <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah'}</Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

// Function to fetch all pages of student data
const fetchAllPages = async (endpoint: string, params: any, token: string) => {
  let allData: any[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const response = await axios.get(endpoint, {
      params: { ...params, page: currentPage, size: 50 }, // Use pageSize 50 to match default
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.data) {
      allData = [...allData, ...response.data.data];
      totalPages = response.data.pagination?.totalPages || 1;
      currentPage++;
    } else {
      break;
    }
  }

  return allData;
};

// Modified generateAttendancePDF to fetch all student data and calculate hadirCount
const generateAttendancePDF = async ({
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

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert.error("Token tidak ditemukan, silakan login.");
      return;
    }

    // Prepare parameters for fetching all data
    const allDataParams = {
      sekolahId: studentParams.sekolahId,
      idKelas: studentParams.idKelas,
      keyword: studentParams.keyword,
    };

    // Fetch all student data
    const studentData = await fetchAllPages(
      `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.student.list}`,
      allDataParams,
      token
    );

    if (!studentData || studentData.length === 0) {
      alert.error("Tidak ada data siswa untuk dihasilkan.");
      return;
    }

    console.log("All students:", studentData);

    // Transform student data to match DailyAttendancePDF requirements
    const allAttendanceData = studentData.map((student: any) => ({
      id: student.id,
      name: student.name || student.email.split("@")[0] || "-", // Fallback to email prefix if name is missing
      nis: student.nis || "-",
      nisn: student.nisn || "-",
      namaKelas: student.namaKelas || student?.biodataSiswa?.[0]?.kelas?.namaKelas || "-",
      statusKehadiran: student.statusKehadiran || student?.statusKehadiranHariIni || "-", // Assume statusKehadiran is in student data or default to "-"
    }));

    // Calculate hadirCount
    const hadirCount = allAttendanceData.filter(
      (item) => (item.statusKehadiran || item.statusKehadiranHariIni) === "hadir"
    ).length;

    console.log("Processed attendance data:", allAttendanceData);

    const doc = (
      <DailyAttendancePDF
        attendanceData={allAttendanceData}
        schoolData={{
          namaSekolah: nameSchool,
          kopSurat: schoolData?.[0]?.kopSurat || "",
          namaKepalaSekolah: schoolData?.[0]?.namaKepalaSekolah || "Nama Kepala Sekolah",
          ttdKepalaSekolah: schoolData?.[0]?.ttdKepalaSekolah,
        }}
        date={dayjs().format("DD MMMM YYYY")}
        hadirCount={hadirCount} // Pass hadirCount
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan-Absensi-Harian-${dayjs().format("YYYY-MM-DD")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success("Laporan absensi harian berhasil diunduh.");
  } catch (error) {
    console.error("Error generating daily attendance PDF:", error);
    alert.error("Gagal menghasilkan laporan absensi harian.");
  }
};

export const StudentLandingTablesManual = () => {
  const [openImport, setOpenImport] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState<any[]>([]);
  const [profileSchoolId, setProfileSchoolId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const alert = useAlert();

  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 50 });

  const profile = useProfile();
  const { dataOld: jumlahMasuk } = useBiodataNew();
  const sekolahId = filter.find((f) => f.id === "sekolahId")?.value || profile.user?.sekolahId || 1;
  const { data: schoolData, isLoading: schoolIsLoading } = useSchool();

  const debouncedSearch = useMemo(
    () =>
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

  useEffect(() => {
    setProfileSchoolId(profile.user?.sekolahId || null);
  }, [profile.user]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    const storedDate = localStorage.getItem("attendanceDate");
    const storedUserIds = localStorage.getItem("attendedUserIds");
    let userIds = storedUserIds ? JSON.parse(storedUserIds) : [];

    if (storedDate !== currentDate) {
      userIds = [];
      localStorage.setItem("attendanceDate", currentDate);
      localStorage.setItem("attendedUserIds", JSON.stringify(userIds));
    }
  }, []);

  const attedances = profileSchoolId !== null ? useAttedances({ id: profileSchoolId }) : useAttedances();
  const idKelas = filter.find((f) => f.id === "idKelas")?.value;
  console.log('attedance check:', attedances)
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

  const { data, isLoading, error, refetch } = useStudentPagination(studentParams);

  useEffect(() => {
    console.log("studentParams:", studentParams);
    refetch();
  }, [studentParams, refetch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching student data:", error);
      alert.error(`Gagal memuat data siswa: ${error.message}`);
    }
  }, [error, alert]);

  useEffect(() => {
    if (data?.pagination) {
      console.log("API currentPage:", data.pagination.currentPage, "Expected page:", studentParams.page);
      if (data.pagination.currentPage !== studentParams.page) {
        console.warn(`API returned currentPage ${data.pagination.currentPage} but expected ${studentParams.page}`);
        console.log("Data received:", data.students);
      }
    }
  }, [data, studentParams.page]);

  useMemo(() => {
    if (attedances.isLoading || isLoading || !attedances.data || !data?.students) {
      return;
    }
    const result = checkAttendance(attedances.data, data?.students);
    setAttendanceResult(result);
  }, [attedances.isLoading, attedances.data, isLoading, data?.students]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const importData = async () => {
    if (selectedFile) {
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
          setIsUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload-excel`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          alert.error("Tidak ada data yang dikembalikan dari server");
          setIsUploading(false);
          return;
        }

        const { data } = response.data;

        const formattedMessage = (
          <div>
            <p>✅ Berhasil diimport: {data?.success || 0}</p>
            <p>⚠️ Data yang dilewati: {data?.skipped || 0}</p>
            <p>❌ Data tidak valid: {data?.invalid || 0}</p>
          </div>
        );

        if (response.data.success) {
          setSelectedFile(null);
          await Promise.all([attedances.query.refetch(), refetch()]);
          alert.success(formattedMessage);
        } else {
          setSelectedFile(null);
          await Promise.all([attedances.query.refetch(), refetch()]);
          alert.error(formattedMessage);
        }

        setOpenImport(false);
      } catch (error: any) {
        console.log("Error saat mengunggah file:", error);
        alert.error("Terjadi kesalahan saat mengimpor data");
      } finally {
        setIsUploading(false);
      }
    } else {
      alert.error("Tidak ada file yang dipilih!");
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateAttendancePDF({
        studentParams,
        alert,
        nameSchool: profile.user?.sekolah?.namaSekolah || "",
        schoolData,
        schoolIsLoading,
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleRefetch = () => {
    refetch()
    alert.success('Data berhasil dimuat ulang')
  }

  console.log('data?.students', data?.students)

  return (
    <>
      <div className="flex justify-between items-center pb-4">
        <div className="w-full flex justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" aria-label="presentCount" className="hover:bg-transparent cursor-default">
              {lang.text("presence")}: {jumlahMasuk?.data?.absenHariIni?.length || 0}
            </Button>
            <Button
              variant="outline"
              aria-label="refresh"
              onClick={() => handleRefetch()}
              className="cursor-pointer active:scale-[0.98] hover:bg-white/10"
            >
              {lang.text("refresh")}
            </Button>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={lang.text("searchByNameOrNIS")}
              className="w-[300px]"
            />
            <Button
              variant="outline"
              aria-label="downloadPDF"
              onClick={handleDownloadPDF}
              className="cursor-pointer active:scale-[0.98] bg-red-600 text-white hover:bg-red-700"
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? "Generating..." : lang.text("downloadPDF")}
              <FaFilePdf className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <StudentTableManual
        data={(data?.students || []).filter((student) => (student.isActive ?? student.user?.isActive) !== 0)}
        isLoading={isLoading || attedances.isLoading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalItems: data?.pagination?.totalItems,
          onPageChange: (page) => {
            console.log("onPageChange called with page:", page);
            if (page >= 0) {
              onPaginationChange({ ...pagination, pageIndex: page });
            }
          },
          onSizeChange: (size) => {
            console.log("onSizeChange called with size:", size);
            onPaginationChange({ ...pagination, pageSize: size, pageIndex: 0 });
          },
        }}
        sorting={sorting}
        onSortingChange={onSortingChange}
        onSearchChange={handleSearch}
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
            <Button variant="default" disabled={!selectedFile || isUploading} onClick={importData}>
              {isUploading ? "Uploading..." : lang.text("import")} Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};