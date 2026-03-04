// import { Dialog, Transition } from "@headlessui/react";
// import { AnimatePresence, motion } from "framer-motion";
// import { X } from "lucide-react";
// import React, { useCallback, useEffect, useState } from "react";

// // Theme Tokens (tetap dipertahankan)
// const THEME_TOKENS = {
//   smkn13: {
//     "--brand-primary": "#10b981",
//     "--brand-primaryText": "#ffffff",
//     "--brand-accent": "#f59e0b",
//     "--brand-bg": "#0a0a0a",
//     "--brand-surface": "rgba(24,24,27,0.8)",
//     "--brand-surfaceText": "#f3f4f6",
//     "--brand-subtle": "#27272a",
//     "--brand-pop": "#3b82f6",
//   },
// };

// if (typeof document !== 'undefined') {
//   document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13)
//     .map(([k, v]) => `${k}: ${v};`)
//     .join('');
// }

// const clsx = (...args) => args.filter(Boolean).join(" ");

// const useAlert = () => {
//   const [alert, setAlert] = useState({ message: "", isVisible: false });

//   const showAlert = useCallback((message) => {
//     setAlert({ message, isVisible: true });
//   }, []);

//   const hideAlert = useCallback(() => {
//     setAlert({ message: "", isVisible: false });
//   }, []);

//   return { alert, showAlert, hideAlert };
// };

// const Alert = ({ message, onClose }) => {
//   const isSuccess = message.toLowerCase().includes("berhasil") || message.includes("successfully");

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

// const Icon = ({ label }) => (
//   <span
//     aria-hidden
//     className="inline-block align-middle select-none"
//     style={{ width: 16, display: "inline-flex", justifyContent: "center" }}
//   >
//     {label}
//   </span>
// );
// const ISave = () => <Icon label="💾" />;
// const IEdit = () => <Icon label="✏️" />;
// const IDelete = () => <Icon label="🗑️" />;
// const IAdd = () => <Icon label="➕" />;

// const Field = ({ label, hint, children, className }) => (
//   <label className={clsx("block", className)}>
//     {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
//     {children}
//     {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
//   </label>
// );

// const Input = ({ className, ...props }) => (
//   <input
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
//       className
//     )}
//   />
// );

// const TextArea = ({ className, ...props }) => (
//   <textarea
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
//       className
//     )}
//   />
// );

// const Select = ({ className, ...props }) => (
//   <select
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
//       className
//     )}
//   />
// );

// const DEFAULT_DOCUMENT = {
//   title: "",
//   category: "",
//   description: "",
//   publishedDate: "",
//   documentUrl: "",
// };

// export function PPIDMain() {
//   const [documents, setDocuments] = useState([]);
//   const [formData, setFormData] = useState(DEFAULT_DOCUMENT);
//   const [editingId, setEditingId] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();

//   const BASE_URL = "https://be-school.kiraproject.id/ppid";
//   const SCHOOL_ID = 88;

//   const getToken = () => localStorage.getItem("token");

//   const getHeaders = () => {
//     const token = getToken();
//     return {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     };
//   };

//   const fetchDocuments = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, {
//         headers: getHeaders(),
//       });
//       if (!response.ok) {
//         const err = await response.json().catch(() => ({}));
//         throw new Error(err.message || "Gagal memuat dokumen PPID");
//       }
//       const result = await response.json();
//       if (result.success) {
//         setDocuments(result.data || []);
//       } else {
//         throw new Error(result.message || "Response tidak valid");
//       }
//     } catch (err) {
//       showAlert(`Gagal memuat dokumen: ${err.message}`);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = {
//         title: formData.title,
//         category: formData.category,
//         description: formData.description || "",
//         publishedDate: formData.publishedDate || "",
//         documentUrl: formData.documentUrl || "",
//         schoolId: SCHOOL_ID,
//       };

//       const method = editingId ? "PUT" : "POST";
//       const url = editingId ? `${BASE_URL}/${editingId}` : BASE_URL;

//       const response = await fetch(url, {
//         method,
//         headers: getHeaders(),
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const err = await response.json().catch(() => ({}));
//         throw new Error(err.message || `Gagal ${editingId ? "update" : "tambah"} dokumen`);
//       }

//       const result = await response.json();
//       if (result.success) {
//         showAlert(`Dokumen berhasil ${editingId ? "diperbarui" : "ditambahkan"}`);
//         setFormData(DEFAULT_DOCUMENT);
//         setEditingId(null);
//         setIsModalOpen(false);
//         await fetchDocuments();
//       } else {
//         throw new Error(result.message || "Response tidak valid");
//       }
//     } catch (err) {
//       showAlert(`Gagal menyimpan dokumen: ${err.message}`);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Yakin ingin menghapus dokumen ini?")) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}/${id}`, {
//         method: "DELETE",
//         headers: getHeaders(),
//       });

//       if (!response.ok) {
//         const err = await response.json().catch(() => ({}));
//         throw new Error(err.message || "Gagal menghapus dokumen");
//       }

//       const result = await response.json();
//       if (result.success) {
//         showAlert("Dokumen berhasil dihapus");
//         await fetchDocuments();
//       } else {
//         throw new Error(result.message || "Response tidak valid");
//       }
//     } catch (err) {
//       showAlert(`Gagal menghapus: ${err.message}`);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenModal = (item = null) => {
//     if (item) {
//       setFormData({
//         title: item.title || "",
//         category: item.category || "",
//         description: item.description || "",
//         publishedDate: item.publishedDate ? new Date(item.publishedDate).toISOString().split("T")[0] : "",
//         documentUrl: item.documentUrl || "",
//       });
//       setEditingId(item.id);
//     } else {
//       setFormData(DEFAULT_DOCUMENT);
//       setEditingId(null);
//     }
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setFormData(DEFAULT_DOCUMENT);
//     setEditingId(null);
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="space-y-6 py-4 mb-10">
//       <AnimatePresence>
//         {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
//       </AnimatePresence>

//       <div className="flex justify-between items-center">
//         <button
//           onClick={() => handleOpenModal()}
//           className="inline-flex items-center gap-2 text-sm rounded-md bg-blue-500 px-3 py-2 font-semibold hover:bg-blue-600 disabled:opacity-50"
//           disabled={loading}
//         >
//           <ISave /> Tambah Dokumen
//         </button>
//       </div>

//       {loading && (
//         <div className="text-center py-8 text-white/70">Memuat data...</div>
//       )}

//       {!loading && documents.length === 0 && (
//         <div className="text-center py-8 text-white/70 border border-white/20 rounded-xl">
//           Belum ada dokumen PPID yang tersedia
//         </div>
//       )}

//       {!loading && documents.length > 0 && (
//         <div className="overflow-x-auto rounded-xl border border-white/20">
//           <table className="w-full text-sm text-white/80">
//             <thead className="bg-white/5">
//               <tr>
//                 <th className="py-3 px-4 text-left">Judul</th>
//                 <th className="py-3 px-4 text-left">Kategori</th>
//                 <th className="py-3 px-4 text-left">Tahun/Tanggal</th>
//                 <th className="py-3 px-4 text-left">Deskripsi</th>
//                 <th className="py-3 px-4 text-left">File</th>
//                 <th className="py-3 px-4 text-left">Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {documents.map((doc) => (
//                 <tr key={doc.id} className="border-t border-white/10 hover:bg-white/5">
//                   <td className="py-3 px-4">{doc.title}</td>
//                   <td className="py-3 px-4">{doc.category}</td>
//                   <td className="py-3 px-4">
//                     {doc.publishedDate
//                       ? new Date(doc.publishedDate).toLocaleDateString("id-ID")
//                       : "—"}
//                   </td>
//                   <td className="py-3 px-4 max-w-xs truncate">{doc.description || "—"}</td>
//                   <td className="py-3 px-4">
//                     {doc.documentUrl ? (
//                       <a
//                         href={doc.documentUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-400 hover:underline"
//                       >
//                         Lihat Dokumen
//                       </a>
//                     ) : (
//                       "—"
//                     )}
//                   </td>
//                   <td className="py-3 px-4 flex gap-2">
//                     <button
//                       onClick={() => handleOpenModal(doc)}
//                       className="rounded-lg border w-max flex gap-2 items-center border-blue-500/30 bg-blue-500/10 px-3 p2-1 text-xs text-blue-300 hover:bg-blue-500/20"
//                       disabled={loading}
//                     >
//                       <IEdit />
//                       <p>
//                          Edit
//                       </p>
//                     </button>
//                     <button
//                       onClick={() => handleDelete(doc.id)}
//                       className="rounded-lg border w-max flex gap-2 border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300 hover:bg-red-500/20"
//                       disabled={loading}
//                     >
//                       <IDelete /> 
//                       <p>
//                         Hapus
//                       </p>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <Transition appear show={isModalOpen} as={React.Fragment}>
//         <Dialog as="div" className="relative z-[999999]" onClose={handleCloseModal}>
//           <Transition.Child
//             as={React.Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed top-0 right-0 inset-0 bg-black/70" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4">
//               <Transition.Child
//                 as={React.Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="bg-black/70 absolute top-0 right-0 border border-white/30 h-screen w-full max-w-md overflow-auto">
//                   <div className="p-6 border-b border-white/20 flex justify-between items-center">
//                     <h2 className="text-xl font-semibold text-white">
//                       {editingId ? "Edit Dokumen PPID" : "Tambah Dokumen PPID"}
//                     </h2>
//                     <button onClick={() => setIsModalOpen(!isModalOpen)} className="text-gray-400 hover:text-white">
//                       <X size={24} />
//                     </button>
//                   </div>
//                   <form onSubmit={handleSubmit} className="space-y-5 p-6">
//                     <Field label="Judul Dokumen">
//                       <Input
//                         name="title"
//                         value={formData.title}
//                         onChange={handleInputChange}
//                         placeholder="Contoh: Laporan Keuangan BOS 2025"
//                         required
//                         disabled={loading}
//                       />
//                     </Field>

//                     <Field label="Kategori">
//                       <Select
//                         name="category"
//                         value={formData.category}
//                         onChange={handleInputChange}
//                         required
//                         disabled={loading}
//                       >
//                         <option className="text-black" value="">Pilih Kategori</option>
//                         <option className="text-black" value="berkala">Informasi Berkala</option>
//                         <option className="text-black" value="serta-merta">Informasi Serta Merta</option>
//                         <option className="text-black" value="setiap-saat">Informasi Setiap Saat</option>
//                         <option className="text-black" value="keuangan">Keuangan</option>
//                         <option className="text-black" value="kegiatan">Kegiatan</option>
//                         <option className="text-black" value="profil">Profil Sekolah</option>
//                         <option className="text-black" value="ppdb">PPDB</option>
//                         <option className="text-black" value="lainnya">Lainnya</option>
//                       </Select>
//                     </Field>

//                     <Field label="Deskripsi">
//                       <TextArea
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         placeholder="Deskripsi singkat dokumen..."
//                         rows={3}
//                         disabled={loading}
//                       />
//                     </Field>

//                     <Field label="Tanggal Publikasi">
//                       <Input
//                         type="date"
//                         name="publishedDate"
//                         value={formData.publishedDate}
//                         onChange={handleInputChange}
//                         disabled={loading}
//                       />
//                     </Field>

//                     <Field label="Link Dokumen">
//                       <Input
//                         type="url"
//                         name="documentUrl"
//                         value={formData.documentUrl}
//                         onChange={handleInputChange}
//                         placeholder="https://drive.google.com/... atau link lainnya"
//                         disabled={loading}
//                       />
//                       {editingId && formData.documentUrl && (
//                         <div className="mt-1 text-xs text-white/50 break-all">
//                           Saat ini: {formData.documentUrl}
//                         </div>
//                       )}
//                     </Field>

//                     <div className="w-full grid grid-cols-2 justify-end border-t border-white/20 pt-5 gap-3 mt-6">
//                       <button
//                         type="button"
//                         onClick={handleCloseModal}
//                         className="rounded-xl border border-white/20 px-5 py-2 text-sm text-white/80 hover:text-white disabled:opacity-50"
//                         disabled={loading}
//                       >
//                         Batal
//                       </button>
//                       <button
//                         type="submit"
//                         className="inline-flex justify-center items-center gap-2 rounded-xl bg-blue-500/90 px-5 py-2 text-sm font-normal hover:bg-blue-500 disabled:opacity-50"
//                         disabled={loading}
//                       >
//                         <ISave /> {editingId ? "Update Dokumen" : "Simpan Dokumen"}
//                       </button>
//                     </div>
//                   </form>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// }



import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Edit, FileText, Loader, Plus, Save, Trash2, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const BASE_URL = "https://be-school.kiraproject.id/ppid";
const SCHOOL_ID = 88;

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

const DEFAULT_DOCUMENT = {
  title: "",
  category: "",
  description: "",
  publishedDate: "",
  documentUrl: "",
};

const PPIDModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  initialData: typeof DEFAULT_DOCUMENT;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}) => {
  const [form, setForm] = useState(initialData);

  useEffect(() => {
    if (open) setForm(initialData);
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
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
              {initialData.title ? "Edit" : "Tambah"} <span className="text-blue-600">Dokumen</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Informasi Publik PPID
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
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Judul Dokumen *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Contoh: Laporan Keuangan BOS 2025"
              required
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Kategori *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
            >
              <option className="text-black" value="">Pilih Kategori</option>
              <option className="text-black" value="berkala">Informasi Berkala</option>
              <option className="text-black" value="serta-merta">Informasi Serta Merta</option>
              <option className="text-black" value="setiap-saat">Informasi Setiap Saat</option>
              <option className="text-black" value="keuangan">Keuangan</option>
              <option className="text-black" value="kegiatan">Kegiatan</option>
              <option className="text-black" value="profil">Profil Sekolah</option>
              <option className="text-black" value="ppdb">PPDB</option>
              <option className="text-black" value="lainnya">Lainnya</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Deskripsi singkat dokumen..."
              rows={4}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Tanggal Publikasi
              </label>
              <input
                type="date"
                name="publishedDate"
                value={form.publishedDate}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Link Dokumen
              </label>
              <input
                type="url"
                name="documentUrl"
                value={form.documentUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/... atau link lainnya"
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

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
                loading ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
              }`}
            >
              {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? "Menyimpan..." : initialData.title ? "Update Dokumen" : "Tambah Dokumen"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export function PPIDMain() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Gagal memuat dokumen PPID");
      }

      const json = await res.json();
      if (json.success) {
        setDocuments(json.data || []);
      } else {
        throw new Error(json.message || "Response tidak valid");
      }
    } catch (err: any) {
      showAlert(`Gagal memuat dokumen: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = editingItem ? `${BASE_URL}/${editingItem.id}` : BASE_URL;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...payload, schoolId: SCHOOL_ID }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Gagal ${editingItem ? "memperbarui" : "menambah"} dokumen`);
      }

      const json = await res.json();
      if (json.success) {
        showAlert(`Dokumen berhasil ${editingItem ? "diperbarui" : "ditambahkan"}`);
        setModalOpen(false);
        setEditingItem(null);
        await fetchDocuments();
      } else {
        throw new Error(json.message || "Response tidak valid");
      }
    } catch (err: any) {
      showAlert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus dokumen ini?")) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Gagal menghapus");
      }

      const json = await res.json();
      if (json.success) {
        showAlert("Dokumen berhasil dihapus");
        await fetchDocuments();
      } else {
        throw new Error(json.message || "Response tidak valid");
      }
    } catch (err: any) {
      showAlert(`Gagal menghapus: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <FileText size={14} /> PPID Management
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Dokumen <span className="text-blue-600">PPID</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola informasi publik yang wajib disediakan</p>
        </div>

        <button
          onClick={openAdd}
          disabled={loading}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50"
        >
          <Plus size={18} /> Tambah Dokumen
        </button>
      </div>

      {loading && documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader className="animate-spin text-blue-500" size={48} />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
            Memuat dokumen PPID...
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <FileText size={40} className="text-white/50" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Belum Ada Dokumen PPID</h3>
          <p className="text-zinc-500">Tambahkan dokumen informasi publik yang wajib tersedia.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/8 backdrop-blur-sm bg-white/[0.02]">
          <table className="min-w-full divide-y divide-white/5">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400">
                  Judul
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400">
                  Deskripsi
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400">
                  Dokumen
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400 w-32">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {documents.map((doc, idx) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-white">{doc.title}</td>
                  <td className="px-6 py-4 text-sm text-zinc-300 capitalize">{doc.category}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {doc.publishedDate ? new Date(doc.publishedDate).toLocaleDateString("id-ID") : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400 max-w-md truncate">
                    {doc.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {doc.documentUrl ? (
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                      >
                        Lihat Dokumen
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(doc)}
                        disabled={loading}
                        className="p-2 rounded-xl bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 transition-colors disabled:opacity-50"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        disabled={loading}
                        className="p-2 rounded-xl bg-red-900/30 hover:bg-red-800/50 text-red-300 transition-colors disabled:opacity-50"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PPIDModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        initialData={editingItem || DEFAULT_DOCUMENT}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}