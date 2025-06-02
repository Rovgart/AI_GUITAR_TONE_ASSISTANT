import { useUserStore } from "@/store/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserT } from "@/types/api-types";
import { userApi } from "@/api";
import toast from "react-hot-toast";
// Hook options
export interface RegisterResponse {
  token: string;
  user: UserT;
  message?: string;
}

export interface RegisterError {
  message: string;
  field?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface UseRegisterOptions {
  onSuccess?: (data: RegisterResponse) => void;
  onError?: (error: RegisterError) => void;
  autoLogin?: boolean; // Whether to automatically log in after registration
}

export const useRegister = (options: UseRegisterOptions = {}) => {
  const queryClient = useQueryClient();
  const { setAuth } = useUserStore();

  const { onSuccess, onError, autoLogin = true } = options;

  return useMutation<RegisterResponse, RegisterError, RegisterCredentials>({
    mutationFn: userApi.signUp,

    onSuccess: (data) => {
      // Auto login if enabled
      if (autoLogin && data.token) {
        setAuth(data.token, data.user);
        queryClient.setQueryData(["user", "current"], data.user);
        queryClient.setQueryData(["user", "me"], data.user);

        queryClient.invalidateQueries({ queryKey: ["user"] });
        toast.success("Successfully Registered");
      }

      onSuccess?.(data);
    },

    onError: (error) => {
      console.error("Registration failed:", error);
      onError?.(error);
    },

    // Retry configuration
    retry: (failureCount, error) => {
      // Don't retry on validation errors (4xx)
      if (error.status && error.status >= 400 && error.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
