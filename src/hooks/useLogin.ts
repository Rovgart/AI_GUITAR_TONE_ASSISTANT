import { userApi } from "@/api";
import { useUserStore } from "@/store/userStore";
import type { LoginResponseT } from "@/types/api-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useUserStore((state) => state.setAuth);

  return useMutation({
    mutationFn: userApi.login,
    onSuccess: (data: LoginResponseT) => {
      // Update Zustand store
      setAuth(data.access_token, data.user);
      queryClient.setQueryData(["user", "current"], data.user);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
