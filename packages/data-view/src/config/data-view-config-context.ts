import { createContext, useContext } from 'react'

import type { DataViewConfig } from './define-data-view-config'
import {
  resolveDataViewConfig,
  type ResolvedDataViewConfig,
} from './resolve-data-view-config'

export const DataViewConfigContext = createContext<
  ResolvedDataViewConfig<DataViewConfig>
>(resolveDataViewConfig())

export function useDataViewConfig(): ResolvedDataViewConfig<DataViewConfig> {
  return useContext(DataViewConfigContext)
}
