// // import {
// //   Badge,
// //   Button,
// //   Checkbox,
// //   Dialog,
// //   DialogContent,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   Input,
// //   lang,
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow
// // } from "@/core/libs";
// // import { useAlert, useVokadialog, Vokadialog } from "@/features/_global";
// // import { useCourse } from "@/features/course";
// // import { useBiodataGuru } from "@/features/user";
// // import { Download, Pen, Plus, School2, Trash, UploadCloud } from "lucide-react";
// // import { useEffect, useMemo, useRef, useState } from "react";
// // import * as XLSX from "xlsx";
// // import { useScheduleCreation, useSchedules } from "../hooks";
// // import { useClassroom } from "@/features/classroom";
// // import { FaFileExcel } from "react-icons/fa";

// // interface ScheduleItem {
// //   id: number;
// //   hari: string;
// //   jamMulai: string;
// //   jamSelesai: string;
// //   mataPelajaran: {
// //     id: number;
// //     namaMataPelajaran: string;
// //     kelasId: number;
// //     kelas: { id: number; namaKelas: string } | null;
// //   };
// //   guru: { id: number; namaGuru: string };
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // interface NewScheduleForm {
// //   mataPelajaranId: number;
// //   guruId: number;
// //   hari: string;
// //   jamMulai: string;
// //   jamSelesai: string;
// // }

// // interface BulkSchedule {
// //   namaKelas: string;
// //   namaMataPelajaran: string;
// //   namaGuru: string;
// //   hari: string;
// //   jamMulai: string;
// //   jamSelesai: string;
// // }

// // const daysOrder = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"];

// // export function ScheduleLandingContent() {
// //   const alert = useAlert();
// //   const creation = useScheduleCreation();
// //   const dialog = useVokadialog();
// //   const showRef = useRef<typeof dialog.open>();
// //   showRef.current = dialog.open;
// //   const [id, setId] = useState<number>(0);
// //   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
// //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
// //   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
// //   const [selectedDay, setSelectedDay] = useState<string>("");
// //   const [editScheduleId, setEditScheduleId] = useState<number>(0);
// //   const [searchCourse, setSearchCourse] = useState<string>("");
// //   const [searchTeacher, setSearchTeacher] = useState<string>("");
// //   const [selectedClassId, setSelectedClassId] = useState<number>(0); // 0 for All Classes
// //   const [selectedDays, setSelectedDays] = useState<string[]>(daysOrder); // Default to all days
// //   const [isDayFilterOpen, setIsDayFilterOpen] = useState(false);
// //   const [selectedKelasIdForAdd, setSelectedKelasIdForAdd] = useState<number>(0); // 0 for no class selected in add modal
// //   const [excelFile, setExcelFile] = useState<File | null>(null);
// //   const searchInputRef = useRef<HTMLInputElement>(null);
// //   const teacherSearchInputRef = useRef<HTMLInputElement>(null);
// //   const [formData, setFormData] = useState<NewScheduleForm>({
// //     mataPelajaranId: 0,
// //     guruId: 0,
// //     hari: "",
// //     jamMulai: "",
// //     jamSelesai: "",
// //   });

// //   const courses = useCourse();
// //   const teachers = useBiodataGuru();
// //   const schedules = useSchedules();
// //   const listClass = useClassroom()

// //   console.log('classs', listClass?.data)
// //   console.log('courses', courses?.data)

// //   // Derive classes from schedules.data
// //   const classes = useMemo(() => {
// //     if (!schedules?.data) return [];
// //     const kelasSet = new Map<number, { id: number; namaKelas: string }>();
// //     Object.keys(schedules.data).forEach((day) => {
// //       schedules?.data[day].forEach((schedule: ScheduleItem) => {
// //         const { kelas } = schedule.mataPelajaran;
// //         if (kelas && kelas.id != null && kelas.namaKelas) {
// //           if (!kelasSet.has(kelas.id)) {
// //             kelasSet.set(kelas.id, { id: kelas.id, namaKelas: kelas.namaKelas });
// //           }
// //         }
// //       });
// //     });
// //     return Array.from(kelasSet.values());
// //   }, [schedules?.data]);

// //   // Memoize filtered courses
// //   const filteredCourses = useMemo(() => {
// //     let filtered = courses?.data?.filter((course: any) =>
// //       course.namaMataPelajaran.toLowerCase().includes(searchCourse.toLowerCase())
// //     ) || [];
    
// //     // When adding a schedule, further filter by selectedKelasIdForAdd
// //     if (isAddModalOpen && selectedKelasIdForAdd !== 0) {
// //       filtered = filtered.filter((course: any) => course.kelasId === selectedKelasIdForAdd);
// //     }
    
// //     return filtered;
// //   }, [courses?.data, searchCourse, isAddModalOpen, selectedKelasIdForAdd]);

// //   // Memoize filtered teachers
// //   const filteredTeachers = useMemo(() => {
// //     return (
// //       teachers?.data?.filter((teacher: any) =>
// //         teacher.namaGuru.toLowerCase().includes(searchTeacher.toLowerCase())
// //       ) || []
// //     );
// //   }, [teachers?.data, searchTeacher]);

// //   // Group data by kelasId and then by day
// //   const groupedByClassAndDay = useMemo(() => {
// //     const result: Record<number, Record<string, ScheduleItem[]>> = {};

// //     if (schedules?.data) {
// //       // Normalize day keys to uppercase
// //       const normalizeDay = (day: string) => day.toUpperCase();

// //       // Collect all unique kelasId
// //       const kelasIds = new Set<number>();
// //       Object.keys(schedules.data).forEach((day) => {
// //         schedules.data[day].forEach((schedule: ScheduleItem) => {
// //           kelasIds.add(schedule.mataPelajaran.kelasId);
// //         });
// //       });

// //       // Initialize result for all kelasId and days
// //       kelasIds.forEach((kelasId) => {
// //         result[kelasId] = daysOrder.reduce((acc, d) => {
// //           acc[d] = [];
// //           return acc;
// //         }, {} as Record<string, ScheduleItem[]>);
// //       });

// //       // Populate schedules
// //       Object.keys(schedules.data).forEach((day) => {
// //         const normalizedDay = normalizeDay(day);
// //         if (daysOrder.includes(normalizedDay)) {
// //           schedules.data[day].forEach((schedule: ScheduleItem) => {
// //             const kelasId = schedule.mataPelajaran.kelasId;
// //             if (result[kelasId]) {
// //               result[kelasId][normalizedDay].push(schedule);
// //             }
// //           });
// //         }
// //       });

// //       // Sort schedules by jamMulai
// //       Object.keys(result).forEach((kelasId) => {
// //         daysOrder.forEach((day) => {
// //           result[kelasId][day].sort((a, b) => {
// //             const timeA = new Date(`1970-01-01T${a.jamMulai}:00`);
// //             const timeB = new Date(`1970-01-01T${b.jamMulai}:00`);
// //             return timeA.getTime() - timeB.getTime();
// //           });
// //         });
// //       });
// //     }

// //     return result;
// //   }, [schedules?.data]);

// //   // Download Excel template
// //   const handleDownloadTemplate = () => {
// //     try {
// //       const link = document.createElement("a");
// //       link.href = "/template_jadwal_mapel.xlsx";
// //       link.download = "template_jadwal_mapel.xlsx";
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //       alert.success("Template Excel berhasil diunduh");
// //     } catch (err: any) {
// //       alert.error("Gagal mengunduh template Excel: " + (err.message || "Unknown error"));
// //     }
// //   };

// //   // Handle Excel file upload
// //   const handleUploadExcel = async () => {
// //     if (!excelFile) {
// //       alert.error("Pilih file Excel terlebih dahulu");
// //       return;
// //     }

// //     try {
// //       const reader = new FileReader();
// //       reader.onload = async (e) => {
// //         const data = new Uint8Array(e.target?.result as ArrayBuffer);
// //         const workbook = XLSX.read(data, { type: "array", cellDates: true }); // Pastikan parse sebagai Date
// //         const sheet = workbook.Sheets["Schedules"];
// //         if (!sheet) {
// //           alert.error("Sheet 'Schedules' tidak ditemukan");
// //           return;
// //         }

// //         const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);
// //         if (jsonData.length === 0) {
// //           alert.error("File Excel kosong");
// //           return;
// //         }

// //         // Validate data
// //         const validSchedules: NewScheduleForm[] = [];
// //         const errors: string[] = [];
// //         const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
// //         const validDays = daysOrder;

// //         jsonData.forEach((row: any, index: number) => {
// //           // Konversi jamMulai dan jamSelesai ke format HH:mm
// //           const formatTime = (value: any) => {
// //             if (value instanceof Date) {
// //               const hours = value.getHours().toString().padStart(2, '0');
// //               const minutes = value.getMinutes().toString().padStart(2, '0');
// //               return `${hours}:${minutes}`;
// //             }
// //             return value?.toString().trim() || "";
// //           };

// //           const schedule: BulkSchedule = {
// //             namaKelas: row.namaKelas?.toString().trim() || "",
// //             namaMataPelajaran: row.namaMataPelajaran?.toString().trim() || "",
// //             namaGuru: row.namaGuru?.toString().trim() || "",
// //             hari: row.hari?.toString().trim() || "",
// //             jamMulai: formatTime(row.jamMulai),
// //             jamSelesai: formatTime(row.jamSelesai),
// //           };

// //           console.log('schedule saat ini:', schedule);

// //           // Validate required fields, excluding "Catatan"
// //           if (
// //             !schedule.namaKelas ||
// //             !schedule.namaMataPelajaran ||
// //             !schedule.namaGuru ||
// //             !schedule.hari ||
// //             !schedule.jamMulai ||
// //             !schedule.jamSelesai
// //           ) {
// //             errors.push(`Baris ${index + 2}: Semua kolom wajib diisi (kecuali Catatan). Data: ${JSON.stringify(schedule)}`);
// //             return;
// //           }

// //           // Validate namaKelas
// //           const kelas = listClass?.data.find((k: any) =>
// //             k.namaKelas.toLowerCase() === schedule.namaKelas.toLowerCase()
// //           );
// //           if (!kelas) {
// //             errors.push(`Baris ${index + 2}: Nama kelas '${schedule.namaKelas}' tidak valid`);
// //             return;
// //           }

// //           // Validate namaMataPelajaran and kelas match
// //           const course = courses.data?.find((c: any) =>
// //             c.namaMataPelajaran.toLowerCase() === schedule.namaMataPelajaran.toLowerCase() &&
// //             c.kelasId === kelas.id
// //           );
// //           if (!course) {
// //             errors.push(`Baris ${index + 2}: Mata pelajaran '${schedule.namaMataPelajaran}' tidak valid atau tidak sesuai dengan kelas '${schedule.namaKelas}'`);
// //             return;
// //           }

// //           // Validate namaGuru
// //           const teacher = teachers.data?.find((t: any) =>
// //             t.namaGuru.toLowerCase() === schedule.namaGuru.toLowerCase()
// //           );
// //           if (!teacher) {
// //             errors.push(`Baris ${index + 2}: Nama guru '${schedule.namaGuru}' tidak valid`);
// //             return;
// //           }

// //           // Validate hari
// //           if (!validDays.includes(schedule.hari.toUpperCase())) {
// //             errors.push(`Baris ${index + 2}: Hari tidak valid (gunakan: ${validDays.join(", ")})`);
// //             return;
// //           }

// //           // Validate time format
// //           if (!timeRegex.test(schedule.jamMulai) || !timeRegex.test(schedule.jamSelesai)) {
// //             errors.push(`Baris ${index + 2}: Format waktu harus HH:mm (contoh: 08:00). Data: ${schedule.jamMulai}, ${schedule.jamSelesai}`);
// //             return;
// //           }

// //           // Validate jamSelesai > jamMulai
// //           const startTime = new Date(`1970-01-01T${schedule.jamMulai}:00`);
// //           const endTime = new Date(`1970-01-01T${schedule.jamSelesai}:00`);
// //           if (endTime <= startTime) {
// //             errors.push(`Baris ${index + 2}: Jam selesai harus setelah jam mulai`);
// //             return;
// //           }

// //           // Add to valid schedules
// //           validSchedules.push({
// //             mataPelajaranId: course.id,
// //             guruId: teacher.id,
// //             hari: schedule.hari.toUpperCase(),
// //             jamMulai: schedule.jamMulai,
// //             jamSelesai: schedule.jamSelesai,
// //           });
// //         });

// //         if (errors.length > 0) {
// //           alert.error(`Validasi gagal:\n${errors.join("\n")}`);
// //           return;
// //         }

// //         if (validSchedules.length === 0) {
// //           alert.error("Tidak ada data valid untuk diunggah");
// //           return;
// //         }

// //         // Kirim data ke API secara bertahap
// //         let successCount = 0;
// //         let errorCount = 0;

// //         for (const item of validSchedules) {
// //           try {
// //             await creation.create(item);
// //             successCount++;
// //           } catch (err: any) {
// //             console.error(`Gagal mengirim: ${item.mataPelajaranId}`, err);
// //             errorCount++;
// //           }
// //         }

// //         setIsUploadModalOpen(false);
// //         setExcelFile(null);

// //         if (successCount > 0) {
// //           alert.success(
// //             lang.text("successful", {
// //               context: `Membuat ( ${successCount} jadwal) dan gagal( ${errorCount} jadwal)`,
// //             })
// //           );
// //           schedules.query.refetch();
// //         }

// //         if (errorCount > 0) {
// //           alert.error(
// //             lang.text("failed", {
// //               context: `Membuat (${successCount} jadwal) dan gagal (${errorCount} jadwal)`,
// //             })
// //           );
// //         }
// //       };
// //       reader.readAsArrayBuffer(excelFile);
// //     } catch (err: any) {
// //       alert.error("Gagal memproses file Excel: " + (err.message || "Unknown error"));
// //     }
// //   };

// //   // Restore focus to course search input
// //   useEffect(() => {
// //     if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
// //       searchInputRef.current.focus();
// //     }
// //   }, [searchCourse]);

// //   // Restore focus to teacher search input
// //   useEffect(() => {
// //     if (teacherSearchInputRef.current && document.activeElement !== teacherSearchInputRef.current) {
// //       teacherSearchInputRef.current.focus();
// //     }
// //   }, [searchTeacher]);

// //   // Handle keydown to prevent focus shift
// //   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
// //     if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
// //       e.preventDefault();
// //     }
// //   };

// //   // Handle day checkbox toggle
// //   const handleDayToggle = (day: string) => {
// //     setSelectedDays((prev) =>
// //       prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
// //     );
// //   };

// //   // Handle "All Days" checkbox toggle
// //   const handleAllDaysToggle = () => {
// //     setSelectedDays((prev) => (prev.length === daysOrder.length ? [] : [...daysOrder]));
// //   };

// //   const handleConfirmDelete = async () => {
// //     if (id === 0) {
// //       alert.error("Anda perlu ID");
// //       return;
// //     }
// //     try {
// //       await creation.delete(id);
// //       alert.success(
// //         lang.text("successful", {
// //           context: lang.text("dataSuccessDelete", { context: "" }),
// //         })
// //       );
// //       schedules.query.refetch();
// //       dialog.close();
// //     } catch (err: any) {
// //       alert.error("Error deleting schedule:", err);
// //       alert.error(
// //         err?.message ||
// //           lang.text("failed", {
// //             context: lang.text("dataFailDelete", { context: "" }),
// //           })
// //       );
// //     }
// //   };

// //   const handleAddSchedule = async () => {
// //     if (
// //       !formData.mataPelajaranId ||
// //       !formData.guruId ||
// //       !formData.hari ||
// //       !formData.jamMulai ||
// //       !formData.jamSelesai
// //     ) {
// //       alert.error("Semua field harus diisi");
// //       return;
// //     }

// //     if (selectedKelasIdForAdd === 0) {
// //       alert.error("Pilih kelas terlebih dahulu");
// //       return;
// //     }

// //     const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
// //     if (!timeRegex.test(formData.jamMulai) || !timeRegex.test(formData.jamSelesai)) {
// //       alert.error("Format waktu harus HH:mm (contoh: 08:40)");
// //       return;
// //     }

// //     const startTime = new Date(`1970-01-01T${formData.jamMulai}:00`);
// //     const endTime = new Date(`1970-01-01T${formData.jamSelesai}:00`);
// //     if (endTime <= startTime) {
// //       alert.error("Jam selesai harus setelah jam mulai");
// //       return;
// //     }

// //     const payload = { ...formData };
// //     try {
// //       await creation.create(payload);
// //       alert.success(
// //         lang.text("successful", {
// //           context: lang.text("scheduleSuccessCreate", { context: "" }),
// //         })
// //       );
// //       schedules.query.refetch();
// //       setIsAddModalOpen(false);
// //       setFormData({
// //         mataPelajaranId: 0,
// //         guruId: 0,
// //         hari: "",
// //         jamMulai: "",
// //         jamSelesai: "",
// //       });
// //       setSearchCourse("");
// //       setSearchTeacher("");
// //       setSelectedKelasIdForAdd(0);
// //     } catch (err: any) {
// //       alert.error(
// //         err?.message ||
// //           lang.text("failed", {
// //             context: lang.text("scheduleFailCreate", { context: "" }),
// //           })
// //       );
// //     }
// //   };

// //   const handleEditSchedule = async () => {
// //     if (
// //       !formData.mataPelajaranId ||
// //       !formData.guruId ||
// //       !formData.hari ||
// //       !formData.jamMulai ||
// //       !formData.jamSelesai
// //     ) {
// //       alert.error("Semua field harus diisi");
// //       return;
// //     }

// //     const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
// //     if (!timeRegex.test(formData.jamMulai) || !timeRegex.test(formData.jamSelesai)) {
// //       alert.error("Format waktu harus HH:mm (contoh: 08:40)");
// //       return;
// //     }

// //     const startTime = new Date(`1970-01-01T${formData.jamMulai}:00`);
// //     const endTime = new Date(`1970-01-01T${formData.jamSelesai}:00`);
// //     if (endTime <= startTime) {
// //       alert.error("Jam selesai harus setelah jam mulai");
// //       return;
// //     }

// //     const payload = { ...formData };
// //     try {
// //       await creation.update(editScheduleId, payload);
// //       alert.success(
// //         lang.text("successful", {
// //           context: lang.text("scheduleSuccessUpdate", { context: "" }),
// //         })
// //       );
// //       schedules.query.refetch();
// //       setIsEditModalOpen(false);
// //       setFormData({
// //         mataPelajaranId: 0,
// //         guruId: 0,
// //         hari: "",
// //         jamMulai: "",
// //         jamSelesai: "",
// //       });
// //       setSearchCourse("");
// //       setSearchTeacher("");
// //     } catch (err: any) {
// //       alert.error(
// //         err?.message ||
// //           lang.text("failed", {
// //             context: lang.text("scheduleFailUpdate", { context: "" }),
// //           })
// //       );
// //     }
// //   };

// //   const openAddModal = () => {
// //     setSelectedDay("");
// //     setFormData({
// //       mataPelajaranId: 0,
// //       guruId: 0,
// //       hari: "",
// //       jamMulai: "",
// //       jamSelesai: "",
// //     });
// //     setSearchCourse("");
// //     setSearchTeacher("");
// //     setSelectedKelasIdForAdd(0);
// //     setIsAddModalOpen(true);
// //   };

// //   const openEditModal = (day: string, schedule: ScheduleItem) => {
// //     setSelectedDay(day);
// //     setEditScheduleId(schedule.id);
// //     setFormData({
// //       mataPelajaranId: schedule.mataPelajaran.id || 0,
// //       guruId: schedule.guru.id || 0,
// //       hari: day,
// //       jamMulai: schedule.jamMulai,
// //       jamSelesai: schedule.jamSelesai,
// //     });
// //     setSearchCourse("");
// //     setSearchTeacher("");
// //     setIsEditModalOpen(true);
// //   };

// //   // Render loading state
// //   if (!schedules?.data || schedules.isLoading) {
// //     return (
// //       <div className="w-full h-[400px] border-dashed border-black/10 rounded-md flex items-center justify-center text-center">
// //         <p className="text-center">{lang.text("loadingScheduleMapel")}</p>
// //       </div>
// //     );
// //   }

// //   const dayMap = {
// //     'SENIN': 'senin',
// //     'SELASA': 'selasa',
// //     'RABU': 'rabu',
// //     'KAMIS': 'kamis',
// //     'JUMAT': 'jumat',
// //   };

// //   return (
// //     <>
// //       <Vokadialog
// //         visible={dialog.visible}
// //         title={'test test'}
// //         content={lang.text("deleteConfirmationDesc", { context: "tersebut" })}
// //         footer={
// //           <div className="flex flex-col sm:flex-row gap-2">
// //             <Button onClick={handleConfirmDelete} variant="destructive">
// //               {lang.text("delete")}
// //             </Button>
// //             <Button onClick={dialog.close} variant="outline">
// //               {lang.text("cancel")}
// //             </Button>
// //           </div>
// //         }
// //       />

// //       <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
// //         <DialogContent>
// //           <DialogHeader>
// //             <DialogTitle>{lang.text('createSchedule')}</DialogTitle>
// //           </DialogHeader>
// //           <div className="grid gap-4 py-4">
// //             <div className="grid gap-2">
// //               <label htmlFor="kelasId">Kelas</label>
// //               <Select
// //                 onValueChange={(value) => setSelectedKelasIdForAdd(parseInt(value))}
// //                 value={selectedKelasIdForAdd === 0 ? "" : selectedKelasIdForAdd.toString()}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue placeholder={lang.text('selectClassroom')} />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   {listClass?.data.map((kelas: any) => (
// //                     <SelectItem key={kelas.id} value={kelas.id.toString()}>
// //                       {kelas.namaKelas}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="grid gap-2">
// //               <label htmlFor="hari">{lang.text('day')}</label>
// //               <Select
// //                 onValueChange={(value) => setFormData({ ...formData, hari: value })}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue placeholder={lang.text('selectDay')} />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   {daysOrder.map((day) => (
// //                     <SelectItem key={day} value={day}>
// //                       {day}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="grid gap-2">
// //               <label htmlFor="mataPelajaranId">{lang.text('course')}</label>
// //               <Select
// //                 onValueChange={(value) =>
// //                   setFormData({ ...formData, mataPelajaranId: parseInt(value) })
// //                 }
// //                 // disabled={selectedKelasIdForAdd === 0}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue placeholder={selectedKelasIdForAdd === 0 ? lang.text('selectClassRoom') : lang.text('selectCourse')} />
// //                 </SelectTrigger>
// //                 <SelectContent className="px-2">
// //                   <div className="py-1 mb-2">
// //                     <Input
// //                       ref={searchInputRef}
// //                       placeholder={lang.text('searchCourse')}
// //                       value={searchCourse}
// //                       onChange={(e) => setSearchCourse(e.target.value)}
// //                       onKeyDown={handleSearchKeyDown}
// //                       className="w-full"
// //                     />
// //                   </div>
// //                   {filteredCourses.map((course: any) => (
// //                     <SelectItem key={course.id} value={course.id.toString()}>
// //                       {course.namaMataPelajaran}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="grid gap-2">
// //               <label htmlFor="guruId">{lang.text('teacher')}</label>
// //               <Select
// //                 onValueChange={(value) =>
// //                   setFormData({ ...formData, guruId: parseInt(value) })}
// //                 >
// //                 <SelectTrigger>
// //                   <SelectValue placeholder={lang.text('selectTeacher')} />
// //                 </SelectTrigger>
// //                 <SelectContent className="px-2">
// //                   <div className="py-1 mb-2">
// //                     <Input
// //                       ref={teacherSearchInputRef}
// //                       placeholder="Cari Guru..."
// //                       value={searchTeacher}
// //                       onChange={(e) => setSearchTeacher(e.target.value)}
// //                       onKeyDown={handleSearchKeyDown}
// //                       className="w-full"
// //                     />
// //                   </div>
// //                   {filteredTeachers?.map((teacher: any) => (
// //                     <SelectItem key={teacher.id} value={teacher.id.toString()}>
// //                       {teacher.namaGuru}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="grid gap-2">
// //               <label htmlFor="jamMulai">{lang.text('startHour')}</label>
// //               <Input
// //                 type="time"
// //                 value={formData.jamMulai}
// //                 onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
// //                 className="w-full"
// //               />
// //             </div>
// //             <div className="grid gap-2">
// //               <label htmlFor="jamSelesai">{lang.text('endHour')}</label>
// //               <Input
// //                 type="time"
// //                 value={formData.jamSelesai}
// //                 onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
// //                 className="w-full"
// //               />
// //             </div>
// //           </div>
// //           <DialogFooter>
// //             <Button onClick={handleAddSchedule}>{lang.text('save')}</Button>
// //             <Button variant="outline" onClick={() => {
// //               setIsAddModalOpen(false);
// //               setFormData({
// //                 mataPelajaranId: 0,
// //                 guruId: 0,
// //                 hari: '',
// //                 jamMulai: '',
// //                 jamSelesai: '',
// //               });
// //               setSelectedKelasIdForAdd(0);
// //             }}>
// //               {lang.text('cancel')}
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>

// //       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
// //         <DialogContent>
// //           <DialogHeader>
// //             <DialogTitle>{lang.text('editSchedule')} - {selectedDay}</DialogTitle>
// //           </DialogHeader>
// //           <div className="grid gap-4 py-4">
// //             <div className="grid gap-2">
// //               <label htmlFor="mataPelajaranId">{lang.text('course')}</label>
// //               <Select
// //                 value={formData.mataPelajaranId.toString()}
// //                 onValueChange={(value) =>
// //                   setFormData({ ...formData, mataPelajaranId: parseInt(value) })}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue placeholder={lang.text('selectCourse')} />
// //                 </SelectTrigger>
// //                 <SelectContent className="px-2">
// //                   <div className="py-1 mb-2">
// //                     <Input
// //                       ref={searchInputRef}
// //                       placeholder="Cari Mata Pelajaran..."
// //                       value={searchCourse}
// //                       onChange={(e) => setSearchCourse(e.target.value)}
// //                       onKeyDown={handleSearchKeyDown}
// //                       className="w-full"
// //                     />
// //                   </div>
// //                   {filteredCourses.map((course: any) => (
// //                     <SelectItem key={course.id} value={course.id.toString()}>
// //                       {course.namaMataPelajaran}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="grid gap-2">
// //               <label htmlFor="guruId">{lang.text('teacher')}</label>
// //               <Select
// //                 value={formData.guruId.toString()}
// //                 onValueChange={(value) =>
// //                   setFormData({ ...formData, guruId: parseInt(value) })}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue placeholder="Pilih Guru" />
// //                 </SelectTrigger>
// //                 <SelectContent className="px-2">
// //                   <div className="py-1 mb-2">
// //                     <Input
// //                       ref={teacherSearchInputRef}
// //                       placeholder={lang.text('searchTeacher')}
// //                       value={searchTeacher}
// //                       onChange={(e) => setSearchTeacher(e.target.value)}
// //                       onKeyDown={handleSearchKeyDown}
// //                       className="w-full"
// //                     />
// //                   </div>
// //                   {filteredTeachers.map((teacher: any) => (
// //                     <SelectItem key={teacher.id} value={teacher.id.toString()}>
// //                       {teacher.namaGuru}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="grid gap-2">
// //               <label htmlFor="jamMulai">{lang.text('startHour')}</label>
// //               <Input
// //                 type="time"
// //                 value={formData.jamMulai}
// //                 onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
// //                 className="w-full"
// //               />
// //             </div>
// //             <div className="grid gap-2">
// //               <label htmlFor="jamSelesai">{lang.text('endHour')}</label>
// //               <Input
// //                 type="time"
// //                 value={formData.jamSelesai}
// //                 onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
// //                 className="w-full"
// //               />
// //             </div>
// //           </div>
// //           <DialogFooter>
// //             <Button onClick={handleEditSchedule}>{lang.text('save')}</Button>
// //             <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
// //               {lang.text('cancel')}
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>

// //       <Dialog open={isDayFilterOpen} onOpenChange={setIsDayFilterOpen}>
// //         <DialogContent>
// //           <DialogHeader>
// //             <DialogTitle>{lang.text('selectDay')}</DialogTitle>
// //           </DialogHeader>
// //           <div className="grid gap-4 py-4">
// //             <div className="flex items-center gap-2">
// //               <Checkbox
// //                 id="all-days"
// //                 checked={selectedDays.length === daysOrder.length}
// //                 onCheckedChange={handleAllDaysToggle}
// //               />
// //               <label htmlFor="all-days">{lang.text('allDays')}</label>
// //             </div>
// //             {daysOrder.map((day) => (
// //               <div key={day} className="flex items-center gap-2">
// //                 <Checkbox
// //                   id={day}
// //                   checked={selectedDays.includes(day)}
// //                   onCheckedChange={() => handleDayToggle(day)}
// //                 />
// //                 <label htmlFor={day}>{day}</label>
// //               </div>
// //             ))}
// //           </div>
// //           <DialogFooter>
// //             <Button onClick={() => setIsDayFilterOpen(false)}>Tutup</Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>

// //       <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
// //         <DialogContent>
// //           <DialogHeader>
// //             {/* <DialogTitle>{lang.text('uploadExcel')}</DialogTitle> */}
// //           </DialogHeader>
// //           <div className="grid gap-4 py-4">
// //             <div className="grid gap-2">
// //               <label htmlFor="excelFile">{lang.text('selectFileExcel')}</label>
// //               <Input
// //                 type="file"
// //                 id="excelFile"
// //                 accept=".xlsx,.xls"
// //                 onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
// //               />
// //             </div>
// //           </div>
// //           <DialogFooter>
// //             <Button onClick={handleUploadExcel}>
// //               {lang.text('uploadExcel')}
// //               <FaFileExcel />
// //             </Button>
// //             <Button variant="outline" onClick={() => {
// //               setIsUploadModalOpen(false);
// //               setExcelFile(null);
// //             }}>
// //               Batal
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>

// //       <div className="mb-8">
// //         <div className="w-full mb-4 flex justify-between items-center">
// //           <div className="flex gap-2">
// //             <Button variant='outline' onClick={openAddModal}>
// //               {lang.text('createSchedule')} <Plus />
// //             </Button>
// //             <div className="mx-2 h-[36px] py-1 flex items-center justify-center">
// //               <p>{lang.text('or')}</p>
// //             </div>
// //             <Button className="text-green-300 border border-green-700 hover:bg-green-800/20 hover:text-green-300" variant="outline" onClick={handleDownloadTemplate}>
// //               {lang.text('DownloadTemplateExcel')} <Download />
// //             </Button>
// //             <div className="w-[1px] bg-white/20 mx-2 h-[28px] mt-1"></div>
// //             <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
// //               {lang.text('uploadExcel')} <UploadCloud />
// //             </Button>
// //           </div>
// //           <div className="flex items-center gap-4">
// //             <Select
// //               onValueChange={(value) => setSelectedClassId(parseInt(value))}
// //               value={selectedClassId.toString()}
// //             >
// //               <SelectTrigger className="w-[200px]">
// //                 <SelectValue placeholder="Pilih Kelas" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="0">{lang.text('allClasses')}</SelectItem>
// //                 {listClass?.data?.map((kelas: any) => (
// //                   <SelectItem key={kelas.id} value={kelas.id.toString()}>
// //                     {kelas.namaKelas}
// //                   </SelectItem>
// //                 ))}
// //               </SelectContent>
// //             </Select>
// //             <Button
// //               variant="outline"
// //               className="w-[200px] justify-between"
// //               onClick={() => setIsDayFilterOpen(true)}
// //             >
// //               {selectedDays.length === daysOrder.length
// //                 ? lang.text('allDays')
// //                 : selectedDays.length === 0
// //                 ? lang.text("selectDay")
// //                 : selectedDays.join(", ")}
// //               <span>▼</span>
// //             </Button>
// //             <Badge variant="outline" className="py-2.5">
// //               <span>{lang.text('totalClass')}:</span>
// //               <span className="ml-2">{classes.length}</span>
// //             </Badge>          
// //           </div>
// //         </div>
// //         <div className="grid gap-8">
// //           {Object.keys(groupedByClassAndDay).length > 0 && selectedDays.length > 0 ? (
// //             Object.keys(groupedByClassAndDay)
// //               .filter((kelasId) => selectedClassId === 0 || parseInt(kelasId) === selectedClassId)
// //               .map((kelasId) => {
// //                 const classSchedules = groupedByClassAndDay[parseInt(kelasId)];
// //                 if (!classSchedules) {
// //                   console.warn(`No schedules found for kelasId: ${kelasId}`);
// //                   return null;
// //                 }
// //                 return (
// //                   <div key={kelasId} className="border rounded-lg p-6 shadow-md">
// //                     <h1 className="flex gap-5 text-2xl font-bold mb-6">
// //                       <School2 /> {lang.text('className')}:{" "}
// //                       {classes.find((k: any) => k.id === parseInt(kelasId))?.namaKelas ||
// //                         `Kelas ${kelasId}`}
// //                     </h1>
// //                     <div className="grid grid-cols-2 gap-4">
// //                       {daysOrder
// //                         .filter((day) => selectedDays.includes(day))
// //                         .map((day) => (
// //                           <div key={day} className="border rounded-lg p-4 shadow-sm">
// //                             <h2 className="text-xl font-bold mb-4">{lang.text(dayMap[day])}</h2>
// //                             {classSchedules[day] && classSchedules[day].length > 0 ? (
// //                               <Table>
// //                                 <TableHeader>
// //                                   <TableRow>
// //                                     <TableHead>{lang.text("time")}</TableHead>
// //                                     <TableHead>{lang.text("nameMapel")}</TableHead>
// //                                     <TableHead>{lang.text("nameTeacher")}</TableHead>
// //                                     <TableHead>{lang.text("actions")}</TableHead>
// //                                   </TableRow>
// //                                 </TableHeader>
// //                                 <TableBody>
// //                                   {classSchedules[day].map((item) => (
// //                                     <TableRow key={item.id}>
// //                                       <TableCell>{`${item.jamMulai} - ${item.jamSelesai}`}</TableCell>
// //                                       <TableCell>{item.mataPelajaran.namaMataPelajaran}</TableCell>
// //                                       <TableCell>{item.guru.namaGuru}</TableCell>
// //                                       <TableCell className="flex gap-2">
// //                                         <Button
// //                                           variant="outline"
// //                                           size="sm"
// //                                           onClick={() => openEditModal(day, item)}
// //                                         >
// //                                           <Pen />
// //                                         </Button>
// //                                         <Button
// //                                           variant="destructive"
// //                                           size="sm"
// //                                           onClick={() => {
// //                                             setId(item.id);
// //                                             showRef.current?.();
// //                                           }}
// //                                         >
// //                                           <Trash />
// //                                         </Button>
// //                                       </TableCell>
// //                                     </TableRow>
// //                                   ))}
// //                                 </TableBody>
// //                               </Table>
// //                             ) : (
// //                               <p className="text-gray-500">No schedule for {day}</p>
// //                             )}
// //                           </div>
// //                         ))}
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //           ) : (
// //             <div className="rounded-lg border border-dashed border-white/20 w-full h-[56vh] flex flex-col justify-center items-center">
// //               <p className="text-gray-500 text-center">
// //                 {selectedDays.length === 0
// //                   ? "Pilih setidaknya satu hari untuk menampilkan jadwal."
// //                   : "Belum ada jadwal tersedia."}
// //               </p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// import {
//   Badge,
//   Button,
//   Checkbox,
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   Input,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/core/libs";
// import { useAlert, useVokadialog, Vokadialog } from "@/features/_global";
// import { useCourse } from "@/features/course";
// import { useBiodataGuru } from "@/features/user";
// import { Download, Pen, Plus, School2, Trash, UploadCloud } from "lucide-react";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import * as XLSX from "xlsx";
// import { useScheduleCreation, useSchedules } from "../hooks";
// import { useClassroom } from "@/features/classroom";
// import { FaFileExcel } from "react-icons/fa";

// interface ScheduleItem {
//   id: number;
//   hari: string;
//   jamMulai: string;
//   jamSelesai: string;
//   mataPelajaran: {
//     id: number;
//     namaMataPelajaran: string;
//     kelasId: number;
//     kelas: { id: number; namaKelas: string } | null;
//   };
//   guru: { id: number; namaGuru: string };
//   createdAt: string;
//   updatedAt: string;
// }

// interface NewScheduleForm {
//   mataPelajaranId: number;
//   guruId: number;
//   hari: string;
//   jamMulai: string;
//   jamSelesai: string;
// }

// interface BulkScheduleForm {
//   schedules: {
//     kelasId: string;
//     mataPelajaranId: string;
//     guruId: string;
//     hari: string;
//     jamMulai: string;
//     jamSelesai: string;
//   }[];
// }

// interface BulkSchedule {
//   namaKelas: string;
//   namaMataPelajaran: string;
//   namaGuru: string;
//   hari: string;
//   jamMulai: string;
//   jamSelesai: string;
// }

// const daysOrder = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"];

// export function ScheduleLandingContent() {
//   const alert = useAlert();
//   const creation = useScheduleCreation();
//   const dialog = useVokadialog();
//   const showRef = useRef<typeof dialog.open>();
//   showRef.current = dialog.open;
//   const [id, setId] = useState<number>(0);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
//   const [selectedDay, setSelectedDay] = useState<string>("");
//   const [editScheduleId, setEditScheduleId] = useState<number>(0);
//   const [searchCourse, setSearchCourse] = useState<string>("");
//   const [searchTeacher, setSearchTeacher] = useState<string>("");
//   const [selectedClassId, setSelectedClassId] = useState<number>(0); // 0 for All Classes
//   const [selectedDays, setSelectedDays] = useState<string[]>(daysOrder); // Default to all days
//   const [isDayFilterOpen, setIsDayFilterOpen] = useState(false);
//   const [selectedKelasIdForAdd, setSelectedKelasIdForAdd] = useState<number>(0); // 0 for no class selected in add modal
//   const [excelFile, setExcelFile] = useState<File | null>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const teacherSearchInputRef = useRef<HTMLInputElement>(null);
//   const [formData, setFormData] = useState<NewScheduleForm>({
//     mataPelajaranId: 0,
//     guruId: 0,
//     hari: "",
//     jamMulai: "",
//     jamSelesai: "",
//   });

//   const courses = useCourse();
//   const teachers = useBiodataGuru();
//   const schedules = useSchedules();
//   const listClass = useClassroom();

//   const bulkForm = useForm<BulkScheduleForm>({
//     defaultValues: {
//       schedules: [{ kelasId: "", mataPelajaranId: "", guruId: "", hari: "", jamMulai: "", jamSelesai: "" }],
//     },
//   });
//   const { fields, append, remove } = useFieldArray({
//     control: bulkForm.control,
//     name: "schedules",
//   });

//   console.log('classs', listClass?.data);
//   console.log('courses', courses?.data);

//   // Derive classes from schedules.data
//   const classes = useMemo(() => {
//     if (!schedules?.data) return [];
//     const kelasSet = new Map<number, { id: number; namaKelas: string }>();
//     Object.keys(schedules.data).forEach((day) => {
//       schedules?.data[day].forEach((schedule: ScheduleItem) => {
//         const { kelas } = schedule.mataPelajaran;
//         if (kelas && kelas.id != null && kelas.namaKelas) {
//           if (!kelasSet.has(kelas.id)) {
//             kelasSet.set(kelas.id, { id: kelas.id, namaKelas: kelas.namaKelas });
//           }
//         }
//       });
//     });
//     return Array.from(kelasSet.values());
//   }, [schedules?.data]);

//   console.log('classes', classes)

//   // Memoize filtered courses
//   const filteredCourses = useMemo(() => {
//     let filtered = courses?.data?.filter((course: any) =>
//       course.namaMataPelajaran.toLowerCase().includes(searchCourse.toLowerCase())
//     ) || [];
    
//     // if (isAddModalOpen && selectedKelasIdForAdd !== 0) {
//     //   filtered = filtered.filter((course: any) => course.kelasId === selectedKelasIdForAdd);
//     // }
    
//     return filtered;
//   }, [courses?.data, searchCourse, isAddModalOpen, selectedKelasIdForAdd]);

//   // Memoize filtered teachers
//   const filteredTeachers = useMemo(() => {
//     return (
//       teachers?.data?.filter((teacher: any) =>
//         teacher.namaGuru.toLowerCase().includes(searchTeacher.toLowerCase())
//       ) || []
//     );
//   }, [teachers?.data, searchTeacher]);

//   // Group data by kelasId and then by day
//   const groupedByClassAndDay = useMemo(() => {
//     const result: Record<number, Record<string, ScheduleItem[]>> = {};

//     if (schedules?.data) {
//       const normalizeDay = (day: string) => day.toUpperCase();
//       const kelasIds = new Set<number>();
//       Object.keys(schedules.data).forEach((day) => {
//         schedules.data[day].forEach((schedule: ScheduleItem) => {
//           kelasIds.add(schedule.mataPelajaran.kelasId);
//         });
//       });

//       kelasIds.forEach((kelasId) => {
//         result[kelasId] = daysOrder.reduce((acc, d) => {
//           acc[d] = [];
//           return acc;
//         }, {} as Record<string, ScheduleItem[]>);
//       });

//       Object.keys(schedules.data).forEach((day) => {
//         const normalizedDay = normalizeDay(day);
//         if (daysOrder.includes(normalizedDay)) {
//           schedules.data[day].forEach((schedule: ScheduleItem) => {
//             const kelasId = schedule.mataPelajaran.kelasId;
//             if (result[kelasId]) {
//               result[kelasId][normalizedDay].push(schedule);
//             }
//           });
//         }
//       });

//       Object.keys(result).forEach((kelasId) => {
//         daysOrder.forEach((day) => {
//           result[kelasId][day].sort((a, b) => {
//             const timeA = new Date(`1970-01-01T${a.jamMulai}:00`);
//             const timeB = new Date(`1970-01-01T${b.jamMulai}:00`);
//             return timeA.getTime() - timeB.getTime();
//           });
//         });
//       });
//     }

//     return result;
//   }, [schedules?.data]);

//   // Handle bulk schedule submission
//   const handleBulkSubmit = async (data: BulkScheduleForm) => {
//     const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//     const validSchedules: NewScheduleForm[] = [];
//     const errors: string[] = [];

//     data.schedules.forEach((schedule, index) => {
//       const { kelasId, mataPelajaranId, guruId, hari, jamMulai, jamSelesai } = schedule;

//       if (!kelasId || !mataPelajaranId || !guruId || !hari || !jamMulai || !jamSelesai) {
//         errors.push(`Jadwal ${index + 1}: Semua field wajib diisi.`);
//         return;
//       }

//       if (!timeRegex.test(jamMulai) || !timeRegex.test(jamSelesai)) {
//         errors.push(`Jadwal ${index + 1}: Format waktu harus HH:mm (contoh: 08:00).`);
//         return;
//       }

//       const startTime = new Date(`1970-01-01T${jamMulai}:00`);
//       const endTime = new Date(`1970-01-01T${jamSelesai}:00`);
//       if (endTime <= startTime) {
//         errors.push(`Jadwal ${index + 1}: Jam selesai harus setelah jam mulai.`);
//         return;
//       }

//       if (!daysOrder.includes(hari.toUpperCase())) {
//         errors.push(`Jadwal ${index + 1}: Hari tidak valid. Gunakan: ${daysOrder.join(", ")}.`);
//         return;
//       }

//       const isDuplicateInForm = data.schedules.some(
//         (s, i) =>
//           i !== index &&
//           s.kelasId === kelasId &&
//           s.hari === hari &&
//           s.jamMulai === jamMulai &&
//           s.jamSelesai === jamSelesai
//       );
//       if (isDuplicateInForm) {
//         errors.push(`Jadwal ${index + 1}: Jadwal duplikat ditemukan di dalam formulir.`);
//         return;
//       }

//       const existingSchedules = schedules?.data?.[hari.toUpperCase()] || [];
//       const isDuplicateInDB = existingSchedules.some(
//         (s: ScheduleItem) =>
//           s.mataPelajaran.kelasId === parseInt(kelasId) &&
//           s.jamMulai === jamMulai &&
//           s.jamSelesai === jamSelesai
//       );
//       if (isDuplicateInDB) {
//         errors.push(`Jadwal ${index + 1}: Jadwal sudah ada untuk kelas, hari, dan waktu ini.`);
//         return;
//       }

//       validSchedules.push({
//         mataPelajaranId: parseInt(mataPelajaranId),
//         guruId: parseInt(guruId),
//         hari: hari.toUpperCase(),
//         jamMulai,
//         jamSelesai,
//       });
//     });

//     if (errors.length > 0) {
//       alert.error(`Validasi gagal:\n${errors.join("\n")}`);
//       return;
//     }

//     if (validSchedules.length === 0) {
//       alert.error("Tidak ada jadwal valid untuk dikirim.");
//       return;
//     }

//     let successCount = 0;
//     let errorCount = 0;

//     for (const schedule of validSchedules) {
//       try {
//         await creation.create(schedule);
//         successCount++;
//       } catch (err: any) {
//         console.error(`Gagal membuat jadwal:`, err);
//         errorCount++;
//       }
//     }

//     setIsBulkModalOpen(false);
//     bulkForm.reset();
//     alert.success(`Berhasil membuat ${successCount} jadwal, gagal ${errorCount} jadwal.`);
//     if (errorCount > 0) {
//       alert.error(`Berhasil membuat ${successCount} jadwal, gagal ${errorCount} jadwal.`);
//     }
//     schedules.query.refetch();
//   };

//   // Download Excel template
//   const handleDownloadTemplate = () => {
//     try {
//       const link = document.createElement("a");
//       link.href = "/template_jadwal_mapel.xlsx";
//       link.download = "template_jadwal_mapel.xlsx";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       alert.success("Template Excel berhasil diunduh");
//     } catch (err: any) {
//       alert.error("Gagal mengunduh template Excel: " + (err.message || "Unknown error"));
//     }
//   };

//   // Handle Excel file upload
//   const handleUploadExcel = async () => {
//     if (!excelFile) {
//       alert.error("Pilih file Excel terlebih dahulu");
//       return;
//     }

//     try {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const data = new Uint8Array(e.target?.result as ArrayBuffer);
//         const workbook = XLSX.read(data, { type: "array", cellDates: true });
//         const sheet = workbook.Sheets["Schedules"];
//         if (!sheet) {
//           alert.error("Sheet 'Schedules' tidak ditemukan");
//           return;
//         }

//         const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);
//         if (jsonData.length === 0) {
//           alert.error("File Excel kosong");
//           return;
//         }

//         const validSchedules: NewScheduleForm[] = [];
//         const errors: string[] = [];
//         const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//         const validDays = daysOrder;

//         jsonData.forEach((row: any, index: number) => {
//           const formatTime = (value: any) => {
//             if (value instanceof Date) {
//               const hours = value.getHours().toString().padStart(2, '0');
//               const minutes = value.getMinutes().toString().padStart(2, '0');
//               return `${hours}:${minutes}`;
//             }
//             return value?.toString().trim() || "";
//           };

//           const schedule: BulkSchedule = {
//             namaKelas: row.namaKelas?.toString().trim() || "",
//             namaMataPelajaran: row.namaMataPelajaran?.toString().trim() || "",
//             namaGuru: row.namaGuru?.toString().trim() || "",
//             hari: row.hari?.toString().trim() || "",
//             jamMulai: formatTime(row.jamMulai),
//             jamSelesai: formatTime(row.jamSelesai),
//           };

//           console.log('schedule saat ini:', schedule);

//           if (
//             !schedule.namaKelas ||
//             !schedule.namaMataPelajaran ||
//             !schedule.namaGuru ||
//             !schedule.hari ||
//             !schedule.jamMulai ||
//             !schedule.jamSelesai
//           ) {
//             errors.push(`Baris ${index + 2}: Semua kolom wajib diisi (kecuali Catatan). Data: ${JSON.stringify(schedule)}`);
//             return;
//           }

//           const kelas = listClass?.data.find((k: any) =>
//             k.namaKelas.toLowerCase() === schedule.namaKelas.toLowerCase()
//           );
//           if (!kelas) {
//             errors.push(`Baris ${index + 2}: Nama kelas '${schedule.namaKelas}' tidak valid`);
//             return;
//           }

//           const course = courses.data?.find((c: any) =>
//             c.namaMataPelajaran.toLowerCase() === schedule.namaMataPelajaran.toLowerCase() &&
//             c.kelasId === kelas.id
//           );
//           if (!course) {
//             errors.push(`Baris ${index + 2}: Mata pelajaran '${schedule.namaMataPelajaran}' tidak valid atau tidak sesuai dengan kelas '${schedule.namaKelas}'`);
//             return;
//           }

//           const teacher = teachers.data?.find((t: any) =>
//             t.namaGuru.toLowerCase() === schedule.namaGuru.toLowerCase()
//           );
//           if (!teacher) {
//             errors.push(`Baris ${index + 2}: Nama guru '${schedule.namaGuru}' tidak valid`);
//             return;
//           }

//           if (!validDays.includes(schedule.hari.toUpperCase())) {
//             errors.push(`Baris ${index + 2}: Hari tidak valid (gunakan: ${validDays.join(", ")})`);
//             return;
//           }

//           if (!timeRegex.test(schedule.jamMulai) || !timeRegex.test(schedule.jamSelesai)) {
//             errors.push(`Baris ${index + 2}: Format waktu harus HH:mm (contoh: 08:00). Data: ${schedule.jamMulai}, ${schedule.jamSelesai}`);
//             return;
//           }

//           const startTime = new Date(`1970-01-01T${schedule.jamMulai}:00`);
//           const endTime = new Date(`1970-01-01T${schedule.jamSelesai}:00`);
//           if (endTime <= startTime) {
//             errors.push(`Baris ${index + 2}: Jam selesai harus setelah jam mulai`);
//             return;
//           }

//           validSchedules.push({
//             mataPelajaranId: course.id,
//             guruId: teacher.id,
//             hari: schedule.hari.toUpperCase(),
//             jamMulai: schedule.jamMulai,
//             jamSelesai: schedule.jamSelesai,
//           });
//         });

//         if (errors.length > 0) {
//           alert.error(`Validasi gagal:\n${errors.join("\n")}`);
//           return;
//         }

//         if (validSchedules.length === 0) {
//           alert.error("Tidak ada data valid untuk diunggah");
//           return;
//         }

//         let successCount = 0;
//         let errorCount = 0;

//         for (const item of validSchedules) {
//           try {
//             await creation.create(item);
//             successCount++;
//           } catch (err: any) {
//             console.error(`Gagal mengirim: ${item.mataPelajaranId}`, err);
//             errorCount++;
//           }
//         }

//         setIsUploadModalOpen(false);
//         setExcelFile(null);
//         alert.success(`Berhasil membuat ${successCount} jadwal, gagal ${errorCount} jadwal.`);
//         if (errorCount > 0) {
//           alert.error(`Berhasil membuat ${successCount} jadwal, gagal ${errorCount} jadwal.`);
//         }
//         schedules.query.refetch();
//       };
//       reader.readAsArrayBuffer(excelFile);
//     } catch (err: any) {
//       alert.error("Gagal memproses file Excel: " + (err.message || "Unknown error"));
//     }
//   };

//   // Restore focus to course search input
//   useEffect(() => {
//     if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [searchCourse]);

//   // Restore focus to teacher search input
//   useEffect(() => {
//     if (teacherSearchInputRef.current && document.activeElement !== teacherSearchInputRef.current) {
//       teacherSearchInputRef.current.focus();
//     }
//   }, [searchTeacher]);

//   // Handle keydown to prevent focus shift
//   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
//       e.preventDefault();
//     }
//   };

//   // Handle day checkbox toggle
//   const handleDayToggle = (day: string) => {
//     setSelectedDays((prev) =>
//       prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
//     );
//   };

//   // Handle "All Days" checkbox toggle
//   const handleAllDaysToggle = () => {
//     setSelectedDays((prev) => (prev.length === daysOrder.length ? [] : [...daysOrder]));
//   };

//   const handleConfirmDelete = async () => {
//     if (id === 0) {
//       alert.error("Anda perlu ID");
//       return;
//     }
//     try {
//       await creation.delete(id);
//       alert.success("Data berhasil dihapus");
//       schedules.query.refetch();
//       dialog.close();
//     } catch (err: any) {
//       alert.error("Gagal menghapus jadwal: " + (err.message || "Unknown error"));
//     }
//   };

//   const handleAddSchedule = async () => {
//     if (
//       !formData.mataPelajaranId ||
//       !formData.guruId ||
//       !formData.hari ||
//       !formData.jamMulai ||
//       !formData.jamSelesai
//     ) {
//       alert.error("Semua field harus diisi");
//       return;
//     }

//     if (selectedKelasIdForAdd === 0) {
//       alert.error("Pilih kelas terlebih dahulu");
//       return;
//     }

//     const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//     if (!timeRegex.test(formData.jamMulai) || !timeRegex.test(formData.jamSelesai)) {
//       alert.error("Format waktu harus HH:mm (contoh: 08:40)");
//       return;
//     }

//     const startTime = new Date(`1970-01-01T${formData.jamMulai}:00`);
//     const endTime = new Date(`1970-01-01T${formData.jamSelesai}:00`);
//     if (endTime <= startTime) {
//       alert.error("Jam selesai harus setelah jam mulai");
//       return;
//     }

//     const existingSchedules = schedules?.data?.[formData.hari.toUpperCase()] || [];
//     const isDuplicate = existingSchedules.some(
//       (s: ScheduleItem) =>
//         s.mataPelajaran.kelasId === selectedKelasIdForAdd &&
//         s.jamMulai === formData.jamMulai &&
//         s.jamSelesai === formData.jamSelesai
//     );
//     if (isDuplicate) {
//       alert.error("Jadwal sudah ada untuk kelas, hari, dan waktu ini.");
//       return;
//     }

//     const payload = { ...formData };
//     try {
//       await creation.create(payload);
//       alert.success("Jadwal berhasil dibuat");
//       schedules.query.refetch();
//       setIsAddModalOpen(false);
//       setFormData({
//         mataPelajaranId: 0,
//         guruId: 0,
//         hari: "",
//         jamMulai: "",
//         jamSelesai: "",
//       });
//       setSearchCourse("");
//       setSearchTeacher("");
//       setSelectedKelasIdForAdd(0);
//     } catch (err: any) {
//       alert.error("Gagal membuat jadwal: " + (err.message || "Unknown error"));
//     }
//   };

//   const handleEditSchedule = async () => {
//     if (
//       !formData.mataPelajaranId ||
//       !formData.guruId ||
//       !formData.hari ||
//       !formData.jamMulai ||
//       !formData.jamSelesai
//     ) {
//       alert.error("Semua field harus diisi");
//       return;
//     }

//     const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//     if (!timeRegex.test(formData.jamMulai) || !timeRegex.test(formData.jamSelesai)) {
//       alert.error("Format waktu harus HH:mm (contoh: 08:40)");
//       return;
//     }

//     const startTime = new Date(`1970-01-01T${formData.jamMulai}:00`);
//     const endTime = new Date(`1970-01-01T${formData.jamSelesai}:00`);
//     if (endTime <= startTime) {
//       alert.error("Jam selesai harus setelah jam mulai");
//       return;
//     }

//     const payload = { ...formData };
//     try {
//       await creation.update(editScheduleId, payload);
//       alert.success("Jadwal berhasil diperbarui");
//       schedules.query.refetch();
//       setIsEditModalOpen(false);
//       setFormData({
//         mataPelajaranId: 0,
//         guruId: 0,
//         hari: "",
//         jamMulai: "",
//         jamSelesai: "",
//       });
//       setSearchCourse("");
//       setSearchTeacher("");
//     } catch (err: any) {
//       alert.error("Gagal memperbarui jadwal: " + (err.message || "Unknown error"));
//     }
//   };

//   const openAddModal = () => {
//     setSelectedDay("");
//     setFormData({
//       mataPelajaranId: 0,
//       guruId: 0,
//       hari: "",
//       jamMulai: "",
//       jamSelesai: "",
//     });
//     setSearchCourse("");
//     setSearchTeacher("");
//     setSelectedKelasIdForAdd(0);
//     setIsAddModalOpen(true);
//   };

//   const openEditModal = (day: string, schedule: ScheduleItem) => {
//     setSelectedDay(day);
//     setEditScheduleId(schedule.id);
//     setFormData({
//       mataPelajaranId: schedule.mataPelajaran.id || 0,
//       guruId: schedule.guru.id || 0,
//       hari: day,
//       jamMulai: schedule.jamMulai,
//       jamSelesai: schedule.jamSelesai,
//     });
//     setSearchCourse("");
//     setSearchTeacher("");
//     setIsEditModalOpen(true);
//   };

//   // Render loading state
//   if (!schedules?.data || schedules.isLoading) {
//     return (
//       <div className="w-full h-[400px] border-dashed border-black/10 rounded-md flex items-center justify-center text-center">
//         <p className="text-center">Memuat jadwal...</p>
//       </div>
//     );
//   }

//   const dayMap = {
//     'SENIN': 'Senin',
//     'SELASA': 'Selasa',
//     'RABU': 'Rabu',
//     'KAMIS': 'Kamis',
//     'JUMAT': 'Jumat',
//   };

//   return (
//     <>
//       <Vokadialog
//         visible={dialog.visible}
//         title="Konfirmasi Hapus"
//         content="Apakah Anda yakin ingin menghapus data tersebut?"
//         footer={
//           <div className="flex flex-col sm:flex-row gap-2">
//             <Button onClick={handleConfirmDelete} variant="destructive">
//               Hapus
//             </Button>
//             <Button onClick={dialog.close} variant="outline">
//               Batal
//             </Button>
//           </div>
//         }
//       />

//       <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Buat Jadwal</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <label htmlFor="kelasId">Kelas</label>
//               <Select
//                 onValueChange={(value) => setSelectedKelasIdForAdd(parseInt(value))}
//                 value={selectedKelasIdForAdd === 0 ? "" : selectedKelasIdForAdd.toString()}
//               >
//                 <SelectTrigger className="text-white bg-transparent placeholder:text-gray-400">
//                   <SelectValue>
//                     {selectedKelasIdForAdd
//                       ? listClass?.data?.find((kelas: any) => kelas.id === selectedKelasIdForAdd)?.namaKelas ||
//                         "Pilih Kelas"
//                       : "Pilih Kelas"}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent className="text-white bg-gray-800">
//                   {listClass?.data && listClass.data.length > 0 ? (
//                     listClass.data.map((kelas: any) => (
//                       <SelectItem key={kelas.id} value={kelas.id.toString()} className="text-white">
//                         {kelas.namaKelas}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <div className="p-2 text-sm text-gray-400">Tidak ada kelas tersedia</div>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <label htmlFor="hari">Hari</label>
//               <Select
//                 onValueChange={(value) => setFormData({ ...formData, hari: value })}
//                 value={formData.hari}
//               >
//                 <SelectTrigger className="text-white bg-transparent placeholder:text-gray-400">
//                   <SelectValue>
//                     {formData.hari || "Pilih Hari"}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent className="text-white bg-gray-800">
//                   {daysOrder.map((day) => (
//                     <SelectItem key={day} value={day} className="text-white">
//                       {day}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <label htmlFor="mataPelajaranId">Mata Pelajaran</label>
//               <Select
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, mataPelajaranId: parseInt(value) })
//                 }
//                 value={formData.mataPelajaranId === 0 ? "" : formData.mataPelajaranId.toString()}
//               >
//                 <SelectTrigger className="text-white bg-transparent placeholder:text-gray-400">
//                   <SelectValue>
//                     {formData.mataPelajaranId
//                       ? filteredCourses.find((course: any) => course.id === formData.mataPelajaranId)?.namaMataPelajaran ||
//                         "Pilih Mata Pelajaran"
//                       : "Pilih Mata Pelajaran"}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent className="text-white bg-gray-800 px-2">
//                   <div className="py-1 mb-2">
//                     <Input
//                       ref={searchInputRef}
//                       placeholder="Cari Mata Pelajaran..."
//                       value={searchCourse}
//                       onChange={(e) => setSearchCourse(e.target.value)}
//                       onKeyDown={handleSearchKeyDown}
//                       className="w-full"
//                     />
//                   </div>
//                   {filteredCourses.length > 0 ? (
//                     filteredCourses.map((course: any) => (
//                       <SelectItem key={course.id} value={course.id.toString()} className="text-white">
//                         {course.namaMataPelajaran}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <div className="p-2 text-sm text-gray-400">Tidak ada mata pelajaran tersedia</div>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <label htmlFor="guruId">Guru</label>
//               <Select
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, guruId: parseInt(value) })
//                 }
//                 value={formData.guruId === 0 ? "" : formData.guruId.toString()}
//               >
//                 <SelectTrigger className="text-white bg-transparent placeholder:text-gray-400">
//                   <SelectValue>
//                     {formData.guruId
//                       ? filteredTeachers.find((teacher: any) => teacher.id === formData.guruId)?.namaGuru ||
//                         "Pilih Guru"
//                       : "Pilih Guru"}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent className="text-white bg-gray-800 px-2">
//                   <div className="py-1 mb-2">
//                     <Input
//                       ref={teacherSearchInputRef}
//                       placeholder="Cari Guru..."
//                       value={searchTeacher}
//                       onChange={(e) => setSearchTeacher(e.target.value)}
//                       onKeyDown={handleSearchKeyDown}
//                       className="w-full"
//                     />
//                   </div>
//                   {filteredTeachers.length > 0 ? (
//                     filteredTeachers.map((teacher: any) => (
//                       <SelectItem key={teacher.id} value={teacher.id.toString()} className="text-white">
//                         {teacher.namaGuru}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <div className="p-2 text-sm text-gray-400">Tidak ada guru tersedia</div>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <label htmlFor="jamMulai">Jam Mulai</label>
//               <Input
//                 type="time"
//                 value={formData.jamMulai}
//                 onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
//                 className="w-full"
//               />
//             </div>
//             <div className="grid gap-2">
//               <label htmlFor="jamSelesai">Jam Selesai</label>
//               <Input
//                 type="time"
//                 value={formData.jamSelesai}
//                 onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
//                 className="w-full"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button onClick={handleAddSchedule}>Simpan</Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setIsAddModalOpen(false);
//                 setFormData({
//                   mataPelajaranId: 0,
//                   guruId: 0,
//                   hari: "",
//                   jamMulai: "",
//                   jamSelesai: "",
//                 });
//                 setSelectedKelasIdForAdd(0);
//               }}
//             >
//               Batal
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Jadwal - {selectedDay}</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <label htmlFor="mataPelajaranId">Mata Pelajaran</label>
//               <Select
//                 value={formData.mataPelajaranId === 0 ? "" : formData.mataPelajaranId.toString()}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, mataPelajaranId: parseInt(value) })
//                 }
//               >
//                 <SelectTrigger className="text-white bg-transparent placeholder:text-gray-400">
//                   <SelectValue>
//                     {formData.mataPelajaranId
//                       ? filteredCourses.find((course: any) => course.id === formData.mataPelajaranId)?.namaMataPelajaran ||
//                         "Pilih Mata Pelajaran"
//                       : "Pilih Mata Pelajaran"}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent className="text-white bg-gray-800 px-2">
//                   <div className="py-1 mb-2">
//                     <Input
//                       ref={searchInputRef}
//                       placeholder="Cari Mata Pelajaran..."
//                       value={searchCourse}
//                       onChange={(e) => setSearchCourse(e.target.value)}
//                       onKeyDown={handleSearchKeyDown}
//                       className="w-full"
//                     />
//                   </div>
//                   {filteredCourses.length > 0 ? (
//                     filteredCourses.map((course: any) => (
//                       <SelectItem key={course.id} value={course.id.toString()} className="text-white">
//                         {course.namaMataPelajaran}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <div className="p-2 text-sm text-gray-400">Tidak ada mata pelajaran tersedia</div>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <label htmlFor="guruId">Guru</label>
//               <Select
//                 value={formData.guruId === 0 ? "" : formData.guruId.toString()}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, guruId: parseInt(value) })
//                 }
//               >
//                 <SelectTrigger className="text-white bg-transparent placeholder:text-gray-400">
//                   <SelectValue>
//                     {formData.guruId
//                       ? filteredTeachers.find((teacher: any) => teacher.id === formData.guruId)?.namaGuru ||
//                         "Pilih Guru"
//                       : "Pilih Guru"}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent className="text-white bg-gray-800 px-2">
//                   <div className="py-1 mb-2">
//                     <Input
//                       ref={teacherSearchInputRef}
//                       placeholder="Cari Guru..."
//                       value={searchTeacher}
//                       onChange={(e) => setSearchTeacher(e.target.value)}
//                       onKeyDown={handleSearchKeyDown}
//                       className="w-full"
//                     />
//                   </div>
//                   {filteredTeachers.length > 0 ? (
//                     filteredTeachers.map((teacher: any) => (
//                       <SelectItem key={teacher.id} value={teacher.id.toString()} className="text-white">
//                         {teacher.namaGuru}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <div className="p-2 text-sm text-gray-400">Tidak ada guru tersedia</div>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <label htmlFor="jamMulai">Jam Mulai</label>
//               <Input
//                 type="time"
//                 value={formData.jamMulai}
//                 onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
//                 className="w-full"
//               />
//             </div>
//             <div className="grid gap-2">
//               <label htmlFor="jamSelesai">Jam Selesai</label>
//               <Input
//                 type="time"
//                 value={formData.jamSelesai}
//                 onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
//                 className="w-full"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button onClick={handleEditSchedule}>Simpan</Button>
//             <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
//               Batal
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isDayFilterOpen} onOpenChange={setIsDayFilterOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Pilih Hari</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="flex items-center gap-2">
//               <Checkbox
//                 id="all-days"
//                 checked={selectedDays.length === daysOrder.length}
//                 onCheckedChange={handleAllDaysToggle}
//               />
//               <label htmlFor="all-days">Semua Hari</label>
//             </div>
//             {daysOrder.map((day) => (
//               <div key={day} className="flex items-center gap-2">
//                 <Checkbox
//                   id={day}
//                   checked={selectedDays.includes(day)}
//                   onCheckedChange={() => handleDayToggle(day)}
//                 />
//                 <label htmlFor={day}>{day}</label>
//               </div>
//             ))}
//           </div>
//           <DialogFooter>
//             <Button onClick={() => setIsDayFilterOpen(false)}>Tutup</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Unggah Excel</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <label htmlFor="excelFile">Pilih File Excel</label>
//               <Input
//                 type="file"
//                 id="excelFile"
//                 accept=".xlsx,.xls"
//                 onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button onClick={handleUploadExcel}>
//               Unggah Excel
//               <FaFileExcel />
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setIsUploadModalOpen(false);
//                 setExcelFile(null);
//               }}
//             >
//               Batal
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
//         <DialogContent className="w-[1200px] pt-10 h-[90vh] max-w-[90vw] overflow-auto">
//           <DialogHeader className="flex h-[54px] justify-between border-b border-b-white/10 pb-6 mb-4">
//             <DialogTitle className="flex items-baseline gap-4">
//               <p>Buat Jadwal Massal</p>
//             </DialogTitle>
//           </DialogHeader>
//           <Form {...bulkForm}>
//             <form onSubmit={bulkForm.handleSubmit(handleBulkSubmit)} className="mb-8">
//               <div className="grid grid-cols-3 gap-4">
//                 {fields.map((field, index) => (
//                   <div key={field.id} className="flex flex-col gap-4 border p-4 rounded-md box-border">
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-sm font-semibold">Jadwal {index + 1}</h3>
//                       {fields.length > 1 && (
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => remove(index)}
//                         >
//                           <Trash className="w-4 h-4" />
//                         </Button>
//                       )}
//                     </div>
//                     <FormField
//                       control={bulkForm.control}
//                       name={`schedules.${index}.kelasId`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Kelas</FormLabel>
//                           <Select
//                             onValueChange={(value) => {
//                               console.log(`Selected kelasId for Schedule ${index + 1}:`, value);
//                               field.onChange(value);
//                             }}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger className="text-white bg-transparent placeholder:text-gray-400">
//                                 <SelectValue>
//                                   {field.value
//                                     ? listClass?.data?.find((kelas: any) => kelas.id === parseInt(field.value))?.namaKelas ||
//                                       "Pilih Kelas"
//                                     : "Pilih Kelas"}
//                                 </SelectValue>
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent className="text-white bg-gray-800">
//                               {listClass?.data && listClass.data.length > 0 ? (
//                                 listClass.data.map((kelas: any) => (
//                                   <SelectItem key={kelas.id} value={kelas.id.toString()} className="text-white">
//                                     {kelas.namaKelas}
//                                   </SelectItem>
//                                 ))
//                               ) : (
//                                 <div className="p-2 text-sm text-gray-400">Tidak ada kelas tersedia</div>
//                               )}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={bulkForm.control}
//                       name={`schedules.${index}.mataPelajaranId`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Mata Pelajaran</FormLabel>
//                           <Select
//                             onValueChange={(value) => {
//                               console.log(`Selected mataPelajaranId for Schedule ${index + 1}:`, value);
//                               field.onChange(value);
//                             }}
//                             value={field.value}
//                             disabled={!bulkForm.watch(`schedules.${index}.kelasId`)}
//                           >
//                             <FormControl>
//                               <SelectTrigger className="text-white bg-transparent placeholder:text-gray-400">
//                                 <SelectValue>
//                                   {field.value
//                                     ? courses?.data?.find((course: any) => course.id === parseInt(field.value))?.namaMataPelajaran ||
//                                       "Pilih Mata Pelajaran"
//                                     : "Pilih Mata Pelajaran"}
//                                 </SelectValue>
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent className="text-white bg-gray-800">
//                               {courses?.data && courses.data.length > 0 ? (
//                                 courses.data
//                                   // .filter((course: any) => course.kelasId === parseInt(bulkForm.watch(`schedules.${index}.kelasId`)))
//                                   .map((course: any) => (
//                                     <SelectItem key={course.id} value={course.id.toString()} className="text-white">
//                                       {course.namaMataPelajaran}
//                                     </SelectItem>
//                                   ))
//                               ) : (
//                                 <div className="p-2 text-sm text-gray-400">Tidak ada mata pelajaran tersedia</div>
//                               )}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={bulkForm.control}
//                       name={`schedules.${index}.guruId`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Guru</FormLabel>
//                           <Select
//                             onValueChange={(value) => {
//                               console.log(`Selected guruId for Schedule ${index + 1}:`, value);
//                               field.onChange(value);
//                             }}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger className="text-white bg-transparent placeholder:text-gray-400">
//                                 <SelectValue>
//                                   {field.value
//                                     ? teachers?.data?.find((teacher: any) => teacher.id === parseInt(field.value))?.namaGuru ||
//                                       "Pilih Guru"
//                                     : "Pilih Guru"}
//                                 </SelectValue>
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent className="text-white bg-gray-800">
//                               {teachers?.data && teachers.data.length > 0 ? (
//                                 teachers.data.map((teacher: any) => (
//                                   <SelectItem key={teacher.id} value={teacher.id.toString()} className="text-white">
//                                     {teacher.namaGuru}
//                                   </SelectItem>
//                                 ))
//                               ) : (
//                                 <div className="p-2 text-sm text-gray-400">Tidak ada guru tersedia</div>
//                               )}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={bulkForm.control}
//                       name={`schedules.${index}.hari`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Hari</FormLabel>
//                           <Select
//                             onValueChange={(value) => {
//                               console.log(`Selected hari for Schedule ${index + 1}:`, value);
//                               field.onChange(value);
//                             }}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger className="text-white bg-transparent placeholder:text-gray-400">
//                                 <SelectValue>
//                                   {field.value || "Pilih Hari"}
//                                 </SelectValue>
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent className="text-white bg-gray-800">
//                               {daysOrder.map((day) => (
//                                 <SelectItem key={day} value={day} className="text-white">
//                                   {day}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={bulkForm.control}
//                       name={`schedules.${index}.jamMulai`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Jam Mulai</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="time"
//                               {...field}
//                               className="w-full"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={bulkForm.control}
//                       name={`schedules.${index}.jamSelesai`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Jam Selesai</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="time"
//                               {...field}
//                               className="w-full"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div className="w-full mt-4 flex gap-4">
//                 <Button
//                   type="button"
//                   disabled={fields.length >= 6}
//                   variant="outline"
//                   onClick={() => append({ kelasId: "", mataPelajaranId: "", guruId: "", hari: "", jamMulai: "", jamSelesai: "" })}
//                   className="w-full"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Tambah Jadwal (6/{fields.length})
//                 </Button>
//                 <div className="ml-auto flex gap-4 justify-end">
//                 <Button
//                   type="submit"
//                   disabled={creation.isLoading || !listClass?.data?.length}
//                   className="active:scale-[0.97]"
//                 >
//                   {creation.isLoading ? "Sedang Memproses..." : "Buat Jadwal"}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     setIsBulkModalOpen(false);
//                     bulkForm.reset();
//                   }}
//                   className="active:scale-[0.97]"
//                 >
//                   Batal
//                 </Button>
//               </div>
//               </div>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>

//       <div className="mb-8">
//         <div className="w-full mb-4 flex justify-between items-center">
//           <div className="flex gap-2">
//             <Button variant='outline' onClick={openAddModal}>
//               Buat Jadwal <Plus />
//             </Button>
//             <Button variant='outline' onClick={() => setIsBulkModalOpen(true)}>
//               Buat Jadwal Massal <Plus />
//             </Button>
//             <div className="mx-2 h-[36px] py-1 flex items-center justify-center">
//               <p>atau</p>
//             </div>
//             <Button className="text-green-300 border border-green-700 hover:bg-green-800/20 hover:text-green-300" variant="outline" onClick={handleDownloadTemplate}>
//               Unduh Template Excel <Download />
//             </Button>
//             <div className="w-[1px] bg-white/20 mx-2 h-[28px] mt-1"></div>
//             <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
//               Unggah Excel <UploadCloud />
//             </Button>
//           </div>
//           <div className="flex items-center gap-4">
//             <Select
//               onValueChange={(value) => setSelectedClassId(parseInt(value))}
//               value={selectedClassId.toString()}
//             >
//               <SelectTrigger className="w-[200px] text-white bg-transparent placeholder:text-gray-400">
//                 <SelectValue>
//                   {selectedClassId === 0
//                     ? "Semua Kelas"
//                     : listClass?.data?.find((kelas: any) => kelas.id === selectedClassId)?.namaKelas ||
//                       "Semua Kelas"}
//                 </SelectValue>
//               </SelectTrigger>
//               <SelectContent className="text-white bg-gray-800">
//                 <SelectItem value="0" className="text-white">Semua Kelas</SelectItem>
//                 {listClass?.data?.map((kelas: any) => (
//                   <SelectItem key={kelas.id} value={kelas.id.toString()} className="text-white">
//                     {kelas.namaKelas}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Button
//               variant="outline"
//               className="w-[200px] justify-between"
//               onClick={() => setIsDayFilterOpen(true)}
//             >
//               {selectedDays.length === daysOrder.length
//                 ? "Semua Hari"
//                 : selectedDays.length === 0
//                 ? "Pilih Hari"
//                 : selectedDays.join(", ")}
//               <span>▼</span>
//             </Button>
//             <Badge variant="outline" className="py-2.5">
//               <span>Total Kelas:</span>
//               <span className="ml-2">{classes.length}</span>
//             </Badge>          
//           </div>
//         </div>
//         <div className="grid gap-8">
//           {Object.keys(groupedByClassAndDay).length > 0 && selectedDays.length > 0 ? (
//             Object.keys(groupedByClassAndDay)
//               .filter((kelasId) => selectedClassId === 0 || parseInt(kelasId) === selectedClassId)
//               .map((kelasId) => {
//                 const classSchedules = groupedByClassAndDay[parseInt(kelasId)];
//                 if (!classSchedules) {
//                   console.warn(`Tidak ada jadwal untuk kelasId: ${kelasId}`);
//                   return null;
//                 }
//                 return (
//                   <div key={kelasId} className="border rounded-lg p-6 shadow-md">
//                     <h1 className="flex gap-5 text-2xl font-bold mb-6">
//                       <School2 /> Kelas:{" "}
//                       {listClass?.data.find((k: any) => k.id === parseInt(kelasId))?.namaKelas ||
//                         `Kelas ${kelasId}`}
//                     </h1>
//                     <div className="grid grid-cols-2 gap-4">
//                       {daysOrder
//                         .filter((day) => selectedDays.includes(day))
//                         .map((day) => (
//                           <div key={day} className="border rounded-lg p-4 shadow-sm">
//                             <h2 className="text-xl font-bold mb-4">{dayMap[day]}</h2>
//                             {classSchedules[day] && classSchedules[day].length > 0 ? (
//                               <Table>
//                                 <TableHeader>
//                                   <TableRow>
//                                     <TableHead>Waktu</TableHead>
//                                     <TableHead>Nama Mata Pelajaran</TableHead>
//                                     <TableHead>Nama Guru</TableHead>
//                                     <TableHead>Aksi</TableHead>
//                                   </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                   {classSchedules[day].map((item) => (
//                                     <TableRow key={item.id}>
//                                       <TableCell>{`${item.jamMulai} - ${item.jamSelesai}`}</TableCell>
//                                       <TableCell>{item.mataPelajaran.namaMataPelajaran}</TableCell>
//                                       <TableCell>{item.guru.namaGuru}</TableCell>
//                                       <TableCell className="flex gap-2">
//                                         <Button
//                                           variant="outline"
//                                           size="sm"
//                                           onClick={() => openEditModal(day, item)}
//                                         >
//                                           <Pen />
//                                         </Button>
//                                         <Button
//                                           variant="destructive"
//                                           size="sm"
//                                           onClick={() => {
//                                             setId(item.id);
//                                             showRef.current?.();
//                                           }}
//                                         >
//                                           <Trash />
//                                         </Button>
//                                       </TableCell>
//                                     </TableRow>
//                                   ))}
//                                 </TableBody>
//                               </Table>
//                             ) : (
//                               <p className="text-gray-500">Tidak ada jadwal untuk {dayMap[day]}</p>
//                             )}
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 );
//               })
//           ) : (
//             <div className="rounded-lg border border-dashed border-white/20 w-full h-[56vh] flex flex-col justify-center items-center">
//               <p className="text-gray-500 text-center">
//                 {selectedDays.length === 0
//                   ? "Pilih setidaknya satu hari untuk menampilkan jadwal"
//                   : "Belum ada jadwal tersedia"}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


import { Download, Upload } from "lucide-react";
import { useMemo, useState } from "react";

type Jenjang = "SD" | "SMP" | "SMA" | "SMK";

const TENANTS = [
  { id: "sman1", name: "SMAN 1 Contoh" },
  { id: "smkn2", name: "SMKN 2 Contoh" },
  { id: "mtsn3", name: "MTsN 3 Contoh" },
  { id: "min5",  name: "MIN 5 Contoh"  },
];
const TENANT_NAME = Object.fromEntries(TENANTS.map(t=>[t.id,t.name]));

const LEVELS_MAP: Record<Jenjang, string[]> = {
  SD:  ["I","II","III","IV","V","VI"],
  SMP: ["VII","VIII","IX"],
  SMA: ["X","XI","XII"],
  SMK: ["X","XI","XII"],
};

// ---- Teachers (guru) — master data ----
interface Teacher { id: string; name: string; tenantId?: string }
const TEACHERS: Teacher[] = [
  { id: "t1",  name: "Pak Adi",   tenantId:"sman1" },
  { id: "t2",  name: "Ibu Citra", tenantId:"sman1" },
  { id: "t3",  name: "Ibu Rina",  tenantId:"sman1" },
  { id: "t6",  name: "Pak Budi",  tenantId:"smkn2" },
  { id: "t7",  name: "Bu Maya",   tenantId:"smkn2" },
  { id: "t12", name: "Pak Multi", tenantId:"sman1" },
];
const TEACHER_NAME: Record<string,string> = Object.fromEntries(TEACHERS.map(t=>[t.id,t.name]));
function teacherName(id?: string){ return id ? (TEACHER_NAME[id] || "-") : "-"; }

// NEW: Teacher skills (kompetensi per guru → kode mapel, UPPERCASE)
const TEACHER_SKILLS: Record<string,string[]> = {
  t1: ["MTK"],
  t2: ["BIN","GEO"],
  t3: ["BIN"],
  t6: ["DBMS","ALGO"],
  t7: ["JAR","SYS","INF"],
  t12:["MTK","BIN","INF"],
};
const hasSkill = (tid:string,kode:string)=> (TEACHER_SKILLS[tid]||[]).includes((kode||"").toUpperCase());

interface KelasLite { id: string; tenantId: string; jenjang: Jenjang; level: string; namaKelas: string; }
const KELAS: KelasLite[] = [
  { id: "k-sman1-1", tenantId:"sman1", jenjang:"SMA", level:"X",   namaKelas:"X-IPA A" },
  { id: "k-sman1-2", tenantId:"sman1", jenjang:"SMA", level:"XI",  namaKelas:"XI-IPS A" },
  { id: "k-smkn2-1", tenantId:"smkn2", jenjang:"SMK", level:"X",   namaKelas:"X-RPL A" },
  { id: "k-smkn2-2", tenantId:"smkn2", jenjang:"SMK", level:"XI",  namaKelas:"XI-TKJ A" },
  { id: "k-mtsn3-1", tenantId:"mtsn3", jenjang:"SMP", level:"VIII", namaKelas:"VIII-B" },
  { id: "k-min5-1",  tenantId:"min5",  jenjang:"SD",  level:"IV",  namaKelas:"IV-A" },
];

// Daftar mapel untuk dropdown + checklist
const SUBJECT_OPTIONS = [
  { kode: "BIN",  nama: "Bahasa Indonesia" },
  { kode: "BIG",  nama: "Bahasa Inggris" },
  { kode: "MTK",  nama: "Matematika" },
  { kode: "BIO",  nama: "Biologi" },
  { kode: "FIS",  nama: "Fisika" },
  { kode: "KIM",  nama: "Kimia" },
  { kode: "GEO",  nama: "Geografi" },
  { kode: "SOS",  nama: "Sosiologi" },
  { kode: "DBMS", nama: "Basis Data" },
  { kode: "ALGO", nama: "Algoritma" },
  { kode: "JAR",  nama: "Jaringan Komputer" },
  { kode: "SYS",  nama: "Sistem Operasi" },
  { kode: "INF",  nama: "Informatika" },
];

const DAYS = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"] as const;
type Day = typeof DAYS[number];

function clsx(...a:any[]){ return a.filter(Boolean).join(" "); }
function uid(prefix="id"){ return `${prefix}-${Math.random().toString(36).slice(2,9)}`; }
function kelasName(id:string){ return KELAS.find(k=>k.id===id)?.namaKelas || "-"; }
function overlaps(a1:number,a2:number,b1:number,b2:number){ return Math.max(a1,b1) <= Math.min(a2,b2); }

// ---- Waktu helper (jam bebas → period & display) ----
function hhmmToMin(hhmm:string){ const [h,m] = hhmm.split(":").map(Number); return h*60 + m; }
function minToHHMM(min:number){ const t=((min%1440)+1440)%1440; const h=Math.floor(t/60); const m=t%60; return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`; }
export function periodRangeToTimeRange(startHHMM:string, perMin:number, pStart:number, pEnd:number){
  const start = hhmmToMin(startHHMM) + (pStart-1)*perMin;
  const end   = start + (pEnd-pStart+1)*perMin;
  return `${minToHHMM(start)} - ${minToHHMM(end)}`;
}
function clamp(n:number,min:number,max:number){ return Math.max(min, Math.min(max, n)); }
function timesToPeriodRange(dayStartHHMM:string, perMin:number, hhmmStart:string, hhmmEnd:string){
  const day0 = hhmmToMin(dayStartHHMM);
  let a = hhmmToMin(hhmmStart) - day0;
  let b = hhmmToMin(hhmmEnd) - day0;
  if (isNaN(a) || isNaN(b)) return { pStart: 1, pEnd: 1 };
  if (b < a) b = a; // minimal sama
  const pStart = clamp(Math.floor(a / perMin) + 1, 1, 10);
  const pEnd   = clamp(Math.ceil((b - 1) / perMin) + 1, 1, 10);
  return { pStart, pEnd: Math.max(pStart, pEnd) };
}

interface ScheduleRow {
  id: string;
  tenantId: string;
  kelasId: string;
  jenjang: Jenjang;
  hari: Day;
  pStart: number; // 1..10
  pEnd: number;   // 1..10
  mapelKode: string;
  mapelNama: string;
  teacherId?: string;     // guru utama
  subTeacherId?: string;  // NEW: guru pengganti
  ruang?: string;
}

function validateRow(row: ScheduleRow, existing: ScheduleRow[]): string[] {
  const errs: string[] = [];
  if (!row.tenantId) errs.push("Tenant wajib dipilih");
  if (!row.kelasId) errs.push("Kelas wajib dipilih");
  if (!(DAYS as readonly string[]).includes(row.hari)) errs.push("Hari tidak valid");
  if (!(Number.isInteger(row.pStart) && Number.isInteger(row.pEnd))) errs.push("Period harus bilangan bulat");
  if (row.pStart<1 || row.pEnd>10 || row.pStart>row.pEnd) errs.push("Rentang period 1..10 dan start <= end");
  if (!/^([A-Z0-9]{2,8})$/.test((row.mapelKode||"").toUpperCase())) errs.push("Kode mapel 2-8 huruf/angka (A-Z/0-9)");
  if (!row.mapelNama || row.mapelNama.trim().length<2) errs.push("Nama mapel wajib diisi");

  // Bentrok per (kelas + hari)
  const clash = existing.some(r =>
    r.id!==row.id && r.kelasId===row.kelasId && r.hari===row.hari &&
    overlaps(r.pStart, r.pEnd, row.pStart, row.pEnd)
  );
  if (clash) errs.push("Bentrok jadwal pada kelas & hari yang sama");

  // Cegah teacherId sama di jam yang sama di kelas berbeda (scope tenant + hari)
  const teacherClash = !!row.teacherId && existing.some(r =>
    r.id!==row.id && r.tenantId===row.tenantId && r.hari===row.hari &&
    !!r.teacherId && r.teacherId === row.teacherId &&
    overlaps(r.pStart, r.pEnd, row.pStart, row.pEnd)
  );
  if (teacherClash) errs.push("Guru (teacherId) bentrok di jam & hari yang sama (lintas kelas)");

  // NEW: Cegah subTeacherId sama di jam yang sama di kelas berbeda (scope tenant + hari)
  const subTeacherClash = !!row.subTeacherId && existing.some(r =>
    r.id!==row.id && r.tenantId===row.tenantId && r.hari===row.hari &&
    !!r.subTeacherId && r.subTeacherId === row.subTeacherId &&
    overlaps(r.pStart, r.pEnd, row.pStart, row.pEnd)
  );
  if (subTeacherClash) errs.push("Guru pengganti (subTeacherId) bentrok di jam & hari yang sama (lintas kelas)");

  return errs;
}

// NEW: Substitusi helpers
function isTeacherBusy(teacherId: string, day: Day, start: number, end: number, data: ScheduleRow[], tenantScope?: string){
  return data.some(r => (tenantScope ? r.tenantId===tenantScope : true)
    && r.hari===day
    && (r.teacherId===teacherId || r.subTeacherId===teacherId)
    && overlaps(r.pStart,r.pEnd,start,end));
}
function listCandidates(row: ScheduleRow, data: ScheduleRow[], allowCrossTenant=false){
  const pool = TEACHERS.filter(t => (allowCrossTenant || t.tenantId===row.tenantId) && t.id!==row.teacherId);
  const free = pool.filter(t => !isTeacherBusy(t.id, row.hari, row.pStart, row.pEnd, data, allowCrossTenant ? undefined : row.tenantId));
  const withFlag = free.map(t => ({ id:t.id, name:t.name, skilled: hasSkill(t.id,row.mapelKode) }));
  withFlag.sort((a,b)=> (Number(b.skilled)-Number(a.skilled)) || a.name.localeCompare(b.name));
  return withFlag;
}

// ---------- Dummy schedule yang valid (tanpa bentrok) ----------
const DUMMY_SCHEDULE: ScheduleRow[] = [
  { id: "d1", tenantId:"sman1", kelasId:"k-sman1-1", jenjang:"SMA", hari:"Senin",  pStart:1, pEnd:2, mapelKode:"MTK",  mapelNama:"Matematika",         teacherId:"t1", ruang:"R. 101" },
  { id: "d2", tenantId:"sman1", kelasId:"k-sman1-2", jenjang:"SMA", hari:"Selasa", pStart:1, pEnd:2, mapelKode:"GEO",  mapelNama:"Geografi",           teacherId:"t2", ruang:"R. 201" },
  { id: "d3", tenantId:"smkn2", kelasId:"k-smkn2-1", jenjang:"SMK", hari:"Senin",  pStart:3, pEnd:4, mapelKode:"DBMS", mapelNama:"Basis Data",         teacherId:"t6", ruang:"Lab RPL 2" },
  { id: "d4", tenantId:"mtsn3", kelasId:"k-mtsn3-1", jenjang:"SMP", hari:"Jumat",  pStart:1, pEnd:2, mapelKode:"BIN",  mapelNama:"Bahasa Indonesia",   teacherId:"t7", ruang:"R. 8B" },
];

// ---- Mini self-tests (tidak berat) ----
if (typeof window !== "undefined"){
  try {
    console.assert(overlaps(1,2,2,3) === true, "overlaps boundary should count");
    console.assert(overlaps(1,1,2,2) === false, "non-overlap should be false");
    const mp = timesToPeriodRange("06:30", 45, "06:30", "08:00");
    console.assert(mp.pStart===1 && mp.pEnd===2, "mapping 06:30-08:00 → P1–P2");
    // NEW: Test busy detection
    const rBusy: ScheduleRow = { id:'y', tenantId:'sman1', kelasId:'k-sman1-2', jenjang:'SMA', hari:'Senin', pStart:1, pEnd:2, mapelKode:'MTK', mapelNama:'Matematika', teacherId:'t2' };
    console.assert(isTeacherBusy('t2','Senin',1,2,[rBusy],'sman1')===true, 'isTeacherBusy works');
    // NEW: Test candidate ordering
    const row: ScheduleRow = { id:'x', tenantId:'sman1', kelasId:'k-sman1-1', jenjang:'SMA', hari:'Senin', pStart:1, pEnd:2, mapelKode:'BIN', mapelNama:'Bahasa Indonesia', teacherId:'t1' };
    const cands = listCandidates(row, [], false);
    console.assert(cands.length>0 && cands[0].skilled===true, 'prioritizes skilled first');
  } catch(e){ console.warn("Self-test warning:", e); }
}

export function ScheduleLandingContent() {
  const [scheduleData, setScheduleData] = useState<ScheduleRow[]>(DUMMY_SCHEDULE);
  const [kelasFilter, setKelasFilter] = useState<string>("ALL");
  const [dayFilter, setDayFilter] = useState<Day | "ALL">("ALL");

  // Config waktu period -> jam
  const [dayStart, setDayStart] = useState<string>("06:30");
  const [periodMinutes, setPeriodMinutes] = useState<number>(45);

  // NEW: Histori tindakan (log)
  type LogEntry = { id:string; ts:number; scheduleId:string; action:string; note:string; teacherId?:string; subTeacherId?:string; mapelKode:string; kelasId:string; hari:Day; pStart:number; pEnd:number };
  const [logs, setLogs] = useState<LogEntry[]>([]);
  function addLog(e: Omit<LogEntry, 'id'|'ts'>){ setLogs(prev => [{ id: uid('log'), ts: Date.now(), ...e }, ...prev].slice(0, 300)); }

  // NEW: Popup cari/ganti pengganti
  const [pickOpen, setPickOpen] = useState(false);
  const [pickTargetId, setPickTargetId] = useState<string | null>(null);
  const [pickQuery, setPickQuery] = useState("");
  const [allowCrossTenant, setAllowCrossTenant] = useState(false);

  const fmtRange = (s:number,e:number)=> periodRangeToTimeRange(dayStart, periodMinutes, s, e);
  const distinctKelasCount = useMemo(()=> new Set(scheduleData.map(s=>s.kelasId)).size, [scheduleData]);

  const filtered = useMemo(()=> {
    return scheduleData.filter(s => {
      const byKelas = kelasFilter==="ALL" ? true : s.kelasId===kelasFilter;
      const byDay   = dayFilter==="ALL" ? true : s.hari===dayFilter;
      return byKelas && byDay;
    });
  }, [scheduleData, kelasFilter, dayFilter]);

  // NEW: Popup pengganti
  const pickTarget = useMemo(()=> scheduleData.find(r=>r.id===pickTargetId) || null, [scheduleData, pickTargetId]);
  type Cand = { id:string; name:string; skilled:boolean };
  const candidates: Cand[] = useMemo(()=>{
    if (!pickTarget) return [];
    const base = listCandidates(pickTarget, scheduleData, allowCrossTenant);
    if (!pickQuery.trim()) return base;
    const q = pickQuery.trim().toLowerCase();
    return base.filter(c=> c.name.toLowerCase().includes(q));
  },[pickTarget, scheduleData, pickQuery, allowCrossTenant]);

  function openPick(row: ScheduleRow){ setPickTargetId(row.id); setPickOpen(true); setPickQuery(""); }
  function assignSub(tid: string){
    if (!pickTarget) return;
    const free = !isTeacherBusy(tid, pickTarget.hari, pickTarget.pStart, pickTarget.pEnd, scheduleData);
    if (!free){ alert("Guru tersebut baru saja terpakai pada slot ini."); return; }
    const target = scheduleData.find(r=>r.id===pickTarget.id);
    if (!target) return;
    target.subTeacherId = tid;
    setScheduleData(prev=> [...prev]);
    addLog({ scheduleId: target.id, action:'set-sub', note:'Set pengganti manual', teacherId: target.teacherId, subTeacherId: tid, mapelKode: target.mapelKode, kelasId: target.kelasId, hari: target.hari, pStart: target.pStart, pEnd: target.pEnd });
    setPickOpen(false);
  }
  function clearSub(){
    if (!pickTarget) return;
    const target = scheduleData.find(r=>r.id===pickTarget.id);
    if (!target) return;
    const old = target.subTeacherId;
    target.subTeacherId = undefined;
    setScheduleData(prev=>[...prev]);
    addLog({ scheduleId: target.id, action:'clear-sub', note:'Kosongkan pengganti', teacherId: target.teacherId, subTeacherId: old, mapelKode: target.mapelKode, kelasId: target.kelasId, hari: target.hari, pStart: target.pStart, pEnd: target.pEnd });
    setPickOpen(false);
  }

  // NEW: Auto-assign substitute
  function autoAssign(row: ScheduleRow){
    const tiers = [
      () => listCandidates(row, scheduleData, false).filter(c=>c.skilled),
      () => listCandidates(row, scheduleData, true ).filter(c=>c.skilled),
      () => listCandidates(row, scheduleData, false),
      () => listCandidates(row, scheduleData, true ),
    ];
    let pick: Cand | undefined;
    for (const fn of tiers){ const arr = fn(); if (arr.length){ pick = arr[0]; break; } }
    if (!pick){
      addLog({ scheduleId: row.id, action:'auto-sub-failed', note:'Tidak ada kandidat free', teacherId: row.teacherId, subTeacherId: undefined, mapelKode: row.mapelKode, kelasId: row.kelasId, hari: row.hari, pStart: row.pStart, pEnd: row.pEnd });
      alert("Tidak ada guru pengganti yang free pada slot ini.");
      return;
    }
    const target = scheduleData.find(r=>r.id===row.id);
    if (!target) return;
    target.subTeacherId = pick.id;
    setScheduleData(prev=>[...prev]);
    addLog({ scheduleId: row.id, action:'auto-sub', note:`Auto pilih ${pick.name}${hasSkill(pick.id,row.mapelKode)?' (kompeten)':''}`, teacherId: row.teacherId, subTeacherId: pick.id, mapelKode: row.mapelKode, kelasId: row.kelasId, hari: row.hari, pStart: row.pStart, pEnd: row.pEnd });
  }

  // Handlers stub export/import
  function handleTemplate(){ alert("Unduh template Excel — sambungkan ke endpoint template."); }
  function handleImport(){ alert("Unggah Excel — sambungkan ke endpoint import."); }

  // ---------- Modal Buat Jadwal ----------
  const [openCreate, setOpenCreate] = useState(false);
  const [cTenant, setCTenant] = useState("smkn2");
  const [cJenjang, setCJenjang] = useState<Jenjang>("SMK");
  const [cKelas, setCKelas] = useState<string>("");
  const [cHari, setCHari] = useState<Day>("Senin");
  const [cStartHH, setCStartHH] = useState<string>("07:00");
  const [cEndHH, setCEndHH] = useState<string>("08:30");
  const [cKode, setCKode] = useState<string>("");
  const [cNama, setCNama] = useState<string>("");
  const [cTeacherId, setCTeacherId] = useState<string>("");
  const [cRuang, setCRuang] = useState<string>("");

  const kelasOptsCreate = useMemo(() =>
    KELAS.filter(k=>k.tenantId===cTenant && k.jenjang===cJenjang),
    [cTenant, cJenjang]
  );

  function timesToPeriodOrDefault(start:string,end:string){
    const { pStart, pEnd } = timesToPeriodRange(dayStart, periodMinutes, start, end);
    return { pStart, pEnd };
  }

  function saveCreate(){
    const { pStart, pEnd } = timesToPeriodOrDefault(cStartHH, cEndHH);
    const draft: ScheduleRow = {
      id: uid("sch"),
      tenantId: cTenant,
      kelasId: cKelas || (kelasOptsCreate[0]?.id || ""),
      jenjang: cJenjang,
      hari: cHari,
      pStart, pEnd,
      mapelKode: (cKode||"").toUpperCase(),
      mapelNama: cNama,
      teacherId: cTeacherId || undefined,
      ruang: cRuang || undefined,
    };
    const errs = validateRow(draft, scheduleData);
    if (errs.length){ alert(`Perbaiki berikut:\n- ${errs.join("\n- ")}`); return; }
    setScheduleData(prev => [draft, ...prev]);
    setOpenCreate(false);
  }

  // ---------- Modal Massal ----------
  const [openBulk, setOpenBulk] = useState(false);
  const [bTenant, setBTenant] = useState("smkn2");
  const [bJenjang, setBJenjang] = useState<Jenjang>("SMK");
  const [bSelectedKelas, setBSelectedKelas] = useState<string[]>([]);
  const [bSelectedDays, setBSelectedDays] = useState<Day[]>(["Senin","Rabu"]);
  const [bStartHH, setBStartHH] = useState<string>("07:00");
  const [bEndHH, setBEndHH] = useState<string>("09:15");
  const [bTeacherId, setBTeacherId] = useState<string>("");
  const [bRuang, setBRuang] = useState<string>("");
  const [bSubjects, setBSubjects] = useState<string[]>(["MTK","BIN"]);
  type SubjCfg = { start:string; end:string; days: Day[]; kelasIds: string[] };
  const [bSubjectConfigs, setBSubjectConfigs] = useState<Record<string, SubjCfg>>({});

  const kelasOptsBulk = useMemo(() =>
    KELAS.filter(k=>k.tenantId===bTenant && k.jenjang===bJenjang),
    [bTenant, bJenjang]
  );

  function toggleSubject(kode:string, on:boolean){
    setBSubjects(prev => on ? Array.from(new Set([...prev, kode])) : prev.filter(x=>x!==kode));
    setBSubjectConfigs(prev => {
      const next = { ...prev } as Record<string, SubjCfg>;
      if (on && !next[kode]) {
        next[kode] = { start: bStartHH, end: bEndHH, days: [...bSelectedDays], kelasIds: [...(bSelectedKelas.length? bSelectedKelas : kelasOptsBulk.map(k=>k.id))] };
      }
      if (!on && next[kode]) delete next[kode];
      return next;
    });
  }

  function updateCfg(kode:string, patch: Partial<SubjCfg>){
    setBSubjectConfigs(prev => ({ ...prev, [kode]: { ...(prev[kode]||{ start:bStartHH, end:bEndHH, days:[...bSelectedDays], kelasIds:[...(bSelectedKelas.length? bSelectedKelas : kelasOptsBulk.map(k=>k.id))] }), ...patch } }));
  }

  function copyGlobalToCfg(kode:string){
    updateCfg(kode, { start:bStartHH, end:bEndHH, days:[...bSelectedDays], kelasIds:[...(bSelectedKelas.length? bSelectedKelas : kelasOptsBulk.map(k=>k.id))] });
  }

  function saveBulk(){
    const targetsGlobal = bSelectedKelas.length ? bSelectedKelas : kelasOptsBulk.map(k=>k.id);
    const daysGlobal = bSelectedDays.length ? bSelectedDays : [...DAYS];

    const toAdd: ScheduleRow[] = [];
    let skipped = 0;

    for (const kode of bSubjects){
      const subjDef = SUBJECT_OPTIONS.find(s=>s.kode===kode);
      const cfg = bSubjectConfigs[kode];
      const kelasIds = cfg?.kelasIds && cfg.kelasIds.length ? cfg.kelasIds : targetsGlobal;
      const days = cfg?.days && cfg.days.length ? cfg.days : daysGlobal;
      const start = cfg?.start || bStartHH;
      const end   = cfg?.end || bEndHH;
      const { pStart, pEnd } = timesToPeriodRange(dayStart, periodMinutes, start, end);

      for (const kid of kelasIds){
        for (const d of days){
          const draft: ScheduleRow = {
            id: uid("sch"), tenantId: bTenant, kelasId: kid, jenjang: bJenjang,
            hari: d, pStart, pEnd,
            mapelKode: kode, mapelNama: subjDef?.nama || kode,
            teacherId: bTeacherId || undefined, ruang: bRuang || undefined,
          };
          const errs = validateRow(draft, [...scheduleData, ...toAdd]);
          if (errs.length){ skipped++; continue; }
          toAdd.push(draft);
        }
      }
    }

    if (toAdd.length===0){ alert("Tidak ada jadwal tersimpan (semua bentrok atau data kurang)."); return; }
    setScheduleData(prev => [...toAdd, ...prev]);
    setOpenBulk(false);
    if (skipped>0) alert(`Beberapa entri di-skip karena bentrok: ${skipped}`);
  }

  // ---------- Demo: 1 teacher (Pak Multi) 4 mapel berbeda (kelas/hari/jam berbeda) ----------
  function demoOneTeacherFour(){
    const teacher = "t12"; // Pak Multi
    const plans: ScheduleRow[] = [
      { id: uid("sch"), tenantId:"sman1", kelasId:"k-sman1-1", jenjang:"SMA", hari:"Senin",  pStart:1, pEnd:2, mapelKode:"MTK",  mapelNama:"Matematika", teacherId:teacher, ruang:"R. 101" },
      { id: uid("sch"), tenantId:"sman1", kelasId:"k-sman1-2", jenjang:"SMA", hari:"Selasa", pStart:1, pEnd:2, mapelKode:"GEO",  mapelNama:"Geografi",   teacherId:teacher, ruang:"R. 201" },
      { id: uid("sch"), tenantId:"smkn2", kelasId:"k-smkn2-1", jenjang:"SMK", hari:"Senin",  pStart:3, pEnd:4, mapelKode:"DBMS", mapelNama:"Basis Data",  teacherId:teacher, ruang:"Lab RPL 2" },
      { id: "d4", tenantId:"mtsn3", kelasId:"k-mtsn3-1", jenjang:"SMP", hari:"Jumat",  pStart:1, pEnd:2, mapelKode:"BIN",  mapelNama:"Bahasa Indo", teacherId:teacher, ruang:"R. 8B" },
    ];

    const accepted: ScheduleRow[] = [];
    let skipped = 0;
    for (const p of plans){
      const errs = validateRow(p, [...scheduleData, ...accepted]);
      if (errs.length){ skipped++; continue; }
      accepted.push(p);
    }
    if (accepted.length){ setScheduleData(prev => [...accepted, ...prev]); }
    if (skipped){ alert(`Ada ${skipped} entri demo yang di-skip karena bentrok.`); }
  }

  return (
    <div className="w-full min-h-screen dark:to-gray-900 text-gray-800 dark:text-white">
      <style>
        {`
          select option {
            background: #F9FAFB !important;
            color: #1F2937;
          }
          select option:checked,
          select option:hover {
            background: #14B8A6 !important;
            color: #FFFFFF;
          }
          @media (prefers-color-scheme: dark) {
            select option {
              background: #1F2A44 !important;
              color: #FFFFFF;
            }
            select option:checked,
            select option:hover {
              background: #14B8A6 !important;
              color: #FFFFFF;
            }
          }
        `}
      </style>

      {/* Toolbar */}
      <div className="bg-theme-color-primary/5 dark:bg-theme-color-primary/5 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4 flex flex-wrap items-center gap-2">
        {/* <div className="text-2xl font-semibold text-gray-800 dark:text-white">Jadwal mata pelajaran</div> */}

        <button className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-white/30 bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                onClick={()=>setOpenCreate(true)}>Buat Jadwal <span className="ml-1">＋</span></button>

        <button className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-white/30 bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                onClick={()=>setOpenBulk(true)}>Buat Jadwal Massal <span className="ml-1">＋</span></button>

        <span className="mx-2 text-gray-600 dark:text-gray-400 text-sm">atau</span>

        <button className="px-3 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white"
                onClick={handleTemplate}>Unduh Template Excel <Download size={16} className="relative top-[-1.2px]" /></button>

        <button className="px-3 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-white/30 bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                onClick={handleImport}>Unggah Excel <Upload size={16} className="relative top-[-1.2px]" /></button>

        <button className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-white/30 bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                onClick={()=>setScheduleData(DUMMY_SCHEDULE)}>Reset Dummy</button>

        <button className="px-3 py-2 rounded-lg text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white"
                onClick={demoOneTeacherFour}>Demo: 1 guru 4 mapel</button>

        {/* Filters */}
        <div className="ml-auto flex items-center gap-2">
          <select className="bg-white/10 border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-white"
                  value={kelasFilter} onChange={e=>setKelasFilter(e.target.value)}>
            <option value="ALL">Semua Kelas</option>
            {KELAS.map(k => <option key={k.id} value={k.id}>{k.namaKelas}</option>)}
          </select>
          <select className="bg-white/10 border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-white"
                  value={dayFilter} onChange={e=>setDayFilter(e.target.value as any)}>
            <option value="ALL">Semua Hari</option>
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="px-3 py-2 rounded-lg bg-theme-color-primary/5 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white">
            Total Kelas: {distinctKelasCount}
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 min-h-[480px]">
        {filtered.length===0 ? (
          <div className="h-[420px] grid place-items-center text-gray-600 dark:text-gray-400">Belum ada jadwal tersedia</div>
        ) : (
          <div className="space-y-6">
            {(kelasFilter==="ALL" ? Array.from(new Set(filtered.map(s=>s.kelasId))) : [kelasFilter]).map(kid => {
              const items = filtered.filter(s=>s.kelasId===kid).sort((a,b)=> a.hari.localeCompare(b.hari) || a.pStart-b.pStart);
              return (
                <div key={kid} className="rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-theme-color-primary/5 flex items-center justify-between">
                    <div className="font-semibold text-gray-800 dark:text-white">{kelasName(kid)}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{TENANT_NAME[KELAS.find(k=>k.id===kid)?.tenantId || ""]} • {KELAS.find(k=>k.id===kid)?.jenjang}</div>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {items.map(item => (
                      <div key={item.id} className="px-4 py-2 flex items-center gap-3 bg-transparent hover:bg-theme-color-primary/10 dark:hover:bg-theme-color-primary/10">
                        <div className="w-28 text-sm text-gray-600 dark:text-gray-400">{item.hari}</div>
                        <div className="w-32 text-xs text-gray-600 dark:text-gray-400">{fmtRange(item.pStart, item.pEnd)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate text-gray-800 dark:text-white">{item.mapelNama} <span className="text-gray-600 dark:text-gray-400">({item.mapelKode})</span></div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {item.subTeacherId ? (
                              <>Pengganti: {teacherName(item.subTeacherId)} <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700">Pengganti</span></>
                            ) : (
                              <>{teacherName(item.teacherId)} • {item.ruang || "Ruang ?"}</>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-xs px-2 py-1 rounded-lg border border-teal-600 text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900" onClick={()=>autoAssign(item)}>Absen & Auto-cari</button>
                          <button className="text-xs px-2 py-1 rounded-lg border border-amber-600 text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900" onClick={()=>openPick(item)}>
                            {item.subTeacherId ? "Ganti Pengganti" : "Cari Pengganti"}
                          </button>
                          <button
                            className="text-xs px-2 py-1 rounded-lg border border-red-600 text-red-300 hover:bg-red-50 dark:hover:bg-red-900"
                            onClick={()=> setScheduleData(prev => prev.filter(s=>s.id!==item.id))}
                          >Hapus</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History Panel */}
      <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-theme-color-primary/5">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-theme-color-primary/20 flex items-center justify-between">
          <div className="font-semibold text-gray-800 dark:text-white">Histori Tindakan</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{logs.length} entry</div>
        </div>
        {logs.length===0 ? (
          <div className="p-4 text-sm text-gray-600 dark:text-gray-400">Belum ada histori.</div>
        ) : (
          <div className="max-h-56 overflow-auto divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map(l => (
              <div key={l.id} className="px-4 py-2 text-xs flex gap-3">
                <div className="w-40 text-gray-600 dark:text-gray-400">{new Date(l.ts).toLocaleString()}</div>
                <div className="min-w-24 font-semibold text-gray-800 dark:text-white">{l.action}</div>
                <div className="flex-1">
                  <div className="text-gray-800 dark:text-white">{kelasName(l.kelasId)} • {l.hari} • P{l.pStart}–P{l.pEnd} • {l.mapelKode}</div>
                  <div className="text-gray-600 dark:text-gray-400">Guru: {teacherName(l.teacherId)}{l.subTeacherId? ` → Pengganti: ${teacherName(l.subTeacherId)}`: ''} • {l.note}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Buat Jadwal */}
      {openCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={()=>setOpenCreate(false)}>
          <div className="w-full max-w-3xl rounded-2xl bg-theme-color-primary/5 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white p-6 shadow-xl" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">Buat Jadwal</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Pilih jenjang, kelas, dan jam bebas (HH:MM). Ruang opsional.</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-white/30 bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white" onClick={()=>setOpenCreate(false)}>Tutup</button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
              <div className="md:col-span-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">Sekolah</div>
                <select className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={cTenant} onChange={e=>setCTenant(e.target.value)}>
                  {TENANTS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 space-y-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">Jenjang</div>
                <select className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={cJenjang} onChange={e=>{ const j=e.target.value as Jenjang; setCJenjang(j); setCKelas(""); }}>
                  {Object.keys(LEVELS_MAP).map(j=> <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div className="md:col-span-4 space-y-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">Kelas</div>
                <select className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={cKelas} onChange={e=>setCKelas(e.target.value)}>
                  <option value="">— pilih kelas —</option>
                  {kelasOptsCreate.map(k=> <option key={k.id} value={k.id}>{k.namaKelas}</option>)}
                </select>
              </div>
              <div className="md:col-span-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">Hari</div>
                <select className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={cHari} onChange={e=>setCHari(e.target.value as Day)}>
                  {DAYS.map(d=> <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="md:col-span-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">Kode Mapel</div>
                <select className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={cKode} onChange={e=>{ const kode=e.target.value; setCKode(kode); const s=SUBJECT_OPTIONS.find(x=>x.kode===kode); if(s) setCNama(s.nama); }}>
                  <option value="">— pilih kode —</option>
                  {SUBJECT_OPTIONS.map(s=> <option key={s.kode} value={s.kode}>{s.kode} — {s.nama}</option>)}
                </select>
              </div>
              <div className="md:col-span-5">
                <div className="text-xs text-gray-600 dark:text-gray-400">Nama Mapel</div>
                <input className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={cNama} onChange={e=>setCNama(e.target.value)} placeholder="Matematika / Pemrograman" />
              </div>
              <div className="md:col-span-4 space-y-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">Guru (opsional) — simpan sebagai teacherId</div>
                <select className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={cTeacherId} onChange={e=>setCTeacherId(e.target.value)}>
                  <option value="">— pilih guru —</option>
                  {TEACHERS.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="md:col-span-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">Jam Mulai (HH:MM)</div>
                <input type="time" className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={cStartHH} onChange={e=>setCStartHH(e.target.value)} />
              </div>
              <div className="md:col-span-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">Jam Selesai (HH:MM)</div>
                <input type="time" className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={cEndHH} onChange={e=>setCEndHH(e.target.value)} />
              </div>
              <div className="md:col-span-6">
                <div className="text-xs text-gray-600 dark:text-gray-400">Ruang (opsional)</div>
                <input className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={cRuang} onChange={e=>setCRuang(e.target.value)} placeholder="Lab RPL 1 / Ruang 8B" />
              </div>

              <div className="md:col-span-12 flex justify-between items-center gap-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">Jam mulai harian: 
                  <input className="ml-2 w-24 border border-gray-300 dark:border-white/30 rounded-lg px-2 py-1 bg-white/10 text-gray-800 dark:text-white" value={dayStart} onChange={e=>setDayStart(e.target.value)} placeholder="06:30" />
                  <span className="ml-3">Durasi/period (menit): </span>
                  <input className="ml-2 w-20 border border-gray-300 dark:border-white/30 rounded-lg px-2 py-1 bg-white/10 text-gray-800 dark:text-white" type="number" min={30} max={120} value={periodMinutes} onChange={e=>setPeriodMinutes(Number(e.target.value)||45)} />
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/30 bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white" onClick={()=>setOpenCreate(false)}>Batal</button>
                  <button className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold" onClick={saveCreate}>Simpan</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Buat Jadwal Massal */}
      {openBulk && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={()=>setOpenBulk(false)}>
          <div className="w-full max-w-3xl rounded-2xl bg-teal-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white p-6 shadow-xl" onClick={(e)=>e.stopPropagation()}>
            <div className="flex pb-4 justify-between border-b border-white/30 items-baseline">
              <div className="text-lg font-semibold text-gray-800 dark:text-white">Buat Jadwal Massal</div>
              {/* <div> */}
                {/* <div className="text-xs text-gray-600 dark:text-gray-300">Checklist mapel → otomatis muncul form jam & pilihan kelas khusus mapel tersebut. Kosongkan untuk pakai pengaturan global.</div> */}
              {/* </div> */}
              <button className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-white/30 bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white" onClick={()=>setOpenBulk(false)}>Tutup</button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
              <div className="md:col-span-3 space-y-3">
                <div className="text-xs text-gray-600 dark:text-white">Sekolah</div>
                <select className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={bTenant} onChange={e=>setBTenant(e.target.value)}>
                  {TENANTS.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 space-y-3">
                <div className="text-xs text-gray-600 dark:text-white">Jenjang</div>
                <select className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={bJenjang} onChange={e=>{ setBJenjang(e.target.value as Jenjang); setBSelectedKelas([]); }}>
                  {Object.keys(LEVELS_MAP).map(j=> <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div className="md:col-span-7 space-y-3">
                <div className="text-xs text-gray-600 dark:text-white">Kelas (global, boleh banyak)</div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-400 p-1 px-2 items-center flex max-h-40 overflow-auto">
                  {kelasOptsBulk.map(k=> (
                    <label key={k.id} className="inline-flex items-center gap-2 mr-3 mb-2">
                      <input type="checkbox" checked={bSelectedKelas.includes(k.id)} onChange={e=>{
                        const on = e.currentTarget.checked;
                        setBSelectedKelas(prev => on ? Array.from(new Set([...prev,k.id])) : prev.filter(x=>x!==k.id));
                      }} />
                      <span className="text-gray-800 dark:text-white">{k.namaKelas}</span>
                    </label>
                  ))}
                  {kelasOptsBulk.length===0 && <div className="text-xs text-gray-600 dark:text-gray-400 p-2">Tidak ada kelas.</div>}
                </div>
              </div>

              <div className="md:col-span-12 space-y-3">
                <div className="text-xs text-gray-600 dark:text-white">Hari (global, boleh banyak)</div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-400 p-2 flex flex-wrap gap-3">
                  {DAYS.map(d=> (
                    <label key={d} className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={bSelectedDays.includes(d)} onChange={e=>{
                        const on = e.currentTarget.checked;
                        setBSelectedDays(prev => on ? Array.from(new Set([...prev,d])) : prev.filter(x=>x!==d));
                      }} />
                      <span className="text-gray-800 dark:text-white">{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-12 space-y-3">
                <div className="text-xs text-gray-600 dark:text-white">Mapel (ceklist → muncul jam & kelas khusus)</div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-400 p-3 max-h-[340px] overflow-auto">
                  {SUBJECT_OPTIONS.map(s => {
                    const checked = bSubjects.includes(s.kode);
                    const cfg = bSubjectConfigs[s.kode];
                    const days = cfg?.days || bSelectedDays;
                    const kelasIds = cfg?.kelasIds || bSelectedKelas;
                    return (
                      <div key={s.kode} className="border-b last:border-b-0 border-gray-200 dark:border-gray-400 py-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={checked} onChange={e=>toggleSubject(s.kode, e.currentTarget.checked)} />
                          <span className="font-medium text-gray-800 dark:text-white">{s.kode} — {s.nama}</span>
                        </label>
                        {checked && (
                          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-12">
                            <div className="md:col-span-3 space-y-3">
                              <div className="text-[11px] text-gray-600 dark:text-white">Jam Mulai</div>
                              <input type="time" className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-2 py-1 bg-white/10 text-gray-800 dark:text-white" value={cfg?.start || bStartHH} onChange={e=>updateCfg(s.kode,{ start:e.target.value })} />
                            </div>
                            <div className="md:col-span-3 space-y-3">
                              <div className="text-[11px] text-gray-600 dark:text-white">Jam Selesai</div>
                              <input type="time" className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-2 py-1 bg-white/10 text-gray-800 dark:text-white" value={cfg?.end || bEndHH} onChange={e=>updateCfg(s.kode,{ end:e.target.value })} />
                            </div>
                            <div className="md:col-span-6 space-y-3">
                              <div className="text-[11px] text-gray-600 dark:text-white">Kelas untuk {s.kode}</div>
                              <div className="rounded-lg border border-gray-200 dark:border-gray-400 px-2 py-1.5 max-h-24 overflow-auto flex flex-wrap gap-3">
                                {kelasOptsBulk.map(k=>{
                                  const on = (cfg?.kelasIds || bSelectedKelas).includes(k.id);
                                  return (
                                    <label key={k.id} className="inline-flex items-center gap-2">
                                      <input type="checkbox" checked={on} onChange={e=>{
                                        const sel = new Set(cfg?.kelasIds || (bSelectedKelas.length? bSelectedKelas : []));
                                        if (e.currentTarget.checked) sel.add(k.id); else sel.delete(k.id);
                                        updateCfg(s.kode, { kelasIds: Array.from(sel) });
                                      }} />
                                      <span className="text-gray-800 dark:text-white">{k.namaKelas}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="md:col-span-12 space-y-3">
                              <div className="text-[11px] text-gray-600 dark:text-white">Hari untuk {s.kode}</div>
                              <div className="rounded-lg border border-gray-200 dark:border-gray-400 p-2 flex flex-wrap gap-3">
                                {DAYS.map(d=>{
                                  const on = (days||[]).includes(d);
                                  return (
                                    <label key={d} className="inline-flex items-center gap-2">
                                      <input type="checkbox" checked={on} onChange={e=>{
                                        const set = new Set(days||[]);
                                        if (e.currentTarget.checked) set.add(d); else set.delete(d);
                                        updateCfg(s.kode, { days: Array.from(set) as Day[] });
                                      }} />
                                      <span className="text-gray-800 dark:text-white">{d}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="md:col-span-12 flex justify-end">
                              <button className="text-xs px-2 py-1 rounded-lg border border-gray-300 dark:border-white/30 bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white" onClick={()=>copyGlobalToCfg(s.kode)}>Salin dari Global</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-3 space-y-3">
                <div className="text-xs text-gray-600 dark:text-white">Jam Mulai (global)</div>
                <input type="time" className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={bStartHH} onChange={e=>setBStartHH(e.target.value)} />
              </div>
              <div className="md:col-span-3 space-y-3">
                <div className="text-xs text-gray-600 dark:text-white">Jam Selesai (global)</div>
                <input type="time" className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={bEndHH} onChange={e=>setBEndHH(e.target.value)} />
              </div>
              <div className="md:col-span-3 space-y-3">
                <div className="text-xs text-gray-600 dark:text-white">Guru (opsional)</div>
                <select className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={bTeacherId} onChange={e=>setBTeacherId(e.target.value)}>
                  <option value="">— pilih guru —</option>
                  {TEACHERS.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-3 space-y-3">
                <div className="text-xs text-gray-600 dark:text-white">Ruang (opsional)</div>
                <input className="w-full border border-gray-300 dark:border-white/30 rounded-lg px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={bRuang} onChange={e=>setBRuang(e.target.value)} />
              </div>

              <div className="md:col-span-12 flex justify-between items-center gap-2">
                <div className="text-xs text-gray-600 dark:text-white">Jam mulai harian: 
                  <input className="ml-2 w-24 border border-gray-300 dark:border-white/30 rounded-lg px-2 py-1 bg-white/10 text-gray-800 dark:text-white" value={dayStart} onChange={e=>setDayStart(e.target.value)} placeholder="06:30" />
                  <span className="ml-3">Durasi/period (menit): </span>
                  <input className="ml-2 w-20 border border-gray-300 dark:border-white/30 rounded-lg px-2 py-1 bg-white/10 text-gray-800 dark:text-white" type="number" min={30} max={120} value={periodMinutes} onChange={e=>setPeriodMinutes(Number(e.target.value)||45)} />
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/30 bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white" onClick={()=>setOpenBulk(false)}>Batal</button>
                  <button className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold" onClick={saveBulk}>Simpan Massal</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cari/Ganti Pengganti */}
      {pickOpen && pickTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={()=>setPickOpen(false)}>
          <div className="w-full max-w-xl rounded-2xl bg-theme-color-primary/5 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white p-6 shadow-xl" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">Cari/Ganti Pengganti</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{kelasName(pickTarget.kelasId)} • {pickTarget.hari} • P{pickTarget.pStart}–P{pickTarget.pEnd} • {pickTarget.mapelKode}</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-white/30 bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white" onClick={()=>setPickOpen(false)}>Tutup</button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <input className="border border-gray-300 dark:border-white/30 rounded-lg px-2 py-1 bg-white/10 text-gray-800 dark:text-white flex-1" placeholder="Cari nama guru" value={pickQuery} onChange={e=>setPickQuery(e.target.value)} />
              <label className="inline-flex items-center gap-2 text-xs text-gray-800 dark:text-white">
                <input type="checkbox" checked={allowCrossTenant} onChange={e=>setAllowCrossTenant(e.currentTarget.checked)} />
                <span>Izinkan lintas tenant</span>
              </label>
              <button className="ml-auto text-xs px-2 py-1 rounded-lg border border-gray-300 dark:border-white/30 bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white" onClick={clearSub}>Kosongkan Pengganti</button>
            </div>

            <div className="mt-3 max-h-64 overflow-auto divide-y divide-gray-200 dark:divide-gray-700">
              {candidates.length===0 ? (
                <div className="text-sm text-gray-600 dark:text-gray-400 p-2">Tidak ada kandidat tersedia.</div>
              ) : candidates.map(c => (
                <div key={c.id} className="py-2 flex items-center justify-between">
                  <div className="text-sm text-gray-800 dark:text-white">{c.name} {c.skilled && (<span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 border border-teal-300 dark:border-teal-700">Kompeten</span>)}</div>
                  <button className="text-xs px-2 py-1 rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900" onClick={()=>assignSub(c.id)}>Pilih</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}