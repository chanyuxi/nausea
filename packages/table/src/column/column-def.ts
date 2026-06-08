import type { ColumnDef, RowData } from '@tanstack/react-table'

import type { NauseaColumnMeta } from './column-meta'

export type NauseaColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<TData, TValue> & {
  meta?: NauseaColumnMeta<TData, TValue>
}

// TanStack columns keep each cell value typed, but a column array must accept
// mixed TValue entries such as string, number, and display/action columns.

export type NauseaAnyColumnDef<TData extends RowData> = NauseaColumnDef<
  TData,
  // TanStack uses any here because a column collection intentionally erases
  // each column's individual TValue while preserving TData.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>

export type NauseaColumnDefs<TData extends RowData> = Array<
  NauseaAnyColumnDef<TData>
>
