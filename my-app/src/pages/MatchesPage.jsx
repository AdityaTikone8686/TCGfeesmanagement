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
    runs: { teamA: 0, teamB: 0 },
    currentOver: 0,
  },
];

const MatchesPage = () => {
  const { isAdmin, logout, authLoading } = useAuth();

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

  // 🔐 Persist Matches Admin on refresh
  useEffect(() => {
    const token = localStorage.getItem("matchesAdminToken");
    if (token) setIsMatchesAdmin(true);
    setPageLoading(false);
  }, []);

  // ⛔ Prevent 404 / flicker
  if (authLoading || pageLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh] text-xl">
          Loading...
        </div>
      </Layout>
    );
  }

  // Matches admin login
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

  // Logout with loading
  const handleLogout = () => {
    setActionLoading(true);
    setTimeout(() => {
      localStorage.removeItem("matchesAdminToken");
      setIsMatchesAdmin(false);
      if (isAdmin) logout();
      setActionLoading(false);
    }, 500);
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Matches</h1>

        {/* Logged in header */}
        {canEditMatches && (
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Logged in as {isAdmin ? "Main Admin" : "Matches Admin"}
            </p>
            <Button
              onClick={handleLogout}
              disabled={actionLoading}
              className="bg-red-600 text-white"
            >
              {actionLoading ? "Loading..." : "Logout"}
            </Button>
          </div>
        )}

        {/* Admin Login */}
        {!canEditMatches && (
          <div className="text-center mb-6">
            {!showLogin ? (
              <Button
                onClick={() => setShowLogin(true)}
                className="bg-blue-600 text-white"
              >
                Admin Login
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {loginError && (
                  <p className="text-red-600">{loginError}</p>
                )}
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
                  onClick={handleAdminLogin}
                  disabled={actionLoading}
                  className="bg-green-600 text-white"
                >
                  {actionLoading ? "Loading..." : "Login"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Matches Table */}
        <Card>
          <CardContent>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th>Teams</th>
                  <th>Date</th>
                  <th>Status</th>
                  {canEditMatches && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id} className="text-center border-t">
                    <td>{m.teamA} vs {m.teamB}</td>
                    <td>{m.date}</td>
                    <td>{m.status}</td>
                    {canEditMatches && (
                      <td className="flex justify-center gap-2">
                        <Button className="bg-blue-600 text-white">
                          <CheckCircle size={16} />
                        </Button>
                        <Button className="bg-yellow-500 text-white">
                          <Edit size={16} />
                        </Button>
                        <Button className="bg-red-600 text-white">
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







