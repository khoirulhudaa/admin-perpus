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
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/core/libs";

import { dayjs, lang } from "@/core/libs";
import { useAlert, useParamDecode } from "@/features/_global/hooks";
import { useSchool } from "@/features/schools";
import {
  GENDER_OPTIONS,
  STATUS_OPTIONS,
  useUserCreation,
  useUserDetail,
} from "@/features/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { teacherEditSchema } from "../utils";

// Impor komponen MUI
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export const TeacherCreationForm = () => {
  const { decodeParams } = useParamDecode();

  const school = useSchool();
  const detail = useUserDetail(Number(decodeParams?.id));
  const creation = useUserCreation();
  const navigate = useNavigate();
  const alert = useAlert();

  const form = useForm<z.infer<typeof teacherEditSchema>>({
    resolver: zodResolver(teacherEditSchema),
    mode: "all",
    values: {
      name: detail.data?.name || "",
      email: detail.data?.email || "", // Default value untuk "email"
      alamat: detail.data?.alamat || "",
      hobi: detail.data?.hobi || "",
      jenisKelamin: detail.data?.jenisKelamin || "",
      tanggalLahir: detail.data?.tanggalLahir || "",
      // role: detail.data?.role || "",
      rfid: detail.data?.rfid || "",
      nisn: detail.data?.nisn || "",
      nrk: detail.data?.nrk || "",
      nikki: detail.data?.nikki || "",
      // image: detail.data?.image || "",
      nis: detail.data?.nis || "",
      nip: detail.data?.nip || "",
      nik: detail.data?.nik || "",
      noTlp: detail.data?.noTlp || "",
      isVerified: detail.data?.isVerified || false,
      isActive: detail.data?.isActive || 0,
      sekolahId: detail.data?.sekolahId || 0,
    },
  });

  async function onSubmit(data: z.infer<typeof teacherEditSchema>) {
    try {
      await creation.update(Number(decodeParams.id), {
        ...(data.name ? { name: data.name } : {}),
        ...(data.email ? { email: data.email } : {}),
        ...(data.rfid ? { rfid: data.rfid } : {}),
        ...(data.nisn ? { nisn: data.nisn } : {}),
        ...(data.nrk ? { nrk: data.nrk } : {}),
        ...(data.nikki ? { nikki: data.nikki } : {}),
        ...(data.nis ? { nis: data.nis } : {}),
        ...(data.nip ? { nip: data.nip } : {}),
        ...(data.nik ? { nik: data.nik } : {}),
        ...(data.noTlp ? { noTlp: data.noTlp } : {}),
        ...(data.alamat ? {alamat: data.alamat}: {}),
        ...(data.tanggalLahir ? {tanggalLahir: data.tanggalLahir}: {}),
        ...(data.isActive !== undefined && data.isActive !== 0
          ? { isActive: data.isActive }
          : {}),
        ...(data.sekolahId !== undefined && data.sekolahId !== 0
          ? { sekolahId: data.sekolahId }
          : {}),
        ...(data.jenisKelamin ? { jenisKelamin: data.jenisKelamin } : {}),
      });

      alert.success(
        lang.text("successUpdate", { context: lang.text("teacher") }),
      );

      navigate(-1);
    } catch (err: any) {
      console.log('error', err.message)
      console.log('error', Number(decodeParams.id))
      alert.error(
        err?.message ||
          lang.text("failUpdate", { context: lang.text("teacher") }),
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-lg gap-6">
          <FormField
            control={form.control}
            name="sekolahId"
            render={({ field, fieldState }) => (
              <FormItem className="mb-2">
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
                    {school.data.map((option, i) => {
                      return (
                        <SelectItem key={i} value={String(option.id)}>
                          {option.namaSekolah}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{lang.text("teacherName")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={lang.text("inputTeacherName")}
                    {...field}
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
              <FormItem className="">
                <FormLabel>{lang.text("gender")}</FormLabel>
                <Select
                  // disabled
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={lang.text("selectGender")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option, i) => {
                      return (
                        <SelectItem key={i} value={option.label}>
                          {option.value}
                        </SelectItem>
                      );
                    })}
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
            name="nip"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>NIP</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={lang.text("inputNIP")}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nrk"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>NRK</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={lang.text("inputNRK")}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nikki"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>NIKKI</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={lang.text("inputNIKKI")}
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
                    placeholder={lang.text("currentAddress")}
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
                        // disabled
                        variant={"outline"}
                        className=" pl-3 text-left font-normal"
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
                            backgroundColor: "#ffffff", // Background putih
                            color: "#000000", // Teks hitam untuk kontras
                            "& .MuiPickersDay-root": {
                              color: "#000000", // Teks hari
                              "&:hover": {
                                backgroundColor: "#e0e0e0", // Hover effect
                              },
                              "&.Mui-selected": {
                                backgroundColor: "#1976d2", // Warna saat dipilih
                                color: "#ffffff", // Teks putih saat dipilih
                              },
                            },
                            "& .MuiPickersCalendarHeader-label": {
                              color: "#000000", // Teks bulan/tahun
                            },
                            "& .MuiPickersArrowSwitcher-root": {
                              color: "#000000", // Panah navigasi
                            },
                            "& .MuiDayCalendar-weekDayLabel": {
                              color: "#000000", // Label hari (Sen, Sel, dst)
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
              <FormItem className="mb-4 relative bottom-2.5">
                <FormLabel>{lang.text("status")}</FormLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={lang.text("selectLevel")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option, i) => {
                      return (
                        <SelectItem key={i} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="py-4">
          <Button
            disabled={
              !form.formState.isDirty ||
              // !form.formState.isValid ||
              creation.isLoading
            }
            type="submit"
          >
            {creation.isLoading
              ? lang.text("saving")
              : lang.text("saveChanges")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
