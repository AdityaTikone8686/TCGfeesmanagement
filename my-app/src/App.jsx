import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import AdminLogin from './pages/admin/Login'
import StudentLogin from './pages/student/Login'
import AdminDashboard from './pages/admin/Dashboard'
import StudentDashboard from './pages/student/Dashboard'
import ShopPage from './pages/ShopPage'
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MediaPage from "./pages/MediaPage";
import MatchesPage from "./pages/MatchesPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import Popup from "./Popup";
import CookieConsent from "./CookieConsent";
import Register from './pages/Register';
import Registrations from "./pages/admin/Registrations";
import './App.css'
import CartPage from "./pages/CartPage";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/student/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
      <Routes>
        <Route path="/" element={
          isAuthenticated
            ? <Navigate to={isAdmin ? "/admin/dashboard" : "/student/dashboard"} replace />
            : <LandingPage />
        } />
        
        {/* Shop Page */}
        <Route path="/shop" element={<ShopPage />} />
        {/* Media Page */}
        <Route path="/media" element={<MediaPage />} />
        
        {/* Matches Page */}
        <Route path="/matches" element={<MatchesPage />} />

        <Route path="/cart" element={<CartPage />} />

        {/* Match ADMIN PAGE */}
         <Route path="/admin-login" element={<AdminLoginPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={
          isAuthenticated
            ? <Navigate to={isAdmin ? "/admin/dashboard" : "/student/dashboard"} replace />
            : <AdminLogin />
        } />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/privacy-policy" element={
          <PrivacyPolicy />} 
          />
        <Route 
          path="/terms-of-service" element={
          <TermsOfService />} 
          />
        <Route 
          path="/cookie-policy" element={
          <CookiePolicy />} 
          />
        
         <Route
          path="/shop" element={
              <ShopPage />}
          />

        {/* Student Routes */}
        <Route path="/student/login" element={
          isAuthenticated
            ? <Navigate to={isAdmin ? "/admin/dashboard" : "/student/dashboard"} replace />
            : <StudentLogin />
        } />
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />


        <Route
          path="/admin/registrations"
          element={
         <ProtectedRoute 
           requireAdmin={true}>
          <Registrations />
         </ProtectedRoute>
         }
         />

        <Route 
          path="/student/register" 
          element={
          <Register />
          } 
          />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}

function App() {
  return (
    <Router>
    <AuthProvider>
      <Popup />
      <CookieConsent />
      <AppRoutes />
    </AuthProvider>
    </Router>
  );
}

export default App


