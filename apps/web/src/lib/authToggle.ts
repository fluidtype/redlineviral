const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const secretKey = process.env.CLERK_SECRET_KEY ?? "";

export const authEnabled = publishableKey.startsWith("pk_") && secretKey.length > 0;

let reason = "";
if (!publishableKey) {
  reason = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set";
} else if (!publishableKey.startsWith("pk_")) {
  reason = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with \"pk_\"";
}
if (!secretKey) {
  reason = reason ? `${reason}; CLERK_SECRET_KEY is not set` : "CLERK_SECRET_KEY is not set";
}

export const reasonIfDisabled = authEnabled ? "" : reason || "Clerk environment variables are not configured.";
