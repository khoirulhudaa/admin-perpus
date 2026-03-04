import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { debounce } from "lodash";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database, // Icon baru untuk export
  Download,
  GraduationCap,
  Mail,
  Map as MapIcon,
  RefreshCw,
  School,
  Search,
  ShieldCheck,
  Trash2,
  User,
  Users,
  XCircle
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate } from "react-router-dom";

// --- Fix Icon Leaflet ---
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_BASE = "https://be-school.kiraproject.id";
const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

export function SchoolManagementDashboard() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const headers = useMemo(() => ({ 
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }), [token]);

  // --- States ---
  const [activeTab, setActiveTab] = useState<'sekolah' | 'siswa' | 'guru'>('sekolah');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // --- 1. Query: Stats ---
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/sekolah/stats`, { headers });
      const json = await res.json();
      return json.success ? json.data : null;
    },
    staleTime: 5 * 60 * 1000,
  });

  // --- 2. Query: Master Schools (Untuk Dropdown & Map) ---
  const { data: masterSchools = [] } = useQuery({
    queryKey: ['schools-master'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/sekolah/`, { headers });
      const json = await res.json();
      if (json.success && json.data.length > 0 && !selectedSchoolId) {
        setSelectedSchoolId(json.data[0].id.toString());
      }
      return json.success ? json.data : [];
    },
    staleTime: 10 * 60 * 1000,
  });

  // --- 3. Query: Schools Paged ---
  const { data: pagedSchools, isLoading: isSchoolsLoading } = useQuery({
    queryKey: ['schools-paged', page, debouncedSearch],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE}/sekolah/paged?page=${page}&limit=${limit}&name=${debouncedSearch}`,
        { headers }
      );
      return res.json();
    },
    enabled: activeTab === 'sekolah',
    staleTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  // --- 4. Query: Member List (Siswa/Guru) ---
  const { data: listData, isLoading: isListLoading, isFetching: isListFetching } = useQuery({
    queryKey: [activeTab, selectedSchoolId, page, debouncedSearch],
    queryFn: async () => {
      const endpoint = activeTab === 'siswa' ? 'siswa' : 'guruTendik'; 
      const res = await fetch(
        `${API_BASE}/${endpoint}?schoolId=${selectedSchoolId}&page=${page}&limit=${limit}&name=${debouncedSearch}`,
        { headers }
      );
      return res.json();
    },
    enabled: activeTab !== 'sekolah' && !!selectedSchoolId,
    staleTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  // --- Mutation: Update Status ---
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: boolean }) => {
      const res = await fetch(`${API_BASE}/sekolah/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ids: [id], status })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools-paged'] });
      queryClient.invalidateQueries({ queryKey: ['schools-master'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    }
  });

  // --- Export Handler ---
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      let url = "";
      let fileName = "";

      if (activeTab === 'sekolah') {
        url = `${API_BASE}/sekolah/export/sekolah`;
        fileName = "Daftar_Seluruh_Sekolah.xlsx";
      } else if (activeTab === 'siswa') {
        url = `${API_BASE}/sekolah/export/siswa/${selectedSchoolId}`;
        fileName = `Data_Siswa_Sekolah_${selectedSchoolId}.xlsx`;
      } else {
        url = `${API_BASE}/sekolah/export/guru/${selectedSchoolId}`;
        fileName = `Data_Guru_Sekolah_${selectedSchoolId}.xlsx`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Gagal mengunduh file");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Export Error:", error);
      alert("Terjadi kesalahan saat mengekspor data.");
    } finally {
      setIsExporting(false);
    }
  };

  // --- Handlers ---
  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => { setDebouncedSearch(val); setPage(1); }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const isSekolah = activeTab === 'sekolah';
  const currentTableData = isSekolah ? pagedSchools?.data : listData?.data;
  const currentPagination = isSekolah ? pagedSchools?.pagination : listData?.pagination;
  const isCurrentLoading = isSekolah ? isSchoolsLoading : isListLoading;

  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/10 pb-10">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 mb-3 font-black text-blue-500 uppercase tracking-[0.4em] text-[10px]">
            <ShieldCheck size={14} /> Master Dashboard
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
            Data <span className="text-blue-700">Statistik</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola sekolah, siswa dan guru</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => queryClient.invalidateQueries()} 
            className="w-max h-14 px-5 justify-center bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50"
          >
            <RefreshCw size={16} className={isListFetching ? "animate-spin" : ""} />
            {isListFetching ? "Syncing..." : "Refresh Data"}
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Sekolah", value: stats?.totalSekolah || 0, icon: <School />, color: "text-blue-500" },
          { label: "Total Guru", value: stats?.totalGuru || 0, icon: <Users />, color: "text-emerald-500" },
          { label: "Total Siswa", value: stats?.totalSiswa || 0, icon: <GraduationCap />, color: "text-purple-500" },
        ].map((item, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 px-8 py-6 rounded-3xl relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{item.label}</div>
              <div className={`text-3xl font-black ${item.color}`}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content (Tabs) */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4 items-end">
          <div className="flex flex-col md:flex-row gap-4 items-end h-[62px]">
            <div className="flex gap-2 p-1.5 h-full bg-white/5 border border-white/10 rounded-[1.25rem] items-center w-full md:w-auto">
              {['sekolah', 'siswa', 'guru'].map((t) => (
                <button 
                  key={t}
                  onClick={() => { setActiveTab(t as any); setPage(1); setSearchTerm(""); setDebouncedSearch(""); }}
                  className={clsx(
                    "px-6 md:px-8 h-full rounded-xl text-[12px] font-black uppercase tracking-widest transition-all",
                    activeTab === t ? "bg-blue-600 text-white shadow-xl" : "text-white/40 hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className={clsx(
              "space-y-3 w-max transition-all h-full duration-300",
              activeTab === 'sekolah' ? "opacity-40 cursor-not-allowed" : "opacity-100"
            )}>
              <div className="relative">
                <Database className={clsx(
                  "absolute left-5 top-1/2 -translate-y-1/2",
                  activeTab === 'sekolah' ? "text-white/20" : "text-blue-500"
                )} size={16} />
                <select 
                  disabled={activeTab === 'sekolah'}
                  value={selectedSchoolId}
                  onChange={(e) => { setSelectedSchoolId(e.target.value); setPage(1); }}
                  className={clsx(
                    "w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-10 py-5 text-[12px] font-black appearance-none outline-none transition-all",
                    activeTab === 'sekolah' ? "cursor-not-allowed" : "focus:border-blue-500 hover:bg-white/[0.07]"
                  )}
                >
                  {masterSchools.map((s: any) => (
                    <option key={s.id} value={s.id} className="bg-zinc-900 text-white text-[12px]">{s.namaSekolah}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20" size={14} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] h-[62px] gap-4 w-full">
            <div className="relative h-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                placeholder={`Cari ${activeTab}...`} 
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-white/5 border placeholder:uppercase border-white/10 rounded-2xl pl-14 pr-6 py-5 text-[12px] outline-none focus:border-blue-500"
              />
            </div>
            {/* Button Export Excel */}
            <button
              onClick={handleExportExcel}
              disabled={isExporting || (activeTab !== 'sekolah' && !selectedSchoolId)}
              className="w-max h-14 px-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-2 hover:bg-emerald-500/20 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50"
            >
              <Download size={16} className={isExporting ? "animate-bounce" : ""} />
              {isExporting ? "Exporting..." : "Excel"}
            </button>
          </div>
        </div>

        {/* Dynamic Table Section */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5 bg-white/[0.01]">
              <tr>
                <th className="p-8">{isSekolah ? 'Informasi Institusi' : 'Profil & Identitas'}</th>
                <th className="py-8">{isSekolah ? 'Email' : (activeTab === 'siswa' ? 'Kelas' : 'Jabatan')}</th>
                <th className="py-8 text-center">Status</th>
                <th className="p-8 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isCurrentLoading ? (
                <tr><td colSpan={4} className="p-32 text-center animate-pulse tracking-[0.5em] text-white/20 text-[10px] uppercase">Syncing Analytics...</td></tr>
              ) : currentTableData?.map((item: any) => (
                <tr key={item.id} className="group hover:bg-white/[0.01] transition-all">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 group-hover:border-blue-500/50 transition-all">
                        {isSekolah ? <School size={20} /> : (item.photoUrl ? <img src={item.photoUrl} className="h-full w-full object-cover rounded-2xl" /> : <User size={20} />)}
                      </div>
                      <div>
                        <div className="text-sm font-bold uppercase tracking-tight">{item.namaSekolah || item.name || item.nama}</div>
                        <div className="text-[12px] text-white/50 font-black uppercase mt-0.5">ID: {item.npsn || item.nis || item.nip || item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                     <div className="text-[12px] font-mono text-white/80 flex items-center gap-2">
                       {isSekolah ? (
                         <><Mail size={12} className="text-blue-500/50" />{item.email}</>
                       ) : (
                         item.class || item.position || '-'
                       )}
                     </div>
                  </td>
                  <td className="py-8">
                    <div className="flex flex-col items-center gap-1">
                      <span className={clsx("h-1.5 w-1.5 rounded-full", (item.isActive !== false) ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500")} />
                      <span className={clsx("text-[10px] font-black uppercase tracking-widest", (item.isActive !== false) ? "text-emerald-500" : "text-red-500")}>
                        {(item.isActive !== false) ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2">
                      {isSekolah && (
                        <button 
                          onClick={() => updateStatus.mutate({ id: item.id, status: !item.isActive })}
                          className="h-10 w-10 flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          {item.isActive ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                        </button>
                      )}
                      <button className="h-10 w-10 flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
            <span className="text-[10px] font-black text-white/20 uppercase">Total Items: {currentPagination?.totalItems || 0}</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl disabled:opacity-20 hover:bg-white/10"><ChevronLeft size={20} /></button>
              <div className="bg-white/5 border border-white/10 px-6 h-12 flex items-center rounded-2xl text-xs font-black text-blue-500 uppercase tracking-widest">Page {page} / {currentPagination?.totalPages || 1}</div>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= (currentPagination?.totalPages || 1)} className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl disabled:opacity-20 hover:bg-white/10"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Geolocation Section */}
      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[3rem] overflow-hidden">
        <div className="px-6 py-4 flex items-center gap-2 font-black text-blue-500 uppercase tracking-[0.2em] text-[10px]">
          <MapIcon size={14} /> Regional Distribution
        </div>
        <div className="h-[400px] w-full rounded-[2.5rem] overflow-hidden border border-white/10">
          <MapContainer center={[-2.5, 118]} zoom={5} style={{ height: '100%', width: '100%', background: '#0a0a0a' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            {masterSchools.map((s: any, idx: number) => (
              s.lat && s.long && (
                <Marker key={idx} position={[parseFloat(s.lat), parseFloat(s.long)]}>
                  <Popup><div className="text-black font-bold p-1 uppercase text-xs">{s.namaSekolah}</div></Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}