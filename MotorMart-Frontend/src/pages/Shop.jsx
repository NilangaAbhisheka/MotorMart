import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import AuctionCard from '../components/AuctionCard.jsx'
import FilterBar from '../components/FilterBar.jsx'

export default function Shop() {
  const [vehicles, setVehicles] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(24)
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

  // Cap the total rendered vehicles to 1000 for performance
  const MAX_RENDER = 1000
  const cappedVehicles = sortedVehicles.slice(0, MAX_RENDER)
  const totalPages = Math.max(1, Math.ceil(cappedVehicles.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedVehicles = cappedVehicles.slice(startIndex, endIndex)

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
      <section className="relative py-20 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-semibold text-sm mb-6">
            <span>Vehicle Shop</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Premium Vehicle Collection</h1>
          <div className="flex justify-center mb-6">
            <span className="h-1 w-24 bg-white/60 rounded-full"></span>
          </div>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Discover our extensive collection of premium vehicles up for auction. From luxury cars to everyday vehicles, find your perfect match.
          </p>
        </div>
      </section>

      {/* Enhanced Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 shadow-large border-gradient bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs mb-3">
                <span>Search & Filter</span>
              </div>
              <h2 className="heading-3 mb-2">Find Your Perfect Vehicle</h2>
              <div className="flex mb-2">
                <span className="h-1 w-16 bg-gradient-primary rounded-full"></span>
              </div>
              <p className="text-body text-neutral-600">Use our advanced filters to find exactly what you're looking for</p>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs mb-3">
              <span>Vehicle Collection</span>
            </div>
            <h2 className="heading-3 mb-2">All Vehicles</h2>
            <div className="flex mb-2">
              <span className="h-1 w-16 bg-gradient-primary rounded-full"></span>
            </div>
            <p className="text-body text-neutral-600">
              {sortedVehicles.length} vehicles available
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-neutral-500 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              Showing {Math.min(endIndex, cappedVehicles.length)} of {Math.min(sortedVehicles.length, MAX_RENDER)} (max 1000)
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-600 font-medium">Per page</label>
              <select
                className="input py-2 px-3 h-10 w-28 rounded-lg"
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
                <option value={96}>96</option>
              </select>
            </div>
          </div>
        </div>

        {sortedVehicles.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-white rounded-3xl">
            <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-soft">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="heading-3 mb-4">No Vehicles Found</h3>
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
          <>
            <div className="grid-responsive">
              {paginatedVehicles.map(v => <AuctionCard key={v.id} vehicle={v} />)}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  className="px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">Page</span>
                  <span className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold">
                    {currentPage}
                  </span>
                  <span className="text-sm text-neutral-600">of {totalPages}</span>
                </div>
                <button
                  className="px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Vehicle Categories Showcase */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs mb-4">
              <span>Vehicle Categories</span>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Explore by Category</h2>
            <div className="flex justify-center mb-6">
              <span className="h-1 w-20 bg-gradient-primary rounded-full"></span>
            </div>
            <p className="text-lg text-neutral-600">Browse vehicles by type and find your perfect match</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group cursor-pointer">
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Luxury Cars</h3>
                <p className="text-sm text-neutral-600">Premium vehicles from top brands</p>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">SUVs</h3>
                <p className="text-sm text-neutral-600">Family-friendly and versatile</p>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Sports Cars</h3>
                <p className="text-sm text-neutral-600">High-performance machines</p>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Electric</h3>
                <p className="text-sm text-neutral-600">Eco-friendly and modern</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Can't Find What You're Looking For?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join our community and get notified when vehicles matching your criteria become available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-soft hover:bg-slate-100 transition-colors">
              Create Account
            </a>
            <a href="/contact" className="px-8 py-4 border border-white/70 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
