import { useState } from 'react'
import api from '../api/axios.js'
import { useToast } from '../components/Toast.jsx'

export default function AddVehicle() {
  const [form, setForm] = useState({
    title: '', make: '', model: '', year: '', bodyType: '', description: '', startingPrice: '', auctionEndTime: ''
  })
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0] || null
    if (selectedFile) {
      // Check file size (20MB limit)
      if (selectedFile.size > 20 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 20MB.')
        setFile(null)
        e.target.value = '' // Clear the input
        return
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Invalid file type. Only images (JPG, PNG, GIF, WebP) are allowed.')
        setFile(null)
        e.target.value = '' // Clear the input
        return
      }
    }
    setFile(selectedFile)
  }

  async function onSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    
    // Validate required fields
    if (!form.title || !form.make || !form.model || !form.year || !form.startingPrice || !form.auctionEndTime) {
      toast.error('Please fill in all required fields')
      setIsLoading(false)
      return
    }
    
    try {
      let imageUrl = ''
      if (file) {
        console.log('Uploading file:', file.name, 'Size:', file.size)
        const data = new FormData()
        data.append('file', file)
        
        // Add proper headers for file upload
        const res = await api.post('/api/uploads', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        imageUrl = res.data.url
        console.log('File uploaded successfully:', imageUrl)
      }
      
      const payload = {
        ...form,
        year: Number(form.year),
        startingPrice: Number(form.startingPrice),
        imageUrl
      }
      
      console.log('Creating vehicle with payload:', payload)
      await api.post('/api/vehicles', payload)
      
      setForm({ title: '', make: '', model: '', year: '', bodyType: '', description: '', startingPrice: '', auctionEndTime: '' })
      setFile(null)
      toast.success('Vehicle created successfully')
    } catch (err) {
      console.error('Error creating vehicle:', err.response?.data || err.message)
      const errorMessage = err.response?.data?.message || 'Failed to create vehicle'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="heading-2 mb-4">Add New Vehicle</h1>
          <p className="text-body text-neutral-600 max-w-2xl mx-auto">
            Create a new auction listing for your vehicle. Fill in all the details to attract potential buyers.
          </p>
        </div>

        {/* Form */}
        <div className="card p-8 shadow-large">
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="heading-4 mb-6 text-neutral-900">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Vehicle Title *
                  </label>
                  <input 
                    className="input" 
                    placeholder="e.g., 2020 BMW 3 Series" 
                    value={form.title} 
                    onChange={e=>update('title', e.target.value)} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Make *
                  </label>
                  <input 
                    className="input" 
                    placeholder="e.g., BMW" 
                    value={form.make} 
                    onChange={e=>update('make', e.target.value)} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Model *
                  </label>
                  <input 
                    className="input" 
                    placeholder="e.g., 3 Series" 
                    value={form.model} 
                    onChange={e=>update('model', e.target.value)} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Year *
                  </label>
                  <input 
                    className="input" 
                    type="number"
                    placeholder="e.g., 2020" 
                    value={form.year} 
                    onChange={e=>update('year', e.target.value)} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Body Type
                  </label>
                  <select 
                    className="input" 
                    value={form.bodyType} 
                    onChange={e=>update('bodyType', e.target.value)}
                  >
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
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Starting Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                    <input 
                      className="input pl-8" 
                      type="number"
                      step="0.01"
                      placeholder="e.g., 25000" 
                      value={form.startingPrice} 
                      onChange={e=>update('startingPrice', e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Auction Details */}
            <div>
              <h2 className="heading-4 mb-6 text-neutral-900">Auction Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Auction End Time *
                  </label>
                  <input 
                    className="input" 
                    type="datetime-local" 
                    value={form.auctionEndTime} 
                    onChange={e=>update('auctionEndTime', e.target.value)} 
                    required 
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Set when you want the auction to end
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea 
                    className="input h-32 resize-none" 
                    placeholder="Describe your vehicle's condition, features, and any important details..." 
                    value={form.description} 
                    onChange={e=>update('description', e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h2 className="heading-4 mb-6 text-neutral-900">Vehicle Image</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Upload Image
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <svg className="w-12 h-12 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="text-neutral-600 font-medium mb-2">
                        {file ? 'Change Image' : 'Click to upload image'}
                      </div>
                      <div className="text-sm text-neutral-500">
                        PNG, JPG, GIF up to 20MB
                      </div>
                    </label>
                  </div>
                </div>
                
                {file && (
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-lg" 
                      />
                      <div className="flex-1">
                        <div className="font-medium text-neutral-900">{file.name}</div>
                        <div className="text-sm text-neutral-600">
                          Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                        <div className="text-sm text-neutral-600">
                          Type: {file.type}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null)
                          document.getElementById('file-upload').value = ''
                        }}
                        className="text-neutral-400 hover:text-neutral-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
            </div>
          </div>
        )}
      </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-neutral-200">
              <button 
                className="btn-primary w-full btn-lg" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Auction...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Auction
                  </>
                )}
              </button>
            </div>
    </form>
        </div>
      </div>
    </div>
  )
}


