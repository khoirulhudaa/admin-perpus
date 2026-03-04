// import { useSchool } from "@/features/schools";
// import { Dialog, Transition } from "@headlessui/react";
// import { AnimatePresence, motion } from "framer-motion";
// import React, { useCallback, useEffect, useState } from "react";
// import { FaList, FaPaste, FaSpinner, FaTimes } from "react-icons/fa";

// // ────────────────────────────────────────────────
// // Utilities & Components Reusable
// // ────────────────────────────────────────────────

// const clsx = (...args: Array<string | false | null | undefined>): string =>
//   args.filter(Boolean).join(" ");

// interface AlertState {
//   message: string;
//   isVisible: boolean;
// }

// const useAlert = () => {
//   const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });
//   const showAlert = useCallback((message: string) => setAlert({ message, isVisible: true }), []);
//   const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
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
//         "mb-4 rounded-xl border p-4 text-sm backdrop-blur-sm",
//         isSuccess ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-red-500/30 bg-red-500/10 text-red-300"
//       )}
//     >
//       <div className="flex items-start justify-between">
//         <div className="whitespace-pre-line">{message}</div>
//         <button type="button" onClick={onClose} className="ml-4 text-lg">✕</button>
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
//     {label && <div className="mb-1.5 text-xs font-medium text-white/70">{label}</div>}
//     {children}
//     {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
//   </label>
// );

// const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
//   <input
//     className={clsx("w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40", className)}
//     {...props}
//   />
// );

// const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
//   <textarea
//     className={clsx("w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 resize-y min-h-[80px]", className)}
//     {...props}
//   />
// );

// const Select = ({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
//   <select
//     className={clsx("w-full rounded-md border border-white/20 bg-white/10 px-3 py-3 text-sm text-white outline-none", className)}
//     {...props}
//   />
// );

// // ────────────────────────────────────────────────
// // Interface & Constants
// // ────────────────────────────────────────────────

// interface JadwalItem {
//   id: number;
//   kelas: number;
//   shift: "pagi" | "siang";
//   hari: string;
//   seragam: string;
//   jadwal: string[];
//   catatan?: string | null;
//   schoolId: number;
//   isActive: boolean;
// }

// const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

// const DEFAULT_JADWAL: Partial<JadwalItem> = {
//   kelas: 1,
//   shift: "pagi",
//   hari: "Senin",
//   seragam: "Seragam Putih-Merah",
//   jadwal: [""],
//   catatan: "",
// };

// const API_BASE = "https://be-school.kiraproject.id/jadwal-sd";

// export function JadwalSD() {
//   const [jadwalList, setJadwalList] = useState<JadwalItem[]>([]);
//   const [formData, setFormData] = useState<Partial<JadwalItem>>(DEFAULT_JADWAL);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();
  
//   // Fitur Baru: Bulk Input Mode
//   const [isBulkMode, setIsBulkMode] = useState(false);
//   const [bulkText, setBulkText] = useState("");

//   // Filter States
//   const [filterKelas, setFilterKelas] = useState<string>("all");
//   const [filterHari, setFilterHari] = useState<string>("all");
//   const [filterShift, setFilterShift] = useState<string>("all");

//   const schoolQuery = useSchool();
//   const schoolId = schoolQuery?.data?.[0]?.id;

//   const fetchData = async () => {
//     if (!schoolId) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}?schoolId=${schoolId}`, { cache: "no-store" });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const json = await res.json();
//       if (!json.success) throw new Error(json.message);
//       setJadwalList(json.data || []);
//     } catch (err: any) {
//       showAlert(`Gagal memuat jadwal: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (schoolId) fetchData();
//   }, [schoolId]);

//   // Logic Filtering
//   const filteredData = jadwalList.filter((item) => {
//     const matchKelas = filterKelas === "all" || item.kelas.toString() === filterKelas;
//     const matchHari = filterHari === "all" || item.hari === filterHari;
//     const matchShift = filterShift === "all" || item.shift === filterShift;
//     return matchKelas && matchHari && matchShift;
//   });

//   const resetFilters = () => {
//     setFilterKelas("all");
//     setFilterHari("all");
//     setFilterShift("all");
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleJadwalChange = (index: number, value: string) => {
//     setFormData((prev) => {
//       const newJadwal = [...(prev.jadwal || [])];
//       newJadwal[index] = value;
//       return { ...prev, jadwal: newJadwal };
//     });
//   };

//   const addJadwalSlot = () => setFormData(prev => ({ ...prev, jadwal: [...(prev.jadwal || []), ""] }));

//   const removeJadwalSlot = (index: number) => setFormData(prev => ({
//     ...prev, 
//     jadwal: (prev.jadwal || []).filter((_, i) => i !== index)
//   }));

//   // Logic Sinkronisasi Bulk ke Array
//   const syncBulkToJadwal = (text: string) => {
//     const lines = text.split("\n").filter(line => line.trim() !== "");
//     setFormData(prev => ({ ...prev, jadwal: lines.length > 0 ? lines : [""] }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!schoolId) return showAlert("School ID tidak tersedia");

//     const cleanJadwal = (formData.jadwal || []).filter((v) => v.trim() !== "");
//     if (!cleanJadwal.length) return showAlert("Minimal isi 1 pelajaran");

//     setLoading(true);
//     try {
//       const res = await fetch(API_BASE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           schoolId: parseInt(schoolId.toString()),
//           kelas: parseInt(formData.kelas?.toString() || "1"),
//           jadwal: cleanJadwal,
//         }),
//       });

//       const json = await res.json();
//       if (!res.ok) throw new Error(json.message || "Gagal menyimpan");

//       showAlert("Berhasil menyimpan jadwal");
//       setIsModalOpen(false);
//       setIsBulkMode(false);
//       setBulkText("");
//       fetchData();
//     } catch (err: any) {
//       showAlert(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item: JadwalItem) => {
//     setFormData({ ...item });
//     setEditingId(item.id);
//     setBulkText(item.jadwal.join("\n"));
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/${id}?schoolId=${schoolId}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Gagal menghapus");
//       showAlert("Jadwal berhasil dihapus");
//       fetchData();
//     } catch (err: any) {
//       showAlert(`Gagal menghapus: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 py-4 mb-10">
//       {/* Tombol Tambah */}
//       <div className="flex justify-start gap-4">
//         <button
//           onClick={() => { 
//             setFormData(DEFAULT_JADWAL); 
//             setEditingId(null); 
//             setIsModalOpen(true); 
//             setIsBulkMode(false);
//             setBulkText("");
//           }}
//           className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-3 py-1.5 text-sm font-bold hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
//         >
//           <ISave /> Tambah Jadwal
//         </button>

//           {/* Kontrol Filter */}
//         <div className="w-max flex flex-wrap items-end gap-4">
//           <div className="flex-1 min-w-[120px]">
//             <Select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)} className="!py-2 !text-sm">
//               <option className="text-black" value="all">Semua Kelas</option>
//               {[1,2,3,4,5,6].map(k => <option className="text-black" key={k} value={k}>Kelas {k}</option>)}
//             </Select>
//           </div>

//           <div className="flex-1 min-w-[120px]">
//             <Select value={filterHari} onChange={(e) => setFilterHari(e.target.value)} className="!py-2 !text-sm">
//               <option className="text-black" value="all">Semua Hari</option>
//               {DAYS.map(d => <option className="text-black" key={d} value={d}>{d}</option>)}
//             </Select>
//           </div>

//           <div className="flex-1 min-w-[120px]">
//             <Select value={filterShift} onChange={(e) => setFilterShift(e.target.value)} className="!py-2 !text-sm">
//               <option className="text-black" value="all">Semua Shift</option>
//               <option className="text-black" value="pagi">Pagi</option>
//               <option className="text-black" value="siang">Siang</option>
//             </Select>
//           </div>

//           {(filterKelas !== 'all' || filterHari !== 'all' || filterShift !== 'all') && (
//             <button 
//               onClick={resetFilters}
//               className="px-3 py-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
//             >
//               <FaTimes className="text-[10px]" /> Reset
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Modal Form */}
//       <Transition appear show={isModalOpen} as={React.Fragment}>
//         <Dialog as="div" className="relative z-[9999]" onClose={() => setIsModalOpen(false)}>
//           <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
//             <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
//           </Transition.Child>

//           <div className="fixed top-0 right-0 inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
//                 <Dialog.Panel className="absolute top-0 right-0 h-screen overflow-auto w-full max-w-lg transform border border-white/20 bg-gray-900 p-6 shadow-2xl text-left">
//                   <Dialog.Title className="mb-6 text-xl border-b border-white/10 pb-5 font-semibold text-white">
//                     {editingId ? "Edit Jadwal Pelajaran" : "Konfigurasi Jadwal"}
//                   </Dialog.Title>

//                   <form onSubmit={handleSubmit} className="space-y-5">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <Field label="Kelas">
//                         <Select name="kelas" value={formData.kelas} onChange={handleInputChange}>
//                           {[1,2,3,4,5,6].map(k => <option className="text-black" key={k} value={k}>Kelas {k}</option>)}
//                         </Select>
//                       </Field>
//                       <Field label="Shift">
//                         <Select name="shift" value={formData.shift} onChange={handleInputChange}>
//                           <option className="text-black" value="pagi">Pagi</option>
//                           <option className="text-black" value="siang">Siang</option>
//                         </Select>
//                       </Field>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <Field label="Hari">
//                         <Select name="hari" value={formData.hari} onChange={handleInputChange}>
//                           {DAYS.map(d => <option className="text-black" key={d} value={d}>{d}</option>)}
//                         </Select>
//                       </Field>
//                       <Field label="Seragam">
//                         <Input 
//                           name="seragam" 
//                           value={formData.seragam} 
//                           onChange={handleInputChange} 
//                           placeholder="Pramuka / Batik / dll"
//                         />
//                       </Field>
//                     </div>

//                     <Field label="Catatan (opsional)">
//                       <TextArea name="catatan" value={formData.catatan || ""} onChange={handleInputChange} placeholder="Info tambahan..." />
//                     </Field>

//                     <div className="border-t border-white/10 pt-4">
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="text-xs font-medium text-white/70">Daftar Pelajaran</div>
//                         <div className="flex bg-white/5 rounded-lg p-1 gap-1">
//                           <button 
//                             type="button"
//                             onClick={() => setIsBulkMode(false)}
//                             className={clsx("px-3 py-1 text-[10px] rounded-md transition-all flex items-center gap-1.5", !isBulkMode ? "bg-blue-600 text-white" : "text-white/40 hover:text-white")}
//                           >
//                             <FaList /> Manual
//                           </button>
//                           <button 
//                             type="button"
//                             onClick={() => setIsBulkMode(true)}
//                             className={clsx("px-3 py-1 text-[10px] rounded-md transition-all flex items-center gap-1.5", isBulkMode ? "bg-blue-600 text-white" : "text-white/40 hover:text-white")}
//                           >
//                             <FaPaste /> Tempel Sekaligus
//                           </button>
//                         </div>
//                       </div>

//                       {isBulkMode ? (
//                         <div className="space-y-2">
//                            <TextArea 
//                             placeholder="Tempel jadwal di sini. Gunakan baris baru untuk pelajaran berbeda.&#10;Contoh:&#10;07:00 Matematika&#10;08:30 Bahasa Indonesia"
//                             className="min-h-[150px] font-mono text-xs leading-relaxed"
//                             value={bulkText}
//                             onChange={(e) => {
//                               setBulkText(e.target.value);
//                               syncBulkToJadwal(e.target.value);
//                             }}
//                           />
//                           <p className="text-[10px] text-white/40">Setiap baris akan otomatis menjadi satu slot pelajaran.</p>
//                         </div>
//                       ) : (
//                         <div className="space-y-3">
//                           {formData.jadwal?.map((slot, idx) => (
//                             <div key={idx} className="flex items-center gap-3">
//                               <Input value={slot} onChange={(e) => handleJadwalChange(idx, e.target.value)} placeholder="07:20 - 08:20 Matematika" />
//                               <button type="button" onClick={() => removeJadwalSlot(idx)} className="text-red-400 text-xl">×</button>
//                             </div>
//                           ))}
//                           <button type="button" onClick={addJadwalSlot} className="text-blue-400 text-sm font-medium hover:underline">+ Tambah Mapel</button>
//                         </div>
//                       )}
//                     </div>

//                     <div className="w-full grid grid-cols-2 justify-end gap-3 pt-4 border-t border-white/10">
//                       <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-white/30 px-6 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10" disabled={loading}>
//                         Batal
//                       </button>
//                       <button type="submit" disabled={loading} className="inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
//                         {loading ? <FaSpinner className="animate-spin" /> : <ISave />}
//                         {editingId ? "Update Data" : "Simpan Data"}
//                       </button>
//                     </div>
//                   </form>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* Bagian Filter & Daftar Data */}
//       <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
//         <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

//         {/* Display Daftar Jadwal */}
//         {loading ? (
//           <div className="py-20 text-center flex flex-col items-center gap-3">
//             <FaSpinner className="animate-spin text-blue-500 text-2xl" />
//             <p className="text-white/40 text-sm">Menyinkronkan data...</p>
//           </div>
//         ) : filteredData.length === 0 ? (
//           <div className="text-center py-20">
//             <div className="text-4xl mb-4">📂</div>
//             <p className="text-gray-400 font-medium">Tidak ada jadwal yang sesuai dengan filter.</p>
//             <button onClick={resetFilters} className="mt-2 text-blue-400 text-sm hover:underline">Lihat semua jadwal</button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {filteredData.map((item) => (
//               <motion.div 
//                 layout
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 key={item.id} 
//                 className="rounded-xl border flex flex-col justify-between border-white/10 bg-black/40 p-5 hover:border-white/30 transition-colors"
//               >
//                 <div>
//                   <div className="mb-2 flex items-start justify-between">
//                     <div>
//                       <h4 className="font-bold text-white text-lg">Kelas {item.kelas}</h4>
//                       <p className="text-blue-400 text-sm font-bold uppercase tracking-tighter">{item.hari} • {item.shift}</p>
//                     </div>
//                   </div>
                  
//                   <div className="inline-block rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-4">
//                     👕 {item.seragam}
//                   </div>
                  
//                   <ul className="space-y-2 mb-6 border-l border-white/10 pl-4 ml-1">
//                     {item.jadwal.map((s, i) => (
//                       <li key={i} className="text-sm text-gray-300 flex items-start gap-2 group">
//                         <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 group-hover:scale-125 transition-transform" /> 
//                         <span className="leading-tight">{s}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   {item.catatan && (
//                     <div className="mb-4 p-2 rounded bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-200/70 italic">
//                       Note: {item.catatan}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex gap-2 border-t border-white/5 pt-4 mt-auto">
//                   <button onClick={() => handleEdit(item)} className="flex-1 py-2 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all">Perbarui</button>
//                   <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Hapus</button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Calendar, Clock, Edit, Loader, Plus, Save, Trash2, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = "https://be-school.kiraproject.id/jadwal-sd";

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

interface JadwalItem {
  id: number;
  kelas: number;
  shift: "pagi" | "siang";
  hari: string;
  seragam: string;
  jadwal: string[];
  catatan?: string | null;
  schoolId: number;
  isActive: boolean;
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

const DEFAULT_JADWAL: Partial<JadwalItem> = {
  kelas: 1,
  shift: "pagi",
  hari: "Senin",
  seragam: "Seragam Putih-Merah",
  jadwal: [""],
  catatan: "",
};

const JadwalSDModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  initialData: Partial<JadwalItem>;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}) => {
  const [form, setForm] = useState<Partial<JadwalItem>>(initialData);
  const [bulkText, setBulkText] = useState("");
  const [isBulkMode, setIsBulkMode] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialData);
      setBulkText(initialData.jadwal?.join("\n") || "");
      setIsBulkMode(false);
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleJadwalChange = (index: number, value: string) => {
    setForm((prev) => {
      const newJadwal = [...(prev.jadwal || [])];
      newJadwal[index] = value;
      return { ...prev, jadwal: newJadwal };
    });
  };

  const addJadwalSlot = () => {
    setForm((prev) => ({ ...prev, jadwal: [...(prev.jadwal || []), ""] }));
  };

  const removeJadwalSlot = (index: number) => {
    setForm((prev) => ({
      ...prev,
      jadwal: (prev.jadwal || []).filter((_, i) => i !== index),
    }));
  };

  const syncBulk = (text: string) => {
    const lines = text.split("\n").filter(Boolean);
    setForm((prev) => ({ ...prev, jadwal: lines.length ? lines : [""] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanJadwal = (form.jadwal || []).filter(Boolean);
    if (!cleanJadwal.length) return alert("Minimal isi 1 pelajaran");

    const payload = { ...form, jadwal: cleanJadwal };
    await onSubmit(payload);
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
              {initialData.id ? "Edit" : "Tambah"} <span className="text-blue-600">Jadwal SD</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Jadwal Pelajaran Sekolah Dasar
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Kelas *
              </label>
              <select
                name="kelas"
                value={form.kelas}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
              >
                {[1, 2, 3, 4, 5, 6].map((k) => (
                  <option className="text-black" key={k} value={k}>
                    Kelas {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Shift *
              </label>
              <select
                name="shift"
                value={form.shift}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option className="text-black" value="pagi">Pagi</option>
                <option className="text-black" value="siang">Siang</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Hari *
              </label>
              <select
                name="hari"
                value={form.hari}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
              >
                {DAYS.map((d) => (
                  <option className="text-black" key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Seragam
              </label>
              <input
                name="seragam"
                value={form.seragam || ""}
                onChange={handleChange}
                placeholder="Seragam Putih-Merah / Pramuka / Batik"
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Catatan (opsional)
            </label>
            <textarea
              name="catatan"
              value={form.catatan || ""}
              onChange={handleChange}
              placeholder="Informasi tambahan..."
              rows={3}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-y"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Daftar Pelajaran *
              </label>
              <div className="flex bg-white/5 rounded-xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setIsBulkMode(false)}
                  className={`px-4 py-1.5 text-xs rounded-lg transition-all ${
                    !isBulkMode ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Manual
                </button>
                <button
                  type="button"
                  onClick={() => setIsBulkMode(true)}
                  className={`px-4 py-1.5 text-xs rounded-lg transition-all ${
                    isBulkMode ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Bulk Paste
                </button>
              </div>
            </div>

            {isBulkMode ? (
              <textarea
                value={bulkText}
                onChange={(e) => {
                  setBulkText(e.target.value);
                  syncBulk(e.target.value);
                }}
                placeholder="Tempel jadwal di sini (satu baris = satu pelajaran)\nContoh:\n07:00 - 08:00 Matematika\n08:10 - 09:00 Bahasa Indonesia"
                rows={8}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all font-mono text-sm resize-y"
                disabled={loading}
              />
            ) : (
              <div className="space-y-3">
                {(form.jadwal || []).map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      value={slot}
                      onChange={(e) => handleJadwalChange(idx, e.target.value)}
                      placeholder="07:00 - 08:00 Matematika"
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => removeJadwalSlot(idx)}
                      className="p-3 rounded-xl bg-red-900/30 hover:bg-red-800/50 text-red-300"
                      disabled={loading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addJadwalSlot}
                  className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
                  disabled={loading}
                >
                  + Tambah Pelajaran
                </button>
              </div>
            )}
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
              {loading ? "Menyimpan..." : initialData.id ? "Update Jadwal" : "Tambah Jadwal"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export function JadwalSD() {
  const [jadwalList, setJadwalList] = useState<JadwalItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JadwalItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterKelas, setFilterKelas] = useState<string>("all");
  const [filterHari, setFilterHari] = useState<string>("all");
  const [filterShift, setFilterShift] = useState<string>("all");
  const { alert, showAlert, hideAlert } = useAlert();

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const fetchData = useCallback(async () => {
    if (!schoolId) {
      showAlert("School ID tidak ditemukan");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Invalid response");
      setJadwalList(json.data || []);
    } catch (err: any) {
      showAlert(`Gagal memuat jadwal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [schoolId, showAlert]);

  useEffect(() => {
    if (schoolId) fetchData();
  }, [schoolId, fetchData]);

  const filteredData = useMemo(() => {
    return jadwalList.filter((item) => {
      const matchKelas = filterKelas === "all" || item.kelas.toString() === filterKelas;
      const matchHari = filterHari === "all" || item.hari === filterHari;
      const matchShift = filterShift === "all" || item.shift === filterShift;
      return matchKelas && matchHari && matchShift;
    });
  }, [jadwalList, filterKelas, filterHari, filterShift]);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const url = editingItem ? `${API_BASE}/${editingItem.id}` : API_BASE;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, schoolId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Gagal menyimpan (${res.status})`);
      }

      showAlert(editingItem ? "Jadwal berhasil diperbarui" : "Jadwal berhasil ditambahkan");
      setModalOpen(false);
      setEditingItem(null);
      await fetchData();
    } catch (err: any) {
      showAlert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}?schoolId=${schoolId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      showAlert("Jadwal berhasil dihapus");
      await fetchData();
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

  const openEdit = (item: JadwalItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const resetFilters = () => {
    setFilterKelas("all");
    setFilterHari("all");
    setFilterShift("all");
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
            <Calendar size={14} /> Jadwal Manajemen
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Jadwal <span className="text-blue-600">SD</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola jadwal harian kelas 1-6</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-blue-500 outline-none min-w-[140px]"
          >
            <option value="all">Semua Kelas</option>
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <option className="text-black" key={k} value={k.toString()}>
                Kelas {k}
              </option>
            ))}
          </select>

          <select
            value={filterHari}
            onChange={(e) => setFilterHari(e.target.value)}
            className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-blue-500 outline-none min-w-[160px]"
          >
            <option value="all">Semua Hari</option>
            {DAYS.map((d) => (
              <option className="text-black" key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
            className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-blue-500 outline-none min-w-[140px]"
          >
            <option value="all">Semua Shift</option>
            <option value="pagi">Pagi</option>
            <option value="siang">Siang</option>
          </select> */}

          {(filterKelas !== "all" || filterHari !== "all" || filterShift !== "all") && (
            <button
              onClick={resetFilters}
              className="text-sm text-zinc-400 hover:text-white underline underline-offset-2 transition-colors"
            >
              Reset Filter
            </button>
          )}

          <button
            onClick={openAdd}
            disabled={loading}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50"
          >
            <Plus size={18} /> Tambah Jadwal
          </button>
        </div>
      </div>

      {loading && jadwalList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader className="animate-spin text-blue-500" size={48} />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
            Memuat jadwal...
          </div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <Calendar size={40} className="text-zinc-600" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Tidak ada jadwal yang sesuai filter</h3>
          <p className="text-zinc-500">Coba reset filter atau tambahkan jadwal baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-white/[0.03] border border-white/8 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="p-6 space-y-5">
                <div className="gap-4">
                  <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 gap-4">
                    <p className=" bg-white/5 rounded-md border relative top-[-3px] border-white/10 px-2.5 py-1 text-[14px] uppercase text-zinc-400">
                      <span className="text-blue-400"> Kelas {item.kelas} - {item.hari} </span> - {item.shift.charAt(0).toUpperCase() + item.shift.slice(1)}
                    </p>
                    {/* <h3 className="text-xl uppercase font-bold text-white group-hover:text-blue-400 transition-colors">
                      Kelas {item.kelas}
                    </h3> */}
                  </div>
                  <p className="flex-shrink-0 px-2.5 w-max py-1.5 mt-2 bg-emerald-600/10 text-emerald-400 text-[10px] font-black rounded-md border border-emerald-500/20 uppercase">
                    {item.seragam}
                  </p>    
                </div>

                <ul className="space-y-3 text-sm text-zinc-300">
                  {item.jadwal.map((slot, i) => {
                    // Asumsi format slot: "07:00 - 08:00 Matematika" atau "07:00-08:00 IPA"
                    const match = slot.match(/^(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})\s*(.+)$/);
                    
                    if (match) {
                      const [, start, end, subject] = match;
                      return (
                        <li key={i} className="flex items-start gap-4 group">
                          <div className="flex-shrink-0 w-28">
                            <span className="font-mono font-medium text-blue-400">
                              {start} – {end}
                            </span>
                          </div>
                          <span className="leading-relaxed font-medium text-white group-hover:text-blue-300 transition-colors">
                            {subject.trim()}
                          </span>
                        </li>
                      );
                    }

                    // fallback jika format tidak cocok
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <Clock size={14} className="text-blue-500 mt-1 flex-shrink-0" />
                        <span className="leading-relaxed">{slot}</span>
                      </li>
                    );
                  })}
                </ul>

                {item.catatan && (
                  <div className="pt-3 border-t border-white/8">
                    <p className="text-xs italic text-amber-300/80">
                      <span className="font-medium">Catatan:</span> {item.catatan}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-5 border-t border-white/8">
                  <button
                    onClick={() => openEdit(item)}
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

      <JadwalSDModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        initialData={editingItem || DEFAULT_JADWAL}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}