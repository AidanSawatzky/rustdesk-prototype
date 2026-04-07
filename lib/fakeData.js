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
  {
    id: "3",
    name: "Office Desktop - Aidan",
    isOnline: true,
    lastSeen: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "4",
    name: "Bilal's MacBook",
    isOnline: true,
    lastSeen: new Date(Date.now() - 300000).toISOString(),
  }
];