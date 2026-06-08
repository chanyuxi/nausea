import type {
  CellContext,
  Row,
  RowData,
  Table as TanStackTable,
} from '@tanstack/react-table'
import type { ReactNode } from 'react'

export interface TableRowActionContext<TData extends RowData> {
  action: TableRowAction<TData>
  row: Row<TData>
  table: TanStackTable<TData>
}

export interface TableRowAction<TData extends RowData> {
  key: string
  label: ReactNode | ((context: TableRowActionContext<TData>) => ReactNode)
  onClick?: (context: TableRowActionContext<TData>) => void
  render?: (context: TableRowActionContext<TData>) => ReactNode
}

export interface TableActionColumnRenderContext<TData extends RowData> {
  actions: readonly TableRowAction<TData>[]
  cell: CellContext<TData, unknown>
  row: Row<TData>
  table: TanStackTable<TData>
}
