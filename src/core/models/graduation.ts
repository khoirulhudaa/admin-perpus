export interface Kelas {
    id: number;
    namaKelas?: string;
    kodeKelas?: string | null;
    level?: string;
    sekolahId?: number;
    createdAt?: string;
    updatedAt?: string;
    deleteAt?: string | null;
  }
  
  export interface User {
    id?: number;
    name?: string;
    email?: string;
    nis?: string;
    nisn?: string;
    rfid?: string;
    image?: string;
    sekolahId?: number;
    lulus?: boolean;
    // Tambahkan properti lain sesuai kebutuhan
  }
  
  export interface graduationDataModel {
    kelas: Kelas[];
    lulus: boolean;
    user: User;
  }