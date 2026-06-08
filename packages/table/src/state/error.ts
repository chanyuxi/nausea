import type { ReactNode } from 'react'

export interface TableErrorState {
  error?: unknown
  errorFallback?: ReactNode | ((error: unknown) => ReactNode)
}
