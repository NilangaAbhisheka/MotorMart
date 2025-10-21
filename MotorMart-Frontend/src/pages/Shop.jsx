import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import VehicleCard from '../components/VehicleCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import FilterBar from '../components/FilterBar.jsx'
import AdvancedFilters from '../components/AdvancedFilters.jsx'

export default function Shop() {
  const [vehicles, setVehicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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
  const [filters, setFilters] = useState({
    make: '',
    bodyType: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    minMileage: '',
    maxMileage: '',
    sort: 'endingSoon'
  })

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value)
        }
      })
      
      const res = await api.get(`/api/vehicles?${params.toString()}`)
      setVehicles(res.data)
    } catch (error) {
      console.error('Error loading vehicles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleApplyFilters() {
    setPage(1)
    load()
  }

  function handleClearFilters() {
    setFilters({
      make: '',
      bodyType: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      minMileage: '',
      maxMileage: '',
      sort: 'endingSoon'
    })
    setPage(1)
  }

  // Pagination for server-side results
  const totalPages = Math.max(1, Math.ceil(vehicles.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedVehicles = vehicles.slice(startIndex, endIndex)

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
    handleClearFilters()
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <img src="assets/4.jpg" alt="Hero" className="absolute inset-0 w-full h-full object-cover z-0  opacity-85" />
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
        <AdvancedFilters 
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />
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
              {vehicles.length} vehicles available
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-neutral-500 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              Showing {Math.min(endIndex, vehicles.length)} of {vehicles.length}
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

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-neutral-600">Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <EmptyState
            title="No Vehicles Found"
            subtitle="Try adjusting your search filters to find more vehicles that match your criteria."
            icon={
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary text-white flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            }
          >
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </EmptyState>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedVehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
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
