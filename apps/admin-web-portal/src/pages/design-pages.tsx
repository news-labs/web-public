import { useEffect, useState } from "react";
import {
  Button,
  ErrorState,
  Input,
  LoadingState,
  PageHeader,
  useFetch,
  useTenantContext,
} from "@core-labs/admin-shell";
import { fetchDesignTokens, saveDesignTokens } from "../lib/api";

export function DesignTokensPage() {
  const ctx = useTenantContext();
  const scopeType = ctx.regionCode ? "region" : "brand";
  const scopeId = ctx.regionCode ?? ctx.brandId ?? "default";
  const data = useFetch(() => fetchDesignTokens(scopeType, scopeId), [scopeType, scopeId]);
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data.data?.tokens) setTokens(data.data.tokens);
  }, [data.data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveDesignTokens({ scope_type: scopeType, scope_id: scopeId, tokens });
      data.refetch();
    } finally {
      setSaving(false);
    }
  };

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Design Tokens" description={`Scoped to ${scopeType}/${scopeId}`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(tokens).map(([key, value]) => (
          <div key={key} className="rounded-xl border p-4">
            <label className="text-xs uppercase text-muted-foreground">{key}</label>
            <Input
              className="mt-2"
              value={value}
              onChange={(e) => setTokens({ ...tokens, [key]: e.target.value })}
            />
            {key.includes("accent") && (
              <div className="mt-2 h-8 rounded" style={{ backgroundColor: value }} />
            )}
          </div>
        ))}
      </div>
      <Button className="mt-4" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save tokens"}
      </Button>
    </>
  );
}

export function PreviewPage() {
  const ctx = useTenantContext();
  return (
    <>
      <PageHeader title="Live Preview" description="Sample article render for selected tenant" />
      <div className="rounded-xl border bg-muted/20 p-8 text-center">
        <p className="text-muted-foreground">
          Preview iframe for template <strong>{ctx.templateLabel}</strong>
          {ctx.selectedRegion && ` · ${ctx.selectedRegion.city_name}`}
        </p>
        <iframe
          title="preview"
          className="mx-auto mt-4 h-96 w-full max-w-3xl rounded-lg border bg-white"
          src="about:blank"
        />
      </div>
    </>
  );
}

export function ComponentsGalleryPage() {
  return (
    <>
      <PageHeader title="Component Gallery" description="Shared layout components per template" />
      <p className="text-sm text-muted-foreground">
        Components are sourced from Git template repos. Connect a repo under Integrations → Template Repos.
      </p>
    </>
  );
}
