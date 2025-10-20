import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import { useAuth } from '../state/AuthContext.jsx'

export default function VehicleCard({ vehicle }) {
  const placeholderImage = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80`
  const isEnded = new Date(vehicle.auctionEndTime) <= new Date()
  const { isAuthenticated } = useAuth()
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check watchlist status on mount
  useEffect(() => {
    if (isAuthenticated) {
      checkWatchlistStatus()
    }
  }, [isAuthenticated, vehicle.id])

  async function checkWatchlistStatus() {
    try {
      const response = await api.get(`/api/watchlist/check/${vehicle.id}`)
      setIsInWatchlist(response.data.isInWatchlist)
    } catch (error) {
      console.error('Error checking watchlist status:', error)
    }
  }

  async function toggleWatchlist(e) {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) return
    
    setIsLoading(true)
    try {
      if (isInWatchlist) {
        await api.delete(`/api/watchlist/${vehicle.id}`)
        setIsInWatchlist(false)
      } else {
        await api.post(`/api/watchlist/${vehicle.id}`)
        setIsInWatchlist(true)
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get auction status badge
  function getAuctionBadge() {
    if (isEnded) {
      return vehicle.isSold ? 
        { text: 'Sold', color: 'bg-red-100 text-red-800' } :
        { text: 'Ended', color: 'bg-gray-100 text-gray-800' }
    }
    
    if (vehicle.isPaused) {
      return { text: 'Paused', color: 'bg-yellow-100 text-yellow-800' }
    }
    
    if (vehicle.reservePrice && vehicle.currentPrice >= vehicle.reservePrice) {
      return { text: 'Reserve Met', color: 'bg-green-100 text-green-800' }
    }
    
    if (vehicle.reservePrice) {
      return { text: 'No Reserve', color: 'bg-blue-100 text-blue-800' }
    }
    
    return { text: 'No Reserve', color: 'bg-blue-100 text-blue-800' }
  }

  const auctionBadge = getAuctionBadge()

  return (
    <Link to={`/vehicle/${vehicle.id}`} className="block card card-hover overflow-hidden group relative animate-scale-in ring-1 ring-gray-200 rounded-lg">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={vehicle.imageUrl || placeholderImage}
          alt={vehicle.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${isEnded ? 'grayscale' : 'group-hover:scale-105'}`}
          onError={(e) => { e.target.src = placeholderImage }}
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
          <div className="text-primary font-bold text-sm">${vehicle.currentPrice?.toLocaleString()}</div>
        </div>
        
        {/* Watchlist Heart Icon */}
        {isAuthenticated && (
          <button
            onClick={toggleWatchlist}
            disabled={isLoading}
            className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isInWatchlist 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <svg className="w-5 h-5" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
        
        {/* Auction Status Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${auctionBadge.color}`}>
            {auctionBadge.text}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg text-neutral-900 group-hover:text-primary transition-colors line-clamp-2">
          {vehicle.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <span className="font-medium">{vehicle.make}</span>
          <span>•</span>
          <span>{vehicle.model}</span>
          <span>•</span>
          <span className="font-medium">{vehicle.year}</span>
        </div>
        
        {/* Seller Info with Verification Badge */}
        {vehicle.seller && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span>by {vehicle.seller.username}</span>
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
          <div className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full inline-block">
            {vehicle.bodyType}
          </div>
        )}
      </div>
    </Link>
  )
}


