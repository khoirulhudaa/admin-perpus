import { getStaticFile } from '@/core/utils';
import { useSchool } from "@/features/schools";
import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
import axios from 'axios';
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "sonner";

const pdfStyles = StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    padding: 20,
  },
  header: {
    position: 'relative',
    marginBottom: 20,
  },
  headerImage: {
    width: 555,
    maxHeight: 100,
    objectFit: 'contain',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  contentWrapper: {
    marginBottom: 10,
  },
  content: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 8,
    textAlign: 'center',
  },
  tableHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  signature: {
    marginTop: 40,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  signatureImage: {
    width: 100,
    height: 'auto',
    maxHeight: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  signatureText: {
    fontSize: 10,
    textAlign: 'center',
  },
});

// PDF Component for Mapel
const MapelPDF = ({ mapelData, schoolData, jenjang }) => {
  const kopSuratUrl = schoolData?.kopSurat
    ? schoolData.kopSurat.startsWith('data:image')
      ? schoolData.kopSurat
      : `data:image/png;base64,${schoolData.kopSurat}`
    : '';

  const signatureUrl = schoolData?.ttdKepalaSekolah
    ? schoolData.ttdKepalaSekolah.startsWith('data:image')
      ? schoolData.ttdKepalaSekolah
      : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
    : '';

  const headers = ['No', 'Nama', 'Jenjang', 'Kelas', 'Kurikulum', 'Kelompok', 'Jam/Mgg', 'Status'];
  const columnWidths = ['5%', '25%', '10%', '20%', '10%', '15%', '10%', '10%'];

  const rowsPerPage = 20;
  const dataChunks = [];
  for (let i = 0; i < mapelData.length; i += rowsPerPage) {
    const chunk = mapelData.slice(i, i + rowsPerPage);
    if (chunk.length > 0) {
      dataChunks.push(chunk);
    }
  }

  return (
    <Document>
      {dataChunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pdfStyles.page} break={pageIndex > 0}>
          <View style={pdfStyles.header} fixed>
            {kopSuratUrl && (
              <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
            )}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Daftar Mata Pelajaran</Text>
            <Text style={pdfStyles.content}>
              {schoolData?.name || 'Nama Sekolah'} - Jenjang: {jenjang || 'Semua'}
            </Text>
            <Text style={pdfStyles.content}>
              Total Mata Pelajaran: {mapelData.length}
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {headers.map((header, index) => (
                  <View
                    key={index}
                    style={[pdfStyles.tableCell, pdfStyles.tableHeader, { width: columnWidths[index] }]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((m, index) => (
                <View style={pdfStyles.tableRow} key={`${pageIndex}_${index}`} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[0] }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[1] }]}>
                    <Text>{m.nama}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[2] }]}>
                    <Text>{m.jenjang}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[3] }]}>
                    <Text>{m.namaKelasAgg}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[4] }]}>
                    <Text>{m.kurikulum}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[5] }]}>
                    <Text>{m.kelompok}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[6] }]}>
                    <Text>{m.weeklyHours || '-'}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[7] }]}>
                    <Text>{m.status}</Text>
                  </View>
                </View>
              ))}
            </View>
            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles.signature}>
                <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                {signatureUrl && (
                  <Image src={getStaticFile(signatureUrl)} style={pdfStyles.signatureImage} />
                )}
                <Text style={pdfStyles.signatureText}>
                  {schoolData?.namaKepalaSekolah || 'Nama Kepala Sekolah'}
                </Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

// Static choices
const LEVELS_MAP: Record<string, string[]> = {
  SD: ["I", "II", "III", "IV", "V", "VI"],
  SMP: ["VII", "VIII", "IX"],
  SMA: ["X", "XI", "XII"],
  SMK: ["X", "XI", "XII"],
  MI: ["I", "II", "III", "IV", "V", "VI"],
  MTs: ["VII", "VIII", "IX"],
  MA: ["X", "XI", "XII"],
} as const;

const KURIKULUM_OPTIONS = ["MERDEKA", "K13"] as const;
const KELOMPOK_OPTIONS = ["Wajib Umum", "PEMINATAN_IPA", "PEMINATAN_IPS", "PEMINATAN_BAHASA", "KEJURUAN", "KEAGAMAAN", "MULOK"] as const;
const STATUS_OPTIONS = ["all", "active", "archived"] as const;

// Types
interface MapelRow {
  id: number;
  tenantId: string;
  jenjang: keyof typeof LEVELS_MAP | null;
  kelasIds: number[];
  kurikulum: typeof KURIKULUM_OPTIONS[number] | null;
  kelompok: typeof KELOMPOK_OPTIONS[number] | null;
  kode: string | null;
  nama: string;
  isP5: boolean;
  weeklyHours: number | null;
  teacher: string | null;
  note: string | null;
  status: "Aktif" | "Arsip";
  namaKelasAgg: string;
}

interface KelasLite {
  id: number;
  tenantId: string;
  jenjang: keyof typeof LEVELS_MAP;
  level: string;
  namaKelas: string;
}

// UI primitives
function Button({ children, className = "", variant = "default", disabled = false, ...props }: any) {
  const variants: Record<string, string> = {
    default: "bg-teal-600 text-white hover:bg-teal-500",
    ghost: "bg-white/10 dark:bg-gray-700/30 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600/50",
    outline: "border border-gray-300 dark:border-gray-600 bg-white/10 dark:bg-gray-700/30 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600/50",
    subtle: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600",
    primary: "bg-teal-600 text-white hover:bg-teal-500",
    success: "bg-teal-600 text-white hover:bg-teal-500",
    danger: "bg-red-600 text-white hover:bg-red-500",
  };
  return (
    <button
      className={clsx("px-3 flex items-center gap-2 py-2 rounded-lg text-sm font-medium transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed", variants[variant] || variants.default, className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ className = "", ...props }: any) {
  return (
    <input
      className={clsx(
        "relative top-[3px] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900",
        className
      )}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }: any) {
  return (
    <textarea
      className={clsx(
        "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900",
        className
      )}
      {...props}
    />
  );
}

function Select({ className = "", children, ...props }: any) {
  return (
    <select
      className={clsx(
        "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

// Helpers
function clsx(...a: any[]) { return a.filter(Boolean).join(" "); }
function uid(prefix = "id") { return `${prefix}-${Math.random().toString(36).slice(2, 9)}`; }
function kelasNameById(id: number, kelasOptions: KelasLite[]) {
  return kelasOptions.find(k => k.id === id)?.namaKelas || "—";
}
function listKelasNames(ids: number[], kelasOptions: KelasLite[]) {
  return ids.map(id => kelasNameById(id, kelasOptions)).filter(Boolean);
}

// Main: Mapel Manager
export const CourseTable = () => {
  const [jenjang, setJenjang] = useState<keyof typeof LEVELS_MAP | "">("");
  const [mapelData, setMapelData] = useState<MapelRow[]>([]);
  const [kelasOptions, setKelasOptions] = useState<KelasLite[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [kurikulum, setKurikulum] = useState<typeof KURIKULUM_OPTIONS[number] | "">("");
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]>("all");
  const [kelasFilter, setKelasFilter] = useState<string>("");
  const [q, setQ] = useState("");
  const [detailRow, setDetailRow] = useState<MapelRow | null>(null);
  const [editRow, setEditRow] = useState<MapelRow | null>(null);
  const [form, setForm] = useState<Partial<MapelRow>>({});
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const school = useSchool();
  const sekolahId = school?.data?.[0]?.id;
  const activeTenant = school?.data?.[0]?.id || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [modalJenjang, setModalJenjang] = useState<keyof typeof LEVELS_MAP | "">("");

  // Create axios instance with default headers
  const apiClient = axios.create({
    baseURL: 'https://dev.kiraproject.id/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  // Pagination settings
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalData / itemsPerPage);

  // Fetch mapel data from API
  useEffect(() => {
    if (!sekolahId || !token) return;

    const fetchMapel = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/mapel', {
          params: {
            page: currentPage,
            pageSize: itemsPerPage,
            status: status === 'all' ? undefined : status,
            search: q || undefined,
            sekolahId,
            kelasId: kelasFilter || undefined,
            jenjang: jenjang || undefined,
            kurikulum: kurikulum || undefined,
          },
        });

        setTotalData(response?.data?.data?.total || 0);

        console.log('response', response?.data?.data);

        const apiData = response.data.data.rows.map((row: any) => ({
          id: row.id,
          tenantId: String(row.sekolahId),
          jenjang: row.jenjang || 'SMA',
          kelasIds: row.mapelKelas.map((k: any) => k.kelasId),
          kurikulum: row.kurikulum || 'MERDEKA',
          kelompok: row.kelompok ? row.kelompok.replace('_', ' ') : 'Wajib Umum',
          kode: row.kode || '',
          nama: row.namaMataPelajaran,
          isP5: row.isP5,
          weeklyHours: row.mapelKelas[0]?.weeklyHours || 2,
          teacher: row.mapelKelas[0]?.teacher?.name || null,
          note: row.mapelKelas[0]?.note || null,
          status: row.archived ? 'Arsip' : 'Aktif',
          namaKelasAgg: row.namaKelasAgg,
        }));

        const kelasData = response.data.data.rows.flatMap((row: any) =>
          row.mapelKelas.map((k: any) => ({
            id: k.kelasId,
            tenantId: String(row.sekolahId),
            jenjang: row.jenjang || 'SMA',
            level: k.kelas.level,
            namaKelas: k.kelas.namaKelas,
          }))
        );

        setMapelData(apiData);
        setKelasOptions(kelasData);
      } catch (error) {
        console.error('Error fetching mapel data:', error);
        toast.error('Gagal mengambil data dari API. Pastikan token valid.');
      } finally {
        setLoading(false);
      }
    };

    fetchMapel();
  }, [sekolahId, token, status, kelasFilter, q, currentPage, jenjang, kurikulum]);

  console.log('mapelData', mapelData);

  const allVisibleSelected = useMemo(() => mapelData.length > 0 && mapelData.every(r => selected[r.id]), [mapelData, selected]);
  const selectedIds = useMemo(() => Object.keys(selected).filter(id => selected[id]).map(Number), [selected]);

  // Validators
  function validate(row: Partial<MapelRow>): string[] {
    const errs: string[] = [];
    const kode = (row.kode || '').toUpperCase();
    if (kode && !/^([A-Z0-9]{2,8})$/.test(kode)) errs.push('Kode 2–8 huruf/angka (A–Z/0–9)');
    if (!row.nama || String(row.nama).trim().length < 2) errs.push('Nama mapel wajib diisi');
    const j = Number(row.weeklyHours);
    if (j && (!Number.isInteger(j) || j < 1 || j > 10)) errs.push('Jam per minggu 1–10');
    if (!row.tenantId) errs.push('Tenant wajib dipilih');
    if (!row.jenjang || !Object.keys(LEVELS_MAP).includes(row.jenjang)) errs.push('Jenjang harus SD, SMP, SMA, SMK, MI, MTs, atau MA');
    const classes = (row.kelasIds || []) as number[];
    if (!classes.length) errs.push('Pilih minimal satu kelas');
    const dup = mapelData.find(m => m.tenantId === row.tenantId && m.jenjang === row.jenjang && m.kode?.toUpperCase() === kode && m.id !== row.id);
    if (dup) errs.push('Kode sudah dipakai pada jenjang ini di sekolah tersebut');
    if (row.kurikulum && !KURIKULUM_OPTIONS.includes(row.kurikulum)) errs.push('Kurikulum harus MERDEKA atau K13');
    return errs;
  }

  function openCreate() {
    if (!activeTenant || !jenjang) { toast.error('Pilih Jenjang terlebih dahulu.'); return; }
    setEditRow(null);
    const firstKelas = kelasOptions[0]?.id ? [kelasOptions[0].id] : [];
    setForm({ tenantId: activeTenant, jenjang: jenjang, kelasIds: firstKelas, kurikulum: 'MERDEKA', kelompok: 'Wajib Umum', kode: '', nama: '', weeklyHours: 2, teacher: '', note: '', status: 'Aktif', isP5: false });
    setModalJenjang(jenjang);
  }

  function openEdit(row: MapelRow) {
    console.log('openEdit row.kelompok:', row.kelompok);
    setEditRow(row);
    setForm({
      id: row.id,
      tenantId: row.tenantId,
      jenjang: row.jenjang,
      kelasIds: row.kelasIds,
      kurikulum: row.kurikulum,
      kelompok: row.kelompok,
      kode: row.kode,
      nama: row.nama,
      isP5: row.isP5,
      weeklyHours: row.weeklyHours,
      teacher: row.teacher,
      note: row.note,
      status: row.status,
    });
    setModalJenjang(row.jenjang || "");
  }

  function cancelEdit() { setEditRow(null); setForm({}); }

  async function save() {
    if (!token) {
      toast.error('Token tidak ditemukan. Silakan login kembali.');
      return;
    }

    const row = { ...form, id: form.id || 0, kode: (form.kode || '').toUpperCase(), kelasIds: (form.kelasIds || []) as number[] } as MapelRow;
    const errs = validate(row);
    if (errs.length) { toast.error('Perbaiki berikut:\n- ' + errs.join('\n- ')); return; }

    try {
      let mapelId = row.id;

      if (editRow) {
        await apiClient.put(`/mapel/${row.id}`, {
          namaMataPelajaran: row.nama,
          kode: row.kode,
          kurikulum: row.kurikulum,
          kelompok: row.kelompok ? row.kelompok.toUpperCase().replace(' ', '_') : 'WAJIB_UMUM',
          jenjang: row.jenjang,
          isP5: row.isP5,
          sekolahId: row.tenantId,
        });
      } else {
        const createResponse = await apiClient.post('/mapel', {
          namaMataPelajaran: row.nama,
          kode: row.kode,
          kurikulum: row.kurikulum,
          kelompok: row.kelompok ? row.kelompok.toUpperCase().replace(' ', '_') : 'WAJIB_UMUM',
          jenjang: row.jenjang,
          sekolahId: row.tenantId,
          isP5: row.isP5,
        });
        mapelId = createResponse.data.data.id;
      }

      await apiClient.post(`/mapel/${mapelId}/kelas`, {
        items: row.kelasIds.map(kelasId => ({
          kelasId,
          weeklyHours: row.weeklyHours || 2,
          teacherId: null,
          note: row.note || '',
        })),
      });

      // Refetch with current params
      const response = await apiClient.get('/mapel', {
        params: { 
          page: currentPage, 
          pageSize: itemsPerPage, 
          status: status === 'all' ? undefined : status, 
          search: q || undefined, 
          sekolahId, 
          kelasId: kelasFilter || undefined,
          jenjang: jenjang || undefined,
          kurikulum: kurikulum || undefined,
        },
      });
      setTotalData(response?.data?.data?.total || 0);
      const apiData = response.data.data.rows.map((row: any) => ({
        id: row.id,
        tenantId: String(row.sekolahId),
        jenjang: row.jenjang || 'SMA',
        kelasIds: row.mapelKelas.map((k: any) => k.kelasId),
        kurikulum: row.kurikulum || 'MERDEKA',
        kelompok: row.kelompok ? row.kelompok.replace('_', ' ') : 'Wajib Umum',
        kode: row.kode || '',
        nama: row.namaMataPelajaran,
        isP5: row.isP5,
        weeklyHours: row.mapelKelas[0]?.weeklyHours || 2,
        teacher: row.mapelKelas[0]?.teacher?.name || null,
        note: row.mapelKelas[0]?.note || null,
        status: row.archived ? 'Arsip' : 'Aktif',
        namaKelasAgg: row.namaKelasAgg,
      }));
      setMapelData(apiData);
      cancelEdit();
      toast.success('Mapel berhasil disimpan.');
    } catch (error) {
      console.error('Error saving mapel:', error);
      toast.error('Gagal menyimpan data. Pastikan token valid.');
    }
  }

  async function toggleArchive(row: MapelRow) {
    if (!token) {
      toast.error('Token tidak ditemukan. Silakan login kembali.');
      return;
    }

    try {
      if (row.status === 'Aktif') {
        const response = await apiClient.delete(`/mapel/${row.id}`);
        setMapelData(prev => prev.map(m => m.id === row.id ? { ...m, status: 'Arsip' } : m));
        toast.success(response.data.message || 'Mapel diarsipkan.');
      } else {
        const response = await apiClient.post(`/mapel/${row.id}/restore`);
        setMapelData(prev => prev.map(m => m.id === row.id ? { ...m, status: 'Aktif' } : m));
        toast.success(response.data.message || 'Mapel berhasil dipulihkan.');
      }
    } catch (error) {
      console.error('Error toggling archive:', error);
      toast.error('Gagal mengubah status. Pastikan token valid.');
    }
  }

  async function applyBulk() {
    if (!token) {
      toast.error('Token tidak ditemukan. Silakan login kembali.');
      return;
    }

    if (selectedIds.length === 0) { toast.error('Pilih minimal satu baris.'); return; }
    const action = prompt('Ketik "arsip" untuk arsipkan, atau "aktif" untuk aktifkan:');
    if (!action) return;

    try {
      if (action === 'arsip') {
        const responses = await Promise.all(selectedIds.map(id =>
          apiClient.delete(`/mapel/${id}`)
        ));
        setMapelData(prev => prev.map(m => {
          if (!selected[m.id]) return m;
          return { ...m, status: 'Arsip' };
        }));
        toast.success(responses[0]?.data?.message || 'Mapel diarsipkan.');
      } else if (action === 'aktif') {
        const responses = await Promise.all(selectedIds.map(id =>
          apiClient.post(`/mapel/${id}/restore`)
        ));
        setMapelData(prev => prev.map(m => {
          if (!selected[m.id]) return m;
          return { ...m, status: 'Aktif' };
        }));
        toast.success(responses[0]?.data?.message || 'Mapel berhasil dipulihkan.');
      }
      setSelected({});
    } catch (error) {
      console.error('Error applying bulk action:', error);
      toast.error('Gagal menerapkan aksi massal. Pastikan token valid.');
    }
  }

  async function deleteMapel(id: number) {
    if (!token) {
      toast.error('Token tidak ditemukan. Silakan login kembali.');
      return;
    }
    if (!confirm('Yakin ingin menghapus mapel ini secara permanen?')) return;

    try {
      const mapel = mapelData.find(m => m.id === id);
      if (!mapel) {
        toast.error('Data mapel tidak ditemukan.');
        return;
      }
      const responses = await Promise.all(
        mapel.kelasIds.map(kelasId => apiClient.delete(`/mapel/${id}/kelas/${kelasId}`))
      );
      setMapelData(prev => prev.filter(m => m.id !== id));
      setTotalData(prev => prev - 1);
      toast.success(responses[0]?.data?.message || 'Relasi kelas dihapus.');
    } catch (error) {
      console.error('Error deleting mapel:', error);
      toast.error('Gagal menghapus mapel. Pastikan token valid.');
    }
  }

  async function bulkDelete() {
    if (!token) {
      toast.error('Token tidak ditemukan. Silakan login kembali.');
      return;
    }
    if (selectedIds.length === 0) { toast.error('Pilih minimal satu baris.'); return; }
    if (!confirm(`Yakin ingin menghapus ${selectedIds.length} mapel secara permanen?`)) return;

    try {
      const responses = await Promise.all(
        selectedIds.flatMap(id => {
          const mapel = mapelData.find(m => m.id === id);
          return mapel ? mapel.kelasIds.map(kelasId => apiClient.delete(`/mapel/${id}/kelas/${kelasId}`)) : [];
        })
      );
      setMapelData(prev => prev.filter(m => !selectedIds.includes(m.id)));
      setTotalData(prev => prev - selectedIds.length);
      setSelected({});
      toast.success(responses[0]?.data?.message || 'Relasi kelas dihapus.');
    } catch (error) {
      console.error('Error bulk deleting mapel:', error);
      toast.error('Gagal menghapus mapel. Pastikan token valid.');
    }
  }

  function handleTemplate() { toast.info('Unduh template Excel → sambungkan ke endpoint template.'); }

  function handleImport() { toast.info('Unggah file Excel → sambungkan ke endpoint import.'); }

  async function handleExport() {
    if (totalData === 0) {
      toast.error('Tidak ada data untuk diekspor.');
      return;
    }

    const confirmSelected = selectedIds.length > 0 ? confirm(`Ekspor hanya ${selectedIds.length} baris terpilih? (Batal untuk ekspor semua ${totalData})`) : false;
    const exportAll = !confirmSelected || !selectedIds.length;

    setIsExporting(true);
    try {
      let exportData: MapelRow[] = [];
      if (exportAll) {
        // Fetch all filtered data
        const allResponse = await apiClient.get('/mapel', {
          params: {
            page: 1,
            pageSize: totalData,
            status: status === 'all' ? undefined : status,
            search: q || undefined,
            sekolahId,
            kelasId: kelasFilter || undefined,
            jenjang: jenjang || undefined,
            kurikulum: kurikulum || undefined,
          },
        });
        exportData = allResponse.data.data.rows.map((row: any) => ({
          id: row.id,
          tenantId: String(row.sekolahId),
          jenjang: row.jenjang || 'SMA',
          kelasIds: row.mapelKelas.map((k: any) => k.kelasId),
          kurikulum: row.kurikulum || 'MERDEKA',
          kelompok: row.kelompok ? row.kelompok.replace('_', ' ') : 'Wajib Umum',
          kode: row.kode || '',
          nama: row.namaMataPelajaran,
          isP5: row.isP5,
          weeklyHours: row.mapelKelas[0]?.weeklyHours || 2,
          teacher: row.mapelKelas[0]?.teacher?.name || null,
          note: row.mapelKelas[0]?.note || null,
          status: row.archived ? 'Arsip' : 'Aktif',
          namaKelasAgg: row.namaKelasAgg,
        }));
      } else {
        exportData = mapelData.filter(m => selectedIds.includes(m.id));
      }

      const doc = (
        <MapelPDF
          mapelData={exportData}
          schoolData={{
            name: school?.data?.[0]?.name || 'Nama Sekolah',
            kopSurat: school?.data?.[0]?.kopSurat || undefined,
            namaKepalaSekolah: school?.data?.[0]?.namaKepalaSekolah || 'Nama Kepala Sekolah',
            ttdKepalaSekolah: school?.data?.[0]?.ttdKepalaSekolah || undefined,
          }}
          jenjang={jenjang}
        />
      );

      const generatePDF = async () => {
        const pdfInstance = pdf(doc);
        const pdfBlob = await pdfInstance.toBlob();
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mapel-${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Data berhasil diekspor ke PDF.');
      };

      await generatePDF();
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error(`Gagal mengekspor data ke PDF: ${(error as Error).message}`);
    } finally {
      setIsExporting(false);
    }
  }

  // Render
  return (
    <div className="w-full min-h-screen pb-20">
      <Toaster position="top-right" />
      <style>
        {`
          select option {
            background: #F9FAFB !important;
            color: #1F2937;
          }
          select option:checked,
          select option:hover {
            background: #14B8A6 !important;
            color: #FFFFFF;
          }
          @media (prefers-color-scheme: dark) {
            select option {
              background: #1F2A44 !important;
              color: #FFFFFF;
            }
            select option:checked,
            select option:hover {
              background: #14B8A6 !important;
              color: #FFFFFF;
            }
          }
        `}
      </style>
      <div className="max-w-full mx-auto space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between w-full gap-2">
          <div className="flex items-center gap-2">
            <Button onClick={openCreate} variant="primary" disabled={!activeTenant || !jenjang || !token}><Plus size={16} /> Buat mapel baru {!activeTenant || !jenjang || !token ? "(Pilih jenjang dahulu)" : ""}</Button>
            <small className='text-white/70'></small>
            {/* <Button onClick={() => { setMapelData([]); setTotalData(0); }} variant="danger" disabled={selectedIds.length === 0}>Hapus Data</Button> */}
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleExport} variant="outline" disabled={isExporting || totalData === 0}>
              {isExporting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memproses</span>
                </div>
              ) : (
                'Ekspor PDF'
              )}
            </Button>
            <Button onClick={applyBulk} variant="outline" disabled={selectedIds.length === 0}>Terapkan Arsip/Aktif ke {selectedIds.length} baris</Button>
            <Button onClick={bulkDelete} variant="danger" disabled={selectedIds.length === 0}>Hapus {selectedIds.length} baris</Button>
          </div>
        </div>
        {/* Filters */}
        <div className="flex items-center gap-3 rounded-2xl bg-theme-color-primary/5 dark:bg-theme-color-primary/5 p-4 shadow-sm md:grid-cols-12 border border-gray-200 dark:border-gray-700 backdrop-blur-lg">
          <div className="flex-1 space-y-2 md:col-span-3">
            <label className="text-xs text-gray-600 dark:text-gray-400">Jenjang</label>
            <Select value={jenjang} onChange={(e: any) => { setJenjang(e.target.value as any); setSelected({}); setKelasFilter(''); setCurrentPage(1); }}>
              <option value="">— Pilih Jenjang —</option>
              {Object.keys(LEVELS_MAP).map(j => <option key={j} value={j}>{j}</option>)}
            </Select>
          </div>
          <div className="flex-1 space-y-2 md:col-span-3">
            <label className="text-xs text-gray-600 dark:text-gray-400">Nama Kelas</label>
            <Select value={kelasFilter} onChange={(e: any) => { setKelasFilter(e.target.value); setCurrentPage(1); }} disabled={!jenjang}>
              <option value="">Semua kelas</option>
              {kelasOptions.filter(k => k.jenjang === jenjang).map(k => <option key={k.id} value={k.id}>{k.namaKelas}</option>)}
            </Select>
          </div>
          <div className="flex-1 space-y-2 md:col-span-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">Kurikulum</label>
            <Select value={kurikulum} onChange={(e: any) => { setKurikulum(e.target.value as typeof KURIKULUM_OPTIONS[number]); setCurrentPage(1); }}>
              <option value="">Semua</option>
              {KURIKULUM_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
            </Select>
          </div>
          <div className="flex-1 space-y-2 md:col-span-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">Status</label>
            <Select value={status} onChange={(e: any) => { setStatus(e.target.value as typeof STATUS_OPTIONS[number]); setCurrentPage(1); }}>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'Semua' : s === 'active' ? 'Aktif' : 'Arsip'}</option>
              ))}
            </Select>
          </div>
          <div className="flex-1 flex flex-col gap-2 items-start w-full">
            <label className="text-xs text-gray-600 dark:text-gray-400">Cari</label>
            <Input value={q} onChange={(e: any) => { setQ(e.target.value); setCurrentPage(1); }} placeholder="Cari nama/kode/pengampu" />
          </div>
        </div>
        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-theme-color-primary/5 dark:bg-theme-color-primary/5 shadow-sm border border-gray-200 dark:border-gray-700 backdrop-blur-lg">
          <div className="overflow-auto">
            <table className="w-full min-w-[900px] table-auto border-collapse">
              <thead className="sticky top-0 z-10 dark:bg-theme-color-black/5">
                <tr className="border-b border-white/20 text-left text-xs py-12 tracking-wider text-gray-600 dark:text-gray-400">
                  <th className="px-4 py-4"><input type="checkbox" checked={allVisibleSelected} onChange={(e) => { const checked = e.target.checked; const next: Record<string, boolean> = { ...selected }; mapelData.forEach(r => { next[r.id] = checked; }); setSelected(next); }} /></th>
                  <th className="px-4 py-4">Mata Pelajaran</th>
                  <th className="px-4 py-4">Sekolah</th>
                  <th className="px-4 py-4">Nama Kelas</th>
                  <th className="px-4 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                {loading && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-600 dark:text-gray-400">Memuat data...</td></tr>
                )}
                {!loading && mapelData.map(m => {
                  const kelasNames = listKelasNames(m.kelasIds, kelasOptions);
                  const preview = kelasNames.slice(0, 2).join(', ');
                  const extra = kelasNames.length > 2 ? ` +${kelasNames.length - 2} lainnya` : '';
                  return (
                    <tr key={m.id} className="hover:bg-gray-100 dark:hover:bg-gray-600/50">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={!!selected[m.id]}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelected(s => ({ ...s, [m.id]: checked }));
                          }}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="font-medium text-gray-800 dark:text-white">{m.nama}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{m.kode || '—'} • {m.kurikulum || '—'}</div>
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-white">{school?.data?.[0]?.name || '—'}</td>
                      <td className="px-4 py-2 text-gray-800 dark:text-white">{preview}{extra}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="subtle" className="px-2 py-1 text-xs" onClick={() => setDetailRow(m)}>Detail</Button>
                          <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => openEdit(m)}>Edit</Button>
                          <Button variant="outline" className="px-2 py-1 text-xs" onClick={() => toggleArchive(m)}>{m.status === 'Aktif' ? 'Arsipkan' : 'Aktifkan'}</Button>
                          <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => deleteMapel(m.id)}>Hapus</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && mapelData.length === 0 && totalData === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-600 dark:text-gray-400">Belum ada data. Pilih Jenjang, lalu klik "Buat mapel".</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {!loading && totalData > 0 && (
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan {((currentPage - 1) * itemsPerPage + 1)}–{Math.min(currentPage * itemsPerPage, totalData)} dari {totalData} data
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                Pertama
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <ArrowLeft size={16} />
              </Button>
              <div className="text-sm text-gray-800 dark:text-white font-medium">
                Halaman {currentPage} dari {totalPages}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <ArrowRight size={16} />
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                Terakhir
              </Button>
            </div>
          </div>
          )}
        </div>
        {/* Modal: Detail */}
        {detailRow && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
            onClick={() => setDetailRow(null)}
          >
            <div className="w-full max-w-xl rounded-2xl bg-white/90 dark:bg-gray-800/90 p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Detail Mapel</h2>
                <Button variant="ghost" onClick={() => setDetailRow(null)}>Tutup</Button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-xs text-gray-600 dark:text-gray-400">Kode</div><div className="font-mono text-gray-800 dark:text-white">{detailRow.kode || '—'}</div></div>
                <div><div className="text-xs text-gray-600 dark:text-gray-400">Nama</div><div className="font-medium text-gray-800 dark:text-white">{detailRow.nama}</div></div>
                <div><div className="text-xs text-gray-600 dark:text-gray-400">Kurikulum</div><div className="text-gray-800 dark:text-white">{detailRow.kurikulum || '—'}</div></div>
                <div><div className="text-xs text-gray-600 dark:text-gray-400">Kelompok</div><div className="text-gray-800 dark:text-white">{detailRow.kelompok || '—'}</div></div>
                <div><div className="text-xs text-gray-600 dark:text-gray-400">Jam/Minggu</div><div className="text-gray-800 dark:text-white">{detailRow.weeklyHours || '—'}</div></div>
                <div><div className="text-xs text-gray-600 dark:text-gray-400">Pengampu</div><div className="text-gray-800 dark:text-white">{detailRow.teacher || '—'}</div></div>
                <div><div className="text-xs text-gray-600 dark:text-gray-400">Sekolah</div><div className="text-gray-800 dark:text-white">{school?.data?.[0]?.name || '—'}</div></div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Kelas</div>
                  <div className="flex flex-wrap gap-2">
                    {detailRow.kelasIds.map(id => (
                      <span key={id} className="rounded-full dark:bg-theme-color-black/5 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-white">{kelasNameById(id, kelasOptions)}</span>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Catatan</div>
                  <div className="whitespace-pre-wrap text-gray-800 dark:text-white">{detailRow.note || '—'}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* Modal JSX */}
        {(editRow !== null || (form && form.tenantId)) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
            onClick={cancelEdit}
          >
            <div className="w-full max-w-2xl rounded-2xl bg-white/90 dark:bg-gray-800/90 p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">{editRow ? 'Edit Mapel' : 'Tambah Mapel'}</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Pilih <b>beberapa kelas</b> untuk menautkan mapel ini.</p>
                </div>
                <Button variant="ghost" onClick={cancelEdit}>Tutup</Button>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="w-full space-y-2 md:col-span-1">
                  <label className="text-xs text-gray-600 dark:text-gray-400">Jenjang</label>
                  <Select
                    value={modalJenjang}
                    onChange={(e: any) => setModalJenjang(e.target.value as keyof typeof LEVELS_MAP | "")}
                  >
                    <option value="">— Pilih Jenjang —</option>
                    {Object.keys(LEVELS_MAP).map(j => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </Select>
                </div>
                <div className="w-full space-y-2 md:col-span-1">
                  <label className="text-xs text-gray-600 dark:text-gray-400">Kelas (boleh lebih dari satu)</label>
                  <div className="max-h-44 overflow-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 p-2">
                    {kelasOptions.length === 0 && <div className="p-2 text-xs text-gray-600 dark:text-gray-400">Tidak ada kelas untuk tenant/jenjang ini.</div>}
                    {kelasOptions.filter(k => !modalJenjang || k.jenjang === modalJenjang).map(k => {
                      const checked = (form.kelasIds as number[] | undefined)?.includes(k.id) || false;
                      return (
                        <label key={k.id} className="flex cursor-pointer select-none items-center gap-2 rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-600">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const on = e.target.checked;
                              setForm(s => {
                                const curr = (s.kelasIds as number[] | undefined) || [];
                                const next = on ? Array.from(new Set([...curr, k.id])) : curr.filter(x => x !== k.id);
                                return { ...s, kelasIds: next };
                              });
                            }}
                          />
                          <span className="text-sm text-gray-800 dark:text-white">{k.namaKelas}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-full space-y-2 md:col-span-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Kode</label>
                    <Input value={form.kode || ''} onChange={(e: any) => setForm(s => ({ ...s, kode: e.target.value.toUpperCase() }))} placeholder="BIN / MTK / BIO" />
                  </div>
                  <div className="w-full space-y-2 md:col-span-4">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Nama Mapel</label>
                    <Input value={form.nama || ''} onChange={(e: any) => setForm(s => ({ ...s, nama: e.target.value }))} placeholder="Bahasa Indonesia / Biologi" />
                  </div>
                  <div className="w-full space-y-2 md:col-span-4">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Kurikulum</label>
                    <Select value={form.kurikulum || 'MERDEKA'} onChange={(e: any) => setForm(s => ({ ...s, kurikulum: e.target.value as typeof KURIKULUM_OPTIONS[number] }))}>
                      {KURIKULUM_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                    </Select>
                  </div>
                </div>
                <div className="w-full gap-4 flex items-center">
                  <div className="w-full space-y-2 md:col-span-4">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Kelompok</label>
                    <Select value={form.kelompok || ''} onChange={(e: any) => setForm(s => ({ ...s, kelompok: e.target.value as typeof KELOMPOK_OPTIONS[number] }))}>
                      <option value="">— Pilih Kelompok —</option>
                      {KELOMPOK_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                    </Select>
                  </div>
                  <div className="w-full space-y-2 md:col-span-4 flex flex-col">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Jam per Minggu</label>
                    <Input type="number" min={1} max={10} value={form.weeklyHours ?? ''} onChange={(e: any) => setForm(s => ({ ...s, weeklyHours: e.target.value === '' ? undefined : Number(e.target.value) }))} />
                  </div>
                </div>
                <div className="w-full flex space-y-2 flex-col">
                  <div className="w-full space-y-2 md:col-span-6">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Catatan</label>
                    <Textarea rows={2} value={form.note || ''} onChange={(e: any) => setForm(s => ({ ...s, note: e.target.value }))} placeholder="Catatan (opsional)" />
                  </div>
                  <div className="w-full space-y-2 md:col-span-6">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Pengampu</label>
                    <Input className='w-full' value={form.teacher || ''} onChange={(e: any) => setForm(s => ({ ...s, teacher: e.target.value }))} placeholder="Nama Guru (opsional)" />
                  </div>
                </div>
                <div className="md:col-span-12 flex items-center justify-end gap-2">
                  <Button variant="ghost" onClick={cancelEdit}>Batal</Button>
                  <Button variant="primary" onClick={save}>Simpan</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};