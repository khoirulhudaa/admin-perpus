
// import { useSchool } from "@/features/schools";
// import { AnimatePresence, motion } from "framer-motion";
// import { Edit, Trash2, X } from "lucide-react";
// import { useCallback, useEffect, useMemo, useState } from "react";

// // Theme tetap sama seperti kode asli kamu
// const THEME = {
//   primary: "#065F46",
//   primaryText: "#F9FAFB",
//   accent: "#10B981",
//   bg: "#0B1220",
//   surface: "#111827",
//   surfaceText: "#E5E7EB",
//   subtle: "#1F2937",
//   border: "#374151",
//   pill: "#059669",
//   pillWarn: "#F59E0B",
//   pillErr: "#EF4444",
// };

// const BASE_URL = "https://be-school.kiraproject.id";

// // Alert Component (mirip referensi)
// interface AlertState {
//   message: string;
//   isVisible: boolean;
//   type?: "success" | "error";
// }

// const Alert: React.FC<{ alert: AlertState; onClose: () => void }> = ({ alert, onClose }) => {
//   if (!alert.isVisible) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={`mb-6 rounded-xl border p-4 text-sm flex items-start justify-between ${
//         alert.type === "success"
//           ? "border-green-500/30 bg-green-500/10 text-green-300"
//           : "border-red-500/30 bg-red-500/10 text-red-300"
//       }`}
//     >
//       <div>{alert.message}</div>
//       <button onClick={onClose} className="ml-3 text-lg">&times;</button>
//     </motion.div>
//   );
// };

// // Input & TextArea sederhana
// const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
//   <input
//     className={`w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white outline-none focus:border-blue-500/50 ${className}`}
//     {...props}
//   />
// );

// const TextArea = ({ className = "", ...props }: any) => (
//   <textarea
//     className={`w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white outline-none focus:border-blue-500/50 resize-y min-h-[100px] ${className}`}
//     {...props}
//   />
// );

// // Status Pill (dipertahankan)
// const StatusPill = ({ active }: { active: boolean }) => (
//   <span
//     className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
//       active ? "bg-blue-500/20 text-blue-300" : "bg-red-500/20 text-red-300"
//     }`}
//   >
//     {active ? "Aktif" : "Nonaktif"}
//   </span>
// );

// // Sidebar (dipertahankan hampir sama)
// const SidebarItem = ({ active, onClick, label, count }: any) => (
//   <button
//     onClick={onClick}
//     className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center justify-between text-sm transition ${
//       active
//         ? "bg-blue-600/20 border border-blue-500/40 text-blue-300"
//         : "hover:bg-white/5 border border-white/30 text-white/80"
//     }`}
//   >
//     <span>{label}</span>
//     {count !== undefined && (
//       <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{count}</span>
//     )}
//   </button>
// );

// const AdminSidebar = ({ active, setActive, counts }: any) => {
//   const items = [
//     { key: "overview", label: "Overview" },
//     { key: "internal", label: "Layanan Internal", count: counts.internal },
//     { key: "publik", label: "Layanan Publik", count: counts.publik },
//   ];

//   return (
//     <aside className="w-full grid grid-cols-3 gap-4 bg-white/5 uppercase border border-white/30 rounded-xl py-6 mt-4 px-6">
//       {items.map((item) => (
//         <SidebarItem
//           key={item.key}
//           active={active === item.key}
//           onClick={() => setActive(item.key)}
//           label={item.label}
//           count={item.count}
//         />
//       ))}
//     </aside>
//   );
// };

// // Table sederhana
// const Table = ({ columns, data, renderActions }: any) => (
//   <div className="overflow-x-auto rounded-xl border border-white/10">
//     <table className="min-w-full text-sm">
//       <thead className="bg-white/5">
//         <tr>
//           {columns.map((c: any) => (
//             <th key={c.key} className="px-5 py-3 text-left font-medium text-white/80">
//               {c.label}
//             </th>
//           ))}
//           <th className="px-5 py-3 text-left font-medium text-white/80">Aksi</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.length === 0 ? (
//           <tr>
//             <td colSpan={columns.length + 1} className="py-12 text-center text-white/50">
//               Tidak ada data layanan
//             </td>
//           </tr>
//         ) : (
//           data.map((row: any) => (
//             <tr key={row.id} className="border-t border-white/5 hover:bg-white/5">
//               {columns.map((c: any) => (
//                 <td key={c.key} className="px-5 py-4 text-white/90">
//                   {c.key === "isActive" ? (
//                     <StatusPill active={row.isActive} />
//                   ) : (
//                     row[c.key] || "-"
//                   )}
//                 </td>
//               ))}
//               <td className="px-5 py-4">
//                 {renderActions && renderActions(row)}
//               </td>
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   </div>
// );

// // Modal Form Create/Update (mirip referensi VisiMisi)
// const ServiceModal = ({ open, onClose, title, onSubmit, initialData = {}, type }: any) => {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     type: type || "internal",
//     atasNama: "",
//     noTelephone: "",
//     email: "",
//   });

//   useEffect(() => {
//     if (open) {
//       setForm({
//         title: initialData.title || "",
//         description: initialData.description || "",
//         type: initialData.type || type || "internal",
//         atasNama: initialData.atasNama || "",
//         noTelephone: initialData.noTelephone || "",
//         email: initialData.email || "",
//       });
//     }
//   }, [open]);   // ← HANYA bergantung pada open, BUKAN initialData atau type

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     onSubmit(form);
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed top-0 right-0 inset-0 bg-black/70 flex items-center justify-center z-[9999999999999] p-4">
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.95, opacity: 0 }}
//         className="fixed top-0 right-0 bg-black/80 overflow-auto h-screen w-full max-w-lg border border-white/10"
//       >
//         <div className="p-6 border-b border-white/10 flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-white">{title}</h2>
//           <button onClick={onClose} className="text-white/60 hover:text-white">
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-5">
//           <div>
//             <label className="block text-sm text-white/70 mb-1.5">Judul Layanan *</label>
//             <Input
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               required
//               placeholder="Contoh: Pengajuan Surat Keterangan"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-white/70 mb-1.5">Deskripsi *</label>
//             <TextArea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               required
//               placeholder="Jelaskan layanan ini secara singkat..."
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div>
//               <label className="block text-sm text-white/70 mb-1.5">Atas Nama</label>
//               <Input
//                 name="atasNama"
//                 value={form.atasNama}
//                 onChange={handleChange}
//                 placeholder="Nama penanggung jawab"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-white/70 mb-1.5">No. Telepon</label>
//               <Input
//                 name="noTelephone"
//                 value={form.noTelephone}
//                 onChange={handleChange}
//                 placeholder="0812-3456-7890"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm text-white/70 mb-1.5">Email</label>
//             <Input
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="contoh@sekolah.sch.id"
//             />
//           </div>

//           <div className="w-full grid grid-cols-2 gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-5 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
//             >
//               Simpan
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// // Komponen utama
// export function LayananMain() {
//   const [active, setActive] = useState("overview");
//   const [services, setServices] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false, type: "success" });

//   const [addModal, setAddModal] = useState(false);
//   const [editModal, setEditModal] = useState(false);
//   const [selectedService, setSelectedService] = useState<any>(null);

//   const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
//     setAlert({ message: msg, isVisible: true, type });
//     setTimeout(() => setAlert({ message: "", isVisible: false, type }), 5000);
//   }, []);

  
//   const dataSchool: any = useSchool(); // Ganti sesuai kebutuhan, bisa dari context/hook nanti
//   const SCHOOL_ID = dataSchool?.data?.[0].id

//   const fetchServices = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/layanan?schoolId=${SCHOOL_ID}`);
//       if (!res.ok) throw new Error("Gagal memuat layanan");

//       const json = await res.json();
//       if (json.success) {
//         setServices(json.data || []);
//       } else {
//         throw new Error(json.message || "Response tidak valid");
//       }
//     } catch (err: any) {
//       showAlert("Gagal memuat data layanan: " + err.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [showAlert]);

//   useEffect(() => {
//     fetchServices();
//   }, [fetchServices]);

//   const handleCreate = async (form: any) => {
//     try {
//       const res = await fetch(`${BASE_URL}/layanan`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...form, schoolId: SCHOOL_ID }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Gagal menambah layanan");
//       }

//       showAlert("Layanan berhasil ditambahkan!");
//       setAddModal(false);
//       fetchServices();
//     } catch (err: any) {
//       showAlert(err.message, "error");
//     }
//   };

//   const handleUpdate = async (form: any) => {
//     if (!selectedService?.id) return;

//     try {
//       const res = await fetch(`${BASE_URL}/layanan/${selectedService.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Gagal memperbarui layanan");
//       }

//       showAlert("Layanan berhasil diperbarui!");
//       setEditModal(false);
//       setSelectedService(null);
//       fetchServices();
//     } catch (err: any) {
//       showAlert(err.message, "error");
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Yakin ingin menghapus layanan ini? (soft delete)")) return;

//     try {
//       const res = await fetch(`${BASE_URL}/layanan/${id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) throw new Error("Gagal menghapus layanan");

//       showAlert("Layanan berhasil dihapus (soft delete)");
//       fetchServices();
//     } catch (err: any) {
//       showAlert(err.message, "error");
//     }
//   };

//   const internalServices = services.filter((s) => s.type === "internal");
//   const publikServices = services.filter((s) => s.type === "publik");

//   const counts = useMemo(
//     () => ({
//       internal: internalServices.length,
//       publik: publikServices.length,
//     }),
//     [services]
//   );

//   const columns = [
//     { key: "title", label: "Judul Layanan" },
//     { key: "atasNama", label: "Atas Nama" },
//     { key: "noTelephone", label: "Telepon" },
//     { key: "email", label: "Email" },
//     { key: "isActive", label: "Status" },
//   ];

//   const actions = (row: any) => (
//     <div className="flex gap-2">
//       <button
//         onClick={() => {
//           setSelectedService(row);
//           setEditModal(true);
//         }}
//         className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300"
//         title="Edit"
//       >
//         <Edit size={16} />
//       </button>
//       <button
//         onClick={() => handleDelete(row.id)}
//         className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300"
//         title="Hapus"
//       >
//         <Trash2 size={16} />
//       </button>
//     </div>
//   );

//   return (
//     <div className="min-h-screen" style={{ background: THEME.bg }}>
//       <AdminSidebar active={active} setActive={setActive} counts={counts} />

//       <main className="overflow-auto">
//         <AnimatePresence>
//           {alert.isVisible && <Alert alert={alert} onClose={() => setAlert({ ...alert, isVisible: false })} />}
//         </AnimatePresence>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="space-y-3 bg-white/5 uppercase border border-white/30 rounded-xl py-6 mt-4 px-6">
//             {active === "overview" && (
//               <div className="grid md:grid-cols-3 gap-6">
//                 <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10">
//                   <div className="text-sm text-white mb-1">Total Layanan</div>
//                   <div className="text-3xl font-bold text-blue-400">{services.length}</div>
//                 </div>
//                 <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10">
//                   <div className="text-sm text-white mb-1">Layanan Internal</div>
//                   <div className="text-3xl font-bold text-blue-400">{counts.internal}</div>
//                 </div>
//                 <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10">
//                   <div className="text-sm text-white mb-1">Layanan Publik</div>
//                   <div className="text-3xl font-bold text-blue-400">{counts.publik}</div>
//                 </div>
//               </div>
//             )}

//             {(active === "internal" || active === "publik") && (
//               <>
//                 <div className="flex justify-between items-center mb-6">
//                   <h1 className="text-2xl font-bold text-white">
//                     {active === "internal" ? "Layanan Internal" : "Layanan Publik"}
//                   </h1>
//                   <button
//                     onClick={() => {
//                       setSelectedService(null);
//                       setAddModal(true);
//                     }}
//                     className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
//                   >
//                     + Tambah Layanan
//                   </button>
//                 </div>

//                 <Table
//                   columns={columns}
//                   data={active === "internal" ? internalServices : publikServices}
//                   renderActions={actions}
//                 />
//               </>
//             )}
//           </div>
//         )}
//       </main>

//       {/* Modal Tambah */}
//       <ServiceModal
//         open={addModal}
//         onClose={() => setAddModal(false)}
//         title={`Tambah Layanan ${active === "internal" ? "Internal" : "Publik"}`}
//         onSubmit={handleCreate}
//         type={active}
//       />

//       {/* Modal Edit */}
//       <ServiceModal
//         open={editModal}
//         onClose={() => setEditModal(false)}
//         title="Edit Layanan"
//         onSubmit={handleUpdate}
//         initialData={selectedService}
//         type={selectedService?.type}
//       />
//     </div>
//   );
// }



import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Plus, 
  Settings, 
  Trash2, 
  X, 
  Globe, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User,
  LayoutDashboard,
  Info
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import { FaSpinner } from "react-icons/fa";

// --- Utility & Alert Components ---
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

const BASE_URL = "https://be-school.kiraproject.id";

const Alert: React.FC<{ message: string; type: "success" | "error"; onClose: () => void }> = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={clsx(
      "flex items-center justify-between px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl w-full max-w-md",
      type === "success" ? "bg-emerald-600 border-emerald-400/50 text-white" : "bg-red-600 border-red-400/50 text-white"
    )}
  >
    <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest">
      <Info size={18} />
      {message}
    </div>
    <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={18} /></button>
  </motion.div>
);

// --- Form UI Helpers ---
const Field: React.FC<{ label?: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <div className={clsx("space-y-2", className)}>
    {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 italic">{label}</label>}
    {children}
  </div>
);

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm ${className}`}
    {...props}
  />
);

// --- Main Component ---
export function LayananMain() {
  const [activeTab, setActiveTab] = useState<"overview" | "internal" | "publik">("overview");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean; type: "success" | "error" }>({
    message: "", isVisible: false, type: "success"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, isVisible: true, type });
    setTimeout(() => setAlert(prev => ({ ...prev, isVisible: false })), 5000);
  }, []);

  const fetchServices = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/layanan?schoolId=${schoolId}`);
      const json = await res.json();
      if (json.success) setServices(json.data || []);
    } catch (err: any) {
      showAlert("Gagal memuat data layanan", "error");
    } finally {
      setLoading(false);
    }
  }, [schoolId, showAlert]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      type: selectedService?.id ? selectedService.type : activeTab,
      atasNama: formData.get("atasNama"),
      noTelephone: formData.get("noTelephone"),
      email: formData.get("email"),
      schoolId: schoolId,
    };

    try {
      const url = selectedService ? `${BASE_URL}/layanan/${selectedService.id}` : `${BASE_URL}/layanan`;
      const res = await fetch(url, {
        method: selectedService ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      showAlert(selectedService ? "Layanan diperbarui" : "Layanan berhasil ditambah");
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      showAlert(err.message, "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus layanan ini secara permanen?")) return;
    try {
      const res = await fetch(`${BASE_URL}/layanan/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showAlert("Layanan berhasil dihapus");
      fetchServices();
    } catch (err) {
      showAlert("Gagal menghapus", "error");
    }
  };

  const counts = useMemo(() => ({
    internal: services.filter(s => s.type === "internal").length,
    publik: services.filter(s => s.type === "publik").length,
  }), [services]);

  const filteredData = services.filter(s => s.type === activeTab);

  return (
    <div className="min-h-screen text-white space-y-0 pb-20">
      
      {/* 1. ALERT */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[999999] w-full flex justify-center px-4">
        <AnimatePresence>
          {alert.isVisible && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(prev => ({...prev, isVisible: false}))} />}
        </AnimatePresence>
      </div>

      {/* 2. HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3 font-black text-blue-500 uppercase tracking-[0.4em] text-[10px]">
            <ShieldCheck size={14} /> School Services
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
            Layanan <span className="text-blue-700">Sekolah</span>
          </h1>
          <p className="text-white/40 text-sm font-medium italic text-balance max-w-lg">Pusat informasi layanan administrasi internal dan keterbukaan informasi publik.</p>
        </div>

        {activeTab !== "overview" && (
          <button
            onClick={() => { setSelectedService(null); setIsModalOpen(true); }}
            className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white shadow-2xl"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Tambah Layanan
          </button>
        )}
      </header>

      <br />

      {/* 3. NAVIGATION TABS */}
      <div className="flex gap-4 p-2 bg-white/5 rounded-[2rem] w-full justify-between border border-white/10">
        {[
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "internal", label: "Internal", icon: ShieldCheck },
          { id: "publik", label: "Publik", icon: Globe },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={clsx(
              "w-full justify-center flex items-center gap-2 px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id ? "bg-blue-600 text-white shadow-lg" : "text-white/30 hover:text-white bg-white/5 hover:bg-white/5"
            )}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* 4. CONTENT AREA */}
      <main>
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-white/20 italic tracking-widest uppercase text-[10px]">
            <FaSpinner className="animate-spin mb-4" size={30} /> Loading Data...
          </div>
        ) : activeTab === "overview" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
             <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-10 space-y-4">
                <LayoutDashboard className="text-blue-500" size={32} />
                <div className="text-5xl font-black italic uppercase tracking-tighter">{services.length}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Total Semua Layanan</div>
             </div>
             <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-10 space-y-4">
                <ShieldCheck className="text-emerald-500" size={32} />
                <div className="text-5xl font-black italic uppercase tracking-tighter">{counts.internal}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Layanan Khusus Internal</div>
             </div>
             <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-10 space-y-4">
                <Globe className="text-purple-500" size={32} />
                <div className="text-5xl font-black italic uppercase tracking-tighter">{counts.publik}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Layanan Informasi Publik</div>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
            {filteredData.map((item) => (
              <div key={item.id} className="group relative bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 hover:border-blue-500/40 transition-all duration-500 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-14 w-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
                    {item.type === "internal" ? <ShieldCheck size={24} /> : <Globe size={24} />}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedService(item); setIsModalOpen(true); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Settings size={16}/></button>
                    <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-500/10 hover:bg-red-500 rounded-xl text-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
                
                <h3 className="text-xl font-black italic uppercase tracking-tighter leading-tight mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 italic mb-6 line-clamp-2">{item.description}</p>
                
                <div className="space-y-3 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/60 tracking-widest">
                    <User size={14} className="text-blue-500" /> {item.atasNama || "-"}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/60 tracking-widest">
                    <Phone size={14} className="text-blue-500" /> {item.noTelephone || "-"}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/60 tracking-widest lowercase">
                    <Mail size={14} className="text-blue-500" /> {item.email || "-"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 5. SLIDE-OVER MODAL */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[99999999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/95 backdrop-blur-xl" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 w-full max-w-xl">
            <Transition.Child as={Fragment} enter="transform transition duration-500 cubic-bezier(0,0,0.2,1)" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-500 cubic-bezier(0,0,0.2,1)" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full bg-zinc-950 border-l border-white/10 p-10 flex flex-col shadow-2xl overflow-y-auto">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-2">
                    <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] block italic">Service Registry</span>
                    <Dialog.Title className="text-4xl font-black italic uppercase tracking-tighter text-white">
                      {selectedService ? "Update" : "Add New"} <span className="text-white/30 block text-2xl">Layanan {activeTab}</span>
                    </Dialog.Title>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="h-12 w-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Field label="Nama Layanan">
                    <Input name="title" defaultValue={selectedService?.title} required placeholder="Contoh: Legalisir Ijazah" />
                  </Field>

                  <Field label="Deskripsi Layanan">
                    <textarea 
                      name="description" 
                      defaultValue={selectedService?.description}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm min-h-[120px] resize-none" 
                      placeholder="Jelaskan prosedur singkat layanan ini..."
                      required
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-6">
                    <Field label="Atas Nama (PIC)">
                      <Input name="atasNama" defaultValue={selectedService?.atasNama} placeholder="Nama Petugas" />
                    </Field>
                    <Field label="No. Telepon">
                      <Input name="noTelephone" defaultValue={selectedService?.noTelephone} placeholder="0812..." />
                    </Field>
                  </div>

                  <Field label="Email Layanan">
                    <Input name="email" type="email" defaultValue={selectedService?.email} placeholder="layanan@sekolah.sch.id" />
                  </Field>

                  <div className="pt-8 flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">Cancel</button>
                    <button type="submit" className="flex-[2] py-5 bg-blue-600 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-colors">
                      <ShieldCheck size={16} /> {selectedService ? "Simpan Perubahan" : "Publikasikan Layanan"}
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