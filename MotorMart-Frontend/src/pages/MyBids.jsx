import { useEffect, useState } from 'react'
import api from '../api/axios.js'

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
    <div className="space-y-4">
      <div className="text-xl font-semibold">My Bids</div>
      <div className="grid grid-cols-2 gap-4">
        {bids.map((x, idx) => (
          <div key={idx} className="card p-4">
            <div className="font-medium">{x.vehicle.title}</div>
            <div className="text-sm text-muted">{x.vehicle.make} {x.vehicle.model} • {x.vehicle.year}</div>
            <div className="mt-2">Your highest bid: <span className="text-secondary font-semibold">${x.bid.amount}</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}


