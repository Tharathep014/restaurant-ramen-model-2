import { NavLink } from 'react-router-dom'
import { BowlMark } from '../ui/BowlMark'
import { useCart } from '../../context/CartContext'
import { RESTAURANT_NAME } from '../../utils/constants'

export function Header() {
  const { itemCount } = useCart()

  return (
    <header className="site-header">
      <div className="container site-header__row">
        <div className="topbar__welcome">
          <span className="topbar__kicker">NAMI RAMEN</span>
          <strong>Good to see you</strong>
        </div>
        <NavLink to="/" className="brand" style={{ textDecoration: 'none' }} aria-label={RESTAURANT_NAME}>
          <BowlMark size={26} />
          <span>{RESTAURANT_NAME}</span>
        </NavLink>

        <div className="header-actions">
          <NavLink to="/profile" className="icon-btn" aria-label="Profile" title="Profile">
            <span aria-hidden="true">👤</span>
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
