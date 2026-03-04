// import { useSchool } from "@/features/schools";
// import { AnimatePresence, motion } from "framer-motion";
// import { Edit, Save, Trash2, User, X } from "lucide-react";
// import React, { useCallback, useEffect, useState } from "react";
// import { Toaster, toast } from "sonner";

// // Types
// interface GuruTendikItem {
//   id?: number;
//   nama: string;
//   mapel?: string;
//   email?: string;
//   role: string;
//   jurusan?: string;
//   jenisKelamin: string;
//   photoUrl?: string;
// }

// // Base URL
// const BASE_URL = "https://be-school.kiraproject.id/guruTendik";

// // Dropdown Options
// const ROLE_OPTIONS = ["Guru", "Wakil Kepala Sekolah", "Ka. Subag. Tata Usaha", "Bendahara Keuangan", "Pengurus Barang", "S D M", "Laboran", "Staff Perpustakaan", "Penjaga Sekolah", "Tenaga Kebersihan", "Komite Sekolah", "Wakasek. Bidang Kurikulum", "Wakasek. Bidang Kesiswaan dan Humas", "Wakasek. Bidang Sarana dan Prasarana", "Staf Kesiswaan dan Humas", "Staf Bidang Kurikulum", "Staf Sarana dan Prasana", "Guru BK", "Pembina OSIS/Ekskul", "Dewan Guru", "Kepala Perpustakaan", "Kepala Laboratorium", "Wali Kelas", "Kepala Sekolah", "Kepala Tata Usaha", "Administrasi"];
// const JENIS_KELAMIN_OPTIONS = ["Laki-laki", "Perempuan"];

// // Modal Sidebar Right
// const GuruTendikModal = ({  
//   open,
//   onClose,
//   initialData,
//   onSave,
//   isNew,
// }: {
// }) => {
//   const [form, setForm] = useState<GuruTendikItem>({
//     nama: "",
//     role: ROLE_OPTIONS[0],
//     jenisKelamin: JENIS_KELAMIN_OPTIONS[0],
//     mapel: "",
//     jurusan: "",
//     email: "",
//     photoUrl: "",
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string>("");
//   const [saving, setSaving] = useState(false);

//   // ← Tambahkan ini
//   useEffect(() => {
//     if (open) {
//       setForm({
//         nama: initialData.nama || "",
//         role: initialData.role || ROLE_OPTIONS[0],
//         jenisKelamin: initialData.jenisKelamin || JENIS_KELAMIN_OPTIONS[0],
//         mapel: initialData.mapel || "",
//         jurusan: initialData.jurusan || "",
//         email: initialData.email || "",
//         photoUrl: initialData.photoUrl || "",
//       });
//       setPreview(initialData.photoUrl || "");
//       setSelectedFile(null); // reset file upload saat buka modal
//     }
//   }, [open, initialData]); // dependensi penting

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setSelectedFile(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setPreview(reader.result as string);
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!form.nama.trim() || !form.role || !form.jenisKelamin) {
//       toast.error("Nama, Role, dan Jenis Kelamin wajib diisi");
//       return;
//     }

//     setSaving(true);
//     try {
//       await onSave(form, selectedFile || undefined);
//       onClose();
//     } catch (err: any) {
//       toast.error("Gagal menyimpan: " + (err.message || "Unknown error"));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-[999999999999] bg-black/70"
//         >
//           <motion.div
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{ type: "spring", damping: 30, stiffness: 300 }}
//             className="absolute right-0 top-0 h-full w-full max-w-md bg-black/90 border-l border-white/10 shadow-2xl overflow-y-auto"
//           >
//             <div className="relative top-0 z-10 flex items-center justify-between border-b border-white/10 px-6 py-4">
//               <h2 className="text-xl font-semibold text-white">
//                 {isNew ? "Tambah Guru/Tendik" : "Edit Guru/Tendik"}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="rounded-full p-2 hover:bg-white/10 text-white/70 hover:text-white"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-6 space-y-6">
//               {/* Foto */}
//               <div className="flex items-center mb-10 gap-6">
//                 <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-blue-500/30 bg-gray-800">
//                   {preview ? (
//                     <img src={preview} alt="Preview" className="h-full w-full object-cover" />
//                   ) : (
//                     <div className="flex h-full w-full items-center justify-center text-gray-500">
//                       <User size={64} />
//                     </div>
//                   )}
//                 </div>
//                 <label className="cursor-pointer rounded-lg bg-blue-600/30 px-4 py-2 text-sm text-blue-300 hover:bg-blue-600/50">
//                   Upload Foto
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {/* Nama */}
//               <div>
//                 <label className="block text-sm font-medium text-white/80 mb-2">
//                   Nama Lengkap <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={form.nama}
//                   onChange={(e) => setForm({ ...form, nama: e.target.value })}
//                   className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
//                   required
//                 />
//               </div>

//               {/* Role */}
//               <div>
//                 <label className="block text-sm font-medium text-white/80 mb-2">
//                   Role/Jabatan <span className="text-red-400">*</span>
//                 </label>
//                 <select
//                   value={form.role}
//                   onChange={(e) => setForm({ ...form, role: e.target.value })}
//                   className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-blue-500/50 outline-none"
//                   required
//                 >
//                   {ROLE_OPTIONS.map((opt) => (
//                     <option key={opt} value={opt} className="bg-gray-900 text-white">
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Jenis Kelamin */}
//               <div>
//                 <label className="block text-sm font-medium text-white/80 mb-2">
//                   Jenis Kelamin <span className="text-red-400">*</span>
//                 </label>
//                 <select
//                   value={form.jenisKelamin}
//                   onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value })}
//                   className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-blue-500/50 outline-none"
//                   required
//                 >
//                   {JENIS_KELAMIN_OPTIONS.map((opt) => (
//                     <option key={opt} value={opt} className="bg-gray-900 text-white">
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Mata Pelajaran */}
//               <div>
//                 <label className="block text-sm font-medium text-white/80 mb-2">
//                   Mata Pelajaran (jika guru)
//                 </label>
//                 <input
//                   type="text"
//                   value={form.mapel || ""}
//                   onChange={(e) => setForm({ ...form, mapel: e.target.value })}
//                   className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
//                 />
//               </div>

//               {/* Jurusan */}
//               <div>
//                 <label className="block text-sm font-medium text-white/80 mb-2">
//                   Jurusan/Program Keahlian
//                 </label>
//                 <input
//                   type="text"
//                   value={form.jurusan || ""}
//                   onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
//                   className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-white/80 mb-2">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={form.email || ""}
//                   onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
//                 />
//               </div>

//               <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
//                   disabled={saving}
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
//                 >
//                   <Save size={18} />
//                   {saving ? "Menyimpan..." : "Simpan"}
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// // Main Component
// export function FormGuruTendik() {
//   const [data, setData] = useState<GuruTendikItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<GuruTendikItem | null>(null);
//   const [search, setSearch] = useState("");

//   const school = useSchool();
//   const SCHOOL_ID = school?.data?.[0]?.id;

//   const fetchData = useCallback(async () => {
//     if (!SCHOOL_ID) return;

//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//         },
//       });

//       const json = await res.json();
//       if (json.success) {
//         setData(json.data || []);
//       } else {
//         toast.error(json.message || "Gagal memuat data");
//       }
//     } catch (err) {
//       toast.error("Gagal memuat data guru/tendik");
//     } finally {
//       setLoading(false);
//     }
//   }, [SCHOOL_ID]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleSave = async (form: Partial<GuruTendikItem>, file?: File) => {
//     const formData = new FormData();
//     formData.append("nama", form.nama || "");
//     formData.append("role", form.role || "");
//     formData.append("jenisKelamin", form.jenisKelamin || "");
//     if (form.mapel) formData.append("mapel", form.mapel);
//     if (form.jurusan) formData.append("jurusan", form.jurusan);
//     if (form.email) formData.append("email", form.email);
//     if (SCHOOL_ID) formData.append("schoolId", SCHOOL_ID.toString());

//     if (file) {
//       formData.append("photo", file);
//     }

//     const url = selectedItem?.id ? `${BASE_URL}/${selectedItem.id}` : BASE_URL;
//     const method = selectedItem?.id ? "PUT" : "POST";

//     const res = await fetch(url, {
//       method,
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//       },
//       body: formData,
//     });

//     const json = await res.json();
//     if (!res.ok || !json.success) {
//       throw new Error(json.message || "Gagal menyimpan");
//     }

//     toast.success(selectedItem ? "Berhasil diperbarui" : "Berhasil ditambahkan");
//     fetchData();
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Yakin ingin menghapus data ini?")) return;

//     try {
//       const res = await fetch(`${BASE_URL}/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//         },
//       });

//       const json = await res.json();
//       if (res.ok && json.success) {
//         toast.success("Berhasil dihapus");
//         fetchData();
//       } else {
//         toast.error(json.message || "Gagal menghapus");
//       }
//     } catch (err) {
//       toast.error("Error menghapus data");
//     }
//   };

//   const filtered = data.filter((item) =>
//     item.nama.toLowerCase().includes(search.toLowerCase())
//   );

//   const Icon = ({ label }: { label: string }) => (
//     <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
//         {label}
//     </span>
//     );
//     const ISave = () => <Icon label="💾" />;

//   return (
//     <div className="min-h-screen">
//       <Toaster position="top-right" richColors />

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
//         <div className="w-full flex items-center gap-3 mt-4">
//           <button
//             onClick={() => {
//               setSelectedItem(null);
//               setModalOpen(true);
//             }}
//             className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg text-sm disabled:opacity-60 transition-colors"
//           >
//             <ISave /> 
//             <p className="w-max text-[13px] font-semibold">
//               Tambah Data
//             </p>
//           </button>
//           <input
//             type="text"
//             placeholder="Cari nama guru / tenaga pendidik..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full px-4 h-[37px] bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 outline-none"
//           />
//         </div>
//       </div>

//       {/* Loading */}
//       {loading ? (
//         <div className="flex justify-center py-16">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center py-16 text-gray-400">
//           {search ? "Tidak ditemukan data yang sesuai" : "Belum ada data guru/tendik"}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 bg-white/5 rounded-lg p-5">
//           {filtered.map((item) => (
//             <motion.div
//               key={item.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-black/30 rounded-xl p-4 border border-white/10 overflow-hidden hover:border-blue-500/30 transition-all group"
//               >
//               <h3 className="text-lg font-semibold text-white truncate">{item.nama}</h3>
//               <p className="text-sm text-blue-400 mt-1 mb-4">{item.role} | {item.email ? item.email : '-'}</p>

//               <div className="relative h-48 bg-black/30 flex items-center justify-center">
//                 {item.photoUrl ? (
//                   <img
//                     src={item.photoUrl}
//                     alt={item.nama}
//                     className="h-full w-full rounded-lg object-contain"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).style.display = "none";
//                     }}
//                   />
//                 ) : null}
//               </div>

//               <div className="mt-4 gap-4 grid grid-cols-2 text-sm text-gray-300">
//                 <div>
//                   {item.mapel && (
//                     <p className="rounded-md py-1.5 px-2 w-full flex justify-between text-xs text-white ">
//                       {item.mapel}
//                     </p>
//                   )}
//                   {item.jurusan && (
//                     <p className="rounded-md py-1.5 px-2 w-full flex justify-between text-xs text-white ">
//                       {item.jurusan}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-2 justify-between w-full grid grid-cols-2 gap-3">
//                 <button
//                   onClick={() => {
//                     setSelectedItem(item);
//                     setModalOpen(true);
//                   }}
//                   className="p-2 py-3 rounded-lg flex items-center justify-center bg-blue-900/30 hover:bg-blue-800/50 text-blue-300"
//                   title="Edit"
//                 >
//                   <Edit size={18} />
//                 </button>
//                 <button
//                   onClick={() => handleDelete(item.id!)}
//                   className="p-2 py-3 rounded-lg flex items-center justify-center bg-red-900/70 hover:bg-red-800/50 text-red-300"
//                   title="Hapus"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Modal Sidebar */}
//       <GuruTendikModal
//         open={modalOpen}
//         onClose={() => {
//           setModalOpen(false);
//           setSelectedItem(null);
//         }}
//         initialData={selectedItem || {}}
//         onSave={handleSave}
//         isNew={!selectedItem}
//       />
//     </div>
//   );
// }



import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Edit,
  Mail,
  Plus,
  Save,
  Search,
  Trash2,
  User,
  UserPlus,
  X
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import debounce from "lodash/debounce"; 

// --- Types & Constants ---
interface GuruTendikItem {
  id?: number;
  nama: string;
  mapel?: string;
  email?: string;
  role: string;
  jurusan?: string;
  jenisKelamin: string;
  photoUrl?: string;
}

const BASE_URL = "https://be-school.kiraproject.id/guruTendik";

const ROLE_OPTIONS = [
  "Guru", "Wakil Kepala Sekolah", "Ka. Subag. Tata Usaha", "Bendahara Keuangan", 
  "Pengurus Barang", "S D M", "Laboran", "Staff Perpustakaan", "Penjaga Sekolah", 
  "Tenaga Kebersihan", "Komite Sekolah", "Wakasek. Bidang Kurikulum", 
  "Wakasek. Bidang Kesiswaan dan Humas", "Wakasek. Bidang Sarana dan Prasarana", 
  "Staf Kesiswaan dan Humas", "Staf Bidang Kurikulum", "Staf Sarana dan Prasana", 
  "Guru BK", "Pembina OSIS/Ekskul", "Dewan Guru", "Kepala Perpustakaan", 
  "Kepala Laboratorium", "Wali Kelas", "Kepala Sekolah", "Kepala Tata Usaha", "Administrasi"
];

const JENIS_KELAMIN_OPTIONS = ["Laki-laki", "Perempuan"];

// --- Sub-Component: Modal Sidebar ---
const GuruTendikModal = ({
  open,
  onClose,
  initialData,
  onSave,
  isNew,
}: {
  open: boolean;
  onClose: () => void;
  initialData: any;
  onSave: (form: Partial<GuruTendikItem>, file?: File) => Promise<void>;
  isNew: boolean;
}) => {
  const [form, setForm] = useState<GuruTendikItem>({
    nama: "",
    role: ROLE_OPTIONS[0],
    jenisKelamin: JENIS_KELAMIN_OPTIONS[0],
    mapel: "",
    jurusan: "",
    email: "",
    photoUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        nama: initialData.nama || "",
        role: initialData.role || ROLE_OPTIONS[0],
        jenisKelamin: initialData.jenisKelamin || JENIS_KELAMIN_OPTIONS[0],
        mapel: initialData.mapel || "",
        jurusan: initialData.jurusan || "",
        email: initialData.email || "",
        photoUrl: initialData.photoUrl || "",
      });
      setPreview(initialData.photoUrl || "");
      setSelectedFile(null);
    }
  }, [open, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form, selectedFile || undefined);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[10000] h-full w-full max-w-lg bg-[#0B1220] border-l border-white/10 shadow-2xl flex flex-col"
          >
            <div className="border-b p-8 border-white/8 flex justify-between pb-8 mb-8 items-center bg-[#0B1220] z-10">
              <div>
                <h3 className="text-4xl font-black tracking-tighter text-white">
                  {isNew ? "Tambah Tendik" : "Perbarui Profile"}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1">
                  Guru & Tenaga Kependidikan
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-2 border-dashed border-white/20 group-hover:border-blue-500 transition-all flex items-center justify-center bg-white/5">
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <User size={48} className="text-white/10" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-blue-500 shadow-xl border-4 border-[#0B1220] transition-transform hover:scale-110">
                    <Plus size={20} className="text-white" />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest italic">Personal Avatar</p>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Nama Lengkap</label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Contoh: Dr. Budi Santoso"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Jabatan</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0B1220]">{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Gender</label>
                    <select
                      value={form.jenisKelamin}
                      onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                      {JENIS_KELAMIN_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0B1220]">{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Email Address</label>
                  <input
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@sekolah.sch.id"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Mapel</label>
                    <input
                      type="text"
                      value={form.mapel || ""}
                      onChange={(e) => setForm({ ...form, mapel: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Jurusan</label>
                    <input
                      type="text"
                      value={form.jurusan || ""}
                      onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-white/10 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? "Processing..." : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main Component ---
export function FormGuruTendik() {
  const [data, setData] = useState<GuruTendikItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GuruTendikItem | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const school = useSchool();
  const SCHOOL_ID = school?.data?.[0]?.id;

  const fetchData = useCallback(async () => {
    if (!SCHOOL_ID) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`);
      const json = await res.json();
      if (json.success) setData(json.data || []);
    } catch (err) {
      toast.error("Network Error");
    } finally {
      setLoading(false);
    }
  }, [SCHOOL_ID]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  // 3. Handler saat input berubah
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value); // Update teks di kolom input langsung (biar tidak lag)
    debouncedSetSearch(value); // Tunda pemfilteran selama 500ms
  };

  // 4. Cleanup saat komponen unmount
  useEffect(() => {
    return () => debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  const handleSave = async (form: Partial<GuruTendikItem>, file?: File) => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value.toString());
    });
    if (SCHOOL_ID) formData.append("schoolId", SCHOOL_ID.toString());
    if (file) formData.append("photo", file);

    const url = selectedItem?.id ? `${BASE_URL}/${selectedItem.id}` : BASE_URL;
    const method = selectedItem?.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message);

    toast.success("Database Updated Successfully");
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this personnel record?")) return;
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (res.ok) {
        toast.success("Record Removed");
        fetchData();
      }
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    item.role.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      <Toaster position="top-right" richColors />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3 font-black text-blue-500 uppercase tracking-[0.4em] text-[10px]">
            <Briefcase size={14} /> Personnel Directory
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">
            Guru <span className="text-blue-700">& Tendik</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Pegawai sekolah</p>
        </div>

        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Cari nama atau role..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20 text-sm"
            />
          </div>
          <button
            onClick={() => { setSelectedItem(null); setModalOpen(true); }}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
          >
            <UserPlus size={20} />
            <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">Add Data</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 opacity-20 italic">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest">Accessing Records...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-40 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
          <p className="text-white/20 italic text-lg font-medium">No personnel records found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-6 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-500"
            >
              <div className="flex items-start gap-6">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <div className="h-full w-full rounded-3xl overflow-hidden bg-black/40 border border-white/10 transition-all duration-700">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt={item.nama} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white/5"><User size={32} /></div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-[8px] font-black text-white px-2 py-1 rounded-md uppercase italic shadow-lg">
                    {item.jenisKelamin === "Laki-laki" ? "Male" : "Female"}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 italic truncate">{item.role}</div>
                  <h3 className="text-xl font-bold text-white truncate leading-tight group-hover:text-blue-400 transition-colors">{item.nama}</h3>
                  <div className="flex items-center gap-2 mt-3 text-white/30 group-hover:text-white/60 transition-colors">
                    <Mail size={12} />
                    <span className="text-xs truncate italic">{item.email || "no-email@id"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-2xl">
                    <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Expertise</div>
                    <div className="text-[11px] text-white/80 font-bold truncate uppercase tracking-tighter italic">
                      {item.mapel || "General"}
                    </div>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl">
                    <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Department</div>
                    <div className="text-[11px] text-white/80 font-bold truncate uppercase tracking-tighter italic">
                      {item.jurusan || "Core"}
                    </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => { setSelectedItem(item); setModalOpen(true); }}
                  className="flex-1 py-4 bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 text-white/40 rounded-2xl flex items-center justify-center gap-2 transition-all group/btn"
                >
                  <Edit size={16} className="group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id!)}
                  className="w-14 py-4 bg-white/5 hover:bg-red-600/20 text-white/20 hover:text-red-500 rounded-2xl flex items-center justify-center transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <GuruTendikModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedItem(null); }}
        initialData={selectedItem || {}}
        onSave={handleSave}
        isNew={!selectedItem}
      />
    </div>
  );
}