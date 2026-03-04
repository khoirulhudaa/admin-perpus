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

  // const Select = ({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  //   <select
  //     className={clsx(
  //       "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition",
  //       className
  //     )}
  //     {...props}
  //   >
  //     {props.children}
  //   </select>
  // );

  // interface NewsItem {
  //   id: number;
  //   title: string;
  //   content: string;
  //   imageUrl?: string | null;
  //   publishDate: string;
  //   schoolId: number;
  //   isActive: boolean;
  //   category?: string;
  //   source?: string;
  // }

  // const DEFAULT_NEWS: NewsItem = {
  //   id: 0,
  //   title: "",
  //   content: "",
  //   imageUrl: null,
  //   publishDate: "",
  //   schoolId: 0,
  //   isActive: true,
  //   category: "Umum",
  //   source: "Sekolah",
  // };

  // // const API_BASE = "http://localhost:5005/berita"; // sesuai permintaan (ganti ke production jika perlu)
  // const API_BASE = "https://be-school.kiraproject.id/berita"; // sesuai permintaan (ganti ke production jika perlu)

  // const useAlert = () => {
  //   const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });
  //   const showAlert = useCallback((message: string) => setAlert({ message, isVisible: true }), []);
  //   const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
  //   return { alert, showAlert, hideAlert };
  // };

  // export default function BeritaPage() {
  //   const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  //   const [formData, setFormData] = useState<NewsItem>(DEFAULT_NEWS);
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
  //       setNewsItems(json.data);
  //     } catch (err: any) {
  //       showAlert(`Gagal memuat berita: ${err.message}`);
  //       setNewsItems([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     if (schoolId) fetchData();
  //   }, [schoolId]);

  //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
  //       formPayload.append("title", formData.title.trim());
  //       formPayload.append("content", formData.content.trim());
  //       formPayload.append("schoolId", schoolId.toString());
  //       if (formData.publishDate) formPayload.append("publishDate", formData.publishDate);
  //       if (formData.category) formPayload.append("category", formData.category);
  //       if (formData.source) formPayload.append("source", formData.source);
  //       if (selectedFile) formPayload.append("imageUrl", selectedFile); // sesuai multer di backend (req.file)

  //       const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
  //       const method = editingId ? "PUT" : "POST";

  //       const res = await fetch(url, { method, body: formPayload });

  //       if (!res.ok) {
  //         const errJson = await res.json().catch(() => ({}));
  //         throw new Error(errJson.message || `Gagal menyimpan (${res.status})`);
  //       }

  //       showAlert(editingId ? "Berita berhasil diperbarui" : "Berita berhasil ditambahkan");

  //       setFormData(DEFAULT_NEWS);
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

  //   const handleEdit = (item: NewsItem) => {
  //     setFormData({
  //       ...item,
  //       publishDate: item.publishDate ? new Date(item.publishDate).toISOString().split("T")[0] : "",
  //       category: item.category || "Umum",
  //       source: item.source || "Sekolah",
  //     });
  //     setSelectedFile(null);
  //     setPreviewUrl(item.imageUrl || null);
  //     setEditingId(item.id);
  //     setIsModalOpen(true);
  //   };

  //   const handleDelete = async (id: number) => {
  //     if (!window.confirm("Yakin ingin menghapus berita ini?")) return;
  //     setLoading(true);
  //     try {
  //       const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  //       if (!res.ok) throw new Error("Gagal menghapus");
  //       showAlert("Berita berhasil dihapus");
  //       await fetchData();
  //     } catch (err: any) {
  //       showAlert(`Gagal menghapus: ${err.message}`);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const openModal = () => {
  //     setFormData(DEFAULT_NEWS);
  //     setSelectedFile(null);
  //     setPreviewUrl(null);
  //     setEditingId(null);
  //     setIsModalOpen(true);
  //   };

  //   const closeModal = () => {
  //     setFormData(DEFAULT_NEWS);
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
  //           <ISave /> Tambah Berita
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
  //                     <h2 className="text-xl font-semibold text-white">{editingId ? "Edit Berita" : "Tambah Berita Baru"}</h2>
  //                     <button onClick={closeModal} className="text-gray-400 hover:text-white">
  //                       <X size={24} />
  //                     </button>
  //                   </div>

  //                   <form onSubmit={handleSubmit} className="space-y-5">
  //                     <Field label="Judul Berita">
  //                       <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Contoh: Workshop Coding untuk Siswa" required disabled={loading} />
  //                     </Field>

  //                     <Field label="Tanggal Publish">
  //                       <Input type="date" name="publishDate" value={formData.publishDate} onChange={handleInputChange} disabled={loading} />
  //                     </Field>

  //                     <Field label="Kategori">
  //                       <Select name="category" value={formData.category} onChange={handleInputChange} disabled={loading}>
  //                         <option className="text-black" value="Umum">Umum</option>
  //                         <option className="text-black" value="Kegiatan Sekolah">Kegiatan Sekolah</option>
  //                         <option className="text-black" value="Prestasi">Prestasi</option>
  //                         <option className="text-black" value="Pengumuman Dinas">Pengumuman Dinas</option>
  //                         <option className="text-black" value="Lainnya">Lainnya</option>
  //                       </Select>
  //                     </Field>

  //                     <Field label="Sumber">
  //                       <Select name="source" value={formData.source} onChange={handleInputChange} disabled={loading}>
  //                         <option className="text-black" value="Sekolah">Sekolah</option>
  //                         <option className="text-black" value="Dinas">Dinas</option>
  //                         <option className="text-black" value="Lainnya">Lainnya</option>
  //                       </Select>
  //                     </Field>

  //                     <Field label="Isi Berita">
  //                       <TextArea name="content" value={formData.content} onChange={handleInputChange} placeholder="Tuliskan isi berita secara lengkap..." required disabled={loading} />
  //                     </Field>

  //                     <Field label="Gambar (opsional)" hint="JPG, PNG, WebP • Maks 5MB">
  //                       <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} disabled={loading} className="block w-full text-sm text-white/80 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-700/30 file:text-blue-100 hover:file:bg-blue-700/50 file:cursor-pointer cursor-pointer" />
  //                     </Field>

  //                     {(previewUrl || formData.imageUrl) && (
  //                       <div className="mt-2">
  //                         <img src={previewUrl || formData.imageUrl || ""} alt="Preview" className="max-h-64 w-full object-contain rounded-xl border border-white/15 shadow-sm" />
  //                       </div>
  //                     )}

  //                     <div className="w-full grid grid-cols-2 justify-end gap-4 pt-6 border-t border-white/30">
  //                       <button type="button" onClick={closeModal} disabled={loading} className="rounded-xl border border-white/20 px-6 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5 transition disabled:opacity-50">Batal</button>
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
  //         ) : newsItems.length === 0 ? (
  //           <div className="py-12 text-center text-white/50">Belum ada berita.</div>
  //         ) : (
  //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //             {newsItems.map((item) => (
  //               <div key={item.id} className="flex flex-col rounded-xl border border-white/10 bg-black/40 p-5 hover:border-blue-500/30 transition group">
  //                 {/* Tampilan gambar jika ada */}
  //                 {item.imageUrl && (
  //                   <div className="overflow-hidden rounded-lg border border-white/10 h-48 mb-4">
  //                     <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
  //                   </div>
  //                 )}

  //                 <div className="font-semibold text-lg text-white group-hover:text-blue-300 transition line-clamp-2 mb-2">
  //                   {item.title}
  //                 </div>

  //                 <div className="text-xs text-gray-400 mb-2">
  //                   {new Date(item.publishDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
  //                 </div>

  //                 {/* Tampilkan category dan source */}
  //                 <div className="flex flex-wrap gap-2 mb-3">
  //                   <span className="text-xs px-2 py-1 rounded-full bg-blue-600/20 text-blue-300">
  //                     {item.category || "Umum"}
  //                   </span>
  //                   <span className="text-xs px-2 py-1 rounded-full bg-purple-600/20 text-purple-300">
  //                     {item.source || "Sekolah"}
  //                   </span>
  //                 </div>

  //                 <p className="text-sm text-white/80 line-clamp-4 flex-1">
  //                   {item.content}
  //                 </p>

  //                 <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
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
  Calendar,
  Tag,
  Image as ImageIcon,
  X,
  Bell,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const API_BASE = "https://be-school.kiraproject.id/berita";

interface AlertState {
  message: string;
  isVisible: boolean;
}

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

  const showAlert = useCallback((msg: string) => {
    setAlert({ message: msg, isVisible: true });
    setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
  }, []);

  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);

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

interface NewsItem {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  publishDate: string;
  schoolId: number;
  isActive: boolean;
  category?: string;
  source?: string;
}

const DEFAULT_NEWS: NewsItem = {
  id: 0,
  title: "",
  content: "",
  imageUrl: null,
  publishDate: "",
  schoolId: 0,
  isActive: true,
  category: "Umum",
  source: "Sekolah",
};

const BeritaModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
  loading,
  schoolId
}: {
  open: boolean;
  onClose: () => void;
  initialData: NewsItem;
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
  schoolId: any
}) => {
  const [form, setForm] = useState<NewsItem>(initialData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData.imageUrl || null);

  useEffect(() => {
    if (open) {
      setForm(initialData);
      setSelectedFile(null);
      setPreviewUrl(initialData.imageUrl || null);
    }
  }, [open, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    if (!form.title.trim() || !form.content.trim()) {
      alert("Judul dan isi berita wajib diisi");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("title", form.title.trim());
    formPayload.append("content", form.content.trim());
    formPayload.append("schoolId", schoolId);
    if (form.publishDate) formPayload.append("publishDate", form.publishDate);
    if (form.category) formPayload.append("category", form.category);
    if (form.source) formPayload.append("source", form.source);
    if (selectedFile) formPayload.append("imageUrl", selectedFile);

    await onSubmit(formPayload);
    onClose();
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
        <div className="p-10 border-b border-white/8 flex justify-between items-center bg-[#0B1220] z-10">
          <div>
            <h3 className="text-4xl font-black tracking-tighter text-white">
              {initialData.id ? "Edit" : "Tambah"} <span className="text-blue-600">Berita</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Informasi & Kegiatan Sekolah
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 flex-1">
          {/* Judul */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Judul Berita *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="Contoh: Workshop Coding untuk Siswa 2026"
              required
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Tanggal & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Tanggal Publish
              </label>
              <input
                type="date"
                name="publishDate"
                value={form.publishDate}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Kategori
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option className="text-black" value="Umum">Umum</option>
                <option className="text-black" value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                <option className="text-black" value="Prestasi">Prestasi</option>
                <option className="text-black" value="Pengumuman Dinas">Pengumuman Dinas</option>
                <option className="text-black" value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Sumber */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Sumber
            </label>
            <select
              name="source"
              value={form.source}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
            >
              <option value="Sekolah">Sekolah</option>
              <option value="Dinas">Dinas</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Isi */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Isi Berita *
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleInputChange}
              placeholder="Tuliskan isi berita secara lengkap dan jelas..."
              rows={8}
              required
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-y"
            />
          </div>

          {/* Gambar */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Gambar Pendukung (opsional)
            </label>
            <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/15 rounded-3xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all relative overflow-hidden group">
              {(previewUrl || form.imageUrl) && (
                <img
                  src={previewUrl || form.imageUrl || ""}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-3">
                <ImageIcon className="text-blue-500" size={40} />
                <span className="text-xs font-black uppercase tracking-wider text-white/70">
                  {previewUrl ? "Ganti Gambar" : "Upload Gambar"}
                </span>
                <span className="text-[10px] text-zinc-500">(jpg / png / webp • maks 5MB)</span>
              </div>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="bg-[#0B1220] pt-10 pb-6 border-t border-white/8 grid grid-cols-2 gap-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-4 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
                loading
                  ? "bg-blue-800 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? "Menyimpan..." : initialData.id ? "Update Berita" : "Tambah Berita"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default function BeritaPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const fetchData = async () => {
    if (!schoolId) {
      showAlert("School ID tidak ditemukan");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) throw new Error("Format response invalid");
      setNewsItems(json.data);
    } catch (err: any) {
      showAlert(`Gagal memuat berita: ${err.message}`);
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolId) fetchData();
  }, [schoolId]);

  const handleSubmit = async (formPayload: FormData) => {
    setLoading(true);
    try {
      const url = editingItem ? `${API_BASE}/${editingItem.id}` : API_BASE;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formPayload });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Gagal menyimpan (${res.status})`);
      }

      showAlert(editingItem ? "Berita berhasil diperbarui" : "Berita berhasil ditambahkan");
      setModalOpen(false);
      setEditingItem(null);
      await fetchData();
    } catch (err: any) {
      showAlert(`Gagal menyimpan: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus berita ini?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      showAlert("Berita berhasil dihapus");
      await fetchData();
    } catch (err: any) {
      showAlert(`Gagal menghapus: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <Bell size={14} /> Berita Management
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Berita <span className="text-blue-600">Sekolah</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola berita, kegiatan, dan informasi terkini sekolah</p>
        </div>

        <button
          onClick={openAddModal}
          disabled={loading}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50"
        >
          <Plus size={18} /> Tambah Berita
        </button>
      </div>

      {loading && newsItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
            Memuat berita...
          </div>
        </div>
      ) : newsItems.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm w-full mx-auto">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <Bell size={40} className="text-zinc-600" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Belum Ada Berita</h3>
          <p className="text-zinc-500">Tambahkan berita penting untuk siswa, guru, dan orang tua.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white/[0.03] h-[424px] border border-white/8 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
            >
              {item.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <span className="absolute top-4 z-[2] right-4 flex-shrink-0 px-3 py-1 bg-blue-700 text-white shadow-lg text-xs font-black rounded-full border border-blue-500/20 uppercase">
                    {item.category || "Umum"}
                  </span>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="pt-6 pb-0 px-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-md font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(item.publishDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag size={14} />
                    {item.source || "Sekolah"}
                  </div>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4">
                  {item.content}
                </p>

                <div className="flex gap-3 pt-4 border-t h-max border-white/8">
                  <button
                    onClick={() => handleEdit(item)}
                    disabled={loading}
                    className="flex-1 py-3 rounded-2xl bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={loading}
                    className="flex-1 py-3 rounded-2xl bg-red-900/30 hover:bg-red-800/50 text-red-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Berita */}
      <BeritaModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        schoolId={schoolId}
        initialData={editingItem || DEFAULT_NEWS}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}