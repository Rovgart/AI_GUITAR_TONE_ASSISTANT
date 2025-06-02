import { useEffect, useState } from "react";

export default function useDebounce(value: T, delay: number) {
  const [debounceValue, setDebounceValue] = useState<T>(value);
  useEffect(() => {
    const initializer = setTimeout(() => {
      console.log("Initializing...");
      setDebounceValue(value);
    }, delay);
    return () => {
      console.log("Cleaning");
      clearTimeout(initializer);
    };
  }, [value, delay]);
  return debounceValue;
}
