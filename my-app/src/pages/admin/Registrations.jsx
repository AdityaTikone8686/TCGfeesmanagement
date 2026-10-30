import { useEffect, useState } from "react";
import { Search, RefreshCw, AlertCircle, Users, Sun, CalendarDays, ClipboardList } from "lucide-react";

const LOGO = "/cropped_circle_image-removebg-preview.png";
const API = "https://tikonecricketgurukulbackend.onrender.com/api/admin/registrations";

/* ------------------------------------------------------------------
   THEME (same as LandingPage / AdminLogin / AdminDashboard)
   Pink #FFA8E0 · Plum #2A0A3F · Lime #C6FF3D · Cream #FFF6FC
------------------------------------------------------------------- */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tr {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D; --cream: #FFF6FC;
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--plum);
  min-height: 100vh; position: relative; overflow-x: hidden;
  background: linear-gradient(135deg, #fff0fa 0%, var(--cream) 50%, var(--pink-soft) 100%);
}
.tr * { box-sizing: border-box; }
.tr h1, .tr h2, .tr b.tr-display { font-family: 'Bricolage Grotesque', 'DM Sans', sans-serif; letter-spacing: -0.02em; }

@keyframes tr-spin { to { transform: rotate(360deg) } }
@keyframes tr-pop-in { 0% { opacity: 0; transform: scale(.94) translateY(16px) } 100% { opacity: 1; transform: none } }
@keyframes tr-float { 0%,100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-18px) rotate(6deg) } }

.tr-grid { position: absolute; inset: 0; pointer-events: none; opacity: .45;
  background-image: linear-gradient(rgba(42,10,63,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(42,10,63,.06) 1px, transparent 1px);
  background-size: 44px 44px; -webkit-mask-image: radial-gradient(circle at 60% 20%, #000 10%, transparent 70%); mask-image: radial-gradient(circle at 60% 20%, #000 10%, transparent 70%); }
.tr-ball { position: absolute; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle at 30% 30%, #ff6fb8, #c4156f 70%);
  box-shadow: inset -5px -7px 12px rgba(0,0,0,.25), 0 10px 20px rgba(42,10,63,.2); }
.tr-ball::after { content: ''; position: absolute; inset: 8% 45% 8% 45%; border-left: 2px dashed rgba(255,255,255,.7); border-right: 2px dashed rgba(255,255,255,.7); border-radius: 50%; }

/* header */
.tr-header { position: relative; z-index: 2; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding: 16px 28px; background: var(--plum); border-bottom: 3px solid var(--plum); }
.tr-brand { display: flex; align-items: center; gap: 14px; }
.tr-logo { width: 56px; height: 56px; border-radius: 16px; background: #fff; border: 3px solid var(--lime); overflow: hidden; transform: rotate(-3deg); flex-shrink: 0; }
.tr-logo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tr-brand h1 { margin: 0; color: #fff; font-size: 20px; font-weight: 800; line-height: 1.1; }
.tr-brand p { margin: 3px 0 0; color: var(--pink); font-size: 13px; font-weight: 600; }

/* buttons */
.tr-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; font: inherit; font-weight: 700; font-size: 14px; color: var(--plum); background: var(--lime); border: 2px solid var(--plum); border-radius: 14px; cursor: pointer; transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s; }
.tr-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.55), transparent); transform: skewX(-20deg); transition: left .7s; }
.tr-btn:hover:not(:disabled)::before { left: 140%; }
.tr-btn:hover:not(:disabled) { transform: translateY(-3px) rotate(-1deg); box-shadow: 5px 5px 0 var(--pink); }
.tr-btn:active:not(:disabled) { transform: none; box-shadow: none; }
.tr-btn:disabled { opacity: .65; cursor: not-allowed; }
.tr-btn:focus-visible, .tr-input:focus-visible, .tr-chip:focus-visible { outline: 3px solid var(--plum-2); outline-offset: 3px; }
.tr-btn.spinning svg { animation: tr-spin 1s linear infinite; }

.tr-body { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; padding: 28px 20px 48px; }

/* stats */
.tr-stats { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); margin-bottom: 26px; }
.tr-stat { position: relative; overflow: hidden; padding: 20px; background: #fff; border: 3px solid var(--plum); border-radius: 24px; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; animation: tr-pop-in .6s both; }
.tr-stat::before { content: ''; position: absolute; width: 110px; height: 110px; border-radius: 50%; background: var(--pink); top: -55px; right: -55px; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
.tr-stat:hover { transform: translateY(-6px) rotate(-1deg); box-shadow: 8px 8px 0 var(--plum); }
.tr-stat:hover::before { transform: scale(2.6); }
.tr-stat-ic { position: relative; width: 40px; height: 40px; margin-bottom: 12px; border-radius: 13px; background: var(--plum); color: var(--lime); display: grid; place-items: center; }
.tr-stat small { position: relative; display: block; font-size: 13px; font-weight: 700; color: rgba(42,10,63,.7); }
.tr-stat strong { position: relative; display: block; margin-top: 4px; font-family: 'Bricolage Grotesque', sans-serif; font-size: 34px; font-weight: 800; line-height: 1; }

/* filters */
.tr-filters { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 20px; }
.tr-search { position: relative; flex: 1; min-width: 220px; }
.tr-search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); }
.tr-input { width: 100%; height: 48px; padding: 0 14px 0 40px; font: inherit; font-weight: 500; color: var(--plum); background: #fff; border: 2px solid var(--plum); border-radius: 14px; outline: none; transition: box-shadow .2s, transform .2s; }
.tr-input:focus { transform: translateY(-2px); box-shadow: 4px 4px 0 var(--lime), 4px 4px 0 2px var(--plum); }
.tr-input::placeholder { color: rgba(42,10,63,.45); }
.tr-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.tr-chip { padding: 9px 16px; font: inherit; font-size: 13px; font-weight: 700; color: var(--plum); background: #fff; border: 2px solid var(--plum); border-radius: 999px; cursor: pointer; transition: transform .2s, background .2s, box-shadow .2s; }
.tr-chip:hover { transform: translateY(-2px) rotate(-1deg); background: var(--pink-soft); }
.tr-chip.on { background: var(--plum); color: var(--lime); box-shadow: 3px 3px 0 var(--lime); }

/* table card */
.tr-card { background: #fff; border: 3px solid var(--plum); border-radius: 28px; box-shadow: 10px 10px 0 var(--plum); overflow: hidden; animation: tr-pop-in .7s .1s both; }
.tr-scroll { overflow-x: auto; }
.tr-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.tr-table th { padding: 13px 16px; text-align: left; font-size: 13px; font-weight: 700; white-space: nowrap; background: var(--plum); color: var(--pink); }
.tr-table td { padding: 13px 16px; border-bottom: 2px dashed rgba(42,10,63,.15); white-space: nowrap; }
.tr-table tbody tr { transition: background .2s; }
.tr-table tbody tr:hover { background: var(--cream); }
.tr-table .ref { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; font-weight: 700; }
.tr-table .name { font-weight: 700; }
.tr-table .muted { color: rgba(42,10,63,.6); font-size: 13px; }
.tr-pill { display: inline-flex; padding: 3px 11px; border-radius: 999px; font-size: 12px; font-weight: 800; background: var(--lime); border: 2px solid var(--plum); }

.tr-state { padding: 56px 16px; text-align: center; font-weight: 600; color: rgba(42,10,63,.7); }
.tr-state.err { color: #8a0b5c; }
.tr-state svg { margin-bottom: 10px; }
.tr-spinner { width: 38px; height: 38px; margin: 0 auto 14px; border-radius: 50%; border: 4px solid var(--pink-soft); border-top-color: var(--plum); animation: tr-spin .8s linear infinite; }

.tr-foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; padding: 14px 20px; border-top: 3px solid var(--plum); background: var(--pink-soft); font-size: 13px; font-weight: 600; }

@media (prefers-reduced-motion: reduce) {
  .tr, .tr *, .tr *::before, .tr *::after { animation: none !important; transition: none !important; }
}
`;

export default function Registrations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");

  const load = () => {
    setLoading(true);
    setError(null);
    return fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const batches = ["All", ...Array.from(new Set(data.map((r) => r.batch).filter(Boolean)))];

  const filtered = data.filter((r) => {
    const name = `${r.fname} ${r.lname}`.toLowerCase();
    const matchSearch =
      name.includes(search.toLowerCase()) ||
      (r.phone || "").includes(search) ||
      (r.refNum || "").toLowerCase().includes(search.toLowerCase());
    const matchBatch = batchFilter === "All" || r.batch === batchFilter;
    return matchSearch && matchBatch;
  });

  const stats = [
    { label: "Total registrations", value: data.length, Icon: Users },
    { label: "Evening batch", value: data.filter((r) => r.batch?.toLowerCase().includes("evening")).length, Icon: ClipboardList },
    { label: "Weekend batch", value: data.filter((r) => r.batch?.toLowerCase().includes("weekend")).length, Icon: Sun },
    {
      label: "This month",
      value: data.filter((r) => {
        const d = new Date(r.createdAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      Icon: CalendarDays,
    },
  ];

  return (
    <div className="tr">
      <style>{styles}</style>
      <div className="tr-grid" />
      <div className="tr-ball" style={{ width: 34, height: 34, top: "22%", right: "5%", animation: "tr-float 6s ease-in-out infinite" }} />
      <div className="tr-ball" style={{ width: 22, height: 22, bottom: "10%", left: "4%", animation: "tr-float 5s ease-in-out infinite .8s" }} />

      {/* Header */}
      <header className="tr-header">
        <div className="tr-brand">
          <div className="tr-logo"><img src={LOGO} alt="TCG logo" /></div>
          <div>
            <h1>Tikone Cricket Gurukul</h1>
            <p>Admin — registrations dashboard</p>
          </div>
        </div>
        <button className={`tr-btn ${loading ? "spinning" : ""}`} onClick={load} disabled={loading}>
          <RefreshCw size={15} />
          Refresh
        </button>
      </header>

      <div className="tr-body">
        {/* Stat cards */}
        <div className="tr-stats">
          {stats.map((s, i) => (
            <div key={s.label} className="tr-stat" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="tr-stat-ic"><s.Icon size={19} /></div>
              <small>{s.label}</small>
              <strong>{s.value}</strong>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="tr-filters">
          <div className="tr-search">
            <Search size={16} color="#2A0A3F" />
            <input
              className="tr-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone or ref no..."
              aria-label="Search registrations"
            />
          </div>
          <div className="tr-chips">
            {batches.map((b) => (
              <button key={b} className={`tr-chip ${batchFilter === b ? "on" : ""}`} onClick={() => setBatchFilter(b)}>
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Table card */}
        <div className="tr-card">
          {loading ? (
            <div className="tr-state">
              <div className="tr-spinner" />
              Loading registrations...
            </div>
          ) : error ? (
            <div className="tr-state err" role="alert">
              <AlertCircle size={34} />
              <div>Could not load data: {error}</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="tr-state">No registrations found.</div>
          ) : (
            <div className="tr-scroll">
              <table className="tr-table">
                <thead>
                  <tr>
                    {["Ref no", "Player name", "Phone", "Email", "Batch", "Level", "Role", "Program", "Registered"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r._id}>
                      <td className="ref">{r.refNum || "—"}</td>
                      <td className="name">{r.fname} {r.lname}</td>
                      <td>{r.phone || "—"}</td>
                      <td>{r.email || "—"}</td>
                      <td>{r.batch ? <span className="tr-pill">{r.batch}</span> : "—"}</td>
                      <td>{r.level || "—"}</td>
                      <td>{r.role || "—"}</td>
                      <td>{r.duration || "—"}</td>
                      <td className="muted">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div className="tr-foot">
              <span>Showing <strong>{filtered.length}</strong> of <strong>{data.length}</strong> registrations</span>
              <span>Tikone Cricket Gurukul — Admin</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
