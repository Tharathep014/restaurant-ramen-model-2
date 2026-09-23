import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button } from '../components/ui/Button'
import { BowlMark } from '../components/ui/BowlMark'
import { getUserOrders } from '../services/orderService'
import { getWalletBalance } from '../services/walletService'
import { formatCurrency } from '../utils/formatCurrency'

export default function Profile() {
  const { user, signOut } = useAuth()
  const { darkMode, setDarkMode } = useTheme()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [walletBalance, setWalletBalance] = useState(0)

  useEffect(() => {
    if (!user) return
    Promise.all([getUserOrders(user.id), getWalletBalance(user.id)])
      .then(([userOrders, balance]) => {
        setOrders(userOrders)
        setWalletBalance(balance)
      })
      .catch((error) => globalThis.console.error('[Profile] could not load account data:', error))
  }, [user])

  if (!user) {
    return (
      <div className="column" style={{ paddingTop: 'var(--space-4)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
          <BowlMark size={48} />
        </div>
        <h2>You're not signed in</h2>
        <p style={{ margin: '0.4rem auto 0', maxWidth: '30ch' }}>
          Sign in to save addresses and see past orders.
        </p>
        <div style={{ marginTop: 'var(--space-3)' }}>
          <Button as={Link} to="/sign-in">
            Sign in
          </Button>
        </div>
      </div>
    )
  }

  const displayName = user.email?.split('@')[0] || 'Nami guest'

  return (
    <div className="profile-page">
      <div className="profile-page__titlebar">
        <Link className="profile-page__back" to="/" aria-label="Back to home">‹</Link>
        <h1>Profile</h1>
        <button className="profile-page__power" type="button" onClick={signOut} aria-label="Sign out">↗</button>
      </div>

      <div className="profile-identity">
        <div className="profile-avatar" aria-hidden="true">{displayName.charAt(0).toUpperCase()}</div>
        <div>
          <h2>{displayName}</h2>
          <p>{user.email}</p>
        </div>
        <button className="profile-edit" type="button" aria-label="Edit profile">✎</button>
      </div>

      <div className="profile-wallet">
        <span className="profile-wallet__icon" aria-hidden="true">$</span>
        <span>Wallet balance</span>
        <strong>{formatCurrency(walletBalance)}</strong>
      </div>

      <section className="profile-orders">
        <div className="profile-section-heading"><h2>Order history</h2><span>{orders.length}</span></div>
        {orders.length ? orders.slice(0, 4).map((order) => <button className="profile-order" type="button" key={order.id} onClick={() => navigate('/order-confirmed', { state: { order } })}><span><strong>#{order.id}</strong><small>{new Date(order.placed_at).toLocaleDateString()} · {order.status}</small></span><b>{formatCurrency(order.total)}</b><span aria-hidden="true">›</span></button>) : <p className="profile-empty">Your completed orders will appear here.</p>}
      </section>

      <div className="profile-settings">
        <div className="profile-setting profile-setting--toggle">
          <span className="profile-setting__icon profile-setting__icon--moon" aria-hidden="true">◐</span>
          <span className="profile-setting__copy">
            <strong>Dark Mode</strong>
            <small>Switch the appearance</small>
          </span>
          <button
            className={`profile-toggle${darkMode ? ' profile-toggle--on' : ''}`}
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            aria-pressed={darkMode}
          >
            <span />
          </button>
        </div>
        <ProfileRow icon="i" title="About Nami" detail="Learn more about Nami Ramen" to="/info/about" />
        <ProfileRow icon="A" title="Language" detail="English" onClick={() => globalThis.alert('Language: English')} />
        <ProfileRow icon="♡" title="Favorites" detail="Your favorite menu items" to="/categories/ramen" />
        <ProfileRow icon="⚙" title="Settings" detail="Security and preferences" onClick={() => globalThis.alert('Account settings are managed through your sign-in provider.')} />
      </div>

      <div className="profile-settings profile-settings--secondary">
        <ProfileRow icon="?" title="FAQ" detail="Payments, delivery, and more" to="/info/faq" />
        <ProfileRow icon="§" title="Terms of Use" detail="Nami Ramen terms of service" to="/info/terms" />
        <ProfileRow icon="□" title="Privacy Policy" detail="Privacy and data information" to="/info/privacy" />
      </div>

      <div className="profile-page__signout">
        <Button variant="ghost" block onClick={signOut}>
          Sign out
        </Button>
      </div>
    </div>
  )
}

function ProfileRow({ icon, title, detail, to, onClick }) {
  const content = <><span className="profile-setting__icon">{icon}</span><span className="profile-setting__copy"><strong>{title}</strong><small>{detail}</small></span><span className="profile-setting__arrow" aria-hidden="true">›</span></>
  if (to) return <Link className="profile-setting" to={to}>{content}</Link>
  return (
    <button className="profile-setting" type="button" onClick={onClick}>
      {content}
    </button>
  )
}
