// import { lang, simpleEncode } from "@/core/libs";
// import { ClassroomDataModel } from "@/core/models";
// import {
//   BaseActionTable,
//   BaseTableFilter,
//   BaseTableHeader,
// } from "@/features/_global";
// import { ColumnDef } from "@tanstack/react-table";

// export const classroomColumns = (columFilter?: BaseTableFilter): ColumnDef<ClassroomDataModel>[] => {
//   return [
//     {
//       accessorKey: "namaKelas",
//       accessorFn: (row) => row.namaKelas,
//       header: ({ column }) => {
//         return (
//           <BaseTableHeader
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             {lang.text("classRoom")}
//           </BaseTableHeader>
//         );
//       },
//       cell: ({ row }) => {
//         return <span>{row.original.namaKelas}</span>;
//       },
//     },
//     {
//       accessorKey: "level",
//       accessorFn: (row) => row.level,
//       header: ({ column }) => {
//         return (
//           <BaseTableHeader
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             {"Level"}
//           </BaseTableHeader>
//         );
//       },
//     },
//     {
//       accessorKey: "Sekolah.namaSekolah",
//       accessorFn: (row) => row.Sekolah?.namaSekolah || '-',
//       header: ({ column }) => {
//         return (
//           <BaseTableHeader
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             {"Sekolah"}
//           </BaseTableHeader>
//         );
//       },
//       meta: {
//         filterLabel: lang.text("school"),
//         filterPlaceholder: lang.text("selectSchool"),
//         filterVariant: "select",
//         filterOptions: columFilter?.schoolOptions || [],
//       },
//     },
//     {
//       accessorKey: "id",
//       accessorFn: (row) => row.id,
//       size: 50,
//       enableSorting: false,
//       header: () => {
//         return null;
//       },
//       cell: ({ row }) => {
//         const encryptPayload = simpleEncode(
//           JSON.stringify({ id: row.original.id, text: row.original.namaKelas }),
//         );
//         // // console.log(encryptPayload)
//         // const encryptPayload = JSON.stringify({ id: row.original.id, text: row.original.namaKelas })
//         return (
//           <BaseActionTable
//             detailPath={`/classrooms/${encryptPayload}`}
//             editPath={`/classrooms/edit/${encryptPayload}`}
//             deletePath={`/classrooms/delete/${encryptPayload}`}
//           />
//         );
//       },
//     },
//   ];
// };

// export const classroomDataFallback: ClassroomDataModel[] = [];


import { lang, simpleEncode } from "@/core/libs";
import { ClassroomDataModel } from "@/core/models";
import {
  BaseActionTable,
  BaseTableFilter,
  BaseTableHeader,
} from "@/features/_global";
import { ColumnDef } from "@tanstack/react-table";

export const classroomColumns = (columFilter?: BaseTableFilter & { namaSekolah?: string }): ColumnDef<ClassroomDataModel>[] => {
  return [
    {
      accessorKey: "namaKelas",
      accessorFn: (row) => row.namaKelas,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("classRoom")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.namaKelas}</span>;
      },
    },
    {
      accessorKey: "level",
      accessorFn: (row) => row.level,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"Level"}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "Sekolah.namaSekolah",
      accessorFn: () => columFilter?.namaSekolah || '-', // Gunakan namaSekolah dari parameter
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"Sekolah"}
          </BaseTableHeader>
        );
      },
      meta: {
        filterLabel: lang.text("school"),
        filterPlaceholder: lang.text("selectSchool"),
        filterVariant: "select",
        filterOptions: columFilter?.schoolOptions || [],
      },
    },
    {
      accessorKey: "id",
      accessorFn: (row) => row.id,
      size: 50,
      enableSorting: false,
      header: () => {
        return null;
      },
      cell: ({ row }) => {
        const encryptPayload = simpleEncode(
          JSON.stringify({ id: row.original.id, text: row.original.namaKelas }),
        );
        return (
          <BaseActionTable
            detailPath={`/classrooms/${encryptPayload}`}
            editPath={`/classrooms/edit/${encryptPayload}`}
            deletePath={`/classrooms/delete/${encryptPayload}`}
          />
        );
      },
    },
  ];
};

export const classroomDataFallback: ClassroomDataModel[] = [];