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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { useSchool } from "@/features/schools";
import {
  GENDER_OPTIONS,
  STATUS_OPTIONS,
  useUserCreation,
  useUserDetail,
} from "@/features/user";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parentEditSchema } from "../utils";

export const ParentCreationForm = () => {
  const { decodeParams } = useParamDecode();

  const detail = useUserDetail(Number(decodeParams?.id));
  const creation = useUserCreation();
  const alert = useAlert();
  // const school = useSchool();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof parentEditSchema>>({
    resolver: zodResolver(parentEditSchema),
    mode: "all",
    values: {
      name: detail.data?.name || "",
      email: detail.data?.email || "", // Default value untuk "email"
      alamat: detail.data?.alamat || "",
      jenisKelamin: detail.data?.jenisKelamin || "",
      tanggalLahir: detail.data?.tanggalLahir || "",
      noTlp: detail.data?.noTlp || "",
      isActive: detail.data?.isActive || 0,
      // nrk: detail.data?.nrk || "",
      // hobi: detail.data?.hobi || "",
      // role: detail.data?.role || "",
      // rfid: detail.data?.rfid || "",
      // nisn: detail.data?.nisn || "",
      // nikki: detail.data?.nikki || "",
      // image: detail.data?.image || "",
      // nis: detail.data?.nis || "",
      // nip: detail.data?.nip || "",
      // isVerified: detail.data?.isVerified || false,
      // sekolahId: detail.data?.sekolahId || 0,
    },
  });
  
  async function onSubmit(data: z.infer<typeof parentEditSchema>) {
    try {
      await creation.update(Number(decodeParams.id), {
        name: data.name || undefined,
        email: data.email || undefined,
        tanggalLahir: data.tanggalLahir || undefined,
        noTlp: data.noTlp || undefined,
        alamat: data?.alamat || "",
        jenisKelamin: data.jenisKelamin,
        isActive: data.isActive || 0,
        // nrk: data.nrk || undefined,
        // hobi: data.hobi || undefined,
        // rfid: data.rfid || undefined,
        // nisn: data.nisn || undefined,
        // nikki: data.nikki || undefined,
        // nis: data.nis || undefined,
        // nip: data.nip || undefined,
        // sekolahId: data.sekolahId || 0,
      });

      alert.success(
        lang.text("successUpdate", { context: lang.text("parent") }),
      );

      navigate(-1);
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text("failUpdate", { context: lang.text("parent") }),
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-lg gap-6">
          {/* <FormField
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
                <FormLabel>{lang.text("studentName")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={lang.text("inputStudentName")}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="jenisKelamin"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{lang.text("gender")}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
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
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{lang.text("parentName")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={lang.text("parentName")}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
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
            name="alamat"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
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
          {/* <FormField
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
          /> */}
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
            name="tanggalLahir"
            render={({ field, fieldState }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="my-1">{lang.text("dateOfBirth")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
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
                    <Calendar
                      mode="single"
                      selected={dayjs(field.value).toDate()}
                      onSelect={(d) =>
                        field.onChange(dayjs(d).format("YYYY-MM-DD"))
                      }
                      // disabled={forwardDateDisabled}
                      initialFocus
                    />
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
              !form.formState.isValid ||
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
