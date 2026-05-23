import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft,
  Tag, Shield, Truck, RotateCcw, Package, CheckCircle,
  ShoppingBag, Star, Zap, Gift
} from 'lucide-react'
import Layout from '../components/layout/Layout'

// Sample cart data – replace with your real cart state/context
const initialCartItems = [
  {
    id: 1,
    name: 'TCG Premium Cricket Bat',
    variant: 'English Willow · Size 6',
    price: 4500,
    originalPrice: 5500,
    quantity: 1,
    image: '/tcg_ground.jpeg',
    badge: 'Bestseller',
    badgeVariant: 'success',
    inStock: true,
  },
  {
    id: 2,
    name: 'TCG Training Kit Bag',
    variant: 'Large · Green',
    price: 1800,
    originalPrice: 2200,
    quantity: 2,
    image: '/tcg_ground.jpeg',
    badge: 'Sale',
    badgeVariant: 'warning',
    inStock: true,
  },
  {
    id: 3,
    name: 'Thigh Guard + Arm Guard Combo',
    variant: 'Adult · One Size',
    price: 950,
    originalPrice: null,
    quantity: 1,
    image: '/tcg_ground.jpeg',
    badge: null,
    inStock: true,
  },
]

const PROMO_CODES = { TCG10: 10, GURUKUL15: 15, CRICKET20: 20 }

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')

  /* ── helpers ── */
  const updateQty = (id, delta) =>
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )

  const removeItem = id =>
    setCartItems(prev => prev.filter(item => item.id !== id))

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const savings = cartItems.reduce(
    (sum, i) => sum + (i.originalPrice ? (i.originalPrice - i.price) * i.quantity : 0),
    0
  )
  const discount = appliedPromo
    ? Math.round((subtotal * PROMO_CODES[appliedPromo]) / 100)
    : 0
  const shipping = subtotal > 2000 ? 0 : 150
  const total = subtotal - discount + shipping

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setAppliedPromo(code)
      setPromoSuccess(`${PROMO_CODES[code]}% discount applied!`)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code. Try TCG10, GURUKUL15, or CRICKET20.')
      setPromoSuccess('')
    }
  }

  const removePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    setPromoSuccess('')
    setPromoError('')
  }

  /* ── empty state ── */
  if (cartItems.length === 0) {
    return (
      <Layout>
        <section className="bg-gradient-to-br from-background via-muted/20 to-muted/10 min-h-[60vh] flex items-center justify-center py-16">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Looks like you haven't added anything yet. Head to our shop and gear up!
            </p>
            <Link to="/shop">
              <Button size="lg" className="group bg-green-600 hover:bg-green-700">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Browse Shop
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* ── Header ── */}
      <section className="relative bg-gradient-to-br from-background via-muted/20 to-muted/10 overflow-hidden py-8 sm:py-12 border-b border-border">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1 animate-fade-in">
              <Badge variant="outline" className="mb-2 inline-flex items-center space-x-2 px-3 py-1.5 text-xs">
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Your Cart</span>
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Shopping Cart
                <span className="ml-3 text-base sm:text-lg font-medium text-muted-foreground">
                  ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                </span>
              </h1>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="group hover:bg-green-50 hover:border-green-200 transition-all duration-200">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="bg-green-50 dark:bg-green-950/30 border-b border-green-100 dark:border-green-900 py-3">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-green-700 dark:text-green-400">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>Free shipping above ₹2,000</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-4 w-4" />
              <span>7-day easy returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Ships in 2–3 business days</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="bg-background py-8 sm:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">

            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-4 animate-fade-in">
              {cartItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-md transition-all duration-300 group"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="relative w-full sm:w-36 lg:w-44 h-40 sm:h-auto flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover sm:rounded-l-xl group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.badge && (
                          <div className="absolute top-2 left-2">
                            <Badge variant={item.badgeVariant} className="text-xs px-2 py-0.5 shadow">
                              {item.badge}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground text-base sm:text-lg leading-tight">
                              {item.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                          {/* Price */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg sm:text-xl font-bold text-green-600">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{(item.originalPrice * item.quantity).toLocaleString()}
                              </span>
                            )}
                            {item.originalPrice && (
                              <Badge variant="success" className="text-[10px] px-1.5 py-0.5">
                                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                              </Badge>
                            )}
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center border border-border rounded-xl overflow-hidden w-fit shadow-sm">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="px-3 py-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-4 py-1.5 text-sm font-semibold text-foreground min-w-[2.5rem] text-center border-x border-border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="px-3 py-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Unit price hint */}
                        {item.quantity > 1 && (
                          <p className="text-[11px] text-muted-foreground">
                            ₹{item.price.toLocaleString()} × {item.quantity} units
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Savings callout */}
              {savings > 0 && (
                <div className="flex items-center space-x-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 animate-fade-in">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                    You're saving <span className="font-bold">₹{savings.toLocaleString()}</span> on this order!
                  </p>
                </div>
              )}
            </div>

            {/* ── Order Summary ── */}
            <div className="space-y-4 animate-slide-up">
              {/* Promo code */}
              <Card className="overflow-hidden">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <h3 className="font-semibold text-foreground text-sm">Promo Code</h3>
                  </div>

                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                          {appliedPromo} — {PROMO_CODES[appliedPromo]}% off
                        </span>
                      </div>
                      <button
                        onClick={removePromo}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={e => { setPromoInput(e.target.value); setPromoError('') }}
                        onKeyDown={e => e.key === 'Enter' && applyPromo()}
                        placeholder="Enter code…"
                        className="flex-1 text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                      />
                      <Button
                        size="sm"
                        onClick={applyPromo}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Apply
                      </Button>
                    </div>
                  )}

                  {promoError && (
                    <p className="text-xs text-red-500">{promoError}</p>
                  )}
                  {promoSuccess && !appliedPromo && (
                    <p className="text-xs text-green-600">{promoSuccess}</p>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Object.keys(PROMO_CODES).map(code => (
                      <button
                        key={code}
                        onClick={() => { setPromoInput(code); setPromoError('') }}
                        className="text-[10px] px-2 py-0.5 border border-dashed border-green-300 text-green-600 rounded-md hover:bg-green-50 transition-colors"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center space-x-2">
                    <Star className="h-4 w-4 text-green-600" />
                    <span>Order Summary</span>
                  </h3>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>

                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Product Savings</span>
                        <span>−₹{savings.toLocaleString()}</span>
                      </div>
                    )}

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo ({appliedPromo})</span>
                        <span>−₹{discount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5" />
                        Shipping
                      </span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        <span>₹{shipping}</span>
                      )}
                    </div>

                    {shipping > 0 && (
                      <p className="text-[11px] text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 leading-relaxed">
                        Add ₹{(2000 - subtotal).toLocaleString()} more to get <span className="font-semibold text-green-600">free shipping</span>!
                      </p>
                    )}

                    <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground text-base">
                      <span>Total</span>
                      <span className="text-green-600 text-lg">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link to="/checkout" className="block">
                    <Button size="lg" className="w-full group bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      <Shield className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <div className="flex items-center justify-center space-x-4 text-[11px] text-muted-foreground pt-1">
                    <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Secure Pay</span>
                    <span className="flex items-center gap-1"><RotateCcw className="h-3 w-3" /> Easy Returns</span>
                    <span className="flex items-center gap-1"><Gift className="h-3 w-3" /> Gift Wrap Available</span>
                  </div>
                </CardContent>
              </Card>

              {/* Academy trust block */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Tikone Cricket Gurukul Shop</p>
                      <p className="text-[11px] text-muted-foreground">Official Gear & Merchandise</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    All products are quality-checked by our coaches and sourced from trusted cricket equipment manufacturers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
