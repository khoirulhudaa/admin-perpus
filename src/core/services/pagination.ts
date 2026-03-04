import { API_CONFIG, SERVICE_ENDPOINTS } from "@/core/configs/app";
import { StudentPaginationResponse } from "@/core/models/pagination";
import { getInitialOptions } from "@/core/utils/http";
import { withQuery } from "../utils/withQuery";

export interface GetPaginatedStudentParams {
  page: number;
  size: number;
  sekolahId?: number;
  idKelas?: number;
  keyword?: string;
  statusKehadiran?: string;
}
export const studentService = {
  getPaginated: async (params: GetPaginatedStudentParams): Promise<StudentPaginationResponse> => {
    const query = {
      page: params.page,
      size: params.size,
      ...(params.sekolahId && { sekolahId: params.sekolahId }),
      ...(params.idKelas !== undefined && { idKelas: params.idKelas }),
      ...(params.keyword && { keyword: params.keyword }),
      // ...(params.statusKehadiran && { statusKehadiran: params.statusKehadiran }),
    };

    const url = withQuery(
      `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.student.list}`,
      query
    );

    const options = getInitialOptions(); // ✅ Sudah include bearerToken

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${options.bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    return {
      students: json.data,
      pagination: json.pagination,
    };
  },
};
  
