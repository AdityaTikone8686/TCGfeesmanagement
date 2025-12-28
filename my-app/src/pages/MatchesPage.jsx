import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit, CheckCircle, LogOut, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API = "https://tikonecricketgurukulbackend.onrender.com/api/matches";

const MatchesPage = () => {
  const { token, isAdmin, logout, loading: authLoading } = useAuth();

  const [matches, setMatches] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /* Matches admin */
  const [isMatchesAdmin, setIsMatchesAdmin] = useState(false);
  const canEdit = isAdmin || isMatchesAdmin;

  /* Admin login */
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  /* Match form */
  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    overs: 5,
  });

  const [editMatch, setEditMatch] = useState(null);

  /* Persist matches admin */
  useEffect(() => {
    const token = localStorage.getItem("matchesAdminToken");
    if (token) setIsMatchesAdmin(true);
  }, []);

  /* Fetch matches */
  const fetchMatches = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setMatches(data);
    setPageLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  /* Matches admin login */
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

  /* Logout */
  const handleLogout = () => {
    setActionLoading(true);
    setTimeout(() => {
      localStorage.removeItem("matchesAdminToken");
      setIsMatchesAdmin(false);
      if (isAdmin) logout();
      setActionLoading(false);
    }, 400);
  };

  /* Add match */
  const addMatch = async () => {
    if (!canEdit) return;
    setActionLoading(true);

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newMatch),
    });

    setNewMatch({ teamA: "", teamB: "", date: "", time: "", overs: 5 });
    fetchMatches();
    setActionLoading(false);
  };

  /* Update match */
  const updateMatch = async () => {
    setActionLoading(true);

    await fetch(`${API}/${editMatch._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editMatch),
    });

    setEditMatch(null);
    fetchMatches();
    setActionLoading(false);
  };

  /* Delete match */
  const deleteMatch = async (id) => {
    setActionLoading(true);
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMatches();
    setActionLoading(false);
  };

  /* Change status */
  const setStatus = async (id, status) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchMatches();
  };

  /* Live score update */
  const updateScore = async (match, team, value) => {
    await fetch(`${API}/${match._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        runs: {
          ...match.runs,
          [team]: value,
        },
      }),
    });
    fetchMatches();
  };

  if (authLoading || pageLoading) {
    return (
      <Layout>
        <div className="h-[60vh] flex justify-center items-center text-xl">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Matches</h1>

        {/* Header */}
        {canEdit && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Logged in as {isAdmin ? "Main Admin" : "Matches Admin"}
            </p>
            <Button onClick={handleLogout} disabled={actionLoading}>
              <LogOut size={16} /> Logout
            </Button>
          </div>
        )}

        {/* Login */}
        {!canEdit && (
          <div className="text-center mb-6">
            {!showLogin ? (
              <Button onClick={() => setShowLogin(true)}>Admin Login</Button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {loginError && <p className="text-red-600">{loginError}</p>}
                <input className="border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="border p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <Button onClick={handleMatchesAdminLogin} disabled={actionLoading}>
                  {actionLoading ? "Loading..." : "Login"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Add Match */}
        {canEdit && (
          <Card className="mb-6">
            <CardContent className="flex gap-2 flex-wrap">
              <input className="border p-2" placeholder="Team A" value={newMatch.teamA} onChange={e => setNewMatch({ ...newMatch, teamA: e.target.value })} />
              <input className="border p-2" placeholder="Team B" value={newMatch.teamB} onChange={e => setNewMatch({ ...newMatch, teamB: e.target.value })} />
              <input type="date" className="border p-2" value={newMatch.date} onChange={e => setNewMatch({ ...newMatch, date: e.target.value })} />
              <input type="time" className="border p-2" value={newMatch.time} onChange={e => setNewMatch({ ...newMatch, time: e.target.value })} />
              <Button onClick={addMatch}>
                <Plus size={16} /> Add Match
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Matches */}
        {matches.map(match => (
          <Card key={match._id} className="mb-4">
            <CardContent>
              <div className="flex justify-between items-center">
                <h2 className="font-bold">
                  {match.teamA} vs {match.teamB}
                  {match.status === "live" && (
                    <span className="ml-2 animate-pulse text-red-600">LIVE</span>
                  )}
                </h2>
                <p>{match.date}</p>
              </div>

              <p className="mt-2">
                {match.runs.teamA} - {match.runs.teamB} | Over {match.currentOver}/{match.overs}
              </p>

              {canEdit && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Button onClick={() => setStatus(match._id, "live")}>Live</Button>
                  <Button onClick={() => setStatus(match._id, "finished")}>Finish</Button>
                  <Button onClick={() => setEditMatch(match)}><Edit size={16} /></Button>
                  <Button onClick={() => deleteMatch(match._id)}><Trash2 size={16} /></Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Edit Modal */}
        {editMatch && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <h2 className="font-bold mb-4">Edit Match</h2>
              <input className="border p-2 w-full mb-2" value={editMatch.teamA} onChange={e => setEditMatch({ ...editMatch, teamA: e.target.value })} />
              <input className="border p-2 w-full mb-2" value={editMatch.teamB} onChange={e => setEditMatch({ ...editMatch, teamB: e.target.value })} />
              <Button onClick={updateMatch}>Save</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MatchesPage;








