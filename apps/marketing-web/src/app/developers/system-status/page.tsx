import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { StatusBadge, type ServiceStatus } from "@/components/status/status-badge";

export const metadata: Metadata = {
  title: "System Status",
  description: "Real-time server and service status for Newsfork.",
};

const SERVICES: { name: string; description: string; status: ServiceStatus }[] = [
  {
    name: "API",
    description: "api.newsfork.com — REST, search, and RAG endpoints",
    status: "operational",
  },
  {
    name: "Docs",
    description: "docs.newsfork.com — documentation and legal centre",
    status: "operational",
  },
  {
    name: "Dashboard",
    description: "Account signup and API key management",
    status: "operational",
  },
  {
    name: "Crawl Pipeline",
    description: "Seed orchestration and ingestion workers",
    status: "operational",
  },
];

export default function SystemStatusPage() {
  return (
    <div className="min-h-screen-below-header bg-background py-12 sm:py-16">
      <PageContainer className="max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-flex text-sm text-muted-foreground transition-colors hover:text-accent"
        >
          ← Back to home
        </Link>

        <h1 className="mb-3 text-4xl font-bold tracking-hero text-foreground">System Status</h1>
        <p className="mb-10 text-lg text-muted-foreground">
          Real-time server and service status for Newsfork.
        </p>

        <ul className="space-y-4">
          {SERVICES.map((service) => (
            <li
              key={service.name}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-foreground">{service.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
              </div>
              <StatusBadge status={service.status} />
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-muted-foreground">
          Live status page and incident history — coming soon.
        </p>
      </PageContainer>
    </div>
  );
}
