export interface provinceModel {
    id: number;
    name: string;
  }
  
  export interface BaseResponse<T> {
    data: T;
    status?: string;
    message?: string;
  }