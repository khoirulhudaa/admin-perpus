import { ColumnDef } from '@tanstack/react-table';
import { Badge, lang } from '@/core/libs'; // Impor dari Shadcn UI
import dayjs from 'dayjs';
import { BaseTableHeader } from '@/features/_global';

export interface Attendance {
  user: {
    image: string;
    name: string;
    nisn: string;
  };
  kelas: {
    namaKelas: string;
  };
  attendance: {
    statusKehadiran: string;
    namaMataPelajaran: string;
    tanggal: string;
    jamMasuk: string;
  };
}

export const columns: ColumnDef<Attendance>[] = [
  {
    accessorKey: 'user.name',
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text('name')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => row.original.user.name || 'N/A',
    enableSorting: true,
    meta: { width: '25%' },
  },
  {
    accessorKey: 'kelas.namaKelas',
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text('className')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => row.original.kelas.namaKelas || 'N/A',
    enableSorting: true,
    meta: { width: '15%' },
  },
  {
    accessorKey: 'attendance.namaMataPelajaran',
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text('course')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => row.original.attendance.namaMataPelajaran || 'N/A',
    enableSorting: true,
    meta: { width: '20%' },
  },
  {
    accessorKey: 'attendance.statusKehadiran',
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text('status')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      const status = row.original.attendance?.statusKehadiran || 'N/A';
      let variant;

      if (status === 'hadir') {
        variant = 'bg-green-600 text-white'; // Hijau untuk hadir
      } else if (status === 'alfa') {
        variant = 'bg-red-600 text-white'; // Merah untuk alfa
      } else if (status === 'izin') {
        variant = 'bg-yellow-600 text-white'; // Kuning untuk izin
      }

      return (
        <Badge
          className={`px-6 py-2 ${variant}`}
        >
          {status}
        </Badge>
      );
    },
    enableSorting: true,
    meta: { width: '15%' },
  },
  {
    accessorKey: 'attendance.tanggal',
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text('date')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) =>
      dayjs(row.original.attendance.tanggal, 'DD MMM YYYY, HH:mm:ss')
        .tz('Asia/Jakarta')
        .format('DD MMM YYYY') || 'N/A',
    enableSorting: true,
    meta: { width: '15%' },
  },
  // {
  //   accessorKey: 'attendance.jamMasuk',
  //   header: ({ column }) => {
  //     return (
  //       <BaseTableHeader
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         {lang.text('clockIn')}
  //       </BaseTableHeader>
  //     );
  //   },
  //   cell: ({ row }) =>
  //     dayjs(row.original.attendance.jamMasuk, 'DD MMM YYYY, HH:mm:ss')
  //       .tz('Asia/Jakarta')
  //       .format('HH:mm:ss') || 'N/A',
  //   enableSorting: true,
  //   meta: { width: '10%' },
  // },
];