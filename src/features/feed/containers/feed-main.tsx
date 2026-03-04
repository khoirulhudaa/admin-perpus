import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Save,
  Loader2,
  Edit,
  Trash2,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const BASE_URL = "https://be-school.kiraproject.id";

// === ALERT ===
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

// === INTERFACE ===
interface FeedItem {
  id: string;
  username: string;
  caption: string;
  postLink?: string;
  postDate: string;
  mediaType: "image" | "video";
  mediaUrl?: string;
  schoolId: number;
}

// === DEFAULT ===
const DEFAULT_FEED: FeedItem & { mediaFile: File | null } = {
  id: "",
  username: "",
  caption: "",
  postLink: "",
  postDate: new Date().toISOString().split("T")[0],
  mediaType: "image",
  mediaFile: null,
};

// === MODAL COMPONENT ===
const FeedModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
  loading,
  SCHOOL_ID
}: {
  open: boolean;
  onClose: () => void;
  initialData: typeof DEFAULT_FEED;
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
  SCHOOL_ID: any
}) => {
  const [form, setForm] = useState(initialData);

  useEffect(() => {
    if (open) setForm(initialData);
  }, [open, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, mediaFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username.trim()) {
      alert("Username Instagram wajib diisi");
      return;
    }

    if (!form.postDate) {
      alert("Tanggal posting wajib diisi");
      return;
    }

    // Tambahkan pengecekan schoolId (meskipun seharusnya sudah ada dari parent)
    if (!SCHOOL_ID) { // SCHOOL_ID harus di-pass dari parent component
      alert("School ID tidak ditemukan. Silakan refresh halaman.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("schoolId", SCHOOL_ID.toString()); // pastikan string
    formPayload.append("username", form.username.trim());
    formPayload.append("caption", form.caption.trim());
    formPayload.append("postLink", form.postLink.trim());
    formPayload.append("postDate", form.postDate); // pastikan format YYYY-MM-DD
    formPayload.append("mediaType", form.mediaType);

    if (form.mediaFile) {
      formPayload.append("media", form.mediaFile);
    }

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
        <div className="p-10 border-b border-white/8 flex justify-between items-center relative bg-[#0B1220] z-10">
          <div>
            <h3 className="text-4xl font-black tracking-tighter text-white">
              {initialData.id ? "Edit" : "Tambah"} <span className="text-blue-600">Feed IG</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Postingan Media Sosial Sekolah
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
          {/* Username */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Username Instagram *
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleInputChange}
              placeholder="@smkn13cirebon_official"
              required
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Caption Postingan
            </label>
            <textarea
              name="caption"
              value={form.caption}
              onChange={handleInputChange}
              placeholder="Tulis caption yang menarik di sini..."
              rows={5}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-y"
            />
          </div>

          {/* Link & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Link Postingan (opsional)
              </label>
              <input
                type="url"
                name="postLink"
                value={form.postLink}
                onChange={handleInputChange}
                placeholder="https://www.instagram.com/p/..."
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Tanggal Posting *
              </label>
              <input
                type="date"
                name="postDate"
                value={form.postDate}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          {/* Media Type */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Tipe Media
            </label>
            <select
              name="mediaType"
              value={form.mediaType}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
            >
              <option className="text-black" value="image">Gambar / Foto</option>
              <option className="text-black" value="video">Video / Reels</option>
            </select>
          </div>

          {/* Upload Media */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              {initialData.id ? "Ganti Media (opsional)" : "Upload Media *"}
            </label>
            <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/15 rounded-3xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all relative overflow-hidden group">
              {form.mediaFile ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <p className="text-white text-sm font-medium">File terpilih: {form.mediaFile.name}</p>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <ImageIcon className="text-blue-500" size={40} />
                  <span className="text-xs font-black uppercase tracking-wider text-white/70">
                    Upload {form.mediaType === "video" ? "Video" : "Gambar"}
                  </span>
                  <span className="text-[10px] text-zinc-500">(maks 10MB)</span>
                </div>
              )}

              <input
                type="file"
                accept={form.mediaType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="relative bg-[#0B1220] pt-10 pb-6 border-t border-white/8 grid grid-cols-2 gap-6">
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
                loading
                  ? "bg-blue-800 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? "Menyimpan..." : initialData.id ? "Update Feed" : "Tambah Feed"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

// === MAIN COMPONENT ===
export function FeedMain() {
  const { data: schoolData } = useSchool();
  const SCHOOL_ID = schoolData?.[0]?.id;

  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<typeof DEFAULT_FEED | null>(null);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const fetchFeeds = async () => {
    if (!SCHOOL_ID) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/feed?schoolId=${SCHOOL_ID}&isActive=true`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal mengambil data");
      setFeeds(json.data || []);
    } catch (err: any) {
      showAlert("Gagal memuat feed Instagram: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (SCHOOL_ID) fetchFeeds();
  }, [SCHOOL_ID]);

  const handleSubmit = async (formPayload: FormData) => {
    setLoading(true);
    try {
      const isEdit = !!editingItem?.id;
      const url = isEdit ? `${BASE_URL}/feed/${editingItem?.id}` : `${BASE_URL}/feed`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formPayload });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Gagal ${isEdit ? "memperbarui" : "menambahkan"} feed`);
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal");

      showAlert(isEdit ? "Feed berhasil diperbarui" : "Feed berhasil ditambahkan");
      setModalOpen(false);
      setEditingItem(null);
      await fetchFeeds();
    } catch (err: any) {
      showAlert(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus feed ini?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/feed/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal");
      showAlert("Feed berhasil dihapus");
      await fetchFeeds();
    } catch (err: any) {
      showAlert(err.message || "Gagal menghapus feed");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (feed?: FeedItem) => {
    if (feed) {
      setEditingItem({
        ...DEFAULT_FEED,
        id: feed.id,
        username: feed.username,
        caption: feed.caption,
        postLink: feed.postLink || "",
        postDate: new Date(feed.postDate).toISOString().split("T")[0],
        mediaType: feed.mediaType,
        mediaFile: null,
      });
    } else {
      setEditingItem(null);
    }
    setModalOpen(true);
  };

  const formatPostDate = (isoString: string): string => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    });
  };

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <ExternalLink size={14} /> Instagram Feed Management
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Feed <span className="text-blue-600">Instagram</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola postingan Instagram resmi sekolah</p>
        </div>

        <button
          onClick={() => openModal()}
          disabled={loading || !SCHOOL_ID}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50"
        >
          <Plus size={18} /> Tambah Feed
        </button>
      </div>

      {loading && feeds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
            Memuat feed Instagram...
          </div>
        </div>
      ) : feeds.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm w-full mx-auto">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <ExternalLink size={40} className="text-zinc-600" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Belum Ada Feed Instagram</h3>
          <p className="text-zinc-500">Tambahkan postingan Instagram resmi sekolah di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6">
          {feeds.map((feed, index) => (
            <motion.div
              key={feed.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white/[0.03] border border-white/8 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 shadow-lg"
            >
              {feed.mediaUrl ? (
                feed.mediaType === "video" ? (
                  <video
                    src={feed.mediaUrl}
                    controls
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={feed.mediaUrl}
                    alt={feed.caption || "Instagram post"}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )
              ) : (
                <div className="w-full aspect-square bg-zinc-900/50 flex items-center justify-center text-zinc-600">
                  <ImageIcon size={48} />
                </div>
              )}

              <div className="p-5 space-y-4">
                <p className="text-sm text-zinc-300 line-clamp-3 leading-relaxed">
                  {feed.caption || "Tanpa caption"}
                </p>

                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatPostDate(feed.postDate)}
                  </div>
                  <span className="text-blue-400">@{feed.username}</span>
                </div>

                <div className="flex gap-3 pt-3 border-t border-white/8">
                  <button
                    onClick={() => openModal(feed)}
                    disabled={loading}
                    className="flex-1 py-3 rounded-2xl bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(feed.id)}
                    disabled={loading}
                    className="flex-1 py-3 rounded-2xl bg-red-900/30 hover:bg-red-800/50 text-red-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>

                {feed.postLink && (
                  <a
                    href={feed.postLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-center py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-blue-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} /> Lihat di Instagram
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <FeedModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        SCHOOL_ID={SCHOOL_ID}
        initialData={editingItem || DEFAULT_FEED}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}