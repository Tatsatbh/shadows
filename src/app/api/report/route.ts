import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Grading reasons at high effort over as much as 80k characters of transcript,
// which routinely runs past the default serverless timeout and killed the
// request mid-call, after the model had already been paid for.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, transcript, code, questionUri, testResults, metadata } = body;

    if (!sessionId || transcript === undefined || transcript === null || !questionUri) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, transcript, and questionUri' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // This route grades a session with a paid model and writes the result back.
    // It previously ran for anonymous callers on any sessionId, which both billed
    // this account on demand and returned another user's submitted code in the
    // response. Require a signed-in user who owns the session.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: ownedSession, error: ownedSessionError } = await supabase
      .from('sessions')
      .select('id, status, events')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (ownedSessionError) {
      console.error('Failed to verify session ownership:', ownedSessionError);
      return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
    }

    if (!ownedSession) {
      // Same response whether the session is absent or owned by someone else, so
      // this cannot be used to probe for valid session ids.
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // events is jsonb, so the generated types give back Json. Narrow it to the
    // shape this route writes when it finishes grading a session.
    const storedEvents = ownedSession.events as {
      scorecard?: unknown;
      testResults?: Array<{ status?: string }>;
    } | null;
    const storedScorecard = storedEvents?.scorecard;

    // Every call here is a paid, high-effort model call, and nothing stopped a
    // signed-in caller from re-posting the same session in a loop and running up
    // the bill. Grading is now once per session: if a scorecard was already saved
    // we replay it verbatim instead of asking the model again. The stored test
    // results are written in the same update as the scorecard, so the counts below
    // come from that record rather than from a re-run.
    if (ownedSession.status === 'completed' && storedScorecard) {
      const savedTestResults = storedEvents?.testResults;
      const replayedTests = Array.isArray(savedTestResults) ? savedTestResults : [];

      return NextResponse.json({
        success: true,
        sessionId,
        scorecard: storedScorecard,
        testSummary: {
          total: replayedTests.length,
          passed: replayedTests.filter(t => t?.status === 'passed').length,
          failed: replayedTests.filter(t => t?.status === 'failed').length,
        },
      });
    }

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('id, title, description_md, difficulty')
      .eq('question_uri', questionUri)
      .single();

    if (questionError || !question) {
      return NextResponse.json(
        { error: 'Question not found', details: questionError?.message },
        { status: 404 }
      );
    }

    // Service role: hidden cases are not client-readable, but grading needs them.
    // Their inputs are masked to '[Hidden]' before anything reaches the model.
    const { data: testCases, error: testCasesError } = await supabaseAdmin()
      .from('test_cases')
      .select('id, input, expected_output, hidden')
      .eq('question_id', question.id)
      .order('created_at', { ascending: true });

    if (testCasesError) {
      return NextResponse.json(
        { error: 'Failed to fetch test cases', details: testCasesError.message },
        { status: 500 }
      );
    }

    const enrichedTestResults = (testCases || []).map((tc, idx) => {
      const result = testResults?.[idx];
      return {
        testCaseNumber: idx + 1,
        input: tc.hidden ? '[Hidden]' : tc.input,
        expectedOutput: tc.hidden ? '[Hidden]' : tc.expected_output,
        hidden: tc.hidden,
        status: result?.status || 'not_run',
        actualOutput: result?.actualOutput,
        stderr: result?.stderr,
        compileOutput: result?.compileOutput,
      };
    });

    const totalTests = enrichedTestResults.length;
    const passedTests = enrichedTestResults.filter(t => t.status === 'passed').length;
    const failedTests = enrichedTestResults.filter(t => t.status === 'failed').length;

    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('id, code, created_at, result_json')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (submissionsError) {
      console.error('Failed to fetch submissions:', submissionsError);
    }

    const subs = submissions || [];
    const submissionTimeline = subs.map((sub, i) => {
      // result_json is jsonb, so the generated types give back Json. Narrow it to
      // the Judge0 batch shape this code actually expects.
      const resultJson = sub.result_json as {
        submissions?: Array<{ status?: { id?: number } }>
      } | null;
      const testsPassed = resultJson?.submissions?.filter((r) => r.status?.id === 3).length || 0;
      const totalTestsInSub = resultJson?.submissions?.length || 0;
      return {
        submissionNumber: i + 1,
        timestamp: sub.created_at,
        testsPassed: `${testsPassed}/${totalTestsInSub}`,
        code: sub.code,
      };
    }).slice(-5);

    const MAX_TRANSCRIPT_CHARS = 80000;
    let truncatedTranscript = transcript;
    if (transcript.length > MAX_TRANSCRIPT_CHARS) {
      const halfMax = MAX_TRANSCRIPT_CHARS / 2;
      truncatedTranscript = 
        transcript.slice(0, halfMax) + 
        '\n\n[... transcript truncated ...]\n\n' + 
        transcript.slice(-halfMax);
    }

    const evaluationPrompt = `You are an expert technical interviewer evaluating a coding interview session.

Session Details:
- Question: ${question.title}
- Difficulty: ${question.difficulty}
- Language: ${metadata?.language || 'N/A'}
- Duration: ${metadata?.duration || 'N/A'}

Question Description:
${question.description_md}

Transcript:
${truncatedTranscript}

Final Code:
\`\`\`${metadata?.language || ''}
${code || 'No code submitted'}
\`\`\`

Test Results Summary:
- Total Tests: ${totalTests}
- Passed: ${passedTests}
- Failed: ${failedTests}

Detailed Test Results:
${enrichedTestResults.map((t, i) => 
  `Test ${i + 1}: ${t.status}${t.status === 'failed' ? ` (Expected: ${t.expectedOutput?.slice(0, 100)}, Got: ${t.actualOutput?.slice(0, 100)})` : ''}`
).join('\n')}

Please evaluate this candidate across the following dimensions and provide a structured scorecard:

1. Problem Solving (1-5): How well did they understand and approach the problem?
2. Code Quality (1-5): Is the code clean, readable, and well-structured?
3. Communication (1-5): How clearly did they explain their thinking? Pay special attention to:
   - Clarity and articulation of their approach
   - Ability to explain reasoning step-by-step
   - Responsiveness to interviewer questions
   - Abnormally long silent pauses (gaps of 30+ seconds without speaking) - these indicate difficulty thinking through the problem or lack of communication
   - Frequency and duration of hesitations or "umms" and "ahhs"
4. Debugging (1-5): How effectively did they identify and fix issues?

For each dimension, provide:
- A score (1-5)
- Specific evidence from the transcript or code (with timestamps if relevant)
- Brief reasoning

Finally, provide an overall recommendation: "Strong Hire", "Hire", "Maybe", or "No Hire"

Submission Timeline (${submissionTimeline.length} submissions):
${submissionTimeline.map((s) => 
  `--- Submission #${s.submissionNumber} (${s.testsPassed} tests passed) ---\n\`\`\`\n${s.code.slice(0, 1500)}\n\`\`\``
).join('\n\n')}

For each submission, provide a brief comment on what changed and why (debugging insight, optimization, bug fix, etc).

Return your response as a JSON object with this structure:
{
  "dimensions": {
    "problemSolving": { "score": number, "evidence": string, "reasoning": string },
    "codeQuality": { "score": number, "evidence": string, "reasoning": string },
    "communication": { "score": number, "evidence": string, "reasoning": string },
    "debugging": { "score": number, "evidence": string, "reasoning": string }
  },
  "overallRecommendation": string,
  "summary": string,
  "submissionComments": [{ "submissionNumber": number, "comment": string }]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'user',
          content: evaluationPrompt,
        },
      ],
      reasoning_effort: 'high',
      response_format: { type: 'json_object' },
    });

    // This used to index choices[0] blindly and parse whatever came back. A
    // filtered or truncated response has no choice at all, and a response that
    // stops mid-object is not valid JSON, so both threw here and surfaced as an
    // unhandled 500 with no explanation for the client.
    const rawScorecard = completion.choices[0]?.message?.content;

    if (!rawScorecard) {
      console.error('Grading model returned no content for session:', sessionId);
      return NextResponse.json(
        { error: 'Failed to generate report', details: 'The grading model returned no content' },
        { status: 502 }
      );
    }

    let scorecard;
    try {
      scorecard = JSON.parse(rawScorecard);
    } catch (parseError) {
      console.error('Failed to parse scorecard JSON:', parseError);
      return NextResponse.json(
        { error: 'Failed to generate report', details: 'The grading model returned malformed JSON' },
        { status: 502 }
      );
    }

    // Service role: the scorecard is deliberately not user-writable, so signed-in
    // callers cannot update these columns and forge a report. Ownership of this
    // session was already verified above, so writing here is scoped to the caller.
    const { error: updateError } = await supabaseAdmin()
      .from('sessions')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        final_code: code,
        transcript: { items: transcript },
        events: { scorecard, testResults: enrichedTestResults }
      })
      .eq('id', sessionId);

    // A failed write used to fall through to success: true, so the client showed a
    // scorecard that was never persisted and was lost on reload.
    if (updateError) {
      console.error('Failed to update session:', updateError);
      return NextResponse.json(
        { error: 'Failed to save report', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId,
      scorecard,
      testSummary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
      },
    });
  } catch (error) {
    // Nothing in here was wrapped, so an OpenAI outage, a rate limit or a
    // dropped connection escaped as an unhandled Next.js 500 with no log and no
    // JSON body the client could show.
    console.error('Failed to generate report:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate report',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
