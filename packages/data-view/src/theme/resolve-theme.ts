import { DataViewContent } from '../components/content'
import { DataViewEmpty } from '../components/empty'
import { DataViewError } from '../components/error'
import { DataViewFooter } from '../components/footer'
import { DataViewHeader } from '../components/header'
import { DataViewPagination } from '../components/pagination'
import { DataViewRoot } from '../components/root'
import { DataViewSearchRegion } from '../components/search-region'
import { DataViewToolbar } from '../components/toolbar'
import { defaultDataViewLayout } from '../layout/data-view-layout'
import type { DataViewLayout } from '../layout/data-view-layout-context'
import type { DataViewClassNames } from './data-view-class-names'
import type { DataViewComponents } from './data-view-components'
import type { DataViewTheme } from './data-view-theme'

export interface ResolvedDataViewTheme {
  name: string
  Provider?: DataViewTheme['Provider']
  layout: DataViewLayout
  components: DataViewComponents
  form?: unknown
  table?: unknown
  classNames: Partial<DataViewClassNames>
}

export const defaultDataViewComponents: DataViewComponents = {
  Content: DataViewContent,
  Empty: DataViewEmpty,
  Error: DataViewError,
  Footer: DataViewFooter,
  Header: DataViewHeader,
  Pagination: DataViewPagination,
  Root: DataViewRoot,
  SearchRegion: DataViewSearchRegion,
  Toolbar: DataViewToolbar,
}

export function resolveDataViewTheme(
  theme?: DataViewTheme
): ResolvedDataViewTheme {
  return {
    name: theme?.name ?? 'default',
    Provider: theme?.Provider,
    layout: theme?.layout ?? defaultDataViewLayout,
    components: {
      ...defaultDataViewComponents,
      ...theme?.components,
    },
    form: theme?.form,
    table: theme?.table,
    classNames: theme?.classNames ?? {},
  }
}
