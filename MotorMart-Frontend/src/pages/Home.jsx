import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import AuctionCard from '../components/AuctionCard.jsx'
import FilterBar from '../components/FilterBar.jsx'
import HeroSearch from '../components/HeroSearch.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import StatsStrip from '../components/StatsStrip.jsx'
import BodyTypes from '../components/BodyTypes.jsx'
import NewsletterCTA from '../components/NewsletterCTA.jsx'
import AboutUs from '../components/AboutUs.jsx'

export default function Home() {
  const [vehicles, setVehicles] = useState([])
  const [query, setQuery] = useState({ make: '', model: '', year: '', minYear: '', maxYear: '', minPrice: '', bodyType: '' })

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
    const okBodyType = !query.bodyType || (v.bodyType && v.bodyType.toLowerCase() === query.bodyType.toLowerCase())
    return okMake && okModel && okYear && okMinYear && okMaxYear && okMinPrice && okBodyType
  })

  const endingSoon = [...filtered].sort((a,b) => new Date(a.auctionEndTime) - new Date(b.auctionEndTime)).slice(0,4)
  const featuredVehicles = [...filtered].slice(0, 6)

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden ">
        {/* Decorative white shapes */}
        <div className="pointer-events-none select-none">
          <div className="absolute -top-10 -left-10 h-40 w-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -right-8 h-32 w-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-10 right-10 h-24 w-24 bg-white/15 rounded-3xl rotate-12"></div>
        </div>
        <img src="assets/1.jpg" alt="Hero" className="absolute inset-0 w-full h-full object-cover z-0  opacity-95" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center absolute inset-0 w-full h-full object-cover" style={{ zIndex: 1 }} >
          <div className="animate-fade-in mt-20 ">
            <h1 className="text-5xl md:text-7xl font-bold text-gray mb-6 leading-tight ">
              Find Your Dream
              <span className="block text-black/90">Vehicle</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-bold mb-8 max-w-3xl mx-auto leading-relaxed " style={{ textShadow: '1px 1px 2px rgba(19, 40, 224, 0.5)'  }} >
              Discover premium vehicles through our transparent, secure auction platform. 
              From luxury cars to everyday vehicles, find exactly what you're looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#featured" className="btn-primary btn-lg">
                Browse Vehicles
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="/about" className="px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold shadow-soft hover:bg-slate-100 transition-colors">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0">
        <HeroSearch query={query} onChange={setQuery} onSearch={()=>{}} />
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary-50 to-accent-50 py-16">
        <StatsStrip />
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <HowItWorks />
      </section>

      {/* Featured Vehicles */}
      <section id="featured" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs">
            <span>Top Picks</span>
          </div>
          <h2 className="heading-2 mt-3">Featured Vehicles</h2>
          <div className="mt-3 flex justify-center">
            <span className="h-1 w-24 bg-gradient-primary rounded-full"></span>
          </div>
          <p className="mt-4 text-body text-neutral-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium vehicles currently up for auction
          </p>
        </div>
        <div className="rounded-3xl p-6 md:p-8 bg-white/80 backdrop-blur-sm border border-neutral-200/60 shadow-soft">
          <div className="grid-responsive">
            {featuredVehicles.map(v => <AuctionCard key={v.id} vehicle={v} />)}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 border-gradient bg-white/95 backdrop-blur-sm">
          <FilterBar query={query} onChange={setQuery} />
        </div>
      </section>

      {/* Ending Soon */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold text-xs">
            <span>Hurry Up</span>
          </div>
          <h2 className="heading-2 mt-3">Ending Soon</h2>
          <div className="mt-3 flex justify-center">
            <span className="h-1 w-20 bg-gradient-secondary rounded-full"></span>
          </div>
          <p className="mt-4 text-body text-neutral-600">
            Don't miss out on these auctions ending in the next 24 hours
          </p>
        </div>
        <div className="rounded-3xl p-6 md:p-8 bg-white/80 backdrop-blur-sm border border-neutral-200/60 shadow-soft">
          <div className="grid-responsive">
            {endingSoon.map(v => <AuctionCard key={v.id} vehicle={v} highlight={true} />)}
          </div>
        </div>
      </section>

      {/* All Auctions */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">All Auctions</h2>
          <p className="text-body text-neutral-600">
            Explore our complete inventory of vehicles available for auction
          </p>
        </div>
        <div className="grid-responsive">
          {filtered.map(v => <AuctionCard key={v.id} vehicle={v} />)}
        </div>
      </section>

      {/* About Us */}
      <section className="bg-gradient-to-r from-neutral-50 to-primary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutUs />
        </div>
      </section>

      {/* Body Types */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BodyTypes onBodyTypeSelect={(bodyType) => setQuery({...query, bodyType})} selectedBodyType={query.bodyType} />
      </section>

      {/* Primary CTA Band */}
      <section className="bg-gradient-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Ready to sell your vehicle?</h3>
              <p className="mt-1 text-white/90">List your car in minutes and reach serious buyers.</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="/add-vehicle" className="px-5 py-3 rounded-lg bg-white text-blue-600 font-semibold shadow-soft hover:bg-slate-100 transition-colors">Start Selling</a>
              <a href="/about" className="px-5 py-3 rounded-lg border border-white/70 text-white font-semibold hover:bg-white/10 transition-colors">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterCTA />
        </div>
      </section>
    </div>
  )
}


