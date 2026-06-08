import type { DataViewTheme } from '../../theme/data-view-theme'
import {
  defaultDataViewComponents,
  resolveDataViewTheme,
} from '../../theme/resolve-theme'
import { defaultDataViewLayout } from './default-layout'

export const defaultDataViewTheme: DataViewTheme = {
  name: 'default',
  components: defaultDataViewComponents,
  layout: defaultDataViewLayout,
}

export const resolvedDefaultDataViewTheme =
  resolveDataViewTheme(defaultDataViewTheme)
