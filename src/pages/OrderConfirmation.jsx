import { useEffect, useState } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { BowlMark } from '../components/ui/BowlMark'
import { Button } from '../components/ui/Button'
import { formatCurrency } from '../utils/formatCurrency'

export default function OrderConfirmation() {
  const { state } = useLocation()
  const order = state?.order
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsProcessing(false), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  if (!order) return <Navigate to="/" replace />

  if (isProcessing) {
    return (
      <div className="column" style={{ paddingTop: 'var(--space-5)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-3)' }}>
          <BowlMark size={64} />
        </div>
        <h1 style={{ fontSize: '1.7rem' }}>Processing your order</h1>
        <p style={{ margin: '0.6rem auto 0' }}>Please wait while we confirm your order.</p>
        <div className="order-processing" style={{ marginTop: 'var(--space-4)' }} role="status" aria-live="polite">
          <span className="order-processing__spinner" aria-hidden="true" />
          Confirming...
        </div>
      </div>
    )
  }

  return (
    <div className="column" style={{ paddingTop: 'var(--space-5)', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-3)' }}>
        <BowlMark size={64} />
      </div>
      <h1 style={{ fontSize: '1.7rem' }}>Order confirmed</h1>
      <p style={{ margin: '0.6rem auto 0', maxWidth: '32ch' }}>
        Order <strong>{order.id}</strong> is in the queue.{' '}
        {order.fulfillment === 'delivery'
          ? "We'll text you when it's on its way."
          : "We'll have it ready for pickup shortly."}
      </p>
      <div
        style={{
          marginTop: 'var(--space-3)',
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          fontWeight: 600,
        }}
      >
        {formatCurrency(order.total)}
      </div>
      <div style={{ marginTop: 'var(--space-4)' }}>
        <Button as={Link} to="/" block>
          Back to home
        </Button>
      </div>
    </div>
  )
}
