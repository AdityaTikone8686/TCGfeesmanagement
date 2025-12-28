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
  },
];

const MatchesPage = () => {
  const { isAdmin, logout, loading } = useAuth();

  const [isMatchesAdmin, setIsMatchesAdmin] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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

  // Login form
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Persist matches admin
  useEffect(() => {
    if (localStorage.getItem("matchesAdminToken")) {
      setIsMatchesAdmin(true);
    }
    setPageLoading(false);
  }, []);

  if (loading || pageLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh] text-xl">
          Loading...
        </div>
      </Layout>
    );
  }

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

  const handleLogout = () => {
    localStorage.removeItem("matchesAdminToken");
    setIsMatchesAdmin(false);
    if (isAdmin) logout();
  };

  // CRUD
  const addMatch = () => {
    if (!canEditMatches) return;
    setMatches((prev) => [
      ...prev,
      { id: Date.now(), ...newMatch, status: "scheduled" },
    ]);
    setNewMatch({ teamA: "", teamB: "", date: "", time: "", overs: 5 });
  };

  const deleteMatch = (id) =>
    setMatches((prev) => prev.filter((m) => m.id !== id));

  const finishMatch = (id) =>
    setMatches((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: "finished" } : m
      )
    );

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Matches</h1>

        {canEditMatches && (
          <div className="flex justify-between mb-4">
            <p>Logged in as Admin</p>
            <Button onClick={handleLogout} className="bg-red-600 text-white">
              Logout
            </Button>
          </div>
        )}

        {!canEditMatches && (
          <div className="text-center mb-6">
            {!showLogin ? (
              <Button onClick={() => setShowLogin(true)}>
                Admin Login
              </Button>
            ) : (
              <>
                {loginError && <p className="text-red-600">{loginError}</p>}
                <input
                  className="border p-2 rounded"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="border p-2 rounded"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleAdminLogin}>
                  Login
                </Button>
              </>
            )}
          </div>
        )}

        {canEditMatches && (
          <Card className="mb-6">
            <CardContent className="flex gap-2 flex-wrap">
              <input placeholder="Team A" onChange={(e)=>setNewMatch({...newMatch,teamA:e.target.value})}/>
              <input placeholder="Team B" onChange={(e)=>setNewMatch({...newMatch,teamB:e.target.value})}/>
              <input type="date" onChange={(e)=>setNewMatch({...newMatch,date:e.target.value})}/>
              <input type="time" onChange={(e)=>setNewMatch({...newMatch,time:e.target.value})}/>
              <Button onClick={addMatch}>Add Match</Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <table className="w-full border">
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id}>
                    <td>{m.teamA} vs {m.teamB}</td>
                    <td>{m.status}</td>
                    {canEditMatches && (
                      <td className="flex gap-2">
                        <Button onClick={()=>finishMatch(m.id)}>
                          <CheckCircle size={16}/>
                        </Button>
                        <Button onClick={()=>deleteMatch(m.id)}>
                          <Trash2 size={16}/>
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







