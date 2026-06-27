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
      components: {
        Header: "./src/components/Header.astro",
        PageFrame: "./src/components/PageFrame.astro",
        PageTitle: "./src/components/PageTitle.astro",
        TwoColumnContent: "./src/components/TwoColumnContent.astro",
        PageSidebar: "./src/components/PageSidebar.astro",
      },
      plugins: [starlightClientMermaid()],
      sidebar: [
        {
          label: "Start Here",
          items: [
            { label: "Getting Started", slug: "getting-started" },
            { label: "Manual Setup", slug: "manual-setup" },
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
          label: "User Manual",
          autogenerate: { directory: "user-manual" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
        {
          label: "Legal",
          autogenerate: { directory: "legal" },
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
