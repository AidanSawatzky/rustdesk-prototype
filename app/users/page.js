"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState("");
  const [role, setRole] = useState("Standard");

  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ LOAD users
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers([
        {
          id: 1,
          username: "admin",
          role: "Administrator",
          lastLogin: "2024-06-01 12:34",
          allowedDeviceIds: [],
          roleIds: [],
        },
      ]);
    }

    setIsLoaded(true);
  }, []);

  // 💾 SAVE users
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users, isLoaded]);

  const addUser = () => {
    if (!newUser) return;

    setUsers([
      ...users,
      {
        id: Date.now(),
        username: newUser,
        role,
        lastLogin: "Never",
        allowedDeviceIds: [],
        roleIds: [],
      },
    ]);

    setNewUser("");
  };

  const deleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const updateUser = (updatedUser) => {
    const updatedUsers = users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );

    setUsers(updatedUsers);
    setSelectedUser(updatedUser);
  };

  if (!isLoaded) return null;

  // 🔥 SORT ADMINS FIRST
  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === "Administrator" && b.role !== "Administrator") return -1;
    if (a.role !== "Administrator" && b.role === "Administrator") return 1;
    return 0;
  });

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
          {sortedUsers.map((u) => (
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
              <div className="flex items-center gap-3">
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

                {/* ACCESS */}
                <button
                  onClick={() => setSelectedUser(u)}
                  className="text-xs px-2 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 transition"
                >
                  Address Book
                </button>

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

      {/* MODAL */}
      {selectedUser && (
        <AddressBookModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          updateUser={updateUser}
        />
      )}
    </div>
  );
}

/* MODAL */
function AddressBookModal({ user, onClose, updateUser }) {
  const [devices, setDevices] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch("/api/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data));

    const savedRoles = JSON.parse(localStorage.getItem("roles")) || [];
    setRoles(savedRoles);
  }, []);

  const isAdmin = user.role === "Administrator";

  const toggleRole = (roleId) => {
    const current = user.roleIds || [];

    const updated = current.includes(roleId)
      ? current.filter((id) => id !== roleId)
      : [...current, roleId];

    updateUser({
      ...user,
      roleIds: updated,
    });
  };

  const toggleDevice = (deviceId) => {
    const current = user.allowedDeviceIds || [];

    const updated = current.includes(deviceId)
      ? current.filter((id) => id !== deviceId)
      : [...current, deviceId];

    updateUser({
      ...user,
      allowedDeviceIds: updated,
    });
  };

  const roleDevices = roles
    .filter((r) => (user.roleIds || []).includes(r.id))
    .flatMap((r) => r.deviceIds || []);

  const hasAccess = (deviceId) => {
    if (isAdmin) return true;
    if ((user.allowedDeviceIds || []).includes(deviceId)) return true;
    if (roleDevices.includes(deviceId)) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="w-full max-w-xl bg-[#0b0f14] border border-white/10 rounded-xl p-5">
        
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-sm uppercase text-gray-400">
              {user.username}'s Address Book
            </h2>
            <p className="text-gray-200">{user.username}</p>
          </div>
          <button onClick={onClose}>✕</button>
        </div>

        {/* ROLES */}
        <div className="mb-5">
          <p className="text-xs text-gray-500 uppercase mb-2">
            Roles
          </p>

          <div className="flex flex-wrap gap-2">
            {roles.map((r) => {
              const selected = (user.roleIds || []).includes(r.id);

              return (
                <button
                  key={r.id}
                  onClick={() => toggleRole(r.id)}
                  className={`px-2 py-1 text-xs rounded-md ${
                    selected
                      ? "bg-blue-600/20 text-blue-400"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  {r.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* DEVICES */}
        <div>
          <p className="text-xs text-gray-500 uppercase mb-2">
            Device Overrides
          </p>

          <div className="space-y-2 max-h-72 overflow-auto">
            {devices.map((d) => {
              const allowed = hasAccess(d.id);

              return (
                <div
                  key={d.id}
                  className="flex justify-between items-center px-2 py-2 rounded-md hover:bg-white/5"
                >
                  <div>
                    <p className="text-gray-200">{d.name}</p>
                    <p className="text-xs text-gray-500">
                      {d.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>

                  {isAdmin ? (
                    <span className="text-xs text-purple-400">
                      FULL ACCESS
                    </span>
                  ) : (
                    <button
                      onClick={() => toggleDevice(d.id)}
                      className={`text-xs px-2 py-1 rounded-md ${
                        allowed
                          ? "bg-green-600/20 text-green-400"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      {allowed ? "Allowed" : "Blocked"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}