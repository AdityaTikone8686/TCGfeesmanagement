import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Shield, Users, Target, ArrowRight, Eye, EyeOff, Settings, Star, CheckCircle, Mail, Lock, BarChart3 } from 'lucide-react'
import { Badge } from '../../components/ui/badge'

const AdminLogin = () => {
  const { loginAdmin, error, clearError, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    const result = await loginAdmin(formData)
    if (result.success) {
      window.location.href = '/admin/dashboard'
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">Tikone Cricket</h1>
              <p className="text-blue-600 font-semibold text-lg">Admin Portal</p>
            </div>
          </div>
          <Badge variant="outline" className="px-4 py-2 mb-4">
            <Settings className="h-4 w-4 mr-2" />
            Manage your cricket academy
          </Badge>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-slide-up">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Admin Access</CardTitle>
            </div>
            <p className="text-gray-600 mt-2">Sign in to manage the academy</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter admin email"
                  required
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter admin password"
                    required
                    className="h-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Sign In as Admin
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Are you a student?{' '}
                <button
                  onClick={() => window.location.href = '/student/login'}
                  className="font-semibold text-green-600 hover:text-green-700 transition-colors hover:underline"
                >
                  Student login
                </button>
              </p>
            </div>
          </CardContent>
        </Card>



        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center animate-fade-in">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">Manage Students</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">Track Payments</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">Admin Control</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin 