'use client';
import "./globals.css";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { authDisabledReason, isAuthEnabled } from "../lib/authToggle";

const ClerkProvider = dynamic(() => import("@clerk/nextjs").then(mod => mod.ClerkProvider), {
  ssr: false,
});

const isDev = process.env.NODE_ENV !== "production";

export default function RootLayout({ children }: { children: ReactNode }) {
  const enabled = isAuthEnabled();
  const reason = authDisabledReason();

  const layout = (
    <html lang="en">
      <body
        className="min-h-screen antialiased bg-white text-neutral-900"
        data-auth-mode={enabled ? "on" : "off"}
      >
        {!enabled && isDev ? (
          <div
            className="bg-amber-100 px-4 py-2 text-sm text-amber-900"
            data-testid="auth-disabled-banner"
          >
            Auth disabled: {reason}
          </div>
        ) : null}
        {children}
      </body>
    </html>
  );

  if (!enabled) {
    return layout;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/app"
      afterSignUpUrl="/app"
    >
      {layout}
    </ClerkProvider>
  );
}
