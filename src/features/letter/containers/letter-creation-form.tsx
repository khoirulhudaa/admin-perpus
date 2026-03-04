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
  Textarea
} from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { FileUploader2 } from "@/features/_global";
import { useAlert } from "@/features/_global/hooks";
import { useProfile } from "@/features/profile";
import { useSchool, useSchoolDetail } from "@/features/schools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Document, Image, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSave, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { z } from "zod";
import { SignatureDisplay, SignatureInput } from "../components";
import { SaveIcon } from "lucide-react";

// Updated Zod schema
const letterUpdateFormSchema = z.object({
  kopSurat: z.any().nullable(),
  ttdKepalaSekolah: z.any().nullable(),
  namaKepalaSekolah: z.string().min(1, "Nama kepala sekolah wajib diisi"),
  judulSurat: z.string().min(1, "Judul surat wajib diisi"),
  nomorSurat: z.string().optional(), // Make nomorSurat optional
  pembukaan: z.string().min(1, "Pembukaan wajib diisi"),
  pernyataanLulus: z.string().min(1, "Pernyataan lulus wajib diisi"),
  penutupan: z.string().min(1, "Penutupan wajib diisi"),
});

// Styles untuk PDF
const pdfStyles = StyleSheet.create({
  page: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
  },
  header: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
  },
  headerImage: {
    width: 595,
    maxHeight: 150,
    objectFit: 'contain',
  },
  contentWrapper: {
    paddingLeft: 32,
    paddingRight: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 36,
    textTransform: 'uppercase',
  },
  title2: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  letterNumber: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 26,
  },
  content: {
    marginBottom: 30,
    textAlign: 'justify',
    lineHeight: 1.5,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  studentNIS: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  signature: {
    marginTop: 50,
    alignItems: 'flex-end',
  },
  signatureImage: {
    width: 120,
    height: 'auto',
    maxHeight: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  signatureText: {
    textAlign: 'center',
  },
  viewer: {
    width: '100%',
    height: '110vh',
  },
});

interface LetterData {
  kopSurat: string | File | null;
  namaSekolah: string;
  judulSurat: string;
  nomorSurat: string;
  namaKepalaSekolah: string;
  ttdKepalaSekolah: string | undefined;
  pembukaan: string;
  pernyataanLulus: string;
  penutupan: string;
}

const LetterPDF: React.FC<{ data: LetterData }> = ({ data }) => {
  const kopSuratUrl = (() => {
    if (!data.kopSurat) return undefined;
    if (typeof data.kopSurat === 'string') {
      if (data.kopSurat.startsWith('data:image')) return data.kopSurat;
      const mimeType = data.kopSurat.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      return `data:${mimeType};base64,${data.kopSurat}`;
    }
    return URL.createObjectURL(data.kopSurat);
  })();

const signatureUrl = data?.ttdKepalaSekolah && typeof data.ttdKepalaSekolah === 'string'
  ? data.ttdKepalaSekolah.includes('/uploads/assets/')
    ? `https://dev.kiraproject.id${data.ttdKepalaSekolah}`
    : data.ttdKepalaSekolah.includes('data:image')
    ? getStaticFile(data.ttdKepalaSekolah)
    : getStaticFile(data.ttdKepalaSekolah)
  : undefined;

  console.log('signature', data.ttdKepalaSekolah)

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header} fixed>
          <Image src={kopSuratUrl} style={pdfStyles.headerImage} />
        </View>
        <View style={pdfStyles.contentWrapper}>
          {!data.nomorSurat && ( // Conditionally render nomorSurat
           <Text style={pdfStyles.title}>{data.judulSurat || 'Judul Surat'}</Text>
          )}
          {data.nomorSurat && ( // Conditionally render nomorSurat
            <Text style={pdfStyles.title2}>{data.judulSurat || 'Judul Surat'}</Text>
          )}
          {data.nomorSurat && ( // Conditionally render nomorSurat
            <Text style={pdfStyles.letterNumber}>Nomor: {data.nomorSurat}</Text>
          )}
          <View style={pdfStyles.content}>
            <Text>{data.pembukaan.replace('{namaSekolah}', data.namaSekolah)}</Text>
            <Text style={pdfStyles.studentName}>Ahmad Fauzi</Text>
            <Text style={pdfStyles.studentNIS}>NIS: 1234567890</Text>
            <Text style={{ marginTop: 10 }}>{data.pernyataanLulus}</Text>
            <Text style={{ marginTop: 10 }}>{data.penutupan}</Text>
          </View>
          <View style={pdfStyles.signature}>
            <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
            {signatureUrl && (
              <Image src={signatureUrl} style={pdfStyles.signatureImage} />
            )}
            <Text style={pdfStyles.signatureText}>{data.namaKepalaSekolah || 'Nama Kepala Sekolah'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const LetterCreationForm = () => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const profile = useProfile();
  // const school = useSchoolDetail({ id: profile?.user?.sekolahId || 1 });
  const school = useSchool();
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | undefined>(school.data?.[0]?.ttdKepalaSekolah);
  const [isSignatureDirty, setIsSignatureDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const alert = useAlert();

  console.log('school letter', school)

  const handleSignatureChange = () => {
    setIsSignatureDirty(true);
  };

  const form = useForm<z.infer<typeof letterUpdateFormSchema>>({
    resolver: zodResolver(letterUpdateFormSchema),
    mode: "onBlur",
    defaultValues: {
      kopSurat: null,
      ttdKepalaSekolah: null,
      namaKepalaSekolah: "",
      judulSurat: "",
      nomorSurat: "",
      pembukaan: `Kami, pihak {namaSekolah}, dengan bangga mengucapkan selamat atas keberhasilan dalam menyelesaikan pendidikan di sekolah kami. Dengan penuh kebanggaan, kami mengumumkan bahwa:`,
      pernyataanLulus: `Telah lulus dengan hasil yang memuaskan pada tahun ajaran 2024/2025. Hal ini merupakan bukti dari kerja keras, dedikasi, dan semangat belajar yang telah ditunjukkan.`,
      penutupan: `Demikian surat keterangan ini dibuat untuk dapat digunakan sebagaimana mestinya. Kami ucapkan selamat atas kelulusan yang telah diraih, semoga sukses dalam melanjutkan pendidikan ke jenjang yang lebih tinggi dan meraih cita-cita yang diharapkan.`,
    },
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('letterFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      form.reset({
        ...form.getValues(),
        nomorSurat: parsedData.nomorSurat || "",
        pembukaan: parsedData.pembukaan || form.getValues().pembukaan,
        pernyataanLulus: parsedData.pernyataanLulus || form.getValues().pernyataanLulus,
        penutupan: parsedData.penutupan || form.getValues().penutupan,
      });
    }
  }, [form]);

  console.log('school.data?.[0]?.kopSurat', school.data?.[0]?.kopSurat)

  useEffect(() => {
    if (school.data) {
      form.reset({
        kopSurat: school.data?.[0]?.kopSurat || null,
        ttdKepalaSekolah: school.data?.[0]?.ttdKepalaSekolah || null,
        namaKepalaSekolah: school.data?.[0]?.namaKepalaSekolah || "",
        judulSurat: school.data?.[0]?.judulSurat || "",
        nomorSurat: form.getValues().nomorSurat,
        pembukaan: form.getValues().pembukaan,
        pernyataanLulus: form.getValues().pernyataanLulus,
        penutupan: form.getValues().penutupan,
      });
      setSignatureDataUrl(
        school.data?.[0]?.ttdKepalaSekolah
          ? school.data?.[0]?.ttdKepalaSekolah.startsWith('data:image')
            ? school.data?.[0]?.ttdKepalaSekolah
            : `data:image/png;base64,${school.data?.[0]?.ttdKepalaSekolah}`
          : undefined
      );
    }
  }, [school.data, form]);

  const base64ToBlob = (base64: string, contentType: string) => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  async function onSubmit(data: z.infer<typeof letterUpdateFormSchema>) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");

      if (data.namaKepalaSekolah && data.namaKepalaSekolah !== school.data?.[0]?.namaKepalaSekolah) {
        formData.append("namaKepalaSekolah", data.namaKepalaSekolah);
      }
      if (data.judulSurat && data.judulSurat !== school.data?.[0]?.judulSurat) {
        formData.append("judulSurat", data.judulSurat);
      }
      // if (data.nomorSurat) {
      //   formData.append("nomorSurat", data.nomorSurat);
      // }
      if (data.kopSurat !== school.data?.[0]?.kopSurat) {
        if (data.kopSurat instanceof File) {
          formData.append("kopSurat", data.kopSurat);
        } else if (data.kopSurat === null || data.kopSurat === "") {
          formData.append("kopSurat", "");
        } else {
          formData.append("kopSurat", data.kopSurat);
        }
      }
      if (isSignatureDirty && sigCanvas.current && !sigCanvas.current.isEmpty()) {
        const ttdKepalaSekolahBase64 = sigCanvas.current.toDataURL();
        const ttdBlob = base64ToBlob(ttdKepalaSekolahBase64, 'image/png');
        formData.append("ttdKepalaSekolah", ttdBlob, "signature.png");
      } else if (isSignatureDirty && sigCanvas.current?.isEmpty()) {
        formData.append("ttdKepalaSekolah", "");
      }

      // Save custom fields to localStorage
      localStorage.setItem('letterFormData', JSON.stringify({
        nomorSurat: data.nomorSurat,
        pembukaan: data.pembukaan,
        pernyataanLulus: data.pernyataanLulus,
        penutupan: data.penutupan,
      }));

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      };

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/sekolah/${profile?.user?.sekolahId}`,
        formData,
        { headers }
      );

      alert.success("Data surat berhasil diperbarui");
      school.query.refetch();
      navigate("/format/pdf", { replace: true });
    } catch (err: any) {
      console.error("Error saat submit:", err);
      if (err.response) {
        alert.error(err.response.data?.message || "Gagal memperbarui data surat");
      } else if (err.request) {
        alert.error("Gagal memperbarui data surat");
      } else {
        alert.error(err?.message || "Gagal memperbarui data surat");
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
    return <div>Memuat...</div>;
  }

  return (
    <div className="grid gap-6 grid-cols-2 py-6">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
            <div className="flex flex-col gap-6">
              <div>
                <div className="w-full flex items-center border-b mb-6 border-white/10">
                  <div className="py-4 flex gap-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="w-full py-2 active:scale-[0.97]"
                    >
                      {isLoading ? <FaSpinner className="animate animate-spin duration-600" /> : 'Simpan'}
                      <SaveIcon />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="basis-1 sm:basis-1/2">
                    <FormField
                      control={form.control}
                      name="namaKepalaSekolah"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Nama Kepala Sekolah</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nama kepala sekolah"
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
                      name="judulSurat"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Judul Surat</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan judul surat"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="nomorSurat"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Nomor Surat (opsional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="09/D-IV/11/2024"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="pembukaan"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Pembukaan</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Masukkan teks pembukaan"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pernyataanLulus"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Pernyataan Lulus</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Masukkan teks pernyataan lulus"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="penutupan"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Penutupan</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Masukkan teks penutupan"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex border-y border-white/20 py-8 flex-col gap-4 mb-2 mt-10">
                  <div className="basis-1 sm:basis-1/2">
                    <FormField
                      control={form.control}
                      name="kopSurat"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Kop Surat</FormLabel>
                          <FileUploader2
                            value={field.value}
                            onChange={(v) => field.onChange(v)}
                            buttonPlaceholder="Unggah kop surat"
                            onError={(e) => form.setError("kopSurat", { message: e })}
                            showButton={false}
                            error={fieldState.error?.message}
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="basis-1 sm:basis-1/2">
                    <FormLabel>Kop Surat Sebelumnya</FormLabel>
                    <div className="rounded-lg border border-black-90 mt-2 overflow-hidden h-max p-6 flex items-center justify-center">
                      {school?.data?.[0]?.kopSurat ? (
                        <img
                          src={getStaticFile(school?.data?.[0]?.kopSurat)}
                          alt="Kop Surat"
                          className="w-max h-auto rounded-lg"
                        />
                      ) : (
                        <p>Tidak ada kop surat sebelumnya</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex border-b border-white/20 py-8 flex-col gap-4 mb-2 mt-4">
                  <div className="basis-1 sm:basis-1">
                    <FormLabel>{lang.text("signature")}</FormLabel>
                    <div className="flex mt-4 gap-4 items-center">
                      <SignatureDisplay
                        signature={school.data?.[0]?.ttdKepalaSekolah ?? undefined}
                      />
                      <SignatureInput
                        sigCanvas={sigCanvas}
                        onSignatureChange={handleSignatureChange}
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
                    {isLoading ? <FaSpinner className="animate animate-spin duration-600" /> : 'Simpan'}
                    <SaveIcon />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div>
        <PDFViewer style={pdfStyles.viewer}>
          <LetterPDF
            data={{
              namaSekolah: school?.data?.[0].namaSekolah,
              kopSurat: school?.data?.[0]?.kopSurat,
              judulSurat: school?.data?.[0]?.judulSurat,
              nomorSurat: form.watch('nomorSurat'),
              namaKepalaSekolah: school?.data?.[0]?.namaKepalaSekolah,
              ttdKepalaSekolah: signatureDataUrl,
              pembukaan: form.watch('pembukaan'),
              pernyataanLulus: form.watch('pernyataanLulus'),
              penutupan: form.watch('penutupan'),
            }}
          />
        </PDFViewer>
      </div>
    </div>
  );
};