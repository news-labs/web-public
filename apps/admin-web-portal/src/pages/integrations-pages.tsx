import { useState } from "react";
import {
  Button,
  ErrorState,
  LoadingState,
  PageHeader,
  useFetch,
} from "@core-labs/admin-shell";
import {
  fetchChangeHistory,
  fetchGithubRepos,
  fetchGithubRuns,
  triggerTemplateDeploy,
} from "../lib/api";

export function GithubReposPage() {
  const data = useFetch(() => fetchGithubRepos());

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Template Repos" description="GitHub repos for template GitOps" />
      <div className="space-y-4">
        {(data.data?.items ?? []).map((r) => (
          <div key={r.repo} className="rounded-xl border p-4">
            <a href={r.url} target="_blank" rel="noreferrer" className="font-medium text-primary">
              {r.repo}
            </a>
            <p className="mt-1 text-sm text-muted-foreground">
              Branch: {r.branch} · Last tag: {r.last_tag ?? "none"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export function CiRunsPage() {
  const data = useFetch(() => fetchGithubRuns());
  const [triggering, setTriggering] = useState(false);

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await triggerTemplateDeploy("default");
      data.refetch();
    } finally {
      setTriggering(false);
    }
  };

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="CI Runs" description="GitHub Actions template deploy history" />
      <Button className="mb-4" disabled={triggering} onClick={handleTrigger}>
        {triggering ? "Triggering…" : "Trigger template deploy"}
      </Button>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">Run</th>
              <th className="p-3">Branch</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {(data.data?.items ?? []).map((r) => (
              <tr key={r.run_id} className="border-b">
                <td className="p-3">
                  <a href={r.url} target="_blank" rel="noreferrer" className="text-primary">
                    #{r.run_id}
                  </a>
                </td>
                <td className="p-3">{r.branch}</td>
                <td className="p-3">{r.conclusion ?? r.status}</td>
                <td className="p-3">{r.created_at?.slice(0, 19)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function ChangeHistoryPage() {
  const data = useFetch(() => fetchChangeHistory());

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Change History" description="Config, template, and publish events" />
      <ul className="space-y-2">
        {(data.data?.items ?? []).map((e) => (
          <li key={e.event_id} className="rounded-lg border px-4 py-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="font-medium">{e.summary}</span>
              <span className="text-muted-foreground shrink-0">{e.created_at?.slice(0, 19)}</span>
            </div>
            <span className="text-xs text-muted-foreground">{e.event_type}</span>
          </li>
        ))}
      </ul>
      {(data.data?.audit ?? []).length > 0 && (
        <>
          <h3 className="mb-2 mt-6 font-semibold">CP Audit log</h3>
          <pre className="overflow-x-auto rounded-lg border p-4 text-xs">
            {JSON.stringify(data.data?.audit, null, 2)}
          </pre>
        </>
      )}
    </>
  );
}

export function AuditLogPage() {
  const data = useFetch(() => fetchChangeHistory());

  if (data.loading) return <LoadingState />;

  return (
    <>
      <PageHeader title="Audit Log" description="Platform audit entries from CP" />
      <pre className="overflow-x-auto rounded-lg border p-4 text-xs">
        {JSON.stringify(data.data?.audit ?? [], null, 2)}
      </pre>
    </>
  );
}
