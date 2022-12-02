export interface UniLogResponse<T = string> {
  allowedMethods: string[];
  context: any;
  cookies: any;
  date: null;
  entity: T;
  entityTag: null;
  headers: any;
  language: null;
  lastModified: null;
  length: number;
  links: string[];
  location: null;
  mediaType: null;
  metadata: any;
  status: number;
  statusInfo: string;
  stringHeaders: {};
}

export interface UniLogAccessLevelInfo {
  accessLevelId: number;
  groupId: number;
  mainTitleId: number;
  mainTitleName: string;
  subTitleId: number;
  subTitleName: string;
  isClose: boolean;
  isRead: boolean;
  isWrite: boolean;
}

export interface UniLogAccountInfo {
  uuid: string;
  userLastName: string;
  userFirstName: string;
  groupId: number;

  account?: string;
  mima?: string;
  nickName?: string;
  userEmail?: string;
  groupCNName?: string;
  kibanaToken?: string;
  isOnAlarm?: boolean;
  isDelete?: boolean;
  isLocal?: boolean;
}

export interface UniLogLoginData {
  username: string;
  password: string;
}

export interface UniLogLoginParams {
  account: string;
  mima: string;
}

export interface UniLogGroupInfo {
  groupId: number;
  groupcnname: string;
}

export interface UniLogPasswordBody {
  current: string;
  new: string;
  confirm: string;
}

export interface UniLogProfileBody {
  userLastName: string;
  userFirstName: string;
  userEmail: string;
}

export interface UniLogBackupItem {
  end_time: string;
  index_name: string;
  start_time: string;
  state: string;
  zip_name: string;
}

export interface UniLogBackupRestoreBody {
  zipName: string;
  zipPwd: string;
}

export interface UniLogBackupPolicyItem {
  seq_no: number;
  primary_term: number;
  policy_name: string;
  desc: string;
  last_updated_time: string;
}

export interface UniLogBackupPolicyBody {
  policyName: string;
  policyDesc: string;
  timeType: 0 | 1 | 2 | 3;
  type: 1 | 2;
  primaryTerm?: number;
  seqNo?: number;
}

export interface UniLogBackupIndexItem {
  policy_name: string;
  action: string;
  index_name: string;
  status: boolean;
  info: string;
}

export interface UniLogBackupIndexBody {
  indexName: string;
  policyName: string;
  timeType: 0 | 1 | 2 | 3;
  zipPwd: string;
}
