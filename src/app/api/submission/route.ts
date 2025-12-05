import { createClient } from '@/lib/supabase/server'

interface SubmissionRequest {
    judgeId: number
    code: string
    questionUri: string
    sessionId: string
    timestamp?: number
}

function toBase64(str: string): string {
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
}

export async function POST(request: Request) {
    try {
        const req: SubmissionRequest = await request.json()
        
        if (!req.judgeId || !req.code || !req.questionUri || !req.sessionId) {
            return Response.json({ error: "Missing required fields" }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: question, error: questionError } = await supabase
            .from('questions')
            .select('id')
            .eq('question_uri', req.questionUri)
            .single()

        if (questionError || !question) {
            return Response.json({ error: "Question not found" }, { status: 404 })
        }

        const { data: testCases, error: testCasesError } = await supabase
            .from('test_cases')
            .select('input, expected_output, hidden')
            .eq('question_id', question.id)
            .order('created_at', { ascending: true })

        if (testCasesError || !testCases || testCases.length === 0) {
            return Response.json({ error: "No test cases found" }, { status: 404 })
        }

        const res = await fetch(
            "https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=true",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key": process.env.JUDGE0_API_KEY!,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                },
                body: JSON.stringify({
                    submissions: testCases.map(testCase => ({
                        language_id: req.judgeId,
                        source_code: toBase64(req.code),
                        stdin: toBase64(testCase.input),
                        expected_output: toBase64(testCase.expected_output),
                        cpu_time_limit: 2.0
                    }))
                })
            }
        )

        if (!res.ok) {
            return Response.json({ error: "Judge0 failed" }, { status: res.status })
        }

        const data = await res.json()
        
        return Response.json({ 
            tokens: data.map((sub: any) => sub.token),
            testCaseCount: testCases.length,
            questionId: question.id,
            sessionId: req.sessionId,
            code: req.code
        })

    } catch (error) {
        console.error("Submission error:", error)
        return Response.json({ error: "Internal error" }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url)
        const tokens = url.searchParams.get('tokens')
        const sessionId = url.searchParams.get('sessionId')
        const questionId = url.searchParams.get('questionId')
        const code = url.searchParams.get('code')
        const language = url.searchParams.get('language')
        const timestamp = url.searchParams.get('timestamp')
        
        if (!tokens) {
            return Response.json({ error: "Missing tokens" }, { status: 400 })
        }

        const supabase = await createClient()
        const res = await fetch(
            `https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=${tokens}&base64_encoded=true`,
            {
                headers: {
                    "X-RapidAPI-Key": process.env.JUDGE0_API_KEY!,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                }
            }
        )

        if (!res.ok) {
            return Response.json({ error: "Judge0 failed" }, { status: res.status })
        }

        const judgeResponse = await res.json()
        
        if (sessionId && questionId && code && language) {
            const allDone = judgeResponse.submissions.every((sub: any) => sub.status.id > 2)
            
            if (allDone) {
                const { data: { user } } = await supabase.auth.getUser()
                
                const MAX_ERROR_LENGTH = 500
                const decodedSubmissions = judgeResponse.submissions.map((sub: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { compile_output: _compileOutput, ...rest } = sub
                    
                    // Decode stderr and truncate if too long to save LLM tokens
                    const decodedStderr = sub.stderr ? Buffer.from(sub.stderr, 'base64').toString('utf-8') : null
                    const truncatedStderr = decodedStderr && decodedStderr.length > MAX_ERROR_LENGTH
                        ? decodedStderr.slice(0, MAX_ERROR_LENGTH) + "\n\n...[truncated to save tokens]"
                        : decodedStderr
                    
                    return {
                        ...rest,
                        stdout: sub.stdout ? Buffer.from(sub.stdout, 'base64').toString('utf-8') : null,
                        stderr: truncatedStderr,
                        message: sub.message ? Buffer.from(sub.message, 'base64').toString('utf-8') : null,
                    }
                })
                
                // Store the decoded response in result_json
                const { error: insertError } = await supabase.from('submissions').insert({
                    user_id: user?.id,
                    question_id: questionId,
                    session_id: sessionId,
                    language,
                    code,
                    timestamp: timestamp ? parseInt(timestamp) : null,
                    result_json: {
                        ...judgeResponse,
                        submissions: decodedSubmissions
                    }
                })

                if (insertError) {
                    console.error('Failed to save submission:', insertError)
                }
            }
        }

        return Response.json(judgeResponse)

    } catch (error) {
        console.error("Results error:", error)
        return Response.json({ error: "Internal error" }, { status: 500 })
    }
}
