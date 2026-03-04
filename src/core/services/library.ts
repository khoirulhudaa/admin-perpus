// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { http } from "@itokun99/http";
// import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
// import { libraryDataModel } from "../models";
// import { BaseResponse } from "../models/http";
// import { getInitialOptions } from "../utils/http";

// export const libraryService = {
//     all: (params?: { sekolahId?: number }) =>
//        http.get<BaseResponse<any[]>>(
//          API_CONFIG.baseUrl + SERVICE_ENDPOINTS.libraries.all,
//          getInitialOptions,
//        )({ query: params }),
//     createAbsenManual: (data: libraryDataModel) => {
//         return http.post<BaseResponse, libraryDataModel>(
//         API_CONFIG.baseUrl + SERVICE_ENDPOINTS.libraries.createAbsenManual,
//         getInitialOptions,
//         )(data);
//     },
// };



/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { libraryDataModel } from "../models";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";

export const libraryService = {
  all: async (params?: { sekolahId?: number; tanggal?: string }) => {
    const { sekolahId, tanggal } = params || {};
    const url = `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.libraries.all}${tanggal ? `?tanggal=${encodeURIComponent(tanggal)}` : ''}`;
    const response = await http.post<BaseResponse<any[]>>(
      url,
      getInitialOptions,
    )({ sekolahId });
    console.log("libraryService.all response:", response);
    return response;
  },
  createAbsenManual: (data: libraryDataModel) => {
    return http.post<BaseResponse, libraryDataModel>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.libraries.createAbsenManual,
      getInitialOptions,
    )(data);
  },
};