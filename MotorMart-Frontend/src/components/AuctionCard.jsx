import { Link } from 'react-router-dom'
import CountdownTimer from './CountdownTimer.jsx'
import useCountdown from '../hooks/useCountdown.jsx'
import { useAuth } from '../state/AuthContext.jsx'

export default function AuctionCard({ vehicle, highlight = false }) {
  const { isEnded } = useCountdown(vehicle.auctionEndTime)
  const { user } = useAuth()
  const isSeller = user?.role === 'Seller'
  
  // Generate placeholder image URL based on vehicle make/model
  const placeholderImage = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80`
  
  return (
    <Link to={`/vehicle/${vehicle.id}`} className="block card card-hover overflow-hidden group relative animate-scale-in ring-1 ring-gray-200 rounded-lg">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={vehicle.imageUrl || placeholderImage}
          alt={vehicle.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${isEnded ? 'grayscale' : 'group-hover:scale-105'}`}
          onError={(e) => {
            e.target.src = placeholderImage
          }}
        />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {highlight && (
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              🔥 Ending Soon
            </div>
          )}
          {isEnded && (
            <div className="bg-gradient-to-r from-neutral-600 to-neutral-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              Auction Ended
            </div>
          )}
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
          <div className="text-primary font-bold text-sm">${vehicle.currentPrice?.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="space-y-2">
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
          {vehicle.bodyType && (
            <div className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full inline-block">
              {vehicle.bodyType}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <CountdownTimer endTime={vehicle.auctionEndTime} />
          </div>
        </div>
        
        {isSeller ? (
          <div className="w-full p-3 text-center text-sm text-neutral-500 bg-neutral-50 rounded-lg border border-neutral-200">
            View Details
          </div>
        ) : (
          <button className="btn-primary w-full group-hover:translate-y-[-2px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400">
            Place Bid
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}
      </div>
      
      {isEnded && (
        <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="font-semibold">Auction Ended</div>
            <div className="text-sm opacity-80">View Results</div>
          </div>
        </div>
      )}
    </Link>
  )
}


