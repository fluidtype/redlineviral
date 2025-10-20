import { execSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const testDir = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(testDir, "..", "..");
const repoRoot = resolve(appDir, "..", "..");
const buildDir = join(appDir, ".next");

const SECRET_ENV = {
  DATABASE_URL: "postgres://user:pass@localhost:5432/db",
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_ANON_KEY: "public-anon-key",
  SUPABASE_JWT_SECRET: "jwt-secret",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-secret",
  CLERK_PUBLISHABLE_KEY: "pk_test",
  CLERK_SECRET_KEY: "sk_test_secret",
  CLERK_WEBHOOK_SIGNING_SECRET: "wh_test_secret",
  OPENAI_API_KEY: "openai-secret",
  GROK_API_KEY: "grok-secret",
  R2_ACCOUNT_ID: "r2-account",
  R2_BUCKET: "r2-bucket",
  R2_ACCESS_KEY_ID: "r2-access",
  R2_SECRET_ACCESS_KEY: "r2-secret",
  REDIS_URL: "https://redis.example",
  BULLMQ_PREFIX: "rv-ci",
  TURNSTILE_SITE_KEY: "turnstile-site",
  TURNSTILE_SECRET: "turnstile-secret",
  WORKER_JWT_SECRET: "w".repeat(48),
  RESEND_API_KEY: "resend-secret",
  POSTHOG_API_KEY: "posthog-secret",
  SENTRY_DSN: "https://example.ingest.sentry.io/1",
} as const;

const SENSITIVE_ENV_KEYS = [
  "DATABASE_URL",
  "SUPABASE_JWT_SECRET",
  "SUPABASE_SERVICE_ROLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_WEBHOOK_SIGNING_SECRET",
  "OPENAI_API_KEY",
  "GROK_API_KEY",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "REDIS_URL",
  "TURNSTILE_SECRET",
  "WORKER_JWT_SECRET",
  "RESEND_API_KEY",
  "POSTHOG_API_KEY",
  "SENTRY_DSN",
] satisfies Array<keyof typeof SECRET_ENV>;

let built = false;

beforeAll(() => {
  if (built) return;
  execSync("pnpm --filter @rv/web build", {
    cwd: repoRoot,
    stdio: "ignore",
    env: {
      ...process.env,
      ...SECRET_ENV,
      AUTH_MODE: "off",
      NODE_ENV: "production",
      CI: "1",
    },
  });
  built = true;
});

function walkFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      return walkFiles(full);
    }
    return [full];
  });
}

describe("client bundle secret scan", () => {
  it("does not leak sensitive env values", () => {
    const assets = walkFiles(join(buildDir, "static"));
    const secretValues = SENSITIVE_ENV_KEYS.map((key) => SECRET_ENV[key]).filter(Boolean);
    const textExtensions = new Set([".js", ".mjs", ".cjs", ".json", ".html", ".txt", ".css"]);
    const leaks: Array<{ file: string; secret: string }> = [];

    for (const asset of assets) {
      if (!textExtensions.has(extname(asset))) continue;
      const content = readFileSync(asset, "utf8");
      for (const secret of secretValues) {
        if (secret && content.includes(secret)) {
          leaks.push({ file: asset, secret });
        }
      }
    }

    expect(leaks).toEqual([]);
  });
});
