export interface UniNocResponse<T = any> {
  id: number;
  jsonrpc: string;
  result: T;
}

export interface UniNocHostGroup {
  groupid: string;
  name: string;
}

export interface UniNocHost {
  hostid: string;
  host: string;
}

export interface UniNocHostItem {
  itemid: string;
  name: string;
  value_type: string;
  hostid: string;
  status: string;
  state: string;
}

export interface UniNocItemTimeline {
  clock: string;
  itemid: string;
  ns: string;
  value: string;
}
