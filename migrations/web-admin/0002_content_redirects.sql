-- Redirect rules and content pages for web admin

CREATE TABLE IF NOT EXISTS redirect_rules (
  rule_id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  from_path TEXT NOT NULL,
  to_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_redirect_site ON redirect_rules(site_id);

CREATE TABLE IF NOT EXISTS content_pages (
  page_id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_content_site_slug ON content_pages(site_id, slug);
