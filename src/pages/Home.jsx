import { Link } from 'react-router-dom'
import { useMenu } from '../hooks/useMenu'
import { MenuCard } from '../components/ui/MenuCard'
import { RippleDivider, BowlMark } from '../components/ui/BowlMark'
import { Button } from '../components/ui/Button'

export default function Home() {
  const { categories, popular, loading } = useMenu()

  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero__copy">
            <p className="hero__eyebrow">PREMIUM RAMEN BAR</p>
            <h1>Slow broth.<br /><em>Big comfort.</em></h1>
          </div>
          <p style={{ marginTop: '0.6rem' }}>
            Broth goes on at 6am. Order ahead for pickup, or have it brought to you.
          </p>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <Button as={Link} to="/categories/ramen">
              Browse the menu
            </Button>
          </div>
        </div>
      </section>
      <RippleDivider />

      <section className="container" style={{ marginTop: 'var(--space-3)' }}>
        <h2>Categories</h2>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            overflowX: 'auto',
            padding: '1rem 0',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.id}`}
              className="category-pill"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span className="category-pill__mark">
                <BowlMark size={20} />
              </span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container" style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <h2>Popular right now</h2>
        <div
          style={{
            display: 'grid',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-2)',
          }}
        >
          {!loading && popular.map((item) => <MenuCard key={item.id} item={item} />)}
        </div>
      </section>
    </div>
  )
}
