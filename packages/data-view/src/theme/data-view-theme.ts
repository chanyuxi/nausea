import type { ComponentType, ReactNode } from 'react'

import type { DataViewLayout } from '../layout/data-view-layout-context'
import type { DataViewClassNames } from './data-view-class-names'
import type { DataViewComponents } from './data-view-components'

export interface DataViewTheme {
  name: string
  Provider?: ComponentType<{ children: ReactNode }>
  layout?: DataViewLayout
  components?: Partial<DataViewComponents>
  // Form and table slices are intentionally opaque until their packages expose
  // stable theme contracts. Theme adapters can still carry them as a bundle.
  form?: unknown
  table?: unknown
  classNames?: Partial<DataViewClassNames>
}
