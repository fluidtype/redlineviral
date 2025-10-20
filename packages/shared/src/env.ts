// packages/shared/src/env.ts
import { z } from "zod";

const clerkSchema = z.object({
  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),
});

const baseSchema = z.object({
  AUTH_MODE: z.enum(["on", "off"]).default("off"),
  // Core
  DATABASE_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // AI / Storage
  OPENAI_API_KEY: z.string().min(1),
  GROK_API_KEY: z.string().min(1),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),

  // Redis / Queue
  REDIS_URL: z.string().url(),
  BULLMQ_PREFIX: z.string().min(1),

  // Security
  TURNSTILE_SITE_KEY: z.string().min(1),
  TURNSTILE_SECRET: z.string().min(1),
  WORKER_JWT_SECRET: z.string().min(32),

  // Analytics / Email / Logs
  RESEND_API_KEY: z.string().min(1),
  SENTRY_DSN: z.string().url().optional(),
  POSTHOG_API_KEY: z.string().min(1),

  // Optional
  STRIPE_KEY: z.string().min(1).optional(),
});

type BaseEnv = z.infer<typeof baseSchema>;
type ClerkEnv = z.infer<typeof clerkSchema>;
type ServerEnv = BaseEnv & Partial<ClerkEnv>;

// Anything starting with NEXT_PUBLIC_ is considered public at runtime (client-side).
const publicPrefix = "NEXT_PUBLIC_";

function raiseEnvError(message: string): never {
  const err = new Error(`[ENV_INVALID] ${message}`);
  // add a code for programmatic checks
  // @ts-expect-error augment
  err.code = "ENV_INVALID";
  throw err;
}

function parseEnv() {
  const baseResult = baseSchema.safeParse(process.env);
  if (!baseResult.success) {
    const issues = baseResult.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ");
    raiseEnvError(issues);
  }

  const baseEnv = baseResult.data;

  const clerkCandidate = {
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
  } satisfies Partial<ClerkEnv>;

  let clerkEnv: Partial<ClerkEnv> = clerkCandidate;

  if (baseEnv.AUTH_MODE === "on") {
    const clerkResult = clerkSchema.safeParse(clerkCandidate);
    if (!clerkResult.success) {
      const issues = clerkResult.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ");
      raiseEnvError(issues);
    }
    clerkEnv = clerkResult.data;
  }

  const serverEnv: ServerEnv = {
    ...baseEnv,
    ...clerkEnv,
  };

  // Compute public env subset (do not add secrets here!)
  const publicEntries = Object.entries(process.env)
    .filter(([k]) => k.startsWith(publicPrefix))
    .map(([k, v]) => [k, v ?? ""]);
  const publicEnv = Object.fromEntries(publicEntries) as Record<string, string>;

  return { serverEnv, publicEnv };
}

export function assertEnv() {
  // Will throw on invalid
  return parseEnv();
}

const { serverEnv, publicEnv } = assertEnv();

// Primary exports
export const env = serverEnv;
export { serverEnv, publicEnv };

export const isAuthEnabled = () => env.AUTH_MODE === "on";

// Tiny helper to require a key at use-site (defensive)
export function requireKey<K extends keyof typeof env>(key: K): (typeof env)[K] {
  const v = env[key];
  if (v === undefined || v === null || v === "") {
    const err = new Error(`[ENV_MISSING] ${String(key)} is required`);
    // @ts-expect-error augment
    err.code = "ENV_MISSING";
    throw err;
  }
  return v;
}
