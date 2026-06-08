import type { CellContext, RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'

export const DEFAULT_TABLE_CELL_FALLBACK = '-'

export type NauseaCellFallback<TData extends RowData, TValue> =
  | ReactNode
  | ((context: NauseaCellFallbackContext<TData, TValue>) => ReactNode)

export interface NauseaCellFallbackContext<TData extends RowData, TValue> {
  cell: CellContext<TData, TValue>
  value: TValue
}

export interface ResolveCellFallbackOptions<TData extends RowData, TValue> {
  cell: CellContext<TData, TValue>
  value: TValue
  fallback?: NauseaCellFallback<TData, TValue>
}

export function isEmptyCellValue(
  value: unknown
): value is null | undefined | '' {
  return value === null || value === undefined || value === ''
}

export function resolveCellFallback<TData extends RowData, TValue>(
  options: ResolveCellFallbackOptions<TData, TValue>
): ReactNode | undefined {
  if (!isEmptyCellValue(options.value)) {
    return undefined
  }

  const fallback = options.fallback ?? DEFAULT_TABLE_CELL_FALLBACK

  if (typeof fallback === 'function') {
    return fallback({
      cell: options.cell,
      value: options.value,
    })
  }

  return fallback
}
