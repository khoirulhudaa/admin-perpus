import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, GraduationCap, Loader, Plus, Save, Trash2, X, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner"; // Pastikan sonner terinstal untuk feedback

const API_BASE = "https://be-school.kiraproject.id/kelas";

export default function KelasMain() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [classNameInput, setClassNameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  // ─── REACT QUERY: Fetch Data Kelas ───────────────────────────
  const { 
    data: classes = [], 
    isLoading: loading, 
    refetch, 
    isFetching 
  } = useQuery({
    queryKey: ['classes', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`);
      const json = await res.json();
      return json.success ? json.data : [];
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
  });

  // ─── HANDLER: Simpan/Update ──────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingItem ? `${API_BASE}/${editingItem.id}` : API_BASE;
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId, className: classNameInput }),
      });

      if (res.ok) {
        setModalOpen(false);
        setEditingItem(null);
        setClassNameInput("");
        // REFRESH DATA OTOMATIS
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        toast.success("Kelas berhasil disimpan");
      }
    } catch (err) {
      toast.error("Gagal menyimpan kelas");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── HANDLER: Hapus ──────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kelas ini?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}/${schoolId}`, { method: "DELETE" });
      if (res.ok) {
        // REFRESH DATA OTOMATIS
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        toast.success("Kelas dihapus");
      }
    } catch (err) {
      toast.error("Gagal menghapus kelas");
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setClassNameInput(item.className);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <BookOpen size={14} /> Master Data
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Manajemen <span className="text-blue-600">Kelas</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola ruang kelas</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* TOMBOL REFRESH MANUAL */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-14 px-5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Syncing..." : "Refresh"}
          </button>

          <button
            onClick={() => { setEditingItem(null); setClassNameInput(""); setModalOpen(true); }}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-xl transition-all"
          >
            <Plus size={18} /> Tambah Kelas
          </button>
        </div>
      </div>

      {/* State Loading & Kosong */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
          <Loader className="animate-spin mb-4" size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest">Loading Classes...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-40 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
           <p className="text-white/20 text-lg font-medium">Belum ada data kelas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {classes.map((item: any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-white/[0.03] border border-white/8 rounded-3xl p-6 hover:border-blue-500/50 transition-all shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-4">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight italic">
                {item.className}
              </h3>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                  Perbarui
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Slide-over */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0B1220] border-l border-white/10 z-[10000] p-10 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-white uppercase italic">{editingItem ? "Perbarui" : "Tambah"} Kelas</h3>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl"><X /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Nama Kelas</label>
                  <input
                    required
                    autoFocus
                    value={classNameInput}
                    onChange={(e) => setClassNameInput(e.target.value)}
                    placeholder="Contoh: XII RPL 1"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all font-bold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                  Simpan Kelas
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}