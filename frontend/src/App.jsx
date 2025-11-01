import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AdminProvider } from './contexts/AdminContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
// import AdminLogin from './pages/AdminLogin';
// import AdminDashboard from './pages/AdminDashboard';
// import OrderDetail from './pages/OrderDetail';
// import AdminProducts from './pages/AdminProducts';
// import ProductForm from './pages/ProductForm';
// Use lazy for all other pages, especially admin and checkout pages.
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const ProductForm = lazy(() => import('./pages/ProductForm'));

function App() {
  // Define a simple loading component for the fallback
  const RouteFallback = () => (
      <div className="flex justify-center items-center h-screen">
          <p>Loading Page...</p> {/* You can use a spinner here */}
      </div>
  );
  return (
    <AdminProvider>
      <CartProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
<Suspense fallback={<RouteFallback />}>
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

            <Route path="/admin/products" element={<ProtectedRoute >
              <AdminProducts />
            </ProtectedRoute> } />
<Route path="/admin/products/new" element={<ProductForm mode="create" />} />
<Route path="/admin/products/:id/edit" element={<ProductForm mode="edit" />} />
          </Routes>
</Suspense>

        </Router>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
