/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { graduationDataModel } from "../models";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";

export const graduationService = {
    all: (params?: { sekolahId?: number, lulus?: boolean }) =>
       http.get<BaseResponse<graduationDataModel[]>>(
         API_CONFIG.baseUrl + SERVICE_ENDPOINTS.graduations.all,
         getInitialOptions,
       )({ query: params }),
    create: (data: graduationDataModel) => {
        return http.post<BaseResponse, graduationDataModel>(
        API_CONFIG.baseUrl + SERVICE_ENDPOINTS.graduations.create,
        getInitialOptions,
        )(data);
    },
};
