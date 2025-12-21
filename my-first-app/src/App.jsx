// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";

import Home from './pages/Home';
import PlaceOrder from './pages/PlaceOrder';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import FeedbackPage from './pages/FeedbackPage';
import ForgotPassPage from './pages/ForgotPassPage';
import ResetPassPage from './pages/ResetPassPage';

// Header and WhatsAppButton are used in MainLayout, not here
// Layouts
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main User Portal (Shop) */}
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot" element={<ForgotPassPage />} />
            <Route path="/reset-password" element={<ResetPassPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />

            {/* Protected Shop Routes */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/place-order"
              element={
                <ProtectedRoute>
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Portal */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* Future admin routes go here */}
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
