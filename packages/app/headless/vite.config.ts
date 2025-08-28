/**
 * Vite configuration for the headless demo. Enables cross‑origin isolation so
 * that AudioWorklets can run and exposes the `src` directory via the `@` alias.
 * Supported Browsers: Chrome (latest), Firefox (latest), Safari (latest), Edge (Chromium)
 */
import { defineConfig } from "vite";
import crossOriginIsolation from "vite-plugin-cross-origin-isolation";
import { readFileSync } from "fs";
import { resolve } from "path";

export default defineConfig(({ command }) => {
  const supportedBrowsers = [
    "chrome109",
    "firefox117",
    "safari16",
    "edge109",
  ] as const;
  return {
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    build: {
      // Code splitting approach mirrors the studio; see
      // packages/docs/docs-dev/build-and-run/code-splitting.md
      target: supportedBrowsers,
    },
    esbuild: {
      target: supportedBrowsers,
    },
    server: {
      port: 8080,
      host: "localhost",
      https:
        command === "serve"
          ? {
              key: readFileSync("../localhost-key.pem"),
              cert: readFileSync("../localhost.pem"),
            }
          : undefined,
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      },
      fs: {
        // Allow serving files from the entire workspace
        allow: [".."],
      },
    },
    plugins: [crossOriginIsolation()],
  };
});
