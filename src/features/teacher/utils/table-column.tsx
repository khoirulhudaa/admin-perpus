import { BiodataGuru } from "@/core/models/biodata-guru";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  dayjs,
} from "@/core/libs";
import { ColumnDef } from "@tanstack/react-table";
import { TableItemGuru } from "../components";
import {
  BaseActionTable,
  BaseDataTableFilterValueItem,
  BaseTableHeader,
  BaseUserItem,
} from "@/features/_global";
import { lang, simpleEncode } from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  EvidenceItem,
  EvidencePreview,
} from "@/features/attendance/components";

export const tableColumnGuru: ColumnDef<BiodataGuru>[] = [
  {
    accessorKey: "namaGuru",
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {"Data Guru"}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <BaseUserItem
          image={getStaticFile(String(row.original.user?.image))}
          name={row.original.user?.name}
          text2={dayjs(row.original.attendance?.createdAt).fromNow()}
        />
      );
    },
    accessorFn: (row) => row.namaGuru,
    enableGlobalFilter: true,
  },
  {
    accessorFn: (row) => row.user?.email,
    accessorKey: "user.email",
  },
  {
    accessorFn: (row) => row.user?.nip,
    accessorKey: "user.nip",
  },
  {
    accessorFn: (row) => row.user?.nrk,
    accessorKey: "user.nrk",
  },
  {
    accessorFn: (row) => row.user?.sekolah?.namaSekolah,
    accessorKey: "user.sekolah.namaSekolah",
  },
  {
    accessorFn: (row) => row.user?.nik,
    accessorKey: "user.nik",
  },
  {
    accessorFn: (row) => row.mataPelajaran?.namaMataPelajaran,
    accessorKey: "mataPelajaran.namaMataPelajaran",
  },
  {
    accessorFn: (row) => row.kode_guru,
    accessorKey: "kode_guru",
  },
  {
    accessorKey: "attendance.createdAt",
    accessorFn: (row) => row.attendance?.createdAt,
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
          text: row.original.user?.name,
        }),
      );
      return (
        <div className="flex flex-row justify-end">
          <BaseActionTable
            detailPath={`/teachers/${encryptPayload}`}
            editPath={`/teachers/edit/${encryptPayload}`}
            // deletePath={`/students/delete/${encryptPayload}`}
          />
        </div>
      );
    },
  },
];

export const teacherColumnWithFilter = ({
  schoolOptions = [],
}: {
  schoolOptions: BaseDataTableFilterValueItem[];
}): ColumnDef<BiodataGuru>[] => {
  return [
    {
      accessorKey: "user.name",
      accessorFn: (row) => row.user?.name,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("teacherName")}
          </BaseTableHeader>
        );
      },
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const nameArr = row.original.user?.name?.split(" ") || [];
        const initialName =
          nameArr && nameArr.length > 0
            ? `${nameArr?.[0]?.[0]?.toUpperCase() || ""}${nameArr?.[1]?.[0]?.toUpperCase() || ""}`
            : "-";
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage
                // image={detail.data?.user?.image?.includes('uploads') ? `https://dev.kiraproject.id${detail.data?.user?.image}` : getStaticFile(String(detail.data?.user?.image))}

                src={row.original?.user?.image?.includes('uploads') ? `https://dev.kiraproject.id${row.original?.user?.image}` : getStaticFile(String(row.original?.user?.image))}
                alt={row.original.user?.name}
              />
              <AvatarFallback>{initialName}</AvatarFallback>
            </Avatar>
            <p>{row.original.user?.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "user.email",
      accessorFn: (row) => row.user?.email,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("email")}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.nip",
      accessorFn: (row) => row.user?.nip,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"NIP"}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.nrk",
      accessorFn: (row) => row.user?.nrk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {`NRK`}
          </BaseTableHeader>
        );
      },
    },
    // {
    //   accessorKey: "user.nikki",
    //   accessorFn: (row) => row.user?.nikki,
    //   header: ({ column }) => {
    //     return (
    //       <BaseTableHeader
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         {`NIKKI`}
    //       </BaseTableHeader>
    //     );
    //   },
    // },
    {
      accessorKey: "user.sekolah.namaSekolah",
      accessorFn: (row) => row.user?.sekolah?.namaSekolah,
      meta: {
        filterLabel: lang.text("school"),
        filterPlaceholder: lang.text("selectSchool"),
        filterVariant: "select",
        filterOptions: schoolOptions,
      },
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("schoolName")}
          </BaseTableHeader>
        );
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
            id: row.original.userId,
            text: row.original.user?.name,
          }),
        );
        return (
          <BaseActionTable
            detailPath={`/teachers/${encryptPayload}`}
            editPath={`/teachers/edit/${encryptPayload}`}
          />
        );
      },
    },
  ];
};

export const teacherColumnWithFilter2 = ({
  schoolOptions = [],
  handleAttend,
  handleAttendGoHome
}: {
  schoolOptions: BaseDataTableFilterValueItem[];
}): ColumnDef<BiodataGuru>[] => {
  return [
    {
      accessorKey: "user.name",
      accessorFn: (row) => row.user?.name,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("teacherName")}
          </BaseTableHeader>
        );
      },
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const nameArr = row.original.user?.name?.split(" ") || [];
        const initialName =
          nameArr && nameArr.length > 0
            ? `${nameArr?.[0]?.[0]?.toUpperCase() || ""}${nameArr?.[1]?.[0]?.toUpperCase() || ""}`
            : "-";
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage
                // image={detail.data?.user?.image?.includes('uploads') ? `https://dev.kiraproject.id${detail.data?.user?.image}` : getStaticFile(String(detail.data?.user?.image))}

                src={row.original?.user?.image?.includes('uploads') ? `https://dev.kiraproject.id${row.original?.user?.image}` : getStaticFile(String(row.original?.user?.image))}
                alt={row.original.user?.name}
              />
              <AvatarFallback>{initialName}</AvatarFallback>
            </Avatar>
            <p>{row.original.user?.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "user.email",
      accessorFn: (row) => row.user?.email,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("email")}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.nip",
      accessorFn: (row) => row.user?.nip,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"NIP"}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.nrk",
      accessorFn: (row) => row.user?.nrk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {`NRK`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.sekolah.namaSekolah",
      accessorFn: (row) => row.user?.sekolah?.namaSekolah,
      meta: {
        filterLabel: lang.text("school"),
        filterPlaceholder: lang.text("selectSchool"),
        filterVariant: "select",
        filterOptions: schoolOptions,
      },
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("schoolName")}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <BaseTableHeader>Status</BaseTableHeader>,
      cell: ({ row }) => {
        // Get stored userIds from localStorage
        const storedUserIds = localStorage.getItem('attendedUserIds');
        const userIds = storedUserIds ? JSON.parse(storedUserIds) : [];
        const isAttended = userIds.includes(row.original?.user?.id);
        const status = row.original.statusKehadiran;
        return (
          <div
            className={`w-[114px] text-center px-3 py-1 rounded-sm ${
              status === 'hadir' ? 'bg-[#0f4d3f] text-[#3ee07a]' : isAttended ? 'bg-[#0f4d3f] text-[#3ee07a]' : 'bg-red-700 text-red-300'
            }`}
          >
            {status === 'hadir' ? lang.text('attend') : isAttended ? lang.text('attend') : status === 'belum hadir' ?  lang.text('notYetIn') : status}
          </div>
        );
      },
    },
    {
      accessorKey: "hadir",
      header: () => <BaseTableHeader>{lang.text('attendance')}</BaseTableHeader>,
      cell: ({ row }) => {
        // Get stored userIds from localStorage
        const storedUserIds = localStorage.getItem('attendedUserIds');
        const userIds = storedUserIds ? JSON.parse(storedUserIds) : [];
        const isAttended = userIds.includes(row.original?.id);

        return (
          <Button
            className={row.original.statusKehadiran !== 'hadir' ? 'bg-green-200 text-[#0f4d3f] font-bold hover:bg-green-300' : 'bg-white/50 text-black/80 font-bold cursor-default hover:bg-white/50'}
            onClick={isAttended ? null : () => handleAttend(row.original?.user?.id)}
            disabled={isAttended || (row.original.statusKehadiran || row.original.statusKehadiran || row.original?.user?.status) === 'hadir'}
          >
            {lang.text('attend')}
          </Button>
        );
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
            id: row.original.userId,
            text: row.original.user?.name,
          }),
        );
        return (
          <BaseActionTable
            detailPath={`/teachers/${encryptPayload}`}
            editPath={`/teachers/edit/${encryptPayload}`}
          />
        );
      },
    },
  ];
};

export const tableDataGuruFallback: BiodataGuru[] = [];

export const teacherDailyPresenceColumn: ColumnDef<
  BiodataGuru["absensis"][0]
>[] = [
  {
    accessorKey: "createdAt",
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("date")}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.createdAt
            ? dayjs(row.original.createdAt).format("DD MMM YYYY")
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "jamMasuk",
    accessorFn: (row) => row.jamMasuk,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("clockIn")}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.jamMasuk
            ? dayjs(row.original.jamMasuk).format("HH:mm")
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "jamPulang",
    accessorFn: (row) => row.jamPulang,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("clockOut")}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.jamPulang
            ? dayjs(row.original.jamPulang).format("HH:mm")
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "tipeAbsenMasuk",
    accessorFn: (row) => row.tipeAbsenMasuk,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("presenceType")}
        </BaseTableHeader>
      );
    },
  },
  {
    accessorKey: "statusKehadiran",
    accessorFn: (row) => row.statusKehadiran,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("presenceStatus")}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => (
      <>
        {row.original?.statusKehadiran ? (
          <Badge>{row.original?.statusKehadiran?.toUpperCase()}</Badge>
        ) : (
          "-"
        )}
      </>
    ),
  },
  {
    accessorKey: "id",
    accessorFn: (row) => row.id,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("evidence")}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      const items: EvidenceItem[] = [];

      if (row.original?.fotoAbsen) {
        items.push({
          title: lang.text("attendanceInPhoto"),
          image: getStaticFile(row.original?.fotoAbsen),
          status: row.original?.statusKehadiran,
        });
      }

      if (row.original?.fotoAbsenPulang) {
        items.push({
          title: lang.text("attendanceOutPhoto"),
          image: getStaticFile(row.original?.fotoAbsenPulang),
          status: row.original?.statusKehadiran,
        });
      }

      if (row.original?.dispensasi?.buktiSurat) {
        items.push({
          title: lang.text("evidence"),
          image: getStaticFile(row.original?.dispensasi?.buktiSurat),
          status: row.original?.statusKehadiran,
        });
      }

      return <EvidencePreview items={items} />;
    },
  },
];
