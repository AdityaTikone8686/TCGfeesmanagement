import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Award, Clock, Target, X, ArrowRight } from "lucide-react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgp-overlay {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D; --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif;
  position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 16px;
  background: rgba(42,10,63,.62); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  animation: tcgp-fade .35s both;
}
.tcgp-overlay * { box-sizing: border-box; }
@keyframes tcgp-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes tcgp-pop { 0% { opacity: 0; transform: translateY(40px) scale(.9) rotate(-2deg) } 60% { transform: translateY(-6px) scale(1.02) rotate(.5deg) } 100% { opacity: 1; transform: none } }
@keyframes tcgp-float { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-12px) rotate(8deg) } }
@keyframes tcgp-shimmer { to { background-position: 200% center } }
@keyframes tcgp-ping { 0% { box-shadow: 0 0 0 0 rgba(198,255,61,.9) } 100% { box-shadow: 0 0 0 16px rgba(198,255,61,0) } }
@keyframes tcgp-pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.5) } }
@keyframes tcgp-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes tcgp-wiggle { 0%,100% { transform: rotate(-4deg) } 50% { transform: rotate(4deg) } }

.tcgp-card { position: relative; width: 100%; max-width: 400px; max-height: 94vh; overflow-y: auto; background: #fff; border: 3px solid var(--plum); border-radius: 30px; box-shadow: 10px 10px 0 var(--plum); animation: tcgp-pop .7s cubic-bezier(.2,.8,.2,1) both; }
@media (max-width: 420px) { .tcgp-card { box-shadow: 6px 6px 0 var(--plum); border-radius: 26px; } }

.tcgp-head { position: relative; overflow: hidden; text-align: center; padding: 32px 22px 26px; background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 100%); border-bottom: 3px solid var(--plum); }
.tcgp-ball { position: absolute; border-radius: 50%; pointer-events: none; background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%); box-shadow: inset -3px -4px 8px rgba(0,0,0,.25), 0 6px 12px rgba(42,10,63,.2); }
.tcgp-ball::after { content: ''; position: absolute; inset: 8% 45%; border-left: 1.5px dashed rgba(255,255,255,.7); border-right: 1.5px dashed rgba(255,255,255,.7); border-radius: 50%; }

.tcgp-close { position: absolute; top: 12px; right: 12px; z-index: 3; width: 36px; height: 36px; border-radius: 12px; border: 2px solid var(--plum); background: #fff; color: var(--plum); cursor: pointer; display: grid; place-items: center; transition: transform .25s cubic-bezier(.3,1.6,.5,1), background .2s, color .2s; }
.tcgp-close:hover { transform: rotate(90deg) scale(1.1); background: var(--plum); color: var(--lime); }
.tcgp-close:focus-visible, .tcgp-cta:focus-visible { outline: 3px solid var(--plum-2); outline-offset: 3px; }

.tcgp-logo { position: relative; z-index: 2; width: 74px; height: 74px; margin: 0 auto 14px; border-radius: 50%; background: #fff; border: 3px solid var(--plum); overflow: hidden; box-shadow: 0 0 0 5px var(--lime); animation: tcgp-ping 2.2s infinite; transition: transform .5s cubic-bezier(.3,1.6,.5,1); }
.tcgp-logo:hover { transform: rotate(360deg) scale(1.06); }
.tcgp-logo img { width: 100%; height: 100%; object-fit: cover; display: block; }

.tcgp-badge { position: relative; z-index: 2; display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; background: var(--plum); color: var(--lime); font-size: 12px; font-weight: 700; animation: tcgp-wiggle 2.6s ease-in-out infinite; }
.tcgp-title { position: relative; z-index: 2; margin: 12px 0 6px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; letter-spacing: -.03em; line-height: 1.05; font-size: clamp(1.7rem, 7vw, 2.1rem);
  background: linear-gradient(90deg, var(--plum), #b0108a, var(--plum-2), #b0108a, var(--plum)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcgp-shimmer 5s linear infinite; }
.tcgp-sub { position: relative; z-index: 2; margin: 0; font-size: 14px; font-weight: 600; color: rgba(42,10,63,.78); }

.tcgp-body { padding: 22px 22px 22px; background: var(--cream); }
.tcgp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
.tcgp-feat { display: flex; align-items: center; gap: 10px; padding: 11px 12px; background: #fff; border: 2px solid var(--plum); border-radius: 16px; animation: tcgp-in .5s both; animation-delay: calc(var(--i) * 90ms + 350ms); transition: transform .3s cubic-bezier(.3,1.6,.5,1), box-shadow .3s, background .3s; }
.tcgp-feat:hover { transform: translateY(-4px) rotate(-1.5deg); box-shadow: 4px 4px 0 var(--plum); background: var(--pink-soft); }
.tcgp-feat i { width: 32px; height: 32px; border-radius: 10px; background: var(--plum); color: var(--lime); display: grid; place-items: center; flex-shrink: 0; transition: transform .5s cubic-bezier(.3,1.6,.5,1), background .3s, color .3s; }
.tcgp-feat:hover i { transform: rotate(360deg); background: var(--lime); color: var(--plum); }
.tcgp-feat p { margin: 0; font-size: 12.5px; font-weight: 700; line-height: 1.2; color: var(--plum); }

.tcgp-offer { display: flex; align-items: center; gap: 12px; padding: 12px 14px; margin-bottom: 16px; border-radius: 16px; background: var(--lime); border: 3px solid var(--plum); box-shadow: 4px 4px 0 var(--plum); animation: tcgp-in .5s .75s both; }
.tcgp-dot { width: 11px; height: 11px; border-radius: 50%; background: var(--plum); flex-shrink: 0; animation: tcgp-pulse 1.4s ease-in-out infinite; }
.tcgp-offer p { margin: 0; font-size: 13px; font-weight: 700; color: var(--plum); line-height: 1.35; }

.tcgp-cta { position: relative; overflow: hidden; width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 16px; border-radius: 16px; border: 2px solid var(--plum); background: var(--plum); color: var(--lime); font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer; transition: transform .25s, box-shadow .25s, background .25s; animation: tcgp-in .5s .85s both; }
.tcgp-cta::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.35), transparent); transform: skewX(-20deg); transition: left .7s; }
.tcgp-cta:hover::before { left: 140%; }
.tcgp-cta:hover { transform: translateY(-4px) rotate(-1deg); box-shadow: 6px 6px 0 var(--pink); background: var(--plum-2); }
.tcgp-cta:active { transform: translateY(0); box-shadow: none; }
.tcgp-cta svg { transition: transform .25s; }
.tcgp-cta:hover svg { transform: translateX(5px); }

.tcgp-note { margin: 14px 0 0; text-align: center; font-size: 13px; font-weight: 500; color: rgba(42,10,63,.7); }
.tcgp-note a { position: relative; color: #b0108a; font-weight: 800; text-decoration: none; }
.tcgp-note a::after { content: ''; position: absolute; left: 0; bottom: -2px; height: 2px; width: 100%; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform .3s; }
.tcgp-note a:hover::after { transform: scaleX(1); }

@media (prefers-reduced-motion: reduce) { .tcgp-overlay, .tcgp-overlay * { animation: none !important; transition: none !important; } }
`;

export default function Popup() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const seen = localStorage.getItem("popupSeen");
    if (!seen) {
      setTimeout(() => setShow(true), 1000);
      localStorage.setItem("popupSeen", "true");
    }
  }, []);

  // UX: close with the Escape key
  useEffect(() => {
    if (!show) return;
    const onKey = (e) => e.key === "Escape" && setShow(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  if (!show) return null;

  const features = [
    { label: "All age groups", Icon: Users },
    { label: "Expert coaches", Icon: Award },
    { label: "Flexible batches", Icon: Clock },
    { label: "All skill levels", Icon: Target },
  ];

  return (
    <div
      className="tcgp-overlay"
      onClick={(e) => e.target === e.currentTarget && setShow(false)}
    >
      <style>{styles}</style>

      <div className="tcgp-card" role="dialog" aria-modal="true" aria-label="Admissions open">
        {/* Header */}
        <div className="tcgp-head">
          <button className="tcgp-close" onClick={() => setShow(false)} aria-label="Close">
            <X size={18} />
          </button>

          <span className="tcgp-ball" style={{ width: 22, height: 22, top: 18, left: 18, animation: "tcgp-float 5s ease-in-out infinite" }} />
          <span className="tcgp-ball" style={{ width: 14, height: 14, bottom: 14, right: 26, animation: "tcgp-float 4s ease-in-out infinite .6s" }} />

          <div className="tcgp-logo">
            <img
              src="/cropped_circle_image-removebg-preview.png"
              alt="Tikone Cricket Gurukul"
            />
          </div>
          <span className="tcgp-badge">🏏 Admissions Open 2026</span>
          <h2 className="tcgp-title">Tikone Cricket Gurukul</h2>
          <p className="tcgp-sub">Shape your game with expert coaching</p>
        </div>

        {/* Body */}
        <div className="tcgp-body">
          <div className="tcgp-grid">
            {features.map(({ label, Icon }, i) => (
              <div key={label} className="tcgp-feat" style={{ "--i": i }}>
                <i><Icon size={16} /></i>
                <p>{label}</p>
              </div>
            ))}
          </div>

          <div className="tcgp-offer">
            <span className="tcgp-dot" />
            <p>Limited seats — Early enrollment discount active</p>
          </div>

          <button
            className="tcgp-cta"
            onClick={() => {
              setShow(false);
              navigate("/student/register");
            }}
          >
            Enroll Now
            <ArrowRight size={18} />
          </button>

          <p className="tcgp-note">
            Questions? <a href="/contact">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}
