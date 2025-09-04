import { useState } from "react";
import { MapPin, Navigation, Truck, AlertTriangle, Clock } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatCard } from "@/components/ui/stat-card";
import { recentDeliveries, zoneAnalytics } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function MapView() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-time": return <Clock className="w-4 h-4 text-secondary" />;
      case "ahead": return <Navigation className="w-4 h-4 text-primary" />;
      case "delayed": return <AlertTriangle className="w-4 h-4 text-accent" />;
      case "anomaly": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <MapPin className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Geo-Spatial Delivery Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-time delivery tracking with route optimization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Deliveries"
          value="23"
          icon={Truck}
          className="lg:col-span-1"
        />
        <StatCard
          title="Avg Delivery Time"
          value="24.5 min"
          icon={Clock}
          className="lg:col-span-1"
        />
        <StatCard
          title="Route Efficiency"
          value="94.2%"
          icon={Navigation}
          className="lg:col-span-1"
        />
        <StatCard
          title="Coverage Zones"
          value="5"
          icon={MapPin}
          className="lg:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <MetricCard title="Live Delivery Map" className="lg:col-span-2" glow>
          <div className="h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg relative overflow-hidden">
            {/* Mock Map Interface */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
            
            {/* Delivery Pins */}
            {recentDeliveries.map((delivery, index) => (
              <div
                key={delivery.id}
                className={cn(
                  "absolute w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform",
                  delivery.status === "on-time" && "bg-secondary",
                  delivery.status === "ahead" && "bg-primary",
                  delivery.status === "delayed" && "bg-accent",
                  delivery.status === "anomaly" && "bg-destructive animate-pulse"
                )}
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`
                }}
                title={`${delivery.id} - ${delivery.courier}`}
              >
                {getStatusIcon(delivery.status)}
              </div>
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <button className="w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                <MapPin className="w-5 h-5 text-foreground" />
              </button>
              <button className="w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                <Navigation className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
              <h4 className="text-xs font-medium text-foreground mb-2">Status Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span>On Time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>Ahead</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span>Delayed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-destructive rounded-full"></div>
                  <span>Anomaly</span>
                </div>
              </div>
            </div>
          </div>
        </MetricCard>

        {/* Zone Analytics */}
        <MetricCard title="Zone Performance">
          <div className="space-y-3">
            {zoneAnalytics.map((zone) => (
              <div
                key={zone.zone}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  selectedZone === zone.zone 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setSelectedZone(zone.zone === selectedZone ? null : zone.zone)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{zone.zone}</h4>
                  <span className="text-sm text-primary font-medium">{zone.deliveries}</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Avg Time: {zone.avgTime}</p>
                  <p>Anomalies: {zone.anomalies}</p>
                </div>
                <div className="mt-2 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(zone.deliveries / 425) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </MetricCard>
      </div>

      {/* Active Deliveries List */}
      <MetricCard title="Active Deliveries">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-foreground">Order ID</th>
                <th className="text-left p-3 font-medium text-foreground">Courier</th>
                <th className="text-left p-3 font-medium text-foreground">Destination</th>
                <th className="text-left p-3 font-medium text-foreground">ETA</th>
                <th className="text-left p-3 font-medium text-foreground">Status</th>
                <th className="text-left p-3 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentDeliveries.map((delivery) => (
                <tr key={delivery.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="p-3 text-foreground font-medium">{delivery.id}</td>
                  <td className="p-3 text-foreground">{delivery.courier}</td>
                  <td className="p-3 text-muted-foreground">{delivery.destination}</td>
                  <td className="p-3 text-foreground font-medium">{delivery.eta}</td>
                  <td className="p-3">
                    <span className={cn(
                      "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                      delivery.status === "on-time" && "bg-secondary/10 text-secondary",
                      delivery.status === "ahead" && "bg-primary/10 text-primary",
                      delivery.status === "delayed" && "bg-accent/10 text-accent",
                      delivery.status === "anomaly" && "bg-destructive/10 text-destructive"
                    )}>
                      {getStatusIcon(delivery.status)}
                      <span className="capitalize">{delivery.status.replace("-", " ")}</span>
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="text-primary hover:text-primary-hover text-sm font-medium">
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MetricCard>
    </div>
  );
}