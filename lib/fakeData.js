export const devices = [
  {
    id: "1",
    name: "Database Server PC",
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
  },
  {
    id: "5",
    name: "Bilal's PC",
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "6",
    name: "Aidan's Work Laptop",
    isOnline: true,
    lastSeen: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: "7",
    name: "Office Desktop - Justin",
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "8",
    name: "Accounting PC",
    isOnline: true,
    lastSeen: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "9",
    name: "HR Laptop",
    isOnline: false,
    lastSeen: new Date(Date.now() - 5400000).toISOString(),
  }
];