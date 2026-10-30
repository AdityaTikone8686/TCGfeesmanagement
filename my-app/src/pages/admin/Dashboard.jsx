import React, { useState, useEffect } from 'react'
import Registrations from "./Registrations";
import { useAuth } from '../../context/AuthContext'
import {
  adminAPI,
  paymentsAPI,
  feePlansAPI,
  subscriptionsAPI,
  reportsAPI,
  paymentRequestAPI,
  registrationAdminAPI
} from '../../services/api'

import {
  Users, CreditCard, Book, Settings, LogOut, Trash2, DollarSign, Award, Menu, X, Plus, Edit, Eye,
  CalendarCheck, CheckCircle, Star, History, BarChart3, ClipboardList, Search, AlertCircle, Check
} from 'lucide-react'

/* ------------------------------------------------------------------
   THEME (same as LandingPage / AdminLogin)
   Pink #FFA8E0 · Plum #2A0A3F · Lime #C6FF3D · Cream #FFF6FC
   Fonts: Bricolage Grotesque (headings) + DM Sans (body)
------------------------------------------------------------------- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.td {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D; --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum);
  min-height: 100vh; display: flex; background: var(--cream); position: relative; overflow-x: hidden;
}
.td * { box-sizing: border-box; }
.td h1, .td h2, .td h3, .td .td-display { font-family: 'Bricolage Grotesque', 'DM Sans', sans-serif; letter-spacing: -0.02em; }

@keyframes td-float-b { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(30px,-26px) scale(1.12) } }
@keyframes td-float { 0%,100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-18px) rotate(6deg) } }
@keyframes td-pop-in { 0% { opacity: 0; transform: scale(.94) translateY(16px) } 100% { opacity: 1; transform: none } }
@keyframes td-spin { to { transform: rotate(360deg) } }

/* background */
.td-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: linear-gradient(135deg, #fff0fa 0%, var(--cream) 50%, var(--pink-soft) 100%); }
.td-bg::before { content: ''; position: absolute; inset: 0; opacity: .5;
  background-image: linear-gradient(rgba(42,10,63,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(42,10,63,.06) 1px, transparent 1px);
  background-size: 44px 44px; -webkit-mask-image: radial-gradient(circle at 60% 30%, #000 10%, transparent 70%); mask-image: radial-gradient(circle at 60% 30%, #000 10%, transparent 70%); }
.td-blob { position: absolute; border-radius: 50%; filter: blur(70px); }
.td-ball { position: absolute; border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%);
  box-shadow: inset -5px -7px 12px rgba(0,0,0,.25), 0 10px 20px rgba(42,10,63,.2); }
.td-ball::after { content: ''; position: absolute; inset: 8% 45% 8% 45%; border-left: 2px dashed rgba(255,255,255,.7); border-right: 2px dashed rgba(255,255,255,.7); border-radius: 50%; }

/* sidebar */
.td-side { position: fixed; z-index: 40; inset: 0 auto 0 0; width: 272px; display: flex; flex-direction: column; background: var(--plum); color: #fff; border-right: 3px solid var(--plum); transform: translateX(-100%); transition: transform .3s cubic-bezier(.2,.8,.2,1); overflow-y: auto; }
.td-side.open { transform: none; }
.td-scrim { position: fixed; inset: 0; z-index: 35; background: rgba(42,10,63,.55); backdrop-filter: blur(3px); }
@media (min-width: 768px) {
  .td-side {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 272px;
    height: 100vh;
    transform: none;
    flex-shrink: 0;
  }

  .td-main {
    margin-left: 272px;
  }

  .td-scrim,
  .td-burger {
    display: none;
  }
}
.td-brand { display: flex; align-items: center; gap: 12px; padding: 20px 18px; border-bottom: 2px dashed rgba(255,255,255,.2); }
.td-logo { flex-shrink: 0; width: 56px; height: 56px; border-radius: 16px; background: #fff; border: 3px solid var(--lime); overflow: hidden; transform: rotate(-3deg); }
.td-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
.td-brand b { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 17px; line-height: 1.1; }
.td-close { margin-left: auto; background: transparent; border: 0; color: #fff; cursor: pointer; padding: 6px; border-radius: 10px; }
@media (min-width: 768px) { .td-close { display: none; } }
.td-me { margin: 18px 14px 6px; padding: 16px; text-align: center; border-radius: 20px; background: rgba(255,255,255,.08); border: 2px solid rgba(255,255,255,.18); }
.td-avatar { width: 52px; height: 52px; margin: 0 auto 10px; border-radius: 50%; display: grid; place-items: center; background: var(--pink); color: var(--plum); font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 22px; border: 3px solid var(--lime); }
.td-me p { margin: 0; font-weight: 700; }
.td-me small { display: block; margin: 2px 0 10px; color: rgba(255,255,255,.65); font-size: 12px; word-break: break-all; }
.td-nav { flex: 1; display: grid; align-content: start; gap: 6px; padding: 12px 14px; }
.td-nav button { display: flex; align-items: center; gap: 12px; width: 100%; padding: 11px 14px; font: inherit; font-weight: 600; font-size: 14.5px; color: rgba(255,255,255,.85); background: transparent; border: 2px solid transparent; border-radius: 14px; cursor: pointer; text-align: left; transition: transform .2s, background .2s, color .2s, box-shadow .2s; }
.td-nav button:hover { background: rgba(255,255,255,.1); transform: translateX(4px); }
.td-nav button.on { background: var(--lime); color: var(--plum); border-color: var(--plum); box-shadow: 4px 4px 0 var(--pink); transform: none; }
.td-side-foot { padding: 14px; border-top: 2px dashed rgba(255,255,255,.2); }

/* main */
.td-main { position: relative; z-index: 2; flex: 1; min-width: 0; }
.td-top { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
.td-burger { width: 46px; height: 46px; display: grid; place-items: center; border: 3px solid var(--plum); border-radius: 14px; background: var(--lime); color: var(--plum); cursor: pointer; box-shadow: 3px 3px 0 var(--plum); }
.td-wrap { width: 100%; max-width: 1180px; margin: 0 auto; padding: 8px 16px 48px; display: grid; gap: 28px; }
@media (min-width: 768px) { .td-wrap { padding-top: 28px; } }

/* hero */
.td-hero { position: relative; display: grid; gap: 22px; padding: 26px; border-radius: 30px; border: 3px solid var(--plum); box-shadow: 10px 10px 0 var(--plum); background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 60%, #fff0fa 100%); overflow: hidden; animation: td-pop-in .7s both; }
@media (min-width: 1024px) { .td-hero { grid-template-columns: 1fr auto; align-items: center; padding: 30px 34px; } }
.td-hero-who { display: flex; align-items: center; gap: 18px; }
.td-hero .td-logo { width: 84px; height: 84px; border-color: var(--plum); box-shadow: 4px 4px 0 var(--plum); }
.td-hero h1 { margin: 0; font-size: clamp(1.6rem, 4vw, 2.5rem); font-weight: 800; line-height: 1.05; }
.td-hero p { margin: 6px 0 0; color: rgba(42,10,63,.8); font-weight: 500; }
.td-chip { display: inline-flex; align-items: center; gap: 7px; margin-top: 12px; padding: 6px 14px; border-radius: 999px; font-weight: 700; font-size: 12.5px; background: var(--plum); color: var(--lime); }
.td-mini { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (min-width: 640px) { .td-mini { grid-template-columns: repeat(4, 1fr); } }
.td-mini div { display: grid; justify-items: center; gap: 2px; padding: 12px 16px; background: #fff; border: 2px solid var(--plum); border-radius: 18px; transition: transform .3s, box-shadow .3s; }
.td-mini div:hover { transform: translateY(-4px) rotate(-1.5deg); box-shadow: 4px 4px 0 var(--lime), 4px 4px 0 2px var(--plum); }
.td-mini b { font-family: 'Bricolage Grotesque', sans-serif; font-size: 24px; line-height: 1; }
.td-mini span { font-size: 12px; font-weight: 600; color: rgba(42,10,63,.65); }

/* headings */
.td-title { text-align: center; }
.td-title h2, .td-bar h2 { margin: 0; font-size: clamp(1.7rem, 4vw, 2.5rem); font-weight: 800; line-height: 1.08; }
.td-title p { margin: 8px 0 0; color: rgba(42,10,63,.7); }
.td-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; }
.td-bar h2 { font-size: clamp(1.5rem, 3.4vw, 2rem); }

/* stat cards */
.td-stats { display: grid; gap: 18px; grid-template-columns: 1fr; }
@media (min-width: 560px) { .td-stats { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .td-stats { grid-template-columns: repeat(4, 1fr); } }
.td-stat { position: relative; overflow: hidden; padding: 22px; background: #fff; border: 3px solid var(--plum); border-radius: 24px; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; animation: td-pop-in .6s both; }
.td-stat::before { content: ''; position: absolute; width: 120px; height: 120px; border-radius: 50%; background: var(--pink); top: -60px; right: -60px; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
.td-stat:hover { transform: translateY(-6px) rotate(-1deg); box-shadow: 8px 8px 0 var(--plum); }
.td-stat:hover::before { transform: scale(2.6); }
.td-stat-ic { position: relative; width: 42px; height: 42px; border-radius: 14px; background: var(--plum); color: var(--lime); display: grid; place-items: center; margin-bottom: 14px; }
.td-stat small { position: relative; display: block; font-weight: 700; font-size: 13px; color: rgba(42,10,63,.7); }
.td-stat strong { position: relative; display: block; margin-top: 4px; font-family: 'Bricolage Grotesque', sans-serif; font-size: 32px; font-weight: 800; line-height: 1.05; }
.td-stat.good strong { color: #1d7a3a; } .td-stat.warn strong { color: #b36b00; } .td-stat.bad strong { color: #c0127f; }

/* panels + tables */
.td-panel { background: #fff; border: 3px solid var(--plum); border-radius: 28px; box-shadow: 8px 8px 0 var(--plum); overflow: hidden; animation: td-pop-in .6s both; }
.td-panel-h { padding: 20px 24px; border-bottom: 3px solid var(--plum); background: var(--pink-soft); display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; }
.td-panel-h h3 { margin: 0; font-size: 20px; font-weight: 800; }
.td-panel-b { padding: 20px 24px; }
.td-scroll { overflow-x: auto; }
.td-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.td-table th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 700; white-space: nowrap; background: var(--plum); color: var(--pink); }
.td-table td { padding: 13px 16px; border-bottom: 2px dashed rgba(42,10,63,.15); vertical-align: middle; }
.td-table tbody tr { transition: background .2s; }
.td-table tbody tr:hover { background: var(--cream); }
.td-table .strong { font-weight: 700; }
.td-table .nw { white-space: nowrap; }
.td-actions { display: flex; gap: 8px; }
.td-empty { padding: 36px 16px; text-align: center; color: rgba(42,10,63,.6); font-weight: 500; }

/* pills */
.td-pill { display: inline-flex; align-items: center; padding: 3px 11px; border-radius: 999px; font-size: 12px; font-weight: 800; border: 2px solid var(--plum); text-transform: capitalize; }
.td-pill.ok { background: var(--lime); } .td-pill.bad { background: #ffc2dd; } .td-pill.warn { background: #ffe9a8; } .td-pill.mute { background: #ece4f2; }

/* buttons */
.td-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 20px; font: inherit; font-weight: 700; font-size: 14.5px; color: #fff; background: var(--plum); border: 2px solid var(--plum); border-radius: 14px; cursor: pointer; text-decoration: none; transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s, background .25s; }
.td-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.5), transparent); transform: skewX(-20deg); transition: left .7s; }
.td-btn:hover:not(:disabled)::before { left: 140%; }
.td-btn:hover:not(:disabled) { transform: translateY(-3px) rotate(-1deg); box-shadow: 5px 5px 0 var(--lime), 5px 5px 0 2px var(--plum); background: var(--plum-2); }
.td-btn:active:not(:disabled) { transform: none; box-shadow: none; }
.td-btn:disabled { opacity: .65; cursor: not-allowed; }
.td-btn.lime { background: var(--lime); color: var(--plum); }
.td-btn.lime:hover:not(:disabled) { background: var(--lime); box-shadow: 5px 5px 0 var(--plum); }
.td-btn.outline { background: #fff; color: var(--plum); }
.td-btn.outline:hover:not(:disabled) { background: var(--pink-soft); box-shadow: 5px 5px 0 var(--plum); }
.td-btn.danger { background: #ffc2dd; color: #8a0b5c; }
.td-btn.danger:hover:not(:disabled) { background: #ff9ccb; box-shadow: 5px 5px 0 var(--plum); }
.td-btn.ghost-light { background: transparent; color: #fff; border-color: rgba(255,255,255,.5); }
.td-btn.ghost-light:hover:not(:disabled) { background: rgba(255,255,255,.12); box-shadow: 5px 5px 0 var(--pink); }
.td-btn.sm { padding: 8px 12px; font-size: 13px; border-radius: 11px; }
.td-btn.block { width: 100%; }
.td-btn:focus-visible, .td-nav button:focus-visible, .td-burger:focus-visible, .td-input:focus-visible { outline: 3px solid var(--plum-2); outline-offset: 3px; }

/* forms */
.td-form { display: grid; gap: 16px; }
.td-field label { display: block; margin-bottom: 7px; font-weight: 700; font-size: 14px; }
.td-field small { display: block; margin-top: 6px; font-size: 12px; color: rgba(42,10,63,.6); }
.td-input { width: 100%; height: 46px; padding: 0 14px; font: inherit; font-weight: 500; color: var(--plum); background: var(--cream); border: 2px solid var(--plum); border-radius: 12px; outline: none; transition: box-shadow .2s, transform .2s, background .2s; }
.td-input:focus { background: #fff; transform: translateY(-2px); box-shadow: 4px 4px 0 var(--lime), 4px 4px 0 2px var(--plum); }
.td-input::placeholder { color: rgba(42,10,63,.45); }
select.td-input { cursor: pointer; }
.td-msg { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border-radius: 14px; font-size: 14px; font-weight: 600; border: 2px solid; }
.td-msg p { margin: 0; } .td-msg svg { flex-shrink: 0; margin-top: 1px; }
.td-msg.err { background: #fff0f6; border-color: #c0127f; color: #8a0b5c; }
.td-msg.okm { background: #f4ffd6; border-color: #5c8a00; color: #3b5a00; }

/* modal */
.td-overlay { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 16px; background: rgba(42,10,63,.6); backdrop-filter: blur(4px); }
.td-modal { width: 100%; max-width: 480px; max-height: 92vh; display: flex; flex-direction: column; background: #fff; border: 3px solid var(--plum); border-radius: 28px; box-shadow: 10px 10px 0 var(--lime), 10px 10px 0 3px var(--plum); animation: td-pop-in .35s both; overflow: hidden; }
.td-modal.wide { max-width: 680px; }
.td-modal.sm { max-width: 400px; }
.td-modal-h { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 24px; background: var(--pink); border-bottom: 3px solid var(--plum); }
.td-modal-h h2 { margin: 0; font-size: 21px; font-weight: 800; }
.td-modal-b { padding: 22px 24px; overflow-y: auto; display: grid; gap: 16px; }
.td-modal-f { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 3px solid var(--plum); background: var(--cream); }
.td-two { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 560px) { .td-two { grid-template-columns: 1fr 1fr; } }
.td-label { font-size: 12.5px; font-weight: 700; color: rgba(42,10,63,.65); margin-bottom: 4px; display: block; }
.td-box { padding: 12px 14px; background: var(--cream); border: 2px solid var(--plum); border-radius: 14px; font-size: 14px; }
.td-shot { max-width: 100%; max-height: 300px; object-fit: contain; border: 2px solid var(--plum); border-radius: 14px; background: #fff; }

/* payment requests */
.td-reqs { display: grid; gap: 16px; }
.td-req { padding: 18px; background: var(--cream); border: 3px solid var(--plum); border-radius: 22px; transition: transform .3s, box-shadow .3s; }
.td-req:hover { transform: translateY(-3px); box-shadow: 6px 6px 0 var(--plum); }
.td-req-top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; }
.td-req h3 { margin: 0; font-size: 22px; font-weight: 800; }
.td-req p { margin: 4px 0 0; font-size: 13.5px; color: rgba(42,10,63,.75); }
.td-req .meta { font-size: 12px; color: rgba(42,10,63,.55); }
.td-thumb { width: 72px; height: 72px; object-fit: cover; border: 2px solid var(--plum); border-radius: 12px; margin-top: 12px; cursor: zoom-in; }
.td-req-act { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }

/* reports */
.td-rep { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 640px) { .td-rep { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .td-rep { grid-template-columns: repeat(3, 1fr); } }
.td-rep div { text-align: center; padding: 20px 14px; border: 3px solid var(--plum); border-radius: 22px; background: var(--cream); transition: transform .3s, box-shadow .3s; }
.td-rep div:hover { transform: translateY(-5px) rotate(-1deg); box-shadow: 6px 6px 0 var(--plum); background: var(--pink-soft); }
.td-rep b { display: block; font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; font-weight: 800; }
.td-rep span { font-size: 13px; font-weight: 600; color: rgba(42,10,63,.7); }

.td-search { position: relative; width: 100%; max-width: 320px; }
.td-search svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); }
.td-search .td-input { padding-left: 38px; }
.td-spin { animation: td-spin 1s linear infinite; }

@media (prefers-reduced-motion: reduce) {
  .td, .td *, .td *::before, .td *::after { animation: none !important; transition: none !important; }
}
`

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', Icon: Award },
  { id: 'students', label: 'Students', Icon: Users },
  { id: 'payments', label: 'Payments', Icon: DollarSign },
  { id: 'payment-requests', label: 'Payment Requests', Icon: Eye },
  { id: 'feeplans', label: 'Fee Plans', Icon: Book },
  { id: 'subscriptions', label: 'Subscriptions', Icon: CreditCard },
  { id: 'reports', label: 'Reports', Icon: BarChart3 },
  { id: 'registrations', label: 'Registrations', Icon: ClipboardList },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

/* ---------- small helpers ---------- */
const Pill = ({ tone = 'mute', children }) => <span className={`td-pill ${tone}`}>{children}</span>

const Field = ({ label, htmlFor, hint, children }) => (
  <div className="td-field">
    <label htmlFor={htmlFor}>{label}</label>
    {children}
    {hint && <small>{hint}</small>}
  </div>
)

const Modal = ({ title, onClose, footer, size = '', children }) => (
  <div className="td-overlay" role="dialog" aria-modal="true" aria-label={title}>
    <div className={`td-modal ${size}`}>
      <div className="td-modal-h">
        <h2>{title}</h2>
        {onClose && (
          <button type="button" className="td-btn outline sm" onClick={onClose} aria-label="Close"><X size={16} /></button>
        )}
      </div>
      <div className="td-modal-b">{children}</div>
      {footer && <div className="td-modal-f">{footer}</div>}
    </div>
  </div>
)

const StatCard = ({ Icon, label, value, tone = '', delay = 0 }) => (
  <div className={`td-stat ${tone}`} style={{ animationDelay: `${delay}ms` }}>
    <div className="td-stat-ic"><Icon size={20} /></div>
    <small>{label}</small>
    <strong>{value}</strong>
  </div>
)

const Panel = ({ title, action, children, pad = true }) => (
  <div className="td-panel">
    <div className="td-panel-h"><h3>{title}</h3>{action}</div>
    <div className={pad ? 'td-panel-b' : ''}>{children}</div>
  </div>
)

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
  const [previewRequest, setPreviewRequest] = useState(null)
  const [deletePaymentRequest, setDeletePaymentRequest] = useState(null)
  const [regSearch, setRegSearch] = useState('')

  // Advanced registration management
const [regStatusFilter, setRegStatusFilter] = useState('all')
const [selectedRegistration, setSelectedRegistration] = useState(null)
const [registrationDetails, setRegistrationDetails] = useState(null)
const [registrationHistory, setRegistrationHistory] = useState([])
const [registrationPayments, setRegistrationPayments] = useState([])
const [registrationDuplicates, setRegistrationDuplicates] = useState([])

const [registrationBatches, setRegistrationBatches] = useState([])
const [registrationFeePlans, setRegistrationFeePlans] = useState([])

const [registrationModal, setRegistrationModal] = useState('')
const [registrationAction, setRegistrationAction] = useState('')
const [registrationReason, setRegistrationReason] = useState('')
const [registrationRemarks, setRegistrationRemarks] = useState('')

const [registrationEditForm, setRegistrationEditForm] = useState({})
const [registrationBatchId, setRegistrationBatchId] = useState('')
const [registrationFeePlanId, setRegistrationFeePlanId] = useState('')

const [registrationPaymentId, setRegistrationPaymentId] = useState('')
const [registrationTransactionId, setRegistrationTransactionId] = useState('')
const [registrationScreenshot, setRegistrationScreenshot] = useState('')

const [registrationLoading, setRegistrationLoading] = useState(false)
const [registrationMessage, setRegistrationMessage] = useState('')
const [registrationError, setRegistrationError] = useState('')

  // Form states
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '', password: '' })
  const [newFeePlan, setNewFeePlan] = useState({ planName: '', amount: '', durationInDays: '', description: '' })
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [showAddFeePlan, setShowAddFeePlan] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [editStudent, setEditStudent] = useState({ name: '', email: '', phone: '', password: '', status: 'active' })
  const [editPlanId, setEditPlanId] = useState('')
  const [editSubscriptionId, setEditSubscriptionId] = useState('')
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [paymentUserId, setPaymentUserId] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [paymentDescription, setPaymentDescription] = useState('')
  const [editFeePlan, setEditFeePlan] = useState({ planName: '', amount: '', durationInDays: '', description: '' })
  const [editFeePlanTarget, setEditFeePlanTarget] = useState(null)
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
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
      const [studentsData, paymentsData, feePlansData, subscriptionsData, reportData, paymentRequestsData, registrationsData] = await Promise.all([
        adminAPI.getAllStudents(token),
        adminAPI.getAllPayments(token),
        feePlansAPI.getAllFeePlans(token),
        subscriptionsAPI.getAllSubscriptions(token),
        reportsAPI.getSummaryReport(token, { month: new Date().getMonth() + 1, year: new Date().getFullYear() }),
        paymentRequestAPI.getAllPaymentRequests(token),
        registrationAdminAPI.getAll(token)
      ])
      setStudents(studentsData)
      setPayments(paymentsData.payments || paymentsData)
      setFeePlans(feePlansData)
      setSubscriptions(subscriptionsData)
      setReport(reportData)
      setPaymentRequests(paymentRequestsData)
      setRegistrations(
        registrationsData?.data || registrationsData?.registrations || []
  )
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
      const response = await paymentRequestAPI.approvePaymentRequest(token, requestId, { adminNotes, transactionId })
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
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      const updateData = {
        name: editStudent.name,
        email: editStudent.email,
        phone: editStudent.phone,
        status: editStudent.status
      }

      // Only include password if it's not empty
      if (editStudent.password && editStudent.password.trim() !== '') {
        updateData.password = editStudent.password
      }

      await adminAPI.updateStudent(token, editTarget._id, updateData)

      // If plan changed, create new subscription
      if (editPlanId && editPlanId !== (editTarget.activeSubscription?.plan?._id || '')) {
        await subscriptionsAPI.createSubscription(token, { userId: editTarget._id, planId: editPlanId })
      }

      setEditTarget(null)
      setEditStudent({ name: '', email: '', phone: '', password: '', status: 'active' })
      setEditPlanId('')
      setEditSubscriptionId('')
      fetchDashboardData()

      if (editStudent.password && editStudent.password.trim() !== '') {
        alert('Student updated successfully! Password has been changed.')
      } else {
        alert('Student updated successfully!')
      }
    } catch (error) {
      alert('Error updating student: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPayment = async (e) => {
    e.preventDefault()
    if (!paymentUserId || !paymentAmount) {
      alert('Please select a user and enter an amount.')
      return
    }
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      await paymentsAPI.addPayment(token, {
        user: paymentUserId,
        amount: parseFloat(paymentAmount),
        method: paymentMethod,
        description: paymentDescription,
        email: students.find(s => s._id === paymentUserId)?.email || '',
      })
      setShowAddPayment(false)
      setPaymentUserId('')
      setPaymentAmount('')
      setPaymentMethod('cash')
      setPaymentDescription('')
      fetchDashboardData()
    } catch (error) {
      alert('Error adding payment: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditFeePlan = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      await feePlansAPI.updateFeePlan(token, editFeePlanTarget._id, {
        ...editFeePlan,
        amount: parseFloat(editFeePlan.amount),
        durationInDays: parseInt(editFeePlan.durationInDays)
      })
      setEditFeePlanTarget(null)
      setEditFeePlan({ planName: '', amount: '', durationInDays: '', description: '' })
      fetchDashboardData()
    } catch (error) {
      alert('Error updating fee plan: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePaymentRequest = async () => {
    if (!deletePaymentRequest) return
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      await paymentRequestAPI.deletePaymentRequest(token, deletePaymentRequest._id)
      setPaymentRequests(paymentRequests => paymentRequests.filter(r => r._id !== deletePaymentRequest._id))
      setDeletePaymentRequest(null)
    } catch (e) {
      alert('Delete failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

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
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setPasswordError(error.message)
    } finally {
      setUpdatingPassword(false)
    }
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)

  const getStatusTone = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'ok'
      case 'expired': return 'bad'
      case 'cancelled': return 'mute'
      default: return 'warn'
    }
  }

  const getPaymentRequestTone = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'ok'
      case 'rejected': return 'bad'
      case 'pending': return 'warn'
      default: return 'mute'
    }
  }

  const closeReview = () => { setSelectedRequest(null); setAdminNotes(''); setTransactionId('') }

  // Load registration batches and fee plans
const fetchRegistrationMeta = async () => {
  try {
    const token = localStorage.getItem('token')

    const [batchResult, planResult] = await Promise.all([
      registrationAdminAPI.getBatches(token),
      registrationAdminAPI.getFeePlans(token)
    ])

    setRegistrationBatches(batchResult?.data || [])
    setRegistrationFeePlans(planResult?.data || [])
  } catch (error) {
    console.error('Error loading registration information:', error)
  }
}

// View registration details
const handleViewRegistration = async (registration) => {
  try {
    setRegistrationLoading(true)
    setRegistrationError('')
    setSelectedRegistration(registration)
    setRegistrationModal('details')

    const token = localStorage.getItem('token')
    const result = await registrationAdminAPI.getById(token, registration._id)

    const data = result?.data || result

    setRegistrationDetails(data.registration || null)
    setRegistrationHistory(data.history || [])
    setRegistrationPayments(data.payments || [])
    setRegistrationDuplicates(data.duplicates || [])
  } catch (error) {
    setRegistrationError(error.message || 'Unable to load registration')
  } finally {
    setRegistrationLoading(false)
  }
}

// Refresh registration list
const refreshRegistrations = async () => {
  try {
    const token = localStorage.getItem('token')
    const result = await registrationAdminAPI.getAll(token)

    setRegistrations(
      result?.data || result?.registrations || []
    )
  } catch (error) {
    setRegistrationError(error.message || 'Unable to refresh registrations')
  }
}

// Change registration status
const handleRegistrationStatus = async () => {
  if (!selectedRegistration || !registrationAction) return

  try {
    setRegistrationLoading(true)
    setRegistrationError('')

    const token = localStorage.getItem('token')

    await registrationAdminAPI.updateStatus(
      token,
      selectedRegistration._id,
      {
        action: registrationAction,
        reason: registrationReason,
        remarks: registrationRemarks
      }
    )

    setRegistrationMessage('Registration status updated successfully.')
    setRegistrationModal('')
    setRegistrationReason('')
    setRegistrationRemarks('')
    setRegistrationAction('')

    await refreshRegistrations()
  } catch (error) {
    setRegistrationError(error.message || 'Unable to update registration')
  } finally {
    setRegistrationLoading(false)
  }
}

// Edit registration details
const handleSaveRegistration = async () => {
  try {
    setRegistrationLoading(true)
    setRegistrationError('')

    const token = localStorage.getItem('token')

    await registrationAdminAPI.update(
      token,
      selectedRegistration._id,
      registrationEditForm
    )

    setRegistrationMessage('Registration details updated.')
    setRegistrationModal('')

    await refreshRegistrations()
    await handleViewRegistration(selectedRegistration)
  } catch (error) {
    setRegistrationError(error.message || 'Unable to update registration')
  } finally {
    setRegistrationLoading(false)
  }
}

// Assign batch
const handleAssignRegistrationBatch = async () => {
  if (!registrationBatchId) {
    setRegistrationError('Please select a batch.')
    return
  }

  try {
    setRegistrationLoading(true)
    setRegistrationError('')

    const token = localStorage.getItem('token')

    await registrationAdminAPI.assignBatch(
      token,
      selectedRegistration._id,
      registrationBatchId
    )

    setRegistrationMessage('Batch assigned successfully.')
    setRegistrationModal('')

    await refreshRegistrations()
    await handleViewRegistration(selectedRegistration)
  } catch (error) {
    setRegistrationError(error.message || 'Unable to assign batch')
  } finally {
    setRegistrationLoading(false)
  }
}

// Create fee payment request
const handleCreateRegistrationPayment = async () => {
  if (!registrationFeePlanId) {
    setRegistrationError('Please select a fee plan.')
    return
  }

  try {
    setRegistrationLoading(true)
    setRegistrationError('')

    const token = localStorage.getItem('token')

    await registrationAdminAPI.createPaymentRequest(
      token,
      selectedRegistration._id,
      {
        feePlanId: registrationFeePlanId,
        notes: registrationRemarks
      }
    )

    setRegistrationMessage('Payment request created successfully.')
    setRegistrationModal('')
    setRegistrationRemarks('')

    await refreshRegistrations()
    await handleViewRegistration(selectedRegistration)
  } catch (error) {
    setRegistrationError(error.message || 'Unable to create payment request')
  } finally {
    setRegistrationLoading(false)
  }
}

// Verify registration payment
const handleVerifyRegistrationPayment = async () => {
  if (!registrationPaymentId) {
    setRegistrationError('Payment request ID is missing.')
    return
  }

  try {
    setRegistrationLoading(true)
    setRegistrationError('')

    const token = localStorage.getItem('token')

    await registrationAdminAPI.verifyPayment(
      token,
      selectedRegistration._id,
      {
        paymentRequestId: registrationPaymentId,
        transactionId: registrationTransactionId,
        remarks: registrationRemarks
      }
    )

    setRegistrationMessage('Payment verified successfully.')
    setRegistrationModal('')
    setRegistrationTransactionId('')
    setRegistrationRemarks('')

    await refreshRegistrations()
    await handleViewRegistration(selectedRegistration)
  } catch (error) {
    setRegistrationError(error.message || 'Unable to verify payment')
  } finally {
    setRegistrationLoading(false)
  }
}

// Reject registration payment
const handleRejectRegistrationPayment = async () => {
  if (!registrationPaymentId || registrationReason.trim().length < 3) {
    setRegistrationError('Please provide a valid rejection reason.')
    return
  }

  try {
    setRegistrationLoading(true)
    setRegistrationError('')

    const token = localStorage.getItem('token')

    await registrationAdminAPI.rejectPayment(
      token,
      selectedRegistration._id,
      {
        paymentRequestId: registrationPaymentId,
        reason: registrationReason
      }
    )

    setRegistrationMessage('Payment rejected.')
    setRegistrationModal('')
    setRegistrationReason('')

    await refreshRegistrations()
    await handleViewRegistration(selectedRegistration)
  } catch (error) {
    setRegistrationError(error.message || 'Unable to reject payment')
  } finally {
    setRegistrationLoading(false)
  }
}

// Convert registration into a student
const handleConvertRegistration = async () => {
  if (!window.confirm('Convert this registration into a student account?')) {
    return
  }

  try {
    setRegistrationLoading(true)
    setRegistrationError('')

    const token = localStorage.getItem('token')

    const result = await registrationAdminAPI.convertToStudent(
      token,
      selectedRegistration._id,
      {
        remarks: registrationRemarks
      }
    )

    const data = result?.data || result

    setRegistrationMessage(
      data?.temporaryPassword
        ? `Student created successfully. Temporary password: ${data.temporaryPassword}`
        : 'Registration converted into a student successfully.'
    )

    setRegistrationModal('')
    await refreshRegistrations()
    await fetchDashboardData()
  } catch (error) {
    setRegistrationError(error.message || 'Unable to convert registration')
  } finally {
    setRegistrationLoading(false)
  }
}

  useEffect(() => {
  if (user) {
    fetchDashboardData()
    fetchRegistrationMeta()
  }
}, [user])

  const filteredRegistrations = registrations.filter((r) => {
    const q = regSearch.toLowerCase()
    return `${r.fname || ''} ${r.lname || ''}`.toLowerCase().includes(q) || (r.phone || '').includes(regSearch) || (r.refNum || '').toLowerCase().includes(q)
  })

  const initial = (user?.name || 'A').charAt(0).toUpperCase()

  return (
    <div className="td">
      <style>{styles}</style>

      {/* decorative background */}
      <div className="td-bg" aria-hidden="true">
        <div className="td-blob" style={{ width: 340, height: 340, background: 'var(--pink)', opacity: .45, top: -80, right: -60, animation: 'td-float-b 14s ease-in-out infinite' }} />
        <div className="td-blob" style={{ width: 280, height: 280, background: 'var(--lime)', opacity: .22, bottom: -80, left: '25%', animation: 'td-float-b 16s ease-in-out infinite reverse' }} />
        <div className="td-ball" style={{ width: 34, height: 34, top: '16%', right: '5%', animation: 'td-float 6s ease-in-out infinite' }} />
        <div className="td-ball" style={{ width: 22, height: 22, bottom: '10%', right: '14%', animation: 'td-float 5s ease-in-out infinite .8s' }} />
      </div>

      {sidebarOpen && <div className="td-scrim" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`td-side ${sidebarOpen ? 'open' : ''}`}>
        <div className="td-brand">
          <div className="td-logo"><img src="/TikoneCricketGurukul1.png" alt="Logo" /></div>
          <b>Tikone Cricket Gurukul</b>
          <button className="td-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X /></button>
        </div>

        <div className="td-me">
          <div className="td-avatar">{initial}</div>
          <p>{user?.name || 'Admin'}</p>
          <small>{user?.email}</small>
          <Pill tone="ok">Admin</Pill>
        </div>

        <nav className="td-nav">
          {SIDEBAR_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={activeTab === id ? 'on' : ''}
              onClick={() => { setActiveTab(id); setSidebarOpen(false) }}
            >
              <Icon size={19} />{label}
            </button>
          ))}
        </nav>

        <div className="td-side-foot">
          <button className="td-btn ghost-light block" onClick={logout}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="td-main">
        <div className="td-top">
          <button className="td-burger" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
        </div>

        <div className="td-wrap">
          {/* Hero */}
          <div className="td-hero">
            <div className="td-hero-who">
              <div className="td-logo"><img src="/TikoneCricketGurukul1.png" alt="Logo" /></div>
              <div>
                <h1>Welcome, {user?.name || 'Admin'}!</h1>
                <p>Here’s your academy at a glance.</p>
                <span className="td-chip"><Star size={14} /> Admin Panel</span>
              </div>
            </div>
            <div className="td-mini">
              <div><Users size={20} /><b>{students.length}</b><span>Students</span></div>
              <div><CalendarCheck size={20} /><b>{payments.length}</b><span>Payments</span></div>
              <div><CheckCircle size={20} /><b>{feePlans.length}</b><span>Fee Plans</span></div>
              <div><History size={20} /><b>{subscriptions.length}</b><span>Subscriptions</span></div>
            </div>
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <>
              <div className="td-title">
                <h2>Admin Dashboard Overview</h2>
                <p>Get a quick summary of your academy's key metrics and performance</p>
              </div>
              <div className="td-stats">
                <StatCard Icon={Users} label="Total Students" value={students.length} delay={0} />
                <StatCard Icon={CheckCircle} label="Active Students" value={students.filter(s => s.status === 'active').length} tone="good" delay={60} />
                <StatCard Icon={X} label="Inactive Students" value={students.filter(s => s.status !== 'active').length} tone="bad" delay={120} />
                <StatCard Icon={CreditCard} label="Total Payments" value={payments.length} delay={180} />
                <StatCard Icon={DollarSign} label="Total Revenue" value={formatCurrency(payments.reduce((sum, p) => sum + (p.amount || 0), 0))} tone="good" delay={240} />
                <StatCard Icon={History} label="Pending Payments" value={paymentRequests.filter(r => r.status === 'pending').length} tone="warn" delay={300} />
                <StatCard Icon={Book} label="Fee Plans" value={feePlans.length} delay={360} />
                <StatCard Icon={Award} label="Active Subscriptions" value={subscriptions.filter(s => s.status === 'active').length} delay={420} />
              </div>
            </>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <>
              <div className="td-bar">
                <h2>Students Management</h2>
                <button className="td-btn lime" onClick={() => setShowAddStudent(true)}><Plus size={17} /> Add Student</button>
              </div>
              <Panel title="All Students" pad={false}>
                <div className="td-scroll">
                  <table className="td-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student._id}>
                          <td className="strong">{student.name}</td>
                          <td>{student.email}</td>
                          <td className="nw">{student.phone}</td>
                          <td><Pill tone={student.status === 'active' ? 'ok' : 'mute'}>{student.status}</Pill></td>
                          <td>
                            <div className="td-actions">
                              <button className="td-btn outline sm" aria-label="Edit student" onClick={() => { setEditTarget(student); setEditStudent({ name: student.name, email: student.email, phone: student.phone, password: '', status: student.status }) }}>
                                <Edit size={15} />
                              </button>
                              <button className="td-btn danger sm" aria-label="Delete student" onClick={() => { setDeleteTarget(student); setDeleteType('student') }}>
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {students.length === 0 && <div className="td-empty">No students yet. Add your first student to get started.</div>}
                </div>
              </Panel>
            </>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <>
              <div className="td-bar">
                <h2>Payments Management</h2>
                <button className="td-btn lime" onClick={() => setShowAddPayment(true)}><DollarSign size={17} /> Add Payment</button>
              </div>
              <Panel title="All Payments" pad={false}>
                <div className="td-scroll">
                  <table className="td-table">
                    <thead><tr><th>Date</th><th>User</th><th>Amount</th><th>Method</th><th>Description</th></tr></thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment._id || payment.id}>
                          <td className="nw">{formatDate(payment.createdAt)}</td>
                          <td>{payment.user?.name || payment.email}</td>
                          <td className="strong nw">{formatCurrency(payment.amount)}</td>
                          <td style={{ textTransform: 'capitalize' }}>{payment.method || 'UPI'}</td>
                          <td>{payment.description || 'Payment'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {payments.length === 0 && <div className="td-empty">No payments recorded yet.</div>}
                </div>
              </Panel>
            </>
          )}

          {/* Payment Requests Tab */}
          {activeTab === 'payment-requests' && (
            <>
              <div className="td-bar"><h2>Payment Requests</h2></div>
              <Panel title="All Requests">
                {paymentRequests.length > 0 ? (
                  <div className="td-reqs">
                    {paymentRequests.map((request) => (
                      <div key={request._id} className="td-req">
                        <div className="td-req-top">
                          <div>
                            <h3>{formatCurrency(request.amount)}</h3>
                            <p>{request.description}</p>
                            <p className="meta">Requested by {request.user?.name} ({request.user?.email}) on {formatDate(request.createdAt)}</p>
                          </div>
                          <div className="td-actions" style={{ alignItems: 'flex-start' }}>
                            <Pill tone={getPaymentRequestTone(request.status)}>{request.status}</Pill>
                            <button className="td-btn danger sm" aria-label="Delete payment request" onClick={() => setDeletePaymentRequest(request)}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {request.screenshot && (
                          <img src={request.screenshot} alt="Payment screenshot" className="td-thumb" onClick={() => setPreviewRequest(request)} />
                        )}

                        {request.status === 'pending' && (
                          <div className="td-req-act">
                            <button className="td-btn outline sm" onClick={() => setPreviewRequest(request)}><Eye size={15} /> Preview</button>
                            <button className="td-btn lime sm" onClick={() => setSelectedRequest(request)}><Check size={15} /> Approve</button>
                            <button className="td-btn danger sm" onClick={() => setSelectedRequest(request)}>Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="td-empty">No payment requests found</div>
                )}
              </Panel>
            </>
          )}

          {/* Fee Plans Tab */}
          {activeTab === 'feeplans' && (
            <>
              <div className="td-bar">
                <h2>Fee Plans Management</h2>
                <button className="td-btn lime" onClick={() => setShowAddFeePlan(true)}><Plus size={17} /> Add Fee Plan</button>
              </div>
              <Panel title="All Fee Plans" pad={false}>
                <div className="td-scroll">
                  <table className="td-table">
                    <thead><tr><th>Plan Name</th><th>Amount</th><th>Duration (days)</th><th>Description</th><th>Actions</th></tr></thead>
                    <tbody>
                      {feePlans.map(plan => (
                        <tr key={plan._id}>
                          <td className="strong">{plan.planName}</td>
                          <td className="nw">₹{plan.amount}</td>
                          <td>{plan.durationInDays}</td>
                          <td>{plan.description || '-'}</td>
                          <td>
                            <div className="td-actions">
                              <button className="td-btn outline sm" aria-label="Edit fee plan" onClick={() => { setEditFeePlanTarget(plan); setEditFeePlan({ planName: plan.planName, amount: plan.amount.toString(), durationInDays: plan.durationInDays.toString(), description: plan.description || '' }) }}>
                                <Edit size={15} />
                              </button>
                              <button className="td-btn danger sm" aria-label="Delete fee plan" onClick={() => { setDeleteTarget(plan); setDeleteType('feeplan') }}>
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {feePlans.length === 0 && <div className="td-empty">No fee plans yet.</div>}
                </div>
              </Panel>
            </>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <>
              <div className="td-bar"><h2>Subscriptions</h2></div>
              <Panel title="All Subscriptions" pad={false}>
                <div className="td-scroll">
                  <table className="td-table">
                    <thead><tr><th>User</th><th>Plan</th><th>Start Date</th><th>End Date</th><th>Status</th></tr></thead>
                    <tbody>
                      {subscriptions.map((subscription) => (
                        <tr key={subscription._id}>
                          <td className="strong">{subscription.user?.name || subscription.user?.email}</td>
                          <td>{subscription.plan?.planName}</td>
                          <td className="nw">{formatDate(subscription.startDate)}</td>
                          <td className="nw">{formatDate(subscription.endDate)}</td>
                          <td><Pill tone={getStatusTone(subscription.status)}>{subscription.status}</Pill></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {subscriptions.length === 0 && <div className="td-empty">No subscriptions yet.</div>}
                </div>
              </Panel>
            </>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <>
              <div className="td-bar"><h2>Reports</h2></div>
              <Panel title="Monthly Reports">
                {report ? (
                  <div className="td-rep">
                    <div><b>{report.totalStudents || 0}</b><span>Total Students</span></div>
                    <div><b style={{ color: '#1d7a3a' }}>{formatCurrency(report.totalCollected || 0)}</b><span>Total Collected</span></div>
                    <div><b style={{ color: '#c0127f' }}>{formatCurrency(report.totalDue || 0)}</b><span>Total Due</span></div>
                    <div><b>{formatCurrency(report.averageCollectedPerStudent || 0)}</b><span>Average per Student</span></div>
                    <div><b>{report.feePlansUsed || 0}</b><span>Fee Plans Used</span></div>
                    <div><b style={{ fontSize: 22 }}>{report.popularPlan || 'N/A'}</b><span>Popular Plan</span></div>
                  </div>
                ) : (
                  <div className="td-empty">No report data available</div>
                )}
              </Panel>
            </>
          )}
          
           {/* Registrations Tab */}
            {activeTab === "registrations" && (
              <Registrations />
              )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <>
              <div className="td-bar"><h2>Settings</h2></div>
              <Panel title="Update Admin Password">
                <form onSubmit={handlePasswordUpdate} className="td-form" style={{ maxWidth: 520 }}>
                  <Field label="Current Password" htmlFor="currentPassword">
                    <input id="currentPassword" type="password" className="td-input" placeholder="Enter current password" autoComplete="current-password"
                      value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
                  </Field>
                  <Field label="New Password" htmlFor="newPassword">
                    <input id="newPassword" type="password" className="td-input" placeholder="Enter new password" autoComplete="new-password"
                      value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                  </Field>
                  <Field label="Confirm New Password" htmlFor="confirmPassword">
                    <input id="confirmPassword" type="password" className="td-input" placeholder="Confirm new password" autoComplete="new-password"
                      value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                  </Field>

                  {passwordError && (
                    <div className="td-msg err" role="alert"><AlertCircle size={19} /><p>{passwordError}</p></div>
                  )}
                  {passwordSuccess && (
                    <div className="td-msg okm" role="status"><CheckCircle size={19} /><p>{passwordSuccess}</p></div>
                  )}

                  <button type="submit" className="td-btn block" disabled={updatingPassword}>
                    {updatingPassword ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>
              </Panel>
            </>
          )}
        </div>
      </div>

      {/* ---------------- Modals ---------------- */}

      {/* Payment Request Preview */}
      {previewRequest && (
        <Modal
          title="Payment Request Preview" size="wide" onClose={() => setPreviewRequest(null)}
          footer={
            <>
              <button className="td-btn outline" onClick={() => setPreviewRequest(null)}>Close</button>
              {previewRequest.status === 'pending' && (
                <>
                  <button className="td-btn danger" onClick={() => { setSelectedRequest(previewRequest); setPreviewRequest(null) }}>Reject</button>
                  <button className="td-btn lime" onClick={() => { setSelectedRequest(previewRequest); setPreviewRequest(null) }}>Approve</button>
                </>
              )}
            </>
          }
        >
          <div className="td-two">
            <div>
              <span className="td-label">Amount</span>
              <b className="td-display" style={{ fontSize: 30, color: '#1d7a3a' }}>{formatCurrency(previewRequest.amount)}</b>
            </div>
            <div>
              <span className="td-label">Status</span>
              <Pill tone={getPaymentRequestTone(previewRequest.status)}>{previewRequest.status}</Pill>
            </div>
          </div>
          <div><span className="td-label">Description</span><div className="td-box">{previewRequest.description}</div></div>
          <div>
            <span className="td-label">Requested by</span>
            <b>{previewRequest.user?.name}</b>
            <div style={{ fontSize: 14 }}>{previewRequest.user?.email}</div>
            <div style={{ fontSize: 12, opacity: .6 }}>Requested on {formatDate(previewRequest.createdAt)}</div>
          </div>
          {previewRequest.screenshot && (
            <div><span className="td-label">Payment Screenshot</span><img src={previewRequest.screenshot} alt="Payment screenshot" className="td-shot" /></div>
          )}
        </Modal>
      )}

      {/* Add Student */}
      {showAddStudent && (
        <Modal title="Add New Student" onClose={() => setShowAddStudent(false)}>
          <form onSubmit={handleAddStudent} className="td-form">
            <Field label="Name" htmlFor="studentName">
              <input id="studentName" className="td-input" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} required />
            </Field>
            <Field label="Email" htmlFor="studentEmail">
              <input id="studentEmail" type="email" className="td-input" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} required />
            </Field>
            <Field label="Phone" htmlFor="studentPhone">
              <input id="studentPhone" className="td-input" value={newStudent.phone} onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })} required />
            </Field>
            <Field label="Password" htmlFor="studentPassword">
              <input id="studentPassword" type="password" className="td-input" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} required />
            </Field>
            <div className="td-modal-f" style={{ margin: '4px -24px -22px' }}>
              <button type="button" className="td-btn outline" onClick={() => setShowAddStudent(false)}>Cancel</button>
              <button type="submit" className="td-btn lime" disabled={loading}>{loading ? 'Adding...' : 'Add Student'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Fee Plan */}
      {showAddFeePlan && (
        <Modal title="Add New Fee Plan" onClose={() => setShowAddFeePlan(false)}>
          <form onSubmit={handleAddFeePlan} className="td-form">
            <Field label="Plan Name" htmlFor="planName">
              <input id="planName" className="td-input" value={newFeePlan.planName} onChange={(e) => setNewFeePlan({ ...newFeePlan, planName: e.target.value })} required />
            </Field>
            <Field label="Amount (₹)" htmlFor="planAmount">
              <input id="planAmount" type="number" className="td-input" value={newFeePlan.amount} onChange={(e) => setNewFeePlan({ ...newFeePlan, amount: e.target.value })} required />
            </Field>
            <Field label="Duration (Days)" htmlFor="planDuration">
              <input id="planDuration" type="number" className="td-input" value={newFeePlan.durationInDays} onChange={(e) => setNewFeePlan({ ...newFeePlan, durationInDays: e.target.value })} required />
            </Field>
            <Field label="Description" htmlFor="planDescription">
              <input id="planDescription" className="td-input" value={newFeePlan.description} onChange={(e) => setNewFeePlan({ ...newFeePlan, description: e.target.value })} />
            </Field>
            <div className="td-modal-f" style={{ margin: '4px -24px -22px' }}>
              <button type="button" className="td-btn outline" onClick={() => setShowAddFeePlan(false)}>Cancel</button>
              <button type="submit" className="td-btn lime" disabled={loading}>{loading ? 'Adding...' : 'Add Fee Plan'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Student */}
      {editTarget && (
        <Modal title="Edit Student" onClose={() => setEditTarget(null)}>
          <form onSubmit={handleEditStudent} className="td-form">
            <Field label="Name" htmlFor="editStudentName">
              <input id="editStudentName" className="td-input" value={editStudent.name} onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })} required />
            </Field>
            <Field label="Email" htmlFor="editStudentEmail">
              <input id="editStudentEmail" type="email" className="td-input" value={editStudent.email} onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })} required />
            </Field>
            <Field label="Phone" htmlFor="editStudentPhone">
              <input id="editStudentPhone" className="td-input" value={editStudent.phone} onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })} required />
            </Field>
            <Field label="Status" htmlFor="editStudentStatus">
              <select id="editStudentStatus" className="td-input" value={editStudent.status} onChange={(e) => setEditStudent({ ...editStudent, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </Field>
            <Field label="Plan" htmlFor="editStudentPlan">
              <select id="editStudentPlan" className="td-input" value={editPlanId || (editTarget.activeSubscription?.plan?._id || '')} onChange={(e) => setEditPlanId(e.target.value)}>
                <option value="">-- Select Plan --</option>
                {feePlans.map(plan => (
                  <option key={plan._id} value={plan._id}>{plan.planName} (₹{plan.amount}, {plan.durationInDays} days)</option>
                ))}
              </select>
            </Field>
            <Field label="New Password (leave blank to keep unchanged)" htmlFor="editStudentPassword" hint="Minimum 6 characters. Leave blank to keep current password.">
              <input id="editStudentPassword" type="password" className="td-input" placeholder="Enter new password (optional)" autoComplete="new-password"
                value={editStudent.password} onChange={(e) => setEditStudent({ ...editStudent, password: e.target.value })} />
            </Field>
            <div className="td-modal-f" style={{ margin: '4px -24px -22px' }}>
              <button type="button" className="td-btn outline" onClick={() => setEditTarget(null)}>Cancel</button>
              <button type="submit" className="td-btn lime" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Payment Request Review */}
      {selectedRequest && (
        <Modal
          title={selectedRequest.status === 'pending' ? 'Review Payment Request' : 'Payment Request Details'}
          size="wide" onClose={closeReview}
          footer={
            selectedRequest.status === 'pending' ? (
              <>
                <button type="button" className="td-btn outline" onClick={closeReview}>Cancel</button>
                <button type="button" className="td-btn danger" onClick={() => handleRejectPaymentRequest(selectedRequest._id)}>Reject</button>
                <button type="button" className="td-btn lime" onClick={() => handleApprovePaymentRequest(selectedRequest._id)}>Approve</button>
              </>
            ) : (
              <button type="button" className="td-btn outline" onClick={closeReview}>Close</button>
            )
          }
        >
          <div className="td-two">
            <div><span className="td-label">Amount</span><b className="td-display" style={{ fontSize: 24 }}>{formatCurrency(selectedRequest.amount)}</b></div>
            <div><span className="td-label">Status</span><Pill tone={getPaymentRequestTone(selectedRequest.status)}>{selectedRequest.status}</Pill></div>
          </div>
          <div><span className="td-label">Description</span><div className="td-box">{selectedRequest.description}</div></div>

          {selectedRequest.feePlan && (
            <div>
              <span className="td-label">Selected Fee Plan</span>
              <div className="td-box" style={{ background: 'var(--pink-soft)' }}>
                <b>{selectedRequest.feePlan.planName}</b>
                <div style={{ fontSize: 13 }}>₹{selectedRequest.feePlan.amount} for {selectedRequest.feePlan.durationInDays} days</div>
              </div>
            </div>
          )}

          <div>
            <span className="td-label">Requested by</span>
            <div style={{ fontSize: 14 }}>{selectedRequest.user?.name} ({selectedRequest.user?.email})</div>
            <div style={{ fontSize: 12, opacity: .6 }}>Requested on {formatDate(selectedRequest.createdAt)}</div>
          </div>

          {selectedRequest.screenshot && (
            <div><span className="td-label">Screenshot</span><img src={selectedRequest.screenshot} alt="Payment screenshot" className="td-shot" /></div>
          )}

          {selectedRequest.status === 'pending' && (
            <>
              <Field label="Admin Notes" htmlFor="adminNotes">
                <input id="adminNotes" className="td-input" placeholder="Add notes (optional)" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
              </Field>
              <Field label="Transaction ID" htmlFor="transactionId">
                <input id="transactionId" className="td-input" placeholder="Enter transaction ID (optional)" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
              </Field>
            </>
          )}
        </Modal>
      )}

      {/* Add Payment */}
      {showAddPayment && (
        <Modal title="Add Payment" onClose={() => setShowAddPayment(false)}>
          <form onSubmit={handleAddPayment} className="td-form">
            <Field label="Select User" htmlFor="paymentUser">
              <select id="paymentUser" className="td-input" value={paymentUserId} onChange={e => setPaymentUserId(e.target.value)} required>
                <option value="">-- Search or Select User --</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
              </select>
            </Field>
            <Field label="Amount" htmlFor="paymentAmount">
              <input id="paymentAmount" type="number" className="td-input" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} required />
            </Field>
            <Field label="Payment Method" htmlFor="paymentMethod">
              <select id="paymentMethod" className="td-input" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} required>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="upi">UPI</option>
              </select>
            </Field>
            <Field label="Description" htmlFor="paymentDescription">
              <input id="paymentDescription" className="td-input" value={paymentDescription} onChange={e => setPaymentDescription(e.target.value)} />
            </Field>
            <div className="td-modal-f" style={{ margin: '4px -24px -22px' }}>
              <button type="button" className="td-btn outline" onClick={() => setShowAddPayment(false)}>Cancel</button>
              <button type="submit" className="td-btn lime" disabled={loading}>{loading ? 'Adding...' : 'Add Payment'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Fee Plan */}
      {editFeePlanTarget && (
        <Modal title="Edit Fee Plan" onClose={() => setEditFeePlanTarget(null)}>
          <form onSubmit={handleEditFeePlan} className="td-form">
            <Field label="Plan Name" htmlFor="editPlanName">
              <input id="editPlanName" className="td-input" value={editFeePlan.planName} onChange={(e) => setEditFeePlan({ ...editFeePlan, planName: e.target.value })} required />
            </Field>
            <Field label="Amount (₹)" htmlFor="editPlanAmount">
              <input id="editPlanAmount" type="number" className="td-input" value={editFeePlan.amount} onChange={(e) => setEditFeePlan({ ...editFeePlan, amount: e.target.value })} required />
            </Field>
            <Field label="Duration (Days)" htmlFor="editPlanDuration">
              <input id="editPlanDuration" type="number" className="td-input" value={editFeePlan.durationInDays} onChange={(e) => setEditFeePlan({ ...editFeePlan, durationInDays: e.target.value })} required />
            </Field>
            <Field label="Description" htmlFor="editPlanDescription">
              <input id="editPlanDescription" className="td-input" value={editFeePlan.description} onChange={(e) => setEditFeePlan({ ...editFeePlan, description: e.target.value })} />
            </Field>
            <div className="td-modal-f" style={{ margin: '4px -24px -22px' }}>
              <button type="button" className="td-btn outline" onClick={() => setEditFeePlanTarget(null)}>Cancel</button>
              <button type="submit" className="td-btn lime" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirmation (student / fee plan) */}
      {deleteTarget && (
        <Modal
          title="Confirm Delete" size="sm"
          footer={
            <>
              <button className="td-btn outline" onClick={() => { setDeleteTarget(null); setDeleteType('') }}>Cancel</button>
              <button className="td-btn danger" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
            </>
          }
        >
          <p style={{ margin: 0 }}>Are you sure you want to delete this {deleteType === 'student' ? 'student' : 'fee plan'}?</p>
        </Modal>
      )}

      {/* Delete payment request confirmation */}
      {deletePaymentRequest && (
        <Modal
          title="Confirm Delete" size="sm"
          footer={
            <>
              <button className="td-btn outline" onClick={() => setDeletePaymentRequest(null)}>Cancel</button>
              <button className="td-btn danger" onClick={handleDeletePaymentRequest} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
            </>
          }
        >
          <p style={{ margin: 0 }}>Are you sure you want to delete this payment request?</p>
          <div className="td-box">
            <b>{formatCurrency(deletePaymentRequest.amount)}</b>
            <div style={{ fontSize: 13 }}>{deletePaymentRequest.description}</div>
            <div style={{ fontSize: 12, opacity: .6 }}>by {deletePaymentRequest.user?.name}</div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminDashboard
