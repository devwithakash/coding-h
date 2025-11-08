import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// The persist middleware automatically saves the store's state to localStorage
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null, // The JWT token
      isLoggedIn: false, // A boolean for quick checks

      // Action to set the token
      setToken: (token) => {
        set({ token, isLoggedIn: true });
      },

      // Action to clear the token (logout)
      logout: () => {
        set({ token: null, isLoggedIn: false });
      },
    }),
    {
      name: 'auth-storage', // Name for the localStorage item
    }
  )
);