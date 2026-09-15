import { useMemo, useState } from 'react'
import { useMenu } from '../hooks/useMenu'
import { MenuCard } from '../components/ui/MenuCard'

export default function Search() {
  const [query, setQuery] = useState('')
  const { items, loading } = useMenu()
  const normalizedQuery = query.trim().toLowerCase()
  const results = useMemo(
    () =>
      items.filter((item) =>
        [item.name, item.description, item.tag].filter(Boolean).some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        )
      ),
    [items, normalizedQuery]
  )

  return (
    <main className="container search-page">
      <h1>Search the menu</h1>
      <div className="search-page__field">
        <label htmlFor="menu-search">Find a dish or drink</label>
        <div className="search-page__input-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            id="menu-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try ramen, gyoza, or tea"
          />
        </div>
      </div>
      <div className="search-page__results">
        {!loading && normalizedQuery && results.length === 0 && <p>No menu items found.</p>}
        {!loading && results.map((item) => <MenuCard key={item.id} item={item} />)}
      </div>
    </main>
  )
}