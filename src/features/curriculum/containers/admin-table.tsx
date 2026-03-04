// import { Edit, Trash2, X, Plus, Save, Loader2 } from "lucide-react";
// import { useEffect, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSchool } from "@/features/schools";

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

// const BASE_URL = "https://be-school.kiraproject.id/kurikulum";

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
//         alert.type === "success" ? "bg-green-900/30 border-green-500/40 text-green-300" : "bg-red-900/30 border-red-500/40 text-red-300"
//       }`}
//     >
//       <div className="flex justify-between items-start">
//         <span>{alert.message}</span>
//         <button onClick={onClose} className="text-lg ml-3">×</button>
//       </div>
//     </motion.div>
//   );
// };

// const KurikulumModal = ({
//   open,
//   onClose,
//   title,
//   initialData = {},
//   onSubmit,
//   schoolId,
// }: {
//   open: boolean;
//   onClose: () => void;
//   title: string;
//   initialData?: any;
//   onSubmit: (data: any) => Promise<void>;
//   schoolId: number | null;
// }) => {
//   const [form, setForm] = useState({
//     name: initialData?.name || "",
//     year: initialData?.year || new Date().getFullYear(),
//     type: initialData?.type || "Kurikulum Merdeka",
//     description: initialData?.description || "",
//     documentUrl: initialData?.documentUrl || "",
//   });

//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (open) {
//       setForm({
//         name: initialData?.name || "",
//         year: initialData?.year || new Date().getFullYear(),
//         type: initialData?.type || "Kurikulum Merdeka",
//         description: initialData?.description || "",
//         documentUrl: initialData?.documentUrl || "",
//       });
//     }
//   }, [open]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!form.name.trim() || !form.year || !form.type.trim()) {
//       alert("Nama Kurikulum, Tahun, dan Tipe wajib diisi");
//       return;
//     }

//     if (!Number.isInteger(form.year) || form.year < 2000 || form.year > 2100) {
//       alert("Tahun harus angka antara 2000-2100");
//       return;
//     }

//     if (!schoolId) {
//       alert("School ID tidak ditemukan");
//       return;
//     }

//     setSaving(true);

//     try {
//       const payload = { ...form, schoolId, year: parseInt(form.year as any) };
//       await onSubmit(payload);
//       onClose();
//     } catch (err: any) {
//       alert("Gagal menyimpan: " + (err.message || "Terjadi kesalahan"));
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed top-0 right-0 inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
//       <motion.div
//         initial={{ scale: 0.92, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.92, opacity: 0 }}
//         className="bg-black/70 absolute top-0 right-0 border border-white/30 w-full max-w-md h-screen overflow-auto"
//       >
//         <div className="p-6 border-b border-gray-700 flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-white">{title}</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-white">
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Nama Kurikulum *</label>
//             <input
//               type="text"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               placeholder="Contoh: Kurikulum Merdeka 2024"
//               required
//               className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Tahun Penerapan *</label>
//             <input
//               type="number"
//               value={form.year}
//               onChange={(e) => setForm({ ...form, year: e.target.value })}
//               placeholder="2024"
//               min="2000"
//               max="2100"
//               required
//               className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Tipe Kurikulum *</label>
//             <select
//               value={form.type}
//               onChange={(e) => setForm({ ...form, type: e.target.value })}
//               className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
//             >
//               <option className="text-black" value="Kurikulum Merdeka">Kurikulum Merdeka</option>
//               <option className="text-black" value="K13">K13</option>
//               <option className="text-black" value="KTSP">KTSP</option>
//               <option className="text-black" value="Lainnya">Lainnya</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
//             <textarea
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               placeholder="Penjelasan singkat tentang kurikulum ini..."
//               rows={4}
//               className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none resize-y"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Link Dokumen (opsional)</label>
//             <input
//               type="url"
//               value={form.documentUrl}
//               onChange={(e) => setForm({ ...form, documentUrl: e.target.value })}
//               placeholder="https://drive.google.com/... atau situs resmi"
//               className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
//             />
//           </div>

//           <div className="w-full grid grid-cols-2 justify-end gap-4 pt-4 border-t border-gray-700">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={saving}
//               className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl disabled:opacity-50"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-6 py-2.5 justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
//             >
//               {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
//               {saving ? "Menyimpan..." : "Simpan"}
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default function Kurikulum() {
//   const [curriculums, setCurriculums] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [alert, setAlert] = useState<AlertState>({
//     message: "",
//     type: "success",
//     visible: false,
//   });

//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedCurriculum, setSelectedCurriculum] = useState<any>(null);

//   const schoolQuery = useSchool();
//   const schoolId = schoolQuery?.data?.[0]?.id;

//   const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
//     setAlert({ message: msg, type, visible: true });
//     setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 6000);
//   }, []);

//   const fetchCurriculums = useCallback(async () => {
//     if (!schoolId) {
//       showAlert("School ID tidak ditemukan", "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`, {
//         cache: "no-store",
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const json = await res.json();
//       if (json.success) {
//         setCurriculums(json.data || []);
//       } else {
//         throw new Error(json.message || "Response tidak valid");
//       }
//     } catch (err: any) {
//       showAlert("Gagal memuat data kurikulum: " + err.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [schoolId, showAlert]);

//   useEffect(() => {
//     fetchCurriculums();
//   }, [fetchCurriculums]);

//   const handleCreate = async (payload: any) => {
//     const res = await fetch(BASE_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const err = await res.json().catch(() => ({}));
//       throw new Error(err.message || "Gagal menambah kurikulum");
//     }

//     const json = await res.json();
//     if (!json.success) throw new Error(json.message || "Gagal menambah kurikulum");

//     showAlert("Kurikulum berhasil ditambahkan!");
//     fetchCurriculums();
//   };

//   const handleUpdate = async (payload: any) => {
//     if (!selectedCurriculum?.id) return;

//     const res = await fetch(`${BASE_URL}/${selectedCurriculum.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const err = await res.json().catch(() => ({}));
//       throw new Error(err.message || "Gagal memperbarui kurikulum");
//     }

//     const json = await res.json();
//     if (!json.success) throw new Error(json.message || "Gagal memperbarui kurikulum");

//     showAlert("Kurikulum berhasil diperbarui!");
//     fetchCurriculums();
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Yakin ingin menghapus kurikulum ini?")) return;

//     try {
//       const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.message || "Gagal menghapus");
//       }

//       showAlert("Kurikulum berhasil dihapus");
//       fetchCurriculums();
//     } catch (err: any) {
//       showAlert("Gagal menghapus: " + err.message, "error");
//     }
//   };

//   const Icon = ({ label }: { label: string }) => (
//   <span
//     aria-hidden
//     className="inline-block align-middle select-none"
//     style={{ width: 16 }}
//   >
//     {label}
//   </span>
// );
// const ISave = () => <Icon label="💾" />;

//   return (
//     <div className="min-h-screen py-4" style={{ background: THEME.bg, color: THEME.text }}>
//       <header className="flex justify-between items-center mb-5">
//         <button
//           onClick={() => {
//             setSelectedCurriculum(null);
//             setAddModalOpen(true);
//           }}
//           className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold shadow-md transition-colors"
//         >
//           <ISave /> Tambah Kurikulum
//         </button>
//       </header>

//       <AnimatePresence>
//         {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
//       </AnimatePresence>

//       {loading ? (
//         <div className="flex justify-center py-20">
//           <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
//         </div>
//       ) : curriculums.length === 0 ? (
//         <div className="text-center py-20 text-gray-400">
//           Belum ada data kurikulum untuk sekolah ini
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white/5 rounded-2xl">
//           <table className="min-w-full divide-y divide-gray-700">
//             <thead>
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Nama Kurikulum</th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Tahun</th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Tipe</th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Deskripsi</th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Dokumen</th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Aksi</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-800">
//               {curriculums.map((cur) => (
//                 <tr key={cur.id} className="hover:bg-white/10/30 transition-colors">
//                   <td className="px-6 py-4 font-medium">{cur.name}</td>
//                   <td className="px-6 py-4">{cur.year}</td>
//                   <td className="px-6 py-4">{cur.type}</td>
//                   <td className="px-6 py-4 text-gray-300 truncate max-w-xs">
//                     {cur.description || <span className="opacity-50">—</span>}
//                   </td>
//                   <td className="px-6 py-4">
//                     {cur.documentUrl ? (
//                       <a
//                         href={cur.documentUrl}
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
//                   <td className="px-6 py-4">
//                     <div className="flex gap-3">
//                       <button
//                         onClick={() => {
//                           setSelectedCurriculum(cur);
//                           setEditModalOpen(true);
//                         }}
//                         className="p-2 bg-blue-900/40 hover:bg-blue-800/60 rounded-lg text-blue-300"
//                         title="Edit"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(cur.id)}
//                         className="p-2 bg-red-900/40 hover:bg-red-800/60 rounded-lg text-red-300"
//                         title="Hapus"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <KurikulumModal
//         open={addModalOpen}
//         onClose={() => setAddModalOpen(false)}
//         title="Tambah Kurikulum Baru"
//         onSubmit={handleCreate}
//         schoolId={schoolId}
//       />

//       <KurikulumModal
//         open={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//         title="Edit Kurikulum"
//         initialData={selectedCurriculum}
//         onSubmit={handleUpdate}
//         schoolId={schoolId}
//       />
//     </div>
//   );
// }



// src/features/kurikulum/containers/kurikulum.tsx

import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, Trash2, X, Plus, Save, Loader, FileText, Calendar, BookOpen, Link as LinkIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const BASE_URL = "https://be-school.kiraproject.id/kurikulum";

interface AlertState {
  message: string;
  type: "success" | "error";
  visible: boolean;
}

const Alert = ({ alert, onClose }: { alert: AlertState; onClose: () => void }) => {
  if (!alert.visible) return null;

  const isSuccess = alert.type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-6 right-6 z-[999999] rounded-2xl border p-5 shadow-2xl backdrop-blur-xl ${
        isSuccess
          ? "border-blue-500/40 bg-blue-600/10 text-blue-100"
          : "border-red-500/40 bg-red-600/10 text-red-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-lg font-black">{isSuccess ? "✓" : "✕"}</div>
        <div className="text-sm font-medium tracking-tight">{alert.message}</div>
        <button onClick={onClose} className="ml-3 opacity-70 hover:opacity-100">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const KurikulumModal = ({
  open,
  onClose,
  title,
  initialData = {},
  onSubmit,
  schoolId,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  schoolId: number | null;
}) => {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    year: initialData?.year || new Date().getFullYear(),
    type: initialData?.type || "Kurikulum Merdeka",
    description: initialData?.description || "",
    documentUrl: initialData?.documentUrl || "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData?.name || "",
        year: initialData?.year || new Date().getFullYear(),
        type: initialData?.type || "Kurikulum Merdeka",
        description: initialData?.description || "",
        documentUrl: initialData?.documentUrl || "",
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.year || !form.type.trim()) {
      alert("Nama Kurikulum, Tahun, dan Tipe wajib diisi");
      return;
    }

    if (!Number.isInteger(Number(form.year)) || Number(form.year) < 2000 || Number(form.year) > 2100) {
      alert("Tahun harus angka antara 2000-2100");
      return;
    }

    if (!schoolId) {
      alert("School ID tidak ditemukan");
      return;
    }

    setSaving(true);

    try {
      const payload = { ...form, schoolId, year: parseInt(form.year as any) };
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      alert("Gagal menyimpan: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setSaving(false);
    }
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
        <div className="p-10 border-b border-white/8 flex justify-between items-center sticky top-0 bg-[#0B1220] z-10">
          <div>
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              {title.includes("Tambah") ? "Tambah" : "Edit"} <span className="text-blue-600">Kurikulum</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/80 mt-1 italic">
              Pengelolaan Kurikulum Sekolah
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12 flex-1">
          {/* Nama Kurikulum */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Nama Kurikulum *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Contoh: Kurikulum Merdeka 2025"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all font-medium"
            />
          </div>

          {/* Tahun & Tipe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Tahun Penerapan *
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2025"
                min={2000}
                max={2100}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all font-mono tracking-wide"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Tipe Kurikulum *
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                <option value="K13">K13</option>
                <option value="KTSP">KTSP</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Deskripsi Kurikulum
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Penjelasan singkat tujuan, fokus, dan karakteristik kurikulum ini..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-y"
            />
          </div>

          {/* Link Dokumen */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Link Dokumen Resmi (opsional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={form.documentUrl}
                onChange={(e) => setForm({ ...form, documentUrl: e.target.value })}
                placeholder="https://drive.google.com/... atau situs resmi"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pl-12 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
              />
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/8">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="py-4 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
                saving
                  ? "bg-blue-800 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
              }`}
            >
              {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? "Menyimpan..." : "Simpan Kurikulum"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default function Kurikulum() {
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    type: "success",
    visible: false,
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState<any>(null);

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, type, visible: true });
    setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 5000);
  }, []);

  const fetchCurriculums = useCallback(async () => {
    if (!schoolId) {
      showAlert("School ID tidak ditemukan", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json.success) {
        setCurriculums(json.data || []);
      } else {
        throw new Error(json.message || "Response tidak valid");
      }
    } catch (err: any) {
      showAlert("Gagal memuat data kurikulum: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [schoolId, showAlert]);

  useEffect(() => {
    fetchCurriculums();
  }, [fetchCurriculums]);

  const handleCreate = async (payload: any) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Gagal menambah kurikulum");
    }

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Gagal");

    showAlert("Kurikulum berhasil ditambahkan!");
    fetchCurriculums();
  };

  const handleUpdate = async (payload: any) => {
    if (!selectedCurriculum?.id) return;

    const res = await fetch(`${BASE_URL}/${selectedCurriculum.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Gagal update");
    }

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Gagal");

    showAlert("Kurikulum berhasil diperbarui!");
    fetchCurriculums();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kurikulum ini?")) return;

    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Gagal hapus");
      }

      showAlert("Kurikulum berhasil dihapus");
      fetchCurriculums();
    } catch (err: any) {
      showAlert("Gagal menghapus: " + err.message, "error");
    }
  };

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      <AnimatePresence>
        {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <BookOpen size={14} /> Kurikulum Management
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Daftar <span className="text-blue-600">Kurikulum</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola kurikulum yang diterapkan di sekolah</p>
        </div>

        <button
          onClick={() => {
            setSelectedCurriculum(null);
            setAddModalOpen(true);
          }}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
        >
          <Plus size={18} /> Tambah Kurikulum
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader className="animate-spin text-blue-500" size={48} />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
            Memuat data kurikulum...
          </div>
        </div>
      ) : curriculums.length === 0 ? (
        <div className="w-full text-center py-32 text-zinc-500 italic text-lg bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm mx-auto">
          Belum ada data kurikulum untuk sekolah ini
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {curriculums.map((cur, i) => (
            <motion.div
              key={cur.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group relative bg-white/[0.03] border border-white/8 rounded-3xl p-6 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex flex-col items-start justify-between mb-6 space-y-4">
                <span className="py-1.5 text-blue-400 text-xs font-black uppercase">
                  {cur.type}
                </span>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight text-white transition-colors">
                    {cur.name}
                  </h3>
                  <p className="text-sm font-black text-blue-500 uppercase tracking-wider">
                    {cur.year}
                  </p>
                </div>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-3 min-h-[4.5rem]">
                {cur.description || "—"}
              </p>

              {cur.documentUrl ? (
                <a
                  href={cur.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors mb-8"
                >
                  <LinkIcon size={16} /> Lihat Dokumen
                </a>
              ) : (
                <p className="text-zinc-600 text-sm italic mb-8">Tidak ada dokumen</p>
              )}

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setSelectedCurriculum(cur);
                    setEditModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 transition-colors"
                  title="Edit"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(cur.id)}
                  className="p-3 rounded-2xl bg-red-900/30 hover:bg-red-800/50 text-red-300 transition-colors"
                  title="Hapus"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <KurikulumModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Tambah Kurikulum Baru"
        onSubmit={handleCreate}
        schoolId={schoolId}
      />

      <KurikulumModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Kurikulum"
        initialData={selectedCurriculum}
        onSubmit={handleUpdate}
        schoolId={schoolId}
      />
    </div>
  );
}