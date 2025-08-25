import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AdminProvider } from './contexts/AdminContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import OrderDetail from './pages/OrderDetail';

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Header /><Home /></>} />
            <Route path="/products" element={<><Header /><Products /></>} />
            <Route path="/products/:id" element={<><Header /><ProductDetail /></>} />
            <Route path="/cart" element={<><Header /><Cart /></>} />
            <Route path="/checkout" element={<><Header /><Checkout /></>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders/:orderId" element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
