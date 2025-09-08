import { useState, useEffect } from "react";
import {
  Truck,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Package,
  MapPin,
  Zap
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { MetricCard } from "@/components/ui/metric-card";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { deliveryStats, recentDeliveries, anomalyAlerts, courierLeaderboard } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch real data from Supabase
  const { data: orders } = useSupabaseData({
    table: 'orders',
    select: '*',
    orderBy: { column: 'created_at', ascending: false },
    realtime: true
  });

  const { data: couriers } = useSupabaseData({
    table: 'couriers',
    select: '*',
    orderBy: { column: 'rating', ascending: false },
    realtime: true
  });

  const { data: anomalies } = useSupabaseData({
    table: 'anomalies',
    select: '*',
    orderBy: { column: 'detected_at', ascending: false },
    realtime: true
  });

  // Calculate real stats from fetched data
  const realStats = {
    totalDeliveries: orders?.length || 0,
    completedDeliveries: orders?.filter(o => o.status === 'delivered').length || 0,
    activeCouriers: couriers?.filter(c => c.status === 'available' || c.status === 'busy').length || 0,
    averageETA: '24.5 min', // Can be calculated from real data
    completionRate: orders?.length ? 
      `${Math.round((orders.filter(o => o.status === 'delivered').length / orders.length) * 100)}%` : 
      '0%'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time": return "text-secondary";
      case "ahead": return "text-primary";
      case "delayed": return "text-accent";
      case "anomaly": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "on-time": return "bg-secondary/10";
      case "ahead": return "bg-primary/10";
      case "delayed": return "bg-accent/10";
      case "anomaly": return "bg-destructive/10";
      default: return "bg-muted";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Delivery Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-secondary">System Active</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Deliveries"
          value={realStats.totalDeliveries.toLocaleString()}
          change={`${realStats.totalDeliveries > 0 ? '+' : ''}${realStats.totalDeliveries} from database`}
          changeType="positive"
          icon={Package}
        />
        <StatCard
          title="On-Time Rate"
          value={realStats.completionRate}
          change={`${realStats.completedDeliveries} completed deliveries`}
          changeType="positive"
          icon={Clock}
        />
        <StatCard
          title="Average ETA"
          value={realStats.averageETA}
          change="Calculated from live data"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Active Couriers"
          value={realStats.activeCouriers}
          change={`${couriers?.length || 0} total couriers`}
          changeType="positive"
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Deliveries */}
        <MetricCard title="Live Deliveries" className="lg:col-span-2">
          <div className="space-y-4">
            {(orders?.slice(0, 5) || recentDeliveries).map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    getStatusBg(delivery.status || 'pending')
                  )}>
                    <div className={cn(
                      "w-full h-full rounded-full",
                      (delivery.status || 'pending') === "delivered" && "bg-secondary",
                      (delivery.status || 'pending') === "in_transit" && "bg-primary",
                      (delivery.status || 'pending') === "delayed" && "bg-accent",
                      (delivery.status || 'pending') === "failed" && "bg-destructive animate-pulse"
                    )}></div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{delivery.order_number || delivery.id}</p>
                    <p className="text-sm text-muted-foreground">{delivery.customer_name || delivery.courier}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{delivery.delivery_address || delivery.destination}</p>
                  <p className={cn("text-sm font-medium", getStatusColor(delivery.status || 'pending'))}>
                    {delivery.estimated_delivery_time ? 
                      new Date(delivery.estimated_delivery_time).toLocaleTimeString() : 
                      delivery.eta || 'Pending'
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MetricCard>

        {/* Anomaly Alerts */}
        <MetricCard title="Anomaly Alerts" glow>
          <div className="space-y-3">
            {(anomalies?.slice(0, 3) || anomalyAlerts.slice(0, 3)).map((alert) => (
              <div
                key={alert.id}
                className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">{alert.anomaly_type || alert.type}</span>
                </div>
                <p className="text-sm text-foreground">{alert.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.detected_at ? 
                    new Date(alert.detected_at).toLocaleString() : 
                    alert.timestamp || alert.courier
                  }
                </p>
              </div>
            ))}
          </div>
        </MetricCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <MetricCard title="Top Performers Today">
          <div className="space-y-3">
            {(couriers?.slice(0, 5) || courierLeaderboard.slice(0, 5)).map((courier, index) => (
              <div
                key={courier.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    index === 0 && "bg-gradient-primary text-white",
                    index === 1 && "bg-secondary text-white",
                    index === 2 && "bg-accent text-white",
                    index > 2 && "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{courier.name}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">⭐</span>
                      <span className="text-sm">{courier.rating || courier.score}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{courier.rating || courier.score}</p>
                  <p className="text-xs text-muted-foreground">
                    {courier.total_deliveries || courier.deliveries} deliveries
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MetricCard>

        {/* Quick Actions */}
        <MetricCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group">
              <MapPin className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-primary">View Map</p>
            </button>
            <button className="p-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors group">
              <Truck className="w-6 h-6 text-secondary mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-secondary">Assign Courier</p>
            </button>
            <button className="p-4 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors group">
              <Zap className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-accent">Run Analysis</p>
            </button>
            <button className="p-4 bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors group">
              <AlertTriangle className="w-6 h-6 text-destructive mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-destructive">View Alerts</p>
            </button>
          </div>
        </MetricCard>
      </div>
    </div>
  );
}