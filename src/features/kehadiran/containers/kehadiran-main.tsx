// import { useSchool } from "@/features/schools";
// import { useQuery } from "@tanstack/react-query";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   BookOpen,
//   Calendar,
//   CheckCircle2,
//   ChevronDown,
//   Clock,
//   DownloadIcon,
//   Loader,
//   RefreshCw,
//   Users,
//   AlertCircle,
//   BarChart3,
//   List
// } from "lucide-react";
// import moment from "moment";
// import { useState, useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Cell
// } from "recharts";

// const API_BASE = "https://be-school.kiraproject.id/siswa";
// const API_KELAS = "https://be-school.kiraproject.id/kelas";

// export default function AttendanceMain() {
//   const schoolQuery = useSchool();
//   const schoolId = schoolQuery?.data?.[0]?.id;

//   const [activeTab, setActiveTab] = useState<'log' | 'stats'>('log');
//   const [exportLoading, setExportLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 10,
//     class: "",
//     role: "student",
//     month: moment().format("MM"),
//     year: moment().format("YYYY"),
//     date: "" // State baru untuk filter tanggal spesifik
//   });

//   // --- Queries ---

//   const { data: classList = [] } = useQuery({
//     queryKey: ["classList", schoolId],
//     queryFn: async () => {
//       const res = await fetch(`${API_KELAS}?schoolId=${schoolId}`);
//       const json = await res.json();
//       return json.success ? json.data : [];
//     },
//     enabled: !!schoolId,
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000
//   });

//   const { data: attendanceResponse, isLoading: loading, refetch, isFetching } = useQuery({
//     queryKey: ["attendance", schoolId, filters],
//     queryFn: async () => {
//       const queryParams: any = {
//         schoolId: schoolId!.toString(),
//         role: filters.role,
//         page: filters.page.toString(),
//         limit: filters.limit.toString(),
//       };

//       // Logika Filter: Jika date dipilih, prioritaskan date. Jika tidak, gunakan month/year.
//       if (filters.date) {
//         queryParams.date = filters.date;
//       } else {
//         queryParams.year = filters.year;
//         queryParams.month = filters.month;
//       }

//       if (filters.class) {
//         queryParams.className = filters.class;
//       }

//       const query = new URLSearchParams(queryParams);
//       const res = await fetch(`${API_BASE}/attendance-report?${query}`);
//       return await res.json();
//     },
//     enabled: !!schoolId && activeTab === 'log',
//     staleTime: 5 * 60 * 1000, 
//     gcTime: 10 * 60 * 1000
//   });
  
//   const { data: statsResponse, isLoading: statsLoading, refetch: refetchStats, isFetching: isFetchingStats } = useQuery({
//     queryKey: ["todayStats", schoolId, filters.role],
//     queryFn: async () => {
//       const res = await fetch(`${API_BASE}/today-stats?schoolId=${schoolId}&role=${filters.role}`);
//       const json = await res.json();
//       return json.success ? json.data : null;
//     },
//     enabled: !!schoolId && activeTab === 'stats',
//     staleTime: 5 * 60 * 1000, 
//     gcTime: 10 * 60 * 1000,
//   });

//   const data = attendanceResponse?.data || [];
//   const pagination = attendanceResponse?.pagination || { totalItems: 0, totalPages: 1, currentPage: 1 };

//   const chartData = useMemo(() => {
//     if (!statsResponse) return [];
//     return [
//       { name: 'Hadir', value: statsResponse.Hadir, color: '#10b981' },
//       { name: 'Terlambat', value: statsResponse.Terlambat, color: '#ef4444' },
//       { name: 'Izin', value: statsResponse.Izin, color: '#f59e0b' },
//       { name: 'Sakit', value: statsResponse.Sakit, color: '#3b82f6' },
//       { name: 'Alpha', value: statsResponse.Alpha, color: '#6366f1' },
//     ];
//   }, [statsResponse]);

//   const handleExport = async (type: 'monthly' | 'yearly') => {
//     if (!schoolId) return;
//     setExportLoading(true);
//     try {
//       const query = new URLSearchParams({
//         schoolId: schoolId.toString(),
//         year: filters.year,
//         role: filters.role,
//         ...(type === 'monthly' && { month: filters.month }),
//         ...(filters.role === 'student' && filters.class && { className: filters.class }),
//       });

//       const response = await fetch(`${API_BASE}/export-attendance?${query}`);
//       if (!response.ok) throw new Error("Export failed");
      
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       const fileName = `Laporan_Absensi_${filters.role === 'student' ? 'Siswa' : 'Guru'}_${type}_${filters.year}.xlsx`;
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     } catch (err) {
//       alert("Gagal mengunduh laporan Excel");
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/5 pb-10">
//         <div className="space-y-2 text-center md:text-left">
//           <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
//             <Users size={14} /> Attendance Analytics
//           </div>
//           <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
//             Log <span className="text-blue-600">Absensi</span>
//           </h1>
//           <p className="text-zinc-500 text-sm font-medium">Monitoring aktivitas scan kartu</p>
//         </div>

//         <div className="flex w-max justify-center gap-3">
//           <button 
//               onClick={() => {refetch(), refetchStats()}} 
//               disabled={isFetching || isFetchingStats}
//               className="h-14 px-5 w-full max-w-[245px] ml-auto justify-center bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50"
//             >
//               <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
//               {isFetching || isFetchingStats ? "Syncing..." : "Refresh"}
//           </button>
//           <button
//             onClick={() => handleExport('monthly')}
//             disabled={exportLoading}
//             className="h-14 px-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all font-black uppercase text-[12px] tracking-widest"
//           >
//             {exportLoading ? <Loader className="animate-spin" size={16} /> : <DownloadIcon size={16} />}
//             <p className="w-max relative top-[1.2px]">
//               Data Bulanan
//             </p>
//           </button>
//           <button
//             onClick={() => handleExport('yearly')}
//             disabled={exportLoading}
//             className="h-14 w-max px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-blue-600/30"
//           >
//             <DownloadIcon size={16} />
//             <p className="w-max relative top-[1.2px]">
//               Data Tahunan
//             </p>
//           </button>
//         </div>
//       </div>

//       <div className="w-full grid grid-cols-2 gap-3.5">
//         <div className="gap-2 bg-white/5 h-14 grid p-1 grid-cols-2 overflow-hidden rounded-2xl border border-blue-700 mb-8">
//           {['student', 'teacher'].map((r) => (
//             <button
//               key={r}
//               onClick={() => setFilters({
//                 ...filters, 
//                 role: r, 
//                 page: 1, 
//                 class: "" 
//               })}
//               className={`h-full px-8 flex items-center gap-2 justify-center font-black rounded-xl uppercase text-[12px] tracking-widest transition-all ${
//                 filters.role === r ? 'bg-blue-700 text-white' : 'text-zinc-300'
//               }`}
//             >
//               <CheckCircle2 size={14.5} />
//               <p>
//                 {r === 'student' ? 'Data Siswa' : 'Data Guru'}
//               </p>
//             </button>
//           ))}
//         </div>

//         <div className="gap-2 bg-white/5 h-14 grid p-1 grid-cols-2 overflow-hidden rounded-2xl border border-amber-400/70 mb-8">
//           <button 
//             onClick={() => setActiveTab('log')}
//             className={`flex items-center justify-center gap-2 h-full px-8 font-black uppercase text-[12px] tracking-widest transition-all rounded-xl ${activeTab === 'log' ? 'bg-amber-600 text-white shadow-lg' : 'text-zinc-300'}`}
//           >
//             <List size={14} /> Log Data
//           </button>
//           <button 
//             onClick={() => setActiveTab('stats')}
//             className={`flex items-center justify-center gap-2 h-full px-8 font-black uppercase text-[12px] tracking-widest transition-all rounded-xl ${activeTab === 'stats' ? 'bg-amber-600 text-white shadow-lg' : 'text-zinc-300'}`}
//           >
//             <BarChart3 size={14} /> Statistik
//           </button>
//         </div>
//       </div>


//       <AnimatePresence mode="wait">
//         {activeTab === 'log' ? (
//           <motion.div
//             key="log-tab"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//           >
//             {/* Filter Bar */}
//             <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6`}>
              
//               {/* Filter Tanggal Spesifik (BARU) */}
//               <div className="relative group">
//                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors z-10" size={16} />
//                 <input 
//                   type="date"
//                   className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-blue-500 transition-all font-bold text-white cursor-pointer"
//                   value={filters.date}
//                   onChange={(e) => setFilters({...filters, date: e.target.value, page: 1})}
//                 />
//               </div>

//               {/* Selector Bulan (Disabled jika date terisi) */}
//               <div className="relative group">
//                 <select 
//                   disabled={!!filters.date}
//                   className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-10 py-4 text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-bold relative z-10 disabled:opacity-30 disabled:cursor-not-allowed"
//                   value={filters.month}
//                   onChange={(e) => setFilters({...filters, month: e.target.value, page: 1})}
//                 >
//                   {moment.months().map((m, i) => (
//                     <option key={m} value={String(i + 1).padStart(2, '0')} className="bg-[#0B1220]">{m}</option>
//                   ))}
//                 </select>
//                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-20" size={16} />
//               </div>

//               {/* Selector Tahun atau Kelas */}
//               <div className="w-full gap-4 grid grid-cols-2">
//                 <div className="relative group">
//                   <select 
//                     disabled={!!filters.date}
//                     className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-10 py-4 text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-bold relative z-10 disabled:opacity-30"
//                     value={filters.year}
//                     onChange={(e) => setFilters({...filters, year: e.target.value, page: 1})}
//                   >
//                     {[2024, 2025, 2026].map(y => (
//                       <option key={y} value={y.toString()} className="bg-[#0B1220]">{y}</option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-20" size={16} />
//                 </div>

//                 {filters.role === 'student' ? (
//                   <div className="relative group">
//                     <select 
//                       className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-10 py-4 text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-bold relative z-10"
//                       value={filters.class}
//                       onChange={(e) => setFilters({...filters, class: e.target.value, page: 1})}
//                     >
//                       <option value="" className="bg-[#0B1220]">Semua Kelas</option>
//                       {classList.map((c: any) => (
//                         <option key={c.id} value={c.className} className="bg-[#0B1220]">{c.className}</option>
//                       ))}
//                     </select>
//                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-20" size={16} />
//                   </div>
//                 ) : (
//                    <button 
//                     onClick={() => setFilters({...filters, date: "", month: moment().format("MM"), year: moment().format("YYYY")})}
//                     className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-[13px] font-black"
//                    >
//                     Reset Date
//                    </button>
//                 )}
//               </div>
//             </div>

//             {/* Table Section */}
//             <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="border-b border-white/5 bg-white/[0.03]">
//                       <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Waktu Scan</th>
//                       <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
//                         Informasi {filters.role === 'teacher' ? 'Guru/Staff' : 'Siswa'}
//                       </th>
//                       <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
//                         {filters.role === 'teacher' ? 'Jabatan & Mapel' : 'Kelas'}
//                       </th>
//                       <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-white/5">
//                     {loading ? (
//                       <tr>
//                         <td colSpan={4} className="p-32 text-center">
//                           <div className="flex flex-col items-center gap-4">
//                             <Loader className="animate-spin text-blue-500" size={40} />
//                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Menyinkronkan data terbaru...</p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : data.length === 0 ? (
//                       <tr>
//                         <td colSpan={4} className="p-32 text-center">
//                           <div className="flex flex-col items-center gap-2 opacity-30">
//                             <Calendar size={48} />
//                             <p className="text-sm font-bold uppercase tracking-widest">Tidak ada data absensi</p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       data.map((item: any, idx: number) => {
//                         const isStudent = item.userRole === 'student';
//                         const userData = isStudent ? item.student : item.guru;
//                         const displayName = isStudent ? userData?.name : userData?.nama;
//                         const displayId = isStudent 
//                           ? `NIS: ${userData?.nis || '-'}` 
//                           : `ROLE: ${userData?.role || 'Staff'}`;
//                         const subInfo = isStudent 
//                           ? "Siswa" 
//                           : (userData?.mapel || "Umum");

//                         const isLate = item?.isLate ?? false;

//                         return (
//                           <motion.tr 
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: idx * 0.02 }}
//                             key={item.id} 
//                             className="hover:bg-white/[0.04] transition-colors group"
//                           >
//                             <td className="p-6">
//                               <div className="flex items-center gap-3">
//                                 <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${
//                                   isStudent ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
//                                 }`}>
//                                   <Clock size={16} />
//                                 </div>
//                                 <div>
//                                   <div className="text-sm font-black text-white italic tracking-tight">
//                                     {moment(item.createdAt).format("DD MMM YYYY")}
//                                   </div>
//                                   <div className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase font-bold">
//                                     Time: {moment(item.createdAt).format("HH:mm:ss")}
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>

//                             <td className="p-6">
//                               <div className="flex items-center gap-4">
//                                 <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-lg ${
//                                   isStudent 
//                                     ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-600/20' 
//                                     : 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-600/20'
//                                 }`}>
//                                   {displayName?.charAt(0) || "?"}
//                                 </div>
//                                 <div>
//                                   <div className={`font-bold w-full truncate text-sm transition-colors uppercase tracking-tight ${
//                                     isStudent ? 'text-white group-hover:text-blue-400' : 'text-white group-hover:text-emerald-400'
//                                   }`}>
//                                     {displayName || "Tidak Terdaftar"}
//                                   </div>
//                                   <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-black">
//                                     {displayId}
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>

//                             <td className="p-6 text-sm">
//                               <div className="font-bold text-zinc-300 uppercase tracking-tighter italic">
//                                 {isStudent ? item.currentClass : "GURU / STAFF"}
//                               </div>
//                               <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${
//                                 isStudent ? 'text-blue-500/60' : 'text-emerald-500/60'
//                               }`}>
//                                 {subInfo}
//                               </div>
//                             </td>

//                             <td className="p-6 text-center">
//                               <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest shadow-sm transition-all ${
//                                 isLate 
//                                   ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5' 
//                                   : item.status === 'Hadir' 
//                                     ? 'bg-green-500/10 text-green-400 border-green-500/20' 
//                                     : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
//                               }`}>
//                                 {isLate ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
//                                 {isLate ? "Terlambat" : item.status}
//                               </span>
//                             </td>
//                           </motion.tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-6 pb-12">
//               <div className="flex items-center gap-4">
//                 <select 
//                   value={filters.limit} 
//                   onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value), page: 1 })}
//                   className="bg-white/5 border border-white/10 w-max pr-8 pl-4 h-11 rounded-xl text-[10px] font-black text-white outline-none appearance-none cursor-pointer"
//                 >
//                   {[10, 20, 50, 100].map(v => <option key={v} value={v} className="bg-[#0B1220]">{v} Baris</option>)}
//                 </select>
//                 <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
//                   Showing <span className="text-white">{(filters.page - 1) * filters.limit + 1}-{Math.min(filters.page * filters.limit, pagination?.totalItems || 0)}</span> / Total <span className="text-blue-500">{pagination?.totalItems || 0}</span> Log
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button 
//                   onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
//                   disabled={filters.page === 1 || loading}
//                   className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase disabled:opacity-20 text-zinc-400"
//                 >Prev</button>
//                 <div className="flex gap-1">
//                   {Array.from({ length: Math.min(3, pagination?.totalPages || 1) }, (_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setFilters({ ...filters, page: i + 1 })}
//                       className={`w-11 h-11 rounded-xl text-[10px] font-black transition-all ${
//                         filters.page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-500'
//                       }`}
//                     >{i + 1}</button>
//                   ))}
//                 </div>
//                 <button 
//                   onClick={() => setFilters({ ...filters, page: Math.min(pagination?.totalPages || 1, filters.page + 1) })}
//                   disabled={filters.page === pagination?.totalPages || loading}
//                   className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase disabled:opacity-20 text-zinc-400"
//                 >Next</button>
//               </div>
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div
//             key="stats-tab"
//             initial={{ opacity: 0, scale: 0.98 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.98 }}
//             className="space-y-8 pb-12"
//           >
//             {/* Stats Summary Cards */}
//             <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
//               {[
//                 { label: 'Hadir', value: statsResponse?.Hadir || 0, color: 'text-white', bg: 'bg-emerald-600' },
//                 { label: 'Terlambat', value: statsResponse?.Terlambat || 0, color: 'text-white', bg: 'bg-red-600' },
//                 { label: 'Izin', value: statsResponse?.Izin || 0, color: 'text-white', bg: 'bg-amber-600' },
//                 { label: 'Sakit', value: statsResponse?.Sakit || 0, color: 'text-white', bg: 'bg-blue-600' },
//                 { label: 'Alpha', value: statsResponse?.Alpha || 0, color: 'text-white', bg: 'bg-indigo-600' },
//               ].map((stat, i) => (
//                 <div key={i} className={`p-6 rounded-3xl border border-white/5 ${stat.bg} backdrop-blur-sm`}>
//                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-2">{stat.label}</p>
//                   <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
//                 </div>
//               ))}
//             </div>

//             <div className="grid grid-cols-1 gap-8">
//               <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
//                 <div className="flex justify-between items-center mb-8">
//                   <div>
//                     <h3 className="text-xs font-black uppercase tracking-widest text-white/60 italic">Daily Attendance Chart</h3>
//                     <p className="text-[10px] text-zinc-500 font-mono mt-1">Hari Ini: {moment().format("DD MMMM YYYY")}</p>
//                   </div>
//                   <div className="text-[10px] text-zinc-400 font-black px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
//                     BATAS: {statsResponse?.deadlineInfo || "07:00:00"}
//                   </div>
//                 </div>
                
//                 <div className="h-[350px] w-full">
//                   {statsLoading ? (
//                     <div className="h-full flex items-center justify-center">
//                       <Loader className="animate-spin text-blue-500" />
//                     </div>
//                   ) : (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
//                         <XAxis 
//                           dataKey="name" 
//                           axisLine={false} 
//                           tickLine={false} 
//                           tick={{fill: '#71717a', fontSize: 10, fontWeight: 900}} 
//                         />
//                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} />
//                         <Tooltip 
//                           cursor={{fill: '#ffffff05'}}
//                           contentStyle={{backgroundColor: '#0B1220', border: '1px solid #ffffff10', borderRadius: '12px'}}
//                           itemStyle={{fontSize: '12px', fontWeight: 'bold', color: 'white'}}
//                         />
//                         <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
//                           {chartData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
//                           ))}
//                         </Bar>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }




import { useSchool } from "@/features/schools";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DownloadIcon,
  Loader,
  RefreshCw,
  Users,
  AlertCircle,
  BarChart3,
  List,
  AlertTriangle
} from "lucide-react";
import moment from "moment";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const API_BASE = "https://be-school.kiraproject.id/siswa";
const API_KELAS = "https://be-school.kiraproject.id/kelas";

export default function AttendanceMain() {
  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const [activeTab, setActiveTab] = useState<'log' | 'stats'>('log');
  const [exportLoading, setExportLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    class: "",
    role: "student",
    month: moment().format("MM"),
    year: moment().format("YYYY"),
    date: "" // State baru untuk filter tanggal spesifik
  });

  // --- Queries ---

  const { data: classList = [] } = useQuery({
    queryKey: ["classList", schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_KELAS}?schoolId=${schoolId}`);
      const json = await res.json();
      return json.success ? json.data : [];
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const { data: attendanceResponse, isLoading: loading, refetch, isFetching } = useQuery({
    queryKey: ["attendance", schoolId, filters],
    queryFn: async () => {
      const queryParams: any = {
        schoolId: schoolId!.toString(),
        role: filters.role,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      };

      // Logika Filter: Jika date dipilih, prioritaskan date. Jika tidak, gunakan month/year.
      if (filters.date) {
        queryParams.date = filters.date;
      } else {
        queryParams.year = filters.year;
        queryParams.month = filters.month;
      }

      if (filters.class) {
        queryParams.className = filters.class;
      }

      const query = new URLSearchParams(queryParams);
      const res = await fetch(`${API_BASE}/attendance-report?${query}`);
      return await res.json();
    },
    enabled: !!schoolId && activeTab === 'log',
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000
  });
  
  const { data: statsResponse, isLoading: statsLoading, refetch: refetchStats, isFetching: isFetchingStats } = useQuery({
    queryKey: ["todayStats", schoolId, filters.role],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/today-stats?schoolId=${schoolId}&role=${filters.role}`);
      const json = await res.json();
      return json.success ? json.data : null;
    },
    enabled: !!schoolId && activeTab === 'stats',
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
  });

  // 4. Fetch Early Warning System (Tab Stats - NEW)
  const { data: ewResponse, isLoading: ewLoading } = useQuery({
    queryKey: ["earlyWarning", schoolId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5005/siswa/early-warning?schoolId=${schoolId}`);
      const json = await res.json();
      return json.success ? json : null;
    },
    enabled: !!schoolId && activeTab === 'stats',
  });

  const data = attendanceResponse?.data || [];
  const pagination = attendanceResponse?.pagination || { totalItems: 0, totalPages: 1, currentPage: 1 };

  const chartData = useMemo(() => {
    if (!statsResponse) return [];
    return [
      { name: 'Hadir', value: statsResponse.Hadir, color: '#10b981' },
      { name: 'Terlambat', value: statsResponse.Terlambat, color: '#ef4444' },
      { name: 'Izin', value: statsResponse.Izin, color: '#f59e0b' },
      { name: 'Sakit', value: statsResponse.Sakit, color: '#3b82f6' },
      { name: 'Alpha', value: statsResponse.Alpha, color: '#6366f1' },
    ];
  }, [statsResponse]);

  const handleExport = async (type: 'monthly' | 'yearly') => {
    if (!schoolId) return;
    setExportLoading(true);
    try {
      const query = new URLSearchParams({
        schoolId: schoolId.toString(),
        year: filters.year,
        role: filters.role,
        ...(type === 'monthly' && { month: filters.month }),
        ...(filters.role === 'student' && filters.class && { className: filters.class }),
      });

      const response = await fetch(`${API_BASE}/export-attendance?${query}`);
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `Laporan_Absensi_${filters.role === 'student' ? 'Siswa' : 'Guru'}_${type}_${filters.year}.xlsx`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Gagal mengunduh laporan Excel");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <Users size={14} /> Attendance Analytics
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Log <span className="text-blue-600">Absensi</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Monitoring aktivitas scan kartu</p>
        </div>

        <div className="flex w-max justify-center gap-3">
          <button 
              onClick={() => {refetch(), refetchStats()}} 
              disabled={isFetching || isFetchingStats}
              className="h-14 px-5 w-full max-w-[245px] ml-auto justify-center bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50"
            >
              <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
              {isFetching || isFetchingStats ? "Syncing..." : "Refresh"}
          </button>
          <button
            onClick={() => handleExport('monthly')}
            disabled={exportLoading}
            className="h-14 px-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all font-black uppercase text-[12px] tracking-widest"
          >
            {exportLoading ? <Loader className="animate-spin" size={16} /> : <DownloadIcon size={16} />}
            <p className="w-max relative top-[1.2px]">
              Data Bulanan
            </p>
          </button>
          <button
            onClick={() => handleExport('yearly')}
            disabled={exportLoading}
            className="h-14 w-max px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-blue-600/30"
          >
            <DownloadIcon size={16} />
            <p className="w-max relative top-[1.2px]">
              Data Tahunan
            </p>
          </button>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-3.5">
        <div className="gap-2 bg-white/5 h-14 grid p-1 grid-cols-2 overflow-hidden rounded-2xl border border-blue-700 mb-8">
          {['student', 'teacher'].map((r) => (
            <button
              key={r}
              onClick={() => setFilters({
                ...filters, 
                role: r, 
                page: 1, 
                class: "" 
              })}
              className={`h-full px-8 flex items-center gap-2 justify-center font-black rounded-xl uppercase text-[12px] tracking-widest transition-all ${
                filters.role === r ? 'bg-blue-700 text-white' : 'text-zinc-300'
              }`}
            >
              <CheckCircle2 size={14.5} />
              <p>
                {r === 'student' ? 'Data Siswa' : 'Data Guru'}
              </p>
            </button>
          ))}
        </div>

        <div className="gap-2 bg-white/5 h-14 grid p-1 grid-cols-2 overflow-hidden rounded-2xl border border-amber-400/70 mb-8">
          <button 
            onClick={() => setActiveTab('log')}
            className={`flex items-center justify-center gap-2 h-full px-8 font-black uppercase text-[12px] tracking-widest transition-all rounded-xl ${activeTab === 'log' ? 'bg-amber-600 text-white shadow-lg' : 'text-zinc-300'}`}
          >
            <List size={14} /> Log Data
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex items-center justify-center gap-2 h-full px-8 font-black uppercase text-[12px] tracking-widest transition-all rounded-xl ${activeTab === 'stats' ? 'bg-amber-600 text-white shadow-lg' : 'text-zinc-300'}`}
          >
            <BarChart3 size={14} /> Statistik
          </button>
        </div>
      </div>


      <AnimatePresence mode="wait">
          {activeTab === 'log' ? (
            <motion.div
              key="log-tab"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            >
              {/* Filter Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10" size={16} />
                  <input 
                    type="date"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-blue-500 transition-all font-bold text-white cursor-pointer"
                    value={filters.date}
                    onChange={(e) => setFilters({...filters, date: e.target.value, page: 1})}
                  />
                </div>

                <div className="relative group">
                  <select 
                    disabled={!!filters.date}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-10 py-4 text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-bold disabled:opacity-30"
                    value={filters.month}
                    onChange={(e) => setFilters({...filters, month: e.target.value, page: 1})}
                  >
                    {moment.months().map((m, i) => (
                      <option key={m} value={String(i + 1).padStart(2, '0')} className="bg-[#0B1220]">{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                </div>

                <div className="w-full gap-4 grid grid-cols-2">
                  <div className="relative group">
                    <select 
                      disabled={!!filters.date}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-10 py-4 text-sm outline-none appearance-none font-bold disabled:opacity-30"
                      value={filters.year}
                      onChange={(e) => setFilters({...filters, year: e.target.value, page: 1})}
                    >
                      {[2024, 2025, 2026].map(y => (
                        <option key={y} value={y.toString()} className="bg-[#0B1220]">{y}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                  </div>

                  {filters.role === 'student' ? (
                    <div className="relative group">
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-10 py-4 text-sm outline-none appearance-none font-bold"
                        value={filters.class}
                        onChange={(e) => setFilters({...filters, class: e.target.value, page: 1})}
                      >
                        <option value="" className="bg-[#0B1220]">Semua Kelas</option>
                        {classList.map((c: any) => (
                          <option key={c.id} value={c.className} className="bg-[#0B1220]">{c.className}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                    </div>
                  ) : (
                    <button 
                      onClick={() => setFilters({...filters, date: "", month: moment().format("MM"), year: moment().format("YYYY")})}
                      className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-[11px] font-black uppercase tracking-tighter"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.03]">
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Waktu Scan</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Informasi User</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Kelas/Jabatan</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        <tr><td colSpan={4} className="p-32 text-center"><Loader className="animate-spin mx-auto text-blue-500" size={40} /></td></tr>
                      ) : data.length === 0 ? (
                        <tr><td colSpan={4} className="p-32 text-center opacity-30 font-black uppercase tracking-widest">No Data Found</td></tr>
                      ) : (
                        data.map((item: any, idx: number) => (
                          <motion.tr 
                            key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                            className="hover:bg-white/[0.04] transition-colors group"
                          >
                            <td className="p-6">
                              <div className="text-sm font-black text-white italic">{moment(item.createdAt).format("DD MMM YYYY")}</div>
                              <div className="text-[10px] text-zinc-500 font-mono">TIME: {moment(item.createdAt).format("HH:mm:ss")}</div>
                            </td>
                            <td className="p-6">
                              <div className="font-bold text-sm text-white uppercase">{item.student?.name || item.guru?.nama}</div>
                              <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">
                                {item.userRole === 'student' ? `NIS: ${item.student?.nis}` : `ROLE: ${item.guru?.role}`}
                              </div>
                            </td>
                            <td className="p-6 text-sm font-bold text-zinc-400 italic uppercase">
                              {item.userRole === 'student' ? item.currentClass : (item.guru?.mapel || "Staff")}
                            </td>
                            <td className="p-6 text-center">
                              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest ${
                                item.status === 'Hadir' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-8 pb-12">
                <div className="text-zinc-500 text-[10px] font-black uppercase">
                    Showing <span className="text-white">{data.length}</span> / <span className="text-blue-500">{pagination.totalItems}</span> Log
                </div>
                <div className="flex gap-2">
                    <button 
                      disabled={filters.page === 1}
                      onClick={() => setFilters({...filters, page: filters.page - 1})}
                      className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase disabled:opacity-20"
                    >Prev</button>
                    <button 
                      disabled={filters.page === pagination.totalPages}
                      onClick={() => setFilters({...filters, page: filters.page + 1})}
                      className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase disabled:opacity-20"
                    >Next</button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stats-tab" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 pb-12"
            >
              {/* Stats Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Hadir', value: statsResponse?.Hadir || 0, bg: 'bg-emerald-600' },
                  { label: 'Terlambat', value: statsResponse?.Terlambat || 0, bg: 'bg-red-600' },
                  { label: 'Izin', value: statsResponse?.Izin || 0, bg: 'bg-amber-600' },
                  { label: 'Sakit', value: statsResponse?.Sakit || 0, bg: 'bg-blue-600' },
                  { label: 'Alpha', value: statsResponse?.Alpha || 0, bg: 'bg-indigo-600' },
                ].map((stat, i) => (
                  <div key={i} className={`p-6 rounded-3xl border border-white/5 ${stat.bg} shadow-xl`}>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mb-2">{stat.label}</p>
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Chart Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/60 italic">Daily Attendance Chart</h3>
                    <div className="text-[10px] text-zinc-400 font-black px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                      BATAS: {statsResponse?.deadlineInfo || "07:00:00"}
                    </div>
                  </div>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10, fontWeight: 900}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} />
                        <Tooltip 
                          cursor={{fill: '#ffffff05'}}
                          contentStyle={{backgroundColor: '#0B1220', border: '1px solid #ffffff10', borderRadius: '12px'}}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Today Extremes */}
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem]">
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-4">Paling Pagi</p>
                    {ewResponse?.todayExtremes?.earliest ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-white uppercase truncate max-w-[120px]">
                          {ewResponse.todayExtremes.earliest.student?.name}
                        </span>
                        <span className="text-xl font-black text-emerald-400">
                          {moment(ewResponse.todayExtremes.earliest.createdAt).format("HH:mm")}
                        </span>
                      </div>
                    ) : <p className="text-zinc-600 font-black text-[10px]">NO DATA</p>}
                  </div>

                  <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem]">
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-4">Paling Telat</p>
                    {ewResponse?.todayExtremes?.latest ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-white uppercase truncate max-w-[120px]">
                          {ewResponse.todayExtremes.latest.student?.name}
                        </span>
                        <span className="text-xl font-black text-red-400">
                          {moment(ewResponse.todayExtremes.latest.createdAt).format("HH:mm")}
                        </span>
                      </div>
                    ) : <p className="text-zinc-600 font-black text-[10px]">NO DATA</p>}
                  </div>
                </div>
              </div>

              {/* EARLY WARNING SYSTEM (EWS) SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Chronic Absents */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white">Kronis Alpa (7 Hari Terakhir)</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 italic">3x atau Lebih Tanpa Keterangan</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {ewResponse?.warnings?.unexcusedAbsence?.length > 0 ? (
                      ewResponse.warnings.unexcusedAbsence.map((item: any) => (
                        <div key={item.studentId} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all group">
                          <div>
                            <p className="text-sm font-black text-white uppercase group-hover:text-red-400 transition-colors">{item.student?.name}</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase">Kelas: {item.student?.class} • NIS: {item.student?.nis}</p>
                          </div>
                          <div className="px-3 py-2 bg-red-500 text-white text-[10px] font-black rounded-xl uppercase shadow-lg shadow-red-500/20">
                            {item.totalAlpa}x Alpa
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center opacity-20 font-black text-[10px] uppercase tracking-[0.3em]">Status Aman</div>
                    )}
                  </div>
                </div>

                {/* Habitual Laters */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white">Sering Terlambat</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 italic">Datang di atas jam 07:00 (3x+ Seminggu)</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {ewResponse?.warnings?.habitualLaters?.length > 0 ? (
                      ewResponse.warnings.habitualLaters.map((item: any) => (
                        <div key={item.studentId} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
                          <div>
                            <p className="text-sm font-black text-white uppercase group-hover:text-amber-400 transition-colors">{item.student?.name}</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase">Kelas: {item.student?.class}</p>
                          </div>
                          <div className="px-3 py-2 bg-amber-500 text-black text-[10px] font-black rounded-xl uppercase shadow-lg shadow-amber-500/20">
                            {item.totalLate}x Telat
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center opacity-20 font-black text-[10px] uppercase tracking-[0.3em]">Disiplin Terjaga</div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}