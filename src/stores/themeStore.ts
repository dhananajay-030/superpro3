import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/types';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      toggleTheme: () =>
        set((state) => {
          const newMode = state.mode === 'dark' ? 'light' : 'dark';
          document.documentElement.classList.toggle('dark', newMode === 'dark');
          return { mode: newMode };
        }),
      setTheme: (mode: ThemeMode) => {
        document.documentElement.classList.toggle('dark', mode === 'dark');
        set({ mode });
      },
    }),
    {
      name: 'superpro-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle('dark', state.mode === 'dark');
        }
      },
    }
  )
);
