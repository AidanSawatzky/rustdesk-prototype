"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [connectionsData, setConnectionsData] = useState([]);

  useEffect(() => {
    fetch("/api/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data));

    setConnectionsData([
      { day: "Mon", count: 5 },
      { day: "Tue", count: 8 },
      { day: "Wed", count: 3 },
      { day: "Thu", count: 10 },
      { day: "Fri", count: 6 },
      { day: "Sat", count: 2 },
      { day: "Sun", count: 4 },
    ]);
  }, []);

  const connectToDevice = async (id) => {
    const res = await fetch("/api/connect", {
      method: "POST",
      body: JSON.stringify({ deviceId: id }),
    });

    const data = await res.json();
    alert(`Connected!\nToken: ${data.token}`);
  };

  const onlineDevices = devices.filter((d) => d.isOnline).length;
  const activeUsers = 4;

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

      {/* METRICS GRID */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="Active Devices"
          value={onlineDevices}
          accent="green"
        />
        <MetricCard
          label="Total Devices"
          value={devices.length}
          accent="blue"
        />
        <MetricCard
          label="Active Users"
          value={activeUsers}
          accent="purple"
        />
      </div>

      {/* GRAPH */}
      <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-5">
        <h2 className="text-sm text-gray-400 mb-4 uppercase tracking-wide">
          Connections (7d)
        </h2>

        <div className="relative h-48 flex items-end gap-3">
          {/* GRID LINES */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 w-full border-t border-white/5"
              style={{ bottom: `${(i + 1) * 25}%` }}
            />
          ))}

          {connectionsData.map((d, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className="w-full rounded-md bg-linear-to-t from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.4)] transition hover:scale-105"
                style={{
                  height: `${d.count * 12}px`,
                }}
              />
              <span className="text-[10px] text-gray-500 mt-2">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DEVICE TABLE */}
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
              {/* LEFT */}
              <div>
                <p className="font-medium text-gray-200">{d.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(d.lastSeen).toLocaleString()}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                {/* STATUS DOT */}
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

                {/* ACTION */}
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