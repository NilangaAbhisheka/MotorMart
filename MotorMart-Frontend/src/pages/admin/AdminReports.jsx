import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminReports() {
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/reports')
      setReports(res.data)
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
        <p className="text-gray-600">Platform performance and insights</p>
      </div>

      {/* Auction Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-2">Total Auctions</div>
          <div className="text-4xl font-bold">{reports?.totalAuctions || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-2">Active Auctions</div>
          <div className="text-4xl font-bold">{reports?.activeAuctions || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-2">Ended Auctions</div>
          <div className="text-4xl font-bold">{reports?.endedAuctions || 0}</div>
        </div>
      </div>

      {/* Average Duration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Average Auction Duration</h3>
        <div className="flex items-center space-x-4">
          <div className="text-5xl font-bold text-primary">
            {reports?.averageAuctionDuration?.toFixed(1) || 0}
          </div>
          <div className="text-gray-600">days</div>
        </div>
      </div>

      {/* Popular Makes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Most Popular Car Makes</h3>
        <div className="space-y-3">
          {reports?.popularMakes?.length === 0 ? (
            <p className="text-gray-500">No data available</p>
          ) : (
            reports?.popularMakes?.map((make, idx) => (
              <div key={idx} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700">{make.make}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div
                    className="bg-gradient-to-r from-primary to-primary-600 h-8 rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${(make.count / reports.popularMakes[0].count) * 100}%` }}
                  >
                    <span className="text-white font-bold text-sm">{make.count}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Sellers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top 5 Sellers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicles</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports?.topSellers?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                reports?.topSellers?.map((seller, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                        idx === 1 ? 'bg-gray-300 text-gray-700' :
                        idx === 2 ? 'bg-orange-400 text-orange-900' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{seller.sellerName}</td>
                    <td className="px-4 py-3 text-gray-600">{seller.vehicleCount}</td>
                    <td className="px-4 py-3 font-bold text-green-600">
                      ${seller.totalRevenue.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Highest Bids */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top 5 Highest Bids</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bidder</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports?.highestBids?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                reports?.highestBids?.map((bid, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                        idx === 1 ? 'bg-gray-300 text-gray-700' :
                        idx === 2 ? 'bg-orange-400 text-orange-900' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{bid.vehicleTitle}</td>
                    <td className="px-4 py-3 text-gray-600">{bid.bidderName}</td>
                    <td className="px-4 py-3 font-bold text-green-600 text-lg">
                      ${bid.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Export Data</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => alert('CSV export would be implemented here')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            📊 Export as CSV
          </button>
          <button
            onClick={() => alert('PDF export would be implemented here')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            📄 Export as PDF
          </button>
        </div>
      </div>
    </div>
  )
}
