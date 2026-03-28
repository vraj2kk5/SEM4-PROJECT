import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: localStorage.getItem('theme') === 'dark' || false,
      toggleTheme: () =>
        set((state) => {
          const newDark = !state.isDark
          localStorage.setItem('theme', newDark ? 'dark' : 'light')
          return { isDark: newDark }
        }),
    }),
    {
      name: 'theme-storage',
    }
  )
)
