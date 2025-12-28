import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";

/* 🔹 Load matches from localStorage (OPTION 3) */
const loadMatches = () => {
  const saved = localStorage.getItem("matches");
  return saved
    ? JSON.parse(saved)
    : [
        {
          id: Date.now(),
          teamA: "Team Alpha",
          teamB: "Team Beta",
          date: "2025-12-28",
          time: "21:00",
          overs: 5,
          status: "scheduled",
          runs: { teamA: 0, teamB: 0 },
          currentOver: 0,
        },
      ];
};

const MatchesPage = () => {
  const { isAdmin, logout, loading: authLoading } = useAuth();

  /* Matches admin (separate from fees admin) */
  const [isMatchesAdmin, setIsMatchesAdmin] = useState(false);

  const canEdit = isAdmin || isMatchesAdmin;

  const [matches, setMatches] = useState(loadMatches);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    overs: 5,
  });

  const [editMatch, setEditMatch] = useState(null);

  /* Login form */
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  /* 🔐 Persist matches admin on refresh */
  useEffect(() => {
    const token = localStorage.getItem("matchesAdminToken");
    if (token) setIsMatchesAdmin(true);
    setPageLoading(false);
  }, []);

  /* 💾 Persist matches for ALL devices */
  useEffect(() => {
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches]);

  /* ⛔ Prevent flicker / 404 */
  if (authLoading || pageLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh] text-xl">
          Loading...
        </div>
      </Layout>
    );
  }

  /* 🔐 Matches admin login */
  const handleAdminLogin = async () => {
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

  /* 🔓 Logout */
  const handleLogout = () => {
    setActionLoading(true);
    setTimeout(() => {
      localStorage.removeItem("matchesAdminToken");
      setIsMatchesAdmin(false);
      if (isAdmin) logout();
      setActionLoading(false);
    }, 500);
  };

  /* ➕ Add match */
  const addMatch = () => {
    if (!canEdit) return;

    setMatches([
      ...matches,
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

  /* 🔄 Update status */
  const setStatus = (id, status) => {
    setMatches(
      matches.map((m) =>
        m.id === id ? { ...m, status } : m
      )
    );
  };

  /* ❌ Delete */
  const deleteMatch = (id) => {
    setMatches(matches.filter((m) => m.id !== id));
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Matches</h1>

        {/* Logged-in header */}
        {canEdit && (
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Logged in as {isAdmin ? "Main Admin" : "Matches Admin"}
            </p>
            <Button
              onClick={handleLogout}
              disabled={actionLoading}
              className="bg-red-600 text-white"
            >
              {actionLoading ? "Loading..." : "Logout"}
            </Button>
          </div>
        )}

        {/* Admin Login */}
        {!canEdit && (
          <div className="text-center mb-6">
            {!showLogin ? (
              <Button
                onClick={() => setShowLogin(true)}
                className="bg-blue-600 text-white"
              >
                Admin Login
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {loginError && (
                  <p className="text-red-600">{loginError}</p>
                )}
                <input
                  className="border p-2 rounded"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  onClick={handleAdminLogin}
                  disabled={actionLoading}
                  className="bg-green-600 text-white"
                >
                  {actionLoading ? "Loading..." : "Login"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ➕ Add Match */}
        {canEdit && (
          <Card className="mb-6">
            <CardContent className="flex gap-2 flex-wrap">
              <input
                className="border p-2 rounded"
                placeholder="Team A"
                value={newMatch.teamA}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, teamA: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Team B"
                value={newMatch.teamB}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, teamB: e.target.value })
                }
              />
              <input
                type="date"
                className="border p-2 rounded"
                value={newMatch.date}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, date: e.target.value })
                }
              />
              <input
                type="time"
                className="border p-2 rounded"
                value={newMatch.time}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, time: e.target.value })
                }
              />
              <Button onClick={addMatch} className="bg-green-600 text-white">
                Add Match
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 🌍 PUBLIC MATCH LIST (VISIBLE TO ALL) */}
        {matches.map((match) => (
          <Card key={match.id} className="mb-4">
            <CardContent>
              <h2 className="font-bold text-lg">
                {match.teamA} vs {match.teamB}
                {match.status === "live" && (
                  <span className="ml-2 px-2 py-1 text-xs rounded bg-red-600 text-white animate-pulse">
                    LIVE
                  </span>
                )}
              </h2>

              <p className="text-sm text-gray-500">
                {match.date} {match.time}
              </p>

              <p className="mt-2 font-semibold">
                {match.runs.teamA} - {match.runs.teamB}
              </p>

              <p className="text-sm">
                Over {match.currentOver}/{match.overs}
              </p>

              <p className="capitalize text-sm">Status: {match.status}</p>

              {/* 🔐 ADMIN ACTIONS */}
              {canEdit && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Button
                    className="bg-blue-600 text-white"
                    onClick={() => setStatus(match.id, "live")}
                  >
                    Live
                  </Button>
                  <Button
                    className="bg-green-600 text-white"
                    onClick={() => setStatus(match.id, "finished")}
                  >
                    Finish
                  </Button>
                  <Button
                    className="bg-red-600 text-white"
                    onClick={() => deleteMatch(match.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default MatchesPage;







