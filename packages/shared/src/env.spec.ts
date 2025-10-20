import { beforeEach, describe, expect, it, vi } from "vitest";

// Use dynamic import to re-evaluate module with altered process.env
async function load() {
  const mod = await import("./env");
  return mod;
}

const REQUIRED = [
  "DATABASE_URL","SUPABASE_URL","SUPABASE_ANON_KEY","SUPABASE_JWT_SECRET","SUPABASE_SERVICE_ROLE_KEY",
  "CLERK_PUBLISHABLE_KEY","CLERK_SECRET_KEY",
  "CLERK_WEBHOOK_SIGNING_SECRET",
  "OPENAI_API_KEY","GROK_API_KEY","R2_ACCOUNT_ID","R2_BUCKET","R2_ACCESS_KEY_ID","R2_SECRET_ACCESS_KEY",
  "REDIS_URL","BULLMQ_PREFIX",
  "TURNSTILE_SITE_KEY","TURNSTILE_SECRET","WORKER_JWT_SECRET",
  "RESEND_API_KEY","POSTHOG_API_KEY"
];

void REQUIRED;

function minimalEnv(): Record<string,string> {
  return {
    AUTH_MODE: "on",
    DATABASE_URL: "postgres://user:pass@host:5432/db",
    SUPABASE_URL: "https://proj.supabase.co",
    SUPABASE_ANON_KEY: "anon",
    SUPABASE_JWT_SECRET: "jwt",
    SUPABASE_SERVICE_ROLE_KEY: "service-role",
    CLERK_PUBLISHABLE_KEY: "pk",
    CLERK_SECRET_KEY: "sk",
    CLERK_WEBHOOK_SIGNING_SECRET: "wh",
    OPENAI_API_KEY: "openai",
    GROK_API_KEY: "grok",
    R2_ACCOUNT_ID: "acc",
    R2_BUCKET: "bucket",
    R2_ACCESS_KEY_ID: "ak",
    R2_SECRET_ACCESS_KEY: "sk2",
    REDIS_URL: "https://eu1-upstash.io",
    BULLMQ_PREFIX: "rv",
    TURNSTILE_SITE_KEY: "ts_pub",
    TURNSTILE_SECRET: "ts_sec",
    WORKER_JWT_SECRET: "12345678901234567890123456789012",
    RESEND_API_KEY: "re",
    POSTHOG_API_KEY: "ph",
    SENTRY_DSN: "https://example.ingest.sentry.io/1"
  };
}

describe("env loader", () => {
  const original = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...original }; // reset
  });

  it("throws on missing required keys", async () => {
    process.env = {};
    await expect(load()).rejects.toMatchObject({ message: expect.stringContaining("ENV_INVALID") });
  });

  it("parses valid env and exposes server/public subsets", async () => {
    process.env = { ...process.env, ...minimalEnv(), NEXT_PUBLIC_FOO: "bar" };
    const { env, publicEnv, requireKey } = await load();
    expect(env.SUPABASE_URL).toBeDefined();
    expect(publicEnv.NEXT_PUBLIC_FOO).toBe("bar");
    expect(() => requireKey("R2_BUCKET")).not.toThrow();
  });

  it("requireKey throws when value is missing after load", async () => {
    process.env = { ...process.env, ...minimalEnv() };
    const { env, requireKey } = await load();
    // Simulate a missing key at use-site (beyond Zod validation time)
    delete (env as Record<string, unknown>).R2_BUCKET;
    expect(() => requireKey("R2_BUCKET")).toThrowError(/ENV_MISSING/);
  });

  it("allows disabling auth without Clerk keys", async () => {
    const envValues = minimalEnv();
    envValues.AUTH_MODE = "off";
    delete envValues.CLERK_PUBLISHABLE_KEY;
    delete envValues.CLERK_SECRET_KEY;
    delete envValues.CLERK_WEBHOOK_SIGNING_SECRET;

    process.env = { ...process.env, ...envValues };
    delete process.env.CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_SECRET_KEY;
    delete process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    const mod = await load();
    expect(mod.isAuthEnabled()).toBe(false);
  });
});
