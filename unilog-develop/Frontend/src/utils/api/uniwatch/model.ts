export interface UniWatchItem {
  hash: string;
  ip: string;
  pid: string;
  states: string;
  watch_path: string;
}

export interface UniWatchData {
  data: UniWatchItem[];
}

export interface UniWatchGroupItem {
  note: string;
  group_id: string;
  group_name: string;
  ip: string;
}

export interface UniWatchIpList {
  ip: string[];
  group_ip: string;
}

export interface HostGroupBody {
  groupId?: string;
  groupName: string;
  ip?: { label: string }[];
  note: string;
}

export interface UniWatchGroupItem2 {
  group_id: string;
  group_name: string;
}
