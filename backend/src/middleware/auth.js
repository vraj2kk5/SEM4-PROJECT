import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Check if user is admin (you can add this to user_profiles table)
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()

    if (error || data?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    next()
  } catch (error) {
    res.status(403).json({ error: 'Authorization failed' })
  }
}
