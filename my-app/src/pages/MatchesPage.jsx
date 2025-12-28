import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";

/* ---------------- INITIAL FALLBACK ---------------- */
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
];

const MatchesPage = () => {
  const { isAdmin, logout, loading: authLoading } = useAuth();

  /* ---------------- MATCHES ADMIN ---------------- */
  const [isMatchesAdmin, setIsMatchesAdmin] = useState(false);

  /* ---------------- LOAD MATCHES FROM LOCALSTORAGE ---------------- */
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem("matches");
    return saved ? JSON.parse(saved) : initialMatches;
  });

  /* ---------------- SAVE MATCHES TO LOCALSTORAGE ---------------- */
  useEffect(() => {
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches]);

  /* ---------------- PAGE STATE ---------------- */
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const canEditMatches = isAdmin || isMatchesAdmin;

  /* ---------------- FORM STATE ---------------- */
  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    overs: 5,
  });

  const [editMatch, setEditMatch] = useState(null);

  /* ---------------- LOGIN FORM ---------------- */
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  /* ---------------- PERSIST MATCHES ADMIN ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("matchesAdminToken");
    if (token) setIsMatchesAdmin(true);
    setPageLoading(false);
  }, []);

  /* ---------------- PREVENT FLICKER / 404 ---------------- */
  if (authLoading || pageLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh] text-xl">
          Loading...
        </div>
      </Layout>
    );
  }

  /* ---------------- MATCHES ADMIN LOGIN ---------------- */
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

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    setActionLoading(true);
    setTimeout(() => {
      localStorage.removeItem("matchesAdminToken");
      setIsMatchesAdmin(false);
      if (isAdmin) logout();
      setActionLoading(false);
    }, 500);
  };

  /* ---------------- MATCH ACTIONS ---------------- */
  const handleAddMatch = () => {
    if (!canEditMatches) return;

    setMatches((prev) => [
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

  const handleDelete = (id) => {
    setMatches((prev) => prev.filter((m) => m.id !== id));
  };

  const handleFinish = (id) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: "finished" } : m
      )
    );
  };

  const handleUpdateMatch = () => {
    setMatches((prev) =>
      prev.map((m) => (m.id === editMatch.id ? editMatch : m))
    );
    setEditMatch(null);
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Matches</h1>

        {/* ---------------- HEADER ---------------- */}
        {canEditMatches && (
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

        {/* ---------------- ADMIN LOGIN ---------------- */}
        {!canEditMatches && (
          <div className="text-center mb-6">
            {!showLogin ? (
              <Button onClick={() => setShowLogin(true)}>Admin Login</Button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {loginError && <p className="text-red-600">{loginError}</p>}
                <input
                  className="border p-2 rounded"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="border p-2 rounded"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleAdminLogin} disabled={actionLoading}>
                  {actionLoading ? "Loading..." : "Login"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- ADD MATCH ---------------- */}
        {canEditMatches && (
          <Card className="mb-6">
            <CardContent className="flex gap-2 flex-wrap">
              <input
                className="border p-2"
                placeholder="Team A"
                value={newMatch.teamA}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, teamA: e.target.value })
                }
              />
              <input
                className="border p-2"
                placeholder="Team B"
                value={newMatch.teamB}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, teamB: e.target.value })
                }
              />
              <input
                type="date"
                className="border p-2"
                value={newMatch.date}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, date: e.target.value })
                }
              />
              <input
                type="time"
                className="border p-2"
                value={newMatch.time}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, time: e.target.value })
                }
              />
              <Button onClick={handleAddMatch} className="bg-green-600 text-white">
                Add Match
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ---------------- MATCHES TABLE ---------------- */}
        <Card>
          <CardContent>
            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th>Teams</th>
                  <th>Date</th>
                  <th>Status</th>
                  {canEditMatches && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id} className="text-center border-t">
                    <td>{m.teamA} vs {m.teamB}</td>
                    <td>{m.date}</td>
                    <td>{m.status}</td>
                    {canEditMatches && (
                      <td className="flex justify-center gap-2">
                        <Button onClick={() => handleFinish(m.id)}>
                          <CheckCircle size={16} />
                        </Button>
                        <Button onClick={() => setEditMatch(m)}>
                          <Edit size={16} />
                        </Button>
                        <Button onClick={() => handleDelete(m.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ---------------- EDIT MODAL ---------------- */}
        {editMatch && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
              <h2 className="font-bold mb-4">Edit Match</h2>
              <input
                className="border p-2 w-full mb-2"
                value={editMatch.teamA}
                onChange={(e) =>
                  setEditMatch({ ...editMatch, teamA: e.target.value })
                }
              />
              <input
                className="border p-2 w-full mb-2"
                value={editMatch.teamB}
                onChange={(e) =>
                  setEditMatch({ ...editMatch, teamB: e.target.value })
                }
              />
              <div className="flex justify-end gap-2">
                <Button onClick={() => setEditMatch(null)}>Cancel</Button>
                <Button onClick={handleUpdateMatch}>Update</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MatchesPage;







