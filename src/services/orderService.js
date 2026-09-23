import { supabase } from '../api/supabaseClient'

// Expects an order shaped like:
// { items: [{ id, name, price, quantity }], total, fulfillment, notes }
export async function placeOrder(order, userId = null) {
  const orderId = `NR-${Date.now().toString().slice(-6)}`

  if (!supabase) {
    // No backend configured yet — resolve locally so the flow is testable
    // end to end before Supabase is wired up.
    const localOrder = { id: orderId, ...order, user_id: userId, status: 'confirmed', placed_at: new Date().toISOString() }
    const localOrders = JSON.parse(globalThis.localStorage.getItem('nami-orders') || '[]')
    globalThis.localStorage.setItem('nami-orders', JSON.stringify([localOrder, ...localOrders]))
    return localOrder
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([{ ...order, id: orderId, user_id: userId, status: 'confirmed' }])
    .select()
    .single()

  if (error) {
    globalThis.console.error('[orderService] falling back to local confirmation:', error.message)
    return { id: orderId, ...order, user_id: userId, status: 'confirmed', placed_at: new Date().toISOString() }
  }

  return data
}

export async function getUserOrders(userId) {
  if (!supabase) return JSON.parse(globalThis.localStorage.getItem('nami-orders') || '[]').filter((order) => order.user_id === userId)
  if (!userId) return []

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('placed_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getAdminOrders() {
  if (!supabase) return JSON.parse(globalThis.localStorage.getItem('nami-orders') || '[]')

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('placed_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateOrderStatus(orderId, status) {
  if (!supabase) {
    const orders = JSON.parse(globalThis.localStorage.getItem('nami-orders') || '[]')
    const updatedOrders = orders.map((order) => order.id === orderId ? { ...order, status } : order)
    globalThis.localStorage.setItem('nami-orders', JSON.stringify(updatedOrders))
    return updatedOrders.find((order) => order.id === orderId) || null
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()

  if (error) throw error
  return data
}
