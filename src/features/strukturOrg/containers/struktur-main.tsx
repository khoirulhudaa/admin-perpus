// import { useSchool } from "@/features/schools";
// import { AnimatePresence, motion } from "framer-motion";
// import { X } from "lucide-react";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   FaChevronDown,
//   FaChevronRight,
//   FaEdit,
//   FaSave,
//   FaSpinner,
//   FaTrash
// } from "react-icons/fa";

// const clsx = (...args: Array<string | false | null | undefined>): string =>
//   args.filter(Boolean).join(" ");

// // --- Alert Component ---
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

// const useAlert = () => {
//   const [alert, setAlert] = useState({ message: "", isVisible: false });
//   const showAlert = useCallback((message: string) => setAlert({ message, isVisible: true }), []);
//   const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
//   return { alert, showAlert, hideAlert };
// };

// // --- Types ---
// interface OrganizationItem {
//   id: number;
//   position: string;
//   parentId: number | null;
//   assignedEmployeeId: number | null;
//   description?: string | null;
//   schoolId: number;
//   isActive: boolean;
//   GuruTendik?: {
//     id: number;
//     nama: string;
//     photoUrl?: string | null;
//     jenisKelamin: string;
//     role: string;
//   } | null;
//   Children?: OrganizationItem[];
// }

// const API_BASE_ORG = "https://be-school.kiraproject.id/organisasi";
// const API_GURU_TENDIK = "https://be-school.kiraproject.id/guruTendik";

// export default function EmployeeManager() {
//   const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
//   const [employees, setEmployees] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<OrganizationItem | null>(null);
  
//   // State untuk ID yang terbuka (Dropdown)
//   const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

//   const [form, setForm] = useState({
//     position: "",
//     parentId: "" as string | number,
//     assignedEmployeeId: "" as string | number,
//     description: "",
//   });

//   const schoolQuery = useSchool();
//   const schoolId = schoolQuery?.data?.[0]?.id;
//   const { alert, showAlert, hideAlert } = useAlert();

//   // 1. Fetch Data & Set Default Open untuk Root
//   const fetchOrganizations = useCallback(async () => {
//     if (!schoolId) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_ORG}?schoolId=${schoolId}`);
//       const json = await res.json();
//       if (json.success) {
//         setOrganizations(json.data);
        
//         // DEFAULT OPEN: Ambil ID dari semua item di level paling atas (root)
//         const rootIds = json.data.map((item: OrganizationItem) => item.id);
//         setExpandedIds(new Set(rootIds));
//       }
//     } catch (err: any) {
//       showAlert(`Gagal: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [schoolId, showAlert]);

//   const fetchEmployees = useCallback(async () => {
//     if (!schoolId) return;
//     try {
//       const res = await fetch(`${API_GURU_TENDIK}?schoolId=${schoolId}`);
//       const json = await res.json();
//       if (json.success) setEmployees(json.data);
//     } catch (err) { console.error(err); }
//   }, [schoolId]);

//   useEffect(() => {
//     if (schoolId) { fetchOrganizations(); fetchEmployees(); }
//   }, [schoolId, fetchOrganizations, fetchEmployees]);

//   // 2. Kontrol Toggle Buka/Tutup
//   const toggleExpand = (id: number) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   // Helper untuk dropdown parent di form (Flat list)
//   const flattenNodes = (nodes: OrganizationItem[]): OrganizationItem[] => {
//     let result: OrganizationItem[] = [];
//     nodes.forEach(node => {
//       result.push(node);
//       if (node.Children) result = result.concat(flattenNodes(node.Children));
//     });
//     return result;
//   };

//   const parentOptions = flattenNodes(organizations).filter(
//     (opt) => !editingItem || opt.id !== editingItem.id
//   );

//   // 3. Render Tree (Recursive)
//   const renderTree = (items: OrganizationItem[], level = 0) => {
//     return items.map((item) => {
//       const hasChildren = item.Children && item.Children.length > 0;
//       const isExpanded = expandedIds.has(item.id);

//       return (
//         <React.Fragment key={item.id}>
//           <div
//             className={clsx(
//               "flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition mb-2 backdrop-blur-sm shadow-sm"
//             )}
//             style={{ 
//               marginLeft: `${level * 28}px`, // Pergeseran dinamis ke kanan
//               borderLeft: level > 0 ? '2px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255,255,255,0.1)' 
//             }}
//           >
//             <div className="flex items-center gap-3 flex-1">
//               {/* Ikon Toggle Dropdown */}
//               <div className="w-6 flex justify-center">
//                 {hasChildren && (
//                   <button 
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.id);
//                     }}
//                     className="text-white/40 hover:text-white transition p-1.5 rounded-md hover:bg-white/5"
//                   >
//                     {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
//                   </button>
//                 )}
//               </div>

//               <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-800 border border-white/20 flex-shrink-0">
//                 <img
//                   src={item.GuruTendik?.photoUrl || "/placeholder-user.jpg"}
//                   alt=""
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               <div className="flex-1 cursor-pointer select-none" onClick={() => hasChildren && toggleExpand(item.id)}>
//                 <h4 className="font-bold text-sm text-white leading-tight">{item.position}</h4>
//                 <p className="text-[11px] text-blue-400 font-medium">
//                   {item.GuruTendik?.nama || "Posisi Kosong"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-1 ml-4">
//               <button onClick={() => openModal(item)} className="p-2 text-white/40 hover:text-blue-400 transition hover:bg-white/5 rounded-lg"><FaEdit size={14}/></button>
//               <button onClick={() => handleDelete(item.id)} className="p-2 text-white/40 hover:text-red-400 transition hover:bg-white/5 rounded-lg"><FaTrash size={14}/></button>
//             </div>
//           </div>

//           {/* Children Animation Container */}
//           <AnimatePresence initial={false}>
//             {hasChildren && isExpanded && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: "auto", opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.25, ease: "easeInOut" }}
//                 className="overflow-hidden"
//               >
//                 {renderTree(item.Children!, level + 1)}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </React.Fragment>
//       );
//     });
//   };

//   // --- CRUD Handlers ---
//   const openModal = (item?: OrganizationItem) => {
//     if (item) {
//       setEditingItem(item);
//       setForm({
//         position: item.position,
//         parentId: item.parentId ?? "",
//         assignedEmployeeId: item.assignedEmployeeId ?? "",
//         description: item.description ?? "",
//       });
//     } else {
//       setEditingItem(null);
//       setForm({ position: "", parentId: "", assignedEmployeeId: "", description: "" });
//     }
//     setModalOpen(true);
//   };

//   const closeModal = () => { setModalOpen(false); setEditingItem(null); };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     const payload = {
//       ...form,
//       schoolId,
//       parentId: form.parentId ? Number(form.parentId) : null,
//       assignedEmployeeId: form.assignedEmployeeId ? Number(form.assignedEmployeeId) : null,
//     };

//     try {
//       const url = editingItem ? `${API_BASE_ORG}/${editingItem.id}` : API_BASE_ORG;
//       const method = editingItem ? "PUT" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (res.ok) {
//         showAlert("Data berhasil diperbarui");
//         closeModal();
//         fetchOrganizations();
//       }
//     } catch (err) { showAlert("Gagal memproses data"); }
//     finally { setLoading(false); }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Hapus posisi ini?")) return;
//     try {
//       await fetch(`${API_BASE_ORG}/${id}`, { method: "DELETE" });
//       fetchOrganizations();
//       showAlert("Data dihapus");
//     } catch (err) { showAlert("Gagal menghapus"); }
//   };

//   const Icon = ({ label }: { label: string }) => (
//     <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
//       {label}
//     </span>
//   );
//   const ISave = () => <Icon label="💾" />;

//   return (
//     <div className="w-full mx-auto space-y-6">
//       {/* Header */}
//       <div className="mb-5 flex flex-col mt-4 sm:flex-row sm:items-center justify-between gap-4">
//         <button
//           onClick={() => openModal()}
//           className="flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition shadow-md"
//         >
//           <ISave /> Tambah Posisi Baru
//         </button>
//       </div>

//       <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

//       {/* Main Container Tree */}
//       <div className="bg-white/5 border border-white/5 rounded-xl p-6 backdrop-blur-md h-max">
//         {loading && !modalOpen ? (
//           <div className="flex flex-col items-center justify-center py-20 gap-4">
//             <FaSpinner className="animate-spin text-5xl text-blue-500" />
//             <p className="text-sm font-medium text-white/30 animate-pulse">Menyiapkan struktur...</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//              {organizations.length > 0 ? (
//                <div className="min-w-[500px] pb-10">{renderTree(organizations)}</div>
//              ) : (
//                <div className="text-center py-24 text-white/50 border-2 border-dashed border-white/5 rounded-2xl italic">
//                  Belum ada struktur organisasi yang dibuat.
//                </div>
//              )}
//           </div>
//         )}
//       </div>

//       {/* Side-over Modal Form */}
//       <AnimatePresence>
//         {modalOpen && (
//           <div className="fixed inset-0 z-[9999] flex items-center justify-end bg-black/80 backdrop-blur-md">
//             <motion.div 
//               initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="w-full max-w-md h-full bg-slate-950 border-l border-white/10 p-10 shadow-2xl flex flex-col"
//             >
//               <div className="flex justify-between items-center mb-10">
//                 <div>
//                   <h2 className="text-2xl font-bold text-white tracking-tight">{editingItem ? "Edit Detail" : "Posisi Baru"}</h2>
//                   <p className="text-xs text-blue-400 mt-1 font-semibold uppercase tracking-widest">Informasi Jabatan</p>
//                 </div>
//                 <button onClick={closeModal} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition"><X size={20}/></button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Nama Jabatan / Posisi</label>
//                   <input 
//                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
//                     value={form.position} onChange={e => setForm({...form, position: e.target.value})}
//                     placeholder="Misal: Wakil Kurikulum" required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Atasan (Parent)</label>
//                   <select 
//                     className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition cursor-pointer appearance-none"
//                     value={form.parentId} onChange={e => setForm({...form, parentId: e.target.value})}
//                   >
//                     <option value="">-- Paling Atas (Root) --</option>
//                     {parentOptions.map(opt => (
//                       <option key={opt.id} value={opt.id}>{opt.position}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Pilih Personel</label>
//                   <select 
//                     className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition cursor-pointer appearance-none"
//                     value={form.assignedEmployeeId} onChange={e => setForm({...form, assignedEmployeeId: e.target.value})}
//                   >
//                     <option value="">-- Belum Ada Pejabat --</option>
//                     {employees.map(emp => (
//                       <option key={emp.id} value={emp.id}>{emp.nama}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="pt-8  bottom-0 bg-slate-950 pb-4">
//                   <button 
//                     disabled={loading}
//                     className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-4 rounded-2xl font-black flex justify-center items-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-blue-900/40"
//                   >
//                     {loading ? <FaSpinner className="animate-spin" /> : <FaSave />} 
//                     {editingItem ? "SIMPAN PERUBAHAN" : "TAMBAHKAN POSISI"}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Save, 
  Users, 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Trash2, 
  Plus, 
  X,
  Loader2,
  Bell
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

// === UTILITIES ===
const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

const useAlert = () => {
  const [alert, setAlert] = useState({ message: "", isVisible: false });
  const showAlert = useCallback((msg: string) => setAlert({ message: msg, isVisible: true }), []);
  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
  return { alert, showAlert, hideAlert };
};

const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={clsx(
        "fixed top-6 right-6 z-[100] min-w-[340px] rounded-2xl border p-5 shadow-2xl backdrop-blur-xl font-medium tracking-tight",
        isSuccess 
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
          : "border-red-500/30 bg-red-500/10 text-red-400"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="hover:opacity-60 text-lg font-bold">✕</button>
      </div>
    </motion.div>
  );
};

const Card = ({ children, title, icon: Icon, className = "" }: any) => (
  <div className={clsx(
    "bg-zinc-900/40 border border-white/5 rounded-3xl relative overflow-hidden group hover:border-blue-500/20 transition-all duration-300",
    className
  )}>
    <div className="relative z-10">{children}</div>
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm text-white outline-none focus:border-blue-600/50 focus:bg-white/10 transition-all placeholder-zinc-600" 
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm text-white outline-none focus:border-blue-600/50 focus:bg-white/10 transition-all appearance-none cursor-pointer [&>option]:bg-zinc-900 [&>option]:text-white"
  />
);

// === INTERFACE ===
interface OrganizationItem {
  id: number;
  position: string;
  parentId: number | null;
  assignedEmployeeId: number | null;
  description?: string | null;
  schoolId: number;
  isActive: boolean;
  GuruTendik?: {
    id: number;
    nama: string;
    photoUrl?: string | null;
    jenisKelamin: string;
    role: string;
  } | null;
  Children?: OrganizationItem[];
}

const API_BASE_ORG = "https://be-school.kiraproject.id/organisasi";
const API_GURU_TENDIK = "https://be-school.kiraproject.id/guruTendik";

export default function EmployeeManager() {
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OrganizationItem | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const [form, setForm] = useState({
    position: "",
    parentId: "" as string | number,
    assignedEmployeeId: "" as string | number,
    description: "",
  });

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;
  const { alert, showAlert, hideAlert } = useAlert();

  const fetchOrganizations = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_ORG}?schoolId=${schoolId}`);
      const json = await res.json();
      if (json.success) {
        setOrganizations(json.data);
        const rootIds = json.data.map((item: OrganizationItem) => item.id);
        setExpandedIds(new Set(rootIds));
      }
    } catch (err: any) {
      showAlert(`Gagal memuat struktur organisasi`);
    } finally {
      setLoading(false);
    }
  }, [schoolId, showAlert]);

  const fetchEmployees = useCallback(async () => {
    if (!schoolId) return;
    try {
      const res = await fetch(`${API_GURU_TENDIK}?schoolId=${schoolId}`);
      const json = await res.json();
      if (json.success) setEmployees(json.data);
    } catch (err) {
      console.error(err);
    }
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) {
      fetchOrganizations();
      fetchEmployees();
    }
  }, [schoolId, fetchOrganizations, fetchEmployees]);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const flattenNodes = (nodes: OrganizationItem[]): OrganizationItem[] => {
    let result: OrganizationItem[] = [];
    nodes.forEach(node => {
      result.push(node);
      if (node.Children) result = result.concat(flattenNodes(node.Children));
    });
    return result;
  };

  const parentOptions = flattenNodes(organizations).filter(
    opt => !editingItem || opt.id !== editingItem.id
  );

  const renderTree = (items: OrganizationItem[], level = 0) => {
    return items.map(item => {
      const hasChildren = item.Children && item.Children.length > 0;
      const isExpanded = expandedIds.has(item.id);

      return (
        <React.Fragment key={item.id}>
          <div
            className={clsx(
              "group/item flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-6 py-5 hover:bg-white/10 transition-all backdrop-blur-sm mb-3 shadow-sm",
              level > 0 && "border-l-4 border-l-blue-600/30 ml-8"
            )}
            style={{ marginLeft: `${level * 28}px` }}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-8 flex justify-center">
                {hasChildren && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleExpand(item.id);
                    }}
                    className="text-zinc-500 hover:text-blue-400 transition p-2 rounded-lg hover:bg-white/5"
                  >
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                )}
              </div>

              <div className="h-12 w-12 rounded-2xl overflow-hidden bg-zinc-800 border border-white/10 flex-shrink-0 ring-1 ring-white/5">
                <img
                  src={item.GuruTendik?.photoUrl || "/placeholder-user.jpg"}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div 
                className="flex-1 cursor-pointer select-none" 
                onClick={() => hasChildren && toggleExpand(item.id)}
              >
                <h4 className="font-bold text-[17px] text-white tracking-tight leading-tight">{item.position}</h4>
                <p className="text-sm text-blue-400/90 font-medium mt-1">
                  {item.GuruTendik?.nama || "Posisi Kosong"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 opacity-70 group-hover/item:opacity-100 transition-opacity">
              <button 
                onClick={() => openModal(item)}
                className="p-3 rounded-xl hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {hasChildren && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {renderTree(item.Children!, level + 1)}
              </motion.div>
            )}
          </AnimatePresence>
        </React.Fragment>
      );
    });
  };

  const openModal = (item?: OrganizationItem) => {
    if (item) {
      setEditingItem(item);
      setForm({
        position: item.position,
        parentId: item.parentId ?? "",
        assignedEmployeeId: item.assignedEmployeeId ?? "",
        description: item.description ?? "",
      });
    } else {
      setEditingItem(null);
      setForm({ position: "", parentId: "", assignedEmployeeId: "", description: "" });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      schoolId,
      parentId: form.parentId ? Number(form.parentId) : null,
      assignedEmployeeId: form.assignedEmployeeId ? Number(form.assignedEmployeeId) : null,
    };

    try {
      const url = editingItem ? `${API_BASE_ORG}/${editingItem.id}` : API_BASE_ORG;
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showAlert("Struktur organisasi berhasil diperbarui");
        closeModal();
        fetchOrganizations();
      } else {
        showAlert("Gagal menyimpan perubahan");
      }
    } catch (err) {
      showAlert("Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus posisi ini beserta anaknya?")) return;
    try {
      await fetch(`${API_BASE_ORG}/${id}`, { method: "DELETE" });
      showAlert("Posisi berhasil dihapus");
      fetchOrganizations();
    } catch (err) {
      showAlert("Gagal menghapus posisi");
    }
  };

  return (
    <div className="pb-0">
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      <div className="space-y-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 mb-12 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3.5 mb-3">
              <Building2 size={12} className="text-blue-500" />
              <span className="text-[11px] font-black tracking-[0.45em] text-blue-500">Organizational Structure</span>
            </div>
            <h1 className="text-4xl uppercase font-black tracking-tighter text-white leading-none">
              Struktur <span className="text-blue-600">Organisasi</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium mt-2">Manajemen jabatan & penempatan personel</p>
          </div>

          <button
            type="button"
            onClick={() => openModal()}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all active:scale-95"
          >
            <Plus size={20} />
            Tambah Posisi
          </button>
        </header>

        {/* MAIN CARD */}
        <Card title="Struktur Organisasi Saat Ini" icon={Users} className="!bg-blue-950/5 !border-blue-800/15">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-6">
              <Loader2 className="h-14 w-14 text-blue-500 animate-spin" />
              <p className="text-zinc-500 text-base font-medium tracking-wide">Memuat struktur organisasi...</p>
            </div>
          ) : organizations.length > 0 ? (
            <div className="space-y-2">{renderTree(organizations)}</div>
          ) : (
            <div className="text-center py-32 bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm w-full mx-auto">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                <Bell size={40} className="text-zinc-600" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Belum Ada Anggota</h3>
              <p className="text-zinc-500">Tambahkan anggota untuk struktur organisasi.</p>
            </div>
          )}
        </Card>
      </div>

      {/* MODAL SIDE-OVER */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-end bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="w-full max-w-lg h-full bg-zinc-950 border-l border-white/8 p-10 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-white">
                    {editingItem ? "Edit Posisi" : "Posisi Baru"}
                  </h2>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-blue-500 font-black mt-2">
                    Manajemen Jabatan
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-zinc-400 hover:text-white transition"
                >
                  <X size={26} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 flex-1 overflow-y-auto pr-3 custom-scrollbar">
                <div className="space-y-2.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Nama Jabatan</label>
                  <Input
                    value={form.position}
                    onChange={e => setForm({ ...form, position: e.target.value })}
                    placeholder="Contoh: Kepala Sekolah / Wakakur"
                    required
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Atasan Langsung</label>
                  <Select
                    value={form.parentId}
                    onChange={e => setForm({ ...form, parentId: e.target.value })}
                  >
                    <option value="">── Posisi Root / Paling Atas ──</option>
                    {parentOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.position}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Penanggung Jawab</label>
                  <Select
                    value={form.assignedEmployeeId}
                    onChange={e => setForm({ ...form, assignedEmployeeId: e.target.value })}
                  >
                    <option value="">── Kosongkan Posisi ──</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nama}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="pt-10  bottom-0 bg-zinc-950 pb-6">
                  <button
                    disabled={loading}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save size={20} />
                    )}
                    {editingItem ? "Update Posisi" : "Tambah Posisi"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}