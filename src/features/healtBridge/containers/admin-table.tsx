import { Check, CheckCircle2, ChevronRight, Database, FileSpreadsheet, FileText, QrCode, Search, Send, ShieldCheck, Syringe, Users2, XCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

// ---------- Mini UI helpers ----------
function clsx(...a){ return a.filter(Boolean).join(" "); }
function Badge({children, tone="slate"}:{children:React.ReactNode, tone?:"slate"|"teal"|"amber"|"red"|"sky"|"violet"}){
  const map:any={
    slate:"bg-slate-100 text-slate-400 border-slate-200",
    teal:"bg-teal-50 text-teal-700 border-teal-200",
    amber:"bg-amber-50 text-amber-700 border-amber-200",
    red:"bg-rose-50 text-rose-700 border-rose-200",
    sky:"bg-sky-50 text-sky-700 border-sky-200",
    violet:"bg-violet-50 text-violet-700 border-violet-200",
  };
  return <span className={clsx("inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium border", map[tone])}>{children}</span>
}
function Stat({icon:Icon, label, value, hint, tone="teal"}:{icon:any,label:string,value:string|number,hint?:string,tone?:"teal"|"sky"|"violet"|"amber"}){
  const ring:any={teal:"border border-white/20", sky:"border border-white/20", violet:"border border-white/20", amber:"border border-white/20"};
  const tint:any={teal:"text-teal-700", sky:"text-sky-700", violet:"text-violet-700", amber:"text-amber-700"};
  const bg:any={teal:"bg-teal-50", sky:"bg-sky-50", violet:"bg-violet-50", amber:"bg-amber-50"};
  return (
    <div className={clsx("rounded-lg border p-4 shadow-sm bg-theme-color-primary/5", ring[tone])}>
      <div className="flex flex-col gap-3">
        <div className={clsx("p-2 w-max rounded-lg", bg[tone])}><Icon className={clsx("h-5 w-5", tint[tone])}/></div>
        <div>
          <div className="text-sm text-white">{label}</div>
          <div className="flex items-center gap-3 mt-3">
            <div className="text-xl font-semibold text-white">{value}</div>
            {hint && <div className="text-xs border border-white/20 p-1 rounded-md px-3 text-slate-400">{hint}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
function Card({title, icon:Icon, toolbar, children}:{title:string, icon?:any, toolbar?:React.ReactNode, children:React.ReactNode}){
  return (
    <section className="rounded-lg border border-white/20 shadow-sm bg-theme-color-primary/5">
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-teal-600"/>}
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <div>{toolbar}</div>
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

// ---------- Sample static data ----------
const SAMPLE_STUDENTS = [
  { id:"s001", nisn:"0078901234", nik:"3273010101010001", name:"Alya Putri", kelas:"7A", dob:"2012-04-03", parent:"Sari Wulandari",
    consent:{ckg:true, bias:true}, allergy:["Udang"], ihs:null },
  { id:"s002", nisn:"0078905678", nik:"3273010202020002", name:"Bima Pratama", kelas:"7A", dob:"2012-11-12", parent:"Andri Saputra",
    consent:{ckg:false, bias:true}, allergy:[], ihs:"IHS-3200-1122-8899" },
  { id:"s003", nisn:"0078909012", nik:"3273010303030003", name:"Citra Anggraini", kelas:"7B", dob:"2012-02-17", parent:"Dewi Lestari",
    consent:{ckg:true, bias:false}, allergy:["Kacang"], ihs:null },
];

const INITIAL_LOGS = [
  { id:"lg-1", ts:new Date().toISOString(), level:"info", msg:"Sandbox tersambung. Organization/Location/Practitioner valid." },
];

// ---------- Utils (mock) ----------
function calcBMI(tb_cm:number, bb_kg:number){ if(!tb_cm||!bb_kg) return null; const m=tb_cm/100; return +(bb_kg/(m*m)).toFixed(1); }
function bmiFlag(bmi:number|null){ if(bmi==null) return {tone:"slate", text:"-"}; if(bmi<17) return {tone:"amber", text:"Kurus"}; if(bmi>23) return {tone:"amber", text:"Berlebih"}; return {tone:"teal", text:"Normal"}; }
function hashIHS(nik:string, dob:string){ const s = nik.slice(-6)+dob.replaceAll("-",""); return "IHS-"+s.match(/.{1,4}/g)!.join("-"); }

// ---------- Main Component ----------
export function HealtBridge(){
  const [env, setEnv] = useState<"Sandbox"|"Production">("Sandbox");
  const [students, setStudents] = useState(SAMPLE_STUDENTS);
  const [classFilter, setClassFilter] = useState<string>("All");
  const [screening, setScreening] = useState<Record<string, any>>({});
  const [queue, setQueue] = useState<any[]>([]);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [orgReady, setOrgReady] = useState(true);
  const [locReady, setLocReady] = useState(true);
  const [pracReady, setPracReady] = useState(true);

  useEffect(()=>{
    setLogs(l=>[{ id:crypto.randomUUID(), ts:new Date().toISOString(), level:"info", msg:`Lingkungan aktif: ${env}` }, ...l]);
  },[env]);

  const filtered = useMemo(()=> students.filter(s=> classFilter==="All"? true : s.kelas===classFilter),[students,classFilter]);

  // --- actions ---
  function toggleConsent(id:string, key:"ckg"|"bias"){
    setStudents(prev=> prev.map(s=> s.id===id? {...s, consent:{...s.consent, [key]: !s.consent[key] }} : s));
  }
  function resolveIHS(id:string){
    setStudents(prev=> prev.map(s=> s.id===id? {...s, ihs: s.ihs || hashIHS(s.nik, s.dob)} : s));
    setLogs(l=>[{ id:crypto.randomUUID(), ts:new Date().toISOString(), level:"info", msg:`MPI lookup sukses untuk ${id} (mock).` }, ...l]);
  }
  function pushFHIR(kind:"Observation"|"Immunization"|"Composition"){
    // add items to queue
    const payload = filtered.map(s=>({ id:crypto.randomUUID(), student:s, kind, status:"Ready" }));
    setQueue(q=>[...payload, ...q]);
    // simulate sending
    setTimeout(()=>{
      setQueue(q=> q.map(item=>{
        if(item.status!=="Ready") return item;
        const ok = Math.random()>0.08; // ~92% success
        const newItem = { ...item, status: ok?"Success":"Error" };
        setLogs(l=>[{ id:crypto.randomUUID(), ts:new Date().toISOString(), level: ok?"success":"error", msg: ok? `${kind} terkirim untuk ${item.student.name}` : `${kind} gagal untuk ${item.student.name} — OperationOutcome: value-set mismatch (mock)` }, ...l]);
        return newItem;
      }))
    }, 600);
  }

  function updateScreening(id:string, field:keyof any, value:any){
    setScreening(s=>({ ...s, [id]: { ...s[id], [field]: value } }));
  }

  // KPI computed
  const consentCKG = students.filter(s=>s.consent.ckg).length;
  const consentBIAS = students.filter(s=>s.consent.bias).length;
  const ihsReady = students.filter(s=>!!s.ihs).length;

  return (
    <div className="min-h-screen text-white">
      {/* Top bar */}
      {/* <div className="sticky top-0 z-30 border-y border-white/20 bg-theme-color-primary/5/90 backdrop-blur">
        <div className="mx-auto max-w-full py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-600 grid place-items-center"><Stethoscope className="h-5 w-5 text-white"/></div>
            <div>
              <div className="font-semibold">Xpresensi Health Bridge</div>
              <div className="text-xs text-white">SATUSEHAT‑aligned school health module</div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Badge tone="sky" >
              <Cpu className="h-3.5 w-3.5"/>
              <span>{env}</span>
            </Badge>
            <button onClick={()=> setEnv(env==="Sandbox"?"Production":"Sandbox")} className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-theme-color-primary/15">
              <RefreshCw className="h-4 w-4"/> Switch Env
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-teal-600 text-white px-3 py-1.5 text-sm hover:bg-teal-700">
              <LinkIcon className="h-4 w-4"/> Koneksikan Puskesmas
            </button>
          </div>
        </div>
      </div> */}

      {/* Page content */}
      <div className="mx-auto max-w-full pb-6 grid grid-cols-12 gap-6">
        {/* Left column (summary & integration) */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Stat icon={Users2} label="Siswa" value={students.length} hint="Roster aktif"/>
            <Stat icon={ShieldCheck} label="Consent CKG" value={`${consentCKG}/${students.length}`} hint="Target ≥ 90%" tone="sky"/>
            <Stat icon={Syringe} label="Consent BIAS" value={`${consentBIAS}/${students.length}`} hint="HPV/MR/DT‑Td" tone="violet"/>
            <Stat icon={QrCode} label="IHS siap" value={`${ihsReady}/${students.length}`} hint="Hasil MPI lookup" tone="amber"/>
          </div>

          <Card title="Integrasi" icon={Database} toolbar={
            <div className="flex items-center gap-2">
              <Badge tone={orgReady?"teal":"red"}>{orgReady? <><Check className="h-3.5 w-3.5"/> Connected</> : <><XCircle className="h-3.5 w-3.5"/> Missing</>}</Badge>
              <Badge tone={locReady?"teal":"red"}>{locReady? "Location" : "Location?"}</Badge>
              <Badge tone={pracReady?"teal":"red"}>{pracReady? "Practitioner" : "Practitioner?"}</Badge>
            </div>
          }>
            <ul className="text-sm space-y-2">
              <li className="flex items-center justify-between"><span>Organization (Sekolah & Puskesmas)</span> {orgReady? <Badge tone="teal">OK</Badge> : <Badge tone="red">Perlu isi</Badge>}</li>
              <li className="flex items-center justify-between"><span>Location (UKS / Poli Anak)</span> {locReady? <Badge tone="teal">OK</Badge> : <Badge tone="red">Perlu isi</Badge>}</li>
              <li className="flex items-center justify-between"><span>Practitioner/Role (Nakes PKM)</span> {pracReady? <Badge tone="teal">OK</Badge> : <Badge tone="red">Perlu isi</Badge>}</li>
            </ul>
            <div className="mt-3 text-xs text-white">Master ini wajib sebelum kirim Encounter/Observation/Immunization.</div>
          </Card>

          <Card title="MPI / IHS Resolver (Mock)" icon={Search}>
            <div className="text-sm text-white mb-3">Cari IHS berdasarkan NIK + Tanggal Lahir. Klik salah satu siswa di kanan lalu tekan <em>Resolve IHS</em>.</div>
            <div className="rounded-lg bg-slate-50 border p-3 text-xs text-black">
              <div className="font-medium mb-1">Contoh</div>
              <div>NIK: <code>3273••••••••••001</code> • Lahir: <code>2012‑04‑03</code> → IHS: <code>IHS‑1001‑2012‑0403</code> (format tiruan)</div>
            </div>
          </Card>

          <Card title="Antrian Kirim ke SATUSEHAT" icon={Send} toolbar={<button onClick={()=>setQueue([])} className="text-sm text-white hover:text-white">Bersihkan</button>}>
            <div className="max-h-56 overflow-auto divide-y">
              {queue.length===0 && <div className="text-sm text-white">Belum ada transaksi. Tekan tombol kirim di panel kanan.</div>}
              {queue.map(item=> (
                <div key={item.id} className="flex items-center justify-between py-2 text-sm">
                  <div className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-slate-300"/> <span className="font-medium">{item.kind}</span> <span className="text-white">— {item.student.name}</span></div>
                  {item.status==="Success" && <Badge tone="teal"><CheckCircle2 className="h-3.5 w-3.5"/> Sukses</Badge>}
                  {item.status==="Error" && <Badge tone="red"><XCircle className="h-3.5 w-3.5"/> Error</Badge>}
                  {item.status==="Ready" && <Badge tone="slate">Menunggu</Badge>}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Log / OperationOutcome (Mock)" icon={FileText}>
            <div className="max-h-64 overflow-auto text-sm">
              {logs.map(l=> (
                <div key={l.id} className="py-2 border-b last:border-0">
                  <div className="text-xs text-white">{new Date(l.ts).toLocaleString()}</div>
                  <div className={clsx("mt-0.5", l.level==="error"?"text-rose-700": l.level==="success"?"text-teal-700":"text-slate-400")}>{l.msg}</div>
                  {l.level==="error" && (
                    <div className="text-xs text-rose-600 mt-1">detail: code=value-set, location=Observation.code, requirement=LOINC</div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column (work panels) */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <Card title="Roster & Consent" icon={Users2} toolbar={
            <div className="flex items-center gap-2">
              <select value={classFilter} onChange={e=> setClassFilter(e.target.value)} className="rounded-lg border px-3 py-1.5 text-sm bg-theme-color-primary">
                <option value="All">Semua Kelas</option>
                {[...new Set(students.map(s=>s.kelas))].map(k=> <option key={k} value={k}>{k}</option>)}
              </select>
              <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-theme-color-primary/15"><FileSpreadsheet className="h-4 w-4"/> Unduh Template</button>
              <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-theme-color-primary/15"><Send className="h-4 w-4"/> Broadcast Consent (WA)</button>
            </div>
          }>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <th className="text-left text-white border-b-white/30"></th>                    
                  <th className="py-2 pr-2">Siswa</th>                   
                  <th className="py-2 pr-2">TB (cm)</th>
                </thead>
                <tbody>
                  {filtered.map(s=>{
                    const r = screening[s.id]||{};
                    const bmi = calcBMI(Number(r.tb)||0, Number(r.bb)||0);
                    const bf = bmiFlag(bmi);
                    return (
                      <tr key={s.id} className="border-b last:border-0">
                        <td className="py-2 pr-2 font-medium">{s.name}</td>
                        <td className="py-2 pr-2"><input type="number" inputMode="decimal" value={r.tb||""} onChange={e=>updateScreening(s.id,"tb",e.target.value)} className="w-24 rounded-lg border px-2 py-1 text-black bg-white/90" placeholder="140"/></td>
                        <td className="py-2 pr-2"><input type="number" inputMode="decimal" value={r.bb||""} onChange={e=>updateScreening(s.id,"bb",e.target.value)} className="w-24 rounded-lg border px-2 py-1 text-black bg-white/90" placeholder="35"/></td>
                        <td className="py-2 pr-2"><Badge tone={bf.tone as any}>{bmi??"-"} {bmi?`• ${bf.text}`:""}</Badge></td>
                        <td className="py-2 pr-2"><input value={r.visus||""} onChange={e=>updateScreening(s.id,"visus",e.target.value)} className="w-28 rounded-lg border px-2 py-1 text-black bg-white/90" placeholder="6/6"/></td>
                        <td className="py-2 pr-2"><input value={r.td||""} onChange={e=>updateScreening(s.id,"td",e.target.value)} className="w-28 rounded-lg border px-2 py-1 text-black bg-white/90" placeholder="110/70"/></td>
                        <td className="py-2 pr-2"><input value={r.note||""} onChange={e=>updateScreening(s.id,"note",e.target.value)} className="w-full rounded-lg border px-2 py-1 text-black bg-white/90" placeholder="Keluhan pusing saat siang"/></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-white">Mapping FHIR (mock): Observation.code → LOINC (TB/BB/BMI/Visus/TD), subject → Patient(IHS), performer → Practitioner.</div>
          </Card>

          <Card title="BIAS — Pencatatan Imunisasi (Immunization)" icon={Syringe} toolbar={
            <div className="flex items-center gap-2">
              <select className="rounded-lg border px-3 py-1.5 text-sm text-black bg-white/90">
                <option>Program: HPV</option>
                <option>Program: MR</option>
                <option>Program: DT‑Td</option>
              </select>
              <input type="date" className="rounded-lg border px-3 py-1.5 text-sm text-black bg-white/90"/>
              <button onClick={()=>pushFHIR("Immunization")} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 text-white px-3 py-1.5 text-sm hover:bg-teal-700"><Send className="h-4 w-4"/> Kirim Immunization</button>
            </div>
          }>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {filtered.map(s=> (
                <label key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-white">{s.kelas} • {s.ihs? s.ihs: "IHS belum di-resolve"}</div>
                  </div>
                  <input type="checkbox" className="h-4 w-4"/>
                </label>
              ))}
            </div>
            <div className="mt-3 text-xs text-white">Mapping FHIR (mock): Immunization.vaccineCode → KFA/WHO CVX (menyesuaikan), occurrenceDateTime, lotNumber(optional), performer.</div>
          </Card>

          <Card title="Ringkasan Kunjungan (Composition)" icon={FileText} toolbar={
            <button onClick={()=>pushFHIR("Composition")} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 text-white px-3 py-1.5 text-sm hover:bg-teal-700"><Send className="h-4 w-4"/> Kirim Resume</button>
          }>
            <div className="text-sm text-white">Dokumen ringkasan (resume) per kelas/hari kegiatan, merangkum Observations & tindakan imunisasi. Cocok untuk arsip sekolah dan lampiran rujukan.</div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="border-t py-6">
        <div className="mx-auto max-w-7xl px-6 text-xs text-white">
          XHB Sample • Antarmuka sekolah untuk consent, screening, dan imunisasi. Bridging ke SATUSEHAT hanya boleh menggunakan kredensial fasyankes mitra.
        </div>
      </footer> */}
    </div>
  );
}