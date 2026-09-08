import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

describe("web application foundation", () => {
  it("uses index.html as the Vite application entry instead of library mode", async () => {
    const [index, viteConfig] = await Promise.all([
      readFile(new URL("../index.html", import.meta.url), "utf8"),
      readFile(new URL("../vite.config.js", import.meta.url), "utf8"),
    ]);

    assert.match(index, /src="\/src\/main\.js"/);
    assert.doesNotMatch(viteConfig, /build\s*:\s*\{[\s\S]*?lib\s*:/);
  });

  it("models the authenticated game entity only as players/{uid}", async () => {
    const [service, rules] = await Promise.all([
      readFile(new URL("../src/services/firestore.js", import.meta.url), "utf8"),
      readFile(new URL("../firestore.rules", import.meta.url), "utf8"),
    ]);

    assert.match(service, /doc\(db, "players", user\.uid\)/);
    assert.match(rules, /match \/players\/\{uid\}/);
    assert.doesNotMatch(`${service}\n${rules}`, /\/users\//);
  });
});
