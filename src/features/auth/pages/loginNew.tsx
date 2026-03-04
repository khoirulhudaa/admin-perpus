import { Button, Input, Label } from '@/core/libs';
import { InputSecure, useAlert } from '@/features/_global';
import { AnimatePresence, motion } from 'framer-motion';
import { FormEventHandler, useState, useRef } from 'react';
import { Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', npsn: '', schoolName: '', adminName: '', address: '',
    latitude: '', longitude: ''
  });
  const [logo, setLogo] = useState<File | null>(null);

  const BASE_URL = "http://localhost:5005/auth";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      return alert.error("Browser Anda tidak mendukung fitur lokasi.");
    }
    
    alert.success("Mencoba mendapatkan lokasi...");
    navigator.geolocation.getCurrentPosition((position) => {
      setFormData(prev => ({
        ...prev,
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString()
      }));
      alert.success("Koordinat berhasil diambil!");
    }, (err) => {
      alert.error("Gagal mendapatkan lokasi: " + err.message);
    });
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const res = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message);
        console.log('user', result)
        localStorage.setItem('token', result.token);
        // Mengubah object menjadi string JSON agar bisa disimpan
        localStorage.setItem('user', JSON.stringify(result.user));
        alert.success('Authenticated.');
        navigate('/')
      } else {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (logo) data.append('logo', logo);

        const res = await fetch(`${BASE_URL}/register`, { method: 'POST', body: data });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message);
        alert.success('Pendaftaran berhasil!.');
        setIsLogin(true);
      }
    } catch (err: any) {
      alert.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi pindah mode sambil scroll ke atas otomatis
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full mx-auto overflow-hidden flex flex-col">
      {/* Scroll Container: Menangani form yang panjang */}
      <div 
        ref={scrollRef}
        className="max-h-[70vh] overflow-y-auto pr-6 pl-[1px] custom-scrollbar space-y-4"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div 
                key="register-section"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-slate-400 text-xs uppercase tracking-tighter">NPSN</Label>
                    <Input id="npsn" required={!isLogin} onChange={handleChange} className="bg-white/5 border-white/10 text-white rounded-xl" placeholder="8-16 digits" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-400 text-xs uppercase tracking-tighter">Nama Admin</Label>
                    <Input id="adminName" required={!isLogin} onChange={handleChange} className="bg-white/5 border-white/10 text-white rounded-xl" placeholder="Full name" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-xs uppercase tracking-tighter">Nama Sekolah</Label>
                  <Input id="schoolName" required={!isLogin} onChange={handleChange} className="bg-white/5 border-white/10 text-white rounded-xl" placeholder="Official Name" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-xs uppercase tracking-tighter">Address</Label>
                  <Input id="address" required={!isLogin} onChange={handleChange} className="bg-white/5 border-white/10 text-white rounded-xl" placeholder="School Location Street, No, City" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5 relative">
                    <Label className="text-slate-400 text-xs uppercase tracking-tighter">Latitude</Label>
                    <Input id="latitude" value={formData.latitude} required={!isLogin} onChange={handleChange} className="bg-white/5 border-white/10 text-white rounded-xl text-xs" placeholder="Auto / Manual" />
                  </div>
                  <div className="space-y-1.5 relative">
                    <Label className="text-slate-400 text-xs uppercase tracking-tighter">Longitude</Label>
                    <Input id="longitude" value={formData.longitude} required={!isLogin} onChange={handleChange} className="bg-white/5 border-white/10 text-white rounded-xl text-xs" placeholder="Auto / Manual" />
                  </div>
                </div>
                
                <button 
                  type="button" 
                  onClick={getLocation}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-blue-500/30 rounded-lg text-blue-400 text-[10px] font-bold uppercase hover:bg-blue-500/10 transition-all"
                >
                  <Target size={14} /> Dateksi koordinat saat ini
                </button>

                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-xs uppercase tracking-tighter">Logo Sekolah</Label>
                  <div className="group relative bg-white/5 border border-dashed border-white/10 rounded-xl py-10 p-3 text-center hover:border-blue-500 transition-all">
                    <input type="file" onChange={(e) => e.target.files && setLogo(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <span className="text-[10px] text-slate-500">{logo ? logo.name : "Click to select logo"}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email dan Password selalu ada di Login maupun Register */}
          <div className="space-y-1.5">
            <Label className="text-slate-400 text-xs uppercase tracking-tighter">Email Admin</Label>
            <Input id="email" type="email" required onChange={handleChange} className="bg-white/5 border-white/10 text-white rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-400 text-xs uppercase tracking-tighter">Kata Sandi</Label>
            <InputSecure id="password" required onChange={handleChange} className="bg-white/5 border-white/10 text-white rounded-xl" />
          </div>
          
          <div className={`grid-cols-1 gap-4 grid`}>
            {/* Tombol Submit Utama */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 rounded-xl shadow-lg transition-all uppercase tracking-widest text-xs"
            >
              {isLoading ? "Tunggu sebentar..." : (isLogin ? "Masuk Sekarang" : "Daftar Sekarang")}
            </Button>
            <div className="text-center relative  py-2">
              <button 
                type="button" 
                onClick={handleToggleMode} 
                className="text-xs font-semibold text-slate-500 hover:text-white transition-all uppercase tracking-widest"
              >
                {isLogin ? "Need a school account?" : "Back to login?"}
                <span className="text-blue-500 ml-2 underline underline-offset-4 font-bold cursor-pointer">
                  {isLogin ? "Buat Akun" : "Masuk"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
};