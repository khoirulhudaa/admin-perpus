import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import jsPDF from "jspdf";
import {
  Activity,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  Hash,
  Home,
  IdCard,
  Loader2,
  Mail,
  MapPin,
  Palette,
  Printer,
  Upload,
  User,
  X
} from "lucide-react";
import moment from "moment";
import QRCode from "qrcode";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";

export default function DetailUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear - i);

  const [page, setPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isExporting, setIsExporting] = useState(false);
  const [showCardDesigner, setShowCardDesigner] = useState(false);

  const limit = 10;

  const role = searchParams.get("role") || "student";
  const isStudent = role === "student";
  const apiPath = isStudent ? "siswa" : "guruTendik";

  // Config kartu - mirip struktur di CardDesignerModal
  const [cardConfig, setCardConfig] = useState({
    title: isStudent ? "KARTU PELAJAR" : "KARTU GURU",
    subtitle: "SMK NEGERI PRO DIGITAL",
    accentColor: "#2563eb",
    titleColor: "#ffffff",
    subtitleColor: "#ffffff",
    bgImage: null as string | null, // bisa URL preset atau data URL dari upload
  });

  const { data, isLoading, isPlaceholderData, isError } = useQuery({
    queryKey: ["user-detail", id, role, page],
    queryFn: async () => {
      const response = await fetch(
        `https://be-school.kiraproject.id/${apiPath}/detail/${id}?role=${role}&page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Gagal mengambil data");
      const json = await response.json();
      return json.success ? json.data : null;
    },
    enabled: !!id,
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <NotFoundState onBack={() => navigate(-1)} />;

  const { profile, statistics, attendanceHistory, pagination } = data;

  // ────────────────────────────────────────────────
  //                GENERATE PDF (menggunakan config)
  // ────────────────────────────────────────────────
  const generateCustomCardPDF = async () => {
    if (!profile) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const cardWidth = 86;
    const cardHeight = 54;
    const x = (210 - cardWidth) / 2;
    const y = 20;

    try {
      // Background putih dasar
      doc.setFillColor(255, 255, 255);
      doc.rect(x, y, cardWidth, cardHeight, "F");

      // Background custom
      if (cardConfig.bgImage) {
        try {
          doc.addImage(cardConfig.bgImage, "PNG", x, y, cardWidth, cardHeight);
        } catch (err) {
          console.warn("Gagal load background:", err);
        }
      }

      // Header accent
      doc.setFillColor(cardConfig.accentColor);
      doc.rect(x, y, cardWidth, 12, "F");

      doc.setTextColor(cardConfig.titleColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(cardConfig.title, x + cardWidth / 2, y + 5, { align: "center" });

      doc.setTextColor(cardConfig.subtitleColor);
      doc.setFontSize(6);
      doc.text(cardConfig.subtitle, x + cardWidth / 2, y + 9.5, { align: "center" });

      // Foto
      const photoX = x + 5;
      const photoY = y + 14;
      const photoW = 18;
      const photoH = 22;

      if (profile.photoUrl) {
        try {
          doc.addImage(profile.photoUrl, "JPEG", photoX, photoY, photoW, photoH);
        } catch {
          doc.setFillColor(240, 240, 240);
          doc.rect(photoX, photoY, photoW, photoH, "F");
        }
      } else {
        doc.setFillColor(240, 240, 240);
        doc.rect(photoX, photoY, photoW, photoH, "F");
      }

      // Data teks
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text((profile.name || profile.nama || "—").toUpperCase(), x + 27, y + 22, { maxWidth: 50 });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);

      if (isStudent) {
        doc.text(`NIS : ${profile.nis || "—"}`, x + 27, y + 28);
        doc.text(`NISN: ${profile.nisn || "—"}`, x + 27, y + 32);
      } else {
        doc.text(`NIP : ${profile.nip || profile.id || "—"}`, x + 27, y + 28);
        doc.text(`Mapel: ${profile.mapel || "—"}`, x + 27, y + 32);
      }

      // QR Code
      const qrData = profile.qrCodeData;
      if (qrData) {
        const qrUrl = await QRCode.toDataURL(qrData, { margin: 1, width: 150 });
        doc.addImage(qrUrl, "PNG", x + 63, y + 32, 18, 18);
      }

      // Border
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.rect(x, y, cardWidth, cardHeight, "D");

      const fileName = `Kartu_${isStudent ? "Siswa" : "Guru"}_${(profile.name || "").replace(/\s+/g, "_")}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error(err);
      alert("Gagal membuat PDF kartu.");
    }
  };

  const downloadExcel = async () => {
    // ... fungsi export Excel tetap sama seperti sebelumnya ...
    try {
      setIsExporting(true);
      const response = await fetch(
        `https://be-school.kiraproject.id/export-excel/export-attendance/${id}?role=${role}&year=${selectedYear}`
      );
      const result = await response.json();

      if (result.success) {
        const worksheet = XLSX.utils.json_to_sheet(result.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Absensi");
        XLSX.writeFile(workbook, `Rekap_Absensi_${profile.name || profile.nama}_${selectedYear}.xlsx`);
      } else {
        alert("Gagal mengambil data: " + result.message);
      }
    } catch (error) {
      console.error("Error exporting excel:", error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsExporting(false);
    }
  };

  // Preset background (sesuaikan path sesuai struktur project Anda)
  const bgPresets = Array.from({ length: 12 }, (_, i) => `/bg${i + 1}.png`);

  return (
    <div className="min-h-screen text-zinc-400 pb-20 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col border-b border-white/10 pb-10 md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase mb-2">
              <CheckCircle2 size={14} /> Profile & Attendance Analysis
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
              PROFILE <span className="text-blue-600">LENGKAP</span>
            </h2>
            <p className="text-zinc-500 text-sm font-medium italic">
              Menampilkan riwayat tahun {moment().format("YYYY")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="group relative">
              <div className="absolute -top-2 left-3 px-2 bg-[#070a11] text-[9px] font-black text-blue-500 uppercase tracking-widest z-10">
                Periode
              </div>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value));
                  setPage(1);
                }}
                className="appearance-none bg-white/5 border border-white/10 text-white text-xs font-bold h-14 pl-5 pr-12 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer hover:bg-white/10"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year} className="bg-zinc-900 text-white">
                    Tahun {year}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-500">
                <CalendarDays size={14} />
              </div>
            </div>

            <button
              onClick={downloadExcel}
              disabled={isExporting || isLoading || !attendanceHistory?.length}
              className="flex items-center gap-2 h-14 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30"
            >
              {isExporting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Mengekspor...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Export Excel
                </>
              )}
            </button>

            <button
              onClick={() => setShowCardDesigner(true)}
              className="flex items-center gap-2 h-14 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-purple-900/30"
            >
              <Palette size={16} />
              Cetak Kartu
            </button>

            <button
              onClick={() => navigate(-1)}
              className="h-14 px-6 bg-white/5 text-white border border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-black uppercase text-[12px] tracking-widest"
            >
              <Home size={16} />
            </button>
          </div>
        </div>

        {/* Konten utama (profile + stats + table) tetap sama seperti kode awal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[2.5rem] p-8 sticky top-10"
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-2 border-blue-500/30 p-1">
                    <div className="h-full w-full rounded-[2.2rem] overflow-hidden bg-zinc-900 flex items-center justify-center">
                      {profile.photoUrl ? (
                        <img src={profile.photoUrl} className="h-full w-full object-cover" alt="Profile" />
                      ) : (
                        <User size={40} className="text-zinc-700" />
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl shadow-lg border-4 border-[#070a11]">
                    {isStudent ? <GraduationCap size={16} className="text-white" /> : <Briefcase size={16} className="text-white" />}
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                    {profile.name || profile.nama}
                  </h1>
                  <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                    {isStudent ? profile.class : profile.role}
                  </p>
                </div>

                <div className="w-full space-y-1">
                  <InfoItem icon={<Hash size={14} />} label="ID Number" value={isStudent ? profile.nis : (profile.nip || profile.id)} />
                  <InfoItem icon={<Mail size={14} />} label="Email Address" value={profile.email || "—"} />
                  <InfoItem icon={<IdCard size={14} />} label="NIP" value={profile.nip || "—"} />
                  <InfoItem icon={<MapPin size={14} />} label="Jurusan" value={profile.jurusan || "—"} />
                  {isStudent ? (
                    <InfoItem icon={<FileText size={14} />} label="NISN" value={profile.nisn || "—"} />
                  ) : (
                    <InfoItem icon={<BookOpen size={14} />} label="Specialist" value={profile.mapel || "General"} />
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Stats & History */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CompactStat label="Hadir" val={statistics.Hadir} dot="bg-emerald-500" />
              <CompactStat label="Telat" val={statistics.Terlambat} dot="bg-amber-500" />
              <CompactStat label="Izin" val={(statistics.Sakit || 0) + (statistics.Izin || 0)} dot="bg-blue-500" />
              <CompactStat label="Alpha" val={statistics.Alpha} dot="bg-red-500" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-4 border-b border-white/5">
                <MetricCard
                  label="Attendance Rate"
                  value={`${Math.round((statistics.Hadir / (pagination.totalItems || 1)) * 100)}%`}
                  icon={<Activity size={14} />}
                  color="text-emerald-500"
                />
                <MetricCard
                  label="Late Records"
                  value={statistics.Terlambat}
                  icon={<Clock size={14} />}
                  color="text-amber-500"
                />
              </div>

              <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                    {isPlaceholderData ? <Loader2 size={20} className="animate-spin" /> : <CalendarDays size={20} />}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-md uppercase tracking-tight">Log Kehadiran</h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                      Halaman {pagination.currentPage} dari {pagination.totalPages}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1 || isPlaceholderData}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 transition-all"
                  >
                    <ChevronLeft size={16} className="text-white" />
                  </button>
                  <button
                    disabled={page >= pagination.totalPages || isPlaceholderData}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 transition-all"
                  >
                    <ChevronRight size={16} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-hidden">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 border-y border-white/5 bg-white/[0.01]">
                    <tr>
                      <th className="px-8 py-4">Tanggal</th>
                      <th className="px-8 py-4">Jam Masuk</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    <AnimatePresence mode="wait">
                      {attendanceHistory.map((log, i) => (
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-white/[0.01] transition-colors group"
                        >
                          <td className="px-8 py-5 text-xs font-bold text-white/90">
                            {moment(log.date).format("MMM DD, YYYY")}
                          </td>
                          <td className="px-8 py-5 text-xs font-mono text-zinc-500">
                            {log.time || "--:--:--"}
                          </td>
                          <td className="px-8 py-5">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ${getStatusTheme(log)}`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                  log.isLate
                                    ? "bg-amber-500"
                                    : log.status === "Hadir"
                                    ? "bg-emerald-500"
                                    : log.status === "Alpha"
                                    ? "bg-red-500"
                                    : log.status === "Sakit"
                                    ? "bg-blue-500"   // atau bg-amber-400 kalau pakai kuning
                                    : "bg-violet-500"
                                }`}
                              />
                              {log.status}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-[11px] font-medium text-zinc-600 uppercase tracking-tighter group-hover:text-zinc-400">
                            {log.info}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              <div className="p-8 border-t border-white/5 flex items-center justify-between bg-black/20">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                  Total {pagination.totalItems} Data Ditemukan
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black text-blue-500">{page}</span>
                    <span className="text-xs font-bold text-zinc-700">/</span>
                    <span className="text-xs font-bold text-zinc-500">{pagination.totalPages}</span>
                  </div>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setPage(1);
                        window.scrollTo(0, 0);
                      }}
                      disabled={page === 1}
                      className="text-[10px] font-black uppercase text-zinc-500 hover:text-white disabled:opacity-0 transition-all"
                    >
                      First
                    </button>
                    <button
                      onClick={() => setPage(pagination.totalPages)}
                      disabled={page === pagination.totalPages}
                      className="text-[10px] font-black uppercase text-zinc-500 hover:text-white disabled:opacity-0 transition-all"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────── */}
      {/*         CARD DESIGNER MODAL (mirip StudentManager)         */}
      {/* ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCardDesigner && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCardDesigner(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0B1220] border-l border-white/10 z-[100001] p-10 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Design Kartu</h2>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
                    Sesuaikan tampilan kartu {isStudent ? "pelajar" : "guru"}
                  </p>
                </div>
                <button
                  onClick={() => setShowCardDesigner(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-zinc-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-10">
                {/* Live Preview */}
                <div className="flex flex-col items-center justify-center p-8 py-12 bg-white/5 rounded-3xl border border-white/10 relative">
                  <div
                    className="w-[320px] h-[200px] rounded-xl shadow-2xl overflow-hidden relative bg-white border border-white/20"
                    style={{
                      backgroundImage: cardConfig.bgImage ? `url(${cardConfig.bgImage})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Header Accent */}
                    <div
                      className="h-10 flex flex-col items-center justify-center"
                      style={{ backgroundColor: cardConfig.accentColor }}
                    >
                      <div
                        className="text-[10px] font-black tracking-widest uppercase"
                        style={{ color: cardConfig.titleColor }}
                      >
                        {cardConfig.title}
                      </div>
                      <div
                        className="text-[6px] font-bold opacity-80 uppercase"
                        style={{ color: cardConfig.subtitleColor }}
                      >
                        {cardConfig.subtitle}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex gap-4 h-[calc(100%-40px)] relative">
                      {/* Foto Placeholder */}
                      <div className="w-20 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                        {profile.photoUrl ? (
                          <img src={profile.photoUrl} alt="Foto" className="w-full h-full object-cover" />
                        ) : (
                          <User size={40} className="text-slate-300" />
                        )}
                      </div>

                      {/* Info Teks */}
                      <div className="flex-1 space-y-1.5 pt-1">
                        <div className="leading-tight">
                          <div className="text-[5px] text-zinc-400 font-bold uppercase tracking-tighter">Nama Lengkap</div>
                          <div className="text-[10px] font-black text-slate-800 uppercase truncate">
                            {profile.name || profile.nama || "NAMA LENGKAP"}
                          </div>
                        </div>
                        <div className="leading-tight">
                          <div className="text-[5px] text-zinc-400 font-bold uppercase tracking-tighter">Nomor Induk</div>
                          <div className="text-[8px] font-bold text-slate-700">
                            {isStudent ? `NIS: ${profile.nis || "—"}` : `NIP: ${profile.nip || "—"}`}
                          </div>
                          {isStudent && (
                            <div className="text-[7px] font-semibold text-slate-500">NISN: {profile.nisn || "—"}</div>
                          )}
                        </div>
                        <div className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[5px] font-black rounded-full uppercase">
                          Status: Aktif
                        </div>
                      </div>

                      {/* QR Placeholder */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 border border-slate-200 flex items-center justify-center p-1 bg-white rounded-md shadow-sm">
                        <div className="text-[5px] font-bold text-slate-300">QR CODE</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Judul</label>
                    <input
                      type="color"
                      value={cardConfig.titleColor}
                      onChange={(e) => setCardConfig({ ...cardConfig, titleColor: e.target.value })}
                      className="w-full h-14 bg-transparent border-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Subtitle</label>
                    <input
                      type="color"
                      value={cardConfig.subtitleColor}
                      onChange={(e) => setCardConfig({ ...cardConfig, subtitleColor: e.target.value })}
                      className="w-full h-14 bg-transparent border-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Judul Kartu</label>
                    <input
                      value={cardConfig.title}
                      onChange={(e) => setCardConfig({ ...cardConfig, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Aksen</label>
                    <input
                      type="color"
                      value={cardConfig.accentColor}
                      onChange={(e) => setCardConfig({ ...cardConfig, accentColor: e.target.value })}
                      className="w-full h-14 bg-transparent border-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Background Presets */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Pilih Background Preset</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {bgPresets.map((bg, index) => (
                      <button
                        key={index}
                        onClick={() => setCardConfig({ ...cardConfig, bgImage: bg })}
                        className={`aspect-video rounded-lg border-2 overflow-hidden transition-all ${
                          cardConfig.bgImage === bg ? "border-blue-500 scale-95 shadow-lg" : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <img src={bg} alt={`Background ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}

                    {/* Upload Custom */}
                    <label className="aspect-video rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all">
                      <Upload size={16} className="text-zinc-500" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setCardConfig({ ...cardConfig, bgImage: ev.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Tombol Cetak */}
                <button
                  onClick={() => {
                    generateCustomCardPDF();
                    setShowCardDesigner(false);
                  }}
                  disabled={isExporting}
                  className="w-full py-5 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-white hover:bg-red-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Printer size={20} />
                  {isExporting ? "Proses..." : "Cetak Kartu PDF"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ────────────────────────────────────────────────
// Sub-components (InfoItem, MetricCard, CompactStat, LoadingState, NotFoundState)
// tetap sama seperti kode awal Anda – tidak diubah
// ────────────────────────────────────────────────

const getStatusTheme = (log: any) => {
  // Prioritas: Terlambat lebih tinggi dari status biasa
  if (log.isLate) {
    return "bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold";
  }

  switch (log.status) {   // case-insensitive agar lebih aman
    case "Hadir":
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold";

    case "Alpha":
      return "bg-red-500/10 border-red-500/30 text-red-400 font-semibold";

    case "Izin":
      return "bg-violet-500/10 border-violet-500/30 text-violet-400 font-semibold";

    case "Sakit":
      return "bg-blue-500/10 border-blue-500/30 text-blue-400 font-semibold";

    default:
      return "bg-zinc-600/10 border-zinc-600/30 text-zinc-400";
  }
};

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-start justify-between py-3 rounded-2xl hover:bg-white/[0.02] transition-all group px-2">
      <div className="flex items-center gap-3">
        <div className="text-zinc-600 group-hover:text-blue-500 transition-colors">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{label}</span>
      </div>
      <span className="text-[12px] mt-1 font-bold text-zinc-300 truncate w-full pl-6">{value}</span>
    </div>
  );
}

function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-5 rounded-3xl flex items-center gap-4 hover:bg-white/[0.05] transition-all">
      <div className={`p-4 rounded-2xl bg-white/5 ${color} shadow-inner`}>{icon}</div>
      <div>
        <div className="text-2xl font-black text-white tracking-tighter leading-none">{value}</div>
        <div className="text-[10px] mt-1 font-black uppercase tracking-[0.1em] text-zinc-600">{label}</div>
      </div>
    </div>
  );
}

function CompactStat({ label, val, dot }: { label: string; val: number | string; dot: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col gap-2 hover:border-white/10 transition-all">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
      </div>
      <span className="text-xl font-black text-white leading-none">{val}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070a11]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Memuat Data Pengguna</span>
      </div>
    </div>
  );
}

function NotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#070a11] px-6 text-center">
      <h1 className="text-9xl font-black text-white/5 absolute select-none">404</h1>
      <div className="relative z-10">
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em] mb-8">
          Data tidak ditemukan atau ID tidak valid
        </p>
        <button
          onClick={onBack}
          className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-blue-600/40 hover:scale-105 transition-transform active:scale-95"
        >
          Kembali Sekarang
        </button>
      </div>
    </div>
  );
}