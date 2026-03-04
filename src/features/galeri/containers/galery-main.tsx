import { useSchool } from "@/features/schools";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, FolderOpen, ImageIcon, Info, Maximize2, Pen, Plus, Trash, UploadCloud, X } from "lucide-react";
import { Fragment, useState } from "react";

// === THEME TOKENS ===
const THEME_TOKENS = {
  smkn13: {
    "--brand-primary": "#10b981",
    "--brand-primaryText": "#ffffff",
    "--brand-accent": "#f59e0b",
    "--brand-bg": "#0a0a0a",
    "--brand-surface": "rgba(24,24,27,0.8)",
    "--brand-surfaceText": "#f3f4f6",
    "--brand-subtle": "#27272a",
    "--brand-pop": "#3b82f6",
  },
};

// Apply theme
if (typeof document !== 'undefined') {
  document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13)
    .map(([k, v]) => `${k}: ${v};`)
    .join('');
}

// === UTILITIES ===
const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

// === ALERT HOOK ===
const useAlert = () => {
  const [alert, setAlert] = useState({ message: "", isVisible: false });

  const showAlert = (message: string) => {
    setAlert({ message, isVisible: true });
  };

  const hideAlert = () => {
    setAlert({ message: "", isVisible: false });
  };

  return { alert, showAlert, hideAlert };
};

// === FORM COMPONENTS ===
const Field = ({ label, children, className }: { label?: string; children: React.ReactNode; className?: string }) => (
  <label className={clsx("block", className)}>
    {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
    {children}
  </label>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none placeholder-white/40",
      className
    )}
  />
);

const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none placeholder-white/40",
      className
    )}
  />
);

const Select = ({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

// === DEFAULT VALUES ===
const DEFAULT_ALBUM = { title: "", description: "", cover: null };
const DEFAULT_ITEM = { title: "", description: "", albumId: "", image: null };

const getJsonHeaders = () => ({
  "Content-Type": "application/json",
  // "Authorization": `Bearer ${localStorage.getItem("token")}` // jika pakai auth
});

// const getFormDataHeaders = () => ({
//   // JANGAN set Content-Type untuk FormData
//   // "Authorization": `Bearer ${localStorage.getItem("token")}`,
// });

export function GaleriMain() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"album" | "item">("album");
  
  // State untuk Form & Modal (Desain Tetap)
  const [albumForm, setAlbumForm] = useState(DEFAULT_ALBUM);
  const [itemForm, setItemForm] = useState(DEFAULT_ITEM);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedAlbumForItems, setSelectedAlbumForItems] = useState<string | null>(null);
  const [selectedAlbumForGallery, setSelectedAlbumForGallery] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false); // Untuk submit button
  const { alert, showAlert, hideAlert } = useAlert();
  
  const schoolid = useSchool();
  const SCHOOL_ID = schoolid?.data?.[0]?.id;
  const BASE_URL = "https://be-school.kiraproject.id";

  // ── FETCH ALBUMS (React Query) ──────────────────────────────────────────
  const { data: albums = [], isLoading: albumsLoading } = useQuery({
    queryKey: ["albums", SCHOOL_ID],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/albums?schoolId=${SCHOOL_ID}&isActive=true`, {
        headers: getJsonHeaders(),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data || [];
    },
    enabled: !!SCHOOL_ID,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // ── FETCH ITEMS (React Query) ───────────────────────────────────────────
  // Mengambil item berdasarkan album yang aktif di tab atau modal
  const targetAlbumId = activeTab === "item" ? selectedAlbumForItems : selectedAlbumForGallery;

  const { data: galleryItems = [] } = useQuery({
    queryKey: ["gallery", targetAlbumId],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/gallery?albumId=${targetAlbumId}&isActive=true`, {
        headers: getJsonHeaders(),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data || [];
    },
    enabled: !!targetAlbumId,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // ── ALBUM CRUD (Logic Invalidation) ─────────────────────────────────────
  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData();
    formData.append("title", albumForm.title);
    formData.append("description", albumForm.description || "");
    formData.append("schoolId", SCHOOL_ID);
    if (albumForm.cover) formData.append("cover", albumForm.cover);

    try {
      const isEdit = !!editingAlbumId;
      const res = await fetch(isEdit ? `${BASE_URL}/albums/${editingAlbumId}` : `${BASE_URL}/albums`, {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      showAlert(isEdit ? "Album berhasil diperbarui" : "Album berhasil ditambahkan");
      await queryClient.invalidateQueries({ queryKey: ["albums", SCHOOL_ID] });
      await queryClient.invalidateQueries({ queryKey: ["gallery"] });
      closeAlbumModal();
    } catch (err: any) { showAlert(err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Yakin ingin menghapus album ini?")) return;
    // Ambil albumId dari state yang sedang aktif agar cache tahu mana yang harus di-refresh
    try {
      const res = await fetch(`${BASE_URL}/albums/${id}`, { method: "DELETE", headers: getJsonHeaders() });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showAlert("Album berhasil dihapus");
      await queryClient.invalidateQueries({ queryKey: ["albums", SCHOOL_ID] });
      await queryClient.invalidateQueries({ 
        queryKey: ["gallery"] 
      });
    } catch (err: any) { showAlert(err.message); }
  };

  // ── ITEM CRUD (Logic Invalidation) ──────────────────────────────────────
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.albumId) return showAlert("Pilih album terlebih dahulu!");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", itemForm.title);
    formData.append("description", itemForm.description || "");
    if (!editingItemId) formData.append("albumId", itemForm.albumId);
    if (itemForm.image) formData.append("image", itemForm.image);

    try {
      const isEdit = !!editingItemId;
      const res = await fetch(isEdit ? `${BASE_URL}/gallery/${editingItemId}` : `${BASE_URL}/gallery`, {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      showAlert(isEdit ? "Item berhasil diperbarui" : "Item berhasil ditambahkan");
      await queryClient.invalidateQueries({ queryKey: ["gallery"] });
      closeItemModal();
    } catch (err: any) { showAlert(err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteItem = async (id: string, albumId: string) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    try {
      const res = await fetch(`${BASE_URL}/gallery/${id}`, { method: "DELETE", headers: getJsonHeaders() });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showAlert("Item berhasil dihapus");
      await queryClient.invalidateQueries({ 
        queryKey: ["albums", SCHOOL_ID] 
      });
      await queryClient.invalidateQueries({ 
        queryKey: ["gallery"] 
      });
    } catch (err: any) { showAlert(err.message); }
  };

  // ── MODAL HANDLERS ──────────────────────────────────────────────────────
  const openAlbumModal = (album: any = null) => {
    if (album) {
      setAlbumForm({ title: album.title, description: album.description || "", cover: null });
      setEditingAlbumId(album.id);
    } else {
      setAlbumForm(DEFAULT_ALBUM);
      setEditingAlbumId(null);
    }
    setIsAlbumModalOpen(true);
  };

  const openItemModal = (item: any = null) => {
    if (item) {
      setItemForm({ title: item.title, description: item.description || "", albumId: item.albumId, image: null });
      setEditingItemId(item.id);
    } else {
      setItemForm({ ...DEFAULT_ITEM, albumId: selectedAlbumForItems || "" });
      setEditingItemId(null);
    }
    setIsItemModalOpen(true);
  };

  const closeAlbumModal = () => { setAlbumForm(DEFAULT_ALBUM); setEditingAlbumId(null); setIsAlbumModalOpen(false); };
  const closeItemModal = () => { setItemForm(DEFAULT_ITEM); setEditingItemId(null); setIsItemModalOpen(false); };

  const selectedAlbum = albums.find((a: any) => a.id === selectedAlbumForGallery);

  return (
    <div className="min-h-screen bg-transparent text-white p-4 lg:p-0 space-y-8 font-sans">
      
      {/* 1. ALERT NOTIFICATION */}
      <AnimatePresence>
        {alert.isVisible && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-8 left-1/2 -translate-x-1/2 z-[99999] w-full max-w-md px-4">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Info size={18} />
                <span className="text-sm font-bold tracking-tight uppercase">{alert.message}</span>
              </div>
              <button onClick={hideAlert} className="hover:rotate-90 transition-transform"><X size={18}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HEADER */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-6 bg-blue-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Dashboard Konten</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Manajemen <span className="text-blue-700">Galeri</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Album dan foto kenangan</p>
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          {[
            { id: "album", label: "Album Foto", icon: FolderOpen },
            { id: "item", label: "Media Item", icon: ImageIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex items-center gap-2 px-6 py-5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-white/40 hover:text-white"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* 3. MAIN CONTENT AREA */}
      <main className="min-h-[60vh]">
        {activeTab === "album" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-white/30 font-bold uppercase tracking-widest text-[11px] italic">Daftar Koleksi Album</h2>
              <button
                onClick={() => openAlbumModal()}
                className="group flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Tambah Album
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.length === 0 && !albumsLoading && (
                <div className="col-span-full py-32 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-white/20 italic uppercase tracking-widest text-[10px]">
                  <FolderOpen size={48} className="mb-4 opacity-10" />
                  Belum ada album yang dibuat
                </div>
              )}

              {albums.map((album: any) => (
                <div
                  key={album.id}
                  onClick={() => { setSelectedAlbumForGallery(album.id); setIsGalleryModalOpen(true); }}
                  className="group relative bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/40 transition-all duration-500 cursor-pointer"
                >
                  <div className="relative h-52 overflow-hidden bg-zinc-900">
                    {album.coverUrl ? (
                      <img src={`${BASE_URL}${album.coverUrl}`} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={album.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={40} /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                      <Maximize2 size={16} />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter truncate">{album.title}</h3>
                    <p className="text-white/40 text-xs mt-2 line-clamp-2 min-h-[32px] italic">{album.description || "—"}</p>
                    
                    <div className="flex gap-2 mt-6 pt-6 border-t border-white/5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openAlbumModal(album); }}
                        className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Pen size={12} /> Edit
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album.id); }}
                        className="h-11 w-11 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-500/20"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 pt-2">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2 ml-1">
                  <ChevronRight size={12} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Pilih Album Galeri</span>
                </div>
                <Select value={selectedAlbumForItems || ""} onChange={(e) => setSelectedAlbumForItems(e.target.value || null)}>
                  <option value="" className="text-black">Pilih Album...</option>
                  {albums.map((a: any) => <option key={a.id} value={a.id} className="text-black">{a.title}</option>)}
                </Select>
              </div>
              <button
                onClick={() => selectedAlbumForItems ? openItemModal() : showAlert("Pilih album dulu!")}
                className="w-full md:w-auto h-[46px] px-8 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-lg"
                disabled={!selectedAlbumForItems}
              >
                <Plus size={16} className="inline mr-2" /> Tambah Asset
              </button>
            </div>

            {selectedAlbumForItems ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryItems.map((item: any) => (
                  <div key={item.id} className="group bg-white/5 border border-white/10 rounded-2xl p-2 hover:border-white/30 transition-all">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900">
                      <img src={`${BASE_URL}${item.imageUrl}`} className="w-full h-full object-cover" alt={item.title} />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => openItemModal(item)} className="p-2.5 bg-white text-black rounded-lg hover:scale-110 transition-transform"><Pen size={14}/></button>
                        <button onClick={() => handleDeleteItem(item.id, item.albumId)} className="p-2.5 bg-red-600 text-white rounded-lg hover:scale-110 transition-transform"><Trash size={14}/></button>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-[11px] font-bold truncate text-white uppercase tracking-tight">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center border border-white/5 rounded-[2.5rem] bg-white/[0.02] text-white/20 italic uppercase tracking-[0.3em] text-[10px]">
                Silakan pilih filter album untuk mengelola konten
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODAL ALBUM --- */}
      <Transition appear show={isAlbumModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[99999]" onClose={closeAlbumModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/90 backdrop-blur-md" /></Transition.Child>
          <div className="fixed inset-y-0 right-0 w-full max-w-lg">
            <Transition.Child as={Fragment} enter="transform transition duration-500 ease-in-out" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition duration-500 ease-in-out" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="h-full bg-[#0B1220] border-l border-white/10 p-10 flex flex-col shadow-2xl">
                {/* <div className="flex justify-between items-center mb-10">
                  <Dialog.Title className="text-2xl font-black uppercase text-white tracking-tighter">{editingAlbumId ? "Edit" : "Buat"} Album</Dialog.Title>
                  <button onClick={closeAlbumModal} className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white"><X size={20}/></button>
                </div> */}
                 <div className="pb-8 mb-8 border-b border-white/8 flex justify-between items-center bg-[#0B1220] z-10">
                  <div>
                    <h3 className="text-4xl font-black tracking-tighter text-white">
                      {editingAlbumId ? "Edit" : "Buat"} Album
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 italic">
                      Kenangan sekolah
                    </p>
                  </div>
                  <button
                    onClick={closeAlbumModal}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleAlbumSubmit} className="space-y-6 flex-1">
                  <Field label="Nama Album"><Input value={albumForm.title} onChange={(e: any) => setAlbumForm({...albumForm, title: e.target.value})} placeholder="..." required /></Field>
                  <Field label="Deskripsi Singkat"><TextArea value={albumForm.description} onChange={(e: any) => setAlbumForm({...albumForm, description: e.target.value})} rows={4} placeholder="..." /></Field>
                  <Field label="Gambar Cover">
                    <div className="relative group border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:bg-white/5 transition-all">
                      <input type="file" accept="image/*" onChange={(e) => setAlbumForm({...albumForm, cover: e.target.files?.[0] || null})} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <UploadCloud size={24} className="mx-auto mb-2 text-white/20" />
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{albumForm.cover ? albumForm.cover.name : "Unggah Asset Cover"}</p>
                    </div>
                  </Field>
                  <div className="pt-10 flex gap-4">
                    <button type="button" onClick={closeAlbumModal} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Batal</button>
                    <button type="submit" className="flex-[2] py-4 bg-blue-600 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20" disabled={loading}>
                      {loading ? "Menyimpan..." : "Simpan Album"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* --- MODAL ITEM --- */}
      <Transition appear show={isItemModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[99999]" onClose={closeItemModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/90 backdrop-blur-sm" /></Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-xl rounded-3xl bg-zinc-900 border border-white/10 p-10 text-left shadow-2xl">
                  <Dialog.Title className="text-xl font-black italic uppercase text-white mb-6">Informasi Asset</Dialog.Title>
                  <form onSubmit={handleItemSubmit} className="space-y-5">
                    {!editingItemId && (
                      <Field label="Target Album">
                        <Select value={itemForm.albumId} onChange={(e: any) => setItemForm({...itemForm, albumId: e.target.value})} required>
                          <option value="" className="text-black">Pilih...</option>
                          {albums.map((a: any) => <option key={a.id} value={a.id} className="text-black">{a.title}</option>)}
                        </Select>
                      </Field>
                    )}
                    <Field label="Judul"><Input value={itemForm.title} onChange={(e: any) => setItemForm({...itemForm, title: e.target.value})} required /></Field>
                    <Field label="Deskripsi"><TextArea value={itemForm.description} onChange={(e: any) => setItemForm({...itemForm, description: e.target.value})} rows={3} /></Field>
                    <Field label="File Gambar"><Input type="file" accept="image/*" onChange={(e) => setItemForm({...itemForm, image: e.target.files?.[0] || null})} required={!editingItemId} /></Field>
                    <div className="flex justify-end gap-3 pt-6">
                      <button type="button" onClick={closeItemModal} className="px-6 py-2 text-xs font-bold text-white/30">Tutup</button>
                      <button type="submit" className="px-8 py-2 bg-blue-600 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-lg" disabled={loading}>
                        {loading ? "..." : "Proses"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* --- MODAL GALLERY VIEW --- */}
      <Transition appear show={isGalleryModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999999]" onClose={() => setIsGalleryModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/95 backdrop-blur-2xl" /></Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="min-h-full p-6 lg:p-12">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedAlbum?.title || "Daftar Foto"}</h2>
                    <button onClick={() => setIsGalleryModalOpen(false)} className="h-12 w-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all"><X size={24} /></button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {galleryItems.map((item: any) => (
                      <div key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 shadow-2xl">
                        <img src={`${BASE_URL}${item.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                          <p className="text-[10px] font-black uppercase tracking-tight truncate">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
}