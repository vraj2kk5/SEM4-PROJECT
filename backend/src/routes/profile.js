import express from 'express'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Validation schema
const profileSchema = z.object({
  full_name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  notifications_enabled: z.boolean().optional()
})

// Get user profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.user.id)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user profile
router.put('/', verifyToken, async (req, res) => {
  try {
    const updates = profileSchema.parse(req.body)

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({
      message: 'Profile updated successfully',
      data: data[0]
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

// Delete user account
router.delete('/', verifyToken, async (req, res) => {
  try {
    // Delete profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', req.user.id)

    if (profileError) {
      return res.status(400).json({ error: profileError.message })
    }

    // Delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(req.user.id)

    if (authError) {
      return res.status(400).json({ error: authError.message })
    }

    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
