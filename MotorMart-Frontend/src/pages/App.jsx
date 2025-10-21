import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Home from './Home.jsx'
import VehicleDetails from './VehicleDetails.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import AddVehicle from './AddVehicle.jsx'
import MyBids from './MyBids.jsx'
import MyWatchlist from './MyWatchlist.jsx'
import SellerDashboard from './SellerDashboard.jsx'
import Shop from './Shop.jsx'
import About from './About.jsx'
import Contact from './Contact.jsx'
import ProtectedRoute from '../routes/ProtectedRoute.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

// Admin Portal
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminUsers from './admin/AdminUsers.jsx'
import AdminVehicles from './admin/AdminVehicles.jsx'
import AdminBids from './admin/AdminBids.jsx'
import AdminReports from './admin/AdminReports.jsx'
import AdminSettings from './admin/AdminSettings.jsx'

export default function App() {
  return (
    <Routes>
      {/* Admin Portal Routes - No Navbar/Footer */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="bids" element={<AdminBids />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Public Routes - With Navbar/Footer */}
      <Route path="*" element={
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/vehicle/:id" element={<VehicleDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/add-vehicle" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />
              <Route path="/my-bids" element={<ProtectedRoute><MyBids /></ProtectedRoute>} />
              <Route path="/my-watchlist" element={<ProtectedRoute><MyWatchlist /></ProtectedRoute>} />
              <Route path="/seller" element={<ProtectedRoute roles={["Seller","Admin"]}><SellerDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <SiteFooter />
        </div>
      } />
    </Routes>
  )
}


