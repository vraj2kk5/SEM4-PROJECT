import { create } from 'zustand'

export const useDashboardStore = create((set) => ({
  logs: [],
  stats: {
    totalUsage: 0,
    fullEvents: 0,
    emptyEvents: 0,
    lastActivity: null,
  },
  loading: false,
  error: null,

  setLogs: (logs) => set({ logs }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs],
    })),
}))
