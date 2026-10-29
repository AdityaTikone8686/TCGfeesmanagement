import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft,
  Tag, Shield, Truck, RotateCcw, Package, CheckCircle,
  ShoppingBag, Star, Zap, Gift
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useCart } from '../context/CartContext'

/* ------------------------------------------------------------------
   THEME  (same tokens as the landing page)
   Pink  : #FFA8E0  (brand / background)
   Plum  : #2A0A3F  (contrast: text, dark sections, buttons)
   Lime  : #C6FF3D  (cricket-ball accent pop)
   Cream : #FFF6FC  (soft surfaces)
   Fonts : Bricolage Grotesque (headings) + DM Sans (body)
------------------------------------------------------------------- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcg {
  --pink: #FFA8E0;
  --pink-soft: #FFD3F0;
  --pink-deep: #FF7FD0;
  --plum: #2A0A3F;
  --plum-2: #4A1470;
  --lime: #C6FF3D;
  --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: var(--plum);
  background: var(--cream);
  overflow-x: hidden;
}
.tcg h1, .tcg h2, .tcg h3, .tcg .tcg-display {
  font-family: 'Bricolage Grotesque', 'DM Sans', sans-serif;
  letter-spacing: -0.02em;
}
.tcg * { box-sizing: border-box; }

/* ---------- keyframes ---------- */
@keyframes tcg-float { 0%,100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-22px) rotate(6deg) } }
@keyframes tcg-float-b { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(30px,-26px) scale(1.12) } }
@keyframes tcg-spin { to { transform: rotate(360deg) } }
@keyframes tcg-shimmer { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
@keyframes tcg-bounce-soft { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes tcg-pop-in { 0% { opacity: 0; transform: scale(.7) translateY(20px) } 100% { opacity: 1; transform: scale(1) translateY(0) } }
@keyframes tcg-wiggle { 0%,100% { transform: rotate(-4deg) } 50% { transform: rotate(4deg) } }
@keyframes tcg-gradient-move { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
@keyframes tcg-underline { from { transform: scaleX(0) } to { transform: scaleX(1) } }

/* ---------- scroll reveal ---------- */
.tcg-reveal { opacity: 0; transform: translateY(40px) scale(.98); transition: opacity .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1); transition-delay: var(--d, 0ms); }
.tcg-reveal.in { opacity: 1; transform: none; }

/* ---------- decorative ---------- */
.tcg-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
.tcg-ball { position: absolute; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%);
  box-shadow: inset -6px -8px 14px rgba(0,0,0,.25), 0 12px 24px rgba(42,10,63,.25); }
.tcg-ball::after { content: ''; position: absolute; inset: 8% 45% 8% 45%; border-left: 2px dashed rgba(255,255,255,.7); border-right: 2px dashed rgba(255,255,255,.7); border-radius: 50%; }
.tcg-grid { position: absolute; inset: 0; pointer-events: none; opacity: .35;
  background-image: linear-gradient(rgba(42,10,63,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(42,10,63,.08) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(circle at 50% 40%, #000 20%, transparent 75%);
          mask-image: radial-gradient(circle at 50% 40%, #000 20%, transparent 75%); }

.tcg-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 16px; position: relative; z-index: 2; }

/* ---------- chips / buttons ---------- */
.tcg-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; font-weight: 700; font-size: 13px; background: var(--plum); color: var(--lime); animation: tcg-pop-in .7s both; }
.tcg-chip svg { animation: tcg-spin 6s linear infinite; }
.tcg-chip.light { background: #fff; color: var(--plum); border: 2px solid var(--plum); }

.tcg-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 26px; border-radius: 16px; font-family: inherit; font-weight: 700; font-size: 15px; text-decoration: none; border: 2px solid var(--plum); transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s, background .25s, color .25s; cursor: pointer; }
.tcg-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.55), transparent); transform: skewX(-20deg); transition: left .7s; }
.tcg-btn:hover::before { left: 140%; }
.tcg-btn:hover { transform: translateY(-4px) rotate(-1deg); box-shadow: 6px 6px 0 var(--plum); }
.tcg-btn:active { transform: translateY(0); box-shadow: 0 0 0 var(--plum); }
.tcg-btn:focus-visible, .tcg-qbtn:focus-visible, .tcg-trash:focus-visible, .tcg-input:focus-visible, .tcg-code:focus-visible { outline: 3px solid var(--plum); outline-offset: 3px; }
.tcg-btn.primary { background: var(--plum); color: #fff; }
.tcg-btn.primary:hover { background: var(--plum-2); }
.tcg-btn.outline { background: #fff; color: var(--plum); }
.tcg-btn.outline:hover { background: var(--lime); }
.tcg-btn.lime { background: var(--lime); color: var(--plum); }
.tcg-btn.lime:hover { box-shadow: 6px 6px 0 var(--pink); }
.tcg-btn.sm { padding: 10px 18px; font-size: 14px; border-radius: 12px; }
.tcg-btn.block { width: 100%; }
.tcg-btn .arr { transition: transform .25s; }
.tcg-btn:hover .arr { transform: translateX(5px); }
.tcg-btn:hover .arr-l { transform: translateX(-5px); }
.tcg-btn .arr-l { transition: transform .25s; }

/* ---------- header ---------- */
.tcg-hero { position: relative; padding: 44px 0 72px; background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 55%, #fff0fa 100%); background-size: 200% 200%; animation: tcg-gradient-move 14s ease infinite; overflow: hidden; }
@media (min-width: 1024px) { .tcg-hero { padding: 64px 0 90px; } }
.tcg-hero-row { display: flex; flex-direction: column; gap: 22px; }
@media (min-width: 640px) { .tcg-hero-row { flex-direction: row; align-items: flex-end; justify-content: space-between; } }
.tcg-h1 { font-size: clamp(2.2rem, 6vw, 4rem); font-weight: 800; line-height: 1.04; margin: 16px 0 0; color: var(--plum); animation: tcg-pop-in .8s .1s both; }
.tcg-shimmer { display: inline-block; background: linear-gradient(90deg, var(--plum) 0%, #b0108a 25%, var(--plum-2) 50%, #b0108a 75%, var(--plum) 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcg-shimmer 5s linear infinite; position: relative; }
.tcg-shimmer::after { content: ''; position: absolute; left: 0; right: 0; bottom: 2px; height: 10px; background: var(--lime); z-index: -1; border-radius: 6px; transform-origin: left; animation: tcg-underline 1.2s .8s both cubic-bezier(.2,.8,.2,1); }
.tcg-count { display: inline-block; margin-left: 12px; padding: 4px 14px; border-radius: 999px; background: var(--lime); border: 3px solid var(--plum); font-size: clamp(.95rem, 2vw, 1.15rem); font-weight: 800; vertical-align: middle; animation: tcg-wiggle 2.4s ease-in-out infinite; }
@media (max-width: 639px) { .tcg-hero-row .tcg-btn { width: 100%; } }

/* ---------- trust strip ---------- */
.tcg-trust { background: var(--plum); color: var(--pink); border-block: 3px solid var(--plum); transform: rotate(-1deg) scale(1.03); margin: -28px 0 8px; padding: 14px 0; position: relative; z-index: 4; }
.tcg-trust-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 32px; padding: 0 16px; }
.tcg-trust-item { display: inline-flex; align-items: center; gap: 10px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 14px; white-space: nowrap; }
.tcg-trust-item svg { color: var(--lime); flex-shrink: 0; }
@media (min-width: 768px) { .tcg-trust-item { font-size: 16px; } }

/* ---------- main ---------- */
.tcg-main { position: relative; padding: 56px 0 80px; background: linear-gradient(180deg, var(--pink-soft) 0%, var(--cream) 100%); overflow: hidden; }
.tcg-layout { display: grid; grid-template-columns: 1fr; gap: 28px; align-items: start; }
@media (min-width: 1024px) { .tcg-layout { grid-template-columns: 1.7fr 1fr; gap: 36px; } .tcg-aside { position: sticky; top: 20px; } }
.tcg-list-col { display: grid; gap: 22px; }
.tcg-aside { display: grid; gap: 22px; }

/* item card */
.tcg-item { position: relative; display: flex; flex-direction: column; background: #fff; border: 3px solid var(--plum); border-radius: 28px; overflow: hidden; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; }
.tcg-item:hover { transform: translateY(-6px) rotate(-.6deg); box-shadow: 10px 10px 0 var(--plum); }
@media (min-width: 640px) { .tcg-item { flex-direction: row; } }
.tcg-thumb { position: relative; flex-shrink: 0; width: 100%; height: 180px; background: var(--pink-soft); border-bottom: 3px solid var(--plum); overflow: hidden; }
@media (min-width: 640px) { .tcg-thumb { width: 170px; height: auto; min-height: 190px; border-bottom: 0; border-right: 3px solid var(--plum); } }
.tcg-thumb img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 1s cubic-bezier(.2,.8,.2,1); }
.tcg-item:hover .tcg-thumb img { transform: scale(1.08); }
.tcg-thumb .tcg-tag { position: absolute; top: 10px; left: 10px; }
.tcg-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; padding: 20px 22px; }
.tcg-info-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.tcg-info h3 { margin: 0; font-size: 20px; font-weight: 800; line-height: 1.2; }
.tcg-variant { margin: 4px 0 0; font-size: 13px; color: rgba(42,10,63,.65); }
.tcg-trash { flex-shrink: 0; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 12px; border: 2px solid var(--plum); background: #fff; color: var(--plum); cursor: pointer; transition: transform .25s, background .25s, color .25s; }
.tcg-trash:hover { background: var(--plum); color: var(--lime); transform: rotate(-10deg) scale(1.08); }
.tcg-info-bot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; }

.tcg-price-row { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
.tcg-price { font-family: 'Bricolage Grotesque', sans-serif; font-size: 26px; font-weight: 800; color: #c0127f; line-height: 1; }
.tcg-old { font-size: 14px; color: rgba(42,10,63,.5); text-decoration: line-through; }
.tcg-unit { margin: 0; font-size: 12px; color: rgba(42,10,63,.6); }

.tcg-tag { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 800; border: 2px solid var(--plum); background: var(--pink); color: var(--plum); }
.tcg-tag.lime { background: var(--lime); }

.tcg-qty { display: inline-flex; align-items: center; border: 2px solid var(--plum); border-radius: 14px; overflow: hidden; background: #fff; }
.tcg-qbtn { width: 40px; height: 40px; display: grid; place-items: center; border: 0; background: transparent; color: var(--plum); cursor: pointer; transition: background .2s, transform .2s; }
.tcg-qbtn:hover { background: var(--lime); }
.tcg-qbtn:active { transform: scale(.85); }
.tcg-qnum { min-width: 44px; text-align: center; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 16px; border-inline: 2px solid var(--plum); line-height: 40px; }

.tcg-saving { display: flex; align-items: center; gap: 14px; padding: 14px 20px; background: var(--lime); border: 3px solid var(--plum); border-radius: 20px; box-shadow: 6px 6px 0 var(--plum); font-weight: 600; }
.tcg-saving .ic { width: 40px; height: 40px; border-radius: 12px; background: var(--plum); color: var(--lime); display: grid; place-items: center; flex-shrink: 0; }
.tcg-saving b { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; }

/* aside cards */
.tcg-card { position: relative; background: #fff; border: 3px solid var(--plum); border-radius: 28px; padding: 24px; display: grid; gap: 16px; }
.tcg-card h3 { margin: 0; display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 800; }
.tcg-card h3 .hic { width: 34px; height: 34px; border-radius: 11px; background: var(--plum); color: var(--lime); display: grid; place-items: center; flex-shrink: 0; }
.tcg-card.pop { background: var(--plum); color: #fff; box-shadow: 10px 10px 0 var(--lime); }
.tcg-card.pop h3 .hic { background: var(--lime); color: var(--plum); }

.tcg-promo-row { display: flex; gap: 10px; }
.tcg-input { flex: 1; min-width: 0; font-family: inherit; font-size: 15px; font-weight: 600; text-transform: uppercase; padding: 11px 14px; border-radius: 12px; border: 2px solid var(--plum); background: var(--cream); color: var(--plum); transition: box-shadow .25s, background .25s; }
.tcg-input::placeholder { text-transform: none; font-weight: 500; color: rgba(42,10,63,.45); }
.tcg-input:focus { background: #fff; box-shadow: 4px 4px 0 var(--lime); }
.tcg-applied { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 14px; background: var(--lime); border: 2px solid var(--plum); border-radius: 14px; font-weight: 700; font-size: 14px; }
.tcg-applied span { display: inline-flex; align-items: center; gap: 8px; }
.tcg-linkbtn { border: 0; background: transparent; font-family: inherit; font-weight: 800; font-size: 13px; color: var(--plum); text-decoration: underline; cursor: pointer; }
.tcg-err { margin: 0; font-size: 13px; font-weight: 600; color: #c0127f; }
.tcg-codes { display: flex; flex-wrap: wrap; gap: 8px; }
.tcg-code { font-family: inherit; font-size: 12px; font-weight: 800; padding: 5px 12px; border-radius: 999px; border: 2px dashed var(--plum); background: transparent; color: var(--plum); cursor: pointer; transition: background .2s, transform .2s; }
.tcg-code:hover { background: var(--pink); transform: translateY(-2px) rotate(-2deg); }

.tcg-rows { display: grid; gap: 12px; font-size: 15px; }
.tcg-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: rgba(255,255,255,.82); }
.tcg-row .l { display: inline-flex; align-items: center; gap: 6px; }
.tcg-row.good { color: var(--lime); font-weight: 700; }
.tcg-hint { margin: 0; padding: 10px 14px; border-radius: 14px; background: rgba(255,255,255,.12); border: 1px dashed rgba(255,255,255,.4); font-size: 13px; line-height: 1.5; color: rgba(255,255,255,.9); }
.tcg-hint b { color: var(--lime); }
.tcg-total { display: flex; align-items: baseline; justify-content: space-between; padding-top: 16px; border-top: 2px dashed rgba(255,255,255,.3); }
.tcg-total span:first-child { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 20px; }
.tcg-total .amt { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 34px; color: var(--lime); line-height: 1; }
.tcg-assure { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; font-size: 12px; color: rgba(255,255,255,.75); }
.tcg-assure span { display: inline-flex; align-items: center; gap: 5px; }

.tcg-shop { display: flex; align-items: center; gap: 14px; }
.tcg-shop .ic { width: 46px; height: 46px; border-radius: 50%; background: var(--plum); color: var(--lime); display: grid; place-items: center; flex-shrink: 0; }
.tcg-shop p { margin: 0; }
.tcg-shop .t { font-weight: 800; font-size: 15px; }
.tcg-shop .s { font-size: 12px; color: rgba(42,10,63,.65); }
.tcg-note { margin: 0; font-size: 13px; line-height: 1.65; color: rgba(42,10,63,.75); }

/* ---------- empty state ---------- */
.tcg-empty { position: relative; min-height: 70vh; display: grid; place-items: center; padding: 70px 16px; background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 55%, #fff0fa 100%); background-size: 200% 200%; animation: tcg-gradient-move 14s ease infinite; overflow: hidden; text-align: center; }
.tcg-empty-in { position: relative; z-index: 2; display: grid; justify-items: center; gap: 18px; max-width: 520px; }
.tcg-empty-ic { width: 104px; height: 104px; border-radius: 32px; background: var(--plum); color: var(--lime); border: 3px solid var(--plum); box-shadow: 10px 10px 0 var(--lime); display: grid; place-items: center; transform: rotate(-4deg); animation: tcg-bounce-soft 3.2s ease-in-out infinite; }
.tcg-empty h2 { margin: 6px 0 0; font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; line-height: 1.08; }
.tcg-empty p { margin: 0; font-size: 1.1rem; line-height: 1.7; color: rgba(42,10,63,.8); }

@media (prefers-reduced-motion: reduce) {
  .tcg *, .tcg *::before, .tcg *::after { animation: none !important; transition: none !important; }
  .tcg-reveal { opacity: 1; transform: none; }
}
`

/* ---------- small helpers ---------- */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setShown(true); return }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`tcg-reveal ${shown ? 'in' : ''} ${className}`} style={{ '--d': `${delay}ms` }}>
      {children}
    </div>
  )
}

const PROMO_CODES = { TCG10: 10, GURUKUL15: 15, CRICKET20: 20 }
const FREE_SHIPPING_MIN = 2000
const SHIPPING_FEE = 150
const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function CartPage() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart()
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')

  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const savings = cartItems.reduce(
    (sum, i) => sum + (i.originalPrice ? (i.originalPrice - i.price) * i.quantity : 0),
    0
  )
  const discount = appliedPromo ? Math.round((subtotal * PROMO_CODES[appliedPromo]) / 100) : 0
  const shipping = subtotal > FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE
  const total = subtotal - discount + shipping

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setAppliedPromo(code)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code. Try TCG10, GURUKUL15, or CRICKET20.')
    }
  }

  const removePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    setPromoError('')
  }

  /* ── empty state ── */
  if (cartItems.length === 0) {
    return (
      <Layout>
        <style>{styles}</style>
        <div className="tcg">
          <section className="tcg-empty">
            <div className="tcg-grid" />
            <div className="tcg-blob" style={{ width: 340, height: 340, background: '#fff', opacity: .55, top: -90, left: -90, animation: 'tcg-float-b 12s ease-in-out infinite' }} />
            <div className="tcg-blob" style={{ width: 280, height: 280, background: '#C6FF3D', opacity: .35, bottom: -80, right: '12%', animation: 'tcg-float-b 15s ease-in-out infinite reverse' }} />
            <div className="tcg-ball" style={{ width: 44, height: 44, top: '16%', right: '10%', animation: 'tcg-float 6s ease-in-out infinite' }} />
            <div className="tcg-ball" style={{ width: 26, height: 26, bottom: '14%', left: '8%', animation: 'tcg-float 5s ease-in-out infinite .8s' }} />

            <div className="tcg-empty-in">
              <div className="tcg-empty-ic"><ShoppingBag size={48} /></div>
              <h2>Your cart is empty</h2>
              <p>Nothing here yet. Head to the shop and pick up your gear.</p>
              <Link to="/shop" className="tcg-btn primary">
                <ShoppingCart size={20} />
                Browse Shop
                <ArrowRight size={16} className="arr" />
              </Link>
            </div>
          </section>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <style>{styles}</style>
      <div className="tcg">
        {/* ── Header ── */}
        <section className="tcg-hero">
          <div className="tcg-grid" />
          <div className="tcg-blob" style={{ width: 340, height: 340, background: '#fff', opacity: .55, top: -90, left: -90, animation: 'tcg-float-b 12s ease-in-out infinite' }} />
          <div className="tcg-blob" style={{ width: 280, height: 280, background: '#C6FF3D', opacity: .35, bottom: -90, right: '24%', animation: 'tcg-float-b 15s ease-in-out infinite reverse' }} />
          <div className="tcg-ball" style={{ width: 40, height: 40, top: '18%', right: '8%', animation: 'tcg-float 6s ease-in-out infinite' }} />
          <div className="tcg-ball" style={{ width: 24, height: 24, bottom: '16%', left: '6%', animation: 'tcg-float 5s ease-in-out infinite .8s' }} />

          <div className="tcg-container">
            <div className="tcg-hero-row">
              <div>
                <span className="tcg-chip">
                  <ShoppingCart size={16} />
                  <span>Your Cart</span>
                </span>
                <h1 className="tcg-h1">
                  <span className="tcg-shimmer">Shopping Cart</span>
                  <span className="tcg-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                </h1>
              </div>
              <Link to="/shop" className="tcg-btn outline">
                <ArrowLeft size={18} className="arr-l" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>

        {/* ── Trust strip ── */}
        <div className="tcg-trust">
          <div className="tcg-trust-row">
            <span className="tcg-trust-item"><Truck size={18} /> Free shipping above {inr(FREE_SHIPPING_MIN)}</span>
            <span className="tcg-trust-item"><RotateCcw size={18} /> 7-day easy returns</span>
            <span className="tcg-trust-item"><Shield size={18} /> Secure checkout</span>
            <span className="tcg-trust-item"><Package size={18} /> Ships in 2–3 business days</span>
          </div>
        </div>

        {/* ── Main ── */}
        <section className="tcg-main">
          <div className="tcg-grid" />
          <div className="tcg-blob" style={{ width: 300, height: 300, background: '#fff', opacity: .5, top: 120, right: -90, animation: 'tcg-float-b 13s ease-in-out infinite' }} />
          <div className="tcg-container">
            <div className="tcg-layout">

              {/* Cart items */}
              <div className="tcg-list-col">
                {cartItems.map((item, index) => (
                  <Reveal key={item.id} delay={index * 80}>
                    <article className="tcg-item">
                      <div className="tcg-thumb">
                        <img src={item.img} alt={item.name} />
                        {item.badge && <span className="tcg-tag lime">{item.badge}</span>}
                      </div>

                      <div className="tcg-info">
                        <div className="tcg-info-top">
                          <div>
                            <h3>{item.name}</h3>
                            {item.variant && <p className="tcg-variant">{item.variant}</p>}
                          </div>
                          <button
                            type="button"
                            className="tcg-trash"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="tcg-info-bot">
                          <div>
                            <div className="tcg-price-row">
                              <span className="tcg-price">{inr(item.price * item.quantity)}</span>
                              {item.originalPrice && (
                                <>
                                  <span className="tcg-old">{inr(item.originalPrice * item.quantity)}</span>
                                  <span className="tcg-tag">
                                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                                  </span>
                                </>
                              )}
                            </div>
                            {item.quantity > 1 && (
                              <p className="tcg-unit">{inr(item.price)} × {item.quantity} units</p>
                            )}
                          </div>

                          <div className="tcg-qty">
                            <button type="button" className="tcg-qbtn" onClick={() => decreaseQty(item.id)} aria-label="Decrease quantity">
                              <Minus size={16} />
                            </button>
                            <span className="tcg-qnum" aria-live="polite">{item.quantity}</span>
                            <button type="button" className="tcg-qbtn" onClick={() => increaseQty(item.id)} aria-label="Increase quantity">
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}

                {savings > 0 && (
                  <Reveal>
                    <div className="tcg-saving">
                      <div className="ic"><Zap size={20} /></div>
                      <p style={{ margin: 0 }}>
                        You're saving <b>{inr(savings)}</b> on this order.
                      </p>
                    </div>
                  </Reveal>
                )}
              </div>

              {/* Order summary */}
              <aside className="tcg-aside">
                <Reveal>
                  <div className="tcg-card">
                    <h3><span className="hic"><Tag size={18} /></span> Promo Code</h3>

                    {appliedPromo ? (
                      <div className="tcg-applied">
                        <span><CheckCircle size={18} /> {appliedPromo}: {PROMO_CODES[appliedPromo]}% off</span>
                        <button type="button" className="tcg-linkbtn" onClick={removePromo}>Remove</button>
                      </div>
                    ) : (
                      <div className="tcg-promo-row">
                        <input
                          type="text"
                          className="tcg-input"
                          value={promoInput}
                          onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
                          onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                          placeholder="Enter code"
                          aria-label="Promo code"
                        />
                        <button type="button" className="tcg-btn primary sm" onClick={applyPromo}>Apply</button>
                      </div>
                    )}

                    {promoError && <p className="tcg-err" role="alert">{promoError}</p>}

                    {!appliedPromo && (
                      <div className="tcg-codes">
                        {Object.keys(PROMO_CODES).map((code) => (
                          <button
                            key={code}
                            type="button"
                            className="tcg-code"
                            onClick={() => { setPromoInput(code); setPromoError('') }}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>

                <Reveal delay={120}>
                  <div className="tcg-card pop">
                    <h3><span className="hic"><Star size={18} /></span> Order Summary</h3>

                    <div className="tcg-rows">
                      <div className="tcg-row">
                        <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                        <span>{inr(subtotal)}</span>
                      </div>

                      {savings > 0 && (
                        <div className="tcg-row good">
                          <span>Already saved on products</span>
                          <span>{inr(savings)}</span>
                        </div>
                      )}

                      {discount > 0 && (
                        <div className="tcg-row good">
                          <span>Promo ({appliedPromo})</span>
                          <span>−{inr(discount)}</span>
                        </div>
                      )}

                      <div className="tcg-row">
                        <span className="l"><Truck size={15} /> Shipping</span>
                        {shipping === 0 ? <span style={{ color: 'var(--lime)', fontWeight: 700 }}>Free</span> : <span>{inr(shipping)}</span>}
                      </div>

                      {shipping > 0 && (
                        <p className="tcg-hint">
                          Add <b>{inr(FREE_SHIPPING_MIN - subtotal + 1)}</b> more to get <b>free shipping</b>.
                        </p>
                      )}
                    </div>

                    <div className="tcg-total">
                      <span>Total</span>
                      <span className="amt">{inr(total)}</span>
                    </div>

                    <Link to="/checkout" className="tcg-btn lime block">
                      <Shield size={20} />
                      Proceed to Checkout
                      <ArrowRight size={16} className="arr" />
                    </Link>

                    <div className="tcg-assure">
                      <span><Shield size={13} /> Secure pay</span>
                      <span><RotateCcw size={13} /> Easy returns</span>
                      <span><Gift size={13} /> Gift wrap available</span>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <div className="tcg-card">
                    <div className="tcg-shop">
                      <div className="ic"><Star size={20} /></div>
                      <div>
                        <p className="t">Tikone Cricket Gurukul Shop</p>
                        <p className="s">Official gear and merchandise</p>
                      </div>
                    </div>
                    <p className="tcg-note">
                      Every product is quality-checked by our coaches and sourced from trusted cricket equipment makers.
                    </p>
                  </div>
                </Reveal>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
