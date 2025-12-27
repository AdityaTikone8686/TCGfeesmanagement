import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext"; // ✅ Use only the hook

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
  const { isAdmin, setIsAdmin } = useAuth();
  const [matches, setMatches] = useState(initialMatches);
  const [newMatch, setNewMatch] = useState({ teamA: "", teamB: "", date: "", time: "", overs: 5 });
  const [editMatch, setEditMatch] = useState(null);

  // Admin login state
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Load token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("matchesAdminToken");
    if (token) setIsAdmin(true);
  }, [setIsAdmin]);

  // Simulate live matches
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev =>
        prev.map(match => {
          if (match.status === "live") {
            const incrementA = Math.floor(Math.random() * 7);
            const incrementB = Math.floor(Math.random() * 7);
            const nextOver = match.currentOver + 1;
            const newStatus = nextOver >= match.overs ? "finished" : "live";
            return {
              ...match,
              runs: { teamA: match.runs.teamA + incrementA, teamB: match.runs.teamB + incrementB },
              currentOver: nextOver,
              status: newStatus,
            };
          }

          const matchDateTime = new Date(`${match.date}T${match.time}:00`);
          if (match.status === "scheduled" && new Date() >= matchDateTime) {
            return { ...match, status: "live", currentOver: 0 };
          }

          return match;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Admin login handler
  const handleAdminLogin = async () => {
    try {
      const res = await fetch("https://tikonecricketgurukulbackend.onrender.com/api/matches-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("matchesAdminToken", data.token);
        setIsAdmin(true);
        setShowLogin(false);
        setLoginError("");
      } else {
        setLoginError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setLoginError("Server error");
    }
  };

  // Admin functions
  const handleAddMatch = () => {
    if (!isAdmin || !newMatch.teamA || !newMatch.teamB || !newMatch.date || !newMatch.time) return;
    setMatches(prev => [
      ...prev,
      { id: Date.now(), ...newMatch, status: "scheduled", runs: { teamA: 0, teamB: 0 }, currentOver: 0 },
    ]);
    setNewMatch({ teamA: "", teamB: "", date: "", time: "", overs: 5 });
  };

  const handleFinishMatch = (id) => { if (!isAdmin) return; setMatches(prev => prev.map(m => m.id === id ? { ...m, status: "finished" } : m)); };
  const handleDeleteMatch = (id) => { if (!isAdmin) return; setMatches(prev => prev.filter(m => m.id !== id)); };
  const handleEditMatch = (match) => { if (!isAdmin) return; setEditMatch(match); };
  const handleUpdateMatch = () => { if (!isAdmin) return; setMatches(prev => prev.map(m => m.id === editMatch.id ? editMatch : m)); setEditMatch(null); };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Matches</h1>

        {/* Admin Login */}
        {!isAdmin && (
          <div className="text-center mb-6">
            {!showLogin ? (
              <Button onClick={() => setShowLogin(true)} className="bg-blue-600 text-white">Admin Login</Button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {loginError && <p className="text-red-600">{loginError}</p>}
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded" />
                <div className="flex gap-2 mt-2">
                  <Button onClick={handleAdminLogin} className="bg-green-600 text-white">Login</Button>
                  <Button onClick={() => setShowLogin(false)} className="bg-gray-500 text-white">Cancel</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Match (Admin only) */}
        {isAdmin && (
          <Card className="mb-8 p-4">
            <CardContent className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <input type="text" placeholder="Team A" value={newMatch.teamA} onChange={e => setNewMatch({ ...newMatch, teamA: e.target.value })} className="border p-2 rounded" />
              <input type="text" placeholder="Team B" value={newMatch.teamB} onChange={e => setNewMatch({ ...newMatch, teamB: e.target.value })} className="border p-2 rounded" />
              <input type="date" value={newMatch.date} onChange={e => setNewMatch({ ...newMatch, date: e.target.value })} className="border p-2 rounded" />
              <input type="time" value={newMatch.time} onChange={e => setNewMatch({ ...newMatch, time: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="Overs" value={newMatch.overs} onChange={e => setNewMatch({ ...newMatch, overs: parseInt(e.target.value) })} className="border p-2 rounded w-24" />
              <Button onClick={handleAddMatch} className="bg-green-600 text-white">Add Match</Button>
            </CardContent>
          </Card>
        )}

        {/* Matches Table */}
        <Card className="p-4 mb-8">
          <CardContent>
            <h2 className="text-xl font-bold mb-4">Match Calendar</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Teams</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Time</th>
                    <th className="border px-4 py-2">Overs</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Score</th>
                    {isAdmin && <th className="border px-4 py-2">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {matches.map(match => (
                    <tr key={match.id} className="text-center">
                      <td className="border px-4 py-2">{match.teamA} vs {match.teamB}</td>
                      <td className="border px-4 py-2">{match.date}</td>
                      <td className="border px-4 py-2">{match.time}</td>
                      <td className="border px-4 py-2">{match.overs}</td>
                      <td className="border px-4 py-2">{match.status}</td>
                      <td className="border px-4 py-2">{match.runs.teamA} - {match.runs.teamB} | Over {match.currentOver}/{match.overs}</td>
                      {isAdmin && (
                        <td className="border px-4 py-2 flex justify-center gap-1 flex-wrap">
                          {match.status !== "finished" && (
                            <Button onClick={() => handleFinishMatch(match.id)} className="bg-blue-600 text-white flex items-center gap-1"><CheckCircle size={16}/> Finish</Button>
                          )}
                          <Button onClick={() => handleEditMatch(match)} className="bg-yellow-500 text-white flex items-center gap-1"><Edit size={16}/> Edit</Button>
                          <Button onClick={() => handleDeleteMatch(match.id)} className="bg-red-600 text-white flex items-center gap-1"><Trash2 size={16}/> Delete</Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        {isAdmin && editMatch && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Match</h2>
              <div className="flex flex-col gap-3">
                <input type="text" value={editMatch.teamA} onChange={e => setEditMatch({ ...editMatch, teamA: e.target.value })} className="border p-2 rounded" />
                <input type="text" value={editMatch.teamB} onChange={e => setEditMatch({ ...editMatch, teamB: e.target.value })} className="border p-2 rounded" />
                <input type="date" value={editMatch.date} onChange={e => setEditMatch({ ...editMatch, date: e.target.value })} className="border p-2 rounded" />
                <input type="time" value={editMatch.time} onChange={e => setEditMatch({ ...editMatch, time: e.target.value })} className="border p-2 rounded" />
                <input type="number" value={editMatch.overs} onChange={e => setEditMatch({ ...editMatch, overs: parseInt(e.target.value) })} className="border p-2 rounded" />
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setEditMatch(null)} className="bg-gray-500 text-white">Cancel</Button>
                  <Button onClick={handleUpdateMatch} className="bg-green-600 text-white">Update</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MatchesPage;






