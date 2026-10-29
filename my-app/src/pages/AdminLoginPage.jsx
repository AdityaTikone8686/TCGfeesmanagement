import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgl {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D;
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum);
  position: relative; overflow: hidden; min-height: 100vh; display: grid; place-items: center; padding: 32px 16px;
  background: linear-gradient(135deg, var(--pink) 0%, var(--pink-soft) 55%, #fff0fa 100%); background-size: 200% 200%;
  animation: tcgl-bg 14s ease infinite;
}
.tcgl * { box-sizing: border-box; }
@keyframes tcgl-bg { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
@keyframes tcgl-float { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(30px,-26px) scale(1.12) } }
@keyframes tcgl-bob { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-20px) rotate(8deg) } }
@keyframes tcgl-card { from { opacity: 0; transform: translateY(40px) scale(.94) rotate(-1.5deg) } to { opacity: 1; transform: none } }
@keyframes tcgl-shimmer { to { background-position: 200% center } }
@keyframes tcgl-ping { 0% { box-shadow: 0 0 0 0 rgba(198,255,61,.8) } 100% { box-shadow: 0 0 0 16px rgba(198,255,61,0) } }
@keyframes tcgl-shake { 0%,100% { transform: translateX(0) } 20%,60% { transform: translateX(-8px) } 40%,80% { transform: translateX(8px) } }
@keyframes tcgl-spin { to { transform: rotate(360deg) } }
@keyframes tcgl-in { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }

.tcgl-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
.tcgl-ball { position: absolute; border-radius: 50%; pointer-events: none; background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%); box-shadow: inset -5px -7px 12px rgba(0,0,0,.25), 0 10px 20px rgba(42,10,63,.25); }
.tcgl-ball::after { content: ''; position: absolute; inset: 8% 45%; border-left: 2px dashed rgba(255,255,255,.7); border-right: 2px dashed rgba(255,255,255,.7); border-radius: 50%; }
.tcgl-grid { position: absolute; inset: 0; pointer-events: none; opacity: .35;
  background-image: linear-gradient(rgba(42,10,63,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(42,10,63,.08) 1px, transparent 1px); background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(circle at 50% 45%, #000 20%, transparent 75%); mask-image: radial-gradient(circle at 50% 45%, #000 20%, transparent 75%); }

.tcgl-card { position: relative; z-index: 2; width: 100%; max-width: 440px; background: #fff; border: 3px solid var(--plum); border-radius: 32px; box-shadow: 14px 14px 0 var(--plum); padding: 40px 32px 34px; animation: tcgl-card .8s cubic-bezier(.2,.8,.2,1) both; }
@media (max-width: 480px) { .tcgl-card { padding: 34px 22px 28px; box-shadow: 8px 8px 0 var(--plum); } }
.tcgl-badge { position: absolute; top: -34px; left: 50%; transform: translateX(-50%); width: 68px; height: 68px; border-radius: 22px; background: var(--plum); color: var(--lime); border: 3px solid var(--plum); display: grid; place-items: center; box-shadow: 0 0 0 5px var(--lime); animation: tcgl-ping 2s infinite; }
.tcgl-chip { display: block; width: fit-content; margin: 18px auto 0; padding: 6px 16px; border-radius: 999px; background: var(--lime); border: 2px solid var(--plum); font-size: 12px; font-weight: 800; }
.tcgl h1 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; letter-spacing: -.03em; line-height: 1.05; text-align: center; font-size: clamp(2rem, 6vw, 2.7rem); margin: 14px 0 6px;
  background: linear-gradient(90deg, var(--plum), #b0108a, var(--plum-2), #b0108a, var(--plum)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcgl-shimmer 5s linear infinite; }
.tcgl-sub { text-align: center; margin: 0 0 26px; font-size: 14px; color: rgba(42,10,63,.7); }

.tcgl-err { display: flex; align-items: center; gap: 10px; padding: 12px 14px; margin-bottom: 18px; border-radius: 14px; background: #ffe1e6; border: 2px solid #c0123b; color: #9c0f30; font-size: 14px; font-weight: 600; animation: tcgl-shake .5s both; }
.tcgl-form { display: flex; flex-direction: column; gap: 16px; }
.tcgl-field { position: relative; animation: tcgl-in .6s both; animation-delay: var(--d, 0ms); }
.tcgl-field > svg.lead { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--plum-2); pointer-events: none; transition: transform .3s, color .3s; }
.tcgl-input { width: 100%; padding: 15px 16px 15px 48px; border-radius: 16px; border: 2px solid var(--plum); background: var(--cream, #FFF6FC); background-color: #FFF6FC; font-family: inherit; font-size: 15px; font-weight: 500; color: var(--plum); outline: none; transition: box-shadow .25s, transform .25s, background .25s; }
.tcgl-input::placeholder { color: rgba(42,10,63,.45); }
.tcgl-input:focus { background: #fff; transform: translateY(-2px); box-shadow: 5px 5px 0 var(--pink); }
.tcgl-field:focus-within > svg.lead { color: #b0108a; transform: translateY(-50%) scale(1.2) rotate(-8deg); }
.tcgl-eye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 10px; border: none; background: transparent; color: var(--plum-2); cursor: pointer; display: grid; place-items: center; transition: background .2s; }
.tcgl-eye:hover { background: var(--pink-soft); }

.tcgl-btn { position: relative; overflow: hidden; margin-top: 6px; width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 16px; border-radius: 16px; border: 2px solid var(--plum); background: var(--plum); color: var(--lime); font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer; transition: transform .25s, box-shadow .25s, background .25s; animation: tcgl-in .6s both; animation-delay: 240ms; }
.tcgl-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.35), transparent); transform: skewX(-20deg); transition: left .7s; }
.tcgl-btn:hover:not(:disabled)::before { left: 140%; }
.tcgl-btn:hover:not(:disabled) { transform: translateY(-4px) rotate(-1deg); box-shadow: 6px 6px 0 var(--pink); background: var(--plum-2); }
.tcgl-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
.tcgl-btn:disabled { opacity: .75; cursor: wait; }
.tcgl-btn .arr { transition: transform .25s; }
.tcgl-btn:hover .arr { transform: translateX(5px); }
.tcgl-spin { width: 18px; height: 18px; border-radius: 50%; border: 3px solid rgba(198,255,61,.3); border-top-color: var(--lime); animation: tcgl-spin .7s linear infinite; }

@media (prefers-reduced-motion: reduce) { .tcgl, .tcgl * { animation: none !important; transition: none !important; } }
`;

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://tikonecricketgurukulbackend.onrender.com/api/matches-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        navigate("/matches"); // redirect to matches page
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tcgl">
      <style>{styles}</style>
      <div className="tcgl-grid" />
      <div className="tcgl-blob" style={{ width: 360, height: 360, background: "#fff", opacity: 0.55, top: -90, left: -90, animation: "tcgl-float 12s ease-in-out infinite" }} />
      <div className="tcgl-blob" style={{ width: 300, height: 300, background: "var(--lime)", opacity: 0.3, bottom: -80, right: -60, animation: "tcgl-float 15s ease-in-out infinite reverse" }} />
      <div className="tcgl-ball" style={{ width: 44, height: 44, top: "12%", right: "12%", animation: "tcgl-bob 6s ease-in-out infinite" }} />
      <div className="tcgl-ball" style={{ width: 26, height: 26, bottom: "14%", left: "10%", animation: "tcgl-bob 5s ease-in-out infinite .8s" }} />

      <form
        className="tcgl-card"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="tcgl-badge"><Shield size={32} /></div>
        <span className="tcgl-chip">Admin Portal</span>
        <h1>Admin Login</h1>
        <p className="tcgl-sub">Sign in to manage matches and more</p>

        {error && (
          <div className="tcgl-err" key={error}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="tcgl-form">
          <div className="tcgl-field" style={{ "--d": "100ms" }}>
            <Mail className="lead" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="tcgl-input"
            />
          </div>

          <div className="tcgl-field" style={{ "--d": "170ms" }}>
            <Lock className="lead" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="tcgl-input"
              style={{ paddingRight: 52 }}
            />
            <button
              type="button"
              className="tcgl-eye"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="tcgl-btn">
            {loading ? (
              <>
                <span className="tcgl-spin" /> Signing in...
              </>
            ) : (
              <>
                Login <ArrowRight size={18} className="arr" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
