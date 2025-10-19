import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'

export default function VehicleDetails() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [bids, setBids] = useState([])
  const [amount, setAmount] = useState('')
  const { isAuthenticated } = useAuth()
  const toast = useToast()

  useEffect(() => { load() }, [id])

  async function load() {
    const v = await api.get(`/api/vehicles/${id}`)
    setVehicle(v.data)
    const b = await api.get(`/api/bids/vehicle/${id}`)
    setBids(b.data)
  }

  async function placeBid(e) {
    e.preventDefault()
    try {
      await api.post('/api/bids', { vehicleId: Number(id), amount: Number(amount) })
      setAmount('')
      await load()
      toast.success('Bid placed successfully')
    } catch (err) {
      toast.error('Failed to place bid')
    }
  }

  if (!vehicle) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <img src={vehicle.imageUrl} alt={vehicle.title} className="w-full rounded-lg shadow-card" />
        <div className="card p-5 space-y-4">
          <div className="text-2xl font-semibold">{vehicle.title}</div>
          <div className="text-muted">{vehicle.make} {vehicle.model} • {vehicle.year}</div>
          <div className="text-lg">Current Price: <span className="text-primary font-semibold">${vehicle.currentPrice}</span></div>
          <div className="text-lg">Ends in: <CountdownTimer endTime={vehicle.auctionEndTime} /></div>
          {isAuthenticated && (
            <form className="flex gap-2" onSubmit={placeBid}>
              <input className="input" type="number" step="0.01" placeholder="Your bid" value={amount} onChange={e=>setAmount(e.target.value)} />
              <button className="btn">Place Bid</button>
            </form>
          )}
        </div>
      </div>
      <div className="card p-4">
        <div className="font-semibold mb-3">Bid History</div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted">
              <th className="p-2">Amount</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((b, idx) => (
              <tr key={b.id} className={`border-t ${idx === 0 ? 'bg-secondary/10' : ''}`}>
                <td className="p-2 font-medium">${b.amount}</td>
                <td className="p-2 text-sm text-muted">{new Date(b.timePlaced).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


