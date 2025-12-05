'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { useAuthInit } from '@/hooks/useAuthInit'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInit()
  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
