import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/formatCurrency'
import { QuantityStepper } from '../components/ui/QuantityStepper'
import { Button } from '../components/ui/Button'

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="column" style={{ paddingTop: 'var(--space-4)' }}>
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p style={{ marginTop: '0.4rem' }}>Add a bowl or two to get started.</p>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <Button as={Link} to="/categories/ramen">
              Browse the menu
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="column" style={{ paddingTop: 'var(--space-3)', paddingBottom: 'var(--space-4)' }}>
      <h1 style={{ fontSize: '1.7rem' }}>Your cart</h1>

      <div style={{ marginTop: 'var(--space-3)' }}>
        {items.map((item) => (
          <div className="cart-line" key={item.id}>
            <div className="cart-line__meta">
              <div className="cart-line__name">{item.name}</div>
              <div className="cart-line__price">{formatCurrency(item.price)} each</div>
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'var(--ink-faint)',
                  fontSize: '0.8rem',
                  padding: 0,
                  marginTop: '0.3rem',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
            <QuantityStepper
              quantity={item.quantity}
              onChange={(q) => updateQuantity(item.id, q)}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <Button block onClick={() => navigate('/checkout')}>
          Go to checkout
        </Button>
      </div>
    </div>
  )
}
