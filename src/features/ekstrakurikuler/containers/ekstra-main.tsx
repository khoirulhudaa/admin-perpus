// import { useSchool } from "@/features/schools";
// import { Dialog, Transition } from "@headlessui/react";
// import { AnimatePresence, motion } from "framer-motion";
// import React, { useCallback, useEffect, useState } from "react";
// import { FaSpinner } from "react-icons/fa";

// // ────────────────────────────────────────────────
// // Theme & Utility sama seperti di Prestasi (copy-paste)
// // ────────────────────────────────────────────────

// const clsx = (...args: Array<string | false | null | undefined>): string =>
//   args.filter(Boolean).join(" ");

// interface AlertState {
//   message: string;
//   isVisible: boolean;
// }

// const useAlert = () => {
//   const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

//   const showAlert = useCallback((message: string) => {
//     setAlert({ message, isVisible: true });
//   }, []);

//   const hideAlert = useCallback(() => {
//     setAlert({ message: "", isVisible: false });
//   }, []);

//   return { alert, showAlert, hideAlert };
// };

// const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
//   const isSuccess = message.toLowerCase().includes("berhasil");

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={clsx(
//         "mb-4 rounded-xl border p-4 text-sm",
//         isSuccess
//           ? "border-green-500/30 bg-green-500/10 text-green-300"
//           : "border-red-500/30 bg-red-500/10 text-red-300"
//       )}
//     >
//       <div className="flex items-start justify-between">
//         <div className="whitespace-pre-line">{message}</div>
//         <button
//           type="button"
//           onClick={onClose}
//           className={clsx(
//             "ml-4",
//             isSuccess ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400"
//           )}
//         >
//           ✕
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// const Icon = ({ label }: { label: string }) => (
//   <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
//     {label}
//   </span>
// );
// const ISave = () => <Icon label="💾" />;
// const IEdit = () => <Icon label="✏️" />;
// const IDelete = () => <Icon label="🗑️" />;

// interface FieldProps {
//   label?: string;
//   hint?: string;
//   children: React.ReactNode;
//   className?: string;
// }

// const Field: React.FC<FieldProps> = ({ label, hint, children, className }) => (
//   <label className={clsx("block", className)}>
//     {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
//     {children}
//     {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
//   </label>
// );

// const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
//   <input
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
//       className
//     )}
//   />
// );

// const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
//   <textarea
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none resize-y min-h-[80px]",
//       className
//     )}
//   />
// );

// const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, ...props }) => (
//   <select
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
//       className
//     )}
//   />
// );

// // ────────────────────────────────────────────────
// // Interface sesuai model backend
// // ────────────────────────────────────────────────
// interface Ekstrakurikuler {
//   id: number;
//   name: string;
//   description: string;
//   schedule?: string | null;
//   mentor?: string | null;
//   category: string;
//   imageUrl?: string | null;
//   schoolId: number;
//   isActive: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// const DEFAULT_EKSKUL: Ekstrakurikuler = {
//   id: 0,
//   name: "",
//   description: "",
//   schedule: "",
//   mentor: "",
//   category: "Lainnya",
//   imageUrl: "",
//   schoolId: 0,
//   isActive: true,
// };

// const API_BASE = "https://be-school.kiraproject.id/ekstrakurikuler";  // sesuaikan jika port/path beda

// export function Ekstrakurikuler() {
//   const [ekskulList, setEkskulList] = useState<Ekstrakurikuler[]>([]);
//   const [formData, setFormData] = useState<Ekstrakurikuler>(DEFAULT_EKSKUL);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();

//   const schoolQuery = useSchool();
//   const schoolId = schoolQuery?.data?.[0]?.id; // sesuaikan path jika berbeda

//   // Fetch data
//   const fetchData = async () => {
//     if (!schoolId) {
//       showAlert("School ID tidak ditemukan");
//       return;
//     }

//     setLoading(true);
//     try {
//       const url = `${API_BASE}?schoolId=${schoolId}`;
//       const res = await fetch(url, { cache: "no-store" });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const json = await res.json();
//       if (!json.success || !Array.isArray(json.data)) {
//         throw new Error("Format response tidak valid");
//       }

//       setEkskulList(json.data);
//     } catch (err: any) {
//       showAlert(`Gagal memuat data: ${err.message}`);
//       setEkskulList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (schoolId) fetchData();
//   }, [schoolId]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!schoolId) {
//       showAlert("School ID tidak tersedia");
//       return;
//     }

//     setLoading(true);

//     try {
//       const formPayload = new FormData();
//       formPayload.append("name", formData.name.trim());
//       formPayload.append("description", formData.description.trim());
//       formPayload.append("schoolId", schoolId.toString());

//       if (formData.schedule?.trim())    formPayload.append("schedule", formData.schedule.trim());
//       if (formData.mentor?.trim())       formPayload.append("mentor", formData.mentor.trim());
//       if (formData.category?.trim())     formPayload.append("category", formData.category.trim());

//       if (selectedFile) {
//         formPayload.append("image", selectedFile);   // ← field name harus 'image' sesuai multer.single('image')
//       }

//       let res: Response;

//       if (editingId) {
//         res = await fetch(`${API_BASE}/${editingId}`, {
//           method: "PUT",
//           body: formPayload,
//         });
//       } else {
//         res = await fetch(API_BASE, {
//           method: "POST",
//           body: formPayload,
//         });
//       }

//       if (!res.ok) {
//         const errJson = await res.json().catch(() => ({}));
//         throw new Error(errJson.message || `Gagal menyimpan (${res.status})`);
//       }

//       showAlert(editingId ? "Ekstrakurikuler berhasil diperbarui" : "Ekstrakurikuler berhasil ditambahkan");

//       // Reset form
//       setFormData(DEFAULT_EKSKUL);
//       setSelectedFile(null);
//       setPreviewUrl(null);
//       setEditingId(null);
//       setIsModalOpen(false);
//       await fetchData();
//     } catch (err: any) {
//       showAlert(`Gagal menyimpan: ${err.message}`);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item: Ekstrakurikuler) => {
//     setFormData({ ...item });
//     setSelectedFile(null);
//     setPreviewUrl(item.imageUrl || null);
//     setEditingId(item.id);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Yakin ingin menghapus ekstrakurikuler ini?")) return;

//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
//       if (!res.ok) {
//         const errJson = await res.json().catch(() => ({}));
//         throw new Error(errJson.message || "Gagal menghapus");
//       }

//       showAlert("Ekstrakurikuler berhasil dihapus");
//       await fetchData();
//     } catch (err: any) {
//       showAlert(`Gagal menghapus: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenModal = () => {
//     setFormData(DEFAULT_EKSKUL);
//     setSelectedFile(null);
//     setPreviewUrl(null);
//     setEditingId(null);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setFormData(DEFAULT_EKSKUL);
//     setSelectedFile(null);
//     if (previewUrl) URL.revokeObjectURL(previewUrl);
//     setPreviewUrl(null);
//     setEditingId(null);
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="space-y-6 py-4 mb-10">

//       <div className="flex justify-start">
//         <button
//           onClick={handleOpenModal}
//           className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600 disabled:opacity-60"
//           disabled={loading}
//         >
//           <ISave /> Tambah Ekstrakurikuler
//         </button>
//       </div>

//       {/* Modal */}
//       <Transition appear show={isModalOpen} as={React.Fragment}>
//         <Dialog as="div" className="z-[99999999999] fixed overflow-auto top-0 right-0" onClose={handleCloseModal}>
//           <Transition.Child
//             as={React.Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-90" />
//           </Transition.Child>

//           <div className="fixed right-0 top-0 h-screen inset-0 overflow-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={React.Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="fixed h-screen w-full md:w-[40vw] right-0 overflow-auto top-0 transform rounded-2xl border border-white/20 bg-black/40 p-6 text-left align-middle shadow-xl transition-all backdrop-blur-sm">
//                   <Dialog.Title className="mb-4 text-lg font-semibold text-white">
//                     {editingId ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"}
//                   </Dialog.Title>

//                   <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
//                     <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                       <Field label="Nama Ekstrakurikuler">
//                         <Input
//                           name="name"
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           placeholder="Contoh: Pramuka, Tari Tradisional"
//                           required
//                           disabled={loading}
//                         />
//                       </Field>

//                       <Field label="Kategori">
//                         <Select name="category" value={formData.category} onChange={handleInputChange} disabled={loading}>
//                           <option className="text-black" value="Lainnya">Lainnya</option>
//                           <option className="text-black" value="Olahraga">Olahraga</option>
//                           <option className="text-black" value="Seni">Seni</option>
//                           <option className="text-black" value="Keagamaan">Keagamaan</option>
//                           <option className="text-black" value="Karya Ilmiah">Karya Ilmiah</option>
//                           <option className="text-black" value="Jurnalistik">Jurnalistik</option>
//                         </Select>
//                       </Field>

//                       <Field label="Jadwal" className="md:col-span-2">
//                         <Input
//                           name="schedule"
//                           value={formData.schedule ?? ""}
//                           onChange={handleInputChange}
//                           placeholder="Sabtu 14:00 - 16:00"
//                           disabled={loading}
//                         />
//                       </Field>

//                       <Field label="Pembina / Mentor" className="md:col-span-2">
//                         <Input
//                           name="mentor"
//                           value={formData.mentor ?? ""}
//                           onChange={handleInputChange}
//                           placeholder="Nama pembina / pelatih"
//                           disabled={loading}
//                         />
//                       </Field>

//                       <Field label="Deskripsi" className="md:col-span-2">
//                         <TextArea
//                           name="description"
//                           value={formData.description}
//                           onChange={handleInputChange}
//                           placeholder="Jelaskan kegiatan, tujuan, dan manfaat ekstrakurikuler..."
//                           disabled={loading}
//                         />
//                       </Field>

//                       <Field label="Upload Gambar" className="md:col-span-2">
//                         <input
//                           type="file"
//                           accept="image/jpeg,image/png,image/webp"
//                           onChange={handleFileChange}
//                           disabled={loading}
//                           className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600/40 file:text-blue-100 hover:file:bg-blue-600/60 file:cursor-pointer cursor-pointer"
//                         />
//                         <p className="mt-1.5 text-xs text-white/50">Maksimal 5MB • Format: JPG, PNG, WebP</p>
//                       </Field>

//                       {(previewUrl || formData.imageUrl) && (
//                         <div className="relative h-[250px] md:col-span-2">
//                           <Field label="Preview Gambar">
//                             <div className="mt-2 p-2 w-40 overflow-hidden rounded-lg h-40 border border-white/20 bg-black/30">
//                               <img
//                                 src={previewUrl || formData.imageUrl || ""}
//                                 alt="Preview ekstrakurikuler"
//                                 className="max-h-40 w-full object-contain"
//                               />
//                             </div>
//                           </Field>
//                         </div>
//                       )}
//                     </div>

//                     <div className="relative top-[-20px] w-full grid grid-cols-2 justify-end gap-3">
//                       <button
//                         type="button"
//                         onClick={handleCloseModal}
//                         className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 disabled:opacity-50"
//                         disabled={loading}
//                       >
//                         Batal
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
//                       >
//                         {loading ? <FaSpinner className="animate-spin" /> : <ISave />}
//                         {editingId ? "Update Ekskul" : "Simpan Ekskul"}
//                       </button>
//                       <br />
//                     </div>
//                   </form>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* Daftar Ekstrakurikuler */}
//       <div className="rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur-sm">
//         <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

//         {loading && <div className="py-10 text-center text-white/60">Memuat data ekstrakurikuler...</div>}

//         {!loading && ekskulList.length === 0 && (
//           <div className="py-10 text-center text-white/60">Belum ada data ekstrakurikuler untuk sekolah ini.</div>
//         )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {ekskulList.map((item) => (
//             <div
//               key={item.id}
//               className="flex flex-col gap-4 rounded-lg border border-white/15 bg-black/30 p-4"
//             >
//               <div className="flex-1">
//                 <div className="font-medium text-white text-lg">{item.name}</div>
//                 <div className="mt-1 text-xs text-white/70">
//                   {item.category} • {item.mentor || "—"}
//                 </div>
//                 {item.schedule && (
//                   <div className="text-xs text-blue-300 mt-0.5">Jadwal: {item.schedule}</div>
//                 )}

//                 <div className="w-full h-[180px] p-2 overflow-hidden border border-white/30 mt-4 rounded-lg">
//                   {item.imageUrl && (
//                     <img
//                       src={item.imageUrl}
//                       alt={item.name}
//                       className="h-full w-full object-contain"
//                     />
//                   )}
//                 </div>

//                 <div className="mt-3 text-sm text-white/90 line-clamp-4">
//                   {item.description}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-2 border-t border-white/30 pt-3">
//                 <button
//                   onClick={() => handleEdit(item)}
//                   disabled={loading}
//                   className="flex items-center justify-center gap-1 rounded-lg bg-blue-600/30 px-3 py-2.5 text-xs text-blue-200 hover:bg-blue-600/50 disabled:opacity-50"
//                 >
//                   <IEdit /> Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(item.id)}
//                   disabled={loading}
//                   className="flex items-center justify-center gap-1 rounded-lg bg-red-600/30 px-3 py-2.5 text-xs text-red-200 hover:bg-red-600/50 disabled:opacity-50"
//                 >
//                   <IDelete /> Hapus
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState, Fragment } from "react";
import { FaSpinner } from "react-icons/fa";
import { 
  Plus, 
  Users, 
  Calendar, 
  UserCircle, 
  Tags, 
  Pen, 
  Trash, 
  X, 
  UploadCloud,
  Info,
  ChevronRight
} from "lucide-react";

// --- Utility & Alert Components ---
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

interface AlertState {
  message: string;
  isVisible: boolean;
}

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });
  const showAlert = useCallback((message: string) => setAlert({ message, isVisible: true }), []);
  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
  return { alert, showAlert, hideAlert };
};

const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const isSuccess = message.toLowerCase().includes("berhasil");
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "flex items-center justify-between px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl",
        isSuccess ? "bg-emerald-600 border-emerald-400/50 text-white" : "bg-red-600 border-red-400/50 text-white"
      )}
    >
      <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
        <Info size={18} />
        {message}
      </div>
      <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={18} /></button>
    </motion.div>
  );
};

// --- Form UI Helpers ---
const Field: React.FC<{ label?: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <div className={clsx("space-y-2", className)}>
    {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 italic">{label}</label>}
    {children}
  </div>
);

// --- Data Interface ---
interface Ekstrakurikuler {
  id: number;
  name: string;
  description: string;
  schedule?: string | null;
  mentor?: string | null;
  category: string;
  imageUrl?: string | null;
  schoolId: number;
  isActive: boolean;
}

const DEFAULT_EKSKUL: Ekstrakurikuler = {
  id: 0,
  name: "",
  description: "",
  schedule: "",
  mentor: "",
  category: "Lainnya",
  imageUrl: "",
  schoolId: 0,
  isActive: true,
};

const API_BASE = "https://be-school.kiraproject.id/ekstrakurikuler";

export function Ekstrakurikuler() {
  const [ekskulList, setEkskulList] = useState<Ekstrakurikuler[]>([]);
  const [formData, setFormData] = useState<Ekstrakurikuler>(DEFAULT_EKSKUL);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  // --- Core Functions ---
  const fetchData = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) setEkskulList(json.data);
    } catch (err: any) {
      showAlert(`Gagal memuat data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (schoolId) fetchData(); }, [schoolId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name.trim());
      formPayload.append("description", formData.description.trim());
      formPayload.append("schoolId", schoolId.toString());
      if (formData.schedule) formPayload.append("schedule", formData.schedule.trim());
      if (formData.mentor) formPayload.append("mentor", formData.mentor.trim());
      if (formData.category) formPayload.append("category", formData.category);
      if (selectedFile) formPayload.append("image", selectedFile);

      const res = await fetch(editingId ? `${API_BASE}/${editingId}` : API_BASE, {
        method: editingId ? "PUT" : "POST",
        body: formPayload,
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");
      showAlert(editingId ? "Ekstrakurikuler berhasil diperbarui" : "Ekstrakurikuler berhasil ditambahkan");
      handleCloseModal();
      fetchData();
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus ekstrakurikuler ini?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      showAlert("Ekstrakurikuler berhasil dihapus");
      fetchData();
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Ekstrakurikuler) => {
    setFormData({ ...item });
    setPreviewUrl(item.imageUrl || null);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setFormData(DEFAULT_EKSKUL);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(DEFAULT_EKSKUL);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen text-white space-y-0 pb-20">
      
      {/* 1. ALERT SYSTEM */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[999999] w-full max-w-md px-4">
        <AnimatePresence>
          {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
        </AnimatePresence>
      </div>

      {/* 2. HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/10 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3 font-black text-blue-500 uppercase tracking-[0.4em] text-[10px]">
            <Users size={14} />
            Student Development
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
            Ekstra<span className="text-blue-700">kurikuler</span>
          </h1>
          <p className="text-white/40 text-sm font-medium italic">Wadah pengembangan bakat, minat, dan kreativitas siswa.</p>
        </div>

        <button
          onClick={handleOpenModal}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
          disabled={loading}
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Tambah Ekskul
        </button>
      </header>

      {/* 3. CONTENT AREA */}
      <main className="min-h-[50vh] pt-10">
        {loading && !ekskulList.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20 italic tracking-widest uppercase text-[10px]">
            <FaSpinner className="animate-spin mb-4" size={30} />
            Syncing Database...
          </div>
        ) : ekskulList.length === 0 ? (
          <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-white/20 italic uppercase tracking-[0.5em] text-[10px]">
            Data ekstrakurikuler kosong
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ekskulList.map((item) => (
              <div key={item.id} className="group relative bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/40 transition-all duration-500">
                <div className="relative h-64 overflow-hidden bg-zinc-900">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={item.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/5"><Users size={48} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  <div className="absolute top-6 left-6 bg-blue-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                    {item.category}
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter line-clamp-1">{item.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest italic">
                      <Calendar size={12} className="text-blue-500"/> {item.schedule || "Jadwal Belum Diatur"}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest italic">
                      <UserCircle size={12} className="text-blue-500"/> Pembina: {item.mentor || "N/A"}
                    </div>
                  </div>
                  <p className="text-sm text-white/60 line-clamp-3 italic leading-relaxed pt-2">{item.description}</p>

                  <div className="flex gap-3 pt-6 border-t border-white/5">
                    <button onClick={() => handleEdit(item)} className="flex-1 bg-white/5 hover:bg-white/10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center justify-center gap-2">
                      <Pen size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-500/20">
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. SLIDE-OVER MODAL */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[99999999]" onClose={handleCloseModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xl" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 w-full max-w-xl">
            <Transition.Child as={Fragment} enter="transform transition duration-500 ease-in-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-500 ease-in-out" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full bg-[#0B1220] border-l border-white/10 p-12 flex flex-col shadow-2xl overflow-y-auto">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block italic italic">Management Console</span>
                    <Dialog.Title className="text-4xl font-black uppercase tracking-tighter text-white">
                      {editingId ? "Perbarui" : "Tambah"} <span className="text-white/30 text-3xl">Ekskul</span>
                    </Dialog.Title>
                  </div>
                  <button onClick={handleCloseModal} className="h-12 w-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <Field label="Nama Ekstrakurikuler">
                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" placeholder="Contoh: Basket, Coding Club" required />
                  </Field>

                  <div className="grid grid-cols-2 gap-6">
                    <Field label="Kategori">
                      <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer">
                        {["Lainnya", "Olahraga", "Seni", "Keagamaan", "Karya Ilmiah", "Jurnalistik"].map(cat => (
                          <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Jadwal Rutin">
                      <input name="schedule" value={formData.schedule ?? ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" placeholder="Senin & Rabu" />
                    </Field>
                  </div>

                  <Field label="Pembina / Mentor">
                    <input name="mentor" value={formData.mentor ?? ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" placeholder="Nama Guru / Pelatih" />
                  </Field>

                  <Field label="Deskripsi Kegiatan">
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm min-h-[120px]" placeholder="Jelaskan detail kegiatan..." />
                  </Field>

                  <Field label="Foto Utama (Banner)">
                    <div className="relative group border-2 border-dashed border-white/5 rounded-[2rem] p-10 text-center hover:bg-white/5 transition-all">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <UploadCloud size={32} className="mx-auto mb-4 text-white/20 group-hover:text-blue-500 transition-colors" />
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{selectedFile ? selectedFile.name : "Unggah Foto Kegiatan"}</p>
                    </div>
                  </Field>

                  {(previewUrl || formData.imageUrl) && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-2">
                      <img src={previewUrl || formData.imageUrl || ""} className="w-full max-h-40 object-contain rounded-xl" alt="Preview" />
                    </div>
                  )}

                  <div className="pt-10 flex gap-4">
                    <button type="button" onClick={handleCloseModal} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">Batal</button>
                    <button type="submit" disabled={loading} className="flex-[2] py-5 bg-blue-600 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3">
                      {loading ? <FaSpinner className="animate-spin" /> : <Users size={16} />}
                      {editingId ? "Update Database" : "Simpan Data"}
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