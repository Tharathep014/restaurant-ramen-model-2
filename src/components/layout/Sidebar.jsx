import { NavLink } from 'react-router-dom'
import { BowlMark } from '../ui/BowlMark'
import { CartMark } from '../ui/CartMark'
import { UserMark } from '../ui/UserMark'
import { RESTAURANT_NAME } from '../../utils/constants'

const navItems = [
  { to: '/', label: 'Home', icon: '⌂', end: true },
  { to: '/categories/ramen', label: 'Menu', icon: '☰' },
  { to: '/search', label: 'Search', icon: '⌕' },
  { to: '/cart', label: 'Your order', icon: 'cart' },
  { to: '/profile', label: 'Profile', icon: 'user' },
]

export function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <NavLink
        to="/"
        className="sidebar__brand"
        onClick={(event) => {
          event.preventDefault()
          onToggle()
        }}
      >
        <BowlMark size={30} />
        <span>{RESTAURANT_NAME}</span>
      </NavLink>
      <p className="sidebar__eyebrow">Your kitchen companion</p>
      <nav className="sidebar__nav" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}>
            <span className="sidebar__icon" aria-hidden="true">
              {item.icon === 'cart' ? <CartMark /> : item.icon === 'user' ? <UserMark /> : item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__note">
        <span className="sidebar__note-mark">+</span>
        <strong>Fresh from the broth</strong>
        <span>Order ahead and skip the wait.</span>
      </div>
      <div className="sidebar__footer">Open daily · 11am–10pm</div>
    </aside>
  )
}
