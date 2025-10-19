import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { Link } from 'react-router-dom'
import CountdownTimer from '../components/CountdownTimer.jsx'

export default function SellerDashboard() {
  const [items, setItems] = useState([])

  useEffect(() => { load() }, [])

  async function load() {
    const res = await api.get('/api/vehicles')
    setItems(res.data)
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
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Auctions</h3>
            <p className="text-slate-600 mb-4">You don't have any active auctions. Add a new vehicle to start selling!</p>
            <Link to="/add-vehicle" className="btn">Add Vehicle</Link>
          </div>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeAuctions.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={item.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80`} 
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
                        <Link 
                          to={`/vehicle/${item.id}`} 
                          className="text-primary hover:text-primary-dark font-medium"
                        >
                          View Details
                        </Link>
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
                            src={item.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80`} 
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


