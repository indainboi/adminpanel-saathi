// app/admin/AdminDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import AdminPanel from "../components/AdminPanel";
import Feedback from "../components/Feedback";
import DeleteRequest from "../components/DeleteRequest";
import { signOut } from "next-auth/react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"admin" | "feedback" | "delete">(
    "admin"
  );
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [deleteRequests, setDeleteRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        const data = await res.json();
        setAllUsers(data.users || []);
      } catch {
        setError("❌ Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("/api/feedback", { credentials: "include" });
        const data = await res.json();
        setFeedbacks(data.feedback || []);
      } catch {
        console.error("❌ Failed to fetch feedback");
      }
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const fetchDeleteRequests = async () => {
      try {
        const res = await fetch("/api/delete-request", { credentials: "include" });
        const data = await res.json();
        setDeleteRequests(data.requests || []);
      } catch {
        console.error("❌ Failed to fetch delete requests");
      }
    };
    fetchDeleteRequests();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "feedback":
        return <Feedback feedbacks={feedbacks} />;
      case "delete":
        return <DeleteRequest requests={deleteRequests} />;
      default:
        return <AdminPanel users={allUsers} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white backdrop-blur-md p-6 space-y-4 shadow-md ">
        <h2 className="text-2xl font-bold mb-6 text-black">Admin Dashboard</h2>
        <nav className="space-y-3 text-black">
          <button
            onClick={() => setActiveTab("admin")}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "admin"
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            🛠 Admin Panel
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "feedback"
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            📝 Feedback
          </button>
          <button
            onClick={() => setActiveTab("delete")}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "delete"
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            🗑️ Delete Requests
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="block w-full text-left px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-indigo-100">{renderContent()}</main>
    </div>
  );
}
