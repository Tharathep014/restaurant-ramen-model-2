import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../api/supabaseClient'

const AuthContext = createContext(null)

function withRole(user) {
  if (!user) return null
  return { ...user, role: user.role || user.user_metadata?.role || 'user' }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(withRole(data.session?.user))
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(withRole(session?.user))
    })
    return () => listener?.subscription.unsubscribe()
  }, [])

  async function signInWithEmail(email, password) {
    if (!supabase) {
      // No backend yet — treat as a guest session so the flow can be tested.
      setUser({ email, role: 'user' })
      return { error: null }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) setUser(withRole(data.user))
    return { error }
  }

  async function signInAsAdmin(email, password) {
    if (!supabase) {
      setUser({ email, role: 'admin' })
      return { error: null }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error }

    const role = data.user?.user_metadata?.role
    if (role !== 'admin') {
      await supabase.auth.signOut()
      return { error: new Error('This account does not have admin access.') }
    }

    setUser({ ...data.user, role })
    return { error: null }
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signInAsAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
