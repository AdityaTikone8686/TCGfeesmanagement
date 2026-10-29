import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shield, Users, Target, ArrowRight, Eye, EyeOff, Settings, Mail, Lock, BarChart3, AlertCircle } from 'lucide-react'

/* ------------------------------------------------------------------
   THEME (same as LandingPage)
   Pink  : #FFA8E0  (brand / background)
   Plum  : #2A0A3F  (contrast: text, dark surfaces, buttons)
   Lime  : #C6FF3D  (cricket-ball accent pop)
   Cream : #FFF6FC  (soft surfaces)
   Fonts : Bricolage Grotesque (headings) + DM Sans (body)
------------------------------------------------------------------- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcl {
  --pink: #FFA8E0;
  --pink-soft: #FFD3F0;
  --plum: #2A0A3F;
  --plum-2: #4A1470;
  --lime: #C6FF3D;
  --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: var(--plum);
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 55%, #fff0fa 100%);
  background-size: 200% 200%;
  animation: tcl-gradient-move 14s ease infinite;
  overflow: hidden;
}
.tcl * { box-sizing: border-box; }
.tcl h1, .tcl h2, .tcl .tcl-display { font-family: 'Bricolage Grotesque', 'DM Sans', sans-serif; letter-spacing: -0.02em; }

@keyframes tcl-float { 0%,100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-22px) rotate(6deg) } }
@keyframes tcl-float-b { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(30px,-26px) scale(1.12) } }
@keyframes tcl-spin { to { transform: rotate(360deg) } }
@keyframes tcl-pop-in { 0% { opacity: 0; transform: scale(.7) translateY(20px) } 100% { opacity: 1; transform: scale(1) translateY(0) } }
@keyframes tcl-gradient-move { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
@keyframes tcl-shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }

/* decorative */
.tcl-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
.tcl-ball { position: absolute; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%);
  box-shadow: inset -6px -8px 14px rgba(0,0,0,.25), 0 12px 24px rgba(42,10,63,.25); }
.tcl-ball::after { content: ''; position: absolute; inset: 8% 45% 8% 45%; border-left: 2px dashed rgba(255,255,255,.7); border-right: 2px dashed rgba(255,255,255,.7); border-radius: 50%; }
.tcl-grid { position: absolute; inset: 0; pointer-events: none; opacity: .35;
  background-image: linear-gradient(rgba(42,10,63,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(42,10,63,.08) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(circle at 50% 40%, #000 20%, transparent 75%);
          mask-image: radial-gradient(circle at 50% 40%, #000 20%, transparent 75%); }

.tcl-wrap { position: relative; z-index: 2; width: 100%; max-width: 460px; }

/* header */
.tcl-header { text-align: center; margin-bottom: 28px; animation: tcl-pop-in .8s both; }
.tcl-brand { display: flex; align-items: center; justify-content: center; gap: 16px; text-align: left; }
.tcl-logo { flex-shrink: 0; width: 76px; height: 76px; border-radius: 22px; background: #fff; border: 3px solid var(--plum); box-shadow: 5px 5px 0 var(--plum); overflow: hidden; transform: rotate(-3deg); transition: transform .4s cubic-bezier(.2,.8,.2,1); }
.tcl-logo:hover { transform: rotate(0) scale(1.06); }
.tcl-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
.tcl-title { margin: 0; font-size: clamp(1.5rem, 5vw, 2rem); font-weight: 800; line-height: 1.05; }
.tcl-sub { margin: 4px 0 0; font-weight: 700; font-size: 15px; color: #b0108a; }

.tcl-chip { display: inline-flex; align-items: center; gap: 8px; margin-top: 18px; padding: 8px 16px; border-radius: 999px; font-weight: 700; font-size: 13px; background: var(--plum); color: var(--lime); }
.tcl-chip svg { animation: tcl-spin 6s linear infinite; }

/* card */
.tcl-card { position: relative; padding: 32px 28px; background: #fff; border: 3px solid var(--plum); border-radius: 30px; box-shadow: 12px 12px 0 var(--plum); animation: tcl-pop-in .9s .15s both; }
@media (max-width: 480px) { .tcl-card { padding: 26px 20px; box-shadow: 8px 8px 0 var(--plum); } }
.tcl-card-top { display: flex; align-items: center; justify-content: center; gap: 12px; }
.tcl-card-ic { width: 48px; height: 48px; border-radius: 16px; background: var(--plum); color: var(--lime); display: grid; place-items: center; transition: transform .5s cubic-bezier(.3,1.6,.5,1); }
.tcl-card:hover .tcl-card-ic { transform: rotate(360deg); background: var(--lime); color: var(--plum); }
.tcl-card h2 { margin: 0; font-size: 26px; font-weight: 800; }
.tcl-card-lead { text-align: center; margin: 10px 0 26px; color: rgba(42,10,63,.75); line-height: 1.6; }

/* form */
.tcl-form { display: grid; gap: 20px; }
.tcl-label { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-weight: 700; font-size: 14px; }
.tcl-field { position: relative; }
.tcl-input { width: 100%; height: 52px; padding: 0 16px; font: inherit; font-weight: 500; color: var(--plum); background: var(--cream); border: 2px solid var(--plum); border-radius: 14px; outline: none; transition: box-shadow .2s, transform .2s, background .2s; }
.tcl-input::placeholder { color: rgba(42,10,63,.45); }
.tcl-input:focus { background: #fff; transform: translateY(-2px); box-shadow: 4px 4px 0 var(--lime), 4px 4px 0 2px var(--plum); }
.tcl-input.has-eye { padding-right: 52px; }
.tcl-eye { position: absolute; top: 50%; right: 8px; transform: translateY(-50%); width: 38px; height: 38px; border: 0; border-radius: 10px; background: transparent; color: var(--plum); display: grid; place-items: center; cursor: pointer; transition: background .2s, transform .2s; }
.tcl-eye:hover { background: var(--lime); transform: translateY(-50%) rotate(-8deg); }
.tcl-eye:focus-visible, .tcl-btn:focus-visible, .tcl-link:focus-visible { outline: 3px solid var(--plum-2); outline-offset: 3px; }

/* error */
.tcl-error { display: flex; align-items: flex-start; gap: 10px; padding: 14px 16px; border-radius: 14px; background: #fff0f6; border: 2px solid #c0127f; color: #8a0b5c; font-size: 14px; font-weight: 600; animation: tcl-shake .4s; }
.tcl-error svg { flex-shrink: 0; margin-top: 1px; }
.tcl-error p { margin: 0; }

/* buttons */
.tcl-btn { position: relative; overflow: hidden; width: 100%; height: 54px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 0 26px; border-radius: 16px; font: inherit; font-weight: 700; font-size: 16px; color: #fff; background: var(--plum); border: 2px solid var(--plum); cursor: pointer; transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s, background .25s; }
.tcl-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.45), transparent); transform: skewX(-20deg); transition: left .7s; }
.tcl-btn:hover:not(:disabled)::before { left: 140%; }
.tcl-btn:hover:not(:disabled) { background: var(--plum-2); transform: translateY(-4px) rotate(-1deg); box-shadow: 6px 6px 0 var(--lime), 6px 6px 0 2px var(--plum); }
.tcl-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
.tcl-btn:disabled { opacity: .7; cursor: not-allowed; }
.tcl-btn .arr { transition: transform .25s; }
.tcl-btn:hover:not(:disabled) .arr { transform: translateX(5px); }
.tcl-spinner { animation: tcl-spin 1s linear infinite; }

/* switch link */
.tcl-switch { margin: 24px 0 0; padding-top: 20px; border-top: 2px dashed rgba(42,10,63,.25); text-align: center; font-size: 14px; color: rgba(42,10,63,.75); }
.tcl-link { padding: 2px 6px; margin-left: 4px; font: inherit; font-weight: 800; color: var(--plum); background: var(--lime); border: 2px solid var(--plum); border-radius: 8px; cursor: pointer; transition: transform .2s, box-shadow .2s; }
.tcl-link:hover { transform: translateY(-2px) rotate(-2deg); box-shadow: 3px 3px 0 var(--plum); }

/* features */
.tcl-feats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 28px; animation: tcl-pop-in .9s .3s both; }
.tcl-feat { text-align: center; padding: 14px 8px; background: #fff; border: 2px solid var(--plum); border-radius: 18px; transition: transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s; }
.tcl-feat:hover { transform: translateY(-6px) rotate(-1.5deg); box-shadow: 5px 5px 0 var(--plum); }
.tcl-feat-ic { width: 38px; height: 38px; margin: 0 auto 8px; border-radius: 12px; background: var(--plum); color: var(--lime); display: grid; place-items: center; transition: transform .4s cubic-bezier(.3,1.6,.5,1); }
.tcl-feat:hover .tcl-feat-ic { transform: rotate(360deg); background: var(--lime); color: var(--plum); }
.tcl-feat p { margin: 0; font-size: 12px; font-weight: 700; line-height: 1.3; }

@media (prefers-reduced-motion: reduce) {
  .tcl, .tcl *, .tcl *::before, .tcl *::after { animation: none !important; transition: none !important; }
}
`

const FEATURES = [
  { Icon: Users, label: 'Manage Students' },
  { Icon: Target, label: 'Track Payments' },
  { Icon: BarChart3, label: 'Admin Control' },
]

const AdminLogin = () => {
  const navigate = useNavigate()
  const { loginAdmin, error, clearError, loading } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()

    const result = await loginAdmin(formData)
    if (result.success) {
      navigate('/admin/dashboard') // client-side navigation
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="tcl">
      <style>{styles}</style>

      {/* decorative background */}
      <div className="tcl-grid" />
      <div className="tcl-blob" style={{ width: 360, height: 360, background: '#fff', opacity: .55, top: -90, left: -90, animation: 'tcl-float-b 12s ease-in-out infinite' }} />
      <div className="tcl-blob" style={{ width: 300, height: 300, background: '#C6FF3D', opacity: .35, bottom: -80, right: '20%', animation: 'tcl-float-b 15s ease-in-out infinite reverse' }} />
      <div className="tcl-ball" style={{ width: 44, height: 44, top: '12%', right: '8%', animation: 'tcl-float 6s ease-in-out infinite' }} />
      <div className="tcl-ball" style={{ width: 26, height: 26, bottom: '12%', left: '6%', animation: 'tcl-float 5s ease-in-out infinite .8s' }} />

      <div className="tcl-wrap">
        {/* Header */}
        <div className="tcl-header">
          <div className="tcl-brand">
            <div className="tcl-logo">
              <img src="/TikoneCricketGurukul1.png" alt="Tikone Cricket Gurukul logo" />
            </div>
            <div>
              <h1 className="tcl-title">Tikone Cricket Gurukul</h1>
              <p className="tcl-sub">Admin Portal</p>
            </div>
          </div>
          <span className="tcl-chip">
            <Settings size={16} />
            Manage your cricket academy
          </span>
        </div>

        {/* Card */}
        <div className="tcl-card">
          <div className="tcl-card-top">
            <div className="tcl-card-ic"><Shield size={24} /></div>
            <h2>Admin Access</h2>
          </div>
          <p className="tcl-card-lead">Sign in to manage the academy</p>

          <form onSubmit={handleSubmit} className="tcl-form">
            <div>
              <label htmlFor="email" className="tcl-label">
                <Mail size={16} />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter admin email"
                autoComplete="email"
                required
                className="tcl-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="tcl-label">
                <Lock size={16} />
                Password
              </label>
              <div className="tcl-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                  className="tcl-input has-eye"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="tcl-eye"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="tcl-error" role="alert">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}

            <button type="submit" className="tcl-btn" disabled={loading}>
              {loading ? (
                <>
                  <svg className="tcl-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle opacity=".25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path opacity=".85" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Sign In as Admin
                  <ArrowRight size={18} className="arr" />
                </>
              )}
            </button>
          </form>

          <p className="tcl-switch">
            Are you a student?
            <button type="button" onClick={() => navigate('/student/login')} className="tcl-link">
              Student login
            </button>
          </p>
        </div>

        {/* Features */}
        <div className="tcl-feats">
          {FEATURES.map(({ Icon, label }) => (
            <div key={label} className="tcl-feat">
              <div className="tcl-feat-ic"><Icon size={18} /></div>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
