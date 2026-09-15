import { NavLink } from 'react-router-dom'
import { BowlMark } from '../ui/BowlMark'
import { useCart } from '../../context/CartContext'
import { RESTAURANT_NAME } from '../../utils/constants'

export function Header() {
  const { itemCount } = useCart()

  return (
    <header className="site-header">
      <div className="container site-header__row">
        <NavLink to="/" className="brand" style={{ textDecoration: 'none' }}>
          <BowlMark size={26} />
          {RESTAURANT_NAME}
        </NavLink>

        <nav className="top-nav" aria-label="Primary">
          <NavLink to="/categories/ramen">Menu</NavLink>
        </nav>

        <div className="header-actions">
          <NavLink to="/profile" className="icon-btn" aria-label="Profile" title="Profile">
            <span aria-hidden="true">👤</span>
          </NavLink>
          <NavLink to="/search" className="icon-btn" aria-label="Search menu" title="Search menu">
            <span aria-hidden="true">⌕</span>
          </NavLink>
          <NavLink to="/cart" className="icon-btn" aria-label="Cart">
            🛒
            {itemCount > 0 && <span className="icon-btn__count">{itemCount}</span>}
          </NavLink>
        </div>
      </div>
    </header>
  )
}
