import { useState } from "react";
import {
  Button,
  ErrorState,
  Input,
  LoadingState,
  PageHeader,
  useFetch,
} from "@core-labs/admin-shell";
import { createBrand, fetchBrands } from "../lib/api";

export function BrandsPage() {
  const data = useFetch(() => fetchBrands());
  const [form, setForm] = useState({
    brand_id: "",
    apex_domain: "",
    default_locale: "en",
    template_id: "default",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.brand_id || !form.apex_domain) return;
    setSubmitting(true);
    try {
      await createBrand(form);
      setForm({ brand_id: "", apex_domain: "", default_locale: "en", template_id: "default" });
      data.refetch();
    } finally {
      setSubmitting(false);
    }
  };

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Brands & Domains" description="Apex domains and default templates" />
      <div className="mb-6 rounded-xl border p-4">
        <h3 className="mb-3 font-medium">Create brand</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="brand_id"
            value={form.brand_id}
            onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
          />
          <Input
            placeholder="apex_domain"
            value={form.apex_domain}
            onChange={(e) => setForm({ ...form, apex_domain: e.target.value })}
          />
          <Input
            placeholder="default_locale"
            value={form.default_locale}
            onChange={(e) => setForm({ ...form, default_locale: e.target.value })}
          />
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : "Create"}
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">Brand</th>
              <th className="p-3">Domain</th>
              <th className="p-3">Locale</th>
              <th className="p-3">Template</th>
            </tr>
          </thead>
          <tbody>
            {(data.data?.brands ?? []).map((b) => (
              <tr key={b.brand_id} className="border-b">
                <td className="p-3 font-medium">{b.brand_id}</td>
                <td className="p-3">{b.apex_domain}</td>
                <td className="p-3">{b.default_locale}</td>
                <td className="p-3">{b.template_id ?? "default"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
