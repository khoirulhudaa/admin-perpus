
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { ClassroomDataModel, ClassroomCreationModel } from "../models";

export const taskServices = {
  all: (params?: { sekolahId?: number }) =>
    http.get<BaseResponse<ClassroomDataModel[]>>(
      API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.task.getTask,
      getInitialOptions,
    )({ query: params }),
  get: (id: number) =>
    http.get<BaseResponse<ClassroomDataModel>>(
      API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.task.getTaskId,
      getInitialOptions,
    )({ path: String(id) }),
  delete: (id: number) =>
    http.delete<BaseResponse<ClassroomDataModel>>(
      API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.task.deletTugasById,
      getInitialOptions,
    )({ path: String(id) }),
  create: (data: ClassroomCreationModel) => {
    return http.post<
      { message: string; sekolahId: number },
      ClassroomCreationModel
    >(
      API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.task.createTask,
      getInitialOptions,
    )(data);
  },
  update: (id: number, data: ClassroomCreationModel) => {
    return http.put<
      { message: string; sekolahId: number },
      ClassroomCreationModel
    >(
      API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.task.updateTaskById,
      getInitialOptions,
    )(data, { path: String(id) });
  },
};
