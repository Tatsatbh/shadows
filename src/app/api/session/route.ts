import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Mints an ephemeral OpenAI Realtime client secret.
//
// This spends the server's OPENAI_API_KEY and grants live audio minutes, so it
// requires an authenticated user. It was previously open to anonymous callers,
// which made unlimited free realtime sessions obtainable against this account.
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            model: "gpt-realtime-2",
            type: "realtime",
            reasoning: {
              effort: "low",
            },
          }
        }),
      }
    );

    // Previously the OpenAI body was returned as-is even on failure, so the
    // client received an error object where it expected a client secret and
    // failed later with a confusing message.
    if (!response.ok) {
      const detail = await response.text();
      console.error("Failed to mint realtime client secret:", response.status, detail);
      return NextResponse.json(
        { error: "Failed to create realtime session" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ client_secret: data });
  } catch (error) {
    console.error("Error in /session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
