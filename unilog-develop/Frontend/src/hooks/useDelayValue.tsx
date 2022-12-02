import { useEffect, useRef, useState } from 'react';

export function useDelayValue<T>(value: T, delay: number = 500) {
  const [newValue, setNewValue] = useState(value);
  const timeout = useRef(-1);

  useEffect(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setNewValue(value);
    }, delay);
  }, [delay, value]);

  return newValue;
}
