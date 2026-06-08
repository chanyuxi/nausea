import type { ComponentType, ReactNode } from 'react'

export interface TableStateViewProps {
  children?: ReactNode
  className?: string
}

export interface TableComponents {
  Empty?: ComponentType<TableStateViewProps>
  Error?: ComponentType<TableStateViewProps>
  Loading?: ComponentType<TableStateViewProps>
}
