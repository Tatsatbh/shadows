import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabaseClient';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, transcript, code, questionUri, testResults, metadata } = body;

    // Log incoming request for debugging
    console.log('=== Report API Request ===');
    console.log('sessionId:', sessionId);
    console.log('questionUri:', questionUri);
    console.log('transcript type:', typeof transcript);
    console.log('transcript value:', transcript === undefined ? 'undefined' : transcript === null ? 'null' : `"${transcript.slice(0, 100)}..."`);
    console.log('========================');

    if (!sessionId || transcript === undefined || transcript === null || !questionUri) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, transcript, and questionUri' },
        { status: 400 }
      );
    }

    // Fetch question details and test cases from Supabase
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

    // Fetch all test cases in order
    const { data: testCases, error: testCasesError } = await supabase
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

    // Match test results with test case details
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

    // Calculate pass/fail statistics
    const totalTests = enrichedTestResults.length;
    const passedTests = enrichedTestResults.filter(t => t.status === 'passed').length;
    const failedTests = enrichedTestResults.filter(t => t.status === 'failed').length;

    // Fetch all submissions for this session to analyze diffs
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('id, code, created_at, result_json')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (submissionsError) {
      console.error('Failed to fetch submissions:', submissionsError);
    }

    // Build submission timeline with diffs for AI analysis
    const subs = submissions || [];
    const submissionTimeline = subs.map((sub, i) => {
      const prevCode = i > 0 ? subs[i - 1].code : null;
      const testsPassed = sub.result_json?.submissions?.filter((r: any) => r.status?.id === 3).length || 0;
      const totalTestsInSub = sub.result_json?.submissions?.length || 0;
      return {
        submissionNumber: i + 1,
        timestamp: sub.created_at,
        testsPassed: `${testsPassed}/${totalTestsInSub}`,
        code: sub.code,
        diff: prevCode ? `Changed from previous submission` : 'Initial submission',
      };
    }).slice(-5); // Only include last 5 submissions to save tokens

    // Log all content lengths for debugging
    console.log('=== Content Stats ===');
    console.log('Transcript length:', transcript.length, 'chars');
    console.log('Code length:', code?.length || 0, 'chars');
    console.log('Question description length:', question.description_md?.length || 0, 'chars');
    console.log('Test results JSON length:', JSON.stringify(enrichedTestResults).length, 'chars');
    console.log('=====================');
    
    // Truncate transcript if needed
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
3. Communication (1-5): How clearly did they explain their thinking?
4. Debugging (1-5): How effectively did they identify and fix issues?

For each dimension, provide:
- A score (1-5)
- Specific evidence from the transcript or code (with timestamps if relevant)
- Brief reasoning

Finally, provide an overall recommendation: "Strong Hire", "Hire", "Maybe", or "No Hire"

Submission Timeline (${submissionTimeline.length} submissions):
${submissionTimeline.map((s, i) => 
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

    // Call OpenAI with reasoning enabled
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

    const scorecard = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Log the OpenAI response for debugging
    console.log('=== OpenAI gpt-5-mini Evaluation Response ===');
    console.log(JSON.stringify(scorecard, null, 2));
    console.log('=========================================');

    // Update session status to completed and store final data
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        final_code: code,
        transcript: { items: transcript },
        events: { scorecard, testResults: enrichedTestResults }
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Failed to update session:', updateError);
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
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
