import { LoadingState } from 'components/CustomTable';
import { useGlobalUI } from 'contexts/GlobalUIContext';
import { useState, useRef, useCallback, useEffect } from 'react';

export function useBackupRequestTable<T = any>(
  name: string,
  fetcher: (from: number, name: string) => Promise<T[]>
) {
  const { toast } = useGlobalUI();
  const { addToast } = toast;
  const [loadingState, setLoadingState] = useState<LoadingState>('none');
  const index = useRef(0);
  const size = useRef(0);
  const [items, setItems] = useState<T[]>([]);

  const hasPrev = index.current > 0;
  const hasNext = true;

  const gotoPrev = () => {
    if (index.current === 0) return;
    update(-1);
  };

  const gotoNext = () => {
    update(1);
  };

  const update = useCallback<(value?: number) => Promise<T[]>>(
    (value = 0) => {
      setLoadingState(getLoadingStateByValue(value));
      const from = (index.current + value) * size.current;
      return fetcher(from, name)
        .then(res => {
          if (res.length === 0 && value === 1) {
            addToast('warn', '無資料');
            return res;
          }
          size.current = res.length > size.current ? res.length : size.current;
          index.current += value;
          setItems(res);
          return res;
        })
        .finally(() => setLoadingState('none'));
    },
    [fetcher, name, addToast]
  );

  useEffect(() => {
    update();
  }, [update]);

  return {
    update,
    tableProps: {
      loadingState,
      items,
      hasPrev,
      hasNext,
      gotoPrev,
      gotoNext
    }
  };
}

function getLoadingStateByValue(value: number): LoadingState {
  switch (value) {
    case 1:
      return 'next';
    case -1:
      return 'prev';
    default:
      return 'all';
  }
}
