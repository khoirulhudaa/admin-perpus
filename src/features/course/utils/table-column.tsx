import { lang, simpleEncode } from "@/core/libs";
import { CourseDataModel } from "@/core/models/course";
import {
  BaseActionTable,
  BaseTableFilter,
  BaseTableHeader,
} from "@/features/_global";
import { ColumnDef } from "@tanstack/react-table";

export const courseColumns = ({
  schoolOptions = [],
  classroomOptions = [],
  onEdit, // Add onEdit callback
}: BaseTableFilter & { onEdit?: (course: CourseDataModel) => void }): ColumnDef<CourseDataModel>[] => {
  return [
    {
      accessorKey: "namaMataPelajaran",
      accessorFn: (row) => row.namaMataPelajaran,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("course")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.namaMataPelajaran}</span>;
      },
    },
    {
      accessorKey: "sekolah.namaSekolah",
      accessorFn: (row) => row.sekolah?.namaSekolah,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("school")}
          </BaseTableHeader>
        );
      },
      meta: {
        filterLabel: lang.text("school"),
        filterPlaceholder: lang.text("selectSchool"),
        filterVariant: "select",
        filterOptions: schoolOptions,
      },
    },
    {
      accessorKey: "kelas",
      accessorFn: (row) => row.kelas?.namaKelas,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text('className')}
          </BaseTableHeader>
        );
      },
      meta: {
        filterLabel: lang.text('className'),
        filterPlaceholder: lang.text('selectClassRoom'),
        filterVariant: "select",
        filterOptions: schoolOptions,
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
          JSON.stringify({
            id: row.original.id,
            text: row.original.namaMataPelajaran,
          }),
        );
        return (
          <BaseActionTable
            // detailPath={`/courses/${encryptPayload}`} // Optional: Keep if detail view is needed
            onEdit={() => onEdit?.(row.original)} // Trigger onEdit callback
            deletePath={`/courses/delete/${encryptPayload}`}
          />
        );
      },
    },
  ];
};

export const courseDataFallback: CourseDataModel[] = [];