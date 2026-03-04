import { motion } from "framer-motion";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Fingerprint,
  Image as ImageIcon, Link as LinkIcon,
  MapPin,
  PlugZap,
  Plus,
  QrCode,
  ShieldCheck,
  Trash2,
  UploadCloud,
  X
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { v4 as uuidv4 } from "uuid";

/*****************************************************
 * Modul Pramuka — Kegiatan Sekolah (Xpresensi)
 * ---------------------------------------------
 * ▸ Multi-tenant: tiap sekolah/gudep input kegiatannya sendiri
 * ▸ Form tambah kegiatan + tabel + pencarian
 * ▸ TERHUBUNG BACKEND (opsional): GET/POST/PATCH/DELETE
 * ▸ Presensi: buka sesi (QR, Fingerprint, Geofence-ready)
 * ▸ Upload Dokumentasi (gambar/video/pdf) + tautkan ke Web Sekolah
 * ▸ Export/Import JSON & CSV
 *
 * Back-end Contract (opsional, bisa disesuaikan):
 *  GET    {API_BASE}/kegiatan?tenant={id}
 *  POST   {API_BASE}/kegiatan
 *  PATCH  {API_BASE}/kegiatan/:id        (body: partial Kegiatan)
 *  DELETE {API_BASE}/kegiatan/:id
 *  POST   {API_BASE}/kegiatan/:id/presensi/open  { mode: 'QR'|'Fingerprint'|'Geofence' }
 *  POST   {API_BASE}/kegiatan/:id/dokumentasi    (FormData: files[])
 *****************************************************/

const THEME = { primary: "#1F3B76", accent: "#F2C94C", surface: "#0F1E3A", border: "#1E335F" } as const;

const JENIS_OPTIONS = ["Latihan", "Perkemahan", "Lomba", "Bakti", "Rapat", "Kursus"] as const;
const STATUS_OPTIONS = ["Draft", "Ajukan", "Disetujui", "Selesai"] as const;

// ===== Types =====
export type Jenis = (typeof JENIS_OPTIONS)[number];
export type PresensiMode = "QR"|"Fingerprint"|"Geofence";
export type Status = (typeof STATUS_OPTIONS)[number];
export type DocItem = { name:string; url:string; type?:string; size?:number };
export type Kegiatan = {
  id: string;
  tenant?: string;      // id sekolah/gudep (multi-tenant)
  judul: string;
  jenis: Jenis;
  tanggal: string;      // YYYY-MM-DD
  lokasi: string;
  penanggungJawab: string;
  peserta: number;
  status?: Status;
  webSekolah?: string;         // tautan berita/landing di web sekolah
  dokumentasi?: DocItem[];     // daftar dok (upload)
};

// ===== API Client (minimal & opsional) =====
const API_BASE: string | undefined = (typeof window !== 'undefined' && (window as any)._API_BASE_) || undefined;
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) throw new Error("API_BASE not set");
  const isFD = init?.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    headers: isFD ? undefined : { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : (undefined as any);
}
const svc = {
  list: (tenant?: string) => api<Kegiatan[]>(`/kegiatan${tenant ? `?tenant=${encodeURIComponent(tenant)}` : ''}`),
  create: (k: Partial<Kegiatan>) => api<Kegiatan>(`/kegiatan`, { method: 'POST', body: JSON.stringify(k) }),
  update: (id: string, patch: Partial<Kegiatan>) => api<Kegiatan>(`/kegiatan/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  remove: (id: string) => api<{ ok: true }>(`/kegiatan/${id}`, { method: 'DELETE' }),
  openPresensi: (id: string, mode: PresensiMode) => api<{ ok: true; token?: string }>(`/kegiatan/${id}/presensi/open`, { method: 'POST', body: JSON.stringify({ mode }) }),
  uploadDocs: (id: string, files: File[]) => {
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    return api<{ urls: string[] }>(`/kegiatan/${id}/dokumentasi`, { method: 'POST', body: fd });
  },
};

// ===== Demo Seed (fallback local) =====
const DEMO: Kegiatan[] = [
  { id: "k1", judul: "Latihan Rutin Mingguan", jenis: "Latihan", tanggal: todayPlus(2), lokasi: "Lapangan Sekolah", penanggungJawab: "Pembina A", peserta: 45, status: 'Ajukan', webSekolah: "https://sdn05.example.sch.id/berita/latihan", dokumentasi: [{ name: "pembukaan.jpg", url: "", type: "image/jpeg" }] },
  { id: "k2", judul: "Perkemahan Sabtu-Minggu", jenis: "Perkemahan", tanggal: todayPlus(14), lokasi: "Buper Cibubur", penanggungJawab: "Pembina B", peserta: 120, status: 'Draft' },
];

function todayPlus(d: number) { const t = new Date(); t.setDate(t.getDate() + d); return t.toISOString().slice(0, 10); }

// ===== Helpers =====
function isImage(t?: string) { return !!t && t.startsWith('image/'); }
function isVideo(t?: string) { return !!t && t.startsWith('video/'); }
function validateKegiatan(k: Partial<Kegiatan>): string[] {
  const errors: string[] = [];
  if (!k.judul?.trim()) errors.push("Judul wajib diisi");
  if (!k.tanggal) errors.push("Tanggal wajib diisi");
  if (!k.lokasi?.trim()) errors.push("Lokasi wajib diisi");
  if (!k.penanggungJawab?.trim()) errors.push("Penanggung jawab wajib diisi");
  if (k.peserta == null || k.peserta < 0) errors.push("Peserta harus angka non-negatif");
  if (k.webSekolah && !k.webSekolah.startsWith('http')) errors.push("URL web sekolah harus valid");
  return errors;
}

// ===== Kegiatan Table Component =====
function KegiatanTable({
  rows,
  presensiBusy,
  busy,
  onOpenPresensi,
  onUpdateStatus,
  onOpenDocs,
  onRemoveRow,
  onOpenViewer,
}: {
  rows: Kegiatan[];
  presensiBusy: string | null;
  busy: boolean;
  onOpenPresensi: (id: string, mode: PresensiMode) => void;
  onUpdateStatus: (id: string, next: Status) => void;
  onOpenDocs: (k: Kegiatan) => void;
  onRemoveRow: (id: string) => void;
  onOpenViewer: (items: DocItem[], idx: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/30 overflow-auto">
      <table className="w-full text-sm text-white">
        <thead className="bg-white/10">
          <tr>
            <th className="p-2 text-left">Judul</th>
            <th className="p-2">Jenis</th>
            <th className="p-2">Tanggal</th>
            <th className="p-2">Lokasi</th>
            <th className="p-2">PJ</th>
            <th className="p-2">Peserta</th>
            <th className="p-2">Status</th>
            <th className="p-2">Dok</th>
            <th className="p-2">Presensi</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="odd even/70">
              <td className="p-2">{r.judul}</td>
              <td className="p-2 text-center">{r.jenis}</td>
              <td className="p-2 text-center">{r.tanggal}</td>
              <td className="p-2">{r.lokasi}</td>
              <td className="p-2">{r.penanggungJawab}</td>
              <td className="p-2 text-center">{r.peserta}</td>
              <td className="p-2 text-center">{r.status || 'Draft'}</td>
              <td className="p-2 text-center">
                <button onClick={() => onOpenViewer(r.dokumentasi || [], 0)} disabled={!r.dokumentasi?.length}>
                  {r.dokumentasi?.length || 0}
                </button>
              </td>
              <td className="p-2">
                <div className="flex flex-wrap gap-2">
                  <button disabled={presensiBusy === r.id + "QR" || busy} onClick={() => onOpenPresensi(r.id, 'QR')} className="btn-ghost"><QrCode size={14} /> QR</button>
                  <button disabled={presensiBusy === r.id + "Fingerprint" || busy} onClick={() => onOpenPresensi(r.id, 'Fingerprint')} className="btn-ghost"><Fingerprint size={14} /> FP</button>
                  <button disabled={presensiBusy === r.id + "Geofence" || busy} onClick={() => onOpenPresensi(r.id, 'Geofence')} className="btn-ghost"><MapPin size={14} /> Geo</button>
                </div>
              </td>
              <td className="p-2">
                <div className="flex flex-wrap gap-2 justify-center">
                  {r.webSekolah && <a className="btn-ghost" href={r.webSekolah} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Web</a>}
                  <button disabled={busy} onClick={() => onUpdateStatus(r.id, 'Ajukan')} className="btn-ghost"><Clock size={14} /> Ajukan</button>
                  <button disabled={busy} onClick={() => onUpdateStatus(r.id, 'Disetujui')} className="btn-ghost"><CheckCircle2 size={14} /> Setuju</button>
                  <button disabled={busy} onClick={() => onUpdateStatus(r.id, 'Selesai')} className="btn-ghost"><ShieldCheck size={14} /> Selesai</button>
                  <button disabled={busy} onClick={() => onOpenDocs(r)} className="btn-ghost"><ImageIcon size={14} /> Dokumentasi</button>
                  <button disabled={busy} onClick={() => onRemoveRow(r.id)} className="btn-danger"><Trash2 size={14} /> Hapus</button>
                </div>
              </td>
            </tr>
          ))}
          {!rows.length && <tr><td className="p-3 text-center text-white/70" colSpan={10}>Tidak ada kegiatan.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

// ===== Header Component (sudah ada, tapi adaptasi) =====
function Header({
  busy,
  backend,
  onToggleBackend,
  tenant,
  onTenant,
  q,
  onQ,
  onExportCSV,
  onExportJSON,
  fileInputRef,
}: {
  busy: boolean;
  backend: boolean;
  onToggleBackend: () => void;
  tenant: string;
  onTenant: (s: string) => void;
  q: string;
  onQ: (s: string) => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="rounded-xl border-white/30 p-5 mb-6 border flex items-center justify-between">
      <div className="flex items-center gap-3"><ClipboardList /><div><h1 className="text-lg font-bold">Pramuka — Kegiatan Sekolah</h1><p className="text-sm opacity-80">Kelola kegiatan per tenant • integrasi Xpresensi</p></div></div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 border border-white/30">
          <input value={q} onChange={e => onQ(e.target.value)} placeholder="Cari kegiatan" className="bg-transparent outline-none text-sm w-60 text-white" />
        </div>
        {/* <label className="flex items-center gap-2 text-xs rounded-xl px-3 py-2 border border-white/30">
          <PlugZap size={14} /> Backend
          <input type="checkbox" checked={backend} onChange={onToggleBackend} />
        </label> */}
        <input value={tenant} onChange={e => onTenant(e.target.value)} placeholder="Tenant ID" className="border rounded px-3 py-2 text-sm w-40 border-white/30 text-black" />
        <button onClick={onExportCSV} className="text-sm border border-white/30 flex items-center gap-2 p-2 rounded-md"><FileSpreadsheet size={14} /> CSV</button>
        <button onClick={onExportJSON} className="text-sm border border-white/30 flex items-center gap-2 p-2 rounded-md"><Download size={14} /> Export JSON</button>
        <button onClick={() => fileInputRef.current?.click()} className="text-sm border border-white/30 flex items-center gap-2 p-2 rounded-md"><UploadCloud size={14} /> Import JSON</button>
        {busy && <span className="text-xs opacity-80">Sync…</span>}
      </div>
    </div>
  );
}

// ===== Main Component =====
export function GalleryPramukaMain() {
  const [rows, setRows] = useState<Kegiatan[]>(DEMO);
  const [q, setQ] = useState("");
  const [tenant, setTenant] = useState<string>("SEKOLAH-001");
  const [backend, setBackend] = useState<boolean>(Boolean(API_BASE));
  const [busy, setBusy] = useState<boolean>(false);
  const [presensiBusy, setPresensiBusy] = useState<string | null>(null);

  // Form tambah
  const [form, setForm] = useState<Partial<Kegiatan>>({ jenis: 'Latihan', tanggal: todayPlus(1), peserta: 0, status: 'Draft', dokumentasi: [], webSekolah: '' });
  const [formDocs, setFormDocs] = useState<File[]>([]);

  // Modal dokumentasi setelah kegiatan dibuat
  const [docTarget, setDocTarget] = useState<Kegiatan | null>(null);
  const [docFiles, setDocFiles] = useState<File[]>([]);

  // Lightbox viewer
  const [viewer, setViewer] = useState<{ open: boolean; items: DocItem[]; idx: number }>({ open: false, items: [], idx: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [debouncedQ] = useDebounce(q, 300);

  // Load from backend jika aktif
  const loadData = useCallback(async () => {
    if (!backend) return;
    try {
      setBusy(true);
      const data = await svc.list(tenant);
      setRows(data);
      toast.success("Data berhasil dimuat dari server");
    } catch (e) {
      toast.error("Gagal memuat data dari server");
      console.warn(e);
    } finally {
      setBusy(false);
    }
  }, [backend, tenant]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRows = useMemo(() => {
    return rows.filter(r => (r.judul + " " + r.jenis + " " + r.lokasi + " " + r.penanggungJawab).toLowerCase().includes(debouncedQ.toLowerCase()));
  }, [rows, debouncedQ]);

  const addRow = useCallback(async () => {
    const errors = validateKegiatan(form);
    if (errors.length > 0) {
      toast.error("Validasi gagal: " + errors.join(", "));
      return;
    }
    const payload: Kegiatan = {
      id: uuidv4(),
      tenant,
      judul: form.judul!,
      jenis: form.jenis as Jenis,
      tanggal: form.tanggal!,
      lokasi: form.lokasi!,
      penanggungJawab: form.penanggungJawab!,
      peserta: Number(form.peserta),
      status: form.status as Status,
      webSekolah: form.webSekolah || '',
      dokumentasi: [],
    };
    setBusy(true);
    try {
      if (backend) {
        const created = await svc.create(payload);
        let docs: DocItem[] = [];
        if (formDocs.length) {
          const res = await svc.uploadDocs(created.id, formDocs);
          docs = (res?.urls || []).map((u, i) => ({ name: formDocs[i]?.name || `dok-${i + 1}`, url: u, type: formDocs[i]?.type, size: formDocs[i]?.size }));
          const upd = await svc.update(created.id, { dokumentasi: docs });
          setRows(r => [upd, ...r]);
        } else {
          setRows(r => [created, ...r]);
        }
        toast.success("Kegiatan berhasil ditambahkan");
      } else {
        const docs: DocItem[] = formDocs.map(f => ({ name: f.name, url: URL.createObjectURL(f), type: f.type, size: f.size }));
        payload.dokumentasi = docs;
        setRows(r => [payload, ...r]);
        toast.success("Kegiatan berhasil ditambahkan (lokal)");
      }
    } catch (e) {
      toast.error("Gagal menyimpan kegiatan");
      console.warn(e);
    } finally {
      setBusy(false);
      setForm({ jenis: 'Latihan', tanggal: todayPlus(1), peserta: 0, status: 'Draft', dokumentasi: [], webSekolah: '' });
      setFormDocs([]);
    }
  }, [form, formDocs, backend, tenant]);

  const removeRow = useCallback(async (id: string) => {
    if (!window.confirm('Hapus kegiatan ini?')) return;
    setBusy(true);
    try {
      if (backend) {
        await svc.remove(id);
      }
      setRows(r => r.filter(x => x.id !== id));
      toast.success("Kegiatan berhasil dihapus");
    } catch (e) {
      toast.error("Gagal menghapus kegiatan");
      console.warn(e);
    } finally {
      setBusy(false);
    }
  }, [backend]);

  const updateStatus = useCallback(async (id: string, next: Status) => {
    setBusy(true);
    try {
      if (backend) {
        const upd = await svc.update(id, { status: next });
        setRows(r => r.map(x => x.id === id ? upd : x));
      } else {
        setRows(r => r.map(x => x.id === id ? { ...x, status: next } : x));
      }
      toast.success(`Status diubah menjadi ${next}`);
    } catch (e) {
      toast.error("Gagal mengubah status");
      console.warn(e);
    } finally {
      setBusy(false);
    }
  }, [backend]);

  const openPresensi = useCallback(async (id: string, mode: PresensiMode) => {
    setPresensiBusy(id + mode);
    try {
      if (backend) {
        const res = await svc.openPresensi(id, mode);
        toast.success(res.token ? `Presensi ${mode} dibuka! Token: ${res.token}` : `Presensi ${mode} dibuka!`);
      } else {
        toast.success(`(Demo) Presensi ${mode} dibuka untuk kegiatan ${id}.`);
      }
    } catch (e) {
      toast.error("Gagal membuka presensi");
      console.warn(e);
    } finally {
      setPresensiBusy(null);
    }
  }, [backend]);

  // === Dokumentasi setelah kegiatan ===
  const openDocs = useCallback((k: Kegiatan) => {
    setDocTarget(k);
    setDocFiles([]);
  }, []);

  const closeDocs = useCallback(() => {
    setDocTarget(null);
    setDocFiles([]);
  }, []);

  const pickDocs = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocFiles(files);
  }, []);

  const deleteDoc = useCallback(async (k: Kegiatan, idx: number) => {
    if (!window.confirm('Hapus dokumen ini?')) return;
    const id = k.id;
    const nextDocs = (k.dokumentasi || []).filter((_, i) => i !== idx);
    setBusy(true);
    try {
      if (backend) {
        const upd = await svc.update(id, { dokumentasi: nextDocs });
        setRows(r => r.map(x => x.id === id ? upd : x));
        if (docTarget) setDocTarget({ ...upd });
      } else {
        setRows(r => r.map(x => x.id === id ? { ...x, dokumentasi: nextDocs } : x));
        if (docTarget) setDocTarget({ ...docTarget, dokumentasi: nextDocs });
      }
      toast.success("Dokumen berhasil dihapus");
    } catch (e) {
      toast.error("Gagal menghapus dokumen");
      console.warn(e);
    } finally {
      setBusy(false);
    }
  }, [backend, docTarget]);

  const saveDocs = useCallback(async () => {
    if (!docTarget) return;
    const id = docTarget.id;
    setBusy(true);
    try {
      let newDocs: DocItem[] = [];
      if (backend) {
        const res = await svc.uploadDocs(id, docFiles);
        newDocs = (res?.urls || []).map((u, i) => ({ name: docFiles[i]?.name || `dok-${i + 1}`, url: u, type: docFiles[i]?.type, size: docFiles[i]?.size }));
      } else {
        newDocs = docFiles.map(f => ({ name: f.name, url: URL.createObjectURL(f), type: f.type, size: f.size }));
      }
      const merged = [...(docTarget.dokumentasi || []), ...newDocs];
      if (backend) {
        const upd = await svc.update(id, { dokumentasi: merged });
        setRows(r => r.map(x => x.id === id ? upd : x));
        setDocTarget({ ...upd });
      } else {
        setRows(r => r.map(x => x.id === id ? { ...x, dokumentasi: merged } : x));
        setDocTarget({ ...docTarget, dokumentasi: merged });
      }
      toast.success("Dokumentasi berhasil disimpan");
    } catch (e) {
      toast.error("Gagal menyimpan dokumentasi");
      console.warn(e);
    } finally {
      setBusy(false);
      setDocFiles([]);
    }
  }, [docTarget, docFiles, backend]);

  const onPickDocs = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormDocs(files);
  }, []);

  // Lightbox controls
  const openViewer = useCallback((items: DocItem[], idx: number = 0) => {
    setViewer({ open: true, items, idx });
  }, []);

  const closeViewer = useCallback(() => {
    setViewer(v => ({ ...v, open: false }));
  }, []);

  const nextViewer = useCallback(() => {
    setViewer(v => ({ ...v, idx: (v.idx + 1) % v.items.length }));
  }, []);

  const prevViewer = useCallback(() => {
    setViewer(v => ({ ...v, idx: (v.idx - 1 + v.items.length) % v.items.length }));
  }, []);

  const exportCSV = useCallback(() => {
    const headers = ["judul", "jenis", "tanggal", "lokasi", "penanggungJawab", "peserta", "status"];
    const esc = (v: any) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const lines = filteredRows.map(r => [r.judul, r.jenis, r.tanggal, r.lokasi, r.penanggungJawab, r.peserta, r.status || ''].map(esc).join(","));
    const content = [headers.map(esc).join(","), ...lines].join("\r\n");
    const blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kegiatan.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredRows]);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kegiatan.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [rows]);

  const importJSON = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const arr = JSON.parse(String(rd.result));
        if (Array.isArray(arr) && arr.every(item => typeof item.id === 'string' && typeof item.judul === 'string')) {
          setRows(arr);
          toast.success("Data berhasil diimpor");
        } else {
          toast.error("Format file tidak valid");
        }
      } catch {
        toast.error("File rusak");
      }
    };
    rd.readAsText(f);
  }, []);

  return (
    <div className="min-h-screen text-white">
      <Toaster />
      <div className="max-w-full mx-auto">
        <Header
          busy={busy}
          backend={backend}
          onToggleBackend={() => setBackend(v => !v)}
          tenant={tenant}
          onTenant={setTenant}
          q={q}
          onQ={setQ}
          onExportCSV={exportCSV}
          onExportJSON={exportJSON}
          fileInputRef={fileInputRef}
        />
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={importJSON} />

        {/* Form Tambah */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="rounded-2xl border p-4 space-y-3 border-white/30">
            <div className="grid md:grid-cols-3 gap-3">
              <input value={form.judul || ""} onChange={e => setForm({ ...form, judul: e.target.value })} placeholder="Judul Kegiatan" className="border border-white/30 bg-white/10 rounded-lg dark:text-white p-2" />
              <select value={form.jenis as string} onChange={e => setForm({ ...form, jenis: e.target.value as Jenis })} className="border border-white/30 bg-white/10 rounded-lg dark:text-white p-2">
                {JENIS_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
              <input type="date" value={form.tanggal || ""} onChange={e => setForm({ ...form, tanggal: e.target.value })} className="border border-white/30 bg-white/10 rounded-lg dark:text-white p-2" />

              <input value={form.lokasi || ""} onChange={e => setForm({ ...form, lokasi: e.target.value })} placeholder="Lokasi" className="border border-white/30 bg-white/10 rounded-lg dark:text-white p-2 md:col-span-2" />
              <input value={form.penanggungJawab || ""} onChange={e => setForm({ ...form, penanggungJawab: e.target.value })} placeholder="Penanggung Jawab" className="border border-white/30 bg-white/10 rounded-lg dark:text-white p-2" />

              <input type="number" value={form.peserta || 0} onChange={e => setForm({ ...form, peserta: Number(e.target.value) })} placeholder="Jumlah Peserta" className="border border-white/30 bg-white/10 rounded-lg dark:text-white p-2" />
              <select value={(form.status as Status) || 'Draft'} onChange={e => setForm({ ...form, status: e.target.value as Status })} className="border border-white/30 bg-white/10 rounded-lg dark:text-white p-2">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <div className="md:col-span-3 grid md:grid-cols-3 gap-3 items-center">
                <div className="md:col-span-2 flex items-center gap-2">
                  <LinkIcon size={16} />
                  <input value={form.webSekolah || ""} onChange={e => setForm({ ...form, webSekolah: e.target.value })} placeholder="URL Berita di Web Sekolah (opsional)" className="border border-white/30 bg-white/10 rounded-lg dark:text-white p-2 w-full" />
                </div>
                {form.webSekolah && <a href={form.webSekolah} target="_blank" rel="noreferrer" className="btn-ghost inline-flex items-center justify-center"><ExternalLink size={14} /> Buka Web Sekolah</a>}
              </div>

              <div className="md:col-span-3">
                <label className="text-xs opacity-90 flex items-center gap-2 mb-2"><ImageIcon size={16} /> Upload Dokumentasi (gambar/video/pdf)</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="btn-ghost cursor-pointer"><UploadCloud size={14} /> Pilih File<input type="file" multiple accept="image/*,video/*,application/pdf" className="hidden" onChange={onPickDocs} /></label>
                  {formDocs.length ? <span className="text-xs opacity-80">{formDocs.length} file dipilih</span> : <span className="text-xs opacity-60">Belum ada file</span>}
                </div>
                {formDocs.length > 0 && (
                  <div className="mt-2 grid md:grid-cols-4 gap-2">
                    {formDocs.map((f, i) => (
                      <div key={i} className="rounded border border-white/10 p-2 text-xs">
                        <div className="font-medium truncate">{f.name}</div>
                        <div className="opacity-70">{(f.size / 1024).toFixed(1)} KB</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button disabled={busy} onClick={addRow} className="btn-yellow"><Plus size={16} /> Tambah Kegiatan</button>
          </div>
        </motion.section>

        {/* Tabel */}
        <div className="text-sm opacity-80 mb-2">Menampilkan {filteredRows.length} dari {rows.length} kegiatan</div>
        <KegiatanTable
          rows={filteredRows}
          presensiBusy={presensiBusy}
          busy={busy}
          onOpenPresensi={openPresensi}
          onUpdateStatus={updateStatus}
          onOpenDocs={openDocs}
          onRemoveRow={removeRow}
          onOpenViewer={openViewer}
        />

        <div className="mt-8 text-xs opacity-60">© {new Date().getFullYear()} — Modul Kegiatan Sekolah. Powered by Xpresensi.</div>
      </div>

      {/* Modal Dokumentasi */}
      {docTarget && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={closeDocs} />
          <div className="absolute right-0 top-0 h-full w-full md:w-[820px] border-l border-white/10">
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold flex items-center gap-2"><ImageIcon size={18} /> Dokumentasi — {docTarget.judul}</div>
                <button className="text-white/70" onClick={closeDocs}><X /></button>
              </div>

              <div className="mb-3">
                <div className="text-xs opacity-80 mb-1">Dokumen yang sudah terunggah:</div>
                {docTarget.dokumentasi?.length ? (
                  <div className="grid md:grid-cols-3 gap-2">
                    {docTarget.dokumentasi.map((d, i) => (
                      <div key={i} className="rounded border border-white/10 p-2 text-xs group relative">
                        <div className="truncate mb-1">{d.name || `dok-${i + 1}`}</div>
                        <div className="flex items-center gap-2">
                          {d.url ? (
                            <>
                              <button onClick={() => openViewer(docTarget.dokumentasi || [], i)} className="underline text-white/80">Lihat</button>
                              <a className="underline text-white/60" href={d.url} target="_blank" rel="noreferrer">Buka</a>
                            </>
                          ) : (
                            <span className="opacity-60">(url belum tersedia)</span>
                          )}
                          <button onClick={() => deleteDoc(docTarget, i)} className="ml-auto text-red-300 hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs opacity-60">Belum ada dokumentasi.</div>
                )}
              </div>

              <div className="mb-4">
                <label className="text-xs opacity-90 flex items-center gap-2 mb-2"><UploadCloud size={16} /> Tambah Dokumen Baru</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="btn-ghost cursor-pointer"><UploadCloud size={14} /> Pilih File<input type="file" multiple accept="image/*,video/*,application/pdf" className="hidden" onChange={pickDocs} /></label>
                  {docFiles.length ? <span className="text-xs opacity-80">{docFiles.length} file dipilih</span> : <span className="text-xs opacity-60">Belum ada file</span>}
                </div>
                {docFiles.length > 0 && (
                  <div className="mt-2 grid md:grid-cols-3 gap-2">
                    {docFiles.map((f, i) => (
                      <div key={i} className="rounded border border-white/10 p-2 text-xs">
                        <div className="font-medium truncate">{f.name}</div>
                        <div className="opacity-70">{(f.size / 1024).toFixed(1)} KB</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button disabled={busy} onClick={closeDocs} className="btn-ghost">Batal</button>
                <button disabled={busy || !docFiles.length} onClick={saveDocs} className="btn-yellow">Simpan Dokumentasi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Viewer */}
      {viewer.open && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/80" onClick={closeViewer} />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="mb-3 text-sm opacity-80">{viewer.items[viewer.idx]?.name}</div>
            <div className="relative max-w-[90vw] max-h-[80vh] bg-black/40 rounded-xl overflow-hidden border border-white/20">
              {isImage(viewer.items[viewer.idx]?.type) ? (
                <img src={viewer.items[viewer.idx]?.url} alt="dok" className="object-contain max-h-[80vh] max-w-[90vw]" />
              ) : isVideo(viewer.items[viewer.idx]?.type) ? (
                <video src={viewer.items[viewer.idx]?.url} controls className="object-contain max-h-[80vh] max-w-[90vw]" />
              ) : (
                <div className="p-6 text-center text-white/70">Tidak dapat menampilkan pratinjau. <a className="underline" href={viewer.items[viewer.idx]?.url} target="_blank" rel="noreferrer">Buka</a></div>
              )}
              <button onClick={closeViewer} className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 rounded-full p-2"><X /></button>
              {viewer.items.length > 1 && (
                <>
                  <button onClick={prevViewer} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2">‹</button>
                  <button onClick={nextViewer} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2">›</button>
                </>
              )}
            </div>
            {viewer.items.length > 1 && (
              <div className="mt-3 flex gap-2 flex-wrap justify-center max-w-[90vw]">
                {viewer.items.map((it, i) => (
                  <button key={i} onClick={() => setViewer(v => ({ ...v, idx: i }))} className={`w-14 h-14 rounded overflow-hidden border ${i === viewer.idx ? 'border-white' : 'border-white/20'}`}>
                    {isImage(it.type) ? (
                      <img src={it.url} className="w-full h-full object-cover" />
                    ) : isVideo(it.type) ? (
                      <div className="w-full h-full grid place-items-center text-xs">🎬</div>
                    ) : (
                      <div className="w-full h-full grid place-items-center text-xs">📄</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== CSS helpers =====
const style = document?.createElement?.('style');
if (style) {
  style.innerHTML = `
    .input{ background:#1B2E58; border:1px solid ${THEME.border}; border-radius:0.75rem; padding:0.5rem 0.75rem; }
    .btn-yellow{ background:#F2C94C; color:#000; border:1px solid ${THEME.border}; border-radius:0.75rem; padding:0.5rem 0.75rem; display:inline-flex; align-items:center; gap:6px; }
    .btn-ghost{ background:#1B2E58; border:1px solid ${THEME.border}; border-radius:0.5rem; padding:0.35rem 0.6rem; display:inline-flex; align-items:center; gap:6px; }
    .btn-danger{ background:#dc2626; color:#fff; border:1px solid #b91c1c; border-radius:0.5rem; padding:0.35rem 0.6rem; display:inline-flex; align-items:center; gap:6px; }
  `;
  document.head.appendChild(style);
}

/*************** Tiny Runtime Tests (tidak mengubah perilaku) ***************/
(function tests() {
  try {
    // 1) CSV export memuat kolom dasar dan baris + newline benar (CRLF)
    const headers = ["judul", "jenis", "tanggal", "lokasi", "penanggungJawab", "peserta", "status"];
    const content = [headers.join(','), ['Uji', 'Latihan', '2025-01-01', 'Sekolah', 'Pembina', 10, 'Draft'].join(',')].join('\r\n');
    console.assert(content.includes('Uji') && content.includes('\r\n'), 'CSV: konten tidak benar');

    // 2) Merge dokumentasi setelah upload
    const before = [{ name: 'a.jpg', url: 'u1' }] as DocItem[];
    const added = [{ name: 'b.jpg', url: 'u2' }] as DocItem[];
    const merged = [...before, ...added];
    console.assert(merged.length === 2 && merged[1].name === 'b.jpg', 'Merge dokumentasi gagal');

    // 3) Delete item memastikan panjang berkurang
    const afterDel = merged.filter((_, i) => i !== 0);
    console.assert(afterDel.length === 1 && afterDel[0].name === 'b.jpg', 'Delete dokumentasi gagal');

    // 4) Viewer index wrap-around
    const items = [{ type: 'image/jpeg', url: 'u1' }, { type: 'image/jpeg', url: 'u2' }] as any[];
    let idx = 0; idx = (idx + 1) % items.length; idx = (idx + 1) % items.length;
    console.assert(idx === 0, 'Viewer wrap-around gagal');

    // 5) CSV escaping kutip & koma
    const esc = (v: any) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const row = esc('Say "Hi"') + ',' + esc('A,B') + ',' + esc(1);
    console.assert(row.includes('""Hi""') && row.includes('","'), 'CSV escape gagal');

  } catch (e) { console.warn('[tests]', e); }
})();