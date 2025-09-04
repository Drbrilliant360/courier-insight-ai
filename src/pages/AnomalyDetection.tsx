import { AlertTriangle, Shield, Zap, Eye } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatCard } from "@/components/ui/stat-card";
import { anomalyAlerts } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function AnomalyDetection() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-destructive";
      case "medium": return "text-accent";
      case "low": return "text-secondary";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive/10";
      case "medium": return "bg-accent/10";
      case "low": return "bg-secondary/10";
      default: return "bg-muted";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Anomaly Detection System</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered fraud detection and delivery pattern analysis
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Anomalies Detected"
          value="12"
          change="3 in last hour"
          changeType="neutral"
          icon={AlertTriangle}
        />
        <StatCard
          title="Detection Accuracy"
          value="97.8%"
          change="+0.5% improvement"
          changeType="positive"
          icon={Eye}
        />
        <StatCard
          title="False Positives"
          value="2.2%"
          change="Within acceptable range"
          changeType="positive"
          icon={Shield}
        />
        <StatCard
          title="Model Confidence"
          value="95%"
          change="High reliability"
          changeType="positive"
          icon={Zap}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <MetricCard title="Active Anomaly Alerts" glow>
          <div className="space-y-4">
            {anomalyAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-4 rounded-lg border",
                  getSeverityBg(alert.severity),
                  alert.severity === "high" ? "border-destructive/20" : "border-border/50"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={cn("w-5 h-5", getSeverityColor(alert.severity))} />
                    <span className={cn("text-sm font-medium uppercase", getSeverityColor(alert.severity))}>
                      {alert.severity} priority
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{alert.id}</span>
                </div>
                
                <h4 className="font-medium text-foreground mb-2">{alert.type}</h4>
                <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground font-medium">{alert.courier}</span>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </MetricCard>

        {/* Detection Categories */}
        <MetricCard title="Anomaly Categories">
          <div className="space-y-4">
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-destructive">Suspicious Speed</h4>
                <span className="text-sm text-destructive font-medium">3 alerts</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Deliveries completed unusually fast (potential fraud)
              </p>
              <div className="text-xs text-muted-foreground">
                Threshold: &lt; 5 minutes for any delivery
              </div>
            </div>

            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-accent">Route Deviation</h4>
                <span className="text-sm text-accent font-medium">5 alerts</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Significant deviation from optimal route
              </p>
              <div className="text-xs text-muted-foreground">
                Threshold: &gt; 2km deviation from planned route
              </div>
            </div>

            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-accent">Extended Delay</h4>
                <span className="text-sm text-accent font-medium">4 alerts</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Deliveries taking significantly longer than expected
              </p>
              <div className="text-xs text-muted-foreground">
                Threshold: &gt; 45 minutes over ETA
              </div>
            </div>
          </div>
        </MetricCard>
      </div>

      {/* Detection System Overview */}
      <MetricCard title="AI Detection System">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Real-Time Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Continuous analysis of delivery patterns and courier behavior using machine learning
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Instant Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Immediate notifications when anomalies are detected with severity classification
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Fraud Prevention</h3>
            <p className="text-sm text-muted-foreground">
              Advanced algorithms to detect potential fraud and optimize delivery operations
            </p>
          </div>
        </div>
      </MetricCard>

      {/* Detection Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricCard title="Detection Thresholds">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium text-foreground">Minimum Delivery Time</span>
              <span className="text-sm text-accent font-medium">5 minutes</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium text-foreground">Maximum Route Deviation</span>
              <span className="text-sm text-accent font-medium">2.0 km</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium text-foreground">Delay Threshold</span>
              <span className="text-sm text-accent font-medium">45 minutes</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium text-foreground">Speed Limit Check</span>
              <span className="text-sm text-secondary font-medium">Enabled</span>
            </div>
          </div>
        </MetricCard>

        <MetricCard title="System Status">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-secondary/10 rounded-lg">
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-secondary">Detection Engine</p>
                <p className="text-xs text-muted-foreground">Active and monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-primary">ML Model</p>
                <p className="text-xs text-muted-foreground">Last updated: 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-accent">Alert System</p>
                <p className="text-xs text-muted-foreground">12 alerts processed today</p>
              </div>
            </div>
          </div>
        </MetricCard>
      </div>
    </div>
  );
}