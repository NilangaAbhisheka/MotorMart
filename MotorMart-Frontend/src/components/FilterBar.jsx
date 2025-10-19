export default function FilterBar({ query, onChange }) {
  return (
    <div className="card p-4 grid grid-cols-3 gap-3">
      <input placeholder="Make" className="input" value={query.make} onChange={e=>onChange({ ...query, make: e.target.value })} />
      <input placeholder="Model" className="input" value={query.model} onChange={e=>onChange({ ...query, model: e.target.value })} />
      <input placeholder="Year" className="input" value={query.year} onChange={e=>onChange({ ...query, year: e.target.value })} />
    </div>
  )
}


