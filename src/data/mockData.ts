// Mock data for the AI Delivery Intelligence System

export const deliveryStats = {
  totalDeliveries: 1247,
  onTimeDeliveries: 1156,
  averageETA: "24.5 min",
  anomaliesDetected: 12,
  activeCouriers: 45,
  completionRate: "92.7%"
};

export const courierLeaderboard = [
  { id: 1, name: "Juma Mwalimu", score: 98, deliveries: 156, onTime: 154, badges: ["⚡", "🏆"] },
  { id: 2, name: "Fatuma Ally", score: 96, deliveries: 142, onTime: 139, badges: ["🎯", "⭐"] },
  { id: 3, name: "Hassan Mwinyi", score: 94, deliveries: 138, onTime: 133, badges: ["🚀"] },
  { id: 4, name: "Rehema Kondo", score: 92, deliveries: 129, onTime: 122, badges: ["💎"] },
  { id: 5, name: "Bakari Omari", score: 90, deliveries: 134, onTime: 125, badges: ["🔥"] }
];

export const recentDeliveries = [
  {
    id: "DEL-2024-001",
    courier: "Juma Mwalimu",
    destination: "Kinondoni, Dar es Salaam",
    eta: "15 min",
    status: "on-time",
    coordinates: [-6.7924, 39.2083]
  },
  {
    id: "DEL-2024-002",
    courier: "Fatuma Ally",
    destination: "Ilala, Dar es Salaam",
    eta: "8 min",
    status: "ahead",
    coordinates: [-6.8024, 39.2583]
  },
  {
    id: "DEL-2024-003",
    courier: "Hassan Mwinyi",
    destination: "Temeke, Dar es Salaam",
    eta: "32 min",
    status: "delayed",
    coordinates: [-6.8296, 39.2669]
  },
  {
    id: "DEL-2024-004",
    courier: "Rehema Kondo",
    destination: "Ubungo, Dar es Salaam",
    eta: "12 min",
    status: "anomaly",
    coordinates: [-6.7896, 39.2369]
  }
];

export const anomalyAlerts = [
  {
    id: "ANO-001",
    type: "Route Deviation",
    courier: "Amani Mushi",
    description: "Courier deviated 2.3km from optimal route in Kariakoo",
    severity: "medium",
    timestamp: "2024-01-15 14:23:00"
  },
  {
    id: "ANO-002",
    type: "Delivery Time",
    courier: "Neema Juma",
    description: "Delivery completed in 3 minutes (suspicious speed) in Msimbazi",
    severity: "high",
    timestamp: "2024-01-15 13:45:00"
  },
  {
    id: "ANO-003",
    type: "Extended Delay",
    courier: "Salehe Mwanga",
    description: "Delivery delayed beyond 45 minutes threshold in Mwenge",
    severity: "medium",
    timestamp: "2024-01-15 12:15:00"
  }
];

export const etaPredictions = [
  {
    orderId: "ORD-001",
    predictedETA: "18 min",
    confidence: 94,
    actualTime: "17 min",
    accuracy: "excellent"
  },
  {
    orderId: "ORD-002",
    predictedETA: "25 min",
    confidence: 87,
    actualTime: "28 min",
    accuracy: "good"
  },
  {
    orderId: "ORD-003",
    predictedETA: "12 min",
    confidence: 92,
    actualTime: "11 min",
    accuracy: "excellent"
  }
];

export const zoneAnalytics = [
  { zone: "Kinondoni", deliveries: 425, avgTime: "22 min", anomalies: 5 },
  { zone: "Ilala", deliveries: 318, avgTime: "26 min", anomalies: 3 },
  { zone: "Temeke", deliveries: 267, avgTime: "28 min", anomalies: 2 },
  { zone: "Ubungo", deliveries: 154, avgTime: "31 min", anomalies: 1 },
  { zone: "Kigamboni", deliveries: 83, avgTime: "35 min", anomalies: 1 }
];

export const chartData = {
  deliveryTimes: [
    { hour: "08:00", deliveries: 12, avgTime: 25 },
    { hour: "09:00", deliveries: 28, avgTime: 23 },
    { hour: "10:00", deliveries: 45, avgTime: 22 },
    { hour: "11:00", deliveries: 62, avgTime: 24 },
    { hour: "12:00", deliveries: 78, avgTime: 26 },
    { hour: "13:00", deliveries: 85, avgTime: 28 },
    { hour: "14:00", deliveries: 72, avgTime: 25 },
    { hour: "15:00", deliveries: 68, avgTime: 23 },
    { hour: "16:00", deliveries: 54, avgTime: 21 },
    { hour: "17:00", deliveries: 41, avgTime: 24 },
    { hour: "18:00", deliveries: 29, avgTime: 26 },
    { hour: "19:00", deliveries: 18, avgTime: 22 }
  ],
  anomalyTrends: [
    { date: "Mon", anomalies: 3, deliveries: 234 },
    { date: "Tue", anomalies: 5, deliveries: 267 },
    { date: "Wed", anomalies: 2, deliveries: 198 },
    { date: "Thu", anomalies: 7, deliveries: 289 },
    { date: "Fri", anomalies: 4, deliveries: 312 },
    { date: "Sat", anomalies: 1, deliveries: 156 },
    { date: "Sun", anomalies: 2, deliveries: 123 }
  ]
};