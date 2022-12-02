import axios from 'axios';

var baseURL = '';
export const setLogReportURL = (url: string) => (baseURL = url);
export const getLogReportURL = () => baseURL;

export interface LogsReportResponse {
  executions: LogsReport[];
}

export interface LogsReport {
  execution_id: string;
  state: string;
  hostname: string;
  pid: number;
  task_id: null;
  description: string;
  result: string;
  scheduled_time: string;
  updated_time: string;
  job: LogsReportJob;
}

export interface LogsReportJob {
  job_id: string;
  name: string;
  task_name: string;
  pub_args: JobPubArges;
  month: string;
  day: string;
  week: string;
  day_of_week: string;
  hour: string;
  minute: string;
}

export interface JobPubArges {
  '\u6642\u9593': string;
  kibana_IP: string;
  '\u5354\u5b9a\u985e\u5225': string;
  '\u5100\u8868\u677f\u540d\u7a31': string;
  '\u6536\u4ef6\u8005': string;
}

export function getLogReport(start: string, end: string) {
  const time_range_start = dateMinus8Hours(start);
  const time_range_end = dateMinus8Hours(end);

  return axios
    .get<LogsReportResponse>(baseURL + '/api/v1/executions', {
      params: { time_range_start, time_range_end }
    })
    .then(res => res.data.executions);
}

function dateMinus8Hours(date: string) {
  let millisecond = Date.parse(date);
  millisecond += (8 * 60 + 6) * 60 * 1000;
  return new Date(millisecond);
}
