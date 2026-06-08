import type { ReactNode } from 'react'

export interface DataViewSlots {
  headerExtra?: ReactNode
  searchBefore?: ReactNode
  searchAfter?: ReactNode
  toolbarLeft?: ReactNode
  toolbarExtra?: ReactNode
  footer?: ReactNode
  empty?: ReactNode
  error?: ReactNode | ((error: unknown) => ReactNode)
  custom?: Record<string, ReactNode>
}
