import type { RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { createElement, Fragment } from 'react'

import type { NauseaColumnDef } from '../column/column-def'
import type { NauseaColumnMeta } from '../column/column-meta'
import {
  DEFAULT_ACTION_COLUMN_HEADER,
  DEFAULT_ACTION_COLUMN_ID,
} from './action-column'
import type {
  TableActionColumnRenderContext,
  TableRowAction,
  TableRowActionContext,
} from './action-types'

export interface CreateActionColumnOptions<TData extends RowData> {
  actions: readonly TableRowAction<TData>[]
  header?: string
  id?: string
  meta?: NauseaColumnMeta<TData, unknown>
  render?: (context: TableActionColumnRenderContext<TData>) => ReactNode
}

export type CreateActionColumnInput<TData extends RowData> =
  | readonly TableRowAction<TData>[]
  | CreateActionColumnOptions<TData>

export type CreateActionColumnOverrides<TData extends RowData> = Omit<
  CreateActionColumnOptions<TData>,
  'actions'
>

function normalizeActionColumnOptions<TData extends RowData>(
  input: CreateActionColumnInput<TData>,
  overrides: CreateActionColumnOverrides<TData> = {}
): CreateActionColumnOptions<TData> {
  if ('actions' in input) {
    return input
  }

  return {
    ...overrides,
    actions: input,
  }
}

function renderActionLabel<TData extends RowData>(
  context: TableRowActionContext<TData>
) {
  const { label } = context.action

  return typeof label === 'function' ? label(context) : label
}

export function createActionColumn<TData extends RowData>(
  input: CreateActionColumnInput<TData>,
  overrides: CreateActionColumnOverrides<TData> = {}
): NauseaColumnDef<TData, unknown> {
  const options = normalizeActionColumnOptions(input, overrides)

  return {
    id: options.id ?? DEFAULT_ACTION_COLUMN_ID,
    header: options.header ?? DEFAULT_ACTION_COLUMN_HEADER,
    enableColumnFilter: false,
    enableSorting: false,
    meta: {
      align: 'right',
      ...options.meta,
    },
    cell(cell) {
      const context: TableActionColumnRenderContext<TData> = {
        actions: options.actions,
        cell,
        row: cell.row,
        table: cell.table,
      }

      if (options.render) {
        return options.render(context)
      }

      // The default renderer is intentionally tiny. Rich menus, permission
      // checks, confirmations, and design-system buttons belong in adapters.
      return createElement(
        Fragment,
        null,
        options.actions.map((action) => {
          const actionContext: TableRowActionContext<TData> = {
            action,
            row: cell.row,
            table: cell.table,
          }

          if (action.render) {
            return createElement(
              Fragment,
              { key: action.key },
              action.render(actionContext)
            )
          }

          return createElement(
            'button',
            {
              key: action.key,
              type: 'button',
              onClick: () => action.onClick?.(actionContext),
            },
            renderActionLabel(actionContext)
          )
        })
      )
    },
  }
}
