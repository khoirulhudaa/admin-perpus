import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormMessage,
  FormField,
  SelectContent,
  SelectItem,
  FormItem,
  FormLabel,
  Input,
  SelectTrigger,
  SelectValue,
  Textarea,
  Select,
  Button,
  Form,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
} from "@/core/libs";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProfile } from "../hooks";
import { UserModel } from "@/core/models";
import { dayjs, forwardDateDisabled } from "@/core/libs";
import { DashboardPageLayout, useAlert } from "@/features/_global";
import { useNavigate } from "react-router-dom";
import { CalendarIcon } from "lucide-react";
const updateProfileSchema = z.object({
  nama: z
    .string()
    .min(1, { message: "Nama harus minimal 1 karakter" })
    .optional(),
  jk: z
    .enum(["Pria", "Wanita"], {
      message: "Jenis kelamin harus Pria atau Wanita",
    })
    .optional(),
  agama: z.string().optional(),
  tempat_lahir: z.string().optional(),
  tgl_lahir: z.string().optional(),
  alamat_dom: z.string().optional(),
  jml_anak: z.number().nullable().optional(),
  no_hp: z.string().optional(),
  email: z
    .string()
    .email({ message: "Format email tidak valid, silahkan cek kembali!" })
    .optional(),
  kontak_darurat: z.string().optional(),
  alamat_ktp: z.string().optional(),
  status: z
    .enum(["Menikah", "Lajang"], {
      message: "Status harus Menikah atau Lajang",
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof updateProfileSchema>;

export function EditProfileForm() {
  const profile = useProfile();
  const alert = useAlert();
  const navigate = useNavigate();
  const userDataJson = useMemo(
    () => (profile.user ? JSON.stringify(profile.user) : ""),
    [profile.user],
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      nama: "",
      jk: undefined,
      agama: "",
      tempat_lahir: "",
      tgl_lahir: "",
      alamat_dom: "",
      jml_anak: undefined,
      no_hp: "",
      email: "",
      kontak_darurat: "",
      alamat_ktp: "",
      status: undefined,
    },
    mode: "onChange",
  });

  const formResetRef = useRef(form.reset);

  useEffect(() => {
    if (!form.formState.isDirty && userDataJson) {
      const userData: UserModel = JSON.parse(userDataJson);
      formResetRef.current?.({
        nama: userData.nama || "",
        jk: (userData.jk as "Pria" | "Wanita") || undefined,
        agama: userData.agama || "",
        tempat_lahir: userData.tempat_lahir || "",
        tgl_lahir: userData.tgl_lahir || "",
        alamat_dom: userData.alamat_dom || "",
        jml_anak: userData.jml_anak || undefined,
        no_hp: userData.no_hp || "",
        email: userData.email || "",
        kontak_darurat: userData.kontak_darurat || "",
        alamat_ktp: userData.alamat_ktp || "",
        status: (userData.status as "Menikah" | "Lajang") || undefined,
      });
    }
  }, [form.formState.isDirty, userDataJson]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      await profile.updateProfile(data);
      alert.success("Profil berhasil di perbarui");
      navigate("/profile", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert.error(err?.message || "gagal memperbarui profil");
    }
  }

  return (
    <DashboardPageLayout
      title="Edit Profile"
      breadcrumbs={[
        {
          label: "profile",
          url: "/profile",
        },
        {
          label: "Edit Profile",
          url: "/profile/edit",
        },
      ]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
            <div>
              <FormField
                control={form.control}
                name="nama"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="jk"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pria">Pria</SelectItem>
                        <SelectItem value="Wanita">Wanita</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="agama"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Agama</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan agama" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="tempat_lahir"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Tempat Lahir</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan tempat lahir" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="tgl_lahir"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-col mb-6">
                    <FormLabel>Tanggal Lahir</FormLabel>
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
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dayjs(field.value).toDate()}
                          onSelect={field.onChange}
                          disabled={forwardDateDisabled}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="alamat_dom"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Alamat Domisili</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan alamat domisili"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="jml_anak"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Jumlah Anak</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Masukkan jumlah anak"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : parseInt(value, 10),
                          );
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="no_hp"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nomor HP</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nomor HP" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Masukkan email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="kontak_darurat"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Kontak Darurat</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan kontak darurat" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="alamat_ktp"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Alamat KTP</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Masukkan alamat KTP" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Menikah">Menikah</SelectItem>
                        <SelectItem value="Lajang">Lajang</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={
              !form.formState.isDirty ||
              profile.mutation.isPending ||
              !form.formState.isValid ||
              form.formState.isLoading
            }
          >
            {profile.mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </Form>
    </DashboardPageLayout>
  );
}
