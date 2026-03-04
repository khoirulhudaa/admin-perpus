// // /* eslint-disable @typescript-eslint/no-explicit-any */
// import { zodResolver } from "@hookform/resolvers/zod"
// import {
//   Button,
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   Input,
// } from "@/core/libs"
// import { Link, useNavigate } from "react-router-dom"
// import { SchoolCreationFormSchema, schoolCreationFormSchema } from "../utils"
// import { useForm } from "react-hook-form"
// import { FileUploader, InputMap, useAlert } from "@/features/_global"
// import { useSchoolCreation } from "../hooks"
// import { lang, simpleEncode } from "@/core/libs"
// import { z } from "zod"
// import { useEffect, useState } from "react"
// import { getCoordinates, requestLocationPermission } from "@/core/utils"
// import { Eye, EyeOff } from "lucide-react"

// export function SchoolRegisterForm() {
//   const schoolCreation = useSchoolCreation()
//   const navigate = useNavigate()
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const alert = useAlert()

//   const form = useForm<z.infer<SchoolCreationFormSchema>>({
//     resolver: zodResolver(schoolCreationFormSchema),
//     mode: "onBlur",
//     defaultValues: {
//       alamatSekolah: "",
//       schoolName: "",
//       schoolNPSN: "",
//       schoolLogo: null,
//       schoolFile: null,
//       schoolStatus: "0",
//       schoolAdmin: "",
//       moodleApiUrl: "",
//       tokenMoodle: "",
//       libraryServer: "",
//       location: {
//         lat: 0,
//         lng: 0,
//       },
//     },
//   })

//   async function onSubmit(data: z.infer<SchoolCreationFormSchema>) {
//     console.log("data", data)
//     try {
//       await schoolCreation.register({
//         namaSekolah: data.schoolName,
//         npsn: data.schoolNPSN,
//         namaAdmin: data.schoolAdmin,
//         latitude: data.location.lat,
//         longitude: data.location.lng,
//         tokenModel: data.tokenMoodle,
//         email: data.email,
//         password: data.password,
//         modelApiUrl: data.moodleApiUrl,
//         file: data.schoolFile,
//       })

//       const otpZ = JSON.stringify({
//         email: data.email,
//         navigateTo: "/auth/login",
//       })

//       const encodedOtpZ = simpleEncode(otpZ)

//       navigate(`/otp?z=${encodedOtpZ}`, { replace: true })
//     } catch (err: any) {
//       console.log("err =>", err)
//       alert.error(
//         err?.message ||
//           lang.text("failed", {
//             context: lang.text("addSchool"),
//           })
//       )
//     }
//   }

//   useEffect(() => {
//     requestLocationPermission().then(() => {
//       getCoordinates()
//         .then((res) => {
//           form.setValue("location", {
//             lat: res.latitude,
//             lng: res.longitude,
//           })
//         })
//         .catch((err: any) => {
//           alert.error(err?.message || lang.text("errSystem"))
//         })
//     })
//   }, [alert, form])

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)}>
//         <Card className="mx-auto max-w-xl w-full">
//           <CardHeader>
//             <CardTitle className="text-2xl">
//               {lang.text("registerYourSchool")}
//             </CardTitle>
//             <CardDescription>
//               {lang.text("registerYourSchoolDesc")}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="schoolName"
//                   render={({ field, fieldState }) => (
//                     <FormItem>
//                       <FormLabel>{lang.text("schoolName")}</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder={lang.text("inputSchoolName")}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage>{fieldState.error?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="schoolNPSN"
//                   render={({ field, fieldState }) => (
//                     <FormItem>
//                       <FormLabel>{lang.text("npsn")}</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Masukan nama sekolah" {...field} />
//                       </FormControl>
//                       <FormMessage>{fieldState.error?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />
//                 <div className="col-span-2">
//                   <FormField
//                     control={form.control}
//                     name="location"
//                     render={({ field }) => (
//                       <InputMap
//                         label="Pilih Lokasi Peta"
//                         onChange={(v) => field.onChange(v)}
//                         value={field.value}
//                       />
//                     )}
//                   />
//                 </div>
//                 <FormField
//                   control={form.control}
//                   name="schoolAdmin"
//                   render={({ field, fieldState }) => (
//                     <FormItem>
//                       <FormLabel>{lang.text("adminName")}</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder={lang.text("inputAdminName")}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage>{fieldState.error?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="alamatSekolah"
//                   render={({ field, fieldState }) => (
//                     <FormItem>
//                       <FormLabel>{lang.text("alamatSekolah")}</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Masukkan alamat sekolah"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage>{fieldState.error?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field, fieldState }) => (
//                     <FormItem>
//                       <FormLabel>{lang.text("adminEmail")}</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="email"
//                           placeholder={lang.text("inputAdminEmail")}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage>{fieldState.error?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />
//                 <>
//                   <FormField
//                     control={form.control}
//                     name="password"
//                     render={({ field, fieldState }) => (
//                       <FormItem>
//                         <FormLabel>{lang.text("password")}</FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <Input
//                               type={showPassword ? "text" : "password"}
//                               autoComplete="off"
//                               placeholder={lang.text("inputPassword")}
//                               {...field}
//                               className="pr-10"
//                             />
//                             <button
//                               type="button"
//                               className="absolute inset-y-0 right-0 flex items-center px-3"
//                               onClick={() => setShowPassword(!showPassword)}
//                             >
//                               {showPassword ? (
//                                 <EyeOff size={20} />
//                               ) : (
//                                 <Eye size={20} />
//                               )}
//                             </button>
//                           </div>
//                         </FormControl>
//                         <FormMessage>{fieldState.error?.message}</FormMessage>
//                       </FormItem>
//                     )}
//                   />
//                   {/* Input Confirm Password */}
//                   <FormField
//                     control={form.control}
//                     name="confirmPassword"
//                     render={({ field, fieldState }) => (
//                       <FormItem>
//                         <FormLabel>{lang.text("confirmPassword")}</FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <Input
//                               type={showConfirmPassword ? "text" : "password"}
//                               autoComplete="off"
//                               placeholder={lang.text("inputConfirmPassword")}
//                               {...field}
//                               className="pr-10"
//                             />
//                             <button
//                               type="button"
//                               className="absolute inset-y-0 right-0 flex items-center px-3"
//                               onClick={() =>
//                                 setShowConfirmPassword(!showConfirmPassword)
//                               }
//                             >
//                               {showConfirmPassword ? (
//                                 <EyeOff size={20} />
//                               ) : (
//                                 <Eye size={20} />
//                               )}
//                             </button>
//                           </div>
//                         </FormControl>
//                         <FormMessage>{fieldState.error?.message}</FormMessage>
//                       </FormItem>
//                     )}
//                   />
//                 </>
//                 <FormField
//                   control={form.control}
//                   name="moodleApiUrl"
//                   render={({ field, fieldState }) => (
//                     <FormItem>
//                       <FormLabel>{lang.text("moodleApiUrl")}</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder={lang.text("inputMoodleApiUrl")}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage>{fieldState.error?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="tokenMoodle"
//                   render={({ field, fieldState }) => (
//                     <FormItem>
//                       <FormLabel>{lang.text("tokenMoodle")}</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder={lang.text("inputTokenMoodle")}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage>{fieldState.error?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />
//                 <div className="col-span-2">
//                   <FormField
//                     control={form.control}
//                     name="schoolFile"
//                     render={({ field, fieldState }) => (
//                       <FormItem>
//                         <FormLabel>{lang.text("schoollogo")}</FormLabel>
//                         <FileUploader
//                           value={field.value}
//                           onChange={(v) => field.onChange(v)}
//                           buttonPlaceholder="Upload berkas sekolah"
//                           onError={(e) =>
//                             form.setError("schoolFile", { message: e })
//                           }
//                           showButton={false}
//                           error={fieldState.error?.message}
//                         />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </div>
//               <Button type="submit" className="w-full">
//                 {lang.text("register")}
//               </Button>
//             </div>
//             <div className="mt-4 text-center text-sm">
//               {lang.text("needHelp")}{" "}
//               <Link to="#" className="underline">
//                 {lang.text("contactUs")}
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </form>
//     </Form>
//   )
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/core/libs"
import { useNavigate } from "react-router-dom"
import { SchoolCreationFormSchema, schoolCreationFormSchema } from "../utils"
import { useForm } from "react-hook-form"
import { FileUploader, InputMap, useAlert } from "@/features/_global"
import { lang, simpleEncode } from "@/core/libs"
import { z } from "zod"
import { useEffect, useState } from "react"
import { getCoordinates, requestLocationPermission } from "@/core/utils"
import { Eye, EyeOff, GraduationCap, Building2, Mail, Lock, User } from "lucide-react"
import { useSchoolCreation } from "@/features/auth/hooks/useAuth"

export function SchoolRegisterForm() {
  const schoolCreation = useSchoolCreation()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const alert = useAlert()

  const form = useForm<z.infer<SchoolCreationFormSchema>>({
    resolver: zodResolver(schoolCreationFormSchema),
    mode: "onBlur",
    defaultValues: {
      alamatSekolah: "",
      schoolName: "",
      schoolNPSN: "",
      schoolLogo: null,
      schoolFile: null,
      schoolAdmin: "",
      location: { lat: 0, lng: 0 },
    },
  })

  async function onSubmit(data: z.infer<SchoolCreationFormSchema>) {
    try {
      await schoolCreation.register({
        npsn: data.schoolNPSN,
        schoolName: data.schoolName,   // Konsisten: schoolName
        adminName: data.schoolAdmin,    // Konsisten: adminName
        address: data.alamatSekolah,   // Konsisten: address
        latitude: data.location.lat,
        longitude: data.location.lng,
        email: data.email,
        password: data.password,
        file: data.schoolFile,         // Dikirim ke hook sebagai 'file'
      });

      const otpData = JSON.stringify({ email: data.email });
      const encodedZ = simpleEncode(otpData);
      alert.success("Registrasi berhasil! Cek email untuk kode PIN.");
      navigate(`/otp?z=${encodedZ}`, { replace: true });
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Terjadi kesalahan sistem";
      alert.error(errorMsg);
    }
  }

  useEffect(() => {
    requestLocationPermission().then(() => {
      getCoordinates().then((res) => {
        form.setValue("location", { lat: res.latitude, lng: res.longitude })
      }).catch((err: any) => {
        alert.error(err?.message || lang.text("errSystem"))
      })
    })
  }, [alert, form])

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 flex items-center justify-center bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl">
          <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-blue-500/10 overflow-hidden">
            {/* Header dengan aksen Biru */}
            <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />
            
            <CardHeader className="space-y-1 pb-8 text-center">
              <div className="mx-auto bg-blue-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
                <GraduationCap className="text-blue-500 w-8 h-8" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-white">
                {lang.text("registerYourSchool")}
              </CardTitle>
              <CardDescription className="text-blue-200/50 text-base">
                Lengkapi data sekolah untuk mulai menggunakan layanan kami
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* School Name */}
                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100/70">Nama Sekolah</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 w-4 h-4 text-blue-500/50" />
                          <Input className="bg-white/5 border-white/10 pl-10 focus:border-blue-500 focus:ring-blue-500/20 text-white rounded-xl transition-all" placeholder="SMK Negeri 1..." {...field} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* NPSN */}
                <FormField
                  control={form.control}
                  name="schoolNPSN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100/70">NPSN</FormLabel>
                      <FormControl>
                        <Input className="bg-white/5 border-white/10 focus:border-blue-500 focus:ring-blue-500/20 text-white rounded-xl transition-all" placeholder="1234xxxx" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Admin Name */}
                <FormField
                  control={form.control}
                  name="schoolAdmin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100/70">Nama Lengkap Admin</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-blue-500/50" />
                          <Input className="bg-white/5 border-white/10 pl-10 focus:border-blue-500 focus:ring-blue-500/20 text-white rounded-xl" placeholder="John Doe" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100/70">Email Institusi</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-blue-500/50" />
                          <Input type="email" className="bg-white/5 border-white/10 pl-10 focus:border-blue-500 focus:ring-blue-500/20 text-white rounded-xl" placeholder="admin@school.id" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Map Section - Full Width */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <div className="rounded-xl px-4 overflow-hidden border border-white/10 bg-white/5 p-1">
                         <InputMap
                          label="Lokasi Presensi Sekolah"
                          onChange={(v) => field.onChange(v)}
                          value={field.value}
                        />
                      </div>
                    )}
                  />
                </div>

                {/* Address */}
                <FormField
                  control={form.control}
                  name="alamatSekolah"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel className="text-blue-100/70">Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Input className="bg-white/5 border-white/10 focus:border-blue-500 text-white rounded-xl" placeholder="Jl. Raya Utama No. 1..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Passwords */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100/70">Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-blue-500/50" />
                        <Input type={showPassword ? "text" : "password"} className="bg-white/5 border-white/10 pl-10 pr-10 focus:border-blue-500 text-white rounded-xl" {...field} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-white/30 hover:text-blue-400">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100/70">Konfirmasi Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-blue-500/50" />
                        <Input type={showConfirmPassword ? "text" : "password"} className="bg-white/5 border-white/10 pl-10 pr-10 focus:border-blue-500 text-white rounded-xl" {...field} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-white/30 hover:text-blue-400">
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Logo Upload - Full Width */}
                <div className="col-span-1 md:col-span-2 py-2">
                  <FormField
                    control={form.control}
                    name="schoolFile"
                    render={({ field, fieldState }) => (
                      <FormItem className="bg-blue-600/5 border-2 border-dashed border-blue-500/20 rounded-2xl p-4 transition-colors hover:bg-blue-600/10">
                        <FormLabel className="text-blue-100/70 text-center block mb-2">Unggah Logo Sekolah</FormLabel>
                        <FileUploader
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                          buttonPlaceholder="Klik untuk memilih file logo"
                          error={fieldState.error?.message}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all transform hover:scale-[1.01] active:scale-[0.98]"
              >
                {schoolCreation.isLoading ? "Memproses..." : "Daftarkan Sekolah Sekarang"}
              </Button>

              <p className="text-center text-sm text-slate-500 mt-4">
                Sudah punya akun sekolah?{" "}
                <button type="button" onClick={() => navigate('/auth/login')} className="text-blue-400 font-semibold hover:underline cursor-pointer">
                  Masuk di sini
                </button>
              </p>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}