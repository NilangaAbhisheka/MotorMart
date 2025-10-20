export default function EmptyState({
  title = 'Nothing here yet',
  subtitle = 'Try adjusting your filters or come back later.',
  icon = null,
  children,
}) {
  return (
    <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 shadow-soft">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neutral-100 flex items-center justify-center">
        {icon || (
          <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600 max-w-md mx-auto mb-6">{subtitle}</p>
      {children}
    </div>
  )
}


