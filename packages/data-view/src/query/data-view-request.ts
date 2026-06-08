import type { DataViewRequest, DataViewRequestParams } from '../types/request'
import type { DataViewResponse } from '../types/response'
import { normalizeDataViewResponse } from './normalize-response'

export class DataViewRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DataViewRequestError'
  }
}

export function assertDataViewRequest<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
>(
  request: DataViewRequest<TData, TSearch, TApi> | undefined
): asserts request is DataViewRequest<TData, TSearch, TApi> {
  if (!request) {
    throw new DataViewRequestError(
      'DataView requires a page request or a global config.api.request handler.'
    )
  }
}

export async function executeDataViewRequest<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
>(
  request: DataViewRequest<TData, TSearch, TApi> | undefined,
  params: DataViewRequestParams<TSearch, TApi>
): Promise<DataViewResponse<TData>> {
  assertDataViewRequest(request)

  // Keep response normalization here so every query path shares one runtime
  // boundary, whether the request came from page props or global config.
  const response = await request(params)

  return normalizeDataViewResponse<TData>(response)
}
