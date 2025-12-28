import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit, PlayCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MATCHES_API =
  "https://tikonecricketgurukulbackend.onrender.com/api/matches";

const MatchesPage = () => {
  const { isAdmin, logout, loading: authLoading } = useAuth();

  const [matches, setMatches] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [isMatchesAdmin, setIsMatchesAdmin] = useState(false);
  const canEditMatches = isAdmin || isMatchesAdmin;

  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    overs: 5,
  });

  const [editMatch, setEditMatch] = useState(null);

  /* ---------------- AUTH HEADERS ---------------- */
  const getAuthHeaders = () => {
    const token = localStorage.getItem("matchesAdminToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  /* ---------------- LOAD MATCHES ---------------- */
  const loadMatches = async () => {
    try {
      const res = await fetch(MATCHES_API);
      const data = await res.json();
      setMatches(data || []);
    } catch (err) {
      console.error("Failed to load matches", err);
    } finally {
      setPageLoading(false);
    }
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("matchesAdminToken");
    if (token) setIsMatchesAdmin(true);
    loadMatches();
  }, []);

  /* ---------------- LOGIN ---------------- */
  const handleMatchesAdminLogin = async () => {
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

  /* ---------------- ADD MATCH ---------------- */
  const handleAddMatch = async () => {
    if (!canEditMatches) return;

    setActionLoading(true);
    await fetch(MATCHES_API, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(newMatch),
    });

    setNewMatch({ teamA: "", teamB: "", date: "", time: "", overs: 5 });
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- UPDATE MATCH ---------------- */
  const handleUpdateMatch = async () => {
    setActionLoading(true);
    await fetch(`${MATCHES_API}/${editMatch._id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(editMatch),
    });
    setEditMatch(null);
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- DELETE MATCH ---------------- */
  const handleDeleteMatch = async (id) => {
    setActionLoading(true);
    await fetch(`${MATCHES_API}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- START MATCH ---------------- */
  const handleStartMatch = async (id) => {
    setActionLoading(true);
    await fetch(`${MATCHES_API}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: "ongoing" }),
    });
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- END MATCH ---------------- */
  const handleEndMatch = async (id) => {
    const winner = prompt("Winner (teamA or teamB):");
    const teamA_runs = Number(prompt("Team A runs:"));
    const teamA_wickets = Number(prompt("Team A wickets:"));
    const teamB_runs = Number(prompt("Team B runs:"));
    const teamB_wickets = Number(prompt("Team B wickets:"));

    setActionLoading(true);
    await fetch(`${MATCHES_API}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status: "finished",
        winner,
        score: {
          teamA: { runs: teamA_runs, wickets: teamA_wickets },
          teamB: { runs: teamB_runs, wickets: teamB_wickets },
        },
      }),
    });
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- LOADING ---------------- */
  if (authLoading || pageLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh] text-xl">
          Loading...
        </div>
      </Layout>
    );
  }

  /* ---------------- FILTERS ---------------- */
  const scheduledMatches = matches.filter((m) => m.status === "scheduled");
  const ongoingMatches = matches.filter((m) => m.status === "ongoing");
  const pastMatches = matches.filter((m) => m.status === "finished");

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Matches</h1>

        {/* ADMIN HEADER */}
        {canEditMatches && (
          <div className="flex justify-between mb-4">
            <p className="text-sm text-gray-600">
              Logged in as {isAdmin ? "Main Admin" : "Matches Admin"}
            </p>
            <Button onClick={handleLogout} className="bg-red-600 text-white">
              Logout
            </Button>
          </div>
        )}

        {/* LOGIN */}
        {!canEditMatches && !showLogin && (
          <div className="text-center mb-6">
            <Button onClick={() => setShowLogin(true)}>Admin Login</Button>
          </div>
        )}

        {showLogin && !canEditMatches && (
          <div className="flex flex-col gap-2 items-center mb-6">
            {loginError && <p className="text-red-600">{loginError}</p>}
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
            <Button onClick={handleMatchesAdminLogin}>Login</Button>
          </div>
        )}

        {/* ADD / SCHEDULE MATCH */}
        {canEditMatches && (
          <Card className="mb-6">
            <CardContent className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
              <div>
                <label className="text-sm">Team A</label>
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Team A"
                  value={newMatch.teamA}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, teamA: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm">Team B</label>
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Team B"
                  value={newMatch.teamB}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, teamB: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm">Overs</label>
                <input
                  type="number"
                  className="border p-2 rounded w-full"
                  value={newMatch.overs}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, overs: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm">Date</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                  value={newMatch.date}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm">Time</label>
                <input
                  type="time"
                  className="border p-2 rounded w-full"
                  value={newMatch.time}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, time: e.target.value })
                  }
                />
              </div>

              <Button
                onClick={handleAddMatch}
                disabled={actionLoading}
                className="bg-green-600 text-white w-full"
              >
                {actionLoading ? "Saving..." : "Schedule"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* SCHEDULED */}
        <h2 className="text-xl font-bold mt-6 mb-2">Scheduled Matches</h2>
        {scheduledMatches.map((m) => (
          <Card key={m._id} className="mb-2">
            <CardContent className="flex justify-between items-center">
              <div>
                {m.teamA} vs {m.teamB} | Overs: {m.overs} | {m.date}{" "}
                {m.time}
              </div>
              {canEditMatches && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditMatch(m)}
                    className="bg-yellow-500 text-white"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    onClick={() => handleStartMatch(m._id)}
                    className="bg-green-600 text-white"
                  >
                    <PlayCircle size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDeleteMatch(m._id)}
                    className="bg-red-600 text-white"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* ONGOING */}
        <h2 className="text-xl font-bold mt-6 mb-2">Ongoing Matches</h2>
        {ongoingMatches.map((m) => (
          <Card
            key={m._id}
            className="mb-2 border-l-4 border-red-600 animate-pulse"
          >
            <CardContent className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <span className="font-bold text-red-600 text-sm uppercase">
                  LIVE
                </span>
                <span>
                  {m.teamA} vs {m.teamB} | Overs: {m.overs} | Started at{" "}
                  {m.time}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                {canEditMatches && (
                  <Button
                    onClick={() => handleEndMatch(m._id)}
                    className="bg-blue-600 text-white"
                  >
                    <CheckCircle size={16} />
                  </Button>
                )}

                {m.liveLink && (
                  <a
                    href={m.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-red-700 transition"
                  >
                    ▶ Watch Live
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* PAST */}
        <h2 className="text-xl font-bold mt-6 mb-2">Past Matches</h2>
        {pastMatches.map((m) => (
          <Card key={m._id} className="mb-2">
            <CardContent>
              {m.teamA} ({m.score?.teamA?.runs}/{m.score?.teamA?.wickets}) vs{" "}
              {m.teamB} ({m.score?.teamB?.runs}/{m.score?.teamB?.wickets}) |{" "}
              Winner: {m.winner}
            </CardContent>
          </Card>
        ))}

        {/* EDIT MODAL */}
        {editMatch && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-full max-w-md">
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
              <input
                type="date"
                className="border p-2 w-full mb-2"
                value={editMatch.date}
                onChange={(e) =>
                  setEditMatch({ ...editMatch, date: e.target.value })
                }
              />
              <input
                type="time"
                className="border p-2 w-full mb-2"
                value={editMatch.time}
                onChange={(e) =>
                  setEditMatch({ ...editMatch, time: e.target.value })
                }
              />
              <input
                type="number"
                className="border p-2 w-full mb-2"
                value={editMatch.overs}
                onChange={(e) =>
                  setEditMatch({ ...editMatch, overs: e.target.value })
                }
              />
              <input
                className="border p-2 w-full mb-2"
                placeholder="Live Match Link (CricHeroes / YouTube)"
                value={editMatch.liveLink || ""}
                onChange={(e) =>
                  setEditMatch({ ...editMatch, liveLink: e.target.value })
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






