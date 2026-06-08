import type { CellContext, RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'

export type NauseaCellRenderContext<
  TData extends RowData,
  TValue,
> = CellContext<TData, TValue> & {
  formattedValue: ReactNode
  value: TValue
}

export type NauseaCellRenderer<TData extends RowData, TValue> = (
  context: NauseaCellRenderContext<TData, TValue>
) => ReactNode

export type NauseaCellRendererRegistry<TData extends RowData = RowData> =
  Record<string, NauseaCellRenderer<TData, unknown>>

export type NauseaCellRendererLike<TData extends RowData, TValue> =
  | string
  | NauseaCellRenderer<TData, TValue>

export function resolveCellRenderer<TData extends RowData, TValue>(
  renderer?: NauseaCellRendererLike<TData, TValue>,
  registry?: NauseaCellRendererRegistry<TData>
): NauseaCellRenderer<TData, TValue> | undefined {
  if (!renderer) {
    return undefined
  }

  if (typeof renderer === 'function') {
    return renderer
  }

  return registry?.[renderer] as NauseaCellRenderer<TData, TValue> | undefined
}

export function renderCellValue<TData extends RowData, TValue>(
  cell: CellContext<TData, TValue>,
  value: TValue,
  formattedValue: ReactNode,
  renderer?: NauseaCellRendererLike<TData, TValue>,
  registry?: NauseaCellRendererRegistry<TData>
): ReactNode {
  const resolvedRenderer = resolveCellRenderer(renderer, registry)

  if (!resolvedRenderer) {
    return formattedValue
  }

  return resolvedRenderer({
    ...cell,
    formattedValue,
    value,
  })
}
