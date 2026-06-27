import { Link } from "react-router-dom";
import { ErrorState, LoadingState, PageHeader, useFetch } from "@core-labs/admin-shell";
import { fetchSites } from "../lib/api";

export function SitesOverviewPage() {
  const sites = useFetch(() => fetchSites());

  if (sites.loading) return <LoadingState />;
  if (sites.error) return <ErrorState message={sites.error} onRetry={sites.refetch} />;

  return (
    <>
      <PageHeader title="Sites" description="Marketing web and public docs deployments" />
      <div className="grid gap-4 md:grid-cols-2">
        {(sites.data?.sites ?? []).map((site) => (
          <Link key={site.id} to={`/sites/${site.id}`} className="rounded-xl border p-6 hover:border-primary transition-colors">
            <p className="font-semibold">{site.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{site.domain}</p>
            <p className="text-xs font-mono text-muted-foreground mt-3">{site.appPath}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
