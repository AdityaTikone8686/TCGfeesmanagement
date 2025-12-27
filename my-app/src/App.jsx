import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import LandingPage from './pages/LandingPage'
import ShopPage from './pages/ShopPage'
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfService from "./pages/TermsOfService"
import CookiePolicy from "./pages/CookiePolicy"

import AdminLogin from './pages/admin/Login'
import StudentLogin from './pages/student/Login'
import AdminDashboard from './pages/admin/Dashboard'
import StudentDashboard from './pages/student/Dashboard'

import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

import './App.css'

// Protected Route
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/" replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/student/dashboard" replace />

  return children
}

// Public Layout (Header + Footer)
const PublicLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
)

function AppRoutes() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to={isAdmin ? "/admin/dashboard" : "/student/dashboard"} replace />
              : (
                <PublicLayout>
                  <LandingPage />
                </PublicLayout>
              )
          }
        />

        {/* Shop Page */}
        <Route
          path="/shop"
          element={
            <PublicLayout>
              <ShopPage />
            </PublicLayout>
          }
        />

        {/* Policies */}
        <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
        <Route path="/terms-of-service" element={<PublicLayout><TermsOfService /></PublicLayout>} />
        <Route path="/cookie-policy" element={<PublicLayout><CookiePolicy /></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
