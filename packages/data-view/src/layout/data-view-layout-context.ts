import type { ReactNode } from 'react'

import type { DataViewController } from '../core/create-data-view'
import type { DataViewClassNames } from '../theme/data-view-class-names'
import type { DataViewComponents } from '../theme/data-view-components'
import type { DataViewSlots } from '../types/slots'

export interface DataViewLayoutRenderNodes {
  header: ReactNode
  searchRegion: ReactNode
  toolbar: ReactNode
  content: ReactNode
  pagination: ReactNode
  footer: ReactNode
}

export interface DataViewLayoutContext<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
> {
  controller: DataViewController<TData, TSearch, TApi>
  components: DataViewComponents
  classNames: Partial<DataViewClassNames>
  slots: DataViewSlots
  nodes: DataViewLayoutRenderNodes
}

export type DataViewLayout<
  TData = unknown,
  TSearch = Record<string, unknown>,
  TApi = unknown,
> = (context: DataViewLayoutContext<TData, TSearch, TApi>) => ReactNode
