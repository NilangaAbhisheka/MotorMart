import { useEffect, useState } from 'react'
import api from '../api/axios.js'

export default function SellerDashboard() {
  const [items, setItems] = useState([])

  useEffect(() => { load() }, [])

  async function load() {
    const res = await api.get('/api/vehicles')
    setItems(res.data)
  }

  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">Seller Dashboard</div>
      <table className="w-full card">
        <thead>
          <tr className="text-left">
            <th className="p-2">Title</th>
            <th className="p-2">Current Price</th>
            <th className="p-2">Ends</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id} className="border-t">
              <td className="p-2">{i.title}</td>
              <td className="p-2">${i.currentPrice}</td>
              <td className="p-2">{new Date(i.auctionEndTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


