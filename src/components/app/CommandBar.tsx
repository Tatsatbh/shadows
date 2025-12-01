import { Button, buttonVariants } from "@/components/ui/button"
import { Mic, MicOff, PhoneOff, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEditorStore } from "@/store"
import { useTranscript } from "@/app/contexts/TranscriptContext"
import { useParams } from "next/navigation"
import { useState } from "react"

type CommandBarProps = {
  testResults?: Array<{
    status: 'pending' | 'passed' | 'failed' | 'running';
    actualOutput?: string;
    stderr?: string;
    compileOutput?: string;
  }>;
}

export default function CommandBar({ testResults }: CommandBarProps) {
  const { micStatus, toggleMic, code, language } = useEditorStore()
  const { transcriptItems } = useTranscript()
  const params = useParams()
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const handleHangUp = async () => {
    setIsGeneratingReport(true)
    
    try {
      // Get sessionId from URL params
      const sessionId = params.sessionId as string
      
      // Format transcript - only keep role and message content
      const transcript = transcriptItems
        .filter(item => item.type === "MESSAGE" && !item.isHidden)
        .map(item => `${item.role}: ${item.title}`)
        .join("\n")
      
      console.log('=== Sending to Report API ===');
      console.log('Session ID:', sessionId);
      console.log('Transcript length:', transcript.length, 'chars');
      console.log('Transcript items count:', transcriptItems.filter(item => item.type === "MESSAGE" && !item.isHidden).length);
      console.log('First 500 chars:', transcript.slice(0, 500));
      console.log('=============================');
      
      // Calculate session duration
      const startTime = transcriptItems[0]?.createdAtMs || Date.now()
      const endTime = Date.now()
      const durationMs = endTime - startTime
      const durationMinutes = Math.floor(durationMs / 60000)
      const durationSeconds = Math.floor((durationMs % 60000) / 1000)
      
      // Send to report endpoint
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          transcript,
          code,
          questionUri: params.name as string,
          testResults: testResults || [],
          metadata: {
            questionUri: params.name as string,
            language,
            duration: `${durationMinutes}m ${durationSeconds}s`,
          }
        })
      })
      
      if (!response.ok) {
        console.error('Failed to generate report:', await response.text())
      } else {
        const result = await response.json()
        console.log('Report generated:', result)
        // Navigate to report page
        window.location.href = `/report/${sessionId}`
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  return (
    <div className="w-full h-12 flex items-center justify-center bg-[#F0F0F0] text-foreground">
      <div className="flex flex-row gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isGeneratingReport}>
              Hang Up <PhoneOff />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to end the interview? This will end the interview and generate your evaluation report.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className={buttonVariants({ variant: "destructive" })}
                onClick={handleHangUp}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? "Generating Report..." : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="relative">
          <Button 
            variant={micStatus === "ENABLED" ? "outline" : "destructive"} 
            onClick={toggleMic}
            disabled={micStatus === "RESTRICTED"}
          >
            {micStatus === "ENABLED" ? <Mic /> : <MicOff/>}
          </Button>
          {micStatus === "RESTRICTED" && (
            <AlertCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-red-500 fill-red-100" />
          )}
        </div>
        </div>
    </div>
  )
}
