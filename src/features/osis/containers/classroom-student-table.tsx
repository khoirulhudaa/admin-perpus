// import { Badge, Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
// import { BaseDataTable, useAlert } from "@/features/_global";
// import { useSchool } from "@/features/schools";
// import { studentColumnWithFilterByClassRoom, tableColumnSiswaFallback, useAttendanceActions } from "@/features/student";
// import { useBiodata, useUserCreation } from "@/features/user/hooks";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { School2 } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { useClassroom, useClassroomDetail } from "../hooks";

// export interface ClassroomStudentTableProps {
//   id?: number;
// }

// // Schema untuk form update
// const updateClassSchema = z.object({
//   kelasId: z.string().min(1, "Kelas wajib dipilih"),
// });

// export function ClassroomStudentTable(props: ClassroomStudentTableProps) {
//   const detail = useClassroomDetail({ id: Number(props.id) });
//   const student = useBiodata();
//   const classroom = useClassroom();
//   const school = useSchool();
//   const alert = useAlert();
//   const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
//   const [openBulk, setOpenBulk] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [selectedKelasIdBulk, setSelectedKelasIdBulk] = useState("");
//   const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan input pencarian
//   const creation = useUserCreation();

//   // Handle attendance cleanup in localStorage
//   useEffect(() => {
//     const currentDate = new Date().toISOString().split("T")[0];
//     const storedDate = localStorage.getItem("attendanceDateRemove");
//     const storedUserIds = localStorage.getItem("attendedUserIdsRemove");
//     let userIds = storedUserIds ? JSON.parse(storedUserIds) : [];

//     if (storedDate !== currentDate) {
//       userIds = [];
//       localStorage.setItem("attendanceDateRemove", currentDate);
//       localStorage.setItem("attendedUserIdsRemove", JSON.stringify(userIds));
//     }
//   }, []);

//   // Form untuk update kelas
//   const form = useForm<z.infer<typeof updateClassSchema>>({
//     resolver: zodResolver(updateClassSchema),
//     mode: "onChange",
//     defaultValues: {
//       kelasId: "",
//     },
//   });

//   const parsedStudents = useMemo(() => {
//     try {
//       return typeof student.data === "string"
//         ? JSON.parse(student.data)
//         : student.data || [];
//     } catch (error) {
//       console.error("Gagal parse student.data:", error);
//       return []; // fallback jika gagal parse
//     }
//   }, [student.data]);

//   console.log('parsed', parsedStudents)

//   // Filter students berdasarkan searchTerm (nama, nis, nisn)
//   const students = useMemo(() => {
//     const filteredStudents = parsedStudents?.filter((d) => {
//       const studentSchoolId = Number(d?.user?.sekolah?.id);
//       const studentClassroomId = Number(d?.kelas?.id);
//       const isActive = d?.user?.isActive;
//       const storedUserIds = localStorage.getItem("attendedUserIdsRemove");
//       const userIds = storedUserIds ? JSON.parse(storedUserIds) : [];
//       const userId = d?.userId || d?.user?.id;
//       const validUserID = !userIds.includes(userId);


//       const matchesSchoolAndClass =
//         studentSchoolId === Number(detail.data?.sekolahId) &&
//         studentClassroomId === Number(props?.id) && isActive && validUserID;

//       // Jika tidak ada searchTerm, kembalikan semua data yang sesuai dengan school dan classroom
//       if (!searchTerm) return matchesSchoolAndClass;

//       // Cari berdasarkan nama, nis, atau nisn (case-insensitive)
//       const searchLower = searchTerm.toLowerCase();
//       return (
//         matchesSchoolAndClass &&
//         (d?.user?.name?.toString().toLowerCase().includes(searchLower) ||
//           d?.user?.nis?.toString().toLowerCase().includes(searchLower) ||
//           d?.user?.nisn?.toString().toLowerCase().includes(searchLower))
//       );
//     });
//     return filteredStudents;
//   }, [parsedStudents, props.id, detail?.data?.sekolahId, searchTerm]);

//   console.log("student debugging:", student);

//   // Memoized opsi kelas
//   const classOptions = useMemo(
//     () => classroom.data?.map(k => ({ value: String(k.id), label: k.namaKelas })) || [],
//     [classroom.data]
//   );

//   const { handleAttendRemove } = useAttendanceActions();
  

//   // Memoized kolom tabel
//   const columns = useMemo(() => {
//     const baseColumns = studentColumnWithFilterByClassRoom({
//       schoolOptions:
//         school.data?.map((d) => ({
//           label: d.namaSekolah,
//           value: d.namaSekolah,
//         })) || [],
//       classroomOptions: classOptions,
//       handleAttendRemove
//     });

//     // Ambil semua kolom kecuali kolom 'id'
//     const columnsWithoutId = baseColumns.filter(col => col.accessorKey !== "id");

//     // Definisikan kolom updateClass
//     const updateClassColumn = {
//       accessorKey: "updateClass",
//       enableSorting: false,
//       header: () => <div className="text-left"></div>,
//       cell: ({ row }) => (
//         <Button
//           variant="outline"
//           size="sm"
//           className="border border-green-400 text-green-100"
//           onClick={() => {
//             setSelectedStudent(row.original);
//             form.reset({
//               kelasId: String(row.original.kelas?.id || ""),
//             });
//             setOpen(true);
//           }}
//         >
//           {lang.text('updateClass')}
//           <School2 />
//         </Button>
//       ),
//     };

//     // Ambil kolom 'id' dari baseColumns
//     const idColumn = baseColumns.find(col => col?.accessorKey === "id");

//     // Gabungkan kolom: semua kolom sebelum 'id', lalu 'updateClass', lalu 'id'
//     return [
//       ...columnsWithoutId,
//       updateClassColumn,
//       ...(idColumn ? [idColumn] : []),
//     ];
//   }, [school.data, classOptions]);

//   // Fungsi submit untuk update
//   const onSubmit = async (data: z.infer<typeof updateClassSchema>) => {
//     try {
//       setLoading(true)
//       if (!selectedStudent?.userId) {
//         alert.error("ID siswa tidak valid");
//         return;
//       }

//       // Update kelas
//       await creation.update(selectedStudent.userId, {
//         kelasId: Number(data.kelasId),
//       });

//       // Refetch data untuk refresh tabel
//       await student.query.refetch();
//       alert.success("Berhasil memperbarui kelas");
//       setOpen(false);
//       setLoading(false)
//       form.reset();
//       setSelectedStudent(null);
//       student?.query.refetch();
//       classroom?.query?.refetch();
//       detail?.query.refetch();
//     } catch (err: any) {
//       setLoading(false)
//       alert.error(err?.message || "Gagal memperbarui kelas");
//     } finally {
//       setLoading(false)
//     }
//   };

//   console.log('students table:', students)

//   return (
//     <>
//       <div className="mb-4 flex gap-3 items-center justify-start">
//         <Input
//           placeholder="Cari berdasarkan nama, NIS, atau NISN"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-sm"
//         />
//         <div className="flex gap-3 items-center">
//           <Badge variant={'outline'} className="py-2 text-sm text-muted-foreground border border-white/20">
//             {lang.text('totalData')}: {students?.length || 0}
//           </Badge>
//           <Button disabled={students?.length === 0} className="border border-green-400 text-green-100 flex items-center gap-2" variant="ouline" onClick={() => setOpenBulk(true)}>
//             {lang.text('upAllClass')}
//             <School2 />
//           </Button>
//         </div>
//       </div>

//       <Dialog open={openBulk} onOpenChange={setOpenBulk}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{lang.text('upAllStudent')}</DialogTitle>
//           </DialogHeader>
//           <form
//             onSubmit={async (e) => {
//               e.preventDefault();
//               if (!selectedKelasIdBulk) {
//                 alert.error("Silakan pilih kelas tujuan");
//                 return;
//               }

//               try {
//                 const updates = students.map((s) =>
//                   creation.update(s.userId, {
//                     kelasId: Number(selectedKelasIdBulk),
//                   })
//                 );

//                 await Promise.all(updates);

//                 await student.query.refetch();
//                 alert.success("Semua siswa berhasil dipindahkan");
//                 setOpenBulk(false);
//                 setSelectedKelasIdBulk("");
//               } catch (err: any) {
//                 alert.error(err?.message || "Gagal memindahkan siswa secara massal");
//               }
//             }}
//             className="space-y-4"
//           >
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Kelas Tujuan</label>
//               <Select value={selectedKelasIdBulk} onValueChange={setSelectedKelasIdBulk}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Pilih kelas baru" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {classOptions.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setOpenBulk(false)}>
//                   {lang.text('cancel')}
//               </Button>
//               <Button type="submit" disabled={!selectedKelasIdBulk}>
//                 {loading ? lang.text('progress') : lang.text('save')}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       <BaseDataTable
//         columns={columns}
//         data={(students || []).filter((student: any) => {
//           const storedUserIds = localStorage.getItem("attendedUserIdsRemove");
//           const userIds = storedUserIds ? JSON.parse(storedUserIds) : [];
//           const userId = student?.id || student.userId || student.user?.id;
//           return !userIds.includes(userId);
//         })}
//         // data={students}
//         dataFallback={tableColumnSiswaFallback}
//         globalSearch={false}
//         searchParamPagination
//         isLoading={student.query.isLoading}
//       />
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{lang.text("updateClass")}</DialogTitle>
//           </DialogHeader>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="kelasId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Kelas</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Pilih kelas" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {classOptions.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setOpen(false)}>
//                   Batal
//                 </Button>
//                 <Button type="submit" disabled={form.formState.isSubmitting}>
//                     {loading ? lang.text('progress') : lang.text('save')}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }


import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { BaseDataTable, useAlert } from "@/features/_global";
import { useSchool } from "@/features/schools";
import {
  studentColumnWithFilterByClassRoom,
  tableColumnSiswaFallback,
  useAttendanceActions,
} from "@/features/student";
import { useBiodata, useUserCreation } from "@/features/user/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { School2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useClassroom, useClassroomDetail } from "../hooks";

export interface ClassroomStudentTableProps {
  id?: number;
}

// Schema untuk form update
const updateClassSchema = z.object({
  kelasId: z.string().min(1, "Kelas wajib dipilih"),
});

export function ClassroomStudentTable(props: ClassroomStudentTableProps) {
  const detail = useClassroomDetail({ id: Number(props.id) });
  const student = useBiodata();
  const classroom = useClassroom();
  const school = useSchool();
  const alert = useAlert();
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [openBulk, setOpenBulk] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedKelasIdBulk, setSelectedKelasIdBulk] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendedUserIds, setAttendedUserIds] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0); // State untuk memaksa render ulang
  const creation = useUserCreation();

  // Handle attendance cleanup in localStorage and initialize attendedUserIds
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    const storedDate = localStorage.getItem("attendanceDateRemove");
    let userIds = localStorage.getItem("attendedUserIdsRemove")
      ? JSON.parse(localStorage.getItem("attendedUserIdsRemove")!)
      : [];

    if (storedDate !== currentDate) {
      userIds = [];
      localStorage.setItem("attendanceDateRemove", currentDate);
      localStorage.setItem("attendedUserIdsRemove", JSON.stringify(userIds));
    }

    setAttendedUserIds(userIds);
  }, []);

  // Form untuk update kelas
  const form = useForm<z.infer<typeof updateClassSchema>>({
    resolver: zodResolver(updateClassSchema),
    mode: "onChange",
    defaultValues: {
      kelasId: "",
    },
  });

  const parsedStudents = useMemo(() => {
    try {
      return typeof student.data === "string"
        ? JSON.parse(student.data)
        : student.data || [];
    } catch (error) {
      console.error("Gagal parse student.data:", error);
      return [];
    }
  }, [student.data, refreshKey]); // Tambahkan refreshKey sebagai dependensi

  // Filter students berdasarkan searchTerm dan attendedUserIds
  const students = useMemo(() => {
    return parsedStudents?.filter((d) => {
      const studentSchoolId = Number(d?.user?.sekolah?.id);
      const studentClassroomId = Number(d?.kelas?.id);
      const isActive = d?.user?.isActive;
      const userId = d?.userId || d?.user?.id;
      const validUserID = !attendedUserIds.includes(userId);

      const matchesSchoolAndClass =
        studentSchoolId === Number(detail.data?.sekolahId) &&
        studentClassroomId === Number(props?.id) &&
        isActive &&
        validUserID;

      if (!searchTerm) return matchesSchoolAndClass;

      const searchLower = searchTerm.toLowerCase();
      return (
        matchesSchoolAndClass &&
        (d?.user?.name?.toString().toLowerCase().includes(searchLower) ||
          d?.user?.nis?.toString().toLowerCase().includes(searchLower) ||
          d?.user?.nisn?.toString().toLowerCase().includes(searchLower))
      );
    });
  }, [parsedStudents, props.id, detail?.data?.sekolahId, searchTerm, attendedUserIds]);

  // Memoized opsi kelas
  const classOptions = useMemo(
    () => classroom.data?.map((k) => ({ value: String(k.id), label: k.namaKelas })) || [],
    [classroom.data]
  );

  const { handleAttendRemove } = useAttendanceActions();

  console.log('studentsss', students)
  const duplicateNames = useMemo(() => {
    const nameCounts = new Map<string, number>();
    const duplicates = new Set<string>();

    students.forEach((student) => {
      const name = (student?.user?.name || student?.name || "").toLowerCase().trim();
      if (name) {
        const count = (nameCounts.get(name) || 0) + 1;
        nameCounts.set(name, count);
        if (count > 1) {
          duplicates.add(name);
        }
      }
    });

    return duplicates;
  }, [students.length]);

  // Memoized kolom tabel
  const columns = useMemo(() => {
    const baseColumns = studentColumnWithFilterByClassRoom({
      schoolOptions:
        school.data?.map((d) => ({
          label: d.namaSekolah,
          value: d.namaSekolah,
        })) || [],
      classroomOptions: classOptions,
      duplicateNames,
      handleAttendRemove: async (id) => {
        try {
          await handleAttendRemove(id); // Panggil fungsi asli
          const storedUserIds = localStorage.getItem("attendedUserIdsRemove");
          const userIds = storedUserIds ? JSON.parse(storedUserIds) : [];
          setAttendedUserIds(userIds); // Perbarui state
          setRefreshKey((prev) => prev + 1); // Paksa render ulang
          await student.query.refetch(); // Refetch data dari API
        } catch (error) {
          console.error("Gagal menghapus siswa:", error);
          alert.error("Gagal menghapus siswa");
        }
      },
    });

    const columnsWithoutId = baseColumns.filter((col) => col.accessorKey !== "id");

    const updateClassColumn = {
      accessorKey: "updateClass",
      enableSorting: false,
      header: () => <div className="text-left"></div>,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          className="border border-green-400 text-green-100"
          onClick={() => {
            setSelectedStudent(row.original);
            form.reset({
              kelasId: String(row.original.kelas?.id || ""),
            });
            setOpen(true);
          }}
        >
          {lang.text("updateClass")}
          <School2 />
        </Button>
      ),
    };

    const idColumn = baseColumns.find((col) => col?.accessorKey === "id");

    return [...columnsWithoutId, updateClassColumn, ...(idColumn ? [idColumn] : [])];
  }, [school.data, classOptions, handleAttendRemove, student.query]);

  // Fungsi submit untuk update
  const onSubmit = async (data: z.infer<typeof updateClassSchema>) => {
    try {
      setLoading(true);
      if (!selectedStudent?.userId) {
        alert.error("ID siswa tidak valid");
        return;
      }

      await creation.update(selectedStudent.userId, {
        kelasId: Number(data.kelasId),
      });

      await student.query.refetch();
      alert.success("Berhasil memperbarui kelas");
      setOpen(false);
      form.reset();
      setSelectedStudent(null);
      classroom?.query?.refetch();
      detail?.query.refetch();
    } catch (err: any) {
      alert.error(err?.message || "Gagal memperbarui kelas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4 flex gap-3 items-center justify-start">
        <Input
          placeholder="Cari berdasarkan nama, NIS, atau NISN"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-3 items-center">
          <Badge
            variant="outline"
            className="py-2 text-sm text-muted-foreground border border-white/20"
          >
            {lang.text("totalData")}: {students?.length || 0}
          </Badge>
          <Button
            disabled={students?.length === 0}
            className="border border-green-400 text-green-100 flex items-center gap-2"
            variant="outline"
            onClick={() => setOpenBulk(true)}
          >
            {lang.text("upAllClass")}
            <School2 />
          </Button>
        </div>
      </div>

      <Dialog open={openBulk} onOpenChange={setOpenBulk}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text("upAllStudent")}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!selectedKelasIdBulk) {
                alert.error("Silakan pilih kelas tujuan");
                return;
              }

              try {
                const updates = students.map((s) =>
                  creation.update(s.userId, {
                    kelasId: Number(selectedKelasIdBulk),
                  })
                );

                await Promise.all(updates);

                await student.query.refetch();
                alert.success("Semua siswa berhasil dipindahkan");
                setOpenBulk(false);
                setSelectedKelasIdBulk("");
              } catch (err: any) {
                alert.error(err?.message || "Gagal memindahkan siswa secara massal");
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Kelas Tujuan</label>
              <Select value={selectedKelasIdBulk} onValueChange={setSelectedKelasIdBulk}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas baru" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenBulk(false)}>
                {lang.text("cancel")}
              </Button>
              <Button type="submit" disabled={!selectedKelasIdBulk}>
                {loading ? lang.text("progress") : lang.text("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <BaseDataTable
        columns={columns}
        data={students}
        dataFallback={tableColumnSiswaFallback}
        globalSearch={false}
        searchParamPagination
        isLoading={student.query.isLoading}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text("updateClass")}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="kelasId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelas</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  {lang.text("cancel")}
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {loading ? lang.text("progress") : lang.text("save")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}