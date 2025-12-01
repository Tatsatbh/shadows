import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

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

    // Update session status
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

    // Get question_id from question_uri
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

    // Create session (or ignore if already exists)
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .upsert({
        id: sessionId,
        user_id: user.id,
        question_id: question.id,
        status: "in_progress",
      }, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (sessionError) {
      console.error("Session creation error:", sessionError)
      console.error("Session error details:", JSON.stringify(sessionError, null, 2))
      return NextResponse.json(
        { error: "Failed to create session", details: sessionError.message },
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
