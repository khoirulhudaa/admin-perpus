import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Calendar, Edit, Image as ImageIcon, Loader, Plus, Save, Tag, Trash2, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const API_BASE = "https://be-school.kiraproject.id/pengumuman";

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

interface Announcement {
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

const DEFAULT_ANNOUNCEMENT: Announcement = {
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

const PengumumanModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  initialData: Announcement;
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
}) => {
  const [form, setForm] = useState<Announcement>(initialData);
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
      alert("Judul dan isi pengumuman wajib diisi");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("title", form.title.trim());
    formPayload.append("content", form.content.trim());
    formPayload.append("schoolId", form.schoolId.toString());
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
        <div className="p-10 border-b border-white/8 flex justify-between items-center  top-0 bg-[#0B1220] z-10">
          <div>
            <h3 className="text-4xl font-black tracking-tighter text-white">
              {initialData.id ? "Edit" : "Tambah"} <span className="text-blue-600">Pengumuman</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Informasi Penting Sekolah
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
              Judul Pengumuman *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="Contoh: Pengumuman Libur Semester Genap 2026"
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
                <option value="Umum">Umum</option>
                <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Pengumuman Dinas">Pengumuman Dinas</option>
                <option value="Lainnya">Lainnya</option>
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
              Isi Pengumuman *
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleInputChange}
              placeholder="Tuliskan isi pengumuman secara lengkap dan jelas..."
              rows={6}
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
          <div className=" bottom-0 left-0 right-0 bg-[#0B1220] pt-10 pb-6 border-t border-white/8 grid grid-cols-2 gap-6">
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
              className={`p-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
                loading
                  ? "bg-blue-800 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
              }`}
            >
              {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? "Menyimpan..." : initialData.id ? "Perbarui" : "Tambah"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default function PengumumanPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
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
      setAnnouncements(json.data);
    } catch (err: any) {
      showAlert(`Gagal memuat pengumuman: ${err.message}`);
      setAnnouncements([]);
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

      showAlert(editingItem ? "Pengumuman berhasil diperbarui" : "Pengumuman berhasil ditambahkan");
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

  const handleEdit = (item: Announcement) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus pengumuman ini?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      showAlert("Pengumuman berhasil dihapus");
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
            <Bell size={14} /> Pengumuman Management
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Pengumuman <span className="text-blue-600">Sekolah</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola informasi penting, kegiatan, dan pengumuman resmi</p>
        </div>

        <button
          onClick={openAddModal}
          disabled={loading}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50"
        >
          <Plus size={18} /> Tambah Pengumuman
        </button>
      </div>

      {loading && announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader className="animate-spin text-blue-500" size={48} />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
            Memuat pengumuman...
          </div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm w-full mx-auto">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <Bell size={40} className="text-zinc-600" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Belum Ada Pengumuman</h3>
          <p className="text-zinc-500">Tambahkan pengumuman penting untuk siswa, guru, dan orang tua.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {announcements.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: announcements.indexOf(item) * 0.05 }}
              className="group relative bg-white/[0.03] border border-white/8 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
            >
              {item.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="flex-shrink-0 px-3 py-1 bg-blue-600/10 text-blue-400 text-xs font-black rounded-full border border-blue-500/20 uppercase">
                    {item.category || "Umum"}
                  </span>
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

                <div className="flex gap-3 pt-4 border-t border-white/8">
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

      {/* Modal Pengumuman */}
      <PengumumanModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        initialData={editingItem || DEFAULT_ANNOUNCEMENT}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}