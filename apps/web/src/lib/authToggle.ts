const rawMode = (process.env.AUTH_MODE ?? "auto").trim().toLowerCase();
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const secretKey = process.env.CLERK_SECRET_KEY ?? "";

const hasKeys = publishableKey.startsWith("pk_") && secretKey.trim().length > 0;
const explicitlyOff = rawMode === "off";
const enabled = !explicitlyOff && hasKeys;

function computeReason() {
  if (enabled) return "";
  if (explicitlyOff) {
    return "AUTH_MODE=off";
  }
  const issues: string[] = [];
  if (!publishableKey) {
    issues.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
  } else if (!publishableKey.startsWith("pk_")) {
    issues.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with \"pk_\"");
  }
  if (!secretKey.trim()) {
    issues.push("CLERK_SECRET_KEY is not set");
  }
  return issues.join("; ") || "Clerk environment variables are not configured.";
}

const reason = computeReason();

export function isAuthEnabled(): boolean {
  return enabled;
}

export function authDisabledReason(): string {
  return reason;
}

export function authMode(): "auto" | "on" | "off" {
  if (rawMode === "on") return "on";
  if (rawMode === "off") return "off";
  return "auto";
}
