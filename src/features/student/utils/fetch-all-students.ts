import { API_CONFIG, SERVICE_ENDPOINTS } from "@/core/configs";
import axios from "axios";

export interface Student {
  id: number;
  name: string;
  nis: string;
  nisn: string;
  namaKelas: string | null;
  statusKehadiran?: string; // For daily attendance
}

export interface StudentPaginationResponse {
  students: Student[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export const fetchAllStudents = async (params: Omit<any, 'page' | 'size'>): Promise<Student[]> => {
  const { sekolahId, idKelas, keyword } = params;
  const pageSize = 100; // Large page size to minimize requests
  let allStudents: Student[] = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    while (currentPage <= totalPages) {
      const response = await axios.get(`${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.student.list}`, {
        params: {
          page: currentPage,
          size: pageSize,
          sekolahId,
          idKelas,
          keyword,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      
      const data: StudentPaginationResponse = response.data;
      console.log('data.students-all', data.data)
      console.log(`${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.student.list}`)
      allStudents = [...allStudents, ...data.data];
      totalPages = data.pagination.totalPages;
      currentPage++;
    }

    console.log(`Fetched ${allStudents.length} students`);
    return allStudents;
  } catch (error) {
    console.error("Error fetching all students:", error);
    throw new Error("Failed to fetch all students");
  }
};
