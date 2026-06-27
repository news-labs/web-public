import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const containerClass = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn(containerClass, className)}>{children}</div>;
}
