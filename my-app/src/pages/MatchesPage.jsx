import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { Trash2, Edit, PlayCircle, CheckCircle, LogOut, LogIn, Trophy, CalendarDays, Radio, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MATCHES_API =
  "https://tikonecricketgurukulbackend.onrender.com/api/matches";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgm {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D; --cream: #FFF6FC; --red: #e11d48;
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum);
  position: relative; overflow: hidden; min-height: 70vh; padding: 48px 16px 72px;
  background: linear-gradient(135deg, var(--cream) 0%, var(--pink-soft) 55%, var(--pink) 130%);
}
.tcgm *, .tcgm *::before, .tcgm *::after { box-sizing: border-box; }
.tcgm h1, .tcgm h2 { font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -.03em; margin: 0; }
.tcgm p { margin: 0; }

@keyframes tcgm-float { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-22px) rotate(10deg) } }
@keyframes tcgm-blob { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(26px,-30px) scale(1.12) } }
@keyframes tcgm-in { from { opacity: 0; transform: translateY(22px) scale(.97) } to { opacity: 1; transform: none } }
@keyframes tcgm-shimmer { to { background-position: 200% center } }
@keyframes tcgm-ping { 0% { transform: scale(1); opacity: .8 } 100% { transform: scale(2.6); opacity: 0 } }
@keyframes tcgm-glow { 0%,100% { box-shadow: 6px 6px 0 var(--plum), 0 0 0 0 rgba(225,29,72,.35) } 50% { box-shadow: 6px 6px 0 var(--plum), 0 0 0 8px rgba(225,29,72,0) } }
@keyframes tcgm-shake { 0%,100% { transform: translateX(0) } 20%,60% { transform: translateX(-6px) } 40%,80% { transform: translateX(6px) } }
@keyframes tcgm-pop { 0% { opacity: 0; transform: scale(.88) translateY(30px) rotate(-2deg) } 60% { transform: scale(1.02) translateY(-4px) } 100% { opacity: 1; transform: none } }
@keyframes tcgm-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes tcgm-spin { to { transform: rotate(360deg) } }

.tcgm-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: .5; pointer-events: none; animation: tcgm-blob 12s ease-in-out infinite; }
.tcgm-ball { position: absolute; border-radius: 50%; pointer-events: none; background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%); box-shadow: inset -3px -4px 8px rgba(0,0,0,.25), 0 6px 12px rgba(42,10,63,.2); animation: tcgm-float 6s ease-in-out infinite; opacity: .8; }
.tcgm-wrap { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; }

/* Title */
.tcgm-hero { text-align: center; margin-bottom: 30px; animation: tcgm-in .7s cubic-bezier(.2,.8,.2,1) both; }
.tcgm-chip { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 999px; background: var(--plum); color: var(--lime); font-size: 12.5px; font-weight: 800; margin-bottom: 14px; }
.tcgm-title { font-weight: 800; line-height: 1.02; font-size: clamp(2.3rem, 7vw, 4rem);
  background: linear-gradient(90deg, var(--plum), #b0108a, var(--plum-2), #b0108a, var(--plum)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: tcgm-shimmer 5s linear infinite; }

/* Buttons */
.tcgm-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 20px; border-radius: 14px; border: 2px solid var(--plum); background: var(--plum); color: var(--lime); font-family: inherit; font-size: 14px; font-weight: 800; cursor: pointer; text-decoration: none; transition: transform .25s, box-shadow .25s, background .25s, color .25s; }
.tcgm-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.35), transparent); transform: skewX(-20deg); transition: left .7s; }
.tcgm-btn:hover:not(:disabled)::before { left: 140%; }
.tcgm-btn:hover:not(:disabled) { transform: translateY(-3px) rotate(-.6deg); box-shadow: 5px 5px 0 var(--pink); background: var(--plum-2); }
.tcgm-btn:active:not(:disabled) { transform: none; box-shadow: none; }
.tcgm-btn:disabled { opacity: .6; cursor: not-allowed; }
.tcgm-btn.is-red { background: var(--red); color: #fff; }
.tcgm-btn.is-red:hover:not(:disabled) { background: #be123c; box-shadow: 5px 5px 0 var(--plum); }
.tcgm-btn.is-lime { background: var(--lime); color: var(--plum); }
.tcgm-btn.is-lime:hover:not(:disabled) { background: #d6ff6b; box-shadow: 5px 5px 0 var(--plum); }
.tcgm-btn.is-yellow { background: #ffd93d; color: var(--plum); }
.tcgm-btn.is-yellow:hover:not(:disabled) { background: #ffe56b; box-shadow: 5px 5px 0 var(--plum); }
.tcgm-btn.is-out { background: #fff; color: var(--plum); }
.tcgm-btn.is-out:hover:not(:disabled) { background: var(--pink-soft); box-shadow: 5px 5px 0 var(--plum); }
.tcgm-btn.is-icon { padding: 10px; border-radius: 12px; }
.tcgm-btn.is-icon svg { transition: transform .35s cubic-bezier(.3,1.6,.5,1); }
.tcgm-btn.is-icon:hover:not(:disabled) svg { transform: rotate(-12deg) scale(1.2); }
.tcgm-btn.is-block { width: 100%; padding: 14px; font-size: 15px; }
.tcgm-btn:focus-visible, .tcgm-input:focus-visible { outline: 3px solid var(--plum-2); outline-offset: 3px; }

/* Inputs */
.tcgm-label { display: block; font-size: 13px; font-weight: 800; margin-bottom: 6px; color: var(--plum); }
.tcgm-input { width: 100%; padding: 12px 14px; border-radius: 14px; border: 2px solid var(--plum); background: #fff; color: var(--plum); font-family: inherit; font-size: 15px; font-weight: 500; transition: box-shadow .25s, transform .25s; }
.tcgm-input::placeholder { color: rgba(42,10,63,.42); }
.tcgm-input:focus { outline: none; box-shadow: 4px 4px 0 var(--pink); transform: translateY(-2px); }

/* Admin bar */
.tcgm-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 18px; margin-bottom: 22px; background: #fff; border: 3px solid var(--plum); border-radius: 20px; box-shadow: 5px 5px 0 var(--plum); animation: tcgm-in .6s both; }
.tcgm-bar p { font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.tcgm-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--lime); border: 2px solid var(--plum); }

/* Login */
.tcgm-login-cta { text-align: center; margin-bottom: 26px; animation: tcgm-in .6s both; }
.tcgm-login { max-width: 400px; margin: 0 auto 28px; padding: 24px; display: flex; flex-direction: column; gap: 12px; background: #fff; border: 3px solid var(--plum); border-radius: 26px; box-shadow: 8px 8px 0 var(--plum); animation: tcgm-pop .6s cubic-bezier(.2,.8,.2,1) both; }
.tcgm-err { padding: 10px 14px; border-radius: 12px; border: 2px solid #9f1239; background: #ffe4ea; color: #9f1239; font-size: 14px; font-weight: 700; animation: tcgm-shake .45s; }

/* Add form */
.tcgm-add { margin-bottom: 30px; padding: 22px; background: #fff; border: 3px solid var(--plum); border-radius: 26px; box-shadow: 8px 8px 0 var(--plum); display: grid; gap: 14px; align-items: end; grid-template-columns: 1fr; animation: tcgm-in .6s .1s both; }
@media (min-width: 640px) { .tcgm-add { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .tcgm-add { grid-template-columns: repeat(6, 1fr); } .tcgm-add .tcgm-span { grid-column: span 6; } }

/* Section heading */
.tcgm-h2 { display: flex; align-items: center; gap: 12px; margin: 38px 0 16px; font-size: clamp(1.4rem, 4vw, 1.9rem); font-weight: 800; animation: tcgm-in .6s both; }
.tcgm-h2 i { width: 40px; height: 40px; border-radius: 13px; display: grid; place-items: center; background: var(--plum); color: var(--lime); transition: transform .5s cubic-bezier(.3,1.6,.5,1), background .3s, color .3s; }
.tcgm-h2:hover i { transform: rotate(360deg); background: var(--lime); color: var(--plum); }
.tcgm-h2 em { font-style: normal; font-size: 13px; font-weight: 800; padding: 3px 11px; border-radius: 999px; background: var(--pink); border: 2px solid var(--plum); }

/* Match cards */
.tcgm-list { display: flex; flex-direction: column; gap: 14px; }
.tcgm-card { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding: 18px 20px; background: #fff; border: 3px solid var(--plum); border-radius: 22px; box-shadow: 6px 6px 0 var(--plum); animation: tcgm-in .55s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i, 0) * 80ms); transition: transform .3s cubic-bezier(.3,1.6,.5,1), box-shadow .3s; }
.tcgm-card:hover { transform: translate(-3px,-4px) rotate(-.3deg); box-shadow: 9px 10px 0 var(--plum); }
.tcgm-card.is-live { background: linear-gradient(135deg, #fff, #ffe4ea); border-left-width: 10px; border-left-color: var(--red); animation: tcgm-in .55s both, tcgm-glow 2.2s ease-in-out infinite; animation-delay: calc(var(--i, 0) * 80ms), 0s; }
.tcgm-teams { font-family: 'Bricolage Grotesque', sans-serif; font-size: clamp(1.1rem, 3.2vw, 1.4rem); font-weight: 800; letter-spacing: -.02em; line-height: 1.2; }
.tcgm-teams span { display: inline-block; margin: 0 8px; padding: 1px 9px; border-radius: 8px; background: var(--lime); border: 2px solid var(--plum); font-size: .7em; vertical-align: middle; }
.tcgm-teams small { font-size: .8em; font-weight: 700; opacity: .8; }
.tcgm-meta { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px; }
.tcgm-tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 999px; background: var(--pink-soft); border: 2px solid var(--plum); font-size: 12.5px; font-weight: 700; }
.tcgm-tag.is-win { background: var(--lime); }
.tcgm-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.tcgm-main { display: flex; align-items: center; gap: 14px; min-width: 0; flex-wrap: wrap; }

.tcgm-live-badge { display: inline-flex; align-items: center; gap: 9px; padding: 5px 13px; border-radius: 999px; background: var(--red); color: #fff; font-size: 12.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; border: 2px solid var(--plum); }
.tcgm-pulse { position: relative; width: 10px; height: 10px; border-radius: 50%; background: #fff; }
.tcgm-pulse::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: #fff; animation: tcgm-ping 1.4s ease-out infinite; }

.tcgm-empty { padding: 20px; text-align: center; font-weight: 700; color: rgba(42,10,63,.6); border: 3px dashed rgba(42,10,63,.35); border-radius: 22px; background: rgba(255,255,255,.5); }

/* Modal */
.tcgm-modal { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(42,10,63,.62); backdrop-filter: blur(6px); animation: tcgm-fade .3s both; }
.tcgm-modal-card { width: 100%; max-width: 440px; max-height: 94vh; overflow-y: auto; background: #fff; border: 3px solid var(--plum); border-radius: 28px; box-shadow: 10px 10px 0 var(--plum); animation: tcgm-pop .6s cubic-bezier(.2,.8,.2,1) both; }
.tcgm-modal-head { padding: 18px 22px; background: linear-gradient(135deg, var(--pink), var(--pink-soft)); border-bottom: 3px solid var(--plum); display: flex; align-items: center; gap: 12px; }
.tcgm-modal-head h2 { font-size: 1.5rem; font-weight: 800; }
.tcgm-modal-body { padding: 20px 22px 22px; background: var(--cream); display: flex; flex-direction: column; gap: 12px; }
.tcgm-modal-foot { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; flex-wrap: wrap; }

/* Loading */
.tcgm-loading { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; font-family: 'DM Sans', system-ui, sans-serif; font-size: 20px; font-weight: 800; color: #2A0A3F; background: linear-gradient(135deg, #FFF6FC, #FFD3F0 55%, #FFA8E0 130%); }
.tcgm-spinner { width: 54px; height: 54px; border-radius: 50%; border: 5px solid #FFD3F0; border-top-color: #2A0A3F; border-right-color: #b0108a; animation: tcgm-spin .9s linear infinite; }

@media (max-width: 520px) {
  .tcgm { padding: 32px 12px 56px; }
  .tcgm-card { padding: 16px; box-shadow: 4px 4px 0 var(--plum); border-radius: 18px; }
  .tcgm-actions { width: 100%; }
}
@media (prefers-reduced-motion: reduce) { .tcgm *, .tcgm-loading * { animation: none !important; transition: none !important; } }
`;

const MatchesPage = () => {
  const { isAdmin, logout, loading: authLoading } = useAuth();

  const [matches, setMatches] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [isMatchesAdmin, setIsMatchesAdmin] = useState(false);
  const canEditMatches = isAdmin || isMatchesAdmin;

  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    overs: 5,
    liveLink: "",
  });

  const [editMatch, setEditMatch] = useState(null);

  /* ---------------- AUTH HEADERS ---------------- */
  const getAuthHeaders = () => {
    const token = localStorage.getItem("matchesAdminToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  /* ---------------- LOAD MATCHES ---------------- */
  const loadMatches = async () => {
    try {
      const res = await fetch(MATCHES_API);
      const data = await res.json();
      setMatches(data || []);
    } catch (err) {
      console.error("Failed to load matches", err);
    } finally {
      setPageLoading(false);
    }
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("matchesAdminToken");
    if (token) setIsMatchesAdmin(true);
    loadMatches();
  }, []);

  /* ---------------- LOGIN ---------------- */
  const handleMatchesAdminLogin = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(
        "https://tikonecricketgurukulbackend.onrender.com/api/matches-admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("matchesAdminToken", data.token);
        setIsMatchesAdmin(true);
        setShowLogin(false);
        setLoginError("");
      } else {
        setLoginError(data.message || "Invalid credentials");
      }
    } catch {
      setLoginError("Server error");
    } finally {
      setActionLoading(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    setActionLoading(true);
    setTimeout(() => {
      localStorage.removeItem("matchesAdminToken");
      setIsMatchesAdmin(false);
      if (isAdmin) logout();
      setActionLoading(false);
    }, 500);
  };

  /* ---------------- ADD MATCH ---------------- */
  const handleAddMatch = async () => {
    if (!canEditMatches) return;

    setActionLoading(true);
    await fetch(MATCHES_API, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(newMatch),
    });

    setNewMatch({ teamA: "", teamB: "", date: "", time: "", overs: 5, liveLink: "" });
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- UPDATE MATCH ---------------- */
  const handleUpdateMatch = async () => {
    setActionLoading(true);
    await fetch(`${MATCHES_API}/${editMatch._id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(editMatch),
    });
    setEditMatch(null);
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- DELETE MATCH ---------------- */
  const handleDeleteMatch = async (id) => {
    setActionLoading(true);
    await fetch(`${MATCHES_API}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- START MATCH ---------------- */
  const handleStartMatch = async (id) => {
    setActionLoading(true);
    await fetch(`${MATCHES_API}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: "ongoing" }),
    });
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- END MATCH ---------------- */
  const handleEndMatch = async (id) => {
    const winner = prompt("Winner (teamA or teamB):");
    const teamA_runs = Number(prompt("Team A runs:"));
    const teamA_wickets = Number(prompt("Team A wickets:"));
    const teamB_runs = Number(prompt("Team B runs:"));
    const teamB_wickets = Number(prompt("Team B wickets:"));

    setActionLoading(true);
    await fetch(`${MATCHES_API}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status: "finished",
        winner,
        score: {
          teamA: { runs: teamA_runs, wickets: teamA_wickets },
          teamB: { runs: teamB_runs, wickets: teamB_wickets },
        },
      }),
    });
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- LOADING ---------------- */
  if (authLoading || pageLoading) {
    return (
      <Layout>
        <style>{styles}</style>
        <div className="tcgm-loading">
          <div className="tcgm-spinner"></div>
          Loading...
        </div>
      </Layout>
    );
  }

  /* ---------------- FILTERS ---------------- */
  const scheduledMatches = matches.filter((m) => m.status === "scheduled");
  const ongoingMatches = matches.filter((m) => m.status === "ongoing");
  const pastMatches = matches.filter((m) => m.status === "finished");

  return (
    <Layout>
      <style>{styles}</style>
      <div className="tcgm">
        <span className="tcgm-blob" style={{ width: 340, height: 340, top: -90, left: '-6%', background: '#FFA8E0' }} />
        <span className="tcgm-blob" style={{ width: 300, height: 300, bottom: -80, right: '-4%', background: '#C6FF3D', opacity: .3, animationDelay: '3s' }} />
        <span className="tcgm-ball" style={{ width: 26, height: 26, top: '8%', right: '9%' }} />
        <span className="tcgm-ball" style={{ width: 16, height: 16, top: '38%', left: '5%', animationDelay: '1.2s' }} />

        <div className="tcgm-wrap">
          <div className="tcgm-hero">
            <span className="tcgm-chip"><Trophy size={14} /> Tikone Cricket Gurukul</span>
            <h1 className="tcgm-title">Matches</h1>
          </div>

          {/* ADMIN HEADER */}
          {canEditMatches && (
            <div className="tcgm-bar">
              <p>
                <span className="tcgm-dot" />
                Logged in as {isAdmin ? "Main Admin" : "Matches Admin"}
              </p>
              <button type="button" onClick={handleLogout} className="tcgm-btn is-red">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}

          {/* LOGIN */}
          {!canEditMatches && !showLogin && (
            <div className="tcgm-login-cta">
              <button type="button" className="tcgm-btn" onClick={() => setShowLogin(true)}>
                <LogIn size={16} /> Admin Login
              </button>
            </div>
          )}

          {showLogin && !canEditMatches && (
            <div className="tcgm-login">
              {loginError && <p className="tcgm-err">{loginError}</p>}
              <input
                className="tcgm-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="tcgm-input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="tcgm-btn is-block" onClick={handleMatchesAdminLogin}>Login</button>
            </div>
          )}

          {/* ADD / SCHEDULE MATCH */}
          {canEditMatches && (
            <div className="tcgm-add">
              <div>
                <label className="tcgm-label">Team A</label>
                <input
                  className="tcgm-input"
                  placeholder="Team A"
                  value={newMatch.teamA}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, teamA: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="tcgm-label">Team B</label>
                <input
                  className="tcgm-input"
                  placeholder="Team B"
                  value={newMatch.teamB}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, teamB: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="tcgm-label">Overs</label>
                <input
                  type="number"
                  className="tcgm-input"
                  value={newMatch.overs}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, overs: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="tcgm-label">Date</label>
                <input
                  type="date"
                  className="tcgm-input"
                  value={newMatch.date}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="tcgm-label">Time</label>
                <input
                  type="time"
                  className="tcgm-input"
                  value={newMatch.time}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, time: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="tcgm-label">Live Link</label>
                <input
                  type="text"
                  className="tcgm-input"
                  placeholder="https://cricheroes.com/xxxx"
                  value={newMatch.liveLink || ""}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, liveLink: e.target.value })
                  }
                />
              </div>

              <button
                type="button"
                onClick={handleAddMatch}
                disabled={actionLoading}
                className="tcgm-btn is-lime is-block tcgm-span"
              >
                {actionLoading ? "Saving..." : "Schedule"}
              </button>
            </div>
          )}

          {/* SCHEDULED */}
          <h2 className="tcgm-h2"><i><CalendarDays size={20} /></i> Scheduled Matches <em>{scheduledMatches.length}</em></h2>
          <div className="tcgm-list">
            {scheduledMatches.length === 0 && <div className="tcgm-empty">No scheduled matches yet</div>}
            {scheduledMatches.map((m, i) => (
              <div key={m._id} className="tcgm-card" style={{ '--i': i }}>
                <div>
                  <div className="tcgm-teams">
                    {m.teamA}<span>vs</span>{m.teamB}
                  </div>
                  <div className="tcgm-meta">
                    <span className="tcgm-tag">Overs: {m.overs}</span>
                    <span className="tcgm-tag"><CalendarDays size={13} /> {m.date}{" "}{m.time}</span>
                  </div>
                </div>
                {canEditMatches && (
                  <div className="tcgm-actions">
                    <button
                      type="button"
                      onClick={() => setEditMatch(m)}
                      className="tcgm-btn is-icon is-yellow"
                      aria-label="Edit match"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartMatch(m._id)}
                      className="tcgm-btn is-icon is-lime"
                      aria-label="Start match"
                    >
                      <PlayCircle size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMatch(m._id)}
                      className="tcgm-btn is-icon is-red"
                      aria-label="Delete match"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ONGOING */}
          <h2 className="tcgm-h2"><i><Radio size={20} /></i> Ongoing Matches <em>{ongoingMatches.length}</em></h2>
          <div className="tcgm-list">
            {ongoingMatches.length === 0 && <div className="tcgm-empty">No live matches right now</div>}
            {ongoingMatches.map((m, i) => (
              <div key={m._id} className="tcgm-card is-live" style={{ '--i': i }}>
                <div className="tcgm-main">
                  <span className="tcgm-live-badge">
                    <span className="tcgm-pulse" />
                    LIVE
                  </span>
                  <div>
                    <div className="tcgm-teams">
                      {m.teamA}<span>vs</span>{m.teamB}
                    </div>
                    <div className="tcgm-meta">
                      <span className="tcgm-tag">Overs: {m.overs}</span>
                      <span className="tcgm-tag"><Clock size={13} /> Started at{" "}{m.time}</span>
                    </div>
                  </div>
                </div>

                <div className="tcgm-actions">
                  {canEditMatches && (
                    <button
                      type="button"
                      onClick={() => handleEndMatch(m._id)}
                      className="tcgm-btn is-icon"
                      aria-label="End match"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}

                  {m.liveLink && (
                    <a
                      href={m.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tcgm-btn is-red"
                    >
                      ▶ Watch Live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* PAST */}
          <h2 className="tcgm-h2"><i><Trophy size={20} /></i> Past Matches <em>{pastMatches.length}</em></h2>
          <div className="tcgm-list">
            {pastMatches.length === 0 && <div className="tcgm-empty">No past matches yet</div>}
            {pastMatches.map((m, i) => (
              <div key={m._id} className="tcgm-card" style={{ '--i': i }}>
                <div>
                  <div className="tcgm-teams">
                    {m.teamA} <small>({m.score?.teamA?.runs}/{m.score?.teamA?.wickets})</small>
                    <span>vs</span>
                    {m.teamB} <small>({m.score?.teamB?.runs}/{m.score?.teamB?.wickets})</small>
                  </div>
                  <div className="tcgm-meta">
                    <span className="tcgm-tag">Date: {m.date}</span>
                    <span className="tcgm-tag">Time: {m.time}</span>
                    <span className="tcgm-tag is-win"><Trophy size={13} /> Winner: {m.winner}</span>
                  </div>
                </div>
                {canEditMatches && (
                  <button
                    type="button"
                    onClick={() => handleDeleteMatch(m._id)}
                    className="tcgm-btn is-icon is-red"
                    aria-label="Delete match"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* EDIT MODAL */}
        {editMatch && (
          <div
            className="tcgm-modal"
            onClick={(e) => e.target === e.currentTarget && setEditMatch(null)}
          >
            <div className="tcgm-modal-card" role="dialog" aria-modal="true" aria-label="Edit Match">
              <div className="tcgm-modal-head">
                <h2>Edit Match</h2>
              </div>
              <div className="tcgm-modal-body">
                <input
                  className="tcgm-input"
                  placeholder="Team A"
                  value={editMatch.teamA}
                  onChange={(e) =>
                    setEditMatch({ ...editMatch, teamA: e.target.value })
                  }
                />
                <input
                  className="tcgm-input"
                  placeholder="Team B"
                  value={editMatch.teamB}
                  onChange={(e) =>
                    setEditMatch({ ...editMatch, teamB: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="tcgm-input"
                  value={editMatch.date}
                  onChange={(e) =>
                    setEditMatch({ ...editMatch, date: e.target.value })
                  }
                />
                <input
                  type="time"
                  className="tcgm-input"
                  value={editMatch.time}
                  onChange={(e) =>
                    setEditMatch({ ...editMatch, time: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="tcgm-input"
                  placeholder="Overs"
                  value={editMatch.overs}
                  onChange={(e) =>
                    setEditMatch({ ...editMatch, overs: e.target.value })
                  }
                />
                <input
                  className="tcgm-input"
                  placeholder="Live Match Link (CricHeroes / YouTube)"
                  value={editMatch.liveLink || ""}
                  onChange={(e) =>
                    setEditMatch({ ...editMatch, liveLink: e.target.value })
                  }
                />

                <div className="tcgm-modal-foot">
                  <button type="button" className="tcgm-btn is-out" onClick={() => setEditMatch(null)}>Cancel</button>
                  <button type="button" className="tcgm-btn" onClick={handleUpdateMatch}>Update</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MatchesPage;

