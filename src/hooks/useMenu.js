import { useEffect, useState } from 'react'
import { getCategories, getMenuItems, getPopularItems } from '../services/menuService'

export function useMenu() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [popular, setPopular] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([getCategories(), getMenuItems(), getPopularItems()]).then(
      ([cats, allItems, popularItems]) => {
        if (!active) return
        setCategories(cats)
        setItems(allItems)
        setPopular(popularItems)
        setLoading(false)
      }
    )
    return () => {
      active = false
    }
  }, [])

  return { categories, items, popular, loading }
}
