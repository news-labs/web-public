import { useState } from "react";
import { Button, DataTable, ErrorState, Input, LoadingState, PageHeader, Select, useFetch } from "@core-labs/admin-shell";
import { createRedirect, deleteRedirect, fetchRedirects, type RedirectRow } from "../lib/api";

export function RedirectsPage() {
  const redirects = useFetch(() => fetchRedirects());
  const [siteId, setSiteId] = useState("public-docs");
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");

  const handleCreate = async () => {
    await createRedirect(siteId, fromPath, toPath);
    redirects.refetch();
    setFromPath("");
    setToPath("");
  };

  if (redirects.loading) return <LoadingState />;

  return (
    <>
      <PageHeader title="Redirects" description="D1-managed redirect rules + repo _redirects files" />
      {redirects.error && <ErrorState message={redirects.error} onRetry={redirects.refetch} />}
      <div className="mb-6 flex flex-wrap gap-2 rounded-xl border p-4">
        <Select value={siteId} onChange={(e) => setSiteId(e.target.value)}>
          <option value="public-docs">Public Docs</option>
          <option value="marketing-web">Marketing Web</option>
          <option value="news-site">News Site</option>
        </Select>
        <Input placeholder="/old-path" value={fromPath} onChange={(e) => setFromPath(e.target.value)} className="max-w-xs font-mono" />
        <Input placeholder="/new-path" value={toPath} onChange={(e) => setToPath(e.target.value)} className="max-w-xs font-mono" />
        <Button onClick={() => void handleCreate()} disabled={!fromPath || !toPath}>Add rule</Button>
      </div>
      <DataTable<RedirectRow>
        rows={redirects.data?.items ?? []}
        rowKey={(row) => row.rule_id}
        columns={[
          { key: "site_id", header: "Site" },
          { key: "from_path", header: "From" },
          { key: "to_path", header: "To" },
          {
            key: "actions",
            header: "",
            render: (row: RedirectRow) => (
              <Button size="sm" variant="destructive" onClick={() => void deleteRedirect(row.rule_id).then(() => redirects.refetch())}>
                Delete
              </Button>
            ),
          },
        ]}
      />
      <ul className="mt-6 space-y-2">
        {(redirects.data?.files ?? []).map((file) => (
          <li key={file.path} className="rounded-xl border p-4 text-sm">
            <p className="font-medium">{file.site}</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">{file.path}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
