import type { CellContext, HeaderContext, RowData } from '@tanstack/react-table'

import type { NauseaCellFallback } from '../cell/fallback'
import type { NauseaCellFormatterLike } from '../cell/formatters'
import type { NauseaCellRendererLike } from '../cell/renderers'

export type NauseaTableAlign = 'left' | 'center' | 'right'

export type NauseaTableClassName<TContext> =
  | string
  | ((context: TContext) => string | undefined)

export interface NauseaColumnMeta<TData extends RowData, TValue> {
  align?: NauseaTableAlign
  width?: number | string
  headerClassName?: NauseaTableClassName<HeaderContext<TData, TValue>>
  cellClassName?: NauseaTableClassName<CellContext<TData, TValue>>
  fallback?: NauseaCellFallback<TData, TValue>
  formatter?: NauseaCellFormatterLike<TData, TValue>
  renderer?: NauseaCellRendererLike<TData, TValue>
}

export function resolveTableClassName<TContext>(
  className: NauseaTableClassName<TContext> | undefined,
  context: TContext
): string | undefined {
  if (typeof className === 'function') {
    return className(context)
  }

  return className
}

declare module '@tanstack/react-table' {
  // Module augmentation needs an interface extension even though all fields
  // live in NauseaColumnMeta.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ColumnMeta<TData extends RowData, TValue> extends NauseaColumnMeta<
    TData,
    TValue
  > {}
}
