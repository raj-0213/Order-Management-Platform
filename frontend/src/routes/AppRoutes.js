import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Container, Box, CircularProgress } from '@mui/material';
import SignInPage from '../pages/SignIn';
import SignUpPage from '../pages/SignUp';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import MyOrders from '../components/MyOrders';
import { AdminDashboard } from '../components/AdminDashboard';
import axios from 'axios';

// Protected Route Component for authenticated users
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const verifyAuth = async () => {
      if (!authToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, [authToken]);

  if (isAuthenticated === null) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!authToken) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setIsAdmin(response.data.user.role === 'admin');
      } catch (error) {
        setIsAdmin(false);
      }
    };

    verifyAdmin();
  }, [authToken]);

  if (isAdmin === null) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return isAdmin ? children : <Navigate to="/" />;
};

// Public Route Component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const verifyAuth = async () => {
      if (!authToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, [authToken]);

  if (isAuthenticated === null) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <Navigate to="/" /> : children;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Box sx={{ mt: isAdminRoute ? 0 : 4 }}>
        <Container>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<ProductList />} />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUpPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <SignInPage />
                </PublicRoute>
              }
            />

            {/* Protected routes (require authentication) */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myorders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Box>
    </>
  );
};

const AppRoutes = () => (
  <Router>
    <AppContent />
  </Router>
);

export default AppRoutes;
