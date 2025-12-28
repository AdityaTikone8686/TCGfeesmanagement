import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API = "https://tikonecricketgurukulbackend.onrender.com/api/matches";

const MatchesPage = () => {
  const { token, isAdmin, logout, loading: authLoading } = useAuth();

  const [matches, setMatches] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    overs: 5,
  });

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

  /* Add match */
  const addMatch = async () => {
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

  /* Finish match */
  const finishMatch = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "finished" }),
    });
    fetchMatches();
  };

  /* Delete */
  const deleteMatch = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchMatches();
  };

  if (authLoading || pageLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Matches</h1>

        {isAdmin && (
          <div className="flex justify-between mb-6">
            <Button onClick={logout} className="bg-red-600 text-white">
              Logout
            </Button>
          </div>
        )}

        {isAdmin && (
          <Card className="mb-6">
            <CardContent className="flex gap-2 flex-wrap">
              <input placeholder="Team A" className="border p-2"
                value={newMatch.teamA}
                onChange={e => setNewMatch({ ...newMatch, teamA: e.target.value })}
              />
              <input placeholder="Team B" className="border p-2"
                value={newMatch.teamB}
                onChange={e => setNewMatch({ ...newMatch, teamB: e.target.value })}
              />
              <input type="date" className="border p-2"
                value={newMatch.date}
                onChange={e => setNewMatch({ ...newMatch, date: e.target.value })}
              />
              <input type="time" className="border p-2"
                value={newMatch.time}
                onChange={e => setNewMatch({ ...newMatch, time: e.target.value })}
              />
              <Button onClick={addMatch} disabled={actionLoading}>
                {actionLoading ? "Saving..." : "Add Match"}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th>Teams</th>
                  <th>Date</th>
                  <th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {matches.map(m => (
                  <tr key={m._id} className="text-center border-t">
                    <td>{m.teamA} vs {m.teamB}</td>
                    <td>{m.date}</td>
                    <td>{m.status}</td>
                    {isAdmin && (
                      <td className="flex justify-center gap-2">
                        <Button onClick={() => finishMatch(m._id)}>
                          <CheckCircle size={16} />
                        </Button>
                        <Button onClick={() => deleteMatch(m._id)}>
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








