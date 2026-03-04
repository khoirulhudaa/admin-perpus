import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Edit, FileText, Layers, Loader, Mail, Phone, Plus, Save, Trash2, Users, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const BASE_URL = "https://be-school.kiraproject.id/ppdb";

// ──────────────────────────────────────────────────────────────
// Utilities (tetap sama)
// ──────────────────────────────────────────────────────────────

const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

const apiFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

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
      className={clsx(
        "fixed top-6 right-6 z-[999999] rounded-2xl border p-5 shadow-2xl backdrop-blur-xl text-sm font-medium tracking-tight",
        isSuccess
          ? "border-blue-500/40 bg-blue-600/10 text-blue-100"
          : "border-red-500/40 bg-red-600/10 text-red-100"
      )}
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

// ──────────────────────────────────────────────────────────────
// AdmissionPathEditor – disesuaikan style saja
// ──────────────────────────────────────────────────────────────

interface PathItem {
  name: string;
  quota: string;
  description: string;
}

const AdmissionPathEditor = ({ paths, onChange }: { paths: PathItem[], onChange: (val: PathItem[]) => void }) => {
  const addPath = () => onChange([...paths, { name: "", quota: "", description: "" }]);
  
  const updatePath = (index: number, field: keyof PathItem, value: string) => {
    const newPaths = [...paths];
    newPaths[index][field] = value;
    onChange(newPaths);
  };

  const removePath = (index: number) => onChange(paths.filter((_, i) => i !== index));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers size={16} className="text-blue-500" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic">Jalur Pendaftaran</label>
        </div>
        <button 
          type="button" 
          onClick={addPath}
          className="text-[10px] font-black uppercase tracking-widest bg-blue-600/10 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-2xl hover:bg-blue-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus size={14} /> Tambah Jalur
        </button>
      </div>
      
      <div className="space-y-4">
        {paths.map((path, idx) => (
          <div key={idx} className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
            <button 
              type="button" 
              onClick={() => removePath(idx)}
              className="absolute -top-3 -right-3 bg-red-500/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
            >
              <X size={14} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-black">Nama Jalur</label>
                <input
                  placeholder="Zonasi / Prestasi / Afirmasi"
                  value={path.name}
                  onChange={(e) => updatePath(idx, "name", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-black">Kuota</label>
                <input
                  placeholder="50% / 120 Siswa"
                  value={path.quota}
                  onChange={(e) => updatePath(idx, "quota", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-black">Keterangan</label>
              <textarea
                placeholder="Syarat dan ketentuan jalur ini..."
                value={path.description}
                onChange={(e) => updatePath(idx, "description", e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:border-blue-500 outline-none resize-y transition-all"
              />
            </div>
          </div>
        ))}
        {paths.length === 0 && (
          <p className="text-zinc-600 text-sm italic text-center py-6 bg-white/03 border border-dashed border-white/10 rounded-2xl">
            Belum ada jalur pendaftaran khusus
          </p>
        )}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// ListEditor – disesuaikan style
// ──────────────────────────────────────────────────────────────

interface ListEditorProps {
  items: string[];
  onChange: (newList: string[]) => void;
  placeholder?: string;
  label: string;
}

const ListEditor: React.FC<ListEditorProps> = ({ items, onChange, placeholder, label }) => {
  const addItem = () => onChange([...items, ""]);
  const updateItem = (index: number, value: string) => {
    const copy = [...items];
    copy[index] = value;
    onChange(copy);
  };
  const deleteItem = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <FileText size={16} className="text-blue-500" />
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic">{label}</label>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 group">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 focus-within:border-blue-500/50 transition-all">
              <span className="text-[10px] font-black text-blue-500 mr-3 italic">{index + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={`${placeholder || "Item"} #${index + 1}`}
                className="flex-1 bg-transparent py-3.5 text-white text-sm outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => deleteItem(index)}
              className="p-3 bg-red-500/10 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
      >
        <Plus size={14} /> Tambah Persyaratan
      </button>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// Main Component – desain utama di-update
// ──────────────────────────────────────────────────────────────

const DEFAULT_FORM = {
  year: new Date().getFullYear(),
  description: "",
  startDate: "",
  endDate: "",
  requirements: [] as string[],
  admissionPaths: [] as PathItem[],
  quota: "",
  contactEmail: "",
  contactPhone: "",
};

function PPDBManager() {
  const { alert, showAlert, hideAlert } = useAlert();
  const schoolData = useSchool();
  const schoolId = schoolData?.data?.[0]?.id;

  const [config, setConfig] = useState<any>(null);
  const [formData, setFormData] = useState<any>(DEFAULT_FORM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchConfig = useCallback(async () => {
    if (!schoolId) return;

    setLoading(true);
    try {
      const data = await apiFetch(`${BASE_URL}?schoolId=${schoolId}`);
      if (data.success && data.data) {
        const latest = Array.isArray(data.data) ? data.data[0] : data.data;
        setConfig(latest);
      } else {
        setConfig(null);
      }
    } catch (err: any) {
      console.error("PPDB Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) fetchConfig();
  }, [schoolId, fetchConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return showAlert("ID sekolah tidak ditemukan");

    setLoading(true);
    try {
      const payload = {
        ...formData,
        schoolId,
        year: String(formData.year),
        requirements: formData.requirements.filter((r: string) => r.trim() !== ""),
        admissionPaths: formData.admissionPaths.filter((p: PathItem) => p.name.trim() !== ""),
        quota: formData.quota ? Number(formData.quota) : null,
      };

      const method = config?.id ? "PUT" : "POST";
      const url = config?.id ? `${BASE_URL}/${config.id}` : BASE_URL;

      const resData = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (resData.success) {
        showAlert("Berhasil menyimpan konfigurasi PPDB");
        setIsModalOpen(false);
        fetchConfig();
      }
    } catch (err: any) {
      showAlert(err.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    if (config) {
      setFormData({
        year: config.year,
        description: config.description || "",
        startDate: config.startDate ? config.startDate.split("T")[0] : "",
        endDate: config.endDate ? config.endDate.split("T")[0] : "",
        requirements: Array.isArray(config.requirements) ? config.requirements : [],
        admissionPaths: Array.isArray(config.admissionPaths) ? config.admissionPaths : [],
        quota: config.quota ?? "",
        contactEmail: config.contactEmail || "",
        contactPhone: config.contactPhone || "",
      });
    } else {
      setFormData({ ...DEFAULT_FORM, year: new Date().getFullYear() });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-0 lg:px-0 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 pb-10 border-b border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
              <Layers size={14} /> PPDB Administration
            </div>
            <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
              Pengaturan <span className="text-blue-600">PPDB</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium">Kelola periode, kuota, jalur & persyaratan siswa baru</p>
          </div>

          <button
            onClick={openModal}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
          >
            {config ? <Edit size={18} /> : <Plus size={18} />}
            {config ? "Edit Konfigurasi" : "Setup PPDB"}
          </button>
        </div>

        {loading && !config ? (
          <div className="flex flex-col items-center justify-center py-40 gap-5">
            <Loader className="animate-spin text-blue-500" size={48} />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
              Memuat konfigurasi PPDB...
            </div>
          </div>
        ) : !config ? (
          <div className="text-center py-32 bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <FileText size={40} className="text-zinc-600" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Belum Ada Konfigurasi PPDB</h3>
            <p className="text-zinc-500 max-w-md mx-auto">
              Silakan buat pengaturan baru untuk periode penerimaan siswa baru tahun ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/8 rounded-3xl p-10 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-4xl font-black tracking-tight text-white">
                    PPDB <span className="text-blue-600">{config.year}</span>
                  </h2>
                  <div className="px-5 py-1.5 bg-blue-600/10 text-blue-400 text-xs font-black rounded-full border border-blue-500/20 uppercase tracking-wider">
                    Aktif
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                      <Calendar size={14} /> Periode Pendaftaran
                    </div>
                    <p className="text-zinc-200 font-medium">
                      {config.startDate ? new Date(config.startDate).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '—'}
                      {' s/d '}
                      {config.endDate ? new Date(config.endDate).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '—'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                      <Users size={14} /> Total Kuota
                    </div>
                    <p className="text-3xl font-black text-blue-400">
                      {config.quota ? `${config.quota} Siswa` : "Tanpa Batas"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    <FileText size={14} /> Informasi Umum
                  </div>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                    {config.description || "Belum ada deskripsi..."}
                  </p>
                </div>
              </motion.div>

              {/* Jalur */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/[0.03] border border-white/8 rounded-3xl p-10 backdrop-blur-sm"
              >
                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                  <Layers size={20} className="text-blue-500" /> Jalur Pendaftaran
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {config.admissionPaths?.length > 0 ? (
                    config.admissionPaths.map((p: any, i: number) => (
                      <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-lg text-white">{p.name}</h4>
                          <span className="text-xs font-black bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full">
                            {p.quota}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">{p.description || "—"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-2 text-center text-zinc-600 italic py-10">
                      Tidak ada jalur khusus terdaftar
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/[0.03] border border-white/8 rounded-3xl p-8 backdrop-blur-sm"
              >
                <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                  <FileText size={18} className="text-blue-500" /> Persyaratan
                </h4>
                <ul className="space-y-4">
                  {config.requirements?.length > 0 ? (
                    config.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex gap-4 text-zinc-300 text-sm">
                        <span className="text-blue-500 font-black text-lg">{i+1}.</span>
                        {req}
                      </li>
                    ))
                  ) : (
                    <li className="text-zinc-600 italic">Belum ada persyaratan terdaftar</li>
                  )}
                </ul>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white/[0.03] border border-white/8 rounded-3xl p-8 backdrop-blur-sm"
              >
                <h4 className="text-xl font-black text-white mb-6">Kontak Resmi</h4>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-600/10 text-blue-400">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-black">Email</p>
                      <p className="text-zinc-200 font-medium break-all">{config.contactEmail || "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-600/10 text-blue-400">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-black">WhatsApp / Telepon</p>
                      <p className="text-zinc-200 font-medium">{config.contactPhone || "—"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Modal – diubah jadi lebih mirip sidebar feel meski pakai Dialog */}
        <Transition appear show={isModalOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-[999999]" onClose={() => setIsModalOpen(false)}>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-start justify-end">
                <Transition.Child
                  as={React.Fragment}
                  enter="transform transition ease-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in duration-200"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="w-full max-w-2xl h-full bg-[#0B1220] border-l border-white/10 shadow-2xl overflow-y-auto">
                    <div className="p-10 border-b border-white/8 flex justify-between items-center sticky top-0 bg-[#0B1220] z-10">
                      <div>
                        <Dialog.Title className="text-4xl font-black tracking-tighter text-white">
                          Konfigurasi <span className="text-blue-600">PPDB</span>
                        </Dialog.Title>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
                          Pengaturan Penerimaan Siswa Baru
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="p-4 rounded-2xl hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <X size={28} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-12 pb-20">
                      {/* Tahun & Kuota */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                            Tahun Ajaran
                          </label>
                          <input
                            type="text"
                            value={formData.year}
                            onChange={(e) => setFormData({...formData, year: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                            Total Kuota Siswa
                          </label>
                          <input
                            type="number"
                            value={formData.quota}
                            onChange={(e) => setFormData({...formData, quota: e.target.value})}
                            placeholder="Contoh: 360"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all font-mono"
                          />
                        </div>
                      </div>

                      {/* Deskripsi */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                          Deskripsi & Pengumuman
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={4}
                          placeholder="Informasi penting untuk calon siswa dan orang tua..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-y"
                        />
                      </div>

                      {/* Tanggal */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                            Tanggal Buka
                          </label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                            Tanggal Tutup
                          </label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert"
                          />
                        </div>
                      </div>

                      <hr className="border-white/8 my-8" />

                      <AdmissionPathEditor 
                        paths={formData.admissionPaths} 
                        onChange={(paths) => setFormData({...formData, admissionPaths: paths})} 
                      />

                      <hr className="border-white/8 my-8" />

                      <ListEditor
                        items={formData.requirements}
                        onChange={(reqs) => setFormData({ ...formData, requirements: reqs })}
                        label="Persyaratan Pendaftaran"
                        placeholder="Fotokopi Akta Kelahiran"
                      />

                      <hr className="border-white/8 my-8" />

                      {/* Kontak */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                            Email Resmi
                          </label>
                          <input
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                            placeholder="ppdb@sekolah.sch.id"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                            Nomor WhatsApp
                          </label>
                          <input
                            type="text"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                            placeholder="0812-3456-7890"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="sticky bottom-0 left-0 right-0 bg-[#0B1220] pt-10 pb-6 border-t border-white/8 grid grid-cols-2 gap-6">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="py-4 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className={`py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
                            loading
                              ? "bg-blue-900 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
                          }`}
                        >
                          {loading ? (
                            <Loader className="animate-spin" size={18} />
                          ) : (
                            <Save size={18} />
                          )}
                          {loading ? "Menyimpan..." : "Simpan Konfigurasi"}
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}

export default PPDBManager;