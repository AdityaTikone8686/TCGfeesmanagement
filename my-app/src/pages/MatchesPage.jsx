import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext"; // ✅ ADMIN CHECK

const MatchesPage = () => {
  const { isAdmin } = useAuth(); // ✅ ADMIN CHECK

  // 🔴 CHANGED: start empty (data comes from backend)
  const [matches, setMatches] = useState([]);

  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    overs: 5,
  });

  const [editMatch, setEditMatch] = useState(null);

  // ✅ NEW: FETCH MATCHES FROM BACKEND
  useEffect(() => {
    fetch("/api/matches")
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error("Failed to load matches", err));
  }, []);

  // ✅ EXISTING: Automated match simulation (UNCHANGED)
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

  // ✅ ADMIN-ONLY FUNCTIONS (UNCHANGED)
  const handleAddMatch = () => {
    if (!isAdmin) return;
    if (!newMatch.teamA || !newMatch.teamB || !newMatch.date || !newMatch.time)
      return;

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

  const handleFinishMatch = (id) => {
    if (!isAdmin) return;
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "finished" } : m))
    );
  };

  const handleDeleteMatch = (id) => {
    if (!isAdmin) return;
    setMatches((prev) => prev.filter((m) => m.id !== id));
  };

  const handleEditMatch = (match) => {
    if (!isAdmin) return;
    setEditMatch(match);
  };

  const handleUpdateMatch = () => {
    if (!isAdmin) return;
    setMatches((prev) =>
      prev.map((m) => (m.id === editMatch.id ? editMatch : m))
    );
    setEditMatch(null);
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Matches</h1>

        {/* ADD MATCH (ADMIN ONLY) */}
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
                value={newMatch.overs}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, overs: parseInt(e.target.value) })
                }
                className="border p-2 rounded w-24"
              />
              <Button onClick={handleAddMatch} className="bg-green-600 text-white">
                Add Match
              </Button>
            </CardContent>
          </Card>
        )}

        {/* MATCH TABLE (UNCHANGED UI) */}
        {/* ... REST OF YOUR JSX IS UNCHANGED ... */}
      </div>
    </Layout>
  );
};

export default MatchesPage;




