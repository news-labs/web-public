import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarketingPlaceholderImageProps {
  icon?: LucideIcon;
  label?: string;
  className?: string;
}

export function MarketingPlaceholderImage({
  icon: Icon,
  label,
  className,
}: MarketingPlaceholderImageProps) {
  return (
    <div
      className={cn(
        "flex aspect-video w-full items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-accent/10 to-accent-2/10",
        className
      )}
    >
      {Icon ? (
        <Icon className="h-16 w-16 text-accent" aria-hidden />
      ) : (
        <span className="text-sm font-medium text-muted-foreground">{label ?? "Preview"}</span>
      )}
    </div>
  );
}
