import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const linkBase = 'px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm'
  const linkClass = ({ isActive }) => `${linkBase} ${isActive ? 'bg-primary text-white shadow-md' : 'text-neutral-700 hover:text-primary hover:bg-primary-50'}`
  
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl text-neutral-900 hover:text-primary transition-colors">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="hidden sm:block">MotorMart</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/shop" className={linkClass}>Shop</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
            
            {isAuthenticated && <NavLink to="/my-bids" className={linkClass}>My Bids</NavLink>}
            {isAuthenticated && (user?.role === 'Seller' || user?.role === 'Admin') && (
              <>
                <NavLink to="/add-vehicle" className={linkClass}>Add Vehicle</NavLink>
                <NavLink to="/seller" className={linkClass}>Dashboard</NavLink>
              </>
            )}
            
            <div className="ml-4 pl-4 border-l border-neutral-200">
              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <NavLink to="/login" className="btn-outline btn-sm">Login</NavLink>
                  <NavLink to="/register" className="btn-primary btn-sm">Register</NavLink>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-sm text-neutral-600">
                    Welcome, <span className="font-medium text-neutral-900">{user?.username}</span>
                  </div>
                  <button 
                    onClick={logout} 
                    className="btn-secondary btn-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}


