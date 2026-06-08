import type { DataViewTheme } from '../../theme/data-view-theme'
import { resolveDataViewTheme } from '../../theme/resolve-theme'
import {
  beautifulDataViewClassNames,
  beautifulDataViewTheme,
} from './beautiful-data-view-theme'
import { beautifulFormTheme } from './beautiful-form-theme'
import { BeautifulThemeProvider } from './beautiful-provider'
import { beautifulTableTheme } from './beautiful-table-theme'

export const beautifulTheme: DataViewTheme = {
  ...beautifulDataViewTheme,
  name: 'beautiful',
  Provider: BeautifulThemeProvider,
  classNames: beautifulDataViewClassNames,
  form: beautifulFormTheme,
  table: beautifulTableTheme,
}

export const resolvedBeautifulTheme = resolveDataViewTheme(beautifulTheme)
