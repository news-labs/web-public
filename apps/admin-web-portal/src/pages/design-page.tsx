import { ErrorState, LoadingState, PageHeader, useFetch } from "@core-labs/admin-shell";
import { fetchDesignTokens } from "../lib/api";

export function DesignPage() {
  const design = useFetch(() => fetchDesignTokens());

  if (design.loading) return <LoadingState />;
  if (design.error) return <ErrorState message={design.error} onRetry={design.refetch} />;

  return (
    <>
      <PageHeader title="Design" description="Brand tokens preview (vouus-style accent)" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(design.data?.tokens ?? {}).map(([key, value]) => (
          <div key={key} className="rounded-xl border p-4">
            <p className="text-xs text-muted-foreground uppercase">{key}</p>
            <p className="mt-2 font-medium">{value}</p>
            {key.includes("accent") && (
              <div className="mt-3 h-10 rounded-md" style={{ backgroundColor: value }} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
