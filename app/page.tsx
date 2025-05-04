"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [tierMap, setTierMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error:", errorText);
          setMessage(`❌ ${errorText || "Failed to fetch users."}`);
        } else {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to fetch users.");
      }
    };

    fetchAllUsers();
  }, []);

  const searchUser = async () => {
    setMessage("");
    try {
      const res = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error:", errorText);
        setMessage(`❌ ${errorText || "User not found."}`);
        setUsers([]);
      } else {
        const data = await res.json();
        setUsers([data.user]);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch user.");
    }
  };

  const upgradeUser = async (userId: string, tier: string) => {
    const messagesToAdd = tier === "bronze" ? 10 : tier === "silver" ? 50 : 100;
    const confirm = window.confirm(
      `Are you sure you want to upgrade the user to '${tier}' tier and add +${messagesToAdd} messages?`
    );
    if (!confirm) return;

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, messagesToAdd }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.error || "Failed to upgrade user."}`);
      } else {
        setMessage(`✅ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Upgrade failed.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-violet-200 px-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-black">🔧 Admin Panel</h1>

        <div className="space-y-4 text-black">
          <input
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={searchUser}
            className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            🔍 Search User
          </button>
        </div>

        {message && (
          <div className="text-center text-sm text-indigo-700 font-medium">
            {message}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-lg border text-black bg-white/90 shadow-md space-y-2"
            >
              <h2 className="text-lg font-semibold">👤 {user.name}</h2>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Current Tier:</strong> {user.tier}
              </p>
              <p>
                <strong>API Requests Remaining:</strong> {user.messagesLeft}
              </p>

              <div className="flex gap-2 flex-wrap">
                {[
                  { tier: "bronze", messages: 10 },
                  { tier: "silver", messages: 50 },
                  { tier: "gold", messages: 100 },
                ].map(({ tier, messages }) => (
                  <button
                    key={tier}
                    onClick={() =>
                      setTierMap((prev) => ({ ...prev, [user.id]: tier }))
                    }
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      tierMap[user.id] === tier
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {tier} (+{messages})
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  upgradeUser(user.id, tierMap[user.id] || "bronze")
                }
                className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
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
