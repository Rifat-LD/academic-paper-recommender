import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (token: string, username: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            username: null,
            isAuthenticated: false,

            login: (token, username) => set({
                token,
                username,
                isAuthenticated: true
            }),

            logout: () => {
                // Clear state
                set({ token: null, username: null, isAuthenticated: false });
                // Optional: Clear favorites or other user-specific data here if needed
            }
        }),
        {
            name: 'auth-storage', // Key in localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);