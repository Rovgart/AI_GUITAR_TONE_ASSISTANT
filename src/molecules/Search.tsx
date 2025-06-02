import { Box } from "@/atoms/container ";
import SearchResults from "./SearchResults";
import SearchInput from "./SearchInput";
import useSearch from "@/hooks/useSearch";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
interface SearchPropsI<T> {
  searchComponentId: string;
  itemsList: T[];
  getValue: (item: T) => string;
  searchPlaceholder?: string;
  minSearchLength?: number;
  registerFieldName: string;
  endpoint: string;
}
export default function Search<T>({
  searchComponentId,
  endpoint,
  searchPlaceholder,
  registerFieldName,
}: SearchPropsI<T>) {
  const { watch } = useFormContext();
  const registerValue = watch(registerFieldName);

  const { handleSearch, handleSelect, close, isOpen, filteredItems } =
    useSearch(endpoint, registerValue);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const onItemSelect = (item: T) => {
    const selected = handleSelect(item.name);
    setSelectedItem(item.name);
    console.log(selected);
  };

  return (
    <Box className="relative">
      <SearchInput
        isOpen={isOpen}
        registerFieldName={registerFieldName}
        choice={selectedItem}
        id={searchComponentId}
        placeholder={searchPlaceholder}
        onSearch={handleSearch}
      />
      <SearchResults
        onSelect={onItemSelect}
        items={filteredItems}
        onClose={close}
        isOpen={isOpen}
      />
    </Box>
  );
}
