import { useSchool } from "@/features/schools";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, CalendarDays, ChevronLeft, ChevronRight, LayoutDashboard, ListFilter, RotateCw, Users } from "lucide-react";
import moment from "moment";
import { useState, useMemo } from "react";
import { FaSpinner } from "react-icons/fa";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BASE_URL = "https://be-perpus.vercel.app";

// --- API Fetcher ---
const fetchKunjunganReport = async ({ schoolId, filterMode, selectedMonth, selectedYear, currentPage, limit }: any) => {
  if (!schoolId) return null;
  
  const params: any = { 
    schoolId: schoolId.toString(),
    page: currentPage,
    limit: limit
  };

  if (filterMode === "monthly") {
    params.month = selectedMonth;
    params.year = selectedYear;
  } else {
    params.date = moment().format("YYYY-MM-DD");
  }

  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/peminjam/report?${query}`);
  const json = await res.json();
  
  if (!json.success) throw new Error(json.message);
  return json;
};

export default function KunjunganReportMain() {
  // Filter States
  const [filterMode, setFilterMode] = useState("today");
  const [selectedMonth, setSelectedMonth] = useState(moment().format("MM"));
  const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));
  
  // Pagination & Selector States
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  // --- React Query ---
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["kunjungan-report", schoolId, filterMode, selectedMonth, selectedYear, currentPage, limit],
    queryFn: () => fetchKunjunganReport({ schoolId, filterMode, selectedMonth, selectedYear, currentPage, limit }),
    enabled: !!schoolId,
    staleTime: 2 * 60 * 1000, // Cache selama 2 menit
  });

  // --- Formatted Data for Chart ---
  const chartData = useMemo(() => {
    if (!data?.chartData) return [];
    return data.chartData.map((d: any) => ({
      name: moment(d.label).format("DD MMM"),
      pengunjung: Number(d.totalMasuk),
    }));
  }, [data?.chartData]);

  const summary = data?.summary || { totalKunjungan: 0, totalSiswa: 0, totalGuru: 0, masihDiDalam: 0 };
  const tableData = data?.tableData || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const changeFilterMode = (mode: string) => {
    setFilterMode(mode);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen text-slate-900">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 font-black text-blue-600 uppercase tracking-[0.3em] text-[10px]">
            <BarChart3 size={14} /> Analytics Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-800">
            Data <span className="text-blue-600">Kunjungan</span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <button 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="p-4 bg-blue-600 border border-slate-200 rounded-xl text-white hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <RotateCw size={18} className={isFetching ? "animate-spin" : ""} />
          </button>

          <div className="flex bg-white border border-slate-200 rounded-xl px-2 py-1.5 shadow-sm">
            <button onClick={() => changeFilterMode("today")} className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${filterMode === 'today' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Hari Ini</button>
            <button onClick={() => changeFilterMode("monthly")} className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${filterMode === 'monthly' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Bulanan</button>
          </div>
          {filterMode === "monthly" && (
            <div className="flex gap-2">
              <select className="px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:ring-2 ring-blue-500/20" value={selectedMonth} onChange={(e) => {setSelectedMonth(e.target.value); setCurrentPage(1);}}>
                {moment.months().map((m, i) => (<option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>))}
              </select>
              <select className="px-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:ring-2 ring-blue-500/20" value={selectedYear} onChange={(e) => {setSelectedYear(e.target.value); setCurrentPage(1);}}>
                {[2024, 2025, 2026].map(y => <option key={y} value={String(y)}>{y}</option>)}
              </select>
            </div>
          )}
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Kunjungan", value: summary.totalKunjungan, color: "text-blue-600", bg: "bg-blue-50", icon: <Users size={20}/> },
          { label: "Siswa", value: summary.totalSiswa, color: "text-emerald-600", bg: "bg-emerald-50", icon: <Users size={20}/> },
          { label: "Guru / Staf", value: summary.totalGuru, color: "text-orange-600", bg: "bg-orange-50", icon: <Users size={20}/> },
          { label: "Masih Di Dalam", value: summary.masihDiDalam, color: "text-rose-600", bg: "bg-rose-50", icon: <LayoutDashboard size={20}/> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 relative z-10`}>{stat.icon}</div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 relative z-10">{stat.label}</p>
            <h4 className="text-2xl font-black text-slate-800 tracking-tighter relative z-10">
              {isLoading ? "..." : stat.value}
            </h4>
          </div>
        ))}
      </div>

      {/* Tren Chart */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 mb-8 shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-8">
          <CalendarDays size={14} /> Tren Kunjungan Perpustakaan
        </h3>
        <div className="h-72 w-full">
          {isLoading ? (
             <div className="h-full flex flex-col items-center justify-center gap-3">
                <FaSpinner className="animate-spin text-blue-600" size={24} />
                <span className="text-[10px] font-black uppercase text-slate-400 animate-pulse">Menghitung Data...</span>
             </div>
          ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-300 text-[10px] font-black uppercase italic">Belum Ada Data Kunjungan</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '900' }} />
                <Bar dataKey="pengunjung" radius={[6, 6, 0, 0]} barSize={filterMode === 'today' ? 60 : 30}>
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Table Section */}
      <main className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex items-center gap-2 text-slate-500 font-black uppercase text-[10px] tracking-widest">
            <ListFilter size={14} /> {isFetching ? <span className="text-blue-500 animate-pulse">Syncing...</span> : "Riwayat Log Kunjungan"}
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-[9px] font-black uppercase text-slate-400">Tampilkan:</label>
            <select 
              value={limit} 
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg text-[10px] font-black px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
            >
              {[10, 20, 50, 100].map(v => <option key={v} value={v}>{v} Baris</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Pengunjung</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Waktu Masuk</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Waktu Pulang</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Durasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-24 text-center"><FaSpinner className="animate-spin mx-auto text-blue-600" size={30} /></td></tr>
              ) : tableData.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-300 text-[10px] font-black uppercase italic">Tidak ada log aktivitas</td></tr>
              ) : tableData.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black uppercase text-slate-800 tracking-tighter group-hover:text-blue-600 transition-colors">{log.userName || "Tanpa Nama"}</p>
                    <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded tracking-tighter">{log.userRole}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${log.waktuPulang ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600 animate-pulse'}`}>
                      {log.waktuPulang ? 'Selesai' : 'Di Dalam'}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="text-xs font-black text-slate-700">{moment(log.waktuMasuk).format("HH:mm")}</div>
                    <div className="text-[9px] text-slate-400 font-bold tracking-tight">{moment(log.waktuMasuk).format("DD MMM YYYY")}</div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    {log.waktuPulang ? (
                      <>
                        <div className="text-xs font-black text-slate-700">{moment(log.waktuPulang).format("HH:mm")}</div>
                        <div className="text-[9px] text-slate-400 font-bold tracking-tight">{moment(log.waktuPulang).format("DD MMM YYYY")}</div>
                      </>
                    ) : (
                      <div className="text-[10px] font-black text-slate-300 uppercase italic">Active</div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right font-black text-xs text-slate-700 italic">
                    {log.waktuPulang ? `${moment(log.waktuPulang).diff(moment(log.waktuMasuk), 'minutes')} Min` : "---"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Halaman <span className="text-slate-800">{currentPage}</span> dari <span className="text-slate-800">{totalPages || 1}</span>
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0 || isLoading}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}