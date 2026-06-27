/**
 * @deprecated Unified docs are served directly from nf-public-docs Pages at docs.newsfork.com.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const legalOrigin = env.LEGAL_DOCS_ORIGIN || "https://nf-public-legal.pages.dev";
    const apiDocsOrigin = env.API_DOCS_ORIGIN || "https://nfdocs.pages.dev";

    const isLegal = url.pathname === "/legal" || url.pathname.startsWith("/legal/");
    const targetOrigin = isLegal ? legalOrigin : apiDocsOrigin;
    const originPath = isLegal ? toLegalOriginPath(url.pathname) : url.pathname;
    const targetUrl = new URL(originPath + url.search, targetOrigin);

    const headers = new Headers(request.headers);
    headers.set("Host", new URL(targetOrigin).host);

    const response = await fetch(
      new Request(targetUrl.toString(), {
        method: request.method,
        headers,
        body: request.body,
        redirect: "manual",
      }),
    );

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  },
};

function toLegalOriginPath(pathname: string): string {
  if (pathname === "/legal" || pathname === "/legal/") {
    return "/";
  }
  return pathname;
}

interface Env {
  LEGAL_DOCS_ORIGIN?: string;
  API_DOCS_ORIGIN?: string;
}
