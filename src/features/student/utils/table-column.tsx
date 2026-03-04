import { Avatar, AvatarFallback, AvatarImage, Badge, Button, cn, dayjs, Input, lang, simpleEncode, Tooltip, TooltipProvider, TooltipTrigger } from "@/core/libs"
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
  useAlert
} from "@/features/_global"
import { buildSelectFilter } from "@/features/_global/components/use-table-column-filter"
import { EvidenceItem, EvidencePreview } from "@/features/attendance/components"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { AlertCircleIcon, Star } from "lucide-react"
import { useEffect, useState } from "react"

// import { FormRfid } from "../components"
// import { QueryClient, useQueryClient } from "@tanstack/react-query"
// Pastikan ada komponen Modal

const isToday = (date) => {
  if (!date) return false;
  return dayjs(date).isSame(dayjs(), 'day'); // Membandingkan tanggal tanpa waktu
};

interface FlatStudentModel {
  noStatus?: boolean;
  id: number;
  name: string;
  email: string;
  nis: string;
  nisn: string;
  rfid: string;
  image: string;
  handleAttend?: any;
  biodataSiswa?: {
    kelas?: {
      id?: number;
      namaKelas?: string;
    };
  }[];
}

// export const studentColumnWithFilter = ({
//   classroomOptions = [],
//   schoolOptions = [],
//   handleAttendRemove,
// }: {
  
//   schoolOptions?: { label: string; value: string | number }[];
//   classroomOptions?: { label: string; value: string | number }[];
// }): ColumnDef<FlatStudentModel>[] => {

//   return [
//     {
//       accessorKey: "name",
//       header: ({ column }) => (
//         <BaseTableHeader
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           {lang.text("studentName")}
//         </BaseTableHeader>
//       ),
//       enableGlobalFilter: true,
//       cell: ({ row }) => {
//         const nameArr = (row.original.name || row.original.user?.name)?.split(" ") || [];
//         const initials =
//           nameArr?.[0]?.[0]?.toUpperCase() + (nameArr?.[1]?.[0]?.toUpperCase() || "");
//         return (
//           <div className="flex flex-row items-center gap-2">
//             <Avatar>
//               <AvatarImage
//                 src={row.original?.image && row.original?.image.includes('/uploads') ? 'https://dev.kiraproject.id'+row.original?.image : row.original.user?.name}
//                 // src={getStaticFile(String((row.original.image || row.original.name) || (row.original.user.image || row.original.user?.name)))}
//                 alt={row.original.name || (row.original.user.image || row.original.user?.name)}
//               />
//               <AvatarFallback>{initials}</AvatarFallback>
//             </Avatar>
//             <p>{(row.original.user?.name || row.original.name) || '-'}</p>
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "email",
//       header: () => <BaseTableHeader>{lang.text("email")}</BaseTableHeader>,
//       cell: ({ row }) => <span>{(row.original.user?.email || row.original.email) || '-'}</span>,
//     },
//     {
//       accessorKey: "nis",
//       header: () => <BaseTableHeader>NIS</BaseTableHeader>,
//       cell: ({ row }) => {
//         const nis = row.original.user?.nis || row.original.nis;
//         return <span>{nis ? String(nis) : '-'}</span>;
//       },
//     },
//     {
//       accessorKey: "nisn",
//       header: () => <BaseTableHeader>NISN</BaseTableHeader>,
//       cell: ({ row }) => {
//         const nisn = row.original.user?.nisn || row.original.nisn;
//         return <span>{nisn ? String(nisn) : '-'}</span>; // Ubah nisn menjadi string
//       },    
//     },
//     {
//       accessorKey: "action",
//       header: () => <BaseTableHeader>{lang.text('action')}</BaseTableHeader>,
//       cell: ({ row }) => (
//         <TooltipProvider delayDuration={100}>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 className={'bg-red-600 text-white font-bold hover:bg-red-700'}
//                 onClick={() => handleAttendRemove(row.original?.id || row.original.userId)}
//                 // className={'bg-red-800 text-white/40 font-bold hover:bg-red-800 brightness-95 cursor-not-allowed'}
//                 // onClick={() => null}
//               >
//                 {lang.text('delete')}
//                 {/* {row.original?.id} */}
//               </Button>
//             </TooltipTrigger>
//             {/* <TooltipContent>
//               🚧 {lang.text('development')}
//             </TooltipContent> */}
//           </Tooltip>
//         </TooltipProvider>
//       ),
//     },
//     {
//       accessorKey: "id",
//       enableSorting: false,
//       header: () => null,
//       cell: ({ row }) => {

//         const encryptPayload = simpleEncode(
//           JSON.stringify({
//             id: row.original?.biodataSiswa?.[0]?.id,
//             biodataId: row.original.id,
//             text: row.original.name,
//           })
//         );

//         return (
//           <BaseActionTable
//             detailPath={`/students/${encryptPayload}`}
//             // editPath={`/students/edit/${encryptPayload}`}
//           />
//         );
//       },
//     },
//   ];
// };

export const studentColumnWithFilter = ({
  classroomOptions = [],
  schoolOptions = [],
  handleAttendRemove,
  duplicateNames = new Set<string>(),
  onUpdateRFID, // Tambahkan prop untuk menangani pembaruan RFID
}: {
  schoolOptions?: { label: string; value: string | number }[];
  classroomOptions?: { label: string; value: string | number }[];
  handleAttendRemove: (id: string | number | undefined) => void;
  duplicateNames?: Set<string>;
  onUpdateRFID: any; // Fungsi untuk update RFID
}): ColumnDef<FlatStudentModel>[] => {
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
        const name = (row.original.name || row.original.user?.name || "").toLowerCase().trim();
        const isDuplicate = duplicateNames.has(name);
        const nameArr = (row.original.name || row.original.user?.name)?.split(" ") || [];
        const initials =
          nameArr?.[0]?.[0]?.toUpperCase() + (nameArr?.[1]?.[0]?.toUpperCase() || "");
        const imagePath = row.original?.user?.image || row.original?.image;
        const src = imagePath?.includes('uploads')
          ? `https://dev.kiraproject.id${imagePath}`
          : getStaticFile(String(imagePath));
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage
                src={src}

                alt={row.original.name || row.original.user?.name || "-"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <p className={isDuplicate ? "flex items-center bg-red-800 animate-pulse duration-800 px-[7px] py-[3px] text-red-100 rounded-md" : ""}>
              {isDuplicate && <AlertCircleIcon className="w-4 h-4 mr-1" />}
              {(row.original.user?.name || row.original.name) || "-"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: () => <BaseTableHeader>{lang.text("email")}</BaseTableHeader>,
      cell: ({ row }) => <span>{(row.original.user?.email || row.original.email) || "-"}</span>,
    },
    {
      accessorKey: "kelas",
      header: () => <BaseTableHeader>{lang.text('className')}</BaseTableHeader>,
      cell: ({ row }) => <span>{(row.original.biodataSiswa?.[0]?.kelas?.namaKelas || row.original.namaKelas) || "-"}</span>,
    },
    {
      accessorKey: "jenisKelamin",
      header: () => <BaseTableHeader>L/P</BaseTableHeader>,
      cell: ({ row }) => <span>{(row.original.jenisKelamin === 'Female' ? lang.text('female') : lang.text('male')) || "-"}</span>,
    },
    {
      accessorKey: "nis",
      header: () => <BaseTableHeader>NIS</BaseTableHeader>,
      cell: ({ row }) => {
        const nis = row.original.user?.nis || row.original.nis;
        return <span>{nis ? String(nis) : "-"}</span>;
      },
    },
    {
      accessorKey: "nisn",
      header: () => <BaseTableHeader>NISN</BaseTableHeader>,
      cell: ({ row }) => {
        const nisn = row.original.user?.nisn || row.original.nisn;
        return <span>{nisn ? String(nisn) : "-"}</span>;
      },
    },
    {
  accessorKey: "rfid",
  header: () => <BaseTableHeader>RFID</BaseTableHeader>,
  cell: ({ row }) => {
    const alert = useAlert();
    const userId = row.original?.user?.id || row.original?.id || row.original.userId;
    const originalRFID = row.original.rfid;
    const localKey = `rfid-temp-${userId}`;

    const getInitialRFID = () => {
      const localRFID = localStorage.getItem(localKey);
      if (localRFID && localRFID !== "0") {
        return localRFID;
      }
      if (originalRFID && originalRFID !== "0") {
        localStorage.removeItem(localKey);
        return originalRFID;
      }
      return "";
    };

    const [rfid, setRfid] = useState(getInitialRFID);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleChange = (e) => {
      const value = e.target.value;
      setRfid(value);
      localStorage.setItem(localKey, value);
    };

    const handleUpdate = async () => {
      if (typeof onUpdateRFID !== "function") return;
      if (rfid === originalRFID) return;

      setIsUpdating(true);
      try {
        await onUpdateRFID(userId, rfid);
        alert.success(lang.text("successUpdateRFID"));
      } catch (error) {
        alert.error(lang.text("failedUpdateRFID"));
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <Input
        value={rfid}
        onChange={handleChange}
        onBlur={handleUpdate}
        disabled={isUpdating}
        className="w-32"
        placeholder="Masukkan RFID"
      />
    );
  },
},
    // {
    //   accessorKey: "rfid",
    //   header: () => <BaseTableHeader>RFID</BaseTableHeader>,
    //   cell: ({ row }) => {
    //     const [rfid, setRfid] = useState(row.original.rfid || "");
    //     const [isUpdating, setIsUpdating] = useState(false);
    //     const alert = useAlert();

    //     const handleUpdate = async () => {
    //       if (typeof onUpdateRFID !== "function") {
    //         alert.error("onUpdateRFID is not a function");
    //         return;
    //       }

    //       setIsUpdating(true);
    //       try {
    //         await onUpdateRFID(row.original?.user?.id || row.original?.id || row.original.userId, rfid);
    //         alert.success(lang.text('successUpdateRFID'));
    //       } catch (error) {
    //         console.error("Error updating RFID:", error);
    //         alert.error(lang.text('failedUpdateRFID'));
    //       } finally {
    //         setIsUpdating(false);
    //       }
    //     };

    //     // cell: ({ row }) => {
    //     //   const [rfid, setRfid] = useState(
    //     //     row.original.rfid === null || row.original.rfid === undefined || row.original.rfid === "" ? "0" : row.original.rfid
    //     //   );
    //     //   const [isUpdating, setIsUpdating] = useState(false);
    //     //   const alert = useAlert();

    //     //   const handleUpdate = async () => {
    //     //     if (typeof onUpdateRFID !== "function") return;
    //     //     if (rfid === row.original.rfid) return; // Tidak update kalau tidak berubah

    //     //     setIsUpdating(true);
    //     //     try {
    //     //       await onUpdateRFID(
    //     //         row.original?.user?.id || row.original?.id || row.original.userId,
    //     //         rfid
    //     //       );
    //     //       alert.success("RFID berhasil diperbarui.");
    //     //     } catch (error) {
    //     //       alert.error("Gagal memperbarui RFID.");
    //     //     } finally {
    //     //       setIsUpdating(false);
    //     //     }
    //     //   };

    //     //   return (
    //     //     <Input
    //     //       value={rfid}
    //     //       onChange={(e) => setRfid(e.target.value)}
    //     //       onBlur={handleUpdate} // ⬅ simpan otomatis saat blur
    //     //       disabled={isUpdating}
    //     //       className="w-32"
    //     //       placeholder="Masukkan RFID"
    //     //     />
    //     //   );
    //     // }

    //     return (
    //       <div className="flex items-center gap-2">
    //         <Input
    //           value={rfid}
    //           onChange={(e) => setRfid(e.target.value)}
    //           placeholder="Masukkan RFID"
    //           className="w-32"
    //           disabled={isUpdating}
    //         />
    //         <Button
    //           variant="default"
    //           size="sm"
    //           onClick={handleUpdate}
    //           disabled={isUpdating || !rfid || rfid === row.original.rfid}
    //         >
    //           {isUpdating ? lang.text('progress') : lang.text('save')}
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "action",
      header: () => <BaseTableHeader>{lang.text("action")}</BaseTableHeader>,
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-red-600 text-white font-bold hover:bg-red-700"
                onClick={() => handleAttendRemove(row.original?.user?.id || row.original?.id || row.original.userId)}
              >
                {lang.text("delete")}
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "id",
      enableSorting: false,
      header: () => null,
      cell: ({ row }) => {
        const encryptPayload = simpleEncode(
          JSON.stringify({
            id: row.original?.biodataSiswa?.[0]?.id || row.original?.id,
            biodataId: row.original?.user?.id || row.original.id,
            text: row.original.name || row?.original?.user?.name,
          })
        );

        return (
          <BaseActionTable
            detailPath={`/students/${encryptPayload}`}
          />
        );
      },
    },
  ];
};

export const studentColumnWithFilterForAbsenceManual = ({
  noStatus=false,
  schoolOptions = [],
  classroomOptions = [],
  handleAttend,
  handleAttendGoHome
}: {
  
  schoolOptions?: { label: string; value: string | number }[];
  classroomOptions?: { label: string; value: string | number }[];
}): ColumnDef<FlatStudentModel>[] => {

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
                src={row.original.image && row.original.image.includes('/uploads') ? `https://dev.kiraproject.id${row.original.image}` : getStaticFile(String((row.original.image || row.original.name) || (row.original.user.image || row.original.user?.name)))}
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
      cell: ({ row }) => {
        const nis = row.original.user?.nis || row.original.nis;
        return <span>{nis ? String(nis) : '-'}</span>;
      },
    },
    {
      accessorKey: "nisn",
      header: () => <BaseTableHeader>NISN</BaseTableHeader>,
      cell: ({ row }) => {
        const nisn = row.original.user?.nisn || row.original.nisn;
        return <span>{nisn ? String(nisn) : '-'}</span>; // Ubah nisn menjadi string
      },    
    },
    ...(noStatus === false || noStatus === undefined
    ? [
        {
          accessorKey: "status",
          header: () => <BaseTableHeader>Status</BaseTableHeader>,
          cell: ({ row }) => {
            // Get stored userIds from localStorage
            const storedUserIds = localStorage.getItem('attendedUserIds');
            const userIds = storedUserIds ? JSON.parse(storedUserIds) : [];
            const isAttended = userIds.includes(row.original?.id);
            const status = row.original.statusKehadiranHariIni || row.original.statusKehadiran || row.original?.user?.status || '-';
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
                className={(row.original.statusKehadiranHariIni || row.original.statusKehadiran || row.original?.user?.status) !== 'hadir' ? 'bg-green-200 text-[#0f4d3f] font-bold hover:bg-green-300' : 'bg-white/50 text-black/80 font-bold cursor-default hover:bg-white/50'}
                onClick={isAttended ? null : () => handleAttend(row.original?.id)}
                disabled={isAttended || (row.original.statusKehadiranHariIni || row.original.statusKehadiran || row.original?.user?.status) === 'hadir'}
              >
                {lang.text('attend')}
              </Button>
            );
          },
        }
        // {
        //   accessorKey: "pulang",
        //   header: () => <BaseTableHeader>Pulang</BaseTableHeader>,
        //   cell: ({ row }) => (
        //     <Button
        //       className={(row.original.statusKehadiran || row.original?.user?.status) === 'hadir' ? 'bg-green-200 text-[#0f4d3f] font-bold hover:bg-green-300' : 'bg-white/30 text-black/90 font-bold cursor-default hover:bg-whit/50'}
        //       onClick={(row.original.statusKehadiran || row.original?.user?.status) === 'hadir' ? () => handleAttendGoHome(row.original?.userId) : () => null}
        //       disabled={(row.original.statusKehadiran || row.original?.user?.status) === 'pulang'}
        //     >
        //       {lang.text('goHome')}
        //     </Button>
        //   ),
        // },
      ]
    : [])
  ];
};

export const studentColumnWithFilterForDetailParent = ({
  noStatus=false,
  schoolOptions = [],
  classroomOptions = [],
  handleAttend,
  handleAttendGoHome
}: {
  
  schoolOptions?: { label: string; value: string | number }[];
  classroomOptions?: { label: string; value: string | number }[];
}): ColumnDef<FlatStudentModel>[] => {
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
      cell: ({ row }) => {
        const nis = row.original.user?.nis || row.original.nis;
        return <span>{nis ? String(nis) : '-'}</span>;
      },
    },
    {
      accessorKey: "nisn",
      header: () => <BaseTableHeader>NISN</BaseTableHeader>,
      cell: ({ row }) => {
        const nisn = row.original.user?.nisn || row.original.nisn;
        return <span>{nisn ? String(nisn) : '-'}</span>; // Ubah nisn menjadi string
      },    
    },
    ...(noStatus === false || noStatus === undefined
    ? [
        {
          accessorKey: "status",
          header: () => <BaseTableHeader>Status</BaseTableHeader>,
          cell: ({ row }) => {
            const absensi = row.original?.absensis?.[0];
            const status = absensi && isToday(absensi.createdAt) 
              ? absensi.statusKehadiran || '-' 
              : 'belum hadir';
            return (
              <div
                className={`w-[114px] text-center px-3 py-1 rounded-sm ${
                  status === 'hadir' ? 'bg-[#0f4d3f] text-[#3ee07a]' : 'bg-red-700 text-red-300'
                }`}
              >
                {status === 'hadir' ? 'masuk' : status === 'belum hadir' ? 'belum masuk' : status}
              </div>
            );
          },
        },
        {
          accessorKey: "hadir",
          header: () => <BaseTableHeader>Absen</BaseTableHeader>,
          cell: ({ row }) => {
            const absensi = row.original?.absensis?.[0];
            const isHadirToday = absensi && isToday(absensi.createdAt) && absensi.statusKehadiran === 'hadir';
            return (
              <Button
                className={isHadirToday ? 'bg-white/50 text-black/80 font-bold cursor-default hover:bg-white/50' : 'bg-green-200 text-[#0f4d3f] font-bold hover:bg-green-300'}
                onClick={() => handleAttend(row.original?.userId)}
                disabled={isHadirToday}
              >
                {lang.text('attend')}
              </Button>
            );
          },
        },
        // {
        //   accessorKey: "pulang",
        //   header: () => <BaseTableHeader>Pulang</BaseTableHeader>,
        //   cell: ({ row }) => (
        //     <Button
        //       className={(row.original.statusKehadiran || row.original?.user?.status) === 'hadir' ? 'bg-green-200 text-[#0f4d3f] font-bold hover:bg-green-300' : 'bg-white/30 text-black/90 font-bold cursor-default hover:bg-whit/50'}
        //       onClick={(row.original.statusKehadiran || row.original?.user?.status) === 'hadir' ? () => handleAttendGoHome(row.original?.userId) : () => null}
        //       disabled={(row.original.statusKehadiran || row.original?.user?.status) === 'pulang'}
        //     >
        //       {lang.text('goHome')}
        //     </Button>
        //   ),
        // },
      ]
    : []),
    {
      accessorKey: "id",
      enableSorting: false,
      header: () => null,
      cell: ({ row }) => {

        const encryptPayload = simpleEncode(
          JSON.stringify({
            id: row.original?.biodataSiswaId,
            biodataId: row.original.userId,
            text: row.original.name,
          })
        );

        return (
          <BaseActionTable
            detailPath={`/students/${encryptPayload}`}
            // editPath={`/students/edit/${encryptPayload}`}
          />
        );
      },
    },
  ];
};

export const studentColumnWithFilterByClassRoom = ({
  noStatus=false,
  schoolOptions = [],
  classroomOptions = [],
  handleAttend,
  duplicateNames, 
  handleAttendRemove
}: {
  
  schoolOptions?: { label: string; value: string | number }[];
  classroomOptions?: { label: string; value: string | number }[];
}): ColumnDef<FlatStudentModel>[] => {
  
  // const MemoizedFormRfid = React.memo(FormRfid);
  // const queryClient = useQueryClient();

  // const classroomFilterMeta = buildSelectFilter(
  //   "biodataSiswa[0].kelas.namaKelas",
  //   lang.text("classroom"),
  //   classroomOptions
  // );

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
        const isDuplicate = duplicateNames.has(row.original?.user?.name);
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
            <p className={isDuplicate ? "flex items-center bg-red-800 animate-pulse duration-800 px-[7px] py-[3px] text-red-100 rounded-md" : ""}>
              {isDuplicate && <AlertCircleIcon className="w-4 h-4 mr-1" />}
              {(row.original.user?.name || row.original.name) || '-'}
            </p>
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
      cell: ({ row }) => {
        const nis = row.original.user?.nis || row.original.nis;
        return <span>{nis ? String(nis) : '-'}</span>;
      },
    },
    {
      accessorKey: "nisn",
      header: () => <BaseTableHeader>NISN</BaseTableHeader>,
      cell: ({ row }) => {
        const nisn = row.original.user?.nisn || row.original.nisn;
        return <span>{nisn ? String(nisn) : '-'}</span>; // Ubah nisn menjadi string
      },    
    },
    {
      accessorKey: "action",
      header: () => <BaseTableHeader>{lang.text("action")}</BaseTableHeader>,
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-red-600 text-white font-bold hover:bg-red-700"
                onClick={() => handleAttendRemove(row.original?.userId)}
              >
                {lang.text("delete")}
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "id",
      enableSorting: false,
      header: () => null,
      cell: ({ row }) => {

        const encryptPayload = simpleEncode(
          JSON.stringify({
            id: row.original.id,
            biodataId: row.original.userId,
            text: row.original.user?.name,
          })
        );
    
        return (
          <BaseActionTable
            detailPath={`/students/${encryptPayload}`}
            // editPath={`/students/edit/${encryptPayload}`}
          />
        );
      },
    },
  ];
};

export const studentLibraryColumnWithFilter = ({
  noStatus = false,
  schoolOptions = [],
  classroomOptions = [],
  handleAttend,
}: {
  noStatus?: boolean;
  schoolOptions?: { label: string; value: string | number }[];
  classroomOptions?: { label: string; value: string | number }[];
  handleAttend?: (row: FlatStudentModel) => void;
}): ColumnDef<FlatStudentModel>[] => {
  const classroomFilterMeta = buildSelectFilter(
    "biodataSiswa[0].kelas.namaKelas",
    lang.text("classroom"),
    classroomOptions
  );

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
      accessorKey: "nis",
      header: () => <BaseTableHeader>NIS</BaseTableHeader>,
      cell: ({ row }) => {
        const nis = row.original.user?.nis || row.original.nis;
        return <span>{nis ? String(nis) : '-'}</span>;
      },
    },
    {
      accessorKey: "nisn",
      header: () => <BaseTableHeader>NISN</BaseTableHeader>,
      cell: ({ row }) => {
        const nisn = row.original.user?.nisn || row.original.nisn;
        return <span>{nisn ? String(nisn) : '-'}</span>;
      },
    },
    {
      accessorKey: "surveiApps",
      header: () => <BaseTableHeader>Rating</BaseTableHeader>,
      cell: ({ row }) => {
        const surveiApps = row.original.user?.surveiApps || row.original.surveiApps;
        if (surveiApps === null || surveiApps === undefined) {
          return <span>-</span>;
        }
        const rating = Number(surveiApps);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          return <span>-</span>;
        }
        return (
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                )}
              />
            ))}
          </div>
        );
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
    accessorKey: "jenisAbsen",
    accessorFn: (row) => row.jenisAbsen,
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
          image: row.original?.fotoAbsenMasuk,
          status: row.original?.statusKehadiran,
        })
      }

      if (row.original?.fotoAbsenPulang) {
        items.push({
          title: lang.text("attendanceOutPhoto"),
          image: row.original?.fotoAbsenPulang,
          status: row.original?.statusKehadiran,
        })
      }

      if (row.original?.dispensasi?.buktiSurat) {
        items.push({
          title: lang.text("evidence"),
          image: row.original?.dispensasi?.buktiSurat,
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
