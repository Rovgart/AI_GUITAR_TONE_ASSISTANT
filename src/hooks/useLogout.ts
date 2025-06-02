import { userApi } from "@/api";
import { useUserStore } from "@/store/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useUserStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: userApi.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
    },
  });
};
