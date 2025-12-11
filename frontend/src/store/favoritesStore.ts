import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UIPaper } from '../api/papers';

interface FavoritePaper extends UIPaper {
    savedAt: number; // Timestamp for "Freshness" indicator
}

interface FavoritesState {
    favorites: FavoritePaper[];

    // Actions
    addFavorite: (paper: UIPaper) => void;
    removeFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    clearFavorites: () => void;

    // Utilities for Phase 2.4.2
    getStorageUsage: () => number; // Returns bytes used
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],

            addFavorite: (paper) => set((state) => {
                // Prevent duplicates
                if (state.favorites.some(f => f.id === paper.id)) return state;

                return {
                    favorites: [
                        { ...paper, savedAt: Date.now() },
                        ...state.favorites
                    ]
                };
            }),

            removeFavorite: (id) => set((state) => ({
                favorites: state.favorites.filter((f) => f.id !== id)
            })),

            isFavorite: (id) => {
                return get().favorites.some((f) => f.id === id);
            },

            clearFavorites: () => set({ favorites: [] }),

            getStorageUsage: () => {
                // Calculate size of the JSON string in localStorage
                // Note: This is an estimation of the specific 'paper-storage' key
                const storedString = localStorage.getItem('paper-favorites-storage');
                return storedString ? new Blob([storedString]).size : 0;
            }
        }),
        {
            name: 'paper-favorites-storage', // key in localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);