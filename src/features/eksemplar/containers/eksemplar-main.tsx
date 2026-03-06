import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Library,
  Plus,
  RotateCw,
  Search,
  Trash2,
  X
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import React, { Fragment, useState } from "react";
import { FaSpinner } from "react-icons/fa";

// const BASE_URL = "http://localhost:5010";
const BASE_URL = "https://be-perpus-8xa0lfifq-valclassdevelops-projects.vercel.app";

// --- API FETCHERS ---
const fetchEksemplar = async ({ schoolId, searchTerm, currentPage }: any) => {
  if (!schoolId) return null;
  const res = await fetch(`${BASE_URL}/eksemplar?schoolId=${schoolId}&q=${searchTerm}&page=${currentPage}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
};

const fetchBiblios = async (schoolId: string) => {
  const res = await fetch(`${BASE_URL}/biblio?schoolId=${schoolId}&limit=100`);
  const json = await res.json();
  return json.data || [];
};

// --- REUSABLE COMPONENTS ---
const Field: React.FC<{ label?: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2">
    {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">{label}</label>}
    {children}
  </div>
);

export default function EksemplarMain() {
  const queryClient = useQueryClient();
  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  // --- UI STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomQR, setZoomQR] = useState<{ code: string; title: string } | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // --- REACT QUERY (Data Eksemplar) ---
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["eksemplar", schoolId, searchTerm, currentPage],
    queryFn: () => fetchEksemplar({ schoolId, searchTerm, currentPage }),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
  });

  // --- REACT QUERY (Data Master Buku untuk Dropdown) ---
  const { data: biblios = [] } = useQuery({
    queryKey: ["biblio-list", schoolId],
    queryFn: () => fetchBiblios(schoolId),
    enabled: isModalOpen && !!schoolId, // Hanya fetch saat modal dibuka
    staleTime: 10 * 60 * 1000,
  });

  const items = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  // --- HANDLERS ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError(null); // Reset error sebelum submit
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    payload.schoolId = schoolId;

    const method = selectedItem ? "PUT" : "POST";
    const url = selectedItem ? `${BASE_URL}/eksemplar/${selectedItem.id}` : `${BASE_URL}/eksemplar`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        // Jika pesan error mengandung kata "Register" atau "Barcode"
        if (result.message?.toLowerCase().includes("register") || result.message?.toLowerCase().includes("barcode")) {
          setRegisterError(result.message);
        } else {
          alert(result.message); // Fallback untuk error lain
        }
        return; // Stop eksekusi
      }

      // Jika sukses
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["eksemplar"] });
      
    } catch (error) {
      console.error("Submit failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data eksemplar ini?")) return;
    try {
      const res = await fetch(`${BASE_URL}/eksemplar/${id}`, { method: "DELETE" });
      if (res.ok) queryClient.invalidateQueries({ queryKey: ["eksemplar"] });
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // Update fungsi openModal/reset agar error hilang saat buka form baru
  const handleOpenModal = (item: any = null) => {
    setSelectedItem(item);
    setRegisterError(null); // Reset error setiap kali modal dibuka
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen text-slate-900">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 max-w-7xl mx-auto">
        <div>
          <div className="flex items-center gap-2 mb-2 font-black text-blue-600 uppercase tracking-[0.3em] text-[10px]"><Library size={14} /> Eksemplar Registry</div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-800">Master <span className="text-blue-600">Eksemplar</span></h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="h-14 w-14 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all active:rotate-180 duration-500 disabled:opacity-50"
            title="Refresh Data"
          >
            <RotateCw size={20} className={isFetching ? "animate-spin" : ""} />
          </button>

          <button 
            onClick={() => handleOpenModal(null)} // Panggil handleOpenModal tanpa data
            className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
          >
            <Plus size={16}/> Registrasi Eksemplar
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[1.4rem] shadow-sm border border-slate-100 mb-8 max-w-7xl mx-auto flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Cari No. Register atau Call Number..." 
            className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-blue-500/20 transition-all"
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="px-4 font-black text-[10px] text-slate-500 uppercase tracking-widest hidden md:block">
            {isFetching ? "Syncing..." : `Total: ${data?.meta?.totalItems || 0}`}
        </div>
      </div>

      {/* Main Table Area */}
      <main className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden max-w-7xl mt-10 mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Info Buku</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">QRCode</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">No. Register</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Call Number</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={6} className="py-24 text-center"><FaSpinner className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="py-24 text-center font-bold text-slate-400 uppercase text-[10px] tracking-widest">Tidak ada data ditemukan</td></tr>
              ) : items.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200 shrink-0">
                          {item.Biblio?.image && <img src={item.Biblio.image} className="w-full h-full object-cover" alt="cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-slate-800 tracking-tighter line-clamp-1">{item.Biblio?.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">BIB-ID: {item.biblioId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div 
                      onClick={() => setZoomQR({ code: item.registerNumber, title: item.Biblio?.title })}
                      className="flex flex-col items-center justify-center bg-white p-2 w-fit mx-auto cursor-zoom-in hover:border-blue-400 hover:shadow-md transition-all group border border-transparent rounded-lg"
                    >
                      <QRCodeSVG value={item.registerNumber} size={42} level="H" />
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-mono text-xs font-bold text-blue-600">{item.registerNumber}</td>
                  <td className="px-6 py-5 text-center text-[11px] font-bold text-slate-500 uppercase">{item.callNumber || '-'}</td>
                  <td className="px-6 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${item.status === 'Tersedia' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                       {item.status || 'Tersedia'}
                      </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(item)} // Panggil handleOpenModal dengan data item ini
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Edit size={14}/>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Halaman {currentPage} dari {totalPages}</span>
            <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="p-3 bg-white border border-slate-300 rounded-xl disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-all"><ChevronLeft size={18}/></button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} className="p-3 bg-white border border-slate-300 rounded-xl disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-all"><ChevronRight size={18}/></button>
            </div>
        </div>
      </main>

      {/* --- MODAL ZOOM QRCODE (Tetap Sama) --- */}
      <AnimatePresence>
        {zoomQR && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoomQR(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
              <button onClick={() => setZoomQR(null)} className="absolute top-6 right-6 p-2 bg-red-600 text-white hover:bg-red-500 active:scale-[0.97] rounded-full transition-colors"><X size={20} /></button>
              <div className="mb-6 mt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Digital Asset Identity</p>
                <h3 className="text-lg font-black text-slate-800 leading-tight uppercase tracking-tighter line-clamp-2">{zoomQR.title}</h3>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 inline-block mb-6 shadow-inner">
                <QRCodeSVG value={zoomQR.code} size={200} level="H" includeMargin={true} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daftarkan Nomor</p>
                <p className="text-2xl font-mono font-black text-blue-600 tracking-[0.2em]">{zoomQR.code}</p>
              </div>
             <button 
                onClick={() => {
                  // 1. Simpan judul asli halaman
                  const originalTitle = document.title;
                  
                  // 2. Ambil Tanggal dan Waktu (Jam-Menit-Detik)
                  const now = new Date();
                  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
                  const timeStr = now.getHours().toString().padStart(2, '0') + 
                                  now.getMinutes().toString().padStart(2, '0') + 
                                  now.getSeconds().toString().padStart(2, '0'); // HHMMSS

                  // Hasil format: QRCode-A001-2026-03-04-153045
                  document.title = `QRCode-${zoomQR.code}-${dateStr}-${timeStr}`;
                  
                  // 3. Jalankan print
                  window.print();
                  
                  // 4. Kembalikan judul asli
                  setTimeout(() => {
                    document.title = originalTitle;
                  }, 1000);
                }} 
                className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-colors"
              >
                Cetak Label Satuan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SIDEBAR DRAWER: REGISTRASI EKSEMPLAR --- */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-y-0 right-0 w-full max-w-xl flex">
            <Transition.Child as={Fragment} enter="transform transition duration-500 ease-in-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-400 ease-in-out" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full w-full bg-white p-10 shadow-2xl overflow-y-auto flex flex-col border-l border-slate-100">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Asset Registry</span>
                    <Dialog.Title className="text-3xl font-black uppercase tracking-tighter text-slate-900">
                      {selectedItem ? "Perbarui" : "Daftarkan"} <span className="text-blue-600">Eksemplar</span>
                    </Dialog.Title>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 rounded-3xl hover:bg-rose-50 hover:text-rose-600 transition-all"><X size={20}/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <Field label="Koleksi Bibliografi (Master Buku)">
                    <div className="relative group">
                      <select 
                        name="biblioId" 
                        defaultValue={selectedItem?.biblioId} 
                        className="w-full bg-slate-50 text-blue-900 px-6 py-5 rounded-[1.5rem] font-bold text-sm outline-none border border-slate-100 focus:border-blue-500 focus:bg-white appearance-none cursor-pointer transition-all shadow-inner"  
                        required
                      >
                        <option value="">-- Pilih Judul Buku --</option>
                        {biblios.map((b: any) => (
                          <option key={b.biblioId} value={b.biblioId}>{b.title}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronRight size={16} className="rotate-90" /></div>
                    </div>
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="No. Barcode / Register">
                      <input 
                        name="registerNumber" 
                        defaultValue={selectedItem?.registerNumber} 
                        onChange={() => setRegisterError(null)} // Reset error saat user mulai mengetik ulang
                        className={clsx(
                          "w-full bg-slate-50 text-blue-900 px-6 py-5 rounded-[1.5rem] font-bold text-sm outline-none border transition-all shadow-inner",
                          // LOGIKA BORDER MERAH
                          registerError 
                            ? "border-rose-500 bg-rose-50 ring-4 ring-rose-500/10" 
                            : "border-slate-100 focus:border-blue-500 focus:bg-white"
                        )} 
                        placeholder="Contoh: A-0001" 
                        required 
                      />
                      
                      {/* TAMPILKAN PESAN ERROR DI BAWAH INPUT */}
                      {registerError && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] font-bold text-rose-500 uppercase tracking-tight ml-4 mt-1"
                        >
                          ⚠️ {registerError}
                        </motion.p>
                      )}
                    </Field>
                    <Field label="Call Number">
                      <input name="callNumber" defaultValue={selectedItem?.callNumber} className="w-full bg-slate-50 px-6 py-5 text-blue-900 rounded-[1.5rem] font-bold text-sm outline-none border border-slate-100 focus:border-blue-500 focus:bg-white transition-all shadow-inner" placeholder="800.12..." />
                    </Field>
                  </div>

                  <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50 space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 text-center">Status Aset</p>
                    <div className="flex gap-4">
                      {['Tersedia', 'Perbaikan', 'Hilang'].map((status) => (
                        <label key={status} className="flex-1">
                          <input type="radio" name="status" value={status} defaultChecked={selectedItem?.status === status || (!selectedItem && status === 'Tersedia')} className="hidden peer" />
                          <div className="text-center py-3 rounded-2xl bg-white border border-slate-100 text-[10px] font-black text-blue-600 uppercase tracking-tighter peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 cursor-pointer transition-all shadow-sm">
                            {status}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 mt-4">
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <Plus size={18} />} 
                    {selectedItem ? "Perbarui" : "Simpan"} Eksemplar
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