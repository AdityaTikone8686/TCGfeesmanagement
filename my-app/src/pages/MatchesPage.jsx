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
  const { isAdmin, logout } = useAuth();

  const [isMatchesAdmin, setIsMatchesAdmin] = useState(false);
  const canEditMatches = isAdmin || isMatchesAdmin;

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

  // Detect matches admin token
  useEffect(() => {
    if (localStorage.getItem("matchesAdminToken")) {
      setIsMatchesAdmin(true);
    }
  }, []);

  // Match simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) =>
        prev.map((match) => {
          if (match.status === "live") {
            const incA = Math.floor(Math.random() * 7);
            const incB = Math.floor(Math.random() * 7);
            const nextOver = match.currentOver + 1;
            const newStatus =
              nextOver >= match.overs ? "finished" : "live";

            return {
              ...match,
              runs: {
                teamA: match.runs.teamA + incA,
                teamB: match.runs.teamB + incB,
              },
              currentOver: nextOver,
              status: newStatus,
            };
          }

          const matchTime = new Date(
            `${match.date}T${match.time}:00`
          );
          if (match.status === "scheduled" && new Date() >= matchTime) {
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
    }
  };

  // Logout (handles both admins)
  const handleLogout = () => {
    if (isAdmin) {
      logout(); // main admin
    }
    localStorage.removeItem("matchesAdminToken");
    setIsMatchesAdmin(false);
  };

  // Admin-only actions
  const handleAddMatch = () => {
    if (!canEditMatches) return;
    if (!newMatch.teamA || !newMatch.teamB) return;

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

    setNewMatch({
      teamA: "",
      teamB: "",
      date: "",
      time: "",
      overs: 5,
    });
  };

  const handleFinishMatch = (id) => {
    if (!canEditMatches) return;
    setMatches((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: "finished" } : m
      )
    );
  };

  const handleDeleteMatch = (id) => {
    if (!canEditMatches) return;
    setMatches((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateMatch = () => {
    if (!canEditMatches) return;
    setMatches((prev) =>
      prev.map((m) => (m.id === editMatch.id ? editMatch : m))
    );
    setEditMatch(null);
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-4">Matches</h1>

        {/* Role + Logout */}
        {canEditMatches && (
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Logged in as {isAdmin ? "Main Admin" : "Matches Admin"}
            </p>
            <Button
              onClick={handleLogout}
              className="bg-red-600 text-white"
            >
              Logout
            </Button>
          </div>
        )}

        {/* Matches Admin Login */}
        {!canEditMatches && (
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
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 rounded"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAdminLogin}
                    className="bg-green-600 text-white"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setShowLogin(false)}
                    className="bg-gray-500 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Match */}
        {canEditMatches && (
          <Card className="mb-8 p-4">
            <CardContent className="flex gap-3 flex-wrap">
              <input
                placeholder="Team A"
                value={newMatch.teamA}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, teamA: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                placeholder="Team B"
                value={newMatch.teamB}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, teamB: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="date"
                value={newMatch.date}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, date: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="time"
                value={newMatch.time}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, time: e.target.value })
                }
                className="border p-2 rounded"
              />
              <Button
                onClick={handleAddMatch}
                className="bg-green-600 text-white"
              >
                Add Match
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Matches Table */}
        <Card className="p-4">
          <CardContent>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th>Teams</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Score</th>
                  {canEditMatches && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id} className="text-center border-t">
                    <td>{m.teamA} vs {m.teamB}</td>
                    <td>{m.date}</td>
                    <td>{m.status}</td>
                    <td>
                      {m.runs.teamA}-{m.runs.teamB}
                    </td>
                    {canEditMatches && (
                      <td className="flex gap-2 justify-center">
                        <Button
                          onClick={() => handleFinishMatch(m.id)}
                          className="bg-blue-600 text-white"
                        >
                          <CheckCircle size={16} />
                        </Button>
                        <Button
                          onClick={() => setEditMatch(m)}
                          className="bg-yellow-500 text-white"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteMatch(m.id)}
                          className="bg-red-600 text-white"
                        >
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

        {/* Edit Modal */}
        {canEditMatches && editMatch && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <input
                value={editMatch.teamA}
                onChange={(e) =>
                  setEditMatch({ ...editMatch, teamA: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                value={editMatch.teamB}
                onChange={(e) =>
                  setEditMatch({ ...editMatch, teamB: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <Button
                onClick={handleUpdateMatch}
                className="bg-green-600 text-white"
              >
                Update
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MatchesPage;







