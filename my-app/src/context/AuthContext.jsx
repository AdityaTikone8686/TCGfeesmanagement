import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, paymentStatusAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userStatus, setUserStatus] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token) {
        const userType = localStorage.getItem('userType');
        try {
          if (userType === 'admin') {
            // Only check admin status for admin
            const adminStatus = await authAPI.getAdminStatus(token);
            if (adminStatus && adminStatus.admin) {
              setUser(adminStatus.admin);
            } else {
              logout();
              setLoading(false);
              return;
            }
          } else if (userType === 'user') {
            // Only check user status for student
            const status = await authAPI.getUserStatus(token);
            setUser(status.user);
            setUserStatus(status);
            // Optionally fetch payment status for user
            if (status.user && status.user.email) {
              try {
                const paymentStatusData = await paymentStatusAPI.getPaymentStatusByEmail(token, status.user.email);
                setPaymentStatus(paymentStatusData);
              } catch (e) {
                setPaymentStatus(null);
              }
            }
          } else {
            // Unknown userType, try both (legacy fallback)
            let adminStatus = null;
            try {
              adminStatus = await authAPI.getAdminStatus(token);
            } catch (e) {
              if (e.message && e.message.includes('403')) {
                adminStatus = null;
              } else if (e.message && (e.message.includes('401') || e.message.includes('Unauthorized'))) {
                logout();
                setLoading(false);
                return;
              } else {
                adminStatus = null;
              }
            }
            if (adminStatus && adminStatus.admin) {
              setUser(adminStatus.admin);
            } else {
              const status = await authAPI.getUserStatus(token);
              setUser(status.user);
              setUserStatus(status);
              if (status.user && status.user.email) {
                try {
                  const paymentStatusData = await paymentStatusAPI.getPaymentStatusByEmail(token, status.user.email);
                  setPaymentStatus(paymentStatusData);
                } catch (e) {
                  setPaymentStatus(null);
                }
              }
            }
          }
        } catch (err) {
          console.error('Error checking auth status:', err);
          if (err.message && (err.message.includes('401') || err.message.includes('Unauthorized'))) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, [token]);

  const loginUser = async (credentials) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authAPI.loginUser(credentials)
      const { token: userToken, user: userData } = response
      
      setToken(userToken)
      setUser(userData)
      localStorage.setItem('token', userToken)
      localStorage.setItem('userType', 'user')
      
      // Get user status and payment status
      const [status, paymentStatusData] = await Promise.all([
        authAPI.getUserStatus(userToken),
        paymentStatusAPI.getPaymentStatusByEmail(userToken, userData.email)
      ])
      
      setUserStatus(status)
      setPaymentStatus(paymentStatusData)
      setLoading(false)
      
      return { success: true }
    } catch (err) {
      setError(err.message)
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  const loginAdmin = async (credentials) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authAPI.loginAdmin(credentials)
      const { token: adminToken, admin: adminData } = response
      
      setToken(adminToken)
      setUser(adminData)
      localStorage.setItem('token', adminToken)
      localStorage.setItem('userType', 'admin')
      setLoading(false)
      
      return { success: true }
    } catch (err) {
      setError(err.message)
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  const registerAdmin = async (adminData) => {
    try {
      setError(null)
      const response = await authAPI.registerAdmin(adminData, token)
      return { success: true, data: response }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setError(null)
    setUserStatus(null)
    setPaymentStatus(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    setLoading(false)
  }

  const clearError = () => {
    setError(null)
  }

  const refreshUserStatus = async () => {
    if (token && user?.email) {
      try {
        const [status, paymentStatusData] = await Promise.all([
          authAPI.getUserStatus(token),
          paymentStatusAPI.getPaymentStatusByEmail(token, user.email)
        ])
        
        setUserStatus(status)
        setPaymentStatus(paymentStatusData)
      } catch (err) {
        console.error('Error refreshing user status:', err)
      }
    }
  }

  const value = {
    user,
    token,
    loading,
    error,
    userStatus,
    paymentStatus,
    loginUser,
    loginAdmin,
    logout,
    clearError,
    refreshUserStatus,
    isAuthenticated: !!token,
    isAdmin: user?.isAdmin || user?.role === 'admin' || localStorage.getItem('userType') === 'admin',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 

