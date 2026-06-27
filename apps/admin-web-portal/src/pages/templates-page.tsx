import { useState } from "react";
import {
  Badge,
  Button,
  ErrorState,
  LoadingState,
  PageHeader,
  useFetch,
} from "@core-labs/admin-shell";
import { fetchTemplates, triggerTemplateDeploy, upsertTemplate } from "../lib/api";

export function TemplatesPage() {
  const data = useFetch(() => fetchTemplates());
  const [submitting, setSubmitting] = useState(false);

  const handleTriggerCi = async (templateId: string) => {
    setSubmitting(true);
    try {
      await triggerTemplateDeploy(templateId);
    } finally {
      setSubmitting(false);
    }
  };

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Template Library" description="UI templates with Git version tracking" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(data.data?.templates ?? []).map((t) => (
          <div key={t.template_id} className="rounded-xl border p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{t.display_name}</h3>
              {t.version && <Badge variant="outline">v{t.version}</Badge>}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t.description ?? t.template_id}</p>
            {t.git_repo && (
              <p className="mt-2 font-mono text-xs text-muted-foreground">{t.git_repo}@{t.git_ref ?? "main"}</p>
            )}
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" disabled={submitting} onClick={() => handleTriggerCi(t.template_id)}>
                Trigger CI
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function TemplateOverridesPage() {
  const templates = useFetch(() => fetchTemplates());
  const [inheritMode, setInheritMode] = useState<"brand" | "region">("brand");

  if (templates.loading) return <LoadingState />;

  return (
    <>
      <PageHeader title="Template Overrides" description="Brand inherit vs region-independent design" />
      <p className="mb-4 text-sm text-muted-foreground">
        Use the tenant context bar to select brand/region. Region override sets{" "}
        <code className="text-xs">template_override_id</code> on the city node.
      </p>
      <div className="rounded-xl border p-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={inheritMode === "brand"}
            onChange={() => setInheritMode("brand")}
          />
          Inherit from brand template
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={inheritMode === "region"}
            onChange={() => setInheritMode("region")}
          />
          Region override (independent template)
        </label>
        {inheritMode === "region" && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {(templates.data?.templates ?? []).map((t) => (
              <Button
                key={t.template_id}
                variant="outline"
                size="sm"
                onClick={() =>
                  upsertTemplate({ template_id: t.template_id, display_name: t.display_name, is_active: true })
                }
              >
                {t.display_name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
