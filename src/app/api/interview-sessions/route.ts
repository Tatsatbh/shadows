import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessionId = request.nextUrl.searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
    }

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id, user_id, status, started_at, ended_at")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (sessionError || !session) {
      return NextResponse.json({ valid: false, reason: "not_found" })
    }

    // Reloading the page fires beforeunload, which beacons the session to
    // "abandoned" — there is no way to distinguish a reload from a close in
    // that event. The reloaded page then saw "abandoned" and bounced the user
    // to the dashboard, losing an interview they had already paid a credit for.
    // Treat a very recent abandonment as a reload and resume it. A real close
    // is not reopened within this window, so abandon-on-close still holds.
    const RESUME_GRACE_MS = 2 * 60 * 1000

    if (session.status === "abandoned" && session.ended_at) {
      const abandonedAgo = Date.now() - new Date(session.ended_at).getTime()

      if (abandonedAgo >= 0 && abandonedAgo <= RESUME_GRACE_MS) {
        const { data: resumed, error: resumeError } = await supabase
          .from("sessions")
          .update({ status: "in_progress", ended_at: null })
          .eq("id", sessionId)
          .eq("user_id", user.id)
          .eq("status", "abandoned")
          .select("id, user_id, status, started_at, ended_at")
          .maybeSingle()

        if (!resumeError && resumed) {
          return NextResponse.json({ valid: true, session: resumed, resumed: true })
        }
        console.error("Failed to resume session:", resumeError)
      }
    }

    return NextResponse.json({ valid: true, session })
  } catch (error) {
    console.error("Session validation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, status } = body

    if (!sessionId || !status) {
      return NextResponse.json(
        { error: "Missing sessionId or status" },
        { status: 400 }
      )
    }

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .update({
        status,
        ended_at: new Date().toISOString()
      })
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (sessionError) {
      console.error("Session update error:", sessionError)
      return NextResponse.json(
        { error: "Failed to update session" },
        { status: 500 }
      )
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Session update API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, questionUri } = body

    if (!sessionId || !questionUri) {
      return NextResponse.json(
        { error: "Missing sessionId or questionUri" },
        { status: 400 }
      )
    }

    // Scoped to the caller: without the user_id filter this returned the full
    // row of any session whose id was supplied, leaking another user's
    // transcript, final_code and scorecard. maybeSingle() rather than single()
    // so a genuinely absent session falls through to creation instead of
    // throwing.
    const { data: existingSession } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (existingSession) {
      return NextResponse.json({ session: existingSession })
    }

    const { data: question, error: questionError } = await supabase
      .from("questions")
      .select("id")
      .eq("question_uri", questionUri)
      .single()

    if (questionError || !question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      )
    }

    const { error: rpcError } = await supabase.rpc('start_session', {
      session_id: sessionId,
      user_id: user.id,
      question_id: question.id
    })

    if (rpcError) {
      console.error("Session start RPC error:", rpcError)
      return NextResponse.json(
        { error: rpcError.message || "RPC failed" },
        { status: rpcError.message === 'Insufficient credits' ? 402 : 500 }
      )
    }

    const { data: session, error: fetchError } = await supabase
      .from("sessions")
      .select()
      .eq("id", sessionId)
      .single()

    if (fetchError) {
      console.error("Failed to fetch created session:", fetchError)
      return NextResponse.json(
        { error: "Session created but failed to fetch" },
        { status: 500 }
      )
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
