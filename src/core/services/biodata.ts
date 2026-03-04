// import { http } from "@itokun99/http";
// import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
// import { BaseResponse } from "../models/http";
// import { getInitialOptions } from "../utils/http";
// import { BiodataSiswa } from "../models/biodata";
// import { BiodataGuru } from "../models/biodata-guru";

// export const biodataService = {
//   attendanceDaily: ({ page = 1, limit = 20, namaKelas }: { page?: number; limit?: number; namaKelas?: string }) =>
//     http.get<BaseResponse<any[]>>(
//       `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.attendanceNew}`,
//       getInitialOptions
//     )({
//       params: {
//         page,
//         limit,
//         filter: 'harian',
//         ...(namaKelas && { namaKelas }),
//       },
//     }),
//   attedanceMonth: ({ page = 1, limit = 20, namaKelas }: { page?: number; limit?: number; namaKelas?: string }) =>
//     http.get<BaseResponse<any[]>>(
//       `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.attendanceNew}`,
//       getInitialOptions
//     )({
//       params: {
//         page,
//         limit,
//         filter: 'bulanan',
//         ...(namaKelas && { namaKelas }),
//       },
//     }),
//   attedanceYear: ({ page = 1, limit = 20, namaKelas }: { page?: number; limit?: number; namaKelas?: string }) =>
//     http.get<BaseResponse<any[]>>(
//       `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.attendanceNew}`,
//       getInitialOptions
//     )({
//       params: {
//         page,
//         limit,
//         filter: 'tahunan',
//         ...(namaKelas && { namaKelas }),
//       },
//     }),
//   absensiByUserId: (
//     id: number,
//     filter: 'harian' | 'bulanan' | 'tahunan' = 'bulanan',
//     page: number = 1,
//     limit: number = 10
//   ) =>
//     http.get<BaseResponse<any[]>>(
//       `${API_CONFIG.baseUrlOld}/api/riwayat-absensi`,
//       getInitialOptions
//     )({
//       params: { filter, page, limit, targetUserId: id },
//     }),
//   siswa: http.get<BaseResponse<BiodataSiswa[]>>(
//     API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.biodata.siswa,
//     getInitialOptions,
//   ),
//   checkAllAttendances: http.get<BaseResponse<BiodataSiswa[]>>(
//     API_CONFIG.baseUrl + SERVICE_ENDPOINTS.biodata.allAttedance,
//     getInitialOptions
//   ),
//   siswaById: (id: number) =>
//     http.get<BaseResponse<BiodataSiswa>>(
//       API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.biodata.siswa,
//       getInitialOptions
//     )({ path: String(id) }),
//   guru: http.get<BaseResponse<BiodataGuru[]>>(
//     `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.guru}`,
//     getInitialOptions
//   ),
//   checkAttendance: (id: number | string) =>
//     http.get<BaseResponse<BiodataSiswa>>(
//       `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.biodata.attedance}`,
//       getInitialOptions
//     )({ path: String(id) }),
//   checkAttendanceOld: () =>
//     http.get<BaseResponse<BiodataSiswa>>(
//       `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.attedanceOld}`,
//       getInitialOptions
//     )(),
//   guruById: (id: number) =>
//     http.get<BaseResponse<BiodataGuru>>(
//       `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.teacher.detail}`,
//       getInitialOptions
//     )({ path: String(id) }),
// };



import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { BiodataSiswa } from "../models/biodata";
import { BiodataGuru } from "../models/biodata-guru";

export const biodataService = {
  // attendanceDaily: ({ page = 1, limit = 20, namaKelas }: { page?: number; limit?: number; namaKelas?: string }) =>
  //   http.get<BaseResponse<any[]>>(
  //     `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.attendanceNew}`,
  //     getInitialOptions
  //   )({
  //     params: {
  //       page,
  //       limit,
  //       filter: 'harian',
  //       ...(namaKelas && { namaKelas }),
  //     },
  //   }),
  // attedanceMonth: ({ page = 1, limit = 20, namaKelas }: { page?: number; limit?: number; namaKelas?: string }) =>
  //   http.get<BaseResponse<any[]>>(
  //     `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.attendanceNew}`,
  //     getInitialOptions
  //   )({
  //     params: {
  //       page,
  //       limit,
  //       filter: 'bulanan',
  //       ...(namaKelas && { namaKelas }),
  //     },
  //   }),
  // attedanceYear: ({ page = 1, limit = 20, namaKelas }: { page?: number; limit?: number; namaKelas?: string }) =>
  //   http.get<BaseResponse<any[]>>(
  //     `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.attendanceNew}`,
  //     getInitialOptions
  //   )({
  //     params: {
  //       page,
  //       limit,
  //       filter: 'tahunan',
  //       ...(namaKelas && { namaKelas }),
  //     },
  //   }),
  attendanceDaily: ({ page = 1, limit = 20, kelasId, namaKelas }: { page?: number; limit?: number; kelasId?: string; namaKelas?: string }) =>
    http.get<BaseResponse<any[]>>(
      `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.attendanceNew}`,
      getInitialOptions
    )({
      params: {
        page,
        limit,
        filter: 'harian',
        ...(kelasId && { kelasId }),
        ...(namaKelas && { namaKelas }),
      },
    }),

  attedanceMonth: ({ page = 1, limit = 20, kelasId, namaKelas }: { page?: number; limit?: number; kelasId?: string; namaKelas?: string }) =>
    http.get<BaseResponse<any[]>>(
      `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.attendanceNew}`,
      getInitialOptions
    )({
      params: {
        page,
        limit,
        filter: 'bulanan',
        ...(kelasId && { kelasId }),
        ...(namaKelas && { namaKelas }),
      },
    }),

  attedanceYear: ({ page = 1, limit = 20, kelasId, namaKelas }: { page?: number; limit?: number; kelasId?: string; namaKelas?: string }) =>
    http.get<BaseResponse<any[]>>(
      `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.attendanceNew}`,
      getInitialOptions
    )({
      params: {
        page,
        limit,
        filter: 'tahunan',
        ...(kelasId && { kelasId }),
        ...(namaKelas && { namaKelas }),
      },
    }),
  absensiByUserId: (
    id: number,
    filter: 'harian' | 'bulanan' | 'tahunan' = 'bulanan',
    page: number = 1,
    limit: number = 10
  ) =>
    http.get<BaseResponse<any[]>>(
      `${API_CONFIG.baseUrlOld}/api/riwayat-absensi`,
      getInitialOptions
    )({
      params: { filter, page, limit, targetUserId: id },
    }),
  siswa: http.get<BaseResponse<BiodataSiswa[]>>(
    API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.biodata.siswa,
    getInitialOptions,
  ),
  checkAllAttendances: http.get<BaseResponse<BiodataSiswa[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.biodata.allAttedance,
    getInitialOptions
  ),
  siswaById: (id: number) =>
    http.get<BaseResponse<BiodataSiswa>>(
      API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.biodata.siswa,
      getInitialOptions
    )({ path: String(id) }),
  guru: http.get<BaseResponse<BiodataGuru[]>>(
    `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.guru}`,
    getInitialOptions
  ),
  checkAttendance: (id: number | string) =>
    http.get<BaseResponse<BiodataSiswa>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.biodata.attedance}`,
      getInitialOptions
    )({ path: String(id) }),
  checkAttendanceOld: () =>
    http.get<BaseResponse<BiodataSiswa>>(
      `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.biodata.attedanceOld}`,
      getInitialOptions
    )(),
  guruById: (id: number) =>
    http.get<BaseResponse<BiodataGuru>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.teacher.detail}`,
      getInitialOptions
    )({ path: String(id) }),
};