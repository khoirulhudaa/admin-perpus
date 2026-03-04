/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import {
    SchoolDataModel
} from "../models/schools";
import { getInitialOptions } from "../utils/http";

export const scheduleService = {
  all: http.get<BaseResponse<SchoolDataModel[]>>(
    API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.schedule.schedules,
    getInitialOptions,
  ),
  get: (id: number) =>
    http.get<BaseResponse<SchoolDataModel>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.schedules,
      getInitialOptions,
    )({ path: String(id) }),
   create: (data: any) => {
     return http.post<BaseResponse, any>(
       API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.create,
       getInitialOptions,
     )(data);
   },
    delete: (id: number) =>
    http.delete<BaseResponse<any>>(
        API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.delete,
        getInitialOptions,
    )({ path: String(id) }),
  update: (id: number, data: any) => {
     return http.put<
       { message: string; sekolahId: number },
       any
     >(API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.update, getInitialOptions)(
       data,
       { path: String(id) },
     );
   },
};
