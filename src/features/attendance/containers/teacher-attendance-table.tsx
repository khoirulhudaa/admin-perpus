// // import { Button, dayjs, distinctObjectsByProperty, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
// // import { BiodataGuru } from "@/core/models/biodata-guru";
// // import { BaseDataTable, useAlert } from "@/features/_global";
// // import { useSchool } from "@/features/schools";
// // import { useBiodataGuru } from "@/features/user/hooks";
// // import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
// // import Papa from 'papaparse';
// // import { useMemo, useState } from "react";
// // import { FaFile } from "react-icons/fa";
// // import * as XLSX from 'xlsx';
// // import { teacherAttendanceColumn } from "../utils";

// // // PDF Styles
// // const pdfStyles = StyleSheet.create({
// //   page: {
// //     fontSize: 12,
// //     fontFamily: 'Times-Roman',
// //   },
// //   header: {
// //     position: 'relative',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     marginBottom: 20,
// //   },
// //   headerImage: {
// //     width: 595,
// //     maxHeight: 150,
// //     objectFit: 'contain',
// //   },
// //   contentWrapper: {
// //     paddingLeft: 32,
// //     paddingRight: 32,
// //     marginTop: 10,
// //   },
// //   title: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //     marginBottom: 5,
// //     textTransform: 'uppercase',
// //   },
// //   content: {
// //     marginBottom: 10,
// //     textAlign: 'center',
// //     lineHeight: 1.5,
// //   },
// //   table: {
// //     display: 'flex',
// //     flexDirection: 'column',
// //     borderStyle: 'solid',
// //     borderWidth: 1,
// //     borderColor: '#000',
// //   },
// //   tableRow: {
// //     flexDirection: 'row',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#000',
// //   },
// //   tableCell: {
// //     padding: 5,
// //     borderRightWidth: 1,
// //     borderRightColor: '#000',
// //     textAlign: 'center',
// //   },
// //   tableHeader: {
// //     fontWeight: 'bold',
// //     backgroundColor: '#f0f0f0',
// //   },
// //   signature: {
// //     marginTop: 50,
// //     alignItems: 'flex-end',
// //   },
// //   signatureImage: {
// //     width: 120,
// //     height: 'auto',
// //     maxHeight: 50,
// //     marginTop: 20,
// //     marginBottom: 10,
// //   },
// //   signatureText: {
// //     textAlign: 'center',
// //   },
// // });

// // // PDF Component for Teacher Attendance
// // const TeacherAttendancePDF: React.FC<{
// //   attendanceData: any[];
// //   schoolData: { kopSurat: string | undefined; namaSekolah: string; namaKepalaSekolah: string; ttdKepalaSekolah: string | undefined };
// //   period: string;
// // }> = ({ attendanceData, schoolData, period }) => {
// //   const kopSuratUrl = schoolData.kopSurat
// //     ? schoolData.kopSurat.startsWith('data:image')
// //       ? schoolData.kopSurat
// //       : `data:image/png;base64,${schoolData.kopSurat}`
// //     : '';

// //   const signatureUrl = schoolData.ttdKepalaSekolah
// //     ? schoolData.ttdKepalaSekolah.startsWith('data:image')
// //       ? schoolData.ttdKepalaSekolah
// //       : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
// //     : '';

// //   const rowsPerPage = 22;
// //   const dataChunks = [];
// //   for (let i = 0; i < attendanceData.length; i += rowsPerPage) {
// //     const chunk = attendanceData.slice(i, i + rowsPerPage);
// //     if (chunk.length > 0) {
// //       dataChunks.push(chunk);
// //     }
// //   }

// //   // Define column widths consistently
// //   const columnWidths = {
// //     No: '5%',
// //     NamaGuru: '31%',
// //     JamMasuk: '22%',
// //     JamPulang: '22%',
// //     StatusKehadiran: '20%',
// //   };

// //   return (
// //     <Document>
// //       {dataChunks.map((chunk, pageIndex) => (
// //         <Page
// //           key={pageIndex}
// //           size="A4"
// //           style={pdfStyles.page}
// //           break={pageIndex > 0}
// //         >
// //           <View style={pdfStyles.header} fixed>
// //             {kopSuratUrl && (
// //               <Image src={kopSuratUrl} style={pdfStyles.headerImage} />
// //             )}
// //           </View>
// //           <View style={pdfStyles.contentWrapper}>
// //             <Text style={pdfStyles.title}>Laporan Kehadiran Guru</Text>
// //             <Text style={pdfStyles.content}>
// //               Periode: {period || 'Periode Tidak Diketahui'}
// //             </Text>
// //             <View style={pdfStyles.table}>
// //               <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
// //                 {['No', 'Nama Guru', 'Jam Masuk', 'Jam Pulang', 'Status Kehadiran'].map((header, index) => (
// //                   <View
// //                     key={index}
// //                     style={[
// //                       pdfStyles.tableCell,
// //                       pdfStyles.tableHeader,
// //                       { width: Object.values(columnWidths)[index] },
// //                     ]}
// //                   >
// //                     <Text>{header}</Text>
// //                   </View>
// //                 ))}
// //               </View>
// //               {chunk.map((item, index) => (
// //                 <View style={pdfStyles.tableRow} key={index} wrap={false}>
// //                   <View style={[pdfStyles.tableCell, { width: columnWidths.No }]}>
// //                     <Text>{pageIndex * rowsPerPage + index + 1}</Text>
// //                   </View>
// //                   <View style={[pdfStyles.tableCell, { width: columnWidths.NamaGuru }]}>
// //                     <Text>{item?.NamaGuru || '-'}</Text>
// //                   </View>
// //                   <View style={[pdfStyles.tableCell, { width: columnWidths.JamMasuk }]}>
// //                     <Text>{(item?.JamMasuk === '-' || item?.JamMasuk === 'N/A' || item?.JamMasuk === null) ? 'Belum masuk' : item?.JamMasuk}</Text>
// //                   </View>
// //                   <View style={[pdfStyles.tableCell, { width: columnWidths.JamPulang }]}>
// //                     <Text>{(item?.JamPulang === '-' || item?.JamPulang === 'N/A' || item?.JamPulang === null) ? 'Belum absen pulang' : item?.JamPulang}</Text>
// //                   </View>
// //                   <View style={[pdfStyles.tableCell, { width: columnWidths.StatusKehadiran }]}>
// //                     <Text>{item?.StatusKehadiran || '-'}</Text>
// //                   </View>
// //                 </View>
// //               ))}
// //             </View>
// //             {pageIndex === dataChunks.length - 1 && (
// //               <View style={pdfStyles.signature}>
// //                 <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
// //                 {signatureUrl && (
// //                   <Image src={signatureUrl} style={pdfStyles.signatureImage} />
// //                 )}
// //                 <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah'}</Text>
// //               </View>
// //             )}
// //           </View>
// //         </Page>
// //       ))}
// //     </Document>
// //   );
// // };

// // // Function to generate PDF
// // const generateTeacherAttendancePDF = async ({
// //   attendanceData,
// //   schoolData,
// //   schoolIsLoading,
// //   period,
// //   alert,
// // }: {
// //   attendanceData: any[];
// //   schoolData: any;
// //   schoolIsLoading: boolean;
// //   period: string;
// //   alert: any;
// // }) => {
// //   if (!alert) {
// //     console.error('Alert system is not available');
// //     return;
// //   }

// //   if (schoolIsLoading) {
// //     alert.error('Data sekolah masih dimuat, silakan coba lagi.');
// //     return;
// //   }

// //   if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
// //     alert.error('Tidak ada data kehadiran untuk dihasilkan.');
// //     return;
// //   }

// //   if (!schoolData || !schoolData.namaSekolah) {
// //     alert.error('Data sekolah tidak lengkap.');
// //     return;
// //   }

// //   try {
// //     const doc = (
// //       <TeacherAttendancePDF
// //         attendanceData={attendanceData}
// //         schoolData={{
// //           namaSekolah: schoolData.namaSekolah || 'Nama Sekolah',
// //           kopSurat: schoolData.kopSurat || '',
// //           namaKepalaSekolah: schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah',
// //           ttdKepalaSekolah: schoolData.ttdKepalaSekolah || '',
// //         }}
// //         period={period}
// //       />
// //     );

// //     const pdfInstance = pdf(doc);
// //     const pdfBlob = await pdfInstance.toBlob();

// //     const url = window.URL.createObjectURL(pdfBlob);
// //     const link = document.createElement('a');
// //     link.href = url;
// //     link.download = `Laporan-Kehadiran-Guru-${dayjs().format('YYYYMMDD')}.pdf`;
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //     window.URL.revokeObjectURL(url);

// //     alert.success('Laporan kehadiran guru berhasil diunduh.');
// //   } catch (error) {
// //     console.error('Error generating teacher attendance PDF:', error);
// //     alert.error(error?.message || 'Gagal menghasilkan laporan kehadiran guru.');
// //   }
// // };

// // export function TeacherAttendanceTable() {
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [dataMode, setDataMode] = useState<'daily' | 'monthly'>('daily');
// //   const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
// //     dayjs().tz('Asia/Jakarta').startOf('month').format('YYYY-MM'),
// //   );
// //   const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
// //     dayjs().tz('Asia/Jakarta').format('YYYY-MM'),
// //   );

// //   const biodata = useBiodataGuru();
// //   const school = useSchool();
// //   const alert = useAlert();

// //   console.log('biodata guru absen:', biodata.data)

// //   const datas = useMemo(() => {
// //     const dataWithAttendance: BiodataGuru[] = [];

// //     biodata.data?.forEach((user) => {
// //       user.absensis?.forEach((att) => {
// //         dataWithAttendance.push({
// //           ...user,
// //           attendance: att,
// //         });
// //       });
// //     });

// //     if (dataMode === 'daily') {
// //       const today = dayjs().format('YYYY-MM-DD');
// //       return dataWithAttendance.filter((data) => {
// //         const recordDate = dayjs(data.attendance.createdAt).format('YYYY-MM-DD');
// //         return recordDate === today;
// //       });
// //     } else {
// //       const startDate = dayjs(`${selectedStartMonth}-01`).startOf('month');
// //       const endDate = dayjs(`${selectedEndMonth}-01`).endOf('month');
// //       return dataWithAttendance.filter((data) => {
// //         const attendanceDate = dayjs(data.attendance?.createdAt);
// //         return attendanceDate.isAfter(startDate) && attendanceDate.isBefore(endDate);
// //       });
// //     }
// //   }, [biodata.data, dataMode, selectedStartMonth, selectedEndMonth]);

// //   console.log('datas:', datas)

// //   const columns = useMemo(
// //     () =>
// //       teacherAttendanceColumn({
// //         schoolOptions: distinctObjectsByProperty(
// //           school.data?.map((d) => ({
// //             label: d.namaSekolah,
// //             value: d.namaSekolah,
// //           })) || [],
// //           "value",
// //         ),
// //       }),
// //     [school.data],
// //   );

// //   const dayAttends = () => {
// //     const today = dayjs().format('YYYY-MM-DD');
// //     return datas.filter((data: any) => {
// //       const recordDate = dayjs(data.attendance.createdAt).format('YYYY-MM-DD');
// //       return recordDate === today;
// //     });
// //   };

// //   const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
// //     if (datas.length === 0) {
// //       alert.error('Tidak ada data untuk diekspor.');
// //       return;
// //     }

// //     const formatDateTime = (isoString: string | undefined) => {
// //       if (!isoString) return 'N/A';
// //       const date = new Date(isoString);
// //       const day = String(date.getDate()).padStart(2, '0');
// //       const month = String(date.getMonth() + 1).padStart(2, '0');
// //       const year = date.getFullYear();
// //       const hours = String(date.getHours()).padStart(2, '0');
// //       const minutes = String(date.getMinutes()).padStart(2, '0');
// //       return `${day}-${month}-${year} ${hours}:${minutes}`;
// //     };

// //     const exportData = datas.map((data, index) => ({
// //       No: index + 1,
// //       NamaGuru: data?.namaGuru || 'N/A',
// //       JamMasuk: formatDateTime(data.attendance?.jamMasuk),
// //       JamPulang: formatDateTime(data.attendance?.jamPulang),
// //       StatusKehadiran: data.attendance?.statusKehadiran || 'N/A',
// //     }));

// //     if (format === 'csv') {
// //       const csv = Papa.unparse(exportData, { delimiter: ';' });
// //       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
// //       const link = document.createElement('a');
// //       link.href = URL.createObjectURL(blob);
// //       link.download = `attendance_data_${dataMode}_${dayjs().format('YYYYMMDD')}.csv`;
// //       link.click();
// //     } else if (format === 'excel') {
// //       const wb = XLSX.utils.book_new();
// //       const ws = XLSX.utils.json_to_sheet(exportData);
// //       XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// //       XLSX.writeFile(wb, `attendance_data_${dataMode}_${dayjs().format('YYYYMMDD')}.xlsx`);
// //     } else if (format === 'pdf') {
// //       await generateTeacherAttendancePDF({
// //         attendanceData: exportData,
// //         schoolData: school.data?.[0] || {},
// //         schoolIsLoading: school.isLoading,
// //         period: dataMode === 'daily'
// //           ? dayjs().format('DD MMMM YYYY')
// //           : `${dayjs(selectedStartMonth).format('MMMM YYYY')} - ${dayjs(selectedEndMonth).format('MMMM YYYY')}`,
// //         alert,
// //       });
// //     }

// //     setIsModalOpen(false);
// //   };

// //   return (
// //     <>
// //       <div className="w-full flex justify-between mb-4 items-center space-x-4">
// //         <div className="flex items-center space-x-4">
// //           <Button
// //             variant="outline"
// //             onClick={() => setIsModalOpen(!isModalOpen)}
// //             aria-label="exportData"
// //             className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300"
// //           >
// //             {lang.text('export')} Data <FaFile />
// //           </Button>
// //           <Select value={dataMode} onValueChange={(value: 'daily' | 'monthly') => setDataMode(value)}>
// //             <SelectTrigger className="w-[120px]">
// //               <SelectValue placeholder="Pilih mode" />
// //             </SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="daily">{lang.text('daily')}</SelectItem>
// //               <SelectItem value="monthly">{lang.text('monthly')}</SelectItem>
// //             </SelectContent>
// //           </Select>
// //         </div>
// //         <Button
// //           variant="outline"
// //           aria-label="presentCount"
// //           className="w-max hover:bg-transparent cursor-default"
// //         >
// //           {lang.text('presentToday')}: <div className="w-[1px] h-[10px] bg-white mx-1"></div> {dayAttends().length > 0 ? dayAttends().length : 0}
// //         </Button>
// //       </div>
// //       <BaseDataTable
// //         columns={columns}
// //         data={datas}
// //         dataFallback={[]}
// //         globalSearch
// //         searchParamPagination
// //         showFilterButton
// //         initialState={{
// //           columnVisibility: {
// //             user_email: false,
// //             user_nrk: false,
// //             user_nip: false,
// //             user_nikki: false,
// //           },
// //           sorting: [
// //             {
// //               id: "attendance_createdAt",
// //               desc: true,
// //             },
// //           ],
// //         }}
// //         searchPlaceholder={lang.text("search")}
// //         isLoading={biodata.query.isLoading}
// //       />

// //       {isModalOpen && (
// //         <div
// //           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
// //           onClick={() => setIsModalOpen(false)}
// //         >
// //           <div
// //             className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-lg"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <h2 className="text-lg font-semibold mb-4">Export & Filter</h2>
// //             {dataMode === 'monthly' && (
// //               <div className="mb-4">
// //                 <label className="block text-sm font-medium mb-2">
// //                   Pilih Rentang Bulan
// //                 </label>
// //                 <div className="flex space-x-4">
// //                   <input
// //                     type="month"
// //                     value={selectedStartMonth}
// //                     onChange={(e) => setSelectedStartMonth(e.target.value)}
// //                     className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
// //                   />
// //                   <span className="text-white mt-2">-</span>
// //                   <input
// //                     type="month"
// //                     value={selectedEndMonth}
// //                     onChange={(e) => setSelectedEndMonth(e.target.value)}
// //                     className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
// //                   />
// //                 </div>
// //               </div>
// //             )}
// //             <div className="flex space-x-4">
// //               <button
// //                 onClick={() => handleExport('csv')}
// //                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
// //               >
// //                 Export CSV
// //               </button>
// //               <button
// //                 onClick={() => handleExport('excel')}
// //                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 w-full"
// //               >
// //                 Export Excel
// //               </button>
// //               <button
// //                 onClick={() => handleExport('pdf')}
// //                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 w-full"
// //               >
// //                 Export PDF
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // }

// import { Button, dayjs, distinctObjectsByProperty, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
// import { BiodataGuru } from "@/core/models/biodata-guru";
// import { BaseDataTable, useAlert } from "@/features/_global";
// import { useSchool } from "@/features/schools";
// import { useBiodataGuru } from "@/features/user/hooks";
// import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
// import Papa from 'papaparse';
// import { useMemo, useState } from "react";
// import { FaFile } from "react-icons/fa";
// import * as XLSX from 'xlsx';
// import { teacherAttendanceColumn } from "../utils";

// // Fungsi calculateDelayTeacher
// const calculateDelayTeacher = (jamMasuk: string | undefined): string => {
//   if (!jamMasuk || jamMasuk === "N/A") return "-";

//   const entryTime = new Date(jamMasuk);
//   if (isNaN(entryTime.getTime())) return "-";

//   const standardTime = new Date(entryTime);
//   standardTime.setHours(7, 0, 0, 0);

//   if (entryTime <= standardTime) return "0 menit";

//   const diffMinutes = Math.floor((entryTime.getTime() - standardTime.getTime()) / 1000 / 60);
//   return `${diffMinutes} menit`;
// };


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
//   tableRowLate: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#000',
//     backgroundColor: '#ff3a3a', // Latar merah untuk baris terlambat
//     color: '#FFFFFF', // Teks putih untuk baris terlambat
//   },
//   tableCell: {
//     padding: 5,
//     borderRightWidth: 1,
//     borderRightColor: '#000',
//     textAlign: 'center',
//   },
//   tableCellLate: {
//     padding: 5,
//     borderRightWidth: 1,
//     borderRightColor: '#000',
//     textAlign: 'center',
//     color: '#FFFFFF', // Teks putih untuk sel dalam baris terlambat
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

// // PDF Component for Teacher Attendance
// const TeacherAttendancePDF: React.FC<{
//   attendanceData: any[];
//   schoolData: { kopSurat: string | undefined; namaSekolah: string; namaKepalaSekolah: string; ttdKepalaSekolah: string | undefined };
//   period: string;
// }> = ({ attendanceData, schoolData, period }) => {
//   const kopSuratUrl = schoolData.kopSurat
//     ? schoolData.kopSurat.startsWith('data:image')
//       ? schoolData.kopSurat
//       : `data:image/png;base64,${schoolData.kopSurat}`
//     : '';

//   const signatureUrl = schoolData.ttdKepalaSekolah
//     ? schoolData.ttdKepalaSekolah.startsWith('data:image')
//       ? schoolData.ttdKepalaSekolah
//       : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
//     : '';

//   const rowsPerPage = 20;
//   const dataChunks = [];
//   for (let i = 0; i < attendanceData.length; i += rowsPerPage) {
//     const chunk = attendanceData.slice(i, i + rowsPerPage);
//     if (chunk.length > 0) {
//       dataChunks.push(chunk);
//     }
//   }

//   const columnWidths = {
//     No: '5%',
//     NamaGuru: '30%',
//     StatusKehadiran: '20%',
//     JamMasukPulang: '30%',
//     Telat: '15%',
//   };

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
//             {kopSuratUrl && (
//               <Image src={kopSuratUrl} style={pdfStyles.headerImage} />
//             )}
//           </View>
//           <View style={pdfStyles.contentWrapper}>
//             <Text style={pdfStyles.title}>Laporan Kehadiran Guru</Text>
//             <Text style={pdfStyles.content}>
//               Periode: {period || 'Periode Tidak Diketahui'}
//             </Text>
//             <View style={pdfStyles.table}>
//               <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
//                 {['No', 'Nama Guru', 'Status', 'Jam Masuk-Pulang', 'Telat'].map((header, index) => (
//                   <View
//                     key={index}
//                     style={[
//                       pdfStyles.tableCell,
//                       pdfStyles.tableHeader,
//                       { width: Object.values(columnWidths)[index] },
//                     ]}
//                   >
//                     <Text>{header}</Text>
//                   </View>
//                 ))}
//               </View>
//               {chunk.map((item, index) => {
//                 const isLate = item?.Telat && item.Telat !== "0 menit" && item.Telat !== "-";
//                 const jamMasukPulang = (item?.JamMasuk === '-' || item?.JamMasuk === 'N/A' || item?.JamMasuk === null)
//                   ? 'Belum masuk'
//                   : `${item.JamMasuk}\n${(item?.JamPulang === '-' || item?.JamPulang === 'N/A' || item?.JamPulang === null) ? '(Belum absen pulang)' : `(${item.JamPulang})`}`;
//                 return (
//                   <View style={[isLate ? pdfStyles.tableRowLate : pdfStyles.tableRow]} key={index} wrap={false}>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths.No }]}>
//                       <Text>{pageIndex * rowsPerPage + index + 1}</Text>
//                     </View>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths.NamaGuru }]}>
//                       <Text>{item?.NamaGuru || '-'}</Text>
//                     </View>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths.StatusKehadiran }]}>
//                       <Text>{item?.StatusKehadiran || '-'}</Text>
//                     </View>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths.JamMasukPulang }]}>
//                       <Text>{jamMasukPulang}</Text>
//                     </View>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths.Telat }]}>
//                       <Text>{item?.Telat || '-'}</Text>
//                     </View>
//                   </View>
//                 );
//               })}
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
// const generateTeacherAttendancePDF = async ({
//   attendanceData,
//   schoolData,
//   schoolIsLoading,
//   period,
//   alert,
// }: {
//   attendanceData: any[];
//   schoolData: any;
//   schoolIsLoading: boolean;
//   period: string;
//   alert: any;
// }) => {
//   if (!alert) {
//     console.error('Sistem notifikasi tidak tersedia');
//     return;
//   }

//   if (schoolIsLoading) {
//     alert.error('Data sekolah masih dimuat, silakan coba lagi.');
//     return;
//   }

//   if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
//     alert.error('Tidak ada data kehadiran untuk dihasilkan.');
//     return;
//   }

//   if (!schoolData || !schoolData.namaSekolah) {
//     alert.error('Data sekolah tidak lengkap.');
//     return;
//   }

//   try {
//     const doc = (
//       <TeacherAttendancePDF
//         attendanceData={attendanceData}
//         schoolData={{
//           namaSekolah: schoolData.namaSekolah || 'Nama Sekolah',
//           kopSurat: schoolData.kopSurat || '',
//           namaKepalaSekolah: schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah',
//           ttdKepalaSekolah: schoolData.ttdKepalaSekolah || '',
//         }}
//         period={period}
//       />
//     );

//     const pdfInstance = pdf(doc);
//     const pdfBlob = await pdfInstance.toBlob();

//     const url = window.URL.createObjectURL(pdfBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `Laporan-Kehadiran-Guru-${dayjs().format('YYYYMMDD')}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);

//     alert.success('Laporan kehadiran guru berhasil diunduh.');
//   } catch (error) {
//     console.error('Error menghasilkan PDF kehadiran guru:', error);
//     alert.error(error?.message || 'Gagal menghasilkan laporan kehadiran guru.');
//   }
// };

// export function TeacherAttendanceTable() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [dataMode, setDataMode] = useState<'daily' | 'monthly'>('daily');
//   const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
//     dayjs().tz('Asia/Jakarta').startOf('month').format('YYYY-MM'),
//   );
//   const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
//     dayjs().tz('Asia/Jakarta').format('YYYY-MM'),
//   );

//   const biodata = useBiodataGuru();
//   const school = useSchool();
//   const alert = useAlert();

//   console.log('biodata guru absen:', biodata.data);

//   const datas = useMemo(() => {
//     const dataWithAttendance: BiodataGuru[] = [];

//     biodata.data?.forEach((user) => {
//       user.absensis?.forEach((att) => {
//         dataWithAttendance.push({
//           ...user,
//           attendance: att,
//         });
//       });
//     });

//     // Urutkan data berdasarkan keterlambatan (Telat)
//     const sortedData = dataWithAttendance.sort((a, b) => {
//       const delayA = calculateDelayTeacher(a.attendance?.jamMasuk);
//       const delayB = calculateDelayTeacher(b.attendance?.jamMasuk);
      
//       // Konversi ke menit untuk sorting, "-" dianggap 0
//       const minutesA = delayA === "-" || delayA === "0 menit" ? 0 : parseInt(delayA);
//       const minutesB = delayB === "-" || delayB === "0 menit" ? 0 : parseInt(delayB);
      
//       // Urutkan dari yang terlambat (terbesar) ke tidak terlambat (0 atau "-")
//       return minutesB - minutesA;
//     });

//     if (dataMode === 'daily') {
//       const today = dayjs().format('YYYY-MM-DD');
//       return sortedData.filter((data) => {
//         const recordDate = dayjs(data.attendance.createdAt).format('YYYY-MM-DD');
//         return recordDate === today;
//       });
//     } else {
//       const startDate = dayjs(`${selectedStartMonth}-01`).startOf('month');
//       const endDate = dayjs(`${selectedEndMonth}-01`).endOf('month');
//       return sortedData.filter((data) => {
//         const attendanceDate = dayjs(data.attendance?.createdAt);
//         return attendanceDate.isAfter(startDate) && attendanceDate.isBefore(endDate);
//       });
//     }
//   }, [biodata.data, dataMode, selectedStartMonth, selectedEndMonth]);

//   console.log('datas:', datas);

//   const columns = useMemo(
//     () =>
//       teacherAttendanceColumn({
//         schoolOptions: distinctObjectsByProperty(
//           school.data?.map((d) => ({
//             label: d.namaSekolah,
//             value: d.namaSekolah,
//           })) || [],
//           "value",
//         ),
//       }),
//     [school.data],
//   );

//   const dayAttends = () => {
//     const today = dayjs().format('YYYY-MM-DD');
//     return datas.filter((data: any) => {
//       const recordDate = dayjs(data.attendance.createdAt).format('YYYY-MM-DD');
//       return recordDate === today;
//     });
//   };

//   const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
//     if (datas.length === 0) {
//       alert.error('Tidak ada data untuk diekspor.');
//       return;
//     }

//     const formatDateTime = (isoString: string | undefined) => {
//       if (!isoString) return 'N/A';
//       const date = new Date(isoString);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
//       const hours = String(date.getHours()).padStart(2, '0');
//       const minutes = String(date.getMinutes()).padStart(2, '0');
//       return `${day}-${month}-${year} ${hours}:${minutes}`;
//     };

//     // Urutkan exportData berdasarkan Telat
//     const exportData = datas.map((data, index) => ({
//       No: index + 1,
//       NamaGuru: data?.namaGuru || 'N/A',
//       JamMasuk: formatDateTime(data.attendance?.jamMasuk),
//       JamPulang: formatDateTime(data.attendance?.jamPulang),
//       StatusKehadiran: data.attendance?.statusKehadiran || 'N/A',
//       Telat: calculateDelayTeacher(data.attendance?.jamMasuk),
//     })).sort((a, b) => {
//       const delayA = a.Telat === "-" || a.Telat === "0 menit" ? 0 : parseInt(a.Telat);
//       const delayB = b.Telat === "-" || b.Telat === "0 menit" ? 0 : parseInt(b.Telat);
//       return delayB - delayA; // Urutkan dari terlambat terbesar ke terkecil
//     });

//     if (format === 'csv') {
//       const csv = Papa.unparse(exportData, { delimiter: ';' });
//       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = `data_kehadiran_${dataMode}_${dayjs().format('YYYYMMDD')}.csv`;
//       link.click();
//     } else if (format === 'excel') {
//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       XLSX.utils.book_append_sheet(wb, ws, 'Kehadiran');
//       XLSX.writeFile(wb, `data_kehadiran_${dataMode}_${dayjs().format('YYYYMMDD')}.xlsx`);
//     } else if (format === 'pdf') {
//       await generateTeacherAttendancePDF({
//         attendanceData: exportData,
//         schoolData: school.data?.[0] || {},
//         schoolIsLoading: school.isLoading,
//         period: dataMode === 'daily'
//           ? dayjs().format('DD MMMM YYYY')
//           : `${dayjs(selectedStartMonth).format('MMMM YYYY')} - ${dayjs(selectedEndMonth).format('MMMM YYYY')}`,
//         alert,
//       });
//     }

//     setIsModalOpen(false);
//   };

//   return (
//     <>
//       <div className="w-full flex justify-between mb-4 items-center space-x-4">
//         <div className="flex items-center space-x-4">
//           <Button
//             variant="outline"
//             onClick={() => setIsModalOpen(!isModalOpen)}
//             aria-label="exportData"
//             className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300"
//           >
//             Ekspor Data <FaFile />
//           </Button>
//           <Select value={dataMode} onValueChange={(value: 'daily' | 'monthly') => setDataMode(value)}>
//             <SelectTrigger className="w-[120px]">
//               <SelectValue placeholder="Pilih mode" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="daily">Harian</SelectItem>
//               <SelectItem value="monthly">Bulanan</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <Button
//           variant="outline"
//           aria-label="presentCount"
//           className="w-max hover:bg-transparent cursor-default"
//         >
//           Hadir Hari Ini: <div className="w-[1px] h-[10px] bg-white mx-1"></div> {dayAttends().length > 0 ? dayAttends().length : 0}
//         </Button>
//       </div>
//       <BaseDataTable
//         columns={columns}
//         data={datas}
//         dataFallback={[]}
//         globalSearch
//         searchParamPagination
//         showFilterButton
//         initialState={{
//           columnVisibility: {
//             user_email: false,
//             user_nrk: false,
//             user_nip: false,
//             user_nikki: false,
//           },
//           sorting: [
//             {
//               id: "attendance.delay",
//               desc: true, // Urutkan dari keterlambatan terbesar ke terkecil
//             },
//           ],
//         }}
//         searchPlaceholder="Cari data..."
//         isLoading={biodata.query.isLoading}
//       />

//       {isModalOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
//           onClick={() => setIsModalOpen(false)}
//         >
//           <div
//             className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-lg"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-lg font-semibold mb-4">Ekspor & Filter</h2>
//             {dataMode === 'monthly' && (
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">
//                   Pilih Rentang Bulan
//                 </label>
//                 <div className="flex space-x-4">
//                   <input
//                     type="month"
//                     value={selectedStartMonth}
//                     onChange={(e) => setSelectedStartMonth(e.target.value)}
//                     className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
//                   />
//                   <span className="text-white mt-2">-</span>
//                   <input
//                     type="month"
//                     value={selectedEndMonth}
//                     onChange={(e) => setSelectedEndMonth(e.target.value)}
//                     className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
//                   />
//                 </div>
//               </div>
//             )}
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => handleExport('csv')}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
//               >
//                 Ekspor CSV
//               </button>
//               <button
//                 onClick={() => handleExport('excel')}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 w-full"
//               >
//                 Ekspor Excel
//               </button>
//               <button
//                 onClick={() => handleExport('pdf')}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 w-full"
//               >
//                 Ekspor PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };



import { Button, dayjs, distinctObjectsByProperty, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
import { BiodataGuru } from "@/core/models/biodata-guru";
import { BaseDataTable, useAlert } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { useBiodataGuru } from "@/features/user/hooks";
import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
import Papa from 'papaparse';
import { useMemo, useState } from "react";
import { FaFile } from "react-icons/fa";
import * as XLSX from 'xlsx';
import { teacherAttendanceColumn } from "../utils";

// Fungsi calculateDelayTeacher
const calculateDelayTeacher = (jamMasuk: string | undefined): string => {
  if (!jamMasuk || jamMasuk === "N/A") return "-";

  const entryTime = new Date(jamMasuk);
  if (isNaN(entryTime.getTime())) return "-";

  const standardTime = new Date(entryTime);
  standardTime.setHours(7, 0, 0, 0);

  if (entryTime <= standardTime) return "0 menit";

  const diffMinutes = Math.floor((entryTime.getTime() - standardTime.getTime()) / 1000 / 60);
  return `${diffMinutes} menit`;
};

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    fontSize: 9.3,
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
  tableRowLate: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#ff3a3a', // Latar merah untuk baris terlambat
    color: '#FFFFFF', // Teks putih untuk baris terlambat
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
  },
  tableCellLate: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
    color: '#FFFFFF', // Teks putih untuk sel dalam baris terlambat
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

// PDF Component for Teacher Attendance
const TeacherAttendancePDF: React.FC<{
  attendanceData: any[];
  schoolData: { kopSurat: string | undefined; namaSekolah: string; namaKepalaSekolah: string; ttdKepalaSekolah: string | undefined };
  period: string;
}> = ({ attendanceData, schoolData, period }) => {
  const kopSuratUrl = schoolData.kopSurat
    ? schoolData.kopSurat.startsWith('data:image')
      ? schoolData.kopSurat
      : `data:image/png;base64,${schoolData.kopSurat}`
    : '';

  const signatureUrl = schoolData.ttdKepalaSekolah
    ? schoolData.ttdKepalaSekolah.startsWith('data:image')
      ? schoolData.ttdKepalaSekolah
      : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
    : '';

  const rowsPerPage = 20;
  const dataChunks = [];
  for (let i = 0; i < attendanceData.length; i += rowsPerPage) {
    const chunk = attendanceData.slice(i, i + rowsPerPage);
    if (chunk.length > 0) {
      dataChunks.push(chunk);
    }
  }

  const columnWidths = {
    No: '5%',
    NamaGuru: '25%',
    NIP: '20%',
    StatusKehadiran: '15%',
    JamMasukPulang: '25%',
    Telat: '10%',
  };

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
            {kopSuratUrl && (
              <Image src={kopSuratUrl} style={pdfStyles.headerImage} />
            )}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Kehadiran Guru</Text>
            <Text style={pdfStyles.content}>
              Periode: {period || 'Periode Tidak Diketahui'}
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {['No', 'Nama Guru', 'NIP', 'Status', 'Jam Masuk-Pulang', 'Telat'].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      { width: Object.values(columnWidths)[index] },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => {
                const isLate = item?.Telat && item.Telat !== "0 menit" && item.Telat !== "-";
                const jamMasukPulang = (item?.JamMasuk === '-' || item?.JamMasuk === 'N/A' || item?.JamMasuk === null)
                  ? 'Belum masuk'
                  : `${item.JamMasuk}\n${(item?.JamPulang === '-' || item?.JamPulang === 'N/A' || item?.JamPulang === null) ? '(Belum absen pulang)' : `(${item.JamPulang})`}`;
                return (
                  <View style={[isLate ? pdfStyles.tableRowLate : pdfStyles.tableRow]} key={index} wrap={false}>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths.No }]}>
                      <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                    </View>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths.NamaGuru }]}>
                      <Text>{item?.NamaGuru || '-'}</Text>
                    </View>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths.NIP }]}>
                      <Text>{item?.NIP || '-'}</Text>
                    </View>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths.StatusKehadiran }]}>
                      <Text>{item?.StatusKehadiran || '-'}</Text>
                    </View>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths.JamMasukPulang }]}>
                      <Text>{jamMasukPulang}</Text>
                    </View>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths.Telat }]}>
                      <Text>{item?.Telat || '-'}</Text>
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

// Function to generate PDF
const generateTeacherAttendancePDF = async ({
  attendanceData,
  schoolData,
  schoolIsLoading,
  period,
  alert,
}: {
  attendanceData: any[];
  schoolData: any;
  schoolIsLoading: boolean;
  period: string;
  alert: any;
}) => {
  if (!alert) {
    console.error('Sistem notifikasi tidak tersedia');
    return;
  }

  if (schoolIsLoading) {
    alert.error('Data sekolah masih dimuat, silakan coba lagi.');
    return;
  }

  if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
    alert.error('Tidak ada data kehadiran untuk dihasilkan.');
    return;
  }

  if (!schoolData || !schoolData.namaSekolah) {
    alert.error('Data sekolah tidak lengkap.');
    return;
  }

  try {
    const doc = (
      <TeacherAttendancePDF
        attendanceData={attendanceData}
        schoolData={{
          namaSekolah: schoolData.namaSekolah || 'Nama Sekolah',
          kopSurat: schoolData.kopSurat || '',
          namaKepalaSekolah: schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah',
          ttdKepalaSekolah: schoolData.ttdKepalaSekolah || '',
        }}
        period={period}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-Kehadiran-Guru-${dayjs().format('YYYYMMDD')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success('Laporan kehadiran guru berhasil diunduh.');
  } catch (error) {
    console.error('Error menghasilkan PDF kehadiran guru:', error);
    alert.error(error?.message || 'Gagal menghasilkan laporan kehadiran guru.');
  }
};

export function TeacherAttendanceTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataMode, setDataMode] = useState<'daily' | 'monthly'>('daily');
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
    dayjs().tz('Asia/Jakarta').startOf('month').format('YYYY-MM'),
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
    dayjs().tz('Asia/Jakarta').format('YYYY-MM'),
  );

  const biodata = useBiodataGuru();
  const school = useSchool();
  const alert = useAlert();

  console.log('biodata guru absen:', biodata.data);

  const datas = useMemo(() => {
    const dataWithAttendance: BiodataGuru[] = [];

    biodata.data?.forEach((user) => {
      user.absensis?.forEach((att) => {
        dataWithAttendance.push({
          ...user,
          attendance: att,
        });
      });
    });

    // Urutkan data berdasarkan keterlambatan (Telat)
    const sortedData = dataWithAttendance.sort((a, b) => {
      const delayA = calculateDelayTeacher(a.attendance?.jamMasuk);
      const delayB = calculateDelayTeacher(b.attendance?.jamMasuk);
      
      // Konversi ke menit untuk sorting, "-" dianggap 0
      const minutesA = delayA === "-" || delayA === "0 menit" ? 0 : parseInt(delayA);
      const minutesB = delayB === "-" || delayB === "0 menit" ? 0 : parseInt(delayB);
      
      // Urutkan dari yang terlambat (terbesar) ke tidak terlambat (0 atau "-")
      return minutesB - minutesA;
    });

    if (dataMode === 'daily') {
      const today = dayjs().format('YYYY-MM-DD');
      return sortedData.filter((data) => {
        const recordDate = dayjs(data.attendance.createdAt).format('YYYY-MM-DD');
        return recordDate === today;
      });
    } else {
      const startDate = dayjs(`${selectedStartMonth}-01`).startOf('month');
      const endDate = dayjs(`${selectedEndMonth}-01`).endOf('month');
      return sortedData.filter((data) => {
        const attendanceDate = dayjs(data.attendance?.createdAt);
        return attendanceDate.isAfter(startDate) && attendanceDate.isBefore(endDate);
      });
    }
  }, [biodata.data, dataMode, selectedStartMonth, selectedEndMonth]);

  console.log('datas:', datas);

  const columns = useMemo(
    () =>
      teacherAttendanceColumn({
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          "value",
        ),
      }),
    [school.data],
  );

  const dayAttends = () => {
    const today = dayjs().format('YYYY-MM-DD');
    return datas.filter((data: any) => {
      const recordDate = dayjs(data.attendance.createdAt).format('YYYY-MM-DD');
      return recordDate === today;
    });
  };

  console.log('datas', datas)

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    if (datas.length === 0) {
      alert.error('Tidak ada data untuk diekspor.');
      return;
    }

    const formatDateTime = (isoString: string | undefined) => {
      if (!isoString) return 'N/A';
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    // Urutkan exportData berdasarkan Telat
    const exportData = datas.map((data, index) => ({
      No: index + 1,
      NamaGuru: data?.namaGuru || '-',
      NIP: data?.user?.nip || '-', // Include NIP
      JamMasuk: formatDateTime(data.attendance?.jamMasuk),
      JamPulang: formatDateTime(data.attendance?.jamPulang) || '-',
      StatusKehadiran: data.attendance?.statusKehadiran || '-',
      Telat: calculateDelayTeacher(data.attendance?.jamMasuk),
    })).sort((a, b) => {
      const delayA = a.Telat === "-" || a.Telat === "0 menit" ? 0 : parseInt(a.Telat);
      const delayB = b.Telat === "-" || b.Telat === "0 menit" ? 0 : parseInt(b.Telat);
      return delayB - delayA; // Urutkan dari terlambat terbesar ke terkecil
    });

    if (format === 'csv') {
      const csv = Papa.unparse(exportData, { delimiter: ';' });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `data_kehadiran_${dataMode}_${dayjs().format('YYYYMMDD')}.csv`;
      link.click();
    } else if (format === 'excel') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Kehadiran');
      XLSX.writeFile(wb, `data_kehadiran_${dataMode}_${dayjs().format('YYYYMMDD')}.xlsx`);
    } else if (format === 'pdf') {
      await generateTeacherAttendancePDF({
        attendanceData: exportData,
        schoolData: school.data?.[0] || {},
        schoolIsLoading: school.isLoading,
        period: dataMode === 'daily'
          ? dayjs().format('DD MMMM YYYY')
          : `${dayjs(selectedStartMonth).format('MMMM YYYY')} - ${dayjs(selectedEndMonth).format('MMMM YYYY')}`,
        alert,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full flex justify-between mb-4 items-center space-x-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(!isModalOpen)}
            aria-label="exportData"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300"
          >
            Ekspor Data <FaFile />
          </Button>
          <Select value={dataMode} onValueChange={(value: 'daily' | 'monthly') => setDataMode(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Pilih mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Harian</SelectItem>
              <SelectItem value="monthly">Bulanan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          aria-label="presentCount"
          className="w-max hover:bg-transparent cursor-default"
        >
          Hadir Hari Ini: <div className="w-[1px] h-[10px] bg-white mx-1"></div> {dayAttends().length > 0 ? dayAttends().length : 0}
        </Button>
      </div>
      <BaseDataTable
        columns={columns}
        data={datas}
        dataFallback={[]}
        globalSearch
        searchParamPagination
        showFilterButton
        initialState={{
          columnVisibility: {
            user_email: false,
            user_nrk: false,
            user_nip: false,
            user_nikki: false,
          },
          sorting: [
            {
              id: "attendance.delay",
              desc: true, // Urutkan dari keterlambatan terbesar ke terkecil
            },
          ],
        }}
        searchPlaceholder="Cari data..."
        isLoading={biodata.query.isLoading}
      />

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Ekspor & Filter</h2>
            {dataMode === 'monthly' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Pilih Rentang Bulan
                </label>
                <div className="flex space-x-4">
                  <input
                    type="month"
                    value={selectedStartMonth}
                    onChange={(e) => setSelectedStartMonth(e.target.value)}
                    className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
                  />
                  <span className="text-white mt-2">-</span>
                  <input
                    type="month"
                    value={selectedEndMonth}
                    onChange={(e) => setSelectedEndMonth(e.target.value)}
                    className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
                  />
                </div>
              </div>
            )}
            <div className="flex space-x-4">
              {/* <button
                onClick={() => handleExport('csv')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
              >
                Ekspor CSV
              </button> */}
              <button
                onClick={() => handleExport('excel')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 w-full"
              >
                Ekspor Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 w-full"
              >
                Ekspor PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};