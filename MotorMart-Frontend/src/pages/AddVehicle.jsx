import { useState } from 'react'
import api from '../api/axios.js'
import { useToast } from '../components/Toast.jsx'

export default function AddVehicle() {
  const [form, setForm] = useState({
    title: '', make: '', model: '', year: '', bodyType: '', description: '', startingPrice: '', auctionEndTime: ''
  })
  const [file, setFile] = useState(null)
  const toast = useToast()

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  async function onSubmit(e) {
    e.preventDefault()
    try {
      let imageUrl = ''
      if (file) {
        const data = new FormData()
        data.append('file', file)
        const res = await api.post('/api/uploads', data)
        imageUrl = res.data.url
      }
      const payload = {
        ...form,
        year: Number(form.year),
        startingPrice: Number(form.startingPrice),
        imageUrl
      }
      await api.post('/api/vehicles', payload)
      setForm({ title: '', make: '', model: '', year: '', bodyType: '', description: '', startingPrice: '', auctionEndTime: '' })
      setFile(null)
      toast.success('Vehicle created')
    } catch (err) {
      toast.error('Failed to create vehicle')
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto card p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 text-xl font-semibold">Add Vehicle</div>
      <input className="input" placeholder="Title" value={form.title} onChange={e=>update('title', e.target.value)} />
      <input className="input" placeholder="Make" value={form.make} onChange={e=>update('make', e.target.value)} />
      <input className="input" placeholder="Model" value={form.model} onChange={e=>update('model', e.target.value)} />
      <input className="input" placeholder="Year" value={form.year} onChange={e=>update('year', e.target.value)} />
      <select className="input" value={form.bodyType} onChange={e=>update('bodyType', e.target.value)}>
        <option value="">Select Body Type</option>
        <option value="Sedan">Sedan</option>
        <option value="SUV">SUV</option>
        <option value="Sports">Sports</option>
        <option value="Convertible">Convertible</option>
        <option value="Compact">Compact</option>
        <option value="Pick Up">Pick Up</option>
        <option value="Crossover">Crossover</option>
        <option value="Electric">Electric</option>
      </select>
      <input className="input" placeholder="Starting Price" value={form.startingPrice} onChange={e=>update('startingPrice', e.target.value)} />
      <input className="input" type="datetime-local" value={form.auctionEndTime} onChange={e=>update('auctionEndTime', e.target.value)} />
      <textarea className="input md:col-span-2" placeholder="Description" value={form.description} onChange={e=>update('description', e.target.value)} />
      <div className="md:col-span-2 space-y-2">
        <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
        {file && (
          <div className="flex items-center gap-3">
            <img src={URL.createObjectURL(file)} alt="Preview" className="w-32 h-24 object-cover rounded" />
            <div className="text-sm text-muted">Image preview</div>
          </div>
        )}
      </div>
      <button className="btn md:col-span-2">Create Auction</button>
    </form>
  )
}


