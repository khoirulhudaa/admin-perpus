import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import {
  Info,
  Mail,
  Save,
  User,
  X
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

// --- Utility & Alert Components ---
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

interface AlertState {
  message: string;
  isVisible: boolean;
}

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });
  const showAlert = useCallback((message: string) => setAlert({ message, isVisible: true }), []);
  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
  return { alert, showAlert, hideAlert };
};

const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const isSuccess = message.toLowerCase().includes("berhasil");
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "flex items-center justify-between px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl",
        isSuccess ? "bg-emerald-600 border-emerald-400/50 text-white" : "bg-red-600 border-red-400/50 text-white"
      )}
    >
      <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
        <Info size={18} />
        {message}
      </div>
      <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={18} /></button>
    </motion.div>
  );
};

const Field: React.FC<{ label?: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <div className={clsx("space-y-2", className)}>
    {label && <label className="text-[12px] font-black uppercase tracking-[0.2em] text-white/40 ml-[2px]">{label}</label>}
    {children}
  </div>
);

const API_BASE = "https://be-school.kiraproject.id/auth"; 

export function AdminTable() {
  const [formData, setFormData] = useState({
    adminName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const schoolQuery = useSchool();
  const schoolData = schoolQuery?.data?.[0];

  // Sinkronisasi data dari backend ke form
  useEffect(() => {
    if (schoolData) {
      setFormData({
        adminName: schoolData.adminName || "",
        email: schoolData.email || "",
      });
    }
  }, [schoolData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        // Hanya mengirim data yang dibutuhkan
        body: JSON.stringify({
          adminName: formData.adminName,
          email: formData.email,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal memperbarui profil");
      
      showAlert("Profil administrator berhasil diperbarui");
      
      // Refresh data di state global agar header/sidebar ikut update
      if (schoolQuery.refetch) schoolQuery.refetch();

    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white space-y-0 pb-20">
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[999999] w-full max-w-md px-4">
        <AnimatePresence>
          {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
        </AnimatePresence>
      </div>

      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/10 pb-10">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 mb-3 font-black text-blue-500 uppercase tracking-[0.4em] text-[10px]">
            <User size={14} />
            Admin Identity
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
            Profile <span className="text-blue-700">Admin</span>
          </h1>
          <p className="text-white/40 text-sm font-medium italic max-w-lg text-balance">
            Perbarui data personal admin untuk keperluan manajemen dashboard sekolah.
          </p>
        </div>
      </header>

      <main className="w-full pt-12">
        <form onSubmit={handleSubmit} className="space-y-10 mt-[2px] bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] shadow-sm">
          
          <div className="gap-4 grid grid-cols-2">
            <Field label="Nama Lengkap Administrator">
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  name="adminName" 
                  value={formData.adminName} 
                  onChange={handleInputChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white outline-none focus:border-blue-500 transition-all text-sm placeholder:text-white/10" 
                  placeholder="Masukkan nama lengkap admin" 
                  required 
                />
              </div>
            </Field>

            <Field label="Alamat Email">
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="email"
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white outline-none focus:border-blue-500 transition-all text-sm placeholder:text-white/10" 
                  placeholder="admin@sekolah.sch.id" 
                  required 
                />
              </div>
            </Field>
          </div>

          <div className="pt-0">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-max px-6 h-16 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white text-[12px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <Save size={18} className="group-hover:scale-110 transition-transform" />
              )}
              Update Data Sekarang
            </button>
            <p className="text-center text-[9px] text-white/10 mt-6 uppercase tracking-[0.2em]">Data akan langsung diperbarui di seluruh sistem</p>
          </div>
        </form>
      </main>
    </div>
  );
}