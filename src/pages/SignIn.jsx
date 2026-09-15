import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'

export default function SignIn() {
  const { signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signInWithEmail(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/profile')
  }

  return (
    <div className="column" style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-4)' }}>
      <h1 style={{ fontSize: '1.7rem' }}>Sign in</h1>
      <p style={{ marginTop: '0.4rem' }}>
        Save your addresses and reorder faster. You can also order as a guest — no account
        needed at checkout.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 'var(--space-3)' }}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p style={{ color: 'var(--accent-dark)', marginBottom: 'var(--space-2)' }}>{error}</p>}

        <Button block type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
