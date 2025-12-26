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
      .select("id, user_id, status, started_at")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ valid: false, reason: "not_found" })
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

    const { data: existingSession } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single()

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
