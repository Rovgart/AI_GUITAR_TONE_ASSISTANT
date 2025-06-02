import { useMemo } from "react";

export default function useFilterSearch<T>(
  itemsList: T[],
  fieldValue: string,
  getValue: (item: T) => string
) {
  return useMemo(() => {
    const result = itemsList.filter((item) =>
      getValue(item).toLowerCase().includes(fieldValue.toLowerCase())
    );

    return result;
  }, [itemsList, getValue, fieldValue]);
}
