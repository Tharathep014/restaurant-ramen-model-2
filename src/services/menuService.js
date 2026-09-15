import { supabase } from '../api/supabaseClient'
import { categories, menuItems, popularIds } from '../data/menu'

// Every function here falls back to local static data when Supabase isn't
// configured yet, so the UI works immediately. Once you create a
// `menu_items` and `categories` table in Supabase, these functions start
// reading from there automatically — no page needs to change.

export async function getCategories() {
  if (!supabase) return categories
  const { data, error } = await supabase.from('categories').select('*')
  if (error || !data?.length) return categories
  return data
}

export async function getMenuItems() {
  if (!supabase) return menuItems
  const { data, error } = await supabase.from('menu_items').select('*')
  if (error || !data?.length) return menuItems
  return data
}

export async function getMenuItem(id) {
  const items = await getMenuItems()
  return items.find((item) => item.id === id) || null
}

export async function getPopularItems() {
  const items = await getMenuItems()
  return items.filter((item) => popularIds.includes(item.id))
}
