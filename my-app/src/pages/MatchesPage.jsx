import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";

const initialMatches = [
  {
    id: 1,
    teamA: "Team Alpha",
    teamB: "Team Beta",
    date: "2025-12-28",
    time: "21:00",
    overs: 5,
    status: "scheduled",
    runs: { teamA: 0, teamB: 0 },
    currentOver: 0,
  },
  {
    id: 2,
    teamA: "Team Gamma",
    teamB: "Team Delta",
    date: "2025-12-29",
    time: "19:00",
    overs: 5,
    status: "scheduled",
    runs: { teamA: 0, teamB: 0 },
    currentOver: 0,
  },
];

const MatchesPage = () => {
  const { isAdmin } = useAuth(); // ✅ ONLY isAdmin
  const [matches, setMatches] = useState(initialMatches);
  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    overs: 5,
  });
  const [editMatch, setEditMatch] = useState(null);

  // Matches admin login state
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Restore matches admin session
  useEffect(() => {
    const token = localStorage.getItem("matchesAdminToken");
    if (token) {
      localStorage.setItem("userType", "admin");
    }
  }, []);

  // Simulate live matches
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev =>
        prev.map(match => {
          if (match.status === "live") {
            const incA = Math.floor(Math.random() * 7);
            const incB = Math.floor(Math.random() * 7);
            const nextOver = match.currentOver + 1;

            return {
              ...match,
              runs: {
                teamA: match.runs.teamA + incA,
                teamB: match.runs.teamB + incB,
              },
              currentOver: nextOver,
              status: nextOver >= match.overs ? "finished" : "live",
            };
          }

          const startTime = new Date(`${match.date}T${match.time}:00`);
          if (match.status === "scheduled" && new Date() >= startTime) {
            return { ...match, status: "live", currentOver: 0 };
          }

          return match;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Matches admin login
  const handleAdminLogin = async () => {
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

      if (!res.ok) {
        setLoginError(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("matchesAdminToken", data.token);
      localStorage.setItem("userType", "admin");

      setShowLogin(false);
      setLoginError("");
      window.location.reload(); // ✅ ensures context recalculates isAdmin
    } catch {
      setLoginError("Server error");
    }
  };

  // Admin actions
  const handleAddMatch = () => {
    if (!isAdmin) return;

    setMatches(prev => [
      ...prev,
      {
        id: Date.now(),
        ...newMatch,
        status: "scheduled",
        runs: { teamA: 0, teamB: 0 },
        currentOver: 0,
      },
    ]);

    setNewMatch({ teamA: "", teamB: "", date: "", time: "", overs: 5 });
  };

  const handleFinishMatch = id =>
    setMatches(prev => prev.map(m => (m.id === id ? { ...m, status: "finished" } : m)));

  const handleDeleteMatch = id =>
    setMatches(prev => prev.filter(m => m.id !== id));

  const handleEditMatch = match => setEditMatch(match);

  const handleUpdateMatch = () => {
    setMatches(prev => prev.map(m => (m.id === editMatch.id ? editMatch : m)));
    setEditMatch(null);
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Matches</h1>

        {!isAdmin && (
          <div className="text-center mb-6">
            {!showLogin ? (
              <Button onClick={() => setShowLogin(true)}>Admin Login</Button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {loginError && <p className="text-red-600">{loginError}</p>}
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2 rounded" />
                <Button onClick={handleAdminLogin}>Login</Button>
              </div>
            )}
          </div>
        )}

        {/* Matches table & admin UI stays same */}
      </div>
    </Layout>
  );
};

export default MatchesPage;







