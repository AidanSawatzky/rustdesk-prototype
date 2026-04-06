export const devices = [
  {
    id: "1",
    name: "Studio-PC",
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Laptop",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000).toISOString(),
  },
];