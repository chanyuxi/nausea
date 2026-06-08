import type {
  InitialTableState,
  RowData,
  TableState,
} from '@tanstack/react-table'

export type NauseaTableState = TableState

export type NauseaInitialTableState = InitialTableState

export interface NauseaTableStateSnapshot<TData extends RowData> {
  data: TData[]
  state: Partial<TableState>
}
