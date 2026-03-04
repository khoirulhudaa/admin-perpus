import { BiodataSiswa, Kelas } from "./biodata";
import { SchoolDataModel } from "./schools";

export type TimestampType = string | null;

export interface UserDataModel {
  id: number;
  idKelas?: number;
  kelasId?: number;
  namaKelas?: string;
  email: string;
  password: string;
  alamat: string;
  hobi: string;
  name: string;
  jenisKelamin: string;
  tanggalLahir: string;
  kotaId: number;
  provinceId: number;
  role: string;
  rfid: string;
  nisn: string;
  nrk: string;
  nikki: string;
  image: string;
  nis: string;
  nip: string;
  nik: string;
  kelas?: Kelas;
  noTlp: string;
  lastLogin: string;
  isVerified: boolean;
  resetPasswordToken: string;
  resetPasswordExpires: string;
  verificationToken: string;
  verificationTokenExpires: string;
  devicesId: string;
  createdAt: string;
  updatedAt: string;
  isActive: number;
  sekolahId: number;
  sekolah?: {
    id: number;
    namaSekolah: number;
  };
  school?: SchoolDataModel;
  student?: BiodataSiswa;
}

export interface UserCreationModel {
  email?: string;
  password?: string;
  alamat?: string;
  hobi?: string;
  name?: string;
  jenisKelamin?: string;
  tanggalLahir?: string;
  role?: string;
  rfid?: string;
  nisn?: string;
  namaKelas?: string;
  idKelas?: number;
  kelasId?: number;
  nrk?: string;
  nikki?: string;
  image?: string;
  nis?: string;
  nip?: string;
  nik?: string;
  noTlp?: string;
  lastLogin?: string;
  isVerified?: number;
  isActive?: number;
  sekolahId?: number;
}
