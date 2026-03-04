import { useSchool } from '@/features/schools';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import {
  CheckCircle2,
  Edit,
  Heart,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
  X
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

const BASE_URL = "https://be-school.kiraproject.id/orang-tua";
// const BASE_URL = "http://localhost:5005/orang-tua";

const ParentModal = ({ queryClient, open, onClose, title, initialData, onSubmit, schoolId }: any) => {
  const [form, setForm] = useState({
    name: "",
    gender: "Laki-laki",
    relationStatus: "Ayah",
    type: "Kandung",
    phoneNumber: "",
    studentIds: [] as number[],
  });

  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search handler
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    []
  );

  // Query siswa hanya aktif jika debouncedSearch tidak kosong
  const { data: studentList, isLoading: loadingStudents } = useQuery({
    queryKey: ['students-search', schoolId, debouncedSearch],
    queryFn: async () => {
      const API_TARGET = "https://be-school.kiraproject.id/siswa/search";
      const res = await fetch(`${API_TARGET}?schoolId=${schoolId}&name=${debouncedSearch}`);
      const json = await res.json();
      return json.success ? json.data : [];
    },
    // KUNCI: Query hanya jalan jika modal buka, schoolId ada, dan input tidak kosong
    enabled: open && !!schoolId && debouncedSearch.length > 0,
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData?.name || "",
        gender: initialData?.gender || "Laki-laki",
        relationStatus: initialData?.relationStatus || "Ayah",
        type: initialData?.type || "Kandung",
        phoneNumber: initialData?.phoneNumber || "",
        studentIds: initialData?.children?.map((c: any) => c.id) || [],
      });
      setSearchTerm("");
      setDebouncedSearch("");
    }
  }, [open, initialData]);

  const toggleStudent = (id: number) => {
    setForm(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(id)
        ? prev.studentIds.filter(sid => sid !== id)
        : [...prev.studentIds, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        initialData 
          ? `https://be-school.kiraproject.id/orang-tua/${initialData.id}` 
          : `https://be-school.kiraproject.id/orang-tua`, 
        {
          method: initialData ? 'PUT' : 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, schoolId })
        }
      );

      if (!res.ok) throw new Error("Gagal menyimpan data orang tua");
      
      await onSubmit();
      queryClient.invalidateQueries({ queryKey: ['parents'] });  
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100000]" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }} 
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0B1220] border-l border-white/10 z-[100001] p-10 overflow-y-auto"
      >
        {/* Header */}
        <div className="border-b border-white/8 flex justify-between pb-8 mb-8 items-center bg-[#0B1220] z-10">
          <div>
            <h3 className="text-4xl font-black tracking-tighter text-white">
              {title}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Relasi orang tua dan murid
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Nama Lengkap Orang Tua</label>
              <input 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" 
                placeholder="Contoh: Budi Santoso"
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">No. WhatsApp/Telepon</label>
              <input 
                value={form.phoneNumber} 
                onChange={e => setForm({...form, phoneNumber: e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 font-mono" 
                placeholder="0812xxxxxxxxx"
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Jenis Kelamin</label>
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 appearance-none cursor-pointer">
                <option value="Laki-laki" className="bg-[#0B1220]">Laki-laki</option>
                <option value="Perempuan" className="bg-[#0B1220]">Perempuan</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Hubungan</label>
              <select value={form.relationStatus} onChange={e => setForm({...form, relationStatus: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 appearance-none cursor-pointer">
                <option value="Ayah" className="bg-[#0B1220]">Ayah</option>
                <option value="Ibu" className="bg-[#0B1220]">Ibu</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Status</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 appearance-none cursor-pointer">
                <option value="Kandung" className="bg-[#0B1220]">Kandung</option>
                <option value="Tiri" className="bg-[#0B1220]">Tiri</option>
              </select>
            </div>
          </div>

          {/* Bagian Hubungkan Siswa */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-2">Hubungkan dengan Siswa (Anak)</label>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text"
                value={searchTerm}
                placeholder="Cari nama anak..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  debouncedSetSearch(e.target.value);
                }}
              />
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {!debouncedSearch ? (
                /* State: Belum Mencari */
                <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl">
                   <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Ketik nama anak untuk mencari...</p>
                </div>
              ) : loadingStudents ? (
                /* State: Loading */
                <div className="text-[10px] text-zinc-600 uppercase font-bold p-4 text-center flex items-center justify-center gap-2">
                  <RefreshCw size={12} className="animate-spin" /> Mencari...
                </div>
              ) : studentList && studentList.length > 0 ? (
                /* State: Ada Data */
                studentList.map((s: any) => (
                  <div 
                    key={s.id}
                    onClick={() => toggleStudent(s.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${form.studentIds.includes(s.id) ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/10 overflow-hidden">
                        {s.photoUrl ? <img src={s.photoUrl} className="object-cover h-full w-full" alt="" /> : <User size={14} className="m-2 text-zinc-600"/>}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-white">{s.name}</div>
                        <div className="text-[9px] text-zinc-500 uppercase">{s.class}</div>
                      </div>
                    </div>
                    {form.studentIds.includes(s.id) && <CheckCircle2 size={16} className="text-blue-500" />}
                  </div>
                ))
              ) : (
                /* State: Data Kosong */
                <div className="py-10 text-center">
                   <p className="text-[10px] font-bold text-red-400/50 uppercase tracking-widest">Siswa tidak ditemukan</p>
                </div>
              )}
            </div>
            
            <div className="text-[9px] text-zinc-500 font-medium italic">
              Terpilih: {form.studentIds.length} Siswa
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving} 
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            {saving ? "Menyimpan..." : "Simpan Data Wali"}
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default function OrangTuaMain() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modals, setModals] = useState({ add: false, edit: false });
  const [selected, setSelected] = useState<any | null>(null);
  const queryClient = useQueryClient();

  // Ambil schoolId dari context/query yang sama dengan StudentManager
  const schoolQuery = useSchool(); 
  const schoolId = schoolQuery?.data?.[0]?.id;

  // --- Logic Search ---
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  // --- Query Data ---
  const { data: parentData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['parents', schoolId, debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}?schoolId=${schoolId}&name=${debouncedSearch}`);
      const json = await res.json();
      return json.data as any[];
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  // --- Delete Handler ---
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Hapus data orang tua "${name}"? Siswa yang terhubung akan kehilangan data wali.`)) return;
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['parents'] });
        alert("Data berhasil dihapus");
      }
    } catch (err) {
      alert("Gagal menghapus data");
    }
  };

  return (
    <div className="min-h-screen pb-8 text-slate-100">
      {/* Header Utama - Mengikuti Desain Siswa */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase mb-2">
            <CheckCircle2 size={14} /> Wali Murid Database
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Data <span className="text-blue-600">Orang Tua</span></h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola hubungan wali dan kontak orang tua</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setModals({ ...modals, add: true })} 
            className="h-14 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-blue-600/30"
          >
            <Plus size={16}/> Tambah
          </button>
        </div>
      </div>

      {/* Search & Refresh Bar */}
      <div className="mb-6 relative w-full flex gap-3 items-center justify-between">
        <div className="w-[80%] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama orang tua..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all text-white"
          />
        </div>

        <button 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="flex-1 h-14 px-5 justify-center bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? "Syncing..." : "Refresh"}
        </button>
      </div>

      {/* Tabel Data Orang Tua */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left">
          <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/5 bg-white/[0.03]">
            <tr>
              <th className="pl-6 p-6">Nama Orang Tua</th>
              <th className="py-6">Hubungan</th>
              <th className="py-6">Kontak</th>
              <th className="py-6">Anak (Siswa)</th>
              <th className="py-6">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={5} className="px-2 py-20 text-center text-zinc-600 tracking-widest uppercase">Memuat Data Wali...</td></tr>
            ) : parentData?.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="py-6 pl-6">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <User className="text-blue-500" size={20}/>
                    </div>
                    <div>
                      <div className="font-bold text-white tracking-tight">{p.name}</div>
                      <div className="text-[9px] text-zinc-500 font-bold uppercase">{p.gender} • {p.type}</div>
                    </div>
                  </div>
                </td>
                <td className="py-6">
                   <div className="flex items-center gap-2 text-zinc-300">
                     <Heart size={14} className="text-red-500" />
                     <span className="font-mono text-sm uppercase">{p.relationStatus}</span>
                   </div>
                </td>
                <td className="py-6">
                   <div className="flex items-center gap-2 text-blue-400 font-mono text-sm">
                     <Phone size={14} />
                     {p.phoneNumber}
                   </div>
                </td>
                <td className="py-6">
                   <div className="flex -space-x-2">
                     {p.children && p.children.length > 0 ? (
                        p.children.map((child: any) => (
                          <div className='flex items-center gap-2'>
                            <div key={child.id} className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden" title={child.name}>
                              {child.photoUrl ? <img src={child.photoUrl} className="object-cover" /> : <User size={12}/>}
                            </div>
                            <span className='text-xs text-slate-300'>
                              {child.name}
                            </span>
                          </div>
                        ))
                     ) : (
                       <span className="text-[10px] text-zinc-600 italic">Belum terhubung</span>
                     )}
                   </div>
                </td>
                <td className="py-6 text-left gap-2.5 flex">
                  <button 
                    onClick={() => { setSelected(p); setModals({...modals, edit: true}); }} 
                    className="p-3 bg-white/5 hover:bg-blue-500/20 rounded-xl hover:text-blue-400 transition-all"
                  >
                    <Edit size={16}/>
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id, p.name)} 
                    className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl hover:text-red-400 transition-all"
                  >
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gunakan Modal Yang Sama (Atau buat ParentModal baru) */}
      {modals.add || modals.edit ? (
        <ParentModal 
          open={true}
          schoolId={schoolId}
          queryClient={queryClient}
          initialData={selected}
          title={selected ? "Perbarui Ortu" : "Tambah Ortu"} 
          onClose={() => { setModals({add:false, edit:false}); setSelected(null); }}
          onSubmit={() => queryClient.invalidateQueries({ queryKey: ['parents'] })}
        />
      ) : null}
    </div>
  );
}