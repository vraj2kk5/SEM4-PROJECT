export default function Card({ children, className = '', glass = false }) {
  return (
    <div
      className={`rounded-xl p-6 transition-smooth ${
        glass
          ? 'glass'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'
      } ${className}`}
    >
      {children}
    </div>
  )
}
