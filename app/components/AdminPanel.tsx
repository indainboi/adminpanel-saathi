"use client";
import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [tierMap, setTierMap] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch("/api/user", {
          credentials: "include",
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
        credentials: "include",
      });
      if (res.ok) {
        setMessage("✅ Successfully logged out.");
        window.location.href = "/login";
      } else {
        setMessage("❌ Logout failed.");
      }
    } catch {
      setMessage("❌ An error occurred during logout.");
    }
  };

  function filterUsersByEmailOrName(input: string, users: any[]) {
    if (!input.trim()) return users;
  
    const lowerInput = input.toLowerCase();
    return users.filter(
      (user) =>
        user?.email?.toLowerCase().includes(lowerInput) ||
        user?.name?.toLowerCase().includes(lowerInput)
    );
  }

  const filteredUsers = filterUsersByEmailOrName(email, users);


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

  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-violet-200 px-4">
      <button
        onClick={logout}
        className="w-30 left-10 top-10 bg-red-600 text-white rounded-lg absolute"
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
          
        </div>

        {message && <div className="text-center text-sm">{message}</div>}

        <div className="mt-6 space-y-4 text-black">
          {filteredUsers.map((user, index) => {
            if (!user || !user.id) return null;

            return (
              <div
                key={user.id || index}
                className="p-4 rounded-lg border bg-white/90 space-y-2"
              >
                <h2 className="text-lg font-semibold">
                  👤 {user.name || "Unnamed User"}
                </h2>
                <p>
                  <strong>Email:</strong> {user.email || "N/A"}
                </p>
                <p>
                  <strong>Tier:</strong> {user.tier || "N/A"}
                </p>
                <p>
                  <strong>Remaining:</strong> {user.messagesLeft ?? "N/A"}
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
            );
          })}
        </div>

        {/* Pagination controls */}
        {users.length > usersPerPage && (
          <div className="flex justify-between mt-6 text-black">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded disabled:opacity-50"
            >
              ◀️ Prev
            </button>
            <span className="text-sm text-gray-700 self-center">
              Page {currentPage}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(users.length / usersPerPage)
                    ? prev + 1
                    : prev
                )
              }
              disabled={currentPage >= Math.ceil(users.length / usersPerPage)}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded disabled:opacity-50"
            >
              Next ▶️
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
