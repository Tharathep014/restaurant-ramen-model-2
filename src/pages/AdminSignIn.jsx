import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminSignIn() {
  const { signInAsAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const result = await signInAsAdmin(email, password)
    setLoading(false)
    if (result.error) {
      setError(result.error.message)
      return
    }
    navigate('/admin', { replace: true })
  }

  return (
    <main className="admin-auth-shell">
      <section className="admin-auth-card">
        <Link to="/" className="admin-auth-brand">
          <span className="admin-brand__mark">N</span>
          <span><strong>Nami Ramen</strong><small>Operations</small></span>
        </Link>
        <span className="admin-kicker">Staff access</span>
        <h1>Welcome back.</h1>
        <p>Sign in to manage orders, menu items, and today&apos;s service.</p>
        <form onSubmit={handleSubmit} className="admin-auth-form">
          <div className="field">
            <label htmlFor="admin-email">Admin email</label>
            <input id="admin-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          {error && <p className="admin-auth-error" role="alert">{error}</p>}
          <button className="admin-auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Enter workspace'}
          </button>
        </form>
        <Link to="/sign-in" className="admin-auth-user-link">Sign in as a customer instead</Link>
      </section>
    </main>
  )
}
