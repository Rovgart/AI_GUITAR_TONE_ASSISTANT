import { Box } from "@/atoms/container ";
import { Heading, Paragraph } from "@/atoms/typography";
import { Stack } from "@/atoms/ui-structures";

export default function Header() {
  return (
    <header className="relative">
      <Box className="w-full" padding="lg" margin="sm">
        <Stack justify="center" align="center" direction="col" gap="lg">
          <Box className="w-full  flex items-center justify-center text-center sm:text-left">
            <Heading size="4xl" level={4}>
              Guitar Tone Assistant
            </Heading>
          </Box>
          <Box className="flex justify-center items-center text-center md:text-start">
            <Paragraph size="md">
              Your guitar tone finder. Insert your guitar tone
            </Paragraph>
          </Box>
        </Stack>
      </Box>
    </header>
  );
}
