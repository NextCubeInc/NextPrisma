import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  description?: string;
  className?: string;
  glowEffect?: boolean;
}

export function GlassCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  className,
  glowEffect = false,
}: GlassCardProps) {
  const changeColors = {
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className={cn(
      "bg-gradient-glass border-border/30 shadow-glass backdrop-blur-sm hover:shadow-glow transition-spring group",
      glowEffect && "shadow-glow",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className="p-2 rounded-xl bg-gradient-primary/20 group-hover:bg-gradient-primary/30 transition-smooth">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
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