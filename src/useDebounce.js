import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 300) {
  // Wrapped in a function so a function passed as `value` is stored as-is
  // instead of being called as a lazy initializer or state updater.
  const [debouncedValue, setDebouncedValue] = useState(() => value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(() => value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
