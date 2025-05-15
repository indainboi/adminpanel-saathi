"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-violet-200 px-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-black">🔐 Admin Login</h1>
        <p className="text-gray-700">Sign in with an authorized Google account to access the admin panel.</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 rounded-lg text-lg"
        >
          🔑 Sign in with Google
        </button>
      </div>
    </main>
  );
}
