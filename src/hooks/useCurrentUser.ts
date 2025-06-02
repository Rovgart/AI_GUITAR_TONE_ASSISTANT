import { useQuery } from "@tanstack/react-query";

import type { UserT } from "@/types/api-types";
import { useUserStore } from "@/store/userStore";
import { GET_CURRENT_USER_URL } from "..";
interface UseUserOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  retry?: number | boolean;
  refetchInterval?: number;
}

export const useAuthenticatedUser = (options: UseUserOptions = {}) => {
  const { isAuthenticated, getAuthToken } = useUserStore();

  return useQuery<UserT>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const response = await fetch(GET_CURRENT_USER_URL, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch current user");
      }
      return response.json();
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error: any) => {
      if (error?.status === 401 || error?.status === 403) {
        const { clearAuth } = useUserStore.getState();
        clearAuth();
      }
    },
    ...options,
  });
};
