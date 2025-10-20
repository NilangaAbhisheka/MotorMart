import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../state/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const LOGO_URL = "assets/logo.png"

  async function onSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const res = await api.post('/api/users/login', { email, password })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (e) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left marketing panel */}
          <div className="relative hidden lg:flex flex-col justify-between rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-large p-10 min-h-[560px] text-white">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-50 w-60  -mb-10 ">
                  {LOGO_URL ? (
                    <img src={LOGO_URL} alt="MotorMart logo" className="h-50 w-60 " referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-white font-bold text-xl">M</span>
                  )}
                </div>
                
              </div>
              <h1 className="mt-12 text-4xl font-extrabold leading-tight">Create
                <br /> New Account</h1>
              <p className="mt-3 text-white/80">Already registered? <a href="/login" className="underline hover:text-white">Login</a></p>
              <a href="/register" className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold shadow-soft hover:bg-slate-100 transition-colors w-max">Learn More</a>
            </div>
            <div className="pointer-events-none select-none">
              {/* Decorative dots */}
              <div className="absolute top-6 right-6 h-20 w-24 opacity-40">
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/60"></span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right login card */}
          <div>
            <div className="mx-auto max-w-xl rounded-3xl bg-white/90 backdrop-blur-md shadow-large p-8 sm:p-10">
              <div className="text-center">
                <h2 className="heading-2 text-neutral-900">Login</h2>
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
                Email Address
              </label>
              <input 
                className="input rounded-xl h-12" 
                type="email"
                placeholder="Enter your email" 
                value={email} 
                onChange={e=>setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Password
              </label>
              <input 
                className="input rounded-xl h-12" 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-600">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-600 transition-colors">
                  Forgot your password?
                </a>
              </div>
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-neutral-500">New to MotorMart?</span>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="/register"
                    className="btn-outline w-full"
                  >
                    Create New Account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



