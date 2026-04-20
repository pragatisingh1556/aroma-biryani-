import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Loader from './components/Loader';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderPlaced from './pages/OrderPlaced';
import Profile from './pages/Profile';
import Gallery from './pages/Gallery';
import AboutUs from './pages/AboutUs';
import StoreLocator from './pages/StoreLocator';
import Offers from './pages/Offers';
import KitchenDashboard from './pages/KitchenDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={<Home />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/order-placed" element={<ProtectedRoute><OrderPlaced /></ProtectedRoute>} />
    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/gallery" element={<Gallery />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/stores" element={<StoreLocator />} />
    <Route path="/offers" element={<Offers />} />
    <Route path="/kitchen" element={<ProtectedRoute roles={['kitchen_staff', 'admin']}><KitchenDashboard /></ProtectedRoute>} />
    <Route path="/delivery" element={<ProtectedRoute roles={['delivery_staff', 'admin']}><DeliveryDashboard /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff', borderRadius: '10px' } }} />
          {!loaded && <Loader onDone={() => setLoaded(true)} />}
          {loaded && <AppRoutes />}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
