import type { ReactNode } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { ProductCTASection } from "@/components/sections/product-cta-section";
import { REVAMP_CTA } from "@/lib/marketing-revamp-tokens";

interface KindePageLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  ctaPrimary?: { label: string; href: string; external?: boolean };
  ctaSecondary?: { label: string; href: string };
}

export function KindePageLayout({
  title,
  description,
  children,
  ctaPrimary = { label: "View pricing", href: "/pricing/" },
  ctaSecondary = { label: "Talk to sales", href: "/contact/?intent=enterprise" },
}: KindePageLayoutProps) {
  return (
    <>
      <section className="flex min-h-screen-below-header flex-col justify-center bg-background py-6 sm:min-h-screen-below-header-lg sm:py-10">
        <PageContainer className="max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-hero text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">{description}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={ctaPrimary.href}
              target={ctaPrimary.external ? "_blank" : undefined}
              rel={ctaPrimary.external ? "noopener noreferrer" : undefined}
              className={REVAMP_CTA.primary}
            >
              {ctaPrimary.label}
            </Link>
            <Link href={ctaSecondary.href} className={REVAMP_CTA.secondary}>
              {ctaSecondary.label}
            </Link>
          </div>
        </PageContainer>
      </section>
      {children}
      <ProductCTASection />
    </>
  );
}
