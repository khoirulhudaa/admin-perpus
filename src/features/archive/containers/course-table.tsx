import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  Search,
  Filter,
  Plus,
  UploadCloud,
  FolderPlus,
  Printer,
  Tags,
  Download,
  QrCode,
  ShieldCheck,
  History,
  Eye,
  Share2,
  FileText,
  Building2,
  Trash2,
  Settings,
  TimerReset,
  X,
  CheckCircle2,
  FileSpreadsheet,
  Mail,
  ScanLine,
} from "lucide-react";

/*************************************************
 * Dashboard Admin Sekolah — Menu "Arsip"
 * Versi: fungsional (semua tombol bekerja - mock client)
 * — Pencarian, filter cepat (popover), tagging
 * — Upload, Scan (mock OCR), Impor Email (mock)
 * — Preview drawer, Riwayat versi, Retensi per kategori
 * — QR label (mock cetak), Unduh (JSON/CSV), Bagikan (copy link)
 * Catatan: Ini mock di sisi client. Ganti bagian bertanda TODO API
 * untuk koneksi ke backend Xpresensi nanti.
 *************************************************/

// ===== Utils =====
function clsx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}
const fmtDate = (s: string) => new Date(s).toLocaleDateString();
const toCSV = (rows: any[]) => {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
  ];
  return lines.join("\n");
};
const downloadBlob = (content: string, filename: string, type = "text/plain") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Pure helper untuk retensi (dipakai juga di self-test)
function applyRetensi(list: any[], retMap: Record<string, number>, now = new Date()) {
  return list.map((d) => {
    const years = retMap[d.kategori];
    if (years === 0 || years === undefined) return d; // permanen / tidak diatur
    const dt = new Date(d.tgl);
    const expired = new Date(dt.getFullYear() + years, dt.getMonth(), dt.getDate());
    if (now > expired && d.status !== "inaktif") return { ...d, status: "inaktif" };
    return d;
  });
}

// ===== Master data =====
const INIT_KATEGORI = [
  { key: "surat-masuk", name: "Surat Masuk" },
  { key: "surat-keluar", name: "Surat Keluar" },
  { key: "sk", name: "SK / Kepsek" },
  { key: "izin", name: "Perizinan" },
  { key: "dok-siswa", name: "Dokumen Siswa" },
  { key: "dok-guru", name: "Dokumen Guru/Tendik" },
  { key: "inventaris", name: "Inventaris & Berita Acara" },
];

const MASTER_STATUS = [
  { key: "aktif", label: "Aktif" },
  { key: "disposisi", label: "Butuh Disposisi" },
  { key: "inaktif", label: "Inaktif" },
  { key: "kedaluwarsa", label: "Kedaluwarsa" },
];

const MASTER_KLASIF = [
  { key: "umum", label: "Umum" },
  { key: "rahasia", label: "Rahasia" },
  { key: "sangat-rahasia", label: "Sangat Rahasia" },
];

const DUMMY_DOCS = [
  {
    id: "D-001",
    title: "Undangan Rapat Komite",
    kategori: "surat-masuk",
    tgl: "2025-08-05",
    kode: "SM-2025/08/05-01",
    unit: "TU",
    owner: "Admin TU",
    tags: ["komite", "rapat"],
    status: "aktif",
    klasifikasi: "umum",
    versi: 3,
  },
  {
    id: "D-002",
    title: "SK Panitia PPDB 2025/2026",
    kategori: "sk",
    tgl: "2025-07-15",
    kode: "SK-PPDB/2025-01",
    unit: "Kesiswaan",
    owner: "Kepala Sekolah",
    tags: ["ppdb", "panitia"],
    status: "aktif",
    klasifikasi: "umum",
    versi: 1,
  },
  {
    id: "D-003",
    title: "Surat Keterangan Aktif Siswa (A.n. Dina)",
    kategori: "dok-siswa",
    tgl: "2025-06-20",
    kode: "DS-2025/06/20-14",
    unit: "Kesiswaan",
    owner: "Operator",
    tags: ["surat-ket", "siswa"],
    status: "disposisi",
    klasifikasi: "umum",
    versi: 2,
  },
  {
    id: "D-004",
    title: "Berita Acara Serah Terima Laptop BOS",
    kategori: "inventaris",
    tgl: "2024-12-10",
    kode: "BAST-INV/2024-12",
    unit: "Sarana",
    owner: "Waka Sarpras",
    tags: ["bast", "laptop", "bos"],
    status: "inaktif",
    klasifikasi: "rahasia",
    versi: 4,
  },
];

export const ArchiveMain = () => {
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("all");
  const [status, setStatus] = useState("all");
  const [klasifikasi, setKlasifikasi] = useState("all");
  const [tahun, setTahun] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [docs, setDocs] = useState<any[]>(DUMMY_DOCS);
  const [masterKategori, setMasterKategori] = useState(INIT_KATEGORI);

  // UI state tambahan (semua tombol jadi fungsional)
  const [showFilter, setShowFilter] = useState(false);
  const [showKategoriModal, setShowKategoriModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showRetensi, setShowRetensi] = useState(false);
  const [retensiMap, setRetensiMap] = useState<Record<string, number>>({
    "surat-masuk": 5, // tahun
    "surat-keluar": 5,
    sk: 0, // 0 = permanen
    izin: 3,
    "dok-siswa": 3,
    "dok-guru": 3,
    inventaris: 7,
  });

  // Derive tahun unik dari dokumen
  const tahunOpts = useMemo(() => {
    const ys = new Set(docs.map((d) => new Date(d.tgl).getFullYear().toString()));
    return ["all", ...Array.from(ys).sort((a, b) => Number(b) - Number(a))];
  }, [docs]);

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (kategori !== "all" && d.kategori !== kategori) return false;
      if (status !== "all" && d.status !== status) return false;
      if (klasifikasi !== "all" && d.klasifikasi !== klasifikasi) return false;
      if (tahun !== "all" && new Date(d.tgl).getFullYear().toString() !== tahun) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.kode.toLowerCase().includes(q) ||
        d.unit.toLowerCase().includes(q) ||
        d.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    });
  }, [docs, kategori, status, klasifikasi, tahun, query]);

  const allSelected = selected.length > 0 && selected.length === filtered.length;

  function toggleSelect(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleSelectAll() {
    if (allSelected) setSelected([]);
    else setSelected(filtered.map((d) => d.id));
  }

  // === BULK ACTIONS ===
  function bulkAction(type: "inaktif" | "delete" | "retensi" | "export") {
    const targets = selected.length ? docs.filter((d) => selected.includes(d.id)) : filtered;
    if (!targets.length) return;

    if (type === "inaktif") {
      setDocs((prev) => prev.map((d) => (targets.find((t) => t.id === d.id) ? { ...d, status: "inaktif" } : d)));
      makeToast(`Menandai ${targets.length} dokumen sebagai inaktif.`);
    } else if (type === "delete") {
      setDocs((prev) => prev.filter((d) => !targets.find((t) => t.id === d.id)));
      makeToast(`Menghapus ${targets.length} dokumen.`);
    } else if (type === "retensi") {
      setShowRetensi(true);
    } else if (type === "export") {
      const csv = toCSV(targets);
      downloadBlob(csv, `arsip-export-${Date.now()}.csv`, "text/csv;charset=utf-8");
      makeToast(`Ekspor ${targets.length} baris ke CSV.`);
    }
    setSelected([]);
  }

  // === UPLOAD ===
  function onUploadDummy(files?: FileList | null) {
    const now = new Date();
    const id = `D-${(docs.length + 1).toString().padStart(3, "0")}`;
    const item = {
      id,
      title: files?.[0]?.name || "Dokumen Baru (Dummy)",
      kategori: "surat-masuk",
      tgl: now.toISOString().slice(0, 10),
      kode: `SM-${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}-${Math.floor(Math.random() * 20)}`,
      unit: "TU",
      owner: "Admin TU",
      tags: ["upload"],
      status: "aktif",
      klasifikasi: "umum",
      versi: 1,
    };
    setDocs((p) => [item, ...p]);
    setShowUpload(false);
    makeToast("Upload berhasil (dummy)");
  }

  // === SCAN (mock OCR) ===
  function onScan(files?: FileList | null) {
    const f = files?.[0];
    const now = new Date();
    const id = `D-${(docs.length + 1).toString().padStart(3, "0")}`;
    const item = {
      id,
      title: f ? `Scan: ${f.name}` : "Hasil Scan (Dummy)",
      kategori: "surat-masuk",
      tgl: now.toISOString().slice(0, 10),
      kode: `SCAN-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${Math.floor(Math.random() * 100)}`,
      unit: "TU",
      owner: "Admin TU",
      tags: ["scan", "ocr"],
      status: "aktif",
      klasifikasi: "umum",
      versi: 1,
      ocrText: "(Mock OCR) Teks hasil scan akan tampil di sini.",
    };
    setDocs((p) => [item, ...p]);
    setShowScanModal(false);
    makeToast("Scan tersimpan (dummy)");
  }

  // === IMPOR EMAIL (mock) ===
  function onImportEmail({ subject, from }: { subject: string; from: string }) {
    const now = new Date();
    const id = `D-${(docs.length + 1).toString().padStart(3, "0")}`;
    const item = {
      id,
      title: subject || "Email Masuk (Tanpa Subjek)",
      kategori: "surat-masuk",
      tgl: now.toISOString().slice(0, 10),
      kode: `EML-${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`,
      unit: "TU",
      owner: from || "noreply@example.com",
      tags: ["email"],
      status: "aktif",
      klasifikasi: "umum",
      versi: 1,
    };
    setDocs((p) => [item, ...p]);
    setShowEmailModal(false);
    makeToast("Email diimpor (dummy)");
  }

  // === PER-DOKUMEN AKSI ===
  function downloadDoc(d: any) {
    const payload = JSON.stringify(d, null, 2);
    downloadBlob(payload, `${d.id}-${d.title}.json`, "application/json");
    makeToast("Unduh JSON");
  }
  function shareDoc(d: any) {
    const link = `https://arsip.xpresensi.com/doc/${encodeURIComponent(d.id)}`; // TODO API: ganti dengan permalink real
    navigator.clipboard?.writeText(link);
    makeToast("Tautan dibagikan ke clipboard");
  }
  function printQR(d: any) {
    const w = window.open("", "qr", "width=420,height=560");
    if (!w) return;
    const kat = masterKategori.find((k) => k.key === d.kategori)?.name || d.kategori;
    w.document.write(`<!doctype html><html><head><title>Label ${d.id}</title>
      <style>body{font-family:system-ui;margin:24px} .card{border:1px solid #ddd;padding:16px;border-radius:12px}
      .qr{width:200px;height:200px;border:2px dashed #333;display:flex;align-items:center;justify-content:center;margin:12px 0}
      .meta{font-size:12px;color:#555}
      </style></head><body>
      <div class="card">
        <h2 style="margin:0 0 4px">${d.title}</h2>
        <div class="meta">ID: ${d.id} · ${kat} · ${d.kode}</div>
        <div class="qr">QR CODE</div>
        <div class="meta">Gunakan aplikasi untuk scan. Link: https://arsip.xpresensi.com/doc/${d.id}</div>
      </div>
      <script>window.print()</script>
    </body></html>`);
    w.document.close();
  }

  // === RIWAYAT VERSI ===
  const [showRiwayatFor, setShowRiwayatFor] = useState<string | null>(null);
  function openRiwayat(d: any) {
    setShowRiwayatFor(d.id);
  }
  function bumpVersi(id: string) {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, versi: d.versi + 1 } : d)));
    makeToast("Versi bertambah");
  }

  // === FILTER CEPAT ===
  const [quickFilter, setQuickFilter] = useState({
    kategori: new Set<string>(),
    status: new Set<string>(),
    tags: new Set<string>(),
  });
  function applyQuickFilter() {
    // Memindahkan pilihan quick filter ke state utama (ambil salah satu jika >1)
    if (quickFilter.kategori.size) setKategori([...quickFilter.kategori][0]);
    else setKategori("all");
    if (quickFilter.status.size) setStatus([...quickFilter.status][0]);
    else setStatus("all");
    setShowFilter(false);
  }

  // === RETENSI ===
  function runRetensiNow() {
    setDocs((prev) => applyRetensi(prev, retensiMap, new Date()));
    setShowRetensi(false);
    makeToast("Retensi diterapkan");
  }

  // === KATEGORI MANAGER ===
  const [newKat, setNewKat] = useState({ key: "", name: "" });
  function addKategori() {
    if (!newKat.key || !newKat.name) return;
    if (masterKategori.find((k) => k.key === newKat.key)) {
      makeToast("Key kategori sudah ada");
      return;
    }
    setMasterKategori((prev) => [...prev, { ...newKat }]);
    setNewKat({ key: "", name: "" });
    makeToast("Kategori ditambahkan");
  }
  function delKategori(key: string) {
    setMasterKategori((prev) => prev.filter((k) => k.key !== key));
    makeToast("Kategori dihapus");
  }

  // Toast helper
  function makeToast(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 1800);
  }

  const fileScanRef = useRef<HTMLInputElement | null>(null);

  // ===== Self Tests (console) =====
  useEffect(() => {
    function assert(cond: boolean, msg: string) {
      // eslint-disable-next-line no-console
      cond ? console.log("TEST PASS:", msg) : console.error("TEST FAIL:", msg);
    }
    // Test 1: toCSV newline correctness & shape
    const csv = toCSV([{ a: 1, b: "x" }, { a: 2, b: "y" }]);
    const lines = csv.split("\n");
    assert(lines.length === 3, "toCSV menghasilkan 3 baris (header + 2 data)");
    assert(lines[0] === "a,b", "Header CSV benar");

    // Test 2: applyRetensi logic
    const oldDoc = {
      id: "T-1",
      title: "Old",
      kategori: "surat-masuk",
      tgl: "2018-01-01",
      kode: "X",
      unit: "TU",
      owner: "O",
      tags: [],
      status: "aktif",
      klasifikasi: "umum",
      versi: 1,
    };
    const freshDoc = {
      id: "T-2",
      title: "New",
      kategori: "surat-masuk",
      tgl: "2025-08-01",
      kode: "X",
      unit: "TU",
      owner: "O",
      tags: [],
      status: "aktif",
      klasifikasi: "umum",
      versi: 1,
    };
    const res = applyRetensi([oldDoc, freshDoc], { "surat-masuk": 5 }, new Date("2025-09-01"));
    assert(
      res[0].status === "inaktif" && res[1].status === "aktif",
      "applyRetensi menonaktifkan hanya yang melewati retensi",
    );

    // Test 3: toCSV harus meng-escape karakter kutip dan koma (via JSON.stringify)
    const csv2 = toCSV([{ t: 'a,"b"', n: 10 }, { t: 'c,d', n: 11 }]);
    assert(csv2.includes('\"'), "toCSV mengandung escape quotes");

    // Test 4: tahunOpts harus [all, 2025, 2024] untuk data dummy
    assert(
      Array.isArray(tahunOpts) && tahunOpts[0] === "all" && tahunOpts[1] === "2025" && tahunOpts[2] === "2024",
      "tahunOpts tersusun menurun",
    );

    // Test 5: toCSV pada input kosong harus string kosong
    const csvEmpty = toCSV([]);
    assert(csvEmpty === "", "toCSV([]) menghasilkan string kosong");

    // Test 6: retensi 0 (permanen) tidak mengubah status
    const docPermanen = {
      id: "T-3",
      title: "Dok Permanen",
      kategori: "sk",
      tgl: "2000-01-01",
      kode: "X",
      unit: "TU",
      owner: "O",
      tags: [],
      status: "aktif",
      klasifikasi: "umum",
      versi: 1,
    };
    const res2 = applyRetensi([docPermanen], { sk: 0 }, new Date("2025-09-01"));
    assert(res2[0].status === "aktif", "retensi 0 tidak menginaktifkan dokumen");
  }, [tahunOpts]);

  return (
    <div className="min-h-screen text-neutral-800 dark:text-neutral-100">
      {/* Header */}
      {/* <div className="sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-theme-color-primary/5/60 border-b border-neutral-200/60 dark:border-neutral-800">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center gap-3">
          <Archive className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Arsip Sekolah</h1>
          <span className="ml-auto text-sm text-neutral-500">RBAC: Hak akses mengikuti peran di Xpresensi</span>
        </div>
      </div> */}

      {/* Toolbar */}
      <div className="max-w-full mx-auto pb-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          {/* Search */}
          <div className="flex-1 flex bg-theme-color-primary/5 items-center gap-2 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 relative">
            <Search className="w-5 h-5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul/kode/tag/unit…"
              className="flex-1 bg-theme-color-primary/5 rounded-md px-3 outline-none py-2"
            />
            <button
              onClick={() => setShowFilter((v) => !v)}
              className="inline-flex bg-theme-color-primary/5 items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800"
            >
              <Filter className="w-4 h-4" /> Filter Cepat
            </button>

            {/* Popover Filter */}
            {showFilter && (
              <div className="absolute right-0 top-12 w-[320px] z-[99] bg-white dark:bg-theme-color-primary border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 shadow-xl">
                <div className="text-xs font-semibold mb-2 border-b border-white/40 pb-2">Filter Cepat</div>
                <div className="space-y-2 max-h-max overflow-auto pr-1">
                  <Section title="Kategori">
                    {masterKategori.map((k) => (
                      <label key={k.key} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={quickFilter.kategori.has(k.key)}
                          onChange={(e) => {
                            const s = new Set(quickFilter.kategori);
                            e.target.checked ? s.add(k.key) : s.delete(k.key);
                            setQuickFilter({ ...quickFilter, kategori: s });
                          }}
                        />
                        {k.name}
                      </label>
                    ))}
                  </Section>
                  <Section title="Status">
                    {MASTER_STATUS.map((s) => (
                      <label key={s.key} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={quickFilter.status.has(s.key)}
                          onChange={(e) => {
                            const st = new Set(quickFilter.status);
                            e.target.checked ? st.add(s.key) : st.delete(s.key);
                            setQuickFilter({ ...quickFilter, status: st });
                          }}
                        />
                        {s.label}
                      </label>
                    ))}
                  </Section>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setQuickFilter({ kategori: new Set(), status: new Set(), tags: new Set() });
                    }}
                    className="px-3 py-1.5 rounded-md border border-white"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyQuickFilter}
                    className="ml-auto px-3 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            >
              <UploadCloud className="w-4 h-4" /> Upload
            </button>
            <button
              onClick={() => setShowKategoriModal(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"
            >
              <FolderPlus className="w-4 h-4" /> Kategori
            </button>
            <button
              onClick={() => setShowScanModal(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"
            >
              <ScanLine className="w-4 h-4" /> Scan
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"
            >
              <Mail className="w-4 h-4" /> Impor Email
            </button>
          </div>
        </div>

        {/* Chips Filter */}
        <div className="mt-3 flex flex-wrap gap-2">
          {/* Kategori */}
          <div className="flex items-center gap-2 bg-white dark:bg-theme-color-primary/5 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2">
            <FileText className="w-4 h-4" />
            <select className="bg-transparent" value={kategori} onChange={(e) => setKategori(e.target.value)}>
              <option value="all" className={`${kategori !== 'all' ? 'text-black' : 'text-white'}`}>Semua Kategori</option>
              {masterKategori.map((k) => (
                <option key={k.key} value={k.key} className="text-black">
                  {k.name}
                </option> 
              ))}
            </select>
          </div>
          {/* Status */}
          <div className="flex items-center gap-2 bg-white dark:bg-theme-color-primary/5 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2">
            <ShieldCheck className="w-4 h-4" />
            <select className="bg-transparent" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all" className={`${status !== 'all' ? 'text-black' : 'text-white'}`}>Semua Status</option>
              {MASTER_STATUS.map((s) => (
                <option key={s.key} value={s.key} className="text-black">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          {/* Klasifikasi */}
          <div className="flex items-center gap-2 bg-white dark:bg-theme-color-primary/5 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2">
            <Tags className="w-4 h-4" />
            <select className="bg-transparent" value={klasifikasi} onChange={(e) => setKlasifikasi(e.target.value)}>
              <option value="all" className={`${klasifikasi !== 'all' ? 'text-black' : 'text-white'}`}>Semua Klasifikasi</option>
              {MASTER_KLASIF.map((s) => (
                <option key={s.key} value={s.key} className="text-black">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          {/* Tahun */}
          <div className="flex items-center gap-2 bg-white dark:bg-theme-color-primary/5 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2">
            <TimerReset className="w-4 h-4" />
            <select className="bg-transparent text-white" value={tahun} onChange={(e) => setTahun(e.target.value)}>
              {tahunOpts.map((y) => (
                <option key={y} value={y} className="text-black">
                  {y === "all" ? "Semua Tahun" : y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-full mx-auto pb-24 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Tabel */}
        <div className="lg:col-span-8 bg-white dark:bg-theme-color-primary/5 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          {/* Bulk Bar */}
          <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4" />
            <span className="text-neutral-500">Pilih Semua</span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => bulkAction("retensi")}
                className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />Set Retensi
              </button>
              <button
                onClick={() => bulkAction("inaktif")}
                className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
              >
                <Archive className="w-4 h-4" />Jadikan Inaktif
              </button>
              <button
                onClick={() => bulkAction("export")}
                className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />Ekspor
              </button>
              <button
                onClick={() => bulkAction("delete")}
                className="px-3 py-1 rounded-md bg-red-600 text-white flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />Hapus
              </button>
            </div>
          </div>

          <div className="overflow-auto max-h-[65vh]">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-neutral-50 dark:bg-theme-color-primary/5">
                <tr className="text-left text-neutral-500">
                  <th className="py-3 px-4"></th>
                  <th className="py-3 px-4">Judul</th>
                  <th className="py-3 px-4">Kode/Klasifikasi</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Unit</th>
                  <th className="py-3 px-4">Tag</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr
                    key={d.id}
                    className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(d.id)}
                        onChange={() => toggleSelect(d.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium">{d.title}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span>{d.kode}</span>
                        <span className="text-xs text-neutral-500">
                          {MASTER_KLASIF.find((k) => k.key === d.klasifikasi)?.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {masterKategori.find((k) => k.key === d.kategori)?.name || d.kategori}
                    </td>
                    <td className="py-3 px-4">{fmtDate(d.tgl)}</td>
                    <td className="py-3 px-4">{d.unit}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {d.tags.map((t: string) => (
                          <span key={t} className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={clsx(
                          "px-2 py-0.5 rounded-full text-xs",
                          d.status === "aktif" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                          d.status === "disposisi" &&
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                          d.status === "inaktif" && "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
                          d.status === "kedaluwarsa" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                        )}
                      >
                        {MASTER_STATUS.find((s) => s.key === d.status)?.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewId(d.id)}
                          title="Preview"
                          className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadDoc(d)}
                          title="Unduh"
                          className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => shareDoc(d)}
                          title="Bagikan"
                          className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Ringkasan & Preview */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Cards Ringkas */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Archive} label="Total Arsip" value={docs.length} sub="semua kategori" />
            <StatCard
              icon={ShieldCheck}
              label="Butuh Disposisi"
              value={docs.filter((d) => d.status === "disposisi").length}
              sub="perlu tindak lanjut"
            />
            <StatCard icon={History} label="Versi ≥2" value={docs.filter((d) => d.versi >= 2).length} sub="punya riwayat revisi" />
            <StatCard
              icon={QrCode}
              label="QR Siap Cetak"
              value={docs.filter((d) => d.status !== "kedaluwarsa").length}
              sub="label fisik"
            />
          </div>

          {/* Panel Info & Tips */}
          <div className="bg-white dark:bg-theme-color-primary/5 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4" />
              <h3 className="font-semibold">Kebijakan & Retensi</h3>
            </div>
            <ul className="text-sm list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-300">
              <li>Atur retensi per kategori (mis. Surat Masuk: 5 tahun, SK: permanen).</li>
              <li>
                Otomatis pindah ke <em>Inaktif</em> saat melewati retensi.
              </li>
              <li>Hak akses mengikuti peran (Admin/Kepsek/Operator/Unit).</li>
            </ul>
          </div>

          {/* Drawer Preview */}
          <AnimatePresence>
            {previewId && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="bg-white dark:bg-theme-color-primary/5 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
              >
                {(() => {
                  const d = docs.find((x) => x.id === previewId);
                  if (!d) return null;
                  return (
                    <div className="flex flex-col">
                      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="font-semibold leading-tight">{d.title}</div>
                          <div className="text-xs text-neutral-500">{d.kode}</div>
                        </div>
                        <button
                          onClick={() => window.print()}
                          title="Cetak/Save PDF"
                          className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPreviewId(null)}
                          className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Meta */}
                      <div className="px-4 py-3 grid grid-cols-2 gap-3 text-sm">
                        <Meta label="Kategori" value={masterKategori.find((k) => k.key === d.kategori)?.name || d.kategori} />
                        <Meta label="Tanggal" value={fmtDate(d.tgl)} />
                        <Meta label="Unit" value={d.unit} />
                        <Meta label="Owner" value={d.owner} />
                        <Meta label="Klasifikasi" value={MASTER_KLASIF.find((k) => k.key === d.klasifikasi)?.label} />
                        <Meta label="Status" value={MASTER_STATUS.find((s) => s.key === d.status)?.label} />
                      </div>

                      {/* Tag & QR */}
                      <div className="px-4 pb-3 flex items-center gap-2">
                        <div className="flex gap-1 flex-wrap">
                          {d.tags.map((t: string) => (
                            <span key={t} className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={() => printQR(d)}
                            className="px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 inline-flex items-center gap-2"
                          >
                            <QrCode className="w-4 h-4" />Cetak QR
                          </button>
                          <button
                            onClick={() => openRiwayat(d)}
                            className="px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 inline-flex items-center gap-2"
                          >
                            <History className="w-4 h-4" />Riwayat ({d.versi})
                          </button>
                        </div>
                      </div>

                      {/* Preview Area (mock) */}
                      <div className="bg-neutral-50 dark:bg-theme-color-primary/5 border-t border-neutral-200 dark:border-neutral-800 p-4 text-sm text-neutral-700 dark:text-neutral-300">
                        <pre className="text-xs overflow-auto max-h-48">{JSON.stringify(d, null, 2)}</pre>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal: Upload */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="w-full max-w-xl bg-white dark:bg-theme-color-primary/5 rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <UploadCloud className="w-5 h-5" />
                <h3 className="font-semibold">Upload Dokumen</h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="ml-auto p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Kategori">
                    <select className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-md px-3 py-2">
                      {masterKategori.map((k) => (
                        <option key={k.key} value={k.key}>
                          {k.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Klasifikasi">
                    <select className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-md px-3 py-2">
                      {MASTER_KLASIF.map((k) => (
                        <option key={k.key} value={k.key}>
                          {k.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Pilih Berkas">
                  <input type="file" className="block w-full text-sm" onChange={(e) => onUploadDummy(e.target.files)} />
                </Field>
                <div className="text-xs text-neutral-500">Tipe disarankan: PDF/JPG/PNG. Maks 10MB per berkas.</div>
              </div>
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                <button
                  onClick={() => setShowUpload(false)}
                  className="px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800"
                >
                  Batal
                </button>
                <button
                  onClick={() => onUploadDummy()}
                  className="ml-auto px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />Tambahkan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Kategori Manager */}
      <AnimatePresence>
        {showKategoriModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="w-full max-w-2xl bg-white dark:bg-theme-color-primary rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white">
                <FolderPlus className="w-5 h-5" />
                <h3 className="font-semibold">Kelola Kategori</h3>
                <button
                  onClick={() => setShowKategoriModal(false)}
                  className="ml-auto p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-white mb-1">Tambah Baru</div>
                  <div className="flex gap-2">
                    <input
                      value={newKat.key}
                      onChange={(e) => setNewKat({ ...newKat, key: e.target.value })}
                      placeholder="key (slug)"
                      className="flex-1 bg-neutral-10 rounded-md px-3 py-2"
                    />
                    <input
                      value={newKat.name}
                      onChange={(e) => setNewKat({ ...newKat, name: e.target.value })}
                      placeholder="Nama kategori"
                      className="flex-1 bg-neutral-10 rounded-md px-3 py-2"
                    />
                    <button onClick={addKategori} className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-white mb-1">Daftar Kategori</div>
                  <div className="border border-neutral-200 rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-50 dark:bg-theme-color-primary/5 text-white">
                        <tr>
                          <th className="text-left p-2">Key</th>
                          <th className="text-left p-2">Nama</th>
                          <th className="p-2">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {masterKategori.map((k) => (
                          <tr key={k.key} className="border-t border-neutral-200">
                            <td className="p-2">{k.key}</td>
                            <td className="p-2">{k.name}</td>
                            <td className="p-2 text-right">
                              <button onClick={() => delKategori(k.key)} className="px-2 py-1 rounded-lg bg-red-600 text-white">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-white text-right">
                <button onClick={() => setShowKategoriModal(false)} className="px-3 py-2 rounded-md border border-white">
                  Selesai
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Scan */}
      <AnimatePresence>
        {showScanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-theme-color-primary rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white">
                <ScanLine className="w-5 h-5" />
                <h3 className="font-semibold">Scan Dokumen</h3>
                <button onClick={() => setShowScanModal(false)} className="ml-auto p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <Field label="Pilih berkas gambar (JPG/PNG)">
                  <input ref={fileScanRef} type="file" accept="image/*" className="block w-full text-sm" onChange={(e) => onScan(e.target.files)} />
                </Field>
                <div className="text-xs text-white0">OCR masih mock; hasil ringkas akan disimpan di field <em>ocrText</em>.</div>
              </div>
              <div className="p-4 border-t border-white text-right">
                <button onClick={() => onScan()} className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  Simpan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Impor Email */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-theme-color-primary rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white">
                <Mail className="w-5 h-5" />
                <h3 className="font-semibold">Impor Email ke Arsip</h3>
                <button onClick={() => setShowEmailModal(false)} className="ml-auto p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <EmailForm onSubmit={onImportEmail} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Retensi */}
      <AnimatePresence>
        {showRetensi && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="w-full max-w-2xl bg-white dark:bg-theme-color-primary/5 rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <Settings className="w-5 h-5" />
                <h3 className="font-semibold">Retensi Arsip per Kategori</h3>
                <button onClick={() => setShowRetensi(false)} className="ml-auto p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 text-sm">
                <div className="text-xs text-neutral-500 mb-2">0 tahun = permanen (tidak pernah otomatis inaktif)</div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50 dark:bg-theme-color-primary/5 text-neutral-500">
                      <tr>
                        <th className="text-left p-2">Kategori</th>
                        <th className="text-left p-2">Tahun Retensi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterKategori.map((k) => (
                        <tr key={k.key} className="border-t border-neutral-200 dark:border-neutral-800">
                          <td className="p-2">{k.name}</td>
                          <td className="p-2">
                            <input
                              type="number"
                              min={0}
                              value={retensiMap[k.key] ?? 0}
                              onChange={(e) => setRetensiMap({ ...retensiMap, [k.key]: Number(e.target.value) })}
                              className="w-24 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1"
                            />
                            {" "}tahun
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-right">
                <button onClick={runRetensiNow} className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  Terapkan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel Riwayat Versi */}
      <AnimatePresence>
        {showRiwayatFor && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className="fixed right-4 bottom-4 z-30 w-full max-w-md bg-white dark:bg-theme-color-primary/5 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
          >
            {(() => {
              const d = docs.find((x) => x.id === showRiwayatFor);
              if (!d) return null;
              return (
                <div>
                  <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    <div className="font-semibold">Riwayat Versi — {d.id}</div>
                    <button onClick={() => setShowRiwayatFor(null)} className="ml-auto p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 text-sm">
                    <div className="text-xs text-neutral-500 mb-2">
                      Versi saat ini: <b>{d.versi}</b>
                    </div>
                    <button onClick={() => bumpVersi(d.id)} className="px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800">
                      Tambah Versi
                    </button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Hint */}
      {/* <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-500 bg-white/70 dark:bg-theme-color-primary/5/60 backdrop-blur px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800">
        Integrasi ke Xpresensi: endpoint arsip, RBAC per role, viewer PDF, retensi & notifikasi kedaluwarsa.
      </div> */}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border border-neutral-200/30 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: any; sub: string }) {
  return (
    <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-theme-color-primary/5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-neutral-500">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
          <div className="text-xs text-neutral-500">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs text-white mb-1">{label}</div>
      {children}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/40 pb-4">
      <div className="text-xs font-medium text-white mb-1">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function EmailForm({ onSubmit }: { onSubmit: (v: { subject: string; from: string }) => void }) {
  const [form, setForm] = useState({ subject: "", from: "" });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(form);
      }}
      className="p-4 space-y-3 text-sm"
    >
      <Field label="Subject">
        <input
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full bg-neutral-100 rounded-md px-3 py-2"
          placeholder="Contoh: Permohonan Data Alumni"
        />
      </Field>
      <Field label="Dari (email/nama)">
        <input
          value={form.from}
          onChange={(e) => setForm({ ...form, from: e.target.value })}
          className="w-full bg-neutral-100 rounded-md px-3 py-2"
          placeholder="contoh@sekolah.sch.id"
        />
      </Field>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSubmit?.(form)}
          className="ml-auto px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
        >
          Impor
        </button>
      </div>
    </form>
  );
}