import express from 'express'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Validation schema
const logSchema = z.object({
  status: z.enum(['full', 'empty']),
  level: z.number().min(0).max(100)
})

// Get all logs for user
router.get('/logs', verifyToken, async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query

    const { data, error, count } = await supabase
      .from('dustbin_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({
      data,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get log by ID
router.get('/logs/:id', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('dustbin_logs')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Log not found' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new log
router.post('/logs', verifyToken, async (req, res) => {
  try {
    const { status, level } = logSchema.parse(req.body)

    const { data, error } = await supabase
      .from('dustbin_logs')
      .insert([
        {
          id: uuidv4(),
          user_id: req.user.id,
          status,
          level,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({
      message: 'Log created successfully',
      data: data[0]
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

// Get monthly statistics
router.get('/stats/monthly', verifyToken, async (req, res) => {
  try {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const { data, error } = await supabase
      .from('dustbin_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .gte('created_at', oneMonthAgo.toISOString())

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    const stats = {
      totalLogs: data.length,
      fullEvents: data.filter(log => log.status === 'full').length,
      emptyEvents: data.filter(log => log.status === 'empty').length,
      avgLevel: data.length > 0
        ? Math.round(data.reduce((sum, log) => sum + log.level, 0) / data.length)
        : 0
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get statistics by date range
router.get('/stats/range', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate required' })
    }

    const { data, error } = await supabase
      .from('dustbin_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    const stats = {
      totalLogs: data.length,
      fullEvents: data.filter(log => log.status === 'full').length,
      emptyEvents: data.filter(log => log.status === 'empty').length,
      avgLevel: data.length > 0
        ? Math.round(data.reduce((sum, log) => sum + log.level, 0) / data.length)
        : 0,
      dateRange: { startDate, endDate }
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// IoT Device endpoint - Create log from ESP32
router.post('/device/log', async (req, res) => {
  try {
    const { userId, status, level, apiKey } = req.body

    // Verify API key
    if (apiKey !== process.env.IOT_API_KEY) {
      return res.status(401).json({ error: 'Invalid API key' })
    }

    const { status: validStatus, level: validLevel } = logSchema.parse({
      status,
      level
    })

    const { data, error } = await supabase
      .from('dustbin_logs')
      .insert([
        {
          id: uuidv4(),
          user_id: userId,
          status: validStatus,
          level: validLevel,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({
      message: 'Device log created successfully',
      data: data[0]
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

export default router
