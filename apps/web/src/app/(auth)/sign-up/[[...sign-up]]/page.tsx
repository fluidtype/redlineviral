'use client';
import dynamic from "next/dynamic";
import { authEnabled, reasonIfDisabled } from "../../../../lib/authToggle";

const SignUpComponent = dynamic(() => import("@clerk/nextjs").then(mod => mod.SignUp), {
  ssr: false,
});

export default function Page() {
  if (!authEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center text-sm text-neutral-600">
        <p>Auth disabled in this environment. {reasonIfDisabled}</p>
      </div>
    );
  }

  return <SignUpComponent />;
}
