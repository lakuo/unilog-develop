import { useCallback, useState } from 'react';

export function useCustomPagination(defaultSize: number = 10) {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(defaultSize);
  const [total, setTotal] = useState(0);

  const hasPrev = index > 0;
  const hasNext = index + 1 < Math.ceil(total / size);

  const gotoStart = useCallback(() => {
    setIndex(0);
  }, []);

  const gotoPrev = useCallback(() => {
    if (!hasPrev) return;
    setIndex(prev => prev - 1);
  }, [hasPrev]);

  const gotoNext = useCallback(() => {
    if (!hasNext) return;
    setIndex(prev => prev + 1);
  }, [hasNext]);

  return {
    index,
    size,
    total,
    hasPrev,
    hasNext,
    setSize,
    setTotal,
    gotoStart,
    gotoPrev,
    gotoNext
  };
}
