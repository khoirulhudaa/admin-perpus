import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Book,
  ChevronLeft,
  ChevronRight,
  Edit,
  FileText,
  Filter,
  Image as ImageIcon,
  Library,
  Plus,
  RotateCw,
  Save,
  Search,
  Trash2,
  X
} from "lucide-react";
import React, { Fragment, useCallback, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const BASE_URL = "http://localhost:5010";

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

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-blue-500 transition-all text-sm font-bold" />
);

// --- API FETCHERS ---
const fetchBibliography = async ({ schoolId, searchTerm, filterYear, currentPage }: any) => {
  if (!schoolId) return null;
  const url = `${BASE_URL}/biblio?schoolId=${schoolId}&q=${searchTerm}&year=${filterYear}&page=${currentPage}&limit=10`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
};

export default function BibliographyMain() {
  const queryClient = useQueryClient();
  const schoolQuery = useSchool();
  const schoolId = schoolQuery?.data?.[0]?.id;

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean; type: "success" | "error" }>({ message: "", isVisible: false, type: "success" });
  
  // File States
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // --- REACT QUERY ---
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["bibliography", schoolId, searchTerm, filterYear, currentPage],
    queryFn: () => fetchBibliography({ schoolId, searchTerm, filterYear, currentPage }),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 Menit
    gcTime: 10 * 60 * 1000,    // 10 Menit
  });

  const books = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const showAlert = useCallback((msg: string, type: "success" | "error" = "success") => {
    setAlert({ message: msg, isVisible: true, type });
    setTimeout(() => setAlert(prev => ({ ...prev, isVisible: false })), 5000);
  }, []);

  // --- ACTIONS ---
  const openModal = (book: any = null) => {
    setSelectedBook(book);
    setImagePreview(book?.image || null);
    setFileName(book?.fileAtt ? "File PDF Tersedia" : null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = new FormData();
    
    payload.append("title", formData.get("title") as string);
    payload.append("sor", formData.get("author") as string);
    payload.append("isbnIssn", formData.get("isbn") as string);
    payload.append("publishYear", formData.get("publishYear") as string);
    payload.append("edition", formData.get("edition") as string);
    payload.append("schoolId", schoolId?.toString() || "");
    
    const imgInput = form.querySelector('input[name="image"]') as HTMLInputElement;
    const fileInput = form.querySelector('input[name="fileAtt"]') as HTMLInputElement;
    if (imgInput?.files?.[0]) payload.append("image", imgInput.files[0]);
    if (fileInput?.files?.[0]) payload.append("fileAtt", fileInput.files[0]);

    try {
      const url = selectedBook ? `${BASE_URL}/biblio/${selectedBook.biblioId}` : `${BASE_URL}/biblio`;
      const res = await fetch(url, { method: selectedBook ? "PUT" : "POST", body: payload });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      
      showAlert(selectedBook ? "Katalog diperbarui" : "Koleksi berhasil disimpan");
      setIsModalOpen(false);
      // Invalidate cache agar data refresh otomatis
      queryClient.invalidateQueries({ queryKey: ["bibliography"] });
    } catch (err: any) {
      showAlert(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus koleksi ini secara permanen?")) return;
    try {
      const res = await fetch(`${BASE_URL}/biblio/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        showAlert("Koleksi dihapus");
        queryClient.invalidateQueries({ queryKey: ["bibliography"] });
      }
    } catch (err) { showAlert("Gagal menghapus", "error"); }
  };

  return (
    <div className="min-h-screen text-slate-900">
      <AnimatePresence>{alert.isVisible && <Alert {...alert} onClose={() => setAlert(prev => ({...prev, isVisible: false}))} />}</AnimatePresence>

      <header className="mb-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 font-black text-blue-600 uppercase tracking-[0.3em] text-[10px]"><Library size={14} /> Library Registry</div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-800">Master <span className="text-blue-600">Bibliografi</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => refetch()} 
              disabled={isFetching}
              className="h-14 w-14 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all disabled:opacity-50"
            >
              <RotateCw size={20} className={isFetching ? "animate-spin" : ""} />
            </button>
            <button onClick={() => openModal()} className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
              <Plus size={16} /> Tambah Koleksi
            </button>
          </div>
        </div>

        {/* --- SEARCH & FILTER --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-[1.4rem] shadow-sm border border-slate-100">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Cari Judul, Penulis, atau ISBN..." 
              className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-blue-500/20 transition-all"
              value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none appearance-none cursor-pointer"
              value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Semua Tahun</option>
              {Array.from({ length: 30 }, (_, i) => 2026 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end px-4 font-black text-[10px] text-slate-500 uppercase tracking-widest">
            {isFetching ? "Syncing..." : `Total: ${data?.meta?.totalItems || 0} Data`}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Info Buku</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Penulis (SOR)</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Tahun</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Digital</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-24 text-center"><FaSpinner className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
              ) : books.length === 0 ? (
                <tr><td colSpan={5} className="py-24 text-center font-bold text-slate-400">Tidak ada koleksi ditemukan</td></tr>
              ) : books.map((book: any) => (
                <tr key={book.biblioId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {book.image ? (
                        <img src={book.image} className="w-12 h-16 object-cover rounded-lg shadow-sm" alt="cover" />
                      ) : (
                        <div className="w-12 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300"><Book size={20} /></div>
                      )}
                      <div>
                        <div className="font-black text-sm text-slate-800 uppercase leading-tight line-clamp-1">{book.title}</div>
                        <div className="text-[10px] font-mono text-blue-600 font-bold mt-1 tracking-tighter">{book.isbnIssn || 'TANPA ISBN'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[11px] font-bold text-slate-600 italic">{book.sor || '-'}</td>
                  <td className="px-6 py-5 text-center"><span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500">{book.publishYear}</span></td>
                  <td className="px-6 py-5 text-center">
                    {book.fileAtt ? (
                      <a href={book.fileAtt} target="_blank" rel="noreferrer" className="inline-flex p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><FileText size={16} /></a>
                    ) : <span className="text-slate-200 text-[10px] font-bold italic">Offline Only</span>}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(book)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(book.biblioId)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Halaman {currentPage} dari {totalPages}</div>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-all"
            ><ChevronLeft size={18} /></button>
            <button 
              disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-all"
            ><ChevronRight size={18} /></button>
          </div>
        </div>
      </main>

      {/* --- MODAL SIDEBAR --- */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-y-0 right-0 w-full max-w-xl flex">
            <Transition.Child as={Fragment} enter="transform transition duration-500 ease-in-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-400" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full w-full bg-white p-8 shadow-2xl overflow-y-auto flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Asset Management</span>
                    <Dialog.Title className="text-3xl font-black uppercase tracking-tighter text-slate-900">{selectedBook ? "Edit Koleksi" : "Koleksi Baru"}</Dialog.Title>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 rounded-3xl hover:bg-rose-50 hover:text-rose-600 transition-all"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <Field label="Judul Utama Katalog"><Input name="title" defaultValue={selectedBook?.title} required placeholder="Dasar Sistem Informasi" /></Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Penulis (SOR)"><Input name="author" defaultValue={selectedBook?.sor} required placeholder="Nama Penulis" /></Field>
                    <Field label="Edisi"><Input name="edition" defaultValue={selectedBook?.edition} placeholder="Contoh: Cetakan 1" /></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Tahun Terbit"><Input name="publishYear" type="number" defaultValue={selectedBook?.publishYear || 2026} /></Field>
                    <Field label="ISBN / ISSN"><Input name="isbn" defaultValue={selectedBook?.isbnIssn} placeholder="978-..." /></Field>
                  </div>

                <div className="p-6 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 space-y-8">
                    
                    {/* --- UPLOAD GAMBAR --- */}
                    <Field label="Gambar Sampul">
                      <div className="flex flex-col gap-4">
                        {imagePreview && (
                          <div className="relative group">
                            <img src={imagePreview} className="w-28 h-40 object-cover rounded-2xl shadow-xl border-4 border-white" alt="prev" />
                            <button type="button" onClick={() => { setImagePreview(null); setImageError(null); }} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg"><X size={14} /></button>
                          </div>
                        )}
                        
                        <div className="w-full relative">
                          <div className={clsx(
                            "flex items-center justify-center gap-4 p-5 rounded-2xl border-2 border-dashed transition-all duration-300",
                            // LOGIKA BORDER MERAH DISINI
                            imageError 
                              ? "border-rose-500 bg-rose-50 shadow-[0_0_0_4px_rgba(244,63,94,0.1)]" 
                              : imagePreview ? "border-emerald-400 bg-white" : "border-blue-200 bg-white hover:border-blue-400"
                          )}>
                            <ImageIcon className={imageError ? "text-rose-500" : "text-blue-400"} size={20}/>
                            <span className={clsx("text-[10px] font-black uppercase", imageError ? "text-rose-600" : "text-slate-500")}>
                              {imageError ? "File Terlalu Besar" : "Pilih Gambar"}
                            </span>
                          </div>
                          <input type="file" name="image" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            setImageError(null);
                            if (file && file.size > 2 * 1024 * 1024) {
                              setImageError(`Maksimal 2MB (File: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                              e.target.value = '';
                              return;
                            }
                            if (file) setImagePreview(URL.createObjectURL(file));
                          }} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        {imageError && <p className="text-[10px] font-bold text-rose-600 uppercase tracking-tight animate-bounce">{imageError}</p>}
                        {!imageError && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight italic">* JPG/PNG Maks. 2MB</p>}
                      </div>
                    </Field>

                    {/* --- UPLOAD PDF --- */}
                    <Field label="E-Book (PDF)">
                      <div className="relative">
                        <div className={clsx(
                          "flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed transition-all duration-300",
                          // LOGIKA BORDER MERAH DISINI
                          pdfError 
                            ? "border-rose-500 bg-rose-100 shadow-[0_0_0_4px_rgba(244,63,94,0.1)]" 
                            : fileName ? "border-emerald-400 bg-emerald-50" : "border-blue-200 bg-white hover:border-blue-400"
                        )}>
                          <FileText className={pdfError ? "text-rose-500" : "text-blue-400"} />
                          <div className="flex-1 min-w-0">
                            <p className={clsx("text-[10px] font-black uppercase", pdfError ? "text-rose-600" : "text-slate-500")}>
                              {pdfError ? "Gagal Upload" : fileName ? "Terlampir" : "Lampirkan PDF"}
                            </p>
                            {fileName && !pdfError && <p className="text-[10px] font-bold text-emerald-700 truncate">{fileName}</p>}
                          </div>
                        </div>
                        <input type="file" name="fileAtt" accept=".pdf" onChange={(e) => {
                          const file = e.target.files?.[0];
                          setPdfError(null);
                          if (file && file.size > 10 * 1024 * 1024) {
                            setPdfError(`Maksimal 10MB (File: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                            e.target.value = '';
                            return;
                          }
                          if (file) setFileName(file.name);
                        }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      {pdfError && <p className="text-[10px] font-bold text-rose-600 uppercase tracking-tight mt-2">{pdfError}</p>}
                      {!pdfError && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight italic mt-2">* PDF Maks. 10MB</p>}
                    </Field>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50">
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <Save size={18} />} {selectedBook ? "Perbarui Koleksi" : "Simpan Koleksi"}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}