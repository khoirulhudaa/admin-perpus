// // components/admin/SchoolRulesEditor.tsx
// import { useSchool } from "@/features/schools";
// import { AnimatePresence, motion } from "framer-motion";
// import React, { useCallback, useEffect, useState } from "react";

// // ────────────────────────────────────────────────
// // Shared Utilities (sama seperti di VisiMisi)
// // ────────────────────────────────────────────────

// const clsx = (...args: Array<string | false | null | undefined>): string =>
//   args.filter(Boolean).join(" ");

// interface AlertState {
//   message: string;
//   isVisible: boolean;
// }

// const useAlert = () => {
//   const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

//   const showAlert = useCallback((msg: string) => setAlert({ message: msg, isVisible: true }), []);
//   const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);

//   return { alert, showAlert, hideAlert };
// };

// const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
//   const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className={clsx(
//         "mb-4 rounded-xl border p-4 text-sm",
//         isSuccess ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-red-500/30 bg-red-500/10 text-red-300"
//       )}
//     >
//       <div className="flex items-start justify-between">
//         <div className="whitespace-pre-line">{message}</div>
//         <button
//           type="button"
//           onClick={onClose}
//           className={clsx("ml-4", isSuccess ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400")}
//         >
//           ✕
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
//   <input
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50",
//       className
//     )}
//   />
// );

// interface ListEditorProps {
//   items: string[];
//   onChange: (list: string[]) => void;
//   onDelete: (index: number) => void;
//   placeholder?: string;
// }

// const ListEditor: React.FC<ListEditorProps> = ({ items, onChange, onDelete, placeholder = "Masukkan aturan..." }) => {
//   const setAt = (index: number, value: string) => {
//     const copy = [...items];
//     copy[index] = value;
//     onChange(copy);
//   };

//   const add = () => onChange([...items, ""]);
//   const up = (index: number) => {
//     if (index <= 0) return;
//     const copy = [...items];
//     [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
//     onChange(copy);
//   };
//   const down = (index: number) => {
//     if (index >= items.length - 1) return;
//     const copy = [...items];
//     [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
//     onChange(copy);
//   };

//   return (
//     <div className="space-y-3">
//       {items.map((text, index) => (
//         <div key={index} className="flex items-center gap-2">
//           <Input value={text} onChange={(e) => setAt(index, e.target.value)} placeholder={placeholder} />
//           <button type="button" onClick={() => up(index)} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
//             ↑
//           </button>
//           <button type="button" onClick={() => down(index)} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
//             ↓
//           </button>
//           <button
//             type="button"
//             onClick={() => onDelete(index)}
//             className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
//           >
//             Hapus
//           </button>
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={add}
//         className="mt-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs text-blue-300 hover:bg-blue-500/20"
//       >
//         Tambah Aturan
//       </button>
//     </div>
//   );
// };

// const ISave = () => (
//   <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
//     💾
//   </span>
// );

// // ────────────────────────────────────────────────
// // Komponen Utama: SchoolRulesEditor
// // ────────────────────────────────────────────────

// export function TataTertibMain() {
//   const [rules, setRules] = useState<string[]>([]);
//   const [recordId, setRecordId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();

//   const schoolData = useSchool();
//   const schoolId = schoolData?.data[0]?.id;

//   const BASE_URL = "https://be-school.kiraproject.id/tata-tertib";

//   useEffect(() => {
//     if (!schoolId) return;

//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`);
//         if (!res.ok) throw new Error();
//         const json = await res.json();
//         const records = json.success ? json.data : json;

//         if (Array.isArray(records) && records.length > 0) {
//           const rec = records[0];
//           setRules(Array.isArray(rec.rules) ? rec.rules : []);
//           setRecordId(rec.id);
//         }
//       } catch {
//         showAlert("Gagal memuat tata tertib");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [schoolId, showAlert]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!schoolId) return showAlert("School ID tidak tersedia");

//     setSaving(true);

//     const cleaned = rules.filter((r) => r.trim());

//     if (cleaned.length === 0) {
//       showAlert("Setidaknya satu aturan harus diisi");
//       setSaving(false);
//       return;
//     }

//     try {
//       const payload = { schoolId, rules: cleaned };

//       let res: Response;
//       if (recordId) {
//         res = await fetch(`${BASE_URL}/${recordId}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       } else {
//         res = await fetch(BASE_URL, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       }

//       if (!res.ok) throw new Error("Gagal menyimpan");

//       const result = await res.json();
//       if (!recordId && result.data?.id) setRecordId(result.data.id);

//       showAlert("Tata tertib berhasil disimpan!");
//     } catch (err: any) {
//       showAlert(`Gagal menyimpan: ${err.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading || !schoolId) return <div className="py-10 text-center text-white/70">Memuat aturan sekolah...</div>;

//   return (
//     <div className="space-y-6">
//       <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

//       <form onSubmit={handleSubmit}>
//         <div className="flex justify-start pt-4 pb-6">
//           <button
//             type="submit"
//             disabled={saving}
//             className={clsx(
//               "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
//               saving ? "bg-blue-800/50 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
//             )}
//           >
//             <ISave />
//             {saving ? "Menyimpan..." : "Simpan Tata Tertib"}
//           </button>
//         </div>

//         <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
//           <div className="mb-4 text-base font-semibold text-white">Daftar Tata Tertib Sekolah</div>
//           <ListEditor items={rules} onChange={setRules} onDelete={(i) => setRules(rules.filter((_, idx) => idx !== i))} />
//         </div>
//       </form>
//     </div>
//   );
// }


// components/admin/SchoolRulesEditor.tsx
import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Save, Loader, Trash2, X, ListOrdered, ArrowUp, ArrowDown } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const BASE_URL = "https://be-school.kiraproject.id/tata-tertib";

interface AlertState {
  message: string;
  isVisible: boolean;
}

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

  const showAlert = useCallback((msg: string) => {
    setAlert({ message: msg, isVisible: true });
    setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
  }, []);

  const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);

  return { alert, showAlert, hideAlert };
};

const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-6 right-6 z-[999999] rounded-2xl border p-5 shadow-2xl backdrop-blur-xl text-sm font-medium tracking-tight ${
        isSuccess
          ? "border-blue-500/40 bg-blue-600/10 text-blue-100"
          : "border-red-500/40 bg-red-600/10 text-red-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-lg font-black">{isSuccess ? "✓" : "✕"}</div>
        <div className="whitespace-pre-line">{message}</div>
        <button onClick={onClose} className="ml-3 opacity-70 hover:opacity-100">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const RulesModal = ({
  open,
  onClose,
  initialRules,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initialRules: string[];
  onSave: (rules: string[]) => Promise<void>;
}) => {
  const [rules, setRules] = useState<string[]>(initialRules);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setRules(initialRules);
  }, [open, initialRules]);

  const addRule = () => setRules([...rules, ""]);
  const updateRule = (index: number, value: string) => {
    const copy = [...rules];
    copy[index] = value;
    setRules(copy);
  };
  const deleteRule = (index: number) => setRules(rules.filter((_, i) => i !== index));
  const moveUp = (index: number) => {
    if (index <= 0) return;
    const copy = [...rules];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    setRules(copy);
  };
  const moveDown = (index: number) => {
    if (index >= rules.length - 1) return;
    const copy = [...rules];
    [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
    setRules(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = rules.filter((r) => r.trim());
    if (cleaned.length === 0) {
      alert("Setidaknya satu aturan harus diisi");
      return;
    }
    setSaving(true);
    try {
      await onSave(cleaned);
      onClose();
    } catch (err: any) {
      alert("Gagal menyimpan: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999]"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0B1220] border-l border-white/10 shadow-2xl overflow-y-auto z-[100000] flex flex-col"
      >
        <div className="p-10 border-b border-white/8 flex justify-between items-center bg-[#0B1220] z-10">
          <div>
            <h3 className="text-4xl font-black tracking-tighter text-white">
              Tata <span className="text-blue-600">Tertib</span> Sekolah
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Aturan & Norma Sekolah
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 flex-1">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic">
                Daftar Tata Tertib
              </label>
              <button
                type="button"
                onClick={addRule}
                disabled={saving}
                className="text-[10px] font-black uppercase tracking-widest bg-blue-600/10 border border-blue-500/30 text-blue-400 px-5 py-2.5 rounded-2xl hover:bg-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Plus size={16} /> Tambah Aturan
              </button>
            </div>

            {rules.length === 0 ? (
              <div className="text-center py-16 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                <ListOrdered className="mx-auto mb-4 text-zinc-600" size={48} />
                <p className="text-zinc-500 italic text-sm">Belum ada aturan ditambahkan</p>
              </div>
            ) : (
              rules.map((rule, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 font-black text-sm">
                      {idx + 1}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <textarea
                      value={rule}
                      onChange={(e) => updateRule(idx, e.target.value)}
                      placeholder="Tulis aturan sekolah di sini (contoh: Siswa wajib memakai seragam lengkap)"
                      rows={2}
                      disabled={saving}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:border-blue-500 outline-none resize-y transition-all"
                    />

                    <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={saving || idx === 0}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-30 transition-colors"
                        title="Naikkan posisi"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={saving || idx === rules.length - 1}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-30 transition-colors"
                        title="Turunkan posisi"
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRule(idx)}
                        disabled={saving}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Hapus aturan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="bg-[#0B1220] pt-10 pb-6 border-t border-white/8 grid grid-cols-2 gap-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="py-4 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
                saving
                  ? "bg-blue-800 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
              }`}
            >
              {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? "Menyimpan..." : "Simpan Tata Tertib"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export function TataTertibMain() {
  const [rules, setRules] = useState<string[]>([]);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const schoolData = useSchool();
  const schoolId = schoolData?.data?.[0]?.id;

  useEffect(() => {
    if (!schoolId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}?schoolId=${schoolId}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        const records = json.success ? json.data : json;

        if (Array.isArray(records) && records.length > 0) {
          const rec = records[0];
          setRules(Array.isArray(rec.rules) ? rec.rules : []);
          setRecordId(rec.id);
        }
      } catch {
        showAlert("Gagal memuat tata tertib");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId, showAlert]);

  const handleSave = async (newRules: string[]) => {
    setSaving(true);
    try {
      const payload = { schoolId, rules: newRules };

      let res: Response;
      if (recordId) {
        res = await fetch(`${BASE_URL}/${recordId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Gagal menyimpan");

      const result = await res.json();
      if (!recordId && result.data?.id) setRecordId(result.data.id);

      setRules(newRules);
      setModalOpen(false);
      showAlert("Tata tertib berhasil disimpan!");
    } catch (err: any) {
      showAlert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const openModal = () => setModalOpen(true);

  if (loading || !schoolId) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-5">
        <Loader className="animate-spin text-blue-500" size={48} />
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
          Memuat tata tertib sekolah...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ color: "#f8fafc" }}>
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 uppercase font-black text-[10px] tracking-[0.4em]">
            <ListOrdered size={14} /> Tata Tertib Management
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Tata <span className="text-blue-600">Tertib</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola aturan dan norma yang berlaku di lingkungan sekolah</p>
        </div>

        <button
          onClick={openModal}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
        >
          <ListOrdered size={18} /> {rules.length > 0 ? "Edit Tata Tertib" : "Setup Tata Tertib"}
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm w-full mx-auto">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <ListOrdered size={40} className="text-zinc-600" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Belum Ada Tata Tertib</h3>
          <p className="text-zinc-500">Tambahkan aturan sekolah untuk menjaga kedisiplinan dan ketertiban siswa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {rules.map((rule, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-white/[0.03] border border-white/8 rounded-3xl p-8 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 font-black text-lg">
                    {idx + 1}
                  </div>
                </div>
                <p className="text-zinc-200 leading-relaxed">{rule}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal untuk mengelola seluruh daftar tata tertib */}
      <RulesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialRules={rules}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}