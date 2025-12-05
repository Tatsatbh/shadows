import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// POST endpoint for sendBeacon to mark session as abandoned
// This endpoint is designed to work with navigator.sendBeacon which sends data as text/plain
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // sendBeacon sends data as text, so we need to parse it
    const text = await request.text()
    let sessionId: string

    try {
      const body = JSON.parse(text)
      sessionId = body.sessionId
    } catch {
      // If parsing fails, assume the text is just the sessionId
      sessionId = text
    }

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
    }

    // Update session status to abandoned
    const { error: sessionError } = await supabase
      .from("sessions")
      .update({
        status: "abandoned",
        ended_at: new Date().toISOString()
      })
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .eq("status", "in_progress") // Only abandon if still in progress

    if (sessionError) {
      console.error("Session abandon error:", sessionError)
      return NextResponse.json({ error: "Failed to abandon session" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Session abandon API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
