import axios, { AxiosResponse } from 'axios';
import { useGlobalState } from 'contexts/GlobalStateContext';
import { useGlobalUI } from 'contexts/GlobalUIContext';
import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { ApiError, defaultResInterceptor } from 'utils/api';
import { RoutePath } from 'utils/enums';
import { UniLogResponse } from './model';

const { protocol, hostname } = window.location;
const _hostname =
  process.env.NODE_ENV === 'development' ? '10.0.30.192' : hostname;

export const axiosLOG = axios.create({
  baseURL: `${protocol}//${_hostname}:8081`
});

axiosLOG.interceptors.response.use(
  defaultResInterceptor.response,
  defaultResInterceptor.error
);

axiosLOG.interceptors.response.use((res: AxiosResponse<UniLogResponse>) => {
  if (res.data.status !== 200) {
    const temp: ApiError = {
      status: res.data.status,
      message: res.data.statusInfo,
      content: ''
    };
    try {
      temp.content = JSON.parse(res.data.entity).errorMessage;
    } catch {
      temp.content = res.data.entity;
    } finally {
      throw temp;
    }
  }
  return res;
});

/**
 * axiosLOG初始化使用
 * @description 登入逾時會清除uuid，並導向/login
 */
export function useAxiosLogInit() {
  const { push } = useHistory();
  const { setIsLoggedIn } = useGlobalState();
  const { toast } = useGlobalUI();
  const [initialized, setInitialized] = useState(false);
  const interceptor = useRef(-1);

  useEffect(() => {
    axiosLOG.interceptors.response.eject(interceptor.current);
    interceptor.current = axiosLOG.interceptors.response.use(
      res => res,
      (err: ApiError) => {
        if (err.status === 408) {
          setIsLoggedIn(false);
          axiosLOG.defaults.params = undefined;
          localStorage.removeItem('uuid');
          push(RoutePath.Login);
          toast.addToast('warn', '帳號登入逾時');
        }
        throw err;
      }
    );
    setInitialized(true);
  }, [push, setIsLoggedIn, toast]);

  return { initialized };
}
