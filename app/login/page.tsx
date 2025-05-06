"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <button
        onClick={() => signIn("google", { callbackUrl: "/admin" })}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}