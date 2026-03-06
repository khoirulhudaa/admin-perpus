import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  Plus,
  RotateCw,
  Save,
  Search,
  Trash2,
  Users,
  UserCircle,
  X,
  CreditCard,
  GraduationCap,
  Palette,
  Printer,
  FileText,
  Upload,
  User as UserIcon
} from "lucide-react";
import React, { Fragment, useCallback, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const BASE_URL = "https://be-perpus-8xa0lfifq-valclassdevelops-projects.vercel.app";

// --- UTILS ---
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

// --- COMPONENTS: UI ELEMENTS ---
const Alert: React.FC<{ message: string; type: "success" | "error"; onClose: () => void }> = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    className={clsx(
      "flex items-center justify-between px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl w-full max-w-md fixed top-8 left-1/2 -translate-x-1/2 z-[999999]",
      type === "success" ? "bg-emerald-600 border-emerald-400 text-white" : "bg-rose-600 border-rose-400 text-white"
    )}
  >
    <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest">{message}</div>
    <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={18} /></button>
  </motion.div>
);

const Field: React.FC<{ label?: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <div className={clsx("space-y-2", className)}>
    {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic">{label}</label>}
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...(props as any)} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-blue-500 transition-all text-sm font-bold" />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-blue-500 transition-all text-sm font-bold appearance-none cursor-pointer" />
);

// --- COMPONENT: CARD DESIGNER MODAL (DARK THEME) ---
const CardDesignerModal = ({ open, onClose, config, setConfig, onGenerate, isProcessing }: any) => {
  if (!open) return null;

  const bgPresets = Array.from({ length: 12 }, (_, i) => `/bg${i + 1}.png`);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-blue-600/40 backdrop-blur-md z-[100000]" onClick={onClose} 
      />
      <motion.div 
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-blue-900 border-l border-white/10 z-[100001] p-10 overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Design Kartu</h2>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Sesuaikan tampilan kartu anggota</p>
          </div>
          <button onClick={onClose} className="relative top-[-14px] p-2 bg-white/10 hover:bg-white/20 rounded-full border border-white/30 text-white transition-colors"><X size={30}/></button>
        </div>

        <div className="space-y-10">
          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center p-8 py-12 bg-white/5 rounded-3xl border border-white/50 relative">
            <div 
              className="w-[320px] h-[200px] rounded-xl shadow-2xl overflow-hidden relative bg-white border border-white"
              style={{ 
                backgroundImage: config.bgImage ? `url(${config.bgImage})` : 'none',
                backgroundSize: 'cover', 
                backgroundPosition: 'center'
              }}
            >
              <div className="h-10 flex flex-col items-center justify-center" style={{ backgroundColor: config.accentColor }}>
                <div className="text-[10px] font-black tracking-widest uppercase" style={{ color: config.titleColor }}>
                  {config.title}
                </div>
                <div className="text-[6px] font-bold opacity-80 uppercase" style={{ color: config.subtitleColor }}>
                  {config.subtitle}
                </div>
              </div>

              <div className="p-4 flex gap-4 h-[calc(100%-40px)] relative text-left">
                <div className="w-20 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shrink-0">
                  <UserIcon size={40} className="text-slate-300"/>
                </div>
                <div className="flex-1 space-y-1.5 pt-1">
                  <div className="leading-tight">
                    <div className="text-[5px] text-zinc-400 font-bold uppercase tracking-tighter">Nama Lengkap</div>
                    <div className="text-[10px] font-black text-slate-800 uppercase truncate">CONTOH NAMA ANGGOTA</div>
                  </div>
                  <div className="leading-tight">
                    <div className="text-[5px] text-zinc-400 font-bold uppercase tracking-tighter">Nomor Induk</div>
                    <div className="text-[8px] font-bold text-slate-700 leading-none">ID: 20240001</div>
                  </div>
                  <div className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[5px] font-black rounded-full uppercase">Status: Aktif</div>
                </div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-slate-200 flex items-center justify-center p-1 bg-white rounded-md">
                  <div className="text-[5px] font-bold text-slate-200 italic">QR CODE</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Judul</label>
              <input type="color" value={config.titleColor} onChange={e => setConfig({...config, titleColor: e.target.value})} className="w-full h-14 bg-transparent border-none cursor-pointer" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Subtitle</label>
              <input type="color" value={config.subtitleColor} onChange={e => setConfig({...config, subtitleColor: e.target.value})} className="w-full h-14 bg-transparent border-none cursor-pointer" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Judul Kartu</label>
              <input value={config.title} onChange={e => setConfig({...config, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Aksen</label>
              <input type="color" value={config.accentColor} onChange={e => setConfig({...config, accentColor: e.target.value})} className="w-full h-14 bg-transparent border-none cursor-pointer" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Pilih Background Preset</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {bgPresets.map((bg, index) => (
                <button
                  key={index}
                  onClick={() => setConfig({ ...config, bgImage: bg })}
                  className={`aspect-video rounded-lg border-2 overflow-hidden transition-all ${config.bgImage === bg ? 'border-blue-500 scale-95' : 'border-white/10 hover:border-white/30'}`}
                >
                  <img src={bg} alt={`BG ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              <label className="aspect-video rounded-lg border-2 border-dashed border-white flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                <Upload size={16} className="text-white" />
                <input type="file" hidden accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onload = (re) => setConfig({...config, bgImage: re.target?.result as string});
                    reader.readAsDataURL(file);
                  }
                }} />
              </label>
            </div>
          </div>

          <button onClick={onGenerate} disabled={isProcessing} className="w-full py-5 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-white hover:bg-red-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl shadow-red-900/20">
            {isProcessing ? <FaSpinner className="animate-spin"/> : <Printer size={20}/>} 
            {isProcessing ? "Sedang Memproses..." : "Cetak Kartu PDF"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function MemberMain() {
  const queryClient = useQueryClient();
  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean; type: "success" | "error" }>({ message: "", isVisible: false, type: "success" });

  // Config Desain
  const [cardConfig, setCardConfig] = useState({
    title: "KARTU ANGGOTA",
    subtitle: "SMK NEGERI TERINTEGRASI",
    accentColor: "#2563eb",
    titleColor: "#ffffff",
    subtitleColor: "#ffffff",
    bgImage: "/bg1.png"
  });

  // Fetch Data
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["member", schoolId, searchTerm, filterRole, currentPage],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/member?schoolId=${schoolId}&search=${searchTerm}&role=${filterRole}&page=${currentPage}&limit=10`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json;
    },
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
    enabled: !!schoolId,
  });

  const member = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, isVisible: true, type });
    setTimeout(() => setAlert(prev => ({ ...prev, isVisible: false })), 5000);
  }, []);

  // PDF Generator Logic
  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setProgress(0);
    try {
      const res = await fetch(`${BASE_URL}/member?schoolId=${schoolId}&limit=999`);
      const json = await res.json();
      const allData = json.data || [];

      const doc = new jsPDF('p', 'mm', 'a4');
      const cardW = 86;
      const cardH = 54;
      const margin = 10;
      const gap = 5;

      for (let i = 0; i < allData.length; i++) {
        const m = allData[i];
        const pageIdx = i % 8;
        const col = pageIdx % 2;
        const row = Math.floor(pageIdx / 2);

        if (i > 0 && pageIdx === 0) doc.addPage();

        const x = margin + (col * (cardW + gap));
        const y = margin + (row * (cardH + gap));

        // Background
        doc.setFillColor(255, 255, 255);
        doc.rect(x, y, cardW, cardH, 'F');
        if (cardConfig.bgImage) {
           try { doc.addImage(cardConfig.bgImage, 'PNG', x, y, cardW, cardH); } catch(e) {}
        }

        // Header
        doc.setFillColor(cardConfig.accentColor);
        doc.rect(x, y, cardW, 10, 'F');
        doc.setTextColor(cardConfig.titleColor);
        doc.setFontSize(9);
        doc.text(cardConfig.title, x + (cardW/2), y + 6, { align: 'center' });
        doc.setTextColor(cardConfig.subtitleColor);
        doc.setFontSize(5);
        doc.text(cardConfig.subtitle, x + (cardW/2), y + 9, { align: 'center' });

        // Info Member
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(8);
        doc.text(m.nama.toUpperCase(), x + 25, y + 20, { maxWidth: 50 });
        doc.setFontSize(7);
        doc.text(`ID: ${m.nomorInduk}`, x + 25, y + 25);
        doc.text(`Unit: ${m.kelas || '-'}`, x + 25, y + 29);

        // QR Code
        const qr = await QRCode.toDataURL(m.nomorInduk || String(m.id));
        doc.addImage(qr, 'PNG', x + 68, y + 36, 12, 12);

        // Border
        doc.setDrawColor(230, 230, 230);
        doc.rect(x, y, cardW, cardH, 'D');

        setProgress(Math.round(((i + 1) / allData.length) * 100));
      }

      doc.save("DAFTAR_KARTU_ANGGOTA.pdf");
      showAlert("PDF berhasil diunduh");
      setIsDesignerOpen(false);
    } catch (e) {
      showAlert("Gagal membuat PDF", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const openModal = (m: any = null) => {
    setSelectedMember(m);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus anggota ini?")) return;
    try {
      const res = await fetch(`${BASE_URL}/member/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        showAlert("Anggota dihapus");
        queryClient.invalidateQueries({ queryKey: ["member"] });
      }
    } catch (err) { showAlert("Gagal menghapus", "error"); }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      nomorInduk: fd.get("nomorInduk"),
      nama: fd.get("nama"),
      role: fd.get("role"),
      gender: fd.get("gender"),
      kelas: fd.get("kelas"),
      kontak: fd.get("kontak"),
      schoolId: schoolId,
    };

    try {
      const url = selectedMember ? `${BASE_URL}/member/${selectedMember.id}` : `${BASE_URL}/member`;
      const res = await fetch(url, {
        method: selectedMember ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      showAlert(selectedMember ? "Data diperbarui" : "Berhasil didaftarkan");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["member"] });
    } catch (err: any) {
      showAlert(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900">
      <AnimatePresence>{alert.isVisible && <Alert {...alert} onClose={() => setAlert(prev => ({...prev, isVisible: false}))} />}</AnimatePresence>

      <header className="mb-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 font-black text-blue-600 uppercase tracking-[0.3em] text-[10px]"><Users size={14} /> Member Directory</div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-800">Master <span className="text-blue-600">Anggota</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDesignerOpen(true)}
              className="group h-14 px-6 bg-slate-100 text-slate-600 hover:text-white border border-slate-200 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] shadow-sm hover:bg-blue-600 transition-all active:scale-95"
            >
              <Palette size={16} className="text-blue-600 group-hover:text-white" /> Design Kartu
            </button>
            <button 
              onClick={() => refetch()} 
              disabled={isFetching}
              className="h-14 w-14 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              <RotateCw size={20} className={isFetching ? "animate-spin" : ""} />
            </button>
            <button onClick={() => openModal()} className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
              <Plus size={16} /> Tambah Anggota
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-[1.4rem] shadow-sm border border-slate-100">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Cari Nama atau NIS/NIP..." 
              className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-blue-500/20 transition-all"
              value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none appearance-none cursor-pointer"
              value={filterRole} onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Semua Peran</option>
              <option value="Siswa">Siswa</option>
              <option value="Guru">Guru</option>
              <option value="Staf">Staf</option>
            </select>
          </div>
          <div className="flex items-center justify-end px-4 font-black text-[10px] text-slate-500 uppercase tracking-widest">
              {`Total: ${data?.pagination?.totalItems || 0} Anggota`}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mb-20">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Profil Anggota</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">ID / NIS</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Kelas/Unit</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-24 text-center"><FaSpinner className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
                ) : member.length === 0 ? (
                  <tr><td colSpan={5} className="py-24 text-center font-bold text-slate-400">Tidak ada anggota ditemukan</td></tr>
                ) : member.map((m: any) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><UserCircle size={28} /></div>
                        <div>
                          <div className="font-black text-sm text-slate-800 uppercase leading-tight">{m.nama}</div>
                          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">{m.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><div className="flex items-center gap-2"><CreditCard size={14} className="text-slate-400" /><span className="text-[11px] font-mono font-bold text-slate-600">{m.nomorInduk}</span></div></td>
                    <td className="px-6 py-5 text-center"><div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500"><GraduationCap size={12} /> {m.kelas || '-'}</div></td>
                    <td className="px-6 py-5 text-center"><span className={clsx("px-3 py-1 rounded-full text-[9px] font-black uppercase", m.isActive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600")}>{m.isActive ? "Aktif" : "Non-Aktif"}</span></td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(m)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(m.id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Halaman {currentPage} dari {totalPages}</div>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-all"><ChevronLeft size={18} /></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-all"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </main>

      {/* --- GENERATING OVERLAY --- */}
      {isGenerating && (
        <div className="fixed inset-0 z-[999999] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] text-center shadow-2xl">
                <FileText className="mx-auto text-blue-600 mb-6 animate-pulse" size={48} />
                <h3 className="text-xl font-black uppercase tracking-tighter">Membuat PDF</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">{progress}% Rendering Data...</p>
                <div className="w-full h-2 bg-slate-100 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
      )}

      {/* --- DESIGNER MODAL --- */}
      <CardDesignerModal 
        open={isDesignerOpen} 
        onClose={() => setIsDesignerOpen(false)}
        config={cardConfig}
        setConfig={setCardConfig}
        onGenerate={handleGeneratePDF}
        isProcessing={isGenerating}
      />

      {/* --- FORM MODAL --- */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-y-0 right-0 w-full max-w-xl flex">
            <Transition.Child as={Fragment} enter="transform transition duration-500 ease-in-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-400" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full w-full bg-white p-8 shadow-2xl overflow-y-auto flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Member Database</span>
                    <Dialog.Title className="text-3xl font-black uppercase tracking-tighter text-slate-900">{selectedMember ? "Edit Anggota" : "Anggota Baru"}</Dialog.Title>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 rounded-3xl hover:bg-rose-50 hover:text-rose-600 transition-all"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <Field label="Nomor Induk (NIS/NIP)"><Input name="nomorInduk" defaultValue={selectedMember?.nomorInduk} required placeholder="202401001" /></Field>
                  <Field label="Nama Lengkap"><Input name="nama" defaultValue={selectedMember?.nama} required placeholder="Contoh: Ahmad Subardjo" /></Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Peran"><Select name="role" defaultValue={selectedMember?.role || "Siswa"}><option value="Siswa">Siswa</option><option value="Guru">Guru</option><option value="Staf">Staf</option></Select></Field>
                    <Field label="Gender"><Select name="gender" defaultValue={selectedMember?.gender || "L"}><option value="L">Laki-laki</option><option value="P">Perempuan</option></Select></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Kelas / Unit"><Input name="kelas" defaultValue={selectedMember?.kelas} placeholder="X-IPA-1 / Kurikulum" /></Field>
                    <Field label="No. Kontak"><Input name="kontak" defaultValue={selectedMember?.kontak} placeholder="0812..." /></Field>
                  </div>
                  <div className="p-6 bg-blue-50/50 rounded-[2.5rem] border border-blue-100">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest text-center">Status Keanggotaan</p>
                    <div className="flex items-center justify-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group"><input type="radio" name="isActive" value="true" defaultChecked={selectedMember?.isActive !== false} className="accent-blue-600 h-4 w-4" /><span className="text-xs font-bold text-slate-700">Aktif</span></label>
                        <label className="flex items-center gap-2 cursor-pointer group ml-4"><input type="radio" name="isActive" value="false" defaultChecked={selectedMember?.isActive === false} className="accent-rose-600 h-4 w-4" /><span className="text-xs font-bold text-slate-700">Non-Aktif</span></label>
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-blue-700 shadow-2xl active:scale-[0.98] disabled:opacity-50 transition-all">
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <Save size={18} />} {selectedMember ? "Perbarui Data" : "Daftarkan Anggota"}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}