import { EuiSelectOption } from '@elastic/eui';
import { sha256 } from 'js-sha256';
import { axiosLOG } from './instance';
import {
  UniLogAccessLevelInfo,
  UniLogAccountInfo,
  UniLogBackupIndexBody,
  UniLogBackupIndexItem,
  UniLogBackupItem,
  UniLogBackupPolicyBody,
  UniLogBackupPolicyItem,
  UniLogBackupRestoreBody,
  UniLogGroupInfo,
  UniLogLoginData,
  UniLogLoginParams,
  UniLogPasswordBody,
  UniLogProfileBody,
  UniLogResponse
} from './model';

export function checkUUID() {
  const _uuid = localStorage.getItem('uuid');
  if (_uuid) {
    axiosLOG.defaults.params = { uuid: _uuid };
    return true;
  } else {
    return false;
  }
}

export function login(data: UniLogLoginData) {
  const params: UniLogLoginParams = {
    account: data.username,
    mima: data.password
  };
  return axiosLOG.post<UniLogResponse>('/sign/login', params).then(res => {
    if (res.data.status !== 200) throw new Error(res.data.entity);
    const accounts: UniLogAccountInfo[] = JSON.parse(res.data.entity);
    const { uuid, kibanaToken } = accounts[0];
    localStorage.setItem('uuid', uuid);
    localStorage.setItem('kibanaToken', String(kibanaToken));
    return uuid;
  });
}

export function logout() {
  const { uuid } = axiosLOG.defaults.params;
  return axiosLOG.post('/sign/logout', { uuid }).then(res => {
    axiosLOG.defaults.params = undefined;
    localStorage.removeItem('uuid');
    localStorage.removeItem('kibanaToken');
    return res;
  });
}

export function getAccessLevel(groupId?: number) {
  const url = '/accesslevel' + (groupId ? '/' + groupId : '');

  return axiosLOG.get<UniLogResponse>(url).then(res => {
    const accessLevel: UniLogAccessLevelInfo[] = JSON.parse(res.data.entity);
    console.log(accessLevel);
    return accessLevel;
  });
}

export function updateAccessLevel(accessLevel: UniLogAccessLevelInfo[]) {
  const uuid = axiosLOG.defaults.params.uuid;
  return axiosLOG.put('/accesslevel/' + uuid, accessLevel);
}

export function getGroups() {
  return axiosLOG.get<UniLogResponse>('/group').then(res => {
    const result: UniLogGroupInfo[] = JSON.parse(res.data.entity);
    const groups: EuiSelectOption[] = result.map(item => ({
      value: item.groupId,
      text: item.groupcnname
    }));
    return groups;
  });
}

export function getAccounts() {
  return axiosLOG.get('/account').then(res => {
    const accounts: UniLogAccountInfo[] = JSON.parse(res.data.entity);
    // const activeAccounts = accounts.filter(account => !account.isDelete);
    return accounts;
  });
}

export function getAccount(targetUUID?: string) {
  const uuid = targetUUID ?? axiosLOG.defaults.params.uuid;
  return axiosLOG.get('/account/' + uuid).then(res => {
    const accounts: UniLogAccountInfo[] = JSON.parse(res.data.entity);
    return accounts[0];
  });
}

export function getCurrentAccount() {
  const uuid = axiosLOG.defaults.params.uuid;
  return getAccount(uuid);
}

export function addAccount(data: UniLogAccountInfo) {
  if (data.mima) data.mima = sha256(data.mima);
  const uuid = axiosLOG.defaults.params.uuid;
  return axiosLOG.post('/account', { ...data, uuid });
}

export function editAccount(targetUUID: string, data: UniLogAccountInfo) {
  if (data.mima) data.mima = sha256(data.mima);
  return axiosLOG.put('/account/' + targetUUID, data);
}

export function deleteAccount(targetUUID: string) {
  return axiosLOG.delete('/account/' + targetUUID);
}

export function editProfile(profile: UniLogProfileBody) {
  const uuid = axiosLOG.defaults.params.uuid;
  return axiosLOG.put('/account/personal/' + uuid, profile);
}

export function changePassword(passwords: UniLogPasswordBody) {
  const body = {
    mima: sha256(passwords.current),
    newmima: sha256(passwords.new)
  };
  return axiosLOG.put('/account', body);
}

export function getKibanaDataTemplate(kibanaName: string) {
  return axiosLOG
    .get('/kibana/' + kibanaName)
    .then(res => res.data.entity as string);
}

export function getConfig(configName: string) {
  return axiosLOG
    .get('/config/' + configName)
    .then(res => res.data.entity as string);
}

export function getBackupMain(zipName: string = '') {
  return axiosLOG
    .post('/backup/main', { zipName })
    .then(res => JSON.parse(res.data.entity).data as UniLogBackupItem[]);
}

export function backupRestore(data: UniLogBackupRestoreBody) {
  return axiosLOG.post('/backup/restore', data);
}

export function getBackupPolicies(from: number, policyName: string) {
  return axiosLOG
    .post('/backup/policy_list', { from, policyName })
    .then(res => JSON.parse(res.data.entity).data as UniLogBackupPolicyItem[]);
}

export function backupPolicyDelete(policyName?: string) {
  if (!policyName) return Promise.reject();
  return axiosLOG.post('/backup/delPolicy', { policyName });
}

export function backupPolicyEdit(data: UniLogBackupPolicyBody) {
  return axiosLOG.post('/backup/newPolicy', data);
}

export function getBackupIndexList(from: number, indexName: string) {
  return axiosLOG
    .post('/backup/index_list', { from, indexName })
    .then(res => JSON.parse(res.data.entity).data as UniLogBackupIndexItem[]);
}

export function backupIndexDelete(indexName?: string, policyName?: string) {
  if (!indexName) return Promise.reject();
  if (!policyName) return Promise.reject();
  return axiosLOG.post('/backup/delIndex', { indexName, policyName });
}

export function backupIndexEdit(data: UniLogBackupIndexBody) {
  return axiosLOG.post('/backup/newIndex', data);
}
