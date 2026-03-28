import { useState } from 'react'
import { Lock, Mail, Bell, Palette, Loader } from 'lucide-react'
import { authService } from '../services/supabaseClient'
import { useThemeStore } from '../store/themeStore'
import Card from '../components/Card'
import Toast from '../components/Toast'

export default function SettingsPage() {
  const { isDark, toggleTheme } = useThemeStore()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [notifications, setNotifications] = useState({
    binFull: true,
    dailyReport: true,
    weeklyReport: false,
  })

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (formData.newPassword !== formData.confirmPassword) {
      setToast({ type: 'error', message: 'Passwords do not match' })
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setToast({ type: 'error', message: 'Password must be at least 6 characters' })
      setLoading(false)
      return
    }

    try {
      const { data, error } = await authService.updatePassword(formData.newPassword)

      if (error) {
        setToast({ type: 'error', message: error.message })
        return
      }

      setToast({ type: 'success', message: 'Password updated successfully!' })
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update password' })
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setToast({ type: 'success', message: 'Notification settings updated!' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your account and preferences
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <Palette size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Theme
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isDark ? 'Dark mode' : 'Light mode'} is currently enabled
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Toggle Theme
          </button>
        </div>
      </Card>

      {/* Password Settings */}
      <Card>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
              <Lock size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Change Password
            </h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="Enter current password"
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                placeholder="Enter new password"
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Confirm new password"
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size={20} className="animate-spin" />}
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card>
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Bell size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Notifications
            </h3>
          </div>

          <div className="space-y-4">
            {/* Bin Full Alert */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Bin Full Alert
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get notified when bin is full
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange('binFull')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.binFull ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.binFull ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Daily Report */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Daily Report
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Receive daily usage report
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange('dailyReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.dailyReport ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.dailyReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Weekly Report */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Weekly Report
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Receive weekly usage summary
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange('weeklyReport')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.weeklyReport ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </Card>

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
