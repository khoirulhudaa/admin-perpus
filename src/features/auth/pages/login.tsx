import { APP_CONFIG } from '@/core/configs';
import { Button, Input, Label, VokadashHead } from '@/core/libs';
import { InputSecure, useAlert } from '@/features/_global';
import { FormEventHandler, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock } from 'lucide-react'; 
import axios from 'axios'; // Pastikan axios terinstall

export const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();
  
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');

  // --- State Fitur Hidden Maintenance ---
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isMaintenanceLoading, setIsMaintenanceLoading] = useState(false);

  // --- Keyboard Shortcut Logic (Alt+M+O & Alt+M+C) ---
  useEffect(() => {
    const keysPressed: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.code] = true;

      // ALT + M + O (Open)
      if (e.altKey && keysPressed['KeyM'] && keysPressed['KeyO']) {
        e.preventDefault();
        setShowSecretModal(true);
      }

      // ALT + M + C (Close)
      if (e.altKey && keysPressed['KeyM'] && keysPressed['KeyC']) {
        e.preventDefault();
        setShowSecretModal(false);
        setPasscode('');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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

  // --- Maintenance Action Logic ---
  const handleMaintenance = async (type: 'activate' | 'deactivate') => {
    if (passcode !== 'HIDDENSCHOOL') {
      alert.error('Kata kunci salah!');
      return;
    }

    setIsMaintenanceLoading(true);
    try {
      const endpoint = type === 'deactivate' 
        ? '/auth/maintenance/deactivate' 
        : '/auth/maintenance/activate';

      await axios.post(`https://be-school.kiraproject.id${endpoint}`, { passcode });
      
      alert.success(`Aksi Berhasil: Status database telah diperbarui.`);
      setShowSecretModal(false);
      setPasscode('');
    } catch (err: any) {
      alert.error(err.response?.data?.message || 'Gagal memproses permintaan');
    } finally {
      setIsMaintenanceLoading(false);
    }
  };

  return (
    <div className="relative h-full">
      <form onSubmit={submit} className="space-y-6 flex flex-col justify-between bg-transparent h-full overflow-hidden">
        <VokadashHead>
          <title>{`Login | ${APP_CONFIG.appName}`}</title>
        </VokadashHead>

        <div className="space-y-6">
          {/* Input Identifier */}
          <div className="space-y-3">
            <Label className="text-blue-800 text-[14px] uppercase font-medium ml-1">
              Username atau Email
            </Label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:text-blue-600 transition-colors">
                <Mail size={18} />
              </div>
              <Input
                type="text"
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

      {/* --- HIDDEN MAINTENANCE MODAL --- */}
      {showSecretModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-blue-900/20 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white border-2 border-blue-500 p-6 rounded-2xl w-full max-w-xs shadow-2xl">
            <div className="text-center mb-4">
              <h2 className="text-blue-900 font-bold text-lg">System Console</h2>
              <p className="text-blue-600 text-[10px] uppercase tracking-widest mt-1">Admin Override Mode</p>
            </div>
            
            <input
              type="password"
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter Passcode"
              className="w-full h-10 bg-blue-50 border-2 border-blue-200 rounded-lg px-3 text-blue-900 text-sm mb-4 focus:outline-none focus:border-blue-500 transition-all"
            />

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleMaintenance('deactivate')}
                disabled={isMaintenanceLoading}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase rounded-lg transition-all shadow-md"
              >
                {isMaintenanceLoading ? 'Executing...' : 'Deactivate & Hide'}
              </button>
              <button
                onClick={() => handleMaintenance('activate')}
                disabled={isMaintenanceLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase rounded-lg transition-all shadow-md"
              >
                Restore Status
              </button>
              <p className="mt-4 text-[9px] text-blue-400 text-center font-medium">
                PRESS ALT + M + C TO CANCEL
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};