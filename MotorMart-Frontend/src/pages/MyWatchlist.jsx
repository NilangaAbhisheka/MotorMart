import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'

export default function MyWatchlist() {
  const [watchlist, setWatchlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const toast = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      loadWatchlist()
    }
  }, [isAuthenticated])

  async function loadWatchlist() {
    try {
      setIsLoading(true)
      const response = await api.get('/api/watchlist')
      setWatchlist(response.data)
    } catch (error) {
      console.error('Error loading watchlist:', error)
      toast.error('Failed to load watchlist')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Sign In Required</h2>
          <p className="text-neutral-600 mb-6">Please sign in to view your watchlist</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="btn-primary">Sign In</Link>
            <Link to="/register" className="btn-outline">Create Account</Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-neutral-600">Loading your watchlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'My Watchlist' }
      ]} />

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="heading-2 mb-4">My Watchlist</h1>
        <p className="text-body text-neutral-600 max-w-2xl mx-auto">
          Keep track of vehicles you're interested in. Click the heart icon on any vehicle to add or remove it from your watchlist.
        </p>
      </div>

      {/* Watchlist Content */}
      {watchlist.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Vehicles in Watchlist</h3>
          <p className="text-neutral-600 mb-6">
            Start building your watchlist by clicking the heart icon on vehicles you're interested in.
          </p>
          <Link to="/shop" className="btn-primary">
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Watchlist Summary</h2>
                <p className="text-neutral-600">{watchlist.length} vehicle{watchlist.length !== 1 ? 's' : ''} saved</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{watchlist.length}</div>
                <div className="text-sm text-neutral-500">Total Items</div>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchlist.map((item) => (
              <VehicleCard key={item.id} vehicle={item.vehicle} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

