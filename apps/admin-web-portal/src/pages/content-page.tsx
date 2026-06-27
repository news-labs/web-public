import { useState } from "react";
import { Button, DataTable, ErrorState, Input, LoadingState, PageHeader, Select, useFetch } from "@core-labs/admin-shell";
import { createContentPage, fetchContentPages, type ContentPageRow } from "../lib/api";

export function ContentPage() {
  const content = useFetch(() => fetchContentPages());
  const [siteId, setSiteId] = useState("marketing-web");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    await createContentPage(siteId, slug, title);
    content.refetch();
    setSlug("");
    setTitle("");
  };

  if (content.loading) return <LoadingState />;

  return (
    <>
      <PageHeader title="Content" description="Static pages managed in web admin D1" />
      {content.error && <ErrorState message={content.error} onRetry={content.refetch} />}
      <div className="mb-6 flex flex-wrap gap-2 rounded-xl border p-4">
        <Select value={siteId} onChange={(e) => setSiteId(e.target.value)}>
          <option value="marketing-web">Marketing Web</option>
          <option value="public-docs">Public Docs</option>
          <option value="news-site">News Site</option>
        </Select>
        <Input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="max-w-xs" />
        <Input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-xs" />
        <Button onClick={() => void handleCreate()} disabled={!slug || !title}>Add page</Button>
      </div>
      <DataTable<ContentPageRow>
        rows={content.data?.items ?? []}
        rowKey={(row) => row.page_id}
        columns={[
          { key: "site_id", header: "Site" },
          { key: "slug", header: "Slug" },
          { key: "title", header: "Title" },
          { key: "status", header: "Status" },
        ]}
      />
    </>
  );
}
