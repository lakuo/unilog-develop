import { AxiosResponse } from 'axios';
import { axiosLOG } from '../unilog/instance';
import { UniLogResponse } from '../unilog/model';
import {
  HostGroupBody,
  UniWatchGroupItem,
  UniWatchGroupItem2,
  UniWatchIpList,
  UniWatchItem
} from './model';

export function getWatchData(groupId: string = '') {
  return axiosLOG
    .post<UniLogResponse>('/watch/watchData', { groupId })
    .then(res => JSON.parse(res.data.entity).data as UniWatchItem[]);
}

export function getGroupData() {
  return axiosLOG
    .post<UniLogResponse>('/watch/groupData')
    .then(res => JSON.parse(res.data.entity).data as UniWatchGroupItem[]);
}

export function getWatchIpList(group_id: string = '') {
  return axiosLOG
    .post<UniLogResponse>('/watch/watchIpList', { group_id })
    .then(res => JSON.parse(res.data.entity) as UniWatchIpList);
}

export function testWatchIP(ip: string) {
  return axiosLOG.post<UniLogResponse>('/watch/newWatch', { ip, type: 0 });
}

export function getGroupList() {
  return axiosLOG
    .post<UniLogResponse>('/watch/groupList')
    .then(res => JSON.parse(res.data.entity).data as UniWatchGroupItem2[]);
}

export interface AddUniWatchData {
  ip: string;
  watchPath: string;
  hash: {
    [key: string]: boolean;
  };
}
export function addWatchData(data: AddUniWatchData) {
  const hash = Object.keys(data.hash)
    .filter(key => data.hash[key])
    .join(',');
  if (hash.length === 0) {
    return new Promise<AxiosResponse<UniLogResponse>>((_, reject) => {
      reject({
        status: 403,
        message: '須選擇至少一種加密方式',
        content: ''
      });
    });
  }
  return axiosLOG.post<UniLogResponse>('/watch/newWatch', {
    ip: data.ip,
    watchPath: data.watchPath,
    hash,
    type: 1
  });
}

export function addHostGroup(body: HostGroupBody) {
  const { groupName, ip, note } = body;
  return axiosLOG.post('/watch/souGroup', {
    groupId: '',
    groupName,
    ip: ip ? ip.map(item => item.label).join(',') : '',
    note,
    type: '1'
  });
}

export function editHostGroup(body: HostGroupBody) {
  const { groupId, groupName, ip, note } = body;
  return axiosLOG.post('/watch/souGroup', {
    groupId: groupId ?? '',
    groupName,
    ip: ip ? ip.map(item => item.label).join(',') : '',
    note,
    type: '2'
  });
}

export function deleteWatchData(info: { pid: string; ip: string }) {
  return axiosLOG.post('/watch/delWatch', { ...info });
}

export function deleteHostGroup(groupId: string) {
  return axiosLOG.post('/watch/delGroup', { groupId });
}
