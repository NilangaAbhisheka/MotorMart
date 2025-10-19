import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import AuctionCard from '../components/AuctionCard.jsx'
import FilterBar from '../components/FilterBar.jsx'

export default function Shop() {
  const [vehicles, setVehicles] = useState([])
  const [query, setQuery] = useState({ 
    make: '', 
    model: '', 
    year: '', 
    minYear: '', 
    maxYear: '', 
    minPrice: '', 
    maxPrice: '',
    bodyType: '',
    sortBy: 'newest'
  })

  useEffect(() => { load() }, [])

  async function load() {
    const res = await api.get('/api/vehicles')
    setVehicles(res.data)
  }

  const filtered = vehicles.filter(v => {
    const okMake = !query.make || v.make.toLowerCase().includes(query.make.toLowerCase())
    const okModel = !query.model || v.model.toLowerCase().includes(query.model.toLowerCase())
    const okYear = !query.year || String(v.year).includes(query.year)
    const okMinYear = !query.minYear || v.year >= Number(query.minYear)
    const okMaxYear = !query.maxYear || v.year <= Number(query.maxYear)
    const okMinPrice = !query.minPrice || v.currentPrice >= Number(query.minPrice)
    const okMaxPrice = !query.maxPrice || v.currentPrice <= Number(query.maxPrice)
    const okBodyType = !query.bodyType || (v.bodyType && v.bodyType.toLowerCase() === query.bodyType.toLowerCase())
    return okMake && okModel && okYear && okMinYear && okMaxYear && okMinPrice && okMaxPrice && okBodyType
  })

  // Sort vehicles based on selected option
  const sortedVehicles = [...filtered].sort((a, b) => {
    switch (query.sortBy) {
      case 'newest':
        return new Date(b.auctionEndTime) - new Date(a.auctionEndTime)
      case 'oldest':
        return new Date(a.auctionEndTime) - new Date(b.auctionEndTime)
      case 'price-low':
        return a.currentPrice - b.currentPrice
      case 'price-high':
        return b.currentPrice - a.currentPrice
      case 'year-newest':
        return b.year - a.year
      case 'year-oldest':
        return a.year - b.year
      default:
        return 0
    }
  })

  const clearFilters = () => {
    setQuery({ 
      make: '', 
      model: '', 
      year: '', 
      minYear: '', 
      maxYear: '', 
      minPrice: '', 
      maxPrice: '',
      bodyType: '',
      sortBy: 'newest'
    })
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Vehicle Shop</h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Browse our extensive collection of premium vehicles up for auction
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-accent-400/20 rounded-full animate-pulse delay-1000"></div>
      </section>

      {/* Enhanced Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 shadow-large">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="heading-3 mb-2">Filter & Search</h2>
              <p className="text-body text-neutral-600">Find exactly what you're looking for</p>
            </div>
            <button 
              onClick={clearFilters}
              className="btn-outline btn-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Basic Search Filters */}
            <FilterBar query={query} onChange={setQuery} />
            
            {/* Advanced Filters */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Min Year</label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="2020" 
                  value={query.minYear} 
                  onChange={e => setQuery({...query, minYear: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Max Year</label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="2024" 
                  value={query.maxYear} 
                  onChange={e => setQuery({...query, maxYear: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Min Price</label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="$10,000" 
                  value={query.minPrice} 
                  onChange={e => setQuery({...query, minPrice: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Max Price</label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="$100,000" 
                  value={query.maxPrice} 
                  onChange={e => setQuery({...query, maxPrice: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Body Type</label>
                <select 
                  className="input" 
                  value={query.bodyType} 
                  onChange={e => setQuery({...query, bodyType: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Sports">Sports</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Compact">Compact</option>
                  <option value="Pick Up">Pick Up</option>
                  <option value="Crossover">Crossover</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Sort By</label>
                <select 
                  className="input" 
                  value={query.sortBy} 
                  onChange={e => setQuery({...query, sortBy: e.target.value})}
                >
                  <option value="newest">Newest Auctions</option>
                  <option value="oldest">Ending Soon</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="year-newest">Year: Newest First</option>
                  <option value="year-oldest">Year: Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="heading-3 mb-2">All Vehicles</h2>
            <p className="text-body text-neutral-600">
              {sortedVehicles.length} vehicles available
            </p>
          </div>
          <div className="text-sm text-neutral-500 bg-neutral-100 px-4 py-2 rounded-full">
            Showing {sortedVehicles.length} of {vehicles.length} vehicles
          </div>
        </div>

        {sortedVehicles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="heading-4 mb-4">No Vehicles Found</h3>
            <p className="text-body text-neutral-600 mb-8 max-w-md mx-auto">
              Try adjusting your search filters to find more vehicles that match your criteria.
            </p>
            <button 
              onClick={clearFilters}
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-responsive">
            {sortedVehicles.map(v => <AuctionCard key={v.id} vehicle={v} />)}
          </div>
        )}
      </section>
    </div>
  )
}
