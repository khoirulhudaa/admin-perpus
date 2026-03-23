// import { ArrowLeft, Loader2, Mail, Monitor, QrCode } from 'lucide-react';
// import { QRCodeCanvas } from 'qrcode.react';
// import { FormEventHandler, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import { v4 as uuidv4 } from 'uuid';

// // Konfigurasi Library Internal Vokadash
// import { APP_CONFIG } from '@/core/configs';
// import { Button, Input, Label, VokadashHead } from '@/core/libs';
// import { InputSecure, useAlert } from '@/features/_global';
// import { useAuth } from '../hooks/useAuth';
// import { saveToken } from '../utils';

// // Inisialisasi Socket
// const socket = io("https://be-school.kiraproject.id");

// export const LoginPage = () => {
//   const navigate = useNavigate();
//   const auth = useAuth();
//   const alert = useAlert();

//   // --- State ---
//   const [loginMethod, setLoginMethod] = useState<'manual' | 'qr'>('manual');
//   const [sessionId] = useState(uuidv4());
//   const [isQrAuthenticated, setIsQrAuthenticated] = useState(false);
//   const [identifier, setIdentifier] = useState('');
//   const [password, setPassword] = useState('');

//   // --- Socket Logic ---
//   useEffect(() => {
//     if (loginMethod === 'qr') {
//       socket.emit('join-login-room', sessionId);
//       console.log('ok', sessionId)

//       const handleLoginSuccess = (data: any) => {
//         setIsQrAuthenticated(true);
//         console.log('DATA LOGIN QR:', data)
//         saveToken(data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         localStorage.setItem('user_profile', JSON.stringify(data.user));
//         localStorage.setItem('token', data.token);

//         alert.success('Login Berhasil!');
//         setTimeout(() => navigate('/'), 1500);
//       };

//       socket.on('login-success', handleLoginSuccess);
//       return () => { socket.off('login-success', handleLoginSuccess); };
//     }
//   }, [loginMethod, sessionId, navigate, alert]);

//   // --- Manual Login Logic ---
//   const handleManualSubmit: FormEventHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await auth.login({ email: identifier, password });
//       if (res.data.token) {
//         localStorage.setItem('token', res.data.token);
//         alert.success('Login berhasil!');
//         setTimeout(() => navigate('/', { replace: true }), 300);
//       }
//     } catch (err: any) {
//       alert.error(err.response?.data?.message || 'Login gagal');
//     }
//   };

//   return (
//     <div className="relative w-full h-full flex flex-col items-center justify-center">
//       <VokadashHead>
//         <title>{`Login | ${APP_CONFIG.appName}`}</title>
//       </VokadashHead>

//       {/* ==========================================
//           METODE MANUAL (TAMPILAN STANDAR)
//       ========================================== */}
//       {loginMethod === 'manual' && (
//         <div className="w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//           <div className="mb-10 text-center">
//             <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight">Selamat Datang</h2>
//             <p className="text-sm text-slate-500 mt-2 font-medium">Masuk ke Sistem Perpustakaan Digital</p>
//           </div>

//           {/* Switcher */}
//           <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200">
//             <button 
//               onClick={() => setLoginMethod('manual')} 
//               className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white text-blue-600 shadow-sm border border-slate-200 flex items-center justify-center gap-2"
//             >
//               <Mail size={14} /> Manual
//             </button>
//             <button 
//               onClick={() => setLoginMethod('qr')} 
//               className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 flex items-center justify-center gap-2"
//             >
//               <QrCode size={14} /> QR Scan
//             </button>
//           </div>

//           <form onSubmit={handleManualSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Username / Email</Label>
//               <Input
//                 type="text"
//                 placeholder="name@school.id"
//                 required
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 className="h-12 pl-4 border-slate-200 rounded-xl w-full"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Kata Sandi</Label>
//               <InputSecure
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="h-12 pl-4 border-slate-200 rounded-xl w-full"
//               />
//             </div>
//             <Button type="submit" disabled={auth.isLoading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-4">
//               {auth.isLoading ? <Loader2 className="animate-spin mr-2" /> : 'MASUK SEKARANG'}
//             </Button>
//           </form>
//         </div>
//       )}

//       {/* ==========================================
//           METODE QR (FULL SCREEN OVERLAY)
//           Menghilangkan semua elemen lain agar pas tengah
//       ========================================== */}
//       {loginMethod === 'qr' && (
//         <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          
//           {/* Tombol Kembali Absolut */}
//           <button 
//             onClick={() => setLoginMethod('manual')}
//             className="absolute top-8 left-8 p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-all active:scale-90 flex items-center gap-2 pr-5"
//           >
//             <ArrowLeft size={20} />
//             <span className="text-sm font-bold">Kembali</span>
//           </button>

//           {/* QR Container - Fokus Utama */}
//           <div className="flex flex-col items-center justify-center w-full max-w-2xl">
//             <div className="relative group p-3 bg-gradient-to-tr from-blue-600 via-blue-400 to-cyan-300 rounded-[4rem] shadow-[0_20px_60px_-15px_rgba(37,99,235,0.3)] mb-12">
//               <div className="p-8 sm:p-12 bg-white rounded-[3.5rem] flex items-center justify-center border-4 border-white">
//                 <div className="w-64 h-64 sm:w-96 sm:h-96">
//                   <QRCodeCanvas
//                     value={sessionId}
//                     size={500}
//                     style={{ width: '100%', height: '100%' }}
//                     level="H"
//                     includeMargin={false}
//                     imageSettings={{
//                       src: "/logo-icon.png",
//                       height: 60,
//                       width: 60,
//                       excavate: true,
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Overlay Berhasil */}
//               {isQrAuthenticated && (
//                 <div className="absolute inset-0 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center rounded-[3.5rem] z-20 border-8 border-green-500 transition-all">
//                   <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
//                     <Monitor size={56} />
//                   </div>
//                   <h4 className="text-3xl font-black text-slate-800 uppercase tracking-[0.2em]">Terkoneksi!</h4>
//                   <p className="text-green-600 font-bold mt-2">MENGALIHKAN SISTEM...</p>
//                 </div>
//               )}
//             </div>

//             {/* Hint & Status di Bawah QR */}
//             <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 delay-300">
//               <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-600 rounded-full text-[12px] font-black uppercase tracking-[0.25em] border border-blue-100 shadow-sm">
//                 <span className="relative flex h-3 w-3">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
//                 </span>
//                 Sistem Siap Pindai
//               </div>
              
//               <div className="space-y-3">
//                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Login Otomatis Perpus</h3>
//                 <p className="text-base text-slate-500 max-w-[400px] mx-auto leading-relaxed">
//                   Buka menu <span className="text-blue-600 font-extrabold italic">"Scanner Login"</span> pada aplikasi mobile Anda dan arahkan kamera ke kode di atas.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Label Instansi / Watermark Bawah */}
//           <div className="absolute bottom-10 flex flex-col items-center opacity-40">
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Vokadash Security Bridge v3.0</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import { Loader2, Mail, Monitor, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import { Button, Input, Label } from '@/core/libs';
import { InputSecure, useAlert } from '@/features/_global';
import { useAuth } from '../hooks/useAuth';
import { saveToken } from '../utils';

const socket = io("https://be-school.kiraproject.id");

export const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();

  const [loginMethod, setLoginMethod] = useState<'manual' | 'qr'>('qr');
  const [sessionId] = useState(uuidv4());
  const [isQrAuthenticated, setIsQrAuthenticated] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (loginMethod === 'qr') {
      socket.emit('join-login-room', sessionId);
      const handleLoginSuccess = (data: any) => {
        setIsQrAuthenticated(true);
        saveToken(data.token);
        localStorage.setItem('token', data.token);
        alert.success('Akses Diberikan!');
        setTimeout(() => navigate('/'), 1200);
      };
      socket.on('login-success', handleLoginSuccess);
      return () => { socket.off('login-success', handleLoginSuccess); };
    }
  }, [loginMethod, sessionId, navigate, alert]);

  const handleManualSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.login({ email: identifier, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        alert.success('Selamat Datang!');
        setTimeout(() => navigate('/', { replace: true }), 300);
      }
    } catch (err: any) {
      alert.error(err.response?.data?.message || 'Kredensial salah');
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* <h2 className='font-bold text-slate-900 uppercase text-2xl mb-5'>Masuk E-Library</h2> */}
      {/* 1. Header & Switcher */}
      <div className="space-y-6">
        <div className="flex bg-slate-300/20 p-1 rounded-2xl border border-slate-200/50 shadow-inner">
          <button 
            onClick={() => setLoginMethod('manual')}
            className={`flex-1 flex uppercase items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition-all ${loginMethod === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-900 hover:text-slate-700'}`}
          >
            <Mail size={16} /> Akun E-Mail
          </button>
          <button 
            onClick={() => setLoginMethod('qr')}
            className={`flex-1 flex uppercase items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition-all ${loginMethod === 'qr' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-900 hover:text-slate-700'}`}
          >
            <QrCode size={16} /> QRCode Scan
          </button>
        </div>
      </div>

      {/* 2. Main Content Area (Manual vs QR) */}
      <div className="flex-1 flex flex-col justify-center py-6">
        {loginMethod === 'manual' ? (
          <form onSubmit={handleManualSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-bold text-slate-900 uppercase tracking-widest ml-1">Username / Email</Label>
              <Input
                placeholder="name@school.id"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-11 border-slate-400/60 text-slate-800 bg-slate-200/30 rounded-xl focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-bold text-slate-900 uppercase tracking-widest ml-1">Password</Label>
              <InputSecure
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 border-slate-400/60 text-slate-800 bg-slate-200/30 rounded-xl focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>
            <Button 
              type="submit" 
              disabled={auth.isLoading} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 mt-2"
            >
              {auth.isLoading ? <Loader2 className="animate-spin" /> : 'MASUK KE SISTEM'}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="relative group p-2 bg-white rounded-2xl shadow-xl border border-slate-100">
              <div className="w-36 h-36 md:w-44 md:h-44">
                <QRCodeCanvas
                  value={sessionId}
                  size={300}
                  style={{ width: '100%', height: '100%' }}
                  level="H"
                  imageSettings={{ src: "/logo-icon.png", height: 30, width: 30, excavate: true }}
                />
              </div>
              {isQrAuthenticated && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10 animate-in fade-in">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mb-2 animate-bounce">
                    <Monitor size={24} />
                  </div>
                  <p className="text-[10px] font-black text-green-600 tracking-widest">TERKONEKSI</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                <span className="relative flex h-2 w-2 top-[-1.5px]">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider">Ready to Scan</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Gunakan Scanner PRO pada <a className='text-blue-700 uppercase' href='https://presensi.kiraproject.id/' target='__blank'>web ini</a>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer / Note */}
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center opacity-60">
        <p className="text-[9px] text-center mx-auto w-full font-bold text-slate-900 uppercase tracking-widest italic">Powered by Xpresensi</p>
        <div className="flex gap-1.5">
          {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-300" />)}
        </div>
      </div>
    </div>
  );
};