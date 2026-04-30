import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={container}>
      <p>
        We use cookies to improve your experience on our website.
      </p>
      <button style={button} onClick={acceptCookies}>
        Accept
      </button>
    </div>
  );
}

const container = {
  position: "fixed",
  bottom: "0",
  left: "0",
  width: "100%",
  background: "#222",
  color: "#fff",
  padding: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 9999,
};

const button = {
  background: "#28a745",
  color: "#fff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};
