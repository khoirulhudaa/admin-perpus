import { APP_CONFIG } from '@/core/configs';
import { Badge, Button, Input, Label, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/libs';
import { getStaticFile } from '@/core/utils';
import { DashboardPageLayout } from '@/features/_global';
import { useClassroom } from '@/features/classroom';
import { useCourse } from '@/features/course';
import { useSchool } from '@/features/schools';
import { useBiodata } from '@/features/user/hooks';
import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { useEffect, useMemo, useState } from 'react';
import { FaFile } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { MatpelAttendanceTable } from '../containers/matpelAttedance';

// Konfigurasi dayjs untuk timezone
dayjs.extend(utc);
dayjs.extend(timezone);

// Gaya PDF
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
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  tableHeader: {
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf',
  },
  tableCell: {
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf',
    fontSize: 10,
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

// Komponen PDF untuk laporan kehadiran
const AttendanceReportPDF: React.FC<{
  data: any[];
  schoolData: { kopSurat?: string; namaSekolah?: string; namaKepalaSekolah?: string; ttdKepalaSekolah?: string };
  dateRange: string;
}> = ({ data, schoolData, dateRange }) => {
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

  const title = dateRange === 'today'
    ? 'Laporan Kehadiran MatPel Hari Ini'
    : dateRange === 'month'
    ? 'Laporan Kehadiran MatPel Bulan Ini'
    : 'Laporan Kehadiran MatPel 2025';

  // Bagi data menjadi kelompok untuk setiap halaman
  const rowsPerPage = 25; // Disesuaikan untuk tinggi halaman
  const dataChunks = [];
  for (let i = 0; i < data.length; i += rowsPerPage) {
    const chunk = data.slice(i, i + rowsPerPage);
    if (chunk.length > 0) {
      dataChunks.push(chunk);
    }
  }
  console.log('Data Chunks:', dataChunks); // Debugging

  return (
    <Document>
      {dataChunks.map((chunk, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={pdfStyles.page}
          break={pageIndex > 0} // Page break untuk halaman setelah pertama
        >
          {/* Header Kop Surat */}
          {kopSuratUrl && (
            <View style={pdfStyles.header} fixed>
              <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
            </View>
          )}

          <View style={pdfStyles.contentWrapper}>
            {/* Judul */}
            <Text style={pdfStyles.title}>{title}</Text>

            {/* Tabel */}
            <View style={pdfStyles.table}>
              {/* Table Header */}
              <View style={pdfStyles.tableRow} fixed>
                {[
                  'No',
                  'Nama',
                  'NISN',
                  'Kelas',
                  'Mata Pelajaran',
                  'Status',
                  'Jam Masuk',
                ].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableHeader,
                      {
                        width:
                          index === 0
                            ? '5%'
                            : index === 1
                            ? '20%'
                            : index === 2
                            ? '15%'
                            : index === 3
                            ? '10%'
                            : index === 4
                            ? '20%'
                            : index === 5
                            ? '15%'
                            : '15%',
                      },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>

              {/* Table Body */}
              {chunk.map((item, index) => (
                <View style={pdfStyles.tableRow} key={index} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: '5%' }]}>
                    <Text>{item.No}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '20%' }]}>
                    <Text>{item.Nama}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item.NISN}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '10%' }]}>
                    <Text>{item.Kelas}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '20%' }]}>
                    <Text>{item.MataPelajaran}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item.StatusKehadiran}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item.JamMasuk}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Tanda Tangan (hanya di halaman terakhir) */}
            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles.signature}>
                <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                {signatureUrl && (
                  <Image src={signatureUrl} style={pdfStyles.signatureImage} />
                )}
                <Text style={pdfStyles.signatureText}>
                  {schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah'}
                </Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export const MatkulAttendance = () => {
  const [selectedClasses, setSelectedClasses] = useState<string>('all');
  const [searchStudentName, setSearchStudentName] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('today');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listClassRoom, setListClassRoom] = useState<any[]>([]);
  const [loadingPDF, setLoadingPDF] = useState<string>('');

  const resource = useCourse();
  const biodata = useBiodata();
  const classRoom = useClassroom();
  const school = useSchool();

  console.log("school.data", school.data)
  console.log("biodata data", biodata?.data)

  useEffect(() => {
    localStorage.setItem('attendanceTarget', 'students');
  }, []);

  const formatTime = (time?: string) => {
    return time
      ? dayjs(time).tz('Asia/Jakarta').format('DD MMM YYYY, HH:mm:ss')
      : 'N/A';
  };

  useMemo(() => {
    setListClassRoom(classRoom?.data || []);
  }, [classRoom.data]);

  const courseOptions = useMemo(() => {
    return Array.from(
      new Set(resource.data?.map((course) => course.namaMataPelajaran) || []),
    );
  }, [resource.data]);

  console.log('biodata.datasasas', biodata.data)

  // Versi tahun, bulan, harian
  // const filteredData = useMemo(() => {
  //   let rawData = biodata.data;

  //   // Jika string, coba parse ke objek
  //   if (typeof rawData === 'string') {
  //     try {
  //       rawData = JSON.parse(rawData);
  //     } catch (err) {
  //       console.warn('Failed to parse biodata.data string:', err);
  //       return [];
  //     }
  //   }

  //   // Validasi setelah parse
  //   if (!Array.isArray(rawData)) {
  //     console.warn('biodata.data is not an array:', rawData);
  //     return [];
  //   }

  //   const now = dayjs().tz('Asia/Jakarta');
  //   const today = now.format('YYYY-MM-DD');
  //   const currentMonth = now.format('YYYY-MM');
  //   const currentYear = now.format('YYYY');

  //   let data = rawData
  //     .flatMap((student) =>
  //       student.kehadiranBulananMataPelajaran?.flatMap((monthlyAttendance) =>
  //         monthlyAttendance.absensisMataPelajaran?.flatMap((attendance) =>
  //           attendance.kehadiranMapel?.map((mapel) => ({
  //             user: {
  //               image: student.user?.image || '',
  //               name: student.user?.name || 'N/A',
  //               nisn: student.user?.nisn || 'N/A',
  //             },
  //             kelas: {
  //               namaKelas: student.kelas?.namaKelas || 'N/A',
  //             },
  //             attendance: {
  //               statusKehadiran: mapel.statusKehadiran || 'Tidak Hadir',
  //               namaMataPelajaran: attendance.mataPelajaran?.namaMataPelajaran || 'N/A',
  //               tanggal: formatTime(mapel.tanggal),
  //               jamMasuk: attendance.jamMasuk,
  //             },
  //           })),
  //         ),
  //       ),
  //     )
  //     .filter((entry) => {
  //       const date = dayjs(entry.attendance.tanggal, 'DD MMM YYYY, HH:mm:ss').tz('Asia/Jakarta');
  //       if (selectedDateRange === 'today') {
  //         return date.format('YYYY-MM-DD') === today;
  //       } else if (selectedDateRange === 'month') {
  //         return date.format('YYYY-MM') === currentMonth;
  //       } else {
  //         return date.format('YYYY') === currentYear;
  //       }
  //     })
  //     .filter((entry) =>
  //       selectedClasses === 'all' || entry.kelas.namaKelas === selectedClasses,
  //     )
  //     .filter((entry) =>
  //       selectedCourse !== 'all'
  //         ? entry.attendance.namaMataPelajaran === selectedCourse
  //         : true,
  //     )
  //     .filter((entry) =>
  //       searchStudentName
  //         ? entry.user.name.toLowerCase().includes(searchStudentName.toLowerCase())
  //         : true,
  //     )
  //     .filter((entry) =>
  //       selectedStatus !== 'all'
  //         ? entry.attendance.statusKehadiran.toLowerCase() === selectedStatus.toLowerCase()
  //         : true,
  //     );

  //   return data.sort((a, b) =>
  //     dayjs(b.attendance.tanggal, 'DD MMM YYYY, HH:mm:ss').diff(
  //       dayjs(a.attendance.tanggal, 'DD MMM YYYY, HH:mm:ss'),
  //     ),
  //   );
  // }, [
  //   biodata.data,
  //   selectedClasses,
  //   selectedCourse,
  //   searchStudentName,
  //   selectedDateRange,
  //   selectedStatus,
  // ]);

  // Dalam filteredData useMemo, langsung pakai 'today'
  const filteredData = useMemo(() => {
    let rawData = biodata.data;

    if (typeof rawData === 'string') {
      try {
        rawData = JSON.parse(rawData);
      } catch (err) {
        console.warn('Failed to parse biodata.data string:', err);
        return [];
      }
    }

    if (!Array.isArray(rawData)) {
      console.warn('biodata.data is not an array:', rawData);
      return [];
    }

    const today = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD');

    let data = rawData
      .flatMap((student) =>
        student.kehadiranBulananMataPelajaran?.flatMap((monthlyAttendance) =>
          monthlyAttendance.absensisMataPelajaran?.flatMap((attendance) =>
            attendance.kehadiranMapel?.map((mapel) => {
              // Parse tanggal to extract jamMasuk
              const dateTime = mapel.tanggal ? dayjs(mapel.tanggal, 'DD MMM YYYY, HH:mm:ss').tz('Asia/Jakarta') : null;
              return {
                user: {
                  image: student.user?.image || '',
                  name: student.user?.name || 'N/A',
                  nisn: student.user?.nisn || 'N/A',
                },
                kelas: {
                  namaKelas: student.kelas?.namaKelas || 'N/A',
                },
                attendance: {
                  statusKehadiran: mapel.statusKehadiran || 'Tidak Hadir',
                  namaMataPelajaran: attendance.mataPelajaran?.namaMataPelajaran || 'N/A',
                  tanggal: formatTime(mapel.tanggal),
                  jamMasuk: dateTime ? dateTime.format('HH:mm:ss') : 'N/A', // Extract time
                },
              };
            }),
          ),
        ),
      )
      .filter((entry) => {
        const date = dayjs(entry.attendance.tanggal, 'DD MMM YYYY, HH:mm:ss').tz('Asia/Jakarta');
        return date.format('YYYY-MM-DD') === today;
      })
      .filter((entry) =>
        selectedClasses === 'all' || entry.kelas.namaKelas === selectedClasses,
      )
      .filter((entry) =>
        selectedCourse !== 'all'
          ? entry.attendance.namaMataPelajaran === selectedCourse
          : true,
      )
      .filter((entry) =>
        searchStudentName
          ? entry.user.name.toLowerCase().includes(searchStudentName.toLowerCase())
          : true,
      )
      .filter((entry) =>
        selectedStatus !== 'all'
          ? entry.attendance.statusKehadiran.toLowerCase() === selectedStatus.toLowerCase()
          : true,
      );

    return data.sort((a, b) =>
      dayjs(b.attendance.tanggal, 'DD MMM YYYY, HH:mm:ss').diff(
        dayjs(a.attendance.tanggal, 'DD MMM YYYY, HH:mm:ss'),
      ),
    );
  }, [
    biodata.data,
    selectedClasses,
    selectedCourse,
    searchStudentName,
    selectedStatus,
  ]);

  console.log('filter matkul data:', filteredData)
  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    setLoadingPDF(format)

    // Data untuk CSV dan Excel (semua kolom)
    const fullExportData = filteredData.map((data, index) => ({
      No: index + 1,
      Nama: data.user.name || '',
      NISN: data.user.nisn || '',
      Kelas: data.kelas.namaKelas || 'N/A',
      Sekolah:
        biodata.data?.find((s) => s.user?.nisn === data.user.nisn)?.user?.sekolah?.namaSekolah ||
        'N/A',
      MataPelajaran: data.attendance.namaMataPelajaran || 'N/A',
      StatusKehadiran: data.attendance.statusKehadiran || 'N/A',
      Tanggal: data.attendance.tanggal,
      JamMasuk: data.attendance.jamMasuk,
    }));

    // Data untuk PDF (termasuk Mata Pelajaran)
    const pdfExportData = filteredData.map((data, index) => ({
      No: index + 1,
      Nama: data.user.name || '',
      NISN: data.user.nisn || '',
      Kelas: data.kelas.namaKelas || 'N/A',
      MataPelajaran: data.attendance.namaMataPelajaran || 'N/A',
      StatusKehadiran: data.attendance.statusKehadiran || 'N/A',
      JamMasuk: data.attendance.jamMasuk,
    }));

    if (format === 'csv') {
      const csv = Papa.unparse(fullExportData, { delimiter: ';' });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      // link.download = `attendance_data_${
      //   selectedDateRange === 'today' ? 'hari-ini' : selectedDateRange === 'month' ? 'mei-2025' : '2025'
      // }.csv`;
      link.download = `attendance_data_course.csv`;
      link.click();
    } else if (format === 'excel') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(fullExportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
      // XLSX.writeFile(wb, `attendance_data_${
      //   selectedDateRange === 'today' ? 'hari-ini' : selectedDateRange === 'month' ? 'mei-2025' : '2025'
      // }.xlsx`);
      XLSX.writeFile(wb, `attendance_data_course.xlsx`);
    } else if (format === 'pdf') {
      if (school.isLoading) {
        alert('Data sekolah masih dimuat. Coba lagi nanti.');
        return;
      }
      try {
        const doc = (
          <AttendanceReportPDF
            data={pdfExportData}
            schoolData={{
              kopSurat: school.data?.[0]?.kopSurat,
              namaSekolah: school.data?.[0]?.namaSekolah,
              namaKepalaSekolah: school.data?.[0]?.namaKepalaSekolah,
              ttdKepalaSekolah: school.data?.[0]?.ttdKepalaSekolah,
            }}
            dateRange={selectedDateRange}
          />
        );

        const pdfInstance = pdf(doc);
        const pdfBlob = await pdfInstance.toBlob();
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = selectedDateRange === 'today'
          ? 'Laporan-kehadiran-hari-ini.pdf'
          : selectedDateRange === 'month'
          ? 'Laporan-kehadiran-mei-2025.pdf'
          : 'Laporan-kehadiran-2025.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Gagal menghasilkan PDF.');
      }
    }
    setLoadingPDF('')
    setIsModalOpen(false);
  };

  const resetFilters = () => {
    setSearchStudentName('');
    setSelectedClasses('all');
    setSelectedCourse('all');
    setSelectedDateRange('year');
    setSelectedStatus('all');
  };

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('coursePresences')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: lang.text('coursePresences'), url: '/students' }]}
      title={lang.text('coursePresences')}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="student-filter" className="block text-sm font-medium mb-2">
                {lang.text('studentName')}
              </Label>
              <Input
                id="student-filter"
                type="text"
                value={searchStudentName}
                onChange={(e) => setSearchStudentName(e.target.value)}
                placeholder={lang.text('searchStudentByName')}
                className="w-full py-2"
              />
            </div>
            <div>
              <Label htmlFor="class-filter" className="block text-sm font-medium mb-2">
                {lang.text('className')}
              </Label>
              <Select value={selectedClasses} onValueChange={setSelectedClasses}>
                <SelectTrigger id="class-filter" className="w-full">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang.text('allClassRoom')}</SelectItem>
                  {listClassRoom.map((kelas) => (
                    <SelectItem key={kelas?.id} value={kelas?.namaKelas}>
                      {kelas?.namaKelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="course-filter" className="block text-sm font-medium mb-2">
                {lang.text('course')}
              </Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger id="course-filter" className="w-full">
                  <SelectValue placeholder="Pilih Mata Pelajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang.text('allCourse')}</SelectItem>
                  {courseOptions.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* <div> 
              <Label htmlFor="date-filter" className="block text-sm font-medium mb-2">
                {lang.text('date')}
              </Label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger id="date-filter" className="w-full">
                  <SelectValue placeholder="Pilih Tanggal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">{lang.text('thisYear')} ({new Date().getFullYear()})</SelectItem>
                  <SelectItem value="month">{lang.text('thisMonth')} ({new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})</SelectItem>
                  <SelectItem value="today">{lang.text('today')} ({new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <div>
              <Label htmlFor="status-filter" className="block text-sm font-medium mb-2">
                {lang.text('presenceStatus')}
              </Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status-filter" className="w-full">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang.text('allStatus')}</SelectItem>
                  <SelectItem value="hadir">{lang.text('presence')}</SelectItem>
                  <SelectItem value="alfa">{lang.text('absentee')}</SelectItem>
                  <SelectItem value="izin">{lang.text('sickness')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
              Reset Filter
            </Button>
            {selectedClasses !== 'all' && (
              <Badge className="py-2 bg-white text-black" variant={'outline'}>
                {selectedClasses}
              </Badge>
            )}
            {selectedCourse !== 'all' && (
              <Badge className="py-2 bg-white text-black" variant={'outline'}>
                {selectedCourse}
              </Badge>
            )}
            {selectedStatus !== 'all' && (
              <Badge className="py-2 bg-white text-black" variant={'outline'}>
                {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              </Badge>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            {/* <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
             {selectedDateRange === 'today'
              ? `${lang.text('presentToday')} (${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})`
              : selectedDateRange === 'month'
              ? `${lang.text('presentByMonth')} ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`
              : `${lang.text('presentByYear')} ${new Date().getFullYear()}`}
            </h3> */}
            <h3 className="text-lg font-semibold">
              {`${lang.text('presentToday')} (${new Date().toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric',
              })})`}
            </h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg transition duration-300"
              >
                {lang.text('export')} Data <FaFile />
              </Button>
            </div>
          </div>
          <MatpelAttendanceTable data={filteredData} />
        </div>

        {/* Export Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-background text-foreground rounded-lg p-6 w-full max-w-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Export & Filter Kelas</h2>
              <div className="mb-4">
                <Label htmlFor="class-filter" className="block text-sm font-medium mb-2">
                  {lang.text('selectClassRoom')}
                </Label>
                <Select value={selectedClasses} onValueChange={setSelectedClasses}>
                  <SelectTrigger id="class-filter" className="w-full">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    {listClassRoom.map((kelas) => (
                      <SelectItem key={kelas?.id} value={kelas?.namaKelas}>
                        {kelas?.namaKelas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Button onClick={loadingPDF !== '' ? () => null : () => handleExport('csv')} className={loadingPDF !== '' ? "brightness-80 active:scale-[1] cursor-not-allowed" : "w-full"}>
                  {loadingPDF ==='csv' ? (<span className='flex items-center'>{lang.text('progress')}</span>) : 'Export CSV'}
                </Button>
                <Button onClick={loadingPDF !== '' ? () => null : () => handleExport('excel')} className={loadingPDF !== '' ? "brightness-80 active:scale-[1] cursor-not-allowed" : "w-full"} variant="secondary">
                  {loadingPDF ==='excel' ? (<span className='flex items-center'>{lang.text('progress')}</span>) : 'Export Excel'}
                </Button>
                <Button onClick={loadingPDF !== '' ? () => null : () => handleExport('pdf')} className={loadingPDF !== '' ? "brightness-80 active:scale-[1] cursor-not-allowed" : "w-full"} variant="destructive">
                  {loadingPDF ==='pdf' ? (<span className='flex items-center'>{lang.text('progress')}</span>) : 'Export PDF'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardPageLayout>
  );
};