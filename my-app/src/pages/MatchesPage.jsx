import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit, Play, CheckCircle } from "lucide-react";
import Layout from "../components/layout/Layout";

const initialMatches = [
  {
    id: 1,
    teamA: "Team Alpha",
    teamB: "Team Beta",
    date: "2025-12-28",
    time: "21:00",
    overs: 5,
    status: "scheduled", // scheduled | live | finished
    runs: { teamA: 0, teamB: 0 },
    currentOver: 0,
  },
];

const MatchesPage = () => {
  const [matches, setMatches] = useState(initialMatches);
  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    overs: 5,
  });

  // Automated match simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) =>
        prev.map((match) => {
          if (match.status === "live") {
            // Simulate runs
            const incrementA = Math.floor(Math.random() * 7); // 0-6
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

          // Auto-start match if date/time matches
          const matchDateTime = new Date(`${match.date}T${match.time}:00`);
          if (
            match.status === "scheduled" &&
            new Date() >= matchDateTime
          ) {
            return { ...match, status: "live", currentOver: 0 };
          }

          return match;
        })
      );
    }, 5000); // every 5 seconds simulate
    return () => clearInterval(interval);
  }, []);

  const handleAddMatch = () => {
    if (!newMatch.teamA || !newMatch.teamB || !newMatch.date || !newMatch.time) return;

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
    setMatches((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: "finished" } : m
      )
    );
  };

  const handleDeleteMatch = (id) => {
    setMatches((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Matches</h1>

        {/* Add New Match */}
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
            <Button onClick={handleAddMatch} className="bg-green-600 text-white">
              Add Match
            </Button>
          </CardContent>
        </Card>

        {/* Match List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <Card key={match.id} className="relative p-4">
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">{match.teamA} vs {match.teamB}</h2>
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      match.status === "scheduled"
                        ? "bg-gray-500"
                        : match.status === "live"
                        ? "bg-green-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {match.status}
                  </span>
                </div>
                <p>Date: {match.date} | Time: {match.time}</p>
                <p>Overs: {match.overs}</p>
                <p className="mt-2 font-semibold">
                  Score: {match.runs.teamA} - {match.runs.teamB} | Over {match.currentOver}/{match.overs}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  {match.status !== "finished" && (
                    <Button
                      onClick={() => handleFinishMatch(match.id)}
                      className="bg-blue-600 text-white flex items-center gap-2"
                    >
                      <CheckCircle size={16} /> Finish Now
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteMatch(match.id)}
                    className="bg-red-600 text-white flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MatchesPage;
