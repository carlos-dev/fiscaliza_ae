import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  variant?: "dots" | "spinner" | "skeleton";
  className?: string;
  text?: string;
}

export const LoadingAnimation = ({
  variant = "dots",
  className,
  text = "Carregando",
}: LoadingAnimationProps) => {
  if (variant === "spinner") {
    return (
      <div
        className={cn("flex flex-col items-center justify-center", className)}
      >
        <div className="h-8 w-8 border-3 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        {text && <p className="mt-4 text-sm text-muted-foreground">{text}</p>}
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse space-y-3", className)}>
        <div className="h-10 bg-muted rounded-md"></div>
        <div className="h-20 bg-muted rounded-md"></div>
        <div className="h-8 bg-muted rounded-md w-3/4"></div>
        <div className="h-8 bg-muted rounded-md w-1/2"></div>
      </div>
    );
  }

  // Dots variant (default)
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="flex space-x-2">
        <div
          className="h-2 w-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="h-2 w-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="h-2 w-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
      {text && <p className="mt-4 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingAnimation;
