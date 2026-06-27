import { useState } from "react";
import {
  Button,
  ErrorState,
  LoadingState,
  PageHeader,
  useFetch,
  useTenantContext,
} from "@core-labs/admin-shell";
import { fetchContentIndex, fetchCategories } from "../lib/api";

export function ContentIndexPage() {
  const ctx = useTenantContext();
  const [cursor, setCursor] = useState<string | undefined>();
  const data = useFetch(
    () =>
      fetchContentIndex({
        cursor,
        limit: 50,
        brandId: ctx.brandId ?? undefined,
        regionCode: ctx.regionCode ?? undefined,
      }),
    [cursor, ctx.brandId, ctx.regionCode],
  );

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader
        title="Content Index"
        description="Metadata only — static HTML lives in R2 (100k+/day scale)"
      />
      {data.data?.total_estimate != null && (
        <p className="mb-4 text-sm text-muted-foreground">
          ~{data.data.total_estimate.toLocaleString()} articles indexed
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">Slug</th>
              <th className="p-3">Title</th>
              <th className="p-3">Region</th>
              <th className="p-3">Locale</th>
              <th className="p-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {(data.data?.items ?? []).map((row, i) => (
              <tr key={`${row.slug}-${i}`} className="border-b">
                <td className="p-3 font-mono text-xs">{row.slug}</td>
                <td className="p-3">{row.title}</td>
                <td className="p-3">{row.region}</td>
                <td className="p-3">{row.locale}</td>
                <td className="p-3">{row.published_at?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-2">
        {cursor && (
          <Button variant="outline" onClick={() => setCursor(undefined)}>
            First page
          </Button>
        )}
        {data.data?.next_cursor && (
          <Button onClick={() => setCursor(data.data!.next_cursor!)}>Next page</Button>
        )}
      </div>
    </>
  );
}

export function CategoriesPage() {
  const data = useFetch(() => fetchCategories());

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Categories" description="Global category registry" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(data.data?.categories ?? []).map((c) => (
          <div key={c.category_slug} className="rounded-xl border p-4">
            <p className="font-medium">{c.display_name}</p>
            <p className="text-xs text-muted-foreground">{c.category_slug}</p>
          </div>
        ))}
      </div>
    </>
  );
}
