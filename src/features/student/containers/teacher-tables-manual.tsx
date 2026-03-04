// import { distinctObjectsByProperty, lang } from "@/core/libs";
// import { BaseDataTable } from "@/features/_global";
// import { useSchool } from "@/features/schools";
// import { teacherColumnWithFilter2 } from "@/features/teacher";
// import { useBiodataGuru } from "@/features/user/hooks";
// import { useMemo } from "react";
// import { useAttendanceActions } from "../hooks";
  
//   export function TeacherLandingTablesManual() {
//     const biodata = useBiodataGuru();
//     const school = useSchool();
//     const { handleAttend, handleAttendGoHome } = useAttendanceActions();
  
//     console.log('biodata guru', biodata?.data)
  
//     const columns = useMemo(
//       () =>
//         teacherColumnWithFilter2({
//           schoolOptions: distinctObjectsByProperty(
//             school.data?.map((d) => ({
//               label: d.namaSekolah,
//               value: d.namaSekolah,
//             })) || [],
//             "value",
//           ),
//           handleAttend,
//           handleAttendGoHome
//         }),
//       [school.data, handleAttend, handleAttendGoHome],
//     );
  
//     return (
//       <BaseDataTable
//         columns={columns}
//         data={biodata.data}
//         dataFallback={columns}
//         globalSearch
//         searchParamPagination
//         showFilterButton
//         initialState={{
//           sorting: [
//             {
//               id: "user_name",
//               desc: false,
//             },
//           ],
//         }}
//         searchPlaceholder={lang.text("search")}
//         isLoading={biodata.query.isLoading}
//       />
//     );
//   }


import { Button, distinctObjectsByProperty, Input, lang } from "@/core/libs";
import { getStaticFile } from '@/core/utils';
import { BaseDataTable, useAlert } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { teacherColumnWithFilter2 } from "@/features/teacher";
import { useBiodataGuru } from "@/features/user/hooks";
import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useMemo, useState } from "react";
import { FaFile } from 'react-icons/fa';
import { useAttendanceActions } from "../hooks";
dayjs.extend(utc);
dayjs.extend(timezone);

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
  tableRowHadir: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#22c55e', // Hijau untuk status hadir
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    fontSize: 10,
    borderRightColor: '#000',
    textAlign: 'center',
  },
  tableCellHadir: {
    padding: 5,
    borderRightWidth: 1,
    fontSize: 10,
    borderRightColor: '#000',
    textAlign: 'center',
    color: '#ffffff', // Teks putih untuk status hadir
  },
  tableHeader: {
    fontSize: 11,
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
const TeacherAttendancePDF = ({ attendanceData, schoolData, hadirCount }) => {
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

  const headers = ['No', 'Nama Guru', 'NIP', 'Nama Sekolah', 'NRK', 'Status'];
  const columnWidths = ['5%', '20%', '25%', '20%', '20%', '10%'];

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
              <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
            )}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Kehadiran Guru</Text>
            <View style={{ position: 'relative', display: 'flex', alignItems: 'center', textAlign: 'center', margin: '10px 0' }}>
              <Text>
                Tanggal: {dayjs().tz('Asia/Jakarta').format('DD MMMM YYYY')}
                {"  "}
                (Total Guru: {attendanceData.length}, Hadir: {hadirCount})
              </Text>
            </View>
            <Text style={pdfStyles.content}>
              {schoolData?.namaSekolah}
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {headers.map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      { width: columnWidths[index] },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => (
                <View
                  style={item.statusKehadiran === 'hadir' ? pdfStyles.tableRowHadir : pdfStyles.tableRow}
                  key={`${pageIndex}_${index}`}
                  wrap={false}
                >
                  <View style={[item.statusKehadiran === 'hadir' ? pdfStyles.tableCellHadir : pdfStyles.tableCell, { width: columnWidths[0] }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[item.statusKehadiran === 'hadir' ? pdfStyles.tableCellHadir : pdfStyles.tableCell, { width: columnWidths[1] }]}>
                    <Text>{item?.user?.name || '-'}</Text>
                  </View>
                  <View style={[item.statusKehadiran === 'hadir' ? pdfStyles.tableCellHadir : pdfStyles.tableCell, { width: columnWidths[2] }]}>
                    <Text>{item?.user?.nip || '-'}</Text>
                  </View>
                  <View style={[item.statusKehadiran === 'hadir' ? pdfStyles.tableCellHadir : pdfStyles.tableCell, { width: columnWidths[3] }]}>
                    <Text>{item?.user?.sekolah?.namaSekolah || '-'}</Text>
                  </View>
                  <View style={[item.statusKehadiran === 'hadir' ? pdfStyles.tableCellHadir : pdfStyles.tableCell, { width: columnWidths[4] }]}>
                    <Text>{item?.user?.nrk || '-'}</Text>
                  </View>
                  <View style={[item.statusKehadiran === 'hadir' ? pdfStyles.tableCellHadir : pdfStyles.tableCell, { width: columnWidths[5] }]}>
                    <Text>{item?.statusKehadiran ? item.statusKehadiran.toUpperCase() : '-'}</Text>
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
const generateTeacherAttendancePDF = async ({
  attendanceData,
  alert,
  schoolData,
  schoolIsLoading,
  hadirCount, // Add hadirCount parameter
}: {
  attendanceData: any[];
  alert: { success: (msg: string) => void; error: (msg: string) => void } | undefined;
  schoolData: any;
  schoolIsLoading: boolean;
  hadirCount: number; // Add hadirCount type
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
          kopSurat: schoolData.kopSurat || undefined,
          namaKepalaSekolah: schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah',
          ttdKepalaSekolah: schoolData.ttdKepalaSekolah || undefined,
        }}
        hadirCount={hadirCount} // Pass hadirCount
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
    console.error('Error generating attendance PDF:', error);
    alert.error('Gagal menghasilkan laporan kehadiran guru.');
  }
};

export function TeacherLandingTablesManual() {
  const biodata = useBiodataGuru();
  const school = useSchool();
  const { handleAttend, handleAttendGoHome } = useAttendanceActions();
  const alert = useAlert();
  const [searchQuery, setSearchQuery] = useState('');
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [refetchLoading, setRefetchLoading] = useState<boolean>(false);

  console.log('biodata guru', biodata?.data);

  const columns = useMemo(
    () =>
      teacherColumnWithFilter2({
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          "value",
        ),
        handleAttend,
        handleAttendGoHome,
      }),
    [school.data, handleAttend, handleAttendGoHome],
  );

  // Format data untuk PDF dan tabel
  const formattedData = useMemo(() => {
    if (!biodata.data) return [];
    return biodata.data
      .map((item, index) => {
        // Ambil kehadiran terbaru dari kehadiranBulanan (jika ada)
        const latestAttendance = item.kehadiranBulanan && item.kehadiranBulanan.length > 0
          ? item.kehadiranBulanan.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())[0]
          : null;

        return {
          No: index + 1,
          id: item?.id || '-',
          userId: item?.userId || '-',
          user: {
            id: item?.user?.id || '-',
            name: item?.user?.name || '-',
            nip: item?.user?.nip || '-',
            nrk: item?.user?.nrk || '-',
            email: item?.user?.email || '-',
            image: item?.user?.image || '-',
            sekolah: {
              namaSekolah: item?.user?.sekolah?.namaSekolah || '-',
            },
          },
          statusKehadiran: latestAttendance?.statusKehadiran || item?.statusKehadiran || '-',
        };
      })
      .filter((item) =>
        searchQuery === '' ||
        item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.user.nip && item.user.nip.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.user.email && item.user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [biodata.data, searchQuery]);

  // Hitung jumlah data dengan statusKehadiran "hadir"
  const hadirCount = useMemo(() => {
    return formattedData.filter((item) => item.statusKehadiran === 'hadir').length;
  }, [formattedData]);

  const handleExportPDF = async () => {
    setExportLoading(true);
    await generateTeacherAttendancePDF({
      attendanceData: formattedData,
      alert,
      schoolData: school?.data?.[0] || {},
      schoolIsLoading: school?.isLoading,
      hadirCount, // Pass hadirCount
    });
    setExportLoading(false);
  };

  // Fungsi untuk memuat ulang data
  const handleRefetch = async () => {
    setRefetchLoading(true);
    try {
      await Promise.all([biodata.query.refetch(), school.query.refetch()]);
      alert.success('Data berhasil dimuat ulang');
    } catch (error) {
      console.error('Error refetching data:', error);
      alert.error('Gagal memuat ulang data');
    } finally {
      setRefetchLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-start gap-3 items-center mb-[22px]">
        <Button variant="outline" aria-label="presentCount" className="hover:bg-transparent cursor-default">
          <p>
            {lang.text('attendance')}: {hadirCount}
          </p>
        </Button>
        <Button
          variant="outline"
          onClick={handleRefetch}
          className={`px-4 py-2 text-white rounded-lg transition duration-300 ${
            refetchLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={refetchLoading}
        >
          {lang.text('refresh')}
          {/* <FaSyncAlt className={refetchLoading ? 'animate-spin ml-2' : 'ml-2'} /> */}
        </Button>
        <Input
          type="text"
          placeholder="Cari berdasarkan nama atau NIS"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[300px] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <Button
          variant="outline"
          onClick={handleExportPDF}
          className={`px-4 py-2 bg-red-600 text-white rounded-lg transition duration-300 ${
            exportLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={exportLoading}
        >
          {lang.text('export')} PDF
          <FaFile className="ml-2" />
        </Button>
      </div>
      <BaseDataTable
        columns={columns}
        data={formattedData}
        dataFallback={columns}
        globalSearch={false}
        searchParamPagination
        showFilterButton
        initialState={{
          sorting: [
            {
              id: "user_name",
              desc: false,
            },
          ],
        }}
        searchPlaceholder={lang.text("search")}
        isLoading={biodata.query.isLoading}
      />
    </div>
  );
}