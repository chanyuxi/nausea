import type { CellContext, RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'

export type NauseaCellFormatContext<
  TData extends RowData,
  TValue,
> = CellContext<TData, TValue> & {
  value: TValue
}

export type NauseaCellFormatter<TData extends RowData, TValue> = (
  context: NauseaCellFormatContext<TData, TValue>
) => ReactNode

export type NauseaCellFormatterRegistry<TData extends RowData = RowData> =
  Record<string, NauseaCellFormatter<TData, unknown>>

export type NauseaCellFormatterLike<TData extends RowData, TValue> =
  | string
  | NauseaCellFormatter<TData, TValue>

export function coerceCellValueToNode(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  return String(value)
}

export function resolveCellFormatter<TData extends RowData, TValue>(
  formatter?: NauseaCellFormatterLike<TData, TValue>,
  registry?: NauseaCellFormatterRegistry<TData>
): NauseaCellFormatter<TData, TValue> | undefined {
  if (!formatter) {
    return undefined
  }

  if (typeof formatter === 'function') {
    return formatter
  }

  return registry?.[formatter] as NauseaCellFormatter<TData, TValue> | undefined
}

export function formatCellValue<TData extends RowData, TValue>(
  cell: CellContext<TData, TValue>,
  value: TValue,
  formatter?: NauseaCellFormatterLike<TData, TValue>,
  registry?: NauseaCellFormatterRegistry<TData>
): ReactNode {
  const resolvedFormatter = resolveCellFormatter(formatter, registry)

  if (!resolvedFormatter) {
    return coerceCellValueToNode(value)
  }

  return resolvedFormatter({
    ...cell,
    value,
  })
}
