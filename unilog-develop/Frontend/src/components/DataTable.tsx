import {
  EuiDataGrid,
  EuiDataGridColumn,
  EuiDataGridSorting,
  EuiDataGridCellValueElementProps,
  EuiDataGridPaginationProps
} from '@elastic/eui';
import React, { useCallback, useMemo, useState } from 'react';

type EuiDataGridSortingColumns = EuiDataGridSorting['columns'];

interface PropsSchema<T> {
  columns: EuiDataGridColumn[];
  rows: T[];
  pagination?: Partial<EuiDataGridPaginationProps>;
}

export default function DataTable<T>(props: PropsSchema<T>) {
  let rows = props.rows;

  const {
    pagination,
    onChangeItemsPerPage,
    onChangePage,
    paginatedRows
  } = usePagination<T>(rows, props.pagination);
  rows = paginatedRows;

  const { sortingColumns, onSort, sortedRows } = useSorting(rows);
  rows = sortedRows;

  const visibleColumns = props.columns.map((column: EuiDataGridColumn) => {
    return column.id;
  });

  const renderCellValue = useCellRender(rows, pagination);

  return (
    <EuiDataGrid
      aria-label=""
      toolbarVisibility={false}
      columns={props.columns}
      columnVisibility={{
        visibleColumns,
        setVisibleColumns() {}
      }}
      rowCount={props.rows.length}
      renderCellValue={renderCellValue}
      sorting={{ columns: sortingColumns, onSort }}
      pagination={{
        ...pagination,
        onChangeItemsPerPage,
        onChangePage
      }}
    />
  );
}

function usePagination<T>(
  rows: T[],
  inputPagination?: Partial<EuiDataGridPaginationProps>
) {
  const initializePagination: EuiDataGridPaginationProps = {
    pageIndex: 0,
    pageSize: 10,
    pageSizeOptions: [10, 30, 50],
    onChangeItemsPerPage() {},
    onChangePage() {},
    ...inputPagination
  };
  const [pagination, setPagination] = useState<EuiDataGridPaginationProps>(
    initializePagination
  );

  const onChangeItemsPerPage = useCallback(
    pageSize => {
      return setPagination(pagination => {
        return {
          ...pagination,
          pageSize,
          pageIndex: 0
        };
      });
    },
    [setPagination]
  );
  const onChangePage = useCallback(
    pageIndex => {
      return setPagination(pagination => {
        return {
          ...pagination,
          pageIndex
        };
      });
    },
    [setPagination]
  );

  const paginatedRows = useMemo(() => {
    const rowStart = pagination.pageIndex * pagination.pageSize;
    const rowEnd = Math.min(rowStart + pagination.pageSize, rows.length);

    return rows.slice(rowStart, rowEnd);
  }, [rows, pagination]);

  return {
    pagination,
    onChangeItemsPerPage,
    onChangePage,
    paginatedRows
  };
}

function useSorting<T>(rows: T[]) {
  const [
    sortingColumns,
    setSortingColumns
  ] = useState<EuiDataGridSortingColumns>([]);
  const onSort = useCallback(
    sortingColumns => {
      return setSortingColumns(sortingColumns);
    },
    [setSortingColumns]
  );

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      for (let i = 0; i < sortingColumns.length; i++) {
        const column = sortingColumns[i];
        // @ts-ignore
        const aValue = a[column.id];
        // @ts-ignore
        const bValue = b[column.id];

        if (aValue < bValue) {
          return column.direction === 'asc' ? -1 : 1;
        } else if (aValue > bValue) {
          return column.direction === 'asc' ? 1 : -1;
        }
      }

      return 0;
    });
  }, [rows, sortingColumns]);

  return {
    sortingColumns,
    onSort,
    sortedRows
  };
}

function useCellRender<T>(
  rows: T[],
  pagination: Partial<EuiDataGridPaginationProps>
) {
  return useMemo(() => {
    return (cellProps: EuiDataGridCellValueElementProps) => {
      const adjustedRowIndex =
        // @ts-ignore
        cellProps.rowIndex - pagination.pageIndex * pagination.pageSize;

      const adjustedRow = rows[adjustedRowIndex] as T;

      // @ts-ignore
      return adjustedRow[cellProps.columnId] || null;
    };
  }, [rows, pagination.pageIndex, pagination.pageSize]);
}
