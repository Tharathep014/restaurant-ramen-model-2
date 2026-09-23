import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { RESTAURANT_NAME } from '../../utils/constants'

const adminNavItems = [
  { to: '/admin', label: 'Overview', icon: '01', end: true },
  { to: '/admin/menu', label: 'Menu', icon: '02' },
  { to: '/admin/orders', label: 'Orders', icon: '03' },
]

export function AdminLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          <span className="admin-brand__mark">N</span>
          <span>
            <strong>{RESTAURANT_NAME}</strong>
            <small>Operations</small>
          </span>
        </Link>
        <div className="admin-sidebar__label">Workspace</div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {adminNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__bottom">
          <Link to="/" className="admin-storefront-link">View storefront</Link>
          <button type="button" className="admin-signout" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar__eyebrow">Admin workspace</span>
            <strong>Good service starts behind the counter.</strong>
          </div>
          <div className="admin-account">
            <span className="admin-account__status" />
            <span>{user?.email || 'Store manager'}</span>
          </div>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
