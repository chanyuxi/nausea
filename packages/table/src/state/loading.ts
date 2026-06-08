import type { ReactNode } from 'react'

export interface TableLoadingState {
  isLoading?: boolean
  loadingFallback?: ReactNode
}
