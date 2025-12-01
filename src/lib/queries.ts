import { supabase } from './supabaseClient'

export const fetchQuestionByUri = async (uri: string) => {
  // First fetch the question
  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select('*')
    .eq('question_uri', uri)
    .single()

  if (questionError) throw new Error(questionError.message)

  // Then fetch related data separately
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
  const { data: problems, error } = await supabase
    .from('questions')
    .select('id, question_number, title, difficulty, summary, question_uri')
    .order('question_number', { ascending: true })
  
  if (error) throw error
  return problems
}

export const fetchTestCasesMetadata = async (questionUri: string) => {
  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select('id')
    .eq('question_uri', questionUri)
    .single()

  if (questionError) throw new Error(questionError.message)

  // Fetch ALL test cases with their IDs and hidden status
  const { data: allTestCases, error: allError } = await supabase
    .from('test_cases')
    .select('id, input, expected_output, hidden')
    .eq('question_id', question.id)
    .order('created_at', { ascending: true })

  if (allError) throw new Error(allError.message)

  const visibleTestCases = (allTestCases || []).filter(tc => !tc.hidden)
  const hiddenTestCases = (allTestCases || []).filter(tc => tc.hidden)

  return {
    visibleTestCases: visibleTestCases.map(tc => ({
      id: tc.id,
      input: tc.input,
      expected_output: tc.expected_output
    })),
    hiddenTestCases: hiddenTestCases.map(tc => ({
      id: tc.id,
      // Don't send input/output to frontend for hidden cases
    })),
    totalCount: allTestCases?.length || 0,
    hiddenCount: hiddenTestCases.length
  }
}

export const fetchRecentSessions = async (userId: string, limit: number = 10) => {
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
    .limit(limit)
  
  if (error) throw error
  return sessions
}
