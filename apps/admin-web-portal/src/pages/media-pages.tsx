import { useRef, useState } from "react";
import {
  Button,
  ErrorState,
  LoadingState,
  PageHeader,
  useFetch,
  useTenantContext,
} from "@core-labs/admin-shell";
import { WEB_PORTAL } from "../portal.config";
import { getAuthToken, rewriteGatewayApiPath } from "@core-labs/admin-shell";
import { fetchMediaAssets } from "../lib/api";

export function MediaLibraryPage() {
  const ctx = useTenantContext();
  const scopeType = ctx.regionCode ? "region" : "brand";
  const scopeId = ctx.regionCode ?? ctx.brandId ?? "default";
  const data = useFetch(() => fetchMediaAssets(scopeType, scopeId));
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("scopeType", scopeType);
    form.append("scopeId", scopeId);
    form.append("assetType", "image");
    const token = getAuthToken(WEB_PORTAL.storageKey);
    try {
      const uploadPath = rewriteGatewayApiPath("/api/v1/media/upload", WEB_PORTAL.gatewayBffSegment);
      await fetch(`${WEB_PORTAL.apiBaseUrl}${uploadPath}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      data.refetch();
    } finally {
      setUploading(false);
    }
  };

  if (data.loading) return <LoadingState />;
  if (data.error) return <ErrorState message={data.error} onRetry={data.refetch} />;

  return (
    <>
      <PageHeader title="Image Library" description={`Assets for ${scopeType}/${scopeId}`} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleUpload(f);
        }}
      />
      <Button className="mb-4" disabled={uploading} onClick={() => fileRef.current?.click()}>
        {uploading ? "Uploading…" : "Upload image"}
      </Button>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(data.data?.items ?? []).map((a) => (
          <div key={a.asset_id} className="rounded-xl border p-3">
            <p className="truncate text-sm font-medium">{a.filename}</p>
            <p className="text-xs text-muted-foreground">{a.asset_type}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export function CdnAssetsPage() {
  return (
    <>
      <PageHeader title="CDN Assets" description="Public URL patterns per domain" />
      <p className="text-sm text-muted-foreground">
        Media binaries are stored in R2. CDN URLs are derived from domain bindings at deploy time.
      </p>
    </>
  );
}
