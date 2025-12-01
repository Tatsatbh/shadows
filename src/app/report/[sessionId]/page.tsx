"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ReportPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', sessionId)
          .single()

        if (error) {
          setError(error.message)
        } else {
          setSessionData(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading report...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Interview Report</h1>
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Session ID: {sessionId}</h2>
          <pre className="bg-muted p-4 rounded overflow-auto max-h-[80vh] text-sm">
            {JSON.stringify(sessionData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
