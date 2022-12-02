import React from 'react';
import { EuiBasicTable, EuiBasicTableColumn } from '@elastic/eui';
import { Moment } from 'moment';
import useSWR from 'swr';

import DashboardLayout from 'layouts/DashboardLayout';
import { useTimeRangePicker } from 'components/TimeRangePicker';
import ResultLink from 'components/ResultLink';
import { getLogReport, LogsReport } from 'utils/logReport';

export default function LogReport() {
  const timeRangePicker = useTimeRangePicker();
  const { startTime, endTime } = timeRangePicker;
  const { loading, data } = useLogReportData(startTime, endTime);

  return (
    <DashboardLayout title="日誌報表" {...timeRangePicker}>
      <EuiBasicTable columns={columns} items={data} loading={loading} />
    </DashboardLayout>
  );
}

/** 取得日誌報表資料 */
function useLogReportData(startTime: Moment, endTime: Moment) {
  const start = startTime.toISOString();
  const end = endTime.toISOString();
  const { data, isValidating } = useSWR([start, end], getLogReport, {});

  return { loading: isValidating, data: data ?? [] };
}

/** 欄位格式，固定值故不使用hook */
const columns: EuiBasicTableColumn<LogsReport>[] = [
  {
    field: 'job.name',
    name: '排程名稱'
  },
  {
    name: '此次排程執行時間',
    render: (value: LogsReport) =>
      new Date(value.scheduled_time).toLocaleString()
  },
  {
    field: 'state',
    name: '執行結果狀態'
  },
  {
    name: '執行結果檔案',
    render: (value: LogsReport) =>
      value.state !== 'succeeded'
        ? null
        : value.result
            .replace(/[\s|[|\]|"]/g, '')
            .split(',')
            .map((fileName, i) => <ResultLink name={fileName} key={i} />)
  }
];
