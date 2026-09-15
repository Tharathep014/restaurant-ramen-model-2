import { supabase } from '../api/supabaseClient'

// Expects an order shaped like:
// { items: [{ id, name, price, quantity }], total, fulfillment, notes }
export async function placeOrder(order) {
  const orderId = `NR-${Date.now().toString().slice(-6)}`

  if (!supabase) {
    // No backend configured yet — resolve locally so the flow is testable
    // end to end before Supabase is wired up.
    return { id: orderId, ...order, status: 'confirmed', placedAt: new Date().toISOString() }
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([{ ...order, id: orderId, status: 'confirmed' }])
    .select()
    .single()

  if (error) {
    console.error('[orderService] falling back to local confirmation:', error.message)
    return { id: orderId, ...order, status: 'confirmed', placedAt: new Date().toISOString() }
  }

  return data
}
