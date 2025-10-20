import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";

const sql = readFileSync(
  fileURLToPath(
    new URL("../../../../apps/web/supabase/migrations/2025-10-20_block-2_schema.sql", import.meta.url)
  ),
  "utf8"
);

function has(re: RegExp) {
  return expect(sql).toMatch(re);
}

describe("Block 2 schema", () => {
  it("creates tables", () => {
    [
      "profiles",
      "videos",
      "analysis",
      "analysis_result",
      "trends_cache",
      "kits",
      "notifications",
    ].forEach((t) => has(new RegExp(`create table if not exists\\s+public\\.${t}\\b`, "i")));
  });

  it("enables RLS", () => {
    ["profiles", "videos", "analysis", "analysis_result", "kits", "notifications"].forEach(
      (t) => has(new RegExp(`alter table\\s+public\\.${t}\\s+enable row level security`, "i"))
    );
  });

  it("defines policies", () => {
    [
      "profiles_user_is_owner",
      "videos_user_is_owner",
      "analysis_user_is_owner",
      "analysis_result_user_is_owner",
      "kits_user_is_owner",
      "notifications_user_is_owner",
    ].forEach((p) => has(new RegExp(`create policy\\s+${p}\\b`, "i")));
  });

  it("fts exists on kits", () => {
    has(/search_tsv\s+tsvector/i);
    has(/create trigger\s+kits_tsvector_update_trigger/i);
  });

  it("extensions & indexes", () => {
    has(/create extension if not exists pg_trgm/i);
    has(/jsonb_path_ops/i);
    has(/using gin\s*\(search_tsv\)/i);
    has(/gin_trgm_ops/i);
  });
});