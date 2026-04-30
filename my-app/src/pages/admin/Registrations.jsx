import { useEffect, useState } from "react";

const LOGO = "/cropped_circle_image-removebg-preview.png";
const API = "https://tikonecricketgurukulbackend.onrender.com/api/register";

const theme = {
  green: "#1a5c2a",
  greenMid: "#2d8a45",
  greenLight: "#e8f5ec",
  greenBorder: "#c3e6cb",
  greenText: "#b8eac2",
};

export default function Registrations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");

  useEffect(() => {
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const batches = ["All", ...Array.from(new Set(data.map((r) => r.batch).filter(Boolean)))];

  const filtered = data.filter((r) => {
    const name = `${r.fname} ${r.lname}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || (r.phone || "").includes(search) || (r.refNum || "").toLowerCase().includes(search.toLowerCase());
    const matchBatch = batchFilter === "All" || r.batch === batchFilter;
    return matchSearch && matchBatch;
  });

  const stats = [
    { label: "Total registrations", value: data.length },
    { label: "Evening batch", value: data.filter((r) => r.batch?.toLowerCase().includes("evening")).length },
    { label: "Weekend batch", value: data.filter((r) => r.batch?.toLowerCase().includes("weekend")).length },
    { label: "This month", value: data.filter((r) => { const d = new Date(r.createdAt); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length },
  ];

  return (
    <div style={{ background: "#f4faf5", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: theme.green, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <img src={LOGO} alt="TCG logo" style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)" }} />
          <div>
            <h1 style={{ color: "#fff", fontSize: "17px", fontWeight: 600, margin: "0 0 2px" }}>Tikone Cricket Gurukul</h1>
            <p style={{ color: theme.greenText, fontSize: "12px", margin: 0 }}>Admin — registrations dashboard</p>
          </div>
        </div>
        <button
          onClick={() => { setLoading(true); fetch(API).then(r => r.json()).then(d => { setData(d); setLoading(false); }); }}
          style={{ background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: "8px", padding: "7px 14px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: "#fff", border: `0.5px solid ${theme.greenBorder}`, borderRadius: "12px", padding: "14px 16px" }}>
              <p style={{ fontSize: "11.5px", color: "#666", margin: "0 0 6px", fontWeight: 500 }}>{s.label}</p>
              <p style={{ fontSize: "26px", fontWeight: 600, color: theme.green, margin: 0, lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <svg style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone or ref no..."
              style={{ width: "100%", padding: "9px 12px 9px 32px", fontSize: "13.5px", border: `0.5px solid ${theme.greenBorder}`, borderRadius: "8px", background: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {batches.map((b) => (
              <button
                key={b}
                onClick={() => setBatchFilter(b)}
                style={{ padding: "7px 13px", fontSize: "12.5px", borderRadius: "8px", border: `0.5px solid ${batchFilter === b ? theme.green : theme.greenBorder}`, background: batchFilter === b ? theme.greenLight : "#fff", color: batchFilter === b ? theme.green : "#555", fontWeight: batchFilter === b ? 500 : 400, cursor: "pointer", fontFamily: "inherit" }}
              >{b}</button>
            ))}
          </div>
        </div>

        {/* Table card */}
        <div style={{ background: "#fff", border: `0.5px solid ${theme.greenBorder}`, borderRadius: "12px", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div style={{ width: "32px", height: "32px", border: `3px solid ${theme.greenLight}`, borderTop: `3px solid ${theme.green}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Loading registrations...</p>
            </div>
          ) : error ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e24b4a" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: "12px" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p style={{ color: "#a32d2d", fontSize: "14px", margin: 0 }}>Could not load data: {error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>No registrations found.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: theme.greenLight, borderBottom: `0.5px solid ${theme.greenBorder}` }}>
                    {["Ref no", "Player name", "Phone", "Email", "Batch", "Level", "Role", "Program", "Registered"].map((h) => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 500, color: theme.green, fontSize: "12px", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r._id} style={{ borderBottom: `0.5px solid ${theme.greenBorder}`, background: i % 2 === 0 ? "#fff" : "#fafcfa" }}>
                      <td style={{ padding: "11px 14px", fontFamily: "monospace", fontSize: "12px", color: theme.green, fontWeight: 600, whiteSpace: "nowrap" }}>{r.refNum || "—"}</td>
                      <td style={{ padding: "11px 14px", fontWeight: 500, color: "#1a1a1a", whiteSpace: "nowrap" }}>{r.fname} {r.lname}</td>
                      <td style={{ padding: "11px 14px", color: "#444", whiteSpace: "nowrap" }}>{r.phone || "—"}</td>
                      <td style={{ padding: "11px 14px", color: "#444" }}>{r.email || "—"}</td>
                      <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                        <span style={{ background: theme.greenLight, color: theme.green, fontSize: "11.5px", fontWeight: 500, padding: "3px 9px", borderRadius: "20px", border: `0.5px solid ${theme.greenBorder}` }}>
                          {r.batch || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", color: "#444", whiteSpace: "nowrap" }}>{r.level || "—"}</td>
                      <td style={{ padding: "11px 14px", color: "#444", whiteSpace: "nowrap" }}>{r.role || "—"}</td>
                      <td style={{ padding: "11px 14px", color: "#444", whiteSpace: "nowrap" }}>{r.duration || "—"}</td>
                      <td style={{ padding: "11px 14px", color: "#888", whiteSpace: "nowrap", fontSize: "12.5px" }}>
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && !error && (
            <div style={{ padding: "10px 16px", borderTop: `0.5px solid ${theme.greenBorder}`, background: theme.greenLight, fontSize: "12px", color: "#555", display: "flex", justifyContent: "space-between" }}>
              <span>Showing <strong>{filtered.length}</strong> of <strong>{data.length}</strong> registrations</span>
              <span style={{ color: theme.green, fontWeight: 500 }}>Tikone Cricket Gurukul — Admin</span>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
