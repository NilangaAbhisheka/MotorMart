import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const LOGO_URL = "assets/logo.png"

  const linkBase = 'px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/40'
  const linkClass = ({ isActive }) =>
    `${linkBase} ${isActive ? 'bg-white/20 text-white shadow-md' : 'text-white/90 hover:text-white hover:bg-white/10'}`
  
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-gradient-primary shadow-medium" role="navigation" aria-label="Primary">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl text-white hover:opacity-90 transition-opacity">
            {LOGO_URL ? (
              <img
                src={LOGO_URL}
                alt="MotorMart logo"
                className="h-30 w-30 "
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">M</span>
              </div>
            )}
            
          </Link>
          
          <div className="flex items-center gap-2">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/shop" className={linkClass}>Shop</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
            
            {isAuthenticated && <NavLink to="/my-bids" className={linkClass}>My Bids</NavLink>}
            {isAuthenticated && <NavLink to="/my-watchlist" className={linkClass}>Watchlist</NavLink>}
            {isAuthenticated && (user?.role === 'Seller' || user?.role === 'Admin') && (
              <>
                <NavLink to="/add-vehicle" className={linkClass}>Add Vehicle</NavLink>
                <NavLink to="/seller" className={linkClass}>Dashboard</NavLink>
              </>
            )}
            
            <div className="ml-4 pl-4 border-l border-white/20">
              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <NavLink
                    to="/login"
                    className="px-4 py-2 rounded-lg border border-white/60 text-white text-sm font-semibold hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-white text-blue-600 text-sm font-semibold shadow-soft hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    Register
                  </NavLink>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-sm text-white/90">
                    Welcome, <span className="font-medium text-white">{user?.username}</span>
                  </div>
                  <button 
                    onClick={logout} 
                    className="btn-secondary btn-sm focus:outline-none focus:ring-2 focus:ring-white/40"
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


