import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { authEnabled } from "../../../../lib/authToggle";

export async function POST(req: NextRequest) {
  if (!authEnabled) {
    return new Response(null, { status: 204 });
  }

  const [{ verifyWebhook }, { env }] = await Promise.all([
    import("@clerk/nextjs/webhooks"),
    import("@rv/shared"),
  ]);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    const evt = await verifyWebhook(req, {
      signingSecret: env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const user = evt.data as {
        id: string;
        email_addresses?: { email_address?: string | null }[];
      };
      const email = user.email_addresses?.[0]?.email_address ?? "";

      await supabase.from("profiles").upsert({
        id: user.id,
        email,
        niche: [],
        region: null,
      });
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Webhook error", { status: 400 });
  }
}
