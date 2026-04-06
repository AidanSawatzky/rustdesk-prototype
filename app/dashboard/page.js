"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [connectionsData, setConnectionsData] = useState([]);

  useEffect(() => {
    fetch("/api/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data));

    // 🔥 Fake connections per day data
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

  // 👤 Fake active users (for prototype)
  const activeUsers = 4;

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-3xl font-semibold tracking-tight mb-1">
        Dashboard
      </h1>
      <p className="text-gray-400 mb-6">
        Monitor system activity and performance
      </p>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <StatCard title="Active Devices" value={onlineDevices} />
        <StatCard title="Total Devices" value={devices.length} />
        <StatCard title="Active Users" value={activeUsers} />
      </div>

      {/* CHART */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-lg mb-6">
        <h2 className="text-lg mb-4">Connections Per Day</h2>

        <div className="flex items-end gap-4 h-40">
          {connectionsData.map((d, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              
              {/* BAR */}
              <div
                className="w-full bg-blue-500/70 rounded-lg hover:bg-blue-400 transition"
                style={{
                  height: `${d.count * 10}px`,
                }}
              />

              {/* LABEL */}
              <span className="text-xs text-gray-400 mt-2">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DEVICE LIST */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-lg">
        <h2 className="text-lg mb-4">Devices</h2>

        <div className="space-y-3">
          {devices.map((d) => (
            <div
              key={d.id}
              className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition"
            >
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="text-xs text-gray-400">
                  Last seen: {new Date(d.lastSeen).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    d.isOnline
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {d.isOnline ? "Online" : "Offline"}
                </span>

                <button
                  onClick={() => connectToDevice(d.id)}
                  className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-sm"
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

/* STAT CARD */
function StatCard({ title, value }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-lg">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}