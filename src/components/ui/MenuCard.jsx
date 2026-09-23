import { Link } from 'react-router-dom'
import { useState } from 'react'
import { BowlMark } from './BowlMark'
import { Badge } from './Badge'
import { formatCurrency } from '../../utils/formatCurrency'

export function MenuCard({ item }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <Link to={`/menu/${item.id}`} className="menu-card">
      <span className="menu-card__mark">
        {item.image && !imageFailed ? (
          <img src={item.image} alt="" onError={() => setImageFailed(true)} />
        ) : (
          <BowlMark size={26} />
        )}
      </span>
      <span className="menu-card__body">
        <span className="menu-card__top">
          <span className="menu-card__name">{item.name}</span>
          <span className="menu-card__price">{formatCurrency(item.price)}</span>
        </span>
        <span className="menu-card__desc">{item.description}</span>
        {item.tag && (
          <div style={{ marginTop: '0.4rem' }}>
            <Badge>{item.tag}</Badge>
          </div>
        )}
      </span>
    </Link>
  )
}
