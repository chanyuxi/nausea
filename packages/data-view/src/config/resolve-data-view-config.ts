import { defaultDataViewConfig } from './default-config'
import type { DataViewConfig } from './define-data-view-config'

export type ResolvedDataViewConfig<TConfig extends DataViewConfig> =
  DataViewConfig & TConfig

export function resolveDataViewConfig<TConfig extends DataViewConfig>(
  config?: TConfig
): ResolvedDataViewConfig<TConfig> {
  return {
    ...defaultDataViewConfig,
    ...config,
    api: {
      ...defaultDataViewConfig.api,
      ...config?.api,
    },
  } as ResolvedDataViewConfig<TConfig>
}
