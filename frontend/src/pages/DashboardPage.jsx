import { useEffect, useState } from 'react'
import { Trash2, AlertCircle, Activity, TrendingUp } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { dustbinService } from '../services/supabaseClient'
import { mockDustbinService, getMockStats } from '../services/mockData'
import { useAuthStore } from '../store/authStore'
import { useDashboardStore } from '../store/dashboardStore'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import Toast from '../components/Toast'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { logs, stats, loading, setLogs, setStats, setLoading, setError } =
    useDashboardStore()
  const [toast, setToast] = useState(null)
  const isMockUser = user?.id === 'mock-user-123'

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setLoading(true)
      try {
        // Use mock data for demo user
        const service = isMockUser ? mockDustbinService : dustbinService
        const { data, error } = await service.getLogs(user.id, 100)

        if (error) {
          setError(error.message)
          setToast({ type: 'error', message: 'Failed to load data' })
          return
        }

        setLogs(data || [])

        // Calculate stats
        const calculatedStats = getMockStats(data || [])
        setStats(calculatedStats)
      } catch (err) {
        setError(err.message)
        setToast({ type: 'error', message: 'Error loading dashboard' })
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Subscribe to real-time updates (only for real users)
    if (!isMockUser) {
      const subscription = dustbinService.subscribeToLogs(user.id, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLogs([payload.new, ...logs])
        }
      })

      return () => subscription?.unsubscribe()
    }
  }, [user, setLogs, setStats, setLoading, setError, isMockUser])

  // Prepare chart data
  const monthlyData = [
    { month: 'Jan', usage: 65, full: 40 },
    { month: 'Feb', usage: 78, full: 45 },
    { month: 'Mar', usage: 92, full: 55 },
    { month: 'Apr', usage: 88, full: 50 },
    { month: 'May', usage: 105, full: 65 },
    { month: 'Jun', usage: 120, full: 75 },
  ]

  const dailyData = [
    { day: 'Mon', usage: 15 },
    { day: 'Tue', usage: 18 },
    { day: 'Wed', usage: 22 },
    { day: 'Thu', usage: 20 },
    { day: 'Fri', usage: 25 },
    { day: 'Sat', usage: 28 },
    { day: 'Sun', usage: 16 },
  ]

  const pieData = [
    { name: 'Full', value: stats.fullEvents, color: '#ef4444' },
    { name: 'Empty', value: stats.emptyEvents, color: '#10b981' },
  ]

  const COLORS = ['#ef4444', '#10b981']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome back! Here's your IoT bin status overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <LoadingSkeleton count={4} height="h-32" />
          </>
        ) : (
          <>
            <StatCard
              icon={Trash2}
              label="Total Usage"
              value={stats.totalUsage}
              trend={12}
              color="blue"
            />
            <StatCard
              icon={AlertCircle}
              label="Full Events"
              value={stats.fullEvents}
              trend={8}
              color="red"
            />
            <StatCard
              icon={Activity}
              label="Empty Events"
              value={stats.emptyEvents}
              trend={-5}
              color="green"
            />
            <StatCard
              icon={TrendingUp}
              label="Active Days"
              value={Math.ceil(stats.totalUsage / 10) || 0}
              trend={15}
              color="purple"
            />
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Monthly Usage Trend
          </h3>
          {loading ? (
            <LoadingSkeleton height="h-64" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Bar Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Daily Usage Activity
          </h3>
          {loading ? (
            <LoadingSkeleton height="h-64" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="usage" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Pie Chart and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Full vs Empty Distribution
          </h3>
          {loading ? (
            <LoadingSkeleton height="h-64" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          {loading ? (
            <LoadingSkeleton count={3} height="h-12" />
          ) : logs.length > 0 ? (
            <div className="space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        log.status === 'full' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                        Bin {log.status}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Level: {log.level}%
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
              No activity yet
            </p>
          )}
        </Card>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
