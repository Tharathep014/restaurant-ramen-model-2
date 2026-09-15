import { NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const navClass = ({ isActive }) => (isActive ? 'active' : '')

export function BottomNav() {
  const { itemCount } = useCart()

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <NavLink to="/" end className={navClass}>
        <span aria-hidden="true">🏠</span>
        Home
      </NavLink>
      <NavLink to="/categories/ramen" className={navClass}>
        <span aria-hidden="true">🍜</span>
        Menu
      </NavLink>
      <NavLink to="/cart" className={navClass}>
        <span aria-hidden="true">🛒</span>
        Cart{itemCount > 0 ? ` (${itemCount})` : ''}
      </NavLink>
      <NavLink to="/profile" className={navClass}>
        <span aria-hidden="true">👤</span>
        Profile
      </NavLink>
    </nav>
  )
}
