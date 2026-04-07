"use client";
import { useEffect, useState } from "react";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [now, setNow] = useState(Date.now());

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
        user: "Bilal",
        active: false,
        startTime: Date.now() - 1000 * 60 * 45,
        duration: "45m",
        transfers: [
          { name: "project.zip", size: "20MB", type: "archive", direction: "upload" },
        ],
      },
    ]);
  }, []);

  // ⏱️ Live ticking
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
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
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Session Monitor
        </h1>
        <p className="text-gray-500 text-sm">
          Live remote activity stream
        </p>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="Active Sessions" value={activeCount} accent="green" />
        <MetricCard label="Total Sessions" value={sessions.length} accent="blue" />
        <MetricCard
          label="Transfers"
          value={totalTransfers}
          accent="purple"
          onClick={() => setSelectedSession("ALL")}
        />
      </div>

      {/* SESSION STREAM */}
      <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-4">
        <p className="text-xs text-gray-500 uppercase mb-3">
          Live Sessions
        </p>

        <div className="divide-y divide-white/5">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center py-3 px-2 text-sm hover:bg-white/5 rounded-lg transition"
            >
              {/* LEFT */}
              <div>
                <p className="text-gray-200">
                  {s.device} <span className="text-gray-500">• {s.user}</span>
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-mono">
                    {s.active
                      ? formatDuration(s.startTime)
                      : s.duration}
                  </span>

                  {/* 🟢 PULSE */}
                  {s.active && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-70"></span>
                      <span className="relative rounded-full h-2 w-2 bg-green-400 shadow-[0_0_6px_#4ade80]"></span>
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                {/* STATUS */}
                <span
                  className={`text-xs ${
                    s.active ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {s.active ? "ACTIVE" : "ENDED"}
                </span>

                {/* ACTIONS */}
                <button
                  onClick={() => setSelectedSession(s)}
                  className="text-xs px-2 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 transition"
                >
                  Inspect
                </button>

                {s.active && (
                  <button className="text-xs px-2 py-1 rounded-md bg-red-600/20 hover:bg-red-600/40 text-red-400 transition">
                    Terminate
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

/* METRIC CARD */
function MetricCard({ label, value, accent, onClick }) {
  const colors = {
    green: "text-green-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#0b0f14] border border-white/5 rounded-xl p-4 ${
        onClick ? "cursor-pointer hover:bg-white/5 transition" : ""
      }`}
    >
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${colors[accent]}`}>
        {value}
      </p>
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="w-full max-w-xl bg-[#0b0f14] border border-white/10 rounded-xl p-5">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm uppercase text-gray-400">
            Transfer Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-auto text-sm">
          {transfers.map((t, i) => (
            <div
              key={i}
              className="flex justify-between items-center px-2 py-2 rounded-md hover:bg-white/5"
            >
              <div>
                <p className="text-gray-200">{t.name}</p>
                <p className="text-xs text-gray-500">
                  {t.type} • {t.size}
                </p>
              </div>

              <span
                className={`text-xs ${
                  t.direction === "upload"
                    ? "text-blue-400"
                    : "text-purple-400"
                }`}
              >
                {t.direction.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}