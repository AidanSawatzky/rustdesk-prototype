"use client";
import { useEffect, useState } from "react";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [now, setNow] = useState(Date.now());

  // 🔥 Fake data with startTime
  useEffect(() => {
    setSessions([
      {
        id: 1,
        device: "Studio-PC",
        user: "Admin",
        active: true,
        startTime: Date.now() - 1000 * 60 * 12,
        transfers: [
          { name: "track.wav", size: "5MB", type: "audio", direction: "upload" },
          { name: "cover.png", size: "2MB", type: "image", direction: "download" },
        ],
      },
      {
        id: 2,
        device: "Laptop",
        user: "Elliot",
        active: false,
        startTime: Date.now() - 1000 * 60 * 45,
        duration: "45m",
        transfers: [
          { name: "project.zip", size: "20MB", type: "archive", direction: "upload" },
        ],
      },
    ]);
  }, []);

  // ⏱️ Live ticking timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (startTime) => {
    const diff = Math.floor((now - startTime) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  const activeCount = sessions.filter((s) => s.active).length;
  const totalTransfers = sessions.reduce(
    (sum, s) => sum + s.transfers.length,
    0
  );

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-3xl font-semibold tracking-tight mb-1">
        Sessions
      </h1>
      <p className="text-gray-400 mb-6">
        Monitor remote access sessions and activity
      </p>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <StatCard title="Active Sessions" value={activeCount} />
        <StatCard title="Total Sessions" value={sessions.length} />
        <StatCard
          title="Total Transfers"
          value={totalTransfers}
          onClick={() => setSelectedSession("ALL")}
        />
      </div>

      {/* SESSION LIST */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-lg">
        <h2 className="text-lg mb-4">Recent Sessions</h2>

        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition"
            >
              {/* LEFT */}
              <div>
                <p className="font-medium">
                  {s.device} • {s.user}
                </p>

                <p className="text-xs text-gray-400 flex items-center gap-2">
                  Duration:
                  <span className="font-mono transition-all">
                    {s.active
                      ? formatDuration(s.startTime)
                      : s.duration}
                  </span>

                  {/* 🔥 PULSING DOT */}
                  {s.active && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    s.active
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {s.active ? "Active" : "Completed"}
                </span>

                <button
                  onClick={() => setSelectedSession(s)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm transition"
                >
                  View Transfers
                </button>

                {s.active && (
                  <button className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm transition">
                    End
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedSession && (
        <TransferModal
          session={selectedSession}
          sessions={sessions}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}

/* STAT CARD */
function StatCard({ title, value, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-lg ${
        onClick ? "cursor-pointer hover:bg-white/10 transition" : ""
      }`}
    >
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

/* MODAL */
function TransferModal({ session, sessions, onClose }) {
  const transfers =
    session === "ALL"
      ? sessions.flatMap((s) =>
          s.transfers.map((t) => ({
            ...t,
            device: s.device,
          }))
        )
      : session.transfers;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-xl">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transfer Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-auto">
          {transfers.map((t, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-gray-400">
                  {t.type} • {t.size}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  t.direction === "upload"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-purple-500/20 text-purple-400"
                }`}
              >
                {t.direction}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}