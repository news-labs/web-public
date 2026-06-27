import { useState } from "react";
import { Button, PageHeader } from "@core-labs/admin-shell";
import { triggerDeploy } from "../lib/api";

export function DeployPage() {
  const [siteId, setSiteId] = useState("marketing-web");
  const [message, setMessage] = useState("");

  const handleDeploy = async (environment: "staging" | "production") => {
    try {
      const result = await triggerDeploy(siteId, environment);
      setMessage(`Deploy triggered: ${result.deployId}${result.previewUrl ? ` — preview: ${result.previewUrl}` : ""}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Deploy failed");
    }
  };

  return (
    <>
      <PageHeader title="Deploy" description="Trigger GitHub Actions workflow_dispatch" />
      <div className="max-w-md space-y-4 rounded-xl border p-6">
        <label className="block text-sm">
          Site
          <select
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
          >
            <option value="marketing-web">Marketing Web</option>
            <option value="public-docs">Public Docs</option>
            <option value="news-site">News Site</option>
          </select>
        </label>
        <div className="flex gap-2">
          <Button onClick={() => void handleDeploy("staging")}>Deploy Staging</Button>
          <Button variant="secondary" onClick={() => void handleDeploy("production")}>Deploy Production</Button>
        </div>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </>
  );
}
