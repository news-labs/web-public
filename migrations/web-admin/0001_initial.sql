-- Web admin D1: nl-web-db-admin

CREATE TABLE IF NOT EXISTS deploy_schedules (
  schedule_id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  cron_expression TEXT NOT NULL,
  environment TEXT NOT NULL DEFAULT 'staging',
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS deploy_history (
  deploy_id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  environment TEXT NOT NULL,
  status TEXT NOT NULL,
  triggered_by TEXT,
  workflow_run_id TEXT,
  preview_url TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_deploy_history_site ON deploy_history(site_id, created_at);

CREATE TABLE IF NOT EXISTS admin_users (
  user_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'web_admin',
  google_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  log_id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details TEXT,
  created_at TEXT NOT NULL
);
