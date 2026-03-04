import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  lang,
} from "@/core/libs";
import { useSchoolDetail, UseSchoolDetailProps } from "../hooks";
import { InfoItem, SchoolLogo, SignatureDisplay, SignatureInput } from "../components";
import { getStaticFile } from "@/core/utils";
import { Book, Globe, Table, User, Users, Verified } from "lucide-react";
import { createGmapUrl } from "@/core/libs";
import { ViewMap, InputMap, FileUploader } from "@/features/_global";
import { Link } from "react-router-dom";
import { useBiodata, useBiodataGuru } from "@/features/user/hooks";
import { useClassroom } from "@/features/classroom";
import { useCourse } from "@/features/course";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useAlert } from "@/features/_global/hooks";
import { schoolUpdateFormSchema } from "../utils";
import { useProvinces } from "../hooks";
import SignatureCanvas from "react-signature-canvas";

export interface SchoolInformationProps {
  id?: number;
}

export const SchoolCreationForm = (props: UseSchoolDetailProps) => {
  const detail = useSchoolDetail({
    id: props.id,
    query: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  });
  const student = useBiodata();
  const classroom = useClassroom();
  const teacher = useBiodataGuru();
  const course = useCourse();
  const province = useProvinces();
  const alert = useAlert();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIntentionalSubmit, setIsIntentionalSubmit] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialValues, setInitialValues] = useState<z.infer<typeof schoolUpdateFormSchema> | null>(null);
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  console.log(detail)
  const students = student.data?.filter(
    (d) => Number(d?.user?.sekolah?.id) === Number(props.id)
  );
  const teachers = teacher.data?.filter(
    (d) => Number(d?.user?.sekolah?.id) === Number(props.id)
  );
  const classrooms = classroom.data?.filter(
    (d) => Number(d?.Sekolah?.id) === Number(props.id)
  );
  const courses = course.data?.filter(
    (d) => Number(d?.sekolah?.id) === Number(props.id)
  );

  const form = useForm<z.infer<typeof schoolUpdateFormSchema>>({
    resolver: zodResolver(schoolUpdateFormSchema),
    mode: "onBlur",
    shouldFocusError: false,
    defaultValues: {
      provinceId: "",
      schoolName: "",
      schoolNPSN: "",
      alamatSekolah: "",
      moodleApiUrl: "",
      tokenMoodle: "",
      serverSatu: "",
      serverDua: "",
      serverTiga: "",
      urlYoutube1: "",
      urlYoutube2: "",
      urlYoutube3: "",
      file: "",
      ttdKepalaSekolah: "",
      libraryServer: "",
      libraryName: "",
      address: "",
      location: {
        lat: 0,
        lng: 0,
      },
      active: 0,
    },
  });

  // Deep comparison function
  const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
      return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  };

  // Check for hook errors
  useEffect(() => {
    console.log("useSchoolDetail status:", { isFetching: detail.isFetching, data: detail.data });
    if (detail.error) console.error("useSchoolDetail error:", detail.error);
    if (student.error) console.error("useBiodata error:", student.error);
    if (teacher.error) console.error("useBiodataGuru error:", teacher.error);
    if (classroom.error) console.error("useClassroom error:", classroom.error);
    if (course.error) console.error("useCourse error:", course.error);
    if (province.error) console.error("useProvinces error:", province.error);
  }, [
    detail.error,
    detail.isFetching,
    detail.data,
    student.error,
    teacher.error,
    classroom.error,
    course.error,
    province.error,
  ]);

  // Populate form and store initial values
  useEffect(() => {
    if (detail.data) {
      console.log("Resetting form with detail.data:", detail.data);
      const newValues = {
        provinceId: String(detail.data?.provinceId) || "",
        schoolName: detail.data?.namaSekolah || "",
        schoolNPSN: detail.data?.npsn || "",
        alamatSekolah: detail.data?.alamatSekolah || "",
        moodleApiUrl: detail.data?.modelApiUrl || "",
        tokenMoodle: detail.data?.tokenModel || "",
        serverSatu: detail.data?.serverSatu || "",
        serverDua: detail.data?.serverDua || "",
        serverTiga: detail.data?.serverTiga || "",
        urlYoutube1: detail.data?.urlYutubeFirst || "",
        urlYoutube2: detail.data?.urlYutubeSecond || "",
        urlYoutube3: detail.data?.urlYutubeThird || "",
        file: detail.data?.file || null,
        ttdKepalaSekolah: detail.data?.ttdKepalaSekolah || null,
        libraryServer: detail.data?.serverPerpustakaan || "",
        libraryName: detail.data?.namaPerpustakaan || "",
        address: detail.data?.alamatSekolah || "",
        location: {
          lat: Number(detail.data?.latitude) || 0,
          lng: Number(detail.data?.longitude) || 0,
        },
        active: detail.data?.active ?? 0,
      };
      form.reset(newValues);
      setInitialValues(newValues);
      setHasChanges(false); // Reset hasChanges when form is populated
    }
  }, [detail.data?.id, form]);

  // Monitor form changes
  useEffect(() => {
    if (initialValues) {
      const subscription = form.watch((currentValues) => {
        const hasFormChanges = !deepEqual(currentValues, initialValues);
        console.log("Form values changed:", { currentValues, hasFormChanges });
        setHasChanges(hasFormChanges);
      });
      return () => subscription.unsubscribe();
    }
  }, [form, initialValues]);

  // Fungsi untuk submit form
  async function onSubmit(data: z.infer<typeof schoolUpdateFormSchema>) {
    console.log("onSubmit called with data:", data);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");
      let hasChanges = false;

      if (data.provinceId && data.provinceId !== String(detail.data?.provinceId)) {
        formData.append("provinceId", data.provinceId);
        hasChanges = true;
      }
      if (data.schoolName && data.schoolName !== detail.data?.namaSekolah) {
        formData.append("namaSekolah", data.schoolName);
        hasChanges = true;
      }
      if (data.schoolNPSN && data.schoolNPSN !== detail.data?.npsn) {
        formData.append("npsn", data.schoolNPSN);
        hasChanges = true;
      }
      if (data.alamatSekolah && data.alamatSekolah !== detail.data?.alamatSekolah) {
        formData.append("alamatSekolah", data.alamatSekolah);
        hasChanges = true;
      }
      if (
        data.location.lat !== Number(detail.data?.latitude) ||
        data.location.lng !== Number(detail.data?.longitude)
      ) {
        formData.append("latitude", String(data.location.lat));
        formData.append("longitude", String(data.location.lng));
        hasChanges = true;
      }
      if (data.serverSatu && data.serverSatu !== detail.data?.serverSatu) {
        formData.append("serverSatu", data.serverSatu);
        hasChanges = true;
      }
      if (data.serverDua && data.serverDua !== detail.data?.serverDua) {
        formData.append("serverDua", data.serverDua);
        hasChanges = true;
      }
      if (data.serverTiga && data.serverTiga !== detail.data?.serverTiga) {
        formData.append("serverTiga", data.serverTiga);
        hasChanges = true;
      }
      if (data.urlYoutube1 && data.urlYoutube1 !== detail.data?.urlYutubeFirst) {
        formData.append("urlYutubeFirst", data.urlYoutube1);
        hasChanges = true;
      }
      if (data.urlYoutube2 && data.urlYoutube2 !== detail.data?.urlYutubeSecond) {
        formData.append("urlYutubeSecond", data.urlYoutube2);
        hasChanges = true;
      }
      if (data.urlYoutube3 && data.urlYoutube3 !== detail.data?.urlYutubeThird) {
        formData.append("urlYutubeThird", data.urlYoutube3);
        hasChanges = true;
      }
      if (data.tokenMoodle && data.tokenMoodle !== detail.data?.tokenModel) {
        formData.append("tokenModel", data.tokenMoodle);
        hasChanges = true;
      }
      if (data.moodleApiUrl && data.moodleApiUrl !== detail.data?.modelApiUrl) {
        formData.append("modelApiUrl", data.moodleApiUrl);
        hasChanges = true;
      }
      if (
        data.libraryServer &&
        data.libraryServer !== detail.data?.serverPerpustakaan
      ) {
        formData.append("serverPerpustakaan", data.libraryServer);
        hasChanges = true;
      }
      if (data.libraryName && data.libraryName !== detail.data?.namaPerpustakaan) {
        formData.append("namaPerpustakaan", data.libraryName);
        hasChanges = true;
      }
      if (data.address && data.address !== detail.data?.alamatSekolah) {
        formData.append("alamatSekolah", data.address);
        hasChanges = true;
      }
      if (data.active !== undefined && data.active !== detail.data?.active) {
        formData.append("active", String(data.active));
        hasChanges = true;
      }
      if (data.file && data.file !== detail.data?.file) {
        if (data.file instanceof File) {
          formData.append("file", data.file);
          hasChanges = true;
        } else if (data.file === null || data.file === "") {
          formData.append("file", "");
          hasChanges = true;
        } else {
          formData.append("file", data.file);
          hasChanges = true;
        }
      }
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
        const byteString = atob(signatureData.split(",")[1]);
        const mimeString = signatureData.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        formData.append("ttdKepalaSekolah", blob, "signature.png");
        hasChanges = true;
      } else if (data.ttdKepalaSekolah === null || data.ttdKepalaSekolah === "") {
        formData.append("ttdKepalaSekolah", "");
        hasChanges = true;
      }

      if (!hasChanges) {
        alert.info("Tidak ada perubahan untuk disimpan.");
        setIsSubmitting(false);
        return;
      }

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/sekolah/${props.id}`,
        formData,
        { headers }
      );

      alert.success(
        lang.text("successful", {
          context: lang.text("updateSchoolData"),
        })
      );
      detail?.query.refetch();
      setIsEditMode(false);
      setHasChanges(false); // Reset hasChanges after successful submission
    } catch (err: any) {
      console.error("onSubmit error:", err);
      alert.error(
        err.response?.data?.message ||
          lang.text("failed", {
            context: lang.text("updateSchoolData"),
          })
      );
    } finally {
      setIsSubmitting(false);
      setIsIntentionalSubmit(false);
    }
  }

  const EditableInfoItem = ({
    icon,
    label,
    value,
    name,
    type = "text",
    options,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number | undefined;
    name: keyof z.infer<typeof schoolUpdateFormSchema>;
    type?: string;
    options?: { value: string; label: string }[];
  }) => {
    return isEditMode ? (
      <FormField
        control={form.control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {type === "select" ? (
                <Select
                  value={String(field.value)}
                  onValueChange={(val) =>
                    field.onChange(name === "active" ? Number(val) : val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Pilih ${label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder={`Masukkan ${label}`}
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />
    ) : (
      <InfoItem
        icon={icon}
        label={label}
        value={value || "-"}
        {...(value && type === "url" && { link: String(value) })}
      />
    );
  };

  const NonEditableInfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number | undefined;
  }) => {
    if (isEditMode) return null;
    return (
      <InfoItem
        icon={icon}
        label={label}
        value={value || "-"}
      />
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isEditMode && isIntentionalSubmit) {
            console.log("Form submitted");
            form.handleSubmit(onSubmit)();
          } else {
            console.log("Form submission blocked");
          }
        }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div>
          {isEditMode ? (
            <>
              <FormField
                control={form.control}
                name="file"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{lang.text("schoollogo")}</FormLabel>
                    <FileUploader
                      value={field.value}
                      onChange={(v) => {
                        console.log("FileUploader onChange:", v);
                        field.onChange(v);
                      }}
                      buttonPlaceholder="Upload logo sekolah"
                      onError={(e) => {
                        console.log("FileUploader error:", e);
                        form.setError("file", { message: e });
                      }}
                      showButton={false}
                      error={fieldState.error?.message}
                    />
                    {detail.data?.file && (
                      <div className="border-b border-white/10 mt-2 w-full flex justify-center items-center pt-8 pb-10">
                        <img
                          src={getStaticFile(String(detail.data?.file))}
                          alt="Current logo"
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <div className="py-4 w-full">
                <FormLabel>{lang.text("signature")}</FormLabel>
                <div className="w-full flex flex-col mt-6 gap-4 items-center">
                  <SignatureInput
                    sigCanvas={sigCanvas}
                    onSignatureChange={() => {
                      console.log("SignatureInput changed");
                      form.setValue("ttdKepalaSekolah", sigCanvas.current?.toDataURL() || null);
                    }}
                  />
                  <SignatureDisplay signature={detail.data?.ttdKepalaSekolah ?? undefined} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="border border-white/10 rounded-[14px] p-4 w-full justify-center items-center">
                  <SchoolLogo
                    title={detail.data?.namaSekolah}
                    image={getStaticFile(String(detail.data?.file))}
                  />
                </div>
                {detail.data?.ttdKepalaSekolah && (
                  <div className="mt-10">
                    <p className="text-sm my-6 font-medium">{lang.text("signature")}</p>
                    <div className="w-full">
                      <SignatureDisplay
                        signature={detail.data?.ttdKepalaSekolah ?? undefined}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <Card className="w-full">
            <CardHeader className="border-b border-white/10 mb-6 flex flex-row items-center justify-between">
              <div className="relative pt-2 flex gap-2">
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="schoolName"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan nama sekolah"
                            className="text-lg font-semibold"
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                ) : (
                  <CardTitle>{detail.data?.namaSekolah}</CardTitle>
                )}
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="schoolNPSN"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan NPSN"
                            className="text-sm"
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                ) : (
                  <CardDescription className="text-white">{`NPSN: ${detail?.data?.npsn || "-"}`}</CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                {isEditMode ? (
                  <>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting || !hasChanges}
                      onClick={() => setIsIntentionalSubmit(true)}
                    >
                      {isSubmitting ? lang.text("saving") : lang.text("save")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => {
                        console.log("Tombol Batal diklik");
                        form.reset();
                        setIsEditMode(false);
                        setIsIntentionalSubmit(false);
                        setHasChanges(false);
                      }}
                    >
                      {lang.text("cancel")}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => {
                      console.log("Entering edit mode");
                      setIsEditMode(true);
                    }}
                  >
                    {lang.text("edit")}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {!isEditMode && (
                  <NonEditableInfoItem
                    icon={<User size={24} />}
                    label={lang.text("adminName")}
                    value={detail.data?.namaAdmin}
                  />
                )}
                <EditableInfoItem
                  icon={<Verified size={24} />}
                  label={lang.text("status")}
                  value={detail.data?.active === 1 ? "Aktif" : "Tidak Aktif"}
                  name="active"
                  type="select"
                  options={[
                    { value: "0", label: "Tidak Aktif" },
                    { value: "1", label: "Aktif" },
                  ]}
                />
                <EditableInfoItem
                  icon={<Globe size={24} />}
                  label={lang.text("alamatSekolah")}
                  value={detail.data?.alamatSekolah}
                  name="alamatSekolah"
                />
                {!isEditMode && (
                  <NonEditableInfoItem
                    icon={<Users size={24} />}
                    label={lang.text("student")}
                    value={String(students?.length)}
                  />
                )}
                {!isEditMode && (
                  <NonEditableInfoItem
                    icon={<Users size={24} />}
                    label={lang.text("teacher")}
                    value={String(teachers?.length)}
                  />
                )}
                {!isEditMode && (
                  <NonEditableInfoItem
                    icon={<Table size={24} />}
                    label={lang.text("classRoom")}
                    value={String(classrooms?.length)}
                  />
                )}
                {!isEditMode && (
                  <NonEditableInfoItem
                    icon={<Book size={24} />}
                    label={lang.text("course")}
                    value={String(courses?.length)}
                  />
                )}
                <EditableInfoItem
                  icon={<Globe size={24} />}
                  label={lang.text("moodleApiUrl")}
                  value={detail.data?.modelApiUrl}
                  name="moodleApiUrl"
                  type="url"
                />
                <EditableInfoItem
                  icon={<Globe size={24} />}
                  label={lang.text("libraryServer")}
                  value={detail.data?.serverPerpustakaan}
                  name="libraryServer"
                  type="url"
                />
                <EditableInfoItem
                  icon={<Globe size={24} />}
                  label={lang.text("libraryName")}
                  value={detail.data?.namaPerpustakaan}
                  name="libraryName"
                />
                <EditableInfoItem
                  icon={<Globe size={24} />}
                  label={lang.text("server1")}
                  value={detail.data?.serverSatu}
                  name="serverSatu"
                  type="url"
                />
                <EditableInfoItem
                  icon={<Globe size={24} />}
                  label={lang.text("urlYoutube1")}
                  value={detail.data?.urlYutubeFirst}
                  name="urlYoutube1"
                  type="url"
                />
                <EditableInfoItem
                  icon={<Globe size={24} />}
                  label={lang.text("server2")}
                  value={detail.data?.serverDua}
                  name="serverDua"
                  type="url"
                />
                <EditableInfoItem
                  icon={<Globe size={24} />}
                  label={lang.text("urlYoutube3")}
                  value={detail.data?.urlYutubeThird}
                  name="urlYoutube3"
                  type="url"
                />
                <EditableInfoItem
                  icon={<Globe size={24} />}
                  label={lang.text("server3")}
                  value={detail.data?.serverTiga}
                  name="serverTiga"
                  type="url"
                />
                <EditableInfoItem
                  icon={<Globe size={24} />}
                  label={lang.text("urlYoutube2")}
                  value={detail.data?.urlYutubeSecond}
                  name="urlYoutube2"
                  type="url"
                />
                <EditableInfoItem
                  icon={<Globe size={24} />}
                  label={lang.text("tokenMoodle")}
                  value={detail.data?.tokenModel}
                  name="tokenMoodle"
                />
                {isEditMode && (
                  <EditableInfoItem
                    icon={<Globe size={24} />}
                    label={lang.text("province")}
                    value={
                      province.data?.find((p) => p.id === detail.data?.provinceId)?.name
                    }
                    name="provinceId"
                    type="select"
                    options={province.data?.map((p) => ({
                      value: String(p.id),
                      label: p.name,
                    }))}
                  />
                )}
                <div className="lg:col-start-1 lg:col-end-3">
                  {isEditMode ? (
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <InputMap
                          label="Pilih Lokasi Peta"
                          onChange={(v) => {
                            console.log("InputMap onChange:", v);
                            field.onChange(v);
                          }}
                          value={field.value}
                        />
                      )}
                    />
                  ) : (
                    detail.data?.id && (
                      <div className="rounded-lg mt-6">
                        <ViewMap
                          position={{
                            lat: detail.data?.latitude,
                            lng: detail.data?.longitude,
                          }}
                          zoom={18}
                          markerContent={
                            <div>
                              <p>{detail.data?.namaSekolah}</p>
                              <Link
                                className={cn("rounded-sm", "p-0 text-xs underline text-white")}
                                target="_blank"
                                to={createGmapUrl(detail.data.latitude, detail.data.longitude)}
                              >
                                Buka Map
                              </Link>
                            </div>
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};