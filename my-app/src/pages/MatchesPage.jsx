import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MATCHES_API =
  "https://tikonecricketgurukulbackend.onrender.com/api/matches";

const MatchesPage = () => {
  const { isAdmin, logout, loading: authLoading } = useAuth();

  const [matches, setMatches] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [highlighted, setHighlighted] = useState({}); // For live animation

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

  /* ---------------- LOAD MATCHES ---------------- */
  const loadMatches = async () => {
    try {
      const res = await fetch(MATCHES_API);
      const data = await res.json();

      // Check for changes in live matches for animation
      data.forEach((m) => {
        const prev = matches.find((x) => x._id === m._id);
        if (
          prev &&
          m.status === "live" &&
          (m.score?.teamA?.runs !== prev.score?.teamA?.runs ||
            m.score?.teamB?.runs !== prev.score?.teamB?.runs ||
            m.currentOver !== prev.currentOver)
        ) {
          setHighlighted((prevH) => ({ ...prevH, [m._id]: true }));
          setTimeout(() => {
            setHighlighted((prevH) => ({ ...prevH, [m._id]: false }));
          }, 800); // animation duration
        }
      });

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

    // Optional: Polling every 5 seconds for live score updates
    const interval = setInterval(loadMatches, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- MATCHES ADMIN LOGIN ---------------- */
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

  const handleLogout = () => {
    setActionLoading(true);
    setTimeout(() => {
      localStorage.removeItem("matchesAdminToken");
      setIsMatchesAdmin(false);
      if (isAdmin) logout();
      setActionLoading(false);
    }, 500);
  };

  /* ---------------- ADD / UPDATE / DELETE / SCORE ---------------- */
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

  const handleFinishMatch = async (id) => {
    setActionLoading(true);
    await fetch(`${MATCHES_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "finished" }),
    });
    await loadMatches();
    setActionLoading(false);
  };

  const handleDeleteMatch = async (id) => {
    setActionLoading(true);
    await fetch(`${MATCHES_API}/${id}`, { method: "DELETE" });
    await loadMatches();
    setActionLoading(false);
  };

  const updateScore = async (matchId, team, runs = 0, wickets = 0, over = 0) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${MATCHES_API}/${matchId}/score`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team, runs, wickets, over }),
      });
      if (res.ok) await loadMatches();
    } catch (err) {
      console.error("Failed to update score", err);
    } finally {
      setActionLoading(false);
    }
  };

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

        {canEditMatches && (
          <div className="flex justify-between mb-4">
            <p className="text-sm text-gray-600">
              Logged in as {isAdmin ? "Main Admin" : "Matches Admin"}
            </p>
            <Button
              onClick={handleLogout}
              disabled={actionLoading}
              className="bg-red-600 text-white hover:scale-105 transition-transform duration-200"
            >
              {actionLoading ? "Loading..." : "Logout"}
            </Button>
          </div>
        )}

        {!canEditMatches && (
          <div className="text-center mb-6">
            {!showLogin ? (
              <Button
                onClick={() => setShowLogin(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                Admin Login
              </Button>
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
                  className="hover:scale-105 transition-transform duration-200"
                >
                  {actionLoading ? "Loading..." : "Login"}
                </Button>
              </div>
            )}
          </div>
        )}

        {canEditMatches && (
          <Card className="mb-6 animate-fade-in">
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
              <Button
                onClick={handleAddMatch}
                disabled={actionLoading}
                className="bg-green-600 text-white hover:scale-105 transition-transform duration-200"
              >
                Add Match
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="animate-fade-in">
          <CardContent>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th>Teams</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Score / Edit</th>
                  {canEditMatches && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr
                    key={m._id}
                    className={`text-center border-t transition-colors duration-500 ${
                      highlighted[m._id] ? "bg-green-100" : ""
                    }`}
                  >
                    <td>
                      {m.teamA} vs {m.teamB}
                    </td>
                    <td>{m.date}</td>
                    <td>
                      {m.status === "live" ? (
                        <span className="text-red-600 font-bold animate-pulse">
                          LIVE
                        </span>
                      ) : (
                        m.status
                      )}
                    </td>
                    <td className="flex justify-center gap-2 flex-wrap">
                      <span>
                        {m.score?.teamA?.runs || 0} -{" "}
                        {m.score?.teamB?.runs || 0} | Over{" "}
                        {m.currentOver || 0}/{m.overs}
                      </span>
                      {canEditMatches && m.status === "live" && (
                        <>
                          <Button
                            onClick={() =>
                              updateScore(
                                m._id,
                                "teamA",
                                (m.score?.teamA?.runs || 0) + 1,
                                m.score?.teamA?.wickets || 0,
                                m.currentOver
                              )
                            }
                            className="bg-green-600 text-white hover:scale-105 transition-transform duration-200"
                          >
                            +1 Run Team A
                          </Button>
                          <Button
                            onClick={() =>
                              updateScore(
                                m._id,
                                "teamB",
                                (m.score?.teamB?.runs || 0) + 1,
                                m.score?.teamB?.wickets || 0,
                                m.currentOver
                              )
                            }
                            className="bg-green-600 text-white hover:scale-105 transition-transform duration-200"
                          >
                            +1 Run Team B
                          </Button>
                          <Button
                            onClick={() =>
                              updateScore(
                                m._id,
                                "teamA",
                                m.score?.teamA?.runs || 0,
                                m.score?.teamA?.wickets || 0,
                                (m.currentOver || 0) + 1
                              )
                            }
                            className="bg-blue-600 text-white hover:scale-105 transition-transform duration-200"
                          >
                            +1 Over
                          </Button>
                        </>
                      )}
                    </td>
                    {canEditMatches && (
                      <td className="flex justify-center gap-2">
                        <Button
                          onClick={() => handleFinishMatch(m._id)}
                          className="bg-blue-600 text-white hover:scale-105 transition-transform duration-200"
                        >
                          <CheckCircle size={16} />
                        </Button>
                        <Button
                          onClick={() => setEditMatch(m)}
                          className="bg-yellow-500 text-white hover:scale-105 transition-transform duration-200"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteMatch(m._id)}
                          className="bg-red-600 text-white hover:scale-105 transition-transform duration-200"
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
      </div>
    </Layout>
  );
};

export default MatchesPage;



