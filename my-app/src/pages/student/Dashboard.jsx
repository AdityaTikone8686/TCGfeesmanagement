import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { paymentsAPI, paymentRequestAPI, subscriptionsAPI } from '../../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Users, CreditCard, Book, Settings, LogOut, DollarSign, Award, Menu, X, Upload, History, Home, GraduationCap, Star, Trophy, UserCircle, TrendingUp, CalendarCheck, CheckCircle, Users as UsersIcon, Mail, Phone } from 'lucide-react'

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5 mr-2" /> },
  { id: 'payment', label: 'Pay Fees', icon: <DollarSign className="w-5 h-5 mr-2" /> },
  { id: 'requests', label: 'Payment Requests', icon: <Upload className="w-5 h-5 mr-2" /> },
  { id: 'history', label: 'Payment History', icon: <History className="w-5 h-5 mr-2" /> },
]

const StudentDashboard = () => {
  const { user, userStatus, paymentStatus, refreshUserStatus, logout, loading } = useAuth()
  const [payments, setPayments] = useState([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDescription, setPaymentDescription] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [selectedFeePlan, setSelectedFeePlan] = useState('')
  const [feePlans, setFeePlans] = useState([])
  const [paymentRequests, setPaymentRequests] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [uploading, setUploading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)

  useEffect(() => {
    if (user?.email) {
      fetchPayments()
      fetchPaymentRequests()
      fetchSubscriptions()
      fetchFeePlans()
      // Refresh user status to get latest subscription info
      refreshUserStatus()
    }
  }, [user?.email])

  // Periodic refresh of user status to keep subscription info up-to-date
  useEffect(() => {
    if (user?.email) {
      const interval = setInterval(() => {
        refreshUserStatus()
      }, 30000) // Refresh every 30 seconds
      
      return () => clearInterval(interval)
    }
  }, [user?.email])

  const fetchPayments = async () => {
    try {
      setPaymentsLoading(true)
      const paymentsData = await paymentsAPI.getPaymentsByEmail(localStorage.getItem('token'), user.email)
      setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData.payments || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setPaymentsLoading(false)
    }
  }

  const fetchPaymentRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      const requests = await paymentRequestAPI.getUserPaymentRequests(token)
      setPaymentRequests(requests)
    } catch (error) {
      console.error('Error fetching payment requests:', error)
    }
  }

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token')
      const subs = await subscriptionsAPI.getUserSubscriptions(token)
      console.log('Fetched subscriptions:', subs)
      setSubscriptions(subs)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    }
  }

  const fetchFeePlans = async () => {
    try {
      const plans = await subscriptionsAPI.getAllFeePlansPublic()
      setFeePlans(plans)
    } catch (error) {
      console.error('Error fetching fee plans:', error)
    }
  }

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      setScreenshot(file)
    }
  }

  const handleFeePlanChange = (e) => {
    const planId = e.target.value
    setSelectedFeePlan(planId)

    if (planId) {
      const selectedPlan = feePlans.find(plan => plan._id === planId)
      if (selectedPlan) {
        setPaymentAmount(selectedPlan.amount.toString())
        setPaymentDescription(`${selectedPlan.planName} - ${selectedPlan.durationInDays} days`)
      }
    } else {
      setPaymentAmount('')
      setPaymentDescription('')
    }
  }

  const handlePaymentSubmit = async () => {
    if (!paymentAmount || !paymentDescription || !screenshot) {
      alert('Please fill all fields and upload a screenshot')
      return
    }

    if (!selectedFeePlan) {
      alert('Please select a fee plan')
      return
    }

    try {
      setUploading(true)
      const token = localStorage.getItem('token')

      const formData = new FormData()
      formData.append('amount', paymentAmount)
      formData.append('description', paymentDescription)
      formData.append('screenshot', screenshot)
      formData.append('paymentMethod', 'UPI')
      formData.append('feePlanId', selectedFeePlan)

      await paymentRequestAPI.createPaymentRequest(token, formData)

      alert('Payment request submitted successfully! Admin will review and update your status.')
      setPaymentAmount('')
      setPaymentDescription('')
      setScreenshot(null)
      setSelectedFeePlan('')
      fetchPaymentRequests()
    } catch (error) {
      alert('Error submitting payment request: ' + error.message)
    } finally {
      setUploading(false)
    }
  }



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getPaymentRequestStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your dashboard</h2>
          <Button onClick={() => window.location.href = '/student/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  if (user.isAdmin || user.role === 'admin') {
    window.location.href = '/admin/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 relative overflow-x-hidden">
      {/* Decorative SVG background */}
      <svg className="absolute top-0 left-0 w-full h-64 opacity-10 z-0" viewBox="0 0 1440 320"><path fill="#22c55e" fillOpacity="1" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      {/* Sidebar */}
      <aside className={`fixed z-30 inset-y-0 left-0 w-64 bg-white/90 shadow-xl border-r border-gray-100 flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0 md:static md:w-64`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-2">
          <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white">
      <img
        src="/TikoneCricketGurukul1.png" // Replace with your actual filename
        alt="Logo"
        className="w-full h-full object-contain"
      />
    </div>
            <span className="font-extrabold text-xl text-green-700 tracking-tight">Tikone Cricket Gurukul</span>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>
        <div className="flex flex-col items-center py-6">
          <UserCircle className="w-16 h-16 text-green-400 mb-2" />
          <span className="font-semibold text-gray-800">{user.name}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
          <Badge className="mt-2 bg-green-100 text-green-700">Student</Badge>
        </div>
        <nav className="flex-1 py-2 px-2 space-y-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-150 ${activeSection === item.id ? 'bg-green-200 text-green-900 shadow' : 'text-gray-700 hover:bg-green-50 hover:scale-[1.03]'}`}
            >
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 mt-auto">
          <div className="mb-4 p-3 bg-green-50 rounded-lg text-center">
            <p className="text-sm font-medium text-green-800">Welcome, {user.name}</p>
            <p className="text-xs text-green-600">{user.email}</p>
          </div>
          <Button variant="outline" className="w-full flex items-center justify-center" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen z-10">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden flex items-center p-4">
          <button onClick={() => setSidebarOpen(true)} className="text-green-700"><Menu className="w-7 h-7" /></button>
        </div>
        <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-10">
          {/* Hero Section */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-green-200 via-green-100 to-blue-100 rounded-2xl shadow-lg p-8 mb-6 border border-green-100 animate-fade-in">
            <div className="flex items-center space-x-6">
              <div className="bg-transparent-500 p-2 shadow-sm">
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white">
      <img
        src="/TikoneCricketGurukul1.png" // Replace with your actual filename
        alt="Logo"
        className="w-full h-full object-contain"
      />
    </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-1 tracking-tight">Welcome, {user.name}!</h1>
                <p className="text-lg text-green-700 font-medium">Ready to level up your cricket journey? 🏏</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="outline" className="px-3 py-1 text-green-700 border-green-400 bg-white/80"><Star className="w-4 h-4 mr-1 inline" /> Pimpri's Premier Cricket Academy</Badge>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col items-center">
              <div className="flex space-x-4">
                <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mb-1" />
                  <span className="text-lg font-bold text-green-900">{subscriptions.filter(sub => sub.status === 'active').length}</span>
                  <span className="text-xs text-gray-500">Active Subs</span>
                </div>
                <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
                  <CalendarCheck className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-lg font-bold text-blue-900">{payments.length}</span>
                  <span className="text-xs text-gray-500">Payments</span>
                </div>
                <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
                  <CheckCircle className="w-6 h-6 text-green-700 mb-1" />
                  <span className="text-lg font-bold text-green-900">{paymentRequests.length}</span>
                  <span className="text-xs text-gray-500">Requests</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-400 text-center">Keep up the great work!</div>
            </div>
          </div>

          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/90 shadow-md rounded-xl border-t-4 border-green-400 animate-slide-up">
                  <CardHeader className="pb-2 flex items-center space-x-2">
                    <UsersIcon className="w-5 h-5 text-green-500" />
                    <CardTitle className="text-sm font-bold text-gray-700">Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-900">{user.name}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 shadow-md rounded-xl border-t-4 border-blue-400 animate-slide-up delay-75">
                  <CardHeader className="pb-2 flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <CardTitle className="text-sm font-bold text-gray-700">Email</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-blue-900">{user.email}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 shadow-md rounded-xl border-t-4 border-purple-400 animate-slide-up delay-150">
                  <CardHeader className="pb-2 flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-purple-500" />
                    <CardTitle className="text-sm font-bold text-gray-700">Phone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-purple-900">{user.phone}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 shadow-md rounded-xl border-t-4 border-yellow-400 animate-slide-up delay-200">
                  <CardHeader className="pb-2 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <CardTitle className="text-sm font-bold text-gray-700">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={getStatusColor(userStatus?.subscription?.status || paymentStatus?.subscription?.status) + ' px-3 py-1 text-base'}>
                      {userStatus?.subscription?.status || paymentStatus?.subscription?.status || 'No Subscription'}
                    </Badge>
                    {!userStatus?.subscription?.status && !paymentStatus?.subscription?.status && (
                      <p className="text-xs text-gray-500 mt-1">
                        Click "Refresh Status" to update
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
              {/* Current Subscription Status */}
              <Card className="bg-gradient-to-r from-green-100 via-blue-50 to-purple-50 shadow-lg rounded-xl border-l-4 border-green-400 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-900 flex items-center"><CalendarCheck className="w-5 h-5 mr-2 text-green-600" /> Current Subscription Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {subscriptions.length > 0 ? (
                    <div className="space-y-4">
                      {subscriptions.filter(sub => sub.status === 'active').map((subscription) => (
                        <div key={subscription._id} className="border rounded-lg p-4 bg-green-50 animate-slide-up">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-green-800 text-lg">{subscription.plan?.planName || 'Active Plan'}</h3>
                              <p className="text-sm text-green-600">{formatCurrency(subscription.plan?.amount || 0)}</p>
                              <p className="text-xs text-green-500">
                                Valid until: {formatDate(subscription.endDate)}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 px-3 py-1 text-base">
                              Active
                            </Badge>
                          </div>
                          <div className="text-xs text-green-600">
                            Started: {formatDate(subscription.startDate)}
                          </div>
                        </div>
                      ))}
                      {subscriptions.filter(sub => sub.status === 'expired').map((subscription) => (
                        <div key={subscription._id} className="border rounded-lg p-4 bg-red-50 animate-slide-up">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-red-800 text-lg">{subscription.plan?.planName || 'Expired Plan'}</h3>
                              <p className="text-sm text-red-600">{formatCurrency(subscription.plan?.amount || 0)}</p>
                              <p className="text-xs text-red-500">
                                Expired on: {formatDate(subscription.endDate)}
                              </p>
                            </div>
                            <Badge className="bg-red-100 text-red-800 px-3 py-1 text-base">
                              Expired
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      {subscriptions.length === 0 ? (
                        <>
                          No subscriptions found.
                          <Button
                            onClick={() => setActiveSection('payment')}
                            className="ml-2 bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            Pay Fees
                          </Button>
                        </>
                      ) : (
                        <>
                          No active subscriptions found.
                          <Button
                            onClick={() => setActiveSection('payment')}
                            className="ml-2 bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            Pay Fees
                          </Button>
                          <Button
                            onClick={async () => {
                              setStatusLoading(true)
                              await refreshUserStatus()
                              setStatusLoading(false)
                            }}
                            className="ml-2 bg-blue-600 hover:bg-blue-700"
                            size="sm"
                            disabled={statusLoading}
                          >
                            {statusLoading ? 'Refreshing...' : 'Refresh Status'}
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Quick Actions */}
              <Card className="bg-white/90 shadow-lg rounded-xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-900 flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-500" /> Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={() => setActiveSection('payment')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Pay Fees
                    </Button>
                    <Button
                      onClick={() => setActiveSection('history')}
                      variant="outline"
                    >
                      View Payment History
                    </Button>
                    <Button
                      onClick={async () => {
                        setStatusLoading(true)
                        await refreshUserStatus()
                        setStatusLoading(false)
                      }}
                      variant="outline"
                      disabled={statusLoading}
                    >
                      {statusLoading ? 'Refreshing...' : 'Refresh Status'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {/* Achievements Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-fade-in">
                <div className="bg-gradient-to-br from-green-200 via-green-100 to-blue-100 rounded-xl shadow p-6 flex flex-col items-center">
                  <Trophy className="w-10 h-10 text-yellow-500 mb-2 animate-bounce" />
                  <span className="text-lg font-bold text-green-900">35+ Champions</span>
                  <span className="text-xs text-gray-600 mt-1">Produced by the Academy</span>
                </div>
                <div className="bg-gradient-to-br from-blue-200 via-blue-100 to-green-100 rounded-xl shadow p-6 flex flex-col items-center">
                  <UsersIcon className="w-10 h-10 text-green-600 mb-2 animate-pulse" />
                  <span className="text-lg font-bold text-blue-900">500+ Students</span>
                  <span className="text-xs text-gray-600 mt-1">Enrolled so far</span>
                </div>
                <div className="bg-gradient-to-br from-purple-200 via-purple-100 to-green-100 rounded-xl shadow p-6 flex flex-col items-center">
                  <Star className="w-10 h-10 text-yellow-400 mb-2 animate-spin-slow" />
                  <span className="text-lg font-bold text-purple-900">Expert Coaching</span>
                  <span className="text-xs text-gray-600 mt-1">By National-level Coaches</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Section */}
          {activeSection === 'payment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Form */}
                <Card className="bg-white/90 shadow-lg rounded-xl border-t-4 border-green-400 animate-slide-up">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-green-900 flex items-center"><DollarSign className="w-5 h-5 mr-2 text-green-600" /> Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="feePlan">Select Fee Plan</Label>
                      <select
                        id="feePlan"
                        value={selectedFeePlan}
                        onChange={handleFeePlanChange}
                        className="w-full border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500 p-2"
                        required
                      >
                        <option value="">-- Select a Fee Plan --</option>
                        {feePlans.map(plan => (
                          <option key={plan._id} value={plan._id}>
                            {plan.planName} - ₹{plan.amount} ({plan.durationInDays} days)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="paymentAmount">Amount (₹)</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        placeholder="Amount will be auto-filled when you select a plan"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentDescription">Description</Label>
                      <Input
                        id="paymentDescription"
                        placeholder="Description will be auto-filled when you select a plan"
                        value={paymentDescription}
                        onChange={(e) => setPaymentDescription(e.target.value)}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="screenshot">Payment Screenshot</Label>
                      <Input
                        id="screenshot"
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="cursor-pointer border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                      {screenshot && (
                        <div className="mt-2 text-sm text-green-600">
                          ✓ {screenshot.name} selected
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handlePaymentSubmit}
                      disabled={!selectedFeePlan || !paymentAmount || !paymentDescription || !screenshot || uploading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {uploading ? 'Submitting...' : 'Submit Payment Request'}
                    </Button>
                  </CardContent>
                </Card>

                {/* UPI Payment Details */}
                <Card className="bg-white/90 shadow-lg rounded-xl border-t-4 border-blue-400 animate-slide-up delay-75">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-blue-900 flex items-center"><CreditCard className="w-5 h-5 mr-2 text-blue-600" /> UPI Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      {/* Placeholder for QR Code */}
                      <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <img
                          src="/qr-code.jpg"
                          alt="QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">UPI ID</div>
                          <div className="font-mono font-semibold">-NOT YET STARTED-</div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Account Number</div>
                          <div className="font-mono font-semibold">-NOT YET STARTED-</div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">IFSC Code</div>
                          <div className="font-mono font-semibold">-NOT YET STARTED-</div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Account Holder</div>
                          <div className="font-semibold">Deepmala Avinash Tikone</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Instructions */}
              <Card className="bg-white/90 shadow-lg rounded-xl border-t-4 border-purple-400 animate-slide-up delay-150">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-purple-900 flex items-center"><Book className="w-5 h-5 mr-2 text-purple-600" /> Payment Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                      <div>Scan the QR code or use the UPI ID to make payment</div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                      <div>Add your name and student ID in the payment note</div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                      <div>Take a screenshot of the payment confirmation</div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                      <div>Submit the payment request above with payment details</div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">5</div>
                      <div>Contact admin with payment proof for status update</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment Requests Section */}
          {activeSection === 'requests' && (
            <div className="space-y-6">
              <Card className="bg-white/90 shadow-lg rounded-xl border-t-4 border-red-400 animate-slide-up delay-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-red-900 flex items-center"><Upload className="w-5 h-5 mr-2 text-red-600" /> My Payment Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentRequests.length > 0 ? (
                    <div className="space-y-4">
                      {paymentRequests.map((request) => (
                        <div key={request._id} className="border rounded-lg p-4 bg-gray-50 animate-slide-up">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{formatCurrency(request.amount)}</h3>
                              <p className="text-sm text-gray-600">{request.description}</p>
                              {request.feePlan && (
                                <p className="text-sm text-blue-600">
                                  Plan: {request.feePlan.planName} ({request.feePlan.durationInDays} days)
                                </p>
                              )}
                              <p className="text-xs text-gray-500">{formatDate(request.createdAt)}</p>
                            </div>
                            <Badge className={getPaymentRequestStatusColor(request.status) + ' px-3 py-1 text-base'}>
                              {request.status}
                            </Badge>
                          </div>

                          {request.screenshot && (
                            <div className="mb-3">
                              <img
                                src={request.screenshot}
                                alt="Payment Screenshot"
                                className="max-w-xs rounded border"
                              />
                            </div>
                          )}

                          {request.adminNotes && (
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="text-sm font-medium text-gray-700">Admin Notes:</p>
                              <p className="text-sm text-gray-600">{request.adminNotes}</p>
                            </div>
                          )}

                          {request.approvedBy && (
                            <div className="text-xs text-gray-500 mt-2">
                              {request.status === 'approved' ? 'Approved' : 'Rejected'} by {request.approvedBy.name} on {formatDate(request.approvedAt)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">No payment requests found</div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment History Section */}
          {activeSection === 'history' && (
            <div className="space-y-6">
              {/* Subscriptions */}
              <Card className="bg-white/90 shadow-lg rounded-xl border-t-4 border-green-400 animate-slide-up delay-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-900 flex items-center"><CalendarCheck className="w-5 h-5 mr-2 text-green-600" /> Active Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  {subscriptions.length > 0 ? (
                    <div className="space-y-4">
                      {subscriptions.map((subscription) => (
                        <div key={subscription._id} className="border rounded-lg p-4 bg-green-50 animate-slide-up">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-green-800 text-lg">{subscription.plan?.planName || 'Subscription Plan'}</h3>
                              <p className="text-sm text-gray-600">{formatCurrency(subscription.plan?.amount || 0)}</p>
                              <p className="text-xs text-gray-500">
                                {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                              </p>
                            </div>
                            <Badge className={getStatusColor(subscription.status) + ' px-3 py-1 text-base'}>
                              {subscription.status}
                            </Badge>
                          </div>

                          {subscription.payment && (
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-sm font-medium text-gray-700">Payment Details:</p>
                              <p className="text-sm text-gray-600">
                                {formatCurrency(subscription.payment.amount)} via {subscription.payment.method}
                              </p>
                              <p className="text-xs text-gray-500">{formatDate(subscription.payment.createdAt)}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">No active subscriptions found</div>
                  )}
                </CardContent>
              </Card>

              {/* Payments */}
              <Card className="bg-white/90 shadow-lg rounded-xl border-t-4 border-blue-400 animate-slide-up delay-75">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-blue-900 flex items-center"><History className="w-5 h-5 mr-2 text-blue-600" /> All Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentsLoading ? (
                    <div className="text-center py-4">Loading payments...</div>
                  ) : payments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Date</th>
                            <th className="text-left py-2">Amount</th>
                            <th className="text-left py-2">Method</th>
                            <th className="text-left py-2">Description</th>
                            <th className="text-left py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <tr key={payment.id} className="border-b hover:bg-green-50">
                              <td className="py-2">{formatDate(payment.createdAt)}</td>
                              <td className="py-2 font-semibold">{formatCurrency(payment.amount)}</td>
                              <td className="py-2 capitalize">{payment.method || 'UPI'}</td>
                              <td className="py-2">{payment.description || 'Payment'}</td>
                              <td className="py-2">
                                <Badge className="bg-green-100 text-green-800">
                                  Completed
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">No payment history found</div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}


        </div>
      </div>
    </div>
  )
}

export default StudentDashboard 