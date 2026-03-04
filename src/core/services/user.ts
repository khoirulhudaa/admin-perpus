import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { getInitialOptions } from "../utils/http";
import { BaseResponse } from "../models/http";
import { UserCreationModel, UserDataModel } from "../models/user";
import { Profile } from "../models/profile";

export const userService = {
  getProfile: http.get<BaseResponse<Profile>>(
    `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.user.profile}`,
    getInitialOptions,
  ),
  updateProfile: http.post(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.profile}`,
    getInitialOptions,
  ),
  updatePhoto: http.post(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.photo}`,
    getInitialOptions,
  ),
  changePassword: http.post(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.changePassword}`,
    getInitialOptions,
  ),
  getUserDetail: (id: number) =>
    http.get<BaseResponse<UserDataModel>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.user}`,
      getInitialOptions,
    )({ path: String(id) }),
  getAdmin: http.get<BaseResponse<UserDataModel[]>>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.admin}`,
    getInitialOptions,
  ),
  updateUser: (userId: number, req: UserCreationModel) => {
    return http.put<BaseResponse<UserDataModel>, UserCreationModel>(
      `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.user.user}`,
      getInitialOptions,
    )(req, { path: String(userId) });
  },
  upStudent: (userId: number, req: FormData) => {
    console.log('reqqqq', req)
    return http.put<BaseResponse<UserDataModel>, FormData>(
      `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.user.updateStudent}`,
      getInitialOptions,
    )(req, { path: String(userId) });
  },
  // Test untuk edit guru
  updateTeacher: (userId: number, req: UserCreationModel) => {
    return http.put<BaseResponse<UserDataModel>, UserCreationModel>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.update}`,
      getInitialOptions,
    )(req, { path: String(userId) });
  },

  getParents: http.get<BaseResponse<UserDataModel[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.users.parents,
    getInitialOptions,
  ),
};
