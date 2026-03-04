// import { useSchool } from "@/features/schools";
// import { AnimatePresence, motion } from "framer-motion";
// import { Edit, Loader2, Save, Trash2, Upload, X } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";

// // ──────────────────────────────────────────────────────────────
// // Theme (sama seperti referensi alumni)
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

// const BASE_URL = "https://be-school.kiraproject.id/kalender";

// // ──────────────────────────────────────────────────────────────
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

// // ──────────────────────────────────────────────────────────────
// // Modal Form Kalender Event (Create / Update)
// const KalenderModal = ({
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
//   onSubmit: (formData: FormData) => Promise<void>;
//   schoolId: number | null;
// }) => {
//   const [form, setForm] = useState({
//     title: "",
//     date: "",
//     category: "Akademik",
//     description: "",
//     location: "",
//     photo: null as File | null,
//     preview: "",
//   });

//   const [saving, setSaving] = useState(false);

//   // Reset form hanya saat modal dibuka
//   useEffect(() => {
//     if (open) {
//       setForm({
//         title: initialData?.title || "",
//         date: initialData?.date || "",
//         category: initialData?.category || "Akademik",
//         description: initialData?.description || "",
//         location: initialData?.location || "",
//         photo: null,
//         preview: initialData?.photoUrl || "",
//       });
//     }
//   }, [open]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setForm((prev) => ({
//         ...prev,
//         photo: file,
//         preview: URL.createObjectURL(file),
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!form.title.trim() || !form.date.trim() || !form.category.trim()) {
//       alert("Judul, Tanggal, dan Kategori wajib diisi");
//       return;
//     }

//     if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) {
//       alert("Format tanggal harus YYYY-MM-DD");
//       return;
//     }

//     if (!schoolId) {
//       alert("School ID tidak ditemukan");
//       return;
//     }

//     setSaving(true);

//     try {
//       const formData = new FormData();
//       formData.append("title", form.title);
//       formData.append("date", form.date);
//       formData.append("category", form.category);
//       formData.append("description", form.description);
//       formData.append("location", form.location);
//       formData.append("schoolId", schoolId.toString());

//       if (form.photo) {
//         formData.append("photo", form.photo);
//       }

//       await onSubmit(formData);
//       onClose();
//     } catch (err: any) {
//       alert("Gagal menyimpan: " + (err.message || "Terjadi kesalahan"));
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed top-0 right-0 inset-0 bg-black/70 flex items-center justify-center z-[999] p-4">
//       <motion.div
//         initial={{ scale: 0.92, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.92, opacity: 0 }}
//         className="absolute top-0 right-0 bg-black/70 border border-gray-500/30 rounded-2xl w-full max-w-md z-[999999] overflow-auto h-screen"
//       >
//         <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-white">{title}</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-white">
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {form.preview && (
//             <div className="flex justify-center">
//               <img
//                 src={form.preview}
//                 alt="Preview"
//                 className="w-32 h-32 object-cover rounded-full border-2 border-gray-600"
//               />
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Foto / Poster
//             </label>
//             <div className="flex items-center gap-3">
//               <label className="cursor-pointer flex-1">
//                 <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-gray-600 rounded-lg hover:bg-gray-700">
//                   <Upload size={18} />
//                   <span className="truncate max-w-[200px]">
//                     {form.photo ? form.photo.name : "Pilih foto..."}
//                   </span>
//                 </div>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </label>
//               {form.preview && (
//                 <button
//                   type="button"
//                   onClick={() => setForm((p) => ({ ...p, photo: null, preview: "" }))}
//                   className="p-2 text-red-400 hover:text-red-300"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Judul Kegiatan *
//             </label>
//             <input
//               type="text"
//               value={form.title}
//               onChange={(e) => setForm({ ...form, title: e.target.value })}
//               placeholder="Contoh: Upacara Bendera"
//               required
//               className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Tanggal *
//             </label>
//             <input
//               type="date"
//               value={form.date}
//               onChange={(e) => setForm({ ...form, date: e.target.value })}
//               required
//               className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Kategori *
//             </label>
//             <select
//               value={form.category}
//               onChange={(e) => setForm({ ...form, category: e.target.value })}
//               className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
//             >
//               <option className="text-black" value="Akademik">Akademik</option>
//               <option className="text-black" value="Kesiswaan">Kesiswaan</option>
//               <option className="text-black" value="Hari Besar">Hari Besar</option>
//               <option className="text-black" value="Lomba">Lomba</option>
//               <option className="text-black" value="Upacara">Upacara</option>
//               <option className="text-black" value="Libur">Libur</option>
//               <option className="text-black" value="Lainnya">Lainnya</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Deskripsi
//             </label>
//             <textarea
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               placeholder="Detail kegiatan..."
//               rows={3}
//               className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none resize-y"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Lokasi
//             </label>
//             <input
//               type="text"
//               value={form.location}
//               onChange={(e) => setForm({ ...form, location: e.target.value })}
//               placeholder="Contoh: Halaman Upacara Sekolah"
//               className="w-full px-4 py-2.5 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
//             />
//           </div>

//           <div className="grid grid-cols-2 justify-end gap-4 pt-4 border-t border-gray-700">
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

// // ──────────────────────────────────────────────────────────────
// // Main Component: KalenderManager
// export default function Kalender() {
//   const [events, setEvents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [alert, setAlert] = useState<AlertState>({
//     message: "",
//     type: "success",
//     visible: false,
//   });

//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<any>(null);

//   const schoolQuery = useSchool();
//   const schoolId = schoolQuery?.data?.[0]?.id;

//   const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
//     setAlert({ message: msg, type, visible: true });
//     setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 6000);
//   }, []);

//   const fetchEvents = useCallback(async () => {
//     if (!schoolId) {
//       showAlert("School ID tidak ditemukan. Pastikan data sekolah sudah dimuat.", "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`, {
//         cache: "no-store",
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const json = await res.json();
//       if (json.success) {
//         setEvents(json.data || []);
//       } else {
//         throw new Error(json.message || "Response tidak valid");
//       }
//     } catch (err: any) {
//       showAlert("Gagal memuat data kalender: " + err.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [schoolId, showAlert]);

//   useEffect(() => {
//     fetchEvents();
//   }, [fetchEvents]);

//   const handleCreate = async (formData: FormData) => {
//     const res = await fetch(BASE_URL, {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) {
//       const errJson = await res.json().catch(() => ({}));
//       throw new Error(errJson.message || "Gagal menambah kegiatan");
//     }

//     const json = await res.json();
//     if (!json.success) {
//       throw new Error(json.message || "Gagal menambah kegiatan");
//     }

//     showAlert("Kegiatan berhasil ditambahkan!");
//     fetchEvents();
//   };

//   const handleUpdate = async (formData: FormData) => {
//     if (!selectedEvent?.id) return;

//     const res = await fetch(`${BASE_URL}/${selectedEvent.id}`, {
//       method: "PUT",
//       body: formData,
//     });

//     if (!res.ok) {
//       const errJson = await res.json().catch(() => ({}));
//       throw new Error(errJson.message || "Gagal memperbarui kegiatan");
//     }

//     const json = await res.json();
//     if (!json.success) {
//       throw new Error(json.message || "Gagal memperbarui kegiatan");
//     }

//     showAlert("Kegiatan berhasil diperbarui!");
//     fetchEvents();
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Yakin ingin menghapus kegiatan ini?")) return;

//     try {
//       const res = await fetch(`${BASE_URL}/${id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) {
//         const errJson = await res.json().catch(() => ({}));
//         throw new Error(errJson.message || "Gagal menghapus kegiatan");
//       }

//       showAlert("Kegiatan berhasil dihapus");
//       fetchEvents();
//     } catch (err: any) {
//       showAlert("Gagal menghapus: " + err.message, "error");
//     }
//   };

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
//     <div className="min-h-screen py-4" style={{ background: THEME.bg, color: THEME.text }}>
//       <header className="flex justify-between items-center mb-5">
//         <button
//           onClick={() => {
//             setSelectedEvent(null);
//             setAddModalOpen(true);
//           }}
//           className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold shadow-md transition-colors"
//         >
//           <ISave /> Tambah Kegiatan
//         </button>
//       </header>

//       <AnimatePresence>
//         {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
//       </AnimatePresence>

//       {loading ? (
//         <div className="flex justify-center py-20">
//           <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
//         </div>
//       ) : events.length === 0 ? (
//         <div className="text-center py-20 text-gray-400">
//           Belum ada kegiatan untuk sekolah ini
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white/5 rounded-2xl">
//           <table className="min-w-full divide-y divide-gray-700">
//             <thead>
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Foto</th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Judul</th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Tanggal</th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Kategori</th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Lokasi</th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Aksi</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-800">
//               {events.map((ev) => (
//                 <tr key={ev.id} className="hover:bg-white/10/30 transition-colors">
//                   <td className="px-6 py-4">
//                     {ev.photoUrl ? (
//                       <img
//                         src={ev.photoUrl}
//                         alt={ev.title}
//                         className="w-12 h-12 object-cover rounded-full border border-gray-600"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
//                         No Photo
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 font-medium">{ev.title}</td>
//                   <td className="px-6 py-4">{ev.date}</td>
//                   <td className="px-6 py-4">{ev.category}</td>
//                   <td className="px-6 py-4 text-gray-300 truncate max-w-xs">
//                     {ev.location || <span className="opacity-50">—</span>}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex gap-3">
//                       <button
//                         onClick={() => {
//                           setSelectedEvent(ev);
//                           setEditModalOpen(true);
//                         }}
//                         className="p-2 bg-blue-900/40 hover:bg-blue-800/60 rounded-lg text-blue-300 transition-colors"
//                         title="Edit"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(ev.id)}
//                         className="p-2 bg-red-900/40 hover:bg-red-800/60 rounded-lg text-red-300 transition-colors"
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

//       {/* Modal Tambah */}
//       <KalenderModal
//         open={addModalOpen}
//         onClose={() => setAddModalOpen(false)}
//         title="Tambah Kegiatan Baru"
//         onSubmit={handleCreate}
//         schoolId={schoolId}
//       />

//       {/* Modal Edit */}
//       <KalenderModal
//         open={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//         title="Edit Kegiatan"
//         initialData={selectedEvent}
//         onSubmit={handleUpdate}
//         schoolId={schoolId}
//       />
//     </div>
//   );
// }




import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  Loader2,
  Trash2,
  X,
  Info,
  Clock,
  Tag
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";

const API_BASE = "https://be-school.kiraproject.id/kalender";

// === UI COMPONENTS: ALERT ===
const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={`fixed top-6 right-6 z-[1000000] rounded-2xl border p-5 shadow-2xl backdrop-blur-xl text-sm font-bold tracking-tight ${
        isSuccess ? "border-blue-500/40 bg-blue-600/10 text-blue-100" : "border-red-500/40 bg-red-600/10 text-red-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSuccess ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
           {isSuccess ? "✓" : "✕"}
        </div>
        <div className="whitespace-pre-line leading-relaxed">{message}</div>
        <button onClick={onClose} className="opacity-40 hover:opacity-100 transition-opacity"><X size={18} /></button>
      </div>
    </motion.div>
  );
};

// === MODAL: ADD EVENT (Slide-over Right) ===
const EventModal = ({ open, onClose, onSubmit, loading, selectedDate, schoolId }: any) => {
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    category: "Akademik", // Default category
    time: "08:00" 
  });

  const categories = ["Akademik", "Libur", "Ujian", "Ekstrakurikuler", "Lainnya"];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Payload disesuaikan dengan kebutuhan API: title, date, category, schoolId
    onSubmit({ 
      title: form.title,
      date: selectedDate,
      category: form.category,
      description: form.description,
      schoolId: schoolId
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-full max-w-md bg-[#0B1220] border-l border-white/10 p-10 overflow-y-auto flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic">New <span className="text-blue-600">Event</span></h3>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-2xl transition-all"><X size={24} /></button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic block">Judul Kegiatan *</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all font-medium" 
              value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Ujian Akhir Semester" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic block">Kategori *</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all font-medium appearance-none"
              value={form.category} 
              onChange={e => setForm({...form, category: e.target.value})}
            >
              {categories.map(cat => <option key={cat} value={cat} className="bg-[#0B1220]">{cat}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic block">Deskripsi</label>
            <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 resize-none font-medium"
              value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Detail agenda..." />
          </div>

          <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
            <button type="button" onClick={onClose} className="py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Cancel</button>
            <button disabled={loading} className="py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)]">
              {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} Save Agenda
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// === MAIN CALENDAR COMPONENT ===
export default function CalendarMain() {
  const { data: schoolData } = useSchool();
  const schoolId = schoolData?.[0]?.id;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [alert, setAlert] = useState({ message: "", isVisible: false });

  const monthName = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const fetchData = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`);
      const json = await res.json();
      setEvents(json.data || []);
    } catch (err) { setAlert({ message: "Gagal terhubung ke server", isVisible: true }); }
    finally { setLoading(false); }
  }, [schoolId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddEvent = async (payload: any) => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        setAlert({ message: "Agenda Berhasil Disimpan!", isVisible: true });
        setModalOpen(false);
        fetchData();
      } else {
        setAlert({ message: data.message || "Gagal menyimpan data", isVisible: true });
      }
    } catch (err) { setAlert({ message: "Terjadi kesalahan sistem", isVisible: true }); }
    finally { setLoading(false); }
  };

  const deleteEvent = async (id: number) => {
    if (!confirm("Hapus agenda ini secara permanen?")) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      setAlert({ message: "Agenda telah dihapus", isVisible: true });
      fetchData();
    } catch (err) { setAlert({ message: "Gagal menghapus", isVisible: true }); }
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans">
      <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={() => setAlert({ ...alert, isVisible: false })} />}</AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col border-b border-white/5 pb-11 md:flex-row md:justify-between md:items-center mb-12 gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.5em]">
            <CalendarIcon size={14} /> Schedule System
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">Kalender <span className="text-blue-600">Akademik</span></h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola agenda sekolah</p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-[24px] border border-white/10 shadow-2xl backdrop-blur-md">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-4 hover:bg-white/10 rounded-2xl transition-all"><ChevronLeft /></button>
          <div className="px-6 font-black uppercase italic tracking-[0.2em] text-sm min-w-[180px] text-center">{monthName}</div>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-4 hover:bg-white/10 rounded-2xl transition-all"><ChevronRight /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Calendar Grid */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-[48px] p-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-7 mb-8">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.date.startsWith(dateStr));
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => { setSelectedDate(dateStr); setModalOpen(true); }}
                  className={`aspect-square rounded-[24px] flex flex-col items-center justify-center gap-2 transition-all relative group border-2
                    ${isToday ? 'bg-blue-600 border-blue-400 shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] z-10' : 'bg-white/5 border-transparent hover:border-blue-500/40 hover:bg-blue-600/[0.05]'}
                  `}
                >
                  <span className={`text-xl font-black ${isToday ? 'text-white' : 'text-zinc-500 group-hover:text-white'}`}>{day}</span>
                  <div className="flex gap-1">
                    {dayEvents.slice(0, 3).map((_, idx) => (
                      <div key={idx} className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-blue-500 animate-pulse'}`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Upcoming Events */}
        <div className="lg:col-span-4 space-y-8">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4 text-white">
            <Clock className="text-blue-600" size={28} /> Next <span className="text-blue-600">Agenda</span>
          </h3>
          
          <div className="space-y-4 max-h-[650px] overflow-y-auto pr-3 custom-scrollbar">
            {events.length === 0 ? (
              <div className="p-16 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[40px]">
                <Info className="mx-auto text-zinc-800 mb-4" size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">No events scheduled</p>
              </div>
            ) : (
              events.map((event) => (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={event.id} className="group bg-white/[0.03] border border-white/10 p-6 rounded-[32px] hover:bg-blue-600/[0.03] hover:border-blue-500/40 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1 italic flex items-center gap-2">
                        <Tag size={10} /> {event.category}
                      </span>
                      <span className="text-white font-black text-lg tracking-tight group-hover:text-blue-400 transition-colors">{event.title}</span>
                    </div>
                    <button onClick={() => deleteEvent(event.id)} className="p-2 text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500 text-[11px] font-bold uppercase tracking-wider">
                    <span className="bg-white/5 px-3 py-1 rounded-lg">{new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-blue-500" /> {event.time || '08:00'}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && <EventModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddEvent} loading={loading} selectedDate={selectedDate} schoolId={schoolId} />}
      </AnimatePresence>
    </div>
  );
}