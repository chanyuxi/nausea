import { useDataView } from './use-data-view'

export function useDataViewState() {
  return useDataView().state
}
