import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/formatCurrency'
import { DELIVERY_FEE, FULFILLMENT_OPTIONS } from '../utils/constants'
import { Button } from '../components/ui/Button'
import { placeOrder } from '../services/orderService'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const [fulfillment, setFulfillment] = useState('pickup')
  const [notes, setNotes] = useState('')
  const [placing, setPlacing] = useState(false)
  const navigate = useNavigate()

  const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0
  const total = subtotal + deliveryFee

  async function handlePlaceOrder() {
    setPlacing(true)
    const order = await placeOrder({
      items,
      total,
      fulfillment,
      notes,
    })
    clearCart()
    navigate('/order-confirmed', { state: { order } })
  }

  return (
    <div className="column" style={{ paddingTop: 'var(--space-3)', paddingBottom: 'var(--space-4)' }}>
      <h1 style={{ fontSize: '1.7rem' }}>Checkout</h1>

      <h3 style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
        How should we get it to you?
      </h3>
      {FULFILLMENT_OPTIONS.map((option) => (
        <div
          key={option.id}
          className={`choice-card ${fulfillment === option.id ? 'choice-card--active' : ''}`}
          onClick={() => setFulfillment(option.id)}
        >
          <div>
            <div style={{ fontWeight: 600 }}>{option.label}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{option.eta}</div>
          </div>
          <input
            type="radio"
            checked={fulfillment === option.id}
            onChange={() => setFulfillment(option.id)}
            aria-label={option.label}
          />
        </div>
      ))}

      <div className="field" style={{ marginTop: 'var(--space-3)' }}>
        <label htmlFor="notes">Notes for the kitchen (optional)</label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="No scallion, extra napkins, etc."
        />
      </div>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>{fulfillment === 'delivery' ? 'Delivery' : 'Pickup'}</span>
          <span>{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Free'}</span>
        </div>
        <div className="summary-row summary-row--total">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <Button block onClick={handlePlaceOrder} disabled={placing || items.length === 0}>
          {placing ? 'Placing order…' : `Place order · ${formatCurrency(total)}`}
        </Button>
      </div>
    </div>
  )
}
