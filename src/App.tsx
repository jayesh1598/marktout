import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { OrderSuccess } from './pages/OrderSuccess';
import { Wishlist } from './pages/Wishlist';
import { Dashboard } from './pages/admin/Dashboard';
import { Products } from './pages/admin/Products';
import { Orders } from './pages/admin/Orders';
import { Customers } from './pages/admin/Customers';
import { Analytics } from './pages/admin/Analytics';
import { Inventory } from './pages/admin/Inventory';
import { Settings } from './pages/admin/Settings';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { SearchProvider } from './contexts/SearchContext';
import { AdminProvider } from './contexts/AdminContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <SearchProvider>
          <AdminProvider>
            <Router>
              <Toaster />
              <Routes>
                {/* Admin Routes - No Header/Footer */}
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/products" element={<Products />} />
                <Route path="/admin/orders" element={<Orders />} />
                <Route path="/admin/customers" element={<Customers />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/inventory" element={<Inventory />} />
                <Route path="/admin/settings" element={<Settings />} />

                {/* Public Routes - With Header/Footer */}
                <Route
                  path="/*"
                  element={
                    <div className="min-h-screen bg-gray-50 flex flex-col">
                      <Header />
                      <div className="flex-1">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/order-success" element={<OrderSuccess />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                        </Routes>
                      </div>
                      <Footer />
                    </div>
                  }
                />
              </Routes>
            </Router>
          </AdminProvider>
        </SearchProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
