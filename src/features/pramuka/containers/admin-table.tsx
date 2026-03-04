import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Download, FileSpreadsheet, KeyRound, Layers, Plus, RefreshCw, Search, Settings, ShieldCheck, Trash2, UploadCloud, XCircle } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { v4 as uuidv4 } from "uuid";

const THEME = { primary: "#1F3B76", accent: "#F2C94C", surface: "#0F1E3A", border: "#1E335F", surface2: "#1B2E58" } as const;

const GOLONGAN_OPTIONS = ["Siaga", "Penggalang", "Penegak", "Pandega"] as const;

// ====== Types ======
type SchemeKey = "gudep" | "nis" | "nisn" | "year2";
type NigpScheme = { prefix: string; order: SchemeKey[]; delimiter: string; suffixPad: number; };
type Anggota = { id: string; nama: string; nis?: string; nisn?: string; golongan: "Siaga"|"Penggalang"|"Penegak"|"Pandega"; gudep: string; status: "Aktif"|"Nonaktif"; nigp?: string };

// ====== Preset Schemes ======
const PRESETS: Record<string, NigpScheme> = {
  peserta: { prefix: "PRM", order: ["gudep","nisn","year2"], delimiter: "-", suffixPad: 6 },
  pembina: { prefix: "NIP", order: ["gudep","year2","nis"], delimiter: "-", suffixPad: 6 },
  custom:  { prefix: "CSTM", order: ["gudep","nis","year2"], delimiter: "-", suffixPad: 4 },
};

// ====== Demo ======
const DemoMembers: Anggota[] = [
  { id: "m1", nama: "Ananta Putra", nis: "1234", nisn: "2025999999", golongan: "Penggalang", gudep: "05-001", status: "Aktif", nigp: "PRM-05-001-2025999999-25" },
  { id: "m2", nama: "Salsabila Nur", nis: "5678", nisn: "2025888888", golongan: "Penggalang", gudep: "05-001", status: "Aktif", nigp: "PRM-05-001-2025888888-25" },
];

// ====== Validator ringan ======
const reNISN = /^\d{10}$/; const reNIS = /^\d{1,20}$/; const reGUDEP = /^\d{2}-\d{3}$/;
function validateAnggota(a: Anggota) {
  const errors: string[] = [];
  if (!a.nama?.trim()) errors.push("Nama wajib diisi");
  if (a.nis && !reNIS.test(a.nis)) errors.push("Format NIS tidak valid");
  if (a.nisn && !reNISN.test(a.nisn)) errors.push("NISN harus 10 digit");
  if (!reGUDEP.test(a.gudep)) errors.push("Gudep harus format 00-000");
  return errors;
}

// ====== Registry ======
const REGISTRY_KEY = "pramuka:nigp:registry";
const SERVER_REGISTRY_KEY = "server:pramuka:nigp:registry"; // demo backend
function loadRegistry(key = REGISTRY_KEY): Set<string> { try { const raw = localStorage.getItem(key); return new Set<string>(raw ? JSON.parse(raw) : []); } catch { return new Set(); } }
function saveRegistry(set: Set<string>, key = REGISTRY_KEY) { try { localStorage.setItem(key, JSON.stringify(Array.from(set))); } catch {} }

// ====== Generator helpers ======
const year2 = () => new Date().getFullYear().toString().slice(-2);
const baseId = (input: Record<string,string>, scheme: NigpScheme) => [scheme.prefix, ...scheme.order.map(k => (k==="year2"?year2():(input[k]||"xx")))].join(scheme.delimiter);
function formatSuffix(idBase:string, n:number, pad:number){ if (n===0) return idBase; const s=String(n); const width=Math.max(pad, s.length); return `${idBase}${idBase.endsWith("-")?"":"-"}${s.padStart(width,"0")}`; }
function capacityForPad(pad:number){ return pad<=0?1:Math.pow(10,pad); }
function usageStats(registry:Set<string>, root:string, delimiter:string){ const prefix=root+(root.endsWith(delimiter)?"":delimiter); let used=0, max=0, hasRoot=false; for(const id of registry){ if(id===root){hasRoot=true; continue;} if(id.startsWith(prefix)){ const m=id.slice(prefix.length).match(/(\d+)$/); if(!m) continue; const num=Number(m[1]); if(!Number.isNaN(num)){ used++; if(num>max) max=num; } } } return { hasRoot, suffixCount:used, maxSuffix:max }; }
function nextUniqueId(input:Record<string,string>, scheme:NigpScheme, registry:Set<string>){ const root=baseId(input, scheme); const {hasRoot,maxSuffix}=usageStats(registry, root, scheme.delimiter); if(!hasRoot && !registry.has(root)) return {id:root, collision:false}; const next=Math.max(0,maxSuffix)+1; return { id: formatSuffix(root,next,scheme.suffixPad), collision:true}; }
function reserveId(id:string, registry:Set<string>, key=REGISTRY_KEY){ const next=new Set(registry); next.add(id); saveRegistry(next, key); return next; }

// ====== (Demo) Backend API simulasi (atomic-ish) ======
async function apiCheckReserve(baseInput:Record<string,string>, scheme:NigpScheme, action:"check"|"reserve"){ 
  try {
    const server=loadRegistry(SERVER_REGISTRY_KEY); 
    const {id}=nextUniqueId(baseInput, scheme, server); 
    if(action==="reserve"){ 
      const next=reserveId(id, server, SERVER_REGISTRY_KEY); 
      return {id, reserved:true, size: next.size}; 
    } 
    return {id, reserved:false, size: server.size};
  } catch (error) {
    console.error("API error:", error);
    throw new Error("Gagal memproses permintaan ke server");
  } 
}

// ====== Self‑tests (runtime assertions) ======
(function selfTests(){ try { const sch: NigpScheme = { prefix:"PRM", order:["gudep","nisn","year2"], delimiter:"-", suffixPad:3 }; const input={gudep:"05-001", nis:"1234", nisn:"1234567890"}; const base=baseId(input, sch); console.assert(base.startsWith("PRM-05-001-1234567890-"), "Base ID salah"); const reg=new Set<string>([base, `${base}-000001`, `${base}-000010`]); const g=nextUniqueId(input, sch, reg); console.assert(g.id.endsWith("-000011"), "Next suffix seharusnya 11"); const before=loadRegistry(); before.add("TEST-KEEP"); saveRegistry(before); const after=loadRegistry(); console.assert(after.has("TEST-KEEP"), "Persist gagal"); } catch(e){ console.warn("[SelfTests]", e); }})();

// ====== Modal (Popup) ======
function Modal({open, onClose, children}:{open:boolean; onClose:()=>void; children:React.ReactNode}){ if(!open) return null; return (
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 bg-black/60" onClick={onClose} />
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl border p-4 bg-[#0F1E3A] border-white/30">
        {children}
      </div>
    </div>
  </div>
);} 

function useRegistry(key: string = REGISTRY_KEY) {
  const [registry, setRegistry] = useState<Set<string>>(loadRegistry(key));
  const save = useCallback((set: Set<string>) => {
    try {
      localStorage.setItem(key, JSON.stringify(Array.from(set)));
    } catch {}
  }, [key]);
  const reserve = useCallback((id: string) => {
    const next = new Set(registry);
    next.add(id);
    save(next);
    setRegistry(next);
    return next;
  }, [registry, save]);
  const reset = useCallback(() => {
    if (!window.confirm("Apakah Anda yakin ingin mereset registry? Semua ID akan dihapus.")) return;
    const next = new Set<string>();
    save(next);
    setRegistry(next);
  }, [save]);
  return { registry, setRegistry, save, reserve, reset };
}

function MemberTable({ rows, updateRow, removeRow, openGeneratorFor }: { rows: Anggota[]; updateRow: (id: string, patch: Partial<Anggota>) => void; removeRow: (id: string) => void; openGeneratorFor: (row: Anggota) => void }) {
  return (
    <div className="rounded-lg border overflow-auto border-white/30">
      <table className="w-full text-sm text-white">
        <thead className="bg-white/10">
          <tr>
            <th className="p-2">Nama</th>
            <th className="p-2">NIS</th>
            <th className="p-2">NISN</th>
            <th className="p-2">Golongan</th>
            <th className="p-2">Gudep</th>
            <th className="p-2">NIGP/NIP</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="bg-transparent">
              <td className="p-2">
                <input
                  value={r.nama}
                  onChange={(e) => updateRow(r.id, { nama: e.target.value })}
                  className="w-full border p-2 text-black rounded-md"
                  style={{ borderColor: THEME.border }}
                />
              </td>
              <td className="p-2">
                <input
                  value={r.nis || ""}
                  onChange={(e) => updateRow(r.id, { nis: e.target.value })}
                  className="w-full border p-2 text-black rounded-md"
                  style={{ borderColor: THEME.border }}
                  maxLength={20}
                />
              </td>
              <td className="p-2">
                <input
                  value={r.nisn || ""}
                  onChange={(e) => updateRow(r.id, { nisn: e.target.value })}
                  className="w-full border p-2 text-black rounded-md"
                  style={{ borderColor: THEME.border }}
                  maxLength={10}
                />
              </td>
              <td className="p-2">
                <select
                  value={r.golongan}
                  onChange={(e) => updateRow(r.id, { golongan: e.target.value as any })}
                  className="w-full border p-2 text-black rounded-md"
                  style={{ borderColor: THEME.border }}
                >
                  {GOLONGAN_OPTIONS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </td>
              <td className="p-2">
                <input
                  value={r.gudep}
                  onChange={(e) => updateRow(r.id, { gudep: e.target.value })}
                  className="w-full border p-2 text-black rounded-md"
                  style={{ borderColor: THEME.border }}
                />
              </td>
              <td className="p-2 text-xs font-mono">{r.nigp || <span className="opacity-60">(belum)</span>}</td>
              <td className="p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => openGeneratorFor(r)}
                    className="px-2 py-1 rounded text-xs border"
                    style={{ borderColor: THEME.border }}
                  >
                    <KeyRound size={14} className="inline mr-1" /> Generate
                  </button>
                  <button
                    onClick={() => removeRow(r.id)}
                    className="px-2 py-1 rounded text-xs bg-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td className="p-2 text-white/80" colSpan={7}>
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ====== Main Component ======
export function MemberPramukaMain(){
  const [rows, setRows] = useState<Anggota[]>(DemoMembers);
  const [q, setQ] = useState("");
  const [preset, setPreset] = useState<string>("peserta");
  const [scheme, setScheme] = useState<NigpScheme>(PRESETS[preset]);
  const [autoIncrease, setAutoIncrease] = useState(true);
  const [backendMode, setBackendMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | undefined>(undefined);
  const [tmpGudep, setTmpGudep] = useState("05-001");
  const [tmpNis, setTmpNis] = useState("");
  const [tmpNisn, setTmpNisn] = useState("");
  const [checkOnly, setCheckOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { registry: reg, setRegistry: setReg, reserve: reserveId, reset: resetRegistry } = useRegistry(REGISTRY_KEY);
  const [debouncedQ] = useDebounce(q, 300);

  useEffect(()=>{ setScheme(PRESETS[preset]); },[preset]);

  const sortedRows = useMemo(()=> {
    return rows
      .filter(r => (r.nama+" "+(r.nis||"")+" "+(r.nisn||"")+" "+r.gudep+" "+r.golongan).toLowerCase().includes(debouncedQ.toLowerCase()))
      .sort((a,b)=> a.nama.localeCompare(b.nama,'id'))
  }, [rows,debouncedQ]);
  const updateRow = useCallback((id:string, patch:Partial<Anggota>) => setRows(rs=> rs.map(r=> r.id===id? {...r, ...patch}: r)), []);
  const removeRow = useCallback((id:string) => setRows(rs=> rs.filter(r=> r.id!==id)), []);

  // Registry helpers
  function exportRegistry(){ const json = JSON.stringify(Array.from(reg), null, 2); const blob = new Blob([json], {type:"application/json"}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='registry.json'; a.click(); URL.revokeObjectURL(url); }
  function importRegistry(ev: React.ChangeEvent<HTMLInputElement>){ 
    const f = ev.target.files?.[0]; if(!f) return; const reader = new FileReader(); reader.onload = () => { 
      try { 
        const arr = JSON.parse(String(reader.result)); 
        if (!Array.isArray(arr) || !arr.every((item) => typeof item === "string")) {
          toast.error("File registry tidak valid: Harus berupa array string");
          return;
        }
        const next = new Set<string>(arr); setReg(next); saveRegistry(next); toast.success("Registry berhasil diimpor"); 
      } catch { toast.error('File registry tidak valid'); } 
    }; reader.readAsText(f); 
  }

  // CSV Export (quoted & BOM)
  function toCSV(rowsOut:Record<string,any>[]){ if(!rowsOut.length) return ""; const headers=Object.keys(rowsOut[0]); const esc=(v:any)=>'"'+String(v??"").replace(/"/g,'""')+'"'; const headerLine = headers.map(esc).join(","); const bodyLines = rowsOut.map(r=> headers.map(h=> esc(r[h])).join(",")); return [headerLine, ...bodyLines].join("\r\n"); }
  function downloadCSV(){ const rowsOut = sortedRows.map(({id, ...r})=>r); const content = "\ufeff" + toCSV(rowsOut); const blob=new Blob([content], {type:"text/csv;charset=utf-8;"}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='anggota.csv'; a.click(); URL.revokeObjectURL(url); }

  // Add row (+ auto generate)
  const addRow = useCallback(() => {
    const newRow: Anggota = { id: uuidv4(), nama:"Anggota Baru", nis:"", nisn:"", golongan:"Penggalang", gudep:"05-001", status:"Aktif" };
    const errors = validateAnggota(newRow);
    if (errors.length > 0) {
      toast.error("Validasi gagal: " + errors.join(", "));
      return;
    }
    const input = { gudep: newRow.gudep, nis: newRow.nis||"", nisn: newRow.nisn||"" } as Record<string,string>;
    setIsLoading(true);
    if (backendMode) {
      apiCheckReserve(input, scheme, 'reserve').then(({id})=>{ 
        reserveId(id, loadRegistry(SERVER_REGISTRY_KEY), SERVER_REGISTRY_KEY); 
        setReg(loadRegistry()); 
        newRow.nigp = id; 
        setRows([newRow, ...rows]); 
        setIsLoading(false);
        toast.success("Anggota berhasil ditambahkan");
      }).catch((error) => {
        setIsLoading(false);
        toast.error(error.message || "Gagal menambahkan anggota");
      });
    } else {
      // Capacity warning + auto-increase
      const root = baseId(input, scheme);
      const stats = usageStats(reg, root, scheme.delimiter);
      const cap = capacityForPad(scheme.suffixPad);
      const used = (stats.hasRoot?1:0) + stats.suffixCount;
      if (autoIncrease && scheme.suffixPad >= 0 && used >= Math.floor(cap*0.9)) setScheme(s => ({...s, suffixPad: Math.min(12, s.suffixPad+1)}));
      const {id} = nextUniqueId(input, scheme, reg);
      reserveId(id, reg);
      newRow.nigp = id; 
      setRows([newRow, ...rows]);
      setIsLoading(false);
      toast.success("Anggota berhasil ditambahkan");
    }
  }, [backendMode, scheme, reg, autoIncrease, rows, reserveId]);

  // Popup helpers
  const basePreview = useMemo(()=> baseId({gudep:tmpGudep, nis:tmpNis, nisn:tmpNisn}, scheme), [tmpGudep,tmpNis,tmpNisn,scheme]);
  const available = useMemo(()=> !reg.has(basePreview), [reg, basePreview]);
  const rootStats = useMemo(()=> usageStats(reg, basePreview, scheme.delimiter), [reg, basePreview, scheme.delimiter]);
  const cap = capacityForPad(scheme.suffixPad);
  const usedApprox = (rootStats.hasRoot?1:0) + rootStats.suffixCount;
  const usagePct = Math.min(100, Math.round((usedApprox/Math.max(1,cap))*100));
  const nearCapacity = scheme.suffixPad>0 && usedApprox >= Math.floor(cap*0.9);

  const openGeneratorFor = useCallback((row: Anggota)=>{ setTargetId(row.id); setTmpGudep(row.gudep||"05-001"); setTmpNis(row.nis||""); setTmpNisn(row.nisn||""); setModalOpen(true); }, []);

  function applyGenerated(){ 
    if(!targetId) {
      setModalOpen(false);
      toast.error("Tidak ada anggota yang dipilih");
      return; 
    }
    const input = {gudep:tmpGudep, nis:tmpNis, nisn:tmpNisn}; 
    const errors = validateAnggota({id: targetId, nama: "", golongan: "Penggalang", status: "Aktif", gudep: tmpGudep, nis: tmpNis, nisn: tmpNisn });
    if (errors.length > 0) {
      toast.error("Validasi gagal: " + errors.join(", "));
      return;
    }
    setIsLoading(true);
    if (backendMode) { 
      apiCheckReserve(input, scheme, checkOnly? 'check':'reserve').then(({id, reserved})=>{ 
        if (!checkOnly && reserved) setRows(rs=> rs.map(r=> r.id===targetId? {...r, gudep: tmpGudep, nis: tmpNis, nisn: tmpNisn, nigp: id }: r)); 
        setIsLoading(false);
        setModalOpen(false); 
        if (checkOnly) toast.success("Next ID: "+id); 
      }).catch((error) => {
        toast.error(error.message || "Gagal menghubungi server");
        setIsLoading(false);
      });
    } else {
      const { id } = nextUniqueId(input, scheme, reg); 
      if (checkOnly) { 
        toast.success("Next ID: "+id); 
        setIsLoading(false);
        return; 
      } 
      reserveId(id, reg); 
      setRows(rs=> rs.map(r=> r.id===targetId? {...r, gudep: tmpGudep, nis: tmpNis, nisn: tmpNisn, nigp: id }: r)); 
      setIsLoading(false);
      setModalOpen(false); 
    } 
  }

  return (
    <div className="min-h-screen text-white">
      <Toaster />
      <div className="max-w-full mx-auto">
        <div className="rounded-lg p-5 mb-6 border border-white/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3"><BookOpen/><div><h1 className="text-xl font-bold">Anggota</h1><p className="text-sm opacity-80">Data anggota + Generator NIGP/NIP (popup) • Auto‑generate saat tambah</p></div></div>
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-2"><input type="checkbox" checked={autoIncrease} onChange={e=>setAutoIncrease(e.target.checked)}/> Auto‑increase pad</label>
              {/* <label className="flex items-center gap-2"><input type="checkbox" checked={backendMode} onChange={e=>setBackendMode(e.target.checked)}/> Backend mode</label> */}
              <label className="flex items-center gap-2"><Layers size={14}/> Preset:
                <select value={preset} onChange={e=>{ const key=e.target.value; setPreset(key); }} className="border rounded px-2 py-1 border-white/30 text-black">
                  {Object.keys(PRESETS).map(k=> <option key={k} className="text-black" value={k}>{k}</option>)}
                </select>
              </label>
            </div>
          </div>
        </div>

        <motion.section initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/30">
              <Search size={16}/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari anggota" className="bg-transparent outline-none text-sm w-72 text-white"/>
            </div>
            <div className="flex items-center gap-2">
              <button disabled={isLoading} onClick={addRow} className="px-3 py-2 text-sm rounded-lg flex items-center gap-2 bg-yellow-400 text-black border border-white/30"><Plus size={16}/> Tambah {isLoading && "(Loading...)"}</button>
              <button onClick={resetRegistry} className="px-3 py-2 text-sm rounded-lg flex items-center gap-2 border border-white/30"><RefreshCw size={16}/> Reset</button>
              <button onClick={exportRegistry} className="px-3 py-2 text-sm rounded-lg flex items-center gap-2 border border-white/30"><Download size={16}/> Export Registry</button>
              <button onClick={()=>fileInputRef.current?.click()} className="px-3 py-2 text-sm rounded-lg flex items-center gap-2 border border-white/30"><UploadCloud size={16}/> Import</button>
              <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={importRegistry}/>
              <button onClick={downloadCSV} className="px-3 py-2 text-sm rounded-lg flex items-center gap-2 border border-white/30"><FileSpreadsheet size={16}/> Export CSV</button>
            </div>
          </div>
          <div className="text-sm opacity-80">Menampilkan {sortedRows.length} dari {rows.length} anggota</div>
          <MemberTable rows={sortedRows} updateRow={updateRow} removeRow={removeRow} openGeneratorFor={openGeneratorFor} />
        </motion.section>

        {/* Popup Generator */}
        <Modal open={modalOpen} onClose={()=>setModalOpen(false)}>
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-semibold">Generator NIGP/NIP — untuk: <code className="font-mono">{rows.find(r=>r.id===targetId)?.nama || '-'}</code></div>
            <button onClick={()=>setModalOpen(false)} className="text-white/70">Tutup</button>
          </div>

          <div className="rounded-2xl border p-3 mb-3 border-white/30">
            <div className="text-sm font-semibold mb-2 flex items-center gap-2"><Settings size={16}/> Pengaturan Skema</div>
            <div className="grid md:grid-cols-4 gap-3">
              <label className="text-xs opacity-80 flex flex-col gap-1 md:col-span-2">Preset
                <select value={preset} onChange={e=>setPreset(e.target.value)} className="border rounded px-2 py-1 border-white/30">
                  {Object.keys(PRESETS).map(k=> <option key={k} value={k}>{k}</option>)}
                </select>
              </label>
              <label className="text-xs opacity-80 flex flex-col gap-1">Prefix<input value={scheme.prefix} onChange={e=>setScheme({...scheme, prefix:e.target.value})} className="border rounded px-2 py-1 border-white/30"/></label>
              <label className="text-xs opacity-80 flex flex-col gap-1">Delimiter<input value={scheme.delimiter} onChange={e=>setScheme({...scheme, delimiter:e.target.value})} className="border rounded px-2 py-1 border-white/30"/></label>
              <label className="text-xs opacity-80 flex flex-col gap-1">Suffix Pad<input type="number" min={0} max={12} value={scheme.suffixPad} onChange={e=>setScheme({...scheme, suffixPad: Math.max(0,Math.min(12, Number(e.target.value)||0))})} className="border rounded px-2 py-1 border-white/30"/></label>
              <div className="text-xs opacity-80 md:col-span-4">Urutan
                <div className="mt-1 flex gap-2 flex-wrap">
                  {scheme.order.map((o,i)=> (
                    <span key={i} className="inline-flex items-center gap-1 border rounded px-2 py-1 border-white/30">
                      {o}
                      <button onClick={()=>{ if(i<=0) return; const arr=[...scheme.order]; [arr[i],arr[i-1]]=[arr[i-1],arr[i]]; setScheme({...scheme, order:arr}); }} className="text-white/70">↑</button>
                      <button onClick={()=>{ if(i>=scheme.order.length-1) return; const arr=[...scheme.order]; [arr[i],arr[i+1]]=[arr[i+1],arr[i]]; setScheme({...scheme, order:arr}); }} className="text-white/70">↓</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-3 border-white/30">
            <div className="grid md:grid-cols-3 gap-3">
              <label className="text-xs opacity-80 flex flex-col gap-1">Gudep<input value={tmpGudep} onChange={e=>setTmpGudep(e.target.value)} placeholder="05-001" className="border rounded px-2 py-1 border-white/30"/></label>
              <label className="text-xs opacity-80 flex flex-col gap-1">NIS (opsional)<input value={tmpNis} onChange={e=>setTmpNis(e.target.value)} placeholder="1234" className="border rounded px-2 py-1 border-white/30" maxLength={20}/></label>
              <label className="text-xs opacity-80 flex flex-col gap-1">NISN (10 digit)<input value={tmpNisn} onChange={e=>setTmpNisn(e.target.value)} placeholder="1234567890" className="border rounded px-2 py-1 border-white/30" maxLength={10}/></label>
            </div>

            <div className="mt-3 text-xs">
              <div className="flex items-center justify-between"><span>Preview: <code className="font-mono">{basePreview}</code></span><span>{available? <span className="inline-flex items-center gap-1 text-emerald-300"><CheckCircle2 size={14}/> Tersedia</span> : <span className="inline-flex items-center gap-1 text-red-300"><XCircle size={14}/> Sudah dipakai</span>}</span></div>
              <div className="mt-2 flex items-center justify-between">
                <span>Kapasitas pad {scheme.suffixPad}: {usedApprox}/{cap} terpakai</span>
                <label className="flex items-center gap-2"><input type="checkbox" checked={checkOnly} onChange={e=>setCheckOnly(e.target.checked)}/> Check‑Only</label>
              </div>
              <div className="mt-1 h-2 w-full bg-white/10 rounded"><div className="h-2 rounded" style={{ width: `${usagePct}%`, background: usagePct>90? '#ef4444' : usagePct>70? '#f59e0b' : '#10b981' }} /></div>
              {nearCapacity && <div className="mt-2 text-amber-300">Mendekati kapasitas. {autoIncrease? 'Auto‑increase aktif saat tambah.' : 'Pertimbangkan menaikkan pad.'}</div>}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
              <button onClick={()=>{ resetRegistry(); }} className="px-3 py-2 rounded-lg flex items-center gap-2 border border-white/30"><RefreshCw size={16} className="inline mr-1"/> Reset Registry</button>
              <div className="flex items-center gap-2">
                <button disabled={isLoading} onClick={()=>{ if(!targetId){ setModalOpen(false); return;} applyGenerated(); }} className="px-3 py-2 rounded-lg flex items-center gap-2 bg-yellow-400 text-black border border-white/30"><ShieldCheck size={16} className="inline mr-1"/> {checkOnly? 'Check Next' : 'Generate & Reserve'} {isLoading && "(Loading...)"}</button>
                <button onClick={()=>setModalOpen(false)} className="px-3 py-2 rounded-lg flex items-center gap-2 border border-white/30">Tutup</button>
              </div>
            </div>
          </div>
        </Modal>

        <div className="mt-8 text-xs opacity-60">© {new Date().getFullYear()} — Modul Anggota + Generator (popup & auto). Powered by Xpresensi.</div>
      </div>
    </div>
  );
}