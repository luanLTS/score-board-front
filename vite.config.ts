import { readFileSync, writeFileSync } from "node:fs";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const packageVersion = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
).version as string;

const versionServiceWorker = () => ({
  name: "version-service-worker",
  closeBundle: () => {
    const serviceWorkerPath = new URL("./dist/sw.js", import.meta.url);
    const source = readFileSync(new URL("./public/sw.js", import.meta.url), "utf8");
    writeFileSync(
      serviceWorkerPath,
      source.replaceAll("__APP_VERSION__", packageVersion),
    );
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), versionServiceWorker()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["**/node_modules/**", "**/.worktrees/**", "**/dist/**"],
  },
});
