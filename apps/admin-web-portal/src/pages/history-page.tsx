import { ErrorState, LoadingState, PageHeader, useFetch } from "@core-labs/admin-shell";
import { fetchDeployHistory } from "../lib/api";

export function HistoryPage() {
  const history = useFetch(() => fetchDeployHistory());

  if (history.loading) return <LoadingState />;
  if (history.error) return <ErrorState message={history.error} onRetry={history.refetch} />;

  return (
    <>
      <PageHeader title="History" description="Build and deployment history" />
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left">Site</th>
              <th className="px-4 py-3 text-left">Env</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {(history.data?.items ?? []).map((row) => (
              <tr key={row.deploy_id} className="border-b last:border-0">
                <td className="px-4 py-3">{row.site_id}</td>
                <td className="px-4 py-3">{row.environment}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
