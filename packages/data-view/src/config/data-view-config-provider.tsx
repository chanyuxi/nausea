import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { DataViewConfigContext } from './data-view-config-context'
import type { DataViewConfig } from './define-data-view-config'
import { resolveDataViewConfig } from './resolve-data-view-config'

export interface DataViewConfigProviderProps<TConfig extends DataViewConfig> {
  config: TConfig
  children?: ReactNode
}

export function DataViewConfigProvider<TConfig extends DataViewConfig>(
  props: DataViewConfigProviderProps<TConfig>
) {
  const value = useMemo(
    () => resolveDataViewConfig(props.config),
    [props.config]
  )

  return (
    <DataViewConfigContext.Provider value={value}>
      {props.children}
    </DataViewConfigContext.Provider>
  )
}
