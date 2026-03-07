import { APP_CONFIG } from '@/core/configs';
import { Button, Input, Label, VokadashHead } from '@/core/libs';
import { InputSecure, useAlert } from '@/features/_global';
import { FormEventHandler, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// Import Ikon (Pastikan lucide-react terinstall)
import { Mail, Lock } from 'lucide-react'; 

export const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();
  
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.login({ email: identifier, password });
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
        {/* Input Identifier (Email/Username) */}
        <div className="space-y-3">
          <Label className="text-blue-800 text-[14px] uppercase font-medium ml-1">
            Username atau Email
          </Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:text-blue-600 transition-colors">
              <Mail size={18} />
            </div>
            <Input
              type="text" // Diubah ke text agar fleksibel
              placeholder="Masukkan email atau username"
              autoComplete="email"
              required
              value={identifier}
              onChange={({ target: { value } }) => setIdentifier(value)}
              className="h-11 pl-10 bg-white/[0.03] border-blue-400 text-blue-900 placeholder:text-blue-900/30 border-2 focus:border-blue-500 focus:ring-0 transition-all rounded-xl w-full"
            />
          </div>
        </div>

        {/* Input Password */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-blue-800 text-[14px] uppercase font-medium ml-1">Kata Sandi</Label>
            <Link to="/auth/forget-password" 
                  className="text-[13px] uppercase text-blue-500 hover:text-blue-400 transition-colors">
              Lupa kata sandi?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:text-blue-600 transition-colors z-10">
              <Lock size={18} />
            </div>
            {/* InputSecure biasanya sudah punya logic "Mata" di dalamnya */}
            <InputSecure
              required
              autoComplete="current-password"
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
              placeholder="••••••••"
              className="h-11 pl-10 bg-white/[0.03] border-blue-400 text-blue-900 placeholder:text-blue-900/30 border-2 focus:border-blue-500 focus:ring-0 transition-all rounded-xl w-full"
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={auth.isLoading} 
        className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/10 mt-4"
      >
        {auth.isLoading ? 'Memproses...' : 'Masuk'}
      </Button>
    </form>
  );
};