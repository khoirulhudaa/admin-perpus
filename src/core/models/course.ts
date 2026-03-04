import { BiodataGuru } from "./biodata-guru";
import { ClassroomDataModel } from "./classroom";

export interface CourseDataModel {
  id: number;
  namaMataPelajaran: string;
  kelasId?: number;
  createdAt: string;
  updatedAt: string;
  sekolahId: number;
  guru: BiodataGuru[];
  kelas?: ClassroomDataModel;
  sekolah: {
    id: number;
    namaSekolah: string;
    namaAdmin: string;
  };
}

export interface CourseCreationModel {
  namaMataPelajaran?: string;
  sekolahId?: number;
  kelasId?: number;
}
