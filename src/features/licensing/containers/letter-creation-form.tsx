import {
  Button,
  dayjs,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  lang,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { FileUploader3 } from "@/features/_global";
import { useAlert } from "@/features/_global/hooks";
import { useProfile } from "@/features/profile";
import { useSchoolDetail } from "@/features/schools";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { CalendarIcon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Zod schema for the updated form
const letterUpdateFormSchema = z.object({
  buktiSurat: z.any().nullable(),
  alasan: z.enum(["sakit", "izin"], { required_error: "Alasan izin wajib diisi" }),
  dari: z.string().min(1, "Tanggal izin wajib diisi"),
  sampai: z.string().min(1, "Tanggal selesai izin wajib diisi"),
});

export const LincensingCreationForm = () => {
  const profile = useProfile();
  const school = useSchoolDetail({ id: profile?.user?.sekolahId || 1 });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const alert = useAlert();

  const form = useForm<z.infer<typeof letterUpdateFormSchema>>({
    resolver: zodResolver(letterUpdateFormSchema),
    mode: "onBlur",
    defaultValues: {
      buktiSurat: null,
      alasan: undefined,
      dari: "",
      sampai: "",
    },
  });

  useEffect(() => {
    if (school.data) {
      form.reset({
        buktiSurat: form.getValues().buktiSurat,
        alasan: undefined, // Explicitly reset alasan to undefined
        dari: "",
        sampai: "",
      });
    }
  }, [school.data, form]);

  async function onSubmit(data: z.infer<typeof letterUpdateFormSchema>) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");

      console.log("data", data);

      formData.append("alasan", data.alasan);
      formData.append("dari", data.dari);
      formData.append("sampai", data.sampai);
      formData.append("buktiSurat", data.buktiSurat);

      console.log("📦 FormData yang akan dikirim:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      };

      await axios.post(
        `https://dev.kiraproject.id/api/dispensasi`,
        formData,
        { headers }
      );

      alert.success(lang.text("licensingSuccessCreate"));
      school.query.refetch();
      
      // Reset form to initial values after successful submission
      form.reset({
        buktiSurat: null,
        alasan: undefined, // Explicitly reset to undefined to show placeholder
        dari: "",
        sampai: "",
      });
      navigate("/licensing", { replace: true });
    } catch (err: any) {
      console.error("Error saat submit:", err);
      if (err.response) {
        console.log("error", err.response.data?.message);
        alert.error(err.response.data?.message || lang.text("licensingFailCreate"));
      } else if (err.request) {
        alert.error(lang.text("licensingFailCreate"));
      } else {
        console.log("error", err.message);
        alert.error(err?.message || lang.text("licensingFailCreate"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="alasan"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Alasan Izin</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih alasan izin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sakit">Sakit</SelectItem>
                          <SelectItem value="izin">Izin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-4 mt-3 mb-2">
                  <div className="basis-1 sm:basis-1/2">
                    <FormField
                      control={form.control}
                      name="dari"
                      render={({ field, fieldState }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{lang.text("startDispen")}</FormLabel>
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
                  </div>
                  <div className="basis-1 sm:basis-1/2">
                    <FormField
                      control={form.control}
                      name="sampai"
                      render={({ field, fieldState }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{lang.text("endDispen")}</FormLabel>
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
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="buktiSurat"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="bg-black text-white">Bukti Surat</FormLabel>
                      <FormControl>
                        <FileUploader3
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                          buttonPlaceholder="Unggah bukti surat"
                          onError={(e) => form.setError("buktiSurat", { message: e })}
                          showButton={false}
                          error={fieldState.error?.message}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="py-4 flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full py-6 active:scale-[0.97]"
                >
                  {isLoading ? <FaSpinner className="animate animate-spin duration-600" /> : lang.text("upload")}
                  <SaveIcon />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};