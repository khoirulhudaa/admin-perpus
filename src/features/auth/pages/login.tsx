import { APP_CONFIG } from '@/core/configs';
import { Button, Input, Label, VokadashHead } from '@/core/libs';
import { InputSecure, useAlert } from '@/features/_global';
import { FormEventHandler, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();
  
  // Mengubah nama state agar lebih umum (bisa username/email)
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      // Mengirim 'identifier' sesuai dengan req.body di Backend
      const res = await auth.login({ email:identifier, password });
      
      const token = res.data.token;

      if (token) {
        localStorage.setItem('token', token);
        alert.success('Login berhasil!');
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 300);
      } else {
        alert.error('Gagal mendapatkan token dari server');
      }
    } catch (err: any) {
      // Menampilkan pesan error spesifik dari backend (misal: "Akun belum diverifikasi")
      const msg = err.response?.data?.message || 'Akun atau password salah';
      alert.error(msg);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 flex flex-col justify-between bg-transparent h-full overflow-hidden">
      <VokadashHead>
        <title>{`Login | ${APP_CONFIG.appName}`}</title>
      </VokadashHead>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-blue-800 text-[14px] uppercase font-medium ml-1">
            Username atau Email
          </Label>
          <Input
            type="email" // Ubah ke text agar browser tidak komplain jika diisi username
            placeholder="Masukkan email"
            autoComplete="email"
            required
            value={identifier}
            onChange={({ target: { value } }) => setIdentifier(value)}
            className="h-11 bg-white/[0.03] border-blue-400 text-blue-900 placeholder:text-white/20 border-2 focus:border-blue-500/50 focus:ring-0 transition-all rounded-xl"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-blue-800 text-[14px] uppercase font-medium ml-1">Kata Sandi</Label>
            <Link to="/auth/forget-password" 
                  className="text-[13px] uppercase text-blue-500 hover:text-blue-400 transition-colors">
              Lupa kata sandi?
            </Link>
          </div>
          <InputSecure
            required
            autoComplete="current-password"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            placeholder="••••••••"
            className="h-11 bg-white/[0.03] border-blue-400 text-blue-900 placeholder:text-white/20 border-2 focus:border-blue-500/50 focus:ring-0 transition-all rounded-xl"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={auth.isLoading} 
        className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/10"
      >
        {auth.isLoading ? 'Memproses...' : 'Masuk'}
      </Button>
{/* 
      <div className="text-center pt-2">
        <p className="text-[13px] text-slate-500">
          Belum punya akun?{' '}
          <Link to="/auth/register" className="text-blue-400 font-medium transition-colors">
            Daftar Sekarang
          </Link>
        </p>
      </div> */}
    </form>
  );
};