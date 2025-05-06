// components/AdminPanel.tsx
"use client";
import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [tierMap, setTierMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch("/api/user", {
          credentials: "include", // ⬅️ add this
        });
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setMessage("❌ Failed to fetch users.");
      }
    };
    fetchAllUsers();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // Ensure the session is cleared
      });
      if (res.ok) {
        setMessage("✅ Successfully logged out.");
        // Optionally, redirect to the login page or clear user data
        window.location.href = "/login"; // Or replace with your redirect path
      } else {
        setMessage("❌ Logout failed.");
      }
    } catch {
      setMessage("❌ An error occurred during logout.");
    }
  };

  const searchUser = async () => {
    setMessage("");
    try {
      const res = await fetch("/api/user", {
        credentials: "include", // ⬅️ add this
      });
      const data = await res.json();
      setUsers([data.user]);
    } catch {
      setMessage("❌ Failed to fetch user.");
    }
  };

  const upgradeUser = async (userId: string, tier: string) => {
    const messagesToAdd = tier === "bronze" ? 10 : tier === "silver" ? 50 : 100;
    if (!window.confirm(`Upgrade to ${tier} (+${messagesToAdd})?`)) return;

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, messagesToAdd }),
        credentials: "include",
      });
      const data = await res.json();
      setMessage(res.ok ? `✅ ${data.message}` : `❌ ${data.error}`);
    } catch {
      setMessage("❌ Upgrade failed.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-violet-200 px-4">
      <button
        onClick={logout}
        className="w-30 left-10 top-10 bg-red-600 text-white  rounded-lg  absolute  "
      >
        Logout
      </button>
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-black">
          🔧 Admin Panel
        </h1>

        <div className="space-y-4 text-black">
          <input
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border"
          />
          <button
            onClick={searchUser}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg"
          >
            🔍 Search User
          </button>
        </div>
        {message && <div className="text-center text-sm">{message}</div>}
        <div className="mt-6 space-y-4 text-black">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-lg border bg-white/90 space-y-2"
            >
              <h2 className="text-lg font-semibold">👤 {user.name}</h2>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Tier:</strong> {user.tier}
              </p>
              <p>
                <strong>Remaining:</strong> {user.messagesLeft}
              </p>
              <p>
                <strong>Recharged:</strong>{" "}
                <span
                  className={
                    user.hasRecharged
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {user.hasRecharged ? "✅ Yes" : "❌ No"}
                </span>
              </p>
              <div className="flex gap-2">
                {["bronze", "silver", "gold"].map((tier, i) => (
                  <button
                    key={tier}
                    onClick={() =>
                      setTierMap((prev) => ({ ...prev, [user.id]: tier }))
                    }
                    className={`px-3 py-1 rounded-full text-sm ${
                      tierMap[user.id] === tier
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {tier} (+{[10, 50, 100][i]})
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  upgradeUser(user.id, tierMap[user.id] || "bronze")
                }
                className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg"
              >
                🚀 Confirm Upgrade
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
