import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Edit, Loader, Plus, Trash2, Upload, User, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const BASE_URL = "https://be-school.kiraproject.id/alumni";

const THEME = {
  bg: "transparent",
  surface: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.1)",
  accent: "#2563eb",     // blue-600
  accentHover: "#3b82f6", // blue-500
  text: "#f8fafc",
  textMuted: "#64748b",
  danger: "#ef4444",
};

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

const AlumniModal = ({
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
  onSubmit: (formData: FormData) => Promise<void>;
  schoolId: number | null;
}) => {
  const [form, setForm] = useState({
    name: "",
    graduationYear: "",
    description: "",
    photo: null as File | null,
    preview: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData?.name || "",
        graduationYear: initialData?.graduationYear ? String(initialData.graduationYear) : "",
        description: initialData?.description || "",
        photo: null,
        preview: initialData?.photoUrl || "",
      });
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        photo: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.graduationYear.trim()) {
      alert("Nama dan Tahun Kelulusan wajib diisi");
      return;
    }

    if (!/^\d{4}$/.test(form.graduationYear)) {
      alert("Tahun kelulusan harus 4 digit (contoh: 2023)");
      return;
    }

    if (!schoolId) {
      alert("School ID tidak ditemukan");
      return;
    }

    setSaving(true);

    // Pastikan value diubah ke string dulu sebelum di-trim
    const nameValue = String(form.name || "").trim();
    const yearValue = String(form.graduationYear || "").trim();

    if (!nameValue || !yearValue) {
      alert("Nama dan Tahun Kelulusan wajib diisi");
      return;
    }

    if (!/^\d{4}$/.test(yearValue)) {
      alert("Tahun kelulusan harus 4 digit (contoh: 2023)");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("graduationYear", form.graduationYear);
      formData.append("description", form.description || "");
      formData.append("schoolId", schoolId.toString());

      if (form.photo) {
        formData.append("photo", form.photo);
      }

      await onSubmit(formData);
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999]"
        onClick={onClose}
      />

      {/* Sidebar Modal */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0B1220] border-l border-white/10 shadow-2xl overflow-y-auto z-[100000] flex flex-col"
      >
        <div className="p-10 border-b border-white/8 flex justify-between items-center relative top-0 bg-[#0B1220] z-10">
          <div>
            <h3 className="text-4xl font-black tracking-tight text-white">
              {title.includes("Tambah") ? "Tambah" : "Edit"} <span className="text-blue-600">Alumni</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/80 mt-1">
              Data Alumni Sekolah
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
          {/* Foto */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Award size={18} className="text-blue-500" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/90 italic">Foto Alumni</h4>
            </div>

            <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/15 rounded-3xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all relative overflow-hidden group">
              {(form.preview || initialData?.photoUrl) && (
                <img
                  src={form.preview || initialData?.photoUrl}
                  alt="preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-3">
                <Upload className="text-blue-500" size={40} />
                <span className="text-xs font-black uppercase tracking-wider text-white/70">
                  {form.preview ? "Ganti Foto" : "Upload Foto Alumni"}
                </span>
                <span className="text-[10px] text-zinc-500">(jpg / png / webp)</span>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {form.preview && (
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, photo: null, preview: "" }))}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 mx-auto"
              >
                <Trash2 size={14} /> Hapus Foto
              </button>
            )}
          </div>

          {/* Nama */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama lengkap alumni"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all font-medium"
            />
          </div>

          {/* Tahun Lulus */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Tahun Kelulusan *
            </label>
            <input
              type="text"
              value={form.graduationYear}
              onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
              placeholder="Contoh: 2023"
              maxLength={4}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all font-mono tracking-wide"
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Deskripsi / Prestasi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ceritakan singkat tentang alumni ini (opsional)"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-y"
            />
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
              {saving ? <Loader className="animate-spin" size={18} /> : <Plus size={18} />}
              {saving ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

// ──────────────────────────────────────────────────────────────
export default function AlumniManager() {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    type: "success",
    visible: false,
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "verified" | "pending">("all");

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, type, visible: true });
    setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 5000);
  }, []);

  const fetchAlumni = useCallback(async () => {
    if (!schoolId) {
      showAlert("School ID tidak ditemukan.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json.success) {
        setAlumni(json.data || []);
      } else {
        throw new Error(json.message || "Invalid response");
      }
    } catch (err: any) {
      showAlert("Gagal memuat data alumni: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [schoolId, showAlert]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  const handleCreate = async (formData: FormData) => {
    const res = await fetch(BASE_URL, { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Gagal menambah");
    }
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Gagal");
    showAlert("Alumni berhasil ditambahkan!");
    fetchAlumni();
  };

  const handleUpdate = async (formData: FormData) => {
    console.log('id', selectedAlumni.id)
    if (!selectedAlumni?.id) return;
    const res = await fetch(`${BASE_URL}/${selectedAlumni.id}`, { method: "PUT", body: formData });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Gagal update");
    }
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Gagal");
    showAlert("Alumni berhasil diperbarui!");
    fetchAlumni();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Gagal hapus");
      }
      showAlert("Alumni berhasil dihapus");
      fetchAlumni();
    } catch (err: any) {
      showAlert("Gagal menghapus: " + err.message, "error");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}/approve`, { 
        method: "PATCH" 
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Gagal verifikasi");
      }
      
      showAlert("Alumni berhasil diverifikasi!");
      fetchAlumni(); // Refresh data
    } catch (err: any) {
      showAlert("Gagal verifikasi: " + err.message, "error");
    }
  };

  // Filter data berdasarkan status yang dipilih
  const filteredAlumni = alumni.filter((al) => {
    if (filterStatus === "verified") return al.isVerified === true;
    if (filterStatus === "pending") return al.isVerified === false;
    return true; // "all"
  });

  return (
    <div className="min-h-screen pb-10" style={{ background: THEME.bg, color: THEME.text }}>
      <AnimatePresence>
        {alert.visible && <Alert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <Award size={14} /> Alumni Management
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Daftar <span className="text-blue-600">Alumni</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">SMK / SMA / SMP favorit di kota Anda</p>
        </div>

        <button
          onClick={() => {
            setSelectedAlumni(null);
            setAddModalOpen(true);
          }}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
        >
          <Plus size={18} /> Tambah Alumni
        </button>
      </div>

      {/* Filter Selector */}
      <div className="w-full grid grid-cols-3 text-center gap-2 mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/10">
        {[
          { id: "all", label: "Semua", count: alumni.length },
          { id: "pending", label: "Tertunda", count: alumni.filter(a => !a.isVerified).length },
          { id: "verified", label: "Verifikasi", count: alumni.filter(a => a.isVerified).length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id as any)}
            className={`px-6 py-2.5 rounded-xl text-[10px] justify-center font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              filterStatus === tab.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-md text-[9px] ${
              filterStatus === tab.id ? "bg-white/20 text-white" : "bg-white/5 text-zinc-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader className="animate-spin text-blue-500" size={48} />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
            Memuat data alumni...
          </div>
        </div>
      ) : filteredAlumni?.length === 0 ? (
        <div className="text-center py-32 text-zinc-500 italic text-lg">
          Belum ada data alumni untuk sekolah ini
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 px-2">
          {filteredAlumni?.map((al, i) => (
            <motion.div
              key={al.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group relative bg-white/[0.03] border border-white/8 rounded-3xl py-5 px-5 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
            >
              {/* Status Badge */}
              <div className="absolute top-8 right-8 z-10">
                {al.isVerified ? (
                  <div className="px-2 py-1 shadow-lg bg-green-600 border border-white rounded-full flex items-center gap-1.5">
                    <span className="text-[8px] font-normal uppercase text-white">Verified</span>
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-yellow-500">Pending</span>
                  </div>
                )}
              </div>
              <div className="relative mx-auto mb-6 h-48 w-full">
                <div className="absolute inset-0 bg-blue-600/10 blur-2xl rounded-full opacity-0 group-hover:opacity-70 transition-opacity" />
                {al.photoUrl ? (
                  <img
                    src={al.photoUrl}
                    alt={al.name}
                    className="h-full w-full object-cover rounded-3xl border-2 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center rounded-3xl bg-white/5 border border-white/10 text-zinc-600">
                    <User size={64} />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-center mb-1 tracking-tight">{al.name}</h3>
              <p className="text-center text-blue-400 font-black text-sm tracking-wider uppercase mb-3">
                {al.graduationYear}
              </p>

              <p className="text-sm text-zinc-400 text-center leading-relaxed min-h-[3rem] line-clamp-3">
                {al.description || "—"}
              </p>

              <div className="flex justify-center gap-4 mt-4 pt-7 border-t border-white/20">
                {/* Tombol Approve (Hanya muncul jika belum verified) */}
                {!al.isVerified && (
                  <button
                    onClick={() => handleApprove(al.id)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <Award size={16} /> Approve
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedAlumni(al);
                    setEditModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 transition-colors"
                  title="Edit"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(al.id)}
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

      {/* Modal Tambah */}
      <AlumniModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Tambah Alumni Baru"
        onSubmit={handleCreate}
        schoolId={schoolId}
      />

      {/* Modal Edit */}
      <AlumniModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Data Alumni"
        initialData={selectedAlumni}
        onSubmit={handleUpdate}
        schoolId={schoolId}
      />
    </div>
  );
}