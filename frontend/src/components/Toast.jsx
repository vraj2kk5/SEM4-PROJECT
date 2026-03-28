import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
  }

  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  }

  return (
    <div className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border ${colors[type]} animate-slide-in`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  )
}
