import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { categories } from '../data/menu'
import { formatCurrency } from '../utils/formatCurrency'
import { getAdminOrders, updateOrderStatus } from '../services/orderService'
import { getMenuItems } from '../services/menuService'
import { topUpWallet } from '../services/walletService'

const statusOptions = ['confirmed', 'preparing', 'ready', 'completed', 'cancelled']

function orderItems(order) {
  return Array.isArray(order.items) ? order.items : []
}

function formatOrderId(id) {
  return id?.startsWith('#') ? id : `#${id || 'unknown'}`
}

export default function Admin() {
  const location = useLocation()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const isMenuPage = location.pathname === '/admin/menu'
  const isOrdersPage = location.pathname === '/admin/orders'

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [orderData, menuData] = await Promise.all([getAdminOrders(), getMenuItems()])
        setOrders(orderData)
        setMenuItems(menuData)
      } catch (loadError) {
        setError(loadError.message || 'Could not load admin data.')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  const today = new Date().toISOString().slice(0, 10)
  const todayOrders = orders.filter((order) => order.placed_at?.slice(0, 10) === today)
  const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const averageOrder = todayOrders.length ? todayRevenue / todayOrders.length : 0
  const activeMenu = menuItems.filter((item) => item.category_id !== 'extras' && item.categoryId !== 'extras')
  const visibleOrders = isOrdersPage ? orders : orders.slice(0, 6)

  const dailyRevenue = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - index))
      return { key: date.toISOString().slice(0, 10), label: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1), total: 0 }
    })
    orders.forEach((order) => {
      const day = days.find((entry) => entry.key === order.placed_at?.slice(0, 10))
      if (day) day.total += Number(order.total || 0)
    })
    return days
  }, [orders])

  async function handleStatusChange(orderId, status) {
    try {
      const updated = await updateOrderStatus(orderId, status)
      setOrders((current) => current.map((order) => order.id === orderId ? { ...order, ...(updated || { status }) } : order))
    } catch (updateError) {
      setError(updateError.message || 'Could not update order status.')
    }
  }

  if (loading) return <div className="admin-loading">Loading live store data...</div>
  if (error) return <div className="admin-loading"><strong>{error}</strong><p>Check your Supabase configuration and policies.</p></div>

  if (isMenuPage) {
    return (
      <div className="admin-dashboard">
        <section className="admin-page-heading"><div><span className="admin-kicker">Catalog</span><h1>Menu</h1><p>{activeMenu.length} items currently visible to customers.</p></div></section>
        <article className="admin-panel"><div className="admin-menu-list">
          {activeMenu.map((item, index) => <div className="admin-menu-row" key={item.id}>
            <span className="admin-menu-row__rank">{String(index + 1).padStart(2, '0')}</span>
            <span className="admin-menu-row__image">{item.image ? <img src={item.image} alt="" /> : 'NR'}</span>
            <span className="admin-menu-row__name"><strong>{item.name}</strong><small>{item.category_id || item.categoryId}</small></span>
            <span className="admin-menu-row__sales">{item.tag || 'Available'}</span><strong>{formatCurrency(item.price)}</strong>
          </div>)}
        </div></article>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <section className="admin-page-heading"><div><span className="admin-kicker">{new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</span><h1>{isOrdersPage ? 'Orders' : 'Overview'}</h1><p>Live data from your Nami Ramen store.</p></div><span className="admin-open-badge"><span /> Open now · 11:00 - 22:00</span></section>
      {!isOrdersPage && <>
        <section className="admin-stats" aria-label="Store summary">
          <article className="admin-stat admin-stat--accent"><span className="admin-stat__label">Today&apos;s revenue</span><strong>{formatCurrency(todayRevenue)}</strong><small>{todayOrders.length} orders recorded</small></article>
          <article className="admin-stat"><span className="admin-stat__label">Orders today</span><strong>{todayOrders.length}</strong><small>{orders.filter((order) => ['confirmed', 'preparing', 'ready'].includes(order.status)).length} currently in progress</small></article>
          <article className="admin-stat"><span className="admin-stat__label">Menu items</span><strong>{activeMenu.length}</strong><small>{categories.length} categories available</small></article>
          <article className="admin-stat"><span className="admin-stat__label">Average order</span><strong>{formatCurrency(averageOrder)}</strong><small>Based on today&apos;s orders</small></article>
        </section>
        <section className="admin-grid admin-grid--main">
          <OrderTable orders={visibleOrders} onStatusChange={handleStatusChange} onViewAll={() => navigate('/admin/orders')} />
          <article className="admin-panel admin-performance-panel"><div className="admin-panel__header"><div><span className="admin-kicker">Last 7 days</span><h2>Performance</h2></div></div><div className="admin-chart" aria-label="Weekly revenue trend">{dailyRevenue.map((day) => <div className="admin-chart__bar-wrap" key={day.key}><div className="admin-chart__bar" style={{ height: `${Math.max(5, (day.total / Math.max(...dailyRevenue.map((entry) => entry.total), 1)) * 100)}%` }} /><span>{day.label}</span></div>)}</div><div className="admin-chart__total">{formatCurrency(dailyRevenue.reduce((sum, day) => sum + day.total, 0))} <small>weekly revenue</small></div></article>
        </section>
        <WalletTopUpPanel />
      </>}
      {isOrdersPage && <OrderTable orders={orders} onStatusChange={handleStatusChange} />}
    </div>
  )
}

function WalletTopUpPanel() {
  const [userId, setUserId] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState(null) // { type: 'ok' | 'error', message }
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setStatus(null)
    try {
      const balance = await topUpWallet(userId.trim(), Number(amount))
      setStatus({ type: 'ok', message: `New balance: ${formatCurrency(balance)}` })
      setAmount('')
    } catch (topUpError) {
      setStatus({ type: 'error', message: topUpError.message || 'Could not top up wallet.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <article className="admin-panel" style={{ marginTop: '1.25rem' }}>
      <div className="admin-panel__header">
        <div>
          <span className="admin-kicker">Customer wallets</span>
          <h2>Top up a wallet</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label>
          User ID (uuid)
          <input
            type="text"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="from Authentication → Users"
            required
          />
        </label>
        <label>
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </label>
        <button type="submit" className="admin-action-button" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add funds'}
        </button>
      </form>
      {status && (
        <p style={{ color: status.type === 'error' ? '#c0392b' : 'inherit' }}>{status.message}</p>
      )}
    </article>
  )
}

function OrderTable({ orders, onStatusChange, onViewAll }) {
  return <article className="admin-panel admin-orders-panel"><div className="admin-panel__header"><div><span className="admin-kicker">Live queue</span><h2>Recent orders</h2></div>{onViewAll && <button type="button" className="admin-text-button" onClick={onViewAll}>View all</button>}</div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.length ? orders.map((order) => <tr key={order.id}><td><strong>{formatOrderId(order.id)}</strong><small>{order.placed_at ? new Date(order.placed_at).toLocaleString() : 'Pending'}</small></td><td>{order.user_id || 'Guest'}</td><td>{orderItems(order).map((item) => `${item.name} x${item.quantity}`).join(', ') || 'No items'}</td><td>{formatCurrency(order.total)}</td><td><select className={`admin-status admin-status--${order.status}`} value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value)} aria-label={`Status for ${order.id}`}>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>) : <tr><td colSpan="5">No orders found yet.</td></tr>}</tbody></table></div></article>
}
