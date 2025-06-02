import { useUserStore } from "@/store/userStore";
import { useAuthenticatedUser } from "./useCurrentUser";
import { useLogin } from "./useLogin";
import { useLogout } from "./useLogout";
import { useRegister } from "./useRegister";

export const useUser = () => {
  const { isAuthenticated, authToken, getAuthToken } = useUserStore();
  const { data: user, isLoading, error, isError } = useAuthenticatedUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  return {
    user,
    isAuthenticated,
    authToken,
    isLoading,
    error,
    isError,
    signUp: registerMutation.mutate,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    getAuthToken,
    getUserId: () => user?.id,
    getUserEmail: () => user?.email,
    hasRole: (role: string) => user?.role === role,
  };
};
