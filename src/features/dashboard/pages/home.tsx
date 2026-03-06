import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookMarked,
  BookOpen,
  Clock,
  History,
  Library,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Users,
  X
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- Sub-komponen StatCard ---
const StatCard = ({ title, value, icon: Icon, trend, color, loading }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
  >
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
        {trend}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      {loading ? (
        <div className="h-8 w-24 bg-slate-100 animate-pulse rounded mt-1" />
      ) : (
        <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
      )}
    </div>
  </motion.div>
);

export const HomePage = () => {
  const profile = useProfile();
  const { data: schools, isLoading: schoolLoading } = useSchool();
  const school = schools?.[0];
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // const baseURL = "http://localhost:5010";
  const baseURL = "https://be-perpus-8xa0lfifq-valclassdevelops-projects.vercel.app";

  // --- REACT QUERY FETCHING ---
  const { 
    data: dashboardData, 
    isLoading: loadingStats, 
    isFetching, // Menggantikan isRefreshing manual
    refetch 
  } = useQuery({
    queryKey: ["dashboard-stats", school?.id],
    queryFn: async () => {
      const sId = school.id;
      const [resEksemplar, resMember, resKunjungan, resLogs] = await Promise.all([
        axios.get(`${baseURL}/eksemplar?schoolId=${sId}&limit=1`),
        axios.get(`${baseURL}/member?schoolId=${sId}&limit=1`),
        axios.get(`${baseURL}/peminjam/report?schoolId=${sId}`),
        axios.get(`${baseURL}/peminjam?schoolId=${sId}&limit=20`)
      ]);

      return {
        stats: {
          totalKoleksi: resEksemplar.data.meta.totalItems || 0,
          totalMember: resMember.data.pagination.totalItems || 0,
          totalPeminjaman: resLogs.data.meta.totalItems || 0,
          kunjunganHariIni: resKunjungan.data.summary.totalKunjungan || 0
        },
        logs: resLogs.data.data || []
      };
    },
    enabled: !!school?.id, // Hanya jalan jika school ID ada
    staleTime: 5 * 60 * 1000, // Data dianggap segar selama 5 menit
  });

  // Tombol Refresh Manual: Memaksa fetch ulang tanpa peduli staleTime
  const handleManualRefresh = () => {
    refetch();
  };

  if (schoolLoading) {
    return (
      <DashboardPageLayout siteTitle="Loading..." breadcrumbs={[{ label: "Dashboard", url: "/" }]}>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: "Dashboard", url: "/" }]}
    >
      <div className="space-y-8 pb-12 pt-6 px-4 md:px-0 relative">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 md:p-12 shadow-2xl">
          {/* TOMBOL REFRESH DENGAN REACT QUERY REFETCH */}
          <button 
            onClick={handleManualRefresh}
            disabled={isFetching}
            className="absolute top-5 right-5 z-[9999] p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin text-white' : ''}`} />
          </button>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
            >
              <ShieldCheck className="h-4 w-4" /> Smart Library System v1.0
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]"
            >
              KENDALI <span className="text-blue-500">PERPUS</span> DIGITAL.
            </motion.h1>
            
            <p className="mt-6 text-lg text-slate-400 font-medium max-w-2xl leading-relaxed">
              Selamat datang, <span className="text-white">{profile?.user?.name}</span>. 
              Kelola koleksi <span className="text-blue-400">{school?.namaSekolah}</span> dalam satu dasbor terpadu.
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Koleksi" value={dashboardData?.stats.totalKoleksi} icon={BookOpen} trend="Buku" color="bg-blue-500" loading={loadingStats} />
          <StatCard title="Anggota Aktif" value={dashboardData?.stats.totalMember} icon={Users} trend="Siswa/Guru" color="bg-purple-500" loading={loadingStats} />
          <StatCard title="Peminjaman" value={dashboardData?.stats.totalPeminjaman} icon={BookMarked} trend="Total" color="bg-orange-500" loading={loadingStats} />
          <StatCard title="Kunjungan Hari Ini" value={dashboardData?.stats.kunjunganHariIni} icon={History} trend="Real-time" color="bg-emerald-500" loading={loadingStats} />
        </div>

        {/* Layout Grid for Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Aktivitas Terbaru</h3>
                    <p className="text-sm text-slate-500">Menampilkan sirkulasi terakhir</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="text-blue-600 font-bold text-sm hover:underline"
                >
                  Lihat Semua
                </button>
              </div>
              
              <div className={`space-y-6 transition-opacity ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
                {dashboardData?.logs.length > 0 ? dashboardData?.logs.slice(0, 4).map((log: any) => (
                  <div key={log.id} className="flex items-center gap-4 transition-colors">
                    <div className={`h-12 w-12 rounded-md flex items-center justify-center ${log.status === 'pinjam' ? 'bg-orange-200' : 'bg-emerald-200'}`}>
                      <Clock className={`h-5 w-5 ${log.status === 'pinjam' ? 'text-orange-700' : 'text-emerald-700'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 truncate max-w-[200px] md:max-w-none">
                        {log.status === 'pinjam' ? 'Peminjaman' : 'Pengembalian'}: "{log.Eksemplar?.Biblio?.title}"
                      </p>
                      <p className="text-xs text-slate-500">Siswa: {log.peminjamName} • {moment(log.createdAt).fromNow()}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${log.status === 'pinjam' ? 'text-orange-600 bg-orange-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      {log.status}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-400 italic">Belum ada aktivitas hari ini.</div>
                )}
              </div>
            </div>
          </div>

          {/* Shortcut */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-2">Aksi Cepat</h3>
              <p className="text-blue-100 text-sm mb-6 opacity-80">Gunakan pintasan di bawah ini.</p>
              
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => navigate('/bibliografy')} className="flex items-center gap-3 w-full p-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl border border-white/10 font-bold text-sm">
                  <Library className="h-5 w-5" /> Input Buku Baru
                </button>
                <button onClick={() => navigate('/anggota-perpus')} className="flex items-center gap-3 w-full p-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl border border-white/10 font-bold text-sm">
                  <Users className="h-5 w-5" /> Registrasi Anggota
                </button>
                <button onClick={() => navigate('laporan-kunjungan')} className="flex items-center gap-3 w-full p-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl border border-white/10 font-bold text-sm">
                  <History className="h-5 w-5" /> Laporan Bulanan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SIDEBAR OVERLAY & PANEL --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[100] p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8 border-b border-slate-300 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Riwayat Lengkap</h3>
                  <p className="text-sm text-slate-500">Log sirkulasi perpustakaan</p>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={36} className="relative top-[-2px] rounded-full p-1.5 cursor-pointer active:scale-[0.97] hover:brightness-[90%] bg-red-500 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                {dashboardData?.logs.map((log: any) => (
                  <div key={log.id} className="flex gap-4 p-4 rounded-xl border border-slate-50 bg-slate-50/50">
                    <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${log.status === 'pinjam' ? 'bg-orange-100' : 'bg-emerald-100'}`}>
                      <Clock className={`h-4 w-4 ${log.status === 'pinjam' ? 'text-orange-600' : 'text-emerald-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 leading-tight">
                         {log.status === 'pinjam' ? 'Pinjam' : 'Kembali'}: {log.Eksemplar?.Biblio?.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 uppercase font-semibold">
                        {log.peminjamName} • {moment(log.createdAt).format('HH:mm, DD MMM')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardPageLayout>
  );
};