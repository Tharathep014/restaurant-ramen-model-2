import { Navigate, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import Categories from './pages/Categories'
import MenuDetail from './pages/MenuDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Admin from './pages/Admin'
import { AdminLayout } from './components/layout/AdminLayout'
import AdminSignIn from './pages/AdminSignIn'
import InfoPage from './pages/InfoPage'
import { ThemeProvider } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories/:categoryId" element={<Categories />} />
        <Route path="/menu/:itemId" element={<MenuDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmed" element={<OrderConfirmation />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/info/:page" element={<InfoPage />} />
      </Route>
      <Route path="/admin/sign-in" element={<AdminSignIn />} />
      <Route element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/menu" element={<Admin />} />
          <Route path="/admin/orders" element={<Admin />} />
        </Route>
    </Routes>
  )
}

function RequireAdmin({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="auth-loading" role="status">Checking your sign-in...</div>
  }

  if (user?.role !== 'admin') return <Navigate to="/admin/sign-in" replace />

  return children
}
