import { createContext, useContext } from 'react'

import type { DataViewController } from './create-data-view'

export const DataViewContext = createContext<unknown>(null)

export function useDataViewContext<
  TData = unknown,
  TSearch = Record<string, unknown>,
  TApi = unknown,
>(): DataViewController<TData, TSearch, TApi> {
  const context = useContext(DataViewContext)

  if (!context) {
    throw new Error(
      'DataView context is missing. Render this hook under DataView.'
    )
  }

  // React context cannot preserve each page's generic parameters. DataView owns
  // the provider value, so consumers recover the expected page type at the hook.
  return context as DataViewController<TData, TSearch, TApi>
}
