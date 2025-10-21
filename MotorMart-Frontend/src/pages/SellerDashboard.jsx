import { useEffect, useState } from 'react'
import api, { getImageUrl } from '../api/axios.js'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'
import { useToast } from '../components/Toast.jsx'
import { useAuth } from '../state/AuthContext.jsx'

export default function SellerDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState({})
  const toast = useToast()
  const { user } = useAuth()

  useEffect(() => { 
    if (user?.id) {
      load() 
    }
  }, [user?.id])

  async function load() {
    if (!user?.id) {
      toast.error('User not authenticated')
      return
    }
    
    try {
      const res = await api.get(`/api/vehicles/seller/${user.id}`)
      setItems(res.data)
    } catch (error) {
      console.error('Error loading seller vehicles:', error)
      toast.error('Failed to load your vehicles')
    }
  }

  async function pauseAuction(vehicleId) {
    try {
      setLoading(prev => ({ ...prev, [vehicleId]: true }))
      await api.post(`/api/auction/pause/${vehicleId}`)
      await load() // Reload to get updated data
      toast.success('Auction paused successfully')
    } catch (error) {
      console.error('Error pausing auction:', error)
      toast.error('Failed to pause auction')
    } finally {
      setLoading(prev => ({ ...prev, [vehicleId]: false }))
    }
  }

  async function extendAuction(vehicleId) {
    try {
      setLoading(prev => ({ ...prev, [vehicleId]: true }))
      await api.post(`/api/auction/extend/${vehicleId}`, { extendMinutes: 5 })
      await load() // Reload to get updated data
      toast.success('Auction extended by 5 minutes')
    } catch (error) {
      console.error('Error extending auction:', error)
      toast.error('Failed to extend auction')
    } finally {
      setLoading(prev => ({ ...prev, [vehicleId]: false }))
    }
  }

  const activeAuctions = items.filter(item => new Date(item.auctionEndTime) > new Date())
  const endedAuctions = items.filter(item => new Date(item.auctionEndTime) <= new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Seller Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your vehicle auctions and track performance</p>
        </div>
        <Link to="/add-vehicle" className="btn">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Vehicle
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-primary">{items.length}</div>
          <div className="text-sm text-slate-600">Total Vehicles</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{activeAuctions.length}</div>
          <div className="text-sm text-slate-600">Active Auctions</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">{endedAuctions.length}</div>
          <div className="text-sm text-slate-600">Ended Auctions</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-slate-900">
            ${items.reduce((sum, item) => sum + item.currentPrice, 0).toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">Total Value</div>
        </div>
      </div>

      {/* Active Auctions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Active Auctions</h2>
          <span className="text-sm text-slate-500">{activeAuctions.length} auctions</span>
        </div>
        
        {activeAuctions.length === 0 ? (
          <EmptyState
            title="No Active Auctions"
            subtitle="You don't have any active auctions. Add a new vehicle to start selling!"
          >
            <Link to="/add-vehicle" className="btn">Add Vehicle</Link>
          </EmptyState>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Current Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bids</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time Remaining</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeAuctions.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={getImageUrl(item.imageUrl) || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80`} 
                            alt={item.title} 
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                            onError={(e) => {
                              e.target.src = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80`
                            }}
                          />
                          <div>
                            <div className="font-medium text-neutral-900">{item.title}</div>
                            <div className="text-sm text-neutral-500">{item.make} {item.model} • {item.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-semibold text-primary">${item.currentPrice}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">-</div>
                      </td>
                      <td className="px-6 py-4">
                        <CountdownTimer endTime={item.auctionEndTime} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => pauseAuction(item.id)}
                            disabled={loading[item.id]}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                              item.isPaused 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            } disabled:opacity-50`}
                          >
                            {loading[item.id] ? (
                              <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : item.isPaused ? (
                              'Resume'
                            ) : (
                              'Pause'
                            )}
                          </button>
                          
                          <button
                            onClick={() => extendAuction(item.id)}
                            disabled={loading[item.id] || item.isPaused}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50"
                          >
                            +5min
                          </button>
                          
                          <Link 
                            to={`/vehicle/${item.id}`} 
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Ended Auctions */}
      {endedAuctions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Ended Auctions</h2>
            <span className="text-sm text-slate-500">{endedAuctions.length} auctions</span>
          </div>
          
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Final Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ended</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {endedAuctions.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={getImageUrl(item.imageUrl) || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80`} 
                            alt={item.title} 
                            className="w-12 h-12 rounded-lg object-cover mr-4 grayscale"
                            onError={(e) => {
                              e.target.src = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80`
                            }}
                          />
                          <div>
                            <div className="font-medium text-neutral-900">{item.title}</div>
                            <div className="text-sm text-neutral-500">{item.make} {item.model} • {item.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-semibold text-slate-900">${item.currentPrice}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">
                          {new Date(item.auctionEndTime).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Ended
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


