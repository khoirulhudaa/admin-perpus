// import { APP_CONFIG } from '@/core/configs';
// import { Button, Input, Label, VokadashHead } from '@/core/libs';
// import { InputSecure, useAlert } from '@/features/_global';
// import { FormEventHandler, useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import { Mail, Lock } from 'lucide-react'; 
// import axios from 'axios'; // Pastikan axios terinstall

// export const LoginPage = () => {
//   const navigate = useNavigate();
//   const auth = useAuth();
//   const alert = useAlert();
  
//   const [identifier, setIdentifier] = useState(''); 
//   const [password, setPassword] = useState('');

//   // --- State Fitur Hidden Maintenance ---
//   const [showSecretModal, setShowSecretModal] = useState(false);
//   const [passcode, setPasscode] = useState('');
//   const [isMaintenanceLoading, setIsMaintenanceLoading] = useState(false);

//   // --- Keyboard Shortcut Logic (Alt+M+O & Alt+M+C) ---
//   useEffect(() => {
//     const keysPressed: { [key: string]: boolean } = {};

//     const handleKeyDown = (e: KeyboardEvent) => {
//       keysPressed[e.code] = true;

//       // ALT + M + O (Open)
//       if (e.altKey && keysPressed['KeyM'] && keysPressed['KeyO']) {
//         e.preventDefault();
//         setShowSecretModal(true);
//       }

//       // ALT + M + C (Close)
//       if (e.altKey && keysPressed['KeyM'] && keysPressed['KeyC']) {
//         e.preventDefault();
//         setShowSecretModal(false);
//         setPasscode('');
//       }
//     };

//     const handleKeyUp = (e: KeyboardEvent) => {
//       keysPressed[e.code] = false;
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   const submit: FormEventHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await auth.login({ email: identifier, password });
//       const token = res.data.token;

//       if (token) {
//         localStorage.setItem('token', token);
//         alert.success('Login berhasil!');
//         setTimeout(() => {
//           navigate('/', { replace: true });
//         }, 300);
//       } else {
//         alert.error('Gagal mendapatkan token dari server');
//       }
//     } catch (err: any) {
//       const msg = err.response?.data?.message || 'Akun atau password salah';
//       alert.error(msg);
//     }
//   };

//   // --- Maintenance Action Logic ---
//   const handleMaintenance = async (type: 'activate' | 'deactivate') => {
//     if (passcode !== 'HIDDENSCHOOL') {
//       alert.error('Kata kunci salah!');
//       return;
//     }

//     setIsMaintenanceLoading(true);
//     try {
//       const endpoint = type === 'deactivate' 
//         ? '/auth/maintenance/deactivate' 
//         : '/auth/maintenance/activate';

//       await axios.post(`https://be-school.kiraproject.id${endpoint}`, { passcode });
      
//       alert.success(`Aksi Berhasil: Status database telah diperbarui.`);
//       setShowSecretModal(false);
//       setPasscode('');
//     } catch (err: any) {
//       alert.error(err.response?.data?.message || 'Gagal memproses permintaan');
//     } finally {
//       setIsMaintenanceLoading(false);
//     }
//   };

//   return (
//     <div className="relative h-full">
//       <form onSubmit={submit} className="space-y-6 flex flex-col justify-between bg-transparent h-full overflow-hidden">
//         <VokadashHead>
//           <title>{`Login | ${APP_CONFIG.appName}`}</title>
//         </VokadashHead>

//         <div className="space-y-6">
//           {/* Input Identifier */}
//           <div className="space-y-3">
//             <Label className="text-blue-800 text-[14px] uppercase font-medium ml-1">
//               Username atau Email
//             </Label>
//             <div className="relative group">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:text-blue-600 transition-colors">
//                 <Mail size={18} />
//               </div>
//               <Input
//                 type="text"
//                 placeholder="Masukkan email atau username"
//                 autoComplete="email"
//                 required
//                 value={identifier}
//                 onChange={({ target: { value } }) => setIdentifier(value)}
//                 className="h-11 pl-10 bg-white/[0.03] border-blue-400 text-blue-900 placeholder:text-blue-900/30 border-2 focus:border-blue-500 focus:ring-0 transition-all rounded-xl w-full"
//               />
//             </div>
//           </div>

//           {/* Input Password */}
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <Label className="text-blue-800 text-[14px] uppercase font-medium ml-1">Kata Sandi</Label>
//               <Link to="/auth/forget-password" 
//                     className="text-[13px] uppercase text-blue-500 hover:text-blue-400 transition-colors">
//                 Lupa kata sandi?
//               </Link>
//             </div>
//             <div className="relative group">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:text-blue-600 transition-colors z-10">
//                 <Lock size={18} />
//               </div>
//               <InputSecure
//                 required
//                 autoComplete="current-password"
//                 value={password}
//                 onChange={({ target: { value } }) => setPassword(value)}
//                 placeholder="••••••••"
//                 className="h-11 pl-10 bg-white/[0.03] border-blue-400 text-blue-900 placeholder:text-blue-900/30 border-2 focus:border-blue-500 focus:ring-0 transition-all rounded-xl w-full"
//               />
//             </div>
//           </div>
//         </div>

//         <Button 
//           type="submit" 
//           disabled={auth.isLoading} 
//           className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/10 mt-4"
//         >
//           {auth.isLoading ? 'Memproses...' : 'Masuk'}
//         </Button>
//       </form>

//       {/* --- HIDDEN MAINTENANCE MODAL --- */}
//       {showSecretModal && (
//         <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-blue-900/20 backdrop-blur-md p-4 animate-in fade-in duration-300">
//           <div className="bg-white border-2 border-blue-500 p-6 rounded-2xl w-full max-w-xs shadow-2xl">
//             <div className="text-center mb-4">
//               <h2 className="text-blue-900 font-bold text-lg">System Console</h2>
//               <p className="text-blue-600 text-[10px] uppercase tracking-widest mt-1">Admin Override Mode</p>
//             </div>
            
//             <input
//               type="password"
//               autoFocus
//               value={passcode}
//               onChange={(e) => setPasscode(e.target.value)}
//               placeholder="Enter Passcode"
//               className="w-full h-10 bg-blue-50 border-2 border-blue-200 rounded-lg px-3 text-blue-900 text-sm mb-4 focus:outline-none focus:border-blue-500 transition-all"
//             />

//             <div className="flex flex-col gap-2">
//               <button
//                 onClick={() => handleMaintenance('deactivate')}
//                 disabled={isMaintenanceLoading}
//                 className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase rounded-lg transition-all shadow-md"
//               >
//                 {isMaintenanceLoading ? 'Executing...' : 'Deactivate & Hide'}
//               </button>
//               <button
//                 onClick={() => handleMaintenance('activate')}
//                 disabled={isMaintenanceLoading}
//                 className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase rounded-lg transition-all shadow-md"
//               >
//                 Restore Status
//               </button>
//               <p className="mt-4 text-[9px] text-blue-400 text-center font-medium">
//                 PRESS ALT + M + C TO CANCEL
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };



import { Loader2, Lock, Mail, Monitor, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

// Konfigurasi Library Internal Anda
import { APP_CONFIG } from '@/core/configs';
import { Button, Input, Label, VokadashHead } from '@/core/libs';
import { InputSecure, useAlert } from '@/features/_global';
import { useAuth } from '../hooks/useAuth';
import { saveToken } from '../utils';

// Inisialisasi Socket (Ganti dengan URL Backend Anda)
const socket = io("https://be-school.kiraproject.id");

export const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();

  // --- State Kendali UI ---
  const [loginMethod, setLoginMethod] = useState<'manual' | 'qr'>('manual');
  const [sessionId] = useState(uuidv4()); // ID Unik untuk Session QR ini
  const [isQrAuthenticated, setIsQrAuthenticated] = useState(false);

  // --- State Form Manual ---
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (loginMethod === 'qr') {
      socket.emit('join-login-room', sessionId);

      const handleLoginSuccess = (data: any) => {
        saveToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('user_profile', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setIsQrAuthenticated(true); // Tambahkan ini agar overlay "Terkoneksi" muncul

        alert.success('Login Berhasil!');
        setTimeout(() => navigate('/'), 1000);
      };

      socket.on('login-success', handleLoginSuccess);

      // CLEANUP FUNCTION
      return () => {
        socket.off('login-success', handleLoginSuccess);
      };
    }
  }, [loginMethod, sessionId]); // Tambahkan sessionId di dependency

  // --- Handle Login Manual ---
  const handleManualSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.login({ email: identifier, password });
      const token = res.data.token;

      if (token) {
        localStorage.setItem('token', token);
        alert.success('Login berhasil!');
        setTimeout(() => navigate('/', { replace: true }), 300);
      }
    } catch (err: any) {
      alert.error(err.response?.data?.message || 'Akun atau password salah');
    }
  };

  return (
    <div className="relative min-h-[500px] flex flex-col">
      <VokadashHead>
        <title>{`Login | ${APP_CONFIG.appName}`}</title>
      </VokadashHead>

      {/* Header Form */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">
          Selamat Datang
        </h2>
        <p className="text-sm text-slate-500">Silakan pilih metode masuk ke sistem</p>
      </div>

      {/* Tab Selector */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200">
        <button
          onClick={() => setLoginMethod('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            loginMethod === 'manual' 
            ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
            : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Mail size={16} />
          Manual
        </button>
        <button
          onClick={() => setLoginMethod('qr')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            loginMethod === 'qr' 
            ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
            : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <QrCode size={16} />
          QR Scan
        </button>
      </div>

      {/* Konten Utama */}
      <div className="flex-1">
        {loginMethod === 'manual' ? (
          /* --- FORM LOGIN MANUAL --- */
          <form onSubmit={handleManualSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Username / Email</Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <Input
                  type="text"
                  placeholder="name@school.id"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="h-12 pl-10 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label className="text-xs font-bold text-slate-500 uppercase">Kata Sandi</Label>
                <Link to="/auth/forget-password" nickname="lupa-sandi" className="text-xs text-blue-500 font-semibold hover:underline">
                  Lupa?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
                  <Lock size={18} />
                </div>
                <InputSecure
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 pl-10 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all w-full"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={auth.isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 mt-4 transition-all active:scale-[0.98]"
            >
              {auth.isLoading ? <Loader2 className="animate-spin mr-2" /> : 'MASUK SEKARANG'}
            </Button>
          </form>
        ) : (
          /* --- TAMPILAN QR LOGIN --- */
          <div className="flex flex-col items-center py-2 animate-in fade-in zoom-in duration-500 text-center">
            <div className="relative p-5 border-2 border-slate-100 rounded-[2.5rem] bg-white shadow-inner mb-6">
              <div className="p-3 bg-slate-50 rounded-[1.8rem]">
                <QRCodeCanvas
                  value={sessionId} // Scanner akan menangkap UUID ini
                  size={200}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/logo-icon.png", // Opsional: Tambahkan logo di tengah QR
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>

              {/* Overlay saat berhasil scan */}
              {isQrAuthenticated && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2.5rem] z-20">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 animate-bounce">
                    <Monitor size={32} />
                  </div>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Terkoneksi!</p>
                </div>
              )}
            </div>

            <div className="space-y-3 max-w-[280px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Waiting for scan
              </div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">Masuk Tanpa Mengetik</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Buka menu <span className="text-blue-600 font-bold italic">"Scanner Login"</span> pada aplikasi mobile Anda dan arahkan ke kode QR.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-12 pt-6 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400 uppercase tracking-widest font-medium">
          Official Library System &bull; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};