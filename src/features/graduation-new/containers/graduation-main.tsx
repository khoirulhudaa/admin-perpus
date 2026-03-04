import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

// Theme Tokens (sama dengan referensi)
const THEME_TOKENS: Record<string, React.CSSProperties> = {
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

// Apply theme (sama dengan referensi)
if (typeof document !== 'undefined') {
  document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13)
    .map(([k, v]) => `${k}: ${v};`)
    .join('');
}

// Utility: clsx (sama dengan referensi)
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

// Custom useAlert Hook (sama dengan referensi)
interface AlertState {
  message: string;
  isVisible: boolean;
}

const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({ message: "", isVisible: false });

  const showAlert = useCallback((message: string) => {
    setAlert({ message, isVisible: true });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert({ message: "", isVisible: false });
  }, []);

  return { alert, showAlert, hideAlert };
};

// Alert Component (sama dengan referensi)
const Alert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const isSuccess = message.includes("successfully");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "mb-4 rounded-xl border p-4 text-sm",
        isSuccess
          ? "border-green-500/30 bg-green-500/10 text-green-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className={clsx(
            "ml-4",
            isSuccess ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400"
          )}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

// Mini Icons (sama dengan referensi)
const Icon = ({ label }: { label: string }) => (
  <span
    aria-hidden
    className="inline-block align-middle select-none"
    style={{ width: 16, display: "inline-flex", justifyContent: "center" }}
  >
    {label}
  </span>
);
const ISave = () => <Icon label="💾" />;
const IEdit = () => <Icon label="✏️" />;
const IDelete = () => <Icon label="🗑️" />;
const IAdd = () => <Icon label="➕" />;

// Utility Components (sama dengan referensi)
interface FieldProps {
  label?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const Field: React.FC<FieldProps> = ({ label, hint, children, className }) => (
  <label className={clsx("block", className)}>
    {label && <div className="mb-1 text-xs font-medium text-white/70">{label}</div>}
    {children}
    {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
  </label>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ className, ...props }) => (
  <textarea
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

const Select: React.FC<SelectProps> = ({ className, ...props }) => (
  <select
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

// Data Interface
interface Graduation {
  id?: number;
  nama: string;
  nisn: string;
  peserta: string;
  kelas: string;
  jurusan: string;
  tahun: number;
  status: string;
  sekolah: string;
  ket: string;
  sekolahId?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface GraduationResponse {
  message: string;
  total: number;
  data: Graduation[];
}

// Default Data
const DEFAULT_GRADUATION: Graduation = {
  nama: "",
  nisn: "",
  peserta: "",
  kelas: "",
  jurusan: "",
  tahun: new Date().getFullYear(),
  status: "Lulus",
  sekolah: "",
  ket: "",
};

const ISpinner = () => (
  <span
    className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"
  ></span>
);

// Graduation Component
export function GraduationMain() {
  const [graduationList, setGraduationList] = useState<Graduation[]>([]);
  const [formData, setFormData] = useState<Graduation>(DEFAULT_GRADUATION);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingIds, setDeleteLoadingIds] = useState<number[]>([]);
  const [tahunFilter, setTahunFilter] = useState<number>(new Date().getFullYear());
  const { alert, showAlert, hideAlert } = useAlert();

  const BASE_URL = "https://dev.kiraproject.id/api/v2/graduations";
  const getToken = () => localStorage.getItem("token");

  // Common headers with token
  const getHeaders = (isPostOrPut: boolean = false) => {
    const token = getToken();
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    if (isPostOrPut) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  };

  // Fetch data
  const fetchData = async () => {
    if (!getToken()) {
      showAlert("Token autentikasi tidak ditemukan. Silakan login.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}?tahun=${tahunFilter}`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch graduation data");
      const result: GraduationResponse = await response.json();
      setGraduationList(result.data);
    } catch (err) {
      showAlert("Failed to load graduation data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tahunFilter]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "tahun" ? Number(value) : value });
  };

  // Handle form submission (Create/Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nisn || !formData.peserta || !formData.kelas || !formData.jurusan || !formData.tahun || !formData.sekolah) {
      showAlert("Semua kolom wajib diisi");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        // Update
        const response = await fetch(`${BASE_URL}/${editingId}`, {
          method: "PUT",
          headers: getHeaders(true),
          body: JSON.stringify({
            status: formData.status,
            ket: formData.ket,
          }),
        });
        if (!response.ok) throw new Error("Failed to update graduation");
        showAlert("Graduation updated successfully");
      } else {
        // Create
        const response = await fetch(BASE_URL, {
          method: "POST",
          headers: getHeaders(true),
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to create graduation");
        showAlert("Graduation created successfully");
      }
      setFormData(DEFAULT_GRADUATION);
      setEditingId(null);
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      showAlert("Failed to save graduation");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    setDeleteLoadingIds((prev) => [...prev, id]);
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete graduation");
      showAlert("Graduation deleted successfully");
      await fetchData();
    } catch (err) {
      showAlert("Failed to delete graduation");
      console.error(err);
    } finally {
      setDeleteLoadingIds((prev) => prev.filter((deleteId) => deleteId !== id));
    }
  };

  // Handle edit
  const handleEdit = (item: Graduation) => {
    setFormData(item);
    setEditingId(item.id!);
    setIsModalOpen(true);
  };

  // Handle open modal
  const handleOpenModal = () => {
    setFormData(DEFAULT_GRADUATION);
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setFormData(DEFAULT_GRADUATION);
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 py-4 mb-10">
      <AnimatePresence>
        {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      </AnimatePresence>

      {/* Filter and Add Button */}
      <div className="flex justify-between items-center">
        <Select
          value={tahunFilter}
          onChange={(e) => setTahunFilter(Number(e.target.value))}
          disabled={loading}
          className="w-max"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
            <option key={year} value={year} className="text-black">
              {year}
            </option>
          ))}
        </Select>
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
          disabled={loading}
        >
          <IAdd className="h-4 w-4" /> Tambah Kelulusan
        </button>
      </div>

      {/* Modal for Graduation Form */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-90" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
                  <Dialog.Title className="text-lg font-semibold text-white mb-4">
                    {editingId ? "Edit Kelulusan" : "Tambah Kelulusan"}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className={`grid gap-4 ${editingId ? 'md:grid-cols-1' : 'md:grid-cols-2'}`}>
                      {editingId ? (
                        <>
                          {/* Hanya tampilkan status dan keterangan saat edit */}
                          <Field label="Status">
                            <Select
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              disabled={loading}
                            >
                              <option value="Lulus">Lulus</option>
                              <option value="Tidak Lulus">Tidak Lulus</option>
                            </Select>
                          </Field>
                          <Field label="Keterangan" className="md:col-span-2">
                            <TextArea
                              name="ket"
                              value={formData.ket}
                              onChange={handleInputChange}
                              placeholder="Keterangan kelulusan"
                              rows={3}
                              disabled={loading}
                            />
                          </Field>
                        </>
                      ) : (
                        <>
                          {/* Tampilkan semua field saat create */}
                          <Field label="Nama">
                            <Input
                              name="nama"
                              value={formData.nama}
                              onChange={handleInputChange}
                              placeholder="Nama siswa"
                              disabled={loading}
                            />
                          </Field>
                          <Field label="NISN">
                            <Input
                              name="nisn"
                              minLength={10}
                              maxLength={10}
                              value={formData.nisn}
                              onChange={handleInputChange}
                              placeholder="Nomor Induk Siswa Nasional"
                              disabled={loading}
                            />
                          </Field>
                          <Field label="Nomor Peserta">
                            <Input
                              name="peserta"
                              value={formData.peserta}
                              onChange={handleInputChange}
                              placeholder="Nomor peserta"
                              disabled={loading}
                            />
                          </Field>
                          <Field label="Kelas">
                            <Input
                              name="kelas"
                              value={formData.kelas}
                              onChange={handleInputChange}
                              placeholder="Kelas"
                              disabled={loading}
                            />
                          </Field>
                          <Field label="Jurusan">
                            <Input
                              name="jurusan"
                              value={formData.jurusan}
                              onChange={handleInputChange}
                              placeholder="Jurusan"
                              disabled={loading}
                            />
                          </Field>
                          <Field label="Tahun">
                            <Input
                              type="number"
                              name="tahun"
                              value={formData.tahun}
                              onChange={handleInputChange}
                              placeholder="Tahun kelulusan"
                              disabled={loading}
                            />
                          </Field>
                          <Field label="Status">
                            <Select
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              disabled={loading}
                            >
                              <option value="Lulus">Lulus</option>
                              <option value="Tidak Lulus">Tidak Lulus</option>
                            </Select>
                          </Field>
                          <Field label="Sekolah">
                            <Input
                              name="sekolah"
                              value={formData.sekolah}
                              onChange={handleInputChange}
                              placeholder="Nama sekolah"
                              disabled={loading}
                            />
                          </Field>
                          <Field label="Keterangan" className="md:col-span-2">
                            <TextArea
                              name="ket"
                              value={formData.ket}
                              onChange={handleInputChange}
                              placeholder="Keterangan kelulusan"
                              rows={3}
                              disabled={loading}
                            />
                          </Field>
                        </>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white"
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? <ISpinner /> : <ISave className="h-4 w-4" />} {editingId ? "Update" : "Simpan"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* List Section (Table) */}
      <div className="rounded-2xl border border-white/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-white">Daftar Kelulusan</div>
        </div>
        <div className="overflow-x-auto">
          {loading && !isModalOpen && (
            <div className="flex justify-center py-4">
              <ISpinner />
            </div>
          )}
          {!loading && (
            <table className="min-w-full border-collapse border border-white/20">
              <thead>
                <tr className="bg-white/10">
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Nama</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">NISN</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">No. Peserta</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Kelas</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Jurusan</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Tahun</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Status</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Sekolah</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Keterangan</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {graduationList.map((item) => (
                  <tr key={item.id} className="border-b border-white/20">
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{item.nama}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{item.nisn}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{item.peserta}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{item.kelas}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{item.jurusan}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{item.tahun}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{item.status}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{item.sekolah}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{item.ket}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          disabled={loading || deleteLoadingIds.includes(item.id!)}
                          className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-300 disabled:opacity-50"
                        >
                          <IEdit /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id!)}
                          disabled={loading || deleteLoadingIds.includes(item.id!)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 disabled:opacity-50"
                        >
                          {deleteLoadingIds.includes(item.id!) ? <ISpinner /> : <><IDelete /> Hapus</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {graduationList.length === 0 && (
                  <tr>
                    <td colSpan={10} className="border border-white/20 px-4 py-2 text-center text-sm text-white">
                      Tidak ada data kelulusan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}