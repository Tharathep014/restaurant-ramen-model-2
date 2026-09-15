import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useMenu } from '../hooks/useMenu'
import { MenuCard } from '../components/ui/MenuCard'

export default function Categories() {
  const { categoryId } = useParams()
  const { categories, items, loading } = useMenu()
  const [sortOrder, setSortOrder] = useState(null)

  const activeItems = items
    .filter((item) => item.categoryId === categoryId)
    .sort((a, b) => {
      if (sortOrder === 'desc') return b.price - a.price
      if (sortOrder === 'asc') return a.price - b.price
      return 0
    })
  const activeCategory = categories.find((c) => c.id === categoryId)

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3)', paddingBottom: 'var(--space-4)' }}>
      <h1 style={{ fontSize: '1.8rem' }}>{activeCategory?.name || 'Menu'}</h1>
      {activeCategory?.blurb && <p style={{ marginTop: '0.3rem' }}>{activeCategory.blurb}</p>}

      <div
        style={{
          display: 'flex',
          gap: '0.6rem',
          overflowX: 'auto',
          margin: 'var(--space-3) 0',
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.id}`}
            className={`btn ${cat.id === categoryId ? 'btn-primary' : 'btn-ghost'}`}
            style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="menu-sort" aria-label="Sort menu by price">
        <span>Sort by price</span>
        <button
          type="button"
          className={sortOrder === 'desc' ? 'menu-sort__button menu-sort__button--active' : 'menu-sort__button'}
          onClick={() => setSortOrder('desc')}
        >
          High to low
        </button>
        <button
          type="button"
          className={sortOrder === 'asc' ? 'menu-sort__button menu-sort__button--active' : 'menu-sort__button'}
          onClick={() => setSortOrder('asc')}
        >
          Low to high
        </button>
      </div>

      {!loading && activeItems.length === 0 && (
        <div className="empty-state">
          <p>Nothing in this category yet — check back soon.</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        {activeItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
