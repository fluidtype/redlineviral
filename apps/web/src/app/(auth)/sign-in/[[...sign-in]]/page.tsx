'use client';
import dynamic from "next/dynamic";
import { authDisabledReason, isAuthEnabled } from "../../../../lib/authToggle";

const SignInComponent = dynamic(() => import("@clerk/nextjs").then(mod => mod.SignIn), {
  ssr: false,
});

export default function Page() {
  const enabled = isAuthEnabled();

  if (!enabled) {
    return (
      <div
        className="flex min-h-screen items-center justify-center p-6 text-center text-sm text-neutral-600"
        data-testid="auth-disabled-placeholder"
      >
        <p>Auth disabled in this environment. {authDisabledReason()}</p>
      </div>
    );
  }

  return (
    <div data-testid="clerk-sign-in">
      <SignInComponent />
    </div>
  );
}
