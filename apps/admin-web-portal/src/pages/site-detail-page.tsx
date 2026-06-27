import { useParams } from "react-router-dom";
import { ErrorState, LoadingState, PageHeader, useFetch } from "@core-labs/admin-shell";
import { fetchSite } from "../lib/api";

export function SiteDetailPage() {
  const { siteId = "" } = useParams();
  const site = useFetch(() => fetchSite(siteId), [siteId]);

  if (site.loading) return <LoadingState />;
  if (site.error) return <ErrorState message={site.error} onRetry={site.refetch} />;
  if (!site.data) return null;

  return (
    <>
      <PageHeader title={site.data.name} description={site.data.domain} />
      <dl className="rounded-xl border divide-y text-sm">
        <div className="flex justify-between p-4"><dt className="text-muted-foreground">Workflow</dt><dd className="font-mono">{site.data.workflow}</dd></div>
        <div className="flex justify-between p-4"><dt className="text-muted-foreground">App path</dt><dd className="font-mono">{site.data.appPath}</dd></div>
      </dl>
    </>
  );
}
