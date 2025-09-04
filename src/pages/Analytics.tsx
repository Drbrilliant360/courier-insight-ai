import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatCard } from "@/components/ui/stat-card";
import { chartData } from "@/data/mockData";

export default function Analytics() {
  const performanceData = [
    { name: "Excellent", value: 45, color: "#22c55e" },
    { name: "Good", value: 35, color: "#3b82f6" },
    { name: "Average", value: 15, color: "#f59e0b" },
    { name: "Poor", value: 5, color: "#ef4444" }
  ];

  const zonePerformance = [
    { zone: "Manhattan", deliveries: 425, efficiency: 94 },
    { zone: "Brooklyn", deliveries: 318, efficiency: 91 },
    { zone: "Queens", deliveries: 267, efficiency: 88 },
    { zone: "Bronx", deliveries: 154, efficiency: 85 },
    { zone: "Staten Island", deliveries: 83, efficiency: 82 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive performance analysis and predictive insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Delivery Volume"
          value="1,247"
          change="+15.2% vs last week"
          changeType="positive"
          icon={BarChart3}
        />
        <StatCard
          title="Efficiency Score"
          value="92.4%"
          change="+2.1% improvement"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Peak Hour Volume"
          value="85"
          change="1:00 PM daily"
          changeType="neutral"
          icon={Activity}
        />
        <StatCard
          title="Zones Covered"
          value="5"
          change="NYC Metropolitan"
          changeType="neutral"
          icon={PieChartIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Trends */}
        <MetricCard title="Hourly Delivery Trends">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.deliveryTimes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="deliveries" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="avgTime" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </MetricCard>

        {/* Zone Performance */}
        <MetricCard title="Zone Performance Analysis">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zonePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="zone" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="deliveries" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="efficiency" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MetricCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Distribution */}
        <MetricCard title="Performance Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {performanceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </MetricCard>

        {/* Weekly Anomaly Trends */}
        <MetricCard title="Anomaly Detection Trends" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.anomalyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="anomalies" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="deliveries" fill="#64748b" radius={[4, 4, 0, 0]} opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </MetricCard>
      </div>

      {/* Insights Summary */}
      <MetricCard title="Key Insights & Recommendations" glow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">Performance Insights</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Peak delivery efficiency occurs between 10-11 AM</li>
              <li>• Manhattan zone shows highest performance with 94% efficiency</li>
              <li>• Average delivery time improved by 3.2 minutes this week</li>
              <li>• 92.7% overall completion rate, up 2.3% from last week</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">Optimization Opportunities</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Deploy additional couriers to Queens and Staten Island</li>
              <li>• Implement route optimization for Bronx deliveries</li>
              <li>• Schedule maintenance during low-volume hours (7-8 PM)</li>
              <li>• Focus anomaly detection on Thursday operations</li>
            </ul>
          </div>
        </div>
      </MetricCard>
    </div>
  );
}