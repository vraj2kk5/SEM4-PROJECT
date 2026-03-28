// Mock data service for testing without Supabase

export const mockLogs = [
  {
    id: '1',
    user_id: 'mock-user-123',
    status: 'full',
    level: 95,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
  },
  {
    id: '2',
    user_id: 'mock-user-123',
    status: 'empty',
    level: 10,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
  },
  {
    id: '3',
    user_id: 'mock-user-123',
    status: 'full',
    level: 85,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
  },
  {
    id: '4',
    user_id: 'mock-user-123',
    status: 'empty',
    level: 20,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
  },
  {
    id: '5',
    user_id: 'mock-user-123',
    status: 'full',
    level: 90,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
  },
  {
    id: '6',
    user_id: 'mock-user-123',
    status: 'empty',
    level: 15,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString() // 3 hours ago
  },
  {
    id: '7',
    user_id: 'mock-user-123',
    status: 'full',
    level: 88,
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString() // 4 hours ago
  },
  {
    id: '8',
    user_id: 'mock-user-123',
    status: 'empty',
    level: 25,
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString() // 5 hours ago
  },
  {
    id: '9',
    user_id: 'mock-user-123',
    status: 'full',
    level: 92,
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString() // 6 hours ago
  },
  {
    id: '10',
    user_id: 'mock-user-123',
    status: 'empty',
    level: 12,
    created_at: new Date(Date.now() - 1000 * 60 * 420).toISOString() // 7 hours ago
  },
]

export const getMockStats = (logs) => {
  return {
    totalUsage: logs.length,
    fullEvents: logs.filter(log => log.status === 'full').length,
    emptyEvents: logs.filter(log => log.status === 'empty').length,
    lastActivity: logs[0]?.created_at || null,
  }
}

export const mockDustbinService = {
  getLogs: async (userId, limit = 100, offset = 0) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: mockLogs.slice(offset, offset + limit),
      error: null
    }
  },

  getLogById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const log = mockLogs.find(l => l.id === id)
    return {
      data: log,
      error: log ? null : { message: 'Log not found' }
    }
  },

  createLog: async (userId, status, level) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newLog = {
      id: String(mockLogs.length + 1),
      user_id: userId,
      status,
      level,
      created_at: new Date().toISOString()
    }
    mockLogs.unshift(newLog)
    return {
      data: [newLog],
      error: null
    }
  },

  getMonthlyStats: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      data: mockLogs,
      error: null
    }
  },

  subscribeToLogs: (userId, callback) => {
    // Mock subscription
    return {
      unsubscribe: () => {}
    }
  }
}
