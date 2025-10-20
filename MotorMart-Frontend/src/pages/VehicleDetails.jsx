import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'

export default function VehicleDetails() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [bids, setBids] = useState([])
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
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
  
  // Get all images (cover image + additional images)
  const allImages = []
  if (vehicle.imageUrl) {
    allImages.push(vehicle.imageUrl)
  }
  if (vehicle.images && vehicle.images.length > 0) {
    vehicle.images.forEach(img => {
      if (img.imageUrl && img.imageUrl !== vehicle.imageUrl) {
        allImages.push(img.imageUrl)
      }
    })
  }
  
  // If no images, use placeholder
  const displayImages = allImages.length > 0 ? allImages : [placeholderImage]

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/shop' },
        { label: vehicle.title }
      ]} />
      {/* Hero Section */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl shadow-large">
              <img 
                src={displayImages[selectedImageIndex] || placeholderImage} 
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
              
              {/* Image Navigation Arrows */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : displayImages.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-800 rounded-full p-2 shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev < displayImages.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-800 rounded-full p-2 shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedImageIndex === index 
                        ? 'ring-2 ring-primary-500 ring-offset-2' 
                        : 'hover:ring-2 hover:ring-primary-300'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img 
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.target.src = placeholderImage
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
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
                  
                  {/* Seller Info with Verification */}
                  {vehicle.seller && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-neutral-600">by {vehicle.seller.username}</span>
                      {vehicle.seller.isVerified && (
                        <span className="inline-flex items-center text-green-600" title="Verified Seller">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                  )}
                  
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
                    {vehicle.reservePrice && (
                      <div className="text-sm text-neutral-500 mt-1">
                        Reserve: ${vehicle.reservePrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Time Remaining</div>
                    <div className="text-lg font-semibold">
                      <CountdownTimer endTime={vehicle.auctionEndTime} />
                    </div>
                    {/* Auction Status Badge */}
                    <div className="mt-2">
                      {(() => {
                        if (isEnded) {
                          return vehicle.isSold ? 
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Sold
                            </span> :
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Ended
                            </span>
                        }
                        
                        if (vehicle.isPaused) {
                          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Paused
                          </span>
                        }
                        
                        if (vehicle.reservePrice && vehicle.currentPrice >= vehicle.reservePrice) {
                          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Reserve Met
                          </span>
                        }
                        
                        if (vehicle.reservePrice) {
                          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            No Reserve
                          </span>
                        }
                        
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          No Reserve
                        </span>
                      })()}
                    </div>
                  </div>
                </div>

                {vehicle.description && (
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-3">Description</h3>
                    <p className="text-body text-neutral-600 leading-relaxed">{vehicle.description}</p>
                  </div>
                )}

                {/* Trust & Clarity Features */}
                {(vehicle.vin || vehicle.serviceHistory || vehicle.ownershipCount || vehicle.conditionGrade || vehicle.highlightChips) && (
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-3">Vehicle Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehicle.vin && (
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-neutral-700">VIN</div>
                          <div className="text-sm text-neutral-600 font-mono">{vehicle.vin}</div>
                        </div>
                      )}
                      
                      {vehicle.ownershipCount && (
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-neutral-700">Ownership Count</div>
                          <div className="text-sm text-neutral-600">{vehicle.ownershipCount} owner{vehicle.ownershipCount !== 1 ? 's' : ''}</div>
                        </div>
                      )}
                      
                      {vehicle.conditionGrade && (
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-neutral-700">Condition Grade</div>
                          <div className="text-sm text-neutral-600">{vehicle.conditionGrade}</div>
                        </div>
                      )}
                      
                      {vehicle.serviceHistory && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-green-800">Service History Available</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Highlight Chips */}
                    {vehicle.highlightChips && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-neutral-700 mb-2">Highlights</div>
                        <div className="flex flex-wrap gap-2">
                          {JSON.parse(vehicle.highlightChips || '[]').map((highlight, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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

                {/* Seller Profile Card */}
                {vehicle.seller && (
                  <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 p-6 rounded-xl border border-neutral-200">
                    <h3 className="font-semibold text-neutral-900 mb-4">Seller Information</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {vehicle.seller.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-neutral-900">{vehicle.seller.username}</h4>
                          {vehicle.seller.isVerified && (
                            <span className="inline-flex items-center text-green-600" title="Verified Seller">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">
                          {vehicle.seller.isVerified ? 'Verified Seller' : 'Seller'}
                        </p>
                      </div>
                      <button className="btn-outline btn-sm">
                        Contact
                      </button>
                    </div>
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


