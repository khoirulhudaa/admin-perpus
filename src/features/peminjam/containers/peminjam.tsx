import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Barcode,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Printer,
  Receipt,
  RotateCw,
  Search,
  User,
  X
} from "lucide-react";
import React, { Fragment, useCallback, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";

const BASE_URL = "https://be-perpus.vercel.app";

// --- Utility: CSS Classes ---
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

// --- Component: Hidden Receipt Template ---
const ReceiptTemplate = React.forwardRef(({ data }: any, ref: any) => {
  return (
    <div ref={ref} className="p-4 pt-6 text-slate-900 font-mono text-[12px] w-full leading-relaxed bg-white print:p-0">
      {/* CSS Khusus Print untuk Thermal 80mm */}
      <style>{`
       @media print {
          @page { 
            size: 80mm auto; /* Lebar statis 80mm, tinggi otomatis mengikuti konten */
            margin: 0; 
          }
          body { 
            margin: 0; 
          }
        }
      `}</style>

      {data ? (
        <div className="w-[96%] mx-auto mt-10 border-2 border-dashed border-slate-300 p-8 rounded-lg"> {/* 72mm adalah area cetak aman untuk kertas 80mm */}
          <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
            <h2 className="font-black uppercase text-[16px] leading-tight">Bukti Pinjam</h2>
            <p className="text-[10px] uppercase tracking-widest">Digital Library System</p>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Tgl:</span> 
              <span className="font-bold">{new Date().toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Nama:</span> 
              <span className="font-bold uppercase">{data.peminjamName}</span>
            </div>
            <div className="flex justify-between">
              <span>ID:</span> 
              <span className="font-bold">{data.peminjamId}</span>
            </div>
            
            <div className="border-t border-slate-200 my-2 pt-2">
              <p className="text-[10px] text-slate-500 uppercase mb-1">Judul Buku:</p>
              <p className="font-bold leading-tight uppercase italic text-[13px]">
                {data.Eksemplar?.Biblio?.title || 'Buku Perpustakaan'}
              </p>
              <p className="text-[11px] mt-1 font-bold text-blue-700 tracking-widest">
                [{data.Eksemplar?.registerNumber}]
              </p>
            </div>
          </div>

          <div className="bg-slate-100 p-3 rounded-lg text-center border border-slate-200">
            <p className="text-[9px] uppercase font-black text-slate-500 mb-1">Batas Kembali</p>
            <p className="font-black text-[18px] text-rose-600">{data.tglKembali}</p>
          </div>

          <div className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-tighter italic leading-tight">
            * simpan struk ini sebagai bukti *<br/>
            terima kasih atas kunjungan anda
          </div>
          
          {/* Padding bawah agar kertas tidak langsung terpotong di teks terakhir */}
          <div className="h-10"></div> 
        </div>
      ) : (
        <div className="opacity-0">Loading...</div>
      )}
    </div>
  );
});

// --- Reusable Alert ---
const Alert: React.FC<{ message: string; type: "success" | "error"; onClose: () => void }> = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    className={clsx(
      "flex items-center justify-between px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl w-full max-w-md fixed top-8 left-1/2 -translate-x-1/2 z-[100]",
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

// --- API Fetchers ---
const fetchLoans = async ({ schoolId, searchTerm, filterStatus, currentPage }: any) => {
  if (!schoolId) return null;
  const url = `${BASE_URL}/peminjam?schoolId=${schoolId}&q=${searchTerm}&status=${filterStatus}&page=${currentPage}&limit=10`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
};

const fetchAvailableBooks = async (schoolId: string) => {
  const res = await fetch(`${BASE_URL}/eksemplar?schoolId=${schoolId}&status=Tersedia&limit=100`);
  const json = await res.json();
  return json.data || [];
};

export default function PeminjamanMain() {
  const queryClient = useQueryClient();
  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  // --- Printing Logic ---
  const printRef = useRef(null); // Ini akan menjadi contentRef
  const [selectedForPrint, setSelectedForPrint] = useState<any>(null);
  
  const handlePrint = useReactToPrint({
    // Gunakan contentRef, bukan content
    contentRef: printRef, 
    documentTitle: "Struk_Peminjaman",
    onAfterPrint: () => setSelectedForPrint(null),
  });

  const triggerPrint = (loan: any) => {
    // 1. Update data
    setSelectedForPrint(loan);
    
    // 2. Beri jeda kecil agar React melakukan re-render pada ReceiptTemplate
    setTimeout(() => {
      handlePrint();
    }, 150); 
  };

  // --- UI States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean; type: "success" | "error" }>({ message: "", isVisible: false, type: "success" });

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, isVisible: true, type });
    setTimeout(() => setAlert(prev => ({ ...prev, isVisible: false })), 5000);
  }, []);

  // --- React Query ---
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["loans", schoolId, searchTerm, filterStatus, currentPage],
    queryFn: () => fetchLoans({ schoolId, searchTerm, filterStatus, currentPage }),
    enabled: !!schoolId,
  });

  const { data: eksemplars = [] } = useQuery({
    queryKey: ["available-books", schoolId],
    queryFn: () => fetchAvailableBooks(schoolId),
    enabled: isModalOpen && !!schoolId,
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`${BASE_URL}/peminjam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, schoolId })
      });
      return res.json();
    },
    onSuccess: (res) => {
      if (res.success) {
        showAlert("Peminjaman berhasil dicatat");
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["loans"] });
        queryClient.invalidateQueries({ queryKey: ["available-books"] });
      } else throw new Error(res.message);
    },
    onError: (err: any) => showAlert(err.message, "error"),
  });

  const returnMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${BASE_URL}/peminjam/kembali/${id}`, { method: "PUT" });
      return res.json();
    },
    onSuccess: (res) => {
      showAlert(`Buku dikembalikan. Denda: Rp ${res.denda.toLocaleString()}`);
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
    onError: () => showAlert("Gagal memproses pengembalian", "error"),
  });

  const extendMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${BASE_URL}/peminjam/perpanjang/${id}`, { method: "PUT" });
      return res.json();
    },
    onSuccess: (res) => {
      if (res.success) {
        showAlert(`Diperpanjang s/d: ${res.newDeadline}`);
        queryClient.invalidateQueries({ queryKey: ["loans"] });
      } else throw new Error(res.message);
    },
    onError: (err: any) => showAlert(err.message, "error"),
  });

  const getLiveDenda = (tglKembali: string, status: string, dendaFinal: number) => {
    if (status === 'Kembali') return dendaFinal;
    const deadline = new Date(tglKembali);
    const today = new Date();
    if (today > deadline) {
      const diff = Math.ceil((today.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24));
      return diff * 1000;
    }
    return 0;
  };

  const loans = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="min-h-screen text-slate-900">
      {/* Container untuk print tersembunyi */}
      <div style={{ display: "none" }}>
        {/* Bungkus dalam div lain jika perlu, tapi pastikan printRef menempel ke ReceiptTemplate */}
        <ReceiptTemplate ref={printRef} data={selectedForPrint} />
      </div>

      <AnimatePresence>{alert.isVisible && <Alert {...alert} onClose={() => setAlert(prev => ({...prev, isVisible: false}))} />}</AnimatePresence>

      <header className="mb-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 font-black text-blue-600 uppercase tracking-[0.3em] text-[10px]"><Receipt size={14} /> Circulation Desk</div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-800">Sirkulasi <span className="text-blue-600">Peminjaman</span></h1>
          </div>
          <div className="flex gap-3">
          <button onClick={() => refetch()} disabled={isFetching} className="h-14 w-14 flex items-center justify-center bg-blue-600 text-white rounded-2xl border border-slate-200 hover:bg-blue-700 transition-all">
            <RotateCw size={20} className={isFetching ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl transition-all">
            <Plus size={16} /> Transaksi Baru
          </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-[1.4rem] shadow-sm border border-slate-100">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Cari Nama Peminjam atau NIS..." 
              className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-blue-500/20"
              value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none appearance-none cursor-pointer"
              value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Semua Status</option>
              <option value="Dipinjam">Aktif (Dipinjam)</option>
              <option value="Kembali">Selesai (Kembali)</option>
            </select>
          </div>
          <div className="flex items-center justify-end px-4 font-black text-[10px] text-slate-500 uppercase tracking-widest italic">
            {isFetching ? "Syncing..." : `${data?.meta?.totalItems || 0} Transaksi`}
          </div>
        </div>
      </header>

      <main className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden max-w-7xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Peminjam</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Info Buku</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Tenggat</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Denda</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={6} className="py-24 text-center"><FaSpinner className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
              ) : loans.length === 0 ? (
                <tr><td colSpan={6} className="py-24 text-center font-bold text-slate-400 uppercase text-[10px] tracking-widest">Tidak ada riwayat sirkulasi</td></tr>
              ) : loans.map((loan: any) => {
                const liveDenda = getLiveDenda(loan.tglKembali, loan.status, Number(loan.denda));
                const isOverdue = liveDenda > 0 && loan.status === 'Dipinjam';

                return (
                  <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><User size={18}/></div>
                        <div>
                          <p className="font-black text-sm text-slate-800 uppercase tracking-tighter">{loan.peminjamName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {loan.peminjamId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                        <p className="font-bold text-xs text-slate-700 line-clamp-1 italic">"{loan.Eksemplar?.Biblio?.title}"</p>
                        <p className="text-[9px] font-mono text-blue-500 font-bold mt-1 tracking-widest">{loan.Eksemplar?.registerNumber}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      {loan.status === 'Kembali' ? (
                        <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                          <CheckCircle2 size={12} /> Selesai
                        </span>
                      ) : isOverdue ? (
                        <span className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider animate-pulse inline-flex items-center gap-1.5">
                          <AlertCircle size={12} /> Terlambat
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                          <RotateCw size={10} className="animate-spin" /> Dipinjam
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={clsx("inline-flex flex-col items-center px-3 py-1 rounded-xl", isOverdue ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500")}>
                        <span className="text-[10px] font-black">{loan.tglKembali}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-black text-xs">
                       <span className={liveDenda > 0 ? "text-rose-600" : "text-emerald-500"}>
                         Rp {liveDenda.toLocaleString()}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                     <div className="flex justify-end gap-2">
                        {loan.status === 'Dipinjam' && (
                          <>
                            <button onClick={() => extendMutation.mutate(loan.id)} className="p-3 bg-orange-400 text-white rounded-xl hover:bg-orange-600 transition-all" title="Perpanjang"><RotateCw size={14} /></button>
                            <button onClick={() => returnMutation.mutate(loan.id)} className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-700 transition-all"><CheckCircle2 size={14}/></button>
                          </>
                        )}
                        <button onClick={() => triggerPrint(loan)} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-700 active:scale-90 transition-all">
                          <Printer size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Halaman {currentPage} dari {totalPages}</div>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-white border border-slate-300 rounded-xl disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-all"><ChevronLeft size={18} /></button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-white border border-slate-300 rounded-xl disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-all"><ChevronRight size={18} /></button>
          </div>
        </div>
      </main>

      {/* --- MODAL TRANSAKSI BARU --- */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-y-0 right-0 w-full max-w-xl flex">
            <Transition.Child as={Fragment} enter="transform transition duration-500 ease-in-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-400 ease-in-out" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full w-full bg-white p-8 shadow-2xl overflow-y-auto flex flex-col border-l border-slate-100">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Circulation Desk</span>
                    <Dialog.Title className="text-3xl font-black uppercase tracking-tighter text-slate-900">Transaksi <span className="text-blue-600">Baru</span></Dialog.Title>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 rounded-3xl hover:bg-rose-50 hover:text-rose-600 transition-all"><X size={20}/></button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  createMutation.mutate(Object.fromEntries(formData.entries()));
                }} className="space-y-8">
                  <Field label="Identitas Peminjam">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative"><User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input name="peminjamName" required className="w-full bg-slate-50 pl-14 pr-6 py-5 rounded-[1.5rem] font-bold text-sm outline-none border border-slate-100 focus:border-blue-500 focus:bg-white transition-all shadow-inner" placeholder="Nama Siswa" />
                      </div>
                      <div className="relative"><AlertCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input name="peminjamId" required className="w-full bg-slate-50 pl-14 pr-6 py-5 rounded-[1.5rem] font-bold text-sm outline-none border border-slate-100 focus:border-blue-500 focus:bg-white transition-all shadow-inner" placeholder="NIS / No Anggota" />
                      </div>
                    </div>
                  </Field>

                  <Field label="Pilih Buku (Eksemplar)">
                    <div className="relative group">
                      <Barcode className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <select name="eksemplarId" required className="w-full bg-slate-50 pl-14 text-blue-900 pr-6 py-5 rounded-[1.5rem] font-bold text-sm outline-none border border-slate-100 appearance-none cursor-pointer shadow-inner">
                        <option value="">-- Pilih Barcode Buku --</option>
                        {eksemplars.map((e: any) => (
                          <option key={e.id} value={e.id}>[{e.registerNumber}] {e.Biblio?.title}</option>
                        ))}
                      </select>
                    </div>
                  </Field>

                  <div className="grid grid-cols-2 gap-6 p-6 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50">
                    <Field label="Tgl Pinjam">
                      <input type="date" name="tglPinjam" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-white p-5 text-blue-900 rounded-2xl font-bold text-sm outline-none shadow-sm" />
                    </Field>
                    <Field label="Batas Kembali">
                      <input type="date" name="tglKembali" required className="w-full bg-white p-5 text-blue-900 rounded-2xl font-bold text-sm outline-none border border-blue-200 shadow-sm" />
                    </Field>
                  </div>

                  <button type="submit" disabled={createMutation.isPending} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-blue-700 shadow-2xl transition-all disabled:opacity-50">
                    {createMutation.isPending ? <FaSpinner className="animate-spin" /> : <Plus size={18} />} Proses Peminjaman
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