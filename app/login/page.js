"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-black">
      
      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
        
        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            RustDesk Manager
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign in to continue
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="space-y-4">
          
          <input
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-medium"
          >
            Sign In
          </button>

        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Prototype system — demo credentials: admin / password
        </div>

      </div>
    </div>
  );
}