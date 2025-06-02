import Button from "@/atoms/button";
import { Box } from "@/atoms/container ";
import { Paragraph, Heading } from "@/atoms/typography";
import { Stack } from "@/atoms/ui-structures";

type LLMResponseT = {
  band: string;
  description: string;
  amp: string;
  ir: string;
};

type LLMResponseProps = {
  response: LLMResponseT;
};

export default function LLMResponse({ response }: LLMResponseProps) {
  return (
    <Box
      shadow="xl"
      rounded="lg"
      padding="xl"
      margin="lg"
      className=" text-center max-w-2xl mx-auto"
    >
      <Stack direction="col" gap="lg" align="center">
        <Heading level={2} size="2xl">
          {response.band}
        </Heading>

        <Paragraph size="lg" className="text-muted-foreground">
          {response.description}
        </Paragraph>

        <Box>
          <Stack direction="row" justify="center" align="center" gap="sm">
            <Button variant="danger" type="button" size="sm">
              AMP: {response.amp}
            </Button>
            <Button type="button" variant="danger" size="sm">
              AMP: {response.ir}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
