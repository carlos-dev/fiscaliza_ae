import {
  ArrowUpRight,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ParliamentaryCardProps {
  id: number;
  name: string;
  role: string;
  party: string;
  state: string;
  imageUrl: string;
  score: number;
  trend?: "up" | "down" | "neutral";
  rank?: number;
  variant?: "default" | "compact" | "ranking";
  className?: string;
}

const ParliamentaryCard = ({
  id,
  name,
  role,
  party,
  state,
  imageUrl,
  score,
  trend = "neutral",
  rank,
  variant = "default",
  className,
}: ParliamentaryCardProps) => {
  // Calculate the color based on score
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500 bg-green-50";
    if (score >= 40) return "text-amber-500 bg-amber-50";
    return "text-red-500 bg-red-50";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (variant === "compact") {
    return (
      <Link
        href={`/parliamentary/${id}`}
        className={cn(
          "block p-3 rounded-xl glass hover:shadow-md transition-all duration-300",
          className
        )}
      >
        <div className="flex items-center space-x-3">
          <div className="relative flex-shrink-0">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              className="h-12 w-12 rounded-full object-cover border-2 border-white"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{name}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {role} • {party}/{state}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div
              className={cn(
                "font-medium text-sm rounded-full h-8 w-8 flex items-center justify-center",
                getScoreColor(score)
              )}
            >
              {score}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "ranking") {
    return (
      <Link
        href={`/parliamentary/${id}`}
        className={cn(
          "block relative overflow-hidden glass card-hover rounded-xl",
          className
        )}
      >
        <div className="flex items-center p-4">
          {rank && (
            <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-sm font-bold h-7 w-7 flex items-center justify-center">
              {rank}
            </div>
          )}
          <div className="relative flex-shrink-0 ml-6">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              className="h-14 w-14 rounded-full object-cover border-2 border-white"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div
              className={cn(
                "absolute -bottom-1 -right-1 rounded-full h-7 w-7 flex items-center justify-center text-xs font-bold border-2 border-white",
                getScoreColor(score)
              )}
            >
              {score}
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-medium truncate pr-6">{name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span className="truncate">
                {role} • {party}/{state}
              </span>
              {trend && (
                <span className="flex items-center ml-2">
                  {getTrendIcon(trend)}
                </span>
              )}
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={`/parliamentary/${id}`}
      className={cn(
        "block relative overflow-hidden glass rounded-xl card-hover transition-all duration-300",
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="relative flex-shrink-0">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              className="h-16 w-16 rounded-full object-cover border-2 border-white"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div
              className={cn(
                "absolute -bottom-1 -right-1 rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold border-2 border-white",
                getScoreColor(score)
              )}
            >
              {score}
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {role} • {party}/{state}
            </p>
          </div>
          <div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <div className="flex items-center text-sm">
            <ThumbsUp
              className={cn(
                "h-4 w-4 mr-1",
                score >= 50 ? "text-green-500" : "text-muted-foreground"
              )}
            />
            <span className="text-muted-foreground">
              {Math.round(score / 10)} pontos positivos
            </span>
          </div>
          <div className="flex items-center text-sm">
            <ThumbsDown
              className={cn(
                "h-4 w-4 mr-1",
                score < 50 ? "text-red-500" : "text-muted-foreground"
              )}
            />
            <span className="text-muted-foreground">
              {Math.round((100 - score) / 10)} pontos negativos
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ParliamentaryCard;
