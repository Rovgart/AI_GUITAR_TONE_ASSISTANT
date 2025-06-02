import Button from "@/atoms/button";
import { Box } from "@/atoms/container ";
import { Stack } from "@/atoms/ui-structures";
interface SearchResultsProps<T> {
  items: T[];
  onSelect: (item: T) => void;
  onClose: () => void;
  selectedItem?: T;
  isOpen: boolean;
  index: "amps" | "irs";
}
export default function SearchResults<T>({
  items,
  onSelect,
  onClose,
  isOpen,
  index,
}: SearchResultsProps<T>) {
  if (!isOpen || items.length === 0) return null;
  return (
    <>
      <Box
        padding="sm"
        margin="sm"
        rounded="md"
        className="h-auto absolute top-8 bg-tertiary-400 z-[30] "
      >
        <Stack
          className="h-full overflow-y-scroll gap-8"
          justify="center"
          align="center"
          direction="col"
        >
          {items.data.map((value, index) => (
            <Button
              type="button"
              onClick={() => {
                onSelect(value);
                onClose();
              }}
              key={index}
              variant="ghost"
            >
              {value.brand} {value.name}
            </Button>
          ))}
        </Stack>
      </Box>
    </>
  );
}
