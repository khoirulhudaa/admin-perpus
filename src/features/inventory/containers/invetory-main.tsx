import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Barcode,
  CheckCircle2,
  FileText,
  Library,
  Plus,
  RotateCw,
  Search,
  X
} from "lucide-react";
import React, { Fragment, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BASE_URL = "https://be-perpus.vercel.app";

export default function StockOpnameMain() {
  const queryClient = useQueryClient();
  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null); // State untuk Modal Detail
  const [activeSession, setActiveSession] = useState<any>(null);
  const [scanInput, setScanInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastScan, setLastScan] = useState<{ status: 'success' | 'error', message: string } | null>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);

  // --- QUERY: DAFTAR SESI ---
  const { data: sessions = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ["stock-opname", schoolId],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/inventory/sessions?schoolId=${schoolId}`);
      const json = await res.json();
      return json.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
    enabled: !!schoolId,
  });

  // --- QUERY: DETAIL SCAN (Aktif saat report dipilih) ---
  const { data: scanLogs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ["stock-opname-logs", selectedReport?.id],
    queryFn: async () => {
      // Pastikan endpoint ini sesuai dengan yang ada di backend
      const res = await fetch(`${BASE_URL}/inventory/sessions/${selectedReport.id}/logs`);
      const json = await res.json();
      return json.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
    enabled: !!selectedReport?.id, // Query hanya akan jalan jika selectedReport tidak null
  });
  
  // --- QUERY: SETTING PERPUSTAKAAN ---
  const { data: libSettings } = useQuery({
    queryKey: ["librarySettings", schoolId],
    queryFn: async () => {
      const res = await fetch(`https://be-perpus.vercel.app/setting?schoolId=${schoolId}`);
      const json = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
    enabled: !!schoolId,
  });

  // --- ACTION: BUAT SESI ---
  const handleCreateSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`${BASE_URL}/inventory/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.get("name"), schoolId })
      });
      if ((await res.json()).success) {
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["stock-opname"] });
      }
    } finally { setIsSubmitting(false); }
  };

  // --- ACTION: PROSES SCAN ---
  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput || !activeSession) return;

    try {
      const res = await fetch(`${BASE_URL}/inventory/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockOpnameId: activeSession.id,
          registerNumber: scanInput,
          schoolId: schoolId
        })
      });
      const result = await res.json();

      if (result.success) {
        setLastScan({ status: 'success', message: `TERCATAT: ${scanInput}` });
        queryClient.invalidateQueries({ queryKey: ["stock-opname"] });
        // Update counter lokal agar UI responsif
        setActiveSession((prev: any) => ({
          ...prev,
          total_scanned: (parseInt(prev.total_scanned) || 0) + 1
        }));
      } else {
        setLastScan({ status: 'error', message: result.message || "Gagal" });
      }
    } catch (err) {
      setLastScan({ status: 'error', message: "Gangguan Server" });
    } finally {
      setScanInput("");
      scanInputRef.current?.focus();
    }
  };

  // --- ACTION: FINALISASI ---
  const handleFinalize = async (id: number) => {
    if (!confirm("PERINGATAN: Buku yang tidak terpindai akan otomatis berubah status menjadi 'MENGHILANG'. Lanjutkan?")) return;
    try {
      const res = await fetch(`${BASE_URL}/inventory/finalize/${id}`, { method: 'PUT' });
      if ((await res.json()).success) {
        alert("Stock Opname Berhasil Diselesaikan!");
        setActiveSession(null);
        queryClient.invalidateQueries({ queryKey: ["stock-opname"] });
      }
    } catch (err) { alert("Gagal finalisasi"); }
  };

  const handleDownloadPDF = () => {
      if (!selectedReport || scanLogs.length === 0) {
        alert("Tidak ada data log untuk diunduh");
        return;
      }

      const doc = new jsPDF();
      
      // --- 1. KOP TEKSTUAL (Berdasarkan Library Settings) ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(libSettings?.libraryName?.toUpperCase() || "NAMA PERPUSTAKAAN", 105, 15, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(libSettings?.address || "Alamat perpustakaan belum diatur", 105, 21, { align: "center" });
      
      // Garis Pemisah Kop (Double Line)
      doc.setLineWidth(0.8);
      doc.line(14, 26, 196, 26);
      doc.setLineWidth(0.2);
      doc.line(14, 27, 196, 27);

      // --- 2. JUDUL LAPORAN ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("LAPORAN HASIL STOCK OPNAME (AUDIT INVENTARIS)", 14, 38);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Nama Sesi   : ${selectedReport.name}`, 14, 46);
      doc.text(`ID Audit    : #${selectedReport.id}`, 14, 51);
      doc.text(`Tanggal     : ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 56);
      doc.text(`Total Buku  : ${scanLogs.length} Item Terverifikasi`, 14, 61);

      // --- 3. TABEL DATA ---
      const tableColumn = ["NO", "JUDUL BUKU", "NOMOR REGISTRASI", "WAKTU SCAN"];
      const tableRows = scanLogs.map((log: any, index: number) => [
        index + 1,
        log.Eksemplar?.Biblio?.title?.toUpperCase() || "N/A",
        log.Eksemplar?.registerNumber || "N/A",
        log.scannedAt ? new Date(log.scannedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : "-",
      ]);

      autoTable(doc, {
        startY: 68,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], fontSize: 9, halign: 'center' }, // Slate-800
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          2: { cellWidth: 45, halign: 'center' },
          3: { cellWidth: 35, halign: 'center' },
        }
      });

      // --- 4. AREA TANDA TANGAN (TTD & NAMA KEPALA) ---
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      const signatureX = 135;

      // Cek jika ruang tidak cukup di halaman akhir
      if (finalY > 240) doc.addPage();

      const tglSekarang = new Date().toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });

      doc.setFontSize(10);
      doc.text(`Ditetapkan di: ____________, ${tglSekarang}`, signatureX, finalY);
      doc.text("Kepala Perpustakaan,", signatureX, finalY + 7);
      
      // Render Gambar TTD jika ada di setting
      if (libSettings?.signatureImg) {
        try {
          doc.addImage(libSettings.signatureImg, 'PNG', signatureX, finalY + 10, 35, 18);
        } catch (e) {
          console.error("TTD gagal dimuat", e);
        }
      }

      // Nama dan NIP (Disesuaikan dengan field di LibrarySettingsMain)
      doc.setFont("helvetica", "bold");
      const namaKepala = libSettings?.librarianName || "__________________________";
      doc.text(namaKepala, signatureX, finalY + 32);
      
      // Garis bawah nama
      const textWidth = doc.getTextWidth(namaKepala);
      doc.line(signatureX, finalY + 33, signatureX + textWidth, finalY + 33);
      
      doc.setFont("helvetica", "normal");
      doc.text(`NIP. ${libSettings?.librarianId || "__________________________"}`, signatureX, finalY + 38);

      // --- 5. SAVE PDF ---
      doc.save(`Audit_${selectedReport.name.replace(/\s+/g, '_')}.pdf`);
    };

  return (
    <div className="min-h-screen">
      <header className="mb-8 md:flex justify-between items-center">
         <div className="md:mb-0 mb-4">
          <div className="flex items-center gap-2 mb-2 font-black text-blue-600 uppercase tracking-[0.3em] text-[10px]"><Library size={14} /> Inventory data</div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-800">Master <span className="text-blue-600">Invetory</span></h1>
        </div>
      
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="h-14 w-14 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-sm border border-slate-200 hover:bg-blue-700 transition-all active:rotate-180 duration-500 disabled:opacity-50"
            title="Refresh Data"
          >
            <RotateCw size={20} className={isFetching ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="h-14 px-8 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
            <Plus size={16} /> Buka Sesi Baru
          </button>
        </div> 
      </header>

      <main className="grid grid-cols-12 gap-8">
        {/* Kolom Kiri: Scanner */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[1.4rem] shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <Barcode size={14}/> Scanner Terminal
            </h3>
            
            {activeSession ? (
              <div className="space-y-6">
                <form onSubmit={handleScan} className="space-y-4">
                  <input 
                    ref={scanInputRef} autoFocus placeholder="Scan No. Registrasi..." 
                    className="w-full bg-slate-100 p-5 text-slate-700 rounded-2xl font-bold outline-none focus:ring-2 ring-blue-500 transition-all text-center text-lg"
                    value={scanInput} onChange={(e) => setScanInput(e.target.value)}
                  />
                  <AnimatePresence mode="wait">
                    {lastScan && (
                      <motion.div key={lastScan.message} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`p-4 rounded-xl flex items-center justify-center gap-2 border ${lastScan.status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                        {lastScan.status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{lastScan.message}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                <div className="bg-slate-900 rounded-[1.4rem] p-6 text-white space-y-4 shadow-2xl shadow-slate-200">
                  <div className="flex justify-between items-center text-slate-400 font-black uppercase text-[9px] tracking-[0.2em]">
                    <span>Current Progress</span>
                    <Activity size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-4xl font-black tabular-nums">{activeSession.total_scanned || 0}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Items Scanned</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex gap-2">
                    <button onClick={() => handleFinalize(activeSession.id)} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Finalisasi</button>
                    <button onClick={() => setActiveSession(null)} className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><X size={16} /></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-[2rem]">
                <div className="h-16 w-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4"><Search size={24}/></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pilih Sesi Di Tabel</p>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Tabel */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[1.4rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 uppercase text-[10px] font-black text-slate-400 tracking-widest">
              <tr>
                <th className="px-8 py-6">Audit Info</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sessions.map((so: any) => (
                <tr key={so.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-800 text-sm uppercase">{so.name}</div>
                    <div className="flex gap-3 mt-1 text-[9px] font-bold uppercase tracking-tighter">
                      <span className="text-slate-400">ID: #{so.id}</span>
                      <span className="text-blue-500">Scan: {so.total_scanned || 0}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${so.status === 'Aktif' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>{so.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {so.status === 'Aktif' ? (
                      <button onClick={() => { setActiveSession(so); setTimeout(() => scanInputRef.current?.focus(), 100); }} 
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all">Select</button>
                    ) : (
                      <button onClick={() => setSelectedReport(so)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                        <FileText size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* --- SIDEBAR: CREATE NEW SESSION --- */}
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-y-0 right-0 w-full max-w-xl flex">
            <Transition.Child as={Fragment} enter="transform transition duration-500" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-400" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full w-full bg-white p-10 shadow-2xl flex flex-col">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tighter">Audit <span className="text-blue-600">Session</span></h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Initialize New Database Check</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 rounded-3xl hover:bg-rose-50 hover:text-rose-600 transition-all"><X size={20}/></button>
                </div>
                <form onSubmit={handleCreateSession} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-1">Nama Sesi (Contoh: Opname Semester Ganjil 2024)</label>
                    <input name="name" required placeholder="Input Session Name..." className="w-full bg-slate-100 border-none text-slate-900 rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 ring-blue-500 outline-none shadow-inner" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-200">
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : "Save & Open Session"}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* --- SIDEBAR: AUDIT REPORT DETAIL (Saat klik FileText) --- */}
      <Transition show={!!selectedReport} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setSelectedReport(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-y-0 right-0 w-full max-w-2xl flex">
            <Transition.Child as={Fragment} enter="transform transition duration-500 ease-in-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-400" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full w-full bg-white p-12 shadow-2xl flex flex-col overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-blue-900">Audit <span className="text-blue-600">Results</span></h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">{selectedReport?.name}</p>
                  </div>
                  <button onClick={() => setSelectedReport(null)} className="relative top-[-6px] active:scale-[0.97] p-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition-all"><X size={30}/></button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-blue-50 p-6 rounded-[1.8rem]">
                    <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest">Ditemukan</span>
                    <h4 className="text-3xl font-black text-blue-700">{selectedReport?.total_scanned || 0}</h4>
                  </div>
                  <div className="bg-rose-50 p-6 rounded-[1.8rem]">
                    <span className="text-[9px] font-black uppercase text-rose-500 tracking-widest">Tidak Ada</span>
                    <h4 className="text-3xl font-black text-rose-700">Audit Selesai</h4>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 sticky top-0 bg-white py-2 z-10">
                    Item Log Preview
                  </h5>
                  
                  <div className="space-y-3">
                    {isLoadingLogs ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <FaSpinner className="animate-spin text-blue-600" size={24} />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Loading Logs...</span>
                      </div>
                    ) : scanLogs && scanLogs.length > 0 ? (
                      scanLogs.map((log: any) => (
                        <div key={log.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 hover:bg-white transition-all duration-300">
                          <div className="flex gap-4 items-center">
                            {/* Icon Status */}
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 bg-blue-600 text-white transition-all">
                              <CheckCircle2 size={18} />
                            </div>
                            
                            <div>
                              {/* Judul diambil dari Biblio melalui Eksemplar */}
                              <p className="text-xs font-black uppercase text-slate-700 tracking-tight line-clamp-1">
                                {log.Eksemplar?.Biblio?.title || "Judul Tidak Diketahui"}
                              </p>
                              
                              {/* Info Registrasi & Waktu */}
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                                  REG: {log.Eksemplar?.registerNumber || "N/A"}
                                </p>
                                <span className="text-slate-300 text-[8px]">•</span>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                  {log.scannedAt ? new Date(log.scannedAt).toLocaleTimeString('id-ID') : new Date(log.createdAt).toLocaleTimeString('id-ID')}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[8px] bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full font-black uppercase tracking-tighter">
                              Verified
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center gap-3">
                        <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                          <CheckCircle2 size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Belum ada item yang dipindai
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleDownloadPDF}
                  disabled={scanLogs.length === 0}
                  className="mt-8 w-full py-5 border-2 bg-red-600 border-white text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-700 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download PDF Report
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}