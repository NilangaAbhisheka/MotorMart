import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useToast } from '../../components/Toast'
import { Link } from 'react-router-dom'

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', search: '' })
  const [showDeleteModal, setShowDeleteModal] = useState(null)
  const [showCloseModal, setShowCloseModal] = useState(null)
  const toast = useToast()

  useEffect(() => {
    loadVehicles()
  }, [filters])

  async function loadVehicles() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)
      
      const res = await api.get(`/api/admin/vehicles?${params}`)
      setVehicles(res.data)
    } catch (error) {
      console.error('Error loading vehicles:', error)
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  async function pauseAuction(vehicleId) {
    try {
      await api.post(`/api/admin/auction/pause/${vehicleId}`)
      toast.success('Auction status updated')
      loadVehicles()
    } catch (error) {
      console.error('Error pausing auction:', error)
      toast.error('Failed to update auction status')
    }
  }

  async function closeAuction(vehicleId, markAsSold) {
    try {
      await api.post(`/api/admin/auction/close/${vehicleId}`, { markAsSold })
      toast.success('Auction closed successfully')
      setShowCloseModal(null)
      loadVehicles()
    } catch (error) {
      console.error('Error closing auction:', error)
      toast.error('Failed to close auction')
    }
  }

  async function deleteVehicle(vehicleId) {
    try {
      await api.delete(`/api/admin/vehicles/${vehicleId}`)
      toast.success('Vehicle deleted successfully')
      setShowDeleteModal(null)
      loadVehicles()
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      toast.error('Failed to delete vehicle')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Management</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by title, make, or model..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
            <option value="paused">Paused</option>
            <option value="sold">Sold</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bids</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No vehicles found
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <Link 
                          to={`/vehicle/${vehicle.id}`}
                          className="font-medium text-gray-900 hover:text-primary"
                        >
                          {vehicle.title}
                        </Link>
                        <div className="text-sm text-gray-500">
                          {vehicle.make} {vehicle.model} • {vehicle.year}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {vehicle.sellerName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">
                          ${vehicle.currentPrice.toLocaleString()}
                        </div>
                        <div className="text-gray-500">
                          Start: ${vehicle.startingPrice.toLocaleString()}
                        </div>
                        {vehicle.reservePrice && (
                          <div className={`text-xs ${vehicle.reserveMet ? 'text-green-600' : 'text-red-600'}`}>
                            Reserve: ${vehicle.reservePrice.toLocaleString()}
                            {vehicle.reserveMet ? ' ✓' : ' ✗'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {vehicle.bidCount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vehicle.status === 'Active' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                        vehicle.status === 'Ended' ? 'bg-blue-100 text-blue-800' :
                        vehicle.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(vehicle.auctionEndTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        {!vehicle.isClosed && (
                          <button
                            onClick={() => pauseAuction(vehicle.id)}
                            className={`px-3 py-1 text-xs rounded transition-colors ${
                              vehicle.isPaused
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-yellow-600 text-white hover:bg-yellow-700'
                            }`}
                          >
                            {vehicle.isPaused ? 'Resume' : 'Pause'}
                          </button>
                        )}
                        {!vehicle.isClosed && (
                          <button
                            onClick={() => setShowCloseModal(vehicle)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Close
                          </button>
                        )}
                        <button
                          onClick={() => setShowDeleteModal(vehicle)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Close Auction Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Close Auction</h3>
            <p className="text-gray-600 mb-4">
              Close auction for <strong>{showCloseModal.title}</strong>?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => closeAuction(showCloseModal.id, true)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Close & Mark as Sold
              </button>
              <button
                onClick={() => closeAuction(showCloseModal.id, false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close Without Sale
              </button>
              <button
                onClick={() => setShowCloseModal(null)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Vehicle</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{showDeleteModal.title}</strong>? 
              This will also delete all bids and watchlist entries.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => deleteVehicle(showDeleteModal.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
