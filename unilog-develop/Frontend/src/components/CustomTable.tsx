import {
  EuiBasicTable,
  EuiSpacer,
  EuiFlexGroup,
  EuiButton
} from '@elastic/eui';
import { EuiBasicTableProps } from '@elastic/eui/src/components/basic_table/basic_table';
import React from 'react';

export type LoadingState = 'none' | 'all' | 'prev' | 'next';

type Props<T = any> = EuiBasicTableProps<T> & {
  loadingState: LoadingState;
  hasPrev: boolean;
  hasNext: boolean;
  gotoPrev: () => void;
  gotoNext: () => void;
};
export default function CustomTable(props: Props) {
  const {
    loadingState,
    hasPrev,
    hasNext,
    gotoPrev,
    gotoNext,
    ...tableProps
  } = props;
  const loading = loadingState !== 'none';

  return (
    <div>
      <EuiBasicTable {...{ loading, ...tableProps }} />
      <EuiSpacer size="xs" />
      <EuiFlexGroup justifyContent="flexEnd" style={{ margin: 0 }}>
        <EuiButton
          onClick={gotoPrev}
          disabled={!hasPrev || loading}
          isLoading={loadingState === 'prev'}
        >
          上一頁
        </EuiButton>
        <div style={{ width: '16px' }} />
        <EuiButton
          onClick={gotoNext}
          disabled={!hasNext || loading}
          isLoading={loadingState === 'next'}
        >
          下一頁
        </EuiButton>
      </EuiFlexGroup>
    </div>
  );
}
