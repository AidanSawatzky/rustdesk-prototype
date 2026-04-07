"use client";
import { useState, useEffect } from "react";

export default function RolePage() {
  const [roles, setRoles] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false); // 🔥 important

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  // ✅ LOAD roles (client only)
  useEffect(() => {
    const saved = localStorage.getItem("roles");
    if (saved) {
      setRoles(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // 💾 SAVE roles
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("roles", JSON.stringify(roles));
    }
  }, [roles, isLoaded]);

  // 📡 Load devices
  useEffect(() => {
    fetch("/api/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data));
  }, []);

  const createRole = () => {
    if (!newRoleName.trim()) return;

    setRoles([
      ...roles,
      {
        id: Date.now(),
        name: newRoleName,
        deviceIds: [],
      },
    ]);

    setNewRoleName("");
  };

  const deleteRole = (id) => {
    setRoles(roles.filter((r) => r.id !== id));
    if (selectedRoleId === id) setSelectedRoleId(null);
  };

  const updateRole = (updatedRole) => {
    setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
  };

  // 🔥 Prevent hydration mismatch
  if (!isLoaded) return null;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Roles</h1>
        <p className="text-gray-500 text-sm">
          Group devices into reusable access roles
        </p>
      </div>

      {/* CREATE ROLE */}
      <div className="flex gap-2 bg-[#0b0f14] border border-white/5 rounded-xl p-3">
        <input
          className="flex-1 bg-transparent text-sm outline-none px-2 text-gray-200"
          placeholder="New role name..."
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
        />
        <button
          onClick={createRole}
          className="px-3 py-1 text-xs rounded-md bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 transition"
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* LEFT PANEL */}
        <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-3">
          <p className="text-xs text-gray-500 uppercase mb-3">
            Roles
          </p>

          {roles.length === 0 && (
            <p className="text-gray-500 text-xs">No roles created</p>
          )}

          <div className="space-y-2">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`p-3 rounded-lg cursor-pointer transition text-sm ${
                  selectedRoleId === role.id
                    ? "bg-blue-600/20 border border-blue-500/40"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-200">{role.name}</p>
                    <p className="text-[10px] text-gray-500">
                      {(role.deviceIds || []).length} devices
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRole(role.id);
                    }}
                    className="text-gray-500 hover:text-red-400 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-2">
          {selectedRole ? (
            <RoleDetails
              role={selectedRole}
              devices={devices}
              updateRole={updateRole}
            />
          ) : (
            <div className="text-gray-500 text-sm">
              Select a role to configure device access
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ROLE DETAILS */
function RoleDetails({ role, devices, updateRole }) {
  const toggleDevice = (deviceId) => {
    const current = role.deviceIds || [];

    const updated = current.includes(deviceId)
      ? current.filter((id) => id !== deviceId)
      : [...current, deviceId];

    updateRole({
      ...role,
      deviceIds: updated,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{role.name}</h2>
        <p className="text-xs text-gray-500">
          {(role.deviceIds || []).length} devices assigned
        </p>
      </div>

      <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-4">
        <p className="text-xs text-gray-500 uppercase mb-3">
          Assign Devices
        </p>

        <div className="space-y-2 max-h-96 overflow-auto">
          {devices.map((d) => {
            const selected = (role.deviceIds || []).includes(d.id);

            return (
              <div
                key={d.id}
                className="flex justify-between items-center px-2 py-2 rounded-md hover:bg-white/5 transition"
              >
                <div>
                  <p className="text-gray-200">{d.name}</p>
                  <p className="text-xs text-gray-500">
                    {d.isOnline ? "Online" : "Offline"}
                  </p>
                </div>

                <button
                  onClick={() => toggleDevice(d.id)}
                  className={`text-xs px-2 py-1 rounded-md transition ${
                    selected
                      ? "bg-green-600/20 text-green-400"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {selected ? "Assigned" : "Add"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}