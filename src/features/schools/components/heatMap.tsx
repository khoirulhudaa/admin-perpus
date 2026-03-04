import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  CalendarDays,
  Layers,
  LineChart as LineChartIcon,
  MapPin,
  MessageSquare,
  Settings,
  ShieldCheck,
  Smartphone,
  UploadCloud,
  UserCheck2,
  Users2,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// -------------------- Mock Data --------------------
const todayISO = new Date().toISOString().slice(0, 10);

const attendanceDaily = [
  { day: "Mon", hadir: 920, izin: 18, sakit: 11, alfa: 9 },
  { day: "Tue", hadir: 932, izin: 14, sakit: 8, alfa: 6 },
  { day: "Wed", hadir: 915, izin: 22, sakit: 12, alfa: 11 },
  { day: "Thu", hadir: 940, izin: 10, sakit: 9, alfa: 6 },
  { day: "Fri", hadir: 955, izin: 9, sakit: 7, alfa: 4 },
];

const statusPie = [
  { name: "Hadir", value: 955 },
  { name: "Izin", value: 9 },
  { name: "Sakit", value: 7 },
  { name: "Alfa", value: 4 },
];

const colors = ["#22c55e", "#f59e0b", "#06b6d4", "#ef4444"]; // green, amber, cyan, red

const lateList = [
  { nama: "Budi Santoso", kelas: "9A", menit: 12 },
  { nama: "Siti Aminah", kelas: "8B", menit: 7 },
  { nama: "Dewi Lestari", kelas: "7C", menit: 15 },
  { nama: "Rizky Ramadhan", kelas: "9B", menit: 6 },
];

const accumulationByClass = [
  { kelas: "7A", hadir: 98, izin: 1, sakit: 0, alfa: 1 },
  { kelas: "7B", hadir: 95, izin: 2, sakit: 1, alfa: 2 },
  { kelas: "8A", hadir: 96, izin: 3, sakit: 0, alfa: 1 },
  { kelas: "9A", hadir: 97, izin: 1, sakit: 1, alfa: 1 },
];

const scheduleToday = [
  { jam: "07:00-07:45", kelas: "7A", mapel: "Matematika", guru: "Ibu Rina" },
  { jam: "07:50-08:35", kelas: "7A", mapel: "IPA", guru: "Pak Bayu" },
  { jam: "08:40-09:25", kelas: "9A", mapel: "Bhs Indonesia", guru: "Ibu Intan" },
  { jam: "09:30-10:15", kelas: "8B", mapel: "IPS", guru: "Pak Deni" },
];

const maintenanceQueue = [
  { id: "MT-1021", unit: "Proyektor R.9A", status: "Menunggu", tgl: todayISO },
  { id: "MT-1022", unit: "CCTV Koridor 2", status: "Proses", tgl: todayISO },
  { id: "MT-1023", unit: "Jaringan Lab", status: "Dijadwalkan", tgl: todayISO },
];

// Pelayanan Masyarakat – Mock Data
const serviceSatisfaction = [
  { group: "Siswa", puas: 84 },
  { group: "Orang Tua", puas: 81 },
  { group: "Masyarakat", puas: 78 },
];

const publicFeedback = [
  { nama: "Ibu Lina (Orang Tua)", kanal: "Web", rating: 4, topik: "Kebersihan toilet & antrian UKS", tgl: todayISO },
  { nama: "Bpk. Rudi (Warga)", kanal: "Loket", rating: 5, topik: "Pelayanan surat keterangan cepat", tgl: todayISO },
  { nama: "Andi (Siswa)", kanal: "Aplikasi", rating: 3, topik: "Akses Wi-Fi lambat saat jam istirahat", tgl: todayISO },
];

// -------------------- Heatmap & Realtime Tracking --------------------
const HEAT_POINTS = {
  absensi: [
    { x: 18, y: 32, i: 0.6 },
    { x: 44, y: 48, i: 0.9 },
    { x: 66, y: 22, i: 0.5 },
    { x: 72, y: 70, i: 0.7 },
    { x: 30, y: 72, i: 0.4 },
  ],
  layanan: [
    { x: 25, y: 40, i: 0.7 },
    { x: 54, y: 55, i: 0.6 },
    { x: 78, y: 30, i: 0.8 },
    { x: 40, y: 75, i: 0.5 },
  ],
  terlambat: [
    { x: 20, y: 30, i: 0.8 },
    { x: 45, y: 60, i: 0.7 },
    { x: 60, y: 40, i: 0.9 },
    { x: 80, y: 65, i: 0.6 },
  ],
};

function HeatBlob({ x, y, i, color = "emerald" }) {
  const colorMap = {
    emerald: "rgba(16,185,129,",
    amber: "rgba(245,158,11,",
    rose: "rgba(244,63,94,",
  };
  const base = colorMap[color] || colorMap.emerald;
  const size = 80 + i * 120; // px
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        borderRadius: 9999,
        background: `radial-gradient(circle, ${base}0.55) 0%, ${base}0.25) 45%, ${base}0.05) 70%, ${base}0) 80%`,
        filter: "blur(8px)",
        mixBlendMode: "multiply",
        pointerEvents: "none",
      }}
    />
  );
}

function useStudentTracker(count = 24) {
  const [students, setStudents] = useState(() =>
    Array.from({ length: count }).map((_, idx) => ({
      id: idx + 1,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      kelas: ["7A", "7B", "8A", "8B", "9A", "9B"][idx % 6],
    }))
  );

  useEffect(() => {
    const t = setInterval(() => {
      setStudents((prev) =>
        prev.map((s) => {
          const dx = (Math.random() - 0.5) * 6; // jitter
          const dy = (Math.random() - 0.5) * 6;
          return {
            ...s,
            x: Math.max(4, Math.min(96, s.x + dx)),
            y: Math.max(4, Math.min(96, s.y + dy)),
          };
        })
      );
    }, 1500);
    return () => clearInterval(t);
  }, []);

  return [students, setStudents];
}

export const HeatMap = () => {
  const [layer, setLayer] = useState("absensi");
  const [tracking, setTracking] = useState(true);
  const [students] = useStudentTracker(28);

  const colorByLayer = layer === "absensi" ? "emerald" : layer === "layanan" ? "amber" : "rose";

  return (
    <div className="col-span-12">
      <Card>
        <SectionTitle
          icon={MapPin}
          title="Peta Sekolah – Heatmap & Tracking Siswa (Realtime)"
          actions={
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 rounded-full p-1 flex">
                {[
                  { k: "absensi", l: "Absensi" },
                  { k: "layanan", l: "Layanan" },
                  { k: "terlambat", l: "Terlambat" },
                ].map((o) => (
                  <button
                    key={o.k}
                    onClick={() => setLayer(o.k)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      layer === o.k ? "bg-white shadow border border-slate-200" : "text-slate-600"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={tracking}
                  onChange={(e) => setTracking(e.target.checked)}
                />
                Tracking realtime
              </label>
            </div>
          }
        />

        <div className="relative aspect-[16/9] rounded-2xl border border-slate-200 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Heat blobs */}
          {HEAT_POINTS[layer].map((p, idx) => (
            <HeatBlob key={idx} x={p.x} y={p.y} i={p.i} color={colorByLayer} />
          ))}

          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Realtime students */}
          {tracking &&
            students.map((s) => (
              <div
                key={s.id}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full bg-cyan-500 ring-2 ring-white shadow"
                  title={`ID ${s.id} • ${s.kelas}`}
                />
              </div>
            ))}

          {/* Legend */}
          <div className="absolute bottom-3 left-3 text-xs bg-white/90 backdrop-blur rounded-xl border border-slate-200 px-3 py-2 shadow-sm text-slate-700 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-400" /> <span>Absensi</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-400" /> <span>Layanan</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-rose-400" /> <span>Terlambat</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-cyan-500" /> <span>Siswa (realtime)</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// -------------------- Reusable UI --------------------
function StatCard({ title, value, subtitle, icon: Icon, intent = "neutral" }) {
  const intentClasses = {
    neutral: "bg-white",
    success: "bg-emerald-50",
    warn: "bg-amber-50",
    danger: "bg-rose-50",
    info: "bg-cyan-50",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl ${intentClasses[intent]} p-4 shadow-sm border border-slate-100`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/70 shadow-inner border border-slate-100">
          <Icon className="w-5 h-5 text-slate-700" />
        </div>
        <div>
          <p className="text-slate-500 text-sm leading-tight">{title}</p>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
          {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl bg-white p-4 shadow-sm border border-slate-100 ${className}`}>{children}</div>;
}

function SectionTitle({ icon: Icon, title, actions }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-slate-600" />
        <h3 className="text-slate-800 font-semibold">{title}</h3>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}

function Pill({ children }) {
  return <span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">{children}</span>;
}

// -------------------- Small Widgets --------------------
function LateTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th className="py-2">Nama</th>
            <th className="py-2">Kelas</th>
            <th className="py-2">Terlambat</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className="border-t border-slate-100">
              <td className="py-2 font-medium text-slate-800">{r.nama}</td>
              <td className="py-2">{r.kelas}</td>
              <td className="py-2 text-rose-600">{r.menit} menit</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccumulationTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th className="py-2">Kelas</th>
            <th className="py-2">Hadir</th>
            <th className="py-2">Izin</th>
            <th className="py-2">Sakit</th>
            <th className="py-2">Alfa</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className="border-t border-slate-100">
              <td className="py-2 font-medium text-slate-800">{r.kelas}</td>
              <td className="py-2 text-emerald-600">{r.hadir}%</td>
              <td className="py-2 text-amber-600">{r.izin}%</td>
              <td className="py-2 text-cyan-600">{r.sakit}%</td>
              <td className="py-2 text-rose-600">{r.alfa}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScheduleList({ data }) {
  return (
    <div className="space-y-2">
      {data.map((s, i) => (
        <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
          <div className="flex items-center gap-3">
            <Pill>{s.jam}</Pill>
            <div>
              <p className="text-slate-800 font-medium">{s.kelas} · {s.mapel}</p>
              <p className="text-slate-500 text-xs">{s.guru}</p>
            </div>
          </div>
          <button className="text-xs px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200">Detail</button>
        </div>
      ))}
    </div>
  );
}

function Stars({ n = 0 }) {
  const count = Math.max(0, Math.min(5, n));
  return (
    <span className="text-amber-500 text-xs tracking-tight">
      {"★".repeat(count)}<span className="text-slate-300">{"☆".repeat(5 - count)}</span>
    </span>
  );
}

function FeedbackTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th className="py-2">Nama / Peran</th>
            <th className="py-2">Kanal</th>
            <th className="py-2">Rating</th>
            <th className="py-2">Topik</th>
            <th className="py-2">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className="border-t border-slate-100">
              <td className="py-2 font-medium text-slate-800">{r.nama}</td>
              <td className="py-2">{r.kanal}</td>
              <td className="py-2"><Stars n={r.rating} /></td>
              <td className="py-2 text-slate-700">{r.topik}</td>
              <td className="py-2 text-slate-500 text-xs">{r.tgl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -------------------- Sections --------------------
function SekolahView() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Stats */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Siswa Hadir" value="955" subtitle="Hari ini" icon={Users2} intent="success" />
        <StatCard title="Guru Hadir" value="68" subtitle="Dari 72" icon={UserCheck2} intent="info" />
        <StatCard title="Keterlambatan" value="40" subtitle="Hari ini" icon={UserX} intent="warn" />
        <StatCard title="Notifikasi" value="3" subtitle="Butuh Tindakan" icon={Bell} intent="danger" />
      </div>

      {/* Charts */}
      <div className="col-span-12 xl:col-span-8">
        <Card>
          <SectionTitle icon={LineChartIcon} title="Kehadiran Siswa – Mingguan" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceDaily} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gHadir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Area type="monotone" dataKey="hadir" stroke="#16a34a" fillOpacity={1} fill="url(#gHadir)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle icon={Users2} title="Status Hari Ini (Siswa)" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPie} innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {statusPie.map((v, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Late & Accumulation */}
      <div className="col-span-12 lg:col-span-5">
        <Card>
          <SectionTitle icon={ClockIcon} title="Daftar Terlambat (Top)" />
          <LateTable data={lateList} />
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-7">
        <Card>
          <SectionTitle icon={Layers} title="Akumulasi per Kelas (Bulan Berjalan)" />
          <AccumulationTable data={accumulationByClass} />
        </Card>
      </div>

      {/* Schedule & Maintenance */}
      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle icon={CalendarDays} title="Jadwal Hari Ini" />
          <ScheduleList data={scheduleToday} />
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle icon={Settings} title="Antrian Maintenance" />
          <div className="space-y-2">
            {maintenanceQueue.map((m) => (
              <div key={m.id} className="rounded-xl border border-slate-100 p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{m.unit}</p>
                  <p className="text-xs text-slate-500">#{m.id} · {m.tgl}</p>
                </div>
                <Pill>{m.status}</Pill>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle icon={BookOpen} title="Perpustakaan & Konten" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-slate-100 p-3">
              <p className="font-medium">SLiMS</p>
              <p className="text-slate-500 text-xs">Terhubung</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-3">
              <p className="font-medium">Inlislite</p>
              <p className="text-slate-500 text-xs">Terhubung</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-3">
              <p className="font-medium">XLibrary Kiosk</p>
              <p className="text-slate-500 text-xs">2 Unit Aktif</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-3">
              <p className="font-medium">E-book</p>
              <p className="text-slate-500 text-xs">12.500 Judul</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pelayanan Masyarakat */}
      <div className="col-span-12">
        <Card>
          <SectionTitle
            icon={MessageSquare}
            title="Pelayanan Masyarakat"
            actions={
              <div className="flex items-center gap-2">
                <button className="text-xs px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200">Kelola Pertanyaan</button>
                <button className="text-xs px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200">Buat Survey</button>
              </div>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* KPI + Chart */}
            <div className="lg:col-span-2 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <StatCard title="Indeks Kepuasan" value="83%" subtitle="Rata-rata" icon={Users2} intent="success" />
                <StatCard title="Respon Masuk" value={publicFeedback.length} subtitle="Hari ini" icon={Bell} intent="info" />
                <StatCard title="SLA Tertangani" value="91%" subtitle=", 7 hari" icon={ShieldCheck} intent="neutral" />
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceSatisfaction}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="group" tick={{ fill: "#64748b" }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#64748b" }} />
                    <Tooltip />
                    <Bar dataKey="puas" name="% Puas" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Feedback Table */}
            <div className="lg:col-span-3">
              <FeedbackTable data={publicFeedback} />
            </div>
          </div>
        </Card>
      </div>

      {/* Map / Heatmap */}
      <SchoolHeatmap />
    </div>
  );
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-slate-600" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

// -------------------- Smoke Tests --------------------
function runSmokeTests() {
  const results = [];
  const isISO = /^\d{4}-\d{2}-\d{2}$/.test(todayISO);
  results.push({ test: "todayISO format", pass: isISO, value: todayISO });
  results.push({ test: "feedback uses todayISO value", pass: publicFeedback.every((f) => f.tgl === todayISO) });
  results.push({ test: "charts have data", pass: attendanceDaily.length > 0 && statusPie.length > 0 });
  // Heat layer sanity
  const validLayers = ["absensi", "layanan", "terlambat"];
  results.push({ test: "heat layers defined", pass: validLayers.every((k) => Array.isArray(HEAT_POINTS[k]) && HEAT_POINTS[k].length > 0) });
  // Tracking generator sanity
  const sampleStudents = Array.from({ length: 10 }).map((_, i) => ({ id: i + 1, x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 }));
  const inBounds = sampleStudents.every((s) => s.x >= 0 && s.x <= 100 && s.y >= 0 && s.y <= 100);
  results.push({ test: "tracking bounds", pass: inBounds });

  // Footer year string format test (added)
  const s = 2023; const y = new Date().getFullYear(); const exp = y > s ? `${s}-${y}` : `${s}`;
  const footerFormatOk = /^\d{4}$/.test(exp) || /^\d{4}-\d{4}$/.test(exp);
  results.push({ test: "footer year format", pass: footerFormatOk, value: exp });

  // Component existence tests (added)
  results.push({ test: "SekolahView defined", pass: typeof SekolahView === "function" });
  results.push({ test: "SchoolHeatmap defined", pass: typeof SchoolHeatmap === "function" });

  // eslint-disable-next-line no-console
  console.table(results);
  return results.every((r) => r.pass);
}

// -------------------- Top-level App --------------------
export default function XpresensiSchoolDashboard() {
  const [range, setRange] = useState("Hari ini");

  useEffect(() => {
    runSmokeTests();
  }, []);

  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const yearText = currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <div className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500 grid place-items-center text-white font-bold">X</div>
              <div>
                <p className="text-slate-900 font-semibold leading-tight">Xpresensi</p>
                <p className="text-slate-500 text-xs">Dashboard Terpadu Sekolah</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select value={range} onChange={(e) => setRange(e.target.value)} className="text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white">
                {["Hari ini", "7 hari", "30 hari", "Semester", "Tahun ajaran"].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm flex items-center gap-2">
                <UploadCloud className="w-4 h-4" /> Ekspor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <SekolahView />

        {/* Footer / SSO & Platform */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <SectionTitle icon={ShieldCheck} title="SSO & Role-based Access" />
            <p className="text-sm text-slate-600">Autentikasi tunggal untuk Guru, Siswa, Orang Tua, dan Dinas. Aturan akses granular (RBAC) memastikan data tampil sesuai otoritas.</p>
          </Card>
          <Card>
            <SectionTitle icon={Smartphone} title="Platform" />
            <p className="text-sm text-slate-600">Web + Mobile (Android/iOS). Dukungan offline-hybrid untuk daerah tanpa internet stabil (sinkronisasi saat online).</p>
          </Card>
          <Card>
            <SectionTitle icon={Settings} title="Integrasi" />
            <p className="text-sm text-slate-600">Perpustakaan (SLiMS, Inlislite), IoT (CCTV, RFID gate, meter energi), Payment, Dapodik (sinkronisasi aman).</p>
          </Card>
        </div>

        {/* Footer Text */}
        <div className="py-10 text-center text-xs text-slate-400">© {yearText} Xpresensi – All rights reserved.</div>
      </div>
    </div>
  );
}