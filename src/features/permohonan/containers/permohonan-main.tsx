import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'; // Pastikan @headlessui/react terinstall

// Theme Tokens
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

// Utility: clsx
const clsx = (...args) => args.filter(Boolean).join(" ");

// Mini Icons
const Icon = ({ label }) => (
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
const ISpinner = () => (
  <span
    className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"
  ></span>
);

// Utility Components
const Field = ({ label, hint, children, className }) => (
  <label className={clsx("block", className)}>
    {label && (
      <div className="mb-1 text-xs font-medium text-white">{label}</div>
    )}
    {children}
    {hint && <div className="mt-1 text-[10px] text-white/50">{hint}</div>}
  </label>
);

const Input = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

const Select = ({ className, ...props }) => (
  <select
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

// Custom useAlert Hook
const useAlert = () => {
  const [alert, setAlert] = useState({ message: "", isVisible: false });

  const showAlert = useCallback((message) => {
    setAlert({ message, isVisible: true });
    setTimeout(() => setAlert({ message: "", isVisible: false }), 5000);
  }, []);

  const hideAlert = useCallback(() => {
    setAlert({ message: "", isVisible: false });
  }, []);

  return { alert, showAlert, hideAlert };
};

// Alert Component
const Alert = ({ message, onClose }) => {
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

// Data Interface
const Permohonan = () => ({
  id: null,
  status: "Dibuat",
  jenis: "Informasi",
  nama: "",
  kontak: "",
  pesan: "",
});

// API URL
const API_URL = 'https://dev.kiraproject.id/api/permohonan';

export const PermohonanMain = () => {
  const [permohonanList, setPermohonanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingIds, setDeleteLoadingIds] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState("");
  const { alert, showAlert, hideAlert } = useAlert();
  const [editingPermohonan, setEditingPermohonan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch permohonan (GET)
  const fetchPermohonan = async (page = 1, status = statusFilter) => {
    if (!token) {
      showAlert('Token autentikasi tidak ditemukan. Silakan login.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        params: { status, page, limit: pagination.limit, t: new Date().getTime() },
      });
      setPermohonanList(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching permohonan:', err);
      showAlert('Gagal memuat data permohonan');
    } finally {
      setLoading(false);
    }
  };

  // Update permohonan (PUT)
  const updatePermohonan = async (id, permohonan) => {
    try {
      await axios.put(`${API_URL}/${id}`, permohonan, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await fetchPermohonan(pagination.page, statusFilter);
      showAlert('Data updated successfully');
    } catch (err) {
      console.error('Error updating permohonan:', err);
      showAlert('Gagal memperbarui permohonan');
      throw err;
    }
  };

  // Delete permohonan (DELETE)
  const deletePermohonan = async (id) => {
    setDeleteLoadingIds((prev) => [...prev, id]);
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      await fetchPermohonan(pagination.page, statusFilter);
      showAlert('Data deleted successfully');
    } catch (err) {
      console.error('Error deleting permohonan:', err);
      showAlert('Gagal menghapus permohonan');
    } finally {
      setDeleteLoadingIds((prev) => prev.filter((deleteId) => deleteId !== id));
    }
  };

  // Fetch permohonan on mount and when filter or page changes
  useEffect(() => {
    fetchPermohonan(pagination.page, statusFilter);
  }, [pagination.page, statusFilter]);

  // Handle editing existing permohonan
  const startEditing = (permohonan) => {
    setEditingPermohonan({ ...permohonan });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setEditingPermohonan((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingPermohonan.nama || !editingPermohonan.jenis || !editingPermohonan.kontak || !editingPermohonan.pesan) {
      showAlert('Semua field harus diisi');
      return;
    }
    setLoading(true);
    try {
      await updatePermohonan(editingPermohonan.id, {
        status: editingPermohonan.status,
        jenis: editingPermohonan.jenis,
        nama: editingPermohonan.nama,
        kontak: editingPermohonan.kontak,
        pesan: editingPermohonan.pesan,
      });
      setEditingPermohonan(null);
      setIsModalOpen(false);
    } catch (err) {
      // Error handled in updatePermohonan
    } finally {
      setLoading(false);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setEditingPermohonan(null);
    setIsModalOpen(false);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen pb-6" style={THEME_TOKENS.smkn13}>
      {alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}
      <div className="rounded-2xl border border-white/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-white">Daftar Permohonan</div>
          <div className='flex items-center gap-3'>
            <p className='w-max flex text-sm'>Filter status</p>
            <Field label="" className='flex items-center gap-4 w-max'>
              <Select value={statusFilter} onChange={handleStatusFilterChange} disabled={loading}>
                <option className='text-black' value="">Semua</option>
                <option className='text-black' value="Dibuat">Dibuat</option>
                <option className='text-black' value="Diproses">Diproses</option>
                <option className='text-black' value="Selesai">Selesai</option>
                <option className='text-black' value="Ditolak">Ditolak</option>
                <option className='text-black' value="Dibatalkan">Dibatalkan</option>
              </Select>
            </Field>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading && !editingPermohonan && (
            <div className="flex justify-center py-4">
              <ISpinner />
            </div>
          )}
          {!loading && (
            <table className="min-w-full border-collapse border border-white/20">
              <thead>
                <tr className="bg-white/10">
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Kode Tiket</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Jenis</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Nama</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Kontak</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Pesan</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Status</th>
                  <th className="border border-white/20 px-4 py-2 text-left text-xs font-medium text-white">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {permohonanList.map((permohonan) => (
                  <tr key={permohonan.id} className="border-b border-white/20">
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{permohonan.kodeTiket}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{permohonan.jenis}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{permohonan.nama}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{permohonan.kontak}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{permohonan.pesan}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">{permohonan.status}</td>
                    <td className="border border-white/20 px-4 py-2 text-sm text-white">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(permohonan)}
                          disabled={loading || deleteLoadingIds.includes(permohonan.id)}
                          className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-300 disabled:opacity-50"
                        >
                          <IEdit /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePermohonan(permohonan.id)}
                          disabled={loading || deleteLoadingIds.includes(permohonan.id)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 disabled:opacity-50"
                        >
                          {deleteLoadingIds.includes(permohonan.id) ? <ISpinner /> : <><IDelete /> Hapus</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {permohonanList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="border border-white/20 px-4 py-2 text-center text-sm text-white">
                      Tidak ada data permohonan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={loading || page === pagination.page}
                className={clsx(
                  "rounded-lg border px-3 py-1 text-xs",
                  page === pagination.page
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-white/20 text-white hover:bg-white/10"
                )}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Form */}
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
                  <Dialog.Title className="mb-3 text-sm font-semibold text-white">
                    Edit Permohonan
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Status">
                        <Select
                          value={editingPermohonan?.status || "Dibuat"}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          disabled={loading}
                        >
                          <option className='text-black' value="Dibuat">Dibuat</option>
                          <option className='text-black' value="Diproses">Diproses</option>
                          <option className='text-black' value="Selesai">Selesai</option>
                          <option className='text-black' value="Ditolak">Ditolak</option>
                          <option className='text-black' value="Dibatalkan">Dibatalkan</option>
                        </Select>
                      </Field>
                      <Field label="Jenis">
                        <Select
                          value={editingPermohonan?.jenis || "Informasi"}
                          onChange={(e) => handleInputChange('jenis', e.target.value)}
                          disabled={loading}
                        >
                          <option className='text-black' value="Informasi">Informasi</option>
                          <option className='text-black' value="Pengaduan">Pengaduan</option>
                        </Select>
                      </Field>
                      <Field label="Nama">
                        <Input
                          value={editingPermohonan?.nama || ""}
                          onChange={(e) => handleInputChange('nama', e.target.value)}
                          placeholder="Masukkan nama"
                          disabled={loading}
                        />
                      </Field>
                      <Field label="Kontak">
                        <Input
                          value={editingPermohonan?.kontak || ""}
                          onChange={(e) => handleInputChange('kontak', e.target.value)}
                          placeholder="Masukkan kontak"
                          disabled={loading}
                        />
                      </Field>
                      <Field label="Pesan" className="md:col-span-2">
                        <textarea
                          value={editingPermohonan?.pesan || ""}
                          onChange={(e) => handleInputChange('pesan', e.target.value)}
                          placeholder="Masukkan pesan"
                          disabled={loading}
                          className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                          rows={4}
                        />
                      </Field>
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
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
                        disabled={loading}
                      >
                        {loading ? <ISpinner /> : <><ISave /> Update</>}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};