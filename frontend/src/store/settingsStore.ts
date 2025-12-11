import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
    // Theme
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;

    // Display
    resultDensity: number;
    setResultDensity: (val: number) => void;

    // Search
    searchDelay: number;
    setSearchDelay: (val: number) => void;
    minRelevance: number;
    setMinRelevance: (val: number) => void;
    autoSuggest: boolean;
    setAutoSuggest: (val: boolean) => void;
    explainableAI: boolean;
    setExplainableAI: (val: boolean) => void;

    // Accessibility
    fontSize: 'small' | 'medium' | 'large';
    setFontSize: (val: 'small' | 'medium' | 'large') => void;
    highContrast: boolean;
    setHighContrast: (val: boolean) => void;
    reducedMotion: boolean;
    setReducedMotion: (val: boolean) => void;
    keyboardNav: boolean;
    setKeyboardNav: (val: boolean) => void;
    readingMode: boolean;
    setReadingMode: (val: boolean) => void;
    lineHeight: number;
    setLineHeight: (val: number) => void;

    // Actions
    resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
    theme: 'system' as const,
    resultDensity: 5,
    searchDelay: 300,
    minRelevance: 0,
    autoSuggest: true,
    explainableAI: true,
    fontSize: 'medium' as const,
    highContrast: false,
    reducedMotion: false,
    keyboardNav: true,
    readingMode: false,
    lineHeight: 1.6,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,

            // Setters
            setTheme: (theme) => set({ theme }),
            setResultDensity: (resultDensity) => set({ resultDensity }),
            setSearchDelay: (searchDelay) => set({ searchDelay }),
            setMinRelevance: (minRelevance) => set({ minRelevance }),
            setAutoSuggest: (autoSuggest) => set({ autoSuggest }),
            setExplainableAI: (explainableAI) => set({ explainableAI }),
            setFontSize: (fontSize) => set({ fontSize }),
            setHighContrast: (highContrast) => set({ highContrast }),
            setReducedMotion: (reducedMotion) => set({ reducedMotion }),
            setKeyboardNav: (keyboardNav) => set({ keyboardNav }),
            setReadingMode: (readingMode) => set({ readingMode }),
            setLineHeight: (lineHeight) => set({ lineHeight }),

            resetSettings: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'app-preferences',
            storage: createJSONStorage(() => localStorage),
        }
    )
);