export interface Env {
  WEB_ADMIN_DB: D1Database;
  ASSETS: Fetcher;
  ENVIRONMENT: string;
  WEB_ADMIN_API_KEY?: string;
  INTERNAL_SIG_SECRET?: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO: string;
  GITHUB_WORKFLOW_DEPLOY_WWW: string;
  GITHUB_WORKFLOW_DEPLOY_DOCS: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
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
