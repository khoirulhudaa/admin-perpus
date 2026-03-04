export interface BaseResponse<Data = unknown> {
  status: number;
  message: string;
  data?: Data;
  success?: boolean;
}

export interface BaseResponseError {
  status: number;
  message: string;
  error: unknown;
}
