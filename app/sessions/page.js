"use client";
import { useEffect, useState } from "react";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sessions");

    if (saved) {
      setSessions(JSON.parse(saved));
    } else {
      const initialSessions = [
        {
          id: 1,
          device: "Database Server PC",
          user: "Admin",
          active: true,
          startTime: Date.now() - 1000 * 60 * 12,
          transfers: [
            { name: "forecasting2026.xlsx", size: "5MB", type: "spreadsheet", direction: "upload" },
            { name: "quarterlyforecastingmeetingtemplate.pptx", size: "2MB", type: "image", direction: "download" },
          ],
        },
        {
          id: 2,
          device: "Laptop",
          user: "Aidan",
          active: true,
          startTime: Date.now() - 1000 * 60 * 3,
          transfers: [
            { name: "mixdown.mp3", size: "8MB", type: "audio", direction: "upload" },
          ],
        },
        {
          id: 3,
          device: "Laptop",
          user: "Bilal",
          active: false,
          startTime: Date.now() - 1000 * 60 * 45,
          endTime: Date.now() - 1000 * 60 * 5,
          transfers: [
            { name: "project.zip", size: "20MB", type: "archive", direction: "upload" },
          ],
        },
        {
          id: 4,
          device: "Office Desktop - Aidan",
          user: "Aidan",
          active: false,
          startTime: Date.now() - 1000 * 60 * 120,
          endTime: Date.now() - 1000 * 60 * 60,
          transfers: [
            { name: "report.pdf", size: "3MB", type: "document", direction: "download" },
          ],
        },
        {
          id: 5,
          device: "Bilal's MacBook",
          user: "admin",
          active: false,
          startTime: Date.now() - 1000 * 60 * 300,
          endTime: Date.now() - 1000 * 60 * 250,
          transfers: [],
        },

        {
          id: 6,
          device: "Accounting PC",
          user: "Admin",
          active: false,
          startTime: Date.now() - 1000 * 60 * 60 * 24,
          endTime: Date.now() - 1000 * 60 * 60 * 23,
          transfers: [{ name: "budget.xlsx", size: "4MB", type: "spreadsheet", direction: "download" }],
        },
        {
          id: 7,
          device: "Aidan's Work Laptop",
          user: "Aidan",
          active: false,
          startTime: Date.now() - 1000 * 60 * 60 * 26,
          endTime: Date.now() - 1000 * 60 * 60 * 25,
          transfers: [{ name: "demo.mp4", size: "25MB", type: "video", direction: "upload" }],
        },
        {
          id: 8,
          device: "Bilal's PC",
          user: "Bilal",
          active: false,
          startTime: Date.now() - 1000 * 60 * 60 * 30,
          endTime: Date.now() - 1000 * 60 * 60 * 29,
          transfers: [],
        },
        {
          id: 9,
          device: "Office Desktop - Justin",
          user: "Justin",
          active: false,
          startTime: Date.now() - 1000 * 60 * 60 * 36,
          endTime: Date.now() - 1000 * 60 * 60 * 35,
          transfers: [{ name: "presentation.pptx", size: "6MB", type: "document", direction: "upload" }],
        },
        {
          id: 10,
          device: "HR Laptop",
          user: "Justin",
          active: false,
          startTime: Date.now() - 1000 * 60 * 60 * 48,
          endTime: Date.now() - 1000 * 60 * 60 * 47,
          transfers: [{ name: "employee_records.csv", size: "2MB", type: "data", direction: "download" }],
        },
        {
          id: 11,
          device: "Database Server PC",
          user: "Admin",
          active: false,
          startTime: Date.now() - 1000 * 60 * 60 * 72,
          endTime: Date.now() - 1000 * 60 * 60 * 70,
          transfers: [{ name: "backup.sql", size: "50MB", type: "database", direction: "upload" }],
        },
        {
          id: 12,
          device: "Laptop",
          user: "Aidan",
          active: false,
          startTime: Date.now() - 1000 * 60 * 60 * 80,
          endTime: Date.now() - 1000 * 60 * 60 * 78,
          transfers: [{ name: "render.wav", size: "12MB", type: "audio", direction: "upload" }],
        },
        {
          id: 13,
          device: "Bilal's MacBook",
          user: "Bilal",
          active: false,
          startTime: Date.now() - 1000 * 60 * 60 * 96,
          endTime: Date.now() - 1000 * 60 * 60 * 94,
          transfers: [],
        },
        {
          id: 14,
          device: "Accounting PC",
          user: "Aidan",
          active: false,
          startTime: Date.now() - 1000 * 60 * 60 * 120,
          endTime: Date.now() - 1000 * 60 * 60 * 118,
          transfers: [{ name: "tax_report.pdf", size: "3MB", type: "document", direction: "download" }],
        },
        {
          id: 15,
          device: "Aidan's Work Laptop",
          user: "Aidan",
          active: true,
          startTime: Date.now() - 1000 * 60 * 10,
          transfers: [{ name: "final_mix.wav", size: "15MB", type: "audio", direction: "upload" }],
        },
      ];

      setSessions(initialSessions);
      localStorage.setItem("sessions", JSON.stringify(initialSessions));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sessions", JSON.stringify(sessions));
      window.dispatchEvent(new Event("sessionsUpdated"));
    }
  }, [sessions, isLoaded]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) return null;

  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.active && !b.active) return -1;
    if (!a.active && b.active) return 1;
    return b.startTime - a.startTime;
  });

  const formatDuration = (startTime) => {
    const diff = Math.floor((now - startTime) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  const formatEnded = (startTime, endTime) => {
    const diff = Math.floor((endTime - startTime) / 1000);
    const mins = Math.floor(diff / 60);
    const date = new Date(endTime).toLocaleString();
    return `${mins}m • ${date}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Session Monitor</h1>

      <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-4">
        <div className="divide-y divide-white/5">
          {sortedSessions.map((s) => (
            <div key={s.id} className="flex justify-between items-center py-3 px-2 text-sm hover:bg-white/5 rounded-lg">
              
              {/* LEFT */}
              <div>
                <p className="text-gray-200">
                  {s.device} <span className="text-gray-500">• {s.user}</span>
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-mono">
                    {s.active
                      ? formatDuration(s.startTime)
                      : formatEnded(s.startTime, s.endTime)}
                  </span>

                  {s.active && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-70"></span>
                      <span className="relative rounded-full h-2 w-2 bg-green-400"></span>
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                <span className={`text-xs ${s.active ? "text-green-400" : "text-gray-500"}`}>
                  {s.active ? "ACTIVE" : "ENDED"}
                </span>

                {/* TRANSFER COUNT + ICON */}
                <button
                  onClick={() => setSelectedSession(s)}
                  className="flex items-center gap-1 text-gray-400 hover:text-blue-400 text-sm"
                >
                  <span className="text-xs text-gray-500">
                    {s.transfers.length}
                  </span>
                  📄
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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

/* MODAL */
function TransferModal({ session, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="w-full max-w-xl bg-[#0b0f14] border border-white/10 rounded-xl p-5">
        
        <div className="flex justify-between mb-4">
          <h2 className="text-sm uppercase text-gray-400">
            File Transfers
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-2">
          {session.transfers.map((t, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <p className="text-gray-200">{t.name}</p>
                <p className="text-xs text-gray-500">{t.type} • {t.size}</p>
              </div>

              <span className="text-xs text-blue-400">
                {t.direction}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}