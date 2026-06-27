import {
  ErrorState,
  LoadingState,
  PageHeader,
  useFetch,
  useTenantContext,
} from "@core-labs/admin-shell";
import { fetchDiasporaSchedule, fetchPublishLog, fetchSiteBuilds } from "../lib/api";

export function PublishLogPage() {
  const ctx = useTenantContext();
  const data = useFetch(() =>
    fetchPublishLog({
      brandId: ctx.brandId ?? undefined,
      regionCode: ctx.regionCode ?? undefined,
    }),
  );

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Publish Log" description="Article distribution events" />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">Slug</th>
              <th className="p-3">Region</th>
              <th className="p-3">Status</th>
              <th className="p-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {(data.data?.items ?? []).map((row, i) => (
              <tr key={row.log_id ?? i} className="border-b">
                <td className="p-3">{row.slug}</td>
                <td className="p-3">{row.city_code}</td>
                <td className="p-3">{row.status}</td>
                <td className="p-3">{row.published_at?.slice(0, 19)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function PublishCalendarPage() {
  const data = useFetch(() => fetchDiasporaSchedule());

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  const items = data.data?.items ?? [];

  return (
    <>
      <PageHeader title="Publish Calendar" description="Scheduled publish queue" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => (
          <div key={s.schedule_id ?? i} className="rounded-xl border p-4">
            <p className="font-medium">{s.slug ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{s.city_code}</p>
            <p className="mt-2 text-xs">{s.publish_at?.slice(0, 16)}</p>
            <span className="mt-1 inline-block text-xs text-muted-foreground">{s.status}</span>
          </div>
        ))}
        {!items.length && (
          <p className="text-muted-foreground">No scheduled items. Connect CP diaspora schedule API.</p>
        )}
      </div>
    </>
  );
}

export function BulkSchedulePage() {
  return (
    <>
      <PageHeader title="Bulk Schedule" description="CSV upload — slug, region, publish_at (meta only)" />
      <p className="text-sm text-muted-foreground">
        Upload a CSV with columns: slug, city_code, publish_at. Bulk enqueue via diaspora schedule API.
      </p>
    </>
  );
}

export function BuildHistoryPage() {
  const data = useFetch(() => fetchSiteBuilds());

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Build History" description="Static site build jobs" />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">Build</th>
              <th className="p-3">Region</th>
              <th className="p-3">Status</th>
              <th className="p-3">Started</th>
            </tr>
          </thead>
          <tbody>
            {(data.data?.builds ?? []).map((b, i) => (
              <tr key={b.build_id ?? i} className="border-b">
                <td className="p-3 font-mono text-xs">{b.build_id}</td>
                <td className="p-3">{b.city_code}</td>
                <td className="p-3">{b.status}</td>
                <td className="p-3">{b.started_at?.slice(0, 19)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
