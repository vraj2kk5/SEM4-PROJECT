export default function LoadingSkeleton({ count = 1, height = 'h-12' }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse`}
        />
      ))}
    </>
  )
}
