import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useToast } from '../../components/Toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ role: '', isVerified: '', isActive: '', search: '' })
  const [showDeleteModal, setShowDeleteModal] = useState(null)
  const toast = useToast()

  useEffect(() => {
    loadUsers()
  }, [filters])

  async function loadUsers() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.role) params.append('role', filters.role)
      if (filters.isVerified) params.append('isVerified', filters.isVerified)
      if (filters.isActive) params.append('isActive', filters.isActive)
      if (filters.search) params.append('search', filters.search)
      
      const res = await api.get(`/api/admin/users?${params}`)
      setUsers(res.data)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function verifyUser(userId) {
    try {
      await api.patch(`/api/admin/users/${userId}/verify`)
      toast.success('User verified successfully')
      loadUsers()
    } catch (error) {
      console.error('Error verifying user:', error)
      toast.error('Failed to verify user')
    }
  }

  async function toggleUserStatus(userId, currentStatus) {
    try {
      await api.patch(`/api/admin/users/${userId}/status`, { isActive: !currentStatus })
      toast.success(`User ${!currentStatus ? 'activated' : 'banned'} successfully`)
      loadUsers()
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Failed to update user status')
    }
  }

  async function deleteUser(userId) {
    try {
      await api.delete(`/api/admin/users/${userId}`)
      toast.success('User deleted successfully')
      setShowDeleteModal(null)
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Seller">Seller</option>
            <option value="Buyer">Buyer</option>
          </select>
          <select
            value={filters.isVerified}
            onChange={(e) => setFilters({ ...filters, isVerified: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Verification</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <select
            value={filters.isActive}
            onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'Seller' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                          user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.isVerified ? '✓ Verified' : '⚠ Unverified'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? '● Active' : '● Banned'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.role === 'Seller' && <div>{user.vehicleCount} vehicles</div>}
                      {user.role === 'Buyer' && <div>{user.bidCount} bids</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {!user.isVerified && user.role === 'Seller' && (
                          <button
                            onClick={() => verifyUser(user.id)}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                          >
                            Verify
                          </button>
                        )}
                        {user.role !== 'Admin' && (
                          <>
                            <button
                              onClick={() => toggleUserStatus(user.id, user.isActive)}
                              className={`px-3 py-1 text-xs rounded transition-colors ${
                                user.isActive
                                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {user.isActive ? 'Ban' : 'Activate'}
                            </button>
                            <button
                              onClick={() => setShowDeleteModal(user)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{showDeleteModal.username}</strong>? 
              This action cannot be undone and will remove all their data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => deleteUser(showDeleteModal.id)}
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
