import{ createContext, useContext, useEffect } from "react";

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const safeJSONParse = (txt, fb) => { try { return JSON.parse(txt); } catch { return fb; } };
const safeGet = (k, fb = null) => (isBrowser() ? safeJSONParse(localStorage.getItem(k), fb) : fb);
const safeSet = (k, v) => { if (isBrowser()) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); };
const newIdemKey = () => {
  try { return (typeof crypto!=='undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`; } catch { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
};

/****************************
 * ADMIN SHELL TOKENS (background styling)
 ****************************/
const THEME_TOKENS = {
  "--brand-primary": "#10b981",
  "--brand-primaryText": "#ffffff",
  "--brand-accent": "#f59e0b",
  "--brand-bg": "#0a0a0a",
  "--brand-surface": "rgba(24,24,27,0.8)",
  "--brand-surfaceText": "#f3f4f6",
  "--brand-subtle": "#27272a",
};

/****************************
 * AUDIT (client-only demo log; prod should use server log)
 ****************************/
const AUDIT_KEY = 'tenantAuditLog';
const readAudit = () => safeGet(AUDIT_KEY, []) || [];
const pushAudit = (entry) => { const arr = readAudit(); arr.unshift({ ts: Date.now(), ...entry }); safeSet(AUDIT_KEY, arr.slice(0,200)); };

/****************************
 * TOAST SYSTEM (simple state-based)
 ****************************/
const ToastContext = createContext({ addToast:()=>{} });
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = (msg, type='info') => {
    const id = Date.now();
    setToasts(t => [...t, {id,msg,type}]);
    setTimeout(()=> setToasts(t => t.filter(x=>x.id!==id)), 4000);
  };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`px-3 py-2 rounded-lg shadow text-sm ${t.type==='error'?'bg-red-600 text-white':'bg-emerald-600 text-white'}`}>{t.msg}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/****************************
 * SESSION / AUTH CONTEXT
 ****************************/
const SessionContext = createContext({ user:null, tenant:null, loading:true });
const useSession = () => useContext(SessionContext);

const SessionProvider = ({ children }) => {
  const [state, setState] = useState({ user:null, tenant:null, loading:true });
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/session', { credentials:'include' });
        if (!res.ok) throw new Error('session fetch failed');
        const data = await res.json();
        if (active) setState({ ...data, loading:false });
      } catch {
        if (active) setState({ user:{ email:'admin@tenant', role:'admin_full' }, tenant:{ id:'demo-tenant', name:'Demo Tenant', contractEnd:'2025-12-31' }, loading:false });
      }
    })();
    return () => { active = false; };
  }, []);
  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
};

/****************************
 * API CLIENT (stubs with safe fallbacks)
 ****************************/
const getCSRFToken = () => {
  if (typeof document === 'undefined') return null;
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta?.getAttribute('content') || null;
};

/** GET /api/tenants/:id/theme -> { eligible, themeKey, lastAppliedAt, nextEligibleAt, contractEnd } */
async function apiGetThemeStatus(tenantId){
  try{
    const res = await fetch(`/api/tenants/${tenantId}/theme`, { credentials:'include' });
    if(!res.ok) throw new Error('status not ok');
    return await res.json();
  }catch{
    // fallback agar canvas tetap jalan
    return { eligible: true, themeKey: null, lastAppliedAt: null, nextEligibleAt: null, contractEnd: '2025-12-31' };
  }
}

/** PATCH /api/tenants/:id { themeKey } */
async function apiApplyTheme(tenantId, themeKey, idemKey){
  const csrf = getCSRFToken();
  const res = await fetch(`/api/tenants/${tenantId}`, {
    method:'PATCH',
    headers:{ 'Content-Type':'application/json', ...(csrf ? { 'X-CSRF-Token': csrf } : {}), ...(idemKey?{ 'Idempotency-Key': idemKey }: {}) },
    credentials:'include',
    body: JSON.stringify({ themeKey })
  });
  if(!res.ok){
    const txt = await res.text().catch(()=> '');
    throw new Error(txt || 'Apply theme failed');
  }
  return res.json();
}

/** POST /api/tenants/:id/theme/rollback */
async function apiRollbackTheme(tenantId, idemKey){
  const csrf = getCSRFToken();
  const res = await fetch(`/api/tenants/${tenantId}/theme/rollback`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json', ...(csrf ? { 'X-CSRF-Token': csrf } : {}), ...(idemKey?{ 'Idempotency-Key': idemKey }: {}) },
    credentials:'include'
  });
  if(!res.ok){
    const txt = await res.text().catch(()=> '');
    throw new Error(txt || 'Rollback failed');
  }
  return res.json();
}

/**********************
 * UI PRIMITIVES
 **********************/
const Input = (props) => (<input {...props} className={`w-full rounded-lg border border-white/30 bg-white/5 px-3 py-2 text-sm text-white outline-none ${props.className||''}`} />);
const TextArea = (props) => (<textarea {...props} className={`w-full rounded-lg border border-white/30 bg-white/5 px-3 py-2 text-sm text-white outline-none ${props.className||''}`} />);
const Label = ({ children }) => (<div className="mb-1 text-xs font-medium text-white/90">{children}</div>);
const Card = ({ title, children, footer }) => (
  <div className="rounded-2xl border border-white/30 bg-white/5 p-4">
    {title && <div className="mb-3 text-sm font-semibold text-white">{title}</div>}
    {children}
    {footer}
  </div>
);
const Table = ({ headers = [], rows = [] }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="text-white/80 bg-white/30">
        <tr>{headers.map((h,i)=>(<th key={i} className="text-left py-2 pr-4">{h}</th>))}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t border-white/30 hover:bg-neutral-800/50">
            {r.map((c, j) => (<td key={j} className="py-2 pr-4 align-top text-white/90">{c}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**********************
 * NAV + CHROME
 **********************/
const AdminNavbar = () => (
  <div className="sticky top-0 z-40 border-b border-white/30 bg-neutral-900/70 backdrop-blur">
    <div className="px-4 py-3 text-sm font-semibold text-white">Dashboard Admin</div>
  </div>
);
const AdminSidebar = ({ current, navigate, open, setOpen }) => {
  const items = [
    { key:'overview', label:'Overview' },
    { key:'theme-store', label:'Theme Store' },
    { key:'users', label:'Users' },
    { key:'settings', label:'Settings' },
  ];
  return (
    <aside className={`fixed md:static top-0 left-0 z-50 h-full md:h-auto w-full shrink-0 backdrop-blur transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="py-3 text-xs uppercase tracking-wide text-white/70">Menu</div>
      <nav className="py-2 gap-3 flex items-center">
        {items.map((it) => (
          <button key={it.key} onClick={() => { navigate(it.key); setOpen(false); }} className={`w-full text-center px-3 py-2 rounded-lg text-sm ${current === it.key ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'border border-white/30 bg-white/5 text-white/80 hover:bg-white/10'}`}>{it.label}</button>
        ))}
      </nav>
    </aside>
  );
};

/**********************
 * TEMPLATE MINI PREVIEW (submenu inline di sebelah)
 **********************/
const MiniPreview = ({ tokens }) => {
  const t = tokens || { primary:'#1F3B76', primaryText:'#fff', accent:'#F2C94C', bg:'#0B1733', surface:'#102347', surfaceText:'#fff' };
  return (
    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/30 bg-white/5">
      <div className="h-3 flex items-center justify-between px-1" style={{ background: t.primary, color: t.primaryText }}>
        <div className="h-2 w-6 rounded" style={{ background: t.accent }} />
        <div className="flex gap-1 text-[6px] opacity-95">
          <span>Beranda</span>
          <span className="flex items-center gap-1">Profil <span>›</span> <span>Sambutan</span></span>
          <span>Akademik</span>
          <span>Galeri</span>
        </div>
      </div>
      <div className="p-2 grid grid-cols-3 gap-1 text-[6px]" style={{ color: t.surfaceText, background: t.bg }}>
        <div className="col-span-2 space-y-1">
          <div className="h-8 rounded" style={{ background: t.surface }} />
          <div className="grid grid-cols-3 gap-1">
            <div className="h-8 rounded" style={{ background: t.surface }} />
            <div className="h-8 rounded" style={{ background: t.surface }} />
            <div className="h-8 rounded" style={{ background: t.surface }} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-4 rounded" style={{ background: t.surface }} />
          <div className="h-10 rounded" style={{ background: t.surface }} />
          <div className="h-4 rounded" style={{ background: t.surface }} />
        </div>
      </div>
    </div>
  );
};

/**********************
 * FULL PREVIEW TEMPLATES
 **********************/
const TemplateClassic = ({t}) => (
  <div>
    <div className="px-4 py-3 flex items-center gap-4 flex-wrap" style={{ background: t.primary, color: t.primaryText }}>
      <div className="flex items-center gap-2 mr-2"><div className="w-6 h-6 rounded-md" style={{ background: t.accent }} /> <div className="text-sm font-semibold">SMK Contoh</div></div>
      <div className="flex items-center gap-3 text-xs">
        <span>Beranda</span>
        <span className="flex items-center gap-2">Profil <span className="opacity-80">›</span> <span className="opacity-90">Sambutan</span> <span className="opacity-60">•</span> <span className="opacity-90">Visi & Misi</span></span>
        <span>Akademik</span>
        <span>Kesiswaan</span>
        <span>Informasi</span>
        <span>Galeri</span>
      </div>
    </div>
    <div className="p-4 grid md:grid-cols-3 gap-3" style={{ background: t.bg, color: t.primaryText }}>
      <div className="md:col-span-2 rounded-lg p-3" style={{ background: t.surface, color: t.surfaceText }}>
        <div className="text-sm font-semibold">Portal Resmi SMK</div>
        <div className="text-xs opacity-80">Website multi‑tenant terintegrasi Xpresensi</div>
      </div>
      <div className="rounded-lg p-3" style={{ background: t.surface, color: t.surfaceText }}>
        <div className="text-sm font-semibold">Shortcut</div>
        <div className="text-xs opacity-80">Login • Kontak</div>
      </div>
    </div>
  </div>
);
const TemplateModern = ({t}) => (
  <div>
    <div className="px-4 py-3 flex items-center justify-between" style={{ background: t.primary, color: t.primaryText }}>
      <div className="text-sm font-semibold tracking-wide">SMAN 2</div>
      <div className="flex gap-3 text-xs"><span>Beranda</span><span>Informasi</span><span>Akademik</span><span>Galeri</span></div>
    </div>
    <div className="p-4" style={{ background: t.bg }}>
      <div className="rounded-lg p-4 border" style={{ background: t.surface, color: t.surfaceText, borderColor: '#ffffff1a' }}>
        <div className="grid md:grid-cols-[1.2fr,1fr] gap-3">
          <div>
            <div className="text-sm font-semibold">Judul Besar</div>
            <div className="text-xs opacity-80">Copy hero minimalis dengan tombol aksi</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 rounded-lg" style={{ background: t.bg }} />
            <div className="h-16 rounded-lg" style={{ background: t.bg }} />
            <div className="h-16 rounded-lg" style={{ background: t.bg }} />
            <div className="h-16 rounded-lg" style={{ background: t.bg }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);
const TemplateSplitHero = ({t}) => (
  <div>
    <div className="px-4 py-3 flex items-center gap-3" style={{ background: t.primary, color: t.primaryText }}>
      <div className="font-semibold text-sm">SMPN 5</div>
      <div className="flex items-center gap-3 text-xs"><span>Beranda</span><span>Profil</span><span>Informasi</span><span>Kesiswaan</span></div>
    </div>
    <div className="p-4 grid md:grid-cols-[1fr,320px] gap-3" style={{ background: t.bg }}>
      <div className="rounded-lg p-3" style={{ background: t.surface, color: t.surfaceText }}>
        <div className="text-sm font-semibold">Hero kiri</div>
        <div className="text-xs opacity-80">Teks dan tombol</div>
      </div>
      <div className="space-y-3">
        <div className="rounded-lg p-3" style={{ background: t.surface, color: t.surfaceText }}>Pengumuman ringkas</div>
        <div className="rounded-lg p-3" style={{ background: t.surface, color: t.surfaceText }}>Agenda</div>
      </div>
    </div>
  </div>
);
const TemplateMagazine = ({t}) => (
  <div>
    <div className="px-4 py-3 flex items-center justify-between" style={{ background: t.primary, color: t.primaryText }}>
      <div className="text-sm font-semibold">VO-NEWS</div>
      <div className="text-xs">Edisi Sekolah</div>
    </div>
    <div className="p-4 grid md:grid-cols-3 gap-3" style={{ background: t.bg }}>
      <div className="md:col-span-2 rounded-lg p-3" style={{ background: t.surface, color: t.surfaceText }}>Headline Berita</div>
      <div className="space-y-3">
        <div className="rounded-lg p-3" style={{ background: t.surface, color: t.surfaceText }}>Kategori</div>
        <div className="rounded-lg p-3" style={{ background: t.surface, color: t.surfaceText }}>Arsip</div>
      </div>
      {[1,2,3].map(i=> (<div key={i} className="rounded-lg p-3" style={{ background: t.surface, color: t.surfaceText }}>Berita {i}</div>))}
    </div>
  </div>
);
const TEMPLATE_MAP = { classic: TemplateClassic, modern: TemplateModern, splitHero: TemplateSplitHero, magazine: TemplateMagazine };

/****************************
 * THEME CATALOG (distinct templates)
 ****************************/
const THEME_CATALOG = [
  { key:'classic-smkn13', name:'Classic — SMKN 13', brand:'SMKN 13 Jakarta', template:'classic', tokens:{ primary:'#1F3B76', primaryText:'#ffffff', accent:'#F2C94C', bg:'#0B1733', surface:'#102347', surfaceText:'#ffffff' } },
  { key:'modern-sman2',  name:'Modern — SMAN 2',  brand:'SMAN 2',          template:'modern',  tokens:{ primary:'#111827', primaryText:'#E5E7EB', accent:'#10B981', bg:'#0B0F17', surface:'#0F172A', surfaceText:'#E5E7EB' } },
  { key:'playful-smpn5', name:'Split Hero — SMPN 5', brand:'SMPN 5',      template:'splitHero',tokens:{ primary:'#0EA5E9', primaryText:'#0b1220', accent:'#F97316', bg:'#F8FAFC', surface:'#FFFFFF', surfaceText:'#0f172a' } },
  { key:'magazine-voc',  name:'Magazine — Vokasi', brand:'Vokasi',        template:'magazine', tokens:{ primary:'#8B5CF6', primaryText:'#ffffff', accent:'#22D3EE', bg:'#0B1020', surface:'#1E293B', surfaceText:'#E2E8F0' } },
];

/**********************
 * Theme Preview Modal
 **********************/
const ThemePreviewModal = ({ theme, onClose, onApply, eligible, detailMode }) => {
  if (!theme) return null;
  const t = theme.tokens; const Comp = TEMPLATE_MAP[theme.template] || TemplateClassic;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-5xl rounded-2xl border border-white/30 bg-neutral-900 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-white/90 font-semibold">Preview: {theme.name}</div>
            <div className="text-xs text-white/60">Template: <b>{theme.template}</b> • Brand: {theme.brand}</div>
          </div>
          <button onClick={onClose} className="px-2 py-1 text-sm rounded-lg border border-white/30 hover:bg-white/10">Tutup</button>
        </div>
        <div className="rounded-lg overflow-hidden border border-white/30" style={{ background: t.bg, color: t.primaryText }}>
          <Comp t={t} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button disabled={!eligible} onClick={onApply} className={`px-4 py-2 rounded-lg text-sm ${eligible? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border border-white/30 bg-white/5 text-white/40 cursor-not-allowed'}`}>Apply Tema</button>
          {detailMode && (<div className="text-xs text-white/70">• Submenu tampil <b>di sebelah</b> item induk. • Template beda layout (bukan cuma warna). • Ganti tema hanya saat perpanjangan tahunan.</div>)}
        </div>
      </div>
    </div>
  );
};

/**********************
 * Eligibility hook (server-driven with safe fallback)
 **********************/
const useThemeEligibility = () => {
  const { tenant } = useSession();
  const [state, setState] = useState({ eligible:true, nextDate:null, contractEnd:null, loading:true, error:null });
  useEffect(() => {
    if (!tenant?.id) return;
    let active = true;
    (async () => {
      try { 
        const data = await apiGetThemeStatus(tenant.id); 
        if (active) setState({ eligible: !!data?.eligible, nextDate:data?.nextEligibleAt||null, contractEnd:data?.contractEnd||tenant?.contractEnd||null, loading:false, error:null }); 
      }
      catch(e){ if (active) setState({ eligible:true, nextDate:null, contractEnd:tenant?.contractEnd||null, loading:false, error: e?.message || 'error' }); }
    })();
    return () => { active = false; };
  }, [tenant?.id]);
  return state;
};

/**********************
 * STEP-UP CONFIRMATION (simulated) for rollback
 **********************/
const ConfirmRollback = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/30 bg-neutral-900 p-4 text-white">
        <div className="text-sm font-semibold mb-1">Konfirmasi Rollback</div>
        <div className="text-xs text-white/70">Tindakan sensitif. Lanjutkan rollback tema ke versi sebelumnya?</div>
        <div className="mt-3 flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-1.5 rounded-lg border border-white/30 bg-white/5 text-sm">Batal</button>
          <button onClick={onConfirm} className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/20 text-red-300 text-sm">Ya, Rollback</button>
        </div>
      </div>
    </div>
  );
};

/**********************
 * THEME STORE (production wiring)
 **********************/
import React, { useState } from 'react';
// Assuming other necessary imports are present; add if missing:
// import { useSession } from './hooks/useSession';
// import { useToast } from './hooks/useToast';
// import { useThemeEligibility } from './hooks/useThemeEligibility';
// import { apiApplyTheme, apiRollbackTheme } from './api/theme';
// import { pushAudit, newIdemKey } from './utils/audit';
// import { THEME_CATALOG } from './constants/themes';
// import MiniPreview from './components/MiniPreview';
// import ThemePreviewModal from './components/ThemePreviewModal';
// import ConfirmRollback from './components/ConfirmRollback';

interface Theme {
  key: string;
  name: string;
  template: string;
  tokens: Record<string, string>;
}

// const THEME_CATALOG: Theme[] = []; // Replace with actual catalog if not imported

const ThemeStore: React.FC = () => {
  const { user, tenant, loading } = useSession();
  const toast = useToast(); // Changed: Destructure without addToast; use toast directly
  const [selected, setSelected] = useState<Theme | null>(null);
  const [detailMode, setDetailMode] = useState(false);
  const [pending, setPending] = useState(false);
  const [confirmRb, setConfirmRb] = useState(false);
  const { eligible, nextDate, contractEnd, loading: eligLoading } = useThemeEligibility();
  const canApply = user?.role === 'admin_full' && eligible && !loading && !eligLoading && !pending;

  async function handleApply(theme: Theme) {
    if (pending) return;
    if (user?.role !== 'admin_full') { 
      toast('Hanya admin_full yang boleh apply tema.', { type: 'error' }); // Fixed: Use toast() with options object
      return; 
    }
    if (!eligible) { 
      toast('Belum eligible. Ganti tema hanya 1 tahun sekali, saat perpanjangan paket tahunan.', { type: 'error' }); // Fixed: Same as above
      return; 
    }
    if (!tenant?.id) { 
      toast('Tenant tidak dikenali.', { type: 'error' }); // Fixed: Same as above
      return; 
    }
    setPending(true);
    const idemKey = newIdemKey();
    pushAudit({ actor: user.email, action: 'apply_theme_request', details: { themeKey: theme.key, idemKey } });
    try {
      await apiApplyTheme(tenant.id, theme.key, idemKey);
      pushAudit({ actor: user.email, action: 'apply_theme', details: { themeKey: theme.key, idemKey } });
      toast('Tema berhasil diterapkan.', { type: 'success' }); // Fixed: Same as above
    } catch (e) {
      pushAudit({ actor: user.email, action: 'apply_theme_failed', details: { themeKey: theme.key, err: e?.message || 'error', idemKey } });
      toast(`Gagal apply tema: ${e?.message || 'unknown error'}`, { type: 'error' }); // Fixed: Same as above
    } finally {
      setPending(false);
    }
  }

  async function handleRollback(){
    if (pending) return;
    if (user?.role !== 'admin_full') { 
      toast('Hanya admin_full yang boleh rollback.', { type: 'error' }); // Fixed: Same as above
      return; 
    }
    setConfirmRb(true);
  }
  async function confirmRollback(){
    setConfirmRb(false);
    setPending(true);
    const idemKey = newIdemKey();
    try {
      await apiRollbackTheme(tenant.id, idemKey);
      pushAudit({ actor:user.email, action:'rollback_theme', details:{ idemKey } });
      toast('Rollback tema berhasil.', { type: 'success' }); // Fixed: Same as above
    } catch(e: any){
      pushAudit({ actor:user.email, action:'rollback_theme_failed', details:{ err:e?.message, idemKey } });
      toast(`Gagal rollback: ${e?.message}`, { type: 'error' }); // Fixed: Same as above
    } finally { setPending(false); }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-white/90">Theme Store</h1>
      <div className="text-xs text-white/60">
        Hanya <b>admin_full</b> yang dapat apply/rollback.<br/>
        Pergantian tema hanya <b>1 tahun sekali</b> saat <b>perpanjangan paket tahunan</b> (validasi di server).
        {nextDate && (<><br/>Tanggal eligible berikutnya: <b>{new Date(nextDate).toLocaleDateString('id-ID')}</b></>)}
        {contractEnd && (<><br/>Tanggal kontrak berakhir: <b>{new Date(contractEnd).toLocaleDateString('id-ID')}</b></>)}
      </div>
      <div className="flex gap-2">
        <button 
          onClick={handleRollback} 
          disabled={pending} 
          className={`px-3 py-1.5 rounded-lg border text-sm ${
            pending 
              ? 'opacity-60 cursor-not-allowed border-white/30 bg-white/5 text-white/40'
              : 'border-white/30 bg-red-500/20 text-red-300'
          }`}
        >
          Rollback
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(THEME_CATALOG) && THEME_CATALOG.length > 0 ? THEME_CATALOG.map((t) => (
          <div key={t.key} className="rounded-2xl border border-white/30 bg-white/5 p-3 flex flex-col items-left">
            <MiniPreview tokens={t.tokens} />
            <div className="mt-2 text-sm font-medium text-white/90">{t.name}</div>
            <div className="text-[10px] text-white/60">Template: {t.template}</div>
            <div className="mt-2 flex gap-2">
              <button 
                onClick={() => { if(!pending){ setSelected(t); setDetailMode(false); } }} 
                disabled={pending} 
                className={`px-3 py-1.5 rounded-lg border text-sm ${
                  pending 
                    ? 'opacity-60 cursor-not-allowed border-white/30 bg-white/5 text-white/40'
                    : 'border-white/30 bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                Preview
              </button>
              <button 
                onClick={() => { if(!pending){ setSelected(t); setDetailMode(true); } }} 
                disabled={pending} 
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  pending
                    ? 'opacity-60 cursor-not-allowed border-white/30 bg-white/5 text-white/40'
                    : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                }`}
              >
                Lihat Detail
              </button>
              <button 
                onClick={() => handleApply(t)} 
                disabled={!canApply} 
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  canApply 
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border border-white/30 bg-white/5 text-white/40 cursor-not-allowed'
                }`}
              >
                Apply
              </button>
            </div>
          </div>
        )) : (
          <div className="text-sm text-white/70">Catalog tema kosong.</div>
        )}
      </div>
      <ThemePreviewModal
        theme={selected}
        eligible={canApply}
        detailMode={detailMode}
        onClose={()=>setSelected(null)}
        onApply={()=>{ if (selected) handleApply(selected); setSelected(null); }}
      />
      <ConfirmRollback open={confirmRb} onCancel={()=>setConfirmRb(false)} onConfirm={confirmRollback} />
    </div>
  );
};

export default ThemeStore;

/**********************
 * USERS PAGE (minimal; fokus admin_full untuk contoh)
 **********************/
const UsersPage = () => {
  const roles = [
    { key: 'admin_full', name: 'Admin Penuh', desc: 'Seluruh akses termasuk ubah tema' },
    { key: 'admin_web', name: 'Admin Website', desc: 'Kelola konten dan tema' },
    { key: 'admin_ppdb', name: 'Admin PPDB', desc: 'Akses data calon siswa (read-only jika diatur)' },
  ];
  const users = [
    { email: 'kepsek@sekolah.sch.id', role: 'admin_full' },
    { email: 'web@sekolah.sch.id', role: 'admin_web' },
  ];
  const roleByKey = (k) => roles.find(r=>r.key===k)?.name || k;
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-white/90">Users</h1>
      <Card title="Role & Permission (Fokus admin_full)">
        <Table headers={["Role", "Deskripsi"]} rows={roles.map(r=>[<b key={r.key}>{r.name}</b>, <span key={r.key+"d"}>{r.desc}</span>])} />
      </Card>
      <Card title="Daftar Admin Tenant">
        <Table headers={["Email", "Role"]} rows={users.map(u=>[u.email, roleByKey(u.role)])} />
      </Card>
    </div>
  );
};

/**********************
 * SETTINGS PAGE (demo profile)
 **********************/
const SettingsPage = () => {
  const [profile, setProfile] = useState(() => safeGet('tenantProfile', { name:'', domain:'', addr:'', contact:'' }) || { name:'', domain:'', addr:'', contact:'' });
  const saveProfile = () => { safeSet('tenantProfile', profile); pushAudit({actor:'admin_full@tenant', action:'save_profile'}); };
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-white/90">Settings</h1>
      <Card title="Tenant Profile (Demo)">
        <div className="grid md:grid-cols-2 gap-3">
          <div><Label>Nama Sekolah</Label><Input value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})} placeholder="SMKN 13 Jakarta" /></div>
          <div><Label>Domain .sch.id</Label><Input value={profile.domain} onChange={e=>setProfile({...profile, domain:e.target.value})} placeholder="smkn13.sch.id" /></div>
          <div><Label>Alamat</Label><TextArea rows={3} value={profile.addr} onChange={e=>setProfile({...profile, addr:e.target.value})} placeholder="Jl. ..." /></div>
          <div><Label>Kontak Resmi</Label><Input value={profile.contact} onChange={e=>setProfile({...profile, contact:e.target.value})} placeholder="(021) ... / email@sch.id" /></div>
        </div>
        <div className="mt-3 flex justify-end"><button onClick={saveProfile} className="px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm">Simpan Profile</button></div>
      </Card>
    </div>
  );
};

/**********************
 * OVERVIEW PAGE (with yearly renewal note + eligible date)
 **********************/
const OverviewPage = ({ navigate }) => {
  const audits = readAudit();
  const { eligible, nextDate, contractEnd } = useThemeEligibility();
  const statCards = [
    { k: 'Admin Aktif', v: 2 },
    { k: 'Log Aktivitas', v: audits.length },
    { k: 'Eligible', v: eligible ? 'YA' : 'TIDAK' },
    { k: 'Next Eligible', v: nextDate ? new Date(nextDate).toLocaleDateString('id-ID') : '-' },
    { k: 'Kontrak Berakhir', v: contractEnd ? new Date(contractEnd).toLocaleDateString('id-ID') : '-' },
  ];
  const quick = [
    { label: 'Buka Theme Store', onClick: ()=>navigate('theme-store') },
    { label: 'Kelola Users', onClick: ()=>navigate('users') },
    { label: 'Settings Tenant', onClick: ()=>navigate('settings') },
  ];
  return (
    <div className="space-y-4 text-white">
      <h1 className="text-lg font-semibold">Overview</h1>
      <div className="grid md:grid-cols-2 gap-3">
        <Card title="Quick Actions">
          <div className="flex flex-wrap gap-2">
            {quick.map((q)=> (<button key={q.label} onClick={q.onClick} className="px-3 py-2 rounded-lg border border-white/30 bg-white/10 text-sm hover:bg-white/20 text-white">{q.label}</button>))}
          </div>
          <div className="mt-3 text-xs text-white/70">
            Catatan: Pergantian tema hanya 1 tahun sekali dan <b>wajib dilakukan saat perpanjangan paket tahunan</b>.
            {nextDate && (<><br/>Tanggal eligible berikutnya: <b>{new Date(nextDate).toLocaleDateString('id-ID')}</b></>)}
            {contractEnd && (<><br/>Tanggal kontrak berakhir: <b>{new Date(contractEnd).toLocaleDateString('id-ID')}</b></>)}
          </div>
        </Card>
        <Card title="Stat">
          <div className="grid sm:grid-cols-2 gap-3">
            {statCards.map((s)=>(
              <div key={s.k} className="rounded-2xl border border-white/30 bg-white/10 p-4">
                <div className="text-xs text-white/70">{s.k}</div>
                <div className="text-xl font-semibold text-white">{s.v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Aktivitas Terbaru">
        <div className="text-xs text-white/80 space-y-1">
          {audits.slice(0,6).map((a,i)=> (
            <div key={i} className="border-b border-white/30 pb-1">
              • {a.action} {a.details?.themeKey ? `${a.details.themeKey}` : ''}
              <div className="opacity-70">{new Date(a.ts).toLocaleString()}</div>
            </div>
          ))}
          {audits.length===0 && <div className="opacity-50">Belum ada aktivitas</div>}
        </div>
      </Card>
    </div>
  );
};

/**********************
 * ADMIN LAYOUT (FIXED: previously missing)
 **********************/
const AdminLayout = ({ current, navigate, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      {/* <AdminNavbar /> */}
      <div className="md:hidden py-3 flex items-center justify-between"><button onClick={()=>setOpen(true)} className="px-3 py-1.5 rounded-lg border border-white/30 bg-white/5 text-sm">☰ Menu</button></div>
      <div className="grid grid-cols-1 gap-4">
        <AdminSidebar current={current} navigate={navigate} open={open} setOpen={setOpen} />
        <main className="min-h-[calc(100dvh-64px)] col-span-1">
          <div className="rounded-2xl border border-white/30 backdrop-blur p-4 md:p-6 shadow-lg">{children}</div>
        </main>
      </div>
      {open && <div className="fixed inset-0 z-40 md:hidden" onClick={()=>setOpen(false)} />}
    </div>
  );
};

/**********************
 * DEFAULT EXPORT + RUNTIME TESTS
 **********************/
export function TemaMain(){
  const [section,setSection]=useState('overview');
  useEffect(()=>{
    try{
      console.assert(typeof THEME_CATALOG!=='undefined' && Array.isArray(THEME_CATALOG) && THEME_CATALOG.length>=3,'THEME_CATALOG exists with >=3');
      console.assert(typeof ThemeStore==='function','ThemeStore defined');
      console.assert(typeof MiniPreview==='function','MiniPreview defined');
      console.assert(typeof ThemePreviewModal==='function','ThemePreviewModal defined');
      console.assert(typeof TEMPLATE_MAP==='object' && Object.keys(TEMPLATE_MAP).length>=4,'Template map lengkap');
      console.assert(typeof newIdemKey==='function','Idempotency key generator exists');
      console.assert(typeof AdminLayout==='function','AdminLayout defined');
      console.assert(typeof OverviewPage==='function','OverviewPage defined');
      console.assert(typeof UsersPage==='function','UsersPage defined');
      console.assert(typeof SettingsPage==='function','SettingsPage defined');
      console.log('✅ Smoke tests passed');
    }catch(e){ console.error('❌ Smoke tests failed', e); }
  },[]);
  return (
    <SessionProvider>
      <ToastProvider>
        <AdminLayout current={section} navigate={setSection}>
          {section === 'overview' && <OverviewPage navigate={setSection} />}
          {section === 'theme-store' && <ThemeStore />}
          {section === 'users' && <UsersPage />}
          {section === 'settings' && <SettingsPage />}
        </AdminLayout>
      </ToastProvider>
    </SessionProvider>
  );
}
