// import { distinctObjectsByProperty, lang } from '@/core/libs';
// import { BaseDataTableAttedance } from '@/features/_global/components/base-data-table-attedance';
// import { useClassroom } from '@/features/classroom';
// import { useSchool } from '@/features/schools';
// import { useMemo } from 'react';
// import { studentAttendanceColumn } from '../utils';

// interface StudentAttendanceTableProps {
//   data: any[];
//   isLoading: boolean;
//   mode: 'daily' | 'monthly' | 'yearly';
//   onPaginationChange?: (pagination: any) => void;
//   pageCount?: number; // Tambahkan prop untuk pageCount dari API
// }

// export function StudentAttendanceTable({ data, isLoading, mode, onPaginationChange, pageCount }: StudentAttendanceTableProps) {
//   const school = useSchool();
//   const classroom = useClassroom();

//   console.log('data', data)

//   const columns = useMemo(
//     () =>
//       studentAttendanceColumn({
//         classroomOptions: distinctObjectsByProperty(
//           classroom.data?.map((d) => ({
//             label: d.namaKelas,
//             value: d.namaKelas,
//           })) || [],
//           'value'
//         ),
//         schoolOptions: distinctObjectsByProperty(
//           school.data?.map((d) => ({
//             label: d.namaSekolah,
//             value: d.namaSekolah,
//           })) || [],
//           'value'
//         ),
//         dataMode: mode as 'daily' | 'monthly' | 'yearly' || 'daily', // Default to 'daily' if mode is undefined
//       }),
//     [school.data, classroom.data],
//   );

//   return (
//     <div>
//       <BaseDataTableAttedance
//           columns={columns}
//           data={data}
//           dataFallback={[]}
//           globalSearch
//           searchParamPagination
//           showFilterButton
//           pageSize={20}
//           initialState={{
//             columnVisibility: {
//               user_email: false,
//               user_nis: false,
//               user_nisn: false,
//             },
//             sorting: [
//               {
//                 id: 'attendance_createdAt',
//                 desc: true,
//               },
//             ],
//           }}
//           searchPlaceholder={lang.text('search')}
//           isLoading={isLoading}
//           onPaginationChange={onPaginationChange}
//           pageCount={pageCount} // Tambahkan pageCount ke BaseDataTable
//         />
//     </div>
//   );
// }



import { distinctObjectsByProperty, lang } from '@/core/libs';
import { BaseDataTableAttedance } from '@/features/_global/components/base-data-table-attedance';
import { useClassroom } from '@/features/classroom';
import { useSchool } from '@/features/schools';
import { useMemo } from 'react';
import { studentAttendanceColumn } from '../utils';

interface StudentAttendanceTableProps {
  data: any[];
  isLoading: boolean;
  mode: 'daily' | 'monthly' | 'yearly';
  onPaginationChange?: (pagination: any) => void;
  pageCount?: number; // Tambahkan prop untuk pageCount dari API
}

export function StudentAttendanceTable({ data, isLoading, mode, onPaginationChange, pageCount }: StudentAttendanceTableProps) {
  const school = useSchool();
  const classroom = useClassroom();

  console.log('data', data)

  const columns = useMemo(
    () =>
      studentAttendanceColumn({
        classroomOptions: distinctObjectsByProperty(
          classroom.data?.map((d) => ({
            label: d.namaKelas,
            value: d.namaKelas,
          })) || [],
          'value'
        ),
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          'value'
        ),
        dataMode: mode as 'daily' | 'monthly' | 'yearly' || 'daily', // Default to 'daily' if mode is undefined
      }),
    [school.data, classroom.data],
  );

  return (
    <div>
      <BaseDataTableAttedance
          columns={columns}
          data={data}
          dataFallback={[]}
          globalSearch={false}
          // searchParamPagination
          showFilterButton
          pageSize={20}
          initialState={{
            columnVisibility: {
              user_email: false,
              user_nis: false,
              user_nisn: false,
            },
            sorting: [
              {
                id: 'attendance_createdAt',
                desc: true,
              },
            ],
          }}
          // searchPlaceholder={lang.text('search')}
          isLoading={isLoading}
          onPaginationChange={onPaginationChange}
          pageCount={pageCount} // Tambahkan pageCount ke BaseDataTable
        />
    </div>
  );
}
