import { AlertTriangle, Shield, Zap, Eye, Brain, Activity } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { anomalyAlerts } from "@/data/mockData";
import { useAIModels } from "@/hooks/useAIModels";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function AnomalyDetection() {
  const { analyzeDeliveryPattern, isInitialized } = useAIModels();
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const runAIAnalysis = async () => {
    if (!isInitialized) return;
    
    setIsAnalyzing(true);
    
    // Mock delivery data for analysis
    const testDeliveries = [
      { id: 'DEL-001', actualTime: 5, predictedTime: 25, routeDeviation: 0.5 },
      { id: 'DEL-002', actualTime: 45, predictedTime: 20, routeDeviation: 3.2 },
      { id: 'DEL-003', actualTime: 15, predictedTime: 18, routeDeviation: 0.8 },
    ];

    const results = [];
    for (const delivery of testDeliveries) {
      const analysis = await analyzeDeliveryPattern(delivery);
      if (analysis) {
        results.push({ ...delivery, analysis });
      }
    }
    
    setAnalysisResults(results);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (isInitialized) {
      runAIAnalysis();
    }
  }, [isInitialized]);

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
          title="AI Model Status"
          value={isInitialized ? "Active" : "Loading"}
          change={isInitialized ? "HuggingFace Ready" : "Initializing..."}
          changeType={isInitialized ? "positive" : "neutral"}
          icon={Brain}
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
                    <AlertTriangle className={cn("w-5 h-5 icon-hover", getSeverityColor(alert.severity))} />
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
          <div className="text-center hover:scale-105 transition-transform cursor-pointer">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 hover:bg-primary/20 transition-colors">
              <Eye className="w-8 h-8 text-primary icon-hover-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Real-Time Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Continuous analysis of delivery patterns and courier behavior using machine learning
            </p>
          </div>
          
          <div className="text-center hover:scale-105 transition-transform cursor-pointer">
            <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4 hover:bg-secondary/20 transition-colors">
              <Zap className="w-8 h-8 text-secondary icon-hover-secondary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Instant Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Immediate notifications when anomalies are detected with severity classification
            </p>
          </div>
          
          <div className="text-center hover:scale-105 transition-transform cursor-pointer">
            <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 hover:bg-accent/20 transition-colors">
              <Shield className="w-8 h-8 text-accent icon-hover-accent" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Fraud Prevention</h3>
            <p className="text-sm text-muted-foreground">
              Advanced algorithms to detect potential fraud and optimize delivery operations
            </p>
          </div>
        </div>
      </MetricCard>

      {/* AI Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricCard title="AI Analysis Results" glow>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">Recent AI Detections</h4>
              <Button 
                onClick={runAIAnalysis}
                disabled={isAnalyzing || !isInitialized}
                size="sm"
              >
                <Brain className="w-4 h-4 mr-2" />
                {isAnalyzing ? "Analyzing..." : "Run Analysis"}
              </Button>
            </div>
            
            {analysisResults.length > 0 ? (
              <div className="space-y-3">
                {analysisResults.map((result, index) => (
                  <div key={index} className={cn(
                    "p-3 rounded-lg border",
                    result.analysis.isAnomalous ? getSeverityBg(result.analysis.severity) : "bg-muted/30 border-border"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{result.id}</span>
                      <Badge 
                        variant={result.analysis.isAnomalous ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {result.analysis.isAnomalous ? result.analysis.severity : "Normal"}
                      </Badge>
                    </div>
                    
                    {result.analysis.isAnomalous && (
                      <div className="text-sm space-y-1">
                        <p className="text-muted-foreground">
                          Confidence: {Math.round(result.analysis.confidence * 100)}%
                        </p>
                        <p className="text-muted-foreground">
                          Factors: {result.analysis.factors.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {isAnalyzing ? "Running AI analysis..." : "No analysis results yet"}
              </div>
            )}
          </div>
        </MetricCard>

        <MetricCard title="System Status">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-secondary/10 rounded-lg">
              <div className={cn("w-3 h-3 rounded-full", isInitialized ? "bg-secondary animate-pulse" : "bg-muted")}></div>
              <div>
                <p className="text-sm font-medium text-secondary">AI Detection Engine</p>
                <p className="text-xs text-muted-foreground">{isInitialized ? "Active and monitoring" : "Initializing..."}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-primary">Hugging Face Model</p>
                <p className="text-xs text-muted-foreground">Pattern analysis ready</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-accent">Analysis Results</p>
                <p className="text-xs text-muted-foreground">{analysisResults.length} deliveries analyzed</p>
              </div>
            </div>
          </div>
        </MetricCard>
      </div>
    </div>
  );
}