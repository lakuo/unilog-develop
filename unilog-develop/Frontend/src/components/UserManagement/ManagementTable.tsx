import React, { useCallback, useState } from 'react';
import { Direction, EuiBasicTable, EuiBasicTableColumn } from '@elastic/eui';
import { Criteria } from '@elastic/eui/src/components/basic_table/basic_table';
import { Pagination } from '@elastic/eui/src/components/basic_table/pagination_bar';

interface Props {
  loading: boolean;
  columns: EuiBasicTableColumn<any>[];
  items: any[];
  pagination: Pagination;
  sort: Sorting;
  onTableChange: (value: Criteria<any>) => void;
  onSelectionChange: (selection: any[]) => void;
}

export interface Sorting {
  field: string;
  direction: Direction;
}

export default function ManagementTable(props: Props) {
  const { loading, columns, items, pagination, sort, onTableChange } = props;

  return (
    <EuiBasicTable
      loading={loading}
      sorting={{ sort: sort }}
      items={items}
      columns={columns}
      pagination={pagination}
      onChange={onTableChange}
    />
  );
}

export function useManagementTable() {
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 5,
    totalItemCount: 5,
    pageSizeOptions: [5, 10, 20]
  });

  const [sort, setSort] = useState<{ field: string; direction: Direction }>({
    field: '',
    direction: 'asc'
  });

  const onTableChange = (value: Criteria<any>) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: value.page?.index ?? prev.pageIndex,
      pageSize: value.page?.size ?? prev.pageSize
    }));

    if (!value.sort) return;
    setSort({
      field: String(value.sort?.field),
      direction: value.sort?.direction
    });
  };

  const setTotal = useCallback((total: number) => {
    setPagination(prev => ({ ...prev, totalItemCount: total }));
  }, []);

  return { pagination, sort, onTableChange, setTotal };
}
