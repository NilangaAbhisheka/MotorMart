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
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
          <img 
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Luxury Cars"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-800/60 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your Dream
              <span className="block text-accent-400">Vehicle</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
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
              <a href="/about" className="btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
                Learn More
              </a>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-accent-400/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-500"></div>
      </section>

      {/* Search Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">Featured Vehicles</h2>
          <p className="text-body text-neutral-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium vehicles currently up for auction
          </p>
        </div>
        <div className="grid-responsive">
          {featuredVehicles.map(v => <AuctionCard key={v.id} vehicle={v} />)}
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <FilterBar query={query} onChange={setQuery} />
        </div>
      </section>

      {/* Ending Soon */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">Ending Soon</h2>
          <p className="text-body text-neutral-600">
            Don't miss out on these auctions ending in the next 24 hours
          </p>
        </div>
        <div className="grid-responsive">
          {endingSoon.map(v => <AuctionCard key={v.id} vehicle={v} highlight={true} />)}
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

      {/* Newsletter */}
      <section className="bg-gradient-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterCTA />
        </div>
      </section>
    </div>
  )
}


