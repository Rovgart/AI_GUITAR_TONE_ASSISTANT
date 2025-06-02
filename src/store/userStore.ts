import type { UserT } from "@/types/api-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStoreState {
  isAuthenticated: boolean;
  authToken: string | null;
}

interface UserStoreActions {
  setAuth: (token: string, user: UserT) => void;
  clearAuth: () => void;
  getAuthToken: () => string | null;
}

interface UserStoreI extends UserStoreState, UserStoreActions {}

export const useUserStore = create<UserStoreI>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      authToken: null,

      setAuth: (token: string, user: UserT) =>
        set({
          authToken: token,
          isAuthenticated: !!token,
        }),

      clearAuth: () =>
        set({
          authToken: null,
          isAuthenticated: false,
        }),

      getAuthToken: () => get().authToken,
    }),
    {
      name: "user-auth",
      partialize: (state) => ({
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
