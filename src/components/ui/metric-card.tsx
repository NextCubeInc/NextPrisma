import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  description?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  className,
}: MetricCardProps) {
  const changeColors = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className={cn("bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center gap-2 text-xs">
          {change && (
            <span className={changeColors[changeType]}>
              {change}
            </span>
          )}
          {description && (
            <span className="text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}