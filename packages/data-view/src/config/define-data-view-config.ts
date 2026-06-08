import type { DataViewRequest } from '../types/request'

export interface DataViewApiConfig<TApi = unknown> {
  request?: DataViewRequest<unknown, Record<string, unknown>, TApi>
}

export interface DataViewConfig<TApi = unknown> {
  api?: DataViewApiConfig<TApi>
}

export function defineDataViewConfig<TConfig extends DataViewConfig>(
  config: TConfig
): TConfig {
  return config
}
