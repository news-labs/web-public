import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "./section-header";

interface ModuleItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

interface ModuleGridProps {
  title: string;
  subtitle?: string;
  modules: ModuleItem[];
}

export function ModuleGrid({ title, subtitle, modules }: ModuleGridProps) {
  return (
    <section className="border-y border-border bg-muted/30 py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader title={title} subtitle={subtitle} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                  <Icon size={22} />
                </div>
                <h3 className="mb-2 font-semibold text-base">{mod.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  {mod.description}
                </p>
                <Link
                  href={mod.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  Learn more <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
