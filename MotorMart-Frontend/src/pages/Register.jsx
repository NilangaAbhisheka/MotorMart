import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Buyer')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    try {
      await api.post('/api/users/register', { username, email, password, role })
      navigate('/login')
    } catch (e) {
      setError('Registration failed')
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-3">
      <h1 className="text-xl font-semibold">Register</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
        <option>Buyer</option>
        <option>Seller</option>
      </select>
      <button className="btn w-full">Create Account</button>
    </form>
  )
}



