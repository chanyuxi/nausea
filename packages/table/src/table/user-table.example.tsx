import type { ReactNode } from 'react'

import type { NauseaCellFormatterRegistry } from '../cell/formatters'
import type { NauseaCellRendererRegistry } from '../cell/renderers'
import { createTableHelper } from '../column/create-table-helper'
import { Table } from './index'

interface User {
  id: string
  name: string
  status: 'enabled' | 'disabled'
  createdAt: string
}

const helper = createTableHelper<User>()

const columns = helper.defineColumns([
  helper.accessor('name', {
    header: 'Name',
    meta: {
      fallback: '-',
    },
  }),
  helper.accessor('status', {
    header: 'Status',
    meta: {
      renderer: 'status',
    },
  }),
  helper.accessor('createdAt', {
    header: 'Created At',
    meta: {
      formatter: 'date',
    },
  }),
  helper.actionColumn([
    {
      key: 'view',
      label: 'View',
      onClick({ row }) {
        void row.original.id
      },
    },
  ]),
])

const data: User[] = [
  {
    id: '1',
    name: 'Ada Lovelace',
    status: 'enabled',
    createdAt: '2026-06-08T00:00:00.000Z',
  },
]

const cellFormatters = {
  date({ value }) {
    return typeof value === 'string'
      ? new Date(value).toLocaleDateString()
      : String(value)
  },
} satisfies NauseaCellFormatterRegistry<User>

const cellRenderers = {
  status({ formattedValue }) {
    return <span data-status={String(formattedValue)}>{formattedValue}</span>
  },
} satisfies NauseaCellRendererRegistry<User>

export function UserTableExample(): ReactNode {
  return (
    <Table
      cellFormatters={cellFormatters}
      cellRenderers={cellRenderers}
      columns={[...columns]}
      data={data}
    />
  )
}
