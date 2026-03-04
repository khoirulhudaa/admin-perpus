import { Button, Input, VokadashHead, simpleDecode } from '@/core/libs';
import { useAlert } from '@/features/_global';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useAuth } from '../hooks';
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react'; // Tambahkan ikon untuk kesan premium
import { useAuth } from '../hooks/useAuth';

export const OTPPage = () => {
  const [searchParams] = useSearchParams();
  const [pin, setPin] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();
  const alert = useAlert();

  const z = searchParams.get('z') || "";
  const email = z ? JSON.parse(simpleDecode(z)).email : "";

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.verifyPin(email, pin);
      alert.success("Verifikasi berhasil! Silakan login.");
      navigate("/auth/login");
    } catch (err: any) {
      alert.error(err.response?.data?.message || "PIN salah");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-[#020617] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      <VokadashHead>
        <title>Verifikasi Keamanan | Vokadash</title>
      </VokadashHead>

      {/* Back Button - Memberikan kesan navigasi yang matang */}
      <button 
        onClick={() => navigate('/auth/login')}
        className="absolute -top-12 left-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Kembali
      </button>

      <div className="space-y-8 w-[30vw] mx-auto my-auto">
        {/* Header dengan Ikon */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/5">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          
          <div className="space-y-2 text-center flex flex-col justify-center items-center">
            <h2 className="text-2xl w-max text-center font-semibold tracking-tight text-white">
              Verifikasi Akun
            </h2>
            <p className="text-[13px] text-slate-400 leading-relaxed w-max mx-auto flex flex-col justify-center items-center text-center">
              Kami telah mengirimkan kode keamanan 6-digit ke email
              <span className="w-max font-medium text-slate-200 mt-1 flex items-center justify-center gap-1.5">
                <Mail size={12} className="text-blue-500" /> {email}
              </span>
            </p>
          </div>
        </div>

        {/* Form Input */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="relative group">
            <Input 
              className="text-center text-3xl tracking-[1.2rem] font-bold h-16 bg-white/[0.03] border-white/10 text-white placeholder:text-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-2xl" 
              maxLength={6} 
              placeholder="000000"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} // Hanya angka
              required
              autoFocus
            />
            {/* Animasi underline tipis saat fokus */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-blue-500 group-focus-within:w-1/2 transition-all duration-500 opacity-50" />
          </div>

          <div className="space-y-4">
            <Button 
              type="submit" 
              disabled={auth.isLoading || pin.length < 6} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none"
            >
              {auth.isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </span>
              ) : "Konfirmasi Kode"}
            </Button>

            <p className="text-[12px] text-center text-slate-500">
              Tidak menerima kode? 
              <button type="button" className="ml-1 text-blue-500 hover:text-blue-400 font-medium transition-colors">
                Kirim Ulang
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};