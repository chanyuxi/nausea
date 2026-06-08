import {
  type ColumnHelper,
  createColumnHelper,
  type RowData,
} from '@tanstack/react-table'

import {
  createActionColumn,
  type CreateActionColumnInput,
  type CreateActionColumnOverrides,
} from '../actions/create-action-column'
import type { NauseaAnyColumnDef, NauseaColumnDef } from './column-def'

export interface NauseaTableHelper<
  TData extends RowData,
> extends ColumnHelper<TData> {
  actionColumn: (
    input: CreateActionColumnInput<TData>,
    overrides?: CreateActionColumnOverrides<TData>
  ) => NauseaColumnDef<TData, unknown>
  defineColumn: <TValue = unknown>(
    column: NauseaColumnDef<TData, TValue>
  ) => NauseaColumnDef<TData, TValue>
  defineColumns: <const TColumns extends readonly NauseaAnyColumnDef<TData>[]>(
    columns: TColumns
  ) => TColumns
}

export function createTableHelper<
  TData extends RowData,
>(): NauseaTableHelper<TData> {
  const helper = createColumnHelper<TData>()

  return {
    ...helper,
    // Keep TanStack's accessor/display/group inference, and add Nausea-only
    // helpers beside it instead of replacing the underlying column contract.
    actionColumn: (input, overrides) => createActionColumn(input, overrides),
    defineColumn: (column) => column,
    defineColumns: (columns) => columns,
  }
}
