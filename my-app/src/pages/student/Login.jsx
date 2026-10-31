import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Trophy, Users, Target, ArrowRight, Eye, EyeOff, GraduationCap, Star, Mail, Lock, AlertCircle } from 'lucide-react'

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgst {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D; --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum);
  position: relative; overflow: hidden; min-height: 100vh; display: grid; place-items: center; padding: 32px 16px;
  background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 55%, #fff0fa 100%); background-size: 200% 200%;
  animation: tcgst-bg 14s ease infinite;
}
.tcgst * { box-sizing: border-box; }
@keyframes tcgst-bg { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
@keyframes tcgst-float { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(30px,-26px) scale(1.12) } }
@keyframes tcgst-bob { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-20px) rotate(8deg) } }
@keyframes tcgst-rise { from { opacity: 0; transform: translateY(40px) scale(.95) rotate(-1.5deg) } to { opacity: 1; transform: none } }
@keyframes tcgst-in { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
@keyframes tcgst-pop { 0% { opacity: 0; transform: scale(.6) translateY(20px) } 100% { opacity: 1; transform: none } }
@keyframes tcgst-shimmer { to { background-position: 200% center } }
@keyframes tcgst-ping { 0% { box-shadow: 0 0 0 0 rgba(198,255,61,.9) } 100% { box-shadow: 0 0 0 16px rgba(198,255,61,0) } }
@keyframes tcgst-shake { 0%,100% { transform: translateX(0) } 20%,60% { transform: translateX(-8px) } 40%,80% { transform: translateX(8px) } }
@keyframes tcgst-spin { to { transform: rotate(360deg) } }
@keyframes tcgst-spinslow { to { transform: rotate(360deg) } }

.tcgst-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
.tcgst-ball { position: absolute; border-radius: 50%; pointer-events: none; background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%); box-shadow: inset -5px -7px 12px rgba(0,0,0,.25), 0 10px 20px rgba(42,10,63,.25); }
.tcgst-ball::after { content: ''; position: absolute; inset: 8% 45%; border-left: 2px dashed rgba(255,255,255,.7); border-right: 2px dashed rgba(255,255,255,.7); border-radius: 50%; }
.tcgst-grid { position: absolute; inset: 0; pointer-events: none; opacity: .35;
  background-image: linear-gradient(rgba(42,10,63,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(42,10,63,.08) 1px, transparent 1px); background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(circle at 50% 45%, #000 20%, transparent 75%); mask-image: radial-gradient(circle at 50% 45%, #000 20%, transparent 75%); }

.tcgst-wrap { position: relative; z-index: 2; width: 100%; max-width: 460px; }

/* header */
.tcgst-top { text-align: center; margin-bottom: 38px; animation: tcgst-in .7s both; }
.tcgst-brand { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 18px; }
.tcgst-logo { position: relative; width: 80px; height: 80px; flex-shrink: 0; border-radius: 24px; background: #fff; border: 3px solid var(--plum); overflow: hidden; box-shadow: 5px 5px 0 var(--plum), 0 0 0 0 var(--lime); transform: rotate(-4deg); transition: transform .4s cubic-bezier(.3,1.6,.5,1), box-shadow .3s; }
.tcgst-logo:hover { transform: rotate(4deg) scale(1.08); box-shadow: 8px 8px 0 var(--plum); }
.tcgst-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
.tcgst-bt { text-align: left; }
.tcgst-bt h1 { margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; letter-spacing: -.03em; line-height: 1.05; font-size: clamp(1.5rem, 6vw, 2rem);
  background: linear-gradient(90deg, var(--plum), #b0108a, var(--plum-2), #b0108a, var(--plum)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcgst-shimmer 5s linear infinite; }
.tcgst-bt p { margin: 6px 0 0; width: fit-content; padding: 3px 12px; border-radius: 999px; background: var(--plum); color: var(--lime); font-size: 13px; font-weight: 700; }
.tcgst-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; background: #fff; border: 2px solid var(--plum); font-size: 13px; font-weight: 700; }
.tcgst-chip svg { color: #b0108a; animation: tcgst-spinslow 6s linear infinite; }

/* card */
.tcgst-card { position: relative; background: #fff; border: 3px solid var(--plum); border-radius: 32px; box-shadow: 14px 14px 0 var(--plum); padding: 38px 30px 30px; animation: tcgst-rise .8s .1s cubic-bezier(.2,.8,.2,1) both; }
@media (max-width: 480px) { .tcgst-card { padding: 34px 20px 24px; box-shadow: 8px 8px 0 var(--plum); } }
.tcgst-badge { position: absolute; top: -32px; left: 50%; transform: translateX(-50%); width: 64px; height: 64px; border-radius: 22px; background: var(--plum); color: var(--lime); border: 3px solid var(--plum); display: grid; place-items: center; box-shadow: 0 0 0 5px var(--lime); animation: tcgst-ping 2s infinite; }
.tcgst-title { margin: 10px 0 6px; text-align: center; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; letter-spacing: -.03em; font-size: clamp(1.7rem, 6vw, 2.2rem); line-height: 1.05; }
.tcgst-welcome { margin: 0 0 24px; text-align: center; font-size: 14px; color: rgba(42,10,63,.72); }

.tcgst-form { display: flex; flex-direction: column; gap: 18px; }
.tcgst-field { animation: tcgst-in .6s both; animation-delay: var(--d, 0ms); }
.tcgst-label { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; font-size: 12px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: var(--plum-2); }
.tcgst-inwrap { position: relative; }
.tcgst-input { width: 100%; height: 52px; padding: 0 16px; border-radius: 16px; border: 2px solid var(--plum); background: var(--cream); font-family: inherit; font-size: 15px; font-weight: 500; color: var(--plum); outline: none; transition: box-shadow .25s, transform .25s, background .25s; }
.tcgst-input::placeholder { color: rgba(42,10,63,.45); }
.tcgst-input:focus { background: #fff; transform: translateY(-2px); box-shadow: 5px 5px 0 var(--pink); }
.tcgst-input.pw { padding-right: 54px; }
.tcgst-label svg { transition: transform .3s; }
.tcgst-field:focus-within .tcgst-label svg { transform: scale(1.25) rotate(-8deg); color: #b0108a; }
.tcgst-eye { position: absolute; top: 50%; right: 8px; transform: translateY(-50%); width: 38px; height: 38px; border-radius: 11px; border: none; background: transparent; color: var(--plum-2); cursor: pointer; display: grid; place-items: center; transition: background .2s; }
.tcgst-eye:hover { background: var(--pink-soft); }

.tcgst-err { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 14px; background: #ffe1e6; border: 2px solid #c0123b; color: #9c0f30; font-size: 14px; font-weight: 600; animation: tcgst-shake .5s both; }
.tcgst-err svg { flex-shrink: 0; margin-top: 1px; }

.tcgst-btn { position: relative; overflow: hidden; width: 100%; height: 56px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; border-radius: 16px; border: 2px solid var(--plum); background: var(--plum); color: var(--lime); font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer; transition: transform .25s, box-shadow .25s, background .25s; animation: tcgst-in .6s .25s both; }
.tcgst-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.35), transparent); transform: skewX(-20deg); transition: left .7s; }
.tcgst-btn:hover:not(:disabled)::before { left: 140%; }
.tcgst-btn:hover:not(:disabled) { transform: translateY(-4px) rotate(-1deg); box-shadow: 6px 6px 0 var(--pink); background: var(--plum-2); }
.tcgst-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
.tcgst-btn:disabled { opacity: .75; cursor: wait; }
.tcgst-btn .arr { transition: transform .25s; }
.tcgst-btn:hover .arr { transform: translateX(5px); }
.tcgst-spin { width: 20px; height: 20px; border-radius: 50%; border: 3px solid rgba(198,255,61,.3); border-top-color: var(--lime); animation: tcgst-spin .7s linear infinite; }
.tcgst-btn:focus-visible, .tcgst-input:focus-visible, .tcgst-admin:focus-visible, .tcgst-eye:focus-visible { outline: 3px solid var(--plum-2); outline-offset: 3px; }

.tcgst-foot { margin: 22px 0 0; text-align: center; font-size: 14px; color: rgba(42,10,63,.72); padding-top: 18px; border-top: 2px dashed rgba(42,10,63,.2); }
.tcgst-admin { position: relative; background: none; border: none; padding: 0; font-family: inherit; font-size: 14px; font-weight: 800; color: #b0108a; cursor: pointer; }
.tcgst-admin::after { content: ''; position: absolute; left: 0; bottom: -2px; height: 2px; width: 100%; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform .3s; }
.tcgst-admin:hover::after { transform: scaleX(1); }
.tcgst-admin:hover { color: var(--plum); }

/* feature tiles */
.tcgst-feats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 34px; }
.tcgst-feat { text-align: center; padding: 14px 8px; border-radius: 20px; background: #fff; border: 3px solid var(--plum); animation: tcgst-pop .6s both; animation-delay: calc(var(--i) * 120ms + 500ms); transition: transform .3s cubic-bezier(.3,1.6,.5,1), box-shadow .3s, background .3s; }
.tcgst-feat:hover { transform: translateY(-6px) rotate(-2deg); box-shadow: 5px 5px 0 var(--plum); background: var(--lime); }
.tcgst-feat svg { display: block; margin: 0 auto 8px; color: var(--plum); transition: transform .5s cubic-bezier(.3,1.6,.5,1); }
.tcgst-feat:hover svg { transform: rotate(360deg) scale(1.15); }
.tcgst-feat p { margin: 0; font-size: 12px; font-weight: 800; line-height: 1.2; }

@media (prefers-reduced-motion: reduce) { .tcgst, .tcgst * { animation: none !important; transition: none !important; } }
`

const StudentLogin = () => {
  const { loginUser, error, clearError, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()

    const result = await loginUser(formData)
    if (result.success) {
      window.location.href = '/student/dashboard'
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="tcgst">
      <style>{styles}</style>
      <div className="tcgst-grid" />
      <div className="tcgst-blob" style={{ width: 360, height: 360, background: '#fff', opacity: 0.55, top: -90, left: -90, animation: 'tcgst-float 12s ease-in-out infinite' }} />
      <div className="tcgst-blob" style={{ width: 300, height: 300, background: '#C6FF3D', opacity: 0.3, bottom: -80, right: -60, animation: 'tcgst-float 15s ease-in-out infinite reverse' }} />
      <div className="tcgst-ball" style={{ width: 44, height: 44, top: '10%', right: '10%', animation: 'tcgst-bob 6s ease-in-out infinite' }} />
      <div className="tcgst-ball" style={{ width: 26, height: 26, bottom: '12%', left: '8%', animation: 'tcgst-bob 5s ease-in-out infinite .8s' }} />

      <div className="tcgst-wrap">
        {/* Header */}
        <div className="tcgst-top">
          <div className="tcgst-brand">
            <div className="tcgst-logo">
              <img
                src="/TikoneCricketGurukul1.png"
                alt="Logo"
              />
            </div>
            <div className="tcgst-bt">
              <h1>Tikone Cricket Gurukul</h1>
              <p>Student Portal</p>
            </div>
          </div>
          <span className="tcgst-chip">
            <Star size={16} />
            Thergaon's Premier Cricket Academy
          </span>
        </div>

        <div className="tcgst-card">
          <div className="tcgst-badge"><GraduationCap size={30} /></div>
          <h2 className="tcgst-title">Student Portal</h2>
          <p className="tcgst-welcome">Welcome back! Sign in to your account.</p>

          <form onSubmit={handleSubmit} className="tcgst-form">
            <div className="tcgst-field" style={{ '--d': '100ms' }}>
              <label htmlFor="email" className="tcgst-label">
                <Mail size={16} />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="tcgst-input"
              />
            </div>

            <div className="tcgst-field" style={{ '--d': '170ms' }}>
              <label htmlFor="password" className="tcgst-label">
                <Lock size={16} />
                Password
              </label>
              <div className="tcgst-inwrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="tcgst-input pw"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="tcgst-eye"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="tcgst-err" key={String(error)} role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="tcgst-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="tcgst-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <GraduationCap size={20} />
                  Sign In
                  <ArrowRight size={18} className="arr" />
                </>
              )}
            </button>
          </form>

          <p className="tcgst-foot">
            Are you an admin?{' '}
            <button
              onClick={() => window.location.href = '/admin/login'}
              className="tcgst-admin"
            >
              Admin login
            </button>
          </p>
        </div>

        {/* Features */}
        <div className="tcgst-feats">
          <div className="tcgst-feat" style={{ '--i': 0 }}>
            <Users size={26} />
            <p>500+ Students</p>
          </div>
          <div className="tcgst-feat" style={{ '--i': 1 }}>
            <Trophy size={26} />
            <p>50+ Champions</p>
          </div>
          <div className="tcgst-feat" style={{ '--i': 2 }}>
            <Target size={26} />
            <p>Expert Coaching</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentLogin
