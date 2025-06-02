import Badge from "@/atoms/badge";
import Box from "@/atoms/box";
import { Stack } from "@/atoms/ui-structures";

export default function DefaultBadgesList() {
  const DEFAULT_BADGES = [
    "Metallica",
    "Red Hot Chilli Peppers",
    "Dire Straits",
  ];
  return (
    <Box>
      <Stack>
        {DEFAULT_BADGES.map((badge) => (
          <Badge text={badge} size="small" variant="outline" />
        ))}
      </Stack>
    </Box>
  );
}
