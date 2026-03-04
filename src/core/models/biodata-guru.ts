import { UserDataModel } from "./user";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BiodataGuru {
  id: number;
  fotoTampakDepan: string;
  fotoTampakSampingKiri: string;
  fotoTampakSampingKanan: string;
  namaGuru: string;
  kode_guru: string;
  createdAt: string;
  updatedAt: string;
  userId?: number;
  mataPelajaranId?: number;
  absensis: Absensi[];
  kehadiranBulanan: KehadiranBulanan[];
  dispensasi: Dispensasi2[];
  guruPiket: any[];
  waliKelas: any[];
  mataPelajaran?: MataPelajaran;
  user?: UserDataModel;
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
  biodataSiswaId: any;
  guruId: number;
  devicesId: any;
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
  deviceId: any;
  userId: number;
  biodataSiswaId: any;
}

export interface KehadiranBulanan {
  id: number;
  biodataSiswaId: any;
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

export interface Dispensasi2 {
  id: number;
  alasan: string;
  buktiSurat: string;
  keterangan: string;
  guruId: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  createdAt: string;
  updatedAt: string;
  deviceId: any;
  userId: number;
  biodataSiswaId: any;
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
  nik: any;
  nip?: string;
  nrk?: string;
  sekolah: Sekolah;
}

export interface Sekolah {
  id: number;
  namaSekolah: string;
}
