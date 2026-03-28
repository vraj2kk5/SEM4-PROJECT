import { useEffect, useState } from 'react'
import { ChevronUp, ChevronDown, Download } from 'lucide-react'
import { dustbinService } from '../services/supabaseClient'
import { useAuthStore } from '../store/authStore'
import Card from '../components/Card'
import LoadingSkeleton from '../components/LoadingSkeleton'
import Toast from '../components/Toast'

export default function HistoryPage() {
  const { user } = useAuthStore()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [sortBy, setSortBy] = useState('date')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!user) return

    const fetchLogs = async () => {
      setLoading(true)
      try {
        const { data, error } = await dustbinService.getLogs(user.id, 1000)

        if (error) {
          setToast({ type: 'error', message: 'Failed to load history' })
          return
        }

        setLogs(data || [])
      } catch (err) {
        setToast({ type: 'error', message: 'Error loading history' })
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [user])

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (filterStatus === 'all') return true
    return log.status === filterStatus
  })

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at) - new Date(a.created_at)
    } else if (sortBy === 'level') {
      return b.level - a.level
    }
    return 0
  })

  // Paginate
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage)
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Status', 'Level', 'Date']
    const rows = sortedLogs.map((log) => [
      new Date(log.created_at).toLocaleTimeString(),
      log.status,
      log.level,
      new Date(log.created_at).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dustbin-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()

    setToast({ type: 'success', message: 'CSV exported successfully!' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          History
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View and manage all dustbin logs
        </p>
      </div>

      {/* Controls */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="full">Full</option>
              <option value="empty">Empty</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="level">Sort by Level</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <LoadingSkeleton count={5} height="h-12" />
        ) : paginatedLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    Timestamp
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    Fill Level
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-900 dark:text-white">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          log.status === 'full'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        }`}
                      >
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 max-w-xs">
                          <div
                            className={`h-2 rounded-full ${
                              log.level > 70
                                ? 'bg-red-500'
                                : log.level > 40
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${log.level}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {log.level}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white">
                      {new Date(log.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-8 text-slate-500 dark:text-slate-400">
            No logs found
          </p>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronUp size={20} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      )}

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
