import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit,
  Hash,
  LayoutGrid,
  Plus,
  RotateCw,
  Save,
  Search,
  Tag,
  Trash2,
  X,
  AlignLeft,
  CheckCircle2,
  Circle
} from "lucide-react";
import React, { Fragment, useCallback, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const BASE_URL = "https://be-perpus.kiraproject.id";

// --- UTILS ---
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

// --- COMPONENTS ---
const Alert: React.FC<{ message: string; type: "success" | "error"; onClose: () => void }> = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    className={clsx(
      "flex items-center justify-between px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl w-full max-w-md fixed top-8 left-1/2 -translate-x-1/2 z-[100]",
      type === "success" ? "bg-emerald-600 border-emerald-400 text-white" : "bg-rose-600 border-rose-400 text-white"
    )}
  >
    <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest">{message}</div>
    <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={18} /></button>
  </motion.div>
);

const Field: React.FC<{ label?: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <div className={clsx("space-y-2", className)}>
    {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic">{label}</label>}
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>) => {
  const baseClass = "w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-blue-500 transition-all text-sm font-bold";
  if (props.type === 'textarea') return <textarea {...(props as any)} className={clsx(baseClass, "min-h-[120px] resize-none")} />;
  return <input {...props} className={baseClass} />;
};

// --- API FETCHERS ---
const fetchGenres = async ({ schoolId, searchTerm }: any) => {
  if (!schoolId) return null;
  const url = `${BASE_URL}/genre?schoolId=${schoolId}&q=${searchTerm}`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
};


export default function GenrePage() {
  const queryClient = useQueryClient();
  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ message: "", isVisible: false, type: "success" as "success" | "error" });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["genres", schoolId, searchTerm],
    queryFn: () => fetchGenres({ schoolId, searchTerm }),
    enabled: !!schoolId,
  });

  const genres = data?.data || [];

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, isVisible: true, type });
    setTimeout(() => setAlert(prev => ({ ...prev, isVisible: false })), 5000);
  }, []);

  const openModal = (genre: any = null) => {
    setSelectedGenre(genre);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      code: formData.get("code"),
      description: formData.get("description"),
      status: formData.get("status") === "true",
      schoolId: schoolId,
    };

    try {
      const url = selectedGenre ? `${BASE_URL}/genres/${selectedGenre.genreId}` : `${BASE_URL}/genres`;
      const res = await fetch(url, {
        method: selectedGenre ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      showAlert(selectedGenre ? "Genre diperbarui" : "Genre baru ditambahkan");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    } catch (err: any) {
      showAlert(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus genre ini? Koleksi dengan genre ini mungkin akan terdampak.")) return;
    try {
      const res = await fetch(`${BASE_URL}/genres/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        showAlert("Genre berhasil dihapus");
        queryClient.invalidateQueries({ queryKey: ["genres"] });
      }
    } catch (err) { showAlert("Gagal menghapus", "error"); }
  };

  return (
    <div className="min-h-screen text-slate-900">
      <AnimatePresence>{alert.isVisible && <Alert {...alert} onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))} />}</AnimatePresence>

      <header className="mb-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 font-black text-blue-600 uppercase tracking-[0.3em] text-[10px]"><Tag size={14} /> classification</div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-800">Master <span className="text-blue-600">Genre</span></h1>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => refetch()} disabled={isFetching} className="h-14 w-14 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-sm border border-slate-200 hover:bg-blue-700 transition-all">
              <RotateCw size={20} className={isFetching ? "animate-spin" : ""} />
            </button>
            <button onClick={() => openModal()} className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
              <Plus size={16} /> Genre Baru
            </button>
          </div>
        </div>

        <div className="relative max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text" placeholder="Cari nama atau kode genre..."
            className="w-full bg-white border border-slate-100 rounded-[1.4rem] pl-14 pr-6 py-4 text-sm font-bold outline-none shadow-sm focus:ring-2 ring-blue-500/10 transition-all"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Info Genre</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Kode</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-24 text-center"><FaSpinner className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
              ) : genres.length === 0 ? (
                <tr><td colSpan={4} className="py-24 text-center font-bold text-slate-400 uppercase text-[10px] tracking-widest italic">Belum ada data genre</td></tr>
              ) : genres.map((genre: any) => (
                <tr key={genre.genreId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><LayoutGrid size={18} /></div>
                      <div>
                        <div className="font-black text-sm text-slate-800 uppercase tracking-tight">{genre.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold line-clamp-1 max-w-[300px]">{genre.description || 'Tidak ada deskripsi'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg font-mono text-[11px] font-bold text-slate-600 tracking-tighter">{genre.code || '-'}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    {genre.status ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-wider">
                        <CheckCircle2 size={10} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-wider">
                        <Circle size={10} /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(genre)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(genre.genreId)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* --- MODAL SIDEBAR (SIDE-OVER) --- */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
          </Transition.Child>
          
          <div className="fixed inset-y-0 right-0 w-full max-w-xl flex">
            <Transition.Child as={Fragment} enter="transform transition duration-500 ease-in-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-400" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full w-full bg-white p-8 shadow-2xl overflow-y-auto flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Category Setup</span>
                    <Dialog.Title className="text-3xl font-black uppercase tracking-tighter text-slate-900">{selectedGenre ? "Edit Genre" : "Genre Baru"}</Dialog.Title>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 rounded-3xl hover:bg-rose-50 hover:text-rose-600 transition-all"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 flex-1">
                  <div className="space-y-6">
                    <Field label="Nama Genre"><Input name="name" defaultValue={selectedGenre?.name} required placeholder="Contoh: Fiksi Populer" /></Field>
                    <Field label="Kode Genre"><Input name="code" defaultValue={selectedGenre?.code} placeholder="Contoh: FIC / 800" /></Field>
                    <Field label="Deskripsi"><Input name="description" type="textarea" defaultValue={selectedGenre?.description} placeholder="Tulis penjelasan singkat mengenai genre ini..." /></Field>
                    
                    <Field label="Status Genre">
                      <div className="grid grid-cols-2 gap-4">
                        <label className={clsx(
                          "flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                          "hover:bg-slate-50",
                          "has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50"
                        )}>
                          <input type="radio" name="status" value="true" defaultChecked={selectedGenre ? selectedGenre.status : true} className="hidden" />
                          <CheckCircle2 size={18} className="text-blue-500" />
                          <span className="text-xs font-black uppercase text-slate-600">Aktif</span>
                        </label>
                        <label className={clsx(
                          "flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                          "hover:bg-slate-50",
                          "has-[:checked]:border-slate-400 has-[:checked]:bg-slate-100"
                        )}>
                          <input type="radio" name="status" value="false" defaultChecked={selectedGenre?.status === false} className="hidden" />
                          <Circle size={18} className="text-slate-400" />
                          <span className="text-xs font-black uppercase text-slate-600">Non-Aktif</span>
                        </label>
                      </div>
                    </Field>
                  </div>

                  <div className="pt-10">
                    <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50">
                      {isSubmitting ? <FaSpinner className="animate-spin" /> : <Save size={18} />} {selectedGenre ? "Perbarui Genre" : "Simpan Genre"}
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