-- Web admin: SEO policies, media assets, template versions, change history

CREATE TABLE IF NOT EXISTS seo_policies (
  policy_id TEXT PRIMARY KEY,
  scope_type TEXT NOT NULL,
  scope_id TEXT NOT NULL,
  title_template TEXT,
  description_template TEXT,
  og_image_url TEXT,
  sitemap_changefreq TEXT DEFAULT 'daily',
  sitemap_priority REAL DEFAULT 0.5,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(scope_type, scope_id)
);

CREATE TABLE IF NOT EXISTS seo_exceptions (
  exception_id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  locale TEXT,
  brand_id TEXT,
  region_code TEXT,
  meta_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_seo_exceptions_slug ON seo_exceptions(slug, locale);

CREATE TABLE IF NOT EXISTS seo_policy_revisions (
  revision_id TEXT PRIMARY KEY,
  policy_id TEXT NOT NULL,
  diff_json TEXT NOT NULL,
  changed_by TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS media_assets (
  asset_id TEXT PRIMARY KEY,
  scope_type TEXT NOT NULL,
  scope_id TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  filename TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  public_url TEXT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_assets_scope ON media_assets(scope_type, scope_id);

CREATE TABLE IF NOT EXISTS media_references (
  reference_id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS template_versions (
  version_id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  version TEXT NOT NULL,
  git_repo TEXT,
  git_ref TEXT,
  github_run_id TEXT,
  deployed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS design_tokens (
  token_set_id TEXT PRIMARY KEY,
  scope_type TEXT NOT NULL,
  scope_id TEXT NOT NULL,
  tokens_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(scope_type, scope_id)
);

CREATE TABLE IF NOT EXISTS change_history (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  brand_id TEXT,
  region_code TEXT,
  entity_type TEXT,
  entity_id TEXT,
  summary TEXT NOT NULL,
  details_json TEXT,
  actor TEXT,
  github_run_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_change_history_created ON change_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_change_history_brand ON change_history(brand_id, created_at DESC);
