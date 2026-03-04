import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import {
  ResendOtpModel,
  ResendOtpRequestModel,
  UserDataModel,
  VerifyOtpRequestModel,
} from "../models";

export const otpService = {
  verify: http.post<BaseResponse<UserDataModel>, VerifyOtpRequestModel>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.otp.verify,
  ),
  resend: http.post<BaseResponse<ResendOtpModel>, ResendOtpRequestModel>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.otp.resend,
  ),
};
