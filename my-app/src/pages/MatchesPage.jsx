import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import Layout from "../components/layout/Layout";

const initialMatches = [
  // Sample matches (can be empty initially)
  {
    id: 1,
    date: "2025-12-28",
    startTime: "21:00",
    overs: 20,
    teamA: "Tikone CC",
    teamB: "Pimpri CC",
    venue: "Thergoan Ground",
    status: "upcoming",
    result: null,
  },
];

const MatchesPage = () => {
  const [matches, setMatches] = useState(initialMatches);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    overs: 20,
    teamA: "",
    teamB: "",
    venue: "",
  });

  // Auto-update match status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updated = matches.map((match) => {
        const matchStart = new Date(`${match.date}T${match.startTime}:00`);
        const matchEnd = new Date(
          matchStart.getTime() + match.overs * 4 * 60 * 1000
        ); // Approx 4 min per over

        if (now < matchStart) return { ...match, status: "upcoming" };
        if (now >= matchStart && now <= matchEnd) return { ...match, status: "live" };
        if (now > matchEnd && match.status !== "completed") {
          return {
            ...match,
            status: "completed",
            result: `${match.teamA} vs ${match.teamB} finished`,
          };
        }
        return match;
      });
      setMatches(updated);
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [matches]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddMatch = () => {
    const newMatch = {
      id: matches.length + 1,
      ...form,
      status: "upcoming",
      result: null,
    };
    setMatches([...matches, newMatch]);
    setForm({ date: "", startTime: "", overs: 20, teamA: "", teamB: "", venue: "" });
  };

  // Minimum date for scheduling (1 day ahead)
  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Match Scheduler</h1>

        {/* Admin Form */}
        <div className="max-w-3xl mx-auto mb-12 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Schedule a Match</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="teamA"
              placeholder="Team A"
              value={form.teamA}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              name="teamB"
              placeholder="Team B"
              value={form.teamB}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="date"
              name="date"
              min={minDate}
              value={form.date}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="number"
              name="overs"
              min={1}
              value={form.overs}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
              placeholder="Overs"
            />
            <input
              type="text"
              name="venue"
              placeholder="Venue"
              value={form.venue}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <Button onClick={handleAddMatch} className="bg-green-600 text-white">
            Add Match
          </Button>
        </div>

        {/* Match Sections */}
        <div className="space-y-8">
          {/* Upcoming Matches */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Matches</h2>
            {matches.filter((m) => m.status === "upcoming").length === 0 && (
              <p>No upcoming matches.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {matches
                .filter((m) => m.status === "upcoming")
                .map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
            </div>
          </div>

          {/* Live Matches */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Live Matches</h2>
            {matches.filter((m) => m.status === "live").length === 0 && (
              <p>No live matches currently.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {matches
                .filter((m) => m.status === "live")
                .map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
            </div>
          </div>

          {/* Completed Matches */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Completed Matches</h2>
            {matches.filter((m) => m.status === "completed").length === 0 && (
              <p>No completed matches yet.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {matches
                .filter((m) => m.status === "completed")
                .map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const MatchCard = ({ match }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
    <h3 className="text-lg font-semibold text-center">
      {match.teamA} vs {match.teamB}
    </h3>
    <p className="text-gray-500">{match.date} | {match.startTime} | {match.overs} overs</p>
    <p className="text-gray-500">{match.venue}</p>
    <p className={`mt-2 font-semibold ${match.status === "live" ? "text-red-600" : "text-gray-700"}`}>
      {match.status.toUpperCase()}
    </p>
    {match.result && <p className="text-green-600 mt-1">{match.result}</p>}
  </div>
);

export default MatchesPage;
