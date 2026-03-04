"use client";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/core/libs";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Barcode,
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Download,
  MoreHorizontal,
  Pencil,
  Plus,
  QrCode,
  Search as SearchIcon,
  Send,
  ShieldAlert,
  Trash2,
  UploadCloud,
  Wrench
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
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

// Context: Sekolah
const SCHOOL_NAME = "SMPN 1 Lembang";
const ROOMS = ["Ruang Kepala", "TU", "Ruang Guru", "Lab Komputer", "Lab IPA", "Perpustakaan", "Ruang Kelas 7A", "Ruang Kelas 9C", "Aula"];
const CATEGORIES = ["Proyektor", "CCTV", "AC", "Jaringan/Router", "Komputer", "Printer", "Speaker/Audio"];
const STATUS = ["Aktif", "Perlu-Perawatan", "Rusak", "Dipinjam"] as const;
const PRIORITY = ["Rendah", "Sedang", "Tinggi"] as const;
type Status = typeof STATUS[number];
type Asset = { id: string; name: string; category: string; room: string; code: string; rfid?: string; status: Status; lastService: string; nextService: string; warranty?: string; vendor?: string };
type Ticket = { id: string; assetId: string; title: string; status: "baru" | "proses" | "selesai"; priority: typeof PRIORITY[number]; note?: string; createdAt: string; technician?: string; scheduleDate?: string; escalated?: boolean };

// Seeds (contoh)
const assetsSeed: Asset[] = [
  { id: "AST-001", name: "Proyektor Epson EB-X41", category: "Proyektor", room: "Ruang Kelas 7A", code: "INV/PRJ/2023/001", rfid: "RFID-9F2C1A", status: "Aktif", lastService: "2025-06-01", nextService: "2025-09-01", warranty: "2026-06", vendor: "PT Visual Tech" },
  { id: "AST-002", name: "DVR Hikvision 16CH", category: "CCTV", room: "TU", code: "INV/CCTV/2022/016", status: "Perlu-Perawatan", lastService: "2025-04-10", nextService: "2025-08-30", vendor: "PT Secure Cam" },
  { id: "AST-003", name: "AC Split 1.5 PK", category: "AC", room: "Ruang Kepala", code: "INV/AC/2021/077", status: "Rusak", lastService: "2025-02-15", nextService: "2025-03-15", vendor: "CV Dingin Jaya" },
  { id: "AST-004", name: "Router MikroTik RB4011", category: "Jaringan/Router", room: "Ruang Guru", code: "INV/NET/2024/009", rfid: "RFID-1B7D90", status: "Aktif", lastService: "2025-07-01", nextService: "2025-12-01", vendor: "PT Net Indo" },
  { id: "AST-005", name: "PC Lab Core i5", category: "Komputer", room: "Lab Komputer", code: "INV/PC/2023/022", status: "Dipinjam", lastService: "2025-05-21", nextService: "2025-10-21", vendor: "PT Komtek" },
];
const ticketsSeed: Ticket[] = [
  { id: "TCK-701", assetId: "AST-003", title: "AC bocor & tidak dingin", status: "baru", priority: "Tinggi", note: "Diduga pipa bocor.", createdAt: "2025-08-26" },
  { id: "TCK-702", assetId: "AST-002", title: "Backup CCTV gagal", status: "proses", priority: "Sedang", createdAt: "2025-08-24" },
];

// Helpers
const statusColor: Record<Status, string> = {
  Aktif: "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 border-gray-200 dark:border-gray-700",
  "Perlu-Perawatan": "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-400 border-gray-200 dark:border-gray-700",
  Rusak: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 border-gray-200 dark:border-gray-700",
  Dipinjam: "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-400 border-gray-200 dark:border-gray-700",
};
const StatusBadge = ({ s }: { s: Status }) => (
  <Badge variant="outline" className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusColor[s]}`}>
    {s === "Aktif" ? <CheckCircle2 className="h-3.5 w-3.5" /> : s === "Perlu-Perawatan" ? <Clock className="h-3.5 w-3.5" /> : s === "Rusak" ? <AlertCircle className="h-3.5 w-3.5" /> : <QrCode className="h-3.5 w-3.5" />}
    {s}
  </Badge>
);
const PriorityBadge = ({ p }: { p: Ticket["priority"] }) => {
  const map: Record<Ticket["priority"], string> = {
    Rendah: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
    Sedang: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-400 border-gray-200 dark:border-gray-700",
    Tinggi: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-400 border-gray-200 dark:border-gray-700",
  };
  return <Badge variant="outline" className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[p]}`}>{p}</Badge>;
};
function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}
function findAssetByCodes(list: Asset[], code: string, rfid: string) {
  return list.find(a => (code && a.code.toLowerCase() === code.toLowerCase()) || (rfid && (a.rfid || "").toLowerCase() === rfid.toLowerCase()));
}
function parseCSVToAssets(text: string): Asset[] {
  const [headerLine, ...rows] = text.split(/\r?\n/).filter(Boolean);
  const headers = (headerLine || "").split(",").map(h => h.trim());
  const idx = (k: string) => headers.indexOf(k);
  const out: Asset[] = rows.map(line => {
    const cols = line.split(",");
    return {
      id: cols[idx("id")] || `AST-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: cols[idx("name")] || "",
      category: cols[idx("category")] || CATEGORIES[0],
      room: cols[idx("room")] || ROOMS[0],
      code: cols[idx("code")] || "",
      rfid: cols[idx("rfid")] || undefined,
      status: (cols[idx("status")] as Status) || "Aktif",
      lastService: cols[idx("lastService")] || new Date().toISOString().slice(0, 10),
      nextService: cols[idx("nextService")] || new Date().toISOString().slice(0, 10),
      vendor: cols[idx("vendor")] || "",
    } as Asset;
  }).filter(a => a.name && a.category && a.code);
  return out;
}

// Main Component
export default function InfraMain() {
  const [assets, setAssets] = useState<Asset[]>(assetsSeed);
  const [tickets, setTickets] = useState<Ticket[]>(ticketsSeed);
  const [q, setQ] = useState("");
  const [fCategory, setFCategory] = useState("ALL");
  const [fStatus, setFStatus] = useState("ALL");
  const [fRoom, setFRoom] = useState("ALL");
  const [scanCode, setScanCode] = useState("");
  const [scanRFID, setScanRFID] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => assets.filter(a => (
    (fCategory === "ALL" || a.category === fCategory) &&
    (fStatus === "ALL" || a.status === fStatus) &&
    (fRoom === "ALL" || a.room === fRoom) &&
    (q === "" || `${a.name} ${a.code} ${a.room} ${a.category}`.toLowerCase().includes(q.toLowerCase()))
  )), [assets, q, fCategory, fStatus, fRoom]);

  // Charts
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(a => map[a.category] = (map[a.category] || 0) + 1);
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);
  const byStatus = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(a => map[a.status] = (map[a.status] || 0) + 1);
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);
  const COLORS = ['#14B8A6', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981'];

  // UI State
  const [detail, setDetail] = useState<Asset | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDel, setConfirmDel] = useState<Asset | null>(null);

  // Actions
  function addAsset(newA: Asset) {
    setAssets(prev => [newA, ...prev]);
  }
  function updateAsset(updated: Asset) {
    setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
  }
  function deleteAsset(id: string) {
    setAssets(prev => prev.filter(a => a.id !== id));
    setConfirmDel(null);
  }
  function handleScan() {
    const found = findAssetByCodes(assets, scanCode, scanRFID);
    if (found) {
      setDetail(found);
    } else {
      alert("Aset tidak ditemukan sesuai input QR/RFID.");
    }
  }
  function createTicket(asset: Asset, extra?: Partial<Ticket>) {
    const newT: Ticket = {
      id: `TCK-${Math.floor(Math.random() * 900 + 100)}`,
      assetId: asset.id,
      title: extra?.title || `Perbaikan ${asset.name}`,
      status: "baru",
      priority: extra?.priority || "Sedang",
      createdAt: new Date().toISOString().slice(0, 10),
      technician: extra?.technician,
      scheduleDate: extra?.scheduleDate,
      note: extra?.note,
      escalated: !!extra?.escalated
    };
    setTickets(t => [newT, ...t]);
    if (newT.escalated) {
      console.log("[MOCK] escalate to dinas:", { school: SCHOOL_NAME, ticket: newT });
      alert("Tiket dikirim ke Dinas.");
    }
  }
  function exportPDF() {
    const w = window.open("", "print");
    if (!w) return;
    const style = `<style>body{font-family:Arial,sans-serif;padding:24px} h1{font-size:18px;margin:0 0 8px} h2{font-size:16px;margin:16px 0 8px} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:6px;font-size:12px} th{background:#f6f7f9;text-align:left}</style>`;
    let html = `<h1>Rekap Aset ${SCHOOL_NAME}</h1><div>Diekspor: ${new Date().toLocaleString("id-ID")}</div>`;
    html += `<table><thead><tr><th>Kode</th><th>Nama</th><th>Kategori</th><th>Ruang</th><th>Status</th><th>Next Service</th></tr></thead><tbody>`;
    filtered.forEach(a => {
      html += `<tr><td>${a.code}</td><td>${a.name}</td><td>${a.category}</td><td>${a.room}</td><td>${a.status}</td><td>${a.nextService}</td></tr>`;
    });
    html += `</tbody></table>`;
    w.document.write(style + html);
    w.document.close();
    w.focus();
    w.print();
  }
  function downloadTemplate() {
    const headers = ["id", "name", "category", "room", "code", "rfid", "status", "lastService", "nextService", "vendor"];
    const sample = `AST-0099,Proyektor Epson,Proyektor,Ruang Kelas,INV/PRJ/2025/099,RFID-XXXXXX,Aktif,2025-08-01,2025-11-01,PT Contoh`;
    const csv = headers.join(",") + "\n" + sample + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `template_import_aset_${SCHOOL_NAME.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function handleImportCSV(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const imported = parseCSVToAssets(text);
      if (imported.length === 0) {
        alert("File kosong atau format salah.");
        return;
      }
      setAssets(prev => [...imported, ...prev]);
      alert(`${imported.length} aset berhasil diimpor.`);
    };
    reader.readAsText(file);
  }

  // Header Stats
  const total = assets.length;
  const needService = assets.filter(a => a.status === "Perlu-Perawatan").length;
  const broken = assets.filter(a => a.status === "Rusak").length;
  const openTickets = tickets.filter(t => t.status !== "selesai").length;

  // DEV TESTS
  useEffect(() => {
    try {
      console.assert(findAssetByCodes(assetsSeed, "INV/PRJ/2023/001", "")?.id === "AST-001", "Scan by code should find AST-001");
      console.assert(findAssetByCodes(assetsSeed, "", "RFID-1B7D90")?.id === "AST-004", "Scan by RFID should find AST-004");
      const rusakCount = assetsSeed.filter(a => a.status === "Rusak").length;
      console.assert(rusakCount === 1, "Rusak count should be 1 on seeds");
      const cctvCount = assetsSeed.filter(a => a.category === "CCTV").length;
      console.assert(cctvCount === 1, "CCTV count should be 1 on seeds");
      const csv = "id,name,category,room,code,rfid,status,lastService,nextService,vendor\n" +
                  "AST-0999,Printer Epson L3210,Printer,TU,INV/PRN/2025/001,,Aktif,2025-08-01,2025-11-01,PT Print\n" +
                  ",Router AX,Jaringan/Router,Ruang Guru,INV/NET/2025/010,RFID-ABCD,Sedang,2025-08-05,2025-10-05,PT Net";
      const parsed = parseCSVToAssets(csv);
      console.assert(parsed.length === 2, "Parsed CSV should return 2 rows");
      console.assert(parsed[0].id === "AST-0999", "First row keeps provided ID");
      console.assert(parsed[1].code === "INV/NET/2025/010", "Second row code matches");
      console.log("[DEV TESTS] All assertions passed ✅");
    } catch (e) {
      console.warn("[DEV TESTS] Some assertions failed", e);
    }
  }, []);

  return (
    <div className="w-full min-h-screen dark:text-white">
      <style>
        {`
          select option {
            background: #F9FAFB !important;
            color: #1F2937;
          }
          select option:checked,
          select option:hover {
            background: #14B8A6 !important;
            color: #FFFFFF;
          }
          @media (prefers-color-scheme: dark) {
            select option {
              background: #1F2A44 !important;
              color: #FFFFFF;
            }
            select option:checked,
            select option:hover {
              background: #14B8A6 !important;
              color: #FFFFFF;
            }
          }
        `}
      </style>
      <div className="max-w-full mx-auto space-y-6">
        {/* <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
              <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {SCHOOL_NAME}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dashboard Sekolah – Aset & Infrastruktur
            </p>
          </div>
        </div> */}
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "Total Aset", value: total, icon: <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />, desc: "Terdaftar di sekolah" },
            { title: "Perlu Perawatan", value: needService, icon: <Wrench className="h-5 w-5 text-gray-600 dark:text-gray-400" />, desc: "Butuh penjadwalan" },
            { title: "Rusak", value: broken, icon: <ShieldAlert className="h-5 w-5 text-gray-600 dark:text-gray-400" />, desc: "Prioritas" },
            { title: "Tiket Aktif", value: openTickets, icon: <Barcode className="h-5 w-5 text-gray-600 dark:text-gray-400" />, desc: "Baru & Proses" },
          ].map((it, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="dark:bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="flex items-start justify-start pb-2">
                  <CardTitle className="text-sm tracking-wide text-gray-600 dark:text-gray-400">
                    {it.title}
                  </CardTitle>
                  {/* {it.icon} */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mt-2 font-semibold text-gray-800 dark:text-white">{it.value}</div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{it.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Panel Utama */}
        <Card className="dark:bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                <Building2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                Inventaris Aset
              </CardTitle>
              <CardDescription className="text-black dark:text-white">
                Kelola aset sekolah, ajukan perbaikan, dan kirim eskalasi ke Dinas jika perlu.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <UploadCloud className="h-4 w-4" /> Import CSV
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImportCSV(f);
                  e.currentTarget.value = "";
                }}
              />
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Unduh Template
              </Button>
              <Button
                variant="outline"
                onClick={exportPDF}
                className="gap-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4" /> Export PDF
              </Button>
              <Button
                onClick={() => setShowAdd(true)}
                className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Plus className="h-4 w-4" /> Tambah Aset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {/* Scan & Filters */}
            <div className="grid grid-cols-1 gap-3">
              <div className="grid items-center grid-cols-1 md:grid-cols-3 gap-3 p-3">
                <div className="col-span-1">
                  <Label className="text-black dark:text-white">Scan Nomor Inventaris / QR</Label>
                  <div className="relative mt-3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <Input
                      value={scanCode}
                      onChange={(e) => setScanCode(e.target.value)}
                      placeholder="INV/PRJ/2025/001"
                      className="pl-9 border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <Label className="text-black dark:text-white">Scan RFID</Label>
                  <div className="relative mt-3">
                    <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <Input
                      value={scanRFID}
                      onChange={(e) => setScanRFID(e.target.value)}
                      placeholder="RFID-XXXXXX"
                      className="pl-9 border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <Label className="text-black dark:text-white text-transparent opacity-0">12323</Label>
                  <Button onClick={handleScan} className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white">
                    Cari Aset
                  </Button>
                </div>
              </div>
              <div className="border-t border-white/20 pt-4 xl:col-span-7 grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="col-span-2">
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <Input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Cari aset, kode, atau ruangan…"
                      className="pl-9 border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                <Select value={fCategory} onValueChange={setFCategory}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Kategori</SelectItem>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={fStatus} onValueChange={setFStatus}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={fRoom} onValueChange={setFRoom}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
                    <SelectValue placeholder="Semua Ruang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Ruang</SelectItem>
                    {ROOMS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Table */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-theme-color-primary/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-theme-color-primary/20 text-gray-600 dark:text-gray-400">
                  <TableRow>
                    <TableHead className="w-24">Kode</TableHead>
                    <TableHead>Nama Aset</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Ruang</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Service</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <TableCell className="font-medium text-gray-800 dark:text-white">{a.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Barcode className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <button className="text-left hover:underline text-gray-800 dark:text-white" onClick={() => setDetail(a)}>{a.name}</button>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-white">{a.category}</TableCell>
                      <TableCell className="text-gray-800 dark:text-white">{a.room}</TableCell>
                      <TableCell><StatusBadge s={a.status} /></TableCell>
                      <TableCell className="text-gray-800 dark:text-white">{formatDate(a.nextService)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setDetail(a)} className="gap-2">
                              <Pencil className="h-4 w-4" /> Detail / Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => createTicket(a)} className="gap-2">
                              <Wrench className="h-4 w-4" /> Buat Tiket
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setConfirmDel(a)} className="gap-2 text-red-700 dark:text-red-400">
                              <Trash2 className="h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="dark:bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-1">
            <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-sm font-semibold text-gray-800 dark:text-white">Komposisi Aset per Kategori</CardTitle>
              <CardDescription className="text-black dark:text-white">Distribusi jumlah aset (hasil filter).</CardDescription>
            </CardHeader>
            <CardContent className="h-72 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="dark:bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-2">
            <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-sm font-semibold text-gray-800 dark:text-white">Status Perawatan</CardTitle>
              <CardDescription className="text-black dark:text-white">Ringkasan status aset (hasil filter).</CardDescription>
            </CardHeader>
            <CardContent className="h-72 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#ffffff' }} />
                  <YAxis allowDecimals={false} stroke="#6B7280" tick={{ fill: '#ffffff' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }} />
                  <Legend />
                  <Bar dataKey="value" name="Jumlah" fill="#14B8A6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        {/* Sheet: Detail Aset Sekolah */}
        <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
          <SheetContent className="w-full sm:max-w-xl dark:bg-teal-900 border-gray-200 dark:border-gray-700">
            {detail && (
              <AssetDetailSheet
                key={detail.id}
                asset={detail}
                onSave={(a) => { updateAsset(a); setDetail(null); }}
                onCreateTicket={(extra) => createTicket(detail, extra)}
              />
            )}
          </SheetContent>
        </Sheet>
        {/* Dialog: Tambah Aset */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className="sm:max-w-xl dark:bg-teal-900 border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-800 dark:text-white">Tambah Aset</DialogTitle>
            </DialogHeader>
            <AddAssetForm onSubmit={(a) => { addAsset(a); setShowAdd(false); }} />
          </DialogContent>
        </Dialog>
        {/* Dialog: Konfirmasi Hapus */}
        <Dialog open={!!confirmDel} onOpenChange={() => setConfirmDel(null)}>
          <DialogContent className="sm:max-w-md dark:bg-theme-color-primary/5 border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-800 dark:text-white">Hapus aset?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aksi ini menghapus aset <span className="font-semibold">{confirmDel?.name}</span>.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDel(null)}
                className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmDel && deleteAsset(confirmDel.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Subcomponents
function AssetDetailSheet({ asset, onSave, onCreateTicket }: { asset: Asset; onSave: (a: Asset) => void; onCreateTicket: (extra?: Partial<Ticket>) => void }) {
  const [form, setForm] = useState<Asset>({ ...asset });
  const [assignTo, setAssignTo] = useState("");
  const [scheduleDate, setScheduleDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [ticketPriority, setTicketPriority] = useState<Ticket["priority"]>("Sedang");
  const [ticketNote, setTicketNote] = useState("");
  const [escalate, setEscalate] = useState(true);

  return (
    <div className="space-y-4 pr-6 h-[99%] overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-gray-800 dark:text-white">Detail Aset</SheetTitle>
      </SheetHeader>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-black dark:text-white">Nama Aset</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-black dark:text-white">Kategori</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-black dark:text-white">Ruang</Label>
          <Select value={form.room} onValueChange={(v) => setForm({ ...form, room: v })}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROOMS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-black dark:text-white">Nomor Inventaris / QR</Label>
          <Input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-black dark:text-white">RFID (opsional)</Label>
          <Input
            value={form.rfid || ""}
            onChange={(e) => setForm({ ...form, rfid: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-black dark:text-white">Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-black dark:text-white">Vendor</Label>
          <Input
            value={form.vendor || ""}
            onChange={(e) => setForm({ ...form, vendor: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-black dark:text-white">Terakhir Servis</Label>
          <Input
            type="date"
            value={form.lastService}
            onChange={(e) => setForm({ ...form, lastService: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-black dark:text-white">Jadwal Servis Berikutnya</Label>
          <Input
            type="date"
            value={form.nextService}
            onChange={(e) => setForm({ ...form, nextService: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
        <div className="col-span-2">
          <Label className="text-black dark:text-white">Catatan</Label>
          <Textarea
            placeholder="Catatan teknis, seri sparepart, dll"
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
      </div>
      <div className="flex gap-2 border-b border-white/20 pb-10">
        <Button
          onClick={() => onSave(form)}
          className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Pencil className="h-4 w-4" /> Simpan
        </Button>
      </div>
      <br />
      {/* Buat Tiket Perbaikan & Eskalasi */}
      <div className="rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-gray-800 dark:text-white font-medium text-sm">
          <CalendarIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" /> Ajukan Perbaikan
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-black dark:text-white">Teknisi / Vendor</Label>
            <Input
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              placeholder="Nama teknisi / vendor"
              className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <Label className="text-black dark:text-white">Tanggal</Label>
            <Input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <Label className="text-black dark:text-white">Prioritas</Label>
            <Select value={ticketPriority} onValueChange={(v) => setTicketPriority(v as Ticket["priority"])}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label className="text-black dark:text-white">Catatan</Label>
            <Textarea
              value={ticketNote}
              onChange={(e) => setTicketNote(e.target.value)}
              placeholder="Keluhan / kebutuhan sparepart"
              className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
            />
          </div>
          <div className="col-span-2 flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-theme-color-primary/5 px-3 py-2">
            <span className="text-sm text-gray-800 dark:text-white">Kirim ke Dinas (Eskalasi)</span>
            <Select value={String(escalate)} onValueChange={(v) => setEscalate(v === "true")}>
              <SelectTrigger className="w-32 border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => onCreateTicket({
              title: `Perbaikan ${form.name}`,
              priority: ticketPriority,
              technician: assignTo || undefined,
              scheduleDate,
              note: ticketNote,
              escalated: escalate
            })}
          >
            <Send className="h-4 w-4" /> Kirim Pengajuan
          </Button>
        </div>
      </div>
      {/* <div className="pt-2">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Riwayat Tiket</h4>
        <div className="space-y-2 text-sm">
          {(ticketsSeed.filter(t => t.assetId === asset.id)).length === 0 && (
            <p className="text-xs text-gray-600 dark:text-gray-400">Belum ada tiket.</p>
          )}
          {ticketsSeed.filter(t => t.assetId === asset.id).map(t => (
            <div key={t.id} className="rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-theme-color-primary/5 p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800 dark:text-white">{t.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  #{t.id} • {formatDate(t.createdAt)}
                  {t.scheduleDate ? ` • Jadwal ${formatDate(t.scheduleDate)}` : ""}
                  {t.technician ? ` • Teknisi ${t.technician}` : ""}
                  {t.escalated ? " • (Eskalasi ke Dinas)" : ""}
                </div>
                {t.note && <div className="text-xs text-gray-600 dark:text-gray-400 italic">{t.note}</div>}
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge p={t.priority} />
                <Badge variant="outline" className="capitalize border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">{t.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

function AddAssetForm({ onSubmit }: { onSubmit: (a: Asset) => void }) {
  const [form, setForm] = useState<Asset>({
    id: `AST-${Math.floor(Math.random() * 9000 + 1000)}`,
    name: "",
    category: CATEGORIES[0],
    room: ROOMS[0],
    code: "",
    status: "Aktif",
    lastService: new Date().toISOString().slice(0, 10),
    nextService: new Date().toISOString().slice(0, 10),
    vendor: "",
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-black dark:text-white">Nama Aset</Label>
          <Input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-black dark:text-white">Kategori</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-black dark:text-white">Ruang</Label>
          <Select value={form.room} onValueChange={(v) => setForm({ ...form, room: v })}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROOMS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-black dark:text-white">Nomor Inventaris / QR</Label>
          <Input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-black dark:text-white">RFID (opsional)</Label>
          <Input
            value={form.rfid || ""}
            onChange={(e) => setForm({ ...form, rfid: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-black dark:text-white">Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-black dark:text-white">Vendor</Label>
          <Input
            value={form.vendor || ""}
            onChange={(e) => setForm({ ...form, vendor: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-black dark:text-white">Terakhir Servis</Label>
          <Input
            type="date"
            value={form.lastService}
            onChange={(e) => setForm({ ...form, lastService: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <Label className="text-black dark:text-white">Jadwal Servis Berikutnya</Label>
          <Input
            type="date"
            value={form.nextService}
            onChange={(e) => setForm({ ...form, nextService: e.target.value })}
            className="border-gray-300 dark:border-gray-600 bg-white/10 text-gray-800 dark:text-white"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="h-4 w-4" /> Tambahkan
        </Button>
      </DialogFooter>
    </form>
  );
}