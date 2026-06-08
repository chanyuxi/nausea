import type { DataViewResponse } from '../types/response'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isDataViewResponse<TData>(
  value: unknown
): value is DataViewResponse<TData> {
  return (
    isRecord(value) &&
    Array.isArray(value.data) &&
    typeof value.total === 'number' &&
    Number.isFinite(value.total)
  )
}

/**
 * Request functions are user-land boundaries, so DataView validates the
 * minimum shape before table/query code starts reading from the response.
 */
export function normalizeDataViewResponse<TData>(
  response: unknown
): DataViewResponse<TData> {
  if (!isDataViewResponse<TData>(response)) {
    throw new TypeError(
      'DataView request must return an object shaped like { data: TData[], total: number }.'
    )
  }

  return response
}
