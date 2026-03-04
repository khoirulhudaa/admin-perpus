  "use client";

  import { useSchool } from "@/features/schools";
  import { Dialog, Transition } from "@headlessui/react";
  import { AnimatePresence, motion } from "framer-motion";
  import { X } from "lucide-react";
  import React, { Fragment, useCallback, useEffect, useState } from "react";
  import { FaSpinner } from "react-icons/fa";

  const clsx = (...args: Array<string | false | null | undefined>): string =>
    args.filter(Boolean).join(" ");

  interface AlertState {
    message: string;
    isVisible: boolean;
  }

  const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
    const isSuccess = message.toLowerCase().includes("berhasil");
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={clsx(
          "mb-5 rounded-xl border p-4 text-sm shadow-sm",
          isSuccess ? "border-green-500/30 bg-green-900/20 text-green-200" : "border-red-500/30 bg-red-900/20 text-red-200"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="whitespace-pre-line leading-relaxed">{message}</div>
          <button type="button" onClick={onClose} className="ml-3 text-lg font-bold">✕</button>
        </div>
      </motion.div>
    );
  };

  const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none w-4 text-center">{label}</span>
  );
  const ISave = () => <Icon label="💾" />;
  const IEdit = () => <Icon label="✏️" />;
  const IDelete = () => <Icon label="🗑️" />;

  const Field: React.FC<{ label?: string; hint?: string; children: React.ReactNode; className?: string }> = ({
    label, hint, children, className,
  }) => (
    <label className={clsx("block", className)}>
      {label && <div className="mb-1.5 text-xs font-medium text-white/80">{label}</div>}
      {children}
      {hint && <div className="mt-1 text-[11px] text-white/50">{hint}</div>}
    </label>
  );

  const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      className={clsx(
        "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-blue-500/50 transition",
        className
      )}
      {...props}
    />
  );

  const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
      className={clsx(
        "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-blue-500/50 transition resize-y min-h-[120px]",
        className
      )}
      {...props}
    />
  );

  const Select = ({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
      className={clsx(
        "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition",
        className
      )}
      {...props}
    >
      {props.children}
    </select>
  );

  interface NewsItem {
    id: number;
    title: string;
    content: string;
    imageUrl?: string | null;
    publishDate: string;
    schoolId: number;
    isActive: boolean;
    category?: string;
    source?: string;
  }

  const DEFAULT_NEWS: NewsItem = {
    id: 0,
    title: "",
    content: "",
    imageUrl: null,
    publishDate: "",
    schoolId: 0,
    isActive: true,
    category: "Umum",
    source: "Sekolah",
  };

  // const API_BASE = "http://localhost:5005/berita"; // sesuai permintaan (ganti ke production jika perlu)
  const API_BASE = "https://be-school.kiraproject.id/berita"; // sesuai permintaan (ganti ke production jika perlu)

  const useAlert = () => {
    const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });
    const showAlert = useCallback((message: string) => setAlert({ message, isVisible: true }), []);
    const hideAlert = useCallback(() => setAlert({ message: "", isVisible: false }), []);
    return { alert, showAlert, hideAlert };
  };

  export default function BeritaPage() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [formData, setFormData] = useState<NewsItem>(DEFAULT_NEWS);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const schoolQuery = useSchool();
    const schoolId = schoolQuery?.data?.[0]?.id;

    const { alert, showAlert, hideAlert } = useAlert();

    const fetchData = async () => {
      if (!schoolId) {
        showAlert("School ID tidak ditemukan");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}?schoolId=${schoolId}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success || !Array.isArray(json.data)) throw new Error("Format response invalid");
        setNewsItems(json.data);
      } catch (err: any) {
        showAlert(`Gagal memuat berita: ${err.message}`);
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (schoolId) fetchData();
    }, [schoolId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    };

    useEffect(() => {
      return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      };
    }, [previewUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!schoolId) {
        showAlert("School ID tidak tersedia");
        return;
      }

      setLoading(true);
      try {
        const formPayload = new FormData();
        formPayload.append("title", formData.title.trim());
        formPayload.append("content", formData.content.trim());
        formPayload.append("schoolId", schoolId.toString());
        if (formData.publishDate) formPayload.append("publishDate", formData.publishDate);
        if (formData.category) formPayload.append("category", formData.category);
        if (formData.source) formPayload.append("source", formData.source);
        if (selectedFile) formPayload.append("imageUrl", selectedFile); // sesuai multer di backend (req.file)

        const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
        const method = editingId ? "PUT" : "POST";

        const res = await fetch(url, { method, body: formPayload });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.message || `Gagal menyimpan (${res.status})`);
        }

        showAlert(editingId ? "Berita berhasil diperbarui" : "Berita berhasil ditambahkan");

        setFormData(DEFAULT_NEWS);
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingId(null);
        setIsModalOpen(false);
        await fetchData();
      } catch (err: any) {
        showAlert(`Gagal menyimpan: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const handleEdit = (item: NewsItem) => {
      setFormData({
        ...item,
        publishDate: item.publishDate ? new Date(item.publishDate).toISOString().split("T")[0] : "",
        category: item.category || "Umum",
        source: item.source || "Sekolah",
      });
      setSelectedFile(null);
      setPreviewUrl(item.imageUrl || null);
      setEditingId(item.id);
      setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
      if (!window.confirm("Yakin ingin menghapus berita ini?")) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Gagal menghapus");
        showAlert("Berita berhasil dihapus");
        await fetchData();
      } catch (err: any) {
        showAlert(`Gagal menghapus: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const openModal = () => {
      setFormData(DEFAULT_NEWS);
      setSelectedFile(null);
      setPreviewUrl(null);
      setEditingId(null);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setFormData(DEFAULT_NEWS);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setEditingId(null);
      setIsModalOpen(false);
    };

    return (
      <div className="space-y-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={openModal}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60 transition"
          >
            <ISave /> Tambah Berita
          </button>
        </div>

        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-[99999]" onClose={closeModal}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed top-0 right-0 inset-0 bg-black/80" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="absolute top-0 right-0 w-full max-w-md transform border border-white/10 bg-black/60 p-6 text-left h-screen overflow-auto align-middle shadow-2xl backdrop-blur-md">
                    <div className="relative border-b border-white/10 flex justify-between items-center z-[99999] pb-5 pt-1 mb-6">
                      <h2 className="text-xl font-semibold text-white">{editingId ? "Edit Berita" : "Tambah Berita Baru"}</h2>
                      <button onClick={closeModal} className="text-gray-400 hover:text-white">
                        <X size={24} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <Field label="Judul Berita">
                        <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Contoh: Workshop Coding untuk Siswa" required disabled={loading} />
                      </Field>

                      <Field label="Tanggal Publish">
                        <Input type="date" name="publishDate" value={formData.publishDate} onChange={handleInputChange} disabled={loading} />
                      </Field>

                      <Field label="Kategori">
                        <Select name="category" value={formData.category} onChange={handleInputChange} disabled={loading}>
                          <option className="text-black" value="Umum">Umum</option>
                          <option className="text-black" value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                          <option className="text-black" value="Prestasi">Prestasi</option>
                          <option className="text-black" value="Pengumuman Dinas">Pengumuman Dinas</option>
                          <option className="text-black" value="Lainnya">Lainnya</option>
                        </Select>
                      </Field>

                      <Field label="Sumber">
                        <Select name="source" value={formData.source} onChange={handleInputChange} disabled={loading}>
                          <option className="text-black" value="Sekolah">Sekolah</option>
                          <option className="text-black" value="Dinas">Dinas</option>
                          <option className="text-black" value="Lainnya">Lainnya</option>
                        </Select>
                      </Field>

                      <Field label="Isi Berita">
                        <TextArea name="content" value={formData.content} onChange={handleInputChange} placeholder="Tuliskan isi berita secara lengkap..." required disabled={loading} />
                      </Field>

                      <Field label="Gambar (opsional)" hint="JPG, PNG, WebP • Maks 5MB">
                        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} disabled={loading} className="block w-full text-sm text-white/80 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-700/30 file:text-blue-100 hover:file:bg-blue-700/50 file:cursor-pointer cursor-pointer" />
                      </Field>

                      {(previewUrl || formData.imageUrl) && (
                        <div className="mt-2">
                          <img src={previewUrl || formData.imageUrl || ""} alt="Preview" className="max-h-64 w-full object-contain rounded-xl border border-white/15 shadow-sm" />
                        </div>
                      )}

                      <div className="w-full grid grid-cols-2 justify-end gap-4 pt-6 border-t border-white/30">
                        <button type="button" onClick={closeModal} disabled={loading} className="rounded-xl border border-white/20 px-6 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5 transition disabled:opacity-50">Batal</button>
                        <button type="submit" disabled={loading} className="inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition">
                          {loading && <FaSpinner className="animate-spin" />}
                          <ISave />
                          {editingId ? "Update" : "Simpan"}
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

          {loading ? (
            <div className="py-12 text-center text-white/60 flex items-center justify-center gap-3">
              <FaSpinner className="animate-spin" /> Memuat...
            </div>
          ) : newsItems.length === 0 ? (
            <div className="py-12 text-center text-white/50">Belum ada berita.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <div key={item.id} className="flex flex-col rounded-xl border border-white/10 bg-black/40 p-5 hover:border-blue-500/30 transition group">
                  {/* Tampilan gambar jika ada */}
                  {item.imageUrl && (
                    <div className="overflow-hidden rounded-lg border border-white/10 h-48 mb-4">
                      <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div className="font-semibold text-lg text-white group-hover:text-blue-300 transition line-clamp-2 mb-2">
                    {item.title}
                  </div>

                  <div className="text-xs text-gray-400 mb-2">
                    {new Date(item.publishDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </div>

                  {/* Tampilkan category dan source */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-600/20 text-blue-300">
                      {item.category || "Umum"}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-600/20 text-purple-300">
                      {item.source || "Sekolah"}
                    </span>
                  </div>

                  <p className="text-sm text-white/80 line-clamp-4 flex-1">
                    {item.content}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    <button onClick={() => handleEdit(item)} disabled={loading} className="flex items-center justify-center gap-2 rounded-lg bg-blue-600/20 px-4 py-2 text-sm text-blue-300 hover:bg-blue-600/40 transition disabled:opacity-50">
                      <IEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={loading} className="flex items-center justify-center gap-2 rounded-lg bg-red-600/20 px-4 py-2 text-sm text-red-300 hover:bg-red-600/40 transition disabled:opacity-50">
                      <IDelete /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }