'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { useAuthInit } from '@/hooks/useAuthInit'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInit()
  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
