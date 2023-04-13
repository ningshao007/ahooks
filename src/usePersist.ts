import { useRef, useCallback, useEffect } from "react";

export default function usePersistFn<T extends (...args: any[]) => any>(
  fn: T
): T {
  const fnRef = useRef(fn);

  const persistFn = useCallback(
    (...args: any[]) => {
      return fnRef.current(...args);
    },
    [fnRef]
  );

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return persistFn as T;
}
