import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Check,
  CheckSquare,
  Copy,
  FileSpreadsheet,
  ImageIcon,
  LayoutGrid, List,
  Plus,
  Printer, RefreshCw, Save, Search,
  Square,
  Ticket,
  Trash,
  Trash2,
  Vote,
  X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts';
import * as XLSX from "xlsx";

// --- CONFIG ---
const BASE_URL = "https://be-school.kiraproject.id/voting";
const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// --- INTERFACES ---
interface Candidate {
  id?: number;
  chairmanName: string;
  chairmanNik: string;
  chairmanClass: string;
  chairmanMajor: string;
  chairmanBatch: string;
  chairmanImageUrl?: string;

  viceChairmanName: string;
  viceChairmanNik: string;
  viceChairmanClass: string;
  viceChairmanMajor: string;
  viceChairmanBatch: string;
  viceChairmanImageUrl?: string;

  vision: string;
  mission: string[];          
  motto: string;
  votes: number;
}

interface VoteCode { id: number; code: string; isActive: boolean; createdAt: string; }
interface AlertState { message: string; type: "success" | "error"; visible: boolean; }

// --- COMPONENTS ---
const Alert = ({ alert, onClose }: { alert: AlertState; onClose: () => void }) => {
  if (!alert.visible) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className={`fixed bottom-5 right-5 z-[9999] p-3 rounded-xl border shadow-2xl ${
        alert.type === "success" ? "bg-green-900/90 border-green-500/50 text-green-200" : "bg-red-900/90 border-red-500/50 text-red-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <p className="text-sm">{alert.message}</p>
        <button onClick={onClose} className="hover:text-white font-bold"><X size={18.5} /></button>
      </div>
    </motion.div>
  );
};

const CandidateModal = ({ 
  open, 
  onClose, 
  initialData, 
  onSubmit 
}: {
  open: boolean;
  onClose: () => void;
  initialData: Candidate | null;
  onSubmit: (formData: FormData) => Promise<void>;
}) => {
  const [form, setForm] = useState({
    chairmanName: "", chairmanNik: "", chairmanClass: "", chairmanMajor: "", chairmanBatch: "",
    viceChairmanName: "", viceChairmanNik: "", viceChairmanClass: "", viceChairmanMajor: "", viceChairmanBatch: "",
    vision: "",
    motto: ""
  });

  // Mission sekarang array string
  const [missions, setMissions] = useState<string[]>([""]); // minimal 1 input kosong

  const [chairFile, setChairFile] = useState<File | null>(null);
  const [viceFile, setViceFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  
  const [chairPreview, setChairPreview] = useState<string | null>(null);
  const [vicePreview, setVicePreview] = useState<string | null>(null);

  // Preview untuk edit (jika initialData punya URL foto existing)
  useEffect(() => {
    if (initialData?.chairmanPhotoUrl) {
      setChairPreview(initialData.chairmanPhotoUrl); // sesuaikan nama field jika beda
    }
    if (initialData?.viceChairmanPhotoUrl) {
      setVicePreview(initialData.viceChairmanPhotoUrl);
    }
  }, [initialData]);

  // Handle preview saat file dipilih
  useEffect(() => {
    if (chairFile) {
      const url = URL.createObjectURL(chairFile);
      setChairPreview(url);
      return () => URL.revokeObjectURL(url); // cleanup
    }
  }, [chairFile]);

  useEffect(() => {
    if (viceFile) {
      const url = URL.createObjectURL(viceFile);
      setVicePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [viceFile]);

  // Ref untuk fokus ke input terakhir saat tambah
  const missionInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open && initialData) {
      setForm({
        chairmanName: initialData.chairmanName || "",
        chairmanNik: initialData.chairmanNik || "",
        chairmanClass: initialData.chairmanClass || "",
        chairmanMajor: initialData.chairmanMajor || "",
        chairmanBatch: initialData.chairmanBatch || "",
        viceChairmanName: initialData.viceChairmanName || "",
        viceChairmanNik: initialData.viceChairmanNik || "",
        viceChairmanClass: initialData.viceChairmanClass || "",
        viceChairmanMajor: initialData.viceChairmanMajor || "",
        viceChairmanBatch: initialData.viceChairmanBatch || "",
        vision: initialData.vision || "",
        motto: initialData.motto || ""
      });

      // Logika parsing mission untuk form edit
      let missionData: string[] = [""];
      if (initialData.mission) {
        if (Array.isArray(initialData.mission)) {
          missionData = initialData.mission;
        } else if (typeof initialData.mission === 'string') {
          try {
            missionData = JSON.parse(initialData.mission);
          } catch {
            missionData = [""];
          }
        }
      }
      
      setMissions(missionData.length > 0 ? missionData : [""]);
    } else {
      // Reset untuk tambah kandidat baru
      setForm({
        chairmanName: "", chairmanNik: "", chairmanClass: "", chairmanMajor: "", chairmanBatch: "",
        viceChairmanName: "", viceChairmanNik: "", viceChairmanClass: "", viceChairmanMajor: "", viceChairmanBatch: "",
        vision: "", motto: ""
      });
      setMissions([""]);
    }
    setChairFile(null);
    setViceFile(null);
  }, [open, initialData]);

  // Fungsi tambah misi baru
  const addMission = () => {
    setMissions(prev => [...prev, ""]);
    // Fokus ke input terakhir setelah render
    setTimeout(() => {
      const lastIndex = missions.length;
      if (missionInputRefs.current[lastIndex]) {
        missionInputRefs.current[lastIndex]?.focus();
      }
    }, 100);
  };

  // Hapus misi di index tertentu (minimal tetap 1)
  const removeMission = (index: number) => {
    if (missions.length === 1) return; // jangan hapus jika hanya 1
    setMissions(prev => prev.filter((_, i) => i !== index));
  };

  // Update misi di index tertentu
  const updateMission = (index: number, value: string) => {
    setMissions(prev => {
      const newMissions = [...prev];
      newMissions[index] = value;
      return newMissions;
    });
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi misi
    const cleanedMissions = missions
      .map(m => m.trim())
      .filter(m => m.length > 0);

    if (cleanedMissions.length === 0) {
      alert("Minimal satu misi harus diisi!");
      return;
    }

    setLoading(true); // <--- Set loading true saat mulai

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      formData.append("mission", JSON.stringify(cleanedMissions));

      if (chairFile) formData.append("chairmanImg", chairFile);
      if (viceFile) formData.append("viceChairmanImg", viceFile);

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error saving candidate:", error);
      alert("Gagal menyimpan data.");
    } finally {
      setLoading(false); // <--- Set loading false setelah selesai (berhasil/gagal)
    }
  };

  if (!open) return null;

  const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
      {label}
    </span>
  );
  const ISave = () => <Icon label="💾" />;

 return (
  <>
    {/* Backdrop clickable untuk close */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999]"
      onClick={onClose}
    />

    {/* Panel slide dari kanan */}
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 220 }}
      className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0B1220] border-l border-white/10 shadow-2xl overflow-y-auto z-[100000] flex flex-col"
    >
      {/* Header sticky */}
      <div className="p-10 border-b border-white/8 flex justify-between items-center bg-[#0B1220] z-10">
        <div>
          <h3 className="text-4xl font-black tracking-tighter text-white">
            {initialData ? "Edit" : "Tambah"}{" "}
            <span className="text-blue-600">Kandidat</span>
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
            Pasangan Calon Ketua & Wakil Ketua
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleAction} className="p-10 space-y-10 flex-1">
        {/* Identitas Ketua */}
        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
            Identitas Ketua *
          </label>

          <div className="space-y-4">
            <input
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Nama Lengkap Ketua"
              value={form.chairmanName}
              onChange={e => setForm({ ...form, chairmanName: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                placeholder="NISN/NIK"
                value={form.chairmanNik}
                onChange={e => setForm({ ...form, chairmanNik: e.target.value })}
                required
              />
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Angkatan"
                value={form.chairmanBatch}
                onChange={e => setForm({ ...form, chairmanBatch: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Kelas"
                value={form.chairmanClass}
                onChange={e => setForm({ ...form, chairmanClass: e.target.value })}
                required
              />
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Jurusan"
                value={form.chairmanMajor}
                onChange={e => setForm({ ...form, chairmanMajor: e.target.value })}
                required
              />
            </div>

            {/* Upload Foto Ketua */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Foto Ketua (opsional)
              </label>
              <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/15 rounded-3xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all relative overflow-hidden group">
                {chairPreview && (
                  <img
                    src={chairPreview}
                    alt="Preview Foto Ketua"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                  />
                )}

                <div className="relative z-10 flex flex-col items-center gap-3 pointer-events-none">
                  <ImageIcon className="text-blue-500" size={40} />
                  <span className="text-xs font-black uppercase tracking-wider text-white/70">
                    {chairPreview ? "Ganti Foto Ketua" : "Upload Foto Ketua"}
                  </span>
                  <span className="text-[10px] text-zinc-500">(jpg / png / webp • maks 5MB)</span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setChairFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Identitas Wakil Ketua – struktur sama, hanya ganti label & field key */}
        <div className="space-y-6 pt-8 border-t border-white/10">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
            Identitas Wakil Ketua *
          </label>

          <div className="space-y-4">
            <input
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Nama Lengkap Wakil"
              value={form.viceChairmanName}
              onChange={e => setForm({ ...form, viceChairmanName: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                placeholder="NISN/NIK"
                value={form.viceChairmanNik}
                onChange={e => setForm({ ...form, viceChairmanNik: e.target.value })}
                required
              />
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Angkatan"
                value={form.viceChairmanBatch}
                onChange={e => setForm({ ...form, viceChairmanBatch: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Kelas"
                value={form.viceChairmanClass}
                onChange={e => setForm({ ...form, viceChairmanClass: e.target.value })}
                required
              />
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Jurusan"
                value={form.viceChairmanMajor}
                onChange={e => setForm({ ...form, viceChairmanMajor: e.target.value })}
                required
              />
            </div>

            {/* Upload Foto Wakil */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                  Foto Wakil (opsional)
                </label>
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/15 rounded-3xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all relative overflow-hidden group">
                  {vicePreview && (
                    <img
                      src={vicePreview}
                      alt="Preview Foto Wakil"
                      className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center gap-3 pointer-events-none">
                    <ImageIcon className="text-blue-500" size={40} />
                    <span className="text-xs font-black uppercase tracking-wider text-white/70">
                      {vicePreview ? "Ganti Foto Wakil" : "Upload Foto Wakil"}
                    </span>
                    <span className="text-[10px] text-zinc-500">(jpg / png / webp • maks 5MB)</span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setViceFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
          </div>
        </div>

        {/* Visi, Misi, Motto */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Visi Pasangan *
            </label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-y min-h-[120px]"
              placeholder="Visi pasangan calon..."
              value={form.vision}
              onChange={e => setForm({ ...form, vision: e.target.value })}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
                Misi Pasangan *
              </label>
              <button
                type="button"
                onClick={addMission}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl transition-colors text-sm font-semibold"
              >
                <Plus size={16} /> Tambah Misi
              </button>
            </div>

            <AnimatePresence>
              {missions.map((misi, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
                    placeholder={`Misi ${index + 1}...`}
                    value={misi}
                    onChange={e => updateMission(index, e.target.value)}
                    required
                  />
                  {missions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMission(index)}
                      className="p-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Motto Pasangan
            </label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Motto pasangan calon..."
              value={form.motto}
              onChange={e => setForm({ ...form, motto: e.target.value })}
            />
          </div>
        </div>

        {/* Tombol action sticky bottom */}
        <div className="bg-[#0B1220] pt-10 border-t border-white/8 grid grid-cols-2 gap-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="py-4 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-white disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
              loading
                ? "bg-blue-800 cursor-not-allowed opacity-80"
                : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={18} /> {/* ganti ISave jadi Save dari lucide-react jika perlu */}
                Simpan
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  </>
);
};

// --- MAIN PAGE ---
export default function VotingMain() {
  const [activeTab, setActiveTab] = useState<"candidates" | "codes" | "results">("candidates");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [codes, setCodes] = useState<VoteCode[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [genAmount, setGenAmount] = useState<number | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [alert, setAlert] = useState<AlertState>({ message: "", type: "success", visible: false });
  const [toast, setToast] = useState({ show: false, message: "" });
  // Hitung kandidat dengan vote tertinggi
  const maxVotes = Math.max(...candidates.map(c => c.votes), 0);
  const winners = candidates.filter(c => c.votes === maxVotes && maxVotes > 0);

  // Fungsi untuk memicu toast
  const showToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000); // Hilang setelah 2 detik
  };

  const dataSchool: any = useSchool();
  const SCHOOL_ID = dataSchool?.data?.[0]?.id;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, type, visible: true });
    setTimeout(() => setAlert((p) => ({ ...p, visible: false })), 4000);
  }, []);

  const fetchData = useCallback(async () => {
    if (!SCHOOL_ID) return;
    setLoading(true);
    try {
      const [resCan, resCodes] = await Promise.all([
        fetch(`${BASE_URL}/kandidat?schoolId=${SCHOOL_ID}`),
        fetch(`${BASE_URL}/list-kode?schoolId=${SCHOOL_ID}`)
      ]);
      
      const jsonCan = await resCan.json();
      const jsonCodes = await resCodes.json();

      if (jsonCan.success) {
        // PROSES SANITASI DATA: Mengubah string mission menjadi Array
        const sanitizedCandidates = jsonCan.data.map((can: any) => {
          let parsedMission = [];
          try {
            if (typeof can.mission === 'string') {
              // Jika mission adalah string "[\"a\",\"b\"]", kita parse
              parsedMission = JSON.parse(can.mission);
            } else if (Array.isArray(can.mission)) {
              // Jika sudah array, pakai langsung
              parsedMission = can.mission;
            }
          } catch (error) {
            console.error(`Gagal parse mission untuk ID ${can.id}:`, error);
            parsedMission = []; // fallback jika JSON corrupt
          }

          return {
            ...can,
            mission: parsedMission
          };
        });
        
        setCandidates(sanitizedCandidates);
      }

      if (jsonCodes.success) {
        setCodes(jsonCodes.data);
      }
    } catch (err) { 
      showAlert("Gagal mengambil data dari server", "error"); 
    } finally { 
      setLoading(false); 
    }
  }, [SCHOOL_ID, showAlert]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveCandidate = async (formData: FormData) => {
    const isEdit = !!selectedCandidate;
    if(!isEdit) formData.append("schoolId", SCHOOL_ID.toString());
    const url = isEdit ? `${BASE_URL}/kandidat/${selectedCandidate.id}` : `${BASE_URL}/kandidat`;
    const res = await fetch(url, { method: isEdit ? "PUT" : "POST", body: formData });
    if (res.ok) { showAlert(isEdit ? "Data diperbarui" : "Pasangan ditambahkan"); fetchData(); }
  };

  const handleDeleteCandidate = async (id: number) => {
    if (!confirm("Hapus pasangan ini?")) return;
    const res = await fetch(`${BASE_URL}/kandidat/${id}`, { method: "DELETE" });
    if (res.ok) { showAlert("Data dihapus"); fetchData(); }
  };

  const handleGenerateCodes = async () => {
    if (!genAmount || genAmount <= 0) return showAlert("Masukkan jumlah token", "error");
    const res = await fetch(`${BASE_URL}/generate-kode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: genAmount, schoolId: SCHOOL_ID }),
    });
    if (res.ok) { showAlert("Token berhasil dibuat"); setGenAmount(""); fetchData(); }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCodes.length) setSelectedIds([]);
    else setSelectedIds(filteredCodes.map(c => c.id));
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Hapus ${selectedIds.length} kode terpilih?`)) return;
    const res = await fetch(`${BASE_URL}/delete-selected-kode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    });
    if (res.ok) { showAlert(`${selectedIds.length} Kode dihapus`); setSelectedIds([]); fetchData(); }
  };

  const handleBulkDeleteAll = async () => {
    if (!confirm("Hapus SEMUA kode untuk sekolah ini?")) return;
    const res = await fetch(`${BASE_URL}/bulk-delete-kode?schoolId=${SCHOOL_ID}`, { method: "DELETE" });
    if (res.ok) { showAlert("Seluruh kode dibersihkan"); fetchData(); }
  };

  const exportToExcel = () => {
    const data = codes.map(c => ({ 
      Kode: c.code, 
      Status: c.isActive ? "Aktif" : "Terpakai", 
      Dibuat: new Date(c.createdAt).toLocaleString() 
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tokens");
    
    // PERBAIKAN: Gunakan XLSX.writeFile, bukan XLSX.utils.writeFile
    XLSX.writeFile(wb, `Token_Voting_${SCHOOL_ID}.xlsx`);
  };

  const filteredCodes = codes.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

  // Data for Charts
  const chartData = candidates.map(can => ({
    name: `${can.chairmanName.split(' ')[0]} & ${can.viceChairmanName.split(' ')[0]}`,
    votes: can.votes,
    fullName: `${can.chairmanName} & ${can.viceChairmanName}`
  }));

  const totalVotes = candidates.reduce((acc, curr) => acc + curr.votes, 0);

  const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
      {label}
    </span>
  );
  const ISave = () => <Icon label="💾" />;
  const IEdit = () => <Icon label="✏️" />;

  return (
    <div className="min-h-screen text-gray-100 font-sans">
      <AnimatePresence>{alert.visible && <Alert alert={alert} onClose={() => setAlert({...alert, visible: false})} />}</AnimatePresence>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
              <Vote size={14} /> Pengumuman Management
            </div>
            <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
              pemilihan <span className="text-blue-600">Kandidat</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium">Kelola informasi penting, kegiatan, dan pengumuman resmi</p>
          </div>
  
          {/* <button
            onClick={openAddModal}
            disabled={loading}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50"
          >
            <Plus size={18} /> Tambah Pengumuman
          </button> */}
        </div>

      <div className="max-w-7xl mx-auto space-y-4 pb-5">
        <div className="flex justify-between items-center gap-4 mt-4 mb-6">
          <div className="flex items-center gap-4">
          <div 
            onClick={() => { 
              if (activeTab !== "candidates") return;
              setSelectedCandidate(null); setModalOpen(true); 
            }} 
            className={`${activeTab !== "results" && activeTab !== "codes" ? 'bg-blue-500 hover:bg-blue-600 tex-white cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'} px-3 w-max h-[50px] py-2 rounded-md font-semibold flex items-center gap-2 shadow-xl shadow-blue-900/20 transition-all`}
          >
            <ISave /> 
            <span className="w-max text-[13px]">Tambah Kandidat</span>
          </div>
          <button
                onClick={() => {
                  setLoading(true);
                  fetchData().finally(() => setLoading(false));
                  showToast("Data kandidat diperbarui");
                }}
                disabled={loading}
                className={`
                  flex-1 sm:flex-none flex h-[50px] items-center justify-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs tracking-widest transition-all
                  ${loading 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 active:scale-95'
                  }
                `}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                <span>Refresh</span>
              </button>
          </div>

            <div className="grid grid-cols-3 bg-white/5 rounded-lg border h-[50px] border-blue-100/20 backdrop-blur-md w-full">
                <button onClick={() => setActiveTab("candidates")} className={`px-4 h-full justify-center rounded-md flex items-center gap-2 transition-all font-semibold text-sm ${activeTab === 'candidates' ? 'bg-blue-500 text-white shadow-lg shadow-blue-900/40' : 'text-gray-400 hover:text-white'}`}>
                    <LayoutGrid size={18} /> <span className="hidden sm:inline">Kandidat</span>
                </button>
                <button onClick={() => setActiveTab("codes")} className={`px-4 h-full justify-center rounded-md flex items-center gap-2 transition-all font-semibold text-sm ${activeTab === 'codes' ? 'bg-blue-500 text-white shadow-lg shadow-blue-900/40' : 'text-gray-400 hover:text-white'}`}>
                    <List size={18} /> <span className="hidden sm:inline">Kode voting</span>
                </button>
                <button onClick={() => setActiveTab("results")} className={`px-4 h-full justify-center rounded-md flex items-center gap-2 transition-all font-semibold text-sm ${activeTab === 'results' ? 'bg-blue-500 text-white shadow-lg shadow-blue-900/40' : 'text-gray-400 hover:text-white'}`}>
                    <BarChart3 size={18} /> <span className="hidden sm:inline">Hasil Voting</span>
                </button>
            </div>
        </div>

        {activeTab === "candidates" && (
          <div className="space-y-6">
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-500 animate-pulse gap-3">
                <FaSpinner className="animate-spin" />
                Memuat data kandidat...
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                Belum ada pasangan kandidat. Tambahkan kandidat baru.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                {candidates.map((can) => (
                  <motion.div
                    layout
                    key={can.id}
                    className="relative bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group hover:border-blue-500/40 transition-all duration-500 shadow-2xl"
                  >
                    {/* Image Section */}
                    <div className="flex h-80 relative overflow-hidden">
                      {/* Chairman */}
                      <div className="w-1/2 relative group/img overflow-hidden">
                        <img
                          src={can.chairmanImageUrl || "/placeholder.png"}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
                          alt="Ketua"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-60" />

                        {/* Medali Juara (hanya jika kandidat ini pemenang) */}
                        {winners.some(w => w.id === can.id) && (
                          <div className="absolute top-2.5 left-3 z-30">
                            <div className="relative flex flex-col items-center">
                              <div className="w-16 h-16 md:w-10 md:h-10 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/60 border-4 border-white/40 animate-pulse-slow">
                                <span className="text-lg md:text-xl font-black text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">🥇</span>
                              </div>
                              {/* <span className="mt-2 text-xs md:text-sm font-bold text-yellow-300 tracking-wider uppercase drop-shadow-md">
                                Juara
                              </span> */}
                            </div>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg">
                          <p className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase mb-1">Ketua</p>
                          <h4 className="text-sm font-black truncate text-white uppercase tracking-tight leading-tight">
                            {can.chairmanName}
                          </h4>
                        </div>
                      </div>

                      {/* Vice Chairman */}
                      <div className="w-1/2 relative group/img overflow-hidden border-l border-white/5">
                        <img
                          src={can.viceChairmanImageUrl || "/placeholder.png"}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
                          alt="Wakil"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-60" />

                        {/* Medali Juara (sama seperti di atas) */}
                        {winners.some(w => w.id === can.id) && (
                          <div className="absolute top-2.5 left-3 z-30">
                            <div className="relative flex flex-col items-center">
                              <div className="w-16 h-16 md:w-10 md:h-10 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/60 border-4 border-white/40 animate-pulse-slow">
                                <span className="text-lg md:text-xl font-black text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">🥇</span>
                              </div>
                              {/* <span className="mt-2 text-xs md:text-sm font-bold text-yellow-300 tracking-wider uppercase drop-shadow-md">
                                Juara
                              </span> */}
                            </div>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg">
                          <p className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase mb-1">Wakil</p>
                          <h4 className="text-sm font-black truncate text-white uppercase tracking-tight leading-tight">
                            {can.viceChairmanName}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                            {can.chairmanMajor}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                            Batch {can.chairmanBatch}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-gray-500/10 text-gray-300 text-xs font-bold uppercase tracking-wider border border-gray-500/20">
                            ID-{can.id}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {can.chairmanClass} • {can.viceChairmanClass}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedCandidate(can);
                            setModalOpen(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-black hover:brightness-95 rounded-xl font-semibold text-sm transition-all active:scale-95"
                        >
                          <span className="text-lg">✏️</span> Perbarui
                        </button>

                        <div className="flex flex-col h-[55px] items-center justify-center px-5 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl min-w-[90px]">
                          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter leading-none mb-1">
                            SUARA
                          </span>
                          <span className="text-2xl font-black text-white leading-none">{can.votes}</span>
                        </div>

                        <button
                          onClick={() => handleDeleteCandidate(can.id!)}
                          className="p-4 bg-red-500/10 hover:bg-red-500/80 text-red-400 hover:text-white rounded-xl transition-all duration-300 border border-red-500/20 active:scale-95"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "codes" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="bg-[#111827] p-4 rounded-lg border border-white/10 shadow-xl">
                <h3 className="text-md font-semibold mb-4 flex items-center gap-2 text-white tracking-widest"><Ticket size={18}/> Kode baru</h3>
                <input type="number" placeholder="Jumlah Token" className="w-full bg-white/5 border border-white/10 rounded-md p-4 mb-2 outline-none focus:border-blue-500 transition-all" value={genAmount} onChange={e => setGenAmount(e.target.value === "" ? "" : parseInt(e.target.value))} />
                <button onClick={handleGenerateCodes} className="w-full bg-blue-600 py-4 rounded-md font-semibold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30 mt-1">Hasilkan kode</button>
              </div>

              <div className="bg-[#111827] p-4 rounded-lg border border-white/10 space-y-3">
                <button onClick={exportToExcel} className="w-full flex items-center gap-3 px-5 py-4 bg-green-600/5 text-green-400 border border-green-600/10 rounded-md hover:bg-green-600/10 text-sm transition-all"><FileSpreadsheet size={18}/> Export to Excel</button>
                <button onClick={() => window.print()} className="w-full flex items-center gap-3 px-5 py-4 bg-blue-600/5 text-blue-400 border border-blue-600/10 rounded-md hover:bg-blue-600/10 text-sm transition-all"><Printer size={18}/> Print Token Cards</button>
                <button onClick={handleBulkDeleteAll} className="w-full flex items-center gap-3 px-5 py-4 bg-red-600/5 text-red-500 border border-red-600/10 rounded-md hover:bg-red-600/10 text-sm transition-all"><Trash size={18}/> Clear All Data</button>
              </div>

              <AnimatePresence>
                {selectedIds.length > 0 && (
                  <motion.button initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    onClick={handleDeleteSelected}
                    className="w-full py-4 bg-red-600 text-white rounded-[1.5rem] font-bold shadow-xl shadow-red-900/40 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={20}/> Hapus {selectedIds.length} Terpilih
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-3 bg-[#111827] rounded-lg border border-white/10 shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5">
                <div className="w-max flex items-center gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" placeholder="Search token..." className="w-full bg-white/5 pl-12 pr-4 py-3 rounded-xl outline-none border border-transparent focus:border-blue-500 transition-all text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <button
                    onClick={() => {
                      setLoading(true);
                      fetchData().finally(() => setLoading(false));
                      showToast("Data kode voting telah diperbarui");
                    }}
                    disabled={loading}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all
                      ${loading 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 hover:border-blue-400/50'
                      }
                    `}
                    title="Refresh daftar kode"
                  >
                    {loading ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M3 21v-5h5" />
                      </svg>
                    )}
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-semibold text-gray-500 tracking-widest">
                  <span>{selectedIds.length} SELECTED</span>
                  <span className="h-4 w-px bg-white/10"></span>
                  <span>TOTAL {codes.length}</span>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[600px] custom-scroll">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-white/5">
                    {filteredCodes.map(c => (
                      <tr key={c.id} className={`group transition-colors ${selectedIds.includes(c.id) ? 'bg-blue-500/5' : 'hover:bg-white/5'}`}>
                        <td className="px-8 py-4">
                          <button onClick={() => toggleSelect(c.id)}>
                            {selectedIds.includes(c.id) ? <CheckSquare size={20} className="text-blue-500" /> : <Square size={20} className="text-gray-700" />}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-white text-lg tracking-widest">
                              {c.code}
                            </span>
                            {/* Tombol Copy Clipboard */}
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(c.code);
                                showToast("Kode berhasil disalin!"); // <--- Panggil toast di sini
                              }}
                              className="p-2 hover:bg-blue-500/20 text-white rounded-md transition-all active:scale-90"
                              title="Salin Kode"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {c.isActive ? 
                            <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-semibold bg-green-500/10 px-3 py-1 rounded-full w-fit tracking-widest">READY</span> : 
                            <span className="flex items-center gap-1.5 text-red-400 text-[10px] font-semibold bg-red-400/10 px-3 py-1 rounded-full w-fit tracking-widest">USED</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-right text-gray-500 text-xs font-bold">
                          {new Date(c.createdAt).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <AnimatePresence>
              {toast.show && (
                <motion.div   
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-4 right-7 -translate-x-1/2 z-[9999] bg-blue-600 text-white px-6 py-3 rounded-md shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md"
                >
                  <div className="bg-white/20 p-1 rounded-full">
                    <Check size={14} />
                  </div>
                  <span className="text-sm font-bold tracking-wide">{toast.message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === "results" && (
          <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#111827] border border-white/10 px-5 pt-4 pb-5 rounded-2xl shadow-xl">
                <p className="text-gray-400 text-[14px] font-semibold tracking-widest">Total Suara Masuk</p>
                <div className="flex items-end gap-2 mt-2">
                  <h2 className="text-4xl font-semibold text-white">{totalVotes}</h2>
                  {/* <span className="text-gray-500 text-sm mb-1 font-bold">Suara</span> */}
                </div>
              </div>
              <div className="bg-[#111827] border border-white/10 px-5 pt-4 pb-5 rounded-2xl shadow-xl">
                <p className="text-gray-400 text-[14px] font-semibold tracking-widest">Token Terpakai</p>
                <div className="flex items-end gap-2 mt-2">
                  <h2 className="text-4xl font-semibold text-white">{codes.filter(c => !c.isActive).length}</h2>
                  {/* <span className="text-gray-500 text-sm mb-1 font-bold">Terpakai</span> */}
                </div>
              </div>
              <div className="bg-[#111827] border border-white/10 px-5 pt-4 pb-5 rounded-2xl shadow-xl">
                <p className="text-gray-400 text-[14px] font-semibold tracking-widest">Token Tersedia</p>
                <div className="flex items-end gap-2 mt-2">
                  <h2 className="text-4xl font-semibold text-white">
                    {codes.filter(c => c.isActive).length}
                  </h2>
                  {/* <span className="text-gray-500 text-sm mb-1 font-bold">Tersisa</span> */}
                </div>
              </div>
              <div className="bg-[#111827] border border-white/10 px-5 pt-4 pb-5 rounded-2xl shadow-xl">
                <p className="text-gray-400 text-[14px] font-semibold tracking-widest">Partisipasi</p>
                <div className="flex items-end gap-2 mt-2">
                  <h2 className="text-4xl font-semibold text-white">
                    {codes.length > 0 ? ((codes.filter(c => !c.isActive).length / codes.length) * 100).toFixed(1) : 0}%
                  </h2>
                  {/* <span className="text-gray-500 text-sm mb-1 font-bold">Rate</span> */}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Bar Chart */}
              <div className="lg:col-span-2 bg-[#111827] border border-white/10 p-8 rounded-3xl shadow-2xl">
                <h3 className="text-md font-semibold text-white mb-8 flex items-center gap-2 uppercase tracking-widest">
                  <BarChart3 className="text-blue-500" size={20} /> Statistik Perolehan Suara
                </h3>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                      <YAxis stroke="#6B7280" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                      {/* <Tooltip 
                        cursor={{ fill: '#ffffff05' }}
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#F3F4F6', fontWeight: '900', fontSize: '12px' }}
                      /> */}
                      <Tooltip 
                        cursor={{ fill: '#ffffff05' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const isWinner = winners.some(w => w.id === data.id);
                            return (
                              <div className="bg-[#111827] p-4 rounded-xl border border-white/10 shadow-xl">
                                <p className="font-bold text-white">{data.fullName}</p>
                                <p className="text-blue-400">Suara: {data.votes}</p>
                                {isWinner && <p className="text-yellow-400 font-black mt-1">🥇 Juara</p>}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="votes" radius={[10, 10, 0, 0]} barSize={60}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart Distribution */}
              <div className="bg-[#111827] border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col">
                <h3 className="text-md font-semibold text-white mb-8 uppercase tracking-widest text-center">Distribusi Suara</h3>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="votes"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 space-y-3">
                  {chartData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></div>
                        <span className="text-xs font-bold text-gray-300 truncate max-w-[120px]">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white leading-none">{item.votes}</p>
                        <p className="text-[10px] text-gray-500 font-bold">SUARA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRINTABLE AREA */}
      <div id="printable-area" className="hidden print:block">
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-area,
            #printable-area * {
              visibility: visible;
            }
            #printable-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              margin: 0;
            }

            /* Margin halaman lebih kecil agar muat lebih banyak */
            @page {
              size: A4 portrait;
              margin: 8mm 7mm 10mm 7mm;   /* atas 8mm, kiri/kanan 7mm, bawah 10mm — aman di hampir semua printer */
            }

            .print-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);   /* tetep 4 kolom */
              gap: 8px;                                /* jarak kecil antar kartu */
              padding: 0;
              margin: 0;
            }

            .card {
              border: 1px solid #000;
              padding: 8px 6px;                        /* padding super minimal */
              text-align: center;
              border-radius: 4px;
              background: white;
              break-inside: avoid;
              page-break-inside: avoid;
              height: 32mm;                            /* tinggi kartu sangat pendek → muat 8 baris */
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              box-sizing: border-box;
            }

            .card-title {
              font-size: 8px;                          /* judul kecil */
              font-weight: 900;
              margin-bottom: 3px;
              letter-spacing: 0.4px;
              color: black;
            }

            .card-code {
              font-size: 20px;                         /* kode besar tapi muat */
              font-family: 'Courier New', Courier, monospace;
              font-weight: 900;
              letter-spacing: 1.5px;
              color: black;
              margin: 2px 0;
            }

            .card-footer {
              font-size: 6px;
              margin-top: 2px;
              color: #444;
            }

            /* Paksa halaman baru setiap 32 kartu (setelah kartu ke-32, 64, dst) */
            .card:nth-child(32n + 1) {
              page-break-before: always;
            }
          }
        `}</style>
        <div className="print-grid">
          {codes.filter(c => c.isActive).map(c => (
            <div key={c.id} className="card">
              <div className="card-title" style={{color: 'black'}}>E-VOTING TOKEN</div>
              <div className="card-code" style={{color: 'black'}}>{c.code}</div>
              <div style={{fontSize: '7px', marginTop: '5px', color: 'black'}}>Official Voting Code</div>
            </div>
          ))}
        </div>
      </div>

      <CandidateModal open={modalOpen} onClose={() => setModalOpen(false)} initialData={selectedCandidate} onSubmit={handleSaveCandidate} />
    </div>
  );
}