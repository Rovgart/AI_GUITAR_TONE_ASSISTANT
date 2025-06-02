import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      authToken: null,

      setAuth: (token, user) =>
        set({
          authToken: token,
          isAuthenticated: !!token,
        }),

      clearAuth: () =>
        set({
          authToken: null,
          isAuthenticated: false,
        }),

      // Getters
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
