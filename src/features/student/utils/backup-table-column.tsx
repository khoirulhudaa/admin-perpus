import { Avatar, AvatarFallback, AvatarImage, Badge, Button, dayjs, lang, simpleEncode } from "@/core/libs"
import {
  BiodataSiswa,
  StudentCoursePresenceDataModel,
} from "@/core/models/biodata"
import { getStaticFile } from "@/core/utils"
import {
  BaseActionTable,
  // BaseTableFilter,
  BaseTableHeader,
  BaseUserItem,
} from "@/features/_global"
import { EvidenceItem, EvidencePreview } from "@/features/attendance/components"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { buildSelectFilter } from "@/features/_global/components/use-table-column-filter"
// import { FormRfid } from "../components"
// import { QueryClient, useQueryClient } from "@tanstack/react-query"
// Pastikan ada komponen Modal


interface FlatStudentModel {
  id: number;
  name: string;
  email: string;
  nis: string;
  nisn: string;
  rfid: string;
  image: string;
  biodataSiswa?: {
    kelas?: {
      id?: number;
      namaKelas?: string;
    };
  }[];
}


export const studentColumnWithFilter = ({
  schoolOptions = [],
  classroomOptions = [],
  // onRfidSuccess,
}: {
  
  
  schoolOptions?: { label: string; value: string | number }[];
  classroomOptions?: { label: string; value: string | number }[];
}): ColumnDef<FlatStudentModel>[] => {
  
  // const MemoizedFormRfid = React.memo(FormRfid);
  // const queryClient = useQueryClient();

  const classroomFilterMeta = buildSelectFilter(
    "biodataSiswa[0].kelas.namaKelas",
    lang.text("classroom"),
    classroomOptions
  );

  // const schoolFilterMeta = buildSelectFilter(
  //   "biodataSiswa[0].kelas.sekolah.namaSekolah",
  //   lang.text("school"),
  //   schoolOptions
  // )

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
        const nameArr = (row.original.name || row.original.user?.name)?.split(" ") || [];
        const initials =
          nameArr?.[0]?.[0]?.toUpperCase() + (nameArr?.[1]?.[0]?.toUpperCase() || "");
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage
                src={getStaticFile(String((row.original.image || row.original.name) || (row.original.user.image || row.original.user?.name)))}
                alt={row.original.name || (row.original.user.image || row.original.user?.name)}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <p>{(row.original.user?.name || row.original.name) || '-'}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: () => <BaseTableHeader>{lang.text("email")}</BaseTableHeader>,
      cell: ({ row }) => <span>{(row.original.user?.email || row.original.email) || '-'}</span>,
    },
    {
      accessorKey: "nis",
      header: () => <BaseTableHeader>NIS</BaseTableHeader>,
      cell: ({ row }) => <span>{(row.original.user?.nis || row.original.nis) || '-'}</span>,
    },
    {
      accessorKey: "nisn",
      header: () => <BaseTableHeader>NISN</BaseTableHeader>,
      cell: ({ row }) => <span>{(row.original.user?.nisn || row.original.nisn) || '-'}</span>,
    },
    // {
    //   accessorKey: "rfid",
    //   header: () => <BaseTableHeader>RFID</BaseTableHeader>,
    //   cell: ({ row }) => {
    //     const rfid = row.original.rfid;
    //     const userId = row.original.id;
    
    //     return (
    //       <div className="w-[150px] h-[50px] m-auto">
    //       {!rfid ? (
    //             <MemoizedFormRfid 
    //               userId={userId} 
    //               onSuccess={onRfidSuccess}
    //             />
    //       ) : (
    //         <span className="text-sm text-muted-foreground">{rfid}</span>
    //       )}
    //     </div>
    //     );
    //   },
    // },    
    {
      ...classroomFilterMeta,
      accessorFn: (row) => row.biodataSiswa?.[0]?.kelas?.namaKelas || "-",
      header: () => <BaseTableHeader>{lang.text("classroom")}</BaseTableHeader>,
      cell: ({ row }) => (
        <span>{(row.original.biodataSiswa?.[0]?.kelas?.namaKelas || row.original.kelas?.namaKelas) || "-"}</span>
      ),
      meta: {
        filterLabel: lang.text("classroom"),
        filterPlaceholder: lang.text("selectClassroom"),
        filterVariant: "select",
        filterOptions: classroomOptions, // ✅ DI SINI UBAHNYA
      },
      id:"idKelas"
    },
    {
      accessorKey: "sekolah.namaSekolah",
      accessorFn: (row) => row.sekolah?.namaSekolah || "-",
      header: () => <BaseTableHeader>{lang.text("school")}</BaseTableHeader>,
      cell: ({ row }) => <span>{row.original.sekolah?.namaSekolah || "-"}</span>,
      meta: {
        filterLabel: lang.text("school"),
        filterPlaceholder: lang.text("selectSchool"),
        filterVariant: "select",
        filterOptions: schoolOptions,
      },
      id: "sekolahId", // ⬅️ Tambahin id custom untuk filter tracking
    },
    // {
    //   ...schoolFilterMeta,
    //   accessorFn: (row) => row.sekolah?.namaSekolah || "-",
    //   header: () => <BaseTableHeader>{lang.text("school")}</BaseTableHeader>,
    //   cell: ({ row }) => <span>{row.original.sekolah?.namaSekolah || "-"}</span>,
    // },
    
    {
      accessorKey: "id",
      accessorFn: (row) =>
      row.biodataSiswa?.map((b) => b.id).filter(Boolean).join(", ") || "-",
      enableSorting: false,
      header: () => null,
      cell: ({ row }) => {
        const biodataId = row.original.biodataSiswa?.find((b) => b?.id)?.id;
        const userId = row.original.id;
    
        const encryptPayload = simpleEncode(
          JSON.stringify({
            id: biodataId,
            biodataId: userId,
            text: row.original.name,
          })
        );
    
        return (
          <BaseActionTable
            detailPath={`/students/${encryptPayload}`}
            editPath={`/students/edit/${encryptPayload}`}
          />
        );


        // yang baru
        // const encryptPayloadUserId = simpleEncode(
        //   JSON.stringify({
        //     id: userId,
        //     text: row.original.name,
        //   })
        // );

        // localStorage.setItem('userId', encryptPayload)

        // return (
        //   <BaseActionTable
        //     detailPath={`/students/${encryptPayload}`}
        //     editPath={`/students/edit/${encryptPayload}`}
        //   />
        // );
      },
    },
    
  ];
};


// Modal untuk mengedit RFID

export const tableColumnSiswa: ColumnDef<BiodataSiswa>[] = [
  {
    accessorKey: "user.name",
    accessorFn: (row) => row.user?.name,
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {"Data Siswa"}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <BaseUserItem
          image={getStaticFile(String(row.original.user?.image))}
          name={row.original.user?.name}
          text2={dayjs(row.original.attendance?.createdAt).fromNow()}
        />
      )
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "user.email",
    accessorFn: (row) => row.user?.email,
  },
  {
    accessorKey: "user.nis",
    accessorFn: (row) => row.user?.nis,
  },
  {
    accessorKey: "user.nisn",
    accessorFn: (row) => row.user?.nisn,
  },
  {
    accessorKey: "user.sekolah.namaSekolah",
    accessorFn: (row) => row.user?.sekolah?.namaSekolah,
  },
  {
    accessorKey: "kelas.namaKelas",
    accessorFn: (row) => row.kelas?.namaKelas,
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
      return null
    },
    cell: ({ row }) => {
      const encryptPayload = simpleEncode(
        JSON.stringify({
          id: row.original.id,
          text: row.original.user?.name,
        })
      )
      return (
        <div className="flex flex-row justify-end">
          <BaseActionTable
            detailPath={`/students/${encryptPayload}`}
            editPath={`/students/edit/${encryptPayload}`}
            // deletePath={`/students/delete/${encryptPayload}`}
          />
        </div>
      )
    },
  },
]

export const studentDailyPresenceColumn: ColumnDef<
  BiodataSiswa["absensis"][0]
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
      )
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.createdAt
            ? dayjs(row.original.createdAt).format("DD MMM YYYY")
            : "-"}
        </div>
      )
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
      )
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.jamMasuk
            ? dayjs(row.original.jamMasuk).format("HH:mm")
            : "-"}
        </div>
      )
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
      )
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.jamPulang
            ? dayjs(row.original.jamPulang).format("HH:mm")
            : "-"}
        </div>
      )
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
      )
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
      )
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
      )
    },
    cell: ({ row }) => {
      const items: EvidenceItem[] = []

      if (row.original?.fotoAbsen) {
        items.push({
          title: lang.text("attendanceInPhoto"),
          image: getStaticFile(row.original?.fotoAbsen),
          status: row.original?.statusKehadiran,
        })
      }

      if (row.original?.fotoAbsenPulang) {
        items.push({
          title: lang.text("attendanceOutPhoto"),
          image: getStaticFile(row.original?.fotoAbsenPulang),
          status: row.original?.statusKehadiran,
        })
      }

      if (row.original?.dispensasi?.buktiSurat) {
        items.push({
          title: lang.text("evidence"),
          image: getStaticFile(row.original?.dispensasi?.buktiSurat),
          status: row.original?.statusKehadiran,
        })
      }

      return <EvidencePreview items={items} />
    },
  },
]

export const studentCoursePresenceColumn: ColumnDef<StudentCoursePresenceDataModel>[] =
  [
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
        )
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.createdAt
              ? dayjs(row.original.createdAt).format("DD MMM YYYY")
              : "-"}
          </div>
        )
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
            {lang.text("hour")}
          </BaseTableHeader>
        )
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.jamMasuk
              ? dayjs(row.original.jamMasuk).format("HH:mm")
              : "-"}
          </div>
        )
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
        )
      },
    },
    {
      accessorKey: "mataPelajaran.namaPelajar",
      accessorFn: (row) => row.mataPelajaran?.namaMataPelajaran,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("course")}
          </BaseTableHeader>
        )
      },
    },
    {
      accessorKey: "kehadiranMapel[0].statusKehadiran",
      accessorFn: (row) => row.kehadiranMapel?.[0]?.statusKehadiran,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("presenceStatus")}
          </BaseTableHeader>
        )
      },
      cell: ({ row }) => (
        <>
          {row.original?.kehadiranMapel?.[0]?.statusKehadiran ? (
            <Badge>
              {row.original.kehadiranMapel?.[0]?.statusKehadiran?.toUpperCase()}
            </Badge>
          ) : (
            "-"
          )}
        </>
      ),
    },
  ]

export const tableColumnSiswaFallback: BiodataSiswa[] = []
