// import { useSchool } from "@/features/schools";
// import clsx from "clsx";
// import { AnimatePresence, motion } from "framer-motion";
// import { Plus, User, X, Upload, Loader } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";

// const API_BASE_URL = "https://be-school.kiraproject.id";
// const OSIS_API_BASE = `${API_BASE_URL}/osis`;

// const getAuthHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
//   // Content-Type tidak perlu diset manual saat pakai FormData
// });

// const apiFetch = async (url: string, options = {}) => {
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       ...getAuthHeaders(),
//       ...options.headers,
//     },
//   });
//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || `HTTP error! Status: ${response.status}`);
//   }
//   return data;
// };

// const useAlert = () => {
//   const [alert, setAlert] = useState({ message: "", isVisible: false });
//   const showAlert = useCallback((message: string) => {
//     setAlert({ message, isVisible: true });
//     setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
//   }, []);
//   const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
//   return { alert, showAlert, hideAlert };
// };

// const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
//   const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={`mb-4 rounded-xl border p-4 text-sm ${
//         isSuccess
//           ? "border-green-500/30 bg-green-500/10 text-green-300"
//           : "border-red-500/30 bg-red-500/10 text-red-300"
//       }`}
//     >
//       <div className="flex items-start justify-between">
//         <div className="whitespace-pre-line">{message}</div>
//         <button type="button" onClick={onClose} className="ml-4 text-xl">
//           ✕
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export const OsisMain = () => {
//   const { alert, showAlert, hideAlert } = useAlert();
//   const schoolData = useSchool();
//   const schoolId = schoolData?.data?.[0]?.id;

//   const [modal, setModal] = useState<"editOsis" | null>(null);
//   const [dark] = useState(true);

//   const [osisData, setOsisData] = useState<any>(null);
//   const [loadingOsis, setLoadingOsis] = useState(true);
//   const [savingOsis, setSavingOsis] = useState(false);

//   const [formData, setFormData] = useState<any>({
//     periodeSaatIni: "",
//     ketuaNama: "",
//     ketuaNipNuptk: "",
//     ketuaFotoUrl: "",
//     ketuaFotoFile: null,
//     ketuaFotoPreview: "",
//     wakilNama: "",
//     wakilNipNuptk: "",
//     wakilFotoUrl: "",
//     wakilFotoFile: null,
//     wakilFotoPreview: "",
//     bendaharaNama: "",
//     bendaharaNipNuptk: "",
//     bendaharaFotoUrl: "",
//     bendaharaFotoFile: null,
//     bendaharaFotoPreview: "",
//     sekretarisNama: "",
//     sekretarisNipNuptk: "",
//     sekretarisFotoUrl: "",
//     sekretarisFotoFile: null,
//     sekretarisFotoPreview: "",
//     visi: "",
//     misi: [""],
//     prestasiSaatIni: [],
//   });

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", dark);
//   }, [dark]);

//   useEffect(() => {
//     if (!schoolId) return;

//     const fetchOsis = async () => {
//       setLoadingOsis(true);
//       try {
//         const res = await apiFetch(`${OSIS_API_BASE}?schoolId=${schoolId}`);
//         if (res.success && res.data) {
//           const data = res.data;
//           setOsisData(data);
//           setFormData({
//             periodeSaatIni: data.periodeSaatIni || "",
//             ketuaNama: data.ketuaNama || "",
//             ketuaNipNuptk: data.ketuaNipNuptk || "",
//             ketuaFotoUrl: data.ketuaFotoUrl || "",
//             ketuaFotoFile: null,
//             ketuaFotoPreview: "",
//             wakilNama: data.wakilNama || "",
//             wakilNipNuptk: data.wakilNipNuptk || "",
//             wakilFotoUrl: data.wakilFotoUrl || "",
//             wakilFotoFile: null,
//             wakilFotoPreview: "",
//             bendaharaNama: data.bendaharaNama || "",
//             bendaharaNipNuptk: data.bendaharaNipNuptk || "",
//             bendaharaFotoUrl: data.bendaharaFotoUrl || "",
//             bendaharaFotoFile: null,
//             bendaharaFotoPreview: "",
//             sekretarisNama: data.sekretarisNama || "",
//             sekretarisNipNuptk: data.sekretarisNipNuptk || "",
//             sekretarisFotoUrl: data.sekretarisFotoUrl || "",
//             sekretarisFotoFile: null,
//             sekretarisFotoPreview: "",
//             visi: data.visi || "",
//             misi: Array.isArray(data.misi) ? data.misi : [""],
//             prestasiSaatIni: Array.isArray(data.prestasiSaatIni) ? data.prestasiSaatIni : [],
//           });
//         }
//       } catch (err) {
//         console.error("Fetch OSIS failed:", err);
//         showAlert("Gagal memuat data OSIS");
//       } finally {
//         setLoadingOsis(false);
//       }
//     };

//     fetchOsis();
//   }, [schoolId, showAlert]);

//   const updateForm = (key: string, value: any) => {
//     setFormData((prev: any) => ({ ...prev, [key]: value }));
//   };

//   const updateMisi = (index: number, value: string) => {
//     setFormData((prev: any) => {
//       const newMisi = [...prev.misi];
//       newMisi[index] = value;
//       return { ...prev, misi: newMisi };
//     });
//   };

//   const addMisi = () => updateForm("misi", [...formData.misi, ""]);

//   const removeMisi = (index: number) =>
//     updateForm("misi", formData.misi.filter((_: any, i: number) => i !== index));

//   const addPrestasi = () =>
//     updateForm("prestasiSaatIni", [
//       ...formData.prestasiSaatIni,
//       { judul: "", deskripsi: "", tahun: new Date().getFullYear().toString() },
//     ]);

//   const updatePrestasi = (index: number, field: string, value: string) => {
//     const newPrestasi = [...formData.prestasiSaatIni];
//     newPrestasi[index] = { ...newPrestasi[index], [field]: value };
//     updateForm("prestasiSaatIni", newPrestasi);
//   };

//   const removePrestasi = (index: number) =>
//     updateForm("prestasiSaatIni", formData.prestasiSaatIni.filter((_: any, i: number) => i !== index));

//   const handleFileChange = (role: string, e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       const previewUrl = URL.createObjectURL(file);
//       updateForm(`${role}FotoFile`, file);
//       updateForm(`${role}FotoPreview`, previewUrl);
//     }
//   };

//   const handleSubmitOsis = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSavingOsis(true);

//     try {
//       const formPayload = new FormData();

//       formPayload.append("schoolId", schoolId?.toString() || "");
//       formPayload.append("periodeSaatIni", formData.periodeSaatIni);
//       formPayload.append("ketuaNama", formData.ketuaNama);
//       formPayload.append("ketuaNipNuptk", formData.ketuaNipNuptk);
//       formPayload.append("wakilNama", formData.wakilNama);
//       formPayload.append("wakilNipNuptk", formData.wakilNipNuptk);
//       formPayload.append("bendaharaNama", formData.bendaharaNama);
//       formPayload.append("bendaharaNipNuptk", formData.bendaharaNipNuptk);
//       formPayload.append("sekretarisNama", formData.sekretarisNama);
//       formPayload.append("sekretarisNipNuptk", formData.sekretarisNipNuptk);
//       formPayload.append("visi", formData.visi);
//       formPayload.append("misi", JSON.stringify(formData.misi.filter((m: string) => m.trim())));
//       formPayload.append("prestasiSaatIni", JSON.stringify(formData.prestasiSaatIni));

//       // Append files jika ada
//       if (formData.ketuaFotoFile) formPayload.append("ketuaFoto", formData.ketuaFotoFile);
//       if (formData.wakilFotoFile) formPayload.append("wakilFoto", formData.wakilFotoFile);
//       if (formData.bendaharaFotoFile) formPayload.append("bendaharaFoto", formData.bendaharaFotoFile);
//       if (formData.sekretarisFotoFile) formPayload.append("sekretarisFoto", formData.sekretarisFotoFile);

//       const response = await fetch(OSIS_API_BASE, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: formPayload,
//       });

//       const res = await response.json();

//       if (!response.ok) {
//         throw new Error(res.message || "Gagal menyimpan data");
//       }

//       if (res.success) {
//         setOsisData(res.data);
//         showAlert("Data OSIS berhasil diperbarui!");
//         setModal(null);
//       }
//     } catch (err: any) {
//       showAlert(`Gagal menyimpan: ${err.message}`);
//     } finally {
//       setSavingOsis(false);
//     }
//   };

//   // Cleanup preview URLs saat unmount modal
//   useEffect(() => {
//     return () => {
//       ["ketua", "wakil", "bendahara", "sekretaris"].forEach(role => {
//         if (formData[`${role}FotoPreview`]) {
//           URL.revokeObjectURL(formData[`${role}FotoPreview`]);
//         }
//       });
//     };
//   }, [formData, modal]);

//   const roles = [
//     { key: "ketua", title: "Ketua OSIS" },
//     { key: "wakil", title: "Wakil Ketua" },
//     { key: "bendahara", title: "Bendahara" },
//     { key: "sekretaris", title: "Sekretaris" },
//   ];

//   const Icon = ({ label }: { label: string }) => (
//     <span
//       aria-hidden
//       className="inline-block align-middle select-none"
//       style={{ width: 16 }}
//     >
//       {label}
//     </span>
//   );
//   const ISave = () => <Icon label="💾" />;

//   return (
//     <div className="w-full pt-4">
//       <div className="flex items-center gap-3 mb-5 flex-wrap">
//         <button
//           onClick={() => setModal("editOsis")}
//           className="px-3 gap-2 py-2 flex items-center rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
//         >
//           <ISave /> Perbarui Data OSIS
//         </button>
//       </div>
//       <div className={clsx("min-h-screen rounded-xl", dark ? "dark bg-white/5 text-zinc-100" : "bg-zinc-50 text-zinc-900")}>
//         <main className="max-w-7xl mx-auto py-5 px-5">
//           <AnimatePresence>
//             {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
//           </AnimatePresence>


//           {loadingOsis ? (
//             <div className="text-center py-12 text-zinc-500">Memuat data OSIS...</div>
//           ) : (
//             <div className="space-y-8">
//               {/* Pengurus Saat Ini */}
//               <section>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//                   {roles.map((role, i) => {
//                     const data = osisData?.[`${role.key}Nama`]
//                       ? {
//                           nama: osisData[`${role.key}Nama`],
//                           nip: osisData[`${role.key}NipNuptk`],
//                           foto: osisData[`${role.key}FotoUrl`],
//                         }
//                       : null;

//                     return (
//                       <motion.div
//                         key={role.key}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: i * 0.1 }}
//                         className="rounded-xl border border-zinc-700/50 bg-black/30 p-5 backdrop-blur-sm text-center"
//                       >
//                         {data?.foto ? (
//                           <img
//                             src={data.foto}
//                             alt={data.nama}
//                             className="mx-auto mb-4 h-24 w-24 rounded-full object-cover border-2 border-zinc-700 shadow-lg"
//                           />
//                         ) : (
//                           <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
//                             <User size={40} />
//                           </div>
//                         )}
//                         <h4 className="font-semibold text-lg">{role.title}</h4>
//                         <p className="mt-1 text-sm text-zinc-300">{data?.nama || "—"}</p>
//                         {data?.nip && <p className="mt-1 text-xs text-zinc-500">NIP/NUPTK: {data.nip}</p>}
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               </section>

//               {/* Visi & Misi */}
//               <section className="rounded-xl border border-zinc-700/50 bg-black/30 p-6 backdrop-blur-sm">
//                 <h3 className="text-xl font-bold mb-4">Visi & Misi</h3>
//                 {osisData?.visi ? (
//                   <>
//                     <div className="mb-6">
//                       <h4 className="font-medium text-emerald-400 mb-2">Visi</h4>
//                       <p className="text-zinc-300 whitespace-pre-line">{osisData.visi}</p>
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-emerald-400 mb-2">Misi</h4>
//                       <ul className="ml-5 list-disc space-y-2 text-zinc-300">
//                         {osisData.misi?.map((m: string, idx: number) => (
//                           <li key={idx}>{m}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   </>
//                 ) : (
//                   <p className="text-zinc-500 italic">Belum ada visi & misi untuk periode ini</p>
//                 )}
//               </section>

//               {/* Prestasi */}
//               <section className="rounded-xl border border-zinc-700/50 bg-black/30 p-6 backdrop-blur-sm">
//                 <h3 className="text-xl font-bold mb-4">Prestasi Periode Ini</h3>
//                 {osisData?.prestasiSaatIni?.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {osisData.prestasiSaatIni.map((p: any, idx: number) => (
//                       <div key={idx} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
//                         <h4 className="font-medium text-emerald-400">{p.judul}</h4>
//                         <p className="text-xs text-zinc-500 mt-1">{p.tahun}</p>
//                         <p className="text-sm text-zinc-300 mt-2">{p.deskripsi || "—"}</p>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-zinc-500 italic">Belum ada prestasi di periode ini</p>
//                 )}
//               </section>

//               {/* Riwayat */}
//               <section className="rounded-xl border border-zinc-700/50 bg-black/30 p-6 backdrop-blur-sm">
//                 <h3 className="text-xl font-bold mb-4">Riwayat Kepemimpinan</h3>
//                 {osisData?.riwayatKepemimpinan?.length > 0 ? (
//                   <div className="space-y-6">
//                     {osisData.riwayatKepemimpinan.slice().reverse().map((r: any, idx: number) => (
//                       <div key={idx} className="relative pl-8">
//                         <div className="absolute left-3 top-0 bottom-0 w-px bg-zinc-700" />
//                         <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-emerald-600 bg-zinc-900" />
//                         <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
//                           <div className="text-sm font-medium text-emerald-400">{r.periode}</div>
//                           <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
//                             <div>
//                               <span className="text-zinc-400">Ketua:</span> {r.ketua || "—"}
//                             </div>
//                             <div>
//                               <span className="text-zinc-400">Wakil:</span> {r.wakil || "—"}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-zinc-500 italic">Belum ada riwayat kepemimpinan</p>
//                 )}
//               </section>
//             </div>
//           )}

//           {/* MODAL EDIT dengan Overlay */}
//             <AnimatePresence>
//               {modal === "editOsis" && (
//                 <>
//                   {/* Overlay / Backdrop */}
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="fixed inset-0 bg-black/70 z-[99999]"
//                     onClick={() => setModal(null)} // Klik di luar → tutup modal
//                   />

//                   {/* Modal Content - Slide dari kanan */}
//                   <motion.div
//                     initial={{ x: "100%" }}
//                     animate={{ x: 0 }}
//                     exit={{ x: "100%" }}
//                     transition={{ type: "spring", damping: 25, stiffness: 300 }}
//                     className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl overflow-y-auto z-[9999999999]"
//                   >
//                     <div className="p-6">
//                       <div className="flex items-center justify-between mb-6">
//                         <h3 className="text-xl font-bold text-white">Edit Data OSIS Saat Ini</h3>
//                         <button 
//                           onClick={() => setModal(null)} 
//                           className="text-zinc-400 hover:text-white transition-colors"
//                         >
//                           <X size={24} />
//                         </button>
//                       </div>

//                       <form onSubmit={handleSubmitOsis} className="space-y-6">
//                         {/* Periode */}
//                         <div>
//                           <label className="block text-sm font-medium mb-2 text-zinc-300">Periode Saat Ini</label>
//                           <input
//                             type="text"
//                             value={formData.periodeSaatIni}
//                             onChange={e => updateForm("periodeSaatIni", e.target.value)}
//                             placeholder="2025/2026"
//                             className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none"
//                           />
//                         </div>

//                         {/* Pengurus - role loop */}
//                         {roles.map(role => (
//                           <div key={role.key} className="space-y-4 border-t border-zinc-800 pt-5">
//                             <h4 className="font-medium capitalize text-zinc-200">{role.title}</h4>

//                             <input
//                               placeholder="Nama"
//                               value={formData[`${role.key}Nama`]}
//                               onChange={e => updateForm(`${role.key}Nama`, e.target.value)}
//                               className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none"
//                             />

//                             <input
//                               placeholder="NIP/NUPTK (opsional)"
//                               value={formData[`${role.key}NipNuptk`]}
//                               onChange={e => updateForm(`${role.key}NipNuptk`, e.target.value)}
//                               className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none"
//                             />

//                             <div>
//                               <label className="block text-sm font-medium mb-2 text-zinc-300">Foto {role.title}</label>
//                               <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-zinc-600 rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors bg-zinc-900/40">
//                                 <div className="text-center">
//                                   <Upload className="mx-auto h-10 w-10 text-zinc-500" />
//                                   <p className="mt-3 text-sm text-zinc-400">
//                                     Klik atau drag foto di sini
//                                   </p>
//                                   <p className="text-xs text-zinc-500 mt-1">(max 5MB, jpg/png/webp)</p>
//                                 </div>
//                                 <input
//                                   type="file"
//                                   accept="image/*"
//                                   className="hidden"
//                                   onChange={e => handleFileChange(role.key, e)}
//                                 />
//                               </label>

//                               {(formData[`${role.key}FotoPreview`] || formData[`${role.key}FotoUrl`]) && (
//                                 <div className="mt-4 flex justify-center">
//                                   <div className="relative">
//                                     <img
//                                       src={formData[`${role.key}FotoPreview`] || formData[`${role.key}FotoUrl`]}
//                                       alt="Preview"
//                                       className="h-32 w-32 object-cover rounded-xl border border-zinc-700 shadow-lg"
//                                     />
//                                     {formData[`${role.key}FotoPreview`] && (
//                                       <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
//                                         Baru
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}

//                         {/* Visi */}
//                         <div>
//                           <label className="block text-sm font-medium mb-2 text-zinc-300">Visi</label>
//                           <textarea
//                             value={formData.visi}
//                             onChange={e => updateForm("visi", e.target.value)}
//                             rows={4}
//                             className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white resize-y focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none"
//                             placeholder="Tuliskan visi OSIS..."
//                           />
//                         </div>

//                         {/* Misi - sudah bagus, tetap dipertahankan */}
//                         <div>
//                           <label className="block text-sm font-medium mb-2 text-zinc-300">Misi</label>
//                           {formData.misi.map((misi: string, idx: number) => (
//                             <div key={idx} className="flex gap-3 mb-3">
//                               <input
//                                 value={misi}
//                                 onChange={e => updateMisi(idx, e.target.value)}
//                                 className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none"
//                                 placeholder={`Misi ${idx + 1}`}
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => removeMisi(idx)}
//                                 className="rounded-lg border border-red-600/50 px-4 py-2.5 text-red-400 hover:bg-red-900/30 transition-colors"
//                               >
//                                 Hapus
//                               </button>
//                             </div>
//                           ))}
//                           <button
//                             type="button"
//                             onClick={addMisi}
//                             className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
//                           >
//                             <Plus size={16} /> Tambah Misi
//                           </button>
//                         </div>

//                         {/* Prestasi - bisa ditingkatkan serupa */}
//                         <div>
//                           <label className="block text-sm font-medium mb-2 text-zinc-300">Prestasi Periode Ini</label>
//                           {formData.prestasiSaatIni.map((p: any, idx: number) => (
//                             <div key={idx} className="border border-zinc-800 rounded-xl p-4 mb-4 bg-zinc-950/50">
//                               <input
//                                 placeholder="Judul Prestasi"
//                                 value={p.judul}
//                                 onChange={e => updatePrestasi(idx, "judul", e.target.value)}
//                                 className="w-full mb-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none"
//                               />
//                               <input
//                                 placeholder="Tahun"
//                                 value={p.tahun}
//                                 onChange={e => updatePrestasi(idx, "tahun", e.target.value)}
//                                 className="w-full mb-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none"
//                               />
//                               <textarea
//                                 placeholder="Deskripsi singkat"
//                                 value={p.deskripsi}
//                                 onChange={e => updatePrestasi(idx, "deskripsi", e.target.value)}
//                                 rows={3}
//                                 className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none"
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => removePrestasi(idx)}
//                                 className="mt-3 text-sm text-red-400 hover:text-red-300 transition-colors"
//                               >
//                                 Hapus Prestasi
//                               </button>
//                             </div>
//                           ))}
//                           <button
//                             type="button"
//                             onClick={addPrestasi}
//                             className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
//                           >
//                             <Plus size={16} /> Tambah Prestasi
//                           </button>
//                         </div>

//                         {/* Tombol Submit */}
//                         <div className="grid grid-cols-2 justify-end gap-4 pt-6 border-t border-zinc-800">
//                           <button
//                             type="button"
//                             onClick={() => setModal(null)}
//                             className="px-6 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
//                           >
//                             Batal
//                           </button>
//                           <button
//                             type="submit"
//                             disabled={savingOsis}
//                             className={clsx(
//                               "px-8 py-2.5 justify-center rounded-lg text-white flex items-center gap-2 transition-colors",
//                               savingOsis 
//                                 ? "bg-blue-800 cursor-not-allowed" 
//                                 : "bg-blue-600 hover:bg-blue-700"
//                             )}
//                           >
//                             {savingOsis ? (
//                               <>
//                                 <Loader className="h-5 w-5 animate-spin" />
//                                 Menyimpan...
//                               </>
//                             ) : (
//                               "Simpan Perubahan"
//                             )}
//                           </button>
//                         </div>
//                       </form>
//                     </div>
//                   </motion.div>
//                 </>
//               )}
//             </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   );
// };



import { useSchool } from "@/features/schools";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, User, X, Upload, Loader, Award, Target, Rocket, History, LayoutDashboard } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = "https://be-school.kiraproject.id";
const OSIS_API_BASE = `${API_BASE_URL}/osis`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const apiFetch = async (url: string, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! Status: ${response.status}`);
  }
  return data;
};

const useAlert = () => {
  const [alert, setAlert] = useState({ message: "", isVisible: false });
  const showAlert = useCallback((message: string) => {
    setAlert({ message, isVisible: true });
    setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
  }, []);
  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
  return { alert, showAlert, hideAlert };
};

const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`fixed top-10 right-10 z-[999999] rounded-2xl border p-5 shadow-2xl backdrop-blur-xl ${
        isSuccess
          ? "border-blue-500/50 bg-blue-500/10 text-blue-100"
          : "border-red-500/50 bg-red-500/10 text-red-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-lg font-bold">{isSuccess ? "✓" : "✕"}</div>
        <div className="whitespace-pre-line text-xs font-medium uppercase tracking-wider">{message}</div>
        <button type="button" onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export const OsisMain = () => {
  const { alert, showAlert, hideAlert } = useAlert();
  const schoolData = useSchool();
  const schoolId = schoolData?.data?.[0]?.id;

  const [modal, setModal] = useState<"editOsis" | null>(null);
  const [dark] = useState(true);

  const [osisData, setOsisData] = useState<any>(null);
  const [loadingOsis, setLoadingOsis] = useState(true);
  const [savingOsis, setSavingOsis] = useState(false);

  const [formData, setFormData] = useState<any>({
    periodeSaatIni: "",
    ketuaNama: "",
    ketuaNipNuptk: "",
    ketuaFotoUrl: "",
    ketuaFotoFile: null,
    ketuaFotoPreview: "",
    wakilNama: "",
    wakilNipNuptk: "",
    wakilFotoUrl: "",
    wakilFotoFile: null,
    wakilFotoPreview: "",
    bendaharaNama: "",
    bendaharaNipNuptk: "",
    bendaharaFotoUrl: "",
    bendaharaFotoFile: null,
    bendaharaFotoPreview: "",
    sekretarisNama: "",
    sekretarisNipNuptk: "",
    sekretarisFotoUrl: "",
    sekretarisFotoFile: null,
    sekretarisFotoPreview: "",
    visi: "",
    misi: [""],
    prestasiSaatIni: [],
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (!schoolId) return;

    const fetchOsis = async () => {
      setLoadingOsis(true);
      try {
        const res = await apiFetch(`${OSIS_API_BASE}?schoolId=${schoolId}`);
        if (res.success && res.data) {
          const data = res.data;
          setOsisData(data);
          setFormData({
            periodeSaatIni: data.periodeSaatIni || "",
            ketuaNama: data.ketuaNama || "",
            ketuaNipNuptk: data.ketuaNipNuptk || "",
            ketuaFotoUrl: data.ketuaFotoUrl || "",
            ketuaFotoFile: null,
            ketuaFotoPreview: "",
            wakilNama: data.wakilNama || "",
            wakilNipNuptk: data.wakilNipNuptk || "",
            wakilFotoUrl: data.wakilFotoUrl || "",
            wakilFotoFile: null,
            wakilFotoPreview: "",
            bendaharaNama: data.bendaharaNama || "",
            bendaharaNipNuptk: data.bendaharaNipNuptk || "",
            bendaharaFotoUrl: data.bendaharaFotoUrl || "",
            bendaharaFotoFile: null,
            bendaharaFotoPreview: "",
            sekretarisNama: data.sekretarisNama || "",
            sekretarisNipNuptk: data.sekretarisNipNuptk || "",
            sekretarisFotoUrl: data.sekretarisFotoUrl || "",
            sekretarisFotoFile: null,
            sekretarisFotoPreview: "",
            visi: data.visi || "",
            misi: Array.isArray(data.misi) ? data.misi : [""],
            prestasiSaatIni: Array.isArray(data.prestasiSaatIni) ? data.prestasiSaatIni : [],
          });
        }
      } catch (err) {
        console.error("Fetch OSIS failed:", err);
        showAlert("Gagal memuat data OSIS");
      } finally {
        setLoadingOsis(false);
      }
    };

    fetchOsis();
  }, [schoolId, showAlert]);

  const updateForm = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const updateMisi = (index: number, value: string) => {
    setFormData((prev: any) => {
      const newMisi = [...prev.misi];
      newMisi[index] = value;
      return { ...prev, misi: newMisi };
    });
  };

  const addMisi = () => updateForm("misi", [...formData.misi, ""]);

  const removeMisi = (index: number) =>
    updateForm("misi", formData.misi.filter((_: any, i: number) => i !== index));

  const addPrestasi = () =>
    updateForm("prestasiSaatIni", [
      ...formData.prestasiSaatIni,
      { judul: "", deskripsi: "", tahun: new Date().getFullYear().toString() },
    ]);

  const updatePrestasi = (index: number, field: string, value: string) => {
    const newPrestasi = [...formData.prestasiSaatIni];
    newPrestasi[index] = { ...newPrestasi[index], [field]: value };
    updateForm("prestasiSaatIni", newPrestasi);
  };

  const removePrestasi = (index: number) =>
    updateForm("prestasiSaatIni", formData.prestasiSaatIni.filter((_: any, i: number) => i !== index));

  const handleFileChange = (role: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      updateForm(`${role}FotoFile`, file);
      updateForm(`${role}FotoPreview`, previewUrl);
    }
  };

  const handleSubmitOsis = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOsis(true);

    try {
      const formPayload = new FormData();

      formPayload.append("schoolId", schoolId?.toString() || "");
      formPayload.append("periodeSaatIni", formData.periodeSaatIni);
      formPayload.append("ketuaNama", formData.ketuaNama);
      formPayload.append("ketuaNipNuptk", formData.ketuaNipNuptk);
      formPayload.append("wakilNama", formData.wakilNama);
      formPayload.append("wakilNipNuptk", formData.wakilNipNuptk);
      formPayload.append("bendaharaNama", formData.bendaharaNama);
      formPayload.append("bendaharaNipNuptk", formData.bendaharaNipNuptk);
      formPayload.append("sekretarisNama", formData.sekretarisNama);
      formPayload.append("sekretarisNipNuptk", formData.sekretarisNipNuptk);
      formPayload.append("visi", formData.visi);
      formPayload.append("misi", JSON.stringify(formData.misi.filter((m: string) => m.trim())));
      formPayload.append("prestasiSaatIni", JSON.stringify(formData.prestasiSaatIni));

      if (formData.ketuaFotoFile) formPayload.append("ketuaFoto", formData.ketuaFotoFile);
      if (formData.wakilFotoFile) formPayload.append("wakilFoto", formData.wakilFotoFile);
      if (formData.bendaharaFotoFile) formPayload.append("bendaharaFoto", formData.bendaharaFotoFile);
      if (formData.sekretarisFotoFile) formPayload.append("sekretarisFoto", formData.sekretarisFotoFile);

      const response = await fetch(OSIS_API_BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formPayload,
      });

      const res = await response.json();
      if (!response.ok) throw new Error(res.message || "Gagal menyimpan data");

      if (res.success) {
        setOsisData(res.data);
        showAlert("Data OSIS berhasil diperbarui!");
        setModal(null);
      }
    } catch (err: any) {
      showAlert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSavingOsis(false);
    }
  };

  const roles = [
    { key: "ketua", title: "Ketua OSIS" },
    { key: "wakil", title: "Wakil Ketua" },
    { key: "bendahara", title: "Bendahara" },
    { key: "sekretaris", title: "Sekretaris" },
  ];

  return (
    <div className="w-full min-h-screen bg-transparent">
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3 font-black text-blue-500 uppercase tracking-[0.4em] text-[10px]">
            <Rocket size={14} /> OSIS Administration
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Profil <span className="text-blue-700">OSIS</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Periode: {osisData?.periodeSaatIni || "—"}</p>
        </div>

        <button
          onClick={() => setModal("editOsis")}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
        >
          <Plus size={18} /> Perbarui Data
        </button>
      </div>

      <div className={clsx("w-full transition-all duration-500", dark ? "dark text-zinc-100" : "text-zinc-900")}>
        <main className="max-w-7xl mx-auto space-y-12">
          
          {loadingOsis ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader className="animate-spin text-blue-500" size={40} />
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Syncing Database...</div>
            </div>
          ) : (
            <div className="space-y-16">
              
              {/* Pengurus Section */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px w-12 bg-blue-600"></div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 italic">Board of Executives</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {roles.map((role, i) => {
                    const data = osisData?.[`${role.key}Nama`]
                      ? {
                          nama: osisData[`${role.key}Nama`],
                          nip: osisData[`${role.key}NipNuptk`],
                          foto: osisData[`${role.key}FotoUrl`],
                        }
                      : null;

                    return (
                      <motion.div
                        key={role.key}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-600 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                        <div className="relative bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm text-center">
                          <div className="relative mx-auto mb-6 h-32 w-32">
                            <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {data?.foto ? (
                              <img
                                src={data.foto}
                                alt={data.nama}
                                className="h-full w-full rounded-3xl object-cover border-2 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center rounded-3xl bg-white border border-white/5 text-zinc-700">
                                <User size={48} />
                              </div>
                            )}
                          </div>
                          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 italic">{role.title}</div>
                          <h4 className="text-xl font-bold tracking-tight text-white mb-1">{data?.nama || "—"}</h4>
                          {data?.nip && <p className="text-[10px] font-medium text-zinc-500 tracking-tighter uppercase">{data.nip}</p>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Visi Misi */}
                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-12 bg-blue-600"></div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 italic">Vision & Missions</h2>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 space-y-10 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] text-white">
                      <Target size={200} />
                    </div>
                    {osisData?.visi ? (
                      <>
                        <div>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-500"><Award size={20} /></div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-white italic">Visi Utama</h4>
                          </div>
                          <p className="text-xl font-medium text-zinc-300 leading-relaxed italic">"{osisData.visi}"</p>
                        </div>
                        <div className="space-y-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-500"><Rocket size={20} /></div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-white italic">Misi Strategis</h4>
                          </div>
                          <ul className="grid gap-4">
                            {osisData.misi?.map((m: string, idx: number) => (
                              <li key={idx} className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                                <span className="text-blue-600 font-black italic">0{idx + 1}.</span>
                                <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors text-sm font-medium">{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <p className="text-zinc-500 italic text-sm">No data established yet.</p>
                    )}
                  </div>
                </section>

                {/* Prestasi & Riwayat */}
                <div className="space-y-12">
                  <section className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-px w-12 bg-blue-600"></div>
                      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 italic">Recent Achievements</h2>
                    </div>
                    {osisData?.prestasiSaatIni?.length > 0 ? (
                      <div className="grid gap-4">
                        {osisData.prestasiSaatIni.map((p: any, idx: number) => (
                          <div key={idx} className="group relative bg-white/[0.03] border border-white/5 rounded-3xl p-6 hover:border-blue-500/30 transition-all backdrop-blur-sm">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-white text-lg group-hover:text-blue-500 transition-colors">{p.judul}</h4>
                              <span className="text-[10px] font-black px-3 py-1 bg-blue-600/10 text-blue-500 rounded-full tracking-tighter italic">{p.tahun}</span>
                            </div>
                            <p className="text-sm text-zinc-500 font-medium leading-relaxed">{p.deskripsi || "—"}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500 italic text-sm">No record found.</p>
                    )}
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* Modal Sidebar */}
          <AnimatePresence>
            {modal === "editOsis" && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 top-0 right-0 bg-black/90 backdrop-blur-md z-[99999]"
                  onClick={() => setModal(null)}
                />

                <motion.div
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 200 }}
                  className="fixed right-0 top-0 h-full w-full z-[999999] max-w-xl bg-[#0B1220] border-l border-white/10 shadow-2xl overflow-y-auto flex flex-col"
                >
                  <div className="p-10 border-b border-white/5 flex justify-between items-center bg-[#0B1220] relative top-0 z-10">
                    <div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Perbarui <span className="text-blue-700">Data</span></h3>
                      <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mt-1">Internal Management OSIS</p>
                    </div>
                    <button onClick={() => setModal(null)} className="p-3 bg-white/5 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 rounded-2xl transition-all">
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitOsis} className="p-10 space-y-12">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Periode Aktif</label>
                      <input
                        type="text" value={formData.periodeSaatIni}
                        onChange={e => updateForm("periodeSaatIni", e.target.value)}
                        placeholder="e.g. 2025/2026"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all font-bold"
                      />
                    </div>

                    {roles.map(role => (
                      <div key={role.key} className="space-y-6 bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5">
                        <div className="flex items-center gap-3">
                          <LayoutDashboard size={16} className="text-blue-500" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-white italic">{role.title}</h4>
                        </div>

                        <div className="grid gap-4">
                          <input
                            placeholder="Nama Lengkap" value={formData[`${role.key}Nama`]}
                            onChange={e => updateForm(`${role.key}Nama`, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-blue-500/50"
                          />
                          <input
                            placeholder="NIP / NUPTK" value={formData[`${role.key}NipNuptk`]}
                            onChange={e => updateForm(`${role.key}NipNuptk`, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-blue-500/50 font-mono"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-blue-600/5 hover:border-blue-500/50 transition-all overflow-hidden relative">
                            {(formData[`${role.key}FotoPreview`] || formData[`${role.key}FotoUrl`]) ? (
                               <img 
                                 src={formData[`${role.key}FotoPreview`] || formData[`${role.key}FotoUrl`]} 
                                 className="absolute inset-0 w-full h-full object-cover opacity-40" 
                               />
                            ) : null}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                              <Upload className="text-blue-500" size={32} />
                              <span className="text-[8px] font-black uppercase tracking-widest text-white">Upload Identity Photo</span>
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(role.key, e)} />
                          </label>
                        </div>
                      </div>
                    ))}

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Target size={16} className="text-blue-500" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white italic">Visi OSIS</h4>
                      </div>
                      <textarea
                        value={formData.visi} onChange={e => updateForm("visi", e.target.value)}
                        rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:border-blue-500/50 italic"
                        placeholder="What is the main goal..."
                      />
                    </div>

                    {/* Misi Section */}
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Rocket size={16} className="text-blue-500" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-white italic">Misi OSIS</h4>
                        </div>
                        <button type="button" onClick={addMisi} className="text-[8px] font-black text-blue-500 uppercase flex items-center gap-2 hover:text-white transition-colors">
                          <Plus size={12} /> Add More
                        </button>
                      </div>
                      <div className="grid gap-4">
                        {formData.misi.map((misi: string, idx: number) => (
                          <div key={idx} className="flex gap-4 group">
                             <div className="flex-1 bg-white/5 border border-white/10 rounded-xl flex items-center px-5 focus-within:border-blue-500/50 transition-all">
                                <span className="text-[10px] font-black text-blue-500 mr-4 italic">{idx + 1}.</span>
                                <input
                                  value={misi} onChange={e => updateMisi(idx, e.target.value)}
                                  className="w-full bg-transparent py-4 text-white text-sm outline-none"
                                />
                             </div>
                             <button type="button" onClick={() => removeMisi(idx)} className="p-4 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                               <X size={16} />
                             </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prestasi Section */}
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <History size={16} className="text-blue-500" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-white italic">Prestasi OSIS</h4>
                        </div>
                        <button 
                          type="button" 
                          onClick={addPrestasi} 
                          className="text-[8px] font-black text-blue-500 uppercase flex items-center gap-2 hover:text-white transition-colors"
                        >
                          <Plus size={12} /> Tambah Prestasi
                        </button>
                      </div>
                      
                      <div className="grid gap-6">
                        {formData.prestasiSaatIni.map((p: any, idx: number) => (
                          <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4 group relative">
                            <button 
                              type="button" 
                              onClick={() => removePrestasi(idx)} 
                              className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X size={14} />
                            </button>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="col-span-2">
                                <label className="text-[8px] font-black uppercase text-zinc-500 mb-2 block">Judul Prestasi</label>
                                <input
                                  value={p.judul}
                                  onChange={e => updatePrestasi(idx, "judul", e.target.value)}
                                  placeholder="Contoh: Juara 1 Lomba..."
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] font-black uppercase text-zinc-500 mb-2 block">Tahun</label>
                                <input
                                  value={p.tahun}
                                  onChange={e => updatePrestasi(idx, "tahun", e.target.value)}
                                  placeholder="2025"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50 font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[8px] font-black uppercase text-zinc-500 mb-2 block">Deskripsi Singkat</label>
                              <textarea
                                value={p.deskripsi}
                                onChange={e => updatePrestasi(idx, "deskripsi", e.target.value)}
                                rows={2}
                                placeholder="Jelaskan singkat mengenai pencapaian ini..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="relative bg-[#0B1220] py-10 border-t border-white/5 grid grid-cols-2 gap-6">
                      <button type="button" onClick={() => setModal(null)} className="py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                        Discard
                      </button>
                      <button
                        type="submit" disabled={savingOsis}
                        className="py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
                      >
                        {savingOsis ? <Loader className="animate-spin" size={16} /> : <Rocket size={16} />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};