import { Trophy, Medal, Star, Zap, Target, Flame } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatCard } from "@/components/ui/stat-card";
import { courierLeaderboard } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Leaderboard() {
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "⚡": return <Zap className="w-4 h-4 text-accent icon-hover-accent" />;
      case "🏆": return <Trophy className="w-4 h-4 text-primary icon-hover-primary" />;
      case "🎯": return <Target className="w-4 h-4 text-secondary icon-hover-secondary" />;
      case "⭐": return <Star className="w-4 h-4 text-accent icon-hover-accent" />;
      case "🚀": return <Zap className="w-4 h-4 text-primary icon-hover-primary" />;
      case "💎": return <Medal className="w-4 h-4 text-secondary icon-hover-secondary" />;
      case "🔥": return <Flame className="w-4 h-4 text-destructive icon-hover" />;
      default: return <Star className="w-4 h-4 text-muted-foreground icon-hover" />;
    }
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-primary to-primary-glow text-white";
    if (index === 1) return "bg-gradient-to-r from-secondary to-secondary-hover text-white";
    if (index === 2) return "bg-gradient-to-r from-accent to-accent-hover text-white";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Courier Leaderboard</h1>
        <p className="text-muted-foreground mt-1">
          Gamified performance tracking and achievement system
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Top Performer"
          value="John Smith"
          change="98/100 score"
          changeType="positive"
          icon={Trophy}
        />
        <StatCard
          title="Most Deliveries"
          value="156"
          change="This week"
          changeType="neutral"
          icon={Target}
        />
        <StatCard
          title="Best On-Time Rate"
          value="98.7%"
          change="Maria Garcia"
          changeType="positive"
          icon={Star}
        />
        <StatCard
          title="Speed Champion"
          value="19.2 min"
          change="Avg delivery time"
          changeType="positive"
          icon={Zap}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <MetricCard title="Performance Rankings" className="lg:col-span-2" glow>
          <div className="space-y-4">
            {courierLeaderboard.map((courier, index) => (
              <div
                key={courier.id}
                className={cn(
                  "p-4 rounded-lg border transition-all hover:shadow-md",
                  index < 3 ? "border-primary/20 bg-primary/5" : "border-border"
                )}
              >
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-md",
                    getRankStyle(index)
                  )}>
                    {index < 3 ? (
                      <Trophy className="w-6 h-6" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Courier Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">{courier.name}</h3>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{courier.score}</p>
                        <p className="text-xs text-muted-foreground">Performance Score</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{courier.deliveries} deliveries</span>
                        <span>{courier.onTime} on-time</span>
                        <span>{((courier.onTime / courier.deliveries) * 100).toFixed(1)}% rate</span>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex items-center space-x-1">
                        {courier.badges.map((badge, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center"
                            title={`Achievement: ${badge}`}
                          >
                            {getBadgeIcon(badge)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${courier.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MetricCard>

        {/* Achievements System */}
        <MetricCard title="Achievement System">
          <div className="space-y-4">
            {/* Available Achievements */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Available Badges</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-accent/10 rounded-lg text-center hover:bg-accent/20 transition-colors cursor-pointer">
                  <Zap className="w-6 h-6 text-accent mx-auto mb-1 icon-hover-accent" />
                  <p className="text-xs font-medium text-accent">Speed Demon</p>
                  <p className="text-xs text-muted-foreground">Avg &lt; 20 min</p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg text-center hover:bg-secondary/20 transition-colors cursor-pointer">
                  <Target className="w-6 h-6 text-secondary mx-auto mb-1 icon-hover-secondary" />
                  <p className="text-xs font-medium text-secondary">Precision Pro</p>
                  <p className="text-xs text-muted-foreground">95% on-time</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg text-center hover:bg-primary/20 transition-colors cursor-pointer">
                  <Trophy className="w-6 h-6 text-primary mx-auto mb-1 icon-hover-primary" />
                  <p className="text-xs font-medium text-primary">Champion</p>
                  <p className="text-xs text-muted-foreground">Top 3 monthly</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg text-center hover:bg-destructive/20 transition-colors cursor-pointer">
                  <Flame className="w-6 h-6 text-destructive mx-auto mb-1 icon-hover" />
                  <p className="text-xs font-medium text-destructive">Hot Streak</p>
                  <p className="text-xs text-muted-foreground">10 consecutive</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h4 className="font-medium text-foreground mb-3">This Week's Challenges</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm text-foreground">Complete 50 deliveries</span>
                  <span className="text-xs text-secondary font-medium">32/50</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm text-foreground">Maintain 95% on-time rate</span>
                  <span className="text-xs text-primary font-medium">97.2%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm text-foreground">Zero anomalies detected</span>
                  <span className="text-xs text-accent font-medium">2 days</span>
                </div>
              </div>
            </div>
          </div>
        </MetricCard>
      </div>
    </div>
  );
}