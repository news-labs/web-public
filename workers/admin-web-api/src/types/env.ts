export interface Env {
  WEB_ADMIN_DB: D1Database;
  MEDIA_R2?: R2Bucket;
  ENVIRONMENT: string;
  WEB_ADMIN_API_KEY?: string;
  INTERNAL_SIG_SECRET?: string;
  CP_API_BASE_URL?: string;
  ADMIN_GATEWAY_URL?: string;
  CP_SERVICE_TOKEN?: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO: string;
  GITHUB_WORKFLOW_DEPLOY_WWW: string;
  GITHUB_WORKFLOW_DEPLOY_DOCS: string;
  GITHUB_WORKFLOW_DEPLOY_TEMPLATE?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  CF_ACCOUNT_ID?: string;
  CF_API_TOKEN?: string;
}

export const SITES = [
  {
    id: "marketing-web",
    name: "Marketing Web",
    domain: "www.example.com",
    workflow: "deploy-www.yml",
    appPath: "apps/marketing-web",
  },
  {
    id: "public-docs",
    name: "Public Docs",
    domain: "docs.example.com",
    workflow: "deploy-public-docs.yml",
    appPath: "apps/public-docs",
  },
  {
    id: "news-site",
    name: "News Site",
    domain: "news.example.com",
    workflow: "deploy-news-site.yml",
    appPath: "apps/news-site",
  },
] as const;
