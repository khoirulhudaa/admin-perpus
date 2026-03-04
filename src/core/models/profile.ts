import { UserDataModel } from "./user";

export interface Profile {
  user: UserDataModel;
}

export interface User {
  id: number;
  email: string;
  alamat: string;
  hobi: string;
  jenisKelamin: string;
  orangTua: string[];
  kotaId: string;
  provinceId: string;
  tanggalLahir: string;
  name: string;
  role: string;
  nis: string;
  nip: string;
  nik: string;
  nisn: string;
  nikki: string;
  nrk: string;
  image: string;
  noTlp: string;
  sekolahId: string;
  lastLogin: string;
  isVerified: boolean;
  resetPasswordExpires: string;
  resetPasswordToken: string;
  verificationToken: string;
  isActive: number;
  sekolah: string;
  devices: Devices;
}

export interface Devices {
  id: number;
  namaDevice: string;
  ip: string;
  deskripsi: string;
  tokenFcm: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  deleteAt: string;
}
