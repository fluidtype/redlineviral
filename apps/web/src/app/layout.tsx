'use client';
import "./globals.css";
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { authEnabled, reasonIfDisabled } from "../lib/authToggle";

const isDev = process.env.NODE_ENV !== "production";

export default function RootLayout({ children }: { children: ReactNode }) {
  const layout = (
    <html lang="en">
      <body className="min-h-screen antialiased bg-white text-neutral-900">
        {!authEnabled && isDev ? (
          <div className="bg-amber-100 px-4 py-2 text-sm text-amber-900">
            Auth disabled: {reasonIfDisabled}
          </div>
        ) : null}
        {children}
      </body>
    </html>
  );

  if (!authEnabled) {
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
