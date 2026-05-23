import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
  ShieldCheck, Truck, RotateCcw, ArrowLeft, ArrowRight,
  CheckCircle, CreditCard, Smartphone, Building2, Wallet,
  MapPin, User, Phone, Mail, Home, Star, Lock,
  Package, ChevronDown, ChevronUp, Edit2, Zap
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useCart } from '../context/CartContext'


const STEPS = ['Delivery', 'Payment', 'Review']

const PAYMENT_METHODS = [
  { id: 'upi',  label: 'UPI', icon: Smartphone,  desc: 'GPay, PhonePe, Paytm & more' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks supported' },
  { id: 'cod',  label: 'Cash on Delivery', icon: Wallet,   desc: 'Pay when you receive' },
]

/* ── Small reusable input ── */
function Field({ label, id, type = 'text', placeholder, value, onChange, required, icon: Icon, half }) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2 sm:col-span-2'}>
      <label htmlFor={id} className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all py-2.5
            ${Icon ? 'pl-10 pr-3' : 'px-3'}`}
        />
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, setCartItems } = useCart()
  const [step, setStep] = useState(0)   // 0 = Delivery, 1 = Payment, 2 = Review
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [payMethod, setPayMethod] = useState('upi')

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
    upiId: '', cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '',
    bank: '',
  })

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  /* ── Totals ── */
  const subtotal = cartItems.reduce(
  (s, i) =>
    s +
    Number(String(i.price).replace(/[^0-9]/g, "")) *
      i.quantity,
  0
)
  const savings   = cartItems.reduce((s, i) => s + (i.originalPrice ? (
  Number(String(i.mrp).replace(/[^0-9]/g, "")) -
  Number(String(i.price).replace(/[^0-9]/g, ""))
) * i.quantity : 0), 0)
  const discount  = 360          // assume promo already applied from CartPage
  const shipping  = subtotal > 2000 ? 0 : 150
  const total     = subtotal - discount + shipping

  /* ── Step nav ── */
  const canNext = () => {
    if (step === 0)
      return form.firstName && form.lastName && form.email && form.phone &&
             form.address && form.city && form.state && form.pincode
    if (step === 1) return true
    return true
  }

  const next = () => { if (step < 2) setStep(s => s + 1) }
  const back = () => { if (step > 0) setStep(s => s - 1) }

  const placeOrder = () => {
  setOrderPlaced(true)
  setCartItems([])
  localStorage.removeItem("cartItems")
}

  /* ── Success screen ── */
  if (orderPlaced) {
    return (
      <Layout>
        <section className="bg-gradient-to-br from-background via-muted/20 to-muted/10 min-h-[70vh] flex items-center justify-center py-16">
          <div className="text-center space-y-6 animate-fade-in max-w-md mx-auto px-4">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <Badge variant="success" className="px-4 py-1.5 text-sm inline-flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Order Confirmed!
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Thank you, {form.firstName || 'Champion'}!
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your order has been placed successfully. You'll receive a confirmation on{' '}
              <span className="font-medium text-foreground">{form.email || 'your email'}</span>.
              Gear up and get ready to play!
            </p>
            <div className="bg-muted/50 border border-border rounded-2xl px-6 py-4 space-y-2 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-semibold text-foreground">#TCG-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="font-semibold text-foreground">3–5 Business Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-bold text-green-600 text-base">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to="/shop">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 group w-full sm:w-auto">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/student/dashboard">
                <Button size="lg" variant="outline" className="hover:bg-green-50 hover:border-green-200 w-full sm:w-auto">
                  My Orders
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* ── Header ── */}
      <section className="relative bg-gradient-to-br from-background via-muted/20 to-muted/10 overflow-hidden py-8 sm:py-10 border-b border-border">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
            <div className="space-y-1">
              <Badge variant="outline" className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 text-xs">
                <Lock className="h-3.5 w-3.5" />
                Secure Checkout
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Checkout
              </h1>
            </div>
            <Link to="/cart">
              <Button variant="outline" className="group hover:bg-green-50 hover:border-green-200 transition-all duration-200">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Cart
              </Button>
            </Link>
          </div>

          {/* ── Stepper ── */}
          <div className="mt-6 flex items-center gap-0 max-w-sm">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => i < step && setStep(i)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                      ${i < step  ? 'bg-green-600 text-white shadow-md cursor-pointer hover:bg-green-700' :
                        i === step ? 'bg-green-600 text-white shadow-lg ring-4 ring-green-200 dark:ring-green-900' :
                                     'bg-muted text-muted-foreground cursor-default'}`}
                  >
                    {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </button>
                  <span className={`text-xs font-medium hidden sm:block transition-colors
                    ${i === step ? 'text-foreground' : i < step ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded transition-all duration-500
                    ${i < step ? 'bg-green-500' : 'bg-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="bg-green-50 dark:bg-green-950/30 border-b border-green-100 dark:border-green-900 py-3">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-green-700 dark:text-green-400">
            <div className="flex items-center space-x-2"><Lock className="h-4 w-4" /><span>256-bit SSL Encryption</span></div>
            <div className="flex items-center space-x-2"><ShieldCheck className="h-4 w-4" /><span>100% Secure Payment</span></div>
            <div className="flex items-center space-x-2"><Truck className="h-4 w-4" /><span>Free shipping above ₹2,000</span></div>
            <div className="flex items-center space-x-2"><RotateCcw className="h-4 w-4" /><span>7-day returns</span></div>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <section className="bg-background py-8 sm:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">

            {/* ── Left: Steps ── */}
            <div className="lg:col-span-2 space-y-6 animate-fade-in">

              {/* STEP 0 — Delivery */}
              {step === 0 && (
                <Card>
                  <CardContent className="p-5 sm:p-6 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground text-base">Delivery Address</h2>
                        <p className="text-xs text-muted-foreground">Where should we deliver your order?</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <Field label="First Name" id="fn" placeholder="Rohit" value={form.firstName} onChange={set('firstName')} required icon={User} half />
                      <Field label="Last Name"  id="ln" placeholder="Sharma"  value={form.lastName}  onChange={set('lastName')}  required icon={User} half />
                      <Field label="Email Address" id="email" type="email" placeholder="rohit@example.com" value={form.email} onChange={set('email')} required icon={Mail} />
                      <Field label="Phone Number" id="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} required icon={Phone} />
                      <Field label="Street Address" id="addr" placeholder="Flat / Building, Street Name" value={form.address} onChange={set('address')} required icon={Home} />
                      <Field label="City"    id="city"    placeholder="Pune"        value={form.city}    onChange={set('city')}    required half icon={MapPin} />
                      <Field label="State"   id="state"   placeholder="Maharashtra" value={form.state}   onChange={set('state')}   required half />
                      <Field label="PIN Code" id="pin"   placeholder="411033"       value={form.pincode} onChange={set('pincode')} required half />
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        size="lg"
                        onClick={next}
                        disabled={!canNext()}
                        className="group bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Payment
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* STEP 1 — Payment */}
              {step === 1 && (
                <Card>
                  <CardContent className="p-5 sm:p-6 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground text-base">Payment Method</h2>
                        <p className="text-xs text-muted-foreground">Choose how you'd like to pay</p>
                      </div>
                    </div>

                    {/* Method tiles */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      {PAYMENT_METHODS.map(m => {
                        const Icon = m.icon
                        const active = payMethod === m.id
                        return (
                          <button
                            key={m.id}
                            onClick={() => setPayMethod(m.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
                              ${active
                                ? 'border-green-500 bg-green-50 dark:bg-green-950/30 shadow-md'
                                : 'border-border bg-background hover:border-green-300 hover:bg-muted/30'}`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                              ${active ? 'bg-green-600 shadow-lg' : 'bg-muted'}`}>
                              <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-muted-foreground'}`} />
                            </div>
                            <div>
                              <p className={`text-sm font-semibold ${active ? 'text-green-700 dark:text-green-400' : 'text-foreground'}`}>
                                {m.label}
                              </p>
                              <p className="text-[11px] text-muted-foreground">{m.desc}</p>
                            </div>
                            {active && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                          </button>
                        )
                      })}
                    </div>

                    {/* Dynamic fields */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                      {payMethod === 'upi' && (
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                            UPI ID <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="yourname@upi"
                              value={form.upiId}
                              onChange={set('upiId')}
                              className="w-full text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground
                                focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all py-2.5 pl-10 pr-3"
                            />
                          </div>
                        </div>
                      )}

                      {payMethod === 'card' && (
                        <>
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Card Number <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <input type="text" maxLength={19} placeholder="1234 5678 9012 3456"
                                value={form.cardNumber} onChange={set('cardNumber')}
                                className="w-full text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground
                                  focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all py-2.5 pl-10 pr-3" />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name on Card <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="Rohit Sharma"
                              value={form.cardName} onChange={set('cardName')}
                              className="w-full text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground
                                focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all py-2.5 px-3" />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Expiry <span className="text-red-500">*</span></label>
                            <input type="text" maxLength={5} placeholder="MM/YY"
                              value={form.cardExpiry} onChange={set('cardExpiry')}
                              className="w-full text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground
                                focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all py-2.5 px-3" />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">CVV <span className="text-red-500">*</span></label>
                            <input type="password" maxLength={4} placeholder="•••"
                              value={form.cardCvv} onChange={set('cardCvv')}
                              className="w-full text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground
                                focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all py-2.5 px-3" />
                          </div>
                        </>
                      )}

                      {payMethod === 'netbanking' && (
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Select Bank <span className="text-red-500">*</span></label>
                          <select value={form.bank} onChange={set('bank')}
                            className="w-full text-sm border border-border rounded-xl bg-background text-foreground
                              focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all py-2.5 px-3">
                            <option value="">-- Choose your bank --</option>
                            {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda'].map(b => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {payMethod === 'cod' && (
                        <div className="col-span-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
                          <div className="flex items-start gap-3">
                            <Wallet className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                              Pay in cash when your order arrives. Please keep exact change ready. A ₹50 COD handling fee may apply.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <Button variant="outline" onClick={back} className="group hover:bg-green-50 hover:border-green-200">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                      </Button>
                      <Button size="lg" onClick={next} className="group bg-green-600 hover:bg-green-700">
                        Review Order
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* STEP 2 — Review */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  {/* Delivery summary */}
                  <Card>
                    <CardContent className="p-5 sm:p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-foreground text-sm">Delivery Address</h3>
                        </div>
                        <button onClick={() => setStep(0)} className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                          <Edit2 className="h-3 w-3" /> Edit
                        </button>
                      </div>
                      <div className="pl-12 text-sm text-muted-foreground space-y-0.5">
                        <p className="font-medium text-foreground">{form.firstName} {form.lastName}</p>
                        <p>{form.address}</p>
                        <p>{form.city}, {form.state} — {form.pincode}</p>
                        <p>{form.phone} · {form.email}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment summary */}
                  <Card>
                    <CardContent className="p-5 sm:p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow">
                            <CreditCard className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-foreground text-sm">Payment Method</h3>
                        </div>
                        <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                          <Edit2 className="h-3 w-3" /> Edit
                        </button>
                      </div>
                      <div className="pl-12 text-sm text-muted-foreground">
                        {PAYMENT_METHODS.find(m => m.id === payMethod)?.label}
                        {payMethod === 'upi'  && form.upiId  && <span className="text-foreground font-medium ml-2">({form.upiId})</span>}
                        {payMethod === 'card' && form.cardNumber && <span className="text-foreground font-medium ml-2">·· {form.cardNumber.slice(-4)}</span>}
                        {payMethod === 'netbanking' && form.bank && <span className="text-foreground font-medium ml-2">— {form.bank}</span>}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Items */}
                  <Card>
                    <CardContent className="p-5 sm:p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow">
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground text-sm">Order Items ({cartItems.length})</h3>
                      </div>
                      <div className="space-y-3">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                              <p className="text-[11px] text-muted-foreground">{item.variant} · Qty {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-green-600 flex-shrink-0">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={back} className="group hover:bg-green-50 hover:border-green-200">
                      <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      Back
                    </Button>
                    <Button
                      size="lg"
                      onClick={placeOrder}
                      className="group bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <ShieldCheck className="mr-2 h-5 w-5" />
                      Place Order — ₹{total.toLocaleString()}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="space-y-4 animate-slide-up">
              <Card>
                <CardContent className="p-5 space-y-4">
                  {/* Collapsible header on mobile */}
                  <button
                    className="w-full flex items-center justify-between"
                    onClick={() => setSummaryOpen(o => !o)}
                  >
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Star className="h-4 w-4 text-green-600" />
                      Order Summary
                    </h3>
                    <span className="sm:hidden text-muted-foreground">
                      {summaryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </button>

                  <div className={`space-y-3 ${summaryOpen ? 'block' : 'hidden sm:block'}`}>
                    {/* Items */}
                    <div className="space-y-3 pb-3 border-b border-border">
                      {ORDER_ITEMS.map(item => (
                        <div key={item.id} className="flex gap-3 items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground leading-tight truncate">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">Qty {item.quantity}</p>
                          </div>
                          <p className="text-xs font-bold text-foreground flex-shrink-0">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      {savings > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Product Savings</span>
                          <span>−₹{savings.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-green-600">
                        <span>Promo (TCG10)</span>
                        <span>−₹{discount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" />Shipping</span>
                        {shipping === 0
                          ? <span className="text-green-600 font-medium">Free</span>
                          : <span>₹{shipping}</span>}
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground text-base">
                        <span>Total</span>
                        <span className="text-green-600 text-lg">₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academy trust */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Tikone Cricket Gurukul</p>
                      <p className="text-[11px] text-muted-foreground">Official Gear & Merchandise</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    All products are coach-verified and sourced from trusted cricket equipment manufacturers.
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Lock className="h-3 w-3" />SSL Secured</span>
                    <span className="flex items-center gap-1"><RotateCcw className="h-3 w-3" />Easy Returns</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" />Verified</span>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  )
}
