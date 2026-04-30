import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminAPI, paymentsAPI, feePlansAPI, subscriptionsAPI, reportsAPI, paymentRequestAPI } from '../../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Users, CreditCard, Book, Settings, LogOut, Trash2, DollarSign, Award, Menu, X, Plus, Edit, Eye, Trophy, UserCircle, TrendingUp, CalendarCheck, CheckCircle, Star, History } from 'lucide-react'


const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <Award className="w-5 h-5 mr-2" /> },
  { id: 'students', label: 'Students', icon: <Users className="w-5 h-5 mr-2" /> },
  { id: 'payments', label: 'Payments', icon: <DollarSign className="w-5 h-5 mr-2" /> },
  { id: 'payment-requests', label: 'Payment Requests', icon: <Eye className="w-5 h-5 mr-2" /> },
  { id: 'feeplans', label: 'Fee Plans', icon: <Book className="w-5 h-5 mr-2" /> },
  { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard className="w-5 h-5 mr-2" /> },
  { id: 'reports', label: 'Reports', icon: <Settings className="w-5 h-5 mr-2" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 mr-2" /> },
  { id: 'registrations', label: 'Registrations', icon: <Users className="w-5 h-5 mr-2" /> },
]

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [students, setStudents] = useState([])
  const [payments, setPayments] = useState([])
  const [feePlans, setFeePlans] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [paymentRequests, setPaymentRequests] = useState([])
  const [report, setReport] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteType, setDeleteType] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [previewRequest, setPreviewRequest] = useState(null);
  const [deletePaymentRequest, setDeletePaymentRequest] = useState(null);

  // Form states
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '', password: '' })
  const [newFeePlan, setNewFeePlan] = useState({ planName: '', amount: '', durationInDays: '', description: '' })
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [showAddFeePlan, setShowAddFeePlan] = useState(false)
  const [editTarget, setEditTarget] = useState(null);
  const [editStudent, setEditStudent] = useState({ name: '', email: '', phone: '', password: '', status: 'active' });
  const [editPlanId, setEditPlanId] = useState('');
  const [editSubscriptionId, setEditSubscriptionId] = useState('');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentUserId, setPaymentUserId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [editFeePlan, setEditFeePlan] = useState({ planName: '', amount: '', durationInDays: '', description: '' });
  const [editFeePlanTarget, setEditFeePlanTarget] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [updatingPassword, setUpdatingPassword] = useState(false)

  useEffect(() => {
    if (user) fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const [studentsData, paymentsData, feePlansData, subscriptionsData, reportData, paymentRequestsData] = await Promise.all([
        adminAPI.getAllStudents(token),
        adminAPI.getAllPayments(token),
        feePlansAPI.getAllFeePlans(token),
        subscriptionsAPI.getAllSubscriptions(token),
        reportsAPI.getSummaryReport(token, { month: new Date().getMonth() + 1, year: new Date().getFullYear() }),
        paymentRequestAPI.getAllPaymentRequests(token)
      ])
      setStudents(studentsData)
      setPayments(paymentsData.payments || paymentsData)
      setFeePlans(feePlansData)
      setSubscriptions(subscriptionsData)
      setReport(reportData)
      setPaymentRequests(paymentRequestsData)
    } catch (e) {
      console.error('Error fetching dashboard data:', e)
    } finally {
      setLoading(false)
    }
  }

  // Add handlers
  const handleAddStudent = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      await adminAPI.addStudent(token, newStudent)
      setNewStudent({ name: '', email: '', phone: '', password: '' })
      setShowAddStudent(false)
      fetchDashboardData()
    } catch (error) {
      alert('Error adding student: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFeePlan = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      await feePlansAPI.createFeePlan(token, {
        ...newFeePlan,
        amount: parseFloat(newFeePlan.amount),
        durationInDays: parseInt(newFeePlan.durationInDays)
      })
      setNewFeePlan({ planName: '', amount: '', durationInDays: '', description: '' })
      setShowAddFeePlan(false)
      fetchDashboardData()
    } catch (error) {
      alert('Error adding fee plan: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Payment request handlers
  const handleApprovePaymentRequest = async (requestId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await paymentRequestAPI.approvePaymentRequest(token, requestId, {
        adminNotes,
        transactionId
      })
      setSelectedRequest(null)
      setAdminNotes('')
      setTransactionId('')
      fetchDashboardData()
      
      if (response.subscription) {
        alert(`Payment request approved successfully!\n\nSubscription created:\n- Plan: ${response.subscription.plan?.planName}\n- Amount: ₹${response.subscription.plan?.amount}\n- Duration: ${response.subscription.plan?.durationInDays} days\n- Status: Active`)
      } else {
        alert('Payment request approved successfully!')
      }
    } catch (error) {
      if (error.message.includes('already been processed')) {
        alert('This payment request has already been processed. Refreshing data...')
        fetchDashboardData()
        setSelectedRequest(null)
        setAdminNotes('')
        setTransactionId('')
      } else if (error.message.includes('No fee plan found')) {
        alert('Error: ' + error.message + '\n\nPlease create a fee plan with the matching amount first.')
      } else {
        alert('Error approving payment request: ' + error.message)
      }
    }
  }

  const handleRejectPaymentRequest = async (requestId) => {
    const token = localStorage.getItem('token')
    try {
      await paymentRequestAPI.rejectPaymentRequest(token, requestId, { adminNotes })
      setSelectedRequest(null)
      setAdminNotes('')
      fetchDashboardData()
      alert('Payment request rejected!')
    } catch (error) {
      if (error.message.includes('already been processed')) {
        alert('This payment request has already been processed. Refreshing data...')
        fetchDashboardData()
        setSelectedRequest(null)
        setAdminNotes('')
      } else {
        alert('Error rejecting payment request: ' + error.message)
      }
    }
  }

  // Delete handlers
  const handleDelete = async () => {
    if (!deleteTarget) return
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      if (deleteType === 'student') {
        await adminAPI.deleteStudent(token, deleteTarget._id)
        setStudents(students => students.filter(s => s._id !== deleteTarget._id))
      } else if (deleteType === 'feeplan') {
        await feePlansAPI.deleteFeePlan(token, deleteTarget._id)
        setFeePlans(feePlans => feePlans.filter(f => f._id !== deleteTarget._id))
      }
      setDeleteTarget(null)
      setDeleteType('')
    } catch (e) {
      alert('Delete failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Prepare update data
      const updateData = {
        name: editStudent.name,
        email: editStudent.email,
        phone: editStudent.phone,
        status: editStudent.status
      };
      
      // Only include password if it's not empty
      if (editStudent.password && editStudent.password.trim() !== '') {
        updateData.password = editStudent.password;
      }
      
      // Update student basic info and status
      await adminAPI.updateStudent(token, editTarget._id, updateData);
      
      // If plan changed, create new subscription
      if (editPlanId && editPlanId !== (editTarget.activeSubscription?.plan?._id || '')) {
        await subscriptionsAPI.createSubscription(token, { userId: editTarget._id, planId: editPlanId });
      }
      
      setEditTarget(null);
      setEditStudent({ name: '', email: '', phone: '', password: '', status: 'active' });
      setEditPlanId('');
      setEditSubscriptionId('');
      fetchDashboardData();
      
      // Show success message if password was updated
      if (editStudent.password && editStudent.password.trim() !== '') {
        alert('Student updated successfully! Password has been changed.');
      } else {
        alert('Student updated successfully!');
      }
    } catch (error) {
      alert('Error updating student: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!paymentUserId || !paymentAmount) {
      alert('Please select a user and enter an amount.');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await paymentsAPI.addPayment(token, {
        user: paymentUserId,
        amount: parseFloat(paymentAmount),
        method: paymentMethod,
        description: paymentDescription,
        email: students.find(s => s._id === paymentUserId)?.email || '',
      });
      setShowAddPayment(false);
      setPaymentUserId('');
      setPaymentAmount('');
      setPaymentMethod('cash');
      setPaymentDescription('');
      fetchDashboardData();
    } catch (error) {
      alert('Error adding payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFeePlan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await feePlansAPI.updateFeePlan(token, editFeePlanTarget._id, {
        ...editFeePlan,
        amount: parseFloat(editFeePlan.amount),
        durationInDays: parseInt(editFeePlan.durationInDays)
      });
      setEditFeePlanTarget(null);
      setEditFeePlan({ planName: '', amount: '', durationInDays: '', description: '' });
      fetchDashboardData();
    } catch (error) {
      alert('Error updating fee plan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentRequest = async () => {
    if (!deletePaymentRequest) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await paymentRequestAPI.deletePaymentRequest(token, deletePaymentRequest._id);
      setPaymentRequests(paymentRequests => paymentRequests.filter(r => r._id !== deletePaymentRequest._id));
      setDeletePaymentRequest(null);
    } catch (e) {
      alert('Delete failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    try {
      setUpdatingPassword(true)
      const token = localStorage.getItem('token')
      
      await adminAPI.updatePassword(token, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      setPasswordSuccess('Password updated successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      setPasswordError(error.message)
    } finally {
      setUpdatingPassword(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white">
      <img
        src="/TikoneCricketGurukul1.png" // Replace with your actual filename
        alt="Logo"
        className="w-full h-full object-contain"
      />
    </div>
          <span className="font-semibold text-gray-800">{user?.name || 'Admin'}</span>
          <span className="text-xs text-gray-500">{user?.email}</span>
          <Badge className="mt-2 bg-green-100 text-green-700">Admin</Badge>
        </div>
        <nav className="flex-1 py-2 px-2 space-y-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-150 ${activeTab === item.id ? 'bg-green-200 text-green-900 shadow' : 'text-gray-700 hover:bg-green-50 hover:scale-[1.03]'}`}
            >
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 mt-auto">
          <Button variant="outline" className="w-full flex items-center justify-center" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen z-10 flex flex-col items-center justify-start">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden flex items-center p-4">
          <button onClick={() => setSidebarOpen(true)} className="text-green-700"><Menu className="w-7 h-7" /></button>
        </div>
        <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-10">
          {/* Hero Section */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-green-200 via-green-100 to-blue-100 rounded-2xl shadow-lg p-8 mb-6 border border-green-100 animate-fade-in">
            <div className="flex items-center space-x-6">
              <div className="bg-transparent-500  p-2 shadow-sm">
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white">
      <img
        src="/TikoneCricketGurukul1.png" // Replace with your actual filename
        alt="Logo"
        className="w-full h-full object-contain"
      />
    </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-1 tracking-tight">Welcome, {user?.name || 'Admin'}!</h1>
                <p className="text-lg text-green-700 font-medium">Here’s your academy at a glance.</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="outline" className="px-3 py-1 text-green-700 border-green-400 bg-white/80"><Star className="w-4 h-4 mr-1 inline" /> Admin Panel</Badge>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col items-center">
              <div className="flex space-x-4">
                <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
                  <Users className="w-6 h-6 text-green-600 mb-1" />
                  <span className="text-lg font-bold text-green-900">{students.length}</span>
                  <span className="text-xs text-gray-500">Students</span>
                </div>
                <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
                  <CalendarCheck className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-lg font-bold text-blue-900">{payments.length}</span>
                  <span className="text-xs text-gray-500">Payments</span>
                </div>
                <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
                  <CheckCircle className="w-6 h-6 text-green-700 mb-1" />
                  <span className="text-lg font-bold text-green-900">{feePlans.length}</span>
                  <span className="text-xs text-gray-500">Fee Plans</span>
                </div>
                <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
                  <History className="w-6 h-6 text-purple-600 mb-1" />
                  <span className="text-lg font-bold text-purple-900">{subscriptions.length}</span>
                  <span className="text-xs text-gray-500">Subscriptions</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-400 text-center">All your key stats at a glance!</div>
            </div>
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="mb-6 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-2">Admin Dashboard Overview</h1>
                <p className="text-lg text-gray-600">Get a quick summary of your academy's key metrics and performance</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle></CardHeader>
                  <CardContent><p className="text-2xl font-bold">{students.length}</p></CardContent>
                </Card>
                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Active Students</CardTitle></CardHeader>
                  <CardContent><p className="text-2xl font-bold text-green-700">{students.filter(s => s.status === 'active').length}</p></CardContent>
                </Card>
                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Inactive Students</CardTitle></CardHeader>
                  <CardContent><p className="text-2xl font-bold text-red-600">{students.filter(s => s.status !== 'active').length}</p></CardContent>
                </Card>
                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Payments</CardTitle></CardHeader>
                  <CardContent><p className="text-2xl font-bold">{payments.length}</p></CardContent>
                </Card>
                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle></CardHeader>
                  <CardContent><p className="text-2xl font-bold text-green-700">{formatCurrency(payments.reduce((sum, p) => sum + (p.amount || 0), 0))}</p></CardContent>
                </Card>
                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Pending Payments</CardTitle></CardHeader>
                  <CardContent><p className="text-2xl font-bold text-yellow-600">{paymentRequests.filter(r => r.status === 'pending').length}</p></CardContent>
                </Card>
                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Fee Plans</CardTitle></CardHeader>
                  <CardContent><p className="text-2xl font-bold">{feePlans.length}</p></CardContent>
                </Card>
                <Card className="bg-white/80 shadow-md rounded-xl">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Active Subscriptions</CardTitle></CardHeader>
                  <CardContent><p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'active').length}</p></CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Students Management</h2>
                <Button onClick={() => setShowAddStudent(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Student
                </Button>
              </div>

              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader><CardTitle>All Students</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Email</th>
                          <th className="text-left py-2">Phone</th>
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student._id} className="border-b hover:bg-green-50">
                            <td className="py-2 font-semibold">{student.name}</td>
                            <td className="py-2">{student.email}</td>
                            <td className="py-2">{student.phone}</td>
                            <td className="py-2">
                              <Badge className={student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {student.status}
                              </Badge>
                            </td>
                            <td className="py-2 flex gap-2">
                              <Button size="sm" variant="secondary" onClick={() => { setEditTarget(student); setEditStudent({ name: student.name, email: student.email, phone: student.phone, password: '', status: student.status }); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => { setDeleteTarget(student); setDeleteType('student') }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Payments Management</h2>
                <Button onClick={() => setShowAddPayment(true)} className="bg-blue-600 hover:bg-blue-700">
                  <DollarSign className="w-4 h-4 mr-2" /> Add Payment
                </Button>
              </div>
              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader><CardTitle>All Payments</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Date</th>
                          <th className="text-left py-2">User</th>
                          <th className="text-left py-2">Amount</th>
                          <th className="text-left py-2">Method</th>
                          <th className="text-left py-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment._id || payment.id} className="border-b hover:bg-blue-50">
                            <td className="py-2">{formatDate(payment.createdAt)}</td>
                            <td className="py-2">{payment.user?.name || payment.email}</td>
                            <td className="py-2 font-semibold">{formatCurrency(payment.amount)}</td>
                            <td className="py-2 capitalize">{payment.method || 'UPI'}</td>
                            <td className="py-2">{payment.description || 'Payment'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment Requests Tab */}
          {activeTab === 'payment-requests' && (
            <div className="space-y-6">
              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader><CardTitle>Payment Requests</CardTitle></CardHeader>
                <CardContent>
                  {paymentRequests.length > 0 ? (
                    <div className="space-y-4">
                      {paymentRequests.map((request) => (
                        <div key={request._id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold">{formatCurrency(request.amount)}</h3>
                              <p className="text-sm text-gray-600">{request.description}</p>
                              <p className="text-xs text-gray-500">
                                Requested by {request.user?.name} ({request.user?.email}) on {formatDate(request.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getPaymentRequestStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => setDeletePaymentRequest(request)}
                                className="ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {request.screenshot && (
                            <div className="mb-3">
                              <img 
                                src={request.screenshot} 
                                alt="Payment Screenshot" 
                                className="max-w-xs rounded border"
                                width={50}
                              />
                            </div>
                          )}
                          
                          {request.status === 'pending' && (
                            <div className="flex space-x-2 mt-3">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setPreviewRequest(request)}
                                className="bg-gray-100 hover:bg-gray-200"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Preview
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => setSelectedRequest(request)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedRequest(request)}
                              >
                                Reject
                              </Button>
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

          {/* Payment Request Preview Modal */}
          {previewRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Payment Request Preview</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPreviewRequest(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Amount</Label>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(previewRequest.amount)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Status</Label>
                      <Badge className={getPaymentRequestStatusColor(previewRequest.status)}>
                        {previewRequest.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{previewRequest.description}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Requested by</Label>
                    <div className="mt-1">
                      <p className="font-medium">{previewRequest.user?.name}</p>
                      <p className="text-sm text-gray-600">{previewRequest.user?.email}</p>
                      <p className="text-xs text-gray-500">Requested on {formatDate(previewRequest.createdAt)}</p>
                    </div>
                  </div>
                  
                  {previewRequest.screenshot && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Payment Screenshot</Label>
                      <div className="mt-2">
                        <img 
                          src={previewRequest.screenshot} 
                          alt="Payment Screenshot" 
                          className="max-w-full rounded border shadow-sm"
                          style={{ maxHeight: '300px', objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setPreviewRequest(null)}
                    >
                      Close
                    </Button>
                    {previewRequest.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(previewRequest);
                            setPreviewRequest(null);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          Reject
                        </Button>
                        <Button 
                          onClick={() => {
                            setSelectedRequest(previewRequest);
                            setPreviewRequest(null);
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fee Plans Tab */}
          {activeTab === 'feeplans' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Fee Plans Management</h2>
                <Button onClick={() => setShowAddFeePlan(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Fee Plan
                </Button>
              </div>

              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader><CardTitle>All Fee Plans</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Plan Name</th>
                          <th className="text-left py-2">Amount</th>
                          <th className="text-left py-2">Duration (days)</th>
                          <th className="text-left py-2">Description</th>
                          <th className="text-left py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feePlans.map(plan => (
                          <tr key={plan._id} className="border-b hover:bg-blue-50">
                            <td className="py-2 font-semibold">{plan.planName}</td>
                            <td className="py-2">₹{plan.amount}</td>
                            <td className="py-2">{plan.durationInDays}</td>
                            <td className="py-2">{plan.description || '-'}</td>
                            <td className="py-2 flex gap-2">
                              <Button size="sm" variant="secondary" onClick={() => { setEditFeePlanTarget(plan); setEditFeePlan({ planName: plan.planName, amount: plan.amount.toString(), durationInDays: plan.durationInDays.toString(), description: plan.description || '' }); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => { setDeleteTarget(plan); setDeleteType('feeplan') }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader><CardTitle>All Subscriptions</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">User</th>
                          <th className="text-left py-2">Plan</th>
                          <th className="text-left py-2">Start Date</th>
                          <th className="text-left py-2">End Date</th>
                          <th className="text-left py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.map((subscription) => (
                          <tr key={subscription._id} className="border-b hover:bg-green-50">
                            <td className="py-2">{subscription.user?.name || subscription.user?.email}</td>
                            <td className="py-2">{subscription.plan?.planName}</td>
                            <td className="py-2">{formatDate(subscription.startDate)}</td>
                            <td className="py-2">{formatDate(subscription.endDate)}</td>
                            <td className="py-2">
                              <Badge className={getStatusColor(subscription.status)}>
                                {subscription.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader><CardTitle>Monthly Reports</CardTitle></CardHeader>
                <CardContent>
                  {report ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{report.totalStudents || 0}</p>
                        <p className="text-sm text-gray-600">Total Students</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(report.totalCollected || 0)}</p>
                        <p className="text-sm text-gray-600">Total Collected</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(report.totalDue || 0)}</p>
                        <p className="text-sm text-gray-600">Total Due</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{formatCurrency(report.averageCollectedPerStudent || 0)}</p>
                        <p className="text-sm text-gray-600">Average per Student</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{report.feePlansUsed || 0}</p>
                        <p className="text-sm text-gray-600">Fee Plans Used</p>
                      </div>
                      <div className="text-center p-4 bg-indigo-50 rounded-lg">
                        <p className="text-lg font-bold text-indigo-600">{report.popularPlan || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Popular Plan</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No report data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card className="bg-white/80 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle>Update Admin Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value
                        })}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value
                        })}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value
                        })}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>

                    {passwordError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-800">{passwordError}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.707 7.293a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-800">{passwordSuccess}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit"
                      disabled={updatingPassword}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {updatingPassword ? 'Updating Password...' : 'Update Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Add Student Modal */}
          {showAddStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Add New Student</h2>
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div>
                    <Label htmlFor="studentName">Name</Label>
                    <Input
                      id="studentName"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentEmail">Email</Label>
                    <Input
                      id="studentEmail"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentPhone">Phone</Label>
                    <Input
                      id="studentPhone"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentPassword">Password</Label>
                    <Input
                      id="studentPassword"
                      type="password"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddStudent(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                      {loading ? 'Adding...' : 'Add Student'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Fee Plan Modal */}
          {showAddFeePlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Add New Fee Plan</h2>
                <form onSubmit={handleAddFeePlan} className="space-y-4">
                  <div>
                    <Label htmlFor="planName">Plan Name</Label>
                    <Input
                      id="planName"
                      value={newFeePlan.planName}
                      onChange={(e) => setNewFeePlan({ ...newFeePlan, planName: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planAmount">Amount (₹)</Label>
                    <Input
                      id="planAmount"
                      type="number"
                      value={newFeePlan.amount}
                      onChange={(e) => setNewFeePlan({ ...newFeePlan, amount: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planDuration">Duration (Days)</Label>
                    <Input
                      id="planDuration"
                      type="number"
                      value={newFeePlan.durationInDays}
                      onChange={(e) => setNewFeePlan({ ...newFeePlan, durationInDays: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planDescription">Description</Label>
                    <Input
                      id="planDescription"
                      value={newFeePlan.description}
                      onChange={(e) => setNewFeePlan({ ...newFeePlan, description: e.target.value })}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddFeePlan(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                      {loading ? 'Adding...' : 'Add Fee Plan'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Student Modal */}
          {editTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Edit Student</h2>
                <form onSubmit={handleEditStudent} className="space-y-4">
                  <div>
                    <Label htmlFor="editStudentName">Name</Label>
                    <Input
                      id="editStudentName"
                      value={editStudent.name}
                      onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editStudentEmail">Email</Label>
                    <Input
                      id="editStudentEmail"
                      type="email"
                      value={editStudent.email}
                      onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editStudentPhone">Phone</Label>
                    <Input
                      id="editStudentPhone"
                      value={editStudent.phone}
                      onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editStudentStatus">Status</Label>
                    <select
                      id="editStudentStatus"
                      value={editStudent.status}
                      onChange={(e) => setEditStudent({ ...editStudent, status: e.target.value })}
                      className="w-full border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500 p-2"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="editStudentPlan">Plan</Label>
                    <select
                      id="editStudentPlan"
                      value={editPlanId || (editTarget.activeSubscription?.plan?._id || '')}
                      onChange={(e) => setEditPlanId(e.target.value)}
                      className="w-full border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500 p-2"
                    >
                      <option value="">-- Select Plan --</option>
                      {feePlans.map(plan => (
                        <option key={plan._id} value={plan._id}>
                          {plan.planName} (₹{plan.amount}, {plan.durationInDays} days)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="editStudentPassword">New Password (leave blank to keep unchanged)</Label>
                    <Input
                      id="editStudentPassword"
                      type="password"
                      placeholder="Enter new password (optional)"
                      value={editStudent.password}
                      onChange={(e) => setEditStudent({ ...editStudent, password: e.target.value })}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 6 characters. Leave blank to keep current password.
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Payment Request Approval Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">
                    {selectedRequest.status === 'pending' ? 'Review Payment Request' : 'Payment Request Details'}
                  </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Amount</Label>
                      <p className="font-semibold">{formatCurrency(selectedRequest.amount)}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getPaymentRequestStatusColor(selectedRequest.status)}>
                        {selectedRequest.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <p className="text-sm bg-gray-50 p-2 rounded">{selectedRequest.description}</p>
                  </div>
                  
                  {selectedRequest.feePlan && (
                    <div>
                      <Label>Selected Fee Plan</Label>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="font-semibold text-blue-800">{selectedRequest.feePlan.planName}</p>
                        <p className="text-sm text-blue-600">₹{selectedRequest.feePlan.amount} for {selectedRequest.feePlan.durationInDays} days</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label>Requested by</Label>
                    <p className="text-sm">{selectedRequest.user?.name} ({selectedRequest.user?.email})</p>
                    <p className="text-xs text-gray-500">Requested on {formatDate(selectedRequest.createdAt)}</p>
                  </div>
                  
                  {selectedRequest.screenshot && (
                    <div>
                      <Label>Screenshot</Label>
                      <div className="mt-2">
                        <img 
                          src={selectedRequest.screenshot} 
                          alt="Payment Screenshot" 
                          className="max-w-full rounded border shadow-sm"
                          style={{ maxHeight: '300px', objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {selectedRequest.status === 'pending' && (
                    <>
                      <div>
                        <Label htmlFor="adminNotes">Admin Notes</Label>
                        <Input
                          id="adminNotes"
                          placeholder="Add notes (optional)"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="transactionId">Transaction ID</Label>
                        <Input
                          id="transactionId"
                          placeholder="Enter transaction ID (optional)"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="p-6 border-t bg-gray-50">
                  {selectedRequest.status === 'pending' ? (
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setSelectedRequest(null)
                          setAdminNotes('')
                          setTransactionId('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => handleRejectPaymentRequest(selectedRequest._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Reject
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => handleApprovePaymentRequest(selectedRequest._id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setSelectedRequest(null)
                          setAdminNotes('')
                          setTransactionId('')
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add Payment Modal */}
          {showAddPayment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Add Payment</h2>
                <form onSubmit={handleAddPayment} className="space-y-4">
                  <div>
                    <Label htmlFor="paymentUser">Select User</Label>
                    <select
                      id="paymentUser"
                      value={paymentUserId}
                      onChange={e => setPaymentUserId(e.target.value)}
                      className="w-full border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500 p-2"
                      required
                    >
                      <option value="">-- Search or Select User --</option>
                      {students.map(s => (
                        <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="paymentAmount">Amount</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(e.target.value)}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-full border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500 p-2"
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="paymentDescription">Description</Label>
                    <Input
                      id="paymentDescription"
                      value={paymentDescription}
                      onChange={e => setPaymentDescription(e.target.value)}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddPayment(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                      {loading ? 'Adding...' : 'Add Payment'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Fee Plan Modal */}
          {editFeePlanTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Edit Fee Plan</h2>
                <form onSubmit={handleEditFeePlan} className="space-y-4">
                  <div>
                    <Label htmlFor="editPlanName">Plan Name</Label>
                    <Input
                      id="editPlanName"
                      value={editFeePlan.planName}
                      onChange={(e) => setEditFeePlan({ ...editFeePlan, planName: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPlanAmount">Amount (₹)</Label>
                    <Input
                      id="editPlanAmount"
                      type="number"
                      value={editFeePlan.amount}
                      onChange={(e) => setEditFeePlan({ ...editFeePlan, amount: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPlanDuration">Duration (Days)</Label>
                    <Input
                      id="editPlanDuration"
                      type="number"
                      value={editFeePlan.durationInDays}
                      onChange={(e) => setEditFeePlan({ ...editFeePlan, durationInDays: e.target.value })}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPlanDescription">Description</Label>
                    <Input
                      id="editPlanDescription"
                      value={editFeePlan.description}
                      onChange={(e) => setEditFeePlan({ ...editFeePlan, description: e.target.value })}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setEditFeePlanTarget(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {deleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full">
                <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                <p className="mb-6">Are you sure you want to delete this {deleteType === 'student' ? 'student' : 'fee plan'}?</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => { setDeleteTarget(null); setDeleteType('') }}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={loading}>Delete</Button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Payment Request Confirmation Dialog */}
          {deletePaymentRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full">
                <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                <p className="mb-6">Are you sure you want to delete this payment request?</p>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">{formatCurrency(deletePaymentRequest.amount)}</p>
                  <p className="text-xs text-gray-600">{deletePaymentRequest.description}</p>
                  <p className="text-xs text-gray-500">by {deletePaymentRequest.user?.name}</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDeletePaymentRequest(null)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDeletePaymentRequest} disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
