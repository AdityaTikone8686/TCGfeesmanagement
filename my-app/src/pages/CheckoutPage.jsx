import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Truck, RotateCcw, ArrowLeft, ArrowRight,
  CheckCircle, CreditCard, Smartphone, Building2, Wallet,
  MapPin, User, Phone, Mail, Home, Star, Lock,
  Package, ChevronDown, ChevronUp, Edit2, Zap
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useCart } from '../context/CartContext'

/* ------------------------------------------------------------------
   THEME  (same tokens as the landing page and cart)
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
@keyframes tcg-step-in { 0% { opacity: 0; transform: translateY(24px) } 100% { opacity: 1; transform: none } }
@keyframes tcg-wiggle { 0%,100% { transform: rotate(-4deg) } 50% { transform: rotate(4deg) } }
@keyframes tcg-gradient-move { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
@keyframes tcg-underline { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes tcg-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(198,255,61,.65) } 100% { box-shadow: 0 0 0 22px rgba(198,255,61,0) } }

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
.tcg-chip.lime { background: var(--lime); color: var(--plum); border: 2px solid var(--plum); }

.tcg-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 26px; border-radius: 16px; font-family: inherit; font-weight: 700; font-size: 15px; text-decoration: none; border: 2px solid var(--plum); transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s, background .25s, color .25s; cursor: pointer; }
.tcg-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.55), transparent); transform: skewX(-20deg); transition: left .7s; }
.tcg-btn:hover::before { left: 140%; }
.tcg-btn:hover { transform: translateY(-4px) rotate(-1deg); box-shadow: 6px 6px 0 var(--plum); }
.tcg-btn:active { transform: translateY(0); box-shadow: 0 0 0 var(--plum); }
.tcg-btn:focus-visible, .tcg-field:focus-visible, .tcg-method:focus-visible, .tcg-step-dot:focus-visible, .tcg-linkbtn:focus-visible, .tcg-sumtoggle:focus-visible { outline: 3px solid var(--plum); outline-offset: 3px; }
.tcg-btn.primary { background: var(--plum); color: #fff; }
.tcg-btn.primary:hover { background: var(--plum-2); }
.tcg-btn.outline { background: #fff; color: var(--plum); }
.tcg-btn.outline:hover { background: var(--lime); }
.tcg-btn.lime { background: var(--lime); color: var(--plum); }
.tcg-btn.lime:hover { box-shadow: 6px 6px 0 var(--pink); }
.tcg-btn:disabled { opacity: .45; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
.tcg-btn:disabled::before { display: none; }
.tcg-btn .arr { transition: transform .25s; }
.tcg-btn:hover:not(:disabled) .arr { transform: translateX(5px); }
.tcg-btn .arr-l { transition: transform .25s; }
.tcg-btn:hover:not(:disabled) .arr-l { transform: translateX(-5px); }

/* ---------- header ---------- */
.tcg-hero { position: relative; padding: 44px 0 78px; background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 55%, #fff0fa 100%); background-size: 200% 200%; animation: tcg-gradient-move 14s ease infinite; overflow: hidden; }
@media (min-width: 1024px) { .tcg-hero { padding: 60px 0 92px; } }
.tcg-hero-row { display: flex; flex-direction: column; gap: 22px; }
@media (min-width: 640px) { .tcg-hero-row { flex-direction: row; align-items: flex-end; justify-content: space-between; } }
.tcg-h1 { font-size: clamp(2.2rem, 6vw, 4rem); font-weight: 800; line-height: 1.04; margin: 16px 0 0; color: var(--plum); animation: tcg-pop-in .8s .1s both; }
.tcg-shimmer { display: inline-block; background: linear-gradient(90deg, var(--plum) 0%, #b0108a 25%, var(--plum-2) 50%, #b0108a 75%, var(--plum) 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcg-shimmer 5s linear infinite; position: relative; }
.tcg-shimmer::after { content: ''; position: absolute; left: 0; right: 0; bottom: 2px; height: 10px; background: var(--lime); z-index: -1; border-radius: 6px; transform-origin: left; animation: tcg-underline 1.2s .8s both cubic-bezier(.2,.8,.2,1); }
@media (max-width: 639px) { .tcg-hero-row .tcg-btn { width: 100%; } }

/* stepper */
.tcg-stepper { display: flex; align-items: center; max-width: 440px; margin-top: 30px; animation: tcg-pop-in .8s .3s both; }
.tcg-step { display: flex; align-items: center; gap: 10px; }
.tcg-step-dot { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 15px; border: 3px solid var(--plum); background: #fff; color: var(--plum); cursor: default; transition: transform .3s, background .3s, box-shadow .3s; flex-shrink: 0; }
.tcg-step-dot.done { background: var(--plum); color: var(--lime); cursor: pointer; }
.tcg-step-dot.done:hover { transform: rotate(-12deg) scale(1.1); background: var(--plum-2); }
.tcg-step-dot.now { background: var(--lime); box-shadow: 4px 4px 0 var(--plum); animation: tcg-pulse-ring 1.8s infinite; }
.tcg-step-label { font-weight: 700; font-size: 14px; display: none; }
.tcg-step-label.now { color: var(--plum); }
.tcg-step-label.off { color: rgba(42,10,63,.55); }
@media (min-width: 640px) { .tcg-step-label { display: block; } }
.tcg-step-line { flex: 1; min-width: 20px; height: 0; margin: 0 10px; border-top: 3px dashed rgba(42,10,63,.3); transition: border-color .4s; }
.tcg-step-line.done { border-top: 3px solid var(--plum); }

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
.tcg-aside { display: grid; gap: 22px; }
.tcg-steps { display: grid; gap: 22px; }
.tcg-pane { animation: tcg-step-in .6s cubic-bezier(.2,.8,.2,1) both; }

.tcg-card { position: relative; background: #fff; border: 3px solid var(--plum); border-radius: 28px; padding: 26px; display: grid; gap: 20px; }
@media (min-width: 640px) { .tcg-card { padding: 32px; } }
.tcg-card.pop { background: var(--plum); color: #fff; box-shadow: 10px 10px 0 var(--lime); }
.tcg-card.flat { gap: 14px; }
.tcg-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.tcg-card-title { display: flex; align-items: center; gap: 14px; }
.tcg-card-title .hic { width: 46px; height: 46px; border-radius: 15px; background: var(--plum); color: var(--lime); display: grid; place-items: center; flex-shrink: 0; transition: transform .5s cubic-bezier(.3,1.6,.5,1); }
.tcg-card:hover .tcg-card-title .hic { transform: rotate(-10deg) scale(1.06); }
.tcg-card.pop .hic { background: var(--lime); color: var(--plum); }
.tcg-card-title h2, .tcg-card-title h3 { margin: 0; font-size: 22px; font-weight: 800; line-height: 1.15; }
.tcg-card-title h3 { font-size: 18px; }
.tcg-card-title p { margin: 3px 0 0; font-size: 13px; color: rgba(42,10,63,.65); }
.tcg-card.pop .tcg-card-title p { color: rgba(255,255,255,.7); }

/* form */
.tcg-form { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.tcg-col-2 { grid-column: span 2; }
.tcg-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 700; }
.tcg-label i { font-style: normal; color: #c0127f; }
.tcg-fwrap { position: relative; }
.tcg-fwrap > svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--plum-2); pointer-events: none; }
.tcg-field { width: 100%; font-family: inherit; font-size: 15px; font-weight: 500; padding: 12px 14px; border-radius: 14px; border: 2px solid var(--plum); background: var(--cream); color: var(--plum); transition: box-shadow .25s, background .25s, transform .25s; appearance: none; -webkit-appearance: none; }
.tcg-field.ic { padding-left: 42px; }
.tcg-field::placeholder { color: rgba(42,10,63,.4); }
.tcg-field:focus { outline: none; background: #fff; box-shadow: 5px 5px 0 var(--lime); transform: translate(-1px,-1px); }
select.tcg-field { padding-right: 40px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232A0A3F' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; }

.tcg-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-top: 6px; }
.tcg-actions.end { justify-content: flex-end; }
@media (max-width: 639px) { .tcg-actions .tcg-btn { width: 100%; } }

/* payment methods */
.tcg-methods { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 640px) { .tcg-methods { grid-template-columns: repeat(2, 1fr); } }
.tcg-method { display: flex; align-items: center; gap: 14px; padding: 16px; text-align: left; font-family: inherit; color: var(--plum); background: #fff; border: 3px solid var(--plum); border-radius: 20px; cursor: pointer; transition: transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s, background .3s; }
.tcg-method:hover { transform: translateY(-4px) rotate(-.8deg); box-shadow: 6px 6px 0 var(--plum); }
.tcg-method.on { background: var(--lime); box-shadow: 6px 6px 0 var(--plum); }
.tcg-method .mic { width: 44px; height: 44px; border-radius: 14px; background: var(--pink-soft); border: 2px solid var(--plum); display: grid; place-items: center; flex-shrink: 0; transition: background .25s, color .25s; }
.tcg-method.on .mic { background: var(--plum); color: var(--lime); }
.tcg-method b { display: block; font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 800; }
.tcg-method small { display: block; margin-top: 2px; font-size: 12px; color: rgba(42,10,63,.7); }
.tcg-method .chk { margin-left: auto; flex-shrink: 0; }

.tcg-cod { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; background: var(--pink-soft); border: 2px dashed var(--plum); border-radius: 16px; font-size: 14px; line-height: 1.6; }
.tcg-cod svg { flex-shrink: 0; margin-top: 2px; }

/* review */
.tcg-review-body { padding-left: 60px; font-size: 14px; line-height: 1.7; color: rgba(42,10,63,.78); }
.tcg-review-body b { color: var(--plum); font-weight: 700; }
@media (max-width: 479px) { .tcg-review-body { padding-left: 0; } }
.tcg-linkbtn { display: inline-flex; align-items: center; gap: 6px; border: 2px solid var(--plum); background: #fff; border-radius: 999px; padding: 6px 14px; font-family: inherit; font-weight: 800; font-size: 13px; color: var(--plum); cursor: pointer; transition: background .2s, transform .2s; }
.tcg-linkbtn:hover { background: var(--lime); transform: translateY(-2px) rotate(-2deg); }

.tcg-oitems { display: grid; gap: 14px; }
.tcg-oitem { display: flex; align-items: center; gap: 14px; }
.tcg-oimg { width: 58px; height: 58px; border-radius: 16px; border: 2px solid var(--plum); overflow: hidden; flex-shrink: 0; background: var(--pink-soft); }
.tcg-oimg img { display: block; width: 100%; height: 100%; object-fit: cover; }
.tcg-oimg.sm { width: 48px; height: 48px; border-radius: 13px; border-color: rgba(255,255,255,.7); }
.tcg-oinfo { flex: 1; min-width: 0; }
.tcg-oinfo p { margin: 0; }
.tcg-oname { font-weight: 700; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tcg-oqty { margin-top: 2px !important; font-size: 12px; color: rgba(42,10,63,.6); }
.tcg-card.pop .tcg-oqty { color: rgba(255,255,255,.65); }
.tcg-oprice { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 17px; color: #c0127f; flex-shrink: 0; }
.tcg-card.pop .tcg-oprice { color: var(--lime); font-size: 15px; }
.tcg-card.pop .tcg-oname { font-size: 14px; }

/* summary */
.tcg-sumtoggle { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; border: 0; background: transparent; padding: 0; font-family: inherit; color: inherit; cursor: default; text-align: left; }
.tcg-sumtoggle .chev { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--lime); color: var(--plum); }
@media (min-width: 640px) { .tcg-sumtoggle .chev { display: none; } }
@media (max-width: 639px) { .tcg-sumtoggle { cursor: pointer; } }
.tcg-sumbody { display: grid; gap: 16px; }
.tcg-sumbody.closed { display: none; }
@media (min-width: 640px) { .tcg-sumbody.closed { display: grid; } }
.tcg-rows { display: grid; gap: 12px; font-size: 15px; padding-top: 16px; border-top: 2px dashed rgba(255,255,255,.3); }
.tcg-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: rgba(255,255,255,.82); }
.tcg-row .l { display: inline-flex; align-items: center; gap: 6px; }
.tcg-row.good { color: var(--lime); font-weight: 700; }
.tcg-total { display: flex; align-items: baseline; justify-content: space-between; padding-top: 16px; border-top: 2px dashed rgba(255,255,255,.3); }
.tcg-total span:first-child { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 20px; }
.tcg-total .amt { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 34px; color: var(--lime); line-height: 1; }

.tcg-shop { display: flex; align-items: center; gap: 14px; }
.tcg-shop .ic { width: 46px; height: 46px; border-radius: 50%; background: var(--plum); color: var(--lime); display: grid; place-items: center; flex-shrink: 0; }
.tcg-shop p { margin: 0; }
.tcg-shop .t { font-weight: 800; font-size: 15px; }
.tcg-shop .s { font-size: 12px; color: rgba(42,10,63,.65); }
.tcg-note { margin: 0; font-size: 13px; line-height: 1.65; color: rgba(42,10,63,.75); }
.tcg-assure { display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: 12px; font-weight: 600; color: rgba(42,10,63,.75); }
.tcg-assure span { display: inline-flex; align-items: center; gap: 5px; }

/* ---------- success ---------- */
.tcg-done { position: relative; min-height: 78vh; display: grid; place-items: center; padding: 70px 16px; background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 55%, #fff0fa 100%); background-size: 200% 200%; animation: tcg-gradient-move 14s ease infinite; overflow: hidden; text-align: center; }
.tcg-done-in { position: relative; z-index: 2; display: grid; justify-items: center; gap: 18px; width: 100%; max-width: 520px; }
.tcg-done-ic { width: 104px; height: 104px; border-radius: 32px; background: var(--plum); color: var(--lime); border: 3px solid var(--plum); box-shadow: 10px 10px 0 var(--lime); display: grid; place-items: center; transform: rotate(-4deg); animation: tcg-bounce-soft 3.2s ease-in-out infinite; }
.tcg-done h2 { margin: 4px 0 0; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800; line-height: 1.08; }
.tcg-done p.lead { margin: 0; font-size: 1.08rem; line-height: 1.7; color: rgba(42,10,63,.82); }
.tcg-receipt { width: 100%; text-align: left; display: grid; gap: 12px; padding: 22px 24px; background: #fff; border: 3px solid var(--plum); border-radius: 24px; box-shadow: 8px 8px 0 var(--plum); font-size: 15px; }
.tcg-receipt div { display: flex; justify-content: space-between; gap: 12px; }
.tcg-receipt span:first-child { color: rgba(42,10,63,.65); }
.tcg-receipt b { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; }
.tcg-receipt .tot { padding-top: 12px; border-top: 2px dashed rgba(42,10,63,.25); }
.tcg-receipt .tot b { font-size: 22px; color: #c0127f; }
.tcg-done-actions { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; padding-top: 6px; }
@media (max-width: 639px) { .tcg-done-actions { width: 100%; } .tcg-done-actions .tcg-btn { width: 100%; } }

@media (prefers-reduced-motion: reduce) {
  .tcg *, .tcg *::before, .tcg *::after { animation: none !important; transition: none !important; }
  .tcg-reveal { opacity: 1; transform: none; }
}
`

const STEPS = ['Delivery', 'Payment', 'Review']

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'GPay, PhonePe, Paytm & more' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks supported' },
  { id: 'cod', label: 'Cash on Delivery', icon: Wallet, desc: 'Pay when you receive' },
]

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda']

/* prices may arrive as numbers or strings like "₹1,299" */
const toNum = (v) => Number(String(v ?? 0).replace(/[^0-9.]/g, '')) || 0
const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

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

function Field({ label, id, type = 'text', placeholder, value, onChange, required, icon: Icon, half, maxLength }) {
  return (
    <div className={half ? '' : 'tcg-col-2'}>
      <label htmlFor={id} className="tcg-label">
        {label} {required && <i>*</i>}
      </label>
      <div className="tcg-fwrap">
        {Icon && <Icon size={17} />}
        <input
          id={id}
          type={type}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`tcg-field ${Icon ? 'ic' : ''}`}
        />
      </div>
    </div>
  )
}

function Decor({ variant = 'hero' }) {
  return (
    <>
      <div className="tcg-grid" />
      <div className="tcg-blob" style={{ width: 340, height: 340, background: '#fff', opacity: .55, top: -90, left: -90, animation: 'tcg-float-b 12s ease-in-out infinite' }} />
      <div className="tcg-blob" style={{ width: 280, height: 280, background: '#C6FF3D', opacity: .35, bottom: -90, right: '24%', animation: 'tcg-float-b 15s ease-in-out infinite reverse' }} />
      <div className="tcg-ball" style={{ width: 40, height: 40, top: '16%', right: '8%', animation: 'tcg-float 6s ease-in-out infinite' }} />
      <div className="tcg-ball" style={{ width: 24, height: 24, bottom: '14%', left: '6%', animation: 'tcg-float 5s ease-in-out infinite .8s' }} />
    </>
  )
}

export default function CheckoutPage() {
  const { cartItems, setCartItems } = useCart()
  const [step, setStep] = useState(0) // 0 = Delivery, 1 = Payment, 2 = Review
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [payMethod, setPayMethod] = useState('upi')
  const [orderId] = useState(() => `#TCG-${Math.floor(100000 + Math.random() * 900000)}`)
  const [paidTotal, setPaidTotal] = useState(0)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
    upiId: '', cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '',
    bank: '',
  })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  /* ── Totals ── */
  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0)
  const subtotal = cartItems.reduce((s, i) => s + toNum(i.price) * i.quantity, 0)
  const savings = cartItems.reduce((s, i) => {
    const mrp = toNum(i.originalPrice ?? i.mrp)
    return s + (mrp ? (mrp - toNum(i.price)) * i.quantity : 0)
  }, 0)
  const discount = 360 // assume promo already applied from CartPage
  const shipping = subtotal > 2000 ? 0 : 150
  const total = subtotal - discount + shipping

  /* ── Step nav ── */
  const canNext = () => {
    if (step === 0) {
      return form.firstName && form.lastName && form.email && form.phone &&
             form.address && form.city && form.state && form.pincode
    }
    if (step === 1) {
      if (payMethod === 'upi') return form.upiId.trim() !== ''
      if (payMethod === 'card') return form.cardNumber && form.cardName && form.cardExpiry && form.cardCvv
      if (payMethod === 'netbanking') return form.bank !== ''
      return true
    }
    return true
  }

  const next = () => { if (step < 2 && canNext()) setStep((s) => s + 1) }
  const back = () => { if (step > 0) setStep((s) => s - 1) }

  const placeOrder = () => {
    setPaidTotal(total)
    setOrderPlaced(true)
    setCartItems([])
    try { localStorage.removeItem('cartItems') } catch (e) { /* storage unavailable */ }
  }

  /* ── Success screen ── */
  if (orderPlaced) {
    return (
      <Layout>
        <style>{styles}</style>
        <div className="tcg">
          <section className="tcg-done">
            <Decor />
            <div className="tcg-done-in">
              <div className="tcg-done-ic"><CheckCircle size={52} /></div>
              <span className="tcg-chip"><Zap size={16} /> Order Confirmed</span>
              <h2>Thank you, {form.firstName || 'Champion'}!</h2>
              <p className="lead">
                Your order is placed. A confirmation is on its way to <b>{form.email || 'your email'}</b>.
                Gear up and get ready to play.
              </p>
              <div className="tcg-receipt">
                <div><span>Order ID</span><b>{orderId}</b></div>
                <div><span>Estimated delivery</span><b>3–5 business days</b></div>
                <div className="tot"><span>Total paid</span><b>{inr(paidTotal)}</b></div>
              </div>
              <div className="tcg-done-actions">
                <Link to="/shop" className="tcg-btn primary">
                  Continue Shopping
                  <ArrowRight size={16} className="arr" />
                </Link>
                <Link to="/student/dashboard" className="tcg-btn outline">My Orders</Link>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    )
  }

  const method = PAYMENT_METHODS.find((m) => m.id === payMethod)

  return (
    <Layout>
      <style>{styles}</style>
      <div className="tcg">
        {/* ── Header ── */}
        <section className="tcg-hero">
          <Decor />
          <div className="tcg-container">
            <div className="tcg-hero-row">
              <div>
                <span className="tcg-chip"><Lock size={16} /> Secure Checkout</span>
                <h1 className="tcg-h1"><span className="tcg-shimmer">Checkout</span></h1>
              </div>
              <Link to="/cart" className="tcg-btn outline">
                <ArrowLeft size={18} className="arr-l" />
                Back to Cart
              </Link>
            </div>

            {/* Stepper */}
            <div className="tcg-stepper" role="list" aria-label="Checkout progress">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="tcg-step" role="listitem" aria-current={i === step ? 'step' : undefined}>
                    <button
                      type="button"
                      onClick={() => i < step && setStep(i)}
                      className={`tcg-step-dot ${i < step ? 'done' : i === step ? 'now' : ''}`}
                      aria-label={i < step ? `Go back to ${s}` : s}
                    >
                      {i < step ? <CheckCircle size={18} /> : i + 1}
                    </button>
                    <span className={`tcg-step-label ${i === step ? 'now' : 'off'}`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`tcg-step-line ${i < step ? 'done' : ''}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust strip ── */}
        <div className="tcg-trust">
          <div className="tcg-trust-row">
            <span className="tcg-trust-item"><Lock size={18} /> 256-bit SSL encryption</span>
            <span className="tcg-trust-item"><ShieldCheck size={18} /> 100% secure payment</span>
            <span className="tcg-trust-item"><Truck size={18} /> Free shipping above ₹2,000</span>
            <span className="tcg-trust-item"><RotateCcw size={18} /> 7-day returns</span>
          </div>
        </div>

        {/* ── Main ── */}
        <section className="tcg-main">
          <div className="tcg-grid" />
          <div className="tcg-blob" style={{ width: 300, height: 300, background: '#fff', opacity: .5, top: 120, right: -90, animation: 'tcg-float-b 13s ease-in-out infinite' }} />
          <div className="tcg-container">
            <div className="tcg-layout">

              {/* ── Left: steps ── */}
              <div className="tcg-steps">

                {/* STEP 0: Delivery */}
                {step === 0 && (
                  <div className="tcg-card tcg-pane" key="step-0">
                    <div className="tcg-card-title">
                      <div className="hic"><MapPin size={22} /></div>
                      <div>
                        <h2>Delivery Address</h2>
                        <p>Where should we deliver your order?</p>
                      </div>
                    </div>

                    <div className="tcg-form">
                      <Field label="First Name" id="fn" placeholder="Rohit" value={form.firstName} onChange={set('firstName')} required icon={User} half />
                      <Field label="Last Name" id="ln" placeholder="Sharma" value={form.lastName} onChange={set('lastName')} required icon={User} half />
                      <Field label="Email Address" id="email" type="email" placeholder="rohit@example.com" value={form.email} onChange={set('email')} required icon={Mail} />
                      <Field label="Phone Number" id="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} required icon={Phone} />
                      <Field label="Street Address" id="addr" placeholder="Flat / Building, Street Name" value={form.address} onChange={set('address')} required icon={Home} />
                      <Field label="City" id="city" placeholder="Pune" value={form.city} onChange={set('city')} required half icon={MapPin} />
                      <Field label="State" id="state" placeholder="Maharashtra" value={form.state} onChange={set('state')} required half />
                      <Field label="PIN Code" id="pin" placeholder="411033" value={form.pincode} onChange={set('pincode')} required half maxLength={6} />
                    </div>

                    <div className="tcg-actions end">
                      <button type="button" className="tcg-btn primary" onClick={next} disabled={!canNext()}>
                        Continue to Payment
                        <ArrowRight size={16} className="arr" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 1: Payment */}
                {step === 1 && (
                  <div className="tcg-card tcg-pane" key="step-1">
                    <div className="tcg-card-title">
                      <div className="hic"><CreditCard size={22} /></div>
                      <div>
                        <h2>Payment Method</h2>
                        <p>Choose how you'd like to pay</p>
                      </div>
                    </div>

                    <div className="tcg-methods" role="radiogroup" aria-label="Payment method">
                      {PAYMENT_METHODS.map((m) => {
                        const Icon = m.icon
                        const active = payMethod === m.id
                        return (
                          <button
                            key={m.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setPayMethod(m.id)}
                            className={`tcg-method ${active ? 'on' : ''}`}
                          >
                            <span className="mic"><Icon size={20} /></span>
                            <span>
                              <b>{m.label}</b>
                              <small>{m.desc}</small>
                            </span>
                            {active && <CheckCircle size={20} className="chk" />}
                          </button>
                        )
                      })}
                    </div>

                    <div className="tcg-form">
                      {payMethod === 'upi' && (
                        <Field label="UPI ID" id="upi" placeholder="yourname@upi" value={form.upiId} onChange={set('upiId')} required icon={Smartphone} />
                      )}

                      {payMethod === 'card' && (
                        <>
                          <Field label="Card Number" id="cn" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={set('cardNumber')} required icon={CreditCard} maxLength={19} />
                          <Field label="Name on Card" id="cname" placeholder="Rohit Sharma" value={form.cardName} onChange={set('cardName')} required />
                          <Field label="Expiry" id="cexp" placeholder="MM/YY" value={form.cardExpiry} onChange={set('cardExpiry')} required half maxLength={5} />
                          <Field label="CVV" id="cvv" type="password" placeholder="•••" value={form.cardCvv} onChange={set('cardCvv')} required half maxLength={4} />
                        </>
                      )}

                      {payMethod === 'netbanking' && (
                        <div className="tcg-col-2">
                          <label htmlFor="bank" className="tcg-label">Select Bank <i>*</i></label>
                          <select id="bank" value={form.bank} onChange={set('bank')} className="tcg-field">
                            <option value="">Choose your bank</option>
                            {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                      )}

                      {payMethod === 'cod' && (
                        <div className="tcg-col-2 tcg-cod">
                          <Wallet size={20} />
                          <p style={{ margin: 0 }}>
                            Pay in cash when your order arrives. Please keep exact change ready. A ₹50 COD handling fee may apply.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="tcg-actions">
                      <button type="button" className="tcg-btn outline" onClick={back}>
                        <ArrowLeft size={16} className="arr-l" />
                        Back
                      </button>
                      <button type="button" className="tcg-btn primary" onClick={next} disabled={!canNext()}>
                        Review Order
                        <ArrowRight size={16} className="arr" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Review */}
                {step === 2 && (
                  <div className="tcg-steps tcg-pane" key="step-2">
                    <div className="tcg-card flat">
                      <div className="tcg-card-head">
                        <div className="tcg-card-title">
                          <div className="hic" style={{ width: 40, height: 40, borderRadius: 13 }}><MapPin size={18} /></div>
                          <h3>Delivery Address</h3>
                        </div>
                        <button type="button" className="tcg-linkbtn" onClick={() => setStep(0)}>
                          <Edit2 size={13} /> Edit
                        </button>
                      </div>
                      <div className="tcg-review-body">
                        <b>{form.firstName} {form.lastName}</b><br />
                        {form.address}<br />
                        {form.city}, {form.state} {form.pincode}<br />
                        {form.phone} · {form.email}
                      </div>
                    </div>

                    <div className="tcg-card flat">
                      <div className="tcg-card-head">
                        <div className="tcg-card-title">
                          <div className="hic" style={{ width: 40, height: 40, borderRadius: 13 }}><CreditCard size={18} /></div>
                          <h3>Payment Method</h3>
                        </div>
                        <button type="button" className="tcg-linkbtn" onClick={() => setStep(1)}>
                          <Edit2 size={13} /> Edit
                        </button>
                      </div>
                      <div className="tcg-review-body">
                        <b>{method?.label}</b>
                        {payMethod === 'upi' && form.upiId && <> ({form.upiId})</>}
                        {payMethod === 'card' && form.cardNumber && <> ending {form.cardNumber.slice(-4)}</>}
                        {payMethod === 'netbanking' && form.bank && <> · {form.bank}</>}
                      </div>
                    </div>

                    <div className="tcg-card flat">
                      <div className="tcg-card-title">
                        <div className="hic" style={{ width: 40, height: 40, borderRadius: 13 }}><Package size={18} /></div>
                        <h3>Order Items ({itemCount})</h3>
                      </div>
                      <div className="tcg-oitems">
                        {cartItems.map((item) => (
                          <div key={item.id} className="tcg-oitem">
                            <div className="tcg-oimg"><img src={item.img} alt={item.name} /></div>
                            <div className="tcg-oinfo">
                              <p className="tcg-oname">{item.name}</p>
                              <p className="tcg-oqty">Qty {item.quantity}</p>
                            </div>
                            <span className="tcg-oprice">{inr(toNum(item.price) * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="tcg-actions">
                      <button type="button" className="tcg-btn outline" onClick={back}>
                        <ArrowLeft size={16} className="arr-l" />
                        Back
                      </button>
                      <button type="button" className="tcg-btn primary" onClick={placeOrder}>
                        <ShieldCheck size={20} />
                        Place Order: {inr(total)}
                        <ArrowRight size={16} className="arr" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right: order summary ── */}
              <aside className="tcg-aside">
                <Reveal>
                  <div className="tcg-card pop">
                    <button
                      type="button"
                      className="tcg-sumtoggle"
                      onClick={() => setSummaryOpen((o) => !o)}
                      aria-expanded={summaryOpen}
                    >
                      <span className="tcg-card-title">
                        <span className="hic" style={{ width: 40, height: 40, borderRadius: 13 }}><Star size={18} /></span>
                        <h3>Order Summary</h3>
                      </span>
                      <span className="chev">{summaryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
                    </button>

                    <div className={`tcg-sumbody ${summaryOpen ? '' : 'closed'}`}>
                      <div className="tcg-oitems">
                        {cartItems.map((item) => (
                          <div key={item.id} className="tcg-oitem">
                            <div className="tcg-oimg sm"><img src={item.img} alt={item.name} /></div>
                            <div className="tcg-oinfo">
                              <p className="tcg-oname">{item.name}</p>
                              <p className="tcg-oqty">Qty {item.quantity}</p>
                            </div>
                            <span className="tcg-oprice">{inr(toNum(item.price) * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="tcg-rows">
                        <div className="tcg-row"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
                        {savings > 0 && (
                          <div className="tcg-row good"><span>Already saved on products</span><span>{inr(savings)}</span></div>
                        )}
                        <div className="tcg-row good"><span>Promo (TCG10)</span><span>−{inr(discount)}</span></div>
                        <div className="tcg-row">
                          <span className="l"><Truck size={15} /> Shipping</span>
                          {shipping === 0
                            ? <span style={{ color: 'var(--lime)', fontWeight: 700 }}>Free</span>
                            : <span>{inr(shipping)}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="tcg-total">
                      <span>Total</span>
                      <span className="amt">{inr(total)}</span>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={120}>
                  <div className="tcg-card flat">
                    <div className="tcg-shop">
                      <div className="ic"><Star size={20} /></div>
                      <div>
                        <p className="t">Tikone Cricket Gurukul</p>
                        <p className="s">Official gear and merchandise</p>
                      </div>
                    </div>
                    <p className="tcg-note">
                      Every product is coach-verified and sourced from trusted cricket equipment makers.
                    </p>
                    <div className="tcg-assure">
                      <span><Lock size={13} /> SSL secured</span>
                      <span><RotateCcw size={13} /> Easy returns</span>
                      <span><ShieldCheck size={13} /> Verified</span>
                    </div>
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
