// import { useSchool } from "@/features/schools";
// import { Dialog, Transition } from "@headlessui/react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { Newspaper, Plus, Save, X, Calendar, Hash } from "lucide-react";
// import React, { Fragment, useState } from "react";
// import { FaSpinner } from "react-icons/fa";

// const BASE_URL = "http://localhost:5010";

// export default function SerialControlMain() {
//   const queryClient = useQueryClient();
//   const schoolQuery = useSchool();
//   const schoolId = schoolQuery?.data?.[0]?.id;

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // 1. Fetch Daftar Langganan
//   const { data: subscriptions = [], isLoading: isLoadingSubs } = useQuery({
//     queryKey: ["serial-subscriptions", schoolId],
//     queryFn: async () => {
//       const res = await fetch(`${BASE_URL}/serial/subscriptions?schoolId=${schoolId}`);
//       const json = await res.json();
//       return json.data || [];
//     },
//     enabled: !!schoolId,
//   });

//   // 2. Fetch Daftar Biblio untuk Selector (Endpoint Baru Anda)
//   const { data: biblioOptions = [], isLoading: isLoadingBiblio } = useQuery({
//     queryKey: ["biblio-all", schoolId],
//     queryFn: async () => {
//       const res = await fetch(`${BASE_URL}/biblio/all?schoolId=${schoolId}`);
//       const json = await res.json();
//       return json.data || [];
//     },
//     enabled: isModalOpen && !!schoolId,
//   });

//   const handleCreateSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     const formData = new FormData(e.currentTarget);
    
//     const payload = {
//       biblioId: Number(formData.get("biblioId")),
//       periodicity: formData.get("periodicity"),
//       startPeriod: formData.get("startPeriod"),
//       endPeriod: formData.get("endPeriod"),
//       schoolId: Number(schoolId)
//     };

//     try {
//       const res = await fetch(`${BASE_URL}/serial/subscriptions`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const result = await res.json();
//       if (!result.success) throw new Error(result.message);

//       setIsModalOpen(false);
//       queryClient.invalidateQueries({ queryKey: ["serial-subscriptions"] });
//       alert("Langganan Berhasil Disimpan!");
//     } catch (err: any) {
//       alert("Gagal: " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       {/* HEADER */}
//       <header className="mb-12 flex justify-between items-center">
//         <div>
//           <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
//             Kendali <span className="text-blue-600">Serial</span>
//           </h1>
//           <p className="text-slate-500 font-medium mt-1">Manajemen langganan majalah & jurnal</p>
//         </div>
//         <button 
//           onClick={() => setIsModalOpen(true)} 
//           className="h-14 px-8 bg-blue-600 text-white rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 active:scale-95 transition-all"
//         >
//           <Plus size={18} strokeWidth={3} /> Langganan Baru
//         </button>
//       </header>

//       {/* MAIN GRID */}
//       <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {isLoadingSubs ? (
//           <div className="col-span-full flex justify-center py-20"><FaSpinner className="animate-spin text-blue-600" size={40} /></div>
//         ) : subscriptions.map((sub: any) => (
//           <div key={sub.id} className="group bg-white p-8 rounded-[1.4rem] shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
//              <div className="flex justify-between items-start mb-6">
//                 <div className="h-14 w-14 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
//                   <Newspaper size={28}/>
//                 </div>
//                 <div className="flex flex-col items-end">
//                   <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 mb-2">{sub.periodicity}</span>
//                   <div className={`h-2 w-2 rounded-full ${sub.status === 'Aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
//                 </div>
//              </div>
             
//              <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 leading-tight mb-4 min-h-[3.5rem] line-clamp-2">
//                 {sub.Biblio?.title || "Judul Tidak Ditemukan"}
//              </h3>
             
//              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
//                 <div className="flex items-center gap-2 text-slate-400">
//                   <Calendar size={14} />
//                   <span className="text-[10px] font-bold uppercase tracking-wider">
//                     {new Date(sub.startPeriod).getFullYear()} - {new Date(sub.endPeriod).getFullYear()}
//                   </span>
//                 </div>
//                 <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Detail Edisi →</button>
//              </div>
//           </div>
//         ))}
//       </main>

//       {/* SLIDE-OVER FORM */}
//       <Transition show={isModalOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-[999]" onClose={() => setIsModalOpen(false)}>
//           <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
//             <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
//           </Transition.Child>

//           <div className="fixed inset-y-0 right-0 w-full max-w-xl flex">
//             <Transition.Child as={Fragment} enter="transform transition duration-500 cubic-bezier(0.4, 0, 0.2, 1)" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-400" leaveFrom="translate-x-0" leaveTo="translate-x-full">
//               <Dialog.Panel className="h-full w-full bg-white p-10 shadow-2xl flex flex-col">
//                 <div className="flex justify-between items-start mb-12">
//                   <div>
//                     <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Manajemen Koleksi</span>
//                     <Dialog.Title className="text-3xl font-black uppercase tracking-tighter text-slate-900">Input Serial</Dialog.Title>
//                   </div>
//                   <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 rounded-3xl hover:bg-rose-50 hover:text-rose-600 transition-all group">
//                     <X size={24} className="group-hover:rotate-90 transition-transform" />
//                   </button>
//                 </div>

//                 <form onSubmit={handleCreateSubscription} className="space-y-8 overflow-y-auto pr-4 custom-scrollbar">
//                   {/* SELECT BIBLIO */}
//                   <div className="space-y-3">
//                     <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
//                       <Hash size={14} /> Bibliografi Terdaftar
//                     </label>
//                     <div className="relative">
//                       <select 
//                         name="biblioId" 
//                         required 
//                         className="w-full bg-slate-100 text-slate-900 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-6 py-5 text-sm font-bold outline-none transition-all appearance-none cursor-pointer"
//                       >
//                         <option className="text-slate-900" value="">{isLoadingBiblio ? "🔄 Memuat Data..." : "-- Pilih Judul Koleksi --"}</option>
//                         {biblioOptions.map((b: any) => (
//                           <option className="text-slate-900" key={b.biblioId} value={b.biblioId}>
//                             {b.title} {b.isbnIssn ? `(${b.isbnIssn})` : ""}
//                           </option>
//                         ))}
//                       </select>
//                       <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                         <Plus size={16} className="rotate-45" />
//                       </div>
//                     </div>
//                   </div>

//                   {/* PERIODICITY */}
//                   <div className="space-y-3">
//                     <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
//                       <Calendar size={14} /> Frekuensi Penerbitan
//                     </label>
//                     <div className="grid grid-cols-2 gap-3">
//                       {["Harian", "Mingguan", "Bulanan", "Tahunan"].map((p) => (
//                         <label key={p} className="relative cursor-pointer group">
//                           <input type="radio" name="periodicity" value={p} required className="peer sr-only" defaultChecked={p === "Bulanan"} />
//                           <div className="p-4 text-center rounded-2xl bg-slate-50 border-2  border-slate-600/10 peer-checked:border-blue-600 peer-checked:bg-blue-50 text-xs font-black uppercase tracking-widest text-slate-400 peer-checked:text-blue-600 transition-all">
//                             {p}
//                           </div>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   {/* DATES */}
//                   <div className="grid grid-cols-2 gap-6">
//                     <div className="space-y-3">
//                       <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Mulai Langganan</label>
//                       <input name="startPeriod" type="date" required className="w-full bg-slate-100 border-2 text-slate-900 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
//                     </div>
//                     <div className="space-y-3">
//                       <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Berakhir Pada</label>
//                       <input name="endPeriod" type="date" required className="w-full bg-slate-100 border-2 text-slate-900 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
//                     </div>
//                   </div>

//                   {/* SUBMIT */}
//                   <div className="pt-8">
//                     <button 
//                       type="submit" 
//                       disabled={isSubmitting || isLoadingBiblio} 
//                       className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {isSubmitting ? <FaSpinner className="animate-spin" /> : <Save size={20} />} 
//                       Simpan Kontrak Serial
//                     </button>
//                   </div>
//                 </form>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// }

import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Newspaper, Plus, Save, X, Calendar, Hash, Sparkles, CheckCircle2, RotateCw, Edit3, Trash2, Library } from "lucide-react";
import React, { Fragment, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const BASE_URL = "http://localhost:5010";

export default function SerialControlMain() {
  const queryClient = useQueryClient();
  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null); // State untuk mengelola edisi per langganan
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIssue, setEditingIssue] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Untuk kontrol buka/tutup modal edit

  // 1. Fetch Daftar Langganan
  const { data: subscriptions = [], isLoading: isLoadingSubs, isFetching: isFetchingSubs, refetch: refetchSubs } = useQuery({
    queryKey: ["serial-subscriptions", schoolId],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/serial/subscriptions?schoolId=${schoolId}`);
      const json = await res.json();
      return json.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
    enabled: !!schoolId,
  });

  // 2. Fetch Daftar Biblio untuk Selector
  const { data: biblioOptions = [], isLoading: isLoadingBiblio, isFetching: isFetchingBiblio, refetch: refetchBiblio } = useQuery({
    queryKey: ["biblio-all", schoolId],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/biblio/all?schoolId=${schoolId}`);
      const json = await res.json();
      return json.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
    enabled: isModalOpen && !!schoolId,
  });

  // 3. Fetch Edisi berdasarkan SubID yang dipilih
  const { data: issues = [], isFetching: isFetchingIssues, refetch: refetchIssue } = useQuery({
    queryKey: ["serial-issues", selectedSub?.id],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/serial/issues?subscriptionId=${selectedSub.id}`);
      const json = await res.json();
      return json.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
    enabled: !!selectedSub?.id,
  });

  const handleCreateSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      biblioId: Number(formData.get("biblioId")),
      periodicity: formData.get("periodicity"),
      startPeriod: formData.get("startPeriod"),
      endPeriod: formData.get("endPeriod"),
      schoolId: Number(schoolId)
    };

    try {
      const res = await fetch(`${BASE_URL}/serial/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["serial-subscriptions"] });
    } catch (err: any) { alert("Gagal: " + err.message); } 
    finally { setIsSubmitting(false); }
  };

  const handleGenerateIssues = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`${BASE_URL}/serial/generate-issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: selectedSub.id,
          count: Number(formData.get("count")),
          startDate: formData.get("startDate")
        })
      });
      const result = await res.json();
      if (result.success) {
        setIsGenModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["serial-issues", selectedSub.id] });
      }
    } catch (err) { alert("Gagal generate"); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteIssue = async (id: number) => {
    if (!confirm("Hapus edisi ini? Tindakan ini tidak bisa dibatalkan.")) return;
    
    try {
      const res = await fetch(`${BASE_URL}/serial/issues/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) {
        queryClient.invalidateQueries({ queryKey: ["serial-issues", selectedSub.id] });
      }
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  const handleReceiveIssue = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/serial/receive-issue/${id}`, { method: 'PUT' });
      if ((await res.json()).success) {
        queryClient.invalidateQueries({ queryKey: ["serial-issues", selectedSub.id] });
      }
    } catch (err) { alert("Gagal update status"); }
  };

  const handleUpdateIssue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      expectedDate: formData.get("expectedDate"),
      status: formData.get("status"),
      // tambahkan volume/number jika model Anda mendukungnya
    };

    try {
      const res = await fetch(`${BASE_URL}/serial/issues/${editingIssue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (result.success) {
        setIsEditModalOpen(false);
        setEditingIssue(null);
        queryClient.invalidateQueries({ queryKey: ["serial-issues", selectedSub?.id] });
      }
    } catch (err) {
      alert("Gagal memperbarui edisi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2 font-black text-blue-600 uppercase tracking-[0.3em] text-[10px]"><Library size={14} /> Pendataan serial</div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-800">Kendali <span className="text-blue-600">Serial</span></h1>
        </div>

        <div className="w-max flex items-center gap-3">
          <button 
            onClick={async () => {
              await Promise.all([
                refetchSubs(),
                refetchBiblio(),
                refetchIssue()
              ]);
            }}
            className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100"
            title="Refresh Semua Data"
          >
            <RotateCw size={18} className={isFetchingIssues || isFetchingSubs ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="h-14 px-8 bg-blue-600 text-white rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 active:scale-95 transition-all">
            <Plus size={18} strokeWidth={3} /> Langganan Baru
          </button>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoadingSubs ? (
          <div className="col-span-full flex justify-center py-20"><FaSpinner className="animate-spin text-blue-600" size={40} /></div>
        ) : subscriptions.map((sub: any) => (
          <div key={sub.id} className="group bg-white p-6 rounded-[1.4rem] shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Newspaper size={28}/>
                </div>
             </div>
             <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 leading-tight mb-4 min-h-[3.5rem] line-clamp-2">{sub.Biblio?.title}</h3>
             <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase">
                  <Calendar size={14} /> {new Date(sub.startPeriod).getFullYear()} - {new Date(sub.endPeriod).getFullYear()}
                </div>
                <span className="text-[10px] font-black uppercase text-slate-500">{sub.periodicity}</span>
             </div>
             <button onClick={() => setSelectedSub(sub)} className="text-[10px] w-full bg-blue-100 py-3 rounded-md mt-4 font-black text-blue-600 uppercase hover:underline">Detail Edisi →</button>
          </div>
        ))}
      </main>

      {/* --- MODAL 1: INPUT LANGGANAN BARU (SUBSCRIPTION) --- */}
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" /></Transition.Child>
          <div className="fixed inset-y-0 right-0 w-full max-w-xl flex">
            <Transition.Child as={Fragment} enter="transform transition duration-500 ease-in-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-400" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full w-full bg-white p-10 shadow-2xl flex flex-col">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Manajemen Kontrak</span>
                    <Dialog.Title className="text-3xl font-black uppercase tracking-tighter text-slate-900">Kontrak Serial</Dialog.Title>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 rounded-3xl hover:bg-rose-50 transition-all"><X size={24} /></button>
                </div>
                <form onSubmit={handleCreateSubscription} className="space-y-8 overflow-y-auto pr-4">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-400">Bibliografi Terdaftar</label>
                    <select name="biblioId" required className="w-full bg-slate-100 rounded-2xl px-6 py-5 text-sm font-bold outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer">
                      <option value="">{isLoadingBiblio ? "🔄 Memuat..." : "-- Pilih Judul Koleksi --"}</option>
                      {biblioOptions.map((b: any) => (<option key={b.biblioId} value={b.biblioId}>{b.title}</option>))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-400">Frekuensi Penerbitan</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Harian", "Mingguan", "Bulanan", "Tahunan"].map((p) => (
                        <label key={p} className="relative cursor-pointer group">
                          <input type="radio" name="periodicity" value={p} required className="peer sr-only" defaultChecked={p === "Bulanan"} />
                          <div className="p-4 text-center rounded-2xl bg-slate-50 border-2 border-slate-600/10 peer-checked:border-blue-600 peer-checked:bg-blue-50 text-xs font-black uppercase text-slate-400 peer-checked:text-blue-600 transition-all">{p}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase text-slate-400">Mulai</label>
                      <input name="startPeriod" type="date" required className="w-full bg-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase text-slate-400">Berakhir</label>
                      <input name="endPeriod" type="date" required className="w-full bg-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-blue-600 transition-all">
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <Save size={20} />} Simpan Kontrak
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* --- MODAL 2: DETAIL ISSUE & CHECK-IN (SIDEBAR) --- */}
      <Transition show={!!selectedSub} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setSelectedSub(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-y-0 right-0 w-full max-w-2xl flex">
            <Transition.Child as={Fragment} enter="transform transition duration-500" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-400" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full w-full bg-white p-10 shadow-2xl flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-blue-900 leading-tight">{selectedSub?.Biblio?.title}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Daftar Edisi Kedatangan</p>
                  </div>
                  <button onClick={() => setSelectedSub(null)} className="relative top-[-4px] p-3 bg-red-600 rounded-3xl hover:bg-red-500 transition-all"><X size={24}/></button>
                </div>

                <div className="flex gap-4 mb-8">
                  <button onClick={() => setIsGenModalOpen(true)} className="flex-1 py-4 bg-emerald-200 text-emerald-800 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all">
                    <Sparkles size={16} /> Auto Generate Jadwal
                  </button>
                  <button 
                   onClick={async () => {
                      await Promise.all([
                        refetchSubs(),
                        refetchBiblio(),
                        refetchIssue()
                      ]);
                    }}
                    className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100"
                    title="Refresh Semua Data"
                  >
                    <RotateCw size={18} className={isFetchingIssues || isFetchingSubs ? "animate-spin" : ""} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {issues.length > 0 ? (
                    issues.map((issue: any) => (
                      <div
                        key={issue.id}
                        className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-5">
                          {/* Status Indicator Dot */}
                          <div className={`h-2 w-2 rounded-full ${issue.status === 'Arrived' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                          
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                                Edisi {new Date(issue.expectedDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                issue.status === 'Arrived' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                              }`}>
                                {issue.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                              <span>Expected: {new Date(issue.expectedDate).toLocaleDateString('id-ID')}</span>
                              {issue.receivedDate && (
                                <span className="text-emerald-500">— Received: {new Date(issue.receivedDate).toLocaleDateString('id-ID')}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* ACTIONS WRAPPER (Hidden by default, shown on group hover) */}
                          <div className="flex items-center gap-1 mr-2">
                            <button 
                              onClick={() => { 
                                setEditingIssue(issue);      // Simpan data baris ini ke state editing
                                setIsEditModalOpen(true);    // Buka modal edit
                              }}
                              className="p-2.5 text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                              title="Edit Edisi"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteIssue(issue.id)}
                              className="p-2.5 text-red-500 hover:text-red-600 bg-red-100 hover:bg-red-20 rounded-xl transition-all"
                              title="Hapus Edisi"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* CHECK-IN BUTTON */}
                          {issue.status === 'Expected' ? (
                            <button 
                              onClick={() => handleReceiveIssue(issue.id)} 
                              className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 shadow-lg shadow-slate-200 active:scale-95 transition-all"
                            >
                              Check-in
                            </button>
                          ) : (
                            <div className="px-4 py-3 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest border border-emerald-100">
                              <CheckCircle2 size={16} /> Success
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-24 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                      <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <ArchiveIcon className="text-slate-200" size={40} />
                      </div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Belum ada jadwal edisi</p>
                      <p className="text-[10px] text-slate-300 mt-2">Gunakan tombol Auto Generate di atas.</p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* --- MODAL 3: AUTO GENERATE POPUP --- */}
      <Transition show={isGenModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[1000]" onClose={() => setIsGenModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md bg-white p-8 rounded-[1.4rem] shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black uppercase text-slate-800">Generate Edisi</h3>
                  <button onClick={() => setIsGenModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
                </div>
                <form onSubmit={handleGenerateIssues} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Jumlah Edisi (Bulan)</label>
                      <input name="count" type="number" defaultValue="12" required className="w-full bg-slate-100 p-5 rounded-2xl font-bold outline-none focus:ring-2 ring-emerald-500" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mulai Dari Tanggal</label>
                      <input name="startDate" type="date" required className="w-full bg-slate-100 p-5 rounded-2xl font-bold outline-none focus:ring-2 ring-emerald-500" />
                   </div>
                   <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100 transition-all flex justify-center items-center gap-3">
                      {isSubmitting ? <FaSpinner className="animate-spin" /> : <Sparkles size={18}/>} Generate Sekarang
                   </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* --- MODAL EDIT ISSUE --- */}
      <Transition show={isEditModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[1001]" onClose={() => setIsEditModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md bg-white p-10 rounded-[1.4rem] shadow-2xl relative overflow-hidden">
                {/* Aksesoris Desain */}
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Edit3 size={120} />
                </div>

                <div className="flex justify-between items-center mb-8 relative">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-800">Edit <span className="text-blue-600">Edisi</span></h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Update jadwal kedatangan</p>
                  </div>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all"><X size={20}/></button>
                </div>

                <form onSubmit={handleUpdateIssue} className="space-y-6 relative">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tanggal Ekspektasi</label>
                    <input 
                      name="expectedDate" 
                      type="date" 
                      // Mengonversi tanggal dari DB ke format YYYY-MM-DD yang dimengerti input type="date"
                      defaultValue={editingIssue?.expectedDate ? new Date(editingIssue.expectedDate).toISOString().split('T')[0] : ''} 
                      required
                      className="w-full bg-slate-100 p-5 rounded-2xl font-bold outline-none focus:ring-2 ring-blue-500 border-none transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Status Edisi</label>
                    <select 
                      name="status" 
                      defaultValue={editingIssue?.status}
                      className="w-full bg-slate-100 p-5 rounded-2xl font-bold outline-none focus:ring-2 ring-blue-500 border-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Expected">Expected (Menunggu)</option>
                      <option value="Arrived">Arrived (Sudah Diterima)</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-blue-600 transition-all flex justify-center items-center gap-3"
                    >
                      {isSubmitting ? <FaSpinner className="animate-spin" /> : <Save size={18}/>} Simpan Perubahan
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
}

// Icon Helper
function ArchiveIcon({ className, size }: { className?: string, size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8"></polyline>
      <rect x="1" y="3" width="22" height="5"></rect>
      <line x1="10" y1="12" x2="14" y2="12"></line>
    </svg>
  );
}