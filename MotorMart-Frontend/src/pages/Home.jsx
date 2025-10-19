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

  return (
    <div className="space-y-12">
      <HeroSearch query={query} onChange={setQuery} onSearch={()=>{}} />
      <StatsStrip />
      <HowItWorks />
      <FilterBar query={query} onChange={setQuery} />
      <section>
        <div className="text-lg font-semibold text-slate-800 mb-4">Ending Soon</div>
        <div className="grid grid-cols-4 gap-4">
          {endingSoon.map(v => <AuctionCard key={v.id} vehicle={v} />)}
        </div>
      </section>
      <section>
        <div className="text-lg font-semibold text-slate-800 mb-4">All Auctions</div>
        <div className="grid grid-cols-4 gap-4">
          {filtered.map(v => <AuctionCard key={v.id} vehicle={v} />)}
        </div>
      </section>
      <AboutUs />
      <BodyTypes onBodyTypeSelect={(bodyType) => setQuery({...query, bodyType})} selectedBodyType={query.bodyType} />
      <NewsletterCTA />
    </div>
  )
}


