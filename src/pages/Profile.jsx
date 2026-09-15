import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button } from '../components/ui/Button'
import { BowlMark } from '../components/ui/BowlMark'

export default function Profile() {
  const { user, signOut } = useAuth()
  const { darkMode, setDarkMode } = useTheme()

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
        <strong>฿0.00</strong>
      </div>

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
        <ProfileRow icon="i" title="About Nami" detail="Learn more about Nami Ramen" />
        <ProfileRow icon="A" title="Language" detail="English" />
        <ProfileRow icon="♡" title="Favorites" detail="Your favorite menu items" />
        <ProfileRow icon="⚙" title="Settings" detail="Security and preferences" />
      </div>

      <div className="profile-settings profile-settings--secondary">
        <ProfileRow icon="?" title="FAQ" detail="Payments, delivery, and more" />
        <ProfileRow icon="§" title="Terms of Use" detail="Nami Ramen terms of service" />
        <ProfileRow icon="□" title="Privacy Policy" detail="Privacy and data information" />
      </div>

      <div className="profile-page__signout">
        <Button variant="ghost" block onClick={signOut}>
          Sign out
        </Button>
      </div>
    </div>
  )
}

function ProfileRow({ icon, title, detail }) {
  return (
    <button className="profile-setting" type="button">
      <span className="profile-setting__icon">{icon}</span>
      <span className="profile-setting__copy">
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <span className="profile-setting__arrow" aria-hidden="true">›</span>
    </button>
  )
}
