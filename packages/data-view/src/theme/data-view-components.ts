import type { ComponentType, ReactNode } from 'react'

import type { DataViewActions } from '../core/data-view-actions'
import type { DataViewState } from '../core/data-view-state'

export interface DataViewRootProps {
  className?: string
  children?: ReactNode
}

export interface DataViewHeaderProps {
  className?: string
  title?: ReactNode
  description?: ReactNode
  extra?: ReactNode
}

export interface DataViewSearchRegionProps {
  className?: string
  before?: ReactNode
  after?: ReactNode
}

export interface DataViewToolbarProps {
  className?: string
  left?: ReactNode
  extra?: ReactNode
  actions: Pick<DataViewActions<unknown>, 'refresh'>
}

export interface DataViewContentProps {
  className?: string
  children?: ReactNode
  empty?: ReactNode
  error?: ReactNode
  isEmpty: boolean
  isError: boolean
  isLoading: boolean
}

export interface DataViewPaginationProps {
  className?: string
  state: Pick<DataViewState<unknown>, 'pagination'>
  actions: Pick<DataViewActions<unknown>, 'setPageIndex' | 'setPageSize'>
  total?: number
}

export interface DataViewFooterProps {
  className?: string
  children?: ReactNode
}

export interface DataViewEmptyProps {
  className?: string
  children?: ReactNode
}

export interface DataViewErrorProps {
  className?: string
  error: unknown
  children?: ReactNode
}

export interface DataViewComponents {
  Root: ComponentType<DataViewRootProps>
  Header: ComponentType<DataViewHeaderProps>
  SearchRegion: ComponentType<DataViewSearchRegionProps>
  Toolbar: ComponentType<DataViewToolbarProps>
  Content: ComponentType<DataViewContentProps>
  Pagination: ComponentType<DataViewPaginationProps>
  Footer: ComponentType<DataViewFooterProps>
  Empty: ComponentType<DataViewEmptyProps>
  Error: ComponentType<DataViewErrorProps>
}
