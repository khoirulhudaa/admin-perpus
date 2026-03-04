// import { BaseDataTable } from "@/features/_global";
// import { lang } from "@/core/libs";
// import {
//   classroomColumns,
//   classroomDataFallback,
//   useClassroom,
// } from "@/features/classroom";
// import { useMemo } from "react";

// export interface SchoolClassroomTableProps {
//   id: number;
// }

// export const SchoolClassroomTable = (props: SchoolClassroomTableProps) => {
//   const resource = useClassroom();

//   const datas = useMemo(() => {
//     return resource.data?.filter((d) => Number(d.sekolahId) === props.id);
//   }, [props.id, resource.data]);
  
//   console.log('datas', datas)

//   return (
//     <BaseDataTable
//       columns={classroomColumns()}
//       data={datas}
//       dataFallback={classroomDataFallback}
//       globalSearch
//       actions={[
//         {
//           title: lang.text("addClassroom"),
//           url: "/classrooms/create",
//         },
//       ]}
//       searchParamPagination
//       searchPlaceholder={lang.text("search")}
//       isLoading={resource.query.isLoading}
//     />
//   );
// };

import { BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import {
  classroomColumns,
  classroomDataFallback,
  useClassroom,
} from "@/features/classroom";
import { useProfile } from "@/features/profile"; // Tambahkan useProfile
import { useMemo } from "react";

export interface SchoolClassroomTableProps {
  id: number;
}

export const SchoolClassroomTable = (props: SchoolClassroomTableProps) => {
  const resource = useClassroom();
  const profile = useProfile(); // Gunakan useProfile untuk mendapatkan namaSekolah

  // Ambil namaSekolah dari profile
  const namaSekolah = profile?.user?.sekolah?.namaSekolah || '-';

  const datas = useMemo(() => {
    return resource.data?.filter((d) => Number(d.sekolahId) === props.id);
  }, [props.id, resource.data]);

  console.log('datas', datas);

  // Buat schoolOptions untuk filter, menggunakan namaSekolah dari profile
  const schoolOptions = useMemo(() => {
    return namaSekolah ? [{ label: namaSekolah, value: namaSekolah }] : [];
  }, [namaSekolah]);

  return (
    <BaseDataTable
      columns={classroomColumns({ schoolOptions, namaSekolah })} // Teruskan namaSekolah dan schoolOptions
      data={datas}
      dataFallback={classroomDataFallback}
      globalSearch
      actions={[
        {
          title: lang.text("addClassroom"),
          url: "/classrooms/create",
        },
      ]}
      searchParamPagination
      searchPlaceholder={lang.text("search")}
      isLoading={resource.query.isLoading}
    />
  );
};