import { supabase } from '../api/supabaseClient'

export async function getWalletBalance(userId) {
  if (!supabase || !userId) return 0

  const { data, error } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return Number(data?.balance || 0)
}

// Wallet balances can only change through these two Edge Functions — never
// by writing to the `wallets` table directly from the client. Each function
// validates the caller (admin for top-up, the wallet owner for checkout)
// and does the balance change server-side with the service role key.

export async function topUpWallet(userId, amount) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase.functions.invoke('wallet-top-up', {
    body: { userId, amount },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data.balance
}

// Expects an order shaped like placeOrder's: { items, fulfillment, notes }.
// The server re-prices items and computes the total — anything sent for
// `total` or item prices is ignored.
export async function checkoutWithWallet(order) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase.functions.invoke('wallet-checkout', {
    body: order,
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data.order
}