import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentAuctions, setRecentAuctions] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      setLoading(true)
      const [statsRes, auctionsRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/recent-auctions'),
        api.get('/api/admin/recent-users')
      ])
      setStats(statsRes.data)
      setRecentAuctions(auctionsRes.data)
      setRecentUsers(usersRes.data)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'bg-blue-500', link: '/admin/users' },
    { label: 'Active Auctions', value: stats?.totalActiveAuctions || 0, icon: '🚗', color: 'bg-green-500', link: '/admin/vehicles' },
    { label: 'Total Bids', value: stats?.totalBids || 0, icon: '💰', color: 'bg-yellow-500', link: '/admin/bids' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💵', color: 'bg-purple-500', link: '/admin/reports' },
  ]

  const subStats = [
    { label: 'Sellers', value: stats?.totalSellers || 0 },
    { label: 'Buyers', value: stats?.totalBuyers || 0 },
    { label: 'Total Vehicles', value: stats?.totalVehicles || 0 },
    { label: 'Ended Auctions', value: stats?.totalEndedAuctions || 0 },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Link
            key={idx}
            to={stat.link}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Sub Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {subStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Auctions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Auctions</h3>
              <Link to="/admin/vehicles" className="text-sm text-primary hover:underline">
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentAuctions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No auctions yet</div>
            ) : (
              recentAuctions.map((auction) => (
                <div key={auction.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{auction.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      auction.status === 'Active' ? 'bg-green-100 text-green-800' :
                      auction.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {auction.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{auction.make} {auction.model} • {auction.year}</span>
                    <span className="font-semibold text-primary">${auction.currentPrice.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Seller: {auction.sellerName} • {auction.bidCount} bids
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Users</h3>
              <Link to="/admin/users" className="text-sm text-primary hover:underline">
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No users yet</div>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{user.username}</h4>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'Seller' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                    {user.role === 'Seller' && <span>• {user.vehicleCount} vehicles</span>}
                    {user.role === 'Buyer' && <span>• {user.bidCount} bids</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="text-sm font-medium text-gray-700">Manage Users</div>
          </Link>
          <Link
            to="/admin/vehicles"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center"
          >
            <div className="text-3xl mb-2">🚗</div>
            <div className="text-sm font-medium text-gray-700">Manage Vehicles</div>
          </Link>
          <Link
            to="/admin/bids"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center"
          >
            <div className="text-3xl mb-2">💰</div>
            <div className="text-sm font-medium text-gray-700">View Bids</div>
          </Link>
          <Link
            to="/admin/reports"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center"
          >
            <div className="text-3xl mb-2">📈</div>
            <div className="text-sm font-medium text-gray-700">View Reports</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
