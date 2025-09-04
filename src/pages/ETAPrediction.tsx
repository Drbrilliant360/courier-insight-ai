import { Clock, TrendingUp, Target, Brain } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatCard } from "@/components/ui/stat-card";
import { etaPredictions } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function ETAPrediction() {
  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case "excellent": return "text-secondary";
      case "good": return "text-primary";
      case "average": return "text-accent";
      case "poor": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-secondary";
    if (confidence >= 80) return "text-primary";
    if (confidence >= 70) return "text-accent";
    return "text-destructive";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">ETA Prediction Engine</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered delivery time estimation with real-time accuracy tracking
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Prediction Accuracy"
          value="94.2%"
          change="+1.8% this week"
          changeType="positive"
          icon={Target}
        />
        <StatCard
          title="Average Confidence"
          value="91%"
          change="High reliability"
          changeType="positive"
          icon={Brain}
        />
        <StatCard
          title="Model Performance"
          value="Excellent"
          change="Last updated: 2h ago"
          changeType="neutral"
          icon={TrendingUp}
        />
        <StatCard
          title="Predictions Today"
          value="247"
          change="23 currently active"
          changeType="neutral"
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Predictions */}
        <MetricCard title="Recent ETA Predictions" glow>
          <div className="space-y-4">
            {etaPredictions.map((prediction) => (
              <div
                key={prediction.orderId}
                className="p-4 bg-muted/30 rounded-lg border border-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{prediction.orderId}</h4>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">
                      {prediction.predictedETA}
                    </p>
                    <p className="text-xs text-muted-foreground">Predicted ETA</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Actual Time</p>
                    <p className="font-medium text-foreground">{prediction.actualTime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Confidence</p>
                    <p className={cn("font-medium", getConfidenceColor(prediction.confidence))}>
                      {prediction.confidence}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Accuracy</p>
                    <p className={cn("font-medium capitalize", getAccuracyColor(prediction.accuracy))}>
                      {prediction.accuracy}
                    </p>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mt-3">
                  <div className="bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MetricCard>

        {/* Model Performance */}
        <MetricCard title="AI Model Performance">
          <div className="space-y-6">
            {/* Accuracy Metrics */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Accuracy Breakdown</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Excellent (±2 min)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <span className="text-sm font-medium text-secondary">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Good (±5 min)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                    <span className="text-sm font-medium text-primary">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average (±10 min)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: "8%" }}></div>
                    </div>
                    <span className="text-sm font-medium text-accent">8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Poor (&gt;10 min)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-destructive h-2 rounded-full" style={{ width: "2%" }}></div>
                    </div>
                    <span className="text-sm font-medium text-destructive">2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Features */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Model Features</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Real-time traffic conditions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Historical delivery patterns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Weather impact analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span>Courier performance metrics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <span>Distance & route complexity</span>
                </div>
              </div>
            </div>
          </div>
        </MetricCard>
      </div>

      {/* ETA Calculator */}
      <MetricCard title="Real-Time ETA Calculator">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Order Details
              </label>
              <div className="space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium text-foreground">DEL-2024-015</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Pickup Location</p>
                  <p className="font-medium text-foreground">Manhattan, NY</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Delivery Location</p>
                  <p className="font-medium text-foreground">Brooklyn Heights, NY</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                AI Prediction Results
              </label>
              <div className="p-6 bg-gradient-primary text-white rounded-lg">
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2">18 minutes</p>
                  <p className="text-white/80 mb-4">Estimated Delivery Time</p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div>
                      <p className="text-white/80">Confidence</p>
                      <p className="font-medium">94%</p>
                    </div>
                    <div className="w-px h-8 bg-white/20"></div>
                    <div>
                      <p className="text-white/80">Range</p>
                      <p className="font-medium">16-20 min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MetricCard>
    </div>
  );
}