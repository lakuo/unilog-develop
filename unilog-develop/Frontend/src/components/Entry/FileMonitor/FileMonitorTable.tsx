import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  EuiBasicTable,
  EuiComboBoxOptionOption,
  EuiPanel,
  EuiTableFieldDataColumnType
} from '@elastic/eui';
import styled from 'styled-components';
import InnerLoading from 'components/InnerLoading';
import { loadWatchLog } from 'utils/api/kibana';
import { WatchLogHitsSrc } from 'utils/api/kibana/model';
import { dateTimeToString } from 'utils/scripts';
import { Moment } from 'moment';
import { OptionValue } from 'hooks/useEuiComboBox';

const StyledPanel = styled(EuiPanel)`
  position: relative;
  overflow: hidden;
`;

const Wrapper = styled.div`
  position: relative;
  max-height: 400px;
  overflow: auto;
  th {
    position: sticky;
    top: 0;
    background: #fff;
  }
`;

interface Props {
  timeRange: Moment[];
  hostGroup: OptionValue;
  ipList: EuiComboBoxOptionOption<string>[];
  hostIp: string[];
  encryption: string[];
}
export default function FileMonitorTable(props: Props) {
  const { timeRange, hostGroup, ipList, hostIp, encryption } = props;
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<WatchLogHitsSrc[]>([]);
  const [count, setCount] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();
  const observedEl = useRef<Element>();

  useEffect(() => {
    setLoading(true);
    const [start, end] = timeRange.map(time => time.format());
    loadWatchLog(start, end)
      .then(res => {
        tableRef.current?.scrollTo({ top: 0 });
        setItems(res);
        setCount(Math.min(10, res.length));
        tableRef.current?.scrollTo({ top: 0 });
      })
      .finally(() => setLoading(false));
  }, [timeRange]);

  useEffect(() => {
    const rows = tableRef.current?.getElementsByClassName('euiTableRowCell');
    if (!rows) return;
    if (observedEl.current) {
      observer.current?.unobserve(observedEl.current);
    }
    if (count >= items.length) return;
    const last = rows[rows.length - 1];
    observer.current?.observe(last);
    observedEl.current = last;
    observer.current = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      setCount(prev => prev + 10);
    });
  }, [count, items.length]);

  const displayItems = useMemo<WatchLogHitsSrc[]>(() => {
    let _items = items.slice(0, count);
    if (hostIp.length > 0) {
      _items = _items.filter(item => hostIp.includes(item.ip));
    } else if (hostIp.length === 0 && hostGroup) {
      _items = _items.filter(item =>
        ipList.map(ip => ip.label).includes(item.ip)
      );
    }
    if (encryption.length > 0) {
      _items = _items.filter(item => {
        for (let i = 0; i < encryption.length; i++) {
          const key = encryption[i] as keyof WatchLogHitsSrc;
          if (item[key] === 'null') return false;
        }
        return true;
      });
    }
    return _items;
  }, [count, encryption, hostGroup, hostIp, ipList, items]);

  return (
    <StyledPanel paddingSize="none">
      <Wrapper ref={tableRef}>
        <EuiBasicTable columns={columns} items={displayItems} />
      </Wrapper>
      <InnerLoading loading={loading} />
    </StyledPanel>
  );
}

const columns: EuiTableFieldDataColumnType<WatchLogHitsSrc>[] = [
  {
    field: '@timestamp',
    name: '更新時間',
    render: value => dateTimeToString(value)
  },
  { field: 'ip', name: '主機IP' },
  { field: 'file', name: '更新目錄' },
  { field: 'md5', name: 'md5' },
  { field: 'sha1', name: 'sha1' },
  { field: 'sha256', name: 'sha256' },
  { field: 'sha512', name: 'sha512' },
  { field: 'crc32', name: 'crc32' }
];
