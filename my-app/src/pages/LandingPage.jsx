import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Users, Target, Award, ArrowRight, Star, CheckCircle, Play, Shield, GraduationCap, Zap, Heart, TrendingUp } from 'lucide-react'
import Layout from '../components/layout/Layout'

/* ------------------------------------------------------------------
   THEME
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
@keyframes tcg-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes tcg-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(198,255,61,.65) } 100% { box-shadow: 0 0 0 22px rgba(198,255,61,0) } }
@keyframes tcg-bounce-soft { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes tcg-pop-in { 0% { opacity: 0; transform: scale(.7) translateY(20px) } 100% { opacity: 1; transform: scale(1) translateY(0) } }
@keyframes tcg-wiggle { 0%,100% { transform: rotate(-4deg) } 50% { transform: rotate(4deg) } }
@keyframes tcg-gradient-move { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }

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

/* ---------- hero ---------- */
.tcg-hero { position: relative; padding: 56px 0 90px; background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 55%, #fff0fa 100%); background-size: 200% 200%; animation: tcg-gradient-move 14s ease infinite; overflow: hidden; }
.tcg-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 16px; position: relative; z-index: 2; }
.tcg-hero-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center; }
@media (min-width: 1024px) { .tcg-hero-grid { grid-template-columns: 1.05fr .95fr; gap: 64px; } .tcg-hero { padding: 90px 0 120px; } }

.tcg-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; font-weight: 700; font-size: 13px; background: var(--plum); color: var(--lime); animation: tcg-pop-in .7s both; }
.tcg-chip svg { animation: tcg-spin 6s linear infinite; }
.tcg-chip.light { background: #fff; color: var(--plum); border: 2px solid var(--plum); }
.tcg-chip.ghost { background: rgba(255,255,255,.18); color: #fff; border: 1px solid rgba(255,255,255,.4); }

.tcg-h1 { font-size: clamp(2.4rem, 7vw, 5rem); font-weight: 800; line-height: 1.02; margin: 18px 0 0; color: var(--plum); animation: tcg-pop-in .8s .1s both; }
.tcg-shimmer { display: block; background: linear-gradient(90deg, var(--plum) 0%, #b0108a 25%, var(--plum-2) 50%, #b0108a 75%, var(--plum) 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcg-shimmer 5s linear infinite; position: relative; width: fit-content; }
.tcg-shimmer::after { content: ''; position: absolute; left: 0; right: 0; bottom: 2px; height: 10px; background: var(--lime); z-index: -1; border-radius: 6px; transform-origin: left; animation: tcg-underline 1.2s .8s both cubic-bezier(.2,.8,.2,1); }
@keyframes tcg-underline { from { transform: scaleX(0) } to { transform: scaleX(1) } }
.tcg-lead { font-size: clamp(1rem, 2.2vw, 1.2rem); line-height: 1.7; max-width: 560px; margin-top: 20px; color: rgba(42,10,63,.82); animation: tcg-pop-in .8s .25s both; }

.tcg-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 32px; animation: tcg-pop-in .8s .4s both; }
.tcg-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 26px; border-radius: 16px; font-weight: 700; font-size: 15px; text-decoration: none; border: 2px solid var(--plum); transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s, background .25s, color .25s; cursor: pointer; }
.tcg-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.55), transparent); transform: skewX(-20deg); transition: left .7s; }
.tcg-btn:hover::before { left: 140%; }
.tcg-btn:hover { transform: translateY(-4px) rotate(-1deg); box-shadow: 6px 6px 0 var(--plum); }
.tcg-btn:active { transform: translateY(0); box-shadow: 0 0 0 var(--plum); }
.tcg-btn.primary { background: var(--plum); color: #fff; }
.tcg-btn.primary:hover { background: var(--plum-2); }
.tcg-btn.outline { background: #fff; color: var(--plum); }
.tcg-btn.outline:hover { background: var(--lime); }
.tcg-btn.lime { background: var(--lime); color: var(--plum); }
.tcg-btn.white { background: #fff; color: var(--plum); border-color: #fff; }
.tcg-btn.white:hover { box-shadow: 6px 6px 0 var(--lime); }
.tcg-btn.line { background: transparent; color: #fff; border-color: rgba(255,255,255,.5); }
.tcg-btn.line:hover { background: rgba(255,255,255,.12); box-shadow: 6px 6px 0 var(--pink); }
.tcg-btn.sm { padding: 10px 18px; font-size: 14px; border-radius: 12px; }
.tcg-btn .arr { transition: transform .25s; }
.tcg-btn:hover .arr { transform: translateX(5px); }
@media (max-width: 639px) { .tcg-actions .tcg-btn { width: 100%; } }

.tcg-stats { display: flex; flex-wrap: wrap; gap: 18px 28px; margin-top: 36px; animation: tcg-pop-in .8s .55s both; }
.tcg-stat { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 14px; }
.tcg-stat-ic { width: 42px; height: 42px; border-radius: 14px; background: #fff; border: 2px solid var(--plum); display: grid; place-items: center; transition: transform .3s; }
.tcg-stat:hover .tcg-stat-ic { transform: rotate(-12deg) scale(1.12); background: var(--lime); }
.tcg-stat b { font-family: 'Bricolage Grotesque', sans-serif; font-size: 20px; display: block; line-height: 1; }

/* hero image */
.tcg-imgwrap { position: relative; max-width: 620px; margin: 0 auto; width: 100%; animation: tcg-pop-in 1s .3s both; }
.tcg-imgframe { position: relative; border-radius: 32px; border: 3px solid var(--plum); box-shadow: 14px 14px 0 var(--plum); overflow: hidden; transform: rotate(2deg); transition: transform .5s cubic-bezier(.2,.8,.2,1), box-shadow .5s; background: var(--plum); }
.tcg-imgframe:hover { transform: rotate(0deg) scale(1.02); box-shadow: 20px 20px 0 var(--plum); }
.tcg-imgframe img { display: block; width: 100%; height: auto; aspect-ratio: 4/3; object-fit: cover; transition: transform 1.2s cubic-bezier(.2,.8,.2,1); }
.tcg-imgframe:hover img { transform: scale(1.08); }
.tcg-imgframe::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(42,10,63,.45), transparent 55%); pointer-events: none; }
.tcg-watch { position: absolute; z-index: 3; bottom: -22px; left: -8px; display: flex; align-items: center; gap: 14px; padding: 14px 20px; background: #fff; border: 3px solid var(--plum); border-radius: 20px; box-shadow: 6px 6px 0 var(--lime); animation: tcg-bounce-soft 3.2s ease-in-out infinite; }
.tcg-watch .pbtn { width: 46px; height: 46px; border-radius: 50%; background: var(--plum); color: var(--lime); display: grid; place-items: center; animation: tcg-pulse-ring 1.8s infinite; }
.tcg-watch p { margin: 0; font-size: 12px; color: rgba(42,10,63,.65); }
.tcg-watch p.t { font-weight: 800; color: var(--plum); font-size: 14px; }
.tcg-sticker { position: absolute; z-index: 3; top: -18px; right: -6px; background: var(--lime); color: var(--plum); font-weight: 800; font-family: 'Bricolage Grotesque', sans-serif; padding: 10px 16px; border-radius: 999px; border: 3px solid var(--plum); font-size: 14px; animation: tcg-wiggle 2.4s ease-in-out infinite; }

/* ---------- marquee ---------- */
.tcg-marquee { background: var(--plum); color: var(--pink); overflow: hidden; padding: 16px 0; border-block: 3px solid var(--plum); transform: rotate(-1deg) scale(1.03); margin: -30px 0 20px; position: relative; z-index: 4; }
.tcg-marquee-track { display: flex; width: max-content; animation: tcg-marquee 26s linear infinite; }
.tcg-marquee:hover .tcg-marquee-track { animation-play-state: paused; }
.tcg-marquee span { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 22px; padding: 0 28px; display: inline-flex; align-items: center; gap: 28px; white-space: nowrap; }
.tcg-marquee span i { color: var(--lime); font-style: normal; }

/* ---------- sections ---------- */
.tcg-section { position: relative; padding: 70px 0; overflow: hidden; }
@media (min-width: 1024px) { .tcg-section { padding: 100px 0; } }
.tcg-head { text-align: center; max-width: 760px; margin: 0 auto 56px; }
.tcg-h2 { font-size: clamp(1.9rem, 5vw, 3.4rem); font-weight: 800; line-height: 1.08; margin: 16px 0 14px; }
.tcg-sub { font-size: clamp(1rem, 2vw, 1.15rem); line-height: 1.7; color: rgba(42,10,63,.75); }

/* feature cards */
.tcg-features { background: var(--cream); }
.tcg-fgrid { display: grid; gap: 22px; grid-template-columns: 1fr; }
@media (min-width: 640px) { .tcg-fgrid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .tcg-fgrid { grid-template-columns: repeat(4, 1fr); gap: 26px; } }
.tcg-fcard { position: relative; text-align: center; padding: 34px 24px; border-radius: 28px; background: #fff; border: 3px solid var(--plum); transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s, background .35s; overflow: hidden; }
.tcg-fcard::before { content: ''; position: absolute; width: 180px; height: 180px; border-radius: 50%; background: var(--pink); top: -90px; right: -90px; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
.tcg-fcard:hover { transform: translateY(-10px) rotate(-1.2deg); box-shadow: 10px 10px 0 var(--plum); }
.tcg-fcard:hover::before { transform: scale(3.4); }
.tcg-ficon { position: relative; z-index: 1; margin: 0 auto 22px; width: 72px; height: 72px; border-radius: 22px; background: var(--plum); color: var(--lime); display: grid; place-items: center; transition: transform .5s cubic-bezier(.3,1.6,.5,1); }
.tcg-fcard:hover .tcg-ficon { transform: rotate(360deg) scale(1.1); background: var(--lime); color: var(--plum); }
.tcg-fcard h3 { position: relative; z-index: 1; font-size: 22px; font-weight: 800; margin: 0 0 10px; }
.tcg-fcard p { position: relative; z-index: 1; margin: 0; line-height: 1.65; color: rgba(42,10,63,.75); }

/* programs */
.tcg-programs { background: linear-gradient(180deg, var(--pink) 0%, var(--pink-soft) 100%); }
.tcg-pgrid { display: grid; gap: 28px; grid-template-columns: 1fr; padding-top: 14px; }
@media (min-width: 768px) { .tcg-pgrid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .tcg-pgrid { grid-template-columns: repeat(3, 1fr); } }
.tcg-pcard { position: relative; padding: 34px 28px; background: #fff; border: 3px solid var(--plum); border-radius: 30px; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; display: flex; flex-direction: column; gap: 22px; }
.tcg-pcard:hover { transform: translateY(-12px) rotate(1deg); box-shadow: 12px 12px 0 var(--plum); }
.tcg-pcard.pop { background: var(--plum); color: #fff; box-shadow: 10px 10px 0 var(--lime); }
.tcg-pcard.pop:hover { box-shadow: 16px 16px 0 var(--lime); transform: translateY(-12px) rotate(-1deg); }
.tcg-pcard.pop p, .tcg-pcard.pop li span, .tcg-pcard.pop .small { color: rgba(255,255,255,.8) !important; }
.tcg-ptop { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.tcg-ptop h3 { margin: 0; font-size: 22px; font-weight: 800; }
.tcg-tag { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 800; border: 2px solid var(--plum); background: var(--pink); color: var(--plum); }
.tcg-tag.lime { background: var(--lime); }
.tcg-ribbon { position: absolute; top: -18px; left: 50%; transform: translateX(-50%); background: var(--lime); color: var(--plum); border: 3px solid var(--plum); padding: 6px 18px; border-radius: 999px; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; animation: tcg-bounce-soft 2.6s ease-in-out infinite; }
.tcg-ribbon svg { animation: tcg-pulse-heart 1.2s ease-in-out infinite; }
@keyframes tcg-pulse-heart { 0%,100% { transform: scale(1) } 50% { transform: scale(1.35) } }
.tcg-pcard p { margin: 0; line-height: 1.65; color: rgba(42,10,63,.75); }
.tcg-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.tcg-list li { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 500; transition: transform .25s; }
.tcg-list li:hover { transform: translateX(6px); }
.tcg-tick { width: 24px; height: 24px; border-radius: 50%; background: var(--lime); border: 2px solid var(--plum); color: var(--plum); display: grid; place-items: center; flex-shrink: 0; transition: transform .3s; }
.tcg-list li:hover .tcg-tick { transform: rotate(360deg); }
.tcg-pfoot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: auto; padding-top: 22px; border-top: 2px dashed rgba(42,10,63,.25); }
.tcg-pcard.pop .tcg-pfoot { border-top-color: rgba(255,255,255,.3); }
.tcg-price { font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; font-weight: 800; color: #c0127f; line-height: 1; }
.tcg-pcard.pop .tcg-price { color: var(--lime); }
.tcg-pcard .small { display: block; margin-top: 4px; font-size: 12px; color: rgba(42,10,63,.6); }
.tcg-pcard.pop .tcg-btn.primary { background: var(--lime); color: var(--plum); border-color: var(--lime); }

/* CTA */
.tcg-cta { position: relative; padding: 90px 0; background: var(--plum); color: #fff; text-align: center; overflow: hidden; }
.tcg-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 20% 20%, rgba(255,168,224,.35), transparent 45%), radial-gradient(circle at 85% 80%, rgba(198,255,61,.22), transparent 40%); animation: tcg-gradient-move 10s ease infinite; background-size: 140% 140%; }
.tcg-cta h2 { font-size: clamp(2rem, 5.5vw, 3.8rem); font-weight: 800; line-height: 1.06; margin: 18px 0 16px; color: #fff; }
.tcg-cta h2 em { font-style: normal; color: var(--pink); }
.tcg-cta p { max-width: 640px; margin: 0 auto 34px; font-size: clamp(1rem, 2vw, 1.15rem); line-height: 1.7; color: rgba(255,255,255,.82); }
.tcg-cta .row { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
.tcg-cta .row .tcg-btn { min-width: 220px; }

/* custom hover cursor glow for sections */
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
      { threshold: 0.15 }
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

function Counter({ to, suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf
    const run = () => {
      const start = performance.now()
      const dur = 1800
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(to * eased)
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    if (typeof IntersectionObserver === 'undefined') { setVal(to); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect() } }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to])
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>
}

const MARQUEE = ['Expert Coaches', 'Modern Facilities', 'Proven Results', 'Flexible Plans', 'Champions Made Here', 'Thergoan\'s Premier Cricket Academy']

export default function LandingPage() {
  return (
    <Layout>
      <style>{styles}</style>
      <div className="tcg">
        {/* Hero Section */}
        <section className="tcg-hero">
          <div className="tcg-grid" />
          <div className="tcg-blob" style={{ width: 360, height: 360, background: '#fff', opacity: .55, top: -90, left: -90, animation: 'tcg-float-b 12s ease-in-out infinite' }} />
          <div className="tcg-blob" style={{ width: 300, height: 300, background: '#C6FF3D', opacity: .35, bottom: -80, right: '28%', animation: 'tcg-float-b 15s ease-in-out infinite reverse' }} />
          <div className="tcg-ball" style={{ width: 44, height: 44, top: '14%', right: '8%', animation: 'tcg-float 6s ease-in-out infinite' }} />
          <div className="tcg-ball" style={{ width: 26, height: 26, bottom: '12%', left: '6%', animation: 'tcg-float 5s ease-in-out infinite .8s' }} />

          <div className="tcg-container">
            <div className="tcg-hero-grid">
              <div>
                <span className="tcg-chip">
                  <Star size={16} />
                  <span>Thergoan's Premier Cricket Academy</span>
                </span>
                <h1 className="tcg-h1">
                  Welcome to
                  <span className="tcg-shimmer"> Tikone Cricket Gurukul</span>
                </h1>
                <p className="tcg-lead">
                  Elevate your cricket journey at Tikone Cricket Gurukul, Thergoan. World-class coaching, modern facilities, and a legacy of producing champions. Join us and become the next cricket star!
                </p>

                <div className="tcg-actions">
                  <Link to="/student/login" className="tcg-btn outline">
                    <Users size={20} />
                    Student Login
                  </Link>
                  <Link to="/admin/login" className="tcg-btn primary">
                    <Shield size={20} />
                    Admin Portal
                  </Link>
                </div>

                <div className="tcg-stats">
                  <div className="tcg-stat">
                    <div className="tcg-stat-ic"><Users size={18} /></div>
                    <div><b><Counter to={300} suffix="+" /></b>Students</div>
                  </div>
                  <div className="tcg-stat">
                    <div className="tcg-stat-ic"><Trophy size={18} /></div>
                    <div><b><Counter to={35} suffix="+" /></b>Champions</div>
                  </div>
                  <div className="tcg-stat">
                    <div className="tcg-stat-ic"><Star size={18} /></div>
                    <div><b><Counter to={4.9} decimals={1} />/5</b>Rating</div>
                  </div>
                </div>
              </div>

              <div className="tcg-imgwrap">
                <div className="tcg-sticker">🏏 Est. Champions</div>
                <div className="tcg-imgframe">
                  <img src="/tcg_ground.jpeg" alt="Tikone Cricket Academy, Pimpri" />
                </div>
                <div className="tcg-watch">
                  <div className="pbtn"><Play size={20} fill="currentColor" /></div>
                  <div>
                    <p className="t">Watch Training</p>
                    <p>See our facilities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="tcg-marquee" aria-hidden="true">
          <div className="tcg-marquee-track">
            {[...MARQUEE, ...MARQUEE].map((t, i) => (
              <span key={i}>{t} <i>✦</i></span>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <section className="tcg-section tcg-features">
          <div className="tcg-blob" style={{ width: 280, height: 280, background: 'var(--pink)', opacity: .45, top: 40, left: -100, animation: 'tcg-float-b 14s ease-in-out infinite' }} />
          <div className="tcg-container">
            <Reveal>
              <div className="tcg-head">
                <span className="tcg-chip light">
                  <Zap size={16} />
                  Why Choose Us
                </span>
                <h2 className="tcg-h2">Why Choose Tikone Cricket Gurukul?</h2>
                <p className="tcg-sub">
                  We provide comprehensive cricket training with modern facilities and expert coaching to help you excel in your cricket journey.
                </p>
              </div>
            </Reveal>

            <div className="tcg-fgrid">
              {[
                { Icon: Users, title: 'Expert Coaches', text: 'Learn from certified professionals with years of experience and a passion for cricket.' },
                { Icon: Target, title: 'Modern Facilities', text: 'State-of-the-art equipment, well-maintained grounds, and professional training facilities.' },
                { Icon: Award, title: 'Proven Results', text: 'Track record of students excelling in competitions and reaching professional levels.' },
                { Icon: Trophy, title: 'Flexible Plans', text: 'Various training packages to suit your needs, schedule, and budget requirements.' },
              ].map(({ Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 120}>
                  <div className="tcg-fcard">
                    <div className="tcg-ficon"><Icon size={32} /></div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="tcg-section tcg-programs">
          <div className="tcg-grid" />
          <div className="tcg-ball" style={{ width: 36, height: 36, top: '8%', right: '6%', animation: 'tcg-float 7s ease-in-out infinite' }} />
          <div className="tcg-blob" style={{ width: 320, height: 320, background: '#fff', opacity: .5, bottom: -100, left: '10%', animation: 'tcg-float-b 13s ease-in-out infinite' }} />
          <div className="tcg-container">
            <Reveal>
              <div className="tcg-head">
                <span className="tcg-chip light">
                  <TrendingUp size={16} />
                  Our Programs
                </span>
                <h2 className="tcg-h2">Our Training Programs</h2>
                <p className="tcg-sub">
                  Comprehensive programs designed for all skill levels, from beginners to advanced players.
                </p>
              </div>
            </Reveal>

            <div className="tcg-pgrid">
              {/* Beginner */}
              <Reveal delay={0}>
                <div className="tcg-pcard">
                  <div className="tcg-ptop">
                    <h3>Beginner Program</h3>
                    <span className="tcg-tag"><Star size={12} /> New</span>
                  </div>
                  <p>Perfect for those starting their cricket journey. Learn basic techniques and fundamentals.</p>
                  <ul className="tcg-list">
                    {['Basic batting techniques', 'Bowling fundamentals', 'Fielding basics'].map((t) => (
                      <li key={t}><span className="tcg-tick"><CheckCircle size={14} /></span><span>{t}</span></li>
                    ))}
                  </ul>
                  <div className="tcg-pfoot">
                    <div>
                      <span className="tcg-price">₹2,000/month</span>
                      <span className="small">Basic Training</span>
                    </div>
                    <button type="button" className="tcg-btn primary sm">
                      Learn More <ArrowRight size={16} className="arr" />
                    </button>
                  </div>
                </div>
              </Reveal>

              {/* Intermediate */}
              <Reveal delay={150}>
                <div className="tcg-pcard pop">
                  <div className="tcg-ribbon"><Heart size={14} fill="currentColor" /> Popular</div>
                  <div className="tcg-ptop">
                    <h3>Intermediate Program</h3>
                  </div>
                  <p>Advanced techniques and match practice for players with basic cricket knowledge.</p>
                  <ul className="tcg-list">
                    {['Advanced batting skills', 'Specialized bowling', 'Match strategies'].map((t) => (
                      <li key={t}><span className="tcg-tick"><CheckCircle size={14} /></span><span>{t}</span></li>
                    ))}
                  </ul>
                  <div className="tcg-pfoot">
                    <div>
                      <span className="tcg-price">₹3,500/month</span>
                      <span className="small">Advanced Training</span>
                    </div>
                    <button type="button" className="tcg-btn primary sm">
                      Learn More <ArrowRight size={16} className="arr" />
                    </button>
                  </div>
                </div>
              </Reveal>

              {/* Advanced */}
              <Reveal delay={300}>
                <div className="tcg-pcard">
                  <div className="tcg-ptop">
                    <h3>Advanced Program</h3>
                    <span className="tcg-tag lime"><Trophy size={12} /> Elite</span>
                  </div>
                  <p>Professional-level training for serious players aiming for competitive cricket.</p>
                  <ul className="tcg-list">
                    {['Professional Personal Coaching', 'Competition preparation', 'Performance analysis'].map((t) => (
                      <li key={t}><span className="tcg-tick"><CheckCircle size={14} /></span><span>{t}</span></li>
                    ))}
                  </ul>
                  <div className="tcg-pfoot">
                    <div>
                      <span className="tcg-price">₹6,000/month</span>
                      <span className="small">Elite Training</span>
                    </div>
                    <button type="button" className="tcg-btn primary sm">
                      Learn More <ArrowRight size={16} className="arr" />
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="tcg-cta">
          <div className="tcg-blob" style={{ width: 260, height: 260, background: 'var(--pink)', opacity: .25, top: -60, right: '12%', animation: 'tcg-float-b 11s ease-in-out infinite' }} />
          <div className="tcg-ball" style={{ width: 34, height: 34, bottom: '16%', left: '9%', animation: 'tcg-float 6s ease-in-out infinite' }} />
          <div className="tcg-container">
            <Reveal>
              <span className="tcg-chip ghost">
                <Zap size={16} />
                Ready to Start?
              </span>
              <h2>Ready to Start Your <em>Cricket Journey?</em></h2>
              <p>
                Join our academy today and take the first step towards becoming a professional cricketer.
                Our expert coaches are ready to guide you to success.
              </p>
              <div className="row">
                <Link to="/student/register" className="tcg-btn lime">
                  <GraduationCap size={20} />
                  Join as Student
                  <ArrowRight size={16} className="arr" />
                </Link>
                <Link to="/admin/login" className="tcg-btn line">517764
                  <Shield size={20} />
                  Admin Access
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </Layout>
  )
} 
