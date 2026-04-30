import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  if (!show) return null;

  return (
    <div style={overlay}>
      <div style={popup}>
        {/* Header */}
        <div style={header}>
          <button style={closeBtn} onClick={() => setShow(false)}>✕</button>
          <div style={iconCircle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <ellipse cx="12" cy="12" rx="9" ry="9" stroke="white" strokeWidth="1.5"/>
              <line x1="12" y1="3" x2="12" y2="21" stroke="white" strokeWidth="1.5"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="1.5"/>
              <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" stroke="white" strokeWidth="1"/>
              <line x1="18.4" y1="5.6" x2="5.6" y2="18.4" stroke="white" strokeWidth="1"/>
            </svg>
          </div>
          <span style={badge}>Admissions Open 2025</span>
          <h2 style={title}>Tikone Cricket Gurukul</h2>
          <p style={subtitle}>Shape your game with expert coaching</p>
        </div>

        {/* Body */}
        <div style={body}>
          <div style={grid}>
            {[
              { label: "All age groups" },
              { label: "Expert coaches" },
              { label: "Flexible batches" },
              { label: "All skill levels" },
            ].map((f) => (
              <div key={f.label} style={featureCard}>
                <p style={featureLabel}>{f.label}</p>
              </div>
            ))}
          </div>

          <div style={offerStrip}>
            <span style={dot} />
            <p style={offerText}>Limited seats — Early enrollment discount active</p>
          </div>

         <button
  style={cta}
  onClick={() => {
    setShow(false);
    navigate("/student/register");
  }}
>
  Enroll Now
</button>
          <p style={footerNote}>Questions? <a href="/contact" style={link}>Contact us</a></p>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  background: "rgba(0,0,0,0.55)", display: "flex",
  justifyContent: "center", alignItems: "center", zIndex: 9999,
};
const popup = {
  background: "#fff", borderRadius: "16px",
  width: "90%", maxWidth: "380px", overflow: "hidden",
  fontFamily: "sans-serif", position: "relative",
};
const header = {
  background: "linear-gradient(135deg, #1a5c2a 0%, #2d8a45 100%)",
  padding: "20px 20px 16px", textAlign: "center", position: "relative",
};
const closeBtn = {
  position: "absolute", top: "10px", right: "12px",
  background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
  width: "28px", height: "28px", borderRadius: "50%",
  cursor: "pointer", fontSize: "13px",
};
const iconCircle = {
  width: "40px", height: "40px", background: "rgba(255,255,255,0.15)",
  borderRadius: "50%", display: "flex", alignItems: "center",
  justifyContent: "center", margin: "0 auto 10px",
};
const badge = {
  display: "inline-block", background: "rgba(255,255,255,0.18)",
  color: "#d4f5da", fontSize: "11px", fontWeight: 500,
  padding: "4px 10px", borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.25)", marginBottom: "10px",
};
const title = { color: "#fff", fontSize: "20px", fontWeight: 600, margin: "0 0 4px" };
const subtitle = { color: "#b8eac2", fontSize: "13px", margin: 0 };
const body = { padding: "18px 20px 20px" };
const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" };
const featureCard = {
  background: "#f4faf5", border: "0.5px solid #c3e6cb",
  borderRadius: "8px", padding: "10px", textAlign: "center",
};
const featureLabel = { fontSize: "12px", fontWeight: 500, color: "#1a5c2a", margin: 0 };
const offerStrip = {
  background: "#fff8e1", border: "0.5px solid #ffe082",
  borderRadius: "8px", padding: "10px 14px",
  display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px",
};
const dot = {
  width: "8px", height: "8px", background: "#f59f00",
  borderRadius: "50%", flexShrink: 0,
};
const offerText = { fontSize: "12.5px", color: "#7a5500", fontWeight: 500, margin: 0 };
const cta = {
  width: "100%", background: "#1a5c2a", color: "#fff", border: "none",
  borderRadius: "10px", padding: "13px", fontSize: "15px",
  fontWeight: 600, cursor: "pointer",
};
const footerNote = { textAlign: "center", fontSize: "11.5px", color: "#888", marginTop: "10px" };
const link = { color: "#1a5c2a" };
