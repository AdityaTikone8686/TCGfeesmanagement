import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import Layout from "../components/layout/Layout";

const MatchesPage = () => {
  const token = localStorage.getItem("adminToken");
  const isAdmin = !!token;

  const [matches, setMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    overs: 5,
  });
  const [editMatch, setEditMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch matches from backend
  const fetchMatches = async () => {
    try {
      const res = await fetch("/api/matches");
      const data = await res.json();
      setMatches(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Automated match simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) =>
        prev.map((match) => {
          if (match.status === "live") {
            const incrementA = Math.floor(Math.random() * 7);
            const incrementB = Math.floor(Math.random() * 7);
            const nextOver = match.currentOver + 1;
            let newStatus = match.status;

            if (nextOver >= match.overs) newStatus = "finished";

            return {
              ...match,
              runs: {
                teamA: match.runs.teamA + incrementA,
                teamB: match.runs.teamB + incrementB,
              },
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

  // ---------------- ADMIN FUNCTIONS ----------------
  const handleAddMatch = async () => {
    if (!isAdmin) return;
    if (!newMatch.teamA || !newMatch.teamB || !newMatch.date || !newMatch.time)
      return;

    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMatch),
      });
      const data = await res.json();
      setMatches((prev) => [...prev, data]);
      setNewMatch({ teamA: "", teamB: "", date: "", time: "", overs: 5 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinishMatch = async (id) => {
    if (!isAdmin) return;

    const match = matches.find((m) => m.id === id);
    if (!match) return;

    try {
      await fetch(`/api/matches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...match, status: "finished" }),
      });

      setMatches((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "finished" } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMatch = async (id) => {
    if (!isAdmin) return;

    try {
      await fetch(`/api/matches/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateMatch = async () => {
    if (!isAdmin || !editMatch) return;

    try {
      await fetch(`/api/matches/${editMatch.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editMatch),
      });
      setMatches((prev) =>
        prev.map((m) => (m.id === editMatch.id ? editMatch : m))
      );
      setEditMatch(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Layout><p className="text-center py-10">Loading...</p></Layout>;

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Matches</h1>

        {/* ---------------- ADD MATCH (ADMIN ONLY) ---------------- */}
        {isAdmin && (
          <Card className="mb-8 p-4">
            <CardContent className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Team A"
                value={newMatch.teamA}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, teamA: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
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
              <input
                type="number"
                placeholder="Overs"
                value={newMatch.overs}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, overs: parseInt(e.target.value) })
                }
                className="border p-2 rounded w-24"
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

        {/* ---------------- MATCH TABLE ---------------- */}
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
                  {matches.map((match) => (
                    <tr key={match.id} className="text-center">
                      <td className="border px-4 py-2">
                        {match.teamA} vs {match.teamB}
                      </td>
                      <td className="border px-4 py-2">{match.date}</td>
                      <td className="border px-4 py-2">{match.time}</td>
                      <td className="border px-4 py-2">{match.overs}</td>
                      <td className="border px-4 py-2">{match.status}</td>
                      <td className="border px-4 py-2">
                        {match.runs.teamA} - {match.runs.teamB} | Over{" "}
                        {match.currentOver}/{match.overs}
                      </td>
                      {isAdmin && (
                        <td className="border px-4 py-2 flex justify-center gap-1 flex-wrap">
                          {match.status !== "finished" && (
                            <Button
                              onClick={() => handleFinishMatch(match.id)}
                              className="bg-blue-600 text-white flex items-center gap-1"
                            >
                              <CheckCircle size={16} /> Finish
                            </Button>
                          )}
                          <Button
                            onClick={() => setEditMatch(match)}
                            className="bg-yellow-500 text-white flex items-center gap-1"
                          >
                            <Edit size={16} /> Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteMatch(match.id)}
                            className="bg-red-600 text-white flex items-center gap-1"
                          >
                            <Trash2 size={16} /> Delete
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ---------------- EDIT MODAL ---------------- */}
        {isAdmin && editMatch && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Match</h2>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={editMatch.teamA}
                  onChange={(e) =>
                    setEditMatch({ ...editMatch, teamA: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  value={editMatch.teamB}
                  onChange={(e) =>
                    setEditMatch({ ...editMatch, teamB: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="date"
                  value={editMatch.date}
                  onChange={(e) =>
                    setEditMatch({ ...editMatch, date: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="time"
                  value={editMatch.time}
                  onChange={(e) =>
                    setEditMatch({ ...editMatch, time: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  value={editMatch.overs}
                  onChange={(e) =>
                    setEditMatch({
                      ...editMatch,
                      overs: parseInt(e.target.value),
                    })
                  }
                  className="border p-2 rounded"
                />

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    onClick={() => setEditMatch(null)}
                    className="bg-gray-500 text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateMatch}
                    className="bg-green-600 text-white"
                  >
                    Update
                  </Button>
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





