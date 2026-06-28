import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-foreground text-background hover:bg-foreground/90": variant === "default",
          "bg-accent text-accent-foreground hover:opacity-90": variant === "accent",
          "border border-border bg-transparent text-foreground hover:bg-muted": variant === "outline",
          "bg-transparent text-foreground hover:bg-muted": variant === "ghost",
        },
        {
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-5 text-sm": size === "md",
          "h-12 px-6 text-base w-full": size === "lg",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
