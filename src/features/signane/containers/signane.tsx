import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import {
  Activity,
  Book,
  CheckCircle,
  Clock,
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
  const queryClient = useQueryClient();
  const [isPortrait, setIsPortrait] = useState(true);
  const [mode, setMode] = useState<KioskMode>("MASUK");

  const schoolQuery = useSchool();
  const SCHOOL_ID = schoolQuery?.data?.[0]?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [targetEksemplar, setTargetEksemplar] = useState<any>(null);

  const [showScanner, setShowScanner] = useState(false);
  const [scannedResult, setScannedResult] = useState<{ status: boolean; msg: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const successAudio = useRef<HTMLAudioElement | null>(null);
  const errorAudio = useRef<HTMLAudioElement | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('id-ID'));

  // Clock Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio Initialization
  useEffect(() => {
    successAudio.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    errorAudio.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2959/2959-preview.mp3");
  }, []);

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
        params: { schoolId: SCHOOL_ID, q: searchQuery, limit: 1000 },
      });
      return res.data.data || [];
    },
    enabled: !!SCHOOL_ID && (mode === "PINJAM" || mode === "CARI"),
    staleTime: 5 * 60 * 1000,
  });

  const columns = isPortrait ? 1 : 2;
  const rowCount = Math.ceil(eksemplars.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (window.innerWidth < 768 ? 650 : 450),
    overscan: 5,
  });

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
          fps: 25,
          qrbox: { width: 450, height: 450 },
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
              setTimeout(() => { if (isMounted) startScanner(); }, 4000);
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
    <div className={`md:min-h-screen bg-slate-200 flex items-start justify-center font-sans transition-all ${isPortrait ? "md:py-10 overflow-hidden" : "p-0 overflow-y-auto"}`}>
      
      {/* CSS Animasi Custom */}
      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          position: absolute;
          width: 100%;
          height: 3px;
          background: #34d399;
          box-shadow: 0 0 15px #34d399;
          z-index: 20;
          animation: scan-line 3s linear infinite;
        }
      `}</style>

      <div className={`bg-white flex flex-col shadow-2xl transition-all duration-700 relative ${isPortrait ? "w-[1080px] md:h-[1920px] border-[16px] border-white" : "w-full md:min-h-screen"}`}>
        
        {/* HEADER AREA */}
        <header className={`${isPortrait ? "h-[280px] md:h-[350px]" : "h-[200px] md:h-[220px]"} relative bg-blue-600 p-6 md:p-12 text-white flex flex-col justify-end overflow-hidden transition-all`}>
          <div className="absolute top-12 md:right-6 flex gap-3 z-50">
            {(mode === "PINJAM" || mode === "CARI") && (
              <button onClick={() => refetch()} disabled={isRefetching} className="bg-green-500 p-3 shadow-xl hover:bg-green-600 rounded-xl transition-colors disabled:opacity-50">
                <RefreshCw className={`text-white ${isRefetching ? 'animate-spin' : ''}`} size={23.6} />
              </button>
            )}
            <button onClick={() => navigate("/")} className="bg-white p-3 shadow-xl hover:bg-slate-100 rounded-xl">
              <Home className="text-blue-600" size={23.6} />
            </button>
            <button onClick={() => setIsPortrait(!isPortrait)} className="bg-orange-500 hover:bg-orange-600 text-white p-3 shadow-xl rounded-xl">
              {isPortrait ? <Monitor size={23.6} /> : <Smartphone size={24} />}
            </button>
          </div>

          <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" alt="Library Background" />

          <div className="z-10">
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter mb-4">E-LIBRARY <span className="text-blue-200">SCREEN</span></h1>
            <div className="backdrop-blur-md w-fit p-1 rounded-lg">
              <h2 className="text-lg md:text-2xl font-black uppercase tracking-tight">LAYANAN {mode}</h2>
              <p className="opacity-80 font-medium text-md md:text-lg">Perpustakaan Digital Mandiri.</p>
            </div>
          </div>
        </header>

        {/* NAVIGATION TAB */}
        <nav className="flex bg-slate-50 py-6 md:px-6 px-0 md:p-6 gap-4 border-b">
          {[
            { id: "MASUK", label: "MASUK", icon: <LogIn size={26} />, color: "bg-blue-600" },
            { id: "PULANG", label: "PULANG", icon: <LogOut size={26} />, color: "bg-rose-600" },
            { id: "PINJAM", label: "PINJAM", icon: <Book size={26} />, color: "bg-blue-600" },
            { id: "KEMBALI", label: "KEMBALI", icon: <RefreshCw size={26} />, color: "bg-blue-600" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setMode(item.id as KioskMode); setSearchQuery(""); setShowScanner(false); }}
              className={`flex-1 py-4 md:py-8 md:rounded-3xl font-black text-xs md:text-xl transition-all flex flex-col items-center justify-center gap-2 ${
                mode === item.id ? `${item.color} text-white shadow-2xl border border-slate-200` : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* DYNAMIC CONTENT */}
        <main ref={parentRef} className="flex-1 overflow-y-auto py-6 bg-slate-50/20 h-max md:px-8">
          {mode === "MASUK" || mode === "PULANG" || mode === "KEMBALI" ? (
            <div className="md:h-full flex flex-col h-max items-center justify-center text-center">
              
              {/* SCANNER CONTAINER WITH HUD */}
              <div className="w-full aspect-video md:aspect-square bg-slate-900 rounded-none md:rounded-[2rem] overflow-hidden shadow-2xl relative mb-12 border-4 border-slate-200">
                
                {/* 1. TOP HUD BAR */}
                <div className="absolute top-1.5 left-0 right-0 p-6 z-30 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
                  <div className="w-max flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-md border border-blue-500/50 px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-widest">
                      <Activity size={14} className="animate-pulse" />
                      Camera Online
                    </div>
                    <div className="flex items-center gap-2 text-black font-mono text-xs md:text-sm bg-white backdrop-blur-md px-3 py-1 rounded-lg">
                      <Clock size={14} />
                      {currentTime}
                    </div>
                  </div>
                  {/* 4. BOTTOM SPECS HUD */}
                  <div className="hidden md:flex items-center gap-4 text-white/40 text-[12px] uppercase font-bold tracking-tighter">
                    <div className="bg-white text-black px-3 py-1 rounded">FHD 1080P</div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="bg-white text-black px-3 py-1 rounded">60 FPS</div>
                    <div className="bg-white text-black px-3 py-1 rounded">ISO AUTO</div>
                  </div>
                </div>

                {/* 3. SCANNING LINE */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="animate-scan-line"></div>
                </div>

                {/* CAMERA VIEWPORT */}
                <div id="reader-inline" className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover"></div>
                
                {/* AMBIENT PULSE OVERLAY */}
                <div className="absolute inset-0 border-[8px] border-white/10 pointer-events-none animate-pulse z-10"></div>
                
                {actionLoading && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                    <Loader2 className="animate-spin text-white mb-4" size={60} />
                    <span className="text-white font-black tracking-widest text-sm uppercase">Memproses Data...</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 h-max">
                <h3 className="text-2xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter">SCAN <span className={mode === "MASUK" ? "text-blue-600" : mode === "PULANG" ? "text-rose-600" : "text-blue-600"}>{mode}</span></h3>
                <p className="text-sm md:text-md text-slate-500 font-medium max-w-xl mx-auto">
                  {mode === "KEMBALI" ? "Silakan tunjukkan Barcode pada Buku ke arah kamera." : "Silakan tunjukkan Barcode pada Kartu Pelajar Anda ke arah kamera."}
                </p>
              </div>

              <div className={`mt-6 md:mt-12 flex items-center gap-4 px-8 py-4 rounded-full font-black text-md md:text-xl shadow-inner transition-all ${mode === "MASUK" ? "md:bg-blue-50 text-blue-600" : mode === "PULANG" ? "md:bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"}`}>
                <Volume2 size={32} className="animate-bounce" /> SISTEM SIAP MENERIMA SCAN
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="relative group px-4 md:px-0">
                <Search className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-400" size={32} />
                <input
                  className="w-full h-24 bg-white border-2 text-slate-900 border-blue-600 rounded-3xl pl-24 pr-10 text-2xl font-bold transition-all outline-none focus:ring-4 focus:ring-blue-100"
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
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}>
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const startIndex = virtualRow.index * columns;
                    const itemsInRow = eksemplars.slice(startIndex, startIndex + columns);

                    return (
                      <div
                        key={virtualRow.key}
                        className="absolute top-0 left-0 w-full"
                        style={{
                          transform: `translateY(${virtualRow.start}px)`,
                          display: "grid",
                          gridTemplateColumns: window.innerWidth < 768 ? "1fr" : `repeat(${columns}, 1fr)`,
                          gap: "2rem", 
                          paddingBottom: "3rem"
                        }}
                      >
                        {itemsInRow.map((eks: any) => (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={eks.id} className="w-full bg-white p-6 md:p-8 rounded-3xl md:border-2 border-blue-600 flex flex-col shadow-md h-full min-h-[500px] md:min-h-0">
                            <div className="flex flex-col md:flex-row gap-4 md:gap-8 md:pb-10">
                              <div className="w-full md:w-44 h-[400px] md:h-44 bg-slate-50 p-4 rounded-3xl flex-shrink-0 border flex items-center justify-center overflow-hidden">
                                {eks.Biblio?.image ? (
                                  <img src={eks.Biblio.image} loading="lazy" className="w-full h-full object-cover rounded-2xl" alt="Cover" />
                                ) : (
                                  <Book size={60} className="text-slate-200" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0 space-y-3">
                                <div className="flex flex-wrap gap-2">
                                  <span className={`px-4 py-1.5 rounded-md font-black text-[10px] md:text-sm uppercase ${eks.status === "Tersedia" ? "bg-blue-600 text-white" : "bg-red-600 text-white"}`}>
                                    {eks.status}
                                  </span>
                                  <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-md font-mono font-black text-[10px] md:text-sm">
                                    #{eks.registerNumber}
                                  </span>
                                </div>
                                <h4 className="text-xl md:text-3xl font-black text-slate-800 leading-tight uppercase line-clamp-2 break-words">
                                  {eks.Biblio?.title}
                                </h4>
                                <p className="text-xs md:text-md font-medium text-slate-500 uppercase">
                                  Penulis: {eks.Biblio?.sor || "-"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-6 md:mt-auto pt-6 border-t-2 border-blue-600 flex justify-end">
                              {mode === "PINJAM" && (
                                <button
                                  disabled={eks.status !== "Tersedia"}
                                  onClick={() => { setTargetEksemplar(eks); setShowScanner(true); }}
                                  className={`w-full md:w-max px-6 py-4 rounded-xl font-black text-xs md:text-sm transition-all shadow-lg active:scale-95 ${
                                    eks.status === "Tersedia" ? "bg-slate-900 text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
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

        <footer className="p-6 md:p-10 text-center border-t flex justify-center items-center bg-white shrink-0">
          <p className="text-md font-medium text-slate-500 tracking-wider uppercase">Signage Xpresensi v1.0.0 — Perpustakaan Digital</p>
        </footer>

        {/* MODAL SCANNER PINJAM */}
          <AnimatePresence>
            {showScanner && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-xl h-[100vh] flex items-center justify-center">
                <div className="w-full max-w-4xl relative">
                  <button
                    onClick={() => setShowScanner(false)}
                    className="absolute z-[99999] top-4 md:top-5 md:right-5 right-10 text-red-600 flex items-center justify-center bg-white rounded-xl p-2 w-12 h-12 hover:brightness-95 active:scale-[0.97] shadow-2xl"
                  >
                    <X size={32} />
                  </button>
                  <div id="reader-modal" className="w-[90vw] mx-auto md:w-full h-[32.4vh] md:h-[80vh] aspect-square overflow-hidden bg-white shadow-2xl"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* NOTIFIKASI BERHASIL / GAGAL */}
          <AnimatePresence>
            {scannedResult && (
              <motion.div
                initial={{ y: 100, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                exit={{ y: 100, x: "-50%", opacity: 0 }}
                className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-[92%] md:w-max min-w-[320px] z-[999]"
              >
                <div className={`
                  flex items-center gap-4 md:gap-6 
                  px-6 py-5 md:px-10 md:py-6 
                  rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] 
                  text-white border border-white/10
                  ${scannedResult.status 
                    ? (mode === "PULANG" ? "bg-rose-600" : "bg-blue-600") 
                    : "bg-red-700"
                  }
                `}>
                  
                  {/* Icon Section dengan Glass Effect */}
                  <div className="bg-white/20 p-2 md:p-3 rounded-2xl shrink-0 backdrop-blur-sm">
                    {scannedResult.status ? (
                      <CheckCircle className="w-6 h-6 md:w-12 md:h-12" strokeWidth={3} />
                    ) : (
                      <X className="w-6 h-6 md:w-12 md:h-12" strokeWidth={3} />
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col min-w-0 overflow-hidden">
                    <div className="font-black text-md md:text-3xl uppercase tracking-tighter leading-none mb-1">
                      {scannedResult.status ? "TRANSAKSI BERHASIL" : "TRANSAKSI GAGAL"}
                    </div>
                    <div className="text-xs md:text-lg font-bold opacity-90 leading-tight truncate">
                      {scannedResult.msg}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}