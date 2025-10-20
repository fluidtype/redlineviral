// Client-safe env: only NEXT_PUBLIC_* keys, provided via packages/shared env.publicEnv
import { publicEnv } from "@shared/env";

export const clientEnv = publicEnv;
// Usage example elsewhere: clientEnv.NEXT_PUBLIC_POSTHOG_KEY
