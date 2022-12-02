import axios from 'axios';

export const axiosNOC = axios.create({
  method: 'post',
  data: {
    id: 1,
    jsonrpc: '2.0'
  }
});

export function setUniNocBaseUrl(url: string) {
  axiosNOC.defaults.baseURL = url + '/zabbix/api_jsonrpc.php';
}

axiosNOC.interceptors.response.use(value => {
  if (value.data.result) {
    return value;
  } else {
    throw value.data.error;
  }
});
