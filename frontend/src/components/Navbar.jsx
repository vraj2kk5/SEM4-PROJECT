import { Menu, Moon, Sun, Bell } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { useAuthStore } from '../store/authStore'

export default function Navbar({ onMenuClick }) {
  const { isDark, toggleTheme } = useThemeStore()
  const { user } = useAuthStore()

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white hidden md:block">
            Smart IoT Dashboard
          </h2>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
