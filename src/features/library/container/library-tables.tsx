// import {
//   Button,
//   Input,
//   lang,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   Badge, // Added Badge import
// } from "@/core/libs";
// import { getStaticFile } from "@/core/utils";
// import { useAlert, useDataTableController } from "@/features/_global";
// import { useProfile } from "@/features/profile";
// import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
// import dayjs from "dayjs";
// import { FaFilePdf } from "react-icons/fa";
// import { useLibrary } from "../hooks";
// import { LibraryTable } from "./table";
// import { useSchoolDetail } from "@/features/schools";
// import { useState } from "react";

// interface VisitorEntry {
//   id: number;
//   userId: number;
//   status: "masuk" | "keluar";
//   waktuKunjungan: string;
//   waktuKeluar: string | null;
//   createdAt: string;
//   updatedAt: string;
//   durasiKunjungan: number | null;
//   user: { id: number; email: string; name?: string; nis?: string; nisn?: string; namaKelas?: string; [key: string]: any };
// }

// // PDF Styles
// const pdfStyles = StyleSheet.create({
//   page: {
//     fontSize: 12,
//     fontFamily: 'Times-Roman',
//   },
//   header: {
//     position: 'relative',
//     top: 0,
//     left: 0,
//     right: 0,
//     marginBottom: 20,
//   },
//   headerImage: {
//     width: 595,
//     maxHeight: 150,
//     objectFit: 'contain',
//   },
//   contentWrapper: {
//     paddingLeft: 32,
//     paddingRight: 32,
//     marginTop: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 5,
//     textTransform: 'uppercase',
//   },
//   content: {
//     marginBottom: 10,
//     textAlign: 'center',
//     lineHeight: 1.5,
//   },
//   table: {
//     display: 'flex',
//     flexDirection: 'column',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: '#000',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#000',
//   },
//   tableCell: {
//     padding: 5,
//     borderRightWidth: 1,
//     borderRightColor: '#000',
//     textAlign: 'center',
//   },
//   tableHeader: {
//     fontWeight: 'bold',
//     backgroundColor: '#f0f0f0',
//   },
//   signature: {
//     marginTop: 50,
//     alignItems: 'flex-end',
//   },
//   signatureImage: {
//     width: 120,
//     height: 'auto',
//     maxHeight: 50,
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   signatureText: {
//     textAlign: 'center',
//   },
// });

// // PDF Component for Library Attendance
// const LibraryAttendancePDF: React.FC<{
//   attendanceData: any[];
//   schoolData: { kopSurat: string | undefined; namaSekolah: string; namaKepalaSekolah: string; ttdKepalaSekolah: string | undefined };
//   date: string;
// }> = ({ attendanceData, schoolData, date }) => {
//   const kopSuratUrl = schoolData.kopSurat
//     ? schoolData.kopSurat.startsWith('data:image')
//       ? schoolData.kopSurat
//       : `data:image/png;base64,${schoolData.kopSurat}`
//     : undefined;

//   const signatureUrl = schoolData.ttdKepalaSekolah
//     ? schoolData.ttdKepalaSekolah.startsWith('data:image')
//       ? schoolData.ttdKepalaSekolah
//       : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
//     : undefined;

//   const rowsPerPage = 25;
//   const dataChunks = [];
//   for (let i = 0; i < attendanceData.length; i += rowsPerPage) {
//     const chunk = attendanceData.slice(i, i + rowsPerPage);
//     if (chunk.length > 0) {
//       dataChunks.push(chunk);
//     }
//   }

//   return (
//     <Document>
//       {dataChunks.map((chunk, pageIndex) => (
//         <Page
//           key={pageIndex}
//           size="A4"
//           style={pdfStyles.page}
//           break={pageIndex > 0}
//         >
//           <View style={pdfStyles.header} fixed>
//             {kopSuratUrl ? (
//               <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
//             ) : (
//               <Text style={{ textAlign: 'center', fontSize: 12 }}>Kop Surat Tidak Tersedia</Text>
//             )}
//           </View>
//           <View style={pdfStyles.contentWrapper}>
//             <Text style={pdfStyles.title}>Laporan Absensi Perpustakaan</Text>
//             <Text style={pdfStyles.content}>
//               Tanggal: {dayjs().format('DD/MM/YYYY') || 'Tanggal Tidak Diketahui'}
//             </Text>
//             <View style={pdfStyles.table}>
//               <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
//                 {['No', 'Nama', 'NIS', 'Status', 'Masuk', 'Keluar', 'Durasi'].map((header, index) => (
//                   <View
//                     key={index}
//                     style={[
//                       pdfStyles.tableCell,
//                       pdfStyles.tableHeader,
//                       {
//                         width: index === 0 ? '5%' : index === 1 ? '25%' : index === 2 ? '20%' : index === 3 ? '15%' : '15%',
//                       },
//                     ]}
//                   >
//                     <Text>{header}</Text>
//                   </View>
//                 ))}
//               </View>
//               {chunk.map((item, index) => (
//                 <View style={pdfStyles.tableRow} key={index} wrap={false}>
//                   <View style={[pdfStyles.tableCell, { width: '5%' }]}>
//                     <Text>{pageIndex * rowsPerPage + index + 1}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '25%' }]}>
//                     <Text>{item?.name || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '20%' }]}>
//                     <Text>{item?.nis || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '15%' }]}>
//                     <Text>{item?.status || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '15%' }]}>
//                     <Text>{item?.waktuMasuk || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '15%' }]}>
//                     <Text>{item?.waktuKeluar || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '15%' }]}>
//                     <Text>{item?.durasiKunjungan ? `${item.durasiKunjungan} menit` : '-'}</Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
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

// // Function to generate PDF
// const generateAttendancePDF = async ({
//   studentParams,
//   attendanceData,
//   alert,
//   nameSchool,
//   schoolData,
//   schoolIsLoading,
// }: {
//   studentParams: { tanggal?: string };
//   attendanceData: VisitorEntry[];
//   alert: { success: (msg: string) => void; error: (msg: string) => void } | undefined;
//   nameSchool: string;
//   schoolData: any;
//   schoolIsLoading: boolean;
// }) => {
//   if (!alert) {
//     console.error('Alert system is not available');
//     return;
//   }

//   if (schoolIsLoading) {
//     alert.error('Data sekolah masih dimuat, silakan coba lagi.');
//     return;
//   }

//   if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
//     alert.error('Tidak ada data absensi untuk dihasilkan.');
//     return;
//   }

//   if (!schoolData || !nameSchool) {
//     alert.error('Data sekolah tidak lengkap.');
//     return;
//   }

//   if (!schoolData.kopSurat) {
//     alert.error('Kop surat tidak tersedia, laporan akan dibuat tanpa kop surat.');
//   }

//   try {
//     const formattedData = attendanceData.map(item => ({
//       name: item.user?.name || '-',
//       nis: item.user?.nis || item.user?.nisn || '-',
//       status: item.status === 'masuk' ? 'Masuk' : 'Keluar',
//       waktuMasuk: item.waktuKunjungan ? dayjs(item.waktuKunjungan).format('HH:mm') : '-',
//       waktuKeluar: item.waktuKeluar ? dayjs(item.waktuKeluar).format('HH:mm') : '-',
//       durasiKunjungan: item.durasiKunjungan || null,
//     }));

//     const doc = (
//       <LibraryAttendancePDF
//         attendanceData={formattedData}
//         schoolData={{
//           namaSekolah: nameSchool,
//           kopSurat: schoolData.kopSurat || undefined,
//           namaKepalaSekolah: schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah',
//           ttdKepalaSekolah: schoolData.ttdKepalaSekolah || undefined,
//         }}
//         date={dayjs(studentParams?.tanggal || new Date()).format('DD MMMM YYYY')}
//       />
//     );

//     const pdfInstance = pdf(doc);
//     const pdfBlob = await pdfInstance.toBlob();

//     const url = window.URL.createObjectURL(pdfBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `Laporan-Absensi-Perpustakaan-${dayjs(studentParams?.tanggal || new Date()).format('YYYY-MM-DD')}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);

//     alert.success('Laporan absensi perpustakaan berhasil diunduh.');
//   } catch (error) {
//     console.error('Error generating attendance PDF:', error);
//     alert.error('Gagal menghasilkan laporan absensi perpustakaan.');
//   }
// };

// export const LibraryLandingTables = ({ formattedDate }: { formattedDate?: string }) => {
//   const {
//     global,
//     sorting,
//     filter,
//     pagination,
//     onSortingChange,
//     onPaginationChange,
//   } = useDataTableController({ defaultPageSize: 50 });

//   const [nisFilter, setNisFilter] = useState("");
//   const [nameFilter, setNameFilter] = useState("");
//   const [dayFilter, setDayFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

//   const profile = useProfile();
//   const alert = useAlert();
//   const { data: schoolData, isLoading: schoolIsLoading } = useSchoolDetail({ id: profile?.user?.sekolahId || 1 });
//   const { data: libraries, isLoading } = useLibrary({
//     sekolahId: profile?.user?.sekolahId,
//     tanggal: formattedDate,
//   });

//   const dayOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

//   const mergedDataInOrder = dayOrder.reduce((acc: VisitorEntry[], day) => {
//     if (libraries?.data?.[day]?.length) {
//       acc.push(...libraries.data[day]);
//     }
//     return acc;
//   }, []);

//   const filteredData = mergedDataInOrder.filter((item) => {
//     const nameMatch = nameFilter
//       ? item?.user?.name?.toLowerCase().includes(nameFilter.toLowerCase())
//       : true;

//     const nisMatch = nisFilter
//       ? (item?.user?.nis?.toLowerCase().includes(nisFilter.toLowerCase()) ||
//         item?.user?.nisn?.toLowerCase().includes(nisFilter.toLowerCase()))
//       : true;

//     const dayMatch = dayFilter === "all" ||
//       libraries?.data?.[dayFilter]?.includes(item);

//     const statusMatch = statusFilter === "all" || item.status === statusFilter;

//     return nameMatch && nisMatch && dayMatch && statusMatch;
//   });

//   // Calculate counts for masuk and keluar
//   const masukCount = filteredData.filter(item => item.status === 'masuk').length;
//   const keluarCount = filteredData.filter(item => item.status === 'keluar').length;

//   const handleDownloadPDF = async () => {
//     try {
//       setIsGeneratingPDF(true);
//       await generateAttendancePDF({
//         studentParams: { tanggal: formattedDate },
//         attendanceData: filteredData,
//         alert,
//         nameSchool: schoolData?.namaSekolah || 'Nama Sekolah',
//         schoolData: schoolData || {},
//         schoolIsLoading,
//       });
//     } catch (error) {
//       console.error('Error in handleDownloadPDF:', error);
//       alert?.error?.('Terjadi kesalahan saat mengunduh laporan.');
//     } finally {
//       setIsGeneratingPDF(false);
//     }
//   };

//   return (
//     <>
//       <div className="flex items-center gap-3 mt-6 mb-3">
//         <Input
//           type="text"
//           value={nameFilter}
//           onChange={(e) => setNameFilter(e.target.value)}
//           placeholder={lang.text("search") || "Filter by name..."}
//           className="w-[300px]"
//         />
//         <Input
//           type="text"
//           value={nisFilter}
//           onChange={(e) => setNisFilter(e.target.value)}
//           placeholder={lang.text("filterNIS") || "Filter by NIS"}
//           className="w-[300px]"
//         />
//         <Select value={dayFilter} onValueChange={setDayFilter}>
//           <SelectTrigger className="w-[190px]">
//             <SelectValue placeholder="Filter Hari" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">{lang.text('allDays')}</SelectItem>
//             {dayOrder.map((day) => (
//               <SelectItem key={day} value={day}>
//                 {lang.text(day)}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[190px]">
//             <SelectValue placeholder="Filter Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">{lang.text('allStatus')}</SelectItem>
//             <SelectItem value="masuk">{lang.text('masuk')}</SelectItem>
//             <SelectItem value="keluar">{lang.text('keluar')}</SelectItem>
//           </SelectContent>
//         </Select>
//         <div className="ml-auto flex items-center gap-2">
//           <Badge variant="outline" className="text-sm py-2 shadow-none">
//             Masuk: {masukCount} 
//           </Badge>
//           <Badge variant="outline" className="text-sm py-2 shadow-none">
//             Keluar: {keluarCount}
//           </Badge>
//           <Button
//             className="relative bg-red-600 text-white hover:bg-red-700"
//             variant="outline"
//             aria-label="download pdf"
//             disabled={isGeneratingPDF || isLoading || schoolIsLoading}
//             onClick={handleDownloadPDF}
//           >
//             {isGeneratingPDF ? "Generating..." : lang.text("downloadAttedance")}
//             <FaFilePdf className="ml-2" />
//           </Button>
//         </div>
//       </div>

//       <LibraryTable
//         data={filteredData}
//         isLoading={isLoading}
//         pagination={{
//           pageIndex: pagination.pageIndex,
//           pageSize: pagination.pageSize,
//           totalItems: filteredData.length,
//           onPageChange: (page) => onPaginationChange({ ...pagination, pageIndex: page }),
//           onSizeChange: (size) => onPaginationChange({ ...pagination, pageSize: size, pageIndex: 0 }),
//         }}
//         sorting={sorting}
//         onSortingChange={onSortingChange}
//       />
//     </>
//   );
// };



import {
  Button,
  Input,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { useAlert, useDataTableController } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from "dayjs";
import { FaFilePdf } from "react-icons/fa";
import { useLibrary } from "../hooks";
import { LibraryTable } from "./table";
import { useSchoolDetail } from "@/features/schools";
import { useState } from "react";

interface VisitorEntry {
  id: number;
  userId: number;
  status: "masuk" | "keluar";
  waktuKunjungan: string;
  waktuKeluar: string | null;
  createdAt: string;
  updatedAt: string;
  durasiKunjungan: number | null;
  user: { id: number; email: string; name?: string; nis?: string; nisn?: string; namaKelas?: string; [key: string]: any };
}

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
  },
  header: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
  },
  headerImage: {
    width: 595,
    maxHeight: 150,
    objectFit: 'contain',
  },
  contentWrapper: {
    paddingLeft: 32,
    paddingRight: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  signature: {
    marginTop: 50,
    alignItems: 'flex-end',
  },
  signatureImage: {
    width: 120,
    height: 'auto',
    maxHeight: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  signatureText: {
    textAlign: 'center',
  },
});

// PDF Component for Library Attendance
const LibraryAttendancePDF: React.FC<{
  attendanceData: any[];
  schoolData: { kopSurat: string | undefined; namaSekolah: string; namaKepalaSekolah: string; ttdKepalaSekolah: string | undefined };
  date: string;
}> = ({ attendanceData, schoolData, date }) => {
  const kopSuratUrl = schoolData.kopSurat
    ? schoolData.kopSurat.startsWith('data:image')
      ? schoolData.kopSurat
      : `data:image/png;base64,${schoolData.kopSurat}`
    : undefined;

  const signatureUrl = schoolData.ttdKepalaSekolah
    ? schoolData.ttdKepalaSekolah.startsWith('data:image')
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
        <Page
          key={pageIndex}
          size="A4"
          style={pdfStyles.page}
          break={pageIndex > 0}
        >
          <View style={pdfStyles.header} fixed>
            {kopSuratUrl ? (
              <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
            ) : (
              <Text style={{ textAlign: 'center', fontSize: 12 }}>Kop Surat Tidak Tersedia</Text>
            )}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Absensi Perpustakaan</Text>
            <Text style={pdfStyles.content}>
              Tanggal: {dayjs(date).format('DD/MM/YYYY') || 'Tanggal Tidak Diketahui'}
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {['No', 'Nama', 'NIS', 'Status', 'Masuk', 'Keluar', 'Durasi'].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      {
                        width: index === 0 ? '5%' : index === 1 ? '25%' : index === 2 ? '20%' : index === 3 ? '15%' : '15%',
                      },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => (
                <View style={pdfStyles.tableRow} key={index} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: '5%' }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '25%' }]}>
                    <Text>{item?.name || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '20%' }]}>
                    <Text>{item?.nis || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item?.status || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item?.waktuMasuk || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item?.waktuKeluar || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item?.durasiKunjungan ? `${item.durasiKunjungan} menit` : '-'}</Text>
                  </View>
                </View>
              ))}
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

// Function to generate PDF
const generateAttendancePDF = async ({
  studentParams,
  attendanceData,
  alert,
  nameSchool,
  schoolData,
  schoolIsLoading,
}: {
  studentParams: { tanggal?: string; tahun?: string }; // Added tahun to studentParams
  attendanceData: VisitorEntry[];
  alert: { success: (msg: string) => void; error: (msg: string) => void } | undefined;
  nameSchool: string;
  schoolData: any;
  schoolIsLoading: boolean;
}) => {
  if (!alert) {
    console.error('Alert system is not available');
    return;
  }

  if (schoolIsLoading) {
    alert.error('Data sekolah masih dimuat, silakan coba lagi.');
    return;
  }

  if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
    alert.error('Tidak ada data absensi untuk dihasilkan.');
    return;
  }

  if (!schoolData || !nameSchool) {
    alert.error('Data sekolah tidak lengkap.');
    return;
  }

  if (!schoolData.kopSurat) {
    alert.error('Kop surat tidak tersedia, laporan akan dibuat tanpa kop surat.');
  }

  try {
    const formattedData = attendanceData.map(item => ({
      name: item.user?.name || '-',
      nis: item.user?.nis || item.user?.nisn || '-',
      status: item.status === 'masuk' ? 'Masuk' : 'Keluar',
      waktuMasuk: item.waktuKunjungan ? dayjs(item.waktuKunjungan).format('HH:mm') : '-',
      waktuKeluar: item.waktuKeluar ? dayjs(item.waktuKeluar).format('HH:mm') : '-',
      durasiKunjungan: item.durasiKunjungan || null,
    }));

    const doc = (
      <LibraryAttendancePDF
        attendanceData={formattedData}
        schoolData={{
          namaSekolah: nameSchool,
          kopSurat: schoolData.kopSurat || undefined,
          namaKepalaSekolah: schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah',
          ttdKepalaSekolah: schoolData.ttdKepalaSekolah || undefined,
        }}
        date={dayjs(studentParams?.tanggal || new Date()).format('DD MMMM YYYY')}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-Absensi-Perpustakaan-${dayjs(studentParams?.tanggal || new Date()).format('YYYY-MM-DD')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success('Laporan absensi perpustakaan berhasil diunduh.');
  } catch (error) {
    console.error('Error generating attendance PDF:', error);
    alert.error('Gagal menghasilkan laporan absensi perpustakaan.');
  }
};

export const LibraryLandingTables = ({ formattedDate, tahun }: { formattedDate?: string; tahun?: string }) => { // Added tahun prop
  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 50 });

  const [nisFilter, setNisFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  console.log('formattedDate:', formattedDate)

  const profile = useProfile();
  const alert = useAlert();
  const { data: schoolData, isLoading: schoolIsLoading } = useSchoolDetail({ id: profile?.user?.sekolahId || 1 });
  const { data: libraries, isLoading } = useLibrary({
    sekolahId: profile?.user?.sekolahId,
    tanggal: formattedDate,
    tahun, // Pass tahun to useLibrary
  });

  const dayOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

  const mergedDataInOrder = dayOrder.reduce((acc: VisitorEntry[], day) => {
    if (libraries?.data?.[day]?.length) {
      acc.push(...libraries.data[day]);
    }
    return acc;
  }, []);

  const filteredData = mergedDataInOrder.filter((item) => {
    const nameMatch = nameFilter
      ? item?.user?.name?.toLowerCase().includes(nameFilter.toLowerCase())
      : true;

    const nisMatch = nisFilter
      ? (item?.user?.nis?.toLowerCase().includes(nisFilter.toLowerCase()) ||
        item?.user?.nisn?.toLowerCase().includes(nisFilter.toLowerCase()))
      : true;

    const dayMatch = dayFilter === "all" ||
      libraries?.data?.[dayFilter]?.includes(item);

    const statusMatch = statusFilter === "all" || item.status === statusFilter;

    return nameMatch && nisMatch && dayMatch && statusMatch;
  });

  // Calculate counts for masuk and keluar
  const masukCount = filteredData.filter(item => item.status === 'masuk').length;
  const keluarCount = filteredData.filter(item => item.status === 'keluar').length;

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generateAttendancePDF({
        studentParams: { tanggal: formattedDate, tahun }, // Pass tahun to studentParams
        attendanceData: filteredData,
        alert,
        nameSchool: schoolData?.namaSekolah || 'Nama Sekolah',
        schoolData: schoolData || {},
        schoolIsLoading,
      });
    } catch (error) {
      console.error('Error in handleDownloadPDF:', error);
      alert?.error?.('Terjadi kesalahan saat mengunduh laporan.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mt-6 mb-3">
        <Input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder={lang.text("search") || "Filter by name..."}
          className="w-[300px]"
        />
        <Input
          type="text"
          value={nisFilter}
          onChange={(e) => setNisFilter(e.target.value)}
          placeholder={"Filter by NIS"}
          className="w-[300px]"
        />
        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Filter Hari" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allDays')}</SelectItem>
            {dayOrder.map((day) => (
              <SelectItem key={day} value={day}>
                {lang.text(day)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text('allStatus')}</SelectItem>
            <SelectItem value="masuk">{lang.text('masuk')}</SelectItem>
            <SelectItem value="keluar">{lang.text('keluar')}</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-sm py-2 shadow-none">
            Masuk: {masukCount}
          </Badge>
          <Badge variant="outline" className="text-sm py-2 shadow-none">
            Keluar: {keluarCount}
          </Badge>
          <Button
            className="relative bg-red-600 text-white hover:bg-red-700"
            variant="outline"
            aria-label="download pdf"
            disabled={isGeneratingPDF || isLoading || schoolIsLoading}
            onClick={handleDownloadPDF}
          >
            {isGeneratingPDF ? "Generating..." : lang.text("downloadAttedance")}
            <FaFilePdf className="ml-2" />
          </Button>
        </div>
      </div>

      <LibraryTable
        data={filteredData}
        isLoading={isLoading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalItems: filteredData.length,
          onPageChange: (page) => onPaginationChange({ ...pagination, pageIndex: page }),
          onSizeChange: (size) => onPaginationChange({ ...pagination, pageSize: size, pageIndex: 0 }),
        }}
        sorting={sorting}
        onSortingChange={onSortingChange}
      />
    </>
  );
};