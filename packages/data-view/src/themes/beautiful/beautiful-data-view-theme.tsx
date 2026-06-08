import type { DataViewClassNames } from '../../theme/data-view-class-names'
import type { DataViewTheme } from '../../theme/data-view-theme'
import { defaultDataViewComponents } from '../../theme/resolve-theme'
import { defaultDataViewLayout } from '../default/default-layout'

export const beautifulDataViewClassNames = {
  root: 'nausea-data-view nausea-data-view--beautiful',
  header: 'nausea-data-view__header',
  searchRegion: 'nausea-data-view__search-region',
  toolbar: 'nausea-data-view__toolbar',
  content: 'nausea-data-view__content',
  pagination: 'nausea-data-view__pagination',
  footer: 'nausea-data-view__footer',
  empty: 'nausea-data-view__empty',
  error: 'nausea-data-view__error',
} satisfies DataViewClassNames

export const beautifulDataViewTheme: DataViewTheme = {
  name: 'beautiful:data-view',
  classNames: beautifulDataViewClassNames,
  components: defaultDataViewComponents,
  layout: defaultDataViewLayout,
}
