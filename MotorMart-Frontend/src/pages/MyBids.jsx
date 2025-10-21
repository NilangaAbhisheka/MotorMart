import { useEffect, useState } from 'react'
import api, { getImageUrl } from '../api/axios.js'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'

export default function MyBids() {
  const [bids, setBids] = useState([])

  useEffect(() => { load() }, [])

  async function load() {
    // simple approach: fetch all active vehicles and user's bids separately (endpoint could be improved)
    const res = await api.get('/api/vehicles')
    const vehicles = res.data
    const my = []
    for (const v of vehicles) {
      const b = await api.get(`/api/bids/vehicle/${v.id}`)
      const mine = b.data.find(x => x.userId) // backend returns userId; client filters if needed
      if (mine) my.push({ vehicle: v, bid: mine })
    }
    setBids(my)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Bids</h1>
          <p className="text-slate-600 mt-1">Track your active bids and auction status</p>
        </div>
        <div className="text-sm text-slate-500">
          {bids.length} active bid{bids.length !== 1 ? 's' : ''}
        </div>
      </div>

      {bids.length === 0 ? (
        <EmptyState
          title="No Active Bids"
          subtitle="You haven't placed any bids yet. Start bidding on vehicles you're interested in!"
        >
          <Link to="/" className="btn">Browse Auctions</Link>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {bids.map((x, idx) => (
            <Link key={idx} to={`/vehicle/${x.vehicle.id}`} className="card card-hover group">
              <div className="relative">
                <img 
                  src={getImageUrl(x.vehicle.imageUrl) || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80`} 
                  alt={x.vehicle.title} 
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80`
                  }}
                />
                <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Your Bid
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 group-hover:text-primary transition-colors">
                    {x.vehicle.title}
                  </h3>
                  <p className="text-sm text-slate-600">{x.vehicle.make} {x.vehicle.model} • {x.vehicle.year}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Your highest bid</div>
                    <div className="text-xl font-bold text-primary">${x.bid.amount}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Ends in</div>
                    <CountdownTimer endTime={x.vehicle.auctionEndTime} />
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Current highest:</span>
                    <span className="font-semibold">${x.vehicle.currentPrice}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


