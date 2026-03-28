import express from 'express'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const router = express.Router()
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2)
})

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = signUpSchema.parse(req.body)

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: data.user.id,
          full_name: fullName,
          email,
          role: 'user'
        }
      ])

    if (profileError) {
      return res.status(400).json({ error: profileError.message })
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = signInSchema.parse(req.body)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    res.json({
      message: 'Sign in successful',
      user: {
        id: data.user.id,
        email: data.user.email
      },
      session: data.session
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email
      }
    })
  } catch (error) {
    res.status(401).json({ error: 'Token verification failed' })
  }
})

export default router
