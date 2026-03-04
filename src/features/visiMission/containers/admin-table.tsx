// import { useSchool } from "@/features/schools";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   ArrowDown,
//   ArrowUp,
//   BarChart3,
//   Info,
//   Plus,
//   Rocket,
//   Save,
//   ShieldCheck,
//   Sparkles,
//   Target,
//   Trash2
// } from "lucide-react";
// import React, { useCallback, useEffect, useState } from "react";

// // === UTILITIES ===
// const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

// const useAlert = () => {
//   const [alert, setAlert] = useState({ message: "", isVisible: false });
//   const showAlert = useCallback((msg: string) => setAlert({ message: msg, isVisible: true }), []);
//   const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
//   return { alert, showAlert, hideAlert };
// };

// const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
//   const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 20 }}
//       className={clsx(
//         "fixed top-6 right-6 z-[100] min-w-[320px] rounded-2xl border p-4 shadow-2xl backdrop-blur-xl",
//         isSuccess ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"
//       )}
//     >
//       <div className="flex items-center justify-between gap-4 font-bold tracking-tight">
//         <span>{message}</span>
//         <button onClick={onClose} className="hover:opacity-50">✕</button>
//       </div>
//     </motion.div>
//   );
// };

// // === UI COMPONENTS ===
// const Card = ({ children, title, icon: Icon, className }: any) => (
//   <div className={clsx("bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-blue-500/20 transition-all", className)}>
//     <div className="flex items-center gap-3 mb-6">
//       <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-500 group-hover:scale-110 transition-transform">
//         <Icon size={20} />
//       </div>
//       <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 italic">{title}</h3>
//     </div>
//     <div className="relative z-10">{children}</div>
//   </div>
// );

// const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
//   <input {...props} className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm text-white outline-none focus:border-blue-600/50 focus:bg-white/10 transition-all placeholder-zinc-600" />
// );

// const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
//   <textarea {...props} className="w-full rounded-[2rem] border border-white/5 bg-white/5 px-6 py-5 text-lg font-medium text-white outline-none focus:border-blue-600/50 focus:bg-white/10 transition-all placeholder-zinc-700 min-h-[160px] italic leading-relaxed" />
// );

// // === INTERFACE ===
// interface VisiMisi {
//   id?: number;
//   vision: string;
//   missions: string[];
//   pillars: string[];
//   kpis: Array<{ indicator: string; target: number }>;
// }

// const DEFAULT_VISIMISI: VisiMisi = { vision: "", missions: [], pillars: [], kpis: [] };

// export function VisiMisi() {
//   const [data, setData] = useState<VisiMisi>(DEFAULT_VISIMISI);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();

//   const { data: schoolResponse } = useSchool();
//   const schoolId = schoolResponse?.[0]?.id;
//   const BASE_URL = "https://be-school.kiraproject.id/visi-misi";

//   useEffect(() => {
//     if (!schoolId) return;
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`);
//         const json = await res.json();
//         const records = json.success ? json.data : json;
//         if (Array.isArray(records) && records.length > 0) {
//           setData({
//             ...records[0],
//             missions: records[0].missions || [],
//             pillars: records[0].pillars || [],
//             kpis: (records[0].kpis || []).map((k: any) => ({ indicator: k.indicator || k.name || "", target: Number(k.target) || 0 }))
//           });
//         }
//       } catch (err) { showAlert("Gagal sinkronisasi data"); }
//       finally { setLoading(false); }
//     };
//     fetchData();
//   }, [schoolId, showAlert]);

//   const update = (patch: Partial<VisiMisi>) => setData(p => ({ ...p, ...patch }));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!schoolId) return;
//     setSaving(true);
//     try {
//       const payload = { ...data, schoolId };
//       const res = await fetch(data.id ? `${BASE_URL}/${data.id}` : BASE_URL, {
//         method: data.id ? "PUT" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error();
//       const result = await res.json();
//       if (!data.id && result.data?.id) update({ id: result.data.id });
//       showAlert("Visi & Misi Berhasil Disinkronkan");
//     } catch (err) { showAlert("Gagal menyimpan data"); }
//     finally { setSaving(false); }
//   };

//   if (loading || !schoolId) return <div className="p-20 text-center font-black tracking-widest text-zinc-700 animate-pulse">BOOTING STRATEGY SYSTEM...</div>;

//   return (
//     <div className="pb-20">
//       <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

//       <form onSubmit={handleSubmit} className="space-y-8">
//         {/* --- HEADER --- */}
//         <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <Sparkles size={16} className="text-blue-500 fill-blue-500" />
//               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Institutional Strategy</span>
//             </div>
//             <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
//               Visi & <span className="text-blue-600">Misi</span> Sekolah
//             </h1>
//             <p className="text-zinc-500 text-sm font-medium">Tujuan jangka panjang</p>
//           </div>
//           <button
//             type="submit"
//             disabled={saving}
//             className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
//           >
//             {saving ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
//             <span className="uppercase tracking-widest text-sm">{saving ? "Saving..." : "Deploy Strategy"}</span>
//           </button>
//         </header>

//         {/* --- BENTO GRID --- */}
//         <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
//           {/* VISI - Main Bento (Span 12) */}
//           <Card title="Core Vision" icon={Target} className="md:col-span-12 !bg-blue-600/5 !border-blue-600/20">
//             <TextArea 
//               value={data.vision} 
//               onChange={(e) => update({ vision: e.target.value })} 
//               placeholder="E.g. Menjadi institusi pendidikan vokasi kelas dunia yang menghasilkan pemimpin masa depan..."
//             />
//             <div className="mt-4 flex items-center gap-2 text-blue-500/60 text-xs font-bold italic">
//               <Info size={14} />
//               <span>Visi harus bersifat jangka panjang, inspiratif, dan mudah diingat.</span>
//             </div>
//           </Card>

//           {/* MISI - (Span 7) */}
//           <Card title="Strategic Missions" icon={Rocket} className="md:col-span-7">
//             <div className="space-y-4">
//               {data.missions.map((m, idx) => (
//                 <div key={idx} className="flex gap-3 group/item">
//                   <div className="flex flex-col gap-1">
//                     <button type="button" onClick={() => {
//                       if (idx === 0) return;
//                       const copy = [...data.missions];
//                       [copy[idx-1], copy[idx]] = [copy[idx], copy[idx-1]];
//                       update({ missions: copy });
//                     }} className="p-1 hover:text-blue-500 text-zinc-600"><ArrowUp size={14}/></button>
//                     <button type="button" onClick={() => {
//                       if (idx === data.missions.length -1) return;
//                       const copy = [...data.missions];
//                       [copy[idx+1], copy[idx]] = [copy[idx], copy[idx+1]];
//                       update({ missions: copy });
//                     }} className="p-1 hover:text-blue-500 text-zinc-600"><ArrowDown size={14}/></button>
//                   </div>
//                   <Input 
//                     value={m} 
//                     onChange={(e) => {
//                       const copy = [...data.missions];
//                       copy[idx] = e.target.value;
//                       update({ missions: copy });
//                     }}
//                     placeholder={`Misi poin ke-${idx + 1}`} 
//                   />
//                   <button 
//                     type="button"
//                     onClick={() => update({ missions: data.missions.filter((_, i) => i !== idx) })}
//                     className="p-4 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/item:opacity-100"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => update({ missions: [...data.missions, ""] })}
//                 className="w-full py-4 rounded-2xl border border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 text-zinc-500 hover:text-blue-500 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
//               >
//                 <Plus size={16} /> Tambah Misi Baru
//               </button>
//             </div>
//           </Card>

//           {/* PILLARS - (Span 5) */}
//           <Card title="Foundational Pillars" icon={ShieldCheck} className="md:col-span-5">
//             <div className="space-y-3">
//               {data.pillars.map((p, idx) => (
//                 <div key={idx} className="flex items-center gap-2">
//                   <Input 
//                     value={p} 
//                     onChange={(e) => {
//                       const copy = [...data.pillars];
//                       copy[idx] = e.target.value;
//                       update({ pillars: copy });
//                     }}
//                     placeholder="Contoh: Integritas"
//                   />
//                   <button 
//                     type="button"
//                     onClick={() => update({ pillars: data.pillars.filter((_, i) => i !== idx) })}
//                     className="text-zinc-600 hover:text-red-500 p-2"
//                   ><Trash2 size={16}/></button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => update({ pillars: [...data.pillars, ""] })}
//                 className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-black uppercase tracking-widest transition-all"
//               >+ Tambah Pilar</button>
//             </div>
//           </Card>

//           {/* KPI - (Span 12) */}
//           <Card title="Key Performance Indicators (KPI)" icon={BarChart3} className="md:col-span-12">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {data.kpis.map((k, idx) => (
//                 <div key={idx} className="flex items-center gap-4 bg-black/20 p-4 rounded-[1.5rem] border border-white/5 group/kpi">
//                   <div className="flex-1">
//                     <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Indicator Name</p>
//                     <Input 
//                       value={k.indicator}
//                       onChange={(e) => {
//                         const copy = [...data.kpis];
//                         copy[idx].indicator = e.target.value;
//                         update({ kpis: copy });
//                       }}
//                     />
//                   </div>
//                   <div className="w-24">
//                     <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Target %</p>
//                     <Input 
//                       type="number"
//                       value={k.target}
//                       onChange={(e) => {
//                         const copy = [...data.kpis];
//                         copy[idx].target = Number(e.target.value);
//                         update({ kpis: copy });
//                       }}
//                     />
//                   </div>
//                   <button 
//                     type="button"
//                     onClick={() => update({ kpis: data.kpis.filter((_, i) => i !== idx) })}
//                     className="self-end mb-1 p-3 text-zinc-700 hover:text-red-500 transition-colors"
//                   ><Trash2 size={18}/></button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => update({ kpis: [...data.kpis, { indicator: "", target: 0 }] })}
//                 className="h-full min-h-[80px] rounded-[1.5rem] border-2 border-dashed border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 text-zinc-600 hover:text-blue-500 transition-all font-black text-xs uppercase tracking-[0.2em]"
//               >+ Add New KPI Metric</button>
//             </div>
//           </Card>

//         </motion.div>
//       </form>
//     </div>
//   );
// }




import { useSchool } from "@/features/schools";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Tambahkan ini
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Info,
  Plus,
  Rocket,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

// === UTILITIES ===
const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

const useAlert = () => {
  const [alert, setAlert] = useState({ message: "", isVisible: false });
  const showAlert = useCallback((msg: string) => setAlert({ message: msg, isVisible: true }), []);
  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
  return { alert, showAlert, hideAlert };
};

const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={clsx(
        "fixed top-6 right-6 z-[100] min-w-[320px] rounded-2xl border p-4 shadow-2xl backdrop-blur-xl",
        isSuccess ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"
      )}
    >
      <div className="flex items-center justify-between gap-4 font-bold tracking-tight">
        <span>{message}</span>
        <button onClick={onClose} className="hover:opacity-50">✕</button>
      </div>
    </motion.div>
  );
};

// === UI COMPONENTS ===
const Card = ({ children, title, icon: Icon, className }: any) => (
  <div className={clsx("bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-blue-500/20 transition-all", className)}>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-500 group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 italic">{title}</h3>
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm text-white outline-none focus:border-blue-600/50 focus:bg-white/10 transition-all placeholder-zinc-600" />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full rounded-[2rem] border border-white/5 bg-white/5 px-6 py-5 text-lg font-medium text-white outline-none focus:border-blue-600/50 focus:bg-white/10 transition-all placeholder-zinc-700 min-h-[160px] italic leading-relaxed" />
);

// === INTERFACE ===
interface VisiMisi {
  id?: number;
  vision: string;
  missions: string[];
  pillars: string[];
  kpis: Array<{ indicator: string; target: number }>;
}

const DEFAULT_VISIMISI: VisiMisi = { vision: "", missions: [], pillars: [], kpis: [] };

export function VisiMisi() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<VisiMisi>(DEFAULT_VISIMISI);
  const [saving, setSaving] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const { data: schoolResponse } = useSchool();
  const schoolId = schoolResponse?.[0]?.id;
  const BASE_URL = "https://be-school.kiraproject.id/visi-misi";

  // ─── REACT QUERY FETCH ──────────────────────────────────────────
  const { data: fetchedData, isLoading, isFetching } = useQuery({
    queryKey: ["visiMisi", schoolId],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`);
      const json = await res.json();
      const records = json.success ? json.data : json;
      
      if (Array.isArray(records) && records.length > 0) {
        return {
          ...records[0],
          missions: records[0].missions || [],
          pillars: records[0].pillars || [],
          kpis: (records[0].kpis || []).map((k: any) => ({
            indicator: k.indicator || k.name || "",
            target: Number(k.target) || 0
          }))
        } as VisiMisi;
      }
      return DEFAULT_VISIMISI;
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,   // 10 Menit
  });

  // Sinkronkan local state saat data berhasil di-fetch
  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);
    }
  }, [fetchedData]);

  const update = (patch: Partial<VisiMisi>) => setData(p => ({ ...p, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    setSaving(true);
    try {
      const payload = { ...data, schoolId };
      const res = await fetch(data.id ? `${BASE_URL}/${data.id}` : BASE_URL, {
        method: data.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      
      showAlert("Visi & Misi Berhasil Disinkronkan");
      
      // INVALIDASI CACHE agar data terbaru masuk ke useQuery
      queryClient.invalidateQueries({ queryKey: ["visiMisi", schoolId] });
      
    } catch (err) { 
      showAlert("Gagal menyimpan data"); 
    } finally { 
      setSaving(false); 
    }
  };

  if (isLoading || !schoolId) return (
    <div className="flex flex-col items-center justify-center p-20 text-zinc-500 space-y-4">
      <FaSpinner className="animate-spin text-blue-600" size={30} />
      <div className="font-black tracking-[0.5em] text-[10px] uppercase text-zinc-700 animate-pulse">BOOTING STRATEGY SYSTEM...</div>
    </div>
  );

  return (
    <div className="pb-20">
      <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={16} className={clsx("text-blue-500 fill-blue-500", isFetching && "animate-pulse")} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
                Institutional Strategy {isFetching && " (Syncing...)"}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
              Visi & <span className="text-blue-600">Misi</span> Sekolah
            </h1>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <Save size={20} />}
            <span className="uppercase tracking-widest text-sm">{saving ? "Deploying..." : "Deploy Strategy"}</span>
          </button>
        </header>

        {/* --- BENTO GRID --- */}
        <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          <Card title="Core Vision" icon={Target} className="md:col-span-12 !bg-blue-600/5 !border-blue-600/20">
            <TextArea 
              value={data.vision} 
              onChange={(e) => update({ vision: e.target.value })} 
              placeholder="E.g. Menjadi institusi pendidikan vokasi kelas dunia..."
            />
          </Card>

          <Card title="Strategic Missions" icon={Rocket} className="md:col-span-7">
            <div className="space-y-4">
              {data.missions.map((m, idx) => (
                <div key={idx} className="flex gap-3 group/item">
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={() => {
                      if (idx === 0) return;
                      const copy = [...data.missions];
                      [copy[idx-1], copy[idx]] = [copy[idx], copy[idx-1]];
                      update({ missions: copy });
                    }} className="p-1 hover:text-blue-500 text-zinc-600"><ArrowUp size={14}/></button>
                    <button type="button" onClick={() => {
                      if (idx === data.missions.length -1) return;
                      const copy = [...data.missions];
                      [copy[idx+1], copy[idx]] = [copy[idx], copy[idx+1]];
                      update({ missions: copy });
                    }} className="p-1 hover:text-blue-500 text-zinc-600"><ArrowDown size={14}/></button>
                  </div>
                  <Input 
                    value={m} 
                    onChange={(e) => {
                      const copy = [...data.missions];
                      copy[idx] = e.target.value;
                      update({ missions: copy });
                    }}
                    placeholder={`Misi poin ke-${idx + 1}`} 
                  />
                  <button 
                    type="button"
                    onClick={() => update({ missions: data.missions.filter((_, i) => i !== idx) })}
                    className="p-4 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/item:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update({ missions: [...data.missions, ""] })}
                className="w-full py-4 rounded-2xl border border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 text-zinc-500 hover:text-blue-500 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Tambah Misi Baru
              </button>
            </div>
          </Card>

          <Card title="Foundational Pillars" icon={ShieldCheck} className="md:col-span-5">
            <div className="space-y-3">
              {data.pillars.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input 
                    value={p} 
                    onChange={(e) => {
                      const copy = [...data.pillars];
                      copy[idx] = e.target.value;
                      update({ pillars: copy });
                    }}
                    placeholder="Contoh: Integritas"
                  />
                  <button 
                    type="button"
                    onClick={() => update({ pillars: data.pillars.filter((_, i) => i !== idx) })}
                    className="text-zinc-600 hover:text-red-500 p-2"
                  ><Trash2 size={16}/></button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update({ pillars: [...data.pillars, ""] })}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-black uppercase tracking-widest transition-all"
              >+ Tambah Pilar</button>
            </div>
          </Card>

          <Card title="Key Performance Indicators (KPI)" icon={BarChart3} className="md:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.kpis.map((k, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-black/20 p-4 rounded-[1.5rem] border border-white/5 group/kpi">
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Indicator Name</p>
                    <Input 
                      value={k.indicator}
                      onChange={(e) => {
                        const copy = [...data.kpis];
                        copy[idx].indicator = e.target.value;
                        update({ kpis: copy });
                      }}
                    />
                  </div>
                  <div className="w-24">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Target %</p>
                    <Input 
                      type="number"
                      value={k.target}
                      onChange={(e) => {
                        const copy = [...data.kpis];
                        copy[idx].target = Number(e.target.value);
                        update({ kpis: copy });
                      }}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => update({ kpis: data.kpis.filter((_, i) => i !== idx) })}
                    className="self-end mb-1 p-3 text-zinc-700 hover:text-red-500 transition-colors"
                  ><Trash2 size={18}/></button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update({ kpis: [...data.kpis, { indicator: "", target: 0 }] })}
                className="h-full min-h-[80px] rounded-[1.5rem] border-2 border-dashed border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 text-zinc-600 hover:text-blue-500 transition-all font-black text-xs uppercase tracking-[0.2em]"
              >+ Add New KPI Metric</button>
            </div>
          </Card>

        </motion.div>
      </form>
    </div>
  );
}