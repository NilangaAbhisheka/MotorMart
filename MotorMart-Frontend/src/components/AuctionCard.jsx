import { Link } from 'react-router-dom'
import CountdownTimer from './CountdownTimer.jsx'
import useCountdown from '../hooks/useCountdown.jsx'

export default function AuctionCard({ vehicle, highlight = false }) {
  const { isEnded } = useCountdown(vehicle.auctionEndTime)
  return (
    <Link to={`/vehicle/${vehicle.id}`} className="block card card-hover overflow-hidden group relative">
      <div className="relative">
        <img src={vehicle.imageUrl} alt={vehicle.title} className={`w-full h-48 object-cover ${isEnded ? 'grayscale' : ''}`} />
        {highlight && (
          <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-semibold shadow">
            Highest Bidder
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="font-semibold text-slate-900">{vehicle.title}</div>
        </div>
        <div className="text-sm text-muted">{vehicle.make} {vehicle.model} • {vehicle.year}</div>
        <div className="flex items-center justify-between">
          <div className="text-primary font-semibold">${vehicle.currentPrice}</div>
          <CountdownTimer endTime={vehicle.auctionEndTime} />
        </div>
        <button className="btn w-full group-hover:translate-y-[-1px] transition-transform">Place Bid</button>
      </div>
      {isEnded && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center text-white font-semibold">
          Auction Ended
        </div>
      )}
    </Link>
  )
}


