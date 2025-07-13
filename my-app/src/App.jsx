import { useEffect , React } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import AdminLogin from './pages/admin/Login'
import StudentLogin from './pages/student/Login'
import AdminDashboard from './pages/admin/Dashboard'
import StudentDashboard from './pages/student/Dashboard'
import './App.css'

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
    <Router>
      <Routes>
        <Route path="/" element={
          isAuthenticated
            ? <Navigate to={isAdmin ? "/admin/dashboard" : "/student/dashboard"} replace />
            : <LandingPage />
        } />
        
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
        
        {/* Catch all route */}
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