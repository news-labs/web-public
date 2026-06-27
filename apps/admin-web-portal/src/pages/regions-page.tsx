import { useState } from "react";
import {
  Button,
  ErrorState,
  Input,
  LoadingState,
  PageHeader,
  useFetch,
  useTenantContext,
} from "@core-labs/admin-shell";
import { fetchRegions, patchRegion, upsertRegion } from "../lib/api";

const EMPTY = {
  city_code: "",
  brand_id: "",
  city_name: "",
  country_iso: "",
  timezone: "UTC",
  domain: "",
  routing_mode: "subfolder",
  target_language: "en",
  status: "planning",
};

export function RegionsPage() {
  const ctx = useTenantContext();
  const data = useFetch(() => fetchRegions(ctx.brandId ?? undefined));
  const [form, setForm] = useState({ ...EMPTY, brand_id: ctx.brandId ?? "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.city_code || !form.brand_id) return;
    setSubmitting(true);
    try {
      if (editing) await patchRegion(editing, form);
      else await upsertRegion(form);
      setForm({ ...EMPTY, brand_id: ctx.brandId ?? "" });
      setEditing(null);
      data.refetch();
    } finally {
      setSubmitting(false);
    }
  };

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Regions" description="City nodes — domain, country, routing" />
      <div className="mb-6 rounded-xl border p-4">
        <h3 className="mb-3 font-medium">{editing ? `Edit ${editing}` : "Create region"}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(["city_code", "brand_id", "city_name", "country_iso", "domain", "target_language"] as const).map(
            (k) => (
              <Input
                key={k}
                placeholder={k}
                value={form[k]}
                disabled={editing !== null && k === "city_code"}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ),
          )}
        </div>
        <Button className="mt-3" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving…" : editing ? "Update" : "Create"}
        </Button>
        {editing && (
          <Button variant="outline" className="ml-2 mt-3" onClick={() => { setEditing(null); setForm({ ...EMPTY, brand_id: ctx.brandId ?? "" }); }}>
            Cancel
          </Button>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">Code</th>
              <th className="p-3">Name</th>
              <th className="p-3">Country</th>
              <th className="p-3">Domain</th>
              <th className="p-3">Lang</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(data.data?.regions ?? []).map((r) => (
              <tr key={r.city_code} className="border-b">
                <td className="p-3 font-mono text-xs">{r.city_code}</td>
                <td className="p-3">{r.city_name}</td>
                <td className="p-3">{r.country_iso}</td>
                <td className="p-3">{r.domain}</td>
                <td className="p-3">{r.target_language}</td>
                <td className="p-3">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(r.city_code); setForm({ ...EMPTY, ...r, brand_id: r.brand_id }); }}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
