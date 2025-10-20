// Client-safe: Next inlines ONLY NEXT_PUBLIC_* at build time.
// Do NOT import server-side env loader here.
export const clientEnv = {
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ""
} as const;
