import { readFile } from "node:fs/promises";

export type PluginSpec = { name: string; enabled?: boolean; options?: Record<string, unknown> };
export type HostConfig = { port: number; plugins: PluginSpec[] };

export const defaultConfig: HostConfig = {
  "port": 8787,
  "plugins": [
    { "name": "elements", "enabled": true, "options": { "path": "/docs" } },
    { "name": "mesh-server", "enabled": false, "options": { "meshes": [] } }
  ]
};

export async function loadConfig(path = "sflo.config.json"): Promise<HostConfig> {
  try {
    const text = await readFile(path, "utf8");
    const parsed = JSON.parse(text);
    return { ...defaultConfig, ...parsed, "plugins": parsed.plugins ?? defaultConfig.plugins };
  } catch {
    return defaultConfig;
  }
}
