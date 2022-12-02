import { axiosNOC } from './instance';
import {
  UniNocResponse,
  UniNocHostGroup,
  UniNocHost,
  UniNocHostItem,
  UniNocItemTimeline
} from './model';

export async function getNocApiKey(account: string, password: string) {
  try {
    const { id, jsonrpc } = axiosNOC.defaults.data;
    const res = await axiosNOC.post<UniNocResponse<string>>('', {
      id,
      jsonrpc,
      method: 'user.login',
      params: { user: account, password: password }
    });
    const key = res.data.result;
    axiosNOC.defaults.data = { ...axiosNOC.defaults.data, auth: key };
    return Promise.resolve(key);
  } catch (err) {
    return Promise.reject(err);
  }
}

export function getNocHostGroups() {
  return axiosNOC.post<UniNocResponse<UniNocHostGroup[]>>('', {
    ...axiosNOC.defaults.data,
    method: 'hostgroup.get',
    params: { output: ['name'], sortfield: 'name', real_hosts: true }
  });
}

export function getNocAllHosts(groupids: string[]) {
  return axiosNOC.post<UniNocResponse<UniNocHost[]>>('', {
    ...axiosNOC.defaults.data,
    method: 'host.get',
    params: { output: ['host'], groupids }
  });
}

export function getNocHostItem(host: string, name = '') {
  return axiosNOC.post<UniNocResponse<UniNocHostItem[]>>('', {
    ...axiosNOC.defaults.data,
    method: 'item.get',
    params: {
      output: ['name', 'value_type', 'hostid', 'status', 'state'],
      sortfield: 'name',
      webitems: true,
      filter: { value_type: [0, 3], host },
      search: { name }
    }
  });
}

export function getNocItemTimeline(
  itemids: string[],
  isNetWork: boolean,
  time_from: number,
  time_till: number
) {
  return axiosNOC.post<UniNocResponse<UniNocItemTimeline[]>>('', {
    ...axiosNOC.defaults.data,
    method: 'history.get',
    params: {
      output: 'extend',
      history: isNetWork ? '3' : ['0', '3'],
      itemids,
      sortfield: 'clock',
      sortorder: 'ASC',
      time_from,
      time_till
    }
  });
}
