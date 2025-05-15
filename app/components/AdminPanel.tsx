"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function AdminPanel({ users }: { users: any[] }) {
  if (!Array.isArray(users)) {
    console.error("Users prop is not an array", users);
    return <div>Error: Users data is invalid</div>;
  }
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [tierMap, setTierMap] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const usersPerPage = 10;

  // Fetch users only if the users prop isn't already passed or if you prefer to re-fetch.
  // For this example, let's assume we need to fetch them from an API.
  // useEffect(() => {
  //   const fetchAllUsers = async () => {
  //     try {
  //       const res = await fetch("/api/user", { credentials: "include" });
  //       const data = await res.json();
  //       // Normally you would update the users here.
  //       // In this example, assume 'users' are passed in as a prop.
  //     } catch (error) {
  //       console.error("Error fetching users", error);
  //     } finally {
  //       // Mark loading as complete when fetch is done
  //       setLoading(false);
  //     }
  //   };

  //   fetchAllUsers();
  // }, []);
  useEffect(() => {
  setLoading(false); // Just mark loading as complete once users are passed in
}, []);

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
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

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

  // Render the loader until users are loaded
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 to-violet-200 px-4">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg">
          <p className="text-xl text-black">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center bg-gradient-to-tr from-blue-100 to-violet-200 px-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-7xl space-y-6 overflow-auto">
        <h1 className="text-3xl font-bold text-center text-black">🔧 Admin Panel</h1>

        <input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg border text-black"
        />

        {message && (
          <div className="text-center text-sm text-black">{message}</div>
        )}

        <table className="min-w-full table-auto border border-gray-300 text-sm text-black">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Tier</th>
              <th className="p-2 border">Remaining</th>
              <th className="p-2 border">Recharged</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => {
              if (!user || !user.id) return null;
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {user.name || "Unnamed User"}
                  </td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.tier || "N/A"}</td>
                  <td className="p-2 border">
                    {user.messagesLeft ?? "N/A"}
                  </td>
                  <td className="p-2 border">
                    <span
                      className={
                        user.hasRecharged
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {user.hasRecharged ? "✅ Yes" : "❌ No"}
                    </span>
                  </td>
                  <td className="p-2 border space-y-2">
                    <div className="flex gap-1 mb-1">
                      {["bronze", "silver", "gold"].map((tier, i) => (
                        <button
                          key={tier}
                          onClick={() =>
                            setTierMap((prev) => ({ ...prev, [user.id]: tier }))
                          }
                          className={`px-2 py-1 rounded-full text-xs ${
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
                      className="w-full bg-green-600 text-white py-1 text-xs rounded"
                    >
                      🚀 Confirm
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length > usersPerPage && (
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
                  prev < Math.ceil(filteredUsers.length / usersPerPage)
                    ? prev + 1
                    : prev
                )
              }
              disabled={
                currentPage >= Math.ceil(filteredUsers.length / usersPerPage)
              }
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
