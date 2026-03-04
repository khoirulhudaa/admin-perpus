export interface LoginRequestModel {
  email: string;
  password: string;
}

export interface LoginResponseDataModel {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: number;
  isVerified: boolean;
  tokenOtp: string;
  token: string;
  sekolah: number;
  message: string;
}

export interface AdminRegisterModel {
  email?: string;
  name?: string;
  password?: string;
  role?: string;
  sekolahId?: number;
}

export interface ForgotPasswordModel {
  email?: string;
}

export interface ResetPasswordModel {
  password?: string;
}

export interface UserRegisterResponseModel {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
    verificationToken: string;
    verificationTokenExpires: string;
  };
}
