// import {
//     Input,
//     lang,
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue
// } from "@/core/libs";
// import { useDataTableController } from "@/features/_global";
// import { LibraryTable } from "@/features/library/container";
// import { useLibrary } from "@/features/library/hooks";
// import { useProfile } from "@/features/profile";
// import { useState } from "react";

// interface VisitorEntry {
//   id: number;
//   userId: number;
//   status: "masuk" | "keluar";
//   waktuKunjungan: string;
//   waktuKeluar: string | null;
//   createdAt: string;
//   updatedAt: string;
//   durasiKunjungan: number | null;
//   user: { id: number; email: string; name?: string; nis?: string; nisn?: string; namaKelas?: string; [key: string]: any };
// }

// export const StudentLibraryTable = ({ formattedDate, id }: { formattedDate?: string; id?: number }) => {
//   const {
//     global,
//     sorting,
//     filter,
//     pagination,
//     onSortingChange,
//     onPaginationChange,
//   } = useDataTableController({ defaultPageSize: 50 });

//   const [nisFilter, setNisFilter] = useState("");
//   const [nameFilter, setNameFilter] = useState("");
//   const [dayFilter, setDayFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const profile = useProfile();
//   const { data: libraries, isLoading } = useLibrary({
//     sekolahId: profile?.user?.sekolahId,
//     tanggal: formattedDate,
//   });

//   const dayOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

//   const mergedDataInOrder = dayOrder.reduce((acc: VisitorEntry[], day) => {
//     if (libraries?.data?.[day]?.length) {
//       acc.push(...libraries.data[day]);
//     }
//     return acc;
//   }, []);

//   console.log('mergedDataInOrder', mergedDataInOrder)

//   // const filteredData = mergedDataInOrder.filter((item) => {
//   //   const nameMatch = nameFilter.trim() !== ""
//   //   ? (item?.user?.name || "").toLowerCase().includes(nameFilter.toLowerCase())
//   //   : true;

//   // const nisMatch = nisFilter.trim() !== ""
//   //   ? ((item?.user?.nis || "").toLowerCase().includes(nisFilter.toLowerCase()) ||
//   //     (item?.user?.nisn || "").toLowerCase().includes(nisFilter.toLowerCase()))
//   //   : true;

//   //   const dayMatch = dayFilter === "all" ||
//   //     libraries?.data?.[dayFilter]?.includes(item);

//   //   const statusMatch = statusFilter === "all" || item.status === statusFilter;

//   //   const idMatch = id ? item.userId === id : true; // Filter by userId if id is provided

//   //   return nameMatch && nisMatch && dayMatch && statusMatch && idMatch;
//   // });

//   const filteredData = mergedDataInOrder.filter((item) => {
//     const nameMatch =
//       nameFilter.trim() !== ""
//         ? (item?.user?.name || "")
//             .toLowerCase()
//             .includes(nameFilter.toLowerCase())
//         : true;

//     const nisMatch =
//       nisFilter.trim() !== ""
//         ? (item?.user?.nis || "")
//             .toLowerCase()
//             .includes(nisFilter.toLowerCase()) ||
//           (item?.user?.nisn || "")
//             .toLowerCase()
//             .includes(nisFilter.toLowerCase())
//         : true;

//     const dayMatch =
//       dayFilter === "all" ||
//       libraries?.data?.[dayFilter]?.some((d) => d.id === item.id);

//     const statusMatch = statusFilter === "all" || item.status === statusFilter;

//     const idMatch = id ? item.userId === id : true;

//     return nameMatch && nisMatch && dayMatch && statusMatch && idMatch;
//   });

//   console.log('filteredData', filteredData)

//   return (
//     <>
//       <div className="flex items-center gap-3 mt-6 mb-3">
//         <Input
//           type="text"
//           value={nameFilter}
//           onChange={(e) => setNameFilter(e.target.value)}
//           placeholder={lang.text("search") || "Filter by name..."}
//           className="w-[300px]"
//         />
//         <Input
//           type="text"
//           value={nisFilter}
//           onChange={(e) => setNisFilter(e.target.value)}
//           placeholder={"Filter by NIS"}
//           className="w-[300px]"
//         />
//         <Select value={dayFilter} onValueChange={setDayFilter}>
//           <SelectTrigger className="w-[190px]">
//             <SelectValue placeholder="Filter Hari" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">{lang.text('allDays')}</SelectItem>
//             {dayOrder.map((day) => (
//               <SelectItem key={day} value={day}>
//                 {lang.text(day)}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[190px]">
//             <SelectValue placeholder="Filter Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">{lang.text('allStatus')}</SelectItem>
//             <SelectItem value="masuk">{lang.text('masuk')}</SelectItem>
//             <SelectItem value="keluar">{lang.text('keluar')}</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <LibraryTable
//         data={filteredData}
//         isLoading={isLoading}
//         pagination={{
//           pageIndex: pagination.pageIndex,
//           pageSize: pagination.pageSize,
//           totalItems: filteredData.length,
//           onPageChange: (page) => onPaginationChange({ ...pagination, pageIndex: page }),
//           onSizeChange: (size) => onPaginationChange({ ...pagination, pageSize: size, pageIndex: 0 }),
//         }}
//         sorting={sorting}
//         onSortingChange={onSortingChange}
//       />
//     </>
//   );
// };

import {
  Button,
  dayjs,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/core/libs";
import { useDataTableController } from "@/features/_global";
import { LibraryTable } from "@/features/library/container";
import { useLibrary } from "@/features/library/hooks";
import { useProfile } from "@/features/profile";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useState } from "react";
import { useStudentDetail } from "../hooks";
import { LibraryPresencePDF } from "../utils";
import { useSchool } from "@/features/schools";
import { FaFilePdf } from "react-icons/fa";

interface VisitorEntry {
  id: number;
  userId: number;
  status: "masuk" | "keluar";
  waktuKunjungan: string;
  waktuKeluar: string | null;
  createdAt: string;
  updatedAt: string;
  durasiKunjungan: number | null;
  user: {
    id: number;
    email: string;
    name?: string;
    nis?: string;
    nisn?: string;
    namaKelas?: string;
    [key: string]: any;
  };
}

export const StudentLibraryTable = ({
  formattedDate,
  id,
}: {
  formattedDate?: string;
  id?: number;
}) => {
  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 50 });

  // const [nisFilter, setNisFilter] = useState("");
  // const [nameFilter, setNameFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const profile = useProfile();
  const school = useSchool();
  const detail = useStudentDetail({ id: id });
  const { data: libraries, isLoading } = useLibrary({
    sekolahId: profile?.user?.sekolahId,
    tanggal: formattedDate,
  });

  console.log('id', id)
  console.log('detail testing:', detail)

  const dayOrder = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];

  // Tambahkan properti 'day' ke setiap item
  const mergedDataInOrder = dayOrder.reduce(
    (acc: (VisitorEntry & { day: string })[], day) => {
      if (libraries?.data?.[day]?.length) {
        const withDay = libraries.data[day].map((entry) => ({
          ...entry,
          day,
        }));
        acc.push(...withDay);
      }
      return acc;
    },
    []
  );

  const nisDetail = detail?.data?.user?.nis;
    const filteredData = mergedDataInOrder.filter((entry) => {
    const matchNis = entry.user.nis === nisDetail;
    const matchDay = dayFilter === "all" || entry.day === dayFilter;
    const matchStatus = statusFilter === "all" || entry.status === statusFilter;

    return matchNis && matchDay && matchStatus;
  });

  console.log('libraries', libraries?.data)
  console.log('mergedDataInOrder', mergedDataInOrder)
  console.log('filteredData', filteredData)

  return (
    <>
      <div className="flex items-center gap-3 mt-6 mb-3">
        {/* <Input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder={lang.text("search") || "Filter by name..."}
          className="w-[300px]"
        />
        <Input
          type="text"
          value={nisFilter}
          onChange={(e) => setNisFilter(e.target.value)}
          placeholder={"Filter by NIS"}
          className="w-[300px]"
        /> */}

       {filteredData.length > 0 ? (
          <PDFDownloadLink
            document={
              <LibraryPresencePDF
                data={filteredData.map((item) => ({
                  createdAt: item.createdAt,
                  jamMasuk: item.waktuKunjungan,
                  jamPulang: item.waktuKeluar || item.updatedAt,
                  statusKehadiran: lang.text(item.status),
                }))}
                school={{
                  namaSekolah: school?.data?.[0]?.namaSekolah ?? 'Nama Sekolah',
                  kopSurat: school?.data?.[0]?.kopSurat ?? '',
                  namaKepalaSekolah: school?.data?.[0]?.namaKepalaSekolah,
                  ttdKepalaSekolah: school?.data?.[0]?.ttdKepalaSekolah,
                }}
              />
            }
            fileName={`Laporan_Absensi_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`}
          >
            {({ loading }) => (
              <Button
                variant="outline"
                className="flex items-center gap-3 mr-1.5 bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? lang.text('progress') : lang.text('downloadPDF')}
                <FaFilePdf />
              </Button>
            )}
          </PDFDownloadLink>
        ) : (
          <Button
            variant="outline"
            disabled
            className="flex items-center gap-3 mr-1.5 bg-red-600 text-white opacity-50 cursor-not-allowed"
          >
            {lang.text('downloadPDF')}
            <FaFilePdf />
          </Button>
        )}


        <p>Pilih hari:</p>
        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Filter Hari" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text("allDays")}</SelectItem>
            {dayOrder.map((day) => (
              <SelectItem key={day} value={day}>
                {lang.text(day)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="ml-2">Pilih status:</p>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang.text("allStatus")}</SelectItem>
            <SelectItem value="masuk">{lang.text("masuk")}</SelectItem>
            <SelectItem value="keluar">{lang.text("keluar")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <LibraryTable
        data={filteredData}
        isLoading={isLoading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalItems: filteredData.length,
          onPageChange: (page) =>
            onPaginationChange({ ...pagination, pageIndex: page }),
          onSizeChange: (size) =>
            onPaginationChange({
              ...pagination,
              pageSize: size,
              pageIndex: 0,
            }),
        }}
        sorting={sorting}
        onSortingChange={onSortingChange}
      />
    </>
  );
};
