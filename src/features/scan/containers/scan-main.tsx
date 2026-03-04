import { AnimatePresence, motion } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import {
  CheckCircle2,
  Clock,
  RefreshCcw,
  UserCheck,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Tambahkan ini
import { ArrowLeft } from "lucide-react"; // Import icon panah

const BASE_URL = "http://localhost:5005/siswa/scan";

export default function StudentScanner() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    let html5QrCode: Html5Qrcode;
    let isMounted = true;

    const startScanner = async () => {
      html5QrCode = new Html5Qrcode("reader");
      try {
        if (isScanning && isMounted) {
          const config = { fps: 10, qrbox: { width: 280, height: 280 } };
          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            async (decodedText) => {
              if (isMounted) {
                setIsScanning(false);
                await html5QrCode.stop(); 
                await handleAttendance(decodedText);
              }
            },
            undefined
          );
        }
      } catch (err) {
        console.error("Gagal memulai scanner:", err);
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch((err) => console.warn("Scanner sudah berhenti:", err));
      }
    };
  }, [isScanning]);

  const handleAttendance = async (qrData: string) => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCodeData: qrData }),
      });
      const result = await response.json();
      if (result.success) {
        setScanResult(result.data);
        setError(null);
        setTimeout(() => resetScanner(), 3000);
      } else {
        setError(result.message);
        setTimeout(() => resetScanner(), 4000);
      }
    } catch (err) {
      setError("Gagal terhubung ke server");
      setTimeout(() => resetScanner(), 4000);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setIsScanning(true);
  };

  const navigate = useNavigate();

return (
  <>

    {/* TOMBOL KELUAR / BACK */}
    <div className="w-full flex items-center mt-8 justify-between px-10">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/data-siswa")}
        className="relative w-max z-[100] flex items-center gap-3 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white backdrop-blur-xl transition-all group"
      >
        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500 transition-colors">
          <ArrowLeft size={18} className="text-red-500 group-hover:text-white" />
        </div>
        <span className="font-bold text-sm tracking-wide uppercase">Keluar Ke Data Siswa</span>
      </motion.button>
      <h2>Halaman scan</h2>
    </div>
    <div className="h-[78svh] w-full bg-[#0B1220] flex items-center justify-center p-4 md:p-10 font-sans relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>


      {/* Main Container: 
        - h-[80vh] untuk tinggi 80% layar.
        - flex-shrink-0 agar tidak tertekan/terpotong oleh flexbox.
      */}
      <div className="relative z-10 w-full max-w-7xl h-[78vh] flex flex-col justify-center flex-shrink-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 h-full items-stretch overflow-hidden">
          
          {/* KOLOM KIRI: SCANNER AREA */}
          <div className="relative h-full flex items-center justify-center overflow-hidden">
            {/* max-h-full memastikan box tidak lebih tinggi dari container 80vh */}
            <div className="relative aspect-square w-full max-h-full bg-black/40 border-2 border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
              <div id="reader" className="w-full h-full [&_video]:object-cover" />
              
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 border-2 border-blue-500/30 rounded-3xl relative">
                    <div className="absolute top-[-2px] left-[-2px] w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                    <div className="absolute top-[-2px] right-[-2px] w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                    <div className="absolute bottom-[-2px] left-[-2px] w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                    <div className="absolute bottom-[-2px] right-[-2px] w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
                    <motion.div 
                      animate={{ top: ["0%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                    />
                  </div>
                </div>
              )}

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-red-600/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                  >
                    <XCircle size={64} className="text-white mb-4 animate-bounce" />
                    <h2 className="text-xl font-black text-white uppercase italic">Scan Gagal</h2>
                    <p className="text-white/80 text-sm mt-1">{error}</p>
                    <button onClick={resetScanner} className="mt-6 px-5 py-2 bg-white text-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest">Coba Lagi</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* KOLOM KANAN: DATA HASIL SCAN */}
          <div className="relative h-full overflow-hidden">
            <AnimatePresence mode="wait">
              {scanResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[2.5rem] p-6 md:p-10 h-full flex flex-col items-center justify-center text-center backdrop-blur-sm"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <CheckCircle2 size={48} className="text-white" />
                  </div>
                  
                  <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Absensi Berhasil</h2>
                  <div className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none">
                    {scanResult.name}
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                        <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">NISN Siswa</p>
                        <p className="text-white font-mono font-bold text-sm">{scanResult.nisn}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                        <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">Status Kehadiran</p>
                        <p className="text-emerald-400 font-black uppercase italic text-sm">Hadir</p>
                    </div>
                  </div>

                  <button onClick={resetScanner} className="mt-8 flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
                    <RefreshCcw size={16} /> Lanjut Scan
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[2.5rem] p-6 md:p-10 h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-white/10 rounded-full flex items-center justify-center mb-6 text-zinc-700">
                    <UserCheck size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-white/40 uppercase tracking-widest">Menunggu Scan...</h2>
                  <p className="text-zinc-600 text-xs mt-2 max-w-[200px]">Arahkan QR Code pada kartu pelajar ke area kamera</p>
                  
                  <div className="mt-8 flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-white/5 border border-white/10 p-4 rounded-[2rem] px-6">
                    <div className="flex items-center gap-3">
                        <Clock className="text-blue-500" size={18} />
                        <span className="text-white font-mono font-bold tracking-widest">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
                    <div className="text-[11px] font-black text-green-600 uppercase">Status: Ready</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  </>
);
}