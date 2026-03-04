import { getSchoolld } from "@/features/_global/hooks/getSchoolId";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

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
if (typeof document !== "undefined") {
  document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13)
    .map(([k, v]) => `${k}: ${v};`)
    .join("");
}

// === UTILITIES ===
const clsx = (...args: any[]) => args.filter(Boolean).join(" ");

// === ALERT HOOK & COMPONENT ===
const useAlert = () => {
  const [alert, setAlert] = useState({ message: "", isVisible: false });

  const showAlert = (message: string) => setAlert({ message, isVisible: true });
  const hideAlert = () => setAlert({ message: "", isVisible: false });

  return { alert, showAlert, hideAlert };
};

const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const isSuccess = message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("success");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        "mb-4 rounded-xl border p-4 text-sm",
        isSuccess ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-red-500/30 bg-red-500/10 text-red-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="whitespace-pre-line">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className={clsx(
            "ml-4 text-xl leading-none",
            isSuccess ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400"
          )}
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

// === FORM COMPONENTS ===
const Field = ({ label, children, className }: { label?: string; children: React.ReactNode; className?: string }) => (
  <label className={clsx("block", className)}>
    {label && <div className="mb-2 text-xs font-medium text-white/70">{label}</div>}
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

// === CONFIG ===
const BASE_URL = "https://be-school.kiraproject.id";
// const BASE_URL = "http://localhost:5005";

const getJsonHeaders = () => ({
  "Content-Type": "application/json",
  // "Authorization": `Bearer ${localStorage.getItem("token")}`,
});

const getFormDataHeaders = () => ({
  // JANGAN set Content-Type untuk FormData
  // "Authorization": `Bearer ${localStorage.getItem("token")}`,
});

const DEFAULT_PROFILE = {
  heroTitle: "",
  heroSubTitle: "",
  linkYoutube: "",
  headmasterWelcome: "",
  headmasterName: "",
  schoolName: "",
  studentCount: "",
  teacherCount: "",
  roomCount: "",
  achievementCount: "",
  latitude: "",
  longitude: "",
  address: "",
  phoneNumber: "",
  email: "",
  photoHeadmasterUrl: null as File | null,
  heroImage: null as File | null,           // ← BARU
};

// Komponen untuk handle klik peta
const LocationPicker = ({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export function ProfileSekolahMain() {
  // ── HOOKS DI DALAM COMPONENT ──
  // const { data: schoolData, isLoading: schoolLoading } = useSchool();
  // 1. Ambil data user dari localStorage

  // 3. Ambil school_id dari data user
  // (Pastikan fieldnya sesuai dengan struktur API Anda, misal: schoolId atau school_id)
  const SCHOOL_ID = getSchoolld();

  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  // Map preview state
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]); // Default Jakarta
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);

  // ── FETCH PROFILE ───────────────────────────────────────────────────────
 const fetchProfile = async () => {
    if (!SCHOOL_ID) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/profileSekolah?schoolId=${SCHOOL_ID}`, {
        headers: getJsonHeaders(),
      });
      if (!res.ok) throw new Error("Gagal mengambil profil");
      const json = await res.json();

      if (json.success && json.data) {
        setProfile(json.data);
        setFormData({
          heroTitle: json.data.heroTitle || "",
          heroSubTitle: json.data.heroSubTitle || "",
          linkYoutube: json.data.linkYoutube || "",
          headmasterWelcome: json.data.headmasterWelcome || "",
          headmasterName: json.data.headmasterName || "",
          schoolName: json.data.schoolName || "",
          studentCount: json.data.studentCount?.toString() || "",
          teacherCount: json.data.teacherCount?.toString() || "",
          roomCount: json.data.roomCount?.toString() || "",
          achievementCount: json.data.achievementCount?.toString() || "",
          latitude: json.data.latitude?.toString() || "",
          longitude: json.data.longitude?.toString() || "",
          address: json.data.address || "",
          phoneNumber: json.data.phoneNumber || "",
          email: json.data.email || "",
          photoHeadmasterUrl: null,
          heroImage: null,                    // ← reset saat fetch
        });

        if (json.data.latitude && json.data.longitude) {
          const lat = parseFloat(json.data.latitude);
          const lng = parseFloat(json.data.longitude);
          setMapCenter([lat, lng]);
          setMarkerPos([lat, lng]);
        }
      } else {
        setProfile(null);
      }
    } catch (err: any) {
      showAlert("Gagal memuat profil: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (SCHOOL_ID) {
      fetchProfile();
    }
  }, [SCHOOL_ID]);

  // ── HANDLE SUBMIT ───────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!SCHOOL_ID) {
      showAlert("School ID tidak ditemukan");
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append("schoolId", SCHOOL_ID.toString());
    form.append("heroTitle", formData.heroTitle);
    form.append("heroSubTitle", formData.heroSubTitle || "");
    form.append("linkYoutube", formData.linkYoutube || "");
    form.append("headmasterWelcome", formData.headmasterWelcome);
    form.append("headmasterName", formData.headmasterName);
    form.append("schoolName", formData.schoolName);
    form.append("studentCount", formData.studentCount || "0");
    form.append("teacherCount", formData.teacherCount || "0");
    form.append("roomCount", formData.roomCount || "0");
    form.append("achievementCount", formData.achievementCount || "0");
    form.append("latitude", formData.latitude || "");
    form.append("longitude", formData.longitude || "");
    form.append("address", formData.address || "");
    form.append("phoneNumber", formData.phoneNumber || "");
    form.append("email", formData.email || "");

    // Foto kepala sekolah
    if (formData.photoHeadmasterUrl) {
      form.append("photoHeadmasterUrl", formData.photoHeadmasterUrl);
    }

    // Hero image – BARU
    if (formData.heroImage) {
      form.append("heroImage", formData.heroImage);
    }

    try {
      const url = profile ? `${BASE_URL}/profileSekolah/${profile.id}` : `${BASE_URL}/profileSekolah`;
      const method = profile ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getFormDataHeaders(), // jangan set Content-Type
        body: form,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Gagal ${profile ? "memperbarui" : "menambahkan"} profil`);
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal");

      showAlert(profile ? "Profil sekolah berhasil diperbarui" : "Profil sekolah berhasil ditambahkan");
      setIsModalOpen(false);
      fetchProfile(); // refresh data
    } catch (err: any) {
      showAlert(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // ── HANDLE MAP CLICK ────────────────────────────────────────────────────
  const handleMapClick = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
    setMarkerPos([lat, lng]);
    setMapCenter([lat, lng]);
  };

  // ── RENDER ──────────────────────────────────────────────────────────────
  // if (schoolLoading) {
  //   return <div className="text-white py-10">Memuat informasi sekolah...</div>;
  // }

  if (!SCHOOL_ID) {
    return <div className="text-red-400 py-10">School ID tidak ditemukan. Pastikan useSchool berfungsi dengan benar.</div>;
  }

  const Icon = ({ label }: { label: string }) => (
    <span aria-hidden className="inline-block align-middle select-none" style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
      {label}
    </span>
  );
  const ISave = () => <Icon label="💾" />;
  const IEdit = () => <Icon label="✏️" />;
  const IDelete = () => <Icon label="🗑️" />;

  return (
    <div className="space-y-6 pb-10">
      <AnimatePresence>{alert.isVisible && <Alert message={alert.message} onClose={hideAlert} />}</AnimatePresence>

      {/* Tombol Tambah / Edit */}
      <div className="flex flex-wrap gap-4 mt-4">
        {!profile && !loading && (
          <button
            onClick={() => {
              setFormData(DEFAULT_PROFILE);
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            <ISave /> Tambah Profil Sekolah
          </button>
        )}

        {profile && (
          <button
            onClick={() => {
              setIsEditing(true);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            <ISave /> Perbarui Profil
          </button>
        )}

        {/* {profile && (
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600/80 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            disabled={loading}
          >
            🗑️ Hapus Profil
          </button>
        )} */}
      </div>

      {/* Konten Utama */}
      <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
        {loading && <div className="py-12 text-center text-white/70">Memuat...</div>}

        {!loading && !profile && (
          <div className="py-12 text-center text-white/60">Belum ada data profil sekolah.</div>
        )}

        {profile && (
          <div className="space-y-8">
          {/* HERO IMAGE – BARU: Tampilkan gambar hero di atas */}
          {profile.heroImageUrl && (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={profile.heroImageUrl}
                alt="Hero Banner Sekolah"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
              {/* Overlay gradient + teks hero title (opsional, bisa dihapus jika tidak perlu) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                    {profile.heroTitle || "Selamat Datang di Sekolah Kami"}
                  </h2>
                  {profile.heroSubTitle && (
                    <p className="mt-2 text-lg text-white/90 drop-shadow-md">
                      {profile.heroSubTitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
            {/* Header */}
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              {profile.photoHeadmasterUrl && (
                <img
                  src={profile.photoHeadmasterUrl}
                  alt="Kepala Sekolah"
                  className="h-40 w-40 rounded-2xl border-4 border-white/30 object-cover shadow-xl"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">{profile.schoolName || "Profil Sekolah"}</h1>
                <p className="mt-2 text-lg text-emerald-300">
                  Kepala Sekolah: {profile.headmasterName || "—"}
                </p>
              </div>
            </div>

            {/* Statistik Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Nama Sekolah", value: profile.schoolName },
                { label: "Kepala Sekolah", value: profile.headmasterName },
                { label: "Jumlah Siswa", value: profile.studentCount?.toLocaleString() || "0" },
                { label: "Jumlah Guru", value: profile.teacherCount?.toLocaleString() || "0" },
                { label: "Ruang Kelas", value: profile.roomCount?.toLocaleString() || "0" },
                { label: "Prestasi", value: profile.achievementCount?.toLocaleString() || "0" },
                {
                  label: "Koordinat",
                  value: profile.latitude
                    ? `${parseFloat(profile.latitude).toFixed(6)}, ${parseFloat(profile.longitude).toFixed(6)}`
                    : "—",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10"
                >
                  <p className="text-xs uppercase tracking-wide text-white/60">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold text-white">{item.value || "—"}</p>
                </div>
              ))}
            </div>

            {/* Kontak */}
            {(profile.address || profile.phoneNumber || profile.email) && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-white">Informasi Kontak</h3>
                <div className="space-y-3">
                  {profile.address && (
                    <div className="flex items-center gap-3 rounded-lg bg-green-900/20 p-3">
                      <MapPin size={18} className="text-green-400" />
                      <p className="text-white/90">{profile.address}</p>
                    </div>
                  )}
                  {profile.phoneNumber && (
                    <p className="text-white/90">
                      <strong>Telepon:</strong> {profile.phoneNumber}
                    </p>
                  )}
                  {profile.email && (
                    <p className="text-white/90">
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${profile.email}`} className="text-blue-300 hover:underline">
                        {profile.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Sambutan */}
            {profile.headmasterWelcome && (
              <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/30 to-blue-900/20 p-6 md:p-8">
                <h3 className="mb-4 text-xl font-semibold text-blue-300">Sambutan Kepala Sekolah</h3>
                <p className="whitespace-pre-line text-white/90 leading-relaxed">
                  {profile.headmasterWelcome}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
    {/* MODAL CREATE/UPDATE */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999999999999999999999]" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-90" />
          </Transition.Child>

          <div className="fixed right-0 top-0 w-[44vw] ml-auto z-[999999999999] inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full  h-screen overflow-auto border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
                  <Dialog.Title className="text-xl font-semibold text-white mb-6">
                    <div className="w-full flex items-center justify-between border-b border-white/40 pb-4">
                      <p>
                        {isEditing ? "Perbarui Profil Sekolah" : "Tambah Profil Sekolah"}
                      </p>
                      <FaTimes onClick={() => setIsModalOpen(!isModalOpen)} className="w-6 h-6 text-red-500 cursor-pointer active:scale-[0.94] hover:text-white/80" />
                    </div>
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Nama Sekolah">
                        <Input
                          value={formData.schoolName}
                          onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                          placeholder="Nama lengkap sekolah"
                          required
                        />
                      </Field>
                      <Field label="Nama Kepala Sekolah">
                        <Input
                          value={formData.headmasterName}
                          onChange={(e) => setFormData({ ...formData, headmasterName: e.target.value })}
                          placeholder="Nama Kepsek"
                          required
                        />
                      </Field>
                    </div>
                    
                    <Field label="Sambutan Kepala Sekolah">
                      <TextArea
                        value={formData.headmasterWelcome}
                        onChange={(e) => setFormData({ ...formData, headmasterWelcome: e.target.value })}
                        placeholder="Tulis sambutan..."
                        rows={7}
                        required
                      />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                      <Field label="Hero Title (Judul Utama)">
                        <Input
                          value={formData.heroTitle}
                          onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                          placeholder="Judul hero section"
                          required
                        />
                      </Field>
                      
                      <Field label="Hero Subtitle (Opsional)">
                        <Input
                          value={formData.heroSubTitle}
                          onChange={(e) => setFormData({ ...formData, heroSubTitle: e.target.value })}
                          placeholder="Sub judul hero"
                        />
                      </Field>
                    </div>


                    <Field label="Link YouTube (Opsional)">
                      <Input
                        value={formData.linkYoutube}
                        onChange={(e) => setFormData({ ...formData, linkYoutube: e.target.value })}
                        placeholder="https://youtube.com/..."
                      />
                    </Field>

                    <Field label="Alamat Sekolah">
                      <TextArea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Jl. Contoh No. 123, Kecamatan ..., Kota ..."
                        rows={2}
                      />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Nomor Telepon">
                        <Input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder="0812-3456-7890"
                        />
                      </Field>

                      <Field label="Email Sekolah">
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="info@smkn13.sch.id"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Field label="Jumlah Siswa">
                        <Input
                          type="number"
                          value={formData.studentCount}
                          onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                          placeholder="0"
                        />
                      </Field>
                      <Field label="Jumlah Guru">
                        <Input
                          type="number"
                          value={formData.teacherCount}
                          onChange={(e) => setFormData({ ...formData, teacherCount: e.target.value })}
                          placeholder="0"
                        />
                      </Field>
                      <Field label="Jumlah Ruang">
                        <Input
                          type="number"
                          value={formData.roomCount}
                          onChange={(e) => setFormData({ ...formData, roomCount: e.target.value })}
                          placeholder="0"
                        />
                      </Field>
                      <Field label="Jumlah Prestasi">
                        <Input
                          type="number"
                          value={formData.achievementCount}
                          onChange={(e) => setFormData({ ...formData, achievementCount: e.target.value })}
                          placeholder="0"
                        />
                      </Field>
                    </div>

                    {/* MAP PICKER */}
                    <Field label="Lokasi Sekolah (Klik peta untuk ambil koordinat)">
                      <div className="relative">
                        <MapContainer center={mapCenter} zoom={13} style={{ height: "300px" }}>
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <LocationPicker onLocationChange={handleMapClick} />
                          {markerPos && <Marker position={markerPos} />}
                        </MapContainer>
                        <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full text-xs text-white/90 flex items-center gap-1">
                          <MapPin size={14} /> Klik peta untuk update koordinat
                        </div>
                      </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Latitude">
                        <Input
                          type="text"
                          value={formData.latitude}
                          readOnly
                          className="bg-white/10 cursor-not-allowed"
                        />
                      </Field>
                      <Field label="Longitude">
                        <Input
                          type="text"
                          value={formData.longitude}
                          readOnly
                          className="bg-white/10 cursor-not-allowed"
                        />
                      </Field>
                    </div>

                    <Field label={isEditing ? "Ganti Gambar Hero (opsional)" : "Gambar Hero (Banner Utama)"}>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setFormData({ ...formData, heroImage: e.target.files?.[0] || null })
                        }
                      />
                      {formData.heroImage && (
                        <p className="text-xs text-white/70 mt-1">{formData.heroImage.name}</p>
                      )}
                      {/* Optional: bisa tambah preview kecil jika diinginkan */}
                    </Field>

                    <Field label={isEditing ? "Ganti Foto Kepsek (opsional)" : "Foto Kepsek"}>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, photoHeadmasterUrl: e.target.files?.[0] || null })}
                      />
                      {formData.photoHeadmasterUrl && <p className="text-xs text-white/70 mt-1">{formData.photoHeadmasterUrl.name}</p>}
                    </Field>

                    <div className="grid grid-cols-2 gap-3 mt-8">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="w-full text-center rounded-xl border border-white/20 px-5 py-2.5 text-sm text-white/70 hover:text-white"
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 w-full text-center rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-semibold hover:bg-blue-600"
                        disabled={loading}
                      >
                        {loading ? "Menyimpan..." : isEditing ? "Update Profil" : "Simpan Profil"}
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
}