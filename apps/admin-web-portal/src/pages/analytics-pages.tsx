import { Activity, BarChart3, Globe, TrendingUp } from "lucide-react";
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
  fetchAnalyticsLanguages,
  fetchAnalyticsOverview,
  fetchAnalyticsRegions,
  fetchWebVitals,
} from "../lib/api";
import { SeoHealthPage } from "./seo-pages";

export function AnalyticsOverviewPage() {
  const ctx = useTenantContext();
  const data = useFetch(() =>
    fetchAnalyticsOverview(ctx.brandId ?? undefined, ctx.regionCode ?? undefined),
  );

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  const s = data.data?.summary;

  return (
    <>
      <PageHeader title="Site Overview" description="Traffic and publish metrics" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Pageviews (7d)" value={s?.pageviews_7d.toLocaleString() ?? "—"} icon={TrendingUp} />
        <MetricCard title="Unique visitors" value={s?.unique_visitors_7d.toLocaleString() ?? "—"} icon={Globe} />
        <MetricCard title="Published today" value={String(s?.publish_count_today ?? 0)} icon={BarChart3} />
        <MetricCard title="Build success" value={`${Math.round((s?.build_success_rate ?? 0) * 100)}%`} icon={Activity} />
      </div>
      {data.data?.series && (
        <div className="mt-6 rounded-xl border p-4">
          <SimpleBarChart
            data={data.data.series.map((d) => ({ label: d.date.slice(5), value: d.pageviews }))}
          />
        </div>
      )}
    </>
  );
}

export function AnalyticsRegionsPage() {
  const data = useFetch(() => fetchAnalyticsRegions());

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Traffic by Region" description="Pageviews per city node" />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">Region</th>
              <th className="p-3">Country</th>
              <th className="p-3">Pageviews (7d)</th>
            </tr>
          </thead>
          <tbody>
            {(data.data?.items ?? []).map((r) => (
              <tr key={r.city_code} className="border-b">
                <td className="p-3">{r.city_name ?? r.city_code}</td>
                <td className="p-3">{r.country_iso}</td>
                <td className="p-3">{r.pageviews_7d.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AnalyticsLanguagesPage() {
  const data = useFetch(() => fetchAnalyticsLanguages());

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Traffic by Language" description="Locale share" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(data.data?.items ?? []).map((l) => (
          <div key={l.locale} className="rounded-xl border p-4">
            <p className="text-lg font-semibold">{l.locale}</p>
            <p className="text-sm text-muted-foreground">{l.pageviews_7d.toLocaleString()} views</p>
            <p className="text-xs">{Math.round(l.share * 100)}%</p>
          </div>
        ))}
      </div>
    </>
  );
}

export function AnalyticsSeoPage() {
  return <SeoHealthPage />;
}

export function WebVitalsPage() {
  const ctx = useTenantContext();
  const data = useFetch(() => fetchWebVitals(ctx.selectedRegion?.domain));

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Core Web Vitals" description="LCP, INP, CLS per domain" />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard title="LCP p75" value={`${data.data?.lcp_p75}s`} icon={Activity} />
        <MetricCard title="INP p75" value={`${data.data?.inp_p75}ms`} icon={Activity} />
        <MetricCard title="CLS p75" value={String(data.data?.cls_p75)} icon={Activity} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Status: {data.data?.status}</p>
    </>
  );
}
