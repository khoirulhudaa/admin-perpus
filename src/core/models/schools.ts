export interface SchoolDataModel {
  id: number;
  npsn: string;
  namaSekolah: string;
  namaAdmin: string;
  latitude: number;
  longitude: number;
  file: string;
  modelApiUrl?: string;
  nameProvince?: string;
  province: { name: string, id: number } | null | undefined; // Province adalah objek dengan properti name  provinceId?: number | null;
  provinceId: number | null;
  tokenModel?: string;
  serverSatu?: string;
  serverDua?: string;
  serverTiga?: string;
  serverPerpustakaan?: string;
  visiMisi?: string;
  namaPerpustakaan?: string;
  active: number;
  createdAt: string;
  updatedAt: string;
  alamatSekolah?: string;
  ttdKepalaSekolah?: string | null;
  urlYutubeFirst?: string | null;
  urlYutubeSecond?: string | null;
  urlYutubeThird?: string | null;
}

export interface SchoolCreationModel {
  npsn?: string;
  namaSekolah?: string;
  namaAdmin?: string;
  latitude?: number;
  longitude?: number;
  modelApiUrl?: string;
  tokenModel?: string;
  file?: File;
  serverPerpustakaan?: string;
  serverSatu?: string;
  serverDua?: string;
  serverTiga?: string;
  ttdKepalaSekolah?: string;
  active?: number;
  alamatSekolah?: string;
}

export interface SchoolRegisterModel extends SchoolCreationModel {
  email?: string;
  password?: string;
  role?: string;
  sekolahId?: number;
}

export interface School {
  id: number;
  latitude: number;
  longitude: number;
  namaSekolah: string;
  alamatSekolah: string;
}

export interface SchoolData {
  lat: number;
  lng: number;
  namaSekolah: string;
  alamatSekolah: string;
}