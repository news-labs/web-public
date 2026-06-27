import { useState } from "react";
import { Button, ErrorState, LoadingState, PageHeader, Select, SimpleBarChart, useFetch } from "@core-labs/admin-shell";
import { createSchedule, fetchSchedules, promoteSchedule } from "../lib/api";

export function SchedulePage() {
  const schedules = useFetch(() => fetchSchedules());
  const [siteId, setSiteId] = useState("marketing-web");
  const [cron, setCron] = useState("0 6 * * 1");
  const [environment, setEnvironment] = useState<"staging" | "production">("staging");

  const handleCreate = async () => {
    await createSchedule(siteId, cron, environment);
    schedules.refetch();
  };

  if (schedules.loading) return <LoadingState />;

  const chartData = (schedules.data?.items ?? []).map((row) => ({
    label: row.site_id.slice(0, 8),
    value: row.enabled ? 1 : 0,
  }));

  return (
    <>
      <PageHeader title="Schedule" description="Deployment cron schedules and staging promotion" />
      {schedules.error && <ErrorState message={schedules.error} onRetry={schedules.refetch} />}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-4 space-y-3">
          <Select value={siteId} onChange={(e) => setSiteId(e.target.value)}>
            <option value="marketing-web">Marketing Web</option>
            <option value="public-docs">Public Docs</option>
            <option value="news-site">News Site</option>
          </Select>
          <input className="w-full rounded-md border px-3 py-2 font-mono text-sm" value={cron} onChange={(e) => setCron(e.target.value)} />
          <Select value={environment} onChange={(e) => setEnvironment(e.target.value as "staging" | "production")}>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </Select>
          <Button onClick={() => void handleCreate()}>Add schedule</Button>
        </div>
        <div className="rounded-xl border p-4">
          <p className="mb-2 text-sm font-medium">Schedule calendar (by site)</p>
          <SimpleBarChart data={chartData.length ? chartData : [{ label: "none", value: 0 }]} />
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left">Site</th>
              <th className="px-4 py-3 text-left">Cron</th>
              <th className="px-4 py-3 text-left">Env</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(schedules.data?.items ?? []).map((row) => (
              <tr key={row.schedule_id} className="border-b last:border-0">
                <td className="px-4 py-3">{row.site_id}</td>
                <td className="px-4 py-3 font-mono">{row.cron_expression}</td>
                <td className="px-4 py-3">{row.environment}</td>
                <td className="px-4 py-3 text-right">
                  {row.environment === "staging" && (
                    <Button size="sm" variant="outline" onClick={() => void promoteSchedule(row.schedule_id).then(() => schedules.refetch())}>
                      Promote to prod
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
