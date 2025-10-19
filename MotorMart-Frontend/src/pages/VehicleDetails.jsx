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
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, user } = useAuth()
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
    setIsLoading(true)
    
    // Validate input
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid bid amount')
      setIsLoading(false)
      return
    }
    
    const bidAmount = parseFloat(amount)
    if (bidAmount <= vehicle.currentPrice) {
      toast.error(`Bid must be higher than current price ($${vehicle.currentPrice})`)
      setIsLoading(false)
      return
    }
    
    try {
      const response = await api.post('/api/bids', { 
        vehicleId: parseInt(id), 
        amount: bidAmount 
      })
      setAmount('')
      await load()
      toast.success('Bid placed successfully')
    } catch (err) {
      console.error('Bid error:', err.response?.data || err.message)
      const errorMessage = err.response?.data?.message || 'Failed to place bid'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-neutral-600">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  const placeholderImage = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80`
  const isEnded = new Date(vehicle.auctionEndTime) <= new Date()

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl shadow-large">
              <img 
                src={vehicle.imageUrl || placeholderImage} 
                alt={vehicle.title} 
                className={`w-full h-96 lg:h-[500px] object-cover transition-all duration-300 ${isEnded ? 'grayscale' : ''}`}
                onError={(e) => {
                  e.target.src = placeholderImage
                }}
              />
              {isEnded && (
                <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-xl font-semibold">Auction Ended</div>
                    <div className="text-sm opacity-80">This auction has concluded</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Additional Images Placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80`}
                    alt={`Gallery ${i}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onError={(e) => {
                      e.target.src = placeholderImage
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Info & Bidding */}
          <div className="space-y-6">
            <div className="card p-8">
              <div className="space-y-6">
                <div>
                  <h1 className="heading-2 mb-2">{vehicle.title}</h1>
                  <div className="flex items-center gap-4 text-neutral-600">
                    <span className="font-medium">{vehicle.make}</span>
                    <span>•</span>
                    <span>{vehicle.model}</span>
                    <span>•</span>
                    <span className="font-medium">{vehicle.year}</span>
                  </div>
                  {vehicle.bodyType && (
                    <div className="mt-2">
                      <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        {vehicle.bodyType}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 py-6 border-y border-neutral-200">
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Current Price</div>
                    <div className="text-3xl font-bold text-primary">${vehicle.currentPrice?.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Time Remaining</div>
                    <div className="text-lg font-semibold">
                      <CountdownTimer endTime={vehicle.auctionEndTime} />
                    </div>
                  </div>
                </div>

                {vehicle.description && (
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-3">Description</h3>
                    <p className="text-body text-neutral-600 leading-relaxed">{vehicle.description}</p>
                  </div>
                )}

                {/* Bidding Section */}
                {isAuthenticated && user?.role !== 'Seller' && !isEnded && (
                  <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-neutral-900 mb-4">Place Your Bid</h3>
                    <form onSubmit={placeBid} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Bid Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                          <input 
                            className="input pl-8" 
                            type="number" 
                            step="0.01" 
                            min={vehicle.currentPrice + 0.01}
                            placeholder={`Min: $${(vehicle.currentPrice + 0.01).toFixed(2)}`} 
                            value={amount} 
                            onChange={e=>setAmount(e.target.value)} 
                            required
                          />
                        </div>
                      </div>
                      <button 
                        className="btn-primary w-full" 
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Placing Bid...
                          </>
                        ) : (
                          'Place Bid'
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {isAuthenticated && user?.role === 'Seller' && (
                  <div className="bg-accent-50 border border-accent-200 p-6 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-accent-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-accent-800 mb-2">Seller Account</h4>
                        <p className="text-accent-700 text-sm">
                          Sellers cannot bid on vehicles. Switch to a buyer account to place bids on auctions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-xl text-center">
                    <h4 className="font-semibold text-neutral-900 mb-2">Sign In to Bid</h4>
                    <p className="text-neutral-600 text-sm mb-4">
                      Create an account or sign in to place bids on this vehicle
                    </p>
                    <div className="flex gap-3 justify-center">
                      <a href="/login" className="btn-primary">Sign In</a>
                      <a href="/register" className="btn-outline">Create Account</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid History */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-3">Bid History</h2>
          <span className="text-sm text-neutral-500">{bids.length} bids placed</span>
        </div>
        
        {bids.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Bids Yet</h3>
            <p className="text-neutral-600">Be the first to place a bid on this vehicle!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-neutral-600 border-b border-neutral-200">
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Bidder</th>
                  <th className="pb-3 font-semibold">Time Placed</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((b, idx) => (
                  <tr key={b.id} className={`border-b border-neutral-100 ${idx === 0 ? 'bg-primary-50' : ''}`}>
                    <td className="py-4">
                      <div className="font-bold text-lg text-primary">${b.amount?.toLocaleString()}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm text-neutral-600">Bidder #{b.userId}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm text-neutral-600">
                        {new Date(b.timePlaced).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4">
                      {idx === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Highest Bid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                          Outbid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}


