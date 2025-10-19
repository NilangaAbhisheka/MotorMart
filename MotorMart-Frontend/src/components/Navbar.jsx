import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const linkBase = 'px-3 py-2 rounded-md transition-colors'
  const linkClass = ({ isActive }) => `${linkBase} ${isActive ? 'bg-secondary text-secondary-foreground' : 'text-white/90 hover:text-white hover:bg-white/10'}`
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-slate-900 text-white shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-sm">M</span>
            </div>
            MotorMart
          </Link>
          <div className="flex items-center gap-1">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            {isAuthenticated && <NavLink to="/my-bids" className={linkClass}>My Bids</NavLink>}
            {isAuthenticated && (user?.role === 'Seller' || user?.role === 'Admin') && (
              <>
                <NavLink to="/add-vehicle" className={linkClass}>Add Vehicle</NavLink>
                <NavLink to="/seller" className={linkClass}>Seller Dashboard</NavLink>
              </>
            )}
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={linkClass}>Login</NavLink>
                <NavLink to="/register" className={linkClass}>Register</NavLink>
              </>
            ) : (
              <button onClick={logout} className="ml-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-md hover:opacity-90">Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}


