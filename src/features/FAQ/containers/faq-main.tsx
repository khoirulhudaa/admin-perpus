// // components/admin/FaqEditor.tsx
// import { useSchool } from "@/features/schools";
// import { AnimatePresence, motion } from "framer-motion";
// import React, { useCallback, useEffect, useState } from "react";

// // ────────────────────────────────────────────────
// // Shared Utilities (sama seperti di atas)
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

// const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
//   <textarea
//     {...props}
//     className={clsx(
//       "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 resize-y min-h-[100px]",
//       className
//     )}
//   />
// );

// const ISave = () => (
//   <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
//     💾
//   </span>
// );

// // ────────────────────────────────────────────────
// // Komponen Utama: FaqEditor
// // ────────────────────────────────────────────────

// interface FaqItem {
//   question: string;
//   answer: string;
// }

// export function FaqMain() {
//   const [faqs, setFaqs] = useState<FaqItem[]>([]);
//   const [recordId, setRecordId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();

//   const schoolData = useSchool();
//   const schoolId = schoolData?.data[0]?.id;

//   const BASE_URL = "https://be-school.kiraproject.id/faq";

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
//           setFaqs(
//             Array.isArray(rec.faqs)
//               ? rec.faqs.map((f: any) => ({
//                   question: f.question || "",
//                   answer: f.answer || "",
//                 }))
//               : []
//           );
//           setRecordId(rec.id);
//         }
//       } catch {
//         showAlert("Gagal memuat data FAQ");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [schoolId, showAlert]);

//   const updateFaq = (index: number, field: "question" | "answer", value: string) => {
//     const newFaqs = [...faqs];
//     newFaqs[index] = { ...newFaqs[index], [field]: value };
//     setFaqs(newFaqs);
//   };

//   const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
//   const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!schoolId) return showAlert("School ID tidak tersedia");

//     setSaving(true);

//     if (faqs.some((f) => !f.question.trim() || !f.answer.trim())) {
//       showAlert("Semua pertanyaan dan jawaban wajib diisi");
//       setSaving(false);
//       return;
//     }

//     try {
//       const payload = { schoolId, faqs };

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

//       showAlert("FAQ berhasil disimpan!");
//     } catch (err: any) {
//       showAlert(`Gagal menyimpan: ${err.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading || !schoolId) return <div className="py-10 text-center text-white/70">Memuat data FAQ...</div>;

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
//             {saving ? "Menyimpan..." : "Simpan FAQ"}
//           </button>
//         </div>

//         <div className="space-y-6 pb-4">
//           {faqs.map((faq, idx) => (
//             <div key={idx} className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
//               <div className="mb-4 flex items-center justify-between">
//                 <div className="text-sm font-semibold text-white">Pertanyaan {idx + 1}</div>
//                 <button
//                   type="button"
//                   onClick={() => removeFaq(idx)}
//                   className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
//                   disabled={saving}
//                 >
//                   Hapus
//                 </button>
//               </div>

//               <Input
//                 value={faq.question}
//                 onChange={(e) => updateFaq(idx, "question", e.target.value)}
//                 placeholder="Pertanyaan..."
//                 className="mb-4"
//                 disabled={saving}
//               />

//               <TextArea
//                 value={faq.answer}
//                 onChange={(e) => updateFaq(idx, "answer", e.target.value)}
//                 placeholder="Jawaban lengkap..."
//                 rows={5}
//                 disabled={saving}
//               />
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addFaq}
//             className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-2.5 text-xs text-blue-300 hover:bg-blue-500/20"
//             disabled={saving}
//           >
//             + Tambah Pertanyaan Baru
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// components/admin/FaqEditor.tsx
import { useSchool } from "@/features/schools";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Save, Loader, Trash2, X, MessageCircleQuestion, Pencil } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const BASE_URL = "https://be-school.kiraproject.id/faq";

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

interface FaqItem {
  question: string;
  answer: string;
}

const FaqModal = ({
  open,
  onClose,
  onSave,
  initialData = { question: "", answer: "" },
  isEdit = false,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (faq: FaqItem) => Promise<void>;
  initialData?: FaqItem;
  isEdit?: boolean;
}) => {
  const [form, setForm] = useState<FaqItem>(initialData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initialData);
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      alert("Pertanyaan dan jawaban wajib diisi");
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
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
        <div className="p-10 border-b border-white/8 flex justify-between items-center sticky top-0 bg-[#0B1220] z-10">
          <div>
            <h3 className="text-4xl font-black tracking-tighter text-white">
              {isEdit ? "Edit" : "Tambah"} <span className="text-blue-600">FAQ</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
              Pertanyaan Umum Sekolah
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12 flex-1">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Pertanyaan *
            </label>
            <input
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Contoh: Apa saja jalur pendaftaran yang tersedia?"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic block">
              Jawaban Lengkap *
            </label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="Jelaskan secara detail dan jelas..."
              rows={6}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition-all resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/8">
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
              {saving ? "Menyimpan..." : isEdit ? "Update FAQ" : "Tambah FAQ"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export function FaqMain() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const [modalOpen, setModalOpen] = useState(false);
  const [editFaq, setEditFaq] = useState<{ index: number; data: FaqItem } | null>(null);

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
          setFaqs(
            Array.isArray(rec.faqs)
              ? rec.faqs.map((f: any) => ({
                  question: f.question || "",
                  answer: f.answer || "",
                }))
              : []
          );
          setRecordId(rec.id);
        }
      } catch {
        showAlert("Gagal memuat data FAQ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId, showAlert]);

  const handleAddOrUpdate = async (newFaq: FaqItem) => {
    let updatedFaqs = [...faqs];

    if (editFaq !== null) {
      // Update existing
      updatedFaqs[editFaq.index] = newFaq;
    } else {
      // Add new
      updatedFaqs = [...updatedFaqs, newFaq];
    }

    setSaving(true);
    try {
      const payload = { schoolId, faqs: updatedFaqs };

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

      setFaqs(updatedFaqs);
      setEditFaq(null);
      setModalOpen(false);
      showAlert(editFaq ? "FAQ berhasil diperbarui!" : "FAQ berhasil ditambahkan!");
    } catch (err: any) {
      showAlert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Yakin ingin menghapus FAQ ini?")) return;

    const updatedFaqs = faqs.filter((_, i) => i !== index);

    setSaving(true);
    try {
      const payload = { schoolId, faqs: updatedFaqs };

      const res = await fetch(`${BASE_URL}/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      setFaqs(updatedFaqs);
      showAlert("FAQ berhasil dihapus!");
    } catch (err: any) {
      showAlert(`Gagal menghapus: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditFaq(null);
    setModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setEditFaq({ index, data: faqs[index] });
    setModalOpen(true);
  };

  if (loading || !schoolId) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-5">
        <Loader className="animate-spin text-blue-500" size={48} />
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
          Memuat data FAQ...
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
            <MessageCircleQuestion size={14} /> FAQ Management
          </div>
          <h1 className="text-4xl uppercase font-black tracking-tighter text-white">
            Pertanyaan <span className="text-blue-600">Populer</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Kelola pertanyaan umum dan jawaban untuk calon siswa/orang tua</p>
        </div>

        <button
          onClick={openAddModal}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
        >
          <Plus size={18} /> Tambah FAQ
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.03] border border-white/8 rounded-3xl backdrop-blur-sm w-full mx-auto">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <MessageCircleQuestion size={40} className="text-zinc-600" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Belum Ada Pertanyaan FAQ</h3>
          <p className="text-zinc-500">Tambahkan pertanyaan umum yang sering ditanyakan oleh calon siswa/orang tua.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-white/[0.03] border border-white/8 rounded-3xl p-8 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {faq.question}
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(idx)}
                    className="p-3 rounded-2xl bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    disabled={saving}
                    className="p-3 rounded-2xl bg-red-900/30 hover:bg-red-800/50 text-red-300 transition-colors disabled:opacity-50"
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal untuk Tambah / Edit FAQ */}
      <FaqModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditFaq(null);
        }}
        onSave={handleAddOrUpdate}
        initialData={editFaq ? editFaq.data : { question: "", answer: "" }}
        isEdit={editFaq !== null}
      />
    </div>
  );
}