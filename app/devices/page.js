"use client";
import { useEffect, useState } from "react";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch("/api/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data));
  }, []);

  const connectToDevice = async (id) => {
    const res = await fetch("/api/connect", {
      method: "POST",
      body: JSON.stringify({ deviceId: id }),
    });

    const data = await res.json();
    alert(`Connected!\nToken: ${data.token}`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Devices</h1>
        <p className="text-gray-500 text-sm">
          All registered system devices
        </p>
      </div>

      {/* DEVICE LIST */}
      <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-4">
        <div className="divide-y divide-white/5">
          {devices.map((d) => (
            <div
              key={d.id}
              className="flex justify-between items-center py-3 px-2 text-sm hover:bg-white/5 rounded-lg transition"
            >
              {/* LEFT */}
              <div>
                <p className="text-gray-200">{d.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(d.lastSeen).toLocaleString()}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                {/* STATUS */}
                <span
                  className={`text-xs ${
                    d.isOnline ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {d.isOnline ? "ONLINE" : "OFFLINE"}
                </span>

                {/* CONNECT BUTTON */}
                <button
                  onClick={() => connectToDevice(d.id)}
                  disabled={!d.isOnline}
                  className={`text-xs px-3 py-1 rounded-md transition ${
                    d.isOnline
                      ? "bg-blue-600/20 hover:bg-blue-600/40 text-blue-400"
                      : "bg-gray-700/20 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>

        {devices.length === 0 && (
          <p className="text-gray-500 text-xs mt-3">
            No devices found
          </p>
        )}
      </div>
    </div>
  );
}