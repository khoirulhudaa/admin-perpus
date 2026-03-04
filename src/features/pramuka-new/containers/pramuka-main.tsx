import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Compass,
  Info,
  MapPin,
  Pen,
  Plus,
  Trash,
  UploadCloud,
  X
} from "lucide-react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

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
interface KegiatanPramuka {
  id: number;
  title: string;
  description: string;
  date: string;
  location?: string | null;
  category: string;
  imageUrl?: string | null;
  schoolId: number;
  isActive: boolean;
}

const DEFAULT_KEGIATAN: KegiatanPramuka = {
  id: 0,
  title: "",
  description: "",
  date: "",
  location: "",
  category: "Kegiatan Rutin",
  imageUrl: "",
  schoolId: 0,
  isActive: true,
};

const API_BASE = "https://be-school.kiraproject.id/pramuka";

export function Pramuka() {
  const [kegiatanList, setKegiatanList] = useState<KegiatanPramuka[]>([]);
  const [formData, setFormData] = useState<KegiatanPramuka>(DEFAULT_KEGIATAN);
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
      if (json.success) setKegiatanList(json.data);
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
      formPayload.append("title", formData.title.trim());
      formPayload.append("description", formData.description.trim());
      formPayload.append("date", formData.date);
      formPayload.append("schoolId", schoolId.toString());
      if (formData.location) formPayload.append("location", formData.location.trim());
      if (formData.category) formPayload.append("category", formData.category);
      
      // Menggunakan field 'imageUrl' sesuai kebutuhan multer di backend Pramuka Anda
      if (selectedFile) formPayload.append("imageUrl", selectedFile);

      const res = await fetch(editingId ? `${API_BASE}/${editingId}` : API_BASE, {
        method: editingId ? "PUT" : "POST",
        body: formPayload,
      });

      if (!res.ok) throw new Error("Gagal menyimpan data kegiatan");
      showAlert(editingId ? "Kegiatan berhasil diperbarui" : "Kegiatan baru berhasil ditambahkan");
      handleCloseModal();
      fetchData();
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus dokumentasi kegiatan ini?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      showAlert("Kegiatan telah dihapus");
      fetchData();
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: KegiatanPramuka) => {
    setFormData({ ...item });
    setPreviewUrl(item.imageUrl || null);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setFormData(DEFAULT_KEGIATAN);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(DEFAULT_KEGIATAN);
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
          <div className="flex items-center gap-2 mb-3 font-black text-amber-500 uppercase tracking-[0.4em] text-[10px]">
            <Compass size={14} />
            Scout Activities
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
            Kegiatan <span className="text-blue-700">Pramuka</span>
          </h1>
          <p className="text-white/40 text-sm font-medium italic text-balance max-w-lg">Dokumentasi latihan, perkemahan, dan pengabdian anggota pramuka.</p>
        </div>

        <button
          onClick={handleOpenModal}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
          disabled={loading}
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Catat Kegiatan
        </button>
      </header>

      {/* 3. CONTENT AREA */}
      <main className="min-h-[50vh] pt-10">
        {loading && !kegiatanList.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20 italic tracking-widest uppercase text-[10px]">
            <FaSpinner className="animate-spin mb-4" size={30} />
            Loading Logs...
          </div>
        ) : kegiatanList.length === 0 ? (
          <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-white/20 italic uppercase tracking-[0.5em] text-[10px]">
            Belum ada dokumentasi kegiatan
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kegiatanList.map((item) => (
              <div key={item.id} className="group relative bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-amber-500/40 transition-all duration-500 shadow-sm hover:shadow-amber-500/5">
                <div className="relative h-60 overflow-hidden bg-zinc-900">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" alt={item.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/5"><Compass size={40} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {item.category}
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter leading-tight">{item.title}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-widest italic">
                      <Calendar size={12} className="text-amber-500"/> {new Date(item.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric'})}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-widest italic">
                      <MapPin size={12} className="text-amber-500"/> {item.location || "Internal"}
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
            <Transition.Child as={Fragment} enter="transform transition duration-500 cubic-bezier(0,0,0.2,1)" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-500 cubic-bezier(0,0,0.2,1)" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full bg-[#0B1220] border-l border-white/10 p-10 flex flex-col shadow-2xl overflow-y-auto">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-2">
                    <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] block italic">Scout Registry</span>
                    <Dialog.Title className="text-4xl font-black uppercase tracking-tighter text-white">
                      {editingId ? "Perbarui" : "Tambah Data"}
                    </Dialog.Title>
                  </div>
                  <button onClick={handleCloseModal} className="h-12 w-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Field label="Judul Kegiatan">
                    <input name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500 transition-all text-sm" placeholder="Misal: LT I Penggalang" required />
                  </Field>

                  <div className="grid grid-cols-2 gap-6">
                    <Field label="Tanggal Pelaksanaan">
                      <input type="date" name="date" value={formData.date.split("T")[0] || ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500 transition-all text-sm" required />
                    </Field>
                    <Field label="Kategori">
                      <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500 transition-all text-sm appearance-none cursor-pointer">
                        {["Kegiatan Rutin", "Upacara", "Latihan", "Perkemahan", "Lainnya"].map(cat => (
                          <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Lokasi">
                    <input name="location" value={formData.location ?? ""} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500 transition-all text-sm" placeholder="Contoh: Bumi Perkemahan Cibubur" />
                  </Field>

                  <Field label="Laporan Singkat / Deskripsi">
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500 transition-all text-sm min-h-[140px] resize-none" placeholder="Tuliskan jalannya kegiatan dan hasil yang dicapai..." />
                  </Field>

                  <Field label="Lampiran Dokumentasi">
                    <div className="relative group border-2 border-dashed border-white/5 rounded-[2rem] p-12 text-center hover:bg-white/5 transition-all">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <UploadCloud size={32} className="mx-auto mb-4 text-white/20 group-hover:text-amber-500 transition-colors" />
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{selectedFile ? selectedFile.name : "Seret atau Klik untuk Upload Foto"}</p>
                    </div>
                  </Field>

                  {(previewUrl || formData.imageUrl) && (
                    <div className="rounded-3xl overflow-hidden border border-white/10 bg-black shadow-inner p-2">
                      <img src={previewUrl || formData.imageUrl || ""} className="w-full max-h-48 object-cover rounded-2xl" alt="Preview" />
                    </div>
                  )}

                  <div className="pt-8 flex gap-4">
                    <button type="button" onClick={handleCloseModal} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-[2] py-5 bg-amber-600 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-amber-500 transition-colors">
                      {loading ? <FaSpinner className="animate-spin" /> : <Compass size={16} />}
                      {editingId ? "Update Logs" : "Publish Kegiatan"}
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