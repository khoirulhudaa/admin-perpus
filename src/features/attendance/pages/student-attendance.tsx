// import { APP_CONFIG } from '@/core/configs';
// import { Button, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/libs';
// import { getStaticFile } from '@/core/utils';
// import { DashboardPageLayout, useAlert } from '@/features/_global';
// import { useClassroom } from '@/features/classroom';
// import { useSchool } from '@/features/schools';
// import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
// import { format } from 'date-fns';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';
// import timezone from 'dayjs/plugin/timezone';
// import utc from 'dayjs/plugin/utc';
// import Papa from 'papaparse';
// import { useEffect, useMemo, useState } from 'react';
// import { FaFile } from 'react-icons/fa';
// import * as XLSX from 'xlsx';
// import { StudentAttendanceTable } from '../containers';
// import { useAttendanceNew } from '../hooks/use-attedanceMonth';
// import { useSearchParams } from 'react-router-dom';

// // Konfigurasi dayjs untuk timezone
// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.extend(isBetween);

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
//     backgroundColor: '#FF3A3A', // Latar merah untuk baris terlambat
//     color: '#FFFFFF', // Teks putih untuk baris terlambat
//   },
//   tableCell: {
//     padding: 5,
//     borderRightWidth: 1,
//     fontSize: 10,
//     borderRightColor: '#000',
//     textAlign: 'center',
//   },
//   tableCellLate: {
//     padding: 5,
//     borderRightWidth: 1,
//     fontSize: 10,
//     borderRightColor: '#000',
//     textAlign: 'center',
//     color: '#FFFFFF', // Teks putih untuk sel dalam baris terlambat
//   },
//   tableHeader: {
//     fontSize: 10,
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

// // PDF Component for Student Attendance
// const StudentAttendancePDF = ({ attendanceData, schoolData, mode, date, period }) => {
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

//   // Sort berdasarkan durasiKeterlambatan (terbesar dulu)
//   const sortedAttendanceData = [...attendanceData].sort((a, b) => {
//     const delayA = a.durasiKeterlambatan === '-' || a.durasiKeterlambatan === '0 menit' ? 0 : parseInt(a.durasiKeterlambatan);
//     const delayB = b.durasiKeterlambatan === '-' || b.durasiKeterlambatan === '0 menit' ? 0 : parseInt(b.durasiKeterlambatan);
//     return delayB - delayA; // Urutkan dari terlambat terbesar ke terkecil
//   });

//   const dataChunks = [];
//   for (let i = 0; i < sortedAttendanceData.length; i += rowsPerPage) {
//     const chunk = sortedAttendanceData.slice(i, i + rowsPerPage);
//     if (chunk.length > 0) {
//       dataChunks.push(chunk);
//     }
//   }

//   const headers = ['No', 'Nama', 'NISN', 'Kelas', 'Status', 'Jam Masuk-Pulang', 'Telat'];
//   const columnWidths = ['5%', '20%', '15%', '12%', '12%', '24%', '12%'];

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
//               <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
//             )}
//           </View>
//           <View style={pdfStyles.contentWrapper}>
//             <Text style={pdfStyles.title}>Laporan Kehadiran Siswa</Text>
//             <View style={{ position: 'relative', display: 'flex', alignItems: 'center', textAlign: 'center', margin: '10px 0' }}>
//               <Text>
//                 Mode: {mode === 'daily' ? 'Harian' : 'Bulanan'} {" - "} {mode === 'daily'
//                   ? `${date || 'Tanggal Tidak Diketahui'}`
//                   : `Periode: ${period || 'Periode Tidak Diketahui'}`}
//                 {"  "}
//                 (Total Siswa: {sortedAttendanceData.length})
//               </Text>
//             </View>
//             <Text style={pdfStyles.content}>
//               {schoolData?.namaSekolah}
//             </Text>
//             <View style={pdfStyles.table}>
//               <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
//                 {headers.map((header, index) => (
//                   <View
//                     key={index}
//                     style={[
//                       pdfStyles.tableCell,
//                       pdfStyles.tableHeader,
//                       { width: columnWidths[index] },
//                     ]}
//                   >
//                     <Text>{header}</Text>
//                   </View>
//                 ))}
//               </View>
//               {chunk.map((item, index) => {
//                 const isLate = item?.durasiKeterlambatan && item.durasiKeterlambatan !== '0 menit' && item.durasiKeterlambatan !== '-';
//                 return (
//                   <View style={[isLate ? pdfStyles.tableRowLate : pdfStyles.tableRow]} key={`${pageIndex}_${index}`} wrap={false}>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[0] }]}>
//                       <Text>{pageIndex * rowsPerPage + index + 1}</Text>
//                     </View>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[1] }]}>
//                       <Text>{item?.Nama || '-'}</Text>
//                     </View>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[2] }]}>
//                       <Text>{item?.NISN || '-'}</Text>
//                     </View>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[3] }]}>
//                       <Text>{item?.Kelas || '-'}</Text>
//                     </View>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[4] }]}>
//                       <Text>{item?.StatusKehadiran || '-'}</Text>
//                     </View>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[5] }]}>
//                       <View>
//                         <Text>
//                           {(item?.JamMasuk === '-' || item?.JamMasuk === null) ? '(Belum masuk)' : `(${item?.JamMasuk})`}
//                         </Text>
//                         <Text>
//                           {(item?.JamPulang === '-' || item?.JamPulang === null) ? '(Belum absen pulang)' : `(${item?.JamPulang})`}
//                         </Text>
//                       </View>
//                     </View>
//                     <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[6] }]}>
//                       <Text>{item?.durasiKeterlambatan || '-'}</Text>
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
// const generateStudentAttendancePDF = async ({
//   attendanceData,
//   alert,
//   schoolData,
//   schoolIsLoading,
//   mode,
//   date,
//   period,
// }: {
//   attendanceData: any[];
//   alert: { success: (msg: string) => void; error: (msg: string) => void } | undefined;
//   schoolData: any;
//   schoolIsLoading: boolean;
//   mode: 'daily' | 'monthly';
//   date?: string;
//   period?: string;
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
//     alert.error('Tidak ada data kehadiran untuk dihasilkan.');
//     return;
//   }

//   if (!schoolData || !schoolData.namaSekolah) {
//     alert.error('Data sekolah tidak lengkap.');
//     return;
//   }

//   try {
//     const doc = (
//       <StudentAttendancePDF
//         attendanceData={attendanceData}
//         schoolData={{
//           namaSekolah: schoolData.namaSekolah || 'Nama Sekolah',
//           kopSurat: schoolData.kopSurat || undefined,
//           namaKepalaSekolah: schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah',
//           ttdKepalaSekolah: schoolData.ttdKepalaSekolah || undefined,
//         }}
//         mode={mode}
//         date={date}
//         period={period}
//       />
//     );

//     const pdfInstance = pdf(doc);
//     const pdfBlob = await pdfInstance.toBlob();

//     const url = window.URL.createObjectURL(pdfBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `Laporan-Kehadiran-Siswa-${mode}-${dayjs().format('YYYYMMDD')}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);

//     alert.success('Laporan kehadiran siswa berhasil diunduh.');
//   } catch (error) {
//     console.error('Error generating attendance PDF:', error);
//     alert.error('Gagal menghasilkan laporan kehadiran siswa.');
//   }
// };

// export const StudentAttendance = () => {
//   const [selectedClass, setSelectedClass] = useState<string>('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [exportLoading, setExportLoading] = useState<{
//     csv: boolean;
//     excel: boolean;
//     pdf: boolean;
//   }>({ csv: false, excel: false, pdf: false });
//   const [dataMode, setDataMode] = useState<'daily' | 'monthly' | 'yearly'>('daily');
//   const [selectedYear, setSelectedYear] = useState<string>(dayjs().tz('Asia/Jakarta').format('YYYY'));
//   const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().tz('Asia/Jakarta').format('MM'));
//   const [searchParams] = useSearchParams();
//   const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
//     dayjs().tz('Asia/Jakarta').startOf('month').format('YYYY-MM')
//   );
//   const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
//     dayjs().tz('Asia/Jakarta').format('YYYY-MM')
//   );
//   const [pagination, setPagination] = useState<any>({
//     pageIndex: 0,
//     pageSize: 20,
//   });
//   const [fullData, setFullData] = useState<any[]>([]);

//   const years = Array.from(
//     { length: dayjs().year() - 2022 },
//     (_, i) => (dayjs().year() - i).toString()
//   );

//   const alert = useAlert();
//   const classRoom = useClassroom();

//   const attendance = useAttendanceNew({
//     mode: dataMode,
//     page: pagination.pageIndex + 1,
//     limit: pagination.pageSize,
//     namaKelas: selectedClass || undefined,
//   });

//   const fullAttendance = useAttendanceNew({
//     mode: dataMode,
//     page: 1,
//     limit: attendance?.data?.pagination?.total || 3000,
//     namaKelas: selectedClass || undefined,
//   });


//   console.log('fullAttendance.data.data', fullAttendance.data.data)

//   useEffect(() => {
//     if (fullAttendance?.data?.data) {
//       setFullData(fullAttendance.data.data);
//     }
//   }, [fullAttendance.data]);

//   console.log('dataMode', dataMode);
//   console.log('attedance', fullAttendance?.data);

//   const handlePaginationChange = (newPagination: any) => {
//     console.log('Memperbarui pagination:', newPagination);
//     setPagination(newPagination);
//   };

//   useEffect(() => {
//     const pageIndex = Number(searchParams.get('pageIndex')) || 0;
//     const pageSize = Number(searchParams.get('pageSize')) || 20;
//     console.log('Sinkronkan pagination dari URL:', { pageIndex, pageSize });
//     setPagination({ pageIndex, pageSize });
//   }, [searchParams]);

//   console.log('Data dari API (paginasi):', attendance.data);
//   console.log('Data lengkap:', fullData);
//   console.log('State Pagination:', pagination);

//   const schoolData = useSchool();

//   useEffect(() => {
//     const start = dayjs(selectedStartMonth, 'YYYY-MM');
//     const end = dayjs(selectedEndMonth, 'YYYY-MM');
//     if (end.isBefore(start)) {
//       setSelectedEndMonth(start.format('YYYY-MM'));
//       alert.error('Bulan akhir tidak boleh lebih kecil dari bulan awal.');
//     }
//   }, [selectedStartMonth, selectedEndMonth, alert]);

//   const months = [
//     { value: '01', label: 'January' },
//     { value: '02', label: 'February' },
//     { value: '03', label: 'March' },
//     { value: '04', label: 'April' },
//     { value: '05', label: 'May' },
//     { value: '06', label: 'June' },
//     { value: '07', label: 'July' },
//     { value: '08', label: 'August' },
//     { value: '09', label: 'September' },
//     { value: '10', label: 'October' },
//     { value: '11', label: 'November' },
//     { value: '12', label: 'December' },
//   ];

//   useEffect(() => {
//     localStorage.setItem("attendanceTarget", "students");
//   }, []);

//   const formatJamMasuk = (isoString?: string) => {
//     if (!isoString) return '-';
//     try {
//       const date = new Date(isoString);
//       return format(date, 'HH:mm:ss');
//     } catch (error) {
//       console.error('Error formatting jamMasuk:', error);
//       return '-';
//     }
//   };

//   const formatTime = (time?: string) => {
//     return time
//       ? dayjs(time).tz('Asia/Jakarta').format('DD MMM YYYY, HH:mm:ss')
//       : '-';
//   };

//   // Format dan urutkan data berdasarkan durasiKeterlambatan
//   const filteredData = useMemo(() => {
//     let dataToFilter = fullData;

//     if (Array.isArray(dataToFilter)) {
//       const todayDate = dayjs().tz('Asia/Jakarta').format('DD MMMM YYYY');

//       let formatted = dataToFilter.map((attendance) => ({
//         user: {
//           name: attendance.siswa?.nama || '-',
//           nis: attendance.siswa?.nis || '-',
//           nisn: attendance.siswa?.nisn,
//           image: attendance.siswa?.image,
//           sekolah: {
//             namaSekolah: schoolData?.data?.[0]?.namaSekolah || '-',
//           },
//         },
//         kelas: {
//           namaKelas: attendance.namaKelas || attendance?.kelas || '-',
//         },
//         attendance: {
//           jamMasuk: formatJamMasuk(attendance.jamMasuk),
//           jamPulang: formatJamMasuk(attendance.jamPulang),
//           statusKehadiran: attendance.statusKehadiran || '-',
//           fotoMasuk: attendance.fotoAbsenMasuk || '-',
//           fotoPulang: attendance.fotoAbsenPulang || '-',
//           jenisAbsen: attendance.jenisAbsen || '-',
//           tanggalMasuk: dataMode === 'daily' ? todayDate : dayjs(attendance.jamMasuk).tz('Asia/Jakarta').format('DD MMMM YYYY'),
//           foto: null,
//           durasiKeterlambatan: (() => {
//             if (!attendance.jamMasuk || attendance.jamMasuk === '-') return '-';
//             let hours, minutes, seconds;
//             const jamMasuk = formatJamMasuk(attendance.jamMasuk);
//             if (jamMasuk.includes(',')) {
//               const timePart = jamMasuk.split(', ')[1];
//               [hours, minutes, seconds] = timePart.split(':').map(Number);
//             } else {
//               [hours, minutes, seconds] = jamMasuk.split(':').map(Number);
//             }
//             const entryTime = new Date(2025, 0, 1, hours, minutes, seconds);
//             const standardTime = new Date(2025, 0, 1, 7, 0, 0);
//             if (entryTime <= standardTime) return '0 menit';
//             const diffMinutes = Math.floor((entryTime - standardTime) / 1000 / 60);
//             return `${diffMinutes} menit`;
//           })(),
//         },
//       }));

//       // Urutkan berdasarkan durasiKeterlambatan
//       formatted = formatted.sort((a, b) => {
//         const delayA = a.attendance.durasiKeterlambatan === '-' || a.attendance.durasiKeterlambatan === '0 menit' ? 0 : parseInt(a.attendance.durasiKeterlambatan);
//         const delayB = b.attendance.durasiKeterlambatan === '-' || b.attendance.durasiKeterlambatan === '0 menit' ? 0 : parseInt(b.attendance.durasiKeterlambatan);
//         return delayB - delayA; // Terlambat terbesar di atas
//       });

//       // Terapkan paginasi client-side
//       const startIndex = pagination.pageIndex * pagination.pageSize;
//       return formatted.slice(startIndex, startIndex + pagination.pageSize);
//     }
//     return [];
//   }, [dataMode, fullData, selectedStartMonth, selectedEndMonth, selectedYear, schoolData, pagination]);

//   console.log('fullData', fullData)

//   const totalFilteredItems = useMemo(() => {
//     return Array.isArray(fullData) ? fullData.length : 0;
//   }, [fullData]);

//   const pageCount = Math.ceil(totalFilteredItems / pagination.pageSize);

//   useEffect(() => {
//     setPagination((prev) => ({ ...prev, pageIndex: 0 }));
//   }, [selectedClass]);

//   useEffect(() => {
//     setIsLoading(attendance.isLoading || fullAttendance.isLoading);
//   }, [attendance.isLoading, fullAttendance.isLoading]);

//   const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
//     if (totalFilteredItems === 0) {
//       alert.error('Tidak ada data untuk diekspor.');
//       return;
//     }

//     setExportLoading((prev) => ({ ...prev, [format]: true }));

//     const exportData = fullData.map((data, index) => {
//       const calculateDelay = (jamMasuk) => {
//         if (!jamMasuk || jamMasuk === '-') return '-';
//         let hours, minutes, seconds;
//         if (jamMasuk.includes(',')) {
//           const timePart = jamMasuk.split(', ')[1];
//           [hours, minutes, seconds] = timePart.split(':').map(Number);
//         } else {
//           [hours, minutes, seconds] = jamMasuk.split(':').map(Number);
//         }
//         const entryTime = new Date(2025, 0, 1, hours, minutes, seconds);
//         const standardTime = new Date(2025, 0, 1, 7, 0, 0);
//         if (entryTime <= standardTime) return '0 menit';
//         const diffMinutes = Math.floor((entryTime - standardTime) / 1000 / 60);
//         return `${diffMinutes} menit`;
//       };

//       const formattedData = {
//         No: index + 1,
//         Nama: data.siswa?.nama || '',
//         NIS: data.siswa?.nis || '',
//         NISN: data.siswa?.nisn || '',
//         Kelas: data.namaKelas || data.kelas || '-',
//         Sekolah: schoolData?.data?.[0]?.namaSekolah || '-',
//         StatusKehadiran: data.statusKehadiran || '-',
//         ...(dataMode === 'daily'
//           ? {
//               TanggalMasuk: dayjs().tz('Asia/Jakarta').format('DD MMMM YYYY'),
//               JamMasuk: formatJamMasuk(data.jamMasuk),
//               JamPulang: formatJamMasuk(data.jamPulang),
//               durasiKeterlambatan: calculateDelay(formatJamMasuk(data.jamMasuk)),
//             }
//           : {
//               JamMasuk: formatJamMasuk(data.jamMasuk),
//               JamPulang: formatJamMasuk(data.jamPulang),
//               durasiKeterlambatan: calculateDelay(formatJamMasuk(data.jamMasuk)),
//             }),
//       };

//       return formattedData;
//     }).sort((a, b) => {
//       const delayA = a.durasiKeterlambatan === '-' || a.durasiKeterlambatan === '0 menit' ? 0 : parseInt(a.durasiKeterlambatan);
//       const delayB = b.durasiKeterlambatan === '-' || b.durasiKeterlambatan === '0 menit' ? 0 : parseInt(b.durasiKeterlambatan);
//       return delayB - delayA; // Terlambat terbesar di atas
//     });

//     if (format === 'csv') {
//       const csv = Papa.unparse(exportData, { delimiter: ';' });
//       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = `attendance_data_${dataMode}_${dayjs().format('YYYYMMDD')}.csv`;
//       link.click();
//     } else if (format === 'excel') {
//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
//       XLSX.writeFile(wb, `attendance_data_${dataMode}_${dayjs().format('YYYYMMDD')}.xlsx`);
//     } else if (format === 'pdf') {
//       await generateStudentAttendancePDF({
//         attendanceData: exportData,
//         alert,
//         schoolData: schoolData?.data?.[0] || {},
//         schoolIsLoading: schoolData?.isLoading,
//         mode: dataMode,
//         date: dataMode === 'daily' ? dayjs().tz('Asia/Jakarta').format('DD MMMM YYYY') : undefined,
//         period: dataMode === 'monthly' ? `${dayjs(selectedStartMonth).format('MMMM, YYYY')}` : undefined,
//       });
//     }

//     setIsModalOpen(false);
//     setSelectedClass('');
//     setExportLoading((prev) => ({ ...prev, [format]: false }));
//   };

//   console.log('totalFiltered', totalFilteredItems)

//   const attendanceCount = totalFilteredItems;
//   const validJamPulangCount = filteredData.filter(
//     (student) =>
//       student.attendance?.jamPulang &&
//       !['-', null].includes(student.attendance.jamPulang)
//   ).length;

//   return (
//     <DashboardPageLayout
//       siteTitle={`${lang.text('studentAttendance')} | ${APP_CONFIG.appName}`}
//       breadcrumbs={[
//         { label: lang.text('studentAttendance'), url: '/students' },
//       ]}
//       title={lang.text('studentAttendance')}
//     >
//       <div className="flex justify-between items-center mb-4 space-x-4">
//         <div className="flex items-center space-x-4">
//           <Button
//             variant="outline"
//             onClick={() => setIsModalOpen(true)}
//             className="px-4 py-2 bg-red-600 text-white rounded-lg transition duration-300"
//           >
//             {lang.text('export')} Data
//             <FaFile />
//           </Button>
//           <div className="flex gap-4">
//             <Select value={dataMode} onValueChange={(value: 'daily' | 'monthly' | 'yearly') => setDataMode(value)}>
//               <SelectTrigger className="w-[120px]">
//                 <SelectValue placeholder="Pilih mode" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="daily">{lang.text('daily')}</SelectItem>
//                 <SelectItem value="monthly">{lang.text('monthly')}</SelectItem>
//                 <SelectItem value="yearly">{lang.text('yearly')}</SelectItem>
//               </SelectContent>
//             </Select>
//             {dataMode === 'monthly' && (
//               <div className="flex gap-2">
//                 <div className="flex gap-2">
//                   <Select
//                     value={selectedStartMonth.split('-')[1]}
//                     onValueChange={(value: string) =>
//                       setSelectedStartMonth(`${selectedStartMonth.split('-')[0]}-${value}`)
//                     }
//                   >
//                     <SelectTrigger className="w-[140px]">
//                       <SelectValue placeholder="Pilih bulan awal" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {months.map((month) => (
//                         <SelectItem key={month.value} value={month.value}>
//                           {month.label.toLowerCase()}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <Select
//                     value={selectedStartMonth.split('-')[0]}
//                     onValueChange={(value: string) =>
//                       setSelectedStartMonth(`${value}-${selectedStartMonth.split('-')[1]}`)
//                     }
//                   >
//                     <SelectTrigger className="w-[120px]">
//                       <SelectValue placeholder="Pilih tahun awal" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {years.map((year) => (
//                         <SelectItem key={year} value={year}>
//                           {year}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <span className="text-white mt-2">-</span>
//                 <div className="flex gap-2">
//                   <Select
//                     value={selectedEndMonth.split('-')[1]}
//                     onValueChange={(value: string) =>
//                       setSelectedEndMonth(`${selectedEndMonth.split('-')[0]}-${value}`)
//                     }
//                   >
//                     <SelectTrigger className="w-[140px]">
//                       <SelectValue placeholder="Pilih bulan akhir" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {months.map((month) => (
//                         <SelectItem key={month.value} value={month.value}>
//                           {month.label.toLowerCase()}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <Select
//                     value={selectedEndMonth.split('-')[0]}
//                     onValueChange={(value: string) =>
//                       setSelectedEndMonth(`${value}-${selectedEndMonth.split('-')[1]}`)
//                     }
//                   >
//                     <SelectTrigger className="w-[120px]">
//                       <SelectValue placeholder="Pilih tahun akhir" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {years.map((year) => (
//                         <SelectItem key={year} value={year}>
//                           {year}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             )}
//             {dataMode === 'yearly' && (
//               <Select value={selectedYear} onValueChange={(value: string) => setSelectedYear(value)}>
//                 <SelectTrigger className="w-[120px]">
//                   <SelectValue placeholder="Pilih tahun" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {years.map((year) => (
//                     <SelectItem key={year} value={year}>
//                       {year}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center gap-5">
//           {dataMode === 'daily' && (
//             <Button
//               variant="outline"
//               aria-label="attendanceCount"
//               className="hover:bg-transparent cursor-default"
//             >
//               {lang.text('presentToday')}:
//               <div className="w-[1px] h-[10px] bg-white mx-1"></div>
//               {attendanceCount}
//             </Button>
//           )}
//           <Button
//             variant="outline"
//             aria-label="attendanceCount"
//             className="hover:border-red-800 hover:bg-transparent border border-red-800 text-red-300 hover:text-red-300 cursor-default"
//           >
//             {lang.text('studentOut')}:
//             <div className="w-[1px] h-[10px] bg-red-300 mx-1"></div>
//             {validJamPulangCount}
//           </Button>
//         </div>
//       </div>
//       <StudentAttendanceTable
//         data={filteredData}
//         isLoading={isLoading}
//         mode={dataMode}
//         onPaginationChange={handlePaginationChange}
//         pageCount={pageCount}
//         initialState={{
//           sorting: [
//             {
//               id: 'attendance.durasiKeterlambatan',
//               desc: true, // Urutkan dari keterlambatan terbesar ke terkecil
//             },
//           ],
//         }}
//       />
//       <div className="pb-16 sm:pb-0" />

//       {isModalOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
//           onClick={() => { setIsModalOpen(false); setSelectedClass(''); }}
//         >
//           <div
//             className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-lg"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-lg font-semibold mb-4">Export & Filter</h2>
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
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">
//                 Pilih Kelas
//               </label>
//               <select
//                 value={selectedClass}
//                 onChange={(e) => setSelectedClass(e.target.value)}
//                 className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
//               >
//                 <option value="">Semua Kelas</option>
//                 {classRoom?.data?.map((kelas) => (
//                   <option key={kelas?.id} value={kelas?.namaKelas}>
//                     {kelas?.namaKelas}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex space-x-4">
//               {/* <button
//                 onClick={() => handleExport('csv')}
//                 className={`flex active:scale-[0.98] hover:brightness-95 items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full ${
//                   exportLoading.csv ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//                 disabled={exportLoading.csv}
//               >
//                 Export CSV
//               </button> */}
//               <button
//                 onClick={() => handleExport('excel')}
//                 className={`flex active:scale-[0.98] hover:brightness-95 items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 w-full ${
//                   exportLoading.excel ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//                 disabled={exportLoading.excel}
//               >
//                 Export Excel
//               </button>
//               <button
//                 onClick={() => handleExport('pdf')}
//                 className={`flex active:scale-[0.98] hover:brightness-95 items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 w-full ${
//                   exportLoading.pdf ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//                 disabled={exportLoading.pdf}
//               >
//                 Export PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </DashboardPageLayout>
//   );
// };





import { APP_CONFIG } from '@/core/configs';
import { Button, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/libs';
import { getStaticFile } from '@/core/utils';
import { DashboardPageLayout, useAlert } from '@/features/_global';
import { useClassroom } from '@/features/classroom';
import { useSchool } from '@/features/schools';
import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useState } from 'react';
import { FaFile } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { StudentAttendanceTable } from '../containers';
import { useAttendanceNew } from '../hooks/use-attedanceMonth';

// === DAYJS EXTENSIONS ===
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

// === PDF STYLES ===
const pdfStyles = StyleSheet.create({
  page: { fontSize: 12, fontFamily: 'Times-Roman' },
  header: { position: 'relative', top: 0, left: 0, right: 0, marginBottom: 20 },
  headerImage: { width: 595, maxHeight: 150, objectFit: 'contain' },
  contentWrapper: { paddingLeft: 32, paddingRight: 32, marginTop: 10 },
  title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, textTransform: 'uppercase' },
  content: { marginBottom: 10, textAlign: 'center', lineHeight: 1.5 },
  table: { display: 'flex', flexDirection: 'column', borderStyle: 'solid', borderWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  tableRowLate: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', backgroundColor: '#FF3A3A', color: '#FFFFFF' },
  tableCell: { padding: 5, borderRightWidth: 1, fontSize: 10, borderRightColor: '#000', textAlign: 'center' },
  tableCellLate: { padding: 5, borderRightWidth: 1, fontSize: 10, borderRightColor: '#000', textAlign: 'center', color: '#FFFFFF' },
  tableHeader: { fontSize: 10, fontWeight: 'bold', backgroundColor: '#f0f0f0' },
  signature: { marginTop: 50, alignItems: 'flex-end' },
  signatureImage: { width: 120, height: 'auto', maxHeight: 50, marginTop: 20, marginBottom: 10 },
  signatureText: { textAlign: 'center' },
});

// === PDF COMPONENT ===
const StudentAttendancePDF = ({ attendanceData, schoolData, mode, date, period }) => {
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
  const sortedAttendanceData = [...attendanceData].sort((a, b) => {
    const delayA = a.durasiKeterlambatan === '-' || a.durasiKeterlambatan === '0 menit' ? 0 : parseInt(a.durasiKeterlambatan);
    const delayB = b.durasiKeterlambatan === '-' || b.durasiKeterlambatan === '0 menit' ? 0 : parseInt(b.durasiKeterlambatan);
    return delayB - delayA;
  });

  const dataChunks = [];
  for (let i = 0; i < sortedAttendanceData.length; i += rowsPerPage) {
    const chunk = sortedAttendanceData.slice(i, i + rowsPerPage);
    if (chunk.length > 0) dataChunks.push(chunk);
  }

  const headers = ['No', 'Nama', 'NISN', 'Kelas', 'Status', 'Jam Masuk-Pulang', 'Telat'];
  const columnWidths = ['5%', '20%', '15%', '12%', '12%', '24%', '12%'];

  return (
    <Document>
      {dataChunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pdfStyles.page} break={pageIndex > 0}>
          <View style={pdfStyles.header} fixed>
            {kopSuratUrl && <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Kehadiran Siswa</Text>
            <View style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
              <Text>
                Mode: {mode === 'daily' ? 'Harian' : 'Bulanan'} -{' '}
                {mode === 'daily' ? date || 'Tanggal Tidak Diketahui' : `Periode: ${period || 'Periode Tidak Diketahui'}`}
                {'  '}(Total Siswa: {sortedAttendanceData.length})
              </Text>
            </View>
            <Text style={pdfStyles.content}>{schoolData?.namaSekolah}</Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {headers.map((header, index) => (
                  <View key={index} style={[pdfStyles.tableCell, pdfStyles.tableHeader, { width: columnWidths[index] }]}>
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => {
                const isLate = item?.durasiKeterlambatan && item.durasiKeterlambatan !== '0 menit' && item.durasiKeterlambatan !== '-';
                return (
                  <View style={[isLate ? pdfStyles.tableRowLate : pdfStyles.tableRow]} key={`${pageIndex}_${index}`} wrap={false}>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[0] }]}>
                      <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                    </View>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[1] }]}>
                      <Text>{item?.Nama || '-'}</Text>
                    </View>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[2] }]}>
                      <Text>{item?.NISN || '-'}</Text>
                    </View>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[3] }]}>
                      <Text>{item?.Kelas || '-'}</Text>
                    </View>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[4] }]}>
                      <Text>{item?.StatusKehadiran || '-'}</Text>
                    </View>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[5] }]}>
                      <View>
                        <Text>{(item?.JamMasuk === '-' || item?.JamMasuk === null) ? '(Belum masuk)' : `(${item?.JamMasuk})`}</Text>
                        <Text>{(item?.JamPulang === '-' || item?.JamPulang === null) ? '(Belum absen pulang)' : `(${item?.JamPulang})`}</Text>
                      </View>
                    </View>
                    <View style={[isLate ? pdfStyles.tableCellLate : pdfStyles.tableCell, { width: columnWidths[6] }]}>
                      <Text>{item?.durasiKeterlambatan || '-'}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles.signature}>
                <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                {signatureUrl && <Image src={signatureUrl} style={pdfStyles.signatureImage} />}
                <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah'}</Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

// === GENERATE PDF ===
const generateStudentAttendancePDF = async ({
  attendanceData,
  alert,
  schoolData,
  schoolIsLoading,
  mode,
  date,
  period,
}) => {
  if (!alert) return;
  if (schoolIsLoading) return alert.error('Data sekolah masih dimuat.');
  if (!attendanceData?.length) return alert.error('Tidak ada data kehadiran.');
  if (!schoolData?.namaSekolah) return alert.error('Data sekolah tidak lengkap.');

  try {
    const doc = (
      <StudentAttendancePDF
        attendanceData={attendanceData}
        schoolData={{
          namaSekolah: schoolData.namaSekolah || 'Nama Sekolah',
          kopSurat: schoolData.kopSurat,
          namaKepalaSekolah: schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah',
          ttdKepalaSekolah: schoolData.ttdKepalaSekolah,
        }}
        mode={mode}
        date={date}
        period={period}
      />
    );

    const pdfBlob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-Kehadiran-Siswa-${mode}-${dayjs().format('YYYYMMDD')}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    alert.success('Laporan berhasil diunduh.');
  } catch (error) {
    console.error(error);
    alert.error('Gagal menghasilkan PDF.');
  }
};

// === MAIN COMPONENT ===
export const StudentAttendance = () => {
  const [selectedKelasId, setSelectedKelasId] = useState<string>('');
  const [searchNamaKelas, setSearchNamaKelas] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState({ excel: false, pdf: false });
  const [dataMode, setDataMode] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [selectedYear, setSelectedYear] = useState<string>(dayjs().tz('Asia/Jakarta').format('YYYY'));
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(dayjs().tz('Asia/Jakarta').startOf('month').format('YYYY-MM'));
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(dayjs().tz('Asia/Jakarta').format('YYYY-MM'));
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [fullData, setFullData] = useState<any[]>([]);
  const [searchParams] = useSearchParams();

  const years = Array.from({ length: dayjs().year() - 2022 }, (_, i) => (dayjs().year() - i).toString());
  const alert = useAlert();
  const classRoom = useClassroom();
  const schoolData = useSchool();

  // === API HOOKS ===
  const attendance = useAttendanceNew({
    mode: dataMode,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    kelasId: selectedKelasId || undefined,
    namaKelas: searchNamaKelas || undefined,
  });

  const fullAttendance = useAttendanceNew({
    mode: dataMode,
    page: 1,
    limit: attendance?.data?.pagination?.total || 20,
    kelasId: selectedKelasId || undefined,
    namaKelas: searchNamaKelas || undefined,
  });

  useEffect(() => {
    if (fullAttendance?.data?.data) setFullData(fullAttendance.data.data);
  }, [fullAttendance.data]);

  useEffect(() => {
    const pageIndex = Number(searchParams.get('pageIndex')) || 0;
    const pageSize = Number(searchParams.get('pageSize')) || 20;
    setPagination({ pageIndex, pageSize });
  }, [searchParams]);

  useEffect(() => {
    const start = dayjs(selectedStartMonth);
    const end = dayjs(selectedEndMonth);
    if (end.isBefore(start)) {
      setSelectedEndMonth(start.format('YYYY-MM'));
      alert.error('Bulan akhir tidak boleh lebih kecil dari bulan awal.');
    }
  }, [selectedStartMonth, selectedEndMonth, alert]);

  useEffect(() => {
    localStorage.setItem("attendanceTarget", "students");
  }, []);

  useEffect(() => {
    setIsLoading(attendance.isLoading || fullAttendance.isLoading);
  }, [attendance.isLoading, fullAttendance.isLoading]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [selectedKelasId, searchNamaKelas, dataMode, selectedStartMonth, selectedEndMonth, selectedYear]);

  const handlePaginationChange = (newPagination: any) => setPagination(newPagination);

  const formatJamMasuk = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      return format(new Date(isoString), 'HH:mm:ss');
    } catch {
      return '-';
    }
  };

  // === FORMAT DATA UNTUK TABEL ===
  const filteredData = useMemo(() => {
    if (!Array.isArray(fullData)) return [];
    const today = dayjs().tz('Asia/Jakarta').format('DD MMMM YYYY');

    const formatted = fullData.map(att => ({
      user: { name: att.siswa?.nama || '-', nisn: att.siswa?.nisn, image: att.siswa?.image },
      kelas: { namaKelas: att.namaKelas || att.kelas || '-' },
      attendance: {
        jamMasuk: formatJamMasuk(att.jamMasuk),
        jamPulang: formatJamMasuk(att.jamPulang),
        statusKehadiran: att.statusKehadiran || '-',
        tanggalMasuk: dataMode === 'daily' ? today : dayjs(att.jamMasuk).tz('Asia/Jakarta').format('DD MMMM YYYY'),
        durasiKeterlambatan: (() => {
          const jam = formatJamMasuk(att.jamMasuk);
          if (!jam || jam === '-') return '-';
          const [h, m, s] = jam.split(':').map(Number);
          const entry = new Date(2025, 0, 1, h, m, s);
          const standard = new Date(2025, 0, 1, 7, 0, 0);
          if (entry <= standard) return '0 menit';
          return `${Math.floor((entry.getTime() - standard.getTime()) / 60000)} menit`;
        })(),
      },
    }));

    return formatted
      .sort((a, b) => {
        const da = a.attendance.durasiKeterlambatan === '-' || a.attendance.durasiKeterlambatan === '0 menit' ? 0 : parseInt(a.attendance.durasiKeterlambatan);
        const db = b.attendance.durasiKeterlambatan === '-' || b.attendance.durasiKeterlambatan === '0 menit' ? 0 : parseInt(b.attendance.durasiKeterlambatan);
        return db - da;
      })
      .slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);
  }, [fullData, dataMode, pagination]);

  const totalFilteredItems = fullData.length;
  const pageCount = Math.ceil(totalFilteredItems / pagination.pageSize);
  const attendanceCount = totalFilteredItems;
  const validJamPulangCount = filteredData.filter(s => s.attendance.jamPulang && s.attendance.jamPulang !== '-').length;

  // === EXPORT HANDLER ===
  const handleExport = async (format: 'excel' | 'pdf') => {
    if (totalFilteredItems === 0) return alert.error('Tidak ada data untuk diekspor.');
    setExportLoading(prev => ({ ...prev, [format]: true }));

    const exportData = fullData.map((d, i) => {
      const delay = (() => {
        const jam = formatJamMasuk(d.jamMasuk);
        if (!jam || jam === '-') return '-';
        const [h, m, s] = jam.split(':').map(Number);
        const entry = new Date(2025, 0, 1, h, m, s);
        const standard = new Date(2025, 0, 1, 7, 0, 0);
        if (entry <= standard) return '0 menit';
        return `${Math.floor((entry.getTime() - standard.getTime()) / 60000)} menit`;
      })();

      return {
        No: i + 1,
        Nama: d.siswa?.nama || '',
        NISN: d.siswa?.nisn || '',
        Kelas: d.namaKelas || d.kelas || '-',
        StatusKehadiran: d.statusKehadiran || '-',
        JamMasuk: formatJamMasuk(d.jamMasuk),
        JamPulang: formatJamMasuk(d.jamPulang),
        durasiKeterlambatan: delay,
      };
    }).sort((a, b) => {
      const da = a.durasiKeterlambatan === '-' || a.durasiKeterlambatan === '0 menit' ? 0 : parseInt(a.durasiKeterlambatan);
      const db = b.durasiKeterlambatan === '-' || b.durasiKeterlambatan === '0 menit' ? 0 : parseInt(b.durasiKeterlambatan);
      return db - da;
    });

    if (format === 'excel') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
      XLSX.writeFile(wb, `attendance_${dataMode}_${dayjs().format('YYYYMMDD')}.xlsx`);
    } else if (format === 'pdf') {
      await generateStudentAttendancePDF({
        attendanceData: exportData,
        alert,
        schoolData: schoolData?.data?.[0] || {},
        schoolIsLoading: schoolData?.isLoading,
        mode: dataMode,
        date: dataMode === 'daily' ? dayjs().tz('Asia/Jakarta').format('DD MMMM YYYY') : undefined,
        period: dataMode === 'monthly' ? `${dayjs(selectedStartMonth).format('MMMM YYYY')} - ${dayjs(selectedEndMonth).format('MMMM YYYY')}` : undefined,
      });
    }

    setIsModalOpen(false);
    setExportLoading(prev => ({ ...prev, [format]: false }));
  };

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('studentAttendance')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: lang.text('studentAttendance'), url: '/students' }]}
      title={lang.text('studentAttendance')}
    >
      {/* HEADER: FILTER + EXPORT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">

        {/* DROPDOWN KELAS (ID) */}
        <Select
          value={selectedKelasId}
          onValueChange={(val) => setSelectedKelasId(val ?? '')}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Pilih Kelas (ID)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Semua Kelas</SelectItem>
            {classRoom?.data?.map(kelas => (
              <SelectItem key={kelas.id} value={kelas.id}>
                {kelas.namaKelas}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

          {/* INPUT SEARCH NAMA KELAS */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama kelas..."
              value={searchNamaKelas}
              onChange={(e) => setSearchNamaKelas(e.target.value)}
              className="w-[220px] pl-10 pr-4 py-1 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* MODE */}
          <Select value={dataMode} onValueChange={v => setDataMode(v)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{lang.text('daily')}</SelectItem>
              <SelectItem value="monthly">{lang.text('monthly')}</SelectItem>
              <SelectItem value="yearly">{lang.text('yearly')}</SelectItem>
            </SelectContent>
          </Select>

          {/* BULANAN */}
          {dataMode === 'monthly' && (
            <div className="flex items-center gap-2">
              <input type="month" value={selectedStartMonth} onChange={e => setSelectedStartMonth(e.target.value)} className="bg-gray-800 text-white p-1.5 rounded border border-gray-700 text-sm" />
              <span className="text-gray-400">—</span>
              <input type="month" value={selectedEndMonth} onChange={e => setSelectedEndMonth(e.target.value)} className="bg-gray-800 text-white p-1.5 rounded border border-gray-700 text-sm" />
            </div>
          )}

          {/* TAHUNAN */}
          {dataMode === 'yearly' && (
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
          >
            {lang.text('export')} <FaFile />
          </Button>

          {dataMode === 'daily' && (
            <div className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm">
              {lang.text('presentToday')}: <strong>{attendanceCount}</strong>
            </div>
          )}
          <div className="bg-red-900 text-red-300 px-3 py-1.5 rounded text-sm">
            {lang.text('studentOut')}: <strong>{validJamPulangCount}</strong>
          </div>
        </div>
      </div>

      {/* INDIKATOR FILTER AKTIF */}
      {(selectedKelasId || searchNamaKelas) && (
        <div className="text-sm text-gray-300 mb-3">
          Filter aktif:{' '}
          {selectedKelasId && (
            <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded mr-2">
              ID: {selectedKelasId}
            </span>
          )}
          {searchNamaKelas && (
            <span className="bg-green-900 text-green-300 px-2 py-1 rounded">
              Nama: "{searchNamaKelas}"
            </span>
          )}
        </div>
      )}

      {/* TABEL */}
      <StudentAttendanceTable
        data={filteredData}
        isLoading={isLoading}
        mode={dataMode}
        onPaginationChange={handlePaginationChange}
        pageCount={pageCount}
        initialState={{ sorting: [{ id: 'attendance.durasiKeterlambatan', desc: true }] }}
      />

      <div className="pb-16 sm:pb-0" />

      {/* MODAL EXPORT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setIsModalOpen(false)}>
          <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Export Data</h2>

            {dataMode === 'monthly' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rentang Bulan</label>
                <div className="flex gap-2">
                  <input type="month" value={selectedStartMonth} onChange={e => setSelectedStartMonth(e.target.value)} className="bg-gray-800 p-2 rounded border border-gray-700 flex-1" />
                  <span className="self-center">—</span>
                  <input type="month" value={selectedEndMonth} onChange={e => setSelectedEndMonth(e.target.value)} className="bg-gray-800 p-2 rounded border border-gray-700 flex-1" />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Cari Nama Kelas (Opsional)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ketik nama kelas..."
                  value={searchNamaKelas}
                  onChange={(e) => setSearchNamaKelas(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleExport('excel')}
                disabled={exportLoading.excel}
                className={`flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition ${exportLoading.excel ? 'opacity-50' : ''}`}
              >
                {exportLoading.excel ? 'Memproses...' : 'Export Excel'}
              </button>
              <button
                onClick={() => handleExport('pdf')}
                disabled={exportLoading.pdf}
                className={`flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition ${exportLoading.pdf ? 'opacity-50' : ''}`}
              >
                {exportLoading.pdf ? 'Memproses...' : 'Export PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
};