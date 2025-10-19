import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../state/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    try {
      const res = await api.post('/api/users/login', { email, password })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (e) {
      setError('Invalid credentials')
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-3">
      <h1 className="text-xl font-semibold">Login</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn w-full">Login</button>
    </form>
  )
}



