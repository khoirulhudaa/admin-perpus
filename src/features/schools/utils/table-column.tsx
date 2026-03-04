import { Avatar, AvatarFallback, AvatarImage, Badge, lang, simpleEncode } from "@/core/libs";
import { SchoolDataModel } from "@/core/models/schools";
import { getStaticFile } from "@/core/utils";
import { BaseActionTable, BaseTableHeader } from "@/features/_global";
import { ColumnDef } from "@tanstack/react-table";

export const schoolColumns: ColumnDef<SchoolDataModel>[] = [
  {
    accessorKey: "namaSekolah",
    accessorFn: (row) => row.namaSekolah,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("school")}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.namaSekolah || "";
      const nameArr = name?.split(" ") || [];
      const status =
        Number(row.original.active) === 1 ? "Aktif" : "Tidak Aktif";
      const initialName =
        nameArr && nameArr.length > 0
          ? `${nameArr?.[0]?.[0]?.toUpperCase() || ""}${
              nameArr?.[1]?.[0]?.toUpperCase() || ""
            }`
          : "-";
      return (
        <div className="flex flex-row gap-2 items-center">
          <Avatar className="rounded-none">
            <AvatarImage src={row.original.file.includes('/uploads/assets/') ? `https://dev.kiraproject.id${row.original.file}` : getStaticFile(row.original.file)} alt="@shadcn" />
            <AvatarFallback className="rounded-none">
              {initialName}
            </AvatarFallback>
          </Avatar>
          <div className="py-2">
            <p className="font-bold mb-1">{row.original.namaSekolah}</p>
            <Badge
              variant={
                Number(row.original.active) === 1 ? "default" : "destructive"
              }
            >
              {status}
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "npsn",
    accessorFn: (row) => row.npsn,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {"NPSN"}
        </BaseTableHeader>
      );
    },
  },
  {
    accessorKey: "namaAdmin",
    accessorFn: (row) => row.namaAdmin,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {"Admin"}
        </BaseTableHeader>
      );
    },
  },
  {
    accessorKey: "id",
    accessorFn: (row) => row.id,
    header: () => {
      return null;
    },
    cell: ({ row }) => {
      const encryptPayload = simpleEncode(
        JSON.stringify({ id: row.original.id, text: row.original.namaSekolah })
      );
      return (
        <BaseActionTable
          detailPath={`/schools/${encryptPayload}`}
          // editPath={`/schools/edit/${encryptPayload}`}
        />
      );
    },
  },
];

export const schoolColumnsByProvince: ColumnDef<SchoolDataModel>[] = [
  {
    accessorKey: 'namaSekolah',
    accessorFn: (row) => row.namaSekolah,
    header: ({ column }) => (
      <BaseTableHeader
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {lang.text('school')}
      </BaseTableHeader>
    ),
  },
  {
    accessorKey: 'province',
    accessorFn: (row) => row.nameProvince,
    header: ({ column }) => (
      <BaseTableHeader
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {lang.text('province')}
      </BaseTableHeader>
    ),
  },
  {
    accessorKey: 'active',
    accessorFn: (row) => row.active,
    header: ({ column }) => (
      <BaseTableHeader
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {lang.text('status')}
      </BaseTableHeader>
    ),
    cell: ({ row }) => (
      <div
        className={`${
          row.original.active === 1
            ? 'bg-[#0f4d3f] text-[#3ee07a]'
            : 'bg-[#6f1e2a] text-[#e04a6a]'
        } w-max flex items-center text-xs font-sans rounded px-2 py-1`}
      >
        {row.original.active === 1 ? 'Aktif' : 'Tidak Aktif'}
      </div>
    ),
  },
  {
    accessorKey: 'jumlahSiswa',
    header: ({ column }) => (
      <BaseTableHeader
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {lang.text('totalStudents')}
      </BaseTableHeader>
    ),
    cell: ({ row }) => <p>{row.original.jumlah_siswa}</p>, // Use jumlahSiswa from row.original
  },
];

export const schoolDataFallback: SchoolDataModel[] = [];

