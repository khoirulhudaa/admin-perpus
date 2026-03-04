import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  dayjs,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { useSchool } from "@/features/schools";
import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
import { motion } from "framer-motion";
import { Download, Loader2, PlusCircle, Search as SearchIcon } from "lucide-react"; // Added Undo2 icon for restore
import { useEffect, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import * as XLSX from "xlsx";

// ---------- Data & Helpers ----------
const LEVELS_MAP: Record<string, string[]> = {
  SD: ["I", "II", "III", "IV", "V", "VI"],
  SMP: ["VII", "VIII", "IX"],
  SMA: ["X", "XI", "XII"],
  SMK: ["X", "XI", "XII"],
  MI: ["I", "II", "III", "IV", "V", "VI"],
  MTs: ["VII", "VIII", "IX"],
  MA: ["X", "XI", "XII"],
};

interface Jurusan {
  id: number;
  kode: string;
  nama: string;
  sekolahId: number;
}

interface KelasRow {
  id: string;
  tenantId: string;
  sekolah?: string;
  jenjang: string;
  level: string;
  namaKelas: string;
  kode?: string;
  jurusan?: string;
  jurusanId?: number;
  peminatan?: string;
  wali?: string;
  nipWali?: string;
  kapasitas?: number;
  shift?: string;
  status: "Aktif" | "Arsip";
  siswaCount?: number;
}

const JURUSAN_MAP: Record<string, number> = {};
const DEFAULT_PEMINATAN_SMA_MA = ["IPA", "IPS", "Bahasa", "Keagamaan"];
const SHIFT_OPTIONS = ["Pagi", "Siang", "Sore"];

function clsx(...a: any[]) {
  return a.filter(Boolean).join(" ");
}

function makeLabel(index: number, scheme: "letter" | "number"): string {
  return scheme === "letter" ? String.fromCharCode(65 + index) : String(index + 1);
}

function formatNamaKelas({
  level,
  label,
  jurusan,
  peminatan,
}: {
  level: string;
  label: string;
  jurusan?: string;
  peminatan?: string;
}) {
  let base = `${level}-${label}`;
  if (jurusan && peminatan) {
    base = `${level}-${jurusan}-${peminatan} ${label}`;
  } else if (jurusan) {
    base = `${level}-${jurusan} ${label}`;
  } else if (peminatan) {
    base = `${level}-${peminatan} ${label}`;
  }
  return base.replace(/\s+/g, " ").replace(/-\s+/g, "-").trim();
}

function isValidCapacity(v: any) {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 60;
}

function isValidNIP(v?: string) {
  if (!v) return true;
  return /^\d{18}$/.test(v);
}

function validateRow(row: KelasRow) {
  const errors: string[] = [];
  if (!isValidCapacity(row.kapasitas)) errors.push("Kapasitas harus 1–60");
  if (row.wali && !row.nipWali) errors.push("NIP Wali kosong");
  if (!isValidNIP(row.nipWali)) errors.push("NIP Wali harus 18 digit");
  return errors;
}

// PDF Styles (unchanged)
const pdfStyles = StyleSheet.create({
  page: {
    fontSize: 12,
    fontFamily: "Times-Roman",
  },
  header: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
  },
  headerImage: {
    width: 595,
    maxHeight: 150,
    objectFit: "contain",
  },
  contentWrapper: {
    paddingLeft: 32,
    paddingRight: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  content: {
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 1.5,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    fontSize: 10,
    borderRightColor: "#000",
    textAlign: "center",
  },
  tableHeader: {
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  signature: {
    marginTop: 50,
    alignItems: "flex-end",
  },
  signatureImage: {
    width: 120,
    height: "auto",
    maxHeight: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  signatureText: {
    textAlign: "center",
  },
});

// PDF Component for Classroom Data (unchanged)
const ClassroomPDF = ({ classroomData, schoolData }) => {
  const kopSuratUrl = schoolData.kopSurat
    ? schoolData.kopSurat.startsWith("data:image")
      ? schoolData.kopSurat
      : `data:image/png;base64,${schoolData.kopSurat}`
    : "";
  const signatureUrl = schoolData.ttdKepalaSekolah
    ? schoolData.ttdKepalaSekolah.startsWith("data:image")
      ? schoolData.ttdKepalaSekolah
      : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
    : "";
  const rowsPerPage = 20;
  const dataChunks = [];
  for (let i = 0; i < classroomData.length; i += rowsPerPage) {
    const chunk = classroomData.slice(i, i + rowsPerPage);
    if (chunk.length > 0) {
      dataChunks.push(chunk);
    }
  }
  const headers = [
    "No",
    "Nama Kelas",
    "Level",
    ...(schoolData.showJurusan ? ["Jurusan"] : []),
    ...(schoolData.showPeminatan ? ["Peminatan"] : []),
    "Kapasitas",
    "Siswa",
    "Status",
  ];
  const columnWidths = [
    "10%", // No
    "25%", // Nama Kelas
    "20%", // Level
    ...(schoolData.showJurusan ? ["20%"] : []), // Jurusan
    ...(schoolData.showPeminatan ? ["20%"] : []), // Peminatan
    "20%", // Kapasitas
    "20%", // Siswa
    "20%", // Status
  ];
  return (
    <Document>
      {dataChunks.map((chunk, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={pdfStyles.page}
          break={pageIndex > 0}
        >
          <View style={pdfStyles.header} fixed>
            {kopSuratUrl && (
              <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
            )}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Daftar Kelas</Text>
            <Text style={pdfStyles.content}>
              {schoolData?.namaSekolah || "Nama Sekolah"}
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {headers.map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      { width: columnWidths[index] },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => (
                <View style={pdfStyles.tableRow} key={`${pageIndex}_${index}`} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[0] }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[1] }]}>
                    <Text>{item.namaKelas || "—"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[2] }]}>
                    <Text>{item.level || "—"}</Text>
                  </View>
                  {schoolData.showJurusan && (
                    <View style={[pdfStyles.tableCell, { width: columnWidths[3] }]}>
                      <Text>{item.jurusan || "—"}</Text>
                    </View>
                  )}
                  {schoolData.showPeminatan && (
                    <View style={[pdfStyles.tableCell, { width: columnWidths[schoolData.showJurusan ? 4 : 3] }]}>
                      <Text>{item.peminatan || "—"}</Text>
                    </View>
                  )}
                  <View style={[pdfStyles.tableCell, { width: columnWidths[schoolData.showJurusan && schoolData.showPeminatan ? 5 : schoolData.showJurusan || schoolData.showPeminatan ? 4 : 3] }]}>
                    <Text>{item.kapasitas ?? "—"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[schoolData.showJurusan && schoolData.showPeminatan ? 6 : schoolData.showJurusan || schoolData.showPeminatan ? 5 : 4] }]}>
                    <Text>{item.siswaCount ?? "0"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: columnWidths[schoolData.showJurusan && schoolData.showPeminatan ? 7 : schoolData.showJurusan || schoolData.showPeminatan ? 6 : 5] }]}>
                    <Text>{item.status}</Text>
                  </View>
                </View>
              ))}
            </View>
            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles.signature}>
                <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                {signatureUrl && (
                  <Image src={signatureUrl} style={pdfStyles.signatureImage} />
                )}
                <Text style={pdfStyles.signatureText}>
                  {schoolData.namaKepalaSekolah || "Nama Kepala Sekolah"}
                </Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

// ---------- Main Component ----------
export const ClassroomTable = () => {
  const school = useSchool();
  const [activeTenant, setActiveTenant] = useState<string>('ALL');
  const [jenjang, setJenjang] = useState<string>('SMA');
  const [madrasahType, setMadrasahType] = useState<string>('MI');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [query, setQuery] = useState<string>('');
  const [data, setData] = useState<KelasRow[]>([]);
  const [showSekolahCol, setShowSekolahCol] = useState(true);
  const [showJurusanCol, setShowJurusanCol] = useState(true);
  const [showPeminatanCol, setShowPeminatanCol] = useState(true);
  const [openGen, setOpenGen] = useState(false);
  const [openJurusanDialog, setOpenJurusanDialog] = useState(false);
  const [openEditKelasDialog, setOpenEditKelasDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [peminatanOptions, setPeminatanOptions] = useState<string[]>([...DEFAULT_PEMINATAN_SMA_MA]);
  const [genParallel, setGenParallel] = useState<Record<string, number>>({});
  const [genPeminatanList, setGenPeminatanList] = useState<string[]>([...DEFAULT_PEMINATAN_SMA_MA]);
  const [namingSchemeMap, setNamingSchemeMap] = useState<Record<string, string>>({
    SD: 'letter',
    SMP: 'letter',
    SMA: 'letter',
    SMK: 'letter',
    Madrasah: 'letter',
  });
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [bulkAction, setBulkAction] = useState<string>("");
  const [bulkWali, setBulkWali] = useState<string>("");
  const [bulkNIP, setBulkNIP] = useState<string>("");
  const [bulkShift, setBulkShift] = useState<string>("Pagi");
  const [newJurusan, setNewJurusan] = useState({ kode: "", nama: "" });
  const [editingJurusan, setEditingJurusan] = useState<Jurusan | null>(null);
  const [editingKelas, setEditingKelas] = useState<KelasRow | null>(null);
  const [validationIssues, setValidationIssues] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const schoolDetail = useSchool()
  console.log('schoolDetail noew', schoolDetail)

  // API base URL
  const API_BASE_URL = "https://dev.kiraproject.id/api";
  const effectiveJenjang = jenjang === "Madrasah" ? madrasahType : jenjang;

  // Fetch peminatan options
  useEffect(() => {
    async function fetchPeminatanOptions() {
      try {
        const response = await fetch(`${API_BASE_URL}/kelas/options/peminatan`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch peminatan options");
        const result = await response.json();
        setPeminatanOptions(result.data || DEFAULT_PEMINATAN_SMA_MA);
        setGenPeminatanList(result.data || DEFAULT_PEMINATAN_SMA_MA);
      } catch (error) {
        console.error("Error fetching peminatan options:", error);
        toast.error("Gagal memuat opsi peminatan");
      }
    }
    fetchPeminatanOptions();
  }, []);

  // Fetch jurusan list
  useEffect(() => {
    async function fetchJurusan() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/jurusan?sekolahId=${activeTenant !== "ALL" ? activeTenant : ""}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch jurusan");
        const result = await response.json();
        setJurusanList(result.data?.items || []);
        result.data.items?.forEach((j: Jurusan) => {
          JURUSAN_MAP[j.kode] = j.id;
        });
      } catch (error) {
        console.error("Error fetching jurusan:", error);
        toast.error("Gagal memuat daftar jurusan");
      }
    }
    if (jenjang === "SMK" && activeTenant !== "ALL") {
      fetchJurusan();
    }
  }, [activeTenant, jenjang]);

  // Fetch kelas
  useEffect(() => {
    async function fetchKelas() {
      try {
        const params = new URLSearchParams({
          include: "all",
          page: String(currentPage),
          sekolahId: schoolDetail?.data?.[0].id.toString(),
          search: query,
        });
        console.log('Fetch URL:', `${API_BASE_URL}/kelas?sekolahId=55)`);
        const response = await fetch(`${API_BASE_URL}/kelas?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch kelas");
        const result = await response.json();
        console.log('API response:', result);
        const kelasData = result.data.map((item: any) => ({
          id: String(item.id),
          tenantId: String(item.sekolahId),
          sekolah: item.Sekolah?.namaSekolah || "—",
          jenjang: item.Sekolah?.jenjang || effectiveJenjang,
          level: item.level,
          namaKelas: item.namaKelas,
          kode: item.kodeKelas || undefined,
          jurusan: item.Jurusan?.kode || undefined,
          jurusanId: item.jurusanId || undefined,
          peminatan: item.peminatan || undefined,
          wali: item.Wali?.nama || undefined,
          nipWali: item.Wali?.nip || undefined,
          kapasitas: item.Kapasitas || undefined,
          shift: item.shift || undefined,
          status: item.deleteAt ? "Arsip" : "Aktif",
          siswaCount: item.user?.biodataSiswa.length || 0,
        }));
        console.log('Mapped kelasData:', kelasData);
        setData(kelasData);
        setTotalPages(result.meta?.totalPages || 1);
        setTotalItems(result.meta?.total || 0);
      } catch (error) {
        console.error("Error fetching kelas:", error);
        toast.error("Gagal memuat daftar kelas");
      }
    }
    fetchKelas();
  }, [activeTenant, effectiveJenjang, levelFilter, statusFilter, query, currentPage, pageSize]);

  // Pagination Controls
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-4 gap-4">
      <div className="flex items-center gap-2">
        <Label className="text-gray-800 dark:text-white">Tampilkan per halaman</Label>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            setPageSize(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-20 border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="border-gray-300 dark:border-white/30 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Sebelumnya
        </Button>
        <span className="text-sm text-gray-800 dark:text-white">
          Halaman {currentPage} dari {totalPages} ({totalItems} kelas)
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="border-gray-300 dark:border-white/30 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );

  // Validate kelas
  useEffect(() => {
    async function validateKelas() {
      if (activeTenant === "ALL") return;
      try {
        const response = await fetch(`${API_BASE_URL}/kelas?sekolahId=${activeTenant}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to validate kelas");
        const result = await response.json();
        console.log('result', result)
        setValidationIssues(result.data || []);
      } catch (error) {
        console.error("Error validating kelas:", error);
        toast.error("Gagal memvalidasi kelas");
      }
    }
    validateKelas();
  }, [activeTenant]);

  // Dynamically generate tenants
  const tenants = useMemo(() => {
    if (school?.data?.[0]?.id && school?.data?.[0]?.namaSekolah) {
      return [{ id: school.data[0].id, name: school.data[0].namaSekolah }];
    }
    return [];
  }, [school]);

  const currentTenantName = useMemo(
    () => (activeTenant === "ALL" ? "—" : tenants.find((t) => t.id === activeTenant)?.name || "—"),
    [activeTenant, tenants]
  );

  // Computed values
  const levelOptions = LEVELS_MAP[effectiveJenjang] || [];
  const showJurusan = jenjang === 'SMK' && showJurusanCol;
  const showPeminatan = ['SMA', 'MA'].includes(effectiveJenjang) && showPeminatanCol;
  const effectiveShowSekolahCol = activeTenant === 'ALL' && showSekolahCol;
  const namingScheme = namingSchemeMap[effectiveJenjang] || 'letter';

  // Filter logic
  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (jenjang !== 'Madrasah') {
        if (row.jenjang !== jenjang) {
          return false;
        }
      } else {
        const madrasahMapping: Record<string, string> = {
          MI: 'SD',
          MTs: 'SMP',
          MA: 'SMA',
        };
        if (row.jenjang !== madrasahMapping[madrasahType]) {
          return false;
        }
      }
      if (levelFilter !== 'ALL' && row.level !== levelFilter) {
        return false;
      }
      if (statusFilter !== 'ALL' && row.status !== statusFilter) {
        return false;
      }
      if (query) {
        const searchLower = query.toLowerCase();
        const matchesQuery =
          row.namaKelas?.toLowerCase().includes(searchLower) ||
          row.sekolah?.toLowerCase().includes(searchLower) ||
          (row.jurusan && row.jurusan.toLowerCase().includes(searchLower)) ||
          (row.peminatan && row.peminatan.toLowerCase().includes(searchLower));
        if (!matchesQuery) {
          return false;
        }
      }
      return true;
    });
  }, [data, activeTenant, jenjang, madrasahType, levelFilter, statusFilter, query]);

  const allVisibleSelected = useMemo(
    () => filtered.length > 0 && filtered.every((r) => selected[r.id]),
    [filtered, selected]
  );

  const selectedIds = useMemo(() => Object.keys(selected).filter((id) => selected[id]), [selected]);

  // Restore kelas
  async function restoreKelas(id: string) {
    if (!window.confirm("Apakah Anda yakin ingin memulihkan kelas ini?")) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/kelas/${id}/restore`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to restore kelas");
      setData((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, status: "Aktif" } : row
        )
      );
      toast.success("Kelas berhasil dipulihkan");
    } catch (error) {
      console.error("Error restoring kelas:", error);
      toast.error("Gagal memulihkan kelas");
    }
  }

  // Import handler
  async function handleImport(file: File) {
    if (!file) {
      console.error("No file provided for import");
      return;
    }
    if (!school?.data?.[0]?.id) {
      toast.error("Pilih sekolah (tenant) dulu untuk mengunggah Excel.");
      console.error("No school ID found. school?.data?.[0]?.id is undefined");
      return;
    }
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target?.result) {
          console.error("FileReader failed to read file");
          toast.error("Gagal membaca file Excel");
          setLoading(false);
          return;
        }
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          console.error("No sheets found in Excel file");
          toast.error("File Excel tidak memiliki sheet");
          setLoading(false);
          return;
        }
        const worksheet = workbook.Sheets[sheetName];
        const excelData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
        if (excelData.length < 2) {
          console.error("Excel file has no data rows");
          toast.error("File Excel tidak memiliki data yang valid");
          setLoading(false);
          return;
        }
        const header = excelData[0];
        const expectedHeaders = ["Level", "Jumlah Rombel", ...(showJurusan || showPeminatan ? ["Jurusan/Peminatan"] : [])];
        if (!header || header.length < 2 || header[0] !== "Level" || header[1] !== "Jumlah Rombel") {
          console.error("Invalid Excel header:", header);
          toast.error("Header Excel tidak sesuai. Harus: " + expectedHeaders.join(", "));
          setLoading(false);
          return;
        }
        const newRows: KelasRow[] = [];
        let insertedCount = 0;
        let skippedCount = 0;
        const apiUrl = `${API_BASE_URL}/kelas-v2/generate-rombel`;
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          toast.error("Token autentikasi tidak ditemukan. Silakan login ulang.");
          setLoading(false);
          return;
        }
        for (let i = 1; i < excelData.length; i++) {
          const row = excelData[i];
          if (!row || row.length < 2) {
            console.warn(`Skipping empty row ${i + 1}`);
            skippedCount++;
            continue;
          }
          const level = row[0]?.trim();
          const jumlahRombel = Number(row[1]?.trim());
          const extra = row[2]?.trim();
          const errors: string[] = [];
          if (!level || !levelOptions.includes(level)) {
            errors.push(`Level "${level}" tidak valid. Harus salah satu dari: ${levelOptions.join(", ")}`);
          }
          if (!Number.isInteger(jumlahRombel) || jumlahRombel < 1) {
            errors.push(`Jumlah Rombel "${row[1]}" tidak valid. Harus bilangan bulat positif`);
          }
          if (showJurusan && extra && !JURUSAN_MAP[extra]) {
            errors.push(`Jurusan "${extra}" tidak ditemukan di JURUSAN_MAP`);
          }
          if (showPeminatan && !extra) {
            errors.push("Peminatan wajib untuk jenjang ini");
          }
          if (errors.length > 0) {
            console.error(`Validation errors for row ${i + 1}:`, errors);
            toast.error(`Baris ${i + 1}: ${errors.join(", ")}`);
            skippedCount++;
            continue;
          }
          let totalInsertedForRow = 0;
          let totalSkippedForRow = 0;
          if (effectiveJenjang === "SMK") {
            const jurusanId = JURUSAN_MAP[extra];
            const payload = {
              sekolahId: school?.data?.[0]?.id,
              level,
              jumlahRombel,
              jurusanId,
            };
            console.log(`Payload for row ${i + 1} (SMK):`, payload);
            try {
              const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
              });
              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to generate rombel: ${response.status} ${response.statusText} - ${errorText}`);
              }
              const result = await response.json();
              console.log(`API response for row ${i + 1}:`, result);
              totalInsertedForRow += result.inserted || 0;
              totalSkippedForRow += result.skipped || 0;
              for (let j = 0; j < jumlahRombel; j++) {
                const label = makeLabel(j, namingScheme);
                newRows.push({
                  id: `${Date.now()}-${level}-${extra}-${j}`,
                  tenantId: school?.data?.[0]?.id,
                  sekolah: currentTenantName,
                  jenjang: effectiveJenjang,
                  level,
                  namaKelas: formatNamaKelas({ level, label, jurusan: extra }),
                  jurusan: extra,
                  jurusanId,
                  status: "Aktif",
                  Kapasitas: 36,
                  shift: "Pagi",
                  siswaCount: 0,
                });
              }
            } catch (error) {
              console.error(`Error importing row ${i + 1}:`, error);
              console.log(`Failed Payload for row ${i + 1} (SMK):`, payload);
              toast.error(`Gagal mengimpor baris ${i + 1}: ${(error as Error).message}`);
              skippedCount++;
              continue;
            }
          } else if (["SMA", "MA"].includes(effectiveJenjang)) {
            const peminatan = extra;
            const payload = {
              sekolahId: school?.data?.[0]?.id,
              level,
              jumlahRombel,
              peminatan,
            };
            console.log(`Payload for row ${i + 1} (SMA/MA):`, payload);
            try {
              const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
              });
              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to generate rombel: ${response.status} ${response.statusText} - ${errorText}`);
              }
              const result = await response.json();
              console.log(`API response for row ${i + 1}:`, result);
              totalInsertedForRow += result.inserted || 0;
              totalSkippedForRow += result.skipped || 0;
              for (let j = 0; j < jumlahRombel; j++) {
                const label = makeLabel(j, namingScheme);
                newRows.push({
                  id: `${Date.now()}-${level}-${peminatan}-${j}`,
                  tenantId: school?.data?.[0]?.id,
                  sekolah: currentTenantName,
                  jenjang: effectiveJenjang,
                  level,
                  namaKelas: formatNamaKelas({ level, label, peminatan }),
                  peminatan,
                  status: "Aktif",
                  Kapasitas: 36,
                  shift: "Pagi",
                  siswaCount: 0,
                });
              }
            } catch (error) {
              console.error(`Error importing row ${i + 1}:`, error);
              console.log(`Failed Payload for row ${i + 1} (SMA/MA):`, payload);
              toast.error(`Gagal mengimpor baris ${i + 1}: ${(error as Error).message}`);
              skippedCount++;
              continue;
            }
          } else {
            const payload = {
              sekolahId: school?.data?.[0]?.id,
              level,
              jumlahRombel,
            };
            console.log(`Payload for row ${i + 1} (SD/SMP):`, payload);
            try {
              const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
              });
              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to generate rombel: ${response.status} ${response.statusText} - ${errorText}`);
              }
              const result = await response.json();
              console.log(`API response for row ${i + 1}:`, result);
              totalInsertedForRow += result.inserted || 0;
              totalSkippedForRow += result.skipped || 0;
              for (let j = 0; j < jumlahRombel; j++) {
                const label = makeLabel(j, namingScheme);
                newRows.push({
                  id: `${Date.now()}-${level}-${j}`,
                  tenantId: school?.data?.[0]?.id,
                  sekolah: currentTenantName,
                  jenjang: effectiveJenjang,
                  level,
                  namaKelas: formatNamaKelas({ level, label }),
                  status: "Aktif",
                  Kapasitas: 36,
                  shift: "Pagi",
                  siswaCount: 0,
                });
              }
            } catch (error) {
              console.error(`Error importing row ${i + 1}:`, error);
              console.log(`Failed Payload for row ${i + 1} (SD/SMP):`, payload);
              toast.error(`Gagal mengimpor baris ${i + 1}: ${(error as Error).message}`);
              skippedCount++;
              continue;
            }
          }
          insertedCount += totalInsertedForRow;
          skippedCount += totalSkippedForRow;
        }
        if (newRows.length > 0) {
          setData((prev) => [...newRows, ...prev]);
        }
        toast.success(`Import selesai: ${insertedCount} kelas ditambahkan, ${skippedCount} dilewati`);
        setOpenImportDialog(false);
        setLoading(false);
      };
      reader.onerror = () => {
        console.error("FileReader error occurred");
        toast.error("Gagal membaca file Excel");
        setLoading(false);
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("Error during import:", error);
      toast.error("Gagal mengimpor file Excel");
      setLoading(false);
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const schoolData = useSchool();

  // Download Excel template
  async function handleDownloadTemplate() {
    try {
      const headers = [
        "Level",
        "Jumlah Rombel",
        ...(showJurusan ? ["Jurusan"] : []),
        ...(showPeminatan ? ["Peminatan"] : []),
      ];
      const sampleData = [
        [
          levelOptions[0] || "X",
          3,
          ...(showJurusan ? ["TKJ"] : []),
          ...(showPeminatan ? ["IPA"] : []),
        ],
      ];
      const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template Kelas");
      XLSX.writeFile(wb, `template_kelas_${effectiveJenjang}_${dayjs().format("YYYYMMDD")}.xlsx`);
      toast.success("Template Excel berhasil diunduh");
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Gagal mengunduh template Excel");
    }
  }

  // Export handler
  async function handleExport() {
    if (filtered.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }
    setLoading(true);
    try {
      let allData: KelasRow[] = [];
      let currentPage = 1;
      let totalPages = 1;
      while (currentPage <= totalPages) {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: "10",
          sekolahId: activeTenant !== "ALL" ? activeTenant : "",
          jenjang: effectiveJenjang,
          withSekolah: "true",
          withJurusan: "true",
          withSiswaCount: "true",
          level: levelFilter !== "ALL" ? levelFilter : "",
          status: statusFilter !== "ALL" ? (statusFilter === "Aktif" ? "active" : "archived") : "",
          search: query,
        });
        const response = await fetch(`${API_BASE_URL}/kelas?${params}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error(`Failed to fetch kelas data for page ${currentPage}`);
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch data");
        const pageData = result.data.map((item: any) => ({
          id: String(item.id),
          tenantId: String(item.sekolahId),
          sekolah: item.Sekolah?.namaSekolah || "—",
          jenjang: item.Sekolah?.jenjang || effectiveJenjang,
          level: item.level,
          namaKelas: item.namaKelas,
          kode: item.kodeKelas || undefined,
          jurusan: item.Jurusan?.kode || undefined,
          jurusanId: item.jurusanId || undefined,
          peminatan: item.peminatan || undefined,
          wali: item.Wali?.nama || undefined,
          nipWali: item.Wali?.nip || undefined,
          kapasitas: item.kapasitas || undefined,
          shift: item.shift || undefined,
          status: item.deleteAt ? "Arsip" : "Aktif",
          siswaCount: item.biodataSiswa?.length || 0,
        }));
        allData = [...allData, ...pageData];
        if (currentPage === 1) {
          totalPages = result.meta?.totalPages || 1;
        }
        currentPage++;
      }
      if (allData.length === 0) {
        toast.error("Tidak ada data untuk diekspor");
        return;
      }
      if (!schoolData.data?.[0] || !schoolData.data[0].namaSekolah) {
        toast.error("Data sekolah tidak lengkap.");
        return;
      }
      const doc = (
        <ClassroomPDF
          classroomData={allData}
          schoolData={{
            namaSekolah: schoolData.data[0].namaSekolah || "Nama Sekolah",
            kopSurat: schoolData.data[0].kopSurat || undefined,
            namaKepalaSekolah: schoolData.data[0].namaKepalaSekolah || "Nama Kepala Sekolah",
            ttdKepalaSekolah: schoolData.data[0].ttdKepalaSekolah || undefined,
            showJurusan,
            showPeminatan,
            effectiveShowSekolahCol,
          }}
        />
      );
      const pdfInstance = pdf(doc);
      const pdfBlob = await pdfInstance.toBlob();
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `daftar_kelas_${dayjs().format("YYYYMMDD")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Data berhasil diekspor ke PDF");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Gagal mengekspor data ke PDF");
    } finally {
      setLoading(false);
    }
  }

  // Create jurusan
  async function createJurusan() {
    if (!newJurusan.kode || !newJurusan.nama) {
      toast.error("Kode dan nama jurusan wajib diisi");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/jurusan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          kode: newJurusan.kode,
          nama: newJurusan.nama,
          sekolahId: Number(activeTenant),
        }),
      });
      if (!response.ok) throw new Error("Failed to create jurusan");
      const result = await response.json();
      setJurusanList([...jurusanList, result.data]);
      JURUSAN_MAP[result.data.kode] = result.data.id;
      setNewJurusan({ kode: "", nama: "" });
      setOpenJurusanDialog(false);
      toast.success("Jurusan berhasil dibuat");
    } catch (error) {
      console.error("Error creating jurusan:", error);
      toast.error("Gagal membuat jurusan");
    }
  }

  // Update jurusan
  async function updateJurusan() {
    if (!editingJurusan || !newJurusan.kode || !newJurusan.nama) {
      toast.error("Kode dan nama jurusan wajib diisi");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/jurusan/${editingJurusan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          kode: newJurusan.kode,
          nama: newJurusan.nama,
          sekolahId: Number(activeTenant),
        }),
      });
      if (!response.ok) throw new Error("Failed to update jurusan");
      const result = await response.json();
      setJurusanList(
        jurusanList.map((j) => (j.id === result.data.id ? result.data : j))
      );
      JURUSAN_MAP[result.data.kode] = result.data.id;
      setEditingJurusan(null);
      setNewJurusan({ kode: "", nama: "" });
      setOpenJurusanDialog(false);
      toast.success("Jurusan berhasil diperbarui");
    } catch (error) {
      console.error("Error updating jurusan:", error);
      toast.error("Gagal memperbarui jurusan");
    }
  }

  // Delete jurusan
  async function deleteJurusan(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/jurusan/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete jurusan");
      setJurusanList(jurusanList.filter((j) => j.id !== id));
      toast.success("Jurusan berhasil dihapus");
    } catch (error) {
      console.error("Error deleting jurusan:", error);
      toast.error("Gagal menghapus jurusan");
    }
  }

  // Update kelas
  async function updateKelas() {
    if (!editingKelas) return;
    try {
      const payload = {
        namaKelas: editingKelas.namaKelas,
        level: editingKelas.level,
        jurusanId: editingKelas.jurusanId === "none" ? null : editingKelas.jurusanId,
        peminatan: editingKelas.peminatan === "none" ? null : editingKelas.peminatan,
        Kapasitas: editingKelas.kapasitas,
        // status: editingKelas.status === "Aktif" ? "active" : "archived",
      };
      if (!isValidCapacity(editingKelas.kapasitas)) {
        toast.error("Kapasitas harus antara 1 dan 60");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/kelas-v2/${editingKelas.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update kelas");
      const result = await response.json();
      setData(
        data.map((row) =>
          row.id === editingKelas.id
            ? {
                ...row,
                namaKelas: result.data.namaKelas,
                level: result.data.level,
                jurusanId: result.data.jurusanId,
                jurusan: jurusanList.find((j) => j.id === result.data.jurusanId)?.kode,
                peminatan: result.data.peminatan,
                kapasitas: result.data.Kapasitas,
                status: result.data.deleteAt ? "Arsip" : "Aktif",
              }
            : row
        )
      );
      setOpenEditKelasDialog(false);
      setEditingKelas(null);
      toast.success("Kelas berhasil diperbarui");
    } catch (error) {
      console.error("Error updating kelas:", error);
      toast.error("Gagal memperbarui kelas");
    }
  }

  // Delete kelas
  async function deleteKelas(id: string) {
    const kelas = data.find((row) => row.id === id);
    if (!kelas) return;
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kelas ${kelas.namaKelas}?`)) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/kelas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete kelas");
      setData(data.filter((row) => row.id !== id));
      setOpenEditKelasDialog(false);
      setEditingKelas(null);
      toast.success("Kelas berhasil dihapus");
    } catch (error) {
      console.error("Error deleting kelas:", error);
      toast.error("Gagal menghapus kelas");
    }
  }

  // Generate rombel
  async function generateRombel() {
    if (activeTenant === "ALL") {
      toast.error("Pilih sekolah (tenant) dulu untuk generate rombel.");
      return;
    }
    const apiUrl = `${API_BASE_URL}/kelas-v2/generate-rombel`;
    const token = localStorage.getItem("token");
    const levels = LEVELS_MAP[effectiveJenjang] || [];
    const rows: KelasRow[] = [];
    let totalInserted = 0;
    let totalSkipped = 0;
    for (const level of levels) {
      const jumlahRombel = Number(genParallel[level] || 0);
      if (!jumlahRombel) continue;
      if (effectiveJenjang === "SMK") {
        for (const jurusan of jurusanList) {
          const payload = {
            sekolahId: activeTenant,
            level,
            jumlahRombel,
            jurusanId: jurusan.id,
          };
          try {
            const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("API call failed");
            const result = await response.json();
            console.log('result SMK', result);
            totalInserted += result.inserted || 0;
            totalSkipped += result.skipped || 0;
            for (let i = 0; i < jumlahRombel; i++) {
              const label = makeLabel(i, namingScheme);
              rows.push({
                id: `${Date.now()}-${level}-${jurusan.kode}-${i}`,
                tenantId: activeTenant,
                sekolah: currentTenantName,
                jenjang: effectiveJenjang,
                level,
                namaKelas: formatNamaKelas({ level, label, jurusan: jurusan.kode }),
                jurusan: jurusan.kode,
                jurusanId: jurusan.id,
                status: "Aktif",
                kapasitas: 36,
                shift: "Pagi",
              });
            }
          } catch (error) {
            console.error(`Error generating rombel for level ${level}, jurusan ${jurusan.kode}:`, error);
            toast.error(`Gagal menghubungi API untuk level ${level}, jurusan ${jurusan.kode}. Menggunakan data lokal.`);
            for (let i = 0; i < jumlahRombel; i++) {
              const label = makeLabel(i, namingScheme);
              rows.push({
                id: `${Date.now()}-${level}-${jurusan.kode}-${i}`,
                tenantId: activeTenant,
                sekolah: currentTenantName,
                jenjang: "SMK",
                level,
                namaKelas: formatNamaKelas({ level, label, jurusan: jurusan.kode }),
                jurusan: jurusan.kode,
                jurusanId: jurusan.id,
                status: "Aktif",
                kapasitas: 36,
                shift: "Pagi",
              });
            }
          }
        }
      } else if (["SMA", "MA"].includes(effectiveJenjang)) {
        for (const peminatan of genPeminatanList) {
          const payload = {
            sekolahId: activeTenant,
            level,
            jumlahRombel,
            peminatan,
          };
          try {
            const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("API call failed");
            const result = await response.json();
            console.log('result SMA ROMBEL:', result);
            totalInserted += result.inserted || 0;
            totalSkipped += result.skipped || 0;
            for (let i = 0; i < jumlahRombel; i++) {
              const label = makeLabel(i, namingScheme);
              rows.push({
                id: `${Date.now()}-${level}-${peminatan}-${i}`,
                tenantId: activeTenant,
                sekolah: currentTenantName,
                jenjang: effectiveJenjang,
                level,
                namaKelas: formatNamaKelas({ level, label, peminatan }),
                peminatan,
                status: "Aktif",
                kapasitas: 36,
                shift: "Pagi",
              });
            }
          } catch (error) {
            console.error(`Error generating rombel for level ${level}, peminatan ${peminatan}:`, error);
            toast.error(`Gagal menghubungi API untuk level ${level}, peminatan ${peminatan}. Menggunakan data lokal.`);
            for (let i = 0; i < jumlahRombel; i++) {
              const label = makeLabel(i, namingScheme);
              rows.push({
                id: `${Date.now()}-${level}-${peminatan}-${i}`,
                tenantId: activeTenant,
                sekolah: currentTenantName,
                jenjang: effectiveJenjang,
                level,
                namaKelas: formatNamaKelas({ level, label, peminatan }),
                peminatan,
                status: "Aktif",
                kapasitas: 36,
                shift: "Pagi",
              });
            }
          }
        }
      } else {
        const payload = {
          sekolahId: activeTenant,
          level,
          jumlahRombel,
        };
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
          });
          if (!response.ok) throw new Error("API call failed");
          const result = await response.json();
          console.log('result SD/SMP', result);
          totalInserted += result.inserted || 0;
          totalSkipped += result.skipped || 0;
          for (let i = 0; i < jumlahRombel; i++) {
            const label = makeLabel(i, namingScheme);
            rows.push({
              id: `${Date.now()}-${level}-${i}`,
              tenantId: activeTenant,
              sekolah: currentTenantName,
              jenjang: effectiveJenjang,
              level,
              namaKelas: formatNamaKelas({ level, label }),
              status: "Aktif",
              kapasitas: 36,
              shift: "Pagi",
            });
          }
        } catch (error) {
          console.error(`Error generating rombel for level ${level}:`, error);
          toast.error(`Gagal menghubungi API untuk level ${level}. Menggunakan data lokal.`);
          for (let i = 0; i < jumlahRombel; i++) {
            const label = makeLabel(i, namingScheme);
            rows.push({
              id: `${Date.now()}-${level}-${i}`,
              tenantId: activeTenant,
              sekolah: currentTenantName,
              jenjang: effectiveJenjang,
              level,
              namaKelas: formatNamaKelas({ level, label }),
              status: "Aktif",
              kapasitas: 36,
              shift: "Pagi",
            });
          }
        }
      }
    }
    if (rows.length > 0) {
      setData((d: KelasRow[]) => [...rows, ...d]);
      setOpenGen(false);
      toast.success(`Rombel generated: ${totalInserted} inserted, ${totalSkipped} skipped`);
    } else {
      toast.error("Tidak ada rombel yang dihasilkan.");
    }
  }

  function resetParallel() {
    const init: Record<string, number> = {};
    (LEVELS_MAP[effectiveJenjang] || []).forEach((lv) => (init[lv] = 0));
    setGenParallel(init);
  }

  useEffect(() => {
    resetParallel();
  }, [effectiveJenjang]);

  function applyBulk() {
    if (selectedIds.length === 0) {
      toast.error("Pilih minimal satu kelas.");
      return;
    }
    setData((prev) =>
      prev.map((row) => {
        if (!selected[row.id]) return row;
        if (row.tenantId !== activeTenant && activeTenant !== "ALL") return row;
        switch (bulkAction) {
          case "arsip":
            return { ...row, status: "Arsip" };
          case "aktif":
            return { ...row, status: "Aktif" };
          case "setWali": {
            const newRow = { ...row, wali: bulkWali || row.wali, nipWali: bulkNIP || row.nipWali };
            const errors = validateRow(newRow);
            if (errors.length) {
              toast.error(`Baris ${row.namaKelas}:\n- ${errors.join("\n- ")}`);
              return row;
            }
            return newRow;
          }
          case "setShift":
            return { ...row, shift: bulkShift };
          default:
            return row;
        }
      })
    );
    toast.success(`Aksi massal diterapkan ke ${selectedIds.length} kelas`);
    setSelected({});
  }

  const validationReport = useMemo(() => {
    const localIssues = filtered.map((r) => ({
      id: r.id,
      nama: r.namaKelas,
      errors: validateRow(r),
    }));
    const apiIssues = validationIssues.map((issue) => ({
      id: String(issue.kelasId || "global"),
      nama: issue.kelasId ? data.find((r) => r.id === String(issue.kelasId))?.namaKelas || "Unknown" : "Global",
      errors: [issue.message],
    }));
    const combinedIssues = [...localIssues, ...apiIssues];
    const totalErrors = combinedIssues.reduce((acc, x) => acc + x.errors.length, 0);
    return { list: combinedIssues, totalErrors };
  }, [filtered, validationIssues, data]);

  return (
    <div className="w-full min-h-screen dark:text-white">
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
      <div className="max-w-full mx-auto">
        <Card className="mb-6 bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-white/30 shadow-sm">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-6 border-b border-gray-200 dark:border-white/30">
            <div>
              <CardDescription className="text-gray-800 dark:text-white">
                Redesign serbaguna untuk SD, SMP, SMA, SMK, dan Madrasah (MI/MTs/MA).
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setOpenGen(true)}
                className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
              >
                <PlusCircle className="h-4 w-4" /> Generator Rombel
              </Button>
              {jenjang === "SMK" && (
                <Button
                  onClick={() => {
                    setEditingJurusan(null);
                    setNewJurusan({ kode: "", nama: "" });
                    setOpenJurusanDialog(true);
                  }}
                  className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <PlusCircle className="h-4 w-4" /> Tambah Jurusan
                </Button>
              )}
              <Button
                onClick={handleExport}
                variant="outline"
                className="gap-2 border-gray-300 dark:border-white/30 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sedang Mengekspor...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Ekspor
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-2 space-y-2">
                <Label className="text-gray-800 dark:text-white">Sekolah (Tenant)</Label>
                <Select value={activeTenant} onValueChange={setActiveTenant}>
                  <SelectTrigger className="border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Sekolah</SelectItem>
                    {tenants.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {jenjang === "Madrasah" && (
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-gray-800 dark:text-white">Tipe Madrasah</Label>
                  <Select value={madrasahType} onValueChange={setMadrasahType}>
                    <SelectTrigger className="border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MI">MI (setara SD)</SelectItem>
                      <SelectItem value="MTs">MTs (setara SMP)</SelectItem>
                      <SelectItem value="MA">MA (setara SMA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="md:col-span-2 space-y-2">
                <Label className="text-gray-800 dark:text-white">Level</Label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua</SelectItem>
                    {levelOptions.map((lv) => (
                      <SelectItem key={lv} value={lv}>
                        {lv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-gray-800 dark:text-white">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua</SelectItem>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Arsip">Arsip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3 space-y-2">
                <Label className="text-gray-800 dark:text-white">Cari Kelas</Label>
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <Input
                    placeholder="Cari nama kelas / sekolah / jurusan"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-9 border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="md:col-span-12 mt-3 bg-teal-900/10 rounded-lg p-3 border border-gray-200 dark:border-white/30 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={effectiveShowSekolahCol}
                    onCheckedChange={(v) => activeTenant === 'ALL' && setShowSekolahCol(!!v)}
                    disabled={activeTenant !== 'ALL'}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {activeTenant === 'ALL' ? 'Tampilkan kolom Sekolah' : 'Kolom Sekolah (mode Semua Sekolah)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={showJurusanCol} onCheckedChange={setShowJurusanCol} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tampilkan kolom Jurusan (SMK)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={showPeminatanCol} onCheckedChange={setShowPeminatanCol} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tampilkan kolom Peminatan (SMA/MA)</span>
                </div>
              </div>
            </div>
            {Object.keys(selected).length > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-theme-color-primary/5 p-2">
                <span className="text-sm text-gray-800 dark:text-white">{Object.keys(selected).length} dipilih</span>
                <div className="ml-auto flex flex-wrap gap-2">
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white">
                      <SelectValue placeholder="Pilih aksi…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Pilih aksi…</SelectItem>
                      <SelectItem value="arsip">Arsipkan</SelectItem>
                      <SelectItem value="aktif">Aktifkan</SelectItem>
                      <SelectItem value="setWali">Set Wali + NIP</SelectItem>
                      <SelectItem value="setShift">Set Shift</SelectItem>
                    </SelectContent>
                  </Select>
                  {bulkAction === 'setWali' && (
                    <>
                      <Input
                        value={bulkWali}
                        onChange={(e) => setBulkWali(e.target.value)}
                        placeholder="Nama Wali"
                        className="border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white"
                      />
                      <Input
                        value={bulkNIP}
                        onChange={(e) => setBulkNIP(e.target.value)}
                        placeholder="Contoh: 197801012006042001"
                        className="border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white"
                      />
                    </>
                  )}
                  {bulkAction === 'setShift' && (
                    <Select value={bulkShift} onValueChange={setBulkShift}>
                      <SelectTrigger className="border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHIFT_OPTIONS.map((sh) => (
                          <SelectItem key={sh} value={sh}>
                            {sh}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    onClick={applyBulk}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Terapkan
                  </Button>
                </div>
              </div>
            )}
            {jenjang === 'SMK' && (
              <Card className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-sm font-semibold text-gray-800 dark:text-white">
                    Daftar Jurusan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kode</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jurusanList.map((jurusan) => (
                        <TableRow key={jurusan.id}>
                          <TableCell>{jurusan.kode}</TableCell>
                          <TableCell>{jurusan.nama}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {
                                setEditingJurusan(jurusan);
                                setNewJurusan({ kode: jurusan.kode, nama: jurusan.nama });
                                setOpenJurusanDialog(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => deleteJurusan(jurusan.id)}
                            >
                              Hapus
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {jurusanList.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-gray-600 dark:text-gray-400">
                            Belum ada jurusan
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
            <div className="rounded-2xl border border-gray-200 dark:border-white/30 bg-theme-color-primary/5 overflow-hidden pb-5">
              <Table>
                <TableHeader className="bg-theme-color-primary/20 text-gray-600 dark:text-gray-400">
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={filtered.length > 0 && filtered.every((r) => selected[r.id])}
                        onCheckedChange={(v) => {
                          const next: Record<string, boolean> = { ...selected };
                          filtered.forEach((r) => {
                            if (v) next[r.id] = true;
                            else delete next[r.id];
                          });
                          setSelected(next);
                        }}
                      />
                    </TableHead>
                    <TableHead>Nama Kelas</TableHead>
                    <TableHead>Level</TableHead>
                    {showJurusan && <TableHead>Jurusan</TableHead>}
                    {showPeminatan && <TableHead>Peminatan</TableHead>}
                    {effectiveShowSekolahCol && <TableHead>Sekolah</TableHead>}
                    <TableHead>Kapasitas</TableHead>
                    <TableHead>Siswa</TableHead>
                    {/* <TableHead>Status</TableHead> */}
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row) => {
                    const errs = validateRow(row);
                    return (
                      <TableRow
                        key={row.id}
                        className={clsx(
                          'border-t border-gray-200 dark:border-white/30',
                          errs.length ? 'bg-red-100 dark:bg-red-900' : 'bg-theme-color-primary/5 hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                      >
                        <TableCell>
                          <Checkbox
                            checked={!!selected[row.id]}
                            onCheckedChange={(v) => setSelected((s) => ({ ...s, [row.id]: !!v }))}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-gray-800 dark:text-white">{row.namaKelas}</TableCell>
                        <TableCell className="text-gray-800 dark:text-white">{row.level}</TableCell>
                        {showJurusan && <TableCell className="text-gray-800 dark:text-white">{row.jurusan || '—'}</TableCell>}
                        {showPeminatan && <TableCell className="text-gray-800 dark:text-white">{row.peminatan || '—'}</TableCell>}
                        {effectiveShowSekolahCol && <TableCell className="text-gray-800 dark:text-white">{row.sekolah || '—'}</TableCell>}
                        <TableCell className="text-gray-800 dark:text-white">{row.kapasitas ?? '—'}</TableCell>
                        <TableCell className="text-gray-800 dark:text-white">{row.siswaCount ?? '0'}</TableCell>
                        {/* <TableCell>
                          <Badge
                            className={clsx(
                              'border-gray-200 dark:border-gray-700',
                              row.status === 'Aktif'
                                ? 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                            )}
                            variant="outline"
                          >
                            {row.status}
                          </Badge>
                        </TableCell> */}
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-yellow-700"
                            onClick={() => {
                              setEditingKelas(row);
                              setOpenEditKelasDialog(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 dark:text-white hover:bg-red-100 dark:hover:bg-red-900"
                            onClick={() => deleteKelas(row.id)}
                          >
                            Hapus
                          </Button>
                          {errs.length > 0 && (
                            <span className="text-xs text-red-600 dark:text-red-400">{errs[0]}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-gray-600 dark:text-gray-400 py-8">
                        Belum ada data untuk filter saat ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <PaginationControls />
            </div>
            <Card className="bg-theme-color-primary/5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-sm font-semibold text-gray-800 dark:text-white">
                  Cek Validasi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className={clsx('text-sm', validationReport.totalErrors ? 'text-red-600 dark:text-red-400' : 'text-teal-600 dark:text-teal-400')}>
                  {validationReport.totalErrors
                    ? `${validationReport.totalErrors} isu ditemukan`
                    : 'Tidak ada isu pada tampilan saat ini'}
                </div>
                {validationReport.totalErrors > 0 && (
                  <ul className="mt-2 list-disc pl-6 text-xs text-gray-600 dark:text-gray-400">
                    {validationReport.list
                      .filter((x) => x.errors.length)
                      .slice(0, 10)
                      .map((x) => (
                        <li key={x.id}>
                          <span className="font-medium">{x.nama}</span>: {x.errors.join('; ')}
                        </li>
                      ))}
                    {validationReport.totalErrors > 10 && <li className="italic">…dan lainnya</li>}
                  </ul>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        {/* Dialogs remain unchanged */}
        <Dialog open={openEditKelasDialog} onOpenChange={setOpenEditKelasDialog}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-theme-color-primary border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-800 dark:text-white">Edit Kelas</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-800 dark:text-white">Nama Kelas</Label>
                <Input
                  value={editingKelas?.namaKelas || ''}
                  onChange={(e) =>
                    setEditingKelas((prev) => ({ ...prev!, namaKelas: e.target.value }))
                  }
                  className="border-gray-300 dark:border-white bg-white/10 text-gray-800 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-800 dark:text-white">Level</Label>
                <Select
                  value={editingKelas?.level || ''}
                  onValueChange={(value) =>
                    setEditingKelas((prev) => ({ ...prev!, level: value }))
                  }
                >
                  <SelectTrigger className="border-gray-300 dark:border-white bg-white/10 text-gray-800 dark:text-white">
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOptions.map((lv) => (
                      <SelectItem key={lv} value={lv}>
                        {lv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {showJurusan && (
                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-white">Jurusan</Label>
                  <Select
                    value={editingKelas?.jurusanId ? String(editingKelas.jurusanId) : 'none'}
                    onValueChange={(value) =>
                      setEditingKelas((prev) => ({
                        ...prev!,
                        jurusanId: value === 'none' ? undefined : Number(value),
                        jurusan: value === 'none' ? undefined : jurusanList.find((j) => j.id === Number(value))?.kode,
                      }))
                    }
                  >
                    <SelectTrigger className="border-gray-300 dark:border-white bg-white/10 text-gray-800 dark:text-white">
                      <SelectValue placeholder="Pilih jurusan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada jurusan</SelectItem>
                      {jurusanList.map((jurusan) => (
                        <SelectItem key={jurusan.id} value={String(jurusan.id)}>
                          {jurusan.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {showPeminatan && (
                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-white">Peminatan</Label>
                  <Select
                    value={editingKelas?.peminatan || 'none'}
                    onValueChange={(value) =>
                      setEditingKelas((prev) => ({
                        ...prev!,
                        peminatan: value === 'none' ? undefined : value,
                      }))
                    }
                  >
                    <SelectTrigger className="border-gray-300 dark:border-white bg-white/10 text-gray-800 dark:text-white">
                      <SelectValue placeholder="Pilih peminatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada peminatan</SelectItem>
                      {peminatanOptions.map((peminatan) => (
                        <SelectItem key={peminatan} value={peminatan}>
                          {peminatan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-gray-800 dark:text-white">Kapasitas</Label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={editingKelas?.kapasitas || ''}
                  onChange={(e) =>
                    setEditingKelas((prev) => ({
                      ...prev!,
                      kapasitas: e.target.value === '' ? undefined : Number(e.target.value),
                    }))
                  }
                  placeholder="1–60"
                  className="border-gray-300 dark:border-white bg-white/10 text-gray-800 dark:text-white placeholder:text-white/70"
                />
              </div>
              {/* <div className="space-y-2">
                <Label className="text-gray-800 dark:text-white">Status</Label>
                <Select
                  value={editingKelas?.status || ''}
                  onValueChange={(value) =>
                    setEditingKelas((prev) => ({
                      ...prev!,
                      status: value as 'Aktif' | 'Arsip',
                    }))
                  }
                >
                  <SelectTrigger className="border-gray-300 dark:border-white bg-white/10 text-gray-800 dark:text-white">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Arsip">Arsip</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenEditKelasDialog(false);
                  setEditingKelas(null);
                }}
                className="border-gray-300 dark:border-white/30 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Batal
              </Button>
              <Button
                onClick={updateKelas}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={openGen} onOpenChange={setOpenGen}>
          <DialogContent className="sm:max-w-3xl bg-white dark:bg-theme-color-primary border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-800 dark:text-white">
                Generator Rombel — {effectiveJenjang}
              </DialogTitle>
              <CardDescription className="text-gray-800 dark:text-white">
                Masukan jumlah paralel per level. Sistem akan membuat kelas otomatis mengikuti aturan penamaan.
              </CardDescription>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 gap-3 md:grid-cols-6 mt-4"
            >
              {(LEVELS_MAP[effectiveJenjang] || []).map((lv) => (
                <Card key={lv} className="bg-theme-color-primary/5 rounded-xl border border-gray-200 dark:border-white shadow-sm">
                  <CardHeader className="p-3">
                    <CardTitle className="text-xs text-gray-600 dark:text-white">Level</CardTitle>
                    <div className="font-semibold text-gray-800 dark:text-white">{lv}</div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Paralel"
                      value={genParallel[lv] ?? 0}
                      onChange={(e) =>
                        setGenParallel((s) => ({ ...s, [lv]: Number(e.target.value) }))
                      }
                      className="border-gray-300 dark:border-white bg-white/10 text-gray-800 dark:text-white"
                    />
                  </CardContent>
                </Card>
              ))}
            </motion.div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-gray-800 dark:text-white">Skema Label ({effectiveJenjang})</Label>
                <Select
                  value={namingScheme}
                  onValueChange={(v) => setNamingSchemeMap((m) => ({ ...m, [effectiveJenjang]: v }))}
                >
                  <SelectTrigger className="border-gray-300 dark:border-white bg-white/10 text-gray-800 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="letter">Huruf (A, B, C)</SelectItem>
                    <SelectItem value="number">Angka (1, 2, 3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {effectiveJenjang === 'SMK' && (
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-gray-800 dark:text-white">Jurusan SMK</Label>
                  <Input
                    value={jurusanList.map((j) => j.kode).join(', ')}
                    onChange={(e) => {}}
                    className="border-gray-300 dark:border-white bg-white/10 text-gray-800 dark:text-white"
                    disabled
                  />
                </div>
              )}
              {['SMA', 'MA'].includes(effectiveJenjang) && (
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-gray-800 dark:text-white">Peminatan</Label>
                  <Input
                    value={genPeminatanList.join(', ')}
                    onChange={(e) => setGenPeminatanList(e.target.value.split(/,\s*/).filter(Boolean))}
                    className="border-gray-300 dark:border-white bg-white/10 text-gray-800 dark:text-white"
                    placeholder="IPA, IPS, Bahasa, Keagamaan"
                  />
                </div>
              )}
            </div>
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={resetParallel}
                className="border-gray-300 dark:border-white text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Reset
              </Button>
              <Button
                onClick={generateRombel}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Generate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={openJurusanDialog} onOpenChange={setOpenJurusanDialog}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-theme-color-primary/5 border-gray-200 dark:border-white">
            <DialogHeader>
              <DialogTitle className="text-gray-800 dark:text-white">
                {editingJurusan ? 'Edit Jurusan' : 'Tambah Jurusan'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-800 dark:text-white">Kode Jurusan</Label>
                <Input
                  value={newJurusan.kode}
                  onChange={(e) => setNewJurusan({ ...newJurusan, kode: e.target.value })}
                  placeholder="Contoh: TKJ"
                  className="border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-800 dark:text-white">Nama Jurusan</Label>
                <Input
                  value={newJurusan.nama}
                  onChange={(e) => setNewJurusan({ ...newJurusan, nama: e.target.value })}
                  placeholder="Contoh: Teknik Komputer dan Jaringan"
                  className="border-gray-300 dark:border-white/30 bg-white/10 text-gray-800 dark:text-white"
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => setOpenJurusanDialog(false)}
                className="border-gray-300 dark:border-white/30 text-gray-800 dark:text-white bg-white/10 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Batal
              </Button>
              <Button
                onClick={editingJurusan ? updateJurusan : createJurusan}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {editingJurusan ? 'Simpan' : 'Tambah'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Tambah Dialog untuk Import Excel */}
        <Dialog open={openImportDialog} onOpenChange={setOpenImportDialog}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-theme-color-primary border-gray-200 dark:border-white/50">
            <DialogHeader>
              <DialogTitle className="text-gray-800 dark:text-white">Unggah File Excel</DialogTitle>
              <CardDescription className="text-gray-600 dark:text-white/80">
                Unggah file Excel dengan format: Level, Jumlah Rombel, [Jurusan/Peminatan]. Pastikan header ada di baris pertama.
              </CardDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleImport(e.target.files?.[0] || null)}
                accept=".xlsx, .xls"
                className="hidden"
              />
              <Button
                onClick={triggerFileInput}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Memproses...
                  </>
                ) : (
                  "Pilih File Excel"
                )}
              </Button>
            </div>
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => setOpenImportDialog(false)}
                className="border-gray-300 dark:border-white text-gray-800 dark:text-white bg-trasnparent hover:bg-gray-100 dark:hover:bg-white/20"
              >
                Batal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Toaster position="top-right" richColors closeButton duration={2500} />
      </div>
    </div>
  );
};
// ---------- Self-Tests ----------
if (typeof window !== "undefined") {
  try {
    console.assert(formatNamaKelas({ level: "X", label: "A" }) === "X-A", "Nama kelas dasar harus 'X-A'");
    console.assert(
      formatNamaKelas({ level: "X", label: "A", jurusan: "TKJ" }) === "X-TKJ A",
      "Nama kelas SMK harus 'X-TKJ A'"
    );
    console.assert(
      formatNamaKelas({ level: "XI", label: "B", peminatan: "IPS" }) === "XI-IPS B",
      "Nama kelas SMA/MA harus 'XI-IPS B'"
    );
    ["SD", "SMP", "SMA", "SMK", "MI", "MTs", "MA"].forEach((j) => {
      console.assert(Array.isArray(LEVELS_MAP[j]) && LEVELS_MAP[j].length > 0, `LEVELS_MAP[${j}] harus array tidak kosong`);
    });
    console.assert(makeLabel(0, "letter") === "A" && makeLabel(1, "letter") === "B", "Label huruf harus A, B");
    console.assert(makeLabel(0, "number") === "1" && makeLabel(2, "number") === "3", "Label angka harus 1,2,3");
    console.assert(
      isValidCapacity(1) && isValidCapacity(60) && !isValidCapacity(0) && !isValidCapacity(100),
      "Validasi kapasitas 1–60"
    );
    console.assert(
      isValidNIP("197801012006042001") && !isValidNIP("123") && isValidNIP(undefined),
      "Validasi NIP 18 digit atau kosong"
    );
    const err1 = validateRow({
      id: "x",
      tenantId: "t",
      jenjang: "SMA",
      level: "X",
      namaKelas: "X-IPA A",
      peminatan: "IPA",
      wali: "Guru A",
      nipWali: "",
      kapasitas: 36,
      status: "Aktif",
    });
    console.assert(err1.includes("NIP Wali kosong"), "Jika wali ada, NIP wajib");
    const err2 = validateRow({
      id: "y",
      tenantId: "t",
      jenjang: "SMP",
      level: "VII",
      namaKelas: "VII-A",
      kapasitas: 0,
      status: "Aktif",
    });
    console.assert(err2.includes("Kapasitas harus 1–60"), "Kapasitas 0 ditolak");
    console.log("[DEV TESTS] ok ✅");
  } catch (e) {
    console.warn("Self-test gagal:", e);
  }
}