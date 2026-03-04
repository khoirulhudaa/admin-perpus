/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import {
    provinceModel
} from "../models/province";
import { getInitialOptions } from "../utils/http";

export const provinceService = {
  all: http.get<BaseResponse<provinceModel[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.province.provinces,
    getInitialOptions,
  ),
};
