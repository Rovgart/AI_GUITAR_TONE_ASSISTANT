import FormField from "@/molecules/FormField";
import { FormProvider, useForm } from "react-hook-form";
import DefaultBadgesList from "./DefaultBadgesList";
import { Stack } from "@/atoms/ui-structures";
import Button from "@/atoms/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateFormSchema } from "@/schemas";
import { Box } from "@/atoms/container ";

import { Heading, Paragraph } from "@/atoms/typography";

import { useError } from "@/hooks/useError";
import { useGenerateTone } from "@/hooks/useGenerateQuery";
import Loader from "@/molecules/Loader";
import LLMResponse from "./LLMResponse";
export default function GenerateForm() {
  const { handleError } = useError();
  const generateTone = useGenerateTone();
  const handleGenerate = (data) => {
    generateTone.mutate(data);
  };

  const methods = useForm({
    resolver: zodResolver(generateFormSchema, {}),
    defaultValues: {
      band: "",
    },
  });

  const submitHandler = (data) => {
    try {
      handleGenerate(data);
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <Box>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(submitHandler)}
          className="mt-8 p-4"
        >
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
          <Box padding="md" className="w-1/2 mx-auto">
            <Stack direction="col" justify="center" align="center">
              <FormField
                {...methods.register("band")}
                id="amp-field"
                placeholder="Enter the band name"
                error={methods.formState.errors.band?.message}
              />

              <DefaultBadgesList />
              <Button
                disabled={generateTone.isPending}
                type="submit"
                size="md"
                variant="primary"
              >
                Generate
              </Button>
            </Stack>
          </Box>
        </form>
      </FormProvider>
      {generateTone.isPending && <Loader />}
      {generateTone.data && <LLMResponse response={generateTone.data} />}
    </Box>
  );
}
