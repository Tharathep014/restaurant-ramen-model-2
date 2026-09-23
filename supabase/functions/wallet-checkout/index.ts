import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

const DEFAULT_DELIVERY_FEE = 4.0

// Deducts from the signed-in caller's own wallet and places the order in one
// call, so a client can never end up with a deduction that has no matching
// order (or vice versa). Prices are re-looked-up from `menu_items`
// server-side — the client-sent total/prices are never trusted.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userError } = await callerClient.auth.getUser()
    if (userError || !user) return jsonResponse({ error: 'Not signed in.' }, 401)

    const { items, fulfillment, notes } = await req.json()
    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse({ error: 'Cart is empty.' }, 400)
    }
    if (!['pickup', 'delivery'].includes(fulfillment)) {
      return jsonResponse({ error: 'Invalid fulfillment option.' }, 400)
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    // Re-price against menu_items — never trust the total the client sent.
    const menuIds = [...new Set(items.map((item: { id: string }) => item.id))]
    const { data: menuRows, error: menuError } = await adminClient
      .from('menu_items')
      .select('id, name, price')
      .in('id', menuIds)
    if (menuError) return jsonResponse({ error: menuError.message }, 400)

    const menuById = new Map(menuRows.map((row) => [row.id, row]))
    let total = 0
    const pricedItems = []
    for (const item of items) {
      const menuItem = menuById.get(item.id)
      const quantity = Number(item.quantity)
      if (!menuItem || !Number.isFinite(quantity) || quantity <= 0) {
        return jsonResponse({ error: `Unknown or invalid item: ${item.id}` }, 400)
      }
      const price = Number(menuItem.price)
      total += price * quantity
      pricedItems.push({ id: menuItem.id, name: menuItem.name, price, quantity })
    }
    if (fulfillment === 'delivery') {
      total += Number(Deno.env.get('DELIVERY_FEE') ?? DEFAULT_DELIVERY_FEE)
    }

    const orderId = `NR-${Date.now().toString().slice(-6)}`

    // Deduct first. If the wallet doesn't have enough, adjust_wallet_balance
    // throws and no order row is ever written.
    const { error: walletError } = await adminClient.rpc('adjust_wallet_balance', {
      target_user: user.id,
      delta: -total,
    })
    if (walletError) {
      const message = walletError.message.includes('insufficient_balance')
        ? 'Not enough wallet balance.'
        : walletError.message
      return jsonResponse({ error: message }, 400)
    }

    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .insert([{
        id: orderId,
        user_id: user.id,
        items: pricedItems,
        total,
        fulfillment,
        notes,
        status: 'confirmed',
        payment_method: 'wallet',
      }])
      .select()
      .single()

    if (orderError) {
      // Refund the deduction since the order failed to save.
      await adminClient.rpc('adjust_wallet_balance', { target_user: user.id, delta: total })
      return jsonResponse({ error: orderError.message }, 400)
    }

    return jsonResponse({ order })
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Unexpected error.' }, 500)
  }
})
