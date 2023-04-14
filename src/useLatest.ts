import { useEffect, useRef } from "react";

function useLatest<T>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });
}

export default useLatest;
