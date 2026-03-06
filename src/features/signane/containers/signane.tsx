import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import {
  Book,
  CheckCircle,
  Home,
  Loader2,
  LogIn,
  LogOut,
  Monitor,
  RefreshCw,
  Search,
  Smartphone,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://be-perpus.vercel.app";

type KioskMode = "MASUK" | "PULANG" | "PINJAM" | "CARI" | "KEMBALI";

export default function DigitalSignageKiosk() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Untuk manual refresh
  const [isPortrait, setIsPortrait] = useState(true);
  const [mode, setMode] = useState<KioskMode>("MASUK");

  const schoolQuery = useSchool();
  const SCHOOL_ID = schoolQuery?.data?.[0]?.id;

  // Data States
  const [searchQuery, setSearchQuery] = useState("");
  const [targetEksemplar, setTargetEksemplar] = useState<any>(null);

  // UI States
  const [showScanner, setShowScanner] = useState(false);
  const [scannedResult, setScannedResult] = useState<{ status: boolean; msg: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false); // Loading khusus saat post API

  // Refs
  const successAudio = useRef<HTMLAudioElement | null>(null);
  const errorAudio = useRef<HTMLAudioElement | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // --- REACT QUERY FETCHING ---
  const {
    data: eksemplars = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["eksemplars", SCHOOL_ID, searchQuery],
    queryFn: async () => {
      if (!SCHOOL_ID) return [];
      const res = await axios.get(`${BASE_URL}/eksemplar`, {
        params: {
          schoolId: SCHOOL_ID,
          q: searchQuery,
          limit: 1000,
        },
      });
      return res.data.data || [];
    },
    enabled: !!SCHOOL_ID && (mode === "PINJAM" || mode === "CARI"),
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,   // 10 Menit
  });

  // --- LOGIKA VIRTUAL SCROLL ---
  const columns = isPortrait ? 1 : 2;
  const rowCount = Math.ceil(eksemplars.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isPortrait ? 480 : 420),
    overscan: 5,
  });

  // Initialize Audio
  useEffect(() => {
    successAudio.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    errorAudio.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2959/2959-preview.mp3");
  }, []);

  // API ACTION HANDLER (POST)
  const handleApiAction = async (decodedText: string) => {
    if (!SCHOOL_ID) return;
    setActionLoading(true);

    try {
      let endpoint = "";
      let payload: any = { schoolId: SCHOOL_ID };

      if (mode === "MASUK" || mode === "PULANG") {
        endpoint = `${BASE_URL}/peminjam/kehadiran`;
        payload = { ...payload, qrCodeData: decodedText, mode: mode };
      } else if (mode === "PINJAM") {
        endpoint = `${BASE_URL}/peminjam/pinjam`;
        payload = { ...payload, qrCodeData: decodedText, registerNumber: targetEksemplar?.registerNumber };
      } else if (mode === "KEMBALI") {
        endpoint = `${BASE_URL}/peminjam/kembali`;
        payload = { ...payload, registerNumber: decodedText };
      }

      const res = await axios.post(endpoint, payload);

      if (res.data.success) {
        successAudio.current?.play();
        setScannedResult({ status: true, msg: res.data.message });
        // Invalidate cache agar data buku terbaru di-fetch ulang setelah transaksi
        queryClient.invalidateQueries({ queryKey: ["eksemplars"] });
      }
    } catch (err: any) {
      errorAudio.current?.play();
      setScannedResult({ status: false, msg: err.response?.data?.message || "Gagal memproses data" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setScannedResult(null), 5000);
    }
  };

  // SCANNER LOGIC
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    let isMounted = true;

    const startScanner = async () => {
      const isAutoScanMode = mode === "MASUK" || mode === "PULANG" || mode === "KEMBALI";
      const shouldRun = isAutoScanMode || (mode === "PINJAM" && showScanner);
      if (!shouldRun) return;

      await new Promise((r) => setTimeout(r, 300));

      const elementId = isAutoScanMode ? "reader-inline" : "reader-modal";
      const readerElement = document.getElementById(elementId);
      if (!readerElement) return;

      html5QrCode = new Html5Qrcode(elementId);

      try {
        const config = {
          fps: 20,
          qrbox: { width: 550, height: 550 },
          disableFlip: false,
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          async (decodedText) => {
            if (!isMounted) return;
            if (html5QrCode?.isScanning) await html5QrCode.stop();
            await handleApiAction(decodedText);
            if (mode === "PINJAM") setShowScanner(false);
            if (isAutoScanMode) {
              setTimeout(() => {
                if (isMounted) startScanner();
              }, 4000);
            }
          },
          () => {}
        );
      } catch (err) {
        console.error("Kamera Error:", err);
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [showScanner, targetEksemplar, mode]);

  return (
    <div className={`min-h-screen bg-slate-200 flex items-start justify-center font-sans transition-all ${isPortrait ? "py-10 overflow-hidden" : "p-0 overflow-y-auto"}`}>
      <div className={`bg-white flex flex-col shadow-2xl transition-all duration-700 relative ${isPortrait ? "w-[1080px] h-[1920px] border-[16px] border-white" : "w-full min-h-screen"}`}>
        
        {/* HEADER AREA */}
        <header className={`${isPortrait ? "h-[350px]" : "h-[220px]"} relative bg-blue-600 p-12 text-white flex flex-col justify-end overflow-hidden transition-all`}>
          <div className={`absolute top-12 left-12 border p-2 border-white/80 h-max w-max ${!isPortrait ? "hidden" : "flex"} items-start px-[12px] justify-start gap-2`}>
            <p className="text-lg font-bold uppercase opacity-70">Halaman utama / Signage mode</p>
          </div>

          <div className="absolute top-12 right-6 flex gap-3 z-50">
            {/* Tombol Refresh Manual */}
            {(mode === "PINJAM" || mode === "CARI") && (
              <button 
                onClick={() => refetch()} 
                disabled={isRefetching}
                className="bg-green-500 p-3 shadow-xl hover:bg-green-600 rounded-xl transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`text-white ${isRefetching ? 'animate-spin' : ''}`} size={23.6} />
              </button>
            )}
            <button onClick={() => navigate("/")} className="bg-white p-3 shadow-xl hover:bg-slate-100 rounded-xl">
              <Home className="text-blue-600" size={23.6} />
            </button>
            <button onClick={() => setIsPortrait(!isPortrait)} className="bg-orange-500 hover:bg-orange-600 text-white p-3 shadow-xl rounded-xl">
              {isPortrait ? <Monitor size={23.6} className="text-white" /> : <Smartphone size={24} className="text-white" />}
            </button>
          </div>

          <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" alt="Library Background" />

          <div className="z-10">
            <h1 className="text-6xl font-black tracking-tighter mb-4">E-LIBRARY <span className="text-blue-200">SCREEN</span></h1>
            <div className="backdrop-blur-md w-fit p-1 rounded-lg">
              <h2 className="text-2xl font-black uppercase tracking-tight">LAYANAN {mode}</h2>
              <p className="opacity-80 font-medium text-lg">Perpustakaan Digital Mandiri.</p>
            </div>
          </div>
        </header>

        {/* NAVIGATION TAB */}
        <nav className="flex bg-slate-50 p-6 gap-4 border-b">
          {[
            { id: "MASUK", label: "MASUK", icon: <LogIn size={32} />, color: "bg-blue-600" },
            { id: "PULANG", label: "PULANG", icon: <LogOut size={32} />, color: "bg-rose-600" },
            { id: "PINJAM", label: "PINJAM", icon: <Book size={32} />, color: "bg-blue-600" },
            { id: "KEMBALI", label: "KEMBALI", icon: <RefreshCw size={32} />, color: "bg-emerald-600" },
            { id: "CARI", label: "CARI", icon: <Search size={32} />, color: "bg-slate-700" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMode(item.id as KioskMode);
                setSearchQuery("");
                setShowScanner(false);
              }}
              className={`flex-1 py-8 rounded-3xl font-black text-xl transition-all flex flex-col items-center justify-center gap-2 ${
                mode === item.id ? `${item.color} text-white shadow-2xl border border-slate-200` : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* DYNAMIC CONTENT */}
        <main ref={parentRef} className="flex-1 overflow-y-auto py-6 bg-slate-50/20 px-8">
          {mode === "MASUK" || mode === "PULANG" || mode === "KEMBALI" ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className={`w-full aspect-square bg-black rounded-[2rem] overflow-hidden shadow-2xl relative mb-12`}>
                <div id="reader-inline" className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover"></div>
                <div className="absolute inset-0 border-[4px] border-white/30 pointer-events-none animate-pulse"></div>
                {actionLoading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
                    <Loader2 className="animate-spin text-white" size={60} />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-5xl font-black text-slate-800 uppercase tracking-tighter">SCAN {mode}</h3>
                <p className="text-md text-slate-500 font-medium max-w-xl">
                  {mode === "KEMBALI" ? "Silakan tunjukkan Barcode pada Buku ke arah kamera." : "Silakan tunjukkan Barcode pada Kartu Pelajar Anda ke arah kamera."}
                </p>
              </div>
              <div className={`mt-12 flex items-center gap-4 px-8 py-4 rounded-full font-black text-xl ${mode === "MASUK" ? "bg-blue-50 text-blue-600" : mode === "PULANG" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                <Volume2 size={32} /> SISTEM SIAP MENERIMA SCAN
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="relative group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={32} />
                <input
                  className="w-full h-24 bg-white border-2 text-slate-900 border-blue-600 rounded-3xl pl-24 pr-10 text-2xl font-bold transition-all outline-none"
                  placeholder="Ketik Judul, No. Register..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && refetch()}
                />
              </div>

              {isLoading ? (
                <div className="col-span-full flex flex-col items-center py-32">
                  <Loader2 className="animate-spin text-blue-600" size={80} />
                </div>
              ) : (
                /* IMPLEMENTASI VIRTUAL SCROLL GRID */
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const startIndex = virtualRow.index * columns;
                    const itemsInRow = eksemplars.slice(startIndex, startIndex + columns);

                    return (
                      <div
                        key={virtualRow.key}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                          display: "grid",
                          gridTemplateColumns: `repeat(${columns}, 1fr)`,
                          gap: "2rem",
                          paddingBottom: "2rem",
                        }}
                      >
                        {itemsInRow.map((eks: any) => (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={eks.id} className="bg-white p-8 rounded-3xl border-2 border-blue-600 flex flex-col shadow-sm h-full">
                            <div className="flex gap-8 mb-8">
                              <div className="w-44 h-44 bg-slate-50 p-4 rounded-3xl flex-shrink-0 border flex items-center justify-center">
                                {eks.Biblio?.image ? <img src={eks.Biblio.image} loading="lazy" className="w-full h-full object-cover rounded-2xl" /> : <Book size={60} className="text-slate-200" />}
                              </div>
                              <div className="flex-1 space-y-3">
                                <div className="w-max flex items-center gap-2">
                                  <span className={`px-6 py-2 rounded-md font-black text-sm uppercase ${eks.status === "Tersedia" ? "bg-blue-600 text-white" : "bg-red-600 text-white"}`}>{eks.status}</span>
                                  <span className="px-6 py-2 bg-blue-50 text-blue-700 rounded-md font-mono font-black text-sm">#{eks.registerNumber}</span>
                                </div>
                                <h4 className="text-3xl font-black text-slate-800 leading-tight uppercase line-clamp-2">{eks.Biblio?.title}</h4>
                                <h4 className="text-md font-medium text-slate-800 leading-tight uppercase line-clamp-2">Penulis: {eks.Biblio?.sor}</h4>
                              </div>
                            </div>
                            <div className="mt-auto flex justify-between items-center pt-8 border-t-2 border-blue-600">
                              {mode === "PINJAM" && (
                                <button
                                  disabled={eks.status !== "Tersedia"}
                                  onClick={() => {
                                    setTargetEksemplar(eks);
                                    setShowScanner(true);
                                  }}
                                  className={`px-6 py-4 rounded-lg font-medium text-sm transition-all shadow-xl active:scale-95 ${
                                    eks.status === "Tersedia" ? "bg-slate-900 text-white hover:bg-blue-600" : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                  }`}
                                >
                                  PINJAM BUKU SEKARANG
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="p-10 text-center border-t flex justify-center items-center bg-white shrink-0">
          <p className="text-md font-medium text-slate-500 tracking-wider">Signane Xpresensi v1.0.0</p>
        </footer>

        {/* MODAL SCANNER PINJAM */}
        <AnimatePresence>
          {showScanner && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-xl h-[100vh] flex items-center justify-center">
              <div className="w-full max-w-4xl relative">
                <button
                  onClick={() => setShowScanner(false)}
                  className="absolute z-[99999] top-4 right-4 text-red-600 flex items-center justify-center bg-white rounded-xl p-2 w-12 h-12 hover:brightness-95 active:scale-[0.97] shadow-2xl"
                >
                  <X size={32} />
                </button>
                <div id="reader-modal" className="w-full h-[80vh] aspect-square overflow-hidden bg-white rounded-3xl shadow-2xl"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NOTIFIKASI BERHASIL / GAGAL */}
        <AnimatePresence>
          {scannedResult && (
            <motion.div
              initial={{ y: 200, x: "-50%", opacity: 0 }}
              animate={{ y: 0, x: "-50%", opacity: 1 }}
              exit={{ y: 200, x: "-50%", opacity: 0 }}
              className={`fixed bottom-10 left-1/2 text-white px-10 py-6 rounded-2xl w-max shadow-2xl flex items-center gap-6 z-[200] ${
                scannedResult.status ? (mode === "PULANG" ? "bg-rose-600" : "bg-blue-600") : "bg-red-700"
              }`}
            >
              {scannedResult.status ? <CheckCircle size={40} strokeWidth={3} /> : <X size={40} strokeWidth={3} />}
              <div className="flex flex-col">
                <div className="font-black text-3xl uppercase tracking-tighter">{scannedResult.status ? "TRANSAKSI BERHASIL" : "TRANSAKSI GAGAL"}</div>
                <div className="text-lg font-bold opacity-90">{scannedResult.msg}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}