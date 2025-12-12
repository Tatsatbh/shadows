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
    })),
    totalCount: allTestCases?.length || 0,
    hiddenCount: hiddenTestCases.length
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
