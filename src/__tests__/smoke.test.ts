import type { Plugin } from "@elizaos/core";
import { describe, expect, it } from "vitest";

async function loadPlugin(): Promise<Plugin> {
  const mod = (await import("../index.ts")) as Record<string, unknown> & {
    default?: Plugin;
  };
  const candidate =
    mod.default ??
    (Object.values(mod).find(
      (value): value is Plugin =>
        typeof value === "object" &&
        value !== null &&
        typeof (value as { name?: unknown }).name === "string",
    ) as Plugin | undefined);
  if (!candidate) throw new Error("plugin export not found");
  return candidate;
}

describe("@elizaos/plugin-music-library", () => {
  it("exports the plugin", async () => {
    const mod = await import("../index.ts");
    expect(mod).toBeDefined();
  });

  it("has required plugin properties", async () => {
    const plugin = await loadPlugin();
    expect(typeof plugin.name).toBe("string");
    expect(plugin.name).toBe("music-library");
    expect(typeof plugin.description).toBe("string");
  });

  it("declares actions", async () => {
    const plugin = await loadPlugin();
    expect(Array.isArray(plugin.actions)).toBe(true);
    expect(plugin.actions?.length ?? 0).toBeGreaterThan(0);
  });

  it("declares services", async () => {
    const plugin = await loadPlugin();
    expect(Array.isArray(plugin.services)).toBe(true);
    expect(plugin.services?.length ?? 0).toBeGreaterThan(0);
  });

  it("declares providers", async () => {
    const plugin = await loadPlugin();
    expect(Array.isArray(plugin.providers)).toBe(true);
    expect(plugin.providers?.length ?? 0).toBeGreaterThan(0);
  });
});
