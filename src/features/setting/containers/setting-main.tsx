import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Coins,
  Eraser,
  FileBadge,
  Image as ImageIcon,
  Library,
  Palette,
  Save,
  Signature as SignatureIcon,
  UserCheck
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import SignatureCanvas from 'react-signature-canvas';

const BASE_URL = "https://be-perpus.kiraproject.id/setting";

// --- UTILS ---
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

// --- COMPONENTS ---
const Alert: React.FC<{ message: string; type: "success" | "error"; onClose: () => void }> = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    className={clsx(
      "flex items-center justify-between px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl w-full max-w-md fixed top-8 left-1/2 -translate-x-1/2 z-[100]",
      type === "success" ? "bg-emerald-600 border-emerald-400 text-white" : "bg-rose-600 border-rose-400 text-white"
    )}
  >
    <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest">{message}</div>
    <button onClick={onClose} className="hover:rotate-90 transition-transform"><CheckCircle2 size={18} /></button>
  </motion.div>
);

const SectionCard: React.FC<{ title: string; icon: any; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-[1.4rem] shadow-sm border border-slate-100 p-8 space-y-6">
    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Icon size={20} /></div>
      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const Field: React.FC<{ label?: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <div className={clsx("space-y-2", className)}>
    {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic">{label}</label>}
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>) => {
  if (props.type === "textarea") return <textarea {...(props as any)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-blue-500 transition-all text-sm font-bold min-h-[100px]" />;
  return <input {...props} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-blue-500 transition-all text-sm font-bold" />;
};

// --- API FETCHERS ---
const fetchSettings = async (schoolId: string) => {
  if (!schoolId) return null;
  const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`);
  const json = await res.json();
  return json.data;
};

export default function LibrarySettingsMain() {
  const queryClient = useQueryClient();
  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;
  const sigCanvas = useRef<SignatureCanvas>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean; type: "success" | "error" }>({ message: "", isVisible: false, type: "success" });
  const [previews, setPreviews] = useState<{ kop: string | null; badge: string | null }>({ kop: null, badge: null });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["librarySettings", schoolId],
    queryFn: () => fetchSettings(schoolId),
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
    enabled: !!schoolId,
  });

  useEffect(() => {
    if (settings) {
      setPreviews({
        kop: settings.kopSurat || null,
        badge: settings.memberBadgeLogo || null
      });
    }
  }, [settings]);

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, isVisible: true, type });
    setTimeout(() => setAlert(prev => ({ ...prev, isVisible: false })), 5000);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof previews) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => ({ ...prev, [key]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => sigCanvas.current?.clear();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("schoolId", schoolId?.toString() || "");

    // Convert Canvas to Blob and Append to FormData
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      formData.append("signatureImg", blob, "signature.png");
    }

    try {
      const res = await fetch(BASE_URL, { method: "POST", body: formData });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      
      showAlert("Pengaturan Perpustakaan Disimpan!");
      queryClient.invalidateQueries({ queryKey: ["librarySettings"] });
    } catch (err: any) {
      showAlert(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><FaSpinner className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="min-h-screen text-slate-900 pb-2">
      <AnimatePresence>{alert.isVisible && <Alert {...alert} onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))} />}</AnimatePresence>

      <header className="mb-8 max-w-7xl mx-auto md:flex items-center justify-between">
        <div className="nd:mb-0 mb-4">
          <div className="flex items-center gap-2 mb-2 font-black text-blue-600 uppercase tracking-[0.3em] text-[10px]"><Library size={14} /> System Configuration</div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-800">Pengaturan <span className="text-blue-600">Perpus</span></h1>
        </div>
        {/* <button 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => handleSubmit} 
            className="w-max p-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-blue-600 shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? <FaSpinner className="animate-spin" /> : <Save size={18} />} 
            Simpan Pengaturan
        </button> */}
      </header>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-8">
        
        {/* SECTION 1: IDENTITAS */}
        <SectionCard title="Identitas Perpustakaan" icon={Building2}>
          <Field label="Nama Perpustakaan" className="md:col-span-2">
            <Input name="libraryName" defaultValue={settings?.libraryName} placeholder="Perpustakaan Merdeka Belajar" required />
          </Field>
          <Field label="Alamat Lengkap" className="md:col-span-2">
            <Input name="address" type="textarea" defaultValue={settings?.address} placeholder="Jl. Pendidikan No. 45..." />
          </Field>
          <Field label="Upload Kop Surat (Banner)" className="md:col-span-2">
             <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 transition-all bg-slate-50 p-4 h-40 flex flex-col items-center justify-center">
                {previews.kop ? (
                  <img src={previews.kop} className="h-full w-full object-contain" alt="Kop Preview" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto text-slate-300 mb-2" size={32} />
                    <span className="text-[10px] font-black uppercase text-slate-400">Pilih Gambar Kop</span>
                  </div>
                )}
                <input type="file" name="kopSurat" accept="image/*" onChange={(e) => handleFileChange(e, "kop")} className="absolute inset-0 opacity-0 cursor-pointer" />
             </div>
          </Field>
        </SectionCard>

        {/* SECTION 2: PEJABAT & SIGNATURE PAD */}
        <SectionCard title="Penandatangan & Pejabat" icon={UserCheck}>
          <Field label="Nama Kepala Perpustakaan">
            <Input name="librarianName" defaultValue={settings?.librarianName} placeholder="Budi Santoso, S.Pd" />
          </Field>
          <Field label="NIP / ID Pegawai">
            <Input name="librarianId" defaultValue={settings?.librarianId} placeholder="1987022..." />
          </Field>
          
          <Field label="Digital Signature (Goreskan TTD)" className="md:col-span-2">
             <div className="space-y-4">
                <div className="relative h-64 w-full bg-slate-50 border-2 border-slate-200 rounded-[2rem] overflow-hidden group">
                   {/* Tanda Tangan Lama (Jika Ada) - Muncul di background jika canvas kosong */}
                   {settings?.signatureImg && (
                      <div className="absolute top-4 right-4 z-0 opacity-30 pointer-events-none">
                         <p className="text-[8px] font-bold uppercase mb-1">TTD Terdaftar:</p>
                         <img src={settings.signatureImg} className="h-16 object-contain grayscale" alt="Old Signature" />
                      </div>
                   )}
                   
                   <SignatureCanvas 
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                         className: "w-full h-full cursor-crosshair relative z-10"
                      }}
                   />
                   
                   <button 
                      type="button" 
                      onClick={clearSignature}
                      className="absolute bottom-4 right-4 z-20 p-4 bg-white/80 backdrop-blur shadow-xl border border-slate-100 rounded-2xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                      title="Hapus Tanda Tangan"
                   >
                      <Eraser size={20} />
                   </button>
                </div>
                <div className="flex items-center gap-2 px-4">
                   <SignatureIcon size={12} className="text-blue-500" />
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">
                      Silakan tanda tangan langsung di atas canvas. Biarkan kosong jika tidak ingin mengubah TTD.
                   </p>
                </div>
             </div>
          </Field>
        </SectionCard>

        {/* SECTION 3: ATURAN SIRKULASI */}
        <SectionCard title="Aturan Peminjaman" icon={Coins}>
          <Field label="Max. Pinjam (Buku)">
            <Input name="maxLoanQty" type="number" defaultValue={settings?.maxLoanQty || 3} />
          </Field>
          <Field label="Durasi Pinjam (Hari)">
            <Input name="maxLoanDays" type="number" defaultValue={settings?.maxLoanDays || 7} />
          </Field>
          <Field label="Denda Per Hari (Rp)">
            <Input name="dailyFine" type="number" defaultValue={settings?.dailyFine || 1000} />
          </Field>
        </SectionCard>

        {/* SECTION 4: KARTU ANGGOTA */}
        <SectionCard title="Desain Kartu Anggota" icon={FileBadge}>
          <Field label="Logo Kartu (Badge)">
             <div className="h-24 w-24 relative rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                {previews.badge ? <img src={previews.badge} className="w-full h-full object-cover" alt="Badge" /> : <ImageIcon className="m-auto text-slate-300" />}
                <input type="file" name="memberBadgeLogo" accept="image/*" onChange={(e) => handleFileChange(e, "badge")} className="absolute inset-0 opacity-0 cursor-pointer" />
             </div>
          </Field>
          <Field label="Tema Warna Kartu">
            <div className="flex items-center gap-4">
              <input type="color" name="cardThemeColor" defaultValue={settings?.cardThemeColor || "#3b82f6"} className="h-14 w-24 rounded-2xl cursor-pointer bg-slate-100 p-1 border-none" />
              <div className="p-4 bg-slate-50 rounded-2xl flex-1 border border-slate-200 flex items-center gap-3">
                <Palette size={16} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-600 uppercase">Warna Brand</span>
              </div>
            </div>
          </Field>
        </SectionCard>

        {/* SUBMIT BUTTON */}
        <div className="relative z-50">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full p-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-blue-600 shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? <FaSpinner className="animate-spin" /> : <Save size={18} />} 
            Simpan Pengaturan
        </button>
        </div>
      </form>
    </div>
  );
}