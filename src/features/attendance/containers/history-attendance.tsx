// import { useBiodata } from '@/features/user/hooks';
// import { studentAttendanceColumn } from '../utils';
// import { BaseDataTable } from '@/features/_global';
// import { distinctObjectsByProperty, lang } from '@/core/libs';
// import { useSchool } from '@/features/schools';
// import { useMemo } from 'react';
// import { BiodataSiswa } from '@/core/models/biodata';
// import { useClassroom } from '@/features/classroom';

// export function HistoryAttendanceTable() {
//   const biodata = useBiodata();
//   const school = useSchool();
//   const classroom = useClassroom();

//   const datas = useMemo(() => {
//     const allAttendanceData: BiodataSiswa[] = [];

//     biodata.data?.forEach((student) => {
//       student.absensis?.forEach((studentAttendance) => {
//         // Untuk setiap absensi yang ditemukan, buat objek baru dengan data siswa dan absensinya
//         allAttendanceData.push({
//           ...student,
//           attendance: studentAttendance,
//         });
//       });
//     });

//     return allAttendanceData; // Mengembalikan semua data absensi
//   }, [biodata.data]);

//   const columns = useMemo(
//     () =>
//       studentAttendanceColumn({
//         classroomOptions: distinctObjectsByProperty(
//           classroom.data?.map((d) => ({
//             label: d.namaKelas,
//             value: d.namaKelas,
//           })) || [],
//           'value',
//         ),
//         schoolOptions: distinctObjectsByProperty(
//           school.data?.map((d) => ({
//             label: d.namaSekolah,
//             value: d.namaSekolah,
//           })) || [],
//           'value',
//         ),
//       }),
//     [school.data, classroom.data],
//   );

//   return (
//     <BaseDataTable
//       columns={columns}
//       data={datas}
//       dataFallback={[]}
//       globalSearch
//       searchParamPagination
//       showFilterButton
//       initialState={{
//         columnVisibility: {
//           user_email: false,
//           user_nis: false,
//           user_nisn: false,
//         },
//         sorting: [
//           {
//             id: 'attendance_createdAt',
//             desc: true,
//           },
//         ],
//       }}
//       searchPlaceholder={lang.text('search')}
//       isLoading={biodata.query.isLoading}
//     />
//   );
// }
