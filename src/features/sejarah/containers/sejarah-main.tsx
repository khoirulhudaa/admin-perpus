// import { useSchool } from "@/features/schools";
// import { AnimatePresence, motion } from "framer-motion";
// import { Plus, Save, X } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";

// // Theme (sama seperti contoh program)
// const THEME = {
//   bg: "#0B1220",
//   surface: "#111827",
//   primary: "#065F46",
//   accent: "#10B981",
//   text: "#F9FAFB",
//   textSecondary: "#E5E7EB",
//   border: "#374151",
//   danger: "#EF4444",
// };

// const BASE_URL = "https://be-school.kiraproject.id";

// // Alert Component
// interface AlertState {
//   message: string;
//   type: "success" | "error";
//   visible: boolean;
// }

// const Alert = ({ alert, onClose }: { alert: AlertState; onClose: () => void }) => {
//   if (!alert.visible) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={`mb-6 p-4 rounded-xl border ${
//         alert.type === "success"
//           ? "bg-green-900/30 border-green-500/40 text-green-300"
//           : "bg-red-900/30 border-red-500/40 text-red-300"
//       }`}
//     >
//       <div className="flex justify-between items-start">
//         <span>{alert.message}</span>
//         <button onClick={onClose} className="text-lg ml-3">×</button>
//       </div>
//     </motion.div>
//   );
// };

// // Simple Input & TextArea
// const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
//   <input
//     {...props}
//     className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
//   />
// );

// const TextArea = (props: any) => (
//   <textarea
//     {...props}
//     className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 outline-none resize-y min-h-[100px]"
//   />
// );

// // Modal untuk Edit/Create Sejarah (karena hanya 1 record per school, lebih ke "edit data sejarah")
// const SejarahModal = ({
//   open,
//   onClose,
//   initialData = {},
//   onSubmit,
//   isNew,
// }: {
//   open: boolean;
//   onClose: () => void;
//   initialData?: any;
//   onSubmit: (formData: FormData) => Promise<void>;
//   isNew: boolean;
// }) => {
//   const [form, setForm] = useState({
//     deskripsi: initialData?.deskripsi || "",
//     tahunBerdiri: initialData?.tahunBerdiri || "",
//     jumlahKompetensiKeahlian: initialData?.jumlahKompetensiKeahlian || "",
//     timeline: initialData?.timeline || [],
//     daftarKepalaSekolah: initialData?.daftarKepalaSekolah || [],
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [kepsekFiles, setKepsekFiles] = useState<File[]>([]);

//   useEffect(() => {
//     if (open) {
//       setForm({
//         deskripsi: initialData?.deskripsi || "",
//         tahunBerdiri: initialData?.tahunBerdiri || "",
//         jumlahKompetensiKeahlian: initialData?.jumlahKompetensiKeahlian || "",
//         timeline: initialData?.timeline || [],
//         daftarKepalaSekolah: initialData?.daftarKepalaSekolah || [],
//       });
//       setKepsekFiles([]);
//     }
//   }, [open, initialData]);

//   const addTimeline = () => {
//     setForm((prev) => ({
//       ...prev,
//       timeline: [...prev.timeline, { year: "", title: "", deskripsi: "" }],
//     }));
//   };

//   const updateTimeline = (index: number, field: string, value: string) => {
//     const newTimeline = [...form.timeline];
//     newTimeline[index] = { ...newTimeline[index], [field]: value };
//     setForm((prev) => ({ ...prev, timeline: newTimeline }));
//   };

//   const removeTimeline = (index: number) => {
//     setForm((prev) => ({
//       ...prev,
//       timeline: prev.timeline.filter((_, i) => i !== index),
//     }));
//   };

//   const addKepsek = () => {
//     setForm((prev) => ({
//       ...prev,
//       daftarKepalaSekolah: [...prev.daftarKepalaSekolah, { nama: "", tahunKerja: "" }],
//     }));
//     setKepsekFiles((prev) => [...prev, null as any]); // placeholder
//   };

//   const updateKepsek = (index: number, field: string, value: string) => {
//     const newKepsek = [...form.daftarKepalaSekolah];
//     newKepsek[index] = { ...newKepsek[index], [field]: value };
//     setForm((prev) => ({ ...prev, daftarKepalaSekolah: newKepsek }));
//   };

//   const removeKepsek = (index: number) => {
//     setForm((prev) => ({
//       ...prev,
//       daftarKepalaSekolah: prev.daftarKepalaSekolah.filter((_, i) => i !== index),
//     }));
//     setKepsekFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleFileChange = (index: number, file: File | null) => {
//     const newFiles: any = [...kepsekFiles];
//     newFiles[index] = file;
//     setKepsekFiles(newFiles);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!form.deskripsi.trim() || !form.tahunBerdiri) {
//       alert("Deskripsi dan Tahun Berdiri wajib diisi");
//       return;
//     }

//     setIsSubmitting(true);

//     const formData = new FormData();
//     formData.append("deskripsi", form.deskripsi);
//     formData.append("tahunBerdiri", form.tahunBerdiri);
//     formData.append("jumlahKompetensiKeahlian", form.jumlahKompetensiKeahlian || "0");
//     formData.append("timeline", JSON.stringify(form.timeline));
//     formData.append("daftarKepalaSekolah", JSON.stringify(form.daftarKepalaSekolah));

//     // Kirim foto hanya yang diubah + index-nya
//     kepsekFiles.forEach((file, index) => {
//       if (file) {
//         formData.append("kepalaPhotos", file);
//         formData.append("photoIndices", index.toString()); // penting: kirim index kepsek yang di-update
//       }
//     });

//     try {
//       await onSubmit(formData);
//       onClose();
//     } catch (err: any) {
//       alert("Gagal menyimpan: " + (err.message || "Terjadi kesalahan"));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed top-0 right-0 inset-0 bg-black/70 flex items-center justify-center z-[99999999] p-4 overflow-y-auto">
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.95, opacity: 0 }}
//         className="bg-black/70 absolute top-0 right-0 z-[999999] w-full max-w-xl border border-white/10 h-screen overflow-y-auto"
//       >
//         <div className="p-6 border-b border-white/10 flex justify-between items-center relative top-0 z[999999]">
//           <h2 className="text-xl font-semibold text-white">
//             {isNew ? "Buat Sejarah Sekolah" : "Edit Sejarah Sekolah"}
//           </h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-white">
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-8">
//           {/* Info Dasar */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-white/80 mb-2">
//                 Tahun Berdiri *
//               </label>
//               <Input
//                 type="number"
//                 value={form.tahunBerdiri}
//                 onChange={(e) => setForm({ ...form, tahunBerdiri: e.target.value })}
//                 placeholder="1976"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-white/80 mb-2">
//                 Jumlah Kompetensi Keahlian
//               </label>
//               <Input
//                 type="number"
//                 value={form.jumlahKompetensiKeahlian}
//                 onChange={(e) => setForm({ ...form, jumlahKompetensiKeahlian: e.target.value })}
//                 placeholder="8"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-white/80 mb-2">
//               Deskripsi Sekolah *
//             </label>
//             <TextArea
//               value={form.deskripsi}
//               onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
//               placeholder="Ceritakan sejarah singkat sekolah..."
//               required
//               rows={5}
//             />
//           </div>

//           {/* Timeline */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <label className="text-sm font-medium text-white/80">Timeline Sejarah</label>
//               <button
//                 type="button"
//                 onClick={addTimeline}
//                 className="flex items-center gap-1.5 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/40"
//               >
//                 <Plus size={14} /> Tambah Tahun
//               </button>
//             </div>

//             {form.timeline.map((item: any, idx: number) => (
//               <div key={idx} className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-3">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     value={item.year}
//                     onChange={(e) => updateTimeline(idx, "year", e.target.value)}
//                     placeholder="Tahun (contoh: 1976)"
//                   />
//                   <Input
//                     value={item.title}
//                     onChange={(e) => updateTimeline(idx, "title", e.target.value)}
//                     placeholder="Judul peristiwa"
//                   />
//                 </div>
//                 <TextArea
//                   value={item.deskripsi}
//                   onChange={(e) => updateTimeline(idx, "deskripsi", e.target.value)}
//                   placeholder="Deskripsi peristiwa..."
//                   rows={2}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeTimeline(idx)}
//                   className="text-red-400 hover:text-red-300 text-sm"
//                 >
//                   Hapus
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Daftar Kepala Sekolah */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <label className="text-sm font-medium text-white/80">Daftar Kepala Sekolah</label>
//               <button
//                 type="button"
//                 onClick={addKepsek}
//                 className="flex items-center gap-1.5 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/40"
//               >
//                 <Plus size={14} /> Tambah Kepsek
//               </button>
//             </div>

//             {form.daftarKepalaSekolah.map((kepsek: any, idx: number) => (
//               <div key={idx} className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-3">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     value={kepsek.nama}
//                     onChange={(e) => updateKepsek(idx, "nama", e.target.value)}
//                     placeholder="Nama Kepala Sekolah"
//                   />
//                   <Input
//                     value={kepsek.tahunKerja}
//                     onChange={(e) => updateKepsek(idx, "tahunKerja", e.target.value)}
//                     placeholder="Periode (contoh: 2015 - 2020)"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-white/70 mb-1">Foto</label>
//                   <div className="flex items-center gap-4">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         if (e.target.files?.[0]) handleFileChange(idx, e.target.files[0]);
//                       }}
//                       className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-600/30 file:text-blue-300 hover:file:bg-blue-600/50"
//                     />
//                     {kepsek.fotoUrl && !kepsekFiles[idx] && (
//                       <img
//                         src={`${kepsek.fotoUrl}`}
//                         alt="Preview"
//                         className="h-16 w-16 object-cover rounded-full"
//                       />
//                     )}
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => removeKepsek(idx)}
//                   className="text-red-400 hover:text-red-300 text-sm"
//                 >
//                   Hapus
//                 </button>
                
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
//               disabled={isSubmitting}  // ← optional: disable saat loading
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`px-6 py-2.5 text-white rounded-xl flex items-center gap-2 transition-opacity ${
//                 isSubmitting
//                   ? "bg-blue-700/70 cursor-not-allowed opacity-70"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {isSubmitting ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
//                     />
//                   </svg>
//                   Menyimpan...
//                 </>
//               ) : (
//                 <>
//                   <Save size={18} />
//                   Simpan Sejarah
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// // Main Component
// export default function Sejarah() {
//   const [sejarah, setSejarah] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [alert, setAlert] = useState<AlertState>({
//     message: "",
//     type: "success",
//     visible: false,
//   });

//   const dataSchool: any = useSchool();
//   const SCHOOL_ID = dataSchool?.data?.[0]?.id;

//   const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
//     setAlert({ message: msg, type, visible: true });
//     setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 5000);
//   }, []);

//   const fetchSejarah = useCallback(async () => {
//     if (!SCHOOL_ID) return;

//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/sejarah?schoolId=${SCHOOL_ID}`);
//       if (!res.ok) throw new Error("Gagal memuat sejarah");

//       const json = await res.json();
//       if (json.success && json.data) {
//         setSejarah(json.data);
//       } else {
//         setSejarah(null); // Belum ada data → tampilkan tombol buat baru
//       }
//     } catch (err: any) {
//       showAlert("Gagal memuat sejarah: " + err.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [SCHOOL_ID, showAlert]);

//   useEffect(() => {
//     fetchSejarah();
//   }, [fetchSejarah]);

//   const handleSave = async (formData: FormData) => {
//     formData.append("schoolId", SCHOOL_ID?.toString() || "");

//     const url = sejarah ? `${BASE_URL}/sejarah/${sejarah.id}` : `${BASE_URL}/sejarah`;
//     const method = sejarah ? "PUT" : "POST";

//     const res = await fetch(url, {
//       method,
//       headers: {
//         // JANGAN set Content-Type → biar browser set multipart/form-data otomatis
//       },
//       body: formData,
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.message || "Gagal menyimpan sejarah");
//     }

//     showAlert("Sejarah sekolah berhasil disimpan!");
//     fetchSejarah();
//   };

//   const handleDelete = async () => {
//     if (!sejarah?.id || !confirm("Yakin ingin menghapus sejarah sekolah ini?")) return;

//     const res = await fetch(`${BASE_URL}/sejarah/${sejarah.id}`, {
//       method: "DELETE",
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.message || "Gagal menghapus");
//     }

//     showAlert("Sejarah sekolah berhasil dihapus");
//     setSejarah(null);
//     fetchSejarah();
//   };

//    const Icon = ({ label }: { label: string }) => (
//     <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
//         {label}
//     </span>
//     );
//     const ISave = () => <Icon label="💾" />;

//   return (
//     <div className="min-h-screen" style={{ background: THEME.bg, color: THEME.text }}>
//       <header className="flex justify-between items-center my-4 mb-6">
//         {/* <h1 className="text-2xl font-bold">Sejarah Sekolah</h1> */}

//         {sejarah ? (
//           <div className="flex gap-3">
//             <button
//               onClick={() => setModalOpen(true)}
//               className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm flex items-center gap-2"
//             >
//               <ISave /> Perbarui Sejarah
//             </button>
//             {/* <button
//               onClick={handleDelete}
//               className="px-4 py-2 bg-red-600/80 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
//             >
//               <Trash2 size={16} /> Hapus
//             </button> */}
//           </div>
//         ) : (
//           <button
//             onClick={() => setModalOpen(true)}
//             className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm flex items-center gap-2"
//           >
//             <ISave /> Buat Sejarah Sekolah
//           </button>
//         )}
//       </header>

//       <AnimatePresence>
//         {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
//       </AnimatePresence>

//       {loading ? (
//         <div className="flex justify-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       ) : !sejarah ? (
//         <div className="text-center py-20 text-gray-400">
//           Belum ada data sejarah sekolah. Klik tombol di atas untuk membuat.
//         </div>
//       ) : (
//         <div className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-8">
//           <div className="grid grid-cols-1 border-b border-white/20 pb-4 md:grid-cols-3 gap-6">
//             <div className="border-r border-white/20 pr-4">
//               <h3 className="text-sm text-white/70">Tahun Berdiri</h3>
//               <p className="text-xl font-semibold mt-1">{sejarah.tahunBerdiri}</p>
//             </div>
//             <div className="border-r border-white/20 pl-5">
//               <h3 className="text-sm text-white/70">Jumlah Kepala Sekolah</h3>
//               <p className="text-xl font-semibold mt-1">{sejarah.jumlahKepalaSekolah}</p>
//             </div>
//             <div>
//               <h3 className="text-sm text-white/70">Kompetensi Keahlian</h3>
//               <p className="text-xl font-semibold mt-1">{sejarah.jumlahKompetensiKeahlian}</p>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold mb-3">Deskripsi</h3>
//             <p className="text-white/80 whitespace-pre-line">{sejarah.deskripsi}</p>
//           </div>

//           {sejarah.timeline?.length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Timeline Sejarah</h3>
//               <div className="space-y-6">
//                 {sejarah.timeline.map((item: any, i: number) => (
//                   <div key={i} className="border-l-4 border-blue-500 pl-4">
//                     <div className="flex items-baseline gap-3">
//                       <span className="text-2xl font-bold text-blue-400">{item.year}</span>
//                       <h4 className="text-lg font-medium">{item.title}</h4>
//                     </div>
//                     <p className="mt-2 text-white/80">{item.deskripsi}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {sejarah.daftarKepalaSekolah?.length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Daftar Kepala Sekolah</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {sejarah.daftarKepalaSekolah.map((k: any, i: number) => (
//                   <div key={i} className="bg-black/30 p-4 rounded-xl border border-white/10">
//                     {k.fotoUrl && (
//                     <img
//                       src={`${k.fotoUrl}`}
//                       alt={k.nama}
//                       className="w-24  h-24   object-cover rounded-full mx-auto mb-3 border-2 border-blue-500/30"
//                     />
//                     )}
//                     <h4 className="text-center font-medium">{k.nama}</h4>
//                     <p className="text-center text-sm text-white/60 mt-1">{k.tahunKerja}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       <SejarahModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         initialData={sejarah || {}}
//         onSubmit={handleSave}
//         isNew={!sejarah}
//       />
//     </div>
//   );
// }


import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Calendar, 
  Camera, 
  ChevronRight, 
  History, 
  Plus, 
  Save, 
  Trash2, 
  User, 
  X 
} from "lucide-react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const BASE_URL = "https://be-school.kiraproject.id";

// --- UI Components ---
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm placeholder:text-white/20"
  />
);

const TextArea = (props: any) => (
  <textarea
    {...props}
    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm min-h-[120px] resize-none placeholder:text-white/20"
  />
);

const Field: React.FC<{ label?: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2">
    {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 italic">{label}</label>}
    {children}
  </div>
);

// --- Main Component ---
export default function SejarahMain() {
  const [sejarah, setSejarah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [timeline, setTimeline] = useState<any[]>([]);
  const [kepsekList, setKepsekList] = useState<any[]>([]);
  const [kepsekFiles, setKepsekFiles] = useState<{ [key: number]: File }>({});

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const fetchSejarah = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/sejarah?schoolId=${schoolId}`);
      const json = await res.json();
      if (json.success) setSejarah(json.data);
    } catch (err) {
      console.error("Failed to fetch sejarah", err);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => { fetchSejarah(); }, [fetchSejarah]);

  // Modal Handlers
  const openModal = () => {
    setTimeline(sejarah?.timeline ? [...sejarah.timeline] : []);
    setKepsekList(sejarah?.daftarKepalaSekolah ? [...sejarah.daftarKepalaSekolah] : []);
    setKepsekFiles({});
    setIsModalOpen(true);
  };

  const handleFileChange = (index: number, file: File) => {
    setKepsekFiles(prev => ({ ...prev, [index]: file }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const payload = new FormData();
    payload.append("schoolId", schoolId.toString());
    payload.append("deskripsi", formData.get("deskripsi") as string);
    payload.append("tahunBerdiri", formData.get("tahunBerdiri") as string);
    payload.append("jumlahKompetensiKeahlian", formData.get("jumlahKompetensiKeahlian") as string);
    payload.append("timeline", JSON.stringify(timeline));
    payload.append("daftarKepalaSekolah", JSON.stringify(kepsekList));

    // Append Photos with Indices
    Object.entries(kepsekFiles).forEach(([index, file]) => {
      payload.append("kepalaPhotos", file);
      payload.append("photoIndices", index);
    });

    try {
      const url = sejarah ? `${BASE_URL}/sejarah/${sejarah.id}` : `${BASE_URL}/sejarah`;
      const method = sejarah ? "PUT" : "POST";
      const res = await fetch(url, { method, body: payload });
      if (res.ok) {
        setIsModalOpen(false);
        fetchSejarah();
      }
    } catch (err) {
      alert("Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white pb-20">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/10 pb-10 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3 font-black text-emerald-500 uppercase tracking-[0.4em] text-[10px]">
            <History size={14} /> Institutional Legacy
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
            Sejarah <span className="text-blue-700">Sekolah</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">Sejarah singkat terkait sekolah</p>
        </div>

        <button
          onClick={openModal}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
        >
          {sejarah ? "Perbarui Data" : "Buat Sejarah Baru"}
        </button>
      </header>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-white/20 uppercase text-[10px] tracking-widest">
          <FaSpinner className="animate-spin mb-4" size={30} /> Loading History...
        </div>
      ) : !sejarah ? (
        <div className="text-center py-32 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10 italic text-white/20">
          Data sejarah belum tersedia.
        </div>
      ) : (
        <div className="space-y-12">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Tahun Berdiri", val: sejarah.tahunBerdiri, icon: Calendar },
              { label: "Kepala Sekolah", val: sejarah.jumlahKepalaSekolah, icon: User },
              { label: "Kompetensi", val: sejarah.jumlahKompetensiKeahlian, icon: History },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex items-center gap-6">
                <div className="h-14 w-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500"><s.icon size={24}/></div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{s.label}</div>
                  <div className="text-3xl font-black italic tracking-tighter">{s.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKRIPSI */}
          <section className="bg-white/[0.03] p-10 rounded-[3rem] border border-white/5 leading-relaxed italic text-white/60">
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-6">Manifesto Sejarah</div>
            <p className="text-lg">{sejarah.deskripsi}</p>
          </section>

          {/* TIMELINE VISUAL */}
          {sejarah.timeline?.length > 0 && (
            <section className="space-y-8">
              <h2 className="text-xl font-black uppercase italic tracking-widest text-white/20 px-4">Milestone Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sejarah.timeline.map((t: any, i: number) => (
                  <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/5 flex gap-6 items-start">
                    <div className="text-2xl font-black italic text-emerald-500 leading-none">{t.year}</div>
                    <div className="space-y-2">
                        <div className="font-black uppercase tracking-widest text-sm">{t.title}</div>
                        <div className="text-xs text-white/40 italic leading-relaxed">{t.deskripsi}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* KEPALA SEKOLAH GRID */}
          {sejarah.daftarKepalaSekolah?.length > 0 && (
            <section className="space-y-8">
                <h2 className="text-xl font-black uppercase italic tracking-widest text-white/20 px-4">Leadership Journey</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {sejarah.daftarKepalaSekolah.map((k: any, i: number) => (
                        <div key={i} className="group text-center space-y-4">
                            <div className="aspect-square rounded-[2rem] overflow-hidden border-2 border-white/5 group-hover:border-emerald-500 transition-all grayscale group-hover:grayscale-0">
                                <img src={k.fotoUrl} alt={k.nama} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div>
                                <div className="font-black uppercase text-[11px] tracking-wider">{k.nama}</div>
                                <div className="text-[10px] text-white/40 italic uppercase tracking-tighter">{k.tahunKerja}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
          )}
        </div>
      )}

      {/* SLIDE-OVER MODAL */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[99999999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xl" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 w-full max-w-2xl">
            <Transition.Child as={Fragment} enter="transform transition duration-500 cubic-bezier(0,0,0.2,1)" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-500 cubic-bezier(0,0,0.2,1)" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full bg-[#0B1220] border-l border-white/10 p-10 flex flex-col shadow-2xl overflow-y-auto">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-2">
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] block italic">History Registry</span>
                    <Dialog.Title className="text-4xl font-black uppercase tracking-tighter text-white">
                      Perbarui
                    </Dialog.Title>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="h-12 w-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                  {/* Basic Info Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Tahun Berdiri">
                      <Input name="tahunBerdiri" type="number" defaultValue={sejarah?.tahunBerdiri} required />
                    </Field>
                    <Field label="Kompetensi Keahlian">
                      <Input name="jumlahKompetensiKeahlian" type="number" defaultValue={sejarah?.jumlahKompetensiKeahlian} />
                    </Field>
                  </div>

                  <Field label="Deskripsi Lengkap Sejarah">
                    <TextArea name="deskripsi" defaultValue={sejarah?.deskripsi} required />
                  </Field>

                  {/* Timeline Editor */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Timeline Editor</div>
                      <button type="button" onClick={() => setTimeline([...timeline, { year: "", title: "", deskripsi: "" }])} className="text-emerald-500 hover:text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Plus size={14} /> Add Year
                      </button>
                    </div>
                    <div className="space-y-4">
                      {timeline.map((t, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 relative group">
                          <button type="button" onClick={() => setTimeline(timeline.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-red-500/30 hover:text-red-500"><X size={14}/></button>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <Input placeholder="Tahun" value={t.year} onChange={(e) => {
                                const n = [...timeline]; n[i].year = e.target.value; setTimeline(n);
                            }} />
                            <div className="col-span-2">
                                <Input placeholder="Judul Peristiwa" value={t.title} onChange={(e) => {
                                    const n = [...timeline]; n[i].title = e.target.value; setTimeline(n);
                                }} />
                            </div>
                          </div>
                          <TextArea placeholder="Deskripsi detail peristiwa..." value={t.deskripsi} onChange={(e: any) => {
                              const n = [...timeline]; n[i].deskripsi = e.target.value; setTimeline(n);
                          }} className="!min-h-[80px] !bg-black/20" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kepsek Editor */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Leadership Roster</div>
                      <button type="button" onClick={() => setKepsekList([...kepsekList, { nama: "", tahunKerja: "" }])} className="text-emerald-500 hover:text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Plus size={14} /> Add Principal
                      </button>
                    </div>
                    <div className="grid gap-4">
                      {kepsekList.map((k, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex gap-6 items-center">
                            <div className="relative group/photo h-20 w-20 flex-shrink-0 bg-black/40 rounded-2xl overflow-hidden border border-white/10">
                                {kepsekFiles[i] || k.fotoUrl ? (
                                    <img src={kepsekFiles[i] ? URL.createObjectURL(kepsekFiles[i]) : k.fotoUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10"><Camera size={24}/></div>
                                )}
                                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileChange(i, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <Input placeholder="Nama Lengkap" value={k.nama} onChange={(e) => {
                                    const n = [...kepsekList]; n[i].nama = e.target.value; setKepsekList(n);
                                }} />
                                <Input placeholder="Masa Jabatan" value={k.tahunKerja} onChange={(e) => {
                                    const n = [...kepsekList]; n[i].tahunKerja = e.target.value; setKepsekList(n);
                                }} />
                            </div>
                            <button type="button" onClick={() => setKepsekList(kepsekList.filter((_, idx) => idx !== i))} className="text-red-500/20 hover:text-red-500"><Trash2 size={18}/></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-[2] py-5 bg-emerald-600 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-emerald-500 transition-colors disabled:opacity-50">
                      {isSubmitting ? <FaSpinner className="animate-spin" /> : <Save size={16} />} 
                      Save Legacy
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}