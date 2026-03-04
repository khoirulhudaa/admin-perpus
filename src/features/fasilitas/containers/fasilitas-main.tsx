// import { useSchool } from "@/features/schools";
// import { Dialog, Transition } from "@headlessui/react";
// import { AnimatePresence, motion } from "framer-motion";
// import { X } from "lucide-react";
// import React, { Fragment, useCallback, useEffect, useState } from "react";
// import { FaSpinner } from "react-icons/fa";

// const clsx = (...args: Array<string | false | null | undefined>): string =>
//   args.filter(Boolean).join(" ");

// interface AlertState {
//   message: string;
//   isVisible: boolean;
// }

// const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
//   const isSuccess = message.toLowerCase().includes("berhasil");
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={clsx(
//         "mb-5 rounded-xl border p-4 text-sm shadow-sm",
//         isSuccess ? "border-green-500/30 bg-green-900/20 text-green-200" : "border-red-500/30 bg-red-900/20 text-red-200"
//       )}
//     >
//       <div className="flex items-start justify-between">
//         <div className="whitespace-pre-line leading-relaxed">{message}</div>
//         <button type="button" onClick={onClose} className="ml-3 text-lg font-bold">✕</button>
//       </div>
//     </motion.div>
//   );
// };

// const Icon = ({ label }: { label: string }) => (
//   <span aria-hidden className="inline-block align-middle select-none w-4 text-center">{label}</span>
// );
// const ISave = () => <Icon label="💾" />;
// const IEdit = () => <Icon label="✏️" />;
// const IDelete = () => <Icon label="🗑️" />;

// const Field: React.FC<{ label?: string; hint?: string; children: React.ReactNode; className?: string }> = ({
//   label, hint, children, className,
// }) => (
//   <label className={clsx("block", className)}>
//     {label && <div className="mb-1.5 text-xs font-medium text-white/80">{label}</div>}
//     {children}
//     {hint && <div className="mt-1 text-[11px] text-white/50">{hint}</div>}
//   </label>
// );

// const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
//   <input
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-blue-500/50 transition",
//       className
//     )}
//     {...props}
//   />
// );

// const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
//   <textarea
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-blue-500/50 transition resize-y min-h-[120px]",
//       className
//     )}
//     {...props}
//   />
// );

// interface FacilityItem {
//   id: number;
//   name: string;
//   description: string;
//   imageUrl?: string | null;
//   schoolId: number;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// const DEFAULT_FACILITY: FacilityItem = {
//   id: 0,
//   name: "",
//   description: "",
//   imageUrl: null,
//   schoolId: 0,
//   isActive: true,
//   createdAt: "",
//   updatedAt: "",
// };

// const API_BASE = "https://be-school.kiraproject.id/fasilitas";

// const useAlert = () => {
//   const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });
//   const showAlert = useCallback((message: string) => setAlert({ message, isVisible: true }), []);
//   const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
//   return { alert, showAlert, hideAlert };
// };

// export default function FasilitasMain() {
//   const [facilities, setFacilities] = useState<FacilityItem[]>([]);
//   const [formData, setFormData] = useState<FacilityItem>(DEFAULT_FACILITY);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const schoolQuery = useSchool();
//   const schoolId = schoolQuery?.data?.[0]?.id;

//   const { alert, showAlert, hideAlert } = useAlert();

//   const fetchData = async () => {
//     if (!schoolId) {
//       showAlert("School ID tidak ditemukan");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}?schoolId=${schoolId}`, { cache: "no-store" });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const json = await res.json();
//       if (!json.success || !Array.isArray(json.data)) throw new Error("Format response invalid");
//       setFacilities(json.data);
//     } catch (err: any) {
//       showAlert(`Gagal memuat fasilitas: ${err.message}`);
//       setFacilities([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (schoolId) fetchData();
//   }, [schoolId]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
//     if (!formData.name.trim() || !formData.description.trim()) {
//       showAlert("Nama dan deskripsi fasilitas wajib diisi");
//       return;
//     }

//     setLoading(true);
//     try {
//       const formPayload = new FormData();
//       formPayload.append("name", formData.name.trim());
//       formPayload.append("description", formData.description.trim());
//       formPayload.append("schoolId", schoolId.toString());
//       if (selectedFile) formPayload.append("imageUrl", selectedFile); // field name sesuai multer

//       const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, { method, body: formPayload });

//       if (!res.ok) {
//         const errJson = await res.json().catch(() => ({}));
//         throw new Error(errJson.message || `Gagal menyimpan (${res.status})`);
//       }

//       showAlert(editingId ? "Fasilitas berhasil diperbarui" : "Fasilitas berhasil ditambahkan");

//       setFormData(DEFAULT_FACILITY);
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

//   const handleEdit = (item: FacilityItem) => {
//     setFormData({ ...item });
//     setSelectedFile(null);
//     setPreviewUrl(item.imageUrl || null);
//     setEditingId(item.id);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Yakin ingin menghapus fasilitas ini?")) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Gagal menghapus");
//       showAlert("Fasilitas berhasil dihapus");
//       await fetchData();
//     } catch (err: any) {
//       showAlert(`Gagal menghapus: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = () => {
//     setFormData(DEFAULT_FACILITY);
//     setSelectedFile(null);
//     setPreviewUrl(null);
//     setEditingId(null);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setFormData(DEFAULT_FACILITY);
//     setSelectedFile(null);
//     if (previewUrl) URL.revokeObjectURL(previewUrl);
//     setPreviewUrl(null);
//     setEditingId(null);
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="space-y-6 py-4">
//       <div className="flex items-center justify-between">
//         <button
//           onClick={openModal}
//           disabled={loading}
//           className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60 transition"
//         >
//           <ISave /> Tambah Fasilitas
//         </button>
//       </div>

//       <Transition appear show={isModalOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-[99999]" onClose={closeModal}>
//           <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
//             <div className="fixed top-0 right-0 inset-0 bg-black/80" />
//           </Transition.Child>
//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
//                 <Dialog.Panel className="absolute top-0 right-0 w-full max-w-md transform border border-white/10 bg-black/60 p-6 text-left h-screen overflow-auto align-middle shadow-2xl backdrop-blur-md">
//                   <div className="relative border-b border-white/10 flex justify-between items-center z-[99999] pb-5 pt-1 mb-6">
//                     <h2 className="text-xl font-semibold text-white">{editingId ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}</h2>
//                     <button onClick={closeModal} className="text-gray-400 hover:text-white">
//                       <X size={24} />
//                     </button>
//                   </div>

//                   <form onSubmit={handleSubmit} className="space-y-5">
//                     <Field label="Nama Fasilitas">
//                       <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Contoh: Lapangan Basket" required disabled={loading} />
//                     </Field>

//                     <Field label="Deskripsi">
//                       <TextArea name="description" value={formData.description} onChange={handleInputChange} placeholder="Jelaskan fasilitas ini..." required disabled={loading} />
//                     </Field>

//                     <Field label="Gambar Fasilitas (opsional)" hint="JPG, PNG, WebP • Maks 5MB">
//                       <input
//                         type="file"
//                         accept="image/jpeg,image/png,image/webp"
//                         onChange={handleFileChange}
//                         disabled={loading}
//                         className="block w-full text-sm text-white/80 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-700/30 file:text-blue-100 hover:file:bg-blue-700/50 file:cursor-pointer cursor-pointer"
//                       />
//                     </Field>

//                     {(previewUrl || formData.imageUrl) && (
//                       <div className="mt-2">
//                         <img
//                           src={previewUrl || formData.imageUrl || ""}
//                           alt="Preview fasilitas"
//                           className="max-h-64 w-full object-contain rounded-xl border border-white/15 shadow-sm"
//                         />
//                       </div>
//                     )}

//                     <div className="w-full grid grid-cols-2 justify-end gap-4 pt-6 border-t border-white/30">
//                       <button type="button" onClick={closeModal} disabled={loading} className="rounded-xl border border-white/20 px-6 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5 transition disabled:opacity-50">
//                         Batal
//                       </button>
//                       <button type="submit" disabled={loading} className="inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition">
//                         {loading && <FaSpinner className="animate-spin" />}
//                         <ISave />
//                         {editingId ? "Update" : "Simpan"}
//                       </button>
//                     </div>
//                   </form>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>

//       <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
//         <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

//         {loading ? (
//           <div className="py-12 text-center text-white/60 flex items-center justify-center gap-3">
//             <FaSpinner className="animate-spin" /> Memuat...
//           </div>
//         ) : facilities.length === 0 ? (
//           <div className="py-12 text-center text-white/50">Belum ada data fasilitas.</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {facilities.map((item) => (
//               <div key={item.id} className="flex flex-col rounded-xl border border-white/10 bg-black/40 p-5 hover:border-blue-500/30 transition group">
//                 {item.imageUrl && (
//                   <div className="overflow-hidden rounded-lg border border-white/10 h-48 mb-4">
//                     <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
//                   </div>
//                 )}

//                 <div className="font-semibold text-lg text-white group-hover:text-blue-300 transition mb-2 line-clamp-2">
//                   {item.name}
//                 </div>

//                 <p className="text-sm text-white/80 line-clamp-4 flex-1 mb-4">
//                   {item.description}
//                 </p>

//                 <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
//                   <button onClick={() => handleEdit(item)} disabled={loading} className="flex items-center justify-center gap-2 rounded-lg bg-blue-600/20 px-4 py-2 text-sm text-blue-300 hover:bg-blue-600/40 transition disabled:opacity-50">
//                     <IEdit /> Edit
//                   </button>
//                   <button onClick={() => handleDelete(item.id)} disabled={loading} className="flex items-center justify-center gap-2 rounded-lg bg-red-600/20 px-4 py-2 text-sm text-red-300 hover:bg-red-600/40 transition disabled:opacity-50">
//                     <IDelete /> Hapus
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Save,
  Loader2,
  Edit,
  Trash2,
  Image as ImageIcon,
  X,
  School,
  Info,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";

const API_BASE = "https://be-school.kiraproject.id/fasilitas";

// === ALERT SYSTEM ===
const useAlert = () => {
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean }>({
    message: "",
    isVisible: false,
  });

  const showAlert = (message: string) => {
    setAlert({ message, isVisible: true });
    setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
  };

  const hideAlert = () => setAlert({ message: "", isVisible: false });

  return { alert, showAlert, hideAlert };
};

const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-6 right-6 z-[999999] rounded-2xl border p-5 shadow-2xl backdrop-blur-xl text-sm font-medium tracking-tight ${
        isSuccess
          ? "border-blue-500/40 bg-blue-600/10 text-blue-100"
          : "border-red-500/40 bg-red-600/10 text-red-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-lg font-black">{isSuccess ? "✓" : "✕"}</div>
        <div className="whitespace-pre-line">{message}</div>
        <button onClick={onClose} className="ml-3 opacity-70 hover:opacity-100">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// === INTERFACE ===
interface FacilityItem {
  id: number;
  name: string;
  description: string;
  imageUrl?: string | null;
  schoolId: number;
}

const DEFAULT_FACILITY = { id: 0, name: "", description: "", imageUrl: null };

// === MODAL COMPONENT (Slide-over) ===
const FacilityModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
  loading,
  schoolId,
}: any) => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
      });
      setPreview(initialData.imageUrl || null);
      setSelectedFile(null);
    }
  }, [open, initialData]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("description", form.description.trim());
    fd.append("schoolId", schoolId.toString());
    if (selectedFile) fd.append("imageUrl", selectedFile);
    await onSubmit(fd);
  };

  if (!open) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999]"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0B1220] border-l border-white/10 shadow-2xl overflow-y-auto z-[100000] flex flex-col"
      >
        <div className="p-10 border-b border-white/8 flex justify-between items-center bg-[#0B1220]">
          <div>
            <h3 className="text-4xl font-black tracking-tighter text-white">
              {initialData.id ? "Edit" : "Tambah"} <span className="text-blue-600">Fasilitas</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Sarana & Prasarana Sekolah
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-10 space-y-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">Nama Fasilitas *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Contoh: Laboratorium Komputer"
              required
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">Deskripsi Fasilitas *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Jelaskan detail dan fungsi fasilitas ini..."
              rows={5}
              required
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">Foto Fasilitas</label>
            <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/15 rounded-3xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all relative overflow-hidden group">
              {preview ? (
                <img src={preview} className="absolute inset-0 w-full h-full object-cover" alt="preview" />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <ImageIcon className="text-blue-500" size={40} />
                  <span className="text-xs font-black uppercase tracking-wider text-white/70">Upload Foto</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/8">
            <button
              type="button"
              onClick={onClose}
              className="py-4 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
                loading ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? "Menyimpan..." : "Simpan Fasilitas"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

// === MAIN COMPONENT ===
export default function FasilitasMain() {
  const { data: schoolData } = useSchool();
  const schoolId = schoolData?.[0]?.id;

  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(DEFAULT_FACILITY);
  const { alert, showAlert, hideAlert } = useAlert();

  const fetchData = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setFacilities(json.data || []);
    } catch (err) {
      showAlert("Gagal memuat data fasilitas");
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (payload: FormData) => {
    setLoading(true);
    try {
      const isEdit = !!editingItem.id;
      const url = isEdit ? `${API_BASE}/${editingItem.id}` : API_BASE;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: payload,
      });

      if (!res.ok) throw new Error();
      showAlert(isEdit ? "Fasilitas diperbarui" : "Fasilitas ditambahkan");
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showAlert("Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus fasilitas ini secara permanen?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showAlert("Fasilitas telah dihapus");
      fetchData();
    } catch (err) {
      showAlert("Gagal menghapus fasilitas");
    }
  };

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <School size={14} /> Infrastructure Management
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Fasilitas <span className="text-blue-600">Sekolah</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola informasi sarana pendukung belajar mengajar</p>
        </div>

        <button
          onClick={() => {
            setEditingItem(DEFAULT_FACILITY);
            setModalOpen(true);
          }}
          disabled={loading || !schoolId}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50"
        >
          <Plus size={18} /> Tambah Fasilitas
        </button>
      </div>

      {/* Content Section */}
      {loading && facilities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
            Menghubungkan ke server...
          </div>
        </div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.02] border border-white/5 rounded-[40px] backdrop-blur-sm">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
            <Info size={40} className="text-zinc-600" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Data Kosong</h3>
          <p className="text-zinc-500">Belum ada fasilitas yang terdaftar di sistem.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-white/[0.03] border border-white/10 rounded-[32px] overflow-hidden hover:bg-blue-600/[0.04] hover:border-blue-500/40 transition-all duration-500"
            >
              <div className="aspect-video relative overflow-hidden bg-white/5 border-b border-white/10">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white/10">
                    <ImageIcon size={60} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent opacity-60" />
              </div>

              <div className="p-4">
                <h4 className="text-xl font-black text-white mb-3 truncate group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-8 h-[60px]">
                  {item.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <Edit size={14} /> Update
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-red-600/20 hover:text-red-400 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Injection */}
      <AnimatePresence>
        {modalOpen && (
          <FacilityModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            initialData={editingItem}
            onSubmit={handleSubmit}
            loading={loading}
            schoolId={schoolId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}