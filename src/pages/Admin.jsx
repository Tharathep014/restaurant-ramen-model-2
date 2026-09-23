import { useState } from 'react'
import { categories, menuItems } from '../data/menu'
import { formatCurrency } from '../utils/formatCurrency'

const initialOrders = [
  { id: '#NR-4821', customer: 'Mina K.', items: 'Tonkotsu Ramen, Gyoza', total: 198, status: 'Preparing', time: '2 min ago' },
  { id: '#NR-4820', customer: 'Kenji T.', items: 'Shoyu Ramen, Calpico', total: 169, status: 'Ready', time: '8 min ago' },
  { id: '#NR-4819', customer: 'Aom S.', items: 'Spicy Ramen', total: 139, status: 'Completed', time: '14 min ago' },
  { id: '#NR-4818', customer: 'Ploy R.', items: 'Miso Ramen, Matcha Latte', total: 194, status: 'Completed', time: '21 min ago' },
]

const statusOptions = ['Preparing', 'Ready', 'Completed']

export default function Admin() {
  const [orders, setOrders] = useState(initialOrders)
  const activeMenu = menuItems.filter((item) => item.categoryId !== 'extras')
  const featuredItems = activeMenu.slice(0, 5)
  const todayRevenue = orders.reduce((total, order) => total + order.total, 0) + 11940

  function updateOrderStatus(orderId, status) {
    setOrders((currentOrders) => currentOrders.map((order) => (
      order.id === orderId ? { ...order, status } : order
    )))
  }

  return (
    <div className="admin-dashboard">
      <section className="admin-page-heading">
        <div>
          <span className="admin-kicker">Tuesday, September 22, 2026</span>
          <h1>Overview</h1>
          <p>Here is what is happening at Nami Ramen today.</p>
        </div>
        <span className="admin-open-badge"><span /> Open now · 11:00 - 22:00</span>
      </section>

      <section className="admin-stats" aria-label="Store summary">
        <article className="admin-stat admin-stat--accent">
          <span className="admin-stat__label">Today&apos;s revenue</span>
          <strong>{formatCurrency(todayRevenue)}</strong>
          <small>+12.4% from yesterday</small>
        </article>
        <article className="admin-stat">
          <span className="admin-stat__label">Orders today</span>
          <strong>86</strong>
          <small>14 currently in progress</small>
        </article>
        <article className="admin-stat">
          <span className="admin-stat__label">Menu items</span>
          <strong>{activeMenu.length}</strong>
          <small>{categories.length} categories active</small>
        </article>
        <article className="admin-stat">
          <span className="admin-stat__label">Average order</span>
          <strong>{formatCurrency(149)}</strong>
          <small>+4.2% this week</small>
        </article>
      </section>

      <section className="admin-grid admin-grid--main">
        <article className="admin-panel admin-orders-panel">
          <div className="admin-panel__header">
            <div>
              <span className="admin-kicker">Live queue</span>
              <h2>Recent orders</h2>
            </div>
            <button type="button" className="admin-text-button">View all</button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong><small>{order.time}</small></td>
                    <td>{order.customer}</td>
                    <td>{order.items}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      <select
                        className={`admin-status admin-status--${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                        aria-label={`Status for ${order.id}`}
                      >
                        {statusOptions.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel admin-performance-panel">
          <div className="admin-panel__header">
            <div>
              <span className="admin-kicker">This week</span>
              <h2>Performance</h2>
            </div>
            <span className="admin-trend">+8.6%</span>
          </div>
          <div className="admin-chart" aria-label="Weekly revenue trend">
            {[42, 58, 47, 72, 63, 85, 78].map((height, index) => (
              <div className="admin-chart__bar-wrap" key={height}>
                <div className="admin-chart__bar" style={{ height: `${height}%` }} />
                <span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
              </div>
            ))}
          </div>
          <div className="admin-chart__total">{formatCurrency(24860)} <small>weekly revenue</small></div>
        </article>
      </section>

      <section className="admin-grid admin-grid--bottom">
        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <span className="admin-kicker">Top sellers</span>
              <h2>Popular menu</h2>
            </div>
            <button type="button" className="admin-text-button">Manage menu</button>
          </div>
          <div className="admin-menu-list">
            {featuredItems.map((item, index) => (
              <div className="admin-menu-row" key={item.id}>
                <span className="admin-menu-row__rank">0{index + 1}</span>
                <span className="admin-menu-row__image">
                  {item.image ? <img src={item.image} alt="" /> : <span>NR</span>}
                </span>
                <span className="admin-menu-row__name"><strong>{item.name}</strong><small>{item.categoryId}</small></span>
                <span className="admin-menu-row__sales">{[42, 35, 31, 27, 24][index]} sold</span>
                <strong>{formatCurrency(item.price)}</strong>
              </div>
            ))}
          </div>
        </article>
        <article className="admin-panel admin-note-panel">
          <span className="admin-kicker">Shift note</span>
          <h2>Keep the broth moving.</h2>
          <p>Lunch service is trending above last Tuesday. Check prep levels before the 18:00 dinner rush.</p>
          <button type="button" className="admin-action-button">Open prep checklist <span>→</span></button>
        </article>
      </section>
    </div>
  )
}
