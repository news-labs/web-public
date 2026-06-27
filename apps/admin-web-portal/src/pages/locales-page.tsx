import {
  ErrorState,
  LoadingState,
  PageHeader,
  useFetch,
  useTenantContext,
} from "@core-labs/admin-shell";
import { fetchRegions } from "../lib/api";

export function LocalesPage() {
  const ctx = useTenantContext();
  const data = useFetch(() => fetchRegions(ctx.brandId ?? undefined));

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Locales & Languages" description="hreflang and supported languages per region" />
      <div className="space-y-4">
        {(data.data?.regions ?? []).map((r) => (
          <div key={r.city_code} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium">{r.city_name} ({r.city_code})</h3>
              <span className="text-sm text-muted-foreground">{r.country_iso}</span>
            </div>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Primary language</dt>
                <dd>{r.target_language}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Default lang</dt>
                <dd>{r.default_lang ?? r.target_language}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">hreflang locales</dt>
                <dd>{(r.hreflang_locales ?? []).join(", ") || "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Supported langs</dt>
                <dd>{(r.supported_langs ?? []).join(", ") || r.target_language}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
