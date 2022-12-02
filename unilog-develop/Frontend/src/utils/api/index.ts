import { AxiosError, AxiosResponse } from 'axios';

/**
 * 將axios預設錯誤轉為統一格式(ApiError)
 * @description 需自行在axios instance使用
 */
export const defaultResInterceptor = {
  response: (res: AxiosResponse) => res,
  error: (err: AxiosError) => {
    const temp: ApiError = {
      status: 0,
      message: err.message,
      content: ''
    };
    if (err.request) {
      temp.status = err.response?.status ?? 0;
    }
    throw temp;
  }
};

export interface ApiError<T = string> {
  status: number;
  message: string;
  content: T;
}
