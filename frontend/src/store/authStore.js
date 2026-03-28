import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('mockUser', JSON.stringify(user))
    }
    set({ user })
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  logout: () => {
    localStorage.removeItem('mockUser')
    set({ user: null, error: null })
  },
}))
