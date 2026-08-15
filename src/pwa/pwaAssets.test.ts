import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("PWA assets", () => {
  it("provides an installable manifest with regular and maskable icons", () => {
    const manifest = JSON.parse(
      readFileSync(resolve(process.cwd(), "public/manifest.webmanifest"), "utf8"),
    ) as {
      display?: string;
      start_url?: string;
      icons?: Array<{ sizes?: string; purpose?: string; src: string }>;
    };

    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sizes: "192x192", purpose: "any" }),
        expect.objectContaining({ sizes: "512x512", purpose: "any" }),
        expect.objectContaining({ sizes: "512x512", purpose: "maskable" }),
      ]),
    );

    for (const icon of manifest.icons ?? []) {
      expect(() =>
        readFileSync(resolve(process.cwd(), "public", icon.src.replace(/^\//, ""))),
      ).not.toThrow();
    }
  });

  it("keeps an offline app-shell fallback and versioned cache cleanup", () => {
    const worker = readFileSync(resolve(process.cwd(), "public/sw.js"), "utf8");

    expect(worker).toContain('caches.match("/index.html")');
    expect(worker).toContain('request.mode === "navigate"');
    expect(worker).toContain('key.startsWith("score-board-")');
    expect(worker).toMatch(/html\.matchAll\([^\n]+assets[^\n]+\)/);
    expect(worker).toContain("cache.addAll([...new Set(assetUrls)])");
  });
});
