
import { SERVICE_ENDPOINTS } from "@/core/configs/app";
import { usePaginatedQuery } from "@/features/schools/hooks/usePaginatedQuery";

interface UseStudentsProps {
  page: number;
  size: number;
  sekolahId?: number;
  kelas?: string;
}

export const useStudents = ({ page, size, sekolahId, kelas }: UseStudentsProps) => {

  // console.log("📍 Query Params:", { page, size, sekolahId, kelas });
  return usePaginatedQuery({
    queryKey: "students",
    endpoint: SERVICE_ENDPOINTS.student.list, // Sesuaikan dengan endpoint biodata siswa
    params: { sekolahId, kelas },
    page,
    size,
  });
};
