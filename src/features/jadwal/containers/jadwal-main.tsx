import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, Edit, Loader, Plus, Save, Trash2, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = "https://be-school.kiraproject.id/jadwal";

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

interface Schedule {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  className: string;
  teacher?: string;
  room?: string;
  description?: string;
  schoolId: number;
}

const JadwalModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
  loading,
  schoolId,
}: {
  open: boolean;
  onClose: () => void;
  initialData: Partial<Schedule>;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  schoolId: number | null;
}) => {
  const [form, setForm] = useState<Partial<Schedule>>({
    day: "SENIN",
    startTime: "07:00",
    endTime: "07:45",
    subject: "",
    className: "",
    teacher: "",
    room: "",
    description: "",
    ...initialData,
  });

  useEffect(() => {
    if (open) {
      setForm({
        day: "SENIN",
        startTime: "07:00",
        endTime: "07:45",
        subject: "",
        className: "",
        teacher: "",
        room: "",
        description: "",
        ...initialData,
      });
    }
  }, [open, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.day || !form.startTime || !form.endTime || !form.subject || !form.className) {
      alert("Hari, Jam, Mata Pelajaran, dan Kelas wajib diisi");
      return;
    }

    if (!schoolId) {
      alert("School ID tidak ditemukan");
      return;
    }

    const payload = { ...form, schoolId };
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
              {initialData.id ? "Edit" : "Tambah"} <span className="text-blue-600">Jadwal</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Jadwal Pelajaran Sekolah
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
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Hari *
            </label>
            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
            >
              {["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"].map((d) => (
                <option className="text-black" key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Jam Mulai *
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Jam Selesai *
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Mata Pelajaran *
              </label>
              <input
                name="subject"
                value={form.subject || ""}
                onChange={handleChange}
                placeholder="Matematika, IPA, Bahasa Indonesia..."
                required
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Kelas *
              </label>
              <input
                name="className"
                value={form.className || ""}
                onChange={handleChange}
                placeholder="X IPA 1, XI IPS 2, XII TKJ..."
                required
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Guru
              </label>
              <input
                name="teacher"
                value={form.teacher || ""}
                onChange={handleChange}
                placeholder="Nama guru (opsional)"
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Ruangan
              </label>
              <input
                name="room"
                value={form.room || ""}
                onChange={handleChange}
                placeholder="Ruang 101, Lab Komputer... (opsional)"
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Keterangan
            </label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              placeholder="Catatan tambahan (opsional)"
              rows={4}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-y"
            />
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
                loading
                  ? "bg-blue-800 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
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

export default function JadwalPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
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
      setSchedules(json.data || []);
    } catch (err: any) {
      showAlert(`Gagal memuat jadwal: ${err.message}`);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [schoolId, showAlert]);

  useEffect(() => {
    if (schoolId) fetchData();
  }, [schoolId, fetchData]);

  const uniqueClasses = useMemo(() => {
    return Array.from(new Set(schedules.map((s) => s.className?.trim()).filter(Boolean))).sort();
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    return selectedClass
      ? schedules.filter((s) => s.className?.trim() === selectedClass)
      : schedules;
  }, [schedules, selectedClass]);

  const groupedByDay = useMemo(() => {
    const days = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
    return days.reduce((acc, day) => {
      acc[day] = filteredSchedules
        .filter((s) => s.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      return acc;
    }, {} as Record<string, Schedule[]>);
  }, [filteredSchedules]);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const url = editingItem ? `${API_BASE}/${editingItem.id}` : API_BASE;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
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

  const openEdit = (item: Schedule) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const DayTable = ({ day, items }: { day: string; items: Schedule[] }) => (
    <div className="space-y-4">
      <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
        <span className="text-blue-600">{day}</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
          {items.length} sesi
        </span>
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm text-zinc-500 italic">
          Belum ada jadwal untuk hari ini
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/8 backdrop-blur-sm bg-white/[0.02]">
          <table className="min-w-full divide-y divide-white/5">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400">
                  Jam
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400">
                  Mata Pelajaran
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400">
                  Kelas
                </th> */}
                {/* <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400 hidden md:table-cell">
                  Guru / Ruang
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400 w-28">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-blue-500" />
                      {item.startTime} – {item.endTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{item.subject}</td>
                  {/* <td className="px-6 py-4 text-sm text-zinc-300">{item.className}</td> */}
                  {/* <td className="px-6 py-4 text-sm text-zinc-400 hidden md:table-cell">
                    {item.teacher || item.room ? (
                      <>
                        {item.teacher && <div>Guru: {item.teacher}</div>}
                        {item.room && <div>Ruang: {item.room}</div>}
                      </>
                    ) : (
                      "—"
                    )}
                  </td> */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        disabled={loading}
                        className="p-2 rounded-xl bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 transition-colors disabled:opacity-50"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={loading}
                        className="p-2 rounded-xl bg-red-900/30 hover:bg-red-800/50 text-red-300 transition-colors disabled:opacity-50"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <Calendar size={14} /> Jadwal Management
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Jadwal <span className="text-blue-600">Pelajaran</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola jadwal harian per kelas</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-blue-500 outline-none min-w-[220px]"
          >
            <option className="text-black" value="">Semua Kelas</option>
            {uniqueClasses.map((cls) => (
              <option className="text-black" key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          <button
            onClick={openAdd}
            disabled={loading}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50"
          >
            <Plus size={18} /> Tambah Jadwal
          </button>
        </div>
      </div>

      {loading && schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader className="animate-spin text-blue-500" size={48} />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
            Memuat jadwal...
          </div>
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <Clock size={40} className="text-zinc-600" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">
            {selectedClass ? `Tidak ada jadwal untuk ${selectedClass}` : "Belum ada jadwal"}
          </h3>
          <p className="text-zinc-500">Tambahkan jadwal pelajaran baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {(["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"] as const).map((day) => (
            <DayTable key={day} day={day} items={groupedByDay[day] || []} />
          ))}
        </div>
      )}

      <JadwalModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        initialData={editingItem || {}}
        onSubmit={handleSubmit}
        loading={loading}
        schoolId={schoolId}
      />
    </div>
  );
}