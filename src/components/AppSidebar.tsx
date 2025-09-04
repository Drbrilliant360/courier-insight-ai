import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Bot,
  Database,
  Home,
  MapPin,
  Trophy,
  Upload,
  FileText,
  TrendingUp,
  Zap,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Data Upload", url: "/upload", icon: Upload },
  { title: "Geo-Spatial Map", url: "/map", icon: MapPin },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "ETA Prediction", url: "/eta", icon: TrendingUp },
  { title: "Anomaly Detection", url: "/anomaly", icon: Zap },
  { title: "Courier Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "AI Assistant", url: "/chatbot", icon: Bot },
  { title: "Reports", url: "/reports", icon: FileText },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className={cn(
      "h-screen bg-card border-r border-card-border transition-all duration-300 relative",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-card-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">AI Delivery</h1>
                <p className="text-xs text-muted-foreground">Intelligence System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
              "hover:bg-muted hover:shadow-sm",
              isActive(item.url) && "bg-primary text-primary-foreground shadow-md"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="font-medium">{item.title}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-primary p-4 rounded-lg text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5" />
              <span className="font-medium">AI Powered</span>
            </div>
            <p className="text-xs text-white/80">
              Real-time delivery intelligence with predictive analytics
            </p>
          </div>
        </div>
      )}
    </div>
  );
}