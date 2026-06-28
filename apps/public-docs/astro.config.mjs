import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightClientMermaid from "@pasqal-io/starlight-client-mermaid";

export default defineConfig({
  site: "https://docs.newsfork.com",
  trailingSlash: "always",
  vite: {
    build: {
      target: "esnext",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
      },
    },
  },
  integrations: [
    starlight({
      title: "Newsfork Docs",
      description:
        "User documentation for Newsfork — API reference, guides, user manual, and policies.",
      favicon: "/favicon.svg",
      editLink: {
        baseUrl: "https://github.com/news-labs/web-public/edit/main/apps/public-docs/",
      },
      pagination: true,
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
        ko: {
          label: "한국어",
          lang: "ko",
        },
      },
      defaultLocale: "root",
      components: {
        Header: "./src/components/Header.astro",
        PageFrame: "./src/components/PageFrame.astro",
        PageTitle: "./src/components/PageTitle.astro",
        TwoColumnContent: "./src/components/TwoColumnContent.astro",
        PageSidebar: "./src/components/PageSidebar.astro",
      },
      head: [
        {
          tag: "meta",
          attrs: {
            name: "robots",
            content: "index, follow",
          },
        },
      ],
      plugins: [starlightClientMermaid()],
      sidebar: [
        { label: "Overview", link: "/" },
        {
          label: "Start Here",
          items: [
            { label: "Getting Started", slug: "getting-started" },
            { label: "API Quickstart", slug: "api-quickstart" },
          ],
        },
        {
          label: "v1 API",
          autogenerate: { directory: "v1/api" },
        },
        {
          label: "Guides",
          autogenerate: { directory: "v1/guides" },
        },
        {
          label: "Legal",
          items: [
            { label: "Terms of Service", slug: "legal/terms-of-service" },
            { label: "Privacy Policy", slug: "legal/privacy-policy" },
            { label: "Cookie Policy", slug: "legal/cookie-policy" },
            { label: "Data Processing Agreement", slug: "legal/data-processing-agreement" },
            { label: "Service Level Agreement", slug: "legal/service-level-agreement" },
            { label: "Supplemental product practices", slug: "legal/supplemental-practices" },
          ],
        },
        {
          label: "Company",
          autogenerate: { directory: "company" },
        },
        {
          label: "Resources",
          autogenerate: { directory: "resources" },
        },
        {
          label: "Changelog",
          slug: "changelog",
        },
      ],
      customCss: ["./src/styles/custom.css"],
    }),
  ],
});
