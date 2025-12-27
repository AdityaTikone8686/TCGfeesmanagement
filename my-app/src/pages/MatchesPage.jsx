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
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import Layout from "../components/layout/Layout";

const initialMatches = [
  // Example match
  {
    id: 1,
    date: "2025-12-28",
    startTime: "21:00",
    overs: 20,
    teamA: "Tikone CC",
    teamB: "Pimpri CC",
    venue: "Thergoan Ground",
    status: "upcoming",
    runsA: null,
    runsB: null,
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
  const [editId, setEditId] = useState(null);

  // Auto-update match status
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updated = matches.map((match) => {
        const matchStart = new Date(`${match.date}T${match.startTime}:00`);
        const matchEnd = new Date(matchStart.getTime() + match.overs * 4 * 60 * 1000); // 4 min per over
        if (now < matchStart) return { ...match, status: "upcoming" };
        if (now >= matchStart && now <= matchEnd) return { ...match, status: "live" };
        if (now > matchEnd && match.status !== "completed") {
          return {
            ...match,
            status: "completed",
            ...simulateMatchResult(match),
          };
        }
        return match;
      });
      setMatches(updated);
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [matches]);

  const simulateMatchResult = (match) => {
    const runsA = Math.floor(Math.random() * (match.overs * 6 * 6)); // Random runs
    const runsB = Math.floor(Math.random() * (match.overs * 6 * 6));
    let winner;
    if (runsA > runsB) winner = match.teamA;
    else if (runsB > runsA) winner = match.teamB;
    else winner = "Draw";

    return { runsA, runsB, winner };
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrEditMatch = () => {
    if (editId) {
      // Edit existing match
      setMatches(
        matches.map((m) => (m.id === editId ? { ...m, ...form } : m))
      );
      setEditId(null);
    } else {
      // Add new match
      const newMatch = { id: matches.length + 1, ...form, status: "upcoming" };
      setMatches([...matches, newMatch]);
    }
    setForm({ date: "", startTime: "", overs: 20, teamA: "", teamB: "", venue: "" });
  };

  const handleDelete = (id) => {
    setMatches(matches.filter((m) => m.id !== id));
  };

  const handleEdit = (match) => {
    setForm(match);
    setEditId(match.id);
  };

  const handleFinishNow = (id) => {
    setMatches(
      matches.map((m) =>
        m.id === id ? { ...m, status: "completed", ...simulateMatchResult(m) } : m
      )
    );
  };

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Match Scheduler</h1>

        {/* Admin Form */}
        <div className="max-w-3xl mx-auto mb-12 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            {editId ? "Edit Match" : "Schedule a Match"}
          </h2>
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
          <Button
            onClick={handleAddOrEditMatch}
            className="bg-green-600 text-white"
          >
            {editId ? "Update Match" : "Add Match"}
          </Button>
        </div>

        {/* Matches */}
        <div className="space-y-8">
          {["upcoming", "live", "completed"].map((status) => (
            <div key={status}>
              <h2 className="text-2xl font-semibold mb-4 capitalize">
                {status} Matches
              </h2>
              {matches.filter((m) => m.status === status).length === 0 && (
                <p>No {status} matches.</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {matches
                  .filter((m) => m.status === status)
                  .map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      handleFinishNow={handleFinishNow}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

const MatchCard = ({ match, handleEdit, handleDelete, handleFinishNow }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center relative">
    <h3 className="text-lg font-semibold text-center">
      {match.teamA} vs {match.teamB}
    </h3>
    <p className="text-gray-500">
      {match.date} | {match.startTime} | {match.overs} overs
    </p>
    <p className="text-gray-500">{match.venue}</p>
    <p
      className={`mt-2 font-semibold ${
        match.status === "live" ? "text-red-600" : "text-gray-700"
      }`}
    >
      {match.status.toUpperCase()}
    </p>
    {match.status === "completed" && (
      <p className="text-green-600 mt-1">
        {match.teamA} {match.runsA} - {match.teamB} {match.runsB} | Winner:{" "}
        {match.winner}
      </p>
    )}

    {/* Admin Actions */}
    <div className="flex gap-2 mt-4">
      {(match.status === "upcoming" || match.status === "live") && (
        <Button
          onClick={() => handleFinishNow(match.id)}
          className="bg-blue-600 text-white text-sm"
        >
          Finish Now
        </Button>
      )}
      {match.status !== "completed" && (
        <>
          <Button
            onClick={() => handleEdit(match)}
            className="bg-yellow-500 text-white text-sm"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(match.id)}
            className="bg-red-600 text-white text-sm"
          >
            Delete
          </Button>
        </>
      )}
    </div>
  </div>
);

export default MatchesPage;
