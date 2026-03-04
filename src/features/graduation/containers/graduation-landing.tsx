import { Button, dayjs, lang } from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { useAlert, useDataTableController } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useSchool, useSchoolDetail } from "@/features/schools";
import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import { useEffect, useRef, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { GraduationTable } from "../containers";
import { useGraduation } from "../hooks";

// Default values for letter text
const defaultLetterText = {
  pembukaan: `Kami, pihak {namaSekolah}, dengan bangga mengucapkan selamat atas keberhasilan dalam menyelesaikan pendidikan di sekolah kami. Dengan penuh kebanggaan, kami mengumumkan bahwa:`,
  nomorSurat: ``,
  pernyataanLulus: `Telah lulus dengan hasil yang memuaskan pada tahun ajaran 2024/2025. Prestasi ini merupakan bukti dari kerja keras, dedikasi, dan semangat belajar yang telah ditunjukkan.`,
  penutupan: `Kami berharap keberhasilan ini menjadi langkah awal menuju masa depan yang cerah dan penuh prestasi. Teruslah mengejar cita-cita dengan integritas dan semangat yang sama. Demikian surat ini kami sampaikan, atas perhatian dan doa restunya kami ucapkan terima kasih.`,
};

// Initialize letterText from localStorage
const getInitialLetterText = () => {
  try {
    const savedData = localStorage.getItem('letterFormData');
    return savedData ? JSON.parse(savedData) : defaultLetterText;
  } catch (error) {
    console.error('Error parsing localStorage letterFormData:', error);
    return defaultLetterText;
  }
};

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
    marginBottom: 36,
    textTransform: 'uppercase',
  },
  title2: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  letterNumber: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 26,
  },
  content: {
    marginBottom: 30,
    textAlign: 'justify',
    lineHeight: 1.5,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  studentNIS: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
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

interface SchoolData {
  kopSurat: string;
  judulSurat: string;
  namaKepalaSekolah: string;
  ttdKepalaSekolah: string | undefined;
  namaSekolah: string;
  pembukaan: string;
  pernyataanLulus: string;
  penutupan: string;
}

const StudentLetterPDF: React.FC<{
  student: { name: string; nis: string };
  schoolData: SchoolData;
}> = ({ student, schoolData }) => {
  console.log('student pdf', student);
  console.log('schoolData pdf', schoolData);
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

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header} fixed>
          {
            kopSuratUrl && (
              <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
            )
          }
        </View>
        <View style={pdfStyles.contentWrapper}>
             {!schoolData?.nomorSurat && ( // Conditionally render nomorSurat
              <Text style={pdfStyles.title}>{schoolData?.judulSurat || 'Judul Surat'}</Text>
             )}
             {schoolData?.nomorSurat && ( // Conditionally render nomorSurat
               <Text style={pdfStyles.title2}>{schoolData?.judulSurat || 'Judul Surat'}</Text>
             )}
             {schoolData?.nomorSurat && ( // Conditionally render nomorSurat
               <Text style={pdfStyles.letterNumber}>Nomor: {schoolData?.nomorSurat}</Text>
             )}
          <View style={pdfStyles.content}>
            <Text>{schoolData.pembukaan.replace('{namaSekolah}', schoolData.namaSekolah)}</Text>
            <Text style={pdfStyles.studentName}>{student.name}</Text>
            <Text style={pdfStyles.studentNIS}>NIS: {student.nis}</Text>
            <Text style={{ marginTop: 10 }}>{schoolData.pernyataanLulus}</Text>
            <Text style={{ marginTop: 10 }}>{schoolData.penutupan}</Text>
          </View>
          <View style={pdfStyles.signature}>
            <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
            {signatureUrl && (
              <Image src={signatureUrl} style={pdfStyles.signatureImage} />
            )}
            <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const pdfStyles2 = StyleSheet.create({
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
    marginBottom: 0,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  studentNIS: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
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
});

// const GraduationReportPDF: React.FC<{
//   graduationData: any[];
//   schoolData: SchoolData;
// }> = ({ graduationData, schoolData }) => {
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

//   const currentDate = dayjs();
//   const currentMonth = currentDate.month();
//   const currentYear = currentDate.year();
//   const academicYear =
//     currentMonth < 6
//       ? `${currentYear - 1}/${currentYear}`
//       : `${currentYear}/${currentYear + 1}`;

//   const rowsPerPage = 25;
//   const dataChunks = [];
//   for (let i = 0; i < graduationData.length; i += rowsPerPage) {
//     const chunk = graduationData.slice(i, i + rowsPerPage);
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
//           style={pdfStyles2.page}
//           break={pageIndex > 0}
//         >
//           <View style={pdfStyles2.header} fixed>
//             <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles2.headerImage} />
//           </View>
//           <View style={pdfStyles2.contentWrapper}>
//             <Text style={pdfStyles2.title}>Laporan Data Kelulusan</Text>
//             <Text style={pdfStyles2.content}>
//               Tahun Ajaran: {academicYear}
//             </Text>
//             <View style={pdfStyles2.table}>
//               <View style={[pdfStyles2.tableRow, pdfStyles2.tableHeader]} fixed>
//                 {['No', 'Nama', 'NIS', 'NISN', 'Kelas', 'Status'].map((header, index) => (
//                   <View
//                     key={index}
//                     style={[
//                       pdfStyles2.tableCell,
//                       pdfStyles2.tableHeader,
//                       {
//                         width: index === 0 ? '5%' : index === 1 ? '30%' : index === 2 ? '15%' : index === 3 ? '15%' : index === 4 ? '20%' : '15%',
//                       },
//                     ]}
//                   >
//                     <Text>{header}</Text>
//                   </View>
//                 ))}
//               </View>
//               {chunk.map((item: any, index: number) => (
//                 <View style={pdfStyles2.tableRow} key={index} wrap={false}>
//                   <View style={[pdfStyles2.tableCell, { width: '5%' }]}>
//                     <Text>{pageIndex * rowsPerPage + index + 1}</Text>
//                   </View>
//                   <View style={[pdfStyles2.tableCell, { width: '30%' }]}>
//                     <Text>{item.user?.name || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles2.tableCell, { width: '15%' }]}>
//                     <Text>{item.user?.nis || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles2.tableCell, { width: '15%' }]}>
//                     <Text>{item.user?.nisn || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles2.tableCell, { width: '20%' }]}>
//                     <Text>{item.kelas?.namaKelas || '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles2.tableCell, { width: '15%' }]}>
//                     <Text>{item.lulus ? 'Lulus' : 'Tidak Lulus'}</Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//             {pageIndex === dataChunks.length - 1 && (
//               <View style={pdfStyles2.signature}>
//                 <Text style={pdfStyles2.signatureText}>Kepala Sekolah,</Text>
//                 {signatureUrl && (
//                   <Image src={signatureUrl} style={pdfStyles2.signatureImage} />
//                 )}
//                 <Text style={pdfStyles2.signatureText}>{schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah'}</Text>
//               </View>
//             )}
//           </View>
//         </Page>
//       ))}
//     </Document>
//   );
// };


const GraduationReportPDF: React.FC<{
  graduationData: any[];
  schoolData: SchoolData;
}> = ({ graduationData, schoolData }) => {
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

  const currentDate = dayjs().tz('Asia/Jakarta'); // Gunakan zona waktu WIB
  const currentMonth = currentDate.month();
  const currentYear = currentDate.year();
  const academicYear =
    currentMonth < 6
      ? `${currentYear - 1}/${currentYear}`
      : `${currentYear}/${currentYear + 1}`;

  const rowsPerPage = 25;
  const dataChunks = [];
  for (let i = 0; i < graduationData.length; i += rowsPerPage) {
    const chunk = graduationData.slice(i, i + rowsPerPage);
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
          style={pdfStyles2.page}
          break={pageIndex > 0}
        >
          <View style={pdfStyles2.header} fixed>
            {kopSuratUrl && <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles2.headerImage} />}
          </View>
          <View style={pdfStyles2.contentWrapper}>
            <Text style={pdfStyles2.title}>Laporan Data Kelulusan</Text>
            <Text style={pdfStyles2.content}>
              Tahun Ajaran: {academicYear}
            </Text>
            <View style={pdfStyles2.table}>
              <View style={[pdfStyles2.tableRow, pdfStyles2.tableHeader]} fixed>
                {['No', 'Nama', 'NIS', 'NISN', 'Kelas', 'Status'].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles2.tableCell,
                      pdfStyles2.tableHeader,
                      {
                        width: index === 0 ? '5%' : index === 1 ? '30%' : index === 2 ? '15%' : index === 3 ? '15%' : index === 4 ? '20%' : '15%',
                      },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item: any, index: number) => (
                <View style={pdfStyles2.tableRow} key={index} wrap={false}>
                  <View style={[pdfStyles2.tableCell, { width: '5%' }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles2.tableCell, { width: '30%' }]}>
                    <Text>{item.user?.name || '-'}</Text>
                  </View>
                  <View style={[pdfStyles2.tableCell, { width: '15%' }]}>
                    <Text>{item.user?.nis || '-'}</Text>
                  </View>
                  <View style={[pdfStyles2.tableCell, { width: '15%' }]}>
                    <Text>{item.user?.nisn || '-'}</Text>
                  </View>
                  <View style={[pdfStyles2.tableCell, { width: '20%' }]}>
                    <Text>{item.kelas?.namaKelas || '-'}</Text>
                  </View>
                  <View style={[pdfStyles2.tableCell, { width: '15%' }]}>
                    <Text>{item.lulus ? 'Lulus' : 'Tidak Lulus'}</Text>
                  </View>
                </View>
              ))}
            </View>
            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles2.signature}>
                <Text style={pdfStyles2.signatureText}>Kepala Sekolah,</Text>
                {signatureUrl && (
                  <Image src={signatureUrl} style={pdfStyles2.signatureImage} />
                )}
                <Text style={pdfStyles2.signatureText}>{schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah'}</Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export const GraduationLandingTables = () => {
  const [selectStatus] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [generatingStudentId, setGeneratingStudentId] = useState<string | null>(null);
  const [profileSchoolId, setProfileSchoolId] = useState<number | null>(null);
  const [graduationData, setGraduationData] = useState<any[]>([]);
  const [letterText, setLetterText] = useState({
    pembukaan: getInitialLetterText().pembukaan || defaultLetterText.pembukaan,
    nomorSurat: getInitialLetterText().nomorSurat || defaultLetterText.nomorSurat,
    pernyataanLulus: getInitialLetterText().pernyataanLulus || defaultLetterText.pernyataanLulus,
    penutupan: getInitialLetterText().penutupan || defaultLetterText.penutupan,
  });

  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 50 });

  const profile = useProfile();
  const alert = useAlert();
  const school = useSchool();
  
  const graduations = useGraduation({
    sekolahId: Number(profile?.user?.sekolahId || profileSchoolId || 1),
    lulus: selectStatus,
  });

  console.log('data graduation:', graduations)

  const loadingStatusRef = useRef({ graduations: true, school: true });

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'letterFormData' && event.newValue) {
        try {
          const parsedData = JSON.parse(event.newValue);
          setLetterText({
            pembukaan: parsedData.pembukaan || defaultLetterText.pembukaan,
            nomorSurat: parsedData.nomorSurat || defaultLetterText.nomorSurat,
            pernyataanLulus: parsedData.pernyataanLulus || defaultLetterText.pernyataanLulus,
            penutupan: parsedData.penutupan || defaultLetterText.penutupan,
          });
        } catch (error) {
          console.error('Error parsing updated localStorage letterFormData:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    loadingStatusRef.current = {
      graduations: graduations.isLoading,
      school: school.isLoading,
    };
    console.log('graduations:', {
      isLoading: graduations.isLoading,
      data: graduations.data,
      error: graduations.error,
    });
    console.log('school:', {
      isLoading: school.isLoading,
      data: school.data,
      error: school.error,
    });
  }, [graduations, school]);

  useEffect(() => {
    setProfileSchoolId(profile.user?.sekolahId || null);
  }, [profile.user]);

  useEffect(() => {
    if (!graduations.isLoading && !school.isLoading) {
      if (graduations.data) {
        setGraduationData(graduations.data);
      } else {
        alert.error(lang.text('emptyResult'));
      }
    }
  }, [graduations.isLoading, school.isLoading, graduations.data, alert]);

  console.log('graduationData for pdf:', graduationData)
  console.log('school data for pdf:', school?.data?.[0])

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      if (loadingStatusRef.current.graduations || loadingStatusRef.current.school) {
        console.warn('Data still loading, aborting PDF generation');
        alert.error(lang.text('loadData'));
        return;
      }
      if (!graduationData || graduationData.length === 0) {
        alert.error(lang.text('emptyResult'));
        return;
      }

      const doc = (
        <GraduationReportPDF
          graduationData={graduationData}
          schoolData={{
            namaSekolah: school?.data?.[0]?.namaSekolah || 'Nama Sekolah',
            kopSurat: school.data?.[0]?.kopSurat || '',
            namaKepalaSekolah: school.data?.[0]?.namaKepalaSekolah || 'Nama Kepala Sekolah',
            ttdKepalaSekolah: school.data?.[0]?.ttdKepalaSekolah || '',
            pembukaan: letterText.pembukaan,
            pernyataanLulus: letterText.pernyataanLulus,
            penutupan: letterText.penutupan,
          }}
        />
      );

      const pdfInstance = pdf(doc);
      const pdfBlob = await pdfInstance.toBlob();

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Laporan-Kelulusan-${dayjs().format('YYYY-MM-DD')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert.success(lang.text('successDownloadPDF'));
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadIndividualPDF = async (student: any) => {

    console.log('school grad:', school?.data?.[0]?.kopSurat)
    console.log('data pdf graduation:', student)
    const studentId = student.user?.id || 'unknown';
    setGeneratingStudentId(studentId);
    try {
      if (loadingStatusRef.current.school) {
        console.warn('School data still loading, aborting individual PDF generation');
        alert.error(lang.text('loadData'));
        return;
      }

      const studentName = student.user?.name || 'Unknown';
      const studentNis = student.user?.nis || 'Unknown';


      const doc = (
        <StudentLetterPDF
          student={{ name: studentName, nis: studentNis }}
          schoolData={{
            namaSekolah: school?.data?.[0]?.namaSekolah || 'Nama Sekolah',
            kopSurat: school.data?.[0]?.kopSurat || '',
            judulSurat: school.data?.[0]?.judulSurat || 'Surat Keterangan Lulus',
            namaKepalaSekolah: school.data?.[0]?.namaKepalaSekolah || 'Nama Kepala Sekolah',
            ttdKepalaSekolah: school.data?.[0]?.ttdKepalaSekolah,
            pembukaan: letterText.pembukaan,
            pernyataanLulus: letterText.pernyataanLulus,
            nomorSurat: letterText.nomorSurat,
            penutupan: letterText.penutupan,
          }}
        />
      );

      const pdfInstance = pdf(doc);
      const pdfBlob = await pdfInstance.toBlob();

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Surat-kelulusan-${studentName}-${studentNis}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert.success(`Surat kelulusan untuk ${studentName} berhasil diunduh.`);
    } catch (error) {
      console.error('Error generating individual PDF:', error);
      alert.error(`Gagal menghasilkan surat kelulusan untuk ${student.user?.name || 'siswa'}.`);
    } finally {
      setGeneratingStudentId(null);
    }
  };

  console.log('graduationData', graduationData)

  return (
    <>
      <div className="flex justify-between items-center pb-4">
        <div className="w-full flex justify-between">
          <div className="flex items-center space-x-2">
            <Button
              className="relative bg-red-600 text-white hover:bg-red-700"
              variant="outline"
              aria-label="download pdf"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF || graduations.isLoading || school.isLoading}
            >
              {isGeneratingPDF ? "Generating..." : `${lang.text("downloadGraduation")}`} <FaFilePdf />
            </Button>
          </div>
        </div>
      </div>

      <GraduationTable
        data={graduationData || []}
        isLoading={graduations.isLoading || school.isLoading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalItems: graduationData.length || 0,
          onPageChange: (page) => onPaginationChange({ ...pagination, pageIndex: page }),
          onSizeChange: (size) => onPaginationChange({ ...pagination, pageSize: size, pageIndex: 0 }),
        }}
        sorting={sorting}
        onSortingChange={onSortingChange}
        onDownloadPDF={handleDownloadIndividualPDF}
        generatingStudentId={generatingStudentId}
      />
    </>
  );
};
