import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
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
          <button className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded hover:bg-white/10" onClick={() => setOpen(v=>!v)} aria-label="Toggle Menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.75 6.75h16.5v1.5H3.75zM3.75 11.25h16.5v1.5H3.75zM3.75 15.75h16.5v1.5H3.75z"/></svg>
          </button>
          <div className="hidden md:flex items-center gap-1">
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
      {open && (
        <div className="md:hidden px-4 pb-3 space-y-1">
          <NavLink to="/" className={linkClass} onClick={()=>setOpen(false)}>Home</NavLink>
          {isAuthenticated && <NavLink to="/my-bids" className={linkClass} onClick={()=>setOpen(false)}>My Bids</NavLink>}
          {isAuthenticated && (user?.role === 'Seller' || user?.role === 'Admin') && (
            <>
              <NavLink to="/add-vehicle" className={linkClass} onClick={()=>setOpen(false)}>Add Vehicle</NavLink>
              <NavLink to="/seller" className={linkClass} onClick={()=>setOpen(false)}>Seller Dashboard</NavLink>
            </>
          )}
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={linkClass} onClick={()=>setOpen(false)}>Login</NavLink>
              <NavLink to="/register" className={linkClass} onClick={()=>setOpen(false)}>Register</NavLink>
            </>
          ) : (
            <button onClick={()=>{logout(); setOpen(false)}} className="w-full text-left bg-secondary text-secondary-foreground px-3 py-2 rounded-md">Logout</button>
          )}
        </div>
      )}
    </nav>
  )
}


