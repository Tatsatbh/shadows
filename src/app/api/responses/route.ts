import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

// Proxy endpoint for the OpenAI Responses API.
//
// This route spends the server's OPENAI_API_KEY, so it is deliberately narrow:
// it requires an authenticated user, and it does NOT forward the caller's body
// verbatim. Only `input` and the structured-output format are taken from the
// request; the model and token ceiling are fixed here. Previously the whole
// body was spread into the OpenAI call, which let any anonymous caller choose
// the model and prompt and bill this account.

const MODEL = 'gpt-4o-mini';
const MAX_OUTPUT_TOKENS = 2048;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  if (body?.input === undefined || body?.input === null) {
    return NextResponse.json({ error: 'Missing required field: input' }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const request = {
    model: MODEL,
    input: body.input,
    max_output_tokens: MAX_OUTPUT_TOKENS,
    stream: false as const,
  };

  if (body.text?.format?.type === 'json_schema') {
    return await structuredResponse(openai, { ...request, text: body.text });
  }
  return await textResponse(openai, request);
}

async function structuredResponse(openai: OpenAI, request: any) {
  try {
    const response = await openai.responses.parse(request);
    return NextResponse.json(response);
  } catch (err: any) {
    console.error('responses proxy error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

async function textResponse(openai: OpenAI, request: any) {
  try {
    const response = await openai.responses.create(request);
    return NextResponse.json(response);
  } catch (err: any) {
    console.error('responses proxy error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
