import { useEffect, useState } from "react";

export default function useVisitors() {
  const [total, setTotal] = useState(0);
  const [live, setLive] = useState(0);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL;

    if (!API_BASE) {
      console.error("VITE_API_URL is not defined");
      return;
    }

    let visitorId = localStorage.getItem("visitorId");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("visitorId", visitorId);
    }

    const track = () => {
      fetch(`${API_BASE}/api/visitors/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
      }).catch(console.error);
    };

    track();
    const heartbeat = setInterval(track, 15000);

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/visitors/stats`);
        const data = await res.json();
        setTotal(data.totalVisitors);
        setLive(data.liveVisitors);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
    const statsInterval = setInterval(fetchStats, 5000);

    return () => {
      clearInterval(heartbeat);
      clearInterval(statsInterval);
    };
  }, []);

  return { total, live };
}

