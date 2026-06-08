import type { ReactNode } from 'react'

import type { DataViewLayout } from '../layout/data-view-layout-context'
import type { UseDataViewQueryOptions } from '../query/use-data-view-query'
import type { DataViewTheme } from '../theme/data-view-theme'
import type { DataViewRequest } from './request'
import type { DataViewSlots } from './slots'

export interface DataViewDefaultPagination {
  pageIndex?: number
  pageSize?: number
}

export interface DataViewProps<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
> {
  resourceKey: string
  title?: ReactNode
  description?: ReactNode
  api?: TApi
  request?: DataViewRequest<TData, TSearch, TApi>
  defaultSearch?: Partial<TSearch>
  defaultPagination?: DataViewDefaultPagination
  queryOptions?: UseDataViewQueryOptions<TData, TSearch, TApi>['queryOptions']
  slots?: DataViewSlots
  theme?: DataViewTheme
  layout?: DataViewLayout<TData, TSearch, TApi>
  children?: ReactNode
}
