import axios from 'axios';

export const axiosKibana = axios.create({
  baseURL: '',
  method: 'post',
  headers: {
    'kbn-xsrf': true
  },
  auth: {
    username: 'admin',
    password: 'admin'
  }
});

axiosKibana.interceptors.response.use(res => {
  if (!res.data.rawResponse && !res.data.sheet) return Promise.reject();
  return res;
});

export const setKibanaURL = (url: string) => {
  axiosKibana.defaults.baseURL = url;
};
