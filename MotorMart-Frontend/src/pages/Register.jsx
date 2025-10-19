import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Buyer'
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }
    
    try {
      await api.post('/api/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
      navigate('/login')
    } catch (e) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h2 className="mt-6 heading-2">Create Account</h2>
          <p className="mt-2 text-body text-neutral-600">
            Join MotorMart and start bidding on amazing vehicles
          </p>
        </div>

        {/* Form */}
        <div className="card p-8 shadow-large">
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-secondary-50 border border-secondary-200 text-secondary-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Username
              </label>
              <input 
                className="input" 
                placeholder="Choose a username" 
                value={formData.username} 
                onChange={e => handleChange('username', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email Address
              </label>
              <input 
                className="input" 
                type="email"
                placeholder="Enter your email" 
                value={formData.email} 
                onChange={e => handleChange('email', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Password
              </label>
              <input 
                className="input" 
                type="password" 
                placeholder="Create a password" 
                value={formData.password} 
                onChange={e => handleChange('password', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Confirm Password
              </label>
              <input 
                className="input" 
                type="password" 
                placeholder="Confirm your password" 
                value={formData.confirmPassword} 
                onChange={e => handleChange('confirmPassword', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Account Type
              </label>
              <select 
                className="input" 
                value={formData.role} 
                onChange={e => handleChange('role', e.target.value)}
              >
                <option value="Buyer">Buyer - Bid on vehicles</option>
                <option value="Seller">Seller - List vehicles for auction</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-neutral-600">
                I agree to the{' '}
                <a href="#" className="text-primary hover:text-primary-600 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:text-primary-600 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="btn-outline w-full"
              >
                Sign In Instead
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



