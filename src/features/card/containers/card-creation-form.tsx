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
} from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { useAlert } from "@/features/_global/hooks";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Updated Zod schema
const cardUpdateFormSchema = z.object({
  namaSekolah: z.string().min(1, "Nama sekolah wajib diisi"),
  alamatSekolah: z.string().min(1, "Alamat sekolah wajib diisi"),
  visiMisi: z.string().min(1, "Visi & Misi wajib diisi"),
});

// Custom CSS for transparent CKEditor background with black text
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

export const CardCreationForm = () => {
  const profile = useProfile();
  const school = useSchool();
  const [isLoading, setIsLoading] = useState(false);
  const [visiMisiFontSize, setVisiMisiFontSize] = useState<number>(() => {
    const savedSize = localStorage.getItem("visiMisiFontSize");
    return savedSize ? parseInt(savedSize, 10) : 10;
  });
  const navigate = useNavigate();
  const alert = useAlert();

  // Simpan setiap perubahan ukuran ke localStorage
  useEffect(() => {
    localStorage.setItem("visiMisiFontSize", visiMisiFontSize.toString());
  }, [visiMisiFontSize]);

  const form = useForm<z.infer<typeof cardUpdateFormSchema>>({
    resolver: zodResolver(cardUpdateFormSchema),
    mode: "onBlur",
    defaultValues: {
      namaSekolah: school.data?.[0]?.namaSekolah || "",
      alamatSekolah: school.data?.[0]?.alamatSekolah || "",
      visiMisi: school.data?.[0]?.visiMisiLegacy || "",
    },
  });

  async function onSubmit(data: z.infer<typeof cardUpdateFormSchema>) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");

      if (data.namaSekolah && data.namaSekolah !== school.data?.[0]?.namaSekolah) {
        formData.append("namaSekolah", data.namaSekolah);
      }

      if (data.alamatSekolah && data.alamatSekolah !== school.data?.[0]?.alamatSekolah) {
        formData.append("alamatSekolah", data.alamatSekolah);
      }

      if (data.visiMisi && data.visiMisi !== school.data?.[0]?.visiMisiLegacy) {
        formData.append("visiMisi", data.visiMisi);
      }

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
        withCredentials: true,
      };

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/sekolah/${profile?.user?.sekolahId}`,
        formData,
        { headers }
      );

      alert.success("Data kartu berhasil diperbarui");
      school.query.refetch();
      navigate("/format/card", { replace: true });
    } catch (err: any) {
      if (err.response) {
        alert.error(err.response.data?.message || "Gagal memperbarui data kartu");
      } else if (err.request) {
        alert.error("Gagal memperbarui data kartu");
      } else {
        alert.error(err?.message || "Gagal memperbarui data kartu");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (school?.query.error) {
    alert.error("Gagal memuat data");
    navigate("/letters");
    return null;
  }

  if (school.isLoading) {
    return <div>{lang.text('loading')}</div>;
  }

  console.log('school data format:', school)

  return (
    <div className="flex flex-col gap-8 py-6 mb-4">
      <style>{editorStyles}</style>
        <div className="ml-auto w-full justify-between flex items-center gap-2">
          <label className="text-white text-sm">Ukuran Teks Visi Misi:</label>
          <div className="min-w-[52px] h-[30px] border border-white/20 rounded-sm px-2 flex items-center justify-center">
            <span className="text-white text-sm">{visiMisiFontSize}px</span>
          </div>
          {/* Tombol minus */}
          <button
            onClick={() => setVisiMisiFontSize((prev) => Math.max(8, prev - 1))}
            className="w-[30px] h-[30px] bg-white text-black rounded-md text-xl font-bold hover:bg-gray-200"
            aria-label="Kurangi ukuran font"
          >
            –
          </button>

          {/* Slider */}
          <Input
            type="range"
            min={8}
            max={16}
            value={visiMisiFontSize}
            onChange={(e) => setVisiMisiFontSize(Number(e.target.value))}
            className="w-[70%]"
          />

          {/* Tombol plus */}
          <button
            onClick={() => setVisiMisiFontSize((prev) => Math.min(20, prev + 1))}
            className="w-[30px] h-[30px] bg-white text-black rounded-md text-xl font-bold hover:bg-gray-200"
            aria-label="Tambah ukuran font"
          >
            +
          </button>
        </div>
        <div className="w-full flex rounded-lg items-center justify-between p-8 bg-white/20">
        <div id={`student-card-Filmsy`}>
          <div
            className={`front-card ${'horizontal'}`}
            style={{
              backgroundImage: `url(${'/src/features/kartuSiswa/assets/bg1.png'})`,
              width: "500px",
              height: "300px",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={`header ${'horizontal'}`}>
              <div className="school-info">
                <h2 className="school-name">{school.data?.[0]?.namaSekolah || "SMKN 111 Example"}</h2>
                <p className="school-address">{school.data?.[0]?.alamatSekolah || "Jl. Example Nomor 12122"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[1px] h-full bg-white/20">
        </div>

        <div
          id={`student-card-1-back`}
          className={`w-full back-card ${'horizontal'}`}
          style={{ backgroundImage: `url(${'/src/features/kartuSiswa/assets/bg1.png'})` }}
        >
          <div className="back-card-content">
            <h2 className="back-title">{school.data?.[0]?.namaSekolah || "Sekolah Indonesia"}</h2>
            <div
              className={`bg-white p-4 rounded-lg text-black visi-misi ${'horizontal'}`}
              style={{ fontSize: `${visiMisiFontSize}px` }}
            >
              <p className="w-[80%]" dangerouslySetInnerHTML={{ __html: school.data?.[0]?.visiMisiLegacy || "Visi dan Misi tidak tersedia" }}></p>
            </div>
            <div className={`qr-logo-section ${'horizontal'} absolute top-8 mr-2 right-12 mb-24 scale-[0.8]`}>
              <div className="qr-container">
                <QRCode
                  value={1234567891}
                  size={120}
                />
              </div>
            </div>
            <div className={`h-max flex flex-col qr-logo-section ${'horizontal'} text-black w-[22%]`}>
              <img
                src={
                    school?.data?.[0]?.ttdKepalaSekolah?.includes('uploads/assets')
                    ? `https://dev.kiraproject.id${school?.data?.[0]?.ttdKepalaSekolah}`
                    : school?.data?.[0]?.ttdKepalaSekolah?.includes('data:image')
                    ? school?.data?.[0]?.ttdKepalaSekolah
                    : !school?.data?.[0]?.ttdKepalaSekolah?.includes('/uploads/assets')
                    ? getStaticFile(String(school?.data?.[0]?.ttdKepalaSekolah))
                    : '/default-signature.png'
                }
                alt="ttdKepalaSekolah"
                className="w-[60%] mb-2 object-contain"
              />
             <p className="text-[54%]">{school?.data?.[0]?.namaKepalaSekolah || 'Nama kepala sekolah'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[100%]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="w-full flex gap-4">
                <div className="basis-1 sm:basis-1/2">
                  <FormField
                    control={form.control}
                    name="namaSekolah"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text('schoolName')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={lang.text('inputSchoolName')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="basis-1 sm:basis-1/2">
                  <FormField
                    control={form.control}
                    name="alamatSekolah"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text('address')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={lang.text('inputaddress')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
               <div className="flex flex-col gap-6 w-full">
                <div>
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="visiMisi"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Visi & Misi</FormLabel>
                          <FormControl>
                            <CKEditor
                              editor={ClassicEditor}
                              data={field.value}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                field.onChange(data);
                              }}
                              config={{
                                placeholder: lang.text('inputVisiMisi'),
                                toolbar: [
                                  'heading', '|',
                                  'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                                  'undo', 'redo', '|', 'paragraph'
                                ],
                              }}
                            />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="py-4 flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full py-6 active:scale-[0.97]"
                >
                  {isLoading ? <FaSpinner className="animate animate-spin duration-600" /> : lang.text('save')}
                  <SaveIcon />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};