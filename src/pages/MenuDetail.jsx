import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMenuItem } from '../services/menuService'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/formatCurrency'
import { QuantityStepper } from '../components/ui/QuantityStepper'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { BowlMark } from '../components/ui/BowlMark'

export default function MenuDetail() {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [item, setItem] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
    getMenuItem(itemId).then(setItem)
  }, [itemId])

  if (!item) {
    return <div className="container" style={{ paddingTop: 'var(--space-3)' }}>Loading…</div>
  }

  function handleAdd() {
    addItem({ id: item.id, name: item.name, price: item.price, quantity })
    setAdded(true)
  }

  return (
    <div className="column" style={{ paddingTop: 'var(--space-3)', paddingBottom: 'var(--space-4)' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost btn"
        style={{ marginBottom: 'var(--space-2)', padding: '0.5rem 1rem' }}
      >
        ← Back
      </button>

      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-4)',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--space-3)',
        }}
      >
        {item.image && !imageFailed ? (
          <img
            className="menu-detail__image"
            src={item.image}
            alt={item.name}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <BowlMark size={80} />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.6rem' }}>{item.name}</h1>
        {item.tag && <Badge>{item.tag}</Badge>}
      </div>

      <p style={{ marginTop: '0.6rem' }}>{item.description}</p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'var(--space-3)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>
          {formatCurrency(item.price)}
        </span>
        <QuantityStepper quantity={quantity} onChange={setQuantity} />
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {added ? (
          <Button block variant="ghost" onClick={() => navigate('/cart')}>
            View cart →
          </Button>
        ) : (
          <Button block onClick={handleAdd}>
            Add {quantity} to cart · {formatCurrency(item.price * quantity)}
          </Button>
        )}
      </div>
    </div>
  )
}
