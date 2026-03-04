import { useSchool } from "@/features/schools";
import { motion } from "framer-motion";
import {
  Calendar,
  Eye,
  EyeOff,
  Loader2,
  MessageCircleCode,
  MessageSquare,
  Quote,
  Star,
  Trash2,
  X
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// === TYPES ===
interface CommentItem {
  id: number;
  name: string;
  email: string;
  comment: string;
  rating: number;
  createdAt: string;
  schoolId: number;
}

const API_BASE = "https://be-school.kiraproject.id/rating";

// === ALERT SYSTEM ===
const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-8 right-8 z-[99999] p-5 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-center gap-4 ${
        isSuccess ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-red-500/10 border-red-500/20 text-red-400"
      }`}
    >
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSuccess ? "bg-blue-500/20" : "bg-red-500/20"}`}>
        {isSuccess ? "✓" : "!"}
      </div>
      <div className="text-sm font-bold tracking-tight">{message}</div>
      <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={18} /></button>
    </motion.div>
  );
};

export default function KomentarMain() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", isVisible: false });
  
  // --- STATE BARU UNTUK SETTINGS ---
  const [showRatingStats, setShowRatingStats] = useState(true);
  const [updatingSetting, setUpdatingSetting] = useState(false);

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const showAlert = (message: string) => {
    setAlert({ message, isVisible: true });
    setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
  };

  // FETCH SETTINGS (STATUS ON/OFF)
  const fetchSettings = useCallback(async () => {
    if (!schoolId) return;
    try {
      const res = await fetch(`${API_BASE}/settings?schoolId=${schoolId}`);
      const json = await res.json();
      if (json.success) setShowRatingStats(json.data.showRatingStats);
    } catch (err) {
      console.error("Gagal mengambil pengaturan");
    }
  }, [schoolId]);

  const fetchData = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}&adminMode=true`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setComments(json.data || []);
      await fetchSettings(); // Sekalian ambil setting
    } catch (err) {
      showAlert("Gagal menarik data ulasan dari pusat data.");
    } finally {
      setLoading(false);
    }
  }, [schoolId, fetchSettings]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // FUNGSI TOGGLE GLOBAL RATING
  const toggleGlobalRating = async () => {
    if (!schoolId) return;
    setUpdatingSetting(true);
    const newValue = !showRatingStats;
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId, showRatingStats: newValue })
      });
      if (!res.ok) throw new Error();
      setShowRatingStats(newValue);
      showAlert(`Tampilan rating berhasil di${newValue ? "aktifkan" : "nonaktifkan"}`);
    } catch (err) {
      showAlert("Gagal mengubah pengaturan tampilan.");
    } finally {
      setUpdatingSetting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus ulasan ini secara permanen?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showAlert("Ulasan berhasil dimusnahkan");
      fetchData();
    } catch (err) {
      showAlert("Gagal menghapus ulasan.");
      setLoading(false);
    }
  };

  const averageRating = comments.length > 0
    ? (comments.reduce((sum, item) => sum + item.rating, 0) / comments.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen space-y-10">
      
    {/* Hero Stats Section */}
      <div className="relative group border-b border-white/5 pb-11">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
              <MessageCircleCode size={14} /> Feedback Management
            </div>
            <h1 className="text-4xl uppercase font-black text-white tracking-tighter">
              Review <span className="text-blue-600 italic">&</span> Feedback
            </h1>
            <p className="text-zinc-500 text-sm font-medium">Kelola visibilitas rating publik</p>
          </div>

          <div className="flex flex-wrap md:justify-center gap-6">
            {/* Box 1: Info Rata-rata (Indikator) */}
            <div className={`bg-black/40 border border-white/10 rounded-3xl py-4 px-6 flex items-center gap-5 backdrop-blur-xl transition-all duration-500 ${!showRatingStats ? 'opacity-30 grayscale' : 'opacity-100'}`}>
              <div className="text-4xl font-black text-blue-500 tracking-tighter">{averageRating}</div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(Number(averageRating)) ? "#3b82f6" : "transparent"} 
                    className={i < Math.round(Number(averageRating)) ? "text-yellow-500" : "text-zinc-700"} />
                  ))}
                </div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Avg Rating</div>
              </div>
            </div>

            {/* Box 2: Modern Select Toggle */}
            <div className="bg-black/40 border border-white/10 rounded-3xl py-4 px-6 flex items-center gap-6 backdrop-blur-xl">
              <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 transition-colors ${showRatingStats ? "text-blue-500" : "text-zinc-500"}`}>
                  {showRatingStats ? "Status: Online" : "Status: Offline"}
                </span>
                <span className="text-white text-sm font-bold uppercase">Show Stats</span>
              </div>

              {/* Toggle Switch Logic */}
              <button
                onClick={toggleGlobalRating}
                disabled={updatingSetting}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 flex items-center p-1 ${
                  showRatingStats ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-zinc-800"
                } ${updatingSetting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {/* Knob */}
                <motion.div
                  animate={{ x: showRatingStats ? 32 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center`}
                >
                  {updatingSetting ? (
                    <Loader2 size={12} className="text-blue-600 animate-spin" />
                  ) : showRatingStats ? (
                    <Eye size={12} className="text-blue-600" />
                  ) : (
                    <EyeOff size={12} className="text-zinc-400" />
                  )}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Komentar Tetap Sama... */}
      {loading && comments.length === 0 ? (
        <div className="py-40 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Synchronizing data...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-32 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <MessageSquare size={32} className="text-zinc-700" />
          </div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Hening...</h3>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Belum ada suara dari audiens saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {comments.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={item.id}
              className="group bg-white/[0.03] border border-white/10 rounded-[32px] p-8 hover:bg-blue-600/[0.03] hover:border-blue-500/30 transition-all duration-500 relative"
            >
              {/* Star Badge */}
              <div className="absolute -top-3 -right-3 h-12 w-12 rounded-2xl bg-[#0B1220] border border-white/10 flex flex-col items-center justify-center shadow-2xl">
                 <span className="text-xs font-black text-yellow-400 leading-none">{item.rating}</span>
                 <Star size={10} fill="yellow" className="text-yellow-500 mt-0.5" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center font-black text-white text-lg shadow-lg`}>
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-white font-black truncate tracking-tight uppercase italic text-sm">{item.name}</h4>
                  <div className="flex items-center gap-2 text-zinc-600 text-[9px] font-bold uppercase tracking-widest">
                    <Calendar size={10} />
                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="relative min-h-[100px] overflow-hidden">
                <Quote size={24} className="text-white absolute -left-2 -top-2" />
                <p className="text-zinc-400 text-sm leading-relaxed font-medium pl-4 line-clamp-5">
                  {item.comment}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 transition-opacity">
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  <Trash2 size={14} /> Delete Feedback
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}