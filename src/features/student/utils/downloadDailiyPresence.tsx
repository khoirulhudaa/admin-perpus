// import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
// import dayjs from 'dayjs';
// import { getStaticFile } from '@/core/utils';

// // Gaya mirip DailyAttendancePDF
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
//     alignSelf: 'flex-end',
//   },
//   signatureText: {
//     textAlign: 'center',
//   },
// });

// export const StudentPresencePDF = ({
//   data,
//   school,
// }: {
//   data: {
//     createdAt: string;
//     jamMasuk: string;
//     jamPulang: string;
//     statusKehadiran: string;
//   }[];
//   school: {
//     namaSekolah: string;
//     kopSurat?: string;
//     namaKepalaSekolah?: string;
//     ttdKepalaSekolah?: string;
//   };
// }) => {
//   console.log('data', data)
//   const kopSurat = school.kopSurat
//     ? school.kopSurat.startsWith('data:image')
//       ? school.kopSurat
//       : `data:image/png;base64,${school.kopSurat}`
//     : undefined;

//   const signature = school.ttdKepalaSekolah
//     ? school.ttdKepalaSekolah.startsWith('data:image')
//       ? school.ttdKepalaSekolah
//       : `data:image/png;base64,${school.ttdKepalaSekolah}`
//     : undefined;

//   const rowsPerPage = 23;
//   const dataChunks = [];
//   for (let i = 0; i < data.length; i += rowsPerPage) {
//     dataChunks.push(data.slice(i, i + rowsPerPage));
//   }

//   return (
//     <Document>
//       {dataChunks.map((chunk, pageIndex) => (
//         <Page key={pageIndex} size="A4" style={pdfStyles.page} break={pageIndex > 0}>
//           <View style={pdfStyles.header} fixed>
//             {kopSurat && <Image src={getStaticFile(kopSurat)} style={pdfStyles.headerImage} />}
//           </View>

//           <View style={pdfStyles.contentWrapper}>
//             <Text style={pdfStyles.title}>Laporan Absensi Harian</Text>
//             <Text style={pdfStyles.content}>{school.namaSekolah}</Text>

//             <View style={pdfStyles.table}>
//               {/* Table Header */}
//               <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
//                 {['No', 'Tanggal', 'Jam Masuk', 'Jam Pulang', 'Status'].map((label, index) => (
//                   <View
//                     key={index}
//                     style={[
//                       pdfStyles.tableCell,
//                       {
//                         width:
//                           index === 0 ? '10%' :
//                           index === 1 ? '25%' :
//                           index === 2 || index === 3 ? '20%' :
//                           '25%',
//                       },
//                     ]}
//                   >
//                     <Text>{label}</Text>
//                   </View>
//                 ))}
//               </View>

//               {/* Table Rows */}
//               {chunk.map((item, index) => (
//                 <View key={index} style={pdfStyles.tableRow} wrap={false}>
//                   <View style={[pdfStyles.tableCell, { width: '10%' }]}>
//                     <Text>{pageIndex * rowsPerPage + index + 1}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '25%' }]}>
//                     <Text>{dayjs(item.createdAt).format('DD/MM/YYYY')}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '20%' }]}>
//                     <Text>{dayjs(item.jamMasuk).format('HH:mm')}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '20%' }]}>
//                     <Text>{dayjs(item.jamPulang).format('HH:mm')}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '25%' }]}>
//                     <Text>{item.statusKehadiran}</Text>
//                   </View>
//                 </View>
//               ))}
//             </View>

//             {/* Tanda tangan hanya di halaman terakhir */}
//             {pageIndex === dataChunks.length - 1 && (
//               <View style={pdfStyles.signature}>
//                 <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
//                 {signature && (
//                   <Image src={getStaticFile(signature)} style={pdfStyles.signatureImage} />
//                 )}
//                 <Text style={pdfStyles.signatureText}>
//                   {school.namaKepalaSekolah || 'Nama Kepala Sekolah'}
//                 </Text>
//               </View>
//             )}
//           </View>
//         </Page>
//       ))}
//     </Document>
//   );
// };


// import { getStaticFile } from '@/core/utils';
// import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
// import dayjs from 'dayjs';
// // import { AttendanceRecord } from '@/models/attendance'; // Adjust path as needed

// // Gaya mirip DailyAttendancePDF
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
//     alignSelf: 'flex-end',
//   },
//   signatureText: {
//     textAlign: 'center',
//   },
// });

// export const StudentPresencePDF = ({
//   data,
//   school,
// }: {
//   data: any[];
//   school: {
//     namaSekolah: string;
//     kopSurat?: string;
//     namaKepalaSekolah?: string;
//     ttdKepalaSekolah?: string;
//   };
// }) => {
//   console.log('data', data);
//   const kopSurat = school.kopSurat
//     ? school.kopSurat.startsWith('data:image')
//       ? school.kopSurat
//       : `data:image/png;base64,${school.kopSurat}`
//     : undefined;

//   const signature = school.ttdKepalaSekolah
//     ? school.ttdKepalaSekolah.startsWith('data:image')
//       ? school.ttdKepalaSekolah
//       : `data:image/png;base64,${school.ttdKepalaSekolah}`
//     : undefined;

//   const rowsPerPage = 23;
//   const dataChunks = [];
//   for (let i = 0; i < data.length; i += rowsPerPage) {
//     dataChunks.push(data.slice(i, i + rowsPerPage));
//   }

//   return (
//     <Document>
//       {dataChunks.map((chunk, pageIndex) => (
//         <Page key={pageIndex} size="A4" style={pdfStyles.page} break={pageIndex > 0}>
//           <View style={pdfStyles.header} fixed>
//             {kopSurat && <Image src={getStaticFile(kopSurat)} style={pdfStyles.headerImage} />}
//           </View>

//           <View style={pdfStyles.contentWrapper}>
//             <Text style={pdfStyles.title}>Laporan Absensi Harian</Text>
//             <Text style={pdfStyles.content}>{school.namaSekolah}</Text>

//             <View style={pdfStyles.table}>
//               {/* Table Header */}
//               <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
//                 {['No', 'Nama', 'NIS', 'Tanggal', 'Jam Masuk', 'Jam Pulang', 'Status'].map((label, index) => (
//                   <View
//                     key={index}
//                     style={[
//                       pdfStyles.tableCell,
//                       {
//                         width:
//                           index === 0 ? '8%' : // No
//                           index === 1 ? '22%' : // Nama
//                           index === 2 ? '15%' : // NIS
//                           index === 3 ? '20%' : // Tanggal
//                           index === 4 ? '15%' : // Jam Masuk
//                           index === 5 ? '15%' : // Jam Pulang
//                           '15%', // Status
//                       },
//                     ]}
//                   >
//                     <Text>{label}</Text>
//                   </View>
//                 ))}
//               </View>

//               {/* Table Rows */}
//               {chunk.map((item, index) => (
//                 <View key={index} style={pdfStyles.tableRow} wrap={false}>
//                   <View style={[pdfStyles.tableCell, { width: '8%' }]}>
//                     <Text>{pageIndex * rowsPerPage + index + 1}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '22%' }]}>
//                     <Text>{item.siswa.nama}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '15%' }]}>
//                     <Text>{item.siswa.nis}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '20%' }]}>
//                     <Text>{dayjs(item.createdAt).format('DD/MM/YYYY')}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '15%' }]}>
//                     <Text>{dayjs(item.jamMasuk).format('HH:mm')}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '15%' }]}>
//                     <Text>{item.jamPulang ? dayjs(item.jamPulang).format('HH:mm') : '-'}</Text>
//                   </View>
//                   <View style={[pdfStyles.tableCell, { width: '15%' }]}>
//                     <Text>{item.statusKehadiran}</Text>
//                   </View>
//                 </View>
//               ))}
//             </View>

//             {/* Tanda tangan hanya di halaman terakhir */}
//             {pageIndex === dataChunks.length - 1 && (
//               <View style={pdfStyles.signature}>
//                 <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
//                 {signature && (
//                   <Image src={getStaticFile(signature)} style={pdfStyles.signatureImage} />
//                 )}
//                 <Text style={pdfStyles.signatureText}>
//                   {school.namaKepalaSekolah || 'Nama Kepala Sekolah'}
//                 </Text>
//               </View>
//             )}
//           </View>
//         </Page>
//       ))}
//     </Document>
//   );
// };


import { getStaticFile } from '@/core/utils';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';

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
    alignSelf: 'flex-end',
  },
  signatureText: {
    textAlign: 'center',
  },
});

export const StudentPresencePDF = ({
  data,
  school,
  filter = 'bulanan',
}: {
  data: any[];
  school: {
    namaSekolah: string;
    kopSurat?: string;
    namaKepalaSekolah?: string;
    ttdKepalaSekolah?: string;
  };
  filter?: 'harian' | 'bulanan' | 'tahunan';
}) => {
  console.log('data', data);
  const kopSurat = school.kopSurat
    ? school.kopSurat.startsWith('data:image')
      ? school.kopSurat
      : `data:image/png;base64,${school.kopSurat}`
    : undefined;

  const signature = school.ttdKepalaSekolah
    ? school.ttdKepalaSekolah.startsWith('data:image')
      ? school.ttdKepalaSekolah
      : `data:image/png;base64,${school.ttdKepalaSekolah}`
    : undefined;

  const title = `Laporan Absensi ${filter.charAt(0).toUpperCase() + filter.slice(1)}`;

  const rowsPerPage = 23;
  const dataChunks = [];
  for (let i = 0; i < data.length; i += rowsPerPage) {
    dataChunks.push(data.slice(i, i + rowsPerPage));
  }

  return (
    <Document>
      {dataChunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pdfStyles.page} break={pageIndex > 0}>
          <View style={pdfStyles.header} fixed>
            {kopSurat && <Image src={getStaticFile(kopSurat)} style={pdfStyles.headerImage} />}
          </View>

          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>{title}</Text>
            <Text style={pdfStyles.content}>{school.namaSekolah}</Text>

            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {['No', 'Nama', 'NIS', 'Tanggal', 'Jam Masuk', 'Jam Pulang', 'Status'].map((label, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      {
                        width:
                          index === 0 ? '8%' :
                          index === 1 ? '22%' :
                          index === 2 ? '15%' :
                          index === 3 ? '20%' :
                          index === 4 ? '15%' :
                          index === 5 ? '15%' :
                          '15%',
                      },
                    ]}
                  >
                    <Text>{label}</Text>
                  </View>
                ))}
              </View>

              {chunk.map((item, index) => (
                <View key={index} style={pdfStyles.tableRow} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: '8%' }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '22%' }]}>
                    <Text>{item.siswa?.nama || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item.siswa?.nis || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '20%' }]}>
                    <Text>{dayjs(item.createdAt).format('DD/MM/YYYY')}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{dayjs(item.jamMasuk).format('HH:mm')}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item.jamPulang ? dayjs(item.jamPulang).format('HH:mm') : '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: '15%' }]}>
                    <Text>{item.statusKehadiran}</Text>
                  </View>
                </View>
              ))}
            </View>

            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles.signature}>
                <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                {signature && (
                  <Image src={getStaticFile(signature)} style={pdfStyles.signatureImage} />
                )}
                <Text style={pdfStyles.signatureText}>
                  {school.namaKepalaSekolah || 'Nama Kepala Sekolah'}
                </Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};