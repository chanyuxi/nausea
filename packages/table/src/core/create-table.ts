import {
  getCoreRowModel,
  type RowData,
  type TableOptions,
  useReactTable,
} from '@tanstack/react-table'

export type CreateTableOptions<TData extends RowData> = Omit<
  TableOptions<TData>,
  'getCoreRowModel'
> & {
  getCoreRowModel?: TableOptions<TData>['getCoreRowModel']
}

export function useCreateTable<TData extends RowData>(
  options: CreateTableOptions<TData>
) {
  const { getCoreRowModel: getCoreRowModelOption, ...tableOptions } = options

  return useReactTable({
    ...tableOptions,
    getCoreRowModel: getCoreRowModelOption ?? getCoreRowModel(),
  })
}
