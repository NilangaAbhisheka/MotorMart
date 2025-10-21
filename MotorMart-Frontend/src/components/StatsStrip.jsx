export default function StatsStrip() {
  const stats = [
    { label: 'Registrations', value: '40K' },
    { label: 'Inventory Size', value: '150M+' },
    { label: 'Sales Finalized', value: '100%' },
    { label: 'Verified Sellers', value: '6k+' },
  ]
  return (
    <section className="py-8 bg-white -mt-50">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs uppercase tracking-wide text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}


