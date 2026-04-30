import { useState, useEffect } from "react";

export default function Popup() {
  const [show, setShow] = useState(false);

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
        <button style={closeBtn} onClick={() => setShow(false)}>✖</button>

        <h2>🏏 Join Tikone Cricket Gurukul</h2>
        <p>Professional cricket coaching for all levels. Enroll today!</p>

        <img
          src="/your-image.jpg"
          alt="academy"
          style={image}
        />

        <button style={cta}>Join Now</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const popup = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "400px",   // ✅ FIX: prevents overflow
  textAlign: "center",
  position: "relative",
};

const image = {
  width: "100%",
  borderRadius: "10px",
  marginTop: "10px",
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  border: "none",
  background: "transparent",
  fontSize: "18px",
  cursor: "pointer",
};

const cta = {
  marginTop: "15px",
  padding: "10px 20px",
  background: "green",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
