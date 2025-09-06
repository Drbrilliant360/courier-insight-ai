import { Clock, TrendingUp, Target, Brain, MapPin, Cloud, Zap, Activity } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { etaPredictions } from "@/data/mockData";
import { useAIModels, useRealTimeData } from "@/hooks/useAIModels";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function ETAPrediction() {
  const { isInitialized, isLoading, predictETA, error } = useAIModels();
  const { trafficData, weatherData } = useRealTimeData();
  const [aiPrediction, setAiPrediction] = useState<any>(null);
  const [testOrderId, setTestOrderId] = useState("ORD-TEST-001");

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

  const handleAIPrediction = async () => {
    const historicalData = [22, 25, 19, 28, 24, 21, 26, 23, 27, 20]; // Mock historical delivery times
    const routeFactors = {
      traffic: trafficData?.traffic || 'moderate',
      distance: 5.2,
      weather: weatherData?.condition || 'clear'
    };

    const result = await predictETA(historicalData, routeFactors);
    if (result) {
      setAiPrediction(result);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      handleAIPrediction();
    }
  }, [isInitialized, trafficData, weatherData]);

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
          title="AI Model Status"
          value={isInitialized ? "Active" : "Loading"}
          change={isInitialized ? "Chronos T5 Ready" : "Initializing..."}
          changeType={isInitialized ? "positive" : "neutral"}
          icon={Brain}
        />
        <StatCard
          title="Real-time Data"
          value={trafficData ? "Connected" : "Offline"}
          change={trafficData ? `Traffic: ${trafficData.traffic}` : "Connecting..."}
          changeType={trafficData ? "positive" : "neutral"}
          icon={MapPin}
        />
        <StatCard
          title="Weather Integration"
          value={weatherData?.condition || "Unknown"}
          change={weatherData ? `${weatherData.temperature}°C` : "Loading..."}
          changeType={weatherData ? "positive" : "neutral"}
          icon={Cloud}
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

      {/* AI ETA Calculator */}
      <MetricCard title="Real-Time AI ETA Calculator" glow>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Order Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                  <Input 
                    value={testOrderId} 
                    onChange={(e) => setTestOrderId(e.target.value)}
                    className="mt-1" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pickup Location</label>
                  <Input value="Downtown Restaurant" className="mt-1" readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Delivery Address</label>
                  <Input value="123 Main St, Brooklyn" className="mt-1" readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Distance</label>
                  <Input value="5.2 km" className="mt-1" readOnly />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">AI Prediction Results</h4>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Predicted ETA:</span>
                  <span className="text-lg font-bold text-primary">
                    {aiPrediction?.predictedETA || "23 minutes"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Confidence Level:</span>
                  <Badge variant="outline" className={`${getConfidenceColor(aiPrediction?.confidence || 92)}`}>
                    {aiPrediction?.confidence || 92}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Traffic Impact:</span>
                  <span className="text-sm text-muted-foreground">
                    {trafficData?.estimatedDelay ? `+${trafficData.estimatedDelay} min` : "+3 min"} 
                    ({trafficData?.traffic || "moderate"})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Weather Impact:</span>
                  <span className="text-sm text-muted-foreground">
                    {weatherData?.visibility === 'poor' ? '+2 min' : 'No impact'} 
                    ({weatherData?.condition || "clear"})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">AI Model:</span>
                  <Badge variant="secondary">
                    {aiPrediction?.model || "chronos-t5"}
                  </Badge>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={handleAIPrediction}
                disabled={isLoading || !isInitialized}
              >
                <Brain className="w-4 h-4 mr-2" />
                {isLoading ? "Calculating..." : "Recalculate with AI"}
              </Button>
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </div>
          </div>
        </div>
      </MetricCard>
    </div>
  );
}