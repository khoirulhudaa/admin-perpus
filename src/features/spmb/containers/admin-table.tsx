import { useSchool } from "@/features/schools";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

// Theme Tokens (unchanged)
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

// Utility: clsx (unchanged)
const clsx = (...args) => args.filter(Boolean).join(" ");

// Mini Icons (unchanged)
const Icon = ({ label }) => (
  <span
    aria-hidden
    className="inline-block align-middle select-none"
    style={{ width: 16, display: "inline-flex", justifyContent: "center" }}
  >
    {label}
  </span>
);
const IClose = () => <Icon label="✕" />;
const IPlus = () => <Icon label="＋" />;

// Utility Components (unchanged)
const Input = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none",
      className
    )}
  />
);

// Status Pill (unchanged)
const StatusPill = ({ value }) => {
  const v = String(value || "").toLowerCase();
  let bg = "var(--brand-primary)", fg = "var(--brand-primaryText)";
  if (v === "submitted") {
    bg = "var(--brand-subtle)";
    fg = "#E5E7EB";
  }
  if (v === "review") {
    bg = "var(--brand-accent)";
    fg = "#111827";
  }
  if (v === "approved") {
    bg = "var(--brand-primary)";
    fg = "#052e26";
  }
  if (v === "rejected") {
    bg = "#ef4444";
    fg = "#fff5f5";
  }
  return (
    <span
      className="px-2 py-0.5 text-xs rounded-full"
      style={{ background: bg, color: fg }}
    >
      {value}
    </span>
  );
};

// Table Component (unchanged)
const Table = ({ columns, data, renderActions, selected, toggleSelect }) => (
  <div className="overflow-auto rounded-lg border border-white/30">
    <table className="min-w-full text-sm">
      <thead className="bg-white/30">
        <tr>
          <th className="px-3 py-2">
            <input
              type="checkbox"
              checked={data.length > 0 && selected.length === data.length}
              onChange={(e) => toggleSelect("all", e.target.checked)}
            />
          </th>
          {columns.map((c) => (
            <th
              key={c.key}
              className="px-3 py-2 text-left font-semibold"
              style={{ color: "var(--brand-primaryText)" }}
            >
              {c.label}
            </th>
          ))}
          {renderActions && (
            <th
              className="px-3 py-2 text-left font-semibold"
              style={{ color: "var(--brand-primaryText)" }}
            >
              Aksi
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              className="px-3 py-4 text-center"
              colSpan={columns.length + 2}
              style={{ color: "var(--brand-surfaceText)" }}
            >
              Tidak ada data
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr
              key={row.id}
              className="border-t"
              style={{ borderColor: "var(--brand-subtle)" }}
            >
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selected.includes(row.id)}
                  onChange={(e) => toggleSelect(row.id, e.target.checked)}
                />
              </td>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className="px-3 py-2"
                  style={{ color: "var(--brand-surfaceText)" }}
                >
                  {c.key === "status" ? (
                    <StatusPill value={row[c.key]} />
                  ) : (
                    row[c.key] || "-"
                  )}
                </td>
              ))}
              {renderActions && (
                <td className="px-3 py-2">{renderActions(row, idx)}</td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// Modal Component (unchanged)
const Modal = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div
        className="rounded-lg min-w-[50%] gap-4 p-6 relative"
        style={{ background: "var(--brand-surface)" }}
      >
        <button
          className="absolute top-3 right-3"
          onClick={onClose}
          style={{ color: "var(--brand-surfaceText)" }}
        >
          <IClose />
        </button>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--brand-surfaceText)" }}
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

// Detail Modal (unchanged)
const DetailModal = ({ open, onClose, row }) => {
  if (!open || !row) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div
        className="rounded-lg w-full max-w-md p-6 relative"
        style={{ background: "var(--brand-surface)" }}
      >
        <button
          className="absolute top-3 right-3"
          onClick={onClose}
          style={{ color: "var(--brand-surfaceText)" }}
        >
          <IClose />
        </button>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--brand-surfaceText)" }}
        >
          Detail Pendaftar
        </h2>
        <div className="space-y-2" style={{ color: "var(--brand-surfaceText)" }}>
          <div><strong>Nama:</strong> {row.applicantName}</div>
          <div><strong>NISN:</strong> {row.nisn}</div>
          <div><strong>Jenis Kelamin:</strong> {row.gender === "L" ? "Laki-laki" : "Perempuan"}</div>
          <div><strong>Tanggal Lahir:</strong> {new Date(row.birthDate).toLocaleDateString()}</div>
          <div><strong>Alamat:</strong> {row.address}</div>
          <div><strong>Jalur:</strong> {row.jalur}</div>
          <div><strong>Jenjang:</strong> {row.jenjang}</div>
          <div><strong>Status:</strong> <StatusPill value={row.status} /></div>
          <div><strong>Kelas Penempatan:</strong> {row.placementClass || "-"}</div>
          <div><strong>Telepon:</strong> {row.contacts.phone}</div>
          <div><strong>Nama Orang Tua:</strong> Ayah - {row.parentNames.ayah}, Ibu - {row.parentNames.ibu}</div>
          <div><strong>Kode Registrasi:</strong> {row.regCode || "-"}</div>
          <div><strong>Sekolah Sebelumnya:</strong> {row.prevSchoolName || "-"}</div>
          <div><strong>NPSN Sekolah Sebelumnya:</strong> {row.prevSchoolNpsn || "-"}</div>
          <div><strong>Bantuan Sosial:</strong> {row.socioAid || "-"}</div>
          <div><strong>Skor:</strong> {row.score || "-"}</div>
          <div><strong>Catatan:</strong> {row.notes || "-"}</div>
          {row.photo && (
            <img
              src={row.photo}
              alt={row.applicantName}
              className="w-40 h-56 object-cover rounded mt-3"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Photo Review Component (unchanged)
const PhotoReview = ({ rows, fetchStudents }) => {
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const approve = async (id) => {
    try {
      await axios.put("https://dev.kiraproject.id/api/spmb/students", {
        year: new Date().getFullYear(),
        items: [{ id, status: "approved" }],
      }, {
        headers: getAuthHeaders(),
      });
      toast.success("Pendaftar berhasil disetujui");
      fetchStudents();
    } catch (error) {
      console.error("Error approving student:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal menyetujui pendaftar");
      }
    }
  };

  const reject = async (id) => {
    try {
      await axios.put("https://dev.kiraproject.id/api/spmb/students", {
        year: new Date().getFullYear(),
        items: [{ id, status: "rejected" }],
      }, {
        headers: getAuthHeaders(),
      });
      toast.success("Pendaftar berhasil ditolak");
      fetchStudents();
    } catch (error) {
      console.error("Error rejecting student:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal menolak pendaftar");
      }
    }
  };

  const toReview = async (id) => {
    try {
      await axios.put("https://dev.kiraproject.id/api/spmb/students", {
        year: new Date().getFullYear(),
        items: [{ id, status: "review" }],
      }, {
        headers: getAuthHeaders(),
      });
      toast.success("Pendaftar ditandai untuk review");
      fetchStudents();
    } catch (error) {
      console.error("Error marking for review:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal menandai untuk review");
      }
    }
  };

  const bulkApprove = async () => {
    try {
      const items = rows
        .filter((r) => r.photo)
        .map((r) => ({ id: r.id, status: "approved" }));
      await axios.put("https://dev.kiraproject.id/api/spmb/students", {
        year: new Date().getFullYear(),
        items,
      }, {
        headers: getAuthHeaders(),
      });
      toast.success("Semua pendaftar dengan foto berhasil disetujui");
      fetchStudents();
    } catch (error) {
      console.error("Error bulk approving:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal menyetujui secara massal");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div style={{ color: "var(--brand-surfaceText)" }} className="text-sm">
          Total entri: {rows.length} • Dengan foto: {rows.filter((r) => !!r.photo).length}
        </div>
        <button
          onClick={bulkApprove}
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20"
        >
          Setujui Semua yang Ada Fotonya
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rows.map((r) => (
          <div
            key={r.id}
            className="rounded-lg border overflow-hidden"
            style={{
              borderColor: "var(--brand-subtle)",
              background: "var(--brand-surface)",
            }}
          >
            <div className="aspect-[3/4] bg-gray-800 flex items-center justify-center overflow-hidden">
              {r.photo ? (
                <img
                  src={r.photo}
                  alt={r.applicantName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="text-xs text-center px-4"
                  style={{ color: "var(--brand-surfaceText)" }}
                >
                  Belum ada foto. Upload dari menu Data Pendaftar.
                </div>
              )}
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div
                  className="font-semibold text-sm"
                  style={{ color: "var(--brand-surfaceText)" }}
                >
                  {r.applicantName}
                </div>
                <StatusPill value={r.status} />
              </div>
              <div className="text-xs" style={{ color: "var(--brand-surfaceText)" }}>
                {r.nisn}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toReview(r.id)}
                  className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-xs text-yellow-300 hover:bg-yellow-500/20"
                >
                  Tandai Review
                </button>
                <button
                  onClick={() => approve(r.id)}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20"
                >
                  Setujui
                </button>
                <button
                  onClick={() => reject(r.id)}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 hover:bg-red-500/20"
                >
                  Tolak
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Admin Students Component (updated with delete confirmation modal)
const AdminStudents = ({ rows, fetchStudents }) => {
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const columns = [
    { key: "applicantName", label: "Nama" },
    { key: "nisn", label: "NISN" },
    { key: "gender", label: "Jenis Kelamin" },
    { key: "birthDate", label: "Tanggal Lahir" },
    { key: "address", label: "Alamat" },
    { key: "jalur", label: "Jalur" },
    { key: "jenjang", label: "Jenjang" },
    { key: "status", label: "Status" },
    { key: "placementClass", label: "Kelas Penempatan" },
    { key: "regCode", label: "Kode Registrasi" },
    { key: "prevSchoolName", label: "Sekolah Sebelumnya" },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState([]);
  const [detailRow, setDetailRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    applicantName: "",
    nisn: "",
    gender: "L",
    birthDate: "",
    address: "",
    jalur: "zonasi",
    jenjang: "SMP",
    status: "submitted",
    placementClass: "",
    regCode: "",
    schoolId: "",
    prevSchoolName: "",
    prevSchoolNpsn: "",
    parentNames: { ayah: "", ibu: "" },
    contacts: { phone: "" },
    socioAid: "",
    docs: {},
    score: "",
    notes: "",
  });
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id, checked) => {
    if (id === "all") {
      setSelected(checked ? rows.map((r) => r.id) : []);
    } else {
      setSelected((prev) =>
        checked ? [...prev, id] : prev.filter((i) => i !== id)
      );
    }
  };

  const schoolData = useSchool();

  const addRow = async () => {
    try {
      await axios.post("https://dev.kiraproject.id/api/spmb/students", {
        year: new Date().getFullYear(),
        items: [{
          ...form,
          birthDate: new Date(form.birthDate).toISOString(),
          schoolId: schoolData?.data?.[0]?.id,
        }],
      }, {
        headers: getAuthHeaders(),
      });
      toast.success("Pendaftar berhasil ditambahkan");
      setModalOpen(false);
      setForm({
        applicantName: "",
        nisn: "",
        gender: "L",
        birthDate: "",
        address: "",
        jalur: "zonasi",
        jenjang: "SMP",
        status: "submitted",
        placementClass: "",
        regCode: "",
        schoolId: "",
        prevSchoolName: "",
        prevSchoolNpsn: "",
        parentNames: { ayah: "", ibu: "" },
        contacts: { phone: "" },
        socioAid: "",
        docs: {},
        score: "",
        notes: "",
      });
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal menambahkan pendaftar");
      }
    }
  };

  const editRowSubmit = async () => {
    try {
      const { photoFile, ...formData } = form;
      await axios.put("https://dev.kiraproject.id/api/spmb/students", {
        year: new Date().getFullYear(),
        items: [{
          ...formData,
          id: editRow.id,
          birthDate: new Date(formData.birthDate).toISOString(),
          schoolId: parseInt(formData.schoolId) || editRow.schoolId,
        }],
      }, {
        headers: getAuthHeaders(),
      });
      if (photoFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("image", photoFile);
        await axios.post("https://dev.kiraproject.id/api/spmb/upload/photo", formDataUpload, {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        });
      }
      toast.success("Pendaftar berhasil diedit");
      setEditModalOpen(false);
      setForm({
        applicantName: "",
        nisn: "",
        gender: "L",
        birthDate: "",
        address: "",
        jalur: "zonasi",
        jenjang: "SMP",
        status: "submitted",
        placementClass: "",
        regCode: "",
        schoolId: "",
        prevSchoolName: "",
        prevSchoolNpsn: "",
        parentNames: { ayah: "", ibu: "" },
        contacts: { phone: "" },
        socioAid: "",
        docs: {},
        score: "",
        notes: "",
      });
      fetchStudents();
    } catch (error) {
      console.error("Error editing student:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal mengedit pendaftar");
      }
    }
  };

  const confirmDelete = (ids) => {
    setDeleteIds(Array.isArray(ids) ? ids : [ids]);
    setDeleteModalOpen(true);
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(deleteIds.map((id) =>
        axios.delete(`https://dev.kiraproject.id/api/spmb/students/${id}`, {
          headers: getAuthHeaders(),
        })
      ));
      toast.success("Pendaftar berhasil dihapus");
      setSelected([]);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting students:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal menghapus pendaftar");
      }
    } finally {
      setDeleteModalOpen(false);
      setDeleteIds([]);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`https://dev.kiraproject.id/api/spmb/students/${id}`, {
        headers: getAuthHeaders(),
      });
      toast.success("Pendaftar berhasil dihapus");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal menghapus pendaftar");
      }
    } finally {
      setDeleteModalOpen(false);
      setDeleteIds([]);
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("year", new Date().getFullYear().toString());
    try {
      await axios.post("https://dev.kiraproject.id/api/spmb/students/import", formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("CSV berhasil diimpor");
      fetchStudents();
    } catch (error) {
      console.error("Error importing CSV:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal mengimpor CSV");
      }
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await axios.get("https://dev.kiraproject.id/api/spmb/students/export", {
        params: { year: new Date().getFullYear() },
        headers: getAuthHeaders(),
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "students.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV berhasil diekspor");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal mengekspor CSV");
      }
    }
  };

  const downloadTemplateCSV = () => {
    const header = "applicantName,nisn,gender,birthDate,address,jalur,jenjang,placementClass,regCode,schoolId,prevSchoolName,prevSchoolNpsn,contacts.phone,parentNames.ayah,parentNames.ibu,socioAid,score,notes";
    const sample = "Jane Doe,0987654321,P,2010-03-20,Bekasi,prestasi,SMP,7B,REG2025ABC123,2,SDN 01 Jakarta,12345678,08111222333,Ahmad,Fatimah,,,";
    const csv = header + "\n" + sample;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_students.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const win = window.open("");
    win.document.write(
      "<h2>Daftar Pendaftar</h2><pre>" + JSON.stringify(rows, null, 2) + "</pre>"
    );
    win.print();
    win.close();
  };

  const actions = (row) => (
    <div className="flex gap-2">
      <button
        className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20"
        onClick={() => {
          setDetailRow(row);
          setDetailOpen(true);
        }}
      >
        Detail
      </button>
      <button
        className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-300 hover:bg-blue-500/20"
        onClick={() => {
          setEditRow(row);
          setForm({
            ...row,
            birthDate: row.birthDate.split("T")[0],
            photoFile: null,
          });
          setEditModalOpen(true);
        }}
      >
        Edit
      </button>
      <button
        className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-xs text-yellow-300 hover:bg-yellow-500/20"
        onClick={() => toReview(row.id)}
      >
        Tandai Review
      </button>
      <button
        className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20"
        onClick={() => approve(row.id)}
      >
        Setujui
      </button>
      <button
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 hover:bg-red-500/20"
        onClick={() => reject(row.id)}
      >
        Tolak
      </button>
      <button
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 hover:bg-red-500/20"
        onClick={() => confirmDelete(row.id)}
      >
        Hapus
      </button>
    </div>
  );

  const approve = async (id) => {
    try {
      await axios.put("https://dev.kiraproject.id/api/spmb/students", {
        year: new Date().getFullYear(),
        items: [{ id, status: "approved" }],
      }, {
        headers: getAuthHeaders(),
      });
      toast.success("Pendaftar berhasil disetujui");
      fetchStudents();
    } catch (error) {
      console.error("Error approving student:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal menyetujui pendaftar");
      }
    }
  };

  const reject = async (id) => {
    try {
      await axios.put("https://dev.kiraproject.id/api/spmb/students", {
        year: new Date().getFullYear(),
        items: [{ id, status: "rejected" }],
      }, {
        headers: getAuthHeaders(),
      });
      toast.success("Pendaftar berhasil ditolak");
      fetchStudents();
    } catch (error) {
      console.error("Error rejecting student:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal menolak pendaftar");
      }
    }
  };

  const toReview = async (id) => {
    try {
      await axios.put("https://dev.kiraproject.id/api/spmb/students", {
        year: new Date().getFullYear(),
        items: [{ id, status: "review" }],
      }, {
        headers: getAuthHeaders(),
      });
      toast.success("Pendaftar ditandai untuk review");
      fetchStudents();
    } catch (error) {
      console.error("Error marking for review:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal menandai untuk review");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20"
            onClick={() => setModalOpen(true)}
          >
            <IPlus /> Tambah
          </button>
          <button
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
            onClick={() => selected.length > 0 && confirmDelete(selected)}
            disabled={selected.length === 0}
          >
            Hapus Masal
          </button>
        </div>
        <div className="rounded-lg border p-3 border-white/30 bg-white/10">
          <label
            className="font-medium text-sm"
            style={{ color: "var(--brand-surfaceText)" }}
          >
            Upload CSV
          </label>
          <span
            className="text-xs block mb-2"
            style={{ color: "var(--brand-surfaceText)" }}
          >
            Format kolom: applicantName,nisn,gender,birthDate,address,jalur,jenjang,placementClass,regCode,schoolId,prevSchoolName,prevSchoolNpsn,contacts.phone,parentNames.ayah,parentNames.ibu,socioAid,score,notes
          </span>
          <Input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="text-sm"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            <button
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
              onClick={downloadTemplateCSV}
            >
              Download Template CSV
            </button>
            <button
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
              onClick={downloadCSV}
            >
              Download CSV
            </button>
            <button
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
              onClick={downloadPDF}
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        data={rows}
        renderActions={actions}
        selected={selected}
        toggleSelect={toggleSelect}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Pendaftar">
        <form
          className="w-max gap-4 grid grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            addRow();
          }}
        >
          {[
            { key: "applicantName", label: "Nama" },
            { key: "nisn", label: "NISN" },
            { key: "gender", label: "Jenis Kelamin" },
            { key: "birthDate", label: "Tanggal Lahir" },
            { key: "address", label: "Alamat" },
            { key: "jalur", label: "Jalur" },
            { key: "jenjang", label: "Jenjang" },
            { key: "placementClass", label: "Kelas Penempatan" },
            { key: "regCode", label: "Kode Registrasi" },
            { key: "prevSchoolName", label: "Sekolah Sebelumnya" },
            { key: "prevSchoolNpsn", label: "NPSN Sekolah Sebelumnya" },
            { key: "socioAid", label: "Bantuan Sosial" },
            { key: "score", label: "Skor" },
            { key: "notes", label: "Catatan" },
          ].map((c) => (
            <div key={c.key} className="relative">
              <label
                className="text-sm font-medium"
                style={{ color: "var(--brand-surfaceText)" }}
              >
                {c.label}
              </label>
              {c.key === "gender" ? (
                <select
                  value={form[c.key]}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                >
                  <option className="text-black" value="L">Laki-laki</option>
                  <option className="text-black" value="P">Perempuan</option>
                </select>
              ) : c.key === "jalur" ? (
                <select
                  value={form[c.key]}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                >
                  <option className="text-black" value="zonasi">Zonasi</option>
                  <option className="text-black" value="prestasi">Prestasi</option>
                </select>
              ) : c.key === "jenjang" ? (
                <select
                  value={form[c.key]}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                >
                  <option className="text-black" value="SMP">SMP</option>
                  <option className="text-black" value="SMA">SMA</option>
                </select>
              ) : c.key === "birthDate" ? (
                <Input
                  type="date"
                  value={form[c.key]}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                />
              ) : (
                <Input
                  value={form[c.key]}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--brand-surfaceText)" }}
            >
              Telepon
            </label>
            <Input
              value={form.contacts.phone}
              onChange={(e) =>
                setForm({ ...form, contacts: { ...form.contacts, phone: e.target.value } })
              }
            />
          </div>
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--brand-surfaceText)" }}
            >
              Nama Ayah
            </label>
            <Input
              value={form.parentNames.ayah}
              onChange={(e) =>
                setForm({
                  ...form,
                  parentNames: { ...form.parentNames, ayah: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--brand-surfaceText)" }}
            >
              Nama Ibu
            </label>
            <Input
              value={form.parentNames.ibu}
              onChange={(e) =>
                setForm({
                  ...form,
                  parentNames: { ...form.parentNames, ibu: e.target.value },
                })
              }
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="absolute right-6 bottom-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Pendaftar">
        <form
          className="grid grid-cols-3 gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            editRowSubmit();
          }}
        >
          {[
            { key: "applicantName", label: "Nama" },
            { key: "nisn", label: "NISN" },
            { key: "gender", label: "Jenis Kelamin" },
            { key: "birthDate", label: "Tanggal Lahir" },
            { key: "address", label: "Alamat" },
            { key: "jalur", label: "Jalur" },
            { key: "jenjang", label: "Jenjang" },
            { key: "placementClass", label: "Kelas Penempatan" },
            { key: "regCode", label: "Kode Registrasi" },
            { key: "schoolId", label: "ID Sekolah" },
            { key: "prevSchoolName", label: "Sekolah Sebelumnya" },
            { key: "prevSchoolNpsn", label: "NPSN Sekolah Sebelumnya" },
            { key: "socioAid", label: "Bantuan Sosial" },
            { key: "score", label: "Skor" },
            { key: "notes", label: "Catatan" },
          ].map((c) => (
            <div key={c.key}>
              <label
                className="text-sm font-medium"
                style={{ color: "var(--brand-surfaceText)" }}
              >
                {c.label}
              </label>
              {c.key === "gender" ? (
                <select
                  value={form[c.key]}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                >
                  <option className="text-black" value="L">Laki-laki</option>
                  <option className="text-black" value="P">Perempuan</option>
                </select>
              ) : c.key === "jalur" ? (
                <select
                  value={form[c.key]}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                >
                  <option className="text-black" value="zonasi">Zonasi</option>
                  <option className="text-black" value="prestasi">Prestasi</option>
                </select>
              ) : c.key === "jenjang" ? (
                <select
                  value={form[c.key]}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
                >
                  <option className="text-black" value="SMP">SMP</option>
                  <option className="text-black" value="SMA">SMA</option>
                </select>
              ) : c.key === "birthDate" ? (
                <Input
                  type="date"
                  value={form[c.key]}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                />
              ) : (
                <Input
                  value={form[c.key]}
                  onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--brand-surfaceText)" }}
            >
              Foto
            </label>
            <Input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={(e) => setForm({ ...form, photoFile: e.target.files[0] })}
            />
            {form.photo && (
              <img
                src={form.photo}
                alt="Preview"
                className="w-40 h-56 object-cover rounded mt-3"
              />
            )}
          </div>
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--brand-surfaceText)" }}
            >
              Telepon
            </label>
            <Input
              value={form.contacts.phone}
              onChange={(e) =>
                setForm({ ...form, contacts: { ...form.contacts, phone: e.target.value } })
              }
            />
          </div>
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--brand-surfaceText)" }}
            >
              Nama Ayah
            </label>
            <Input
              value={form.parentNames.ayah}
              onChange={(e) =>
                setForm({
                  ...form,
                  parentNames: { ...form.parentNames, ayah: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--brand-surfaceText)" }}
            >
              Nama Ibu
            </label>
            <Input
              value={form.parentNames.ibu}
              onChange={(e) =>
                setForm({
                  ...form,
                  parentNames: { ...form.parentNames, ibu: e.target.value },
                })
              }
            />
          </div>
          <br />
          <div className="text-right">
            <button
              type="submit"
              className="absolute right-6 bottom-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
      <DetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        row={detailRow}
      />
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <div className="space-y-4">
          <p style={{ color: "var(--brand-surfaceText)" }}>
            Apakah Anda yakin ingin menghapus{" "}
            {deleteIds.length > 1
              ? `${deleteIds.length} pendaftar`
              : "pendaftar ini"}
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
              onClick={() => setDeleteModalOpen(false)}
            >
              Batal
            </button>
            <button
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
              onClick={() => deleteIds.length > 1 ? deleteSelected() : deleteStudent(deleteIds[0])}
            >
              Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Tabs Component (unchanged)
const Tabs = ({ tab, setTab }) => (
  <div className="inline-flex rounded-lg overflow-hidden border">
    {[{ k: "data", l: "Data Pendaftar" }, { k: "foto", l: "Review Foto" }].map(
      (t) => (
        <button
          key={t.k}
          onClick={() => setTab(t.k)}
          className={`px-4 py-2 text-sm`}
          style={{
            background: tab === t.k ? "#ffffff" : "var(--brand-surface)",
            color: tab === t.k ? "black" : "var(--brand-surfaceText)",
          }}
        >
          {t.l}
        </button>
      )
    )}
  </div>
);

// Main Component (unchanged)
export function SPMBMain() {
  const [tab, setTab] = useState("data");
  const [rows, setRows] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const schoolData = useSchool();
  console.log('schoolData', schoolData?.data);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Sesi tidak valid. Silakan login kembali.");
      setError("Sesi tidak valid. Silakan login kembali.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get("https://dev.kiraproject.id/api/spmb/students", {
        params: { year, q: searchQuery, status: statusFilter },
        headers: getAuthHeaders(),
      });
      setRows(Array.isArray(response.data.items) ? response.data.items : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching students:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal mengambil data pendaftar");
      }
      setError("Gagal mengambil data pendaftar");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const publishStudents = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Sesi tidak valid. Silakan login kembali.");
      return;
    }
    try {
      await axios.post("https://dev.kiraproject.id/api/spmb/students/publish", {
        year,
        title: `Pengumuman SPMB ${year}`,
        visibility: "public_list",
      }, {
        headers: getAuthHeaders(),
      });
      toast.success("Pengumuman berhasil dipublikasikan");
    } catch (error) {
      console.error("Error publishing students:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
      } else {
        toast.error("Gagal mempublikasikan pengumuman");
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [year, searchQuery, statusFilter]);

  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div className="min-h-screen space-y-6">
      <Toaster richColors />
      <style>{`
        :root {
          ${Object.entries(THEME_TOKENS.smkn13)
            .map(([key, value]) => `${key}: ${value};`)
            .join("\n")}
        }
      `}</style>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          Dashboard Admin Pengumuman
        </h1>
        <Tabs tab={tab} setTab={setTab} />
      </div>
      <div className="flex gap-3">
        <Input
          placeholder="Cari nama..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-white outline-none"
        >
          <option className="text-black" value="">Semua Status</option>
          <option className="text-black" value="submitted">Submitted</option>
          <option className="text-black" value="review">Review</option>
          <option className="text-black" value="approved">Approved</option>
          <option className="text-black" value="rejected">Rejected</option>
        </select>
        <Input
          type="number"
          placeholder="Tahun"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      {loading ? (
        <div style={{ color: "var(--brand-surfaceText)" }} className="text-sm">
          Memuat data...
        </div>
      ) : error ? (
        <div style={{ color: "var(--brand-surfaceText)" }} className="text-sm">
          {error}
        </div>
      ) : (
        <>
          {tab === "data" && <AdminStudents rows={safeRows} fetchStudents={fetchStudents} />}
          {tab ==="foto" && <PhotoReview rows={safeRows} fetchStudents={fetchStudents} />}
          <div className="sticky bottom-4 flex items-center justify-between gap-3 p-3 rounded-lg border border-white/30">
            <div style={{ color: "var(--brand-surfaceText)" }} className="text-sm">
              Siap publish: <b>{safeRows.filter((r) => r.status === "approved").length}</b> •
              In Review: <b>{safeRows.filter((r) => r.status === "review").length}</b> •
              Submitted/Rejected: <b>
                {safeRows.length -
                  safeRows.filter((r) => r.status === "approved" || r.status === "review").length}
              </b>
            </div>
            <button
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20"
              onClick={publishStudents}
            >
              Publikasikan
            </button>
          </div>
        </>
      )}
    </div>
  );
}