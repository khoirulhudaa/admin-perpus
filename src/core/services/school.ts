/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import {
  SchoolCreationModel,
  SchoolDataModel,
  SchoolRegisterModel,
} from "../models/schools";
import { authService } from "./auth";

export const schoolService = {
  all: http.get<BaseResponse<SchoolDataModel[]>>(
    API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.school.schools,
    getInitialOptions,
  ),
  get: (id: number) =>
    http.get<BaseResponse<SchoolDataModel>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.schools2,
      getInitialOptions,
    )({ path: String(id) }),
  create: (data: SchoolCreationModel) => {
    const formData = new FormData();
    if (data && Object.values(data).length > 0) {
      Object.keys(data).forEach((field) => {
        const value = data[field as keyof typeof data];
        if (value) {
          formData.append(field, value as any);
        }
      });
    }

    return http.post<{ message: string; sekolahId: number }, FormData>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.createSchool,
      // getInitialOptions,
    )(formData, { contentType: "form-data" });
  },
  update: (id: number, data: SchoolCreationModel) => {
    const formData = new FormData();
    if (data && Object.values(data).length > 0) {
      Object.keys(data).forEach((field) => {
        const value = data[field as keyof typeof data];
        if (value) {
          formData.append(field, value as any);
        }
      });
    }

    return http.put<{ message: string; sekolahId: number }, FormData>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.schools2,
      getInitialOptions,
    )(formData, { contentType: "form-data", path: String(id) });
  },
  register: async (data: SchoolRegisterModel) => {
    try {
      const createRes = await schoolService.create({
        namaSekolah: data.namaSekolah,
        file: data.file,
        npsn: data.npsn,
        latitude: data.latitude,
        longitude: data.longitude,
        namaAdmin: data.namaAdmin,
        tokenModel: data.tokenModel,
        modelApiUrl: data.modelApiUrl,
        alamatSekolah: data.alamatSekolah
        // serverPerpustakaan: data.serverPerpustakaan,
      });

      const signUpRes = await authService.signup({
        name: data.namaAdmin,
        password: data.password,
        email: data.email,
        role: "admin",
        sekolahId: createRes.sekolahId,
      });
      return signUpRes;
    } catch (err: any) {
      console.log("err", err);
      throw err;
    }
  },
};
