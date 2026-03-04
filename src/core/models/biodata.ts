import { UserDataModel } from "./user";

export interface Kelas {
  id: number;
  namaKelas: string;
  level: string;
  kodeKelas: number;
  sekolahId: number;
  createdAt: string;
  updatedAt: string;
  deleteAt: string;
}

export interface BiodataSiswa {
  id: number;
  fotoTampakDepan: string;
  fotoTampakSampingKiri: string;
  fotoTampakSampingKanan: string;
  status: number;
  deleteAt: string;
  idKelas?: number;
  userId: number;
  createdAt: string;
  updatedAt?: string;
  locationId?: number;
  absensis: Absensi[];
  location?: Location;
  kelas?: Kelas;
  kehadiranBulanan: KehadiranBulanan[];
  Note: Note[];
  kehadiranBulananMataPelajaran: KehadiranBulananMataPelajaran[];
  user: User;
  lulus?: boolean;
  orangTua: OrangTua[];
  parent?: UserDataModel;
  attendance?: Absensi;
}

export interface Absensi {
  id: number;
  fotoAbsen?: string;
  fotoAbsenPulang?: string;
  jamMasuk?: string;
  jamPulang?: string;
  status: number;
  tipeAbsenMasuk: string;
  isInsilite: number;
  deleteAt?: string;
  createdAt: string;
  updatedAt: string;
  biodataSiswaId: number;
  guruId: number;
  devicesId: number;
  dispensasiId?: number;
  statusKehadiran: string;
  kehadiranBulananId: number;
  dispensasi?: Dispensasi;
}

export interface Dispensasi {
  id: number;
  alasan: string;
  buktiSurat: string;
  keterangan: string;
  guruId: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  createdAt: string;
  updatedAt: string;
  deviceId: number;
  userId: number;
  biodataSiswaId: number;
}

export interface Location {
  id: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}


export interface KehadiranBulanan {
  id: number;
  biodataSiswaId: number;
  guruId: number;
  namaBulan: string;
  tahunAjaran: string;
  jumlahMasukPerBulan: number;
  jumlahIjinPerBulan: number;
  jumlahSakitPerBulan: number;
  jumlahAlphaPerBulan: number;
  createdAt: string;
  updatedAt: string;
  kehadiranHarian: KehadiranHarian[];
}

export interface KehadiranHarian {
  id: number;
  namaHari: string;
  tanggal: string;
  statusKehadiran: string;
  kehadiranBulananId: number;
}

export interface Note {
  id: number;
  biodataSiswaId: number;
  title: string;
  deskripsi: string;
  createdAt: string;
  updatedAt: string;
}

export interface KehadiranBulananMataPelajaran {
  id: number;
  biodataSiswaId: number;
  namaBulan: string;
  tahunAjaran: string;
  jumlahMasukPerBulan: number;
  createdAt: string;
  updatedAt: string;
  absensisMataPelajaran: AbsensisMataPelajaran[];
}

export interface AbsensisMataPelajaran {
  id: number;
  jamMasuk: string;
  status: number;
  tipeAbsenMasuk: string;
  isInsilite: number;
  deleteAt: string;
  createdAt: string;
  updatedAt: string;
  dispensasiId: number;
  biodataSiswaId: number;
  kehadiranBulananMapelId: number;
  devicesId: number;
  mataPelajaranId: number;
  kehadiranMapel: KehadiranMapel[];
  mataPelajaran: MataPelajaran;
}

export interface KehadiranMapel {
  id: number;
  namaHari: string;
  tanggal: string;
  statusKehadiran: string;
  absensisMataPelajaranId: number;
}

export interface MataPelajaran {
  id: number;
  namaMataPelajaran: string;
  kelasId: number;
  createdAt: string;
  updatedAt: string;
  sekolahId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  image?: string;
  nis: string;
  nisn?: string;
  sekolah: Sekolah;
  password: string;
  alamat: string;
  hobi: string;
  jenisKelamin: string;
  tanggalLahir: string;
  kotaId: number;
  provinceId: number;
  role: string;
  rfid: string;
  nrk: string;
  nikki: string;
  nip: string;
  nik: string;
  noTlp: string;
  lastLogin: string;
  isVerified: boolean;
  resetPasswordToken: string;
  resetPasswordExpires: string;
  verificationToken: string;
  verificationTokenExpires: string;
  devicesId: number;
  createdAt: string;
  updatedAt: string;
  isActive: number;
  sekolahId: number;
}

export interface Sekolah {
  id: number;
  namaSekolah: string;
}

export interface OrangTua {
  user: User2;
}

export interface User2 {
  name: string;
  nik: string;
}

export interface StudentCoursePresenceDataModel extends AbsensisMataPelajaran {
  periode: KehadiranBulananMataPelajaran;
}
