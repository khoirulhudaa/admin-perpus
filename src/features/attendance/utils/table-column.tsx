import { Badge, dayjs, lang } from '@/core/libs';
import { BiodataSiswa } from '@/core/models/biodata';
import { BiodataGuru } from '@/core/models/biodata-guru';
import { getStaticFile } from '@/core/utils';
import {
  BaseDataTableFilterValueItem,
  BaseTableFilter,
  BaseTableHeader,
  BaseUserItem
} from '@/features/_global';
import { ColumnDef } from '@tanstack/react-table';
import { EvidenceItem, EvidencePreview } from '../components';

// Update calculateDelay function
const calculateDelay = (jamMasuk: string | undefined): string => {
  if (!jamMasuk || jamMasuk === "N/A") return "-";

  // Gunakan regex untuk ambil jam-menit-detik dari string apa pun
  const timeMatch = jamMasuk.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!timeMatch) return "-";

  const [_, h, m, s] = timeMatch;
  const hours = parseInt(h);
  const minutes = parseInt(m);
  const seconds = parseInt(s ?? "0");

  // Gunakan tanggal dummy untuk perbandingan waktu saja
  const entryTime = new Date(2025, 0, 1, hours, minutes, seconds);
  const standardTime = new Date(2025, 0, 1, 7, 0, 0); // 07:00:00

  if (entryTime <= standardTime) return "0 menit";

  const diffMinutes = Math.floor((entryTime.getTime() - standardTime.getTime()) / 1000 / 60);
  return `${diffMinutes} menit`;
};

const calculateDelayTeacher = (jamMasuk: string | undefined): string => {
  if (!jamMasuk || jamMasuk === "N/A") return "- Ros";

  // Parse ISO date string
  const entryTime = new Date(jamMasuk);
  if (isNaN(entryTime.getTime())) return "-"; // Handle invalid date

  // Gunakan tanggal dummy dengan waktu standar 07:00:00
  const standardTime = new Date(entryTime);
  standardTime.setHours(7, 0, 0, 0); // Set waktu standar ke 07:00:00

  if (entryTime <= standardTime) return "0 menit";

  const diffMinutes = Math.floor((entryTime.getTime() - standardTime.getTime()) / 1000 / 60);
  return `${diffMinutes} menit`;
};

export const studentAttendanceColumn = ({
  schoolOptions = [],
  classroomOptions = [],
  dataMode,
}: BaseTableFilter & { dataMode: "daily" | "monthly" }): ColumnDef<BiodataSiswa>[] => {
  return [
    {
      accessorKey: "attendance.createdAt",
      accessorFn: (row) => row.attendance?.createdAt || row.attendance?.tanggalMasuk,
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text("date")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => (
        <div>
          {row.original.attendance?.createdAt
            ? dayjs(row.original.attendance.createdAt).format("DD MMM YYYY")
            : row.original.attendance?.tanggalMasuk || "-"}
        </div>
      ),
    },
    // ...(dataMode === "daily"
    //   ? [
    //       {
    //         accessorKey: "attendance.tanggalMasuk",
    //         accessorFn: (row) => row.attendance?.tanggalMasuk,
    //         header: ({ column }) => (
    //           <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //             {lang.text("attendanceDate")}
    //           </BaseTableHeader>
    //         ),
    //         cell: ({ row }) => <div>{row.original.attendance?.tanggalMasuk || "-"}</div>,
    //       },
    //     ]
    //   : []),
    {
      accessorKey: "user.name",
      accessorFn: (row) => row.user?.name,
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text("student")}
        </BaseTableHeader>
      ),
      enableGlobalFilter: true,
      cell: ({ row }) => (
        <BaseUserItem
          image={'https://dev.kiraproject.id'+row.original.user?.image}
          name={row.original.user?.name}
          text1={`Kelas: ${row.original.kelas?.namaKelas || "-"} / Sekolah: ${
            row.original.user?.sekolah?.namaSekolah || "-"
          }`}
          text2={`NIS: ${row.original.user?.nis || "1212126"} / NISN: ${row.original.user?.nisn || "-"}`}
        />
      ),
    },
    {
      accessorKey: "user.email",
      accessorFn: (row) => row.user?.email,
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {"Email"}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.user?.email || "-"}</div>,
    },
    {
      accessorKey: "user.nis",
      accessorFn: (row) => row.user?.nis,
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text("nis")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.user?.nis || "-"}</div>,
    },
    {
      accessorKey: "jamMasuk",
      accessorFn: (row) => row.attendance?.jamMasuk,
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text("clockIn")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.attendance?.jamMasuk || "-"}</div>,
    },
    {
      accessorKey: "jamPulang",
      accessorFn: (row) => row.attendance?.jamPulang,
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text("clockOut")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{(row.original.attendance?.jamPulang === 'N/A' || row.original.attendance?.jamPulang === null || row.original.attendance?.jamPulang === '-') ? "-"  : row.original.attendance?.jamPulang }</div>,
    },
    // ...(dataMode === "daily"
    // ? [
    // ]
    // : []),
    {
      accessorKey: "attendance.jenisAbsen",
      accessorFn: (row) => row.attendance?.jenisAbsen,
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text('presenceType')}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.attendance?.jenisAbsen || "-"}</div>,
    },
    {
      accessorKey: "attendance.delay",
      accessorFn: (row) => row.attendance?.jamMasuk,
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text("delay")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => {
        const jamMasuk = row.original.attendance?.jamMasuk;
        const isLate = calculateDelay(jamMasuk) !== "0 menit";

        return (
          <div
            className={
              isLate
                ? "bg-red-800 rounded-md text-red-200 px-2 py-[2px] w-max"
                : "bg-green-800 rounded-md text-green-200 px-2 py-[2px] w-max"
            }
          >
            {calculateDelay(jamMasuk)}
          </div>
        );
      },
    },
    {
      accessorKey: "user.nisn",
      accessorFn: (row) => row.user?.nisn,
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text("nisn")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.user?.nisn || "-"}</div>,
    },
    {
      accessorKey: "user.sekolah.namaSekolah",
      accessorFn: (row) => row.user?.sekolah?.namaSekolah,
      ...(schoolOptions &&
        schoolOptions.length > 0 && {
          meta: {
            filterLabel: lang.text("school"),
            filterPlaceholder: lang.text("selectSchool"),
            filterVariant: "select",
            filterOptions: schoolOptions,
            filterColumnVisible: false,
          },
        }),
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text("schoolName")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.user?.sekolah?.namaSekolah || "-"}</div>,
    },
    {
      accessorKey: "kelas.namaKelas",
      accessorFn: (row) => row.kelas?.namaKelas,
      ...(classroomOptions &&
        classroomOptions.length > 0 && {
          meta: {
            filterLabel: lang.text("classroom"),
            filterPlaceholder: lang.text("selectClassroom"),
            filterVariant: "select",
            filterOptions: classroomOptions,
            filterColumnVisible: false,
          },
        }),
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text("classroom")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => <div>{row.original.kelas?.namaeKelas === 'N/A' || row.original.kelas?.namaeKelas === null || row.original.kelas?.namaeKelas === '-' ? "-"  : row.original.kelas?.namaeKelas}</div>,
    },
    {
      accessorKey: "attendance.statusKehadiran",
      accessorFn: (row) => row.attendance?.statusKehadiran,
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text("status")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => {
        const jamPulang = row.original.attendance?.jamPulang;
        let isWithinTimeRange = false;

        if (jamPulang && jamPulang !== 'N/A' && jamPulang !== '-' && jamPulang !== null) {
          try {
            const [hours, minutes, seconds] = jamPulang.split(':').map(Number);
            const timeInHours = hours + minutes / 60 + seconds / 3600;
            // Check if jamPulang is between 12:00:00 and 18:00:00 (12 PM to 6 PM)
            isWithinTimeRange = timeInHours >= 12 && timeInHours <= 18;
          } catch (error) {
            console.error('Error parsing jamPulang:', error);
          }
        }

        return (
          <>
            {isWithinTimeRange ? (
              <Badge className="bg-red-800 font-bold text-red-200">
                {lang.text('out')}
              </Badge>
            ) : (
              <Badge>
                {row.original.attendance?.statusKehadiran?.toUpperCase() || '-'}
              </Badge>
            )}
          </>
        );
      },
    },
    {
      accessorKey: 'user.id',
      accessorFn: (row) => row.user?.id,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('evidence')}
        </BaseTableHeader>
      ),
      cell: ({ row }) => {
        const items: EvidenceItem[] = [];

       if (row.original.attendance?.fotoMasuk || row.original.attendance?.fotoPulang) {
        // console.log('row:', row.original.attendance)
        const imageSource = row.original.attendance.fotoMasuk || row.original.attendance.fotoPulang;
        items.push({
          title: lang.text('attendanceInPhoto'),
          image: imageSource
            ? imageSource.includes('/uploads')
              ? `https://dev.kiraproject.id${imageSource}`
              : `https://dev.kiraproject.id/${imageSource}`
            : '/placeholder-image.png', // Fallback for undefined image
          status: row.original.attendance?.statusKehadiran || 'Unknown', // Fallback for status
        });
      }
        return items.length > 0 ? <EvidencePreview items={items} /> : <div>-</div>;
      },
    },
  ];
};

export const teacherAttendanceColumn = ({
  schoolOptions = [],
}: {
  schoolOptions: BaseDataTableFilterValueItem[];
}): ColumnDef<BiodataGuru>[] => {
  return [
    {
      accessorKey: 'attendance.createdAt',
      accessorFn: (row) => row.attendance?.createdAt,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('date')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.attendance?.createdAt
              ? dayjs(row.original.attendance?.createdAt).format('DD MMM YYYY')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'attendance.jamMasuk',
      accessorFn: (row) => row.attendance?.jamMasuk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('clockIn')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.attendance?.jamMasuk
              ? dayjs(row.original.attendance?.jamMasuk).format('HH:mm')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'attendance.jamPulang',
      accessorFn: (row) => row.attendance?.jamPulang,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('clockOut')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.attendance?.jamPulang
              ? dayjs(row.original.attendance?.jamPulang).format('HH:mm')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'user.name',
      accessorFn: (row) => row.user?.name,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('teacher')}
          </BaseTableHeader>
        );
      },
      enableGlobalFilter: true,
      cell: ({ row }) => {
        return (
          <BaseUserItem
            image={row.original.user?.image}
            name={row.original.user?.name}
            text1={`NIP: ${row.original.user?.nip || '-'} / ${
              row.original.user?.sekolah?.namaSekolah || '-'
            }`}
            text2={`NRK: ${row.original.user?.nrk || '-'} / NIKKI: ${
              row.original.user?.nikki || '-'
            }`}
          />
        );
      },
    },
    {
      accessorKey: 'user.email',
      accessorFn: (row) => row.user?.email,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {'NIS'}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.nrk',
      accessorFn: (row) => row.user?.nrk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {'NRK'}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.nip',
      accessorFn: (row) => row.user?.nip,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {`NIP`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.nikki',
      accessorFn: (row) => row.user?.nikki,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {`NIKKI`}
          </BaseTableHeader>
        );
      },
    },
    {
    accessorKey: 'attendance.tipeAbsenMasuk',
    accessorFn: (row) => row.attendance?.tipeAbsenMasuk,
    header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('status')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => (
        <>
          {row.original.attendance?.tipeAbsenMasuk ? (
            <p>
              {row.original.attendance?.tipeAbsenMasuk}
            </p>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      accessorKey: 'user.sekolah.namaSekolah',
      accessorFn: (row) => row.user?.sekolah?.namaSekolah,
      meta: {
        filterLabel: lang.text('school'),
        filterPlaceholder: lang.text('selectSchool'),
        filterVariant: 'select',
        filterOptions: schoolOptions,
        filterColumnVisible: false,
      },
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('schoolName')}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'attendance.statusKehadiran',
      accessorFn: (row) => row.attendance?.statusKehadiran,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('status')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => (
        <>
          {row.original.attendance?.statusKehadiran ? (
            <Badge>
              {row.original.attendance?.statusKehadiran?.toUpperCase()}
            </Badge>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      accessorKey: "attendance.delay",
      accessorFn: (row) => row.attendance?.jamMasuk,
      header: ({ column }) => (
        <BaseTableHeader onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {lang.text("delay")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => {
        const jamMasuk = row.original.attendance?.jamMasuk;
        const isLate = calculateDelayTeacher(jamMasuk) !== "0 menit";

        return (
          <div
            className={
              isLate
                ? "bg-red-800 rounded-md text-red-200 px-2 py-[2px] w-max"
                : "bg-green-800 rounded-md text-green-200 px-2 py-[2px] w-max"
            }
          >
            {calculateDelayTeacher(jamMasuk)}
          </div>
        );
      },
    },
    {
      accessorKey: 'user.id',
      accessorFn: (row) => row.user?.id,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('evidence')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        const items: EvidenceItem[] = [];
        // console.log('image test', row.original.attendance?.fotoAbsen)

        if (row.original.attendance?.fotoAbsen) {
          items.push({
            title: lang.text('attendanceInPhoto'),
            image: row.original.attendance?.fotoAbsen.includes('uploads/assets') ? row.original.attendance?.fotoAbsen : getStaticFile(row.original.attendance?.fotoAbsen),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        if (row.original.attendance?.fotoAbsenPulang) {
          items.push({
            title: lang.text('attendanceOutPhoto'),
            image: getStaticFile(row.original.attendance?.fotoAbsenPulang),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        if (row.original.attendance?.dispensasi?.buktiSurat) {
          items.push({
            title: lang.text('evidence'),
            image: getStaticFile(
              row.original.attendance?.dispensasi?.buktiSurat,
            ),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        return <EvidencePreview items={items} name={row.original.namaGuru} />;
      },
    },
    // {
    //   accessorKey: 'id',
    //   accessorFn: (row) => row.id,
    //   size: 50,
    //   enableSorting: false,
    //   header: () => {
    //     return null;
    //   },
    //   cell: ({ row }) => {
    //     const encryptPayload = simpleEncode(
    //       JSON.stringify({
    //         id: row.original.userId,
    //         text: row.original.user?.name,
    //       }),
    //     );
    //     return (
    //       <BaseActionTable
    //         detailPath={`/teachers/${encryptPayload}`}
    //         editPath={`/teachers/edit/${encryptPayload}`}
    //         // deletePath={`/students/delete/${encryptPayload}`}
    //       />
    //     );
    //   },
    // },
  ];
};

// Kolom untuk riwayat absensi
export const historyAttendanceColumn = (): ColumnDef<BiodataSiswa>[] => [
  {
    accessorKey: 'attendance.createdAt',
    accessorFn: (row) => row.attendance?.createdAt,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('date')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.attendance?.createdAt
            ? dayjs(row.original.attendance?.createdAt).format('DD MMM YYYY')
            : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'user.name',
    accessorFn: (row) => row.user?.name,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('student')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return <BaseUserItem name={row.original.user?.name} />;
    },
  },
  {
    accessorKey: 'attendance.jamMasuk',
    accessorFn: (row) => row.attendance?.jamMasuk,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('clockIn')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.attendance?.jamMasuk
            ? dayjs(row.original.attendance?.jamMasuk).format('HH:mm')
            : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'attendance.jamPulang',
    accessorFn: (row) => row.attendance?.jamPulang,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('clockOut')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.attendance?.jamPulang
            ? dayjs(row.original.attendance?.jamPulang).format('HH:mm')
            : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'attendance.statusKehadiran',
    accessorFn: (row) => row.attendance?.statusKehadiran,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('status')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => (
      <>
        {row.original.attendance?.statusKehadiran ? (
          <Badge>
            {row.original.attendance?.statusKehadiran?.toUpperCase()}
          </Badge>
        ) : (
          '-'
        )}
      </>
    ),
  },
];
