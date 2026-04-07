"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("users");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 1,
              username: "admin",
              role: "Administrator",
              lastLogin: "2024-06-01 12:34",
            },
          ];
    }
    return [];
  });

  const [newUser, setNewUser] = useState("");
  const [role, setRole] = useState("Standard");

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = () => {
    if (!newUser) return;

    setUsers([
      ...users,
      {
        id: Date.now(),
        username: newUser,
        role,
        lastLogin: "Never",
      },
    ]);

    setNewUser("");
  };

  const deleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          User Management
        </h1>
        <p className="text-gray-500 text-sm">
          Control access and permissions
        </p>
      </div>

      {/* ADD USER */}
      <div className="flex gap-2 bg-[#0b0f14] border border-white/5 rounded-xl p-3">
        <input
          className="flex-1 bg-transparent text-sm px-2 outline-none text-gray-200"
          placeholder="Username..."
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-transparent text-sm border border-white/10 rounded-md px-2 text-gray-300"
        >
          <option>Standard</option>
          <option>Administrator</option>
        </select>

        <button
          onClick={addUser}
          className="px-3 py-1 text-xs rounded-md bg-green-600/20 hover:bg-green-600/40 text-green-400 transition"
        >
          Add
        </button>
      </div>

      {/* USER LIST */}
      <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-4">
        <p className="text-xs text-gray-500 uppercase mb-3">
          Users
        </p>

        <div className="divide-y divide-white/5">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center py-3 px-2 text-sm hover:bg-white/5 rounded-lg transition"
            >
              {/* LEFT */}
              <div>
                <p className="text-gray-200">{u.username}</p>
                <p className="text-xs text-gray-500">
                  Last login: {u.lastLogin}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                {/* ROLE */}
                <span
                  className={`text-xs ${
                    u.role === "Administrator"
                      ? "text-purple-400"
                      : "text-blue-400"
                  }`}
                >
                  {u.role.toUpperCase()}
                </span>

                {/* DELETE */}
                <button
                  onClick={() => deleteUser(u.id)}
                  className="text-xs px-2 py-1 rounded-md bg-red-600/20 hover:bg-red-600/40 text-red-400 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <p className="text-gray-500 text-xs mt-3">
            No users created
          </p>
        )}
      </div>
    </div>
  );
}