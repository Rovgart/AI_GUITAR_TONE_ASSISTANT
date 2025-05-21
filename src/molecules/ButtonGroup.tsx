import type { ReactNode } from "react";
import { Stack } from "@/atoms/ui-structures";
import Box from "@/atoms/box";

export default function ButtonGroup({
  children,
  direction = "row",
}: {
  children: ReactNode;
  direction?: "col" | "row";
  className?: string;
}) {
  return (
    <Box className="w-full  ">
      <Stack justify="center" align="center" direction={direction}>
        {children}
      </Stack>
    </Box>
  );
}
