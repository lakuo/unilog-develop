import { EuiTableSortingType } from '@elastic/eui';
import {
  Criteria,
  EuiBasicTableColumn
} from '@elastic/eui/src/components/basic_table/basic_table';
import { LoadingState } from 'components/CustomTable';
import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useCustomPagination } from './useCustomPagination';

export interface CustomTableOptions<T> {
  size?: number;
  filter?: (item: T) => boolean;
  onUpdate?: (items: T[]) => void;
  selection?: {
    onSelectionChange: (selectedItems: T[]) => void;
    initialSelected: T[];
  };
}

export function useCustomTable<T = any>(
  loadingState: LoadingState,
  setLoadingState: (value: SetStateAction<LoadingState>) => void,
  fetcher: () => Promise<T[]>,
  columns: EuiBasicTableColumn<T>[],
  sortField: keyof T,
  options?: CustomTableOptions<T>
) {
  const {
    index,
    size,
    setTotal,
    hasPrev,
    hasNext,
    gotoStart,
    gotoPrev,
    gotoNext
  } = useCustomPagination(options?.size);
  const [items, setItems] = useState<T[]>([]);
  const [sorting, setSorting] = useState<EuiTableSortingType<T>>({
    sort: {
      field: sortField,
      direction: 'asc'
    }
  });

  const displayItems = useMemo(() => {
    let _items: T[] = items;
    if (options?.filter) {
      _items = _items.filter(options.filter);
    }
    const desc = sorting.sort?.direction === 'desc';
    _items = _items.sort((a, b) => (a > b ? 1 : -1) * (desc ? 1 : -1));
    const range = [index * size, index * size + size];
    _items = _items.filter((_, i) => i >= range[0] && i < range[1]);
    return _items;
  }, [index, items, options, size, sorting.sort]);

  const onUpdate = useCallback<(items: T[]) => void>(
    items => {
      if (options?.onUpdate) {
        options.onUpdate(items);
      }
    },
    [options]
  );

  const update = useCallback(() => {
    setLoadingState(prev => (prev === 'none' ? 'all' : prev));
    fetcher()
      .then(res => {
        setTotal(res.length);
        setItems(res);
        onUpdate(res);
      })
      .catch(() => {
        setTotal(0);
        setItems([]);
        onUpdate([]);
      })
      .finally(() => setLoadingState('none'));
  }, [fetcher, onUpdate, setLoadingState, setTotal]);

  const onChange = (criteria: Criteria<T>) => {
    if (!criteria.sort) return;
    setSorting({ sort: criteria.sort });
  };

  const _gotoPrev = () => {
    if (!hasPrev) return;
    gotoPrev();
  };

  const _gotoNext = () => {
    if (!hasNext) return;
    gotoNext();
  };

  useEffect(() => {
    update();
  }, [update]);

  return {
    update,
    gotoStart,
    tableProps: {
      loadingState,
      hasPrev,
      hasNext,
      gotoPrev: _gotoPrev,
      gotoNext: _gotoNext,
      items: displayItems,
      columns,
      sorting,
      onChange,
      selection: options?.selection
    }
  };
}
