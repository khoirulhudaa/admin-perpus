import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import jsPDF from "jspdf";
import debounce from "lodash/debounce";
import {
  Briefcase,
  CheckSquare,
  Clock,
  Download, Edit,
  Eye, FileSpreadsheet, Mail, Palette,
  Plus,
  Printer,
  RefreshCw,
  Save, Search, Trash2,
  Upload,
  User,
  X
} from "lucide-react";
import QRCode from "qrcode";
import React, { useEffect, useMemo, useState } from "react";
import { FaMars, FaVenus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import * as XLSX from "xlsx";

// --- Types ---
interface GuruTendikItem {
  id?: number;
  nama: string;
  nip: string;
  mapel?: string;
  email?: string;
  role: string;
  jurusan?: string;
  jenisKelamin: string;
  photoUrl?: string;
  statusKehadiran?: string;
  scanTime?: string;
}

// const BASE_URL = "http://localhost:5005/guruTendik";
const BASE_URL = "https://be-school.kiraproject.id/guruTendik";

const ROLE_OPTIONS = [
  "Guru", "Wakil Kepala Sekolah", "Ka. Subag. Tata Usaha", "Bendahara Keuangan", 
  "Pengurus Barang", "S D M", "Laboran", "Staff Perpustakaan", "Penjaga Sekolah", 
  "Tenaga Kebersihan", "Komite Sekolah", "Wakasek. Bidang Kurikulum", 
  "Wakasek. Bidang Kesiswaan dan Humas", "Wakasek. Bidang Sarana dan Prasarana", 
  "Staf Kesiswaan dan Humas", "Staf Bidang Kurikulum", "Staf Sarana dan Prasana", 
  "Guru BK", "Pembina OSIS/Ekskul", "Dewan Guru", "Kepala Perpustakaan", 
  "Kepala Laboratorium", "Wali Kelas", "Kepala Sekolah", "Kepala Tata Usaha", "Administrasi"
];

const JENIS_KELAMIN_OPTIONS = ["Laki-laki", "Perempuan"];

// ────────────────────────────────────────────────
// Modal Cetak Kartu (sama konsep dengan siswa, tapi disesuaikan)
// ────────────────────────────────────────────────
const CardDesignerModal = ({
  open,
  onClose,
  config,
  setConfig,
  onGenerate,
  isProcessing,
}: {
  open: boolean;
  onClose: () => void;
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
  onGenerate: () => Promise<void>;
  isProcessing: boolean;
}) => {
  if (!open) return null;

  // Daftar background preset (sesuaikan path sesuai struktur project Anda)
  const bgPresets = Array.from({ length: 12 }, (_, i) => `/bg${i + 1}.png`);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 z-[10000] h-full w-full max-w-2xl bg-[#0B1220] border-l border-white/10 shadow-2xl flex flex-col p-10 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Design Kartu
            </h2>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
              Sesuaikan tampilan kartu guru & tendik
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-10 flex-1">
          {/* ─── LIVE PREVIEW ──────────────────────────────────────── */}
          <div className="flex flex-col items-center justify-center p-8 py-12 bg-white/5 rounded-3xl border border-white/10 relative">
            <div
              className="w-[320px] h-[200px] rounded-xl shadow-2xl overflow-hidden relative bg-white border border-white/20"
              style={{
                backgroundImage: config.bgImage ? `url(${config.bgImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Header Accent */}
              <div
                className="h-10 flex flex-col items-center justify-center shadow-sm"
                style={{ backgroundColor: config.accentColor }}
              >
                <div
                  className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: config.titleColor }}
                >
                  {config.title}
                </div>
                <div
                  className="text-[6px] font-bold opacity-80 uppercase"
                  style={{ color: config.subtitleColor }}
                >
                  {config.subtitle}
                </div>
              </div>

              {/* Konten Kartu */}
              <div className="p-4 flex gap-4 h-[calc(100%-40px)] relative">
                {/* Foto */}
                <div className="w-20 h-24 bg-slate-800/40 rounded-lg border border-slate-600/50 overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
                  <User size={36} className="text-slate-500" />
                </div>

                {/* Info Teks */}
                <div className="flex-1 space-y-1.5 pt-1 text-slate-900">
                  <div className="leading-tight">
                    <div className="text-[5px] font-bold text-slate-900 uppercase tracking-tighter">
                      Nama Lengkap
                    </div>
                    <div className="text-[10px] font-black text-slate-900 uppercase truncate">
                      BUDI SANTOSO, S.Pd
                    </div>
                  </div>

                  <div className="leading-tight">
                    <div className="text-[5px] text-slate-900 font-bold uppercase tracking-tighter">
                      Jabatan
                    </div>
                    <div className="text-[9px] text-slate-900 font-bold">Wakasek Kurikulum</div>
                  </div>

                  <div className="leading-tight">
                    <div className="text-[5px] text-slate-900 font-bold uppercase tracking-tighter">
                      Email
                    </div>
                    <div className="text-[8px] text-slate-900 font-medium opacity-90">
                      budi.santoso@smkcontoh.sch.id
                    </div>
                  </div>

                  {/* QR placeholder */}
                  <div className="absolute bottom-4 right-4 w-14 h-14 bg-white/90 rounded-md shadow-md flex items-center justify-center border border-slate-300 p-1">
                    <div className="text-[5px] font-bold text-slate-900 text-center leading-tight">
                      QR CODE
                      <br />
                      ID Pegawai
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── KONTROL CUSTOMISASI ──────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
                Warna Judul
              </label>
              <input
                type="color"
                value={config.titleColor}
                onChange={(e) => setConfig({ ...config, titleColor: e.target.value })}
                className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
                Warna Subjudul
              </label>
              <input
                type="color"
                value={config.subtitleColor}
                onChange={(e) => setConfig({ ...config, subtitleColor: e.target.value })}
                className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
                Warna Aksen
              </label>
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1">
                Judul Kartu
              </label>
              <input
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                placeholder="KARTU PEGAWAI"
              />
            </div>
          </div>

          {/* Background Presets */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider ml-1 block">
              Background Preset
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
              {bgPresets.map((bg, idx) => (
                <button
                  key={idx}
                  onClick={() => setConfig({ ...config, bgImage: bg })}
                  className={`aspect-video rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                    config.bgImage === bg
                      ? "border-blue-500 scale-95 shadow-lg shadow-blue-500/30"
                      : "border-white/10 hover:border-white/30 hover:scale-105"
                  }`}
                >
                  <img src={bg} alt={`bg-${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}

              {/* Upload custom background */}
              <label className="aspect-video rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all">
                <Upload size={20} className="text-zinc-500 mb-1" />
                {/* <span className="text-[9px] text-zinc-500 font-medium">Custom</span> */}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setConfig({ ...config, bgImage: ev.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Tombol Generate PDF */}
          <button
            onClick={onGenerate}
            disabled={isProcessing}
            className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl disabled:opacity-60 transition-all mt-8"
          >
            <Printer size={20} />
            {isProcessing ? "Membuat PDF..." : "Cetak Kartu PDF"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const GuruTendikModal = ({
  open,
  onClose,
  initialData,
  onSave,
  isNew,
}: {
  open: boolean;
  onClose: () => void;
  initialData: any;
  onSave: (form: Partial<GuruTendikItem>, file?: File) => Promise<void>;
  isNew: boolean;
}) => {
  const [form, setForm] = useState<GuruTendikItem>({
    nama: "",
    role: ROLE_OPTIONS[0],
    jenisKelamin: JENIS_KELAMIN_OPTIONS[0],
    mapel: "",
    jurusan: "",
    email: "",
    nip: "",
    photoUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        nama: initialData.nama || "",
        role: initialData.role || ROLE_OPTIONS[0],
        jenisKelamin: initialData.jenisKelamin || JENIS_KELAMIN_OPTIONS[0],
        mapel: initialData.mapel || "",
        jurusan: initialData.jurusan || "",
        email: initialData.email || "",
        nip: initialData.nip || "",
        photoUrl: initialData.photoUrl || "",
      });
      setPreview(initialData.photoUrl || "");
      setSelectedFile(null);
    }
  }, [open, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form, selectedFile || undefined);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  // ... (sama persis seperti kode asli Anda, hanya ditampilkan sebagian agar ringkas)
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[10000] h-full w-full overflow-y-auto max-w-lg bg-[#0B1220] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header modal */}
             <div className="p-8 border-b border-white/8 flex justify-between items-center bg-[#0B1220] z-10">
              <div>
                <h3 className="text-4xl font-black tracking-tighter text-white">
                  {isNew ? "Tambah Guru" : "Perbarui Guru"}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
                  Guru & Tenaga Kependidikan
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

           <form onSubmit={handleSubmit} className="flex-1 p-8 space-y-8">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-2 border-dashed border-white/20 group-hover:border-blue-500 transition-all flex items-center justify-center bg-white/5">
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <User size={48} className="text-white/10" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-blue-500 shadow-xl border-4 border-[#0B1220] transition-transform hover:scale-110">
                    <Plus size={20} className="text-white" />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Personal Avatar</p>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Nama Lengkap</label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Contoh: Dr. Budi Santoso"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Jabatan</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0B1220]">{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Gender</label>
                    <select
                      value={form.jenisKelamin}
                      onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                      {JENIS_KELAMIN_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0B1220]">{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center justify-between">
                    <span>NIP</span>
                    <span className="text-red-400/70 text-[9px] font-normal normal-case">
                      maks. 18 digit • boleh kosong
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    value={form.nip || ""}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      setForm({ ...form, nip: val });
                    }}
                    placeholder="Contoh: 196712311234567890"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white 
                              focus:border-blue-500 outline-none transition-all placeholder:text-white/10 
                              font-mono tracking-wide"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Email Address</label>
                  <input
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@sekolah.sch.id"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mapel</label>
                    <input
                      type="text"
                      value={form.mapel || ""}
                      onChange={(e) => setForm({ ...form, mapel: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Jurusan</label>
                    <input
                      type="text"
                      value={form.jurusan || ""}
                      onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-white/10 flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-sm uppercase tracking-widest text-white/30 hover:text-white transition-all">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-[2] py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? "Processing..." : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


// ────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────
export default function TeacherManager() {
  // const [data, setData] = useState<GuruTendikItem[]>([]);
  // const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GuruTendikItem | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardDesigner, setShowCardDesigner] = useState(false);
  const queryClient = useQueryClient();

  // ─── State untuk custom card ───────────────────────────────
  const [cardConfig, setCardConfig] = useState({
    title: "KARTU PEGAWAI",
    subtitle: "YAYASAN PENDIDIKAN XYZ",
    accentColor: "#2563eb",   // biru default
    titleColor: "#ffffff",
    subtitleColor: "#e5e7eb",
    bgImage: null as string | null,
  });

  const school = useSchool();
  const SCHOOL_ID = school?.data?.[0]?.id;

  // ─── REACT QUERY: Fetch Data ───────────────────────────────
  const { 
    data: teacherData = [], 
    isLoading: loading, 
    refetch, 
    isFetching 
  } = useQuery({
    queryKey: ['teachers', SCHOOL_ID],
    queryFn: async () => {
      if (!SCHOOL_ID) return [];
      const res = await fetch(`${BASE_URL}/absensi?schoolId=${SCHOOL_ID}&limit=100`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data || [];
    },
    enabled: !!SCHOOL_ID,
    staleTime: 5 * 60 * 1000, // Data fresh selama 5 menit
  });

  // --- LOGIKA DEBOUNCE ---
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  console.log('teacher data', teacherData)

  // Handler saat input diketik
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value); // Update text di input secara instan
    debouncedSetSearch(value); // Jalankan filter setelah jeda 500ms
  };

  // Cleanup saat komponen unmount
  useEffect(() => {
    return () => debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  const handleSave = async (form: Partial<GuruTendikItem>, file?: File) => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value.toString());
    });
    if (SCHOOL_ID) formData.append("schoolId", SCHOOL_ID.toString());
    if (file) formData.append("photo", file);

    const url = selectedItem?.id ? `${BASE_URL}/${selectedItem.id}` : BASE_URL;
    const method = selectedItem?.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || "Gagal menyimpan");

    toast.success("Data berhasil disimpan");
    queryClient.invalidateQueries({ queryKey: ['teachers'] });
    // fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data guru/tendik ini?")) return;
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (res.ok) {
        toast.success("Data dihapus");
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        // fetchData();
      }
    } catch (err) {
      toast.error("Gagal menghapus data");
    }
  };

  // ─── Download Template Excel ───────────────────────────────
  const handleDownloadTemplate = () => {
    const template = [
      {
        Nama: "Dr. Budi Santoso",
        Jabatan: "Kepala Sekolah",
        Gender: "Laki-laki",
        Email: "kepsek@smkn1contoh.sch.id",
        Mapel: "-",
        NIP: "123456789123456789",
        Jurusan: "-",
      },
      {
        Nama: "Dra. Siti Aminah",
        Jabatan: "Guru",
        Gender: "Perempuan",
        Email: "siti.aminah@smkn1contoh.sch.id",
        Mapel: "Matematika",
        NIP: "123456789123456789",
        Jurusan: "IPA",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "GuruTendik");
    XLSX.writeFile(wb, "Template_Guru_Tendik.xlsx");
  };

  // ─── Import Excel (Bulk Create) ─────────────────────────────
  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !SCHOOL_ID) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(ws, { raw: false });

        for (const row of rows) {
          const formData = new FormData();
          formData.append("nama", row["Nama"] || "");
          formData.append("role", row["Jabatan"] || "");
          formData.append("jenisKelamin", row["Gender"] || "");
          formData.append("email", row["Email"] || "");
          formData.append("mapel", row["Mapel"] || "");
          formData.append("nip", row["NIP"] || "");
          formData.append("jurusan", row["Jurusan"] || "");
          formData.append("schoolId", SCHOOL_ID.toString());

          await fetch(BASE_URL, {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
            body: formData,
          });
        }

        toast.success("Import selesai");
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        // fetchData();
      } catch (err) {
        toast.error("Gagal import data");
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleMarkAbsence = async (teacher: any, status: 'Izin' | 'Sakit' | 'Alpha') => {
    if (!confirm(`Tandai ${teacher.nama} sebagai ${status} hari ini?`)) return;

    try {
      const res = await fetch(`${BASE_URL}/mark-absence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guruId: teacher.id,
          schoolId: SCHOOL_ID,
          status: status,
          userRole: 'teacher' // Memberitahu backend bahwa ini adalah Guru/Pegawai
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(`Berhasil mencatat ${status} untuk ${teacher.nama}`);
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
      } else {
        throw new Error(json.message || "Gagal mencatat");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mencatat ketidakhadiran");
    }
  };

  const generateTeacherCardsPDF = async () => {
    setIsProcessing(true);
    const doc = new jsPDF("p", "mm", "a4");

    const cardWidth = 86;   
    const cardHeight = 54;  

    // Tambahkan margin halaman agar tidak terlalu mepet ke pinggir kertas
    const marginLeft = 12; 
    const marginTop = 15;
    const spacing = 8; // Jarak antar kartu (horizontal & vertikal)

    try {
      for (let i = 0; i < teacherData.length; i++) {
        const t = teacherData[i];
        const idx = i % 8;
        const col = idx % 2;
        const row = Math.floor(idx / 2);

        // Kalkulasi koordinat dengan spacing yang lebih besar
        const x = marginLeft + col * (cardWidth + spacing);
        const y = marginTop + row * (cardHeight + spacing);

        if (i > 0 && idx === 0) doc.addPage();

        
        // Background custom
        doc.setFillColor(15, 23, 42);           // ≈ slate-950 / sangat gelap
        doc.rect(x, y, cardWidth, cardHeight, "F");  // background kartu
        // doc.rect(x, y, 90, 50, "F");
      if (cardConfig.bgImage) {
        try {
          const img = new Image();
          img.src = cardConfig.bgImage;
          await new Promise((resolve) => { img.onload = resolve; });

          // 1. Buat canvas tersembunyi untuk cropping
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Tentukan resolusi output (gunakan rasio kartu 86:54)
          canvas.width = 860; 
          canvas.height = 540;

          const imgRatio = img.width / img.height;
          const canvasRatio = canvas.width / canvas.height;

          let sw, sh, sx, sy;

          // 2. Logika "Object-fit: Cover" manual
          if (imgRatio > canvasRatio) {
            sh = img.height;
            sw = sh * canvasRatio;
            sx = (img.width - sw) / 2;
            sy = 0;
          } else {
            sw = img.width;
            sh = sw / canvasRatio;
            sx = 0;
            sy = (img.height - sh) / 2;
          }

          // 3. Gambar ke canvas (Otomatis terpotong di sini)
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

          // 4. Masukkan hasil canvas ke PDF (Pasti pas dengan ukuran kartu)
          const croppedImgData = canvas.toDataURL('image/jpeg', 0.9);
          doc.addImage(croppedImgData, 'JPEG', x, y, cardWidth, cardHeight);

        } catch (e) {
          console.warn("Gagal render background", e);
        }
      }

        // Header accent
        doc.setFillColor(cardConfig.accentColor);
        doc.rect(x, y, cardWidth, 12, "F");  // tanpa radius seperti request sebelumnya

        doc.setTextColor(cardConfig.titleColor);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(cardConfig.title, x + 45, y + 6, { align: "center" });

        doc.setTextColor(cardConfig.subtitleColor);
        doc.setFontSize(6);
        doc.text(cardConfig.subtitle, x + 45, y + 10, { align: "center" });

        // Foto
        if (t.photoUrl) {
          try {
            doc.addImage(t.photoUrl, "JPEG", x + 5, y + 15, 18, 22);
          } catch {
            doc.setFillColor(30, 41, 59);
            doc.rect(x + 5, y + 15, 18, 22, "F");
          }
        } else {
          doc.setFillColor(30, 41, 59);
          doc.rect(x + 5, y + 15, 18, 22, "F");
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(7);
          doc.text("FOTO", x + 9, y + 26);
        }
        
        // Nama & Jabatan
        doc.setTextColor("#0f172a");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(t.nama.toUpperCase(), x + 27, y + 20, { maxWidth: 55 });

        doc.setFontSize(8);
        doc.setTextColor("#0f172a");
        doc.text(t.role, x + 27, y + 25, { maxWidth: 55 });

        // jenis kelamin
        if (t.jenisKelamin) {
          doc.setFontSize(7);
          doc.setTextColor("#0f172a");
          doc.text(t.jenisKelamin, x + 27, y + 28, { maxWidth: 55 });
        }

        // QR Code
        const qrValue = t.qrCodeData;
        const qrDataUrl = await QRCode.toDataURL(qrValue, { margin: 1, width: 180 });
        doc.addImage(qrDataUrl, "PNG", x + 65, y + 33, 18, 18);
      }

      doc.save(`Kartu_Guru_Tendik_${new Date().toISOString().slice(0, 10)}.pdf`);
      setShowCardDesigner(false);
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat file PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  // Gunakan debouncedSearch sebagai parameter filter, bukan search
    const filtered = teacherData.filter(
      (item: any) =>
        item.nama.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.role.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const getStatusStyle = (status: string | undefined) => {
      const s = status?.toLowerCase();
      if (s === "hadir") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      if (s === "sakit") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      if (s === "izin") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      if (s === "alpha") return "bg-red-500/10 text-red-400 border-red-500/20";
      
      // Default untuk "Belum Hadir"
      return "bg-zinc-500/10 text-zinc-500 border-zinc-500/10";
    };

    const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-10">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3 font-black text-blue-500 uppercase tracking-[0.4em] text-[10px]">
            <Briefcase size={14} /> Personnel Directory
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">
            Guru <span className="text-blue-700">& Tendik</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Manajemen kehadiran & profil pegawai</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="h-14 px-5 bg-white/5 text-zinc-400 border border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-black uppercase text-[12px] tracking-widest"
            disabled={isProcessing}
          >
            <Download size={16} /> Template
          </button>

          <label className="h-14 px-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all font-black uppercase text-[12px] tracking-widest">
            <FileSpreadsheet size={16} /> Import
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleBulkImport}
              disabled={isProcessing}
            />
          </label>

          <button
            onClick={() => setShowCardDesigner(true)}
            className="h-14 px-6 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center gap-2 hover:bg-red-500/20 transition-all font-black uppercase text-[12px] tracking-widest"
          >
            <Palette size={16} /> Cetak Kartu
          </button>

           <button 
            onClick={() => {
              setSelectedItem(null);
              setModalOpen(true);
            }}
            className="h-14 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-blue-600/30">
            <Plus size={16}/> Tambah
          </button>

        </div>
      </div>
        <div className="relative flex-1 w-full mb-6 group flex items-center gap-3 justify-between">
          <div className="w-[80%]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Cari nama atau role"
              value={search}
              onChange={handleSearchChange}
              className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all text-white"
            />
          </div>
          
          <button 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="flex-1 h-14 px-5 justify-center bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center gap-2 hover:bg-amber-500/30 transition-all font-black uppercase text-[12px] tracking-widest disabled:opacity-50"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Syncing..." : "Refresh"}
          </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest">Accessing Records...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-40 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
          <p className="text-white/20 text-lg font-medium">No personnel records found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-6 transition-all duration-500"
            >
              {/* ... isi kartu sama persis seperti kode asli ... */}
              <div className="flex items-start gap-6">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <div className="h-full w-full rounded-3xl overflow-hidden bg-black/40 border border-white/10 transition-all duration-700">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt={item.nama} className="h-full w-full object-cover transition-transform duration-700" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white/5"><User size={32} /></div>
                    )}
                  </div>
                  <div className={`absolute -bottom-2 -right-2 ${item.jenisKelamin === "Laki-laki" ? 'bg-blue-600' : 'bg-pink-700'} text-[8px] font-black text-white px-2 py-2 flex justify-center items-center w-[30px] h-[30px] rounded-md uppercase shadow-lg`}>
                    {item.jenisKelamin === "Laki-laki" ? <FaMars size={18} /> : <FaVenus size={18} />}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 truncate">{item.role}</div>
                  <h3 className="text-lg uppercase font-bold text-white truncate leading-tight transition-colors">{item.nama}</h3>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[12px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-tighter ${getStatusStyle(item.statusKehadiran)}`}>
                      {item.statusKehadiran || 'Belum Hadir'}
                    </span>
                    {item.scanTime && (
                      <span className="text-[12px] text-white font-mono flex items-center gap-1">
                        <Clock size={10} /> {item.scanTime}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-white/30 group-hover:text-white/60 transition-colors">
                    <Mail size={12} />
                    <span className="text-xs truncate">{item.email || "no-email@id"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-2xl">
                  <div className="text-[12px] font-black text-white uppercase tracking-widest mb-1">Mata pelajaran</div>
                  <div className="text-[11px] text-white/70 font-bold truncate uppercase tracking-tighter">
                    {item.mapel || "General"}
                  </div>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl">
                  <div className="text-[12px] font-black text-white uppercase tracking-widest mb-1">No. Induk Pegawai</div>
                  <div className="text-[11.5px] text-white/70 font-bold truncate uppercase tracking-tighter">
                    {item.nip || "-"}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {['Izin', 'Sakit', 'Alpha', 'Hadir'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleMarkAbsence(item, st as any)}
                    className={`flex-1 ${item.statusKehadiran === st ? 'border border-slate-500/70' : 'border border-transparent'} flex items-center gap-3 justify-center py-2 rounded-lg text-[9px] font-black hover:brightness-90 uppercase tracking-tighter transition-all border ${getStatusStyle(st)}`}
                  >
                    <CheckSquare size={13} />
                    {st}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => { setSelectedItem(item); setModalOpen(true); }}
                  className="flex-1 py-4 hover:bg-blue-700/40 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center gap-2 transition-all group/btn"
                >
                  <Edit size={16} className="group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Perbarui</span>
                </button>
                <button
                  onClick={() => navigate(`/detail/${item.id}?role=teacher`)}
                  className="w-14 py-4 hover:bg-white/20 bg-white/5 text-white border border-white/10 hover:text-white rounded-2xl flex items-center justify-center transition-all"
                  title="Lihat Riwayat 1 Tahun"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id!)}
                  className="w-14 py-4 hover:bg-red-700/40 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <GuruTendikModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        initialData={selectedItem || {}}
        onSave={handleSave}
        isNew={!selectedItem}
      />

      {/* Modal Custom Card + Live Preview */}
      <CardDesignerModal
        open={showCardDesigner}
        onClose={() => setShowCardDesigner(false)}
        config={cardConfig}
        setConfig={setCardConfig}
        onGenerate={generateTeacherCardsPDF}
        isProcessing={isProcessing}
      />
    </div>
  );
}