import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from "framer-motion";
import { jsPDF } from "jspdf";
import debounce from 'lodash/debounce'; // Import debounce

import {
  CheckCircle2,
  ChevronDown,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  Palette,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  User,
  X
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const BASE_URL = "https://be-school.kiraproject.id/siswa";
// const BASE_URL = "http://localhost:5005/siswa";

// --- Interfaces ---
interface Student {
  id: number;
  name: string;
  nis: string;
  class: string;
  batch: any;
  nisn: string;
  gender: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  photoUrl: string;
  qrCodeData: string;
  statusKehadiran: "Hadir" | "Belum Hadir";
}

const CardDesignerModal = ({ open, onClose, config, setConfig, onGenerate, isProcessing }: any) => {
  if (!open) return null;

  // Generate list bg1.png sampai bg12.png
  const bgPresets = Array.from({ length: 12 }, (_, i) => `/bg${i + 1}.png`);

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100000]" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0B1220] border-l border-white/10 z-[100001] p-10 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Design Kartu</h2>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Sesuaikan tampilan kartu pelajar</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-500"><X/></button>
        </div>

        <div className="space-y-10">
          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center p-8 py-12 bg-white/5 rounded-3xl border border-white/10 relative">
            <div 
              className="w-[320px] h-[200px] rounded-xl shadow-2xl overflow-hidden relative bg-white border border-white/20"
              style={{ 
                backgroundImage: config.bgImage ? `url(${config.bgImage})` : 'none',
                backgroundSize: 'cover', 
                backgroundPosition: 'center'
              }}
            >
              {/* Header dengan Accent Color */}
              <div className="h-10 flex flex-col items-center shadow-none justify-center" style={{ backgroundColor: config.accentColor }}>
                <div 
                  className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: config.titleColor }} // Warna dinamis
                >
                  {config.title}
                </div>
                <div 
                  className="text-[6px] font-bold opacity-80 uppercase"
                  style={{ color: config.subtitleColor }} // Warna dinamis
                >
                  {config.subtitle}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4 flex gap-4 h-[calc(100%-40px)] relative">
                {/* Foto Siswa */}
                <div className="w-20 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                  <User size={40} className="text-slate-300"/>
                </div>

                {/* Informasi Teks */}
                <div className="flex-1 space-y-1.5 pt-1">
                  <div className="leading-tight">
                    <div className="text-[5px] text-zinc-400 font-bold uppercase tracking-tighter">Nama Lengkap</div>
                    <div className="text-[10px] font-black text-slate-800 uppercase truncate">NAMA SISWA LENGKAP</div>
                  </div>
                  <div className="leading-tight">
                    <div className="text-[5px] text-zinc-400 font-bold uppercase tracking-tighter">Nomor Induk</div>
                    <div className="text-[8px] font-bold text-slate-700">NIS: 123456789</div>
                    <div className="text-[7px] font-semibold text-slate-500">NISN: 00987654321</div>
                  </div>
                  <div className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[5px] font-black rounded-full uppercase">
                    Status: Aktif
                  </div>
                </div>

                {/* QR Code di Sudut Kanan Bawah */}
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-slate-200 flex items-center justify-center p-1 bg-white rounded-md shadow-sm">
                  <div className="text-[5px] font-bold text-slate-300">QR CODE</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Judul</label>
              <input 
                type="color" 
                value={config.titleColor} 
                onChange={e => setConfig({...config, titleColor: e.target.value})} 
                className="w-full h-14 bg-transparent border-none cursor-pointer" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Subtitle</label>
              <input 
                type="color" 
                value={config.subtitleColor} 
                onChange={e => setConfig({...config, subtitleColor: e.target.value})} 
                className="w-full h-14 bg-transparent border-none cursor-pointer" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Judul Kartu</label>
              <input value={config.title} onChange={e => setConfig({...config, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Warna Aksen</label>
              <input type="color" value={config.accentColor} onChange={e => setConfig({...config, accentColor: e.target.value})} className="w-full h-14 bg-transparent border-none cursor-pointer" />
            </div>
          </div>

          {/* BACKGROUND PRESETS */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Pilih Background Preset</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {bgPresets.map((bg, index) => (
                <button
                  key={index}
                  onClick={() => setConfig({ ...config, bgImage: bg })}
                  className={`aspect-video rounded-lg border-2 overflow-hidden transition-all ${config.bgImage === bg ? 'border-blue-500 scale-95' : 'border-white/10 hover:border-white/30'}`}
                >
                  <img src={bg} alt={`BG ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              
              {/* Custom Upload Button */}
              <label className="aspect-video rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all">
                <Upload size={16} className="text-zinc-500" />
                <input type="file" hidden accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onload = (re) => setConfig({...config, bgImage: re.target?.result as string});
                    reader.readAsDataURL(file);
                  }
                }} />
              </label>
            </div>
          </div>

          <button onClick={onGenerate} disabled={isProcessing} className="w-full py-5 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-white hover:bg-red-500 transition-all flex items-center justify-center gap-3">
            <Printer size={20}/> {isProcessing ? "Proses..." : "Cetak Kartu PDF"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const StudentModal = ({ open, onClose, title, initialData, onSubmit, schoolId, classList }: any) => {
  const [form, setForm] = useState({
    name: "", nis: "", nisn: "", nik: "", gender: "Laki-laki",
    birthPlace: "", birthDate: "", 
    class: "", batch: "", // <--- Tambahkan ini
    photo: null as File | null, preview: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData?.name || "",
        nis: initialData?.nis || "",
        nisn: initialData?.nisn || "",
        nik: initialData?.nik || "",
        gender: initialData?.gender || "Laki-laki",
        birthPlace: initialData?.birthPlace || "",
        birthDate: initialData?.birthDate || "",
        class: initialData?.class || "", // Pastikan ini sesuai dengan key dari backend
        batch: initialData?.batch || "",
        photo: null,
        preview: initialData?.photoUrl || "",
      });
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setSaving(true);
    try {
      if (!schoolId) throw new Error("ID Sekolah tidak ditemukan");
      
      const fd = new FormData();
      console.log("Data yang akan dikirim:", form);
      // Loop untuk memasukkan semua data form ke FormData
      Object.entries(form).forEach(([k, v]) => { 
        if(k !== 'preview' && k !== 'photo' && v) fd.append(k, v as string); 
      });
      
      fd.append("schoolId", schoolId.toString());
      if (form.photo) fd.append("photo", form.photo);

      await onSubmit(fd); 
      onClose();
    } catch (err: any) { 
      alert(err.message); 
    } finally { 
      setSaving(false); 
    }
  };

  if (!open) return null;

   return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100000]" onClick={onClose} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0B1220] border-l border-white/10 z-[100001] p-10 overflow-y-auto">
        <div className="border-b border-white/8 flex justify-between pb-8 mb-8 items-center bg-[#0B1220] z-10">
          <div>
            <h3 className="text-4xl font-black tracking-tighter text-white">
              {title}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Siswa pilihan sekolah ini
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-0">
          {/* Foto Section */}
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-2">Foto Profil Siswa</label>
             <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer overflow-hidden relative group hover:border-blue-500/50 transition-all">
                {form.preview ? <img src={form.preview} className="absolute inset-0 w-full h-full object-cover" /> : <div className="text-center text-zinc-600"><Upload className="mx-auto mb-2" size={32} /><span className="text-[10px] font-bold uppercase">Upload Pas Foto</span></div>}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) setForm(p => ({...p, photo: file, preview: URL.createObjectURL(file)}));
                }} />
             </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Nama Lengkap</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" required />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">
                  Pilih Kelas
                </label>
                <div className="relative group">
                  <select
                    name="class"
                    required
                    // GUNAKAN INI: hubungkan ke state form
                    value={form.class} 
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0B1220]">
                      -- Pilih Kelas --
                    </option>
                    {classList.map((c: any, index: number) => (
                      <option key={c.id || `class-${index}`} value={c.className} className="bg-[#0B1220]">
                        {c.className}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Angkatan (Batch)</label>
              <input value={form.batch} onChange={e => setForm({...form, batch: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" placeholder="2023/2024" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">NIS (No. Induk)</label>
              <input value={form.nis} maxLength={10} onChange={e => setForm({...form, nis: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">NISN</label>
              <input value={form.nisn} maxLength={10} onChange={e => setForm({...form, nisn: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">NIK (Sesuai KK)</label>
              <input value={form.nik} maxLength={16} onChange={e => setForm({...form, nik: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Jenis Kelamin</label>
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 appearance-none">
                <option value="Laki-laki" className="bg-[#0B1220]">Laki-laki</option>
                <option value="Perempuan" className="bg-[#0B1220]">Perempuan</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Tempat Lahir</label>
              <input value={form.birthPlace} onChange={e => setForm({...form, birthPlace: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Tanggal Lahir</label>
              <input type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/30">
            {saving ? "Menyimpan Data..." : "Simpan Data Siswa"}
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};














// ──────────────────────────────────────────────────────────────
export default function StudentManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modals, setModals] = useState<any>({ add: false, edit: false, designer: false });
  const [selected, setSelected] = useState<Student | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // Default 20 data per halaman
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // Tambahan untuk info total
  const [classList, setClassList] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const [cardConfig, setCardConfig] = useState<any>({
    title: "KARTU PELAJAR",
    subtitle: "SMK NEGERI PRO DIGITAL",
    accentColor: "#2563eb",
    titleColor: "#ffffff",    
    subtitleColor: "#ffffff", 
    bgImage: null
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // --- GANTI DENGAN LODASH DEBOUNCE ---
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearch(value);
      setPage(1); 
    }, 500),
    []
  );

  // Jalankan debounce saat input berubah
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); // Update UI input secara instan
    debouncedSetSearch(value); // Jalankan fungsi debounce untuk update API
  };

  // Pastikan untuk membatalkan debounce jika komponen di-unmount
  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  // GANTI DENGAN INI
  const { data: studentData, isLoading: loading, refetch, isFetching } = useQuery({
    queryKey: ['students', schoolId, page, limit, debouncedSearch],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}?schoolId=${schoolId}&page=${page}&limit=${limit}&name=${debouncedSearch}`
      );
      return res.json();
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // Data "Fresh" selama 5 menit (tidak akan hit API jika balik ke hal ini)
    gcTime: 10 * 60 * 1000,    // Data tetap di memori selama 10 menit
  });

  // Update state lokal (Hanya jika kamu masih butuh state terpisah untuk UI table)
  useEffect(() => {
    if (studentData) {
      setStudents(studentData.data || []);
      setTotalPages(studentData.pagination?.totalPages || 1);
      setTotalItems(studentData.pagination?.totalItems || 0);
    }
  }, [studentData]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!schoolId) return;
      try {
        const res = await fetch(`https://be-school.kiraproject.id/kelas?schoolId=${schoolId}`);
        const json = await res.json();
        if (json.success) setClassList(json.data);
      } catch (err) {
        console.error("Gagal mengambil daftar kelas:", err);
      }
    };

    if (open) { // Hanya fetch saat modal terbuka
      fetchClasses();
    }
  }, [open, schoolId]);

  const handleDownloadTemplate = () => {
    const templateData = [
      { Nama: "Ahmad Fauzi", Gender: "Laki-laki", NIK: "3201010101010001", NISN: "0012345678", NIS: "2425001", TempatLahir: "Jakarta", TanggalLahir: "2008-05-12", Kelas: "10-RPL-1", Angkatan: "2024" },
      { Nama: "Siti Aminah", Gender: "Perempuan", NIK: "3201010101010002", NISN: "0012345679", NIS: "2425002", TempatLahir: "Bandung", TanggalLahir: "2008-08-20", Kelas: "10-RPL-1", Angkatan: "2024" },
      { Nama: "Budi Santoso", Gender: "Laki-laki", NIK: "3201010101010003", NISN: "0012345680", NIS: "2425003", TempatLahir: "Surabaya", TanggalLahir: "2007-12-05", Kelas: "11-TKJ-2", Angkatan: "2023" },
      { Nama: "Dewa Made", Gender: "Laki-laki", NIK: "3201010101010004", NISN: "0012345681", NIS: "2425004", TempatLahir: "Denpasar", TanggalLahir: "2008-01-15", Kelas: "10-RPL-2", Angkatan: "2024" },
      { Nama: "Putri Lestari", Gender: "Perempuan", NIK: "3201010101010005", NISN: "0012345682", NIS: "2425005", TempatLahir: "Medan", TanggalLahir: "2009-03-10", Kelas: "10-RPL-1", Angkatan: "2024" },
      { Nama: "Rizky Ramadhan", Gender: "Laki-laki", NIK: "3201010101010006", NISN: "0012345683", NIS: "2425006", TempatLahir: "Makassar", TanggalLahir: "2008-09-25", Kelas: "11-TKJ-1", Angkatan: "2023" },
      { Nama: "Maya Indah", Gender: "Perempuan", NIK: "3201010101010007", NISN: "0012345684", NIS: "2425007", TempatLahir: "Yogyakarta", TanggalLahir: "2008-07-07", Kelas: "10-RPL-2", Angkatan: "2024" },
      { Nama: "Andi Wijaya", Gender: "Laki-laki", NIK: "3201010101010008", NISN: "0012345685", NIS: "2425008", TempatLahir: "Semarang", TanggalLahir: "2007-11-30", Kelas: "12-RPL-1", Angkatan: "2022" },
      { Nama: "Larasati", Gender: "Perempuan", NIK: "3201010101010009", NISN: "0012345686", NIS: "2425009", TempatLahir: "Malang", TanggalLahir: "2008-04-14", Kelas: "10-TKJ-1", Angkatan: "2024" },
      { Nama: "Farhan Hakim", Gender: "Laki-laki", NIK: "3201010101010100", NISN: "0012345687", NIS: "2425010", TempatLahir: "Palembang", TanggalLahir: "2008-02-28", Kelas: "11-RPL-1", Angkatan: "2023" }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Siswa");
    XLSX.writeFile(wb, "Template_Siswa.xlsx");
  };

const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !schoolId) return;
  setIsProcessing(true);

  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const dataBinary = evt.target?.result;
      const wb = XLSX.read(dataBinary, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data: any[] = XLSX.utils.sheet_to_json(ws, { raw: false, dateNF: "yyyy-mm-dd" });

      for (const row of data) {
        const fd = new FormData();
        fd.append("name", row["Nama"] || "");
        fd.append("gender", row["Gender"] || "");
        fd.append("nik", row["NIK"] ? row["NIK"].toString() : "");
        fd.append("nisn", row["NISN"] ? row["NISN"].toString() : "");
        fd.append("nis", row["NIS"] ? row["NIS"].toString() : "");
        fd.append("birthPlace", row["TempatLahir"] || "");
        fd.append("birthDate", row["TanggalLahir"] || "");
        fd.append("class", row["Kelas"] || "");     // <--- Kirim ke Backend
        fd.append("batch", row["Angkatan"] || "");  // <--- Kirim ke Backend
        fd.append("schoolId", schoolId.toString());

        await fetch(BASE_URL, { method: "POST", body: fd });
      }

      alert("Impor selesai");
      queryClient.invalidateQueries({ queryKey: ['students'] });
      // fetchStudents();
    } catch (e) {
      alert("Gagal impor data");
    } finally {
      setIsProcessing(false);
    }
  };
  reader.readAsBinaryString(file);
};

const handleMarkAbsence = async (student: Student, status: 'Izin' | 'Sakit' | 'Alpha') => {
  if (!window.confirm(`Tandai ${student.name} sebagai ${status} hari ini?`)) return;

  try {
    const res = await fetch(`${BASE_URL}/mark-absence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student.id,
        schoolId: schoolId,
        status: status,
        currentClass: student.class,
        userRole: 'student'
      })
    });

    if (res.ok) {
      alert(`Berhasil mencatat ${status}`);
      queryClient.invalidateQueries({ queryKey: ['students'] });
      // fetchStudents(); // Refresh data untuk update status di tabel
    }
  } catch (err) {
    alert("Gagal mencatat ketidakhadiran");
  }
};

const generatePDF = async () => {
  const doc = new jsPDF('p', 'mm', 'a4');
  setIsProcessing(true);

  const cardWidth = 86;
  const cardHeight = 54;
  const spacing = 6; // Jarak antar kartu (Horizontal & Vertikal)
  const marginLeft = 10;
  const marginTop = 10;

  try {
    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      const idxInPage = i % 8;
      const col = idxInPage % 2;
      const row = Math.floor(idxInPage / 2);

      if (i > 0 && idxInPage === 0) doc.addPage();

      const x = marginLeft + col * (cardWidth + spacing);
      const y = marginTop + row * (cardHeight + spacing);

      // 1. Background Dasar (Putih)
      doc.setFillColor(255, 255, 255);
      doc.rect(x, y, cardWidth, cardHeight, 'F');

      // 2. Background Custom dengan Pre-Crop Canvas (Object-fit: Cover)
      if (cardConfig.bgImage) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous"; // Hindari isu CORS
          img.src = cardConfig.bgImage;

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          // Proses Cropping di Canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Gunakan resolusi tinggi agar tidak pecah di PDF
          canvas.width = 860; 
          canvas.height = 540;

          const imgRatio = img.width / img.height;
          const canvasRatio = canvas.width / canvas.height;

          let sw, sh, sx, sy;

          // Hitung area crop (Center Crop)
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

          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
          
          // Masukkan ke PDF (Pasti pas, tidak akan meluber)
          const croppedImgData = canvas.toDataURL('image/jpeg', 0.9);
          doc.addImage(croppedImgData, 'JPEG', x, y, cardWidth, cardHeight);
          
        } catch (e) {
          console.warn("Gagal render background custom:", e);
        }
      }

      // 3. Header Accent
      doc.setFillColor(cardConfig.accentColor);
      doc.rect(x, y, cardWidth, 12, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(cardConfig.title, x + cardWidth / 2, y + 6, { align: 'center' });

      doc.setFontSize(6);
      doc.text(cardConfig.subtitle, x + cardWidth / 2, y + 10, { align: 'center' });

      // 4. Foto Siswa
      const photoX = x + 5;
      const photoY = y + 15; // Disesuaikan sedikit agar lebih rapi
      const photoW = 18;
      const photoH = 22;

      if (s.photoUrl) {
        try {
          doc.addImage(s.photoUrl, 'JPEG', photoX, photoY, photoW, photoH);
        } catch (e) {
          doc.setFillColor(240, 240, 240);
          doc.rect(photoX, photoY, photoW, photoH, 'F');
        }
      } else {
        doc.setFillColor(240, 240, 240);
        doc.rect(photoX, photoY, photoW, photoH, 'F');
      }

      // 5. Data Teks (NIS & NISN)
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(s.name.toUpperCase(), x + 27, y + 21, { maxWidth: 50 });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`NIS : ${s.nis}`, x + 27, y + 27);
      doc.text(`NISN: ${s.nisn || "-"}`, x + 27, y + 31);

      // 6. QR Code
      const qrData = s.qrCodeData;
      const qr = await QRCode.toDataURL(qrData, { margin: 1, width: 150 });
      doc.addImage(qr, 'PNG', x + 63, y + 33, 18, 18);

      // 7. Border kartu (tipis)
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.rect(x, y, cardWidth, cardHeight, 'D');
    }

    doc.save(`Kartu_Siswa_${new Date().toISOString().slice(0, 10)}.pdf`);
    setModals(p => ({ ...p, designer: false }));
  } catch (e) {
    console.error(e);
    alert("Gagal membuat PDF.");
  } finally {
    setIsProcessing(false);
  }
};

const handleDelete = async (id: number, name: string) => {
  // Konfirmasi ke user agar tidak tidak sengaja terhapus
  if (!window.confirm(`Apakah Anda yakin ingin menghapus siswa "${name}"?`)) return;

  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // Refresh data setelah berhasil hapus
      // fetchStudents();
      queryClient.invalidateQueries({ queryKey: ['students'] });
      alert("Siswa berhasil dihapus");
    } else {
      throw new Error("Gagal menghapus data di server");
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat menghapus data.");
  }
};

const statusStyles: Record<string, string> = {
  Hadir: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  Izin: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  Sakit: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  Alpha: "bg-red-500/10 text-red-500 border border-red-500/20",
  "Belum Hadir": "bg-zinc-500/10 text-zinc-500 border border-zinc-500/10",
};

const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-8 text-slate-100">
      {/* Header Utama */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase mb-2">
            <CheckCircle2 size={14} /> Database Online Active
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Data <span className="text-blue-600">Siswa</span></h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola kehadiran dan siswa</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={handleDownloadTemplate} className="h-14 px-5 bg-white/5 text-zinc-400 border border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-black uppercase text-[12px] tracking-widest">
            <Download size={16}/> Template
          </button>
          <label className="h-14 px-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all font-black uppercase text-[12px] tracking-widest">
            <FileSpreadsheet size={16}/> Import
            <input type="file" hidden accept=".xlsx, .xls" onChange={handleBulkUpload} />
          </label>
          <button onClick={() => setModals({ ...modals, designer: true })} className="h-14 px-6 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center gap-2 hover:bg-red-500/20 transition-all font-black uppercase text-[12px] tracking-widest">
            <Palette size={16}/> Cetak Kartu
          </button>
          <button onClick={() => setModals({ ...modals, add: true })} className="h-14 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[12px] tracking-widest shadow-xl shadow-blue-600/30">
            <Plus size={16}/> Tambah
          </button>
        </div>
      </div>

      <div className="mb-6 relative w-full flex gap-3 items-center justify-between">
        <div className="w-[80%]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama siswa..." 
            value={searchTerm}
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

      {/* Tabel dengan Status Kehadiran */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left">
          <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/5 bg-white/[0.03]">
            <tr>
              <th className="pl-6 p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Profil</th>
              <th className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Kelas</th>
              <th className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">NIS / NISN</th>
              <th className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Kehadiran</th>
              <th className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status</th>
              <th className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="px-2 py-20 text-center text-zinc-600 tracking-widest uppercase">Loading...</td></tr>
            ) : students.map(s => (
              <tr key={s.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="py-6 pl-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                      {s.photoUrl ? <img src={s.photoUrl} className="object-cover h-full w-full" /> : <div className="h-full w-full flex items-center justify-center"><User className="text-zinc-700"/></div>}
                    </div>
                    <div>
                      <div className="font-bold    text-white tracking-tight">{s.name}</div>
                      <div className="text-[9px] text-zinc-500 font-bold uppercase">{s.gender}</div>
                    </div>
                  </div>
                </td>
               <td className="py-6">
                  <div className="text-blue-400 w-full truncate font-mono text-sm">{s.class}</div>
                  <div className="text-[10px] text-zinc-500 font-medium tracking-tighter">ANGKATAN: {s.batch || "-"}</div>
                </td>
                <td className="py-6">
                   <div className="text-blue-400 w-full truncate font-mono text-sm">{s.nis}</div>
                   <div className="text-[10px] w-full truncate text-zinc-500 font-medium tracking-tighter">NISN: {s.nisn || "-"}</div>
                </td>
                <td className="py-6">
                   <span className={`px-4 py-1.5 w-max rounded-full text-[9px] font-black uppercase tracking-widest ${statusStyles[s.statusKehadiran] || statusStyles["Belum Hadir"]}`}>
                      {s.statusKehadiran || "Belum Hadir"}
                   </span>
                </td>
                <td className="py-6">
                  <div className="flex flex-col gap-3">
                    {/* Tombol Cepat Mark Absence jika belum hadir */}
                    <div className="flex gap-3 justify-start">
                      <button onClick={() => handleMarkAbsence(s, 'Izin')} className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-[10px] font-bold hover:bg-amber-500/20">IZIN</button>
                      <button onClick={() => handleMarkAbsence(s, 'Sakit')} className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[10px] font-bold hover:bg-blue-500/20">SAKIT</button>
                      <button onClick={() => handleMarkAbsence(s, 'Alpha')} className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-[10px] font-bold hover:bg-red-500/20">ALPHA</button>
                    </div>
                  </div>
                </td>
                <td className="py-6 text-left gap-2.5 flex">
                  <button 
                    onClick={() => navigate(`/detail/${s.id}?role=student`)} 
                    className="p-3 bg-white/5 hover:bg-white/20 hover:text-white rounded-xl transition-all"
                    title="Lihat Detail & Riwayat"
                  >
                    <Eye size={16}/>
                  </button>
                  <button onClick={() => { setSelected(s); setModals({...modals, edit: true}); }} className="p-3 bg-white/5 hover:bg-white/20 rounded-xl hover:text-white"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(s.id, s.name)} className="p-3 bg-white/5 hover:bg-white/20 rounded-xl hover:text-white"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination & Limit Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-6">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Tampilkan</span> */}
            <select 
              value={limit} 
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); // Reset ke hal 1 jika limit berubah
              }}
             className="bg-white/5 border border-white/10 w-max pr-7 pl-3 h-10 rounded-xl text-[10px] font-black text-white outline-none appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '14px'
              }}
            >
              <option className="text-black" value={10}>10 Baris</option>
              <option className="text-black" value={20}>20 Baris</option>
              <option className="text-black" value={50}>50 Baris</option>
              <option className="text-black" value={100}>100 Baris</option>
            </select>
          </div>
          <div className="h-4 w-px bg-white/10 mx-2 hidden md:block" />
          <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            Total: <span className="text-white">{totalItems}</span> Siswa
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-white/10 transition-all text-zinc-400"
          >
            Prev
          </button>
          
          <div className="flex gap-1">
            {/* Logic Angka Halaman Ringkas */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 3) pageNum = i + 1;
              else if (page === totalPages) pageNum = totalPages - 2 + i;
              else pageNum = Math.max(1, page - 1) + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${page === pageNum ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-white/10 transition-all text-zinc-400"
          >
            Next
          </button>
        </div>
      </div>

      {/* Side Modals */}
      <StudentModal 
        classList={classList || []} 
        open={modals.add || modals.edit} 
        onClose={() => { setModals({...modals, add:false, edit:false}); setSelected(null); }} 
        title={selected ? "Perbarui Siswa" : "Tambah Siswa"} 
        initialData={selected} 
        schoolId={schoolId} 
        onSubmit={async (fd: FormData) => { 
          const res = await fetch(selected ? `${BASE_URL}/${selected.id}` : BASE_URL, {
            method: selected ? 'PUT' : 'POST', 
            body: fd
          });

          if (res.ok) {
            // INI KUNCINYA: Memberitahu React Query bahwa data siswa sudah berubah
            queryClient.invalidateQueries({ queryKey: ['students'] });
            
            // Jika modal ingin langsung ditutup setelah sukses
            setModals({...modals, add: false, edit: false});
          }
        }} 
      />
      <CardDesignerModal open={modals.designer} onClose={() => setModals((p: any) => ({ ...p, designer: false }))} config={cardConfig} setConfig={setCardConfig} onGenerate={generatePDF} isProcessing={isProcessing} />
    </div>
  );
}