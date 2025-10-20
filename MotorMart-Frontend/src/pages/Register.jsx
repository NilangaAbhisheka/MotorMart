import { useMemo, useState } from 'react'
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
  const [touched, setTouched] = useState({ username:false, email:false, password:false, confirmPassword:false })
  const navigate = useNavigate()
  const LOGO_URL = "assets/logo.png"

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

  const passwordStrength = useMemo(() => {
    const value = formData.password || ''
    let score = 0
    if (value.length >= 6) score += 1
    if (/[A-Z]/.test(value)) score += 1
    if (/[0-9]/.test(value)) score += 1
    if (/[^A-Za-z0-9]/.test(value)) score += 1
    if (value.length >= 10) score += 1
    const levels = ['Weak', 'Fair', 'Good', 'Strong', 'Very strong']
    return { score, label: levels[Math.max(0, score - 1)] || 'Weak' }
  }, [formData.password])

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left info / branding panel */}
          <div className="relative hidden lg:flex flex-col justify-between rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-large p-10 min-h-[560px] text-white">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-50 w-60 -mb-10 ">
                  {LOGO_URL ? (
                    <img src={LOGO_URL} alt="MotorMart logo" className="h-50 w-60 " referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-white font-bold text-xl">M</span>
                  )}
                </div>
              </div>
              <h1 className="mt-12 text-4xl font-extrabold leading-tight">Join MotorMart</h1>
              <p className="mt-3 text-white/80">Buy, Sell, and Bid on Premium Vehicles with Ease.</p>
              <ul className="mt-6 space-y-3 text-white/90">
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-white/70" /> Secure vehicle auctions
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-white/70" /> Verified sellers
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-white/70" /> Real-time bidding system
                </li>
              </ul>
              <div className="mt-8 text-white/80 text-sm italic">
                “Over 10,000 satisfied buyers and sellers trust MotorMart.”
              </div>
            </div>
            <div className="pointer-events-none select-none">
              {/* Decorative dots / subtle illustration placeholder */}
              <div className="absolute top-6 right-6 h-20 w-24 opacity-40">
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/60"></span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right registration card */}
          <div>
            <div className="mx-auto max-w-xl rounded-3xl bg-white/90 backdrop-blur-md shadow-large p-8 sm:p-10 animate-fade-in">
              <div className="text-center">
                <h2 className="heading-2 text-neutral-900">Create Account</h2>
                <p className="mt-2 text-body text-neutral-600">Join MotorMart — the fastest-growing online vehicle auction platform.</p>
              </div>

              <form onSubmit={onSubmit} className="mt-8 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
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
                    className={`input rounded-xl h-12 ${touched.username && !formData.username ? 'border-red-300 focus:ring-red-200' : ''}`} 
                    placeholder="Choose a username" 
                    value={formData.username} 
                    onChange={e => handleChange('username', e.target.value)}
                    onBlur={()=>setTouched(prev=>({...prev, username:true}))}
                    required
                  />
                  {touched.username && !formData.username && (
                    <p className="mt-1 text-sm text-red-600">Username is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input 
                    className={`input rounded-xl h-12 ${touched.email && !formData.email ? 'border-red-300 focus:ring-red-200' : ''}`} 
                    type="email"
                    placeholder="Enter your email" 
                    value={formData.email} 
                    onChange={e => handleChange('email', e.target.value)}
                    onBlur={()=>setTouched(prev=>({...prev, email:true}))}
                    required
                  />
                  {touched.email && !formData.email && (
                    <p className="mt-1 text-sm text-red-600">Email is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Password
                  </label>
                  <input 
                    className={`input rounded-xl h-12 ${touched.password && formData.password.length < 6 ? 'border-red-300 focus:ring-red-200' : ''}`} 
                    type="password" 
                    placeholder="Create a password" 
                    value={formData.password} 
                    onChange={e => handleChange('password', e.target.value)}
                    onBlur={()=>setTouched(prev=>({...prev, password:true}))}
                    required
                  />
                  {/* Password strength indicator */}
                  <div className="mt-2">
                    <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          passwordStrength.score <= 1 ? 'bg-red-500 w-1/5' :
                          passwordStrength.score === 2 ? 'bg-yellow-500 w-2/5' :
                          passwordStrength.score === 3 ? 'bg-amber-500 w-3/5' :
                          passwordStrength.score === 4 ? 'bg-green-500 w-4/5' :
                          'bg-emerald-600 w-full'
                        }`}
                      />
                    </div>
                    <div className="mt-1 text-xs text-neutral-600">Strength: {passwordStrength.label}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Confirm Password
                  </label>
                  <input 
                    className={`input rounded-xl h-12 ${touched.confirmPassword && formData.confirmPassword !== formData.password ? 'border-red-300 focus:ring-red-200' : ''}`} 
                    type="password" 
                    placeholder="Confirm your password" 
                    value={formData.confirmPassword} 
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    onBlur={()=>setTouched(prev=>({...prev, confirmPassword:true}))}
                    required
                  />
                  {touched.confirmPassword && formData.confirmPassword !== formData.password && (
                    <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Account Type
                  </label>
                  <select 
                    className="input rounded-xl h-12" 
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
                  className="btn-primary w-full rounded-xl h-12"
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

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="/login"
                    className="btn-outline w-full"
                  >
                    Sign In Instead
                  </a>
                  {/* Social placeholders (non-functional) */}
                  <button type="button" className="btn-outline w-full" aria-label="Continue with Google">
                    Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



