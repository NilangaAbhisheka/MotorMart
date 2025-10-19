import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

let idSeq = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => setToasts((prev) => prev.filter(t => t.id !== id)), [])
  const push = useCallback((toast) => {
    const id = idSeq++
    const duration = toast.duration ?? 3000
    setToasts(prev => [...prev, { id, ...toast }])
    if (duration > 0) setTimeout(() => remove(id), duration)
    return id
  }, [remove])

  const value = useMemo(() => ({
    success: (message, opts) => push({ message, type: 'success', ...opts }),
    error: (message, opts) => push({ message, type: 'error', ...opts }),
    info: (message, opts) => push({ message, type: 'info', ...opts }),
    remove,
  }), [push, remove])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`card px-4 py-3 shadow-card border-l-4 ${t.type === 'success' ? 'border-success' : t.type === 'error' ? 'border-danger' : 'border-secondary'}`}>
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${t.type === 'success' ? 'bg-success' : t.type === 'error' ? 'bg-danger' : 'bg-secondary'}`}></div>
              <div className="text-sm text-slate-800">{t.message}</div>
              <button className="ml-2 text-muted hover:text-slate-700" onClick={() => remove(t.id)} aria-label="Dismiss">✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}


