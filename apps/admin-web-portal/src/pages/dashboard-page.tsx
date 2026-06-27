import { Link } from "react-router-dom";
import { BarChart3, Globe, Rocket, TrendingUp } from "lucide-react";
import {
  ErrorState,
  LoadingState,
  MetricCard,
  PageHeader,
  SimpleBarChart,
  useFetch,
  useTenantContext,
} from "@core-labs/admin-shell";
import {
  fetchAnalyticsOverview,
  fetchChangeHistory,
  fetchGithubRuns,
  fetchRegions,
  fetchBrands,
} from "../lib/api";

export function DashboardPage() {
  const ctx = useTenantContext();
  const overview = useFetch(() =>
    fetchAnalyticsOverview(ctx.brandId ?? undefined, ctx.regionCode ?? undefined),
  );
  const history = useFetch(() => fetchChangeHistory({ brandId: ctx.brandId ?? undefined }));
  const ciRuns = useFetch(() => fetchGithubRuns());
  const brands = useFetch(() => fetchBrands());
  const regions = useFetch(() => fetchRegions(ctx.brandId ?? undefined));

  if (overview.loading) return <LoadingState />;

  const summary = overview.data?.summary;

  return (
    <>
      <PageHeader
        title="Tenant Dashboard"
        description="Multi-domain web operations overview"
      />
      {overview.error && <ErrorState message={overview.error} onRetry={overview.refetch} />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Active brands" value={String(brands.data?.brands?.length ?? 0)} icon={Globe} />
        <MetricCard title="Regions" value={String(regions.data?.regions?.length ?? 0)} icon={Globe} />
        <MetricCard
          title="Pageviews (7d)"
          value={summary ? summary.pageviews_7d.toLocaleString() : "—"}
          icon={TrendingUp}
        />
        <MetricCard
          title="Build success"
          value={summary ? `${Math.round(summary.build_success_rate * 100)}%` : "—"}
          icon={Rocket}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-4">
          <h3 className="mb-4 font-semibold">Traffic (7 days)</h3>
          {overview.data?.series && (
            <SimpleBarChart
              data={overview.data.series.map((d) => ({
                label: d.date.slice(5),
                value: d.pageviews,
              }))}
            />
          )}
        </div>
        <div className="rounded-xl border p-4">
          <h3 className="mb-4 font-semibold">Recent changes</h3>
          <ul className="space-y-2 text-sm">
            {(history.data?.items ?? []).slice(0, 5).map((e) => (
              <li key={e.event_id} className="flex justify-between gap-2">
                <span>{e.summary}</span>
                <span className="text-muted-foreground shrink-0">{e.created_at?.slice(0, 10)}</span>
              </li>
            ))}
            {!history.data?.items?.length && (
              <li className="text-muted-foreground">No recent changes</li>
            )}
          </ul>
          <Link to="/history/changes" className="mt-3 inline-block text-sm text-primary">
            View all →
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <h3 className="mb-4 font-semibold">Recent CI template deploys</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4">Run</th>
                <th className="pb-2 pr-4">Branch</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {(ciRuns.data?.items ?? []).slice(0, 5).map((r) => (
                <tr key={r.run_id} className="border-b">
                  <td className="py-2 pr-4">
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-primary">
                      #{r.run_id}
                    </a>
                  </td>
                  <td className="py-2 pr-4">{r.branch}</td>
                  <td className="py-2 pr-4">{r.conclusion ?? r.status}</td>
                  <td className="py-2">{r.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
