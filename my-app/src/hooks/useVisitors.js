import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useVisitors() {
  const [total, setTotal] = useState(0);
  const [live, setLive] = useState(0);

  useEffect(() => {
    let visitorId = localStorage.getItem("visitorId");

    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem("visitorId", visitorId);
    }

    const track = () => {
      fetch("/api/visitors/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
      });
    };

    track();
    const heartbeat = setInterval(track, 15000);

    const fetchStats = async () => {
      const res = await fetch("/api/visitors/stats");
      const data = await res.json();
      setTotal(data.totalVisitors);
      setLive(data.liveVisitors);
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
