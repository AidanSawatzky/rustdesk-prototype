"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [connectionsData, setConnectionsData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    fetch("/api/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data));
  }, []);

  useEffect(() => {
    const loadUsers = () => {
      const saved = localStorage.getItem("users");
      setUsers(saved ? JSON.parse(saved) : []);
    };

    loadUsers();
    window.addEventListener("storage", loadUsers);
    window.addEventListener("focus", loadUsers);

    return () => {
      window.removeEventListener("storage", loadUsers);
      window.removeEventListener("focus", loadUsers);
    };
  }, []);

 
  useEffect(() => {
    const loadSessions = () => {
      const saved = localStorage.getItem("sessions");
      setSessions(saved ? JSON.parse(saved) : []);
    };

    loadSessions();
    window.addEventListener("storage", loadSessions);
    window.addEventListener("focus", loadSessions);

    return () => {
      window.removeEventListener("storage", loadSessions);
      window.removeEventListener("focus", loadSessions);
    };
  }, []);


  useEffect(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));

      return {
        label: days[d.getDay()],
        date: d.toDateString(),
        count: 0,
      };
    });

    sessions.forEach((s) => {
      const sessionDate = new Date(s.startTime).toDateString();
      const day = last7Days.find((d) => d.date === sessionDate);
      if (day) day.count += 1;
    });

    setConnectionsData(last7Days);
  }, [sessions]);


  const connectToDevice = async (id) => {
    const res = await fetch("/api/connect", {
      method: "POST",
      body: JSON.stringify({ deviceId: id }),
    });

    const data = await res.json();
    alert(`Connected!\nToken: ${data.token}`);
  };


  const onlineDevices = devices.filter((d) => d.isOnline).length;
  const activeUsers = users.length;
  const activeSessions = sessions.filter((s) => s.active).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          System Overview
        </h1>
        <p className="text-gray-500 text-sm">
          Real-time infrastructure monitoring
        </p>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Active Devices" value={onlineDevices} accent="green" />
        <MetricCard label="Total Devices" value={devices.length} accent="blue" />
        <MetricCard label="Users" value={activeUsers} accent="purple" />
        <MetricCard label="Sessions" value={activeSessions} accent="blue" />
      </div>

      {/* GRAPH */}
      <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-5">
        <h2 className="text-sm text-gray-400 mb-4 uppercase tracking-wide">
          Sessions (7d)
        </h2>

        <div className="relative h-48 flex items-end gap-3">
          {/* GRID */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 w-full border-t border-white/5"
              style={{ bottom: `${(i + 1) * 25}%` }}
            />
          ))}

          {connectionsData.map((d, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center flex-1"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* TOOLTIP */}
              {hoveredIndex === i && (
                <div className="absolute -top-10 px-2 py-1 text-xs rounded-md bg-black text-white border border-white/10 shadow-lg whitespace-nowrap">
                  {d.count} sessions
                  <div className="text-[10px] text-gray-400 text-center">
                    {d.label}
                  </div>
                </div>
              )}

              {/* BAR */}
              <div
                className={`w-full rounded-md transition-all duration-200 ${
                  hoveredIndex === i
                    ? "bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.7)] scale-105"
                    : "bg-gradient-to-t from-blue-600 to-blue-400"
                }`}
                style={{
                  height: `${d.count * 14}px`,
                }}
              />

              {/* LABEL */}
              <span className="text-[10px] text-gray-500 mt-2">
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DEVICES */}
      <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-5">
        <h2 className="text-sm text-gray-400 mb-4 uppercase tracking-wide">
          Devices
        </h2>

        <div className="divide-y divide-white/5">
          {devices.map((d) => (
            <div
              key={d.id}
              className="flex justify-between items-center py-3 text-sm hover:bg-white/5 px-2 rounded-lg transition"
            >
              <div>
                <p className="font-medium text-gray-200">{d.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(d.lastSeen).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      d.isOnline
                        ? "bg-green-400 shadow-[0_0_6px_#4ade80]"
                        : "bg-red-400"
                    }`}
                  />
                  <span className="text-xs text-gray-400">
                    {d.isOnline ? "Online" : "Offline"}
                  </span>
                </div>

                <button
                  onClick={() => connectToDevice(d.id)}
                  className="text-xs px-3 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 transition"
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* METRIC CARD */
function MetricCard({ label, value, accent }) {
  const colors = {
    green: "text-green-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
  };

  return (
    <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-2xl font-semibold mt-1 ${colors[accent]}`}>
        {value}
      </p>
    </div>
  );
}