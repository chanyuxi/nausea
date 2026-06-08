import type { Cell, RowData } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { CSSProperties, ReactNode } from 'react'

import { resolveCellFallback } from '../cell/fallback'
import type { NauseaCellFormatterRegistry } from '../cell/formatters'
import { formatCellValue } from '../cell/formatters'
import type { NauseaCellRendererRegistry } from '../cell/renderers'
import { renderCellValue } from '../cell/renderers'
import type { CreateTableOptions } from '../core/create-table'
import { useCreateTable } from '../core/create-table'
import type { TableClassNames } from '../theme/table-class-names'
import type { TableComponents } from '../theme/table-components'
import type { TableTheme } from '../theme/table-theme'

export interface TableProps<
  TData extends RowData,
> extends CreateTableOptions<TData> {
  cellFormatters?: NauseaCellFormatterRegistry<TData>
  cellRenderers?: NauseaCellRendererRegistry<TData>
  classNames?: Partial<TableClassNames>
  emptyFallback?: ReactNode
  error?: unknown
  errorFallback?: ReactNode | ((error: unknown) => ReactNode)
  isLoading?: boolean
  loadingFallback?: ReactNode
  theme?: TableTheme
}

function joinClassNames(
  ...classNames: Array<string | undefined>
): string | undefined {
  const joined = classNames.filter(Boolean).join(' ')

  return joined || undefined
}

function getColumnStyle(
  align?: 'left' | 'center' | 'right',
  width?: number | string
): CSSProperties | undefined {
  if (!align && !width) {
    return undefined
  }

  return {
    textAlign: align,
    width,
  }
}

function renderErrorFallback(
  fallback: TableProps<RowData>['errorFallback'],
  error: unknown
): ReactNode {
  if (typeof fallback === 'function') {
    return fallback(error)
  }

  return fallback ?? 'Something went wrong'
}

function TableStateView(props: {
  children: ReactNode
  className?: string
  component?: TableComponents['Empty']
  state: 'empty' | 'error' | 'loading'
}) {
  const Component = props.component

  if (Component) {
    return <Component className={props.className}>{props.children}</Component>
  }

  return (
    <div
      className={props.className}
      data-nausea-table={props.state}
    >
      {props.children}
    </div>
  )
}

function renderDefaultCell<TData extends RowData>(
  cell: Cell<TData, unknown>,
  props: Pick<TableProps<TData>, 'cellFormatters' | 'cellRenderers'>
): ReactNode {
  const context = cell.getContext()
  const meta = cell.column.columnDef.meta
  const value = context.getValue()
  const fallback = resolveCellFallback({
    cell: context,
    fallback: meta?.fallback,
    value,
  })

  if (fallback !== undefined) {
    return fallback
  }

  const formattedValue = formatCellValue(
    context,
    value,
    meta?.formatter,
    props.cellFormatters
  )

  return renderCellValue(
    context,
    value,
    formattedValue,
    meta?.renderer,
    props.cellRenderers
  )
}

export function Table<TData extends RowData>(props: TableProps<TData>) {
  const {
    cellFormatters,
    cellRenderers,
    classNames: classNameOverrides,
    emptyFallback,
    error,
    errorFallback,
    isLoading,
    loadingFallback,
    theme,
    ...tableOptions
  } = props
  const table = useCreateTable(tableOptions)
  const classNames = {
    ...theme?.classNames,
    ...classNameOverrides,
  }
  const components = theme?.components ?? {}
  const rows = table.getRowModel().rows

  if (error) {
    return (
      <div
        className={classNames.root}
        data-nausea-table="root"
      >
        <TableStateView
          className={classNames.error}
          component={components.Error}
          state="error"
        >
          {renderErrorFallback(errorFallback, error)}
        </TableStateView>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        className={classNames.root}
        data-nausea-table="root"
      >
        <TableStateView
          className={classNames.loading}
          component={components.Loading}
          state="loading"
        >
          {loadingFallback ?? 'Loading...'}
        </TableStateView>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div
        className={classNames.root}
        data-nausea-table="root"
      >
        <TableStateView
          className={classNames.empty}
          component={components.Empty}
          state="empty"
        >
          {emptyFallback ?? 'No data'}
        </TableStateView>
      </div>
    )
  }

  return (
    <div
      className={classNames.root}
      data-nausea-table="root"
    >
      <table
        className={classNames.table}
        data-nausea-table="table"
      >
        <thead
          className={classNames.header}
          data-nausea-table="header"
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className={classNames.headerRow}
              data-nausea-table="header-row"
            >
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta
                const context = header.getContext()

                return (
                  <th
                    key={header.id}
                    className={joinClassNames(
                      classNames.headerCell,
                      typeof meta?.headerClassName === 'function'
                        ? meta.headerClassName(context)
                        : meta?.headerClassName
                    )}
                    style={getColumnStyle(meta?.align, meta?.width)}
                    data-nausea-table="header-cell"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, context)}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody
          className={classNames.body}
          data-nausea-table="body"
        >
          {rows.map((row) => (
            <tr
              key={row.id}
              className={classNames.row}
              data-nausea-table="row"
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta
                const context = cell.getContext()
                const cellTemplate = cell.column.columnDef.cell

                return (
                  <td
                    key={cell.id}
                    className={joinClassNames(
                      classNames.cell,
                      typeof meta?.cellClassName === 'function'
                        ? meta.cellClassName(context)
                        : meta?.cellClassName
                    )}
                    style={getColumnStyle(meta?.align, meta?.width)}
                    data-nausea-table="cell"
                  >
                    {cellTemplate
                      ? flexRender(cellTemplate, context)
                      : renderDefaultCell(cell, {
                          cellFormatters,
                          cellRenderers,
                        })}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
