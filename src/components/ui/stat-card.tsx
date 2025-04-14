import { Card } from "./card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;
  valueColor?: "default" | "success" | "warning" | "danger";
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
  valueColor = "default",
}: StatCardProps) {
  const valueColorClasses = {
    default: "text-foreground",
    success: "text-green-500",
    warning: "text-yellow-500",
    danger: "text-red-500",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-500",
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className="text-primary">{icon}</div>}
        </div>

        <div className="flex items-baseline">
          <div
            className={cn("text-2xl font-bold", valueColorClasses[valueColor])}
          >
            {value}
          </div>

          {trend && (
            <span
              className={cn("ml-2 text-sm font-medium", trendColors[trend])}
            >
              {trendIcons[trend]}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
    </Card>
  );
}

// Exemplo de uso do componente
export function StatsGroup() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Presença em Plenário"
        value="85%"
        description="Taxa de presença em 2024"
        trend="up"
        valueColor="success"
      />
      <StatCard
        title="Projetos Apresentados"
        value="23"
        description="Total no mandato atual"
        valueColor="default"
      />
      <StatCard
        title="Gastos do Gabinete"
        value="R$ 156.742,00"
        description="Total em 2024"
        trend="down"
        valueColor="warning"
      />
      <StatCard
        title="Aprovação"
        value="62%"
        description="Índice de aprovação popular"
        trend="neutral"
        valueColor="default"
      />
    </div>
  );
}
