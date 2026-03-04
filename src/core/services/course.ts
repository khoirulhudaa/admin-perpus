import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { CourseCreationModel, CourseDataModel } from "../models/course";

export const courseService = {
  all: http.get<BaseResponse<CourseDataModel[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.courses,
    getInitialOptions,
  ),
  get: (id: number) =>
    http.get<CourseDataModel>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.courses,
      getInitialOptions,
    )({ path: String(id) }),
  delete: (id: number) =>
    http.delete<BaseResponse<CourseDataModel>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.courses,
      getInitialOptions,
    )({ path: String(id) }),
  create: (data: CourseCreationModel) => {
    return http.post<BaseResponse, CourseCreationModel>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.courses,
      getInitialOptions,
    )(data);
  },
  update: (id: number, data: CourseCreationModel) => {
    return http.put<
      { message: string; sekolahId: number },
      CourseCreationModel
    >(API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.courses, getInitialOptions)(
      data,
      { path: String(id) },
    );
  },
};
