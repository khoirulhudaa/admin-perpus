import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  createGmapUrl,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  lang
} from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { FileUploader, InputMap, ViewMap } from "@/features/_global";
import { useAlert } from "@/features/_global/hooks";
import { useClassroom } from "@/features/classroom";
import { useCourse } from "@/features/course";
import { useBiodata, useBiodataGuru } from "@/features/user/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import DOMPurify from "dompurify";
import { Book, Globe, Table, User, Users, Verified } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { z } from "zod";
import { EditableInfoItem, NonEditableInfoItem, SchoolLogo, SignatureDisplay, SignatureInput } from "../components";
import { useProvinces, useSchool, useSchoolDetail, UseSchoolDetailProps } from "../hooks";
import { schoolUpdateFormSchema } from "../utils";

export interface SchoolInformationProps {
  id?: number;
}

const editorStyles = `
  .ck-editor__main .ck-content {
    background: transparent !important;
    color: white !important;
    border: 1px solid #4B5EAA;
    padding-bottom: 10px;
    min-height: 150px;
  }

  .ck-editor__main .ck-content h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: white !important;
  }

  .ck-editor__main .ck-content h2 {
    font-size: 1.3rem;
    font-weight: bold;
    color: white !important;
  }

  .ck-editor__main .ck-content h3 {
    font-size: 1.1rem;
    font-weight: bold;
    color: white !important;
  }

  .ck-editor__main .ck-content * {
    border: 1px dashed rgba(255, 255, 255, 0.2);
  }
`;

export const SchoolInformation = (props: UseSchoolDetailProps) => {
  const detail = useSchoolDetail({
    id: props.id,
    query: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  });
  const school = useSchool()

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
  const [ckEditorError, setCkEditorError] = useState<string | null>(null);
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  // Parse student.data if it's a string
  const parsedStudentData = useMemo(() => {
    if (typeof student.data === 'string') {
      try {
        return JSON.parse(student.data) as Biodata[];
      } catch (error) {
        console.error('Error parsing student.data:', error);
        return [];
      }
    }
    return (student.data || []) as Biodata[];
  }, [student.data]);

  const students = parsedStudentData?.filter(
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
      visiMisi: "",
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
    console.log("useSchoolDetail status:", { isFetching: detail.isFetching, data: school.data?.[0] });
    if (detail.error) console.error("useSchoolDetail error:", detail.error);
    if (student.error) console.error("useBiodata error:", student.error);
    if (teacher.error) console.error("useBiodataGuru error:", teacher.error);
    if (classroom.error) console.error("useClassroom error:", classroom.error);
    if (course.error) console.error("useCourse error:", course.error);
    if (province.error) console.error("useProvinces error:", province.error);
  }, [
    detail.error,
    detail.isFetching,
    school.data?.[0],
    student.error,
    teacher.error,
    classroom.error,
    course.error,
    province.error,
  ]);

  // Populate form and store initial values
  useEffect(() => {
    if (school.data?.[0]) {
      console.log("Resetting form with school.data?.[0]:", school.data?.[0]);
      const newValues = {
        provinceId: String(school.data?.[0]?.provinceId) || "",
        schoolName: school.data?.[0]?.namaSekolah || "",
        schoolNPSN: school.data?.[0]?.npsn || "",
        alamatSekolah: school.data?.[0]?.alamatSekolah || "",
        moodleApiUrl: school.data?.[0]?.modelApiUrl || "",
        tokenMoodle: school.data?.[0]?.tokenModel || "",
        serverSatu: school.data?.[0]?.serverSatu || "",
        serverDua: school.data?.[0]?.serverDua || "",
        serverTiga: school.data?.[0]?.serverTiga || "",
        urlYoutube1: school.data?.[0]?.urlYutubeFirst || "",
        urlYoutube2: school.data?.[0]?.urlYutubeSecond || "",
        urlYoutube3: school.data?.[0]?.urlYutubeThird || "",
        file: school.data?.[0]?.file || null,
        ttdKepalaSekolah: school.data?.[0]?.ttdKepalaSekolah || null,
        libraryServer: school.data?.[0]?.serverPerpustakaan || "",
        libraryName: school.data?.[0]?.namaPerpustakaan || "",
        address: school.data?.[0]?.alamatSekolah || "",
        location: {
          lat: Number(school.data?.[0]?.latitude) || 0,
          lng: Number(school.data?.[0]?.longitude) || 0,
        },
        active: school.data?.[0]?.active ?? 0,
        visiMisi: school.data?.[0]?.visiMisiLegacy || "",
      };
      form.reset(newValues);
      setInitialValues(newValues);
      setHasChanges(false);
    }
  }, [school.data?.[0]?.id, form]);

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

  // Debug isEditMode
  useEffect(() => {
    console.log("isEditMode changed:", isEditMode);
  }, [isEditMode]);

  // Submit form function
  async function onSubmit(data: z.infer<typeof schoolUpdateFormSchema>) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");
      let hasChanges = false;

      if (data.provinceId && data.provinceId !== String(school.data?.[0]?.provinceId)) {
        formData.append("provinceId", data.provinceId);
        hasChanges = true;
      }
      if (data.schoolName && data.schoolName !== school.data?.[0]?.namaSekolah) {
        formData.append("namaSekolah", data.schoolName);
        hasChanges = true;
      }
      if (data.schoolNPSN && data.schoolNPSN !== school.data?.[0]?.npsn) {
        formData.append("npsn", data.schoolNPSN);
        hasChanges = true;
      }
      if (data.alamatSekolah && data.alamatSekolah !== school.data?.[0]?.alamatSekolah) {
        formData.append("alamatSekolah", data.alamatSekolah);
        hasChanges = true;
      }
      if (
        data.location.lat !== Number(school.data?.[0]?.latitude) ||
        data.location.lng !== Number(school.data?.[0]?.longitude)
      ) {
        formData.append("latitude", String(data.location.lat));
        formData.append("longitude", String(data.location.lng));
        hasChanges = true;
      }
      if (data.serverSatu && data.serverSatu !== school.data?.[0]?.serverSatu) {
        formData.append("serverSatu", data.serverSatu);
        hasChanges = true;
      }
      if (data.serverDua && data.serverDua !== school.data?.[0]?.serverDua) {
        formData.append("serverDua", data.serverDua);
        hasChanges = true;
      }
      if (data.serverTiga && data.serverTiga !== school.data?.[0]?.serverTiga) {
        formData.append("serverTiga", data.serverTiga);
        hasChanges = true;
      }
      if (data.urlYoutube1 && data.urlYoutube1 !== school.data?.[0]?.urlYutubeFirst) {
        formData.append("urlYutubeFirst", data.urlYoutube1);
        hasChanges = true;
      }
      if (data.urlYoutube2 && data.urlYoutube2 !== school.data?.[0]?.urlYutubeSecond) {
        formData.append("urlYutubeSecond", data.urlYoutube2);
        hasChanges = true;
      }
      if (data.urlYoutube3 && data.urlYoutube3 !== school.data?.[0]?.urlYutubeThird) {
        formData.append("urlYutubeThird", data.urlYoutube3);
        hasChanges = true;
      }
      if (data.tokenMoodle && data.tokenMoodle !== school.data?.[0]?.tokenModel) {
        formData.append("tokenModel", data.tokenMoodle);
        hasChanges = true;
      }
      if (data.moodleApiUrl && data.moodleApiUrl !== school.data?.[0]?.modelApiUrl) {
        formData.append("modelApiUrl", data.moodleApiUrl);
        hasChanges = true;
      }
      if (
        data.libraryServer &&
        data.libraryServer !== school.data?.[0]?.serverPerpustakaan
      ) {
        formData.append("serverPerpustakaan", data.libraryServer);
        hasChanges = true;
      }
      if (data.libraryName && data.libraryName !== school.data?.[0]?.namaPerpustakaan) {
        formData.append("namaPerpustakaan", data.libraryName);
        hasChanges = true;
      }
      if (data.address && data.address !== school.data?.[0]?.alamatSekolah) {
        formData.append("alamatSekolah", data.address);
        hasChanges = true;
      }
      if (data.active !== undefined && data.active !== school.data?.[0]?.active) {
        formData.append("active", String(data.active));
        hasChanges = true;
      }
      if (data.file && data.file !== school.data?.[0]?.file) {
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
      if (data.visiMisi && data.visiMisi !== school.data?.[0]?.visiMisiLegacy) {
        formData.append("visiMisi", data.visiMisi);
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
        `${import.meta.env.VITE_API_BASE_URL_OLD}/api/sekolah/${props.id}`,
        formData,
        { headers }
      );

      alert.success(
        lang.text("successful", {
          context: lang.text("updateSchoolData"),
        })
      );
      detail?.query.refetch();
      school?.query.refetch();
      setIsEditMode(false);
      setHasChanges(false);
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

  const safeHTML = DOMPurify.sanitize(school.data?.[0]?.visiMisiLegacy);
  // const isBase64 = (str) => {
  //   if (!str || typeof str !== 'string') return false;
  //   // Basic base64 regex: allows alphanumeric, +, /, and = (padding)
  //   const base64Regex = /^[A-Za-z0-9+/=]+$/;
  //   // Check if string matches base64 pattern and has a reasonable length
  //   return base64Regex.test(str) && str.length > 100; // Adjust length threshold as needed
  // };

  console.log('school data 0', school?.data?.[0]?.file)

  return (
    <>
      <style>{editorStyles}</style>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isEditMode && isIntentionalSubmit) {
              form.handleSubmit(onSubmit)();
            } else {
              console.log("Form submission blocked");
            }
          }}
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4"
        >
         
          <div className="md:col-span-2 lg:col-span-3">
            <Card className="w-full bg-transparent">
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
                    <CardTitle>{school.data?.[0]?.namaSekolah}</CardTitle>
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
                              className="text-sm text-gray-500"
                            />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <CardDescription className="text-white">{`NPSN: ${school?.data?.[0]?.npsn || "-"}`}</CardDescription>
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
                          setCkEditorError(null);
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
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                  <div className="w-full flex gap-8">
                    <div className="relative border bg-white border-white/10 rounded-[4px] w-[40%] h-max p-4 justify-center items-center">
                      <SchoolLogo
                        title={school.data?.[0]?.namaSekolah}
                        image={school.data?.[0]?.file.includes('/uploads/assets/') ? `https://dev.kiraproject.id${school.data?.[0]?.file}` : school.data?.[0]?.file.includes('data:image') ? `data:image/png;base64,${school.data?.[0]?.file}` : getStaticFile(school?.data?.[0]?.file)}
                      />
                    </div>
                    <div className="w-[60%] grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {!isEditMode && (
                        <NonEditableInfoItem
                          icon={<User size={24} />}
                          label={lang.text("adminName")}
                          value={school.data?.[0]?.namaAdmin}
                          isEditMode={isEditMode}
                        />
                      )}
                      <EditableInfoItem
                        control={form.control}
                        icon={<Verified size={24} />}
                        label={lang.text("status")}
                        value={school.data?.[0]?.active === 1 ? "Aktif" : "Tidak Aktif"}
                        name="active"
                        type="select"
                        options={[
                          { value: "0", label: "Tidak Aktif" },
                          { value: "1", label: "Aktif" },
                        ]}
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError={setCkEditorError}
                      />
                      {!isEditMode && (
                        <NonEditableInfoItem
                          icon={<Users size={24} />}
                          label={lang.text("student")}
                          value={String(students?.length)}
                          isEditMode={isEditMode}
                        />
                      )}
                      {!isEditMode && (
                        <NonEditableInfoItem
                          icon={<Users size={24} />}
                          label={lang.text("teacher")}
                          value={String(teachers?.length)}
                          isEditMode={isEditMode}
                        />
                      )}
                      {!isEditMode && (
                        <NonEditableInfoItem
                          icon={<Table size={24} />}
                          label={lang.text("classRoom")}
                          value={String(classroom?.data?.length)}
                          isEditMode={isEditMode}
                        />
                      )}
                      {!isEditMode && (
                        <NonEditableInfoItem
                          icon={<Book size={24} />}
                          label={lang.text("course")}
                          value={String(courses?.length)}
                          isEditMode={isEditMode}
                        />
                      )}
                      <EditableInfoItem
                        control={form.control}
                        icon={<Globe size={24} />}
                        label={lang.text("moodleApiUrl")}
                        value={school.data?.[0]?.modelApiUrl}
                        name="moodleApiUrl"
                        type="url"
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError={setCkEditorError}
                      />
                      <EditableInfoItem
                        control={form.control}
                        icon={<Globe size={24} />}
                        label={lang.text("libraryServer")}
                        value={school.data?.[0]?.serverPerpustakaan}
                        name="libraryServer"
                        type="url"
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError={setCkEditorError}
                      />
                      <EditableInfoItem
                        control={form.control}
                        icon={<Globe size={24} />}
                        label={lang.text("libraryName")}
                        value={school.data?.[0]?.namaPerpustakaan}
                        name="libraryName"
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError={setCkEditorError}
                      />
                      <EditableInfoItem
                        control={form.control}
                        icon={<Globe size={24} />}
                        label={lang.text("server1")}
                        value={school.data?.[0]?.serverSatu}
                        name="serverSatu"
                        type="url"
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError закрепить={setCkEditorError}
                      />
                      <EditableInfoItem
                        control={form.control}
                        icon={<Globe size={24} />}
                        label={lang.text("urlYoutube1")}
                        value={school.data?.[0]?.urlYutubeFirst}
                        name="urlYoutube1"
                        type="url"
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError={setCkEditorError}
                      />
                      <EditableInfoItem
                        control={form.control}
                        icon={<Globe size={24} />}
                        label={lang.text("server2")}
                        value={school.data?.[0]?.serverDua}
                        name="serverDua"
                        type="url"
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError={setCkEditorError}
                      />
                      <EditableInfoItem
                        control={form.control}
                        icon={<Globe size={24} />}
                        label={lang.text("urlYoutube2")}
                        value={school.data?.[0]?.urlYutubeSecond}
                        name="urlYoutube2"
                        type="url"
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError={setCkEditorError}
                      />
                      <EditableInfoItem
                        control={form.control}
                        icon={<Globe size={24} />}
                        label={lang.text("server3")}
                        value={school.data?.[0]?.serverTiga}
                        name="serverTiga"
                        type="url"
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError={setCkEditorError}
                      />
                      <EditableInfoItem
                        control={form.control}
                        icon={<Globe size={24} />}
                        label={lang.text("urlYoutube3")}
                        value={school.data?.[0]?.urlYutubeThird}
                        name="urlYoutube3"
                        type="url"
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError={setCkEditorError}
                      />
                      <EditableInfoItem
                        control={form.control}
                        icon={<Globe size={24} />}
                        label={lang.text("tokenMoodle")}
                        value={school.data?.[0]?.tokenModel}
                        name="tokenMoodle"
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError={setCkEditorError}
                      />
                    </div>
                  </div>

                   <div className="lg:col-start-1 lg:col-end-3 border-t border-white/10 pt-7 mt-6">
                    <EditableInfoItem
                      control={form.control}
                      // icon={<Globe size={24} />}
                      label={lang.text("alamatSekolah")}
                      value={school.data?.[0]?.alamatSekolah}
                      name="alamatSekolah"
                      isEditMode={isEditMode}
                      ckEditorError={ckEditorError}
                      setCkEditorError={setCkEditorError}
                    />
                  </div>

                  {isEditMode && (
                    <div className="lg:col-start-1 lg:col-end-3">
                      <EditableInfoItem
                        control={form.control}
                        icon={<Globe size={24} />}
                        label={lang.text("visionMission")}
                        value={school.data?.[0]?.visiMisiLegacy}
                        name="visiMisi"
                        type="editor"
                        isEditMode={isEditMode}
                        ckEditorError={ckEditorError}
                        setCkEditorError={setCkEditorError}
                      />
                    </div>
                  )}

                  {/* VISI MISI MODE INFORMATION (BUKAN EDIT) */}
                  <div className="border-t border-t-white/10 w-full mt-4 pt-4 lg:col-start-1 lg:col-end-3">
                    <p className="mb-4">{lang.text('visionMission')}</p>
                    
                    <div className="w-full border border-white/10 p-6 rounded-lg lg:col-start-1 lg:col-end-3">
                      <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
                    </div>
                  </div>

                  {isEditMode && (
                    <EditableInfoItem
                      control={form.control}
                      icon={<Globe size={24} />}
                      label={lang.text("province")}
                      value={
                        province.data?.find((p) => p.id === school.data?.[0]?.provinceId)?.name
                      }
                      name="provinceId"
                      type="select"
                      options={province.data?.map((p) => ({
                        value: String(p.id),
                        label: p.name,
                      }))}
                      isEditMode={isEditMode}
                      ckEditorError={ckEditorError}
                      setCkEditorError={setCkEditorError}
                    />
                  )}
                  <div className="lg:col-start-1 lg:col-end-3 z-[1]">
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <InputMap
                            label="Pilih Lokasi Peta"
                            onChange={(v) => {
                              field.onChange(v);
                            }}
                            value={field.value}
                          />
                        )}
                      />
                    ) : (
                      school.data?.[0]?.id && (
                        <div className="rounded-lg mt-6">
                          <ViewMap
                            position={{
                              lat: school.data?.[0]?.latitude,
                              lng: school.data?.[0]?.longitude,
                            }}
                            zoom={18}
                            markerContent={
                              <div>
                                <p>{school.data?.[0]?.namaSekolah}</p>
                                <Link
                                  className={cn("rounded-sm", "p-0 text-xs underline text-white")}
                                  target="_blank"
                                  to={createGmapUrl(school.data?.[0].latitude, school.data?.[0].longitude)}
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
            <div>
            {isEditMode ? (
              <div className="flex flex-col gap-4 mt-5">
                <div>
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text("schoollogo")}</FormLabel>
                        <div className="flex items-center w-full border border-white/20 p-4">
                          <FileUploader
                            mt={false}
                            height={'280px'}
                            value={field.value}
                            onChange={(v) => {
                              field.onChange(v);
                            }}
                            buttonPlaceholder="Upload logo sekolah"
                            onError={(e) => {
                              form.setError("file", { message: e });
                            }}
                            showButton={false}
                            error={fieldState.error?.message}
                          />
                          {school.data?.[0]?.file && (
                            <div className="w-full flex justify-center items-center pt-8 pb-10">
                              <img
                                src={school.data?.[0]?.file.includes('/uploads/assets/') ? `https://dev.kiraproject.id${school.data?.[0]?.file}` : school.data?.[0]?.file.includes('data:image') ? school.data?.[0]?.file : getStaticFile(school?.data?.[0]?.file)}
                                alt="Current logo"
                                className="w-48 h-48 object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormLabel>{lang.text("signature")}</FormLabel>
                  <div className="h-[330px] w-full border border-white/10 p-4 rounded-2xl flex mt-2 gap-4 items-center">
                    <SignatureInput
                      sigCanvas={sigCanvas}
                      onSignatureChange={() => {
                        form.setValue("ttdKepalaSekolah", sigCanvas.current?.toDataURL() || null);
                      }}
                    />
                    <SignatureDisplay signature={school.data?.[0]?.ttdKepalaSekolah?.includes('/uploads/assets') ? `https://dev.kiraproject.id${school.data?.[0]?.ttdKepalaSekolah}` : school.data?.[0]?.ttdKepalaSekolah?.includes('data:image') ? school.data?.[0]?.ttdKepalaSekolah  : getStaticFile(school.data?.[0]?.ttdKepalaSekolah) ?? undefined} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* <div>
                  {school.data?.[0]?.ttdKepalaSekolah && (
                    <div className="mt-10">
                      <p className="text-sm my-6 font-medium">{lang.text("signature")}</p>
                      <div className="w-full">
                        <SignatureDisplay
                          signature={school.data?.[0]?.ttdKepalaSekolah ?? undefined}
                        />
                      </div>
                    </div>
                  )}
                </div> */}
              </>
            )}
          </div>
          </div>
        </form>
      </Form>
    </>
  );
};