export interface VerifyOtpRequestModel {
  code?: string;
}

export interface ResendOtpRequestModel {
  email?: string;
}

export interface ResendOtpModel {
  email: string;
  newVerificationToken: string;
  newVerificationTokenExpires: string;
}
