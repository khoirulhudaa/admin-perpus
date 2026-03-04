import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Book, BookOpen, ExternalLink, FileText, GraduationCap, Loader, Plus, RefreshCw, Save, Trash2, X } from "lucide-react"; // Tambah ExternalLink icon
import React, { useState } from "react";
import { toast } from "sonner";

const API_BASE = "https://be-school.kiraproject.id/tugas";
const API_BASE_CLASS = "https://be-school.kiraproject.id/kelas"; // Sesuaikan jika berbeda

export default function TugasMain() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Tambahkan linkEksternal ke Form State
  const [formData, setFormData] = useState({
    judul: "",
    namaGuru: "",
    emailGuru: "",
    deskripsi: "",
    jenisSoal: "Latihan",
    nilaiMinimal: 75,
    hari: "",
    mapel: "", // <--- Baru
    kelas: "",
    tanggal: "",
    deadlineJam: "",
    linkEksternal: "", // <--- New Field
  });

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const { data: tasks = [], isLoading: loading, refetch, isFetching } = useQuery({
    queryKey: ['tasks', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`);
      const json = await res.json();
      return json.success ? json.data : [];
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const { 
    data: classes = [], 
    isLoading: loadingClass, 
    refetch: refecthClass, 
    isFetching: isFatchingclass 
  } = useQuery({
    queryKey: ['classes', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const res = await fetch(`${API_BASE_CLASS}?schoolId=${schoolId}`);
      const json = await res.json();
      return json.success ? json.data : [];
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
  });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const url = editingItem ? `${API_BASE}/${editingItem.id}` : API_BASE;
    const method = editingItem ? "PUT" : "POST";

    // Kirim objek plain JSON, bukan FormData
    const payload = {
      ...formData,
      schoolId: schoolId, // Pastikan schoolId ikut terkirim
    };

    const res = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json", // Beritahu server ini JSON
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setModalOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Tugas berhasil disimpan");
    }
  } catch (err) {
    toast.error("Gagal menyimpan tugas");
  } finally {
    setIsSubmitting(false);
  }
};

  console.log('editingItem', editingItem)

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus tugas ini?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}/${schoolId}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        toast.success("Tugas berhasil dihapus");
      }
    } catch (err) {
      toast.error("Gagal menghapus tugas");
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      judul: "", namaGuru: "", emailGuru: "", deskripsi: "",
      jenisSoal: "Latihan", nilaiMinimal: 75, hari: "",
      mapel: "", // <--- Baru
      kelas: "",
      tanggal: "", deadlineJam: "", linkEksternal: "" // <--- Reset field
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      namaGuru: item.namaGuru,
      emailGuru: item.emailGuru,
      deskripsi: item.deskripsi,
      jenisSoal: item.jenisSoal,
      mapel: item.mapel, // <--- Baru
      kelas: item.kelas,
      nilaiMinimal: item.nilaiMinimal,
      hari: item.hari,
      tanggal: item.tanggal,
      deadlineJam: item.deadlineJam,
      linkEksternal: item.linkEksternal || "", // <--- Load data
    });
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      {/* Header Tetap Sama */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <BookOpen size={14} /> Akademik
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Manajemen <span className="text-blue-600">Tugas</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola penugasan siswa</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => {refetch(), refecthClass()}} className="h-14 px-5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-[12px] tracking-widest">
            <RefreshCw size={16} className={isFetching || isFatchingclass ? "animate-spin" : ""} />
            {isFetching ? "Syncing..." : "Refresh"}
          </button>
          <button onClick={() => { resetForm(); setModalOpen(true); }} className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-xl transition-all">
            <Plus size={18} /> Tambah Tugas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
          <Loader className="animate-spin mb-4" size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest">Loading Tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-40 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
           <p className="text-white/20 text-lg font-medium">Belum ada data tugas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((item: any) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="group bg-white/[0.03] border border-white/8 rounded-3xl p-6 hover:border-blue-500/50 transition-all shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                  <FileText size={24} />
                </div>
              </div>
              
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight line-clamp-1">{item.judul}</h3>
              <p className="text-zinc-500 text-xs mb-4 line-clamp-2">{item.deskripsi}</p>
              
              {/* 2. Tampilkan Link Eksternal di Card jika ada */}
              {item.linkEksternal ? (
                <a href={item.linkEksternal} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4 hover:text-blue-300 transition-colors">
                  <ExternalLink size={12} /> Buka Link Materi
                </a>
              ): (
                <a className="opacity-0 z-[-1] flex items-center gap-2 text-transparent text-[10px] font-bold uppercase tracking-widest mb-4 hover:text-blue-300 transition-colors">
                  <ExternalLink size={12} /> 
                </a>
              )}
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <div>
                  <p className="text-zinc-600">Guru</p>
                  <p className="text-white">{item.namaGuru}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Deadline</p>
                  <p className="text-amber-500">{item.tanggal} - {item.deadlineJam}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <div>
                  <p className="text-zinc-600">Jenis Soal</p>
                  <p className="text-white">{item.jenisSoal}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Kelas</p>
                  <p className="text-amber-500">{item.kelas || 'Belum ada'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="p-2 w-[44px] flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"><Trash2 size={16} /></button>
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
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0B1220] border-l border-white/10 z-[10000] p-10 flex flex-col shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-white uppercase">{editingItem ? "Update" : "Buat"} Tugas</h3>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl"><X /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Judul Tugas</label>
                    <input required value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Jenis Soal</label>
                    <select value={formData.jenisSoal} onChange={(e) => setFormData({...formData, jenisSoal: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm">
                      <option className="text-black" value="Latihan">Latihan</option>
                      <option className="text-black" value="Ujian">Ujian</option>
                      <option className="text-black" value="Projek">Projek</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-500">Mata Pelajaran</label>
                    <div className="relative">
                      <Book className="absolute left-4 top-3.5 text-zinc-500" size={16} />
                      <input placeholder="Contoh: Matematika" required value={formData.mapel} onChange={(e) => setFormData({...formData, mapel: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-500">Kelas</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-3.5 text-zinc-500" size={16} />
                      <select 
                        required 
                        value={formData.kelas} 
                        onChange={(e) => setFormData({...formData, kelas: e.target.value})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-all appearance-none"
                      >
                        <option value="" disabled>{loadingClass ? "Loading..." : "Pilih Kelas"}</option>
                        {classes.map((cls: any) => (
                          <option className="text-black" key={cls.id} value={cls.className || cls.nama}>
                            {cls.className || cls.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Input Field untuk Link Eksternal */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Link Eksternal (Google Drive / YouTube / Web)</label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={formData.linkEksternal} 
                    onChange={(e) => setFormData({...formData, linkEksternal: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nama Guru</label>
                    <input required value={formData.namaGuru} onChange={(e) => setFormData({...formData, namaGuru: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Guru</label>
                    <input type="email" required value={formData.emailGuru} onChange={(e) => setFormData({...formData, emailGuru: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Deskripsi</label>
                  <textarea rows={3} value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm resize-none" />
                </div>

                <div className="grid grid-cols-3 gap-4 pb-6">
                   <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tenggat Waktu</label>
                    <input type="date" required value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Jam</label>
                    <input type="time" required value={formData.deadlineJam} onChange={(e) => setFormData({...formData, deadlineJam: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">KKM</label>
                    <input type="number" value={formData.nilaiMinimal} onChange={(e) => setFormData({...formData, nilaiMinimal: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all text-sm" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50">
                  {isSubmitting ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                  Simpan Tugas
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}