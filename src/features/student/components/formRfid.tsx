// import { useState, useEffect } from "react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
//   Input,
// } from "@/core/libs";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useAlert } from "@/features/_global/hooks";
// import { useBiodata, useUserDetail } from "@/features/user/hooks"; // Mengganti useUserDetail dengan useBiodata
// import { studentEditSchema } from "../utils";
// import { lang } from "@/core/libs";

// interface FormRfidProps {
//   userId: number;
// }

// export const FormRfid: React.FC<FormRfidProps> = ({ userId }) => {
//   const alert = useAlert();
//   const biodata = useBiodata();
//   console.log("user", biodata);

//   // Mengambil ID pengguna dari biodata yang diambil dari hook useBiodata
//   // Sesuaikan dengan struktur data yang ada pada useBiodata

//   if (!userId) {
//     alert.error(lang.text("userNotAuthenticated"));
//     return null;
//   }

//   const detail = useUserDetail(Number(userId)); // Mengambil biodata siswa berdasarkan userId

//   // State untuk loading API
//   const [loadingCreation, setLoadingCreation] = useState(false);

//   const form = useForm<z.infer<typeof studentEditSchema>>({
//     resolver: zodResolver(studentEditSchema),
//     mode: "all",
//     defaultValues: {
//       name: "",
//       email: "",
//       alamat: "",
//       hobi: "",
//       jenisKelamin: "",
//       tanggalLahir: "",
//       rfid: "",
//       nisn: "",
//       nrk: "",
//       nikki: "",
//       nis: "",
//       nip: "",
//       nik: "",
//       noTlp: "",
//       isVerified: false,
//       isActive: 0,
//       sekolahId: 0,
//     },
//   });

//   // Mengatur nilai form setelah data siswa berhasil diambil
//   useEffect(() => {
//     if (detail.data) {
//       console.log("Detail Data Siswa:", detail.data);
//       form.reset({
//         name: detail.data?.name || "",
//         email: detail.data?.email || "",
//         alamat: detail.data?.alamat || "",
//         hobi: detail.data?.hobi || "",
//         jenisKelamin: detail.data?.jenisKelamin || "",
//         tanggalLahir: detail.data?.tanggalLahir || "",
//         rfid: detail.data?.rfid || "",
//         nisn: detail.data?.nisn || "",
//         nrk: detail.data?.nrk || "",
//         nikki: detail.data?.nikki || "",
//         nis: detail.data?.nis || "",
//         nip: detail.data?.nip || "",
//         nik: detail.data?.nik || "",
//         noTlp: detail.data?.noTlp || "",
//         isVerified: detail.data?.isVerified || false,
//         isActive: detail.data?.isActive || 0,
//         sekolahId: detail.data?.sekolahId || 0,
//       });
//     }
//   }, [detail.data, form]);

//   // Fungsi untuk meng-handle submit form
//   async function onSubmit(data: z.infer<typeof studentEditSchema>) {
//     console.log("Submitting RFID for student ID:", userId); // Log userId

//     setLoadingCreation(true); // Menandakan bahwa request sedang diproses

//     try {
//       const updatedData: Record<string, any> = {};

//       // Periksa apakah ada perubahan pada field
//       if (data.image) updatedData.image = data.image;
//       if (data.name && data.name !== detail.data?.name)
//         updatedData.name = data.name;
//       if (data.email && data.email !== detail.data?.email)
//         updatedData.email = data.email;
//       if (data.tanggalLahir && data.tanggalLahir !== detail.data?.tanggalLahir)
//         updatedData.tanggalLahir = data.tanggalLahir;
//       if (data.rfid && data.rfid !== detail.data?.rfid)
//         updatedData.rfid = data.rfid;
//       if (data.nisn && data.nisn !== detail.data?.nisn)
//         updatedData.nisn = data.nisn;
//       if (data.nrk && data.nrk !== detail.data?.nrk) updatedData.nrk = data.nrk;
//       if (data.nikki && data.nikki !== detail.data?.nikki)
//         updatedData.nikki = data.nikki;
//       if (data.nis && data.nis !== detail.data?.nis) updatedData.nis = data.nis;
//       if (data.nip && data.nip !== detail.data?.nip) updatedData.nip = data.nip;
//       if (data.nik && data.nik !== detail.data?.nik) updatedData.nik = data.nik;
//       if (data.noTlp && data.noTlp !== detail.data?.noTlp)
//         updatedData.noTlp = data.noTlp;
//       if (
//         data.isActive !== undefined &&
//         data.isActive !== detail.data?.isActive
//       )
//         updatedData.isActive = data.isActive;
//       if (
//         data.sekolahId !== undefined &&
//         data.sekolahId !== detail.data?.sekolahId
//       )
//         updatedData.sekolahId = data.sekolahId;
//       if (data.jenisKelamin && data.jenisKelamin !== detail.data?.jenisKelamin)
//         updatedData.jenisKelamin = data.jenisKelamin;
//       if (
//         data.isVerified !== undefined &&
//         data.isVerified !== detail.data?.isVerified
//       )
//         updatedData.isVerified = data.isVerified ? 1 : 0;

//       // Menyusun base URL dari environment variable
//       const apiUrl = `${
//         import.meta.env.VITE_API_BASE_URL
//       }/api/update-user/${userId}`;

//       // Ambil token dari localStorage (atau tempat penyimpanan lainnya)
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("User is not authenticated");
//       }

//       // Call API dengan base URL dan Authorization header
//       const response = await fetch(apiUrl, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Menambahkan token ke header
//         },
//         body: JSON.stringify(updatedData),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to update student Rfid butuh 8: ${response.statusText}`);
//       }

//       alert.success(
//         lang.text("successUpdate", { context: lang.text("student") })
//       );
//     } catch (err: any) {
//       console.error("Error updating student:", err);
//       alert.error(
//         err?.message ||
//           lang.text("failUpdate", { context: lang.text("student") })
//       );
//     } finally {
//       setLoadingCreation(false); // Reset loading state setelah API selesai
//     }
//   }

//   useEffect(() => {
//     if (form.formState.isDirty && form.formState.isValid) {
//       onSubmit(form.getValues());
//     }
//   }, [form.formState.isDirty, form.formState.isValid, form]);

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
//       <div className="w-full flex flex-col gap-1">
//   <FormField
//     control={form.control}
//     name="rfid"
//     render={({ field, fieldState }) => (
//       <FormItem className="w-full">
//         <FormControl>
//           <Input
//             className="h-8 text-sm px-2 mt-3"
//             type="text"
//             placeholder={lang.text("inputRFID")}
//             {...field}
//             maxLength={10}
//           />
//         </FormControl>
//         {fieldState.error?.message && (
//           <p className="text-xs text-red-500 mt-0.5">
//             {fieldState.error.message}
//           </p>
//         )}
//       </FormItem>
//     )}
//   />
// </div>

//       </form>
//     </Form>
//   );
// };

import { useState, useEffect, useRef } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@/core/libs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAlert } from "@/features/_global/hooks";
import { useUserDetail } from "@/features/user/hooks";
import { studentEditSchema } from "../utils";
import { lang } from "@/core/libs";

interface FormRfidProps {
  userId: number;
  onSuccess?: () => void;
}

export const FormRfid: React.FC<FormRfidProps> = ({ userId, onSuccess }) => {
  const alert = useAlert();
  const detail = useUserDetail(Number(userId));
  const [loading, setLoading] = useState(false);
  const hasSubmittedRef = useRef(false); // ⛔️ Cegah loop
  const prevRFIDRef = useRef<string | null>(null); // Cegah submit ulang RFID yang sama
  const [submittingRfid, setSubmittingRfid] = useState(false); // 👉 tambahkan ini

  const form = useForm<z.infer<typeof studentEditSchema>>({
    resolver: zodResolver(studentEditSchema),
    mode: "all",
    defaultValues: { rfid: "" },
  });

  useEffect(() => {
    if (detail.data?.rfid) {
      form.setValue("rfid", detail.data.rfid);
    }
  }, [detail.data?.rfid, form]);

  // ⛔️ Cegah loop dari form.reset
  const rfidValue = form.watch("rfid");

  useEffect(() => {
    const isValid = form.formState.isValid;
    const isDirty = form.formState.isDirty;
    const hasSubmitted = hasSubmittedRef.current;
  
    if (
      !submittingRfid &&
      isDirty &&
      isValid &&
      !hasSubmitted &&
      rfidValue &&
      rfidValue.length >= 8 &&
      rfidValue !== prevRFIDRef.current
    ) {
      prevRFIDRef.current = rfidValue;
      hasSubmittedRef.current = true;
      setSubmittingRfid(true); // 👉 tambahkan ini
      onSubmit(form.getValues());
    }else if (rfidValue !== prevRFIDRef.current) {
      // Hanya reset flag kalau RFID berubah
      hasSubmittedRef.current = false;
    }
  }, [rfidValue, form, submittingRfid]);
  

  async function onSubmit(data: z.infer<typeof studentEditSchema>) {
    setLoading(true);
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/update-user/${userId}`;
      const token = localStorage.getItem("token");

      if (!token) throw new Error("User not authenticated");

      const payload = { rfid: data.rfid };
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("RFID update failed");

      alert.success(lang.text("successUpdate", { context: lang.text("student") }));
      onSuccess?.(); 
    } catch (err: any) {
      alert.error(err.message || lang.text("failUpdate", { context: lang.text("student") }));
    } finally {
      setLoading(false);
      setSubmittingRfid(false); 
    }
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="rfid"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="text"
                  maxLength={20}
                  placeholder={lang.text("inputRFID")}
                  {...field}
                  className="h-8 text-sm px-2 mt-3"
                  disabled={loading}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
