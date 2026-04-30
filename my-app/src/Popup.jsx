import { useState, useEffect } from "react";

export default function Popup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // show popup after page loads
    setTimeout(() => setShow(true), 1000);
  }, []);

  if (!show) return null;

  return (
    <div style={overlay}>
      <div style={popup}>
        <h2>Welcome to Tikone Cricket Gurukul 🏏</h2>
        <p>Join our cricket academy and improve your skills!</p>
        <button onClick={() => setShow(false)}>Close</button>
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
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popup = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
};
