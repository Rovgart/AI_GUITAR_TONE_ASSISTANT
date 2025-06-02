import { useState } from "react";

import useDebounce from "./useDebounce";
import { useQuery } from "@tanstack/react-query";

export default function useSearch<T>(endpoint: string, fieldValue: string) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setIsSelected] = useState(false);
  const debouncedValue = useDebounce(fieldValue, 700);
  const { data: filteredItems = [] } = useQuery<T[]>({
    queryKey: ["search", debouncedValue],
    queryFn: async () => {
      if (!debouncedValue) return [];
      const res = await fetch(`${endpoint}/${debouncedValue}`);
      const data = await res.json();
      return data;
    },
    enabled: !!debouncedValue,
  });

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsOpen(searchQuery.length > 0);
  };

  const handleSelect = (item: T) => {
    setQuery(item);
    setIsOpen(false);
    setIsSelected(true);
    return item;
  };
  const close = () => setIsOpen(false);

  return {
    query,
    filteredItems,
    isOpen,
    handleSearch,
    selected,
    handleSelect,
    close,
  };
}
