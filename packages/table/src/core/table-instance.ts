import type { RowData, Table as TanStackTable } from '@tanstack/react-table'

export type NauseaTableInstance<TData extends RowData> = TanStackTable<TData>
