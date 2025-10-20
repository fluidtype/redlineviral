#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");

const mode = process.argv[2];
if (!mode || !["off", "on"].includes(mode)) {
  console.error("Usage: pnpm test:auth:(off|on)");
  process.exit(1);
}

const envFile = mode === "on" ? ".env.on.local" : ".env.local";
const envPath = resolve(rootDir, envFile);

if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
} else if (mode === "on") {
  console.error(`Missing ${envFile}. Create it with test Clerk keys before running auth-on smoke tests.`);
  process.exit(1);
}

process.env.AUTH_MODE = mode;

if (mode === "on") {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  const secretKey = process.env.CLERK_SECRET_KEY ?? "";
  if (!publishableKey.startsWith("pk_")) {
    console.error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with 'pk_' for auth-on smoke tests.");
    process.exit(1);
  }
  if (!secretKey) {
    console.error("CLERK_SECRET_KEY must be provided for auth-on smoke tests.");
    process.exit(1);
  }
}

const spec = mode === "on" ? "src/e2e/auth.on.spec.ts" : "src/e2e/auth.off.spec.ts";

const result = spawnSync(
  "pnpm",
  ["--filter", "@rv/web", "exec", "playwright", "test", spec],
  {
    cwd: rootDir,
    stdio: "inherit",
    env: { ...process.env },
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
