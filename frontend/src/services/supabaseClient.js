import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Auth service
export const authService = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  },

  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { data, error }
  },
}

// Dustbin logs service
export const dustbinService = {
  getLogs: async (userId, limit = 100, offset = 0) => {
    const { data, error } = await supabase
      .from('dustbin_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error }
  },

  getLogById: async (id) => {
    const { data, error } = await supabase
      .from('dustbin_logs')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  createLog: async (userId, status, level) => {
    const { data, error } = await supabase
      .from('dustbin_logs')
      .insert([
        {
          user_id: userId,
          status,
          level,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
    return { data, error }
  },

  getMonthlyStats: async (userId) => {
    const { data, error } = await supabase
      .from('dustbin_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString())
    return { data, error }
  },

  subscribeToLogs: (userId, callback) => {
    return supabase
      .from('dustbin_logs')
      .on('*', (payload) => {
        if (payload.new.user_id === userId) {
          callback(payload)
        }
      })
      .subscribe()
  },
}

// User profile service
export const profileService = {
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
    return { data, error }
  },

  createProfile: async (userId, profile) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{ id: userId, ...profile }])
      .select()
    return { data, error }
  },
}
