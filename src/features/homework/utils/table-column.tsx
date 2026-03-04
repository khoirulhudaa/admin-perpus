import { Avatar, AvatarFallback, AvatarImage, lang } from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { BaseTableHeader } from "@/features/_global";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.locale("id");

// Interface to match the tableData structure from LibraryLandingTables
interface FlatStudentModel {
  noStatus?: boolean;
  id?: number;
  name: string;
  email?: string;
  nis: string;
  nisn?: string;
  rfid?: string;
  image?: string;
  namaKelas: string;
  noTlp: string;
  surveiApps: string;
  status: string;
  waktuMasuk: string | null;
  waktuKeluar: string | null;
  userId: number;
  dateMasuk?: string;
  dateKeluar?: string;
  hariMasuk?: string;
  hariKeluar?: string;
  durasiKunjungan?: number | null; // Assuming this is in seconds
}

export const LibraryColumnWithFilter = (): ColumnDef<FlatStudentModel>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("studentName")}
        </BaseTableHeader>
      ),
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const nameArr = row.original?.user?.name?.split(" ") || [];
        const initials =
          nameArr?.[0]?.[0]?.toUpperCase() + (nameArr?.[1]?.[0]?.toUpperCase() || "");
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage
                src={getStaticFile(String(row.original?.user?.image || row.original?.user?.name))}
                alt={row.original?.user?.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <p>{row.original?.user?.name || "-"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "nis",
      header: () => <BaseTableHeader>NIS</BaseTableHeader>,
      cell: ({ row }) => <span>{row.original?.user?.nis || "-"}</span>,
    },
    {
      accessorKey: "noTlp",
      header: () => <BaseTableHeader>No. Telepon</BaseTableHeader>,
      cell: ({ row }) => <span>{row.original?.user.noTlp || "-"}</span>,
    },
    {
      accessorKey: "status",
      header: () => <BaseTableHeader>Status</BaseTableHeader>,
      cell: ({ row }) => {
        const status = row.original.status;
        const bgColor =
          status === "masuk" ? "bg-green-300 text-green-800" :
          status === "keluar" ? "bg-red-100 text-red-800" :
          "bg-gray-100 text-gray-800";
          
        return (
          <span className={`px-2 py-1 rounded text-sm font-medium ${bgColor}`}>
            {status || "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "waktuMasuk",
      header: () => <BaseTableHeader>Waktu Masuk</BaseTableHeader>,
      cell: ({ row }) => {
        const waktu = row.original.waktuKunjungan;
        const formatted = waktu ? dayjs(waktu).format("dddd, DD MMMM YYYY") : "-";
        return <span>{formatted}</span>;
      },
    },
    {
      accessorKey: "waktuKeluar",
      header: () => <BaseTableHeader>Waktu Keluar</BaseTableHeader>,
      cell: ({ row }) => {
        const waktu = row.original.waktuKeluar;
        const formatted = waktu ? dayjs(waktu).format("dddd, DD MMMM YYYY") : "-";
        return <span>{formatted}</span>;
      },
    },
    {
      accessorKey: "durasiKunjungan",
      header: () => <BaseTableHeader>Durasi</BaseTableHeader>,
      cell: ({ row }) => {
        const durasi = row.original.durasiKunjungan;
        if (durasi === null || durasi === undefined) return <span>-</span>;

        // Convert seconds to hours and minutes
        const hours = Math.floor(durasi / 3600);
        const minutes = Math.floor((durasi % 3600) / 60);
        const seconds = durasi % 60;

        // Format the duration
        let formattedDuration = "";
        if (hours > 0) {
          formattedDuration += `${hours} jam`;
          if (minutes > 0) formattedDuration += ` ${minutes} menit`;
        } else if (minutes > 0) {
          formattedDuration += `${minutes} menit`;
          if (seconds > 0) formattedDuration += ` ${seconds} detik`;
        } else {
          formattedDuration = `${seconds} detik`;
        }

        return <span>{formattedDuration}</span>;
      },
    },
  ];
};

export const tableColumnSiswaFallback: FlatStudentModel[] = [];