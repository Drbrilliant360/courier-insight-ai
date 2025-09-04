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
  { id: 1, name: "John Smith", score: 98, deliveries: 156, onTime: 154, badges: ["⚡", "🏆"] },
  { id: 2, name: "Maria Garcia", score: 96, deliveries: 142, onTime: 139, badges: ["🎯", "⭐"] },
  { id: 3, name: "David Chen", score: 94, deliveries: 138, onTime: 133, badges: ["🚀"] },
  { id: 4, name: "Sarah Johnson", score: 92, deliveries: 129, onTime: 122, badges: ["💎"] },
  { id: 5, name: "Ahmed Ali", score: 90, deliveries: 134, onTime: 125, badges: ["🔥"] }
];

export const recentDeliveries = [
  {
    id: "DEL-2024-001",
    courier: "John Smith",
    destination: "Downtown NYC",
    eta: "15 min",
    status: "on-time",
    coordinates: [40.7128, -74.0060]
  },
  {
    id: "DEL-2024-002",
    courier: "Maria Garcia",
    destination: "Brooklyn Heights",
    eta: "8 min",
    status: "ahead",
    coordinates: [40.6962, -73.9961]
  },
  {
    id: "DEL-2024-003",
    courier: "David Chen",
    destination: "Queens Plaza",
    eta: "32 min",
    status: "delayed",
    coordinates: [40.7505, -73.9370]
  },
  {
    id: "DEL-2024-004",
    courier: "Sarah Johnson",
    destination: "Manhattan Midtown",
    eta: "12 min",
    status: "anomaly",
    coordinates: [40.7549, -73.9840]
  }
];

export const anomalyAlerts = [
  {
    id: "ANO-001",
    type: "Route Deviation",
    courier: "Mike Rodriguez",
    description: "Courier deviated 2.3km from optimal route",
    severity: "medium",
    timestamp: "2024-01-15 14:23:00"
  },
  {
    id: "ANO-002",
    type: "Delivery Time",
    courier: "Lisa Wong",
    description: "Delivery completed in 3 minutes (suspicious speed)",
    severity: "high",
    timestamp: "2024-01-15 13:45:00"
  },
  {
    id: "ANO-003",
    type: "Extended Delay",
    courier: "Carlos Mendez",
    description: "Delivery delayed beyond 45 minutes threshold",
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
  { zone: "Manhattan", deliveries: 425, avgTime: "22 min", anomalies: 5 },
  { zone: "Brooklyn", deliveries: 318, avgTime: "26 min", anomalies: 3 },
  { zone: "Queens", deliveries: 267, avgTime: "28 min", anomalies: 2 },
  { zone: "Bronx", deliveries: 154, avgTime: "31 min", anomalies: 1 },
  { zone: "Staten Island", deliveries: 83, avgTime: "35 min", anomalies: 1 }
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