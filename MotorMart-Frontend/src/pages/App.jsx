import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Home from './Home.jsx'
import VehicleDetails from './VehicleDetails.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import AddVehicle from './AddVehicle.jsx'
import MyBids from './MyBids.jsx'
import SellerDashboard from './SellerDashboard.jsx'
import ProtectedRoute from '../routes/ProtectedRoute.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-vehicle" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />
          <Route path="/my-bids" element={<ProtectedRoute><MyBids /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute roles={["Seller","Admin"]}><SellerDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}


