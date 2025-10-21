import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useToast } from '../../components/Toast'
import { Link } from 'react-router-dom'

export default function AdminBids() {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ vehicleId: '', userId: '' })
  const [showDeleteModal, setShowDeleteModal] = useState(null)
  const toast = useToast()

  useEffect(() => {
    loadBids()
  }, [filters])

  async function loadBids() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.vehicleId) params.append('vehicleId', filters.vehicleId)
      if (filters.userId) params.append('userId', filters.userId)
      
      const res = await api.get(`/api/admin/bids?${params}`)
      setBids(res.data)
    } catch (error) {
      console.error('Error loading bids:', error)
      toast.error('Failed to load bids')
    } finally {
      setLoading(false)
    }
  }

  async function deleteBid(bidId) {
    try {
      await api.delete(`/api/admin/bids/${bidId}`)
      toast.success('Bid deleted successfully')
      setShowDeleteModal(null)
      loadBids()
    } catch (error) {
      console.error('Error deleting bid:', error)
      toast.error('Failed to delete bid')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bids...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bid Management</h2>
        <p className="text-gray-600 mb-4">Monitor and manage all auction bids</p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Total Bids</div>
            <div className="text-2xl font-bold text-blue-900">{bids.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Total Value</div>
            <div className="text-2xl font-bold text-green-900">
              ${bids.reduce((sum, bid) => sum + bid.amount, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">Unique Bidders</div>
            <div className="text-2xl font-bold text-purple-900">
              {new Set(bids.map(b => b.userId)).size}
            </div>
          </div>
        </div>
      </div>

      {/* Bids Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bid ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bidder</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Placed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bids.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No bids found
                  </td>
                </tr>
              ) : (
                bids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      #{bid.id}
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        to={`/vehicle/${bid.vehicleId}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {bid.vehicleTitle}
                      </Link>
                      <div className="text-xs text-gray-500">ID: {bid.vehicleId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{bid.bidderName}</div>
                      <div className="text-xs text-gray-500">{bid.bidderEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-green-600">
                        ${bid.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{new Date(bid.timePlaced).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(bid.timePlaced).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setShowDeleteModal(bid)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Bid</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this bid?
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Bidder:</strong> {showDeleteModal.bidderName}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Vehicle:</strong> {showDeleteModal.vehicleTitle}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Amount:</strong> ${showDeleteModal.amount.toLocaleString()}
              </div>
            </div>
            <p className="text-sm text-red-600 mb-6">
              ⚠️ This will update the vehicle's current price if this was the highest bid.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => deleteBid(showDeleteModal.id)}
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
