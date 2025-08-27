import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "openDAW Docs",
  url: "https://example.com",
  baseUrl: "/",
  favicon: "img/logo.svg",
  organizationName: "example",
  projectName: "openDAW",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: { defaultLocale: "en", locales: ["en"] },

  presets: [
    [
      "classic",
      {
        docs: false,
        blog: false,
        theme: { customCss: require.resolve("./src/css/custom.css") },
      },
    ],
  ],

  themes: ["@docusaurus/theme-mermaid"],
  markdown: { mermaid: true },

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "dev",
        path: "docs-dev",
        routeBasePath: "dev",
        sidebarPath: require.resolve("./sidebarsDev.js"),
        editUrl: "https://github.com/example/openDAW/edit/main/packages/docs/",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "user",
        path: "docs-user",
        routeBasePath: "user",
        sidebarPath: require.resolve("./sidebarsUser.js"),
        editUrl: "https://github.com/example/openDAW/edit/main/packages/docs/",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "learn",
        path: "docs-learn",
        routeBasePath: "learn",
        sidebarPath: require.resolve("./sidebarsLearn.js"),
        editUrl: "https://github.com/example/openDAW/edit/main/packages/docs/",
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        id: "api-runtime",
        entryPoints: ["../lib/runtime/src/index.ts"],
        tsconfig: "../lib/runtime/tsconfig.json",
        out: "api",
        excludePrivate: true,
        excludeExternals: false,
        plugin: ["typedoc-plugin-missing-exports"],
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        id: "api-dsp",
        entryPoints: ["../lib/dsp/src/index.ts"],
        tsconfig: "../lib/dsp/tsconfig.json",
        out: "api/dsp",
        excludePrivate: true,
        excludeExternals: false,
        plugin: ["typedoc-plugin-missing-exports"],
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        id: "api-midi",
        entryPoints: ["../lib/midi/src/index.ts"],
        tsconfig: "../lib/midi/tsconfig.json",
        out: "api/midi",
        excludePrivate: true,
        excludeExternals: false,
        plugin: ["typedoc-plugin-missing-exports"],
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "openDAW",
      items: [
        { to: "/dev/intro", label: "Developers", position: "left" },
        { to: "/user/intro", label: "User Guide", position: "left" },
        { to: "/learn/intro", label: "Learning Hub", position: "left" },
        { to: "/api", label: "API", position: "left" },
        {
          href: "https://github.com/example/openDAW",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  },
};

export default config;
