import { createClient } from './supabase/client'

export const fetchQuestionByUri = async (uri: string) => {
  const supabase = createClient()
  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select('*')
    .eq('question_uri', uri)
    .single()

  if (questionError) throw new Error(questionError.message)

  const { data: starterCodes } = await supabase
    .from('starter_codes')
    .select('language, code')
    .eq('question_id', question.id)

  const { data: testCases } = await supabase
    .from('test_cases')
    .select('input, expected_output, hidden')
    .eq('question_id', question.id)

  return {
    ...question,
    starter_codes: starterCodes || [],
    test_cases: testCases || []
  }
}

export const fetchStarterCode = async (language: string, uri: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('starter_codes')
    .select(`
    code,
    main,
    imports,
    language,
    questions!inner (
      question_uri
    )
  `)
    .eq('language', language)
    .eq('questions.question_uri', uri)
    .maybeSingle()

  if (error || !data) throw new Error('Starter code not found')
  return data
}

export const fetchProblems = async () => {
  const supabase = createClient()
  const { data: problems, error } = await supabase
    .from('questions')
    .select('id, question_number, title, difficulty, summary, question_uri')
    .order('question_number', { ascending: true })

  if (error) throw error
  return problems
}

export const fetchTestCasesMetadata = async (questionUri: string) => {
  const supabase = createClient()
  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select('id')
    .eq('question_uri', questionUri)
    .single()

  if (questionError) throw new Error(questionError.message)

  // RLS now restricts this table to hidden = false for clients, so the hidden
  // inputs and expected outputs never reach the browser at all. Filtering them
  // out here (as this used to) only hid them from the UI, not from anyone
  // reading the REST API with the anon key.
  const { data: visible, error: visibleError } = await supabase
    .from('test_cases')
    .select('id, input, expected_output')
    .eq('question_id', question.id)
    .order('created_at', { ascending: true })

  if (visibleError) throw new Error(visibleError.message)

  // The panel still renders a lock placeholder per hidden case, so it needs the
  // counts without the contents. This RPC is SECURITY DEFINER and returns only
  // aggregates.
  const { data: counts, error: countsError } = await supabase
    .rpc('question_test_case_counts', { p_question_uri: questionUri })
    .single()

  if (countsError) throw new Error(countsError.message)

  const totalCount = counts?.total_count ?? visible?.length ?? 0
  const hiddenCount = counts?.hidden_count ?? 0

  return {
    visibleTestCases: (visible || []).map(tc => ({
      id: tc.id,
      input: tc.input,
      expected_output: tc.expected_output
    })),
    // Placeholder ids: the rows are not readable, and the panel only needs a
    // stable key per locked row.
    hiddenTestCases: Array.from({ length: hiddenCount }, (_, i) => ({
      id: `hidden-${i}`,
    })),
    totalCount,
    hiddenCount
  }
}

export const fetchAllSessions = async (userId: string) => {
  const supabase = createClient()
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select(`
      id,
      status,
      started_at,
      ended_at,
      questions (
        question_number,
        title,
        difficulty
      )
    `)
    .eq('user_id', userId)
    .order('started_at', { ascending: false })

  if (error) throw error
  return sessions
}

export const fetchUserCredits = async (userId: string) => {
  const supabase = createClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (error) throw error
  return profile?.credits || 0
}
