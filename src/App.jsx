import { Routes, Route } from 'react-router-dom'
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
      </Route>
    </Routes>
  )
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="auth-loading" role="status">Checking your sign-in...</div>
  }

  return user ? children : <Navigate to="/sign-in" replace />
}
