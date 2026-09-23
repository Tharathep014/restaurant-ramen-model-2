import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

// Admin-only: adds funds to a customer's wallet. Called from the admin
// dashboard as `supabase.functions.invoke('wallet-top-up', { body: { userId, amount } })`.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Scoped to the caller's own JWT — only used to find out who is asking.
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userError } = await callerClient.auth.getUser()
    if (userError || !user) return jsonResponse({ error: 'Not signed in.' }, 401)
    if (user.user_metadata?.role !== 'admin') return jsonResponse({ error: 'Admins only.' }, 403)

    const { userId, amount } = await req.json()
    const parsedAmount = Number(amount)
    if (!userId || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return jsonResponse({ error: 'userId and a positive amount are required.' }, 400)
    }

    // Service-role client bypasses RLS — this (and wallet-checkout) are the
    // only code paths allowed to change a wallet balance. Never send
    // SUPABASE_SERVICE_ROLE_KEY to the browser.
    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { data: newBalance, error: rpcError } = await adminClient.rpc('adjust_wallet_balance', {
      target_user: userId,
      delta: parsedAmount,
    })
    if (rpcError) return jsonResponse({ error: rpcError.message }, 400)

    return jsonResponse({ balance: newBalance })
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Unexpected error.' }, 500)
  }
})
