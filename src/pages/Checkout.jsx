import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/formatCurrency'
import { DELIVERY_FEE, FULFILLMENT_OPTIONS } from '../utils/constants'
import { Button } from '../components/ui/Button'
import { placeOrder } from '../services/orderService'
import { getWalletBalance, checkoutWithWallet } from '../services/walletService'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [fulfillment, setFulfillment] = useState('pickup')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [walletBalance, setWalletBalance] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0
  const total = subtotal + deliveryFee

  useEffect(() => {
    if (!user) return
    getWalletBalance(user.id).then(setWalletBalance).catch(() => setWalletBalance(0))
  }, [user])

  async function handlePlaceOrder() {
    setError('')
    setPlacing(true)
    try {
      const order = paymentMethod === 'wallet'
        ? await checkoutWithWallet({ items, fulfillment, notes })
        : await placeOrder({ items, total, fulfillment, notes }, user?.id || null)
      clearCart()
      navigate('/order-confirmed', { state: { order } })
    } catch (checkoutError) {
      setError(checkoutError.message || 'Could not place the order.')
    } finally {
      setPlacing(false)
    }
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

      {user && (
        <>
          <h3 style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            How would you like to pay?
          </h3>
          <div
            className={`choice-card ${paymentMethod === 'cash' ? 'choice-card--active' : ''}`}
            onClick={() => setPaymentMethod('cash')}
          >
            <div style={{ fontWeight: 600 }}>Cash on {fulfillment}</div>
            <input
              type="radio"
              checked={paymentMethod === 'cash'}
              onChange={() => setPaymentMethod('cash')}
              aria-label="Cash"
            />
          </div>
          <div
            className={`choice-card ${paymentMethod === 'wallet' ? 'choice-card--active' : ''}`}
            onClick={() => setPaymentMethod('wallet')}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Wallet</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                Balance: {formatCurrency(walletBalance)}
              </div>
            </div>
            <input
              type="radio"
              checked={paymentMethod === 'wallet'}
              onChange={() => setPaymentMethod('wallet')}
              aria-label="Wallet"
            />
          </div>
        </>
      )}

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

      {error && (
        <p style={{ marginTop: 'var(--space-2)', color: 'var(--danger, #c0392b)' }}>{error}</p>
      )}

      <div style={{ marginTop: 'var(--space-3)' }}>
        <Button
          block
          onClick={handlePlaceOrder}
          disabled={placing || items.length === 0 || (paymentMethod === 'wallet' && walletBalance < total)}
        >
          {placing ? 'Placing order…' : `Place order · ${formatCurrency(total)}`}
        </Button>
      </div>
    </div>
  )
}
