import { isAuthEnabled } from "@shared/env";

export const authEnabled = isAuthEnabled();

export const reasonIfDisabled = authEnabled
  ? ""
  : "Clerk authentication disabled (set AUTH_MODE=on to enable).";
