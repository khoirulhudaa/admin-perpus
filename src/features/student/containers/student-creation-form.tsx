/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { dayjs, lang } from "@/core/libs";
import { useAlert, useParamDecode } from "@/features/_global/hooks";
import { useClassroom } from "@/features/classroom";
import {
  GENDER_OPTIONS,
  STATUS_OPTIONS,
  useUserCreation,
  useUserDetail,
} from "@/features/user";
import { useBiodata } from "@/features/user/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useStudentDetail } from "../hooks";
import { studentEditSchema } from "../utils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export const StudentCreationForm = () => {
  const { decodeParams } = useParamDecode();
  const navigate = useNavigate();
  const studentId = decodeParams?.id ? Number(decodeParams.id) : null;

  if (!studentId) {
    navigate("/students");
    return null;
  }

  const resource = useClassroom();
  const detailKelas = useStudentDetail({ id: Number(decodeParams?.id) });
  const detail = useUserDetail(Number(decodeParams?.biodataId));
  const creation = useUserCreation();
  const alert = useAlert();
  const biodata = useBiodata();
  
  console.log('detail:', detail)
  console.log('detailKelas:', detailKelas)

  const form = useForm<z.infer<typeof studentEditSchema>>({
    resolver: zodResolver(studentEditSchema),
    mode: "all",
    defaultValues: {
      kelasId: "",
      name: "",
      email: "",
      alamat: "",
      hobi: "",
      jenisKelamin: "",
      tanggalLahir: "",
      rfid: "",
      nisn: "",
      nrk: "",
      nikki: "",
      nis: "",
      nip: "",
      nik: "",
      noTlp: "",
      isVerified: false,
      isActive: 0,
      sekolahId: 0,
    },
  });

  useEffect(() => {
    if (detail.data && detailKelas.data && resource.data) {
      console.log("Detail Data Siswa:", detail.data);
      console.log("Detail Kelas:", detailKelas.data);
      console.log("Resource Kelas:", resource.data);

      const validKelasId = detailKelas.data?.idKelas && resource.data.some(kelas => kelas.id === detailKelas.data.idKelas)
        ? String(detailKelas.data.idKelas)
        : resource.data.length > 0 ? String(resource.data[0].id) : "";

      // Gunakan detailKelas.data?.user?.name untuk field name
      const nameValue = detailKelas.data?.user?.name || detail.data?.name || "";
      
      console.log("Mengatur nilai form, name:", nameValue);

      form.reset({
        kelasId: validKelasId,
        name: nameValue,
        email: detail.data?.email || "",
        alamat: detail.data?.alamat || "",
        hobi: detail.data?.hobi || "",
        jenisKelamin: detail.data?.jenisKelamin || "",
        tanggalLahir: detail.data?.tanggalLahir || "",
        rfid: detail.data?.rfid || "",
        nisn: detail.data?.nisn || "",
        nrk: detail.data?.nrk || "",
        nikki: detail.data?.nikki || "",
        nis: detail.data?.nis || "",
        nip: detail.data?.nip || "",
        nik: detail.data?.nik || "",
        noTlp: detail.data?.noTlp || "",
        isVerified: detail.data?.isVerified || false,
        isActive: detail.data?.isActive || 0,
        sekolahId: detail.data?.sekolahId || 0,
      });

      // Verifikasi nilai form setelah reset
      console.log("Nilai form setelah reset:", form.getValues());
    }
  }, [detail.data, detailKelas.data, resource.data, form]);

  async function onSubmit(data: z.infer<typeof studentEditSchema>) {
    try {
      console.log("kelas ID TERPILIH:", data.kelasId);
      console.log("User ID yang akan diupdate:", decodeParams.id);
      console.log("Data yang dikirim sebelum mapping:", data);

      if (!data.kelasId || !resource.data?.some(kelas => String(kelas.id) === data.kelasId)) {
        alert.error("Kelas yang dipilih tidak valid");
        return;
      }

      const updatedData: any = {};
      if (data.image) updatedData.image = data.image;
      // Gunakan detailKelas.data?.user?.name untuk perbandingan
      if (data.name && data.name !== (detailKelas.data?.user?.name || detail.data?.name)) {
        updatedData.name = data.name;
      }
      if (data.email && data.email !== detail.data?.email) updatedData.email = data.email;
      if (data.tanggalLahir && data.tanggalLahir !== detail.data?.tanggalLahir) updatedData.tanggalLahir = data.tanggalLahir;
      if (data.rfid && data.rfid !== detail.data?.rfid) updatedData.rfid = data.rfid;
      if (data.nisn && data.nisn !== detail.data?.nisn) updatedData.nisn = data.nisn;
      if (data.nrk && data.nrk !== detail.data?.nrk) updatedData.nrk = data.nrk;
      if (data.nikki && data.nikki !== detail.data?.nikki) updatedData.nikki = data.nikki;
      if (data.nis && data.nis !== detail.data?.nis) updatedData.nis = data.nis;
      if (data.nip && data.nip !== detail.data?.nip) updatedData.nip = data.nip;
      if (data.nik && data.nik !== detail.data?.nik) updatedData.nik = data.nik;
      if (data.noTlp && data.noTlp !== detail.data?.noTlp) updatedData.noTlp = data.noTlp;
      if (data.alamat && data.alamat !== detail.data?.alamat) updatedData.alamat = data.alamat;
      if (data.isActive !== undefined && data.isActive !== detail.data?.isActive) updatedData.isActive = data.isActive;
      if (data.sekolahId !== undefined && data.sekolahId !== detail.data?.sekolahId) updatedData.sekolahId = data.sekolahId;
      if (data.jenisKelamin && data.jenisKelamin !== detail.data?.jenisKelamin) updatedData.jenisKelamin = data.jenisKelamin === "Male" ? "Male" : "Female";
      if (data.isVerified !== undefined && data.isVerified !== detail.data?.isVerified) updatedData.isVerified = data.isVerified ? 1 : 0;
      updatedData.kelasId = Number(data.kelasId);

      console.log("Data yang dikirim ke backend:", updatedData);
      console.log("ID yang diupdate:", Number(decodeParams.biodataId));

      await creation.update(Number(decodeParams.biodataId), updatedData);
      
      alert.success(lang.text("successUpdate", { context: lang.text("student") }));
      
      navigate("/students");

      try {
        await Promise.all([
          biodata.query.refetch(),
          detail.query.refetch(),
          detailKelas.query.refetch(),
        ]);
      } catch (err) {
        console.error("Error saat refetch:", err);
      }
    } catch (err: any) {
      console.error("Error saat update:", err);
      alert.error(
        err?.message || lang.text("failUpdate", { context: lang.text("student") })
      );
    }
  }

  if (detailKelas.isError || resource.isError) {
    alert.error("Gagal memuat data");
    navigate("/students");
    return null;
  }

  if (detailKelas.isLoading || resource.isLoading) {
    return <div>Memuat...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-lg gap-6">
          <FormField
            control={form.control}
            name="kelasId"
            render={({ field, fieldState }) => (
              <FormItem className="mb-2">
                <FormLabel>{lang.text("classRoom")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={resource.data?.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={lang.text("selectClassRoom")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {resource.data && resource.data.length > 0 ? (
                      resource.data.map((option) => (
                        <SelectItem key={option.id} value={String(option.id)}>
                          {option.namaKelas}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Tidak ada kelas tersedia
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage>
                  {resource.data?.length === 0 ? "Tidak ada kelas tersedia untuk dipilih" : fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{lang.text("studentName")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={lang.text("inputStudentName")}
                    {...field}
                    value={field.value || ""} // Pastikan nilai tidak undefined
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jenisKelamin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang.text("gender")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={lang.text("selectGender")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option, i) => (
                      <SelectItem key={i} value={option.label}>
                        {option.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{lang.text("email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={lang.text("inputEmail")}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nis"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>NIS</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    maxLength={5}
                    placeholder={lang.text("inputNIS")}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nisn"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>NISN</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    maxLength={10}
                    placeholder={lang.text("inputNISN")}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rfid"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>RFID</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={lang.text("inputRFID")}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="noTlp"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{lang.text("noHP")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={lang.text("inputNoHP")}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alamat"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{lang.text("address")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={lang.text("address")}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tanggalLahir"
            render={({ field, fieldState }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{lang.text("dateOfBirth")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          dayjs(field.value).format("DD MMMM YYYY")
                        ) : (
                          <span>{lang.text("selectDate")}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) =>
                          field.onChange(
                            newValue ? newValue.format("YYYY-MM-DD") : ""
                          )
                        }
                        sx={{
                          backgroundColor: "#ffffff",
                          color: "#000000",
                          "& .MuiPickersDay-root": {
                            color: "#000000",
                            "&:hover": {
                              backgroundColor: "#e0e0e0",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "#1976d2",
                              color: "#ffffff",
                            },
                          },
                          "& .MuiPickersCalendarHeader-label": {
                            color: "#000000",
                          },
                          "& .MuiPickersArrowSwitcher-root": {
                            color: "#000000",
                          },
                          "& .MuiDayCalendar-weekDayLabel": {
                            color: "#000000",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </PopoverContent>
                </Popover>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>{lang.text("status")}</FormLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={lang.text("selectLevel")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option, i) => (
                      <SelectItem key={i} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="py-4">
          <Button type="submit">
            {creation.isLoading
              ? lang.text("saving")
              : lang.text("saveChanges")}
          </Button>
        </div>
      </form>
    </Form>
  );
};