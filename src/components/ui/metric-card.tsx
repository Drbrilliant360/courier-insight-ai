import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function MetricCard({ title, children, className, glow = false }: MetricCardProps) {
  return (
    <div className={cn(
      glow ? "card-glow" : "card-elevated",
      "p-6",
      className
    )}>
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}