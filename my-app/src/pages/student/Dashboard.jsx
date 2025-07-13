import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { paymentsAPI, paymentRequestAPI, subscriptionsAPI } from '../../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Users, CreditCard, Book, Settings, LogOut, DollarSign, Award, Menu, X, Upload, History, Home } from 'lucide-react'

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

  useEffect(() => {
    if (user?.email) {
      fetchPayments()
      fetchPaymentRequests()
      fetchSubscriptions()
      fetchFeePlans()
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
    <div className="min-h-screen flex  bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside className={`fixed z-30 inset-y-0 left-0 w-64 bg-white/90 shadow-xl border-r border-gray-100 flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0 md:static md:w-64`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Award className="h-7 w-7 text-green-600" />
            <span className="font-bold text-lg text-gray-900">Student Portal</span>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>
        <nav className="flex-1 py-6 px-2 space-y-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === item.id ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-green-50'}`}
            >
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">Welcome, {user.name}</p>
            <p className="text-xs text-green-600">{user.email}</p>
          </div>
          <Button variant="outline" className="w-full flex items-center justify-center" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1  min-h-screen ">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden flex items-center p-4">
          <button onClick={() => setSidebarOpen(true)} className="text-green-700"><Menu className="w-7 h-7" /></button>
        </div>
        <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{user.name}</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Email</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{user.email}</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Phone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{user.phone}</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={getStatusColor(userStatus?.subscription?.status)}>
                      {userStatus?.subscription?.status || 'No Subscription'}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Current Subscription Status */}
              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle>Current Subscription Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {subscriptions.length > 0 ? (
                    <div className="space-y-4">
                      {subscriptions.filter(sub => sub.status === 'active').map((subscription) => (
                        <div key={subscription._id} className="border rounded-lg p-4 bg-green-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-green-800">{subscription.plan?.planName || 'Active Plan'}</h3>
                              <p className="text-sm text-green-600">{formatCurrency(subscription.plan?.amount || 0)}</p>
                              <p className="text-xs text-green-500">
                                Valid until: {formatDate(subscription.endDate)}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-green-600">
                            Started: {formatDate(subscription.startDate)}
                          </div>
                        </div>
                      ))}
                      
                      {subscriptions.filter(sub => sub.status === 'expired').map((subscription) => (
                        <div key={subscription._id} className="border rounded-lg p-4 bg-red-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-red-800">{subscription.plan?.planName || 'Expired Plan'}</h3>
                              <p className="text-sm text-red-600">{formatCurrency(subscription.plan?.amount || 0)}</p>
                              <p className="text-xs text-red-500">
                                Expired on: {formatDate(subscription.endDate)}
                              </p>
                            </div>
                            <Badge className="bg-red-100 text-red-800">
                              Expired
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No active subscriptions found. 
                      <Button 
                        onClick={() => setActiveSection('payment')}
                        className="ml-2 bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        Pay Fees
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
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
                      onClick={refreshUserStatus}
                      variant="outline"
                    >
                      Refresh Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment Section */}
          {activeSection === 'payment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Form */}
                <Card className="bg-white/80 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
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
                <Card className="bg-white/80 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle>UPI Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      {/* Placeholder for QR Code */}
                      <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📱</div>
                          <div className="text-sm text-gray-600">QR Code</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">UPI ID</div>
                          <div className="font-mono font-semibold">cricketacademy@upi</div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Account Number</div>
                          <div className="font-mono font-semibold">1234567890</div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">IFSC Code</div>
                          <div className="font-mono font-semibold">SBIN0001234</div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Account Holder</div>
                          <div className="font-semibold">Tikone Cricket Academy</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Instructions */}
              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle>Payment Instructions</CardTitle>
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
              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle>My Payment Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentRequests.length > 0 ? (
                    <div className="space-y-4">
                      {paymentRequests.map((request) => (
                        <div key={request._id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold">{formatCurrency(request.amount)}</h3>
                              <p className="text-sm text-gray-600">{request.description}</p>
                              {request.feePlan && (
                                <p className="text-sm text-blue-600">
                                  Plan: {request.feePlan.planName} ({request.feePlan.durationInDays} days)
                                </p>
                              )}
                              <p className="text-xs text-gray-500">{formatDate(request.createdAt)}</p>
                            </div>
                            <Badge className={getPaymentRequestStatusColor(request.status)}>
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
              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle>Active Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  {subscriptions.length > 0 ? (
                    <div className="space-y-4">
                      {subscriptions.map((subscription) => (
                        <div key={subscription._id} className="border rounded-lg p-4 bg-green-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold">{subscription.plan?.planName || 'Subscription Plan'}</h3>
                              <p className="text-sm text-gray-600">{formatCurrency(subscription.plan?.amount || 0)}</p>
                              <p className="text-xs text-gray-500">
                                {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                              </p>
                            </div>
                            <Badge className={getStatusColor(subscription.status)}>
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
              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle>All Payments</CardTitle>
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