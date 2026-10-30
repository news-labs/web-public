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

/** Mirrors news-hub MEDIA_SPEC upload slots (banner / article). */
const UPLOAD_GUIDELINES = {
  banner: { width: 374, height: 180, maxBytes: 100 * 1024 },
  article: { width: 414, height: 275, maxBytes: 100 * 1024 },
} as const;

type UploadSlot = keyof typeof UPLOAD_GUIDELINES;

function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      URL.revokeObjectURL(url);
      resolve({ width, height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode image"));
    };
    img.src = url;
  });
}

async function assertUploadGuideline(file: File, slot: UploadSlot): Promise<string | null> {
  const spec = UPLOAD_GUIDELINES[slot];
  if (file.size > spec.maxBytes) {
    return `${slot} image exceeds ${spec.maxBytes} bytes (got ${file.size}). Resize before upload.`;
  }
  try {
    const { width, height } = await readImageSize(file);
    if (width !== spec.width || height !== spec.height) {
      return `${slot} image must be ${spec.width}×${spec.height} (got ${width}×${height}).`;
    }
  } catch {
    return "Could not read image dimensions. Use a valid PNG/JPEG/WebP.";
  }
  return null;
}

export function MediaLibraryPage() {
  const ctx = useTenantContext();
  const scopeType = ctx.regionCode ? "region" : "brand";
  const scopeId = ctx.regionCode ?? ctx.brandId ?? "default";
  const data = useFetch(() => fetchMediaAssets(scopeType, scopeId));
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [slot, setSlot] = useState<UploadSlot>("banner");

  const handleUpload = async (file: File) => {
    const err = await assertUploadGuideline(file, slot);
    if (err) {
      window.alert(err);
      return;
    }
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("scopeType", scopeType);
    form.append("scopeId", scopeId);
    form.append("assetType", "image");
    form.append("mediaSlot", slot);
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
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-muted-foreground">
          Slot{" "}
          <select
            className="ml-1 rounded border px-2 py-1 text-sm"
            value={slot}
            onChange={(e) => setSlot(e.target.value as UploadSlot)}
          >
            <option value="banner">banner 374×180</option>
            <option value="article">article 414×275</option>
          </select>
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
            e.target.value = "";
          }}
        />
        <Button disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Korean Times Image Guidelines: max 100 KB; exact slot dimensions required.
      </p>
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
