
import { motion } from "framer-motion";
import { Building2, ClipboardList, History, Inbox, Send } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// ---------- Utils ----------
function classNames(...a:any[]){ return a.filter(Boolean).join(" "); }
function pad(n:number, len=2){ return String(n).padStart(len,'0'); }
function formatNumber({ sekolah="SMKN-01", unit="TU", kode="421.5", jenis }:{ sekolah?:string; unit?:string; kode?:string; jenis:'SM'|'SK'|'DN'|'PM' }, seq:number, d=new Date()){
  const mm = pad(d.getMonth()+1,2); const yyyy=String(d.getFullYear());
  return `${sekolah}/${unit}/${kode}/${jenis}/${mm}/${yyyy}/${pad(seq,3)}`;
}
function yyyymm(d=new Date()){ return `${d.getFullYear()}${pad(d.getMonth()+1)}`; }
// Pipelines per jenis (status flow)
const PIPE_SK = ["Draf","Review","Menunggu TTD","Ditandatangani","Dikirim","Arsip"] as const;
const PIPE_DN = ["Draf","Dikirim","Menunggu Balasan","Selesai"] as const;
const PIPE_PM = ["Diajukan","Diproses","Selesai"] as const;
// Number Manager (per status, reset per bulan)
type Jenis = 'SM'|'SK'|'DN'|'PM';
function useNumberManager(){
  const [seqMap,setSeqMap] = useState<Record<string, number>>({});
  function key(jenis:Jenis,status:string,date=new Date()){ return `${jenis}:${status}:${yyyymm(date)}`; }
  function peekNext(jenis:Jenis,status:string,date=new Date()){ const k=key(jenis,status,date); return (seqMap[k]||0)+1; }
  function nextNumber(jenis:Jenis,status:string,date=new Date()){
    const k = key(jenis,status,date); const cur = (seqMap[k]||0)+1; setSeqMap(m=>({...m,[k]:cur}));
    return formatNumber({ jenis }, cur, date);
  }
  return { peekNext, nextNumber, seqMap };
}
// ---------- Mini UI ----------
function StatCard({ title, value, subtitle, tone }:{ title:string; value:string|number; subtitle?:string; tone?:'default'|'success'|'warning'|'danger' }){
  const toneClass = tone==='success'? 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 border-gray-200 dark:border-gray-700' : 
                    tone==='warning'? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400 border-gray-200 dark:border-gray-700' : 
                    tone==='danger'? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 border-gray-200 dark:border-gray-700' : 
                    'bg-theme-color-primary/5 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700';
  return (
    <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:0.25}} className={classNames('px-6 py-6 rounded-2xl border shadow-sm', toneClass)}>
      <div className="text-sm tracking-wide text-gray-600 dark:text-gray-400">{title}</div>
      <div className="mt-4 text-2xl font-semibold">{value}</div>
      {subtitle && <div className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</div>}
    </motion.div>
  );
}
function SimpleBar({ data }:{ data:any[] }){
  return (
    <div className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 pb-10 h-96">
      <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">Tren Dokumen per Tanggal</div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="date" className="text-gray-800 dark:text-white" /><YAxis allowDecimals={false} className="text-gray-800 dark:text-white"/><Tooltip/><Legend/>
          <Bar dataKey="jumlah" fill="#14B8A6" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
function SimplePie({ data, title }:{ data:any[]; title:string }){
  const COLORS = ["#14B8A6", "#22c55e", "#eab308", "#ef4444", "#8b5cf6", "#06b6d4"];
  return (
    <div className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 pb-10 h-96">
      <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">{title}</div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
            {data.map((_:any,i:number)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', border: 'none', color: '#1F2937' }} className="dark:bg-gray-800 dark:text-white"/><Legend/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
// function SimpleArea({ data }:{ data:any[] }){
//   return (
//     <div className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 h-max">
//       <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">Waktu Proses (jam)</div>
//       <ResponsiveContainer width="100%" height="100%">
//         <AreaChart data={data}>
//           <defs>
//             <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4}/>
//               <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
//             </linearGradient>
//           </defs>
//           <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
//           <XAxis dataKey="d" className="text-gray-800 dark:text-white" /><YAxis className="text-gray-800 dark:text-white"/><Tooltip contentStyle={{ backgroundColor: '#F9FAFB', border: 'none', color: '#1F2937' }} className="dark:bg-gray-800 dark:text-white"/>
//           <Area type="monotone" dataKey="jam" stroke="#14B8A6" fillOpacity={1} fill="url(#grad1)" />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
// ---------- Mock & Seeds ----------
function makeArea(){ const days=['Sen','Sel','Rab','Kam','Jum','Sab','Min']; return days.map(d=>({ d, jam: Math.floor(Math.random()*36)+2 })); }
function seedIncoming(){
  const status:["Terbuka","Diproses","Selesai"] = ["Terbuka","Diproses","Selesai"];
  return Array.from({length:8}).map((_,i)=>({
    nomor:`B-2025/SM/${String(120+i).padStart(4,'0')}`,
    tanggalTerima:`2025-08-${String(8+(i%20)).padStart(2,'0')}`,
    pengirim:["Dinas Pendidikan Kota","Komite Sekolah","RW 05","Polsek","Bank XYZ","Kemenag","Universitas ABC","Perpus Daerah"][i%8],
    perihal:["Undangan Rapat","Permohonan Data","Kerja Bakti","Himbauan Keamanan","Penawaran CSR","Sosialisasi","Magang","Bantuan Buku"][i%8],
    sifat:["Biasa","Penting","Sangat Penting"][i%3],
    lampiran:["undangan.pdf","format.xlsx","surat_rt.pdf","edaran.pdf","proposal.pdf","brosur.pdf","nota_dinas.pdf","daftar_buku.pdf"][i%8],
    disposisi:["Belum","Kepsek","Waka Kurikulum","Waka Sarpras","TU"][i%5],
    tujuan:["Kepala Sekolah","TU","Waka Kurikulum","Waka Sarpras"][i%4],
    batasWaktu:`2025-09-${String(2+(i%10)).padStart(2,'0')}`,
    status: status[i%status.length],
    tanggalDisposisi:`2025-08-${String(9+(i%15)).padStart(2,'0')}`,
    tanggalTindakLanjut:`2025-08-${String(12+(i%12)).padStart(2,'0')}`,
    tanggalSelesai:`2025-09-${String(1+(i%12)).padStart(2,'0')}`,
  }));
}
function seedOutgoing(){
  const tujuan=["Dinas Pendidikan Kota","Bank XYZ","Komite Sekolah","Polsek","Universitas ABC"];
  const perihal=["Laporan Bulanan","Permohonan Dana","Undangan Acara","Rekomendasi Siswa","Permohonan Kerjasama"];
  return Array.from({length:5}).map((_,i)=>({
    nomor:`K-2025/OUT/${String(200+i).padStart(4,'0')}`,
    tanggal:`2025-08-${String(10+i).padStart(2,'0')}`,
    tujuan: tujuan[i%tujuan.length],
    perihal: perihal[i%perihal.length],
    sifat:["Biasa","Penting","Sangat Penting"][i%3],
    lampiran:["laporan.pdf","proposal.pdf","undangan.pdf","rekomendasi.pdf","mou.pdf"][i%5],
    status: PIPE_SK[i%PIPE_SK.length],
    kodeJenis:'SK',
    history: [] as {status:string; nomor:string; tanggal:string}[]
  }));
}
function seedDinas(){
  return Array.from({length:4}).map((_,i)=>({
    id:`DN-2025-${String(i+1).padStart(3,'0')}`,
    nomor: formatNumber({jenis:'DN'}, i+1, new Date('2025-08-24')),
    tanggal: `2025-08-${String(14+i).padStart(2,'0')}`,
    tujuan:["Disdik Kota","Disdik Prov","BPKAD","Inspektorat"][i%4],
    perihal:["Usulan BOS","Rekomendasi Rehab","Laporan SPJ","Klarifikasi Temuan"][i%4],
    status: PIPE_DN[i%PIPE_DN.length],
    history: [] as {status:string; nomor:string; tanggal:string}[]
  }));
}
function seedPublicTU(){
  return Array.from({length:5}).map((_,i)=>({
    id:`PM-2025-${String(i+1).padStart(3,'0')}`,
    nomor: formatNumber({jenis:'PM'}, i+1, new Date('2025-08-24')),
    tanggal: `2025-08-${String(10+i).padStart(2,'0')}`,
    pelapor:["RW 05","Karang Taruna","Komite","Warga","Satpam"][i%5],
    judul:["Peminjaman Aula","Sampah Menumpuk","Lampu Jalan Padam","Parkir Liar","Kebisingan Malam"][i%5],
    status: PIPE_PM[i%PIPE_PM.length],
    history: [] as {status:string; nomor:string; tanggal:string}[]
  }));
}
// ---------- Tables & Forms ----------
function IncomingLettersTable({ rows }:{ rows:any[] }){
  return (
    <div className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-6 py-4">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"><div className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-white"><Inbox className="w-4 h-4 text-gray-600 dark:text-gray-400"/> Surat Masuk</div></div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-theme-color-primary/20 text-gray-600 dark:text-gray-400"><tr>
            <th className="px-4 py-2 text-left">No. Surat</th>
            <th className="px-4 py-2 text-left">Tgl Terima</th>
            <th className="px-4 py-2 text-left">Pengirim</th>
            <th className="px-4 py-2 text-left">Perihal</th>
            <th className="px-4 py-2 text-left">Sifat</th>
            <th className="px-4 py-2 text-left">Disposisi</th>
            <th className="px-4 py-2 text-left">Tujuan</th>
            <th className="px-4 py-2 text-left">Batas</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 font-mono text-xs text-gray-800 dark:text-white">{r.nomor}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.tanggalTerima}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.pengirim}</td>
                <td className="px-4 py-2 max-w-[280px] truncate text-gray-800 dark:text-white">{r.perihal}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.sifat}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.disposisi}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.tujuan}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.batasWaktu}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function HistoryBadge({ items }:{ items:{status:string; nomor:string; tanggal:string}[] }){
  if(!items||items.length===0) return <span className="text-gray-600 dark:text-gray-400">—</span>;
  return (
    <div className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
      <History className="w-3 h-3"/>
      <span>{items.length}x</span>
    </div>
  );
}
function OutgoingLetterForm({ onCreate, peekNext }:{ onCreate:(row:any)=>void; peekNext:(jenis:Jenis,status:string,date?:Date)=>number }){
  const [form,setForm]=useState({ tujuan:'Dinas Pendidikan Kota', perihal:'Laporan Bulanan', sifat:'Biasa', lampiran:'-', kodeSekolah:'SMKN-01', unit:'TU', kodeJenis:'SK' as Jenis, status:'Draf' });
  const nextSeq = peekNext(form.kodeJenis, form.status, new Date());
  const preview = formatNumber({ jenis:form.kodeJenis }, nextSeq);
  function submit(e:React.FormEvent){ e.preventDefault(); onCreate({ nomor: null, tanggal:new Date().toISOString().slice(0,10), tujuan:form.tujuan, perihal:form.perihal, sifat:form.sifat, lampiran:form.lampiran, status:form.status, kodeJenis:form.kodeJenis, history:[] }); }
  return (
    <form onSubmit={submit} className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-2">
      <div className="text-sm font-semibold mb-1 text-gray-800 dark:text-white">Buat Draft (SM/SK/DN/PM) — nomor akan terbit sesuai status</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={form.kodeJenis} onChange={e=>setForm({...form, kodeJenis:e.currentTarget.value as Jenis})}>
          <option value="SM">SM — Surat Masuk (registrasi)</option>
          <option value="SK">SK — Surat Keluar</option>
          <option value="DN">DN — Pengajuan ke Dinas</option>
          <option value="PM">PM — Pelayanan Masyarakat TU</option>
        </select>
        <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={form.status} onChange={e=>setForm({...form, status:e.currentTarget.value})}>
          {(form.kodeJenis==='SK'? PIPE_SK : form.kodeJenis==='DN' ? PIPE_DN : form.kodeJenis==='PM'? PIPE_PM : ['Registrasi']).map(s=> <option key={s}>{s}</option>)}
        </select>
        <div className="text-xs bg-theme-color-primary/20 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 flex items-center text-gray-800 dark:text-white">Preview Next: <span className="ml-2 font-mono">{preview}</span></div>
        <input className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white md:col-span-3" value={form.tujuan} onChange={e=>setForm({...form, tujuan:e.currentTarget.value})} placeholder="Tujuan / Penerima"/>
        <input className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white md:col-span-2" value={form.perihal} onChange={e=>setForm({...form, perihal:e.currentTarget.value})} placeholder="Perihal"/>
        <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={form.sifat} onChange={e=>setForm({...form, sifat:e.currentTarget.value})}><option>Biasa</option><option>Penting</option><option>Sangat Penting</option></select>
        <input className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white md:col-span-3" value={form.lampiran} onChange={e=>setForm({...form, lampiran:e.currentTarget.value})} placeholder="Lampiran (opsional)"/>
      </div>
      <div className="text-right">
        <button className="w-full mt-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md">Simpan Draft</button>
      </div>
    </form>
  );
}
function OutgoingLettersTable({ rows, onAdvance, nextLabel }:{ rows:any[]; onAdvance:(idx:number)=>void; nextLabel:(status:string, jenis:Jenis)=>string|null }){
  return (
    <div className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-6 py-4">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"><div className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-white"><Send className="w-4 h-4 text-gray-600 dark:text-gray-400"/> Surat Keluar / Terbit</div></div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-theme-color-primary/20 text-gray-600 dark:text-gray-400"><tr>
            <th className="px-4 py-2 text-left">No. Terakhir</th>
            <th className="px-4 py-2 text-left">Tanggal</th>
            <th className="px-4 py-2 text-left">Jenis</th>
            <th className="px-4 py-2 text-left">Tujuan</th>
            <th className="px-4 py-2 text-left">Perihal</th>
            <th className="px-4 py-2 text-left">Sifat</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Riwayat</th>
            <th className="px-4 py-2 text-left">Aksi</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 font-mono text-xs text-gray-800 dark:text-white">{r.nomor||'—'}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.tanggal||'—'}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.kodeJenis||'SK'}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.tujuan}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.perihal}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.sifat}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.status}</td>
                <td className="px-4 py-2"><HistoryBadge items={r.history}/></td>
                <td className="px-4 py-2">
                  {nextLabel(r.status, r.kodeJenis as Jenis) ? (
                    <button onClick={()=>onAdvance(i)} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700">{nextLabel(r.status, r.kodeJenis as Jenis)}</button>
                  ) : <span className="text-gray-600 dark:text-gray-400">(final)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function DinasForm({ onCreate, peekNext }:{ onCreate:(row:any)=>void; peekNext:(jenis:Jenis,status:string,date?:Date)=>number }){
  const [f,setF]=useState({ tujuan:'Disdik Kota', perihal:'Usulan BOS', lampiran:'-', status:'Draf' });
  const nextSeq = peekNext('DN', f.status); const preview = formatNumber({ jenis:'DN' }, nextSeq);
  function submit(e:React.FormEvent){ e.preventDefault(); onCreate({ id:`DN-LOCAL-${Date.now()}`, nomor:null, tanggal:new Date().toISOString().slice(0,10), tujuan:f.tujuan, perihal:f.perihal, status:f.status, lampiran:f.lampiran, history:[] }); }
  return (
    <form onSubmit={submit} className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
      <div className="text-sm font-semibold mb-1 text-gray-800 dark:text-white">Pengajuan ke Dinas (DN) — nomor per status</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={f.tujuan} onChange={e=>setF({...f, tujuan:e.currentTarget.value})} placeholder="Tujuan (Disdik/...)"/>
        <input className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white md:col-span-2" value={f.perihal} onChange={e=>setF({...f, perihal:e.currentTarget.value})} placeholder="Perihal"/>
        <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={f.status} onChange={e=>setF({...f, status:e.currentTarget.value})}>{PIPE_DN.map(s=> <option key={s}>{s}</option>)}</select>
      </div>
      <div className="md:flex md:items-center md:justify-between bg-theme-color-primary/20 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-xs text-gray-800 dark:text-white">
        <div>Preview Next: <span className="font-mono font-semibold">{preview}</span></div>
        <button className="mt-2 md:mt-0 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md">Simpan Draft</button>
      </div>
    </form>
  );
}
function DinasTable({ rows, onAdvance, nextLabel }:{ rows:any[]; onAdvance:(idx:number)=>void; nextLabel:(status:string, jenis:Jenis)=>string|null }){
  return (
    <div className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden px-6 py-4">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"><div className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-white"><Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400"/> Pengajuan ke Dinas</div></div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-theme-color-primary/20 text-gray-600 dark:text-gray-400"><tr>
            <th className="px-4 py-2 text-left">No./Ref (terakhir)</th>
            <th className="px-4 py-2 text-left">Tanggal</th>
            <th className="px-4 py-2 text-left">Tujuan</th>
            <th className="px-4 py-2 text-left">Perihal</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Riwayat</th>
            <th className="px-4 py-2 text-left">Aksi</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 font-mono text-xs text-gray-800 dark:text-white">{r.nomor||'—'}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.tanggal||'—'}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.tujuan}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.perihal}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.status}</td>
                <td className="px-4 py-2"><HistoryBadge items={r.history}/></td>
                <td className="px-4 py-2">
                  {nextLabel(r.status,'DN') ? (
                    <button onClick={()=>onAdvance(i)} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700">{nextLabel(r.status,'DN')}</button>
                  ) : <span className="text-gray-600 dark:text-gray-400">(final)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function PublicTUForm({ onCreate, peekNext }:{ onCreate:(row:any)=>void; peekNext:(jenis:Jenis,status:string,date?:Date)=>number }){
  const [f,setF]=useState({ pelapor:'RW 05', judul:'Peminjaman Aula', lampiran:'-', status:'Diajukan' });
  const nextSeq = peekNext('PM', f.status); const preview = formatNumber({ jenis:'PM' }, nextSeq);
  function submit(e:React.FormEvent){ e.preventDefault(); onCreate({ id:`PM-LOCAL-${Date.now()}`, nomor:null, tanggal:new Date().toISOString().slice(0,10), pelapor:f.pelapor, judul:f.judul, status:f.status, lampiran:f.lampiran, history:[] }); }
  return (
    <form onSubmit={submit} className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
      <div className="text-sm font-semibold mb-1 text-gray-800 dark:text-white">Pelayanan Masyarakat (PM) — nomor per status</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={f.pelapor} onChange={e=>setF({...f, pelapor:e.currentTarget.value})} placeholder="Pelapor"/>
        <input className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white md:col-span-2" value={f.judul} onChange={e=>setF({...f, judul:e.currentTarget.value})} placeholder="Judul"/>
        <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white/10 text-gray-800 dark:text-white" value={f.status} onChange={e=>setF({...f, status:e.currentTarget.value})}>{PIPE_PM.map(s=> <option key={s}>{s}</option>)}</select>
      </div>
      <div className="md:flex md:items-center md:justify-between bg-theme-color-primary/20 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-xs text-gray-800 dark:text-white">
        <div>Preview Next: <span className="font-mono font-semibold">{preview}</span></div>
        <button className="mt-2 md:mt-0 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md">Simpan Draft</button>
      </div>
    </form>
  );
}
function PublicTUTable({ rows, onAdvance, nextLabel }:{ rows:any[]; onAdvance:(idx:number)=>void; nextLabel:(status:string, jenis:Jenis)=>string|null }){
  return (
    <div className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 py-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"><div className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-white"><ClipboardList className="w-4 h-4 text-gray-600 dark:text-gray-400"/> Pelayanan Masyarakat (Internal TU)</div></div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-theme-color-primary/20 text-gray-600 dark:text-gray-400"><tr>
            <th className="px-4 py-2 text-left">No./Ref (terakhir)</th>
            <th className="px-4 py-2 text-left">Tanggal</th>
            <th className="px-4 py-2 text-left">Pelapor</th>
            <th className="px-4 py-2 text-left">Judul</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Riwayat</th>
            <th className="px-4 py-2 text-left">Aksi</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 font-mono text-xs text-gray-800 dark:text-white">{r.nomor||'—'}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.tanggal||'—'}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.pelapor}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.judul}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">{r.status}</td>
                <td className="px-4 py-2"><HistoryBadge items={r.history}/></td>
                <td className="px-4 py-2">
                  {nextLabel(r.status,'PM') ? (
                    <button onClick={()=>onAdvance(i)} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700">{nextLabel(r.status,'PM')}</button>
                  ) : <span className="text-gray-600 dark:text-gray-400">(final)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>  
  );
}
// ---------- Dashboard TU ----------
export function TUMain() {
  // number manager
  const { peekNext, nextNumber } = useNumberManager();
  function nextLabel(status:string, jenis:Jenis){
    const flow = jenis==='SK'? PIPE_SK : jenis==='DN'? PIPE_DN : jenis==='PM'? PIPE_PM : [];
    const idx = flow.indexOf(status as any);
    if(idx===-1 || idx===flow.length-1) return null;
    return `Naik: ${flow[idx+1]}`;
  }
  // data state
  const [incoming] = useState(seedIncoming());
  const [outgoing,setOutgoing] = useState(seedOutgoing());
  const [dinas,setDinas] = useState(seedDinas());
  const [publicTU,setPublicTU] = useState(seedPublicTU());
  // charts
  const perTanggal = useMemo(()=>{
    const m:Record<string,number>={};
    [...incoming.map(i=>i.tanggalTerima), ...outgoing.map(o=>o.tanggal)].forEach(d=>{ if(d) m[d]=(m[d]||0)+1; });
    return Object.entries(m).sort(([a],[b])=>a.localeCompare(b)).map(([date, jumlah])=>({date, jumlah}));
  }, [incoming,outgoing]);
  const perJenis = useMemo(()=>{
    const m:Record<string,number>={SM:incoming.length, SK:outgoing.length, DN:dinas.length, PM:publicTU.length};
    return Object.entries(m).map(([name,value])=>({name,value}));
  }, [incoming,outgoing,dinas,publicTU]);
  const area = useMemo(()=> makeArea(), []);
  // KPI
  const total = incoming.length + outgoing.length + dinas.length + publicTU.length;
  // dev tests
  useEffect(()=>{
    const n = formatNumber({jenis:'SK'},7, new Date('2025-08-24'));
    console.assert(/SMKN-01\/TU\/421\.5\/SK\/08\/2025\/007/.test(n), 'format nomor SK valid');
  },[]);
  // helpers to advance with number generation
  function advanceFlow(list:any[], setList:(updater:(prev:any[])=>any[])=>void, jenis:Jenis){
    setList(prev=>{
      const copy=[...prev];
      return copy.map((r,i)=>copy[i]); // no-op placeholder
    });
  }
  return (
    // <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-50 dark:from-gray-900 dark:to-gray-900 text-gray-800 dark:text-white">
    <div className="w-full min-h-screen dark:text-white pb-6">
      <style>
        {`
          select option {
            background: #F9FAFB !important;
            color: #1F2937;
          }
          select option:checked,
          select option:hover {
            background: #14B8A6 !important;
            color: #FFFFFF;
          }
          @media (prefers-color-scheme: dark) {
            select option {
              background: #1F2A44 !important;
              color: #FFFFFF;
            }
            select option:checked,
            select option:hover {
              background: #14B8A6 !important;
              color: #FFFFFF;
            }
          }
        `}
      </style>
      <div className="max-w-full mx-auto space-y-6">
        {/* <div className="bg-theme-color-primary/5 text-gray-800 dark:text-white p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <h1 className="text-2xl font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-gray-600 dark:text-gray-400"/> Dashboard TU – Surat & Pelayanan</h1>
          <p className="text-gray-600 dark:text-gray-400">Satu layar: Surat Masuk (SM), Surat Keluar (SK), Pengajuan ke Dinas (DN), Pelayanan Masyarakat (PM)</p>
        </div> */}
        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total Dokumen" value={total} subtitle="SM + SK + DN + PM" />
          <StatCard title="Surat Masuk" value={incoming.length} subtitle="bulan ini" />
          <StatCard title="Surat Keluar" value={outgoing.length} subtitle="terbit" />
          <StatCard title="Ke Dinas (DN)" value={dinas.length} subtitle="pengajuan" />
          <StatCard title="PM TU" value={publicTU.length} subtitle="pelayanan masyarakat" />
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><SimpleBar data={perTanggal} /></div>
          <SimplePie data={perJenis} title="Komposisi (SM/SK/DN/PM)" />
        </div>
        {/* <SimpleArea data={area} /> */}
        {/* Surat Masuk */}
        <IncomingLettersTable rows={incoming} />
        {/* Surat Keluar */}
        <OutgoingLetterForm peekNext={peekNext} onCreate={(row)=>setOutgoing(prev=>[row,...prev])} />
        <OutgoingLettersTable rows={outgoing} nextLabel={(s)=>nextLabel(s,'SK')} onAdvance={(idx)=>{
          setOutgoing(prev=>{
            const copy=[...prev];
            const r=copy[idx];
            const flow=PIPE_SK; const i=flow.indexOf(r.status);
            if(i>-1 && i<flow.length-1){ const next=flow[i+1]; const nomor=nextNumber('SK', next); r.status=next; r.nomor=nomor; r.tanggal=new Date().toISOString().slice(0,10); (r.history||(r.history=[])).push({status:next, nomor, tanggal:r.tanggal}); }
            return copy;
          });
        }} />
        {/* Pengajuan ke Dinas */}
        <DinasForm peekNext={peekNext} onCreate={(row)=>setDinas(prev=>[row,...prev])} />
        <DinasTable rows={dinas} nextLabel={(s)=>nextLabel(s,'DN')} onAdvance={(idx)=>{
          setDinas(prev=>{
            const copy=[...prev];
            const r=copy[idx];
            const flow=PIPE_DN; const i=flow.indexOf(r.status);
            if(i>-1 && i<flow.length-1){ const next=flow[i+1]; const nomor=nextNumber('DN', next); r.status=next; r.nomor=nomor; r.tanggal=new Date().toISOString().slice(0,10); (r.history||(r.history=[])).push({status:next, nomor, tanggal:r.tanggal}); }
            return copy;
          });
        }} />
        {/* Pelayanan Masyarakat TU */}
        <PublicTUForm peekNext={peekNext} onCreate={(row)=>setPublicTU(prev=>[row,...prev])} />
        <PublicTUTable rows={publicTU} nextLabel={(s)=>nextLabel(s,'PM')} onAdvance={(idx)=>{
          setPublicTU(prev=>{
            const copy=[...prev];
            const r=copy[idx];
            const flow=PIPE_PM; const i=flow.indexOf(r.status);
            if(i>-1 && i<flow.length-1){ const next=flow[i+1]; const nomor=nextNumber('PM', next); r.status=next; r.nomor=nomor; r.tanggal=new Date().toISOString().slice(0,10); (r.history||(r.history=[])).push({status:next, nomor, tanggal:r.tanggal}); }
            return copy;
          });
        }} />
      </div>
    </div>
  );
}
// ---------- Dev tests ----------
function runDevTests(){
  console.assert(typeof classNames==='function','classNames exist');
  const n = formatNumber({jenis:'SK'},7, new Date('2025-08-24'));
  console.assert(/SMKN-01\/TU\/421\.5\/SK\/08\/2025\/007/.test(n), 'format nomor SK valid');
}
runDevTests();