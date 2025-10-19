export default function HeroSearch({ query, onChange, onSearch }) {
  return (
    <section className="relative overflow-hidden rounded-xl">
      <div className="relative h-[340px] md:h-[420px]">
        <img src="assets/1.jpg" alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/50"></div>
        <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-center">
          <div className="max-w-xl text-white space-y-2">
            <div className="text-sm/none opacity-90">2019</div>
            <h1 className="text-3xl md:text-5xl font-bold">Mercedes-Benz
              <br /> AMG GT‑R
            </h1>
            <div className="text-sm opacity-80">Starting from <span className="font-semibold">$249,000</span></div>
            <div className="mt-4 flex gap-3">
              <button className="btn">Place Bid</button>
              <button className="px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20">Check Car</button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="-mt-8 md:-mt-10 bg-white rounded-lg shadow-card p-3 md:p-4 grid grid-cols-2 md:grid-cols-6 gap-2">
          <input placeholder="Make" className="input" value={query.make} onChange={e=>onChange({ ...query, make: e.target.value })} />
          <input placeholder="Model" className="input" value={query.model} onChange={e=>onChange({ ...query, model: e.target.value })} />
          <input placeholder="Min Year" className="input" value={query.minYear || ''} onChange={e=>onChange({ ...query, minYear: e.target.value })} />
          <input placeholder="Max Year" className="input" value={query.maxYear || ''} onChange={e=>onChange({ ...query, maxYear: e.target.value })} />
          <input placeholder="Min Price" className="input" value={query.minPrice || ''} onChange={e=>onChange({ ...query, minPrice: e.target.value })} />
          <button onClick={onSearch} className="btn">Search</button>
        </div>
      </div>
    </section>
  )
}


