import { useState } from 'react'
import api from '../api/axios.js'
import { useToast } from '../components/Toast.jsx'

export default function AddVehicle() {
  const [form, setForm] = useState({
    title: '', make: '', model: '', year: '', bodyType: '', description: '', startingPrice: '', auctionEndTime: '',
    reservePrice: '', vin: '', serviceHistory: false, ownershipCount: '', conditionGrade: '', highlightChips: []
  })
  const [files, setFiles] = useState([])
  const [coverImageIndex, setCoverImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const [touched, setTouched] = useState({ title:false, make:false, model:false, year:false, startingPrice:false, auctionEndTime:false })
  const [highlightOptions] = useState([
    'New Tires', 'Accident-Free', 'Recently Serviced', 'First Owner', 'Garage Kept', 'Low Mileage', 'One Owner', 'No Accidents'
  ])

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  function toggleHighlightChip(chip) {
    setForm(prev => ({
      ...prev,
      highlightChips: prev.highlightChips.includes(chip)
        ? prev.highlightChips.filter(c => c !== chip)
        : [...prev.highlightChips, chip]
    }))
  }

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files || [])
    
    if (selectedFiles.length === 0) return
    
    // Check if adding these files would exceed the limit
    if (files.length + selectedFiles.length > 5) {
      toast.error('Maximum 5 images allowed')
      e.target.value = ''
      return
    }
    
    const validFiles = []
    
    for (const file of selectedFiles) {
      // Check file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 20MB.`)
        continue
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Only images (JPG, PNG, GIF, WebP) are allowed.`)
        continue
      }
      
      validFiles.push(file)
    }
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
    }
    
    e.target.value = '' // Clear the input
  }

  function removeFile(index) {
    setFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index)
      // Adjust cover image index if needed
      if (coverImageIndex >= newFiles.length) {
        setCoverImageIndex(Math.max(0, newFiles.length - 1))
      }
      return newFiles
    })
  }

  function setCoverImage(index) {
    setCoverImageIndex(index)
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
      let images = []
      
      if (files.length > 0) {
        console.log('Uploading files:', files.length)
        const data = new FormData()
        files.forEach(file => {
          data.append('files', file)
        })
        
        // Upload multiple files
        const res = await api.post('/api/uploads/multiple', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        
        const uploadedFiles = res.data.files
        images = uploadedFiles.map((file, index) => ({
          url: file.url,
          displayOrder: index
        }))
        
        // Set cover image (first image or selected cover image)
        if (uploadedFiles.length > 0) {
          imageUrl = uploadedFiles[coverImageIndex]?.url || uploadedFiles[0].url
        }
        
        console.log('Files uploaded successfully:', uploadedFiles.length)
      }
      
      const payload = {
        ...form,
        year: Number(form.year),
        startingPrice: Number(form.startingPrice),
        reservePrice: form.reservePrice ? Number(form.reservePrice) : null,
        ownershipCount: form.ownershipCount ? Number(form.ownershipCount) : null,
        highlightChips: JSON.stringify(form.highlightChips),
        imageUrl,
        images
      }
      
      console.log('Creating vehicle with payload:', payload)
      await api.post('/api/vehicles', payload)
      
      setForm({ title: '', make: '', model: '', year: '', bodyType: '', description: '', startingPrice: '', auctionEndTime: '', reservePrice: '', vin: '', serviceHistory: false, ownershipCount: '', conditionGrade: '', highlightChips: [] })
      setFiles([])
      setCoverImageIndex(0)
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="text-sm text-neutral-600" aria-label="Breadcrumb">
            <a href="/" className="hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded">Home</a>
            <span className="mx-2 text-neutral-400">/</span>
            <a href="/seller" className="hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded">Dashboard</a>
            <span className="mx-2 text-neutral-400">/</span>
            <span className="font-medium text-neutral-800" aria-current="page">Add Vehicle</span>
          </div>
        </div>
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
                    className={`input ${touched.title && !form.title ? 'border-red-300 focus:ring-red-200' : ''}`} 
                    placeholder="e.g., 2020 BMW 3 Series" 
                    value={form.title} 
                    onChange={e=>update('title', e.target.value)} 
                    onBlur={()=>setTouched(p=>({...p, title:true}))}
                    required 
                  />
                  {touched.title && !form.title && (<p className="mt-1 text-sm text-red-600">Title is required</p>)}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Make *
                  </label>
                  <input 
                    className={`input ${touched.make && !form.make ? 'border-red-300 focus:ring-red-200' : ''}`} 
                    placeholder="e.g., BMW" 
                    value={form.make} 
                    onChange={e=>update('make', e.target.value)} 
                    onBlur={()=>setTouched(p=>({...p, make:true}))}
                    required 
                  />
                  {touched.make && !form.make && (<p className="mt-1 text-sm text-red-600">Make is required</p>)}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Model *
                  </label>
                  <input 
                    className={`input ${touched.model && !form.model ? 'border-red-300 focus:ring-red-200' : ''}`} 
                    placeholder="e.g., 3 Series" 
                    value={form.model} 
                    onChange={e=>update('model', e.target.value)} 
                    onBlur={()=>setTouched(p=>({...p, model:true}))}
                    required 
                  />
                  {touched.model && !form.model && (<p className="mt-1 text-sm text-red-600">Model is required</p>)}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Year *
                  </label>
                  <input 
                    className={`input ${touched.year && !form.year ? 'border-red-300 focus:ring-red-200' : ''}`} 
                    type="number"
                    placeholder="e.g., 2020" 
                    value={form.year} 
                    onChange={e=>update('year', e.target.value)} 
                    onBlur={()=>setTouched(p=>({...p, year:true}))}
                    required 
                  />
                  {touched.year && !form.year && (<p className="mt-1 text-sm text-red-600">Year is required</p>)}
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
                      className={`input pl-8 ${touched.startingPrice && !form.startingPrice ? 'border-red-300 focus:ring-red-200' : ''}`} 
                      type="number"
                      step="0.01"
                      placeholder="e.g., 25000" 
                      value={form.startingPrice} 
                      onChange={e=>update('startingPrice', e.target.value)} 
                      onBlur={()=>setTouched(p=>({...p, startingPrice:true}))}
                      required 
                    />
                    {touched.startingPrice && !form.startingPrice && (<p className="mt-1 text-sm text-red-600">Starting price is required</p>)}
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
                    className={`input ${touched.auctionEndTime && !form.auctionEndTime ? 'border-red-300 focus:ring-red-200' : ''}`} 
                    type="datetime-local" 
                    value={form.auctionEndTime} 
                    onChange={e=>update('auctionEndTime', e.target.value)} 
                    onBlur={()=>setTouched(p=>({...p, auctionEndTime:true}))}
                    required 
                  />
                  {touched.auctionEndTime && !form.auctionEndTime && (<p className="mt-1 text-sm text-red-600">End time is required</p>)}
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

            {/* Reserve Price & Trust Features */}
            <div>
              <h2 className="heading-4 mb-6 text-neutral-900">Reserve Price & Trust Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Reserve Price (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                    <input 
                      className="input pl-8" 
                      type="number"
                      step="0.01"
                      placeholder="e.g., 30000" 
                      value={form.reservePrice} 
                      onChange={e=>update('reservePrice', e.target.value)} 
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Minimum price you're willing to accept
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    VIN (Optional)
                  </label>
                  <input 
                    className="input" 
                    placeholder="e.g., 1HGBH41JXMN109186" 
                    value={form.vin} 
                    onChange={e=>update('vin', e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Ownership Count
                  </label>
                  <input 
                    className="input" 
                    type="number"
                    placeholder="e.g., 1" 
                    value={form.ownershipCount} 
                    onChange={e=>update('ownershipCount', e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Condition Grade
                  </label>
                  <select 
                    className="input" 
                    value={form.conditionGrade} 
                    onChange={e=>update('conditionGrade', e.target.value)}
                  >
                    <option value="">Select Condition</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>
              
              {/* Service History Checkbox */}
              <div className="mt-6">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500" 
                    checked={form.serviceHistory} 
                    onChange={e=>update('serviceHistory', e.target.checked)} 
                  />
                  <span className="text-sm font-semibold text-neutral-700">
                    Service History Available
                  </span>
                </label>
              </div>
              
              {/* Highlight Chips */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-neutral-700 mb-3">
                  Vehicle Highlights (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {highlightOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500" 
                        checked={form.highlightChips.includes(option)} 
                        onChange={() => toggleHighlightChip(option)} 
                      />
                      <span className="text-sm text-neutral-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h2 className="heading-4 mb-6 text-neutral-900">Vehicle Images</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Upload Images (Up to 5 images)
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <svg className="w-12 h-12 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="text-neutral-600 font-medium mb-2">
                        {files.length > 0 ? 'Add More Images' : 'Click to upload images'}
                      </div>
                      <div className="text-sm text-neutral-500">
                        PNG, JPG, GIF up to 20MB each • {files.length}/5 images
                      </div>
                    </label>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-neutral-700">
                      Uploaded Images ({files.length}/5)
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {files.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className={`relative rounded-lg overflow-hidden border-2 ${
                            coverImageIndex === index 
                              ? 'border-primary-500 ring-2 ring-primary-200' 
                              : 'border-neutral-200'
                          }`}>
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Preview ${index + 1}`} 
                              className="w-full h-32 object-cover" 
                            />
                            
                            {/* Cover Image Badge */}
                            {coverImageIndex === index && (
                              <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                Cover Image
                              </div>
                            )}
                            
                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Set as Cover Button */}
                          {coverImageIndex !== index && (
                            <button
                              type="button"
                              onClick={() => setCoverImage(index)}
                              className="w-full mt-2 px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors"
                            >
                              Set as Cover
                            </button>
                          )}
                          
                          <div className="mt-1 text-xs text-neutral-500 truncate">
                            {file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {files.length > 1 && (
                      <div className="text-sm text-neutral-600 bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>The cover image will be displayed as the main image in listings and search results.</span>
                        </div>
                      </div>
                    )}
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


