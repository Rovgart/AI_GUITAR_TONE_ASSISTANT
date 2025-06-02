import { Box } from "@/atoms/container ";
import { Stack } from "@/atoms/ui-structures";
import { X } from "lucide-react";
import Search from "@/molecules/Search";
import { ampsList, irsList } from "@/data/index";
import { useFetchAmps } from "@/hooks/useFetchAmps";
import { useEffect } from "react";
import { FETCH_AMPS_URL, FETCH_IRS_URL } from "..";

export default function AdvancedSettings({
  isVisible,
  visibilityHandler,
}: {
  isVisible: boolean;
  registerAmps: (name: string) => void;
  registerIrs: (name: string) => void;
  visibilityHandler: () => void;
}) {
  // const { data:fetchedAmps } = useFetchAmps();
  // Some debouncing for entering texts
  // When user starts typing the list is being showed
  // When user chooses the amp it will block the possibility for typing unless click of "Edit"
  // When press edit the typing possiblity unlocks and list pops up again
  // The same for IR field considering reusable component for it
  // useEffect(() => {
  //   console.log(fetchedAmps);
  // });
  return (
    <>
      <Box
        padding="lg"
        className={`relative ${isVisible ? "block" : "hidden"}`}
      >
        <X className="absolute top-0 right-0" onClick={visibilityHandler} />
        <Stack direction="col" gap="md">
          <Search
            registerFieldName={"amp"}
            searchPlaceholder="Search your amp here"
            searchComponentId="ampName"
            endpoint={FETCH_AMPS_URL}
          />
          <Search
            registerFieldName={"ir"}
            searchPlaceholder="Search your IR here"
            searchComponentId="irName"
            endpoint={FETCH_IRS_URL}
          />
        </Stack>
      </Box>
    </>
  );
}
