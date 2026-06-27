import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";

interface PricingTeaserProps {
  title?: string;
  subtitle?: string;
}

export function PricingTeaser({
  title = "Plans that scale with your API usage",
  subtitle = "Start small. Add capacity as your application grows.",
}: PricingTeaserProps) {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        <SectionHeader title={title} subtitle={subtitle} className="mb-10" />
        <Link href="/pricing/">
          <Button size="lg" variant="outline" className="gap-2">
            View pricing <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </section>
  );
}
