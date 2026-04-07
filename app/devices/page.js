"use client";
import { useEffect, useState } from "react";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch("/api/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data));
  }, []);

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
              className="flex justify-between items-center py-3 px-2 text-sm hover:bg-white/5 rounded-lg"
            >
              <div>
                <p className="text-gray-200">{d.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(d.lastSeen).toLocaleString()}
                </p>
              </div>

              <span
                className={`text-xs ${
                  d.isOnline ? "text-green-400" : "text-red-400"
                }`}
              >
                {d.isOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}