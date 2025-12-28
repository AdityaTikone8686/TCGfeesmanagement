import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit } from "lucide-react";
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

  // Login
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Match form
  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    overs: 5,
  });
  const [editMatch, setEditMatch] = useState(null);

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

  useEffect(() => {
    const token = localStorage.getItem("matchesAdminToken");
    if (token) setIsMatchesAdmin(true);
    loadMatches();
  }, []);

  /* ---------------- ADMIN LOGIN ---------------- */
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
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editMatch),
    });
    setEditMatch(null);
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- DELETE MATCH ---------------- */
  const handleDeleteMatch = async (id) => {
    setActionLoading(true);
    await fetch(`${MATCHES_API}/${id}`, { method: "DELETE" });
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- END MATCH ---------------- */
  const handleEndMatch = async (match) => {
    const winner = prompt("Enter winning team:");
    const loser = winner === match.teamA ? match.teamB : match.teamA;
    const teamARuns = parseInt(prompt(`Enter ${match.teamA} runs:`), 10);
    const teamAWickets = parseInt(prompt(`Enter ${match.teamA} wickets:`), 10);
    const teamBRuns = parseInt(prompt(`Enter ${match.teamB} runs:`), 10);
    const teamBWickets = parseInt(prompt(`Enter ${match.teamB} wickets:`), 10);

    if (!winner || isNaN(teamARuns) || isNaN(teamAWickets) || isNaN(teamBRuns) || isNaN(teamBWickets)) {
      alert("Invalid input");
      return;
    }

    setActionLoading(true);
    await fetch(`${MATCHES_API}/${match._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "finished",
        winner,
        loser,
        score: {
          teamA: { runs: teamARuns, wickets: teamAWickets },
          teamB: { runs: teamBRuns, wickets: teamBWickets },
        },
      }),
    });
    await loadMatches();
    setActionLoading(false);
  };

  /* ---------------- FILTER MATCHES ---------------- */
  const scheduledMatches = matches.filter((m) => m.status === "scheduled");
  const ongoingMatches = matches.filter((m) => m.status === "ongoing");
  const pastMatches = matches.filter((m) => m.status === "finished");

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

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Matches</h1>

        {/* HEADER */}
        {canEditMatches && (
          <div className="flex justify-between mb-4">
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

        {/* LOGIN */}
        {!canEditMatches && (
          <div className="text-center mb-6">
            {!showLogin ? (
              <Button onClick={() => setShowLogin(true)}>Admin Login</Button>
            ) : (
              <div className="flex flex-col gap-2 items-center">
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
                <Button
                  onClick={handleMatchesAdminLogin}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Loading..." : "Login"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ADD MATCH */}
        {canEditMatches && (
          <Card className="mb-6">
            <CardContent className="flex flex-wrap gap-2">
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
                type="number"
                className="border p-2 rounded w-20"
                placeholder="Overs"
                value={newMatch.overs}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, overs: parseInt(e.target.value) })
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
              <Button onClick={handleAddMatch} disabled={actionLoading}>
                Add Match
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ---------------- SCHEDULED ---------------- */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Scheduled Matches</h2>
        {scheduledMatches.length === 0 ? (
          <p>No scheduled matches</p>
        ) : (
          scheduledMatches.map((m) => (
            <Card key={m._id} className="mb-2">
              <CardContent className="flex justify-between items-center">
                <div>
                  {m.teamA} vs {m.teamB} | {m.overs} Overs | {m.date} {m.time}
                </div>
                {canEditMatches && (
                  <div className="flex gap-2">
                    <Button onClick={() => setEditMatch(m)}>
                      <Edit size={16} />
                    </Button>
                    <Button onClick={() => handleDeleteMatch(m._id)}>
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      onClick={async () => {
                        await fetch(`${MATCHES_API}/${m._id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "ongoing" }),
                        });
                        await loadMatches();
                      }}
                      className="bg-green-600 text-white"
                    >
                      Start
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}

        {/* ---------------- ONGOING ---------------- */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Ongoing Matches</h2>
        {ongoingMatches.length === 0 ? (
          <p>No ongoing matches</p>
        ) : (
          ongoingMatches.map((m) => (
            <Card key={m._id} className="mb-2 animate-pulse">
              <CardContent className="flex justify-between items-center">
                <div>
                  🔴 {m.teamA} vs {m.teamB} | {m.overs} Overs | Start:{" "}
                  {m.date} {m.time}
                </div>
                {canEditMatches && (
                  <div className="flex gap-2">
                    <Button onClick={() => handleEndMatch(m)}>End</Button>
                    <Button onClick={() => handleDeleteMatch(m._id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}

        {/* ---------------- PAST ---------------- */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Past Matches</h2>
        {pastMatches.length === 0 ? (
          <p>No past matches</p>
        ) : (
          pastMatches.map((m) => (
            <Card key={m._id} className="mb-2">
              <CardContent className="flex justify-between items-center">
                <div>
                  🏆 {m.winner} defeated {m.loser} | {m.overs} Overs |{" "}
                  Score: {m.score?.teamA?.runs || 0}-
                  {m.score?.teamA?.wickets || 0} vs {m.score?.teamB?.runs || 0}-
                  {m.score?.teamB?.wickets || 0}
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* ---------------- EDIT MODAL ---------------- */}
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
                type="number"
                className="border p-2 w-full mb-2"
                value={editMatch.overs}
                onChange={(e) =>
                  setEditMatch({ ...editMatch, overs: parseInt(e.target.value) })
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




