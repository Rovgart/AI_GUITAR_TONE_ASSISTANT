import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useError } from "./useError";
import { fetchGenerateTone } from "@/api";
// Types
interface GenerateToneRequest {
  // Add your request properties here based on what your API expects
  text?: string;
  style?: string;
  mood?: string;
  // ... other properties
}

interface GenerateToneResponse {
  band: string;
  message: string;
}

type fetchGenerateToneT = (
  data: GenerateToneRequest
) => Promise<GenerateToneResponse>;
interface UseGenerateToneOptions {
  onSuccess?: (data: GenerateToneResponse) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
}
export const useGenerateTone = (options: UseGenerateToneOptions = {}) => {
  const queryClient = useQueryClient();
  const { handleError, showErrorToast } = useError(); // Assuming you have this from previous discussion

  const { onSuccess, onError, showSuccessToast = true } = options;

  return useMutation<GenerateToneResponse, Error, GenerateToneRequest>({
    mutationFn: fetchGenerateTone,

    onSuccess: (data, variables) => {
      // Show success notification
      if (showSuccessToast) {
        showErrorToast("Tone generated successfully!", "info");
      }

      // Optional: Cache the result for future use
      queryClient.setQueryData(["generated-tone", variables], data);

      // Call custom success handler
      onSuccess?.(data);
    },

    onError: (error, variables) => {
      // Handle error with your error hook
      if (showErrorToast) {
        handleError(error, {
          customMessage: "Failed to generate tone. Please try again.",
        });
      }

      // Call custom error handler
      onError?.(error);
    },
  });
};
