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
} from "@/core/libs"

import { dayjs, lang } from "@/core/libs"
import { useAlert, useParamDecode } from "@/features/_global/hooks"
import { useClassroom } from "@/features/classroom"
import {
  GENDER_OPTIONS,
  STATUS_OPTIONS,
  useUserCreation,
  useUserDetail,
} from "@/features/user"
import { useBiodata } from "@/features/user/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useStudentDetail } from "../hooks"
import { studentEditSchema } from "../utils"

export const StudentCreationForm = () => {
  const { decodeParams } = useParamDecode()
  const resource = useClassroom();
  const detailKelas = useStudentDetail({ id: Number(decodeParams?.id) });
  const detail = useUserDetail(Number(decodeParams?.biodataId))
  const creation = useUserCreation()
  const alert = useAlert()
  const biodata = useBiodata() // 🔹 Untuk otomatis memperbarui tabel siswa setelah update

  console.log('detail', detail.data)
  console.log('detailNew', detailKelas.data)
  console.log('resource', resource.data)
  const navigate = useNavigate()

  // const filteredDataClass = resource?.data && resource?.data?.filter((data) => data?.Sekolah.id === detail?.data?.sekolahId)
  // console.log('filter', filteredDataClass)

  const form = useForm<z.infer<typeof studentEditSchema>>({
    resolver: zodResolver(studentEditSchema),
    mode: "all",
    defaultValues: {
      kelasId: 0,
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
  })

  // 🔹 Perbarui nilai form ketika `detail.data` berubah
  useEffect(() => {
    if (detail.data) {
      console.log("Detail Data Siswa:", detail.data)
      form.reset({
        kelasId: detailKelas.data?.idKelas || 0,
        name: detail.data?.name || "",
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
      })
    }
  }, [detail.data, form])

  async function onSubmit(data: z.infer<typeof studentEditSchema>) {
    try {
      console.log("User ID yang akan diupdate:", decodeParams.id)
      console.log("Data yang dikirim sebelum mapping:", data)

      // 🔹 Hanya kirim data yang berubah
      const updatedData: any = {}

      if (data.image) {
        updatedData.image = data.image
      }

      if (data.name && data.name !== detail.data?.name) {
        updatedData.name = data.name
      }

      if (data.email && data.email !== detail.data?.email) {
        updatedData.email = data.email
      }

      if (
        data.tanggalLahir &&
        data.tanggalLahir !== detail.data?.tanggalLahir
      ) {
        updatedData.tanggalLahir = data.tanggalLahir
      }

      if (data.rfid && data.rfid !== detail.data?.rfid) {
        updatedData.rfid = data.rfid
      }

      if (data.nisn && data.nisn !== detail.data?.nisn) {
        updatedData.nisn = data.nisn
      }

      if (data.nrk && data.nrk !== detail.data?.nrk) {
        updatedData.nrk = data.nrk
      }

      if (data.nikki && data.nikki !== detail.data?.nikki) {
        updatedData.nikki = data.nikki
      }

      // if (data.kelasId && data.kelasId !== detailKelas.data?.idKelas) {
      //   updatedData.kelasId = data.kelasId
      //   console.log('kelasid terbaru:', data.kelasId)
      // }

      if (data.nis && data.nis !== detail.data?.nis) {
        updatedData.nis = data.nis
      }

      if (data.nip && data.nip !== detail.data?.nip) {
        updatedData.nip = data.nip
      }

      if (data.nik && data.nik !== detail.data?.nik) {
        updatedData.nik = data.nik
      }

      if (data.noTlp && data.noTlp !== detail.data?.noTlp) {
        updatedData.noTlp = data.noTlp
      }
      if (data.alamat && data.alamat !== detail.data?.alamat){
        updatedData.alamat = data.alamat
      }

      if (
        data.isActive !== undefined &&
        data.isActive !== detail.data?.isActive
      ) {
        updatedData.isActive = data.isActive
      }

      if (
        data.sekolahId !== undefined &&
        data.sekolahId !== detail.data?.sekolahId
      ) {
        updatedData.sekolahId = data.sekolahId
      }

      // 🔹 Hanya kirim `jenisKelamin` jika diizinkan oleh backend
      if (data.jenisKelamin && data.jenisKelamin !== detail.data?.jenisKelamin) {
        updatedData.jenisKelamin =
          data.jenisKelamin === "Male" ? "Male" : "Female"
      }

      // 🔹 Konversi `isVerified` ke number agar sesuai dengan `UserCreationModel`
      if (
        data.isVerified !== undefined &&
        data.isVerified !== detail.data?.isVerified
      ) {
        updatedData.isVerified = data.isVerified ? 1 : 0
      }

      console.log("Data yang dikirim ke backend:", updatedData)

      await creation.update(Number(decodeParams.id), updatedData)

      alert.success(
        lang.text("successUpdate", { context: lang.text("student") })
      );

      navigate('/students')

      biodata.query.refetch() // ✅ Panggil refetch agar data otomatis diperbarui
    } catch (err: any) {
      console.error("Error saat update:", err)
      alert.error(
        err?.message ||
          lang.text("failUpdate", { context: lang.text("student") })
      )
    }
  }
    
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-lg gap-6">
        {/* <FormField
            control={form.control}
            name="kelasId"
            render={({ field, fieldState }) => (
              <FormItem className="mb-2">
                <FormLabel>{lang.text("classRoom")}</FormLabel>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(x) => field.onChange(Number(x))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={lang.text("selectClassRoom")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {resource.data.map((option, i) => (
                      <SelectItem key={i} value={String(option.id)}>
                        {option.namaKelas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          /> */}
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
          />

          {/* <FormField
            control={form.control}
            name="jenisKelamin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang.text("gender")}</FormLabel>
                <Select
                  value={
                    field.value === "Male"
                      ? "Laki-laki"
                      : field.value === "Female"
                      ? "Perempuan"
                      : ""
                  }
                  onValueChange={(val) => {
                    const mappedValue = val === "Laki-laki" ? "Male" : "Female" // 🔹 Mapping UI ke backend
                    console.log("Jenis Kelamin yang dipilih:", mappedValue)
                    field.onChange(mappedValue)
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={lang.text("selectGender")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
          control = {form.control}
          name = "alamat"
          render = {({field, fieldState}) => (
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
          )}/>

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
                    <Calendar
                      mode="single"
                      // disabled
                      captionLayout="dropdown"
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

          {/* <FormField
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
                      )
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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

          {/* <FormField
  control={form.control}
  name="kelasId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{lang.text("class")}</FormLabel>
      <Select
        value={String(field.value)}
        onValueChange={(v) => field.onChange(Number(v))}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={lang.text("searchClass")} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {classroom.data.map((kelas) => (
            <SelectItem key={kelas.id} value={String(kelas.id)}>
              {kelas.namaKelas}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/> */}
        </div>

        <div className="py-4">
          <Button
            // disabled={
            //   !form.formState.isDirty ||
            //   !form.formState.isValid ||
            //   creation.isLoading
            // }
            type="submit"
          >
            {creation.isLoading
              ? lang.text("saving")
              : lang.text("saveChanges")}
          </Button>
        </div>
      </form>
    </Form>
  )
}





// YANG BARU
/* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   Input,
//   Button,
//   SelectTrigger,
//   Select,
//   SelectValue,
//   SelectContent,
//   SelectItem,
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
//   Calendar,
// } from "@/core/libs"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { dayjs, lang } from "@/core/libs"
// import { useAlert, useParamDecode } from "@/features/_global/hooks"
// import { useSchool } from "@/features/schools"
// import {
//   GENDER_OPTIONS,
//   STATUS_OPTIONS,
//   useUserCreation,
//   useUserDetail,
// } from "@/features/user"
// import { studentEditSchema } from "../utils"
// import { CalendarIcon } from "lucide-react"
// import { useEffect } from "react"
// import { useBiodata } from "@/features/user/hooks"
// import { useNavigate } from "react-router-dom"
// import { useStudentDetail } from "../hooks"
// import { useClassroom } from "@/features/classroom"

// export const StudentCreationForm = () => {
//   const { decodeParams } = useParamDecode()
  
//   const resource = useClassroom();
//   // const detailKelas = useUserDetail(decodedId);
//   const detail = useStudentDetail({ id: Number(decodeParams?.id)});
//   const creation = useUserCreation()
//   const alert = useAlert()
//   const biodata = useBiodata() // 🔹 Untuk otomatis memperbarui tabel siswa setelah update

//   console.log('IDIDIDID', Number(decodeParams?.id))
//   console.log('detail', detail.data)
//   // console.log('detailNew', detailKelas.data)
//   console.log('kelas', resource.data)
//   const navigate = useNavigate()

//   const form = useForm<z.infer<typeof studentEditSchema>>({
//     resolver: zodResolver(studentEditSchema),
//     mode: "all",
//     defaultValues: {
//       kelasId: 0,
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
//       status: 0,
//       sekolahId: 0,
//     },
//   })

//   // 🔹 Perbarui nilai form ketika `detail.data` berubah
//   useEffect(() => {
//     if (detail.data) {
//       console.log("Detail Data Siswa:", detail.data)
//       form.reset({
//         kelasId: detail.data?.kelasId || 0,
//         name: detail.data?.user?.name || "",
//         email: detail.data?.user?.email || "",
//         alamat: detail.data?.user?.alamat || "",
//         hobi: detail.data?.hobi || "",
//         jenisKelamin: detail.data?.user?.jenisKelamin || "",
//         tanggalLahir: detail.data?.tanggalLahir || "",
//         rfid: detail.data?.user?.rfid || "",
//         nisn: detail.data?.user?.nisn || "",
//         nrk: detail.data?.nrk || "",
//         nikki: detail.data?.nikki || "",
//         nis: detail.data?.user?.nis || "",
//         nip: detail.data?.nip || "",
//         nik: detail.data?.user?.nik || "",
//         noTlp: detail.data?.noTlp || "",
//         isVerified: detail.data?.isVerified || false,
//         status: detail.data?.status || 0,
//         isActive: detail.data?.isActive || 0,
//         sekolahId: detail.data?.sekolahId || 0,
//       })
//     }
//   }, [detail.data, form])

//   async function onSubmit(data: z.infer<typeof studentEditSchema>) {
//     try {
//       console.log("User ID yang akan diupdate:", decodeParams.id)
//       console.log("Data yang dikirim sebelum mapping:", data)

//       // 🔹 Hanya kirim data yang berubah
//       const updatedData: any = {}

//       if (data.image) {
//         updatedData.image = data.image
//       }

//       if (data.name && data.name !== detail.data?.name) {
//         updatedData.name = data.name
//       }

//       if (data.kelasId && data.kelasId !== detail.data?.kelasId) {
//         updatedData.kelasId = data.kelasId
//       }

//       if (data.email && data.email !== detail.data?.email) {
//         updatedData.email = data.email
//       }

//       if (
//         data.tanggalLahir &&
//         data.tanggalLahir !== detail.data?.tanggalLahir
//       ) {
//         updatedData.tanggalLahir = data.tanggalLahir
//       }

//       if (data.rfid && data.rfid !== detail.data?.rfid) {
//         updatedData.rfid = data.rfid
//       }

//       if (data.nisn && data.nisn !== detail.data?.nisn) {
//         updatedData.nisn = data.nisn
//       }

//       if (data.nrk && data.nrk !== detail.data?.nrk) {
//         updatedData.nrk = data.nrk
//       }

//       if (data.nikki && data.nikki !== detail.data?.nikki) {
//         updatedData.nikki = data.nikki
//       }

//       if (data.nis && data.nis !== detail.data?.nis) {
//         updatedData.nis = data.nis
//       }

//       if (data.nip && data.nip !== detail.data?.nip) {
//         updatedData.nip = data.nip
//       }

//       if (data.nik && data.nik !== detail.data?.nik) {
//         updatedData.nik = data.nik
//       }

//       if (data.noTlp && data.noTlp !== detail.data?.noTlp) {
//         updatedData.noTlp = data.noTlp
//       }
//       if (data.alamat && data.alamat !== detail.data?.alamat){
//         updatedData.alamat = data.alamat
//       }

//       if (
//         data.isActive !== undefined &&
//         data.isActive !== detail.data?.isActive
//       ) {
//         updatedData.isActive = data.isActive
//       }

//       if (
//         data.sekolahId !== undefined &&
//         data.sekolahId !== detail.data?.sekolahId
//       ) {
//         updatedData.sekolahId = data.sekolahId
//       }

//       // 🔹 Hanya kirim `jenisKelamin` jika diizinkan oleh backend
//       if (data.jenisKelamin && data.jenisKelamin !== detail.data?.jenisKelamin) {
//         updatedData.jenisKelamin =
//           data.jenisKelamin === "Male" ? "Male" : "Female"
//       }

//       // 🔹 Konversi `isVerified` ke number agar sesuai dengan `UserCreationModel`
//       // if (
//       //   data.isVerified !== undefined &&
//       //   data.isVerified !== detail.data?.isVerified
//       // ) {
//       //   updatedData.isVerified = data.isVerified ? 1 : 0
//       // }

//       console.log("Data yang dikirim ke backend:", updatedData)

//       await creation.update(Number(decodeParams.id), updatedData)

//       alert.success(
//         lang.text("successUpdate", { context: lang.text("student") })
//       );

//       navigate('/students')

//       biodata.query.refetch() // ✅ Panggil refetch agar data otomatis diperbarui
//     } catch (err: any) {
//       console.error("Error saat update:", err)
//       alert.error(
//         err?.message ||
//           lang.text("failUpdate", { context: lang.text("student") })
//       )
//     }
//   }
    
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 max-w-lg gap-6">
//           <FormField
//             control={form.control}
//             name="kelasId"
//             render={({ field, fieldState }) => (
//               <FormItem className="mb-2">
//                 <FormLabel>{lang.text("classRoom")}</FormLabel>
//                 <Select
//                   value={field.value ? String(field.value) : undefined}
//                   onValueChange={(x) => field.onChange(Number(x))}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder={lang.text("selectClassRoom")} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {resource.data.map((option, i) => {
//                       return (
//                         <SelectItem key={i} value={String(option.id)}>
//                           {option.namaKelas}
//                         </SelectItem>
//                       )
//                     })}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage>{fieldState.error?.message}</FormMessage>
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field, fieldState }) => (
//               <FormItem>
//                 <FormLabel>{lang.text("studentName")}</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="text"
//                     placeholder={lang.text("inputStudentName")}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage>{fieldState.error?.message}</FormMessage>
//               </FormItem>
//             )}
//           />

//           {/* <FormField
//             control={form.control}
//             name="jenisKelamin"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{lang.text("gender")}</FormLabel>
//                 <Select
//                   value={
//                     field.value === "Male"
//                       ? "Laki-laki"
//                       : field.value === "Female"
//                       ? "Perempuan"
//                       : ""
//                   }
//                   onValueChange={(val) => {
//                     const mappedValue = val === "Laki-laki" ? "Male" : "Female" // 🔹 Mapping UI ke backend
//                     console.log("Jenis Kelamin yang dipilih:", mappedValue)
//                     field.onChange(mappedValue)
//                   }}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder={lang.text("selectGender")} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="Laki-laki">Laki-laki</SelectItem>
//                     <SelectItem value="Perempuan">Perempuan</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           /> */}
//           <FormField
//             control={form.control}
//             name="jenisKelamin"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{lang.text("gender")}</FormLabel>
//                 <Select
//                   value={field.value}
//                   onValueChange={(val) => field.onChange(val)}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder={lang.text("selectGender")} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {GENDER_OPTIONS.map((option, i) => (
//                       <SelectItem key={i} value={option.label}>
//                         {option.value}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field, fieldState }) => (
//               <FormItem>
//                 <FormLabel>{lang.text("email")}</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="email"
//                     placeholder={lang.text("inputEmail")}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage>{fieldState.error?.message}</FormMessage>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="nis"
//             render={({ field, fieldState }) => (
//               <FormItem>
//                 <FormLabel>NIS</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="text"
//                     maxLength={5}
//                     placeholder={lang.text("inputNIS")}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage>{fieldState.error?.message}</FormMessage>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="nisn"
//             render={({ field, fieldState }) => (
//               <FormItem>
//                 <FormLabel>NISN</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="text"
//                     maxLength={10}
//                     placeholder={lang.text("inputNISN")}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage>{fieldState.error?.message}</FormMessage>
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="rfid"
//             render={({ field, fieldState }) => (
//               <FormItem>
//                 <FormLabel>RFID</FormLabel>
//                 <FormControl>
//                   <Input
//                     disabled
//                     type="text"
//                     placeholder={lang.text("inputRFID")}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage>{fieldState.error?.message}</FormMessage>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control = {form.control}
//             name = "alamat"
//             render = {({field, fieldState}) => (
//               <FormItem>
//                 <FormLabel>{lang.text("address")}</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="text"
//                     placeholder={lang.text("address")}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage>{fieldState.error?.message}</FormMessage>
//               </FormItem>
//           )}/>

//           <FormField
//             control={form.control}
//             name="noTlp"
//             render={({ field, fieldState }) => (
//               <FormItem>
//                 <FormLabel>{lang.text("noHP")}</FormLabel>
//                 <FormControl>
//                   <Input
//                     disabled
//                     type="text"
//                     placeholder={lang.text("inputNoHP")}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage>{fieldState.error?.message}</FormMessage>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="tanggalLahir"
//             render={({ field, fieldState }) => (
//               <FormItem className="flex flex-col">
//                 <FormLabel>{lang.text("dateOfBirth")}</FormLabel>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <FormControl>
//                       <Button
//                         disabled
//                         variant={"outline"}
//                         className=" pl-3 text-left font-normal"
//                       >
//                         {field.value ? (
//                           dayjs(field.value).format("DD MMMM YYYY")
//                         ) : (
//                           <span>{lang.text("selectDate")}</span>
//                         )}
//                         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                       </Button>
//                     </FormControl>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="single"
//                       disabled
//                       captionLayout="dropdown"
//                       selected={dayjs(field.value).toDate()}
//                       onSelect={(d) =>
//                         field.onChange(dayjs(d).format("YYYY-MM-DD"))
//                       }
//                       // disabled={forwardDateDisabled}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//                 <FormMessage>{fieldState.error?.message}</FormMessage>
//               </FormItem>
//             )}
//           />

//           {/* <FormField
//             control={form.control}
//             name="isActive"
//             render={({ field }) => (
//               <FormItem className="mb-6">
//                 <FormLabel>{lang.text("status")}</FormLabel>
//                 <Select
//                   value={String(field.value)}
//                   onValueChange={(v) => field.onChange(Number(v))}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder={lang.text("selectLevel")} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {STATUS_OPTIONS.map((option, i) => {
//                       return (
//                         <SelectItem key={i} value={String(option.value)}>
//                           {option.label}
//                         </SelectItem>
//                       )
//                     })}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           /> */}

//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem className="mb-6">
//                 <FormLabel>{lang.text("status")}</FormLabel>
//                 <Select
//                   // disabled
//                   // value={String(field.value)}
//                   value={field.value}
//                   onValueChange={(val) => field.onChange(Number(val))}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder={lang.text("selectLevel")} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {STATUS_OPTIONS.map((option, i) => (
//                       <SelectItem key={i} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* <FormField
//   control={form.control}
//   name="kelasId"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>{lang.text("class")}</FormLabel>
//       <Select
//         value={String(field.value)}
//         onValueChange={(v) => field.onChange(Number(v))}
//       >
//         <FormControl>
//           <SelectTrigger>
//             <SelectValue placeholder={lang.text("searchClass")} />
//           </SelectTrigger>
//         </FormControl>
//         <SelectContent>
//           {classroom.data.map((kelas) => (
//             <SelectItem key={kelas.id} value={String(kelas.id)}>
//               {kelas.namaKelas}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       <FormMessage />
//     </FormItem>
//   )}
// /> */}
//         </div>

//         <div className="py-4">
//           <Button
//             // disabled={
//             //   !form.formState.isDirty ||
//             //   !form.formState.isValid ||
//             //   creation.isLoading
//             // }
//             type="submit"
//           >
//             {creation.isLoading
//               ? lang.text("saving")
//               : lang.text("saveChanges")}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }
