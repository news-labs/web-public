import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/layout/page-container";

const sectionPaddingClass = "py-16 sm:py-24";
const sectionPaddingTightClass = "py-12 sm:py-16";
const sectionPaddingHeroClass = "py-6 sm:py-10";

export interface SectionProps {
  children: ReactNode;
  variant?: "default" | "tight" | "hero";
  className?: string;
  withContainer?: boolean;
  id?: string;
}

export function Section({
  children,
  variant = "default",
  className,
  withContainer = true,
  id,
}: SectionProps) {
  const paddingClass =
    variant === "tight"
      ? sectionPaddingTightClass
      : variant === "hero"
        ? sectionPaddingHeroClass
        : sectionPaddingClass;

  return (
    <section id={id} className={cn(paddingClass, className)}>
      {withContainer ? <PageContainer>{children}</PageContainer> : children}
    </section>
  );
}
