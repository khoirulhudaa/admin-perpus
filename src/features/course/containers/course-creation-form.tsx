/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
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
  SelectValue
} from "@/core/libs";
import { useAlert } from "@/features/_global/hooks";
import { useClassroom } from "@/features/classroom";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCourse, useCourseCreation } from "../hooks";
import { courseCreateSchema } from "../utils";

// Interface for initial data
interface CourseInitialData {
  id?: number;
  namaMataPelajaran?: string;
  sekolahId?: number;
  kelasId?: number;
}

// Fungsi untuk menghasilkan template Excel dari file di public folder
// const generateCourseTemplateExcel = () => {
//   const templatePath = "/template_jadwal.xlsx"; // Path relatif dari public
//   fetch(templatePath)
//     .then((response) => response.arrayBuffer())
//     .then((arrayBuffer) => {
//       const wb = XLSX.read(arrayBuffer, { type: "buffer" });
//       XLSX.writeFile(wb, "Template_Upload_Mata_Pelajaran.xlsx");
//     })
//     .catch((error) => {
//       console.error("Error loading template file:", error);
//     });
// };

export const CourseCreationForm = ({
  onClose,
  initialData,
}: {
  onClose?: () => void;
  initialData?: CourseInitialData;
}) => {
  const school = useSchool();
  const classroom = useClassroom();
  const creation = useCourseCreation();
  const alert = useAlert();
  const profile = useProfile();
  const resource = useCourse();
  // const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  // const [uploadStatus, setUploadStatus] = useState("");

  const isEdit = Boolean(initialData?.id);

  const form = useForm<z.infer<typeof courseCreateSchema>>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      courseName: initialData?.namaMataPelajaran || "",
      school: initialData?.sekolahId || profile?.user?.sekolahId || 0,
      classroom: initialData?.kelasId || 0,
    },
  });

  async function onSubmit(data: z.infer<typeof courseCreateSchema>) {
    try {
      // Check for duplicate namaMataPelajaran in resource.data (only for create, not edit)
      if (!isEdit) {
        const isDuplicate = resource.data?.some(
          (course) =>
            course.namaMataPelajaran.toLowerCase() === data.courseName.toLowerCase()
        );

        if (isDuplicate) {
          alert.error(lang.text("errorDuplicateCourse", { context: data.courseName }));
          return;
        }
      }

      if(!data.classroom) {
        alert.error('Anda belum memilih kelas!')
        return;
      }

      if (isEdit) {
        await creation.update(Number(initialData?.id), {
          namaMataPelajaran: data.courseName,
          sekolahId: data.school,
          kelasId: Number(data.classroom), // Include kelasId in update
        });
      } else {
        await creation.create({
          namaMataPelajaran: data.courseName,
          sekolahId: data.school,
          kelasId: Number(data.classroom),
        });
      }

      alert.success(
        isEdit
          ? lang.text("successUpdate", { context: lang.text("course") })
          : lang.text("successCreate", { context: lang.text("course") })
      );

      resource.query.refetch();
      onClose?.();
    } catch (err: any) {
      alert.error(
        err?.message ||
          (isEdit
            ? lang.text("failUpdate", { context: lang.text("course") })
            : lang.text("failCreate", { context: lang.text("course") }))
      );
    }
  }

  // Handle Excel file upload
  // const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) {
  //     setUploadStatus(lang.text("errSystem"));
  //     return;
  //   }

  //   try {
  //     setUploadStatus(lang.text("loading"));
  //     const reader = new FileReader();
  //     reader.onload = async (e) => {
  //       const data = new Uint8Array(e.target.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //       // Transformasi data ke format API
  //       const formattedData = jsonData.map((row: any) => ({
  //         namaMataPelajaran: row["Mata Pelajaran"]?.trim() || "",
  //         namaKelas: row["Nama Kelas"]?.trim() || "",
  //       }));

  //       // Validasi data
  //       const validClasses = classroom.data?.map((cls) => cls.namaKelas.toLowerCase()) || [];
  //       const validData = formattedData.filter(
  //         (item) =>
  //           item.namaMataPelajaran &&
  //           item.namaKelas &&
  //           validClasses.includes(item.namaKelas.toLowerCase())
  //       );

  //       if (validData.length === 0) {
  //         setUploadStatus(lang.text("errSystem"));
  //         return;
  //       }

  //       // Cek kelas yang tidak valid
  //       const invalidClasses = formattedData
  //         .filter((item) => item.namaKelas && !validClasses.includes(item.namaKelas.toLowerCase()))
  //         .map((item) => item.namaKelas);
  //       if (invalidClasses.length > 0) {
  //         setUploadStatus(
  //           lang.text("errSystem", {
  //             context: invalidClasses.join(", "),
  //           })
  //         );
  //         return;
  //       }

  //       // Cek duplikasi mata pelajaran
  //       const duplicates = validData.filter((item) =>
  //         resource.data?.some(
  //           (course) =>
  //             course.namaMataPelajaran.toLowerCase() ===
  //             item.namaMataPelajaran.toLowerCase()
  //         )
  //       );

  //       if (duplicates.length > 0) {
  //         setUploadStatus(
  //           lang.text("errorDuplicateCourse", {
  //             context: duplicates.map((d) => d.namaMataPelajaran).join(", "),
  //           })
  //         );
  //         return;
  //       }

  //       // Kirim data ke API
  //       let successCount = 0;
  //       let errorCount = 0;

  //       for (const item of validData) {
  //         try {
  //           // Cari kelasId berdasarkan namaKelas
  //           const kelas = classroom.data?.find(
  //             (cls) => cls.namaKelas.toLowerCase() === item.namaKelas.toLowerCase()
  //           );
  //           const kelasId = kelas?.id;

  //           if (!kelasId) {
  //             throw new Error(`Kelas ID tidak ditemukan untuk ${item.namaKelas}`);
  //           }

  //           await creation.create({
  //             namaMataPelajaran: item.namaMataPelajaran,
  //             kelasId,
  //             sekolahId: profile?.user?.sekolahId || 0,
  //           });
  //           successCount++;
  //         } catch (error) {
  //           console.error(`Gagal mengirim: ${item.namaMataPelajaran}`, error);
  //           errorCount++;
  //         }
  //       }

  //       setUploadStatus(
  //         lang.text("success", {
  //           success: successCount,
  //           failed: errorCount,
  //         })
  //       );

  //       if (successCount > 0) {
  //         resource.query.refetch();
  //         alert.success(lang.text("successCreate", { context: lang.text("course") }));
  //       }

  //       if (errorCount === 0) {
  //         setIsExcelModalOpen(false);
  //       }
  //     };

  //     reader.readAsArrayBuffer(file);
  //   } catch (error) {
  //     console.error("Error saat memproses file:", error);
  //     setUploadStatus(lang.text("errSystem"));
  //   }
  // };

  return (
    <div>
      {/* {!isEdit && (
        <>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <Button variant={'outline'} onClick={generateCourseTemplateExcel}>
              {`${lang.text('downloadTemplateCourse')}`} <FaFileExcel className="text-green-500" />
            </Button>
            <Button onClick={() => setIsExcelModalOpen(true)}>{lang.text("uploadExcelCourse")}</Button>
          </div>
          <fieldset className="mt-9 border-t border-white/10 pt-6">
            <legend className="px-2 text-sm text-black bg-white mx-auto">
              atau
            </legend>
          </fieldset>
        </>
      )} */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4">
          <div className="max-w-lg gap-6">
            <div className="basis-1">
              <div className="flex flex-col gap-4 mb-4">
                <div className="basis-1">
                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field, fieldState }) => (
                      <FormItem className="mb-2 w-[450px]">
                        <FormLabel>{lang.text("school")}</FormLabel>
                        <Select
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={(x) => field.onChange(Number(x))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={lang.text("selectSchool")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {school.data.map((option, i) => (
                              <SelectItem key={i} value={String(option.id)}>
                                {option.namaSekolah}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="courseName"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text("course")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={lang.text("inputCourse")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-6">
                <div className="basis-1">
                  <FormField
                    control={form.control}
                    name="classroom"
                    render={({ field, fieldState }) => (
                      <FormItem className="mb-2 w-[450px]">
                        <FormLabel>{lang.text("classroom")}</FormLabel>
                        <Select
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={(x) => field.onChange(Number(x))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={lang.text('selectClassroom')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classroom.data.map((option, i) => (
                              <SelectItem key={i} value={String(option.id)}>
                                {option.namaKelas}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="py-4">
                <Button
                  // disabled={
                  //   !form.formState.isDirty ||
                  //   !form.formState.isValid ||
                  //   creation.isLoading
                  // }
                  type="submit"
                >
                  {creation.isLoading ? lang.text("saving") : lang.text("saveChanges")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
      {/* {!isEdit && (
        <Dialog open={isExcelModalOpen} onOpenChange={setIsExcelModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{lang.text("upload")}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} />
              {uploadStatus && <p>{uploadStatus}</p>}
            </div>
          </DialogContent>
        </Dialog>
      )} */}
    </div>
  );
};