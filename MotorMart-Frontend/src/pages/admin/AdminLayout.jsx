import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import { useEffect } from 'react'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role !== 'Admin') {
    return null
  }

  const navItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/users', icon: '👥', label: 'Users' },
    { path: '/admin/vehicles', icon: '🚗', label: 'Vehicles' },
    { path: '/admin/bids', icon: '💰', label: 'Bids' },
    { path: '/admin/reports', icon: '📈', label: 'Reports' },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏛️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Portal</h1>
              <p className="text-xs text-gray-400">MotorMart</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">{user.username[0].toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{user.username}</p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {navItems.find(item => isActive(item.path))?.label || 'Admin Panel'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Manage your auction platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                View Site →
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
