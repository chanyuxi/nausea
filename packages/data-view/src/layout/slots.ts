import type { DataViewSlots } from '../types/slots'

export function resolveDataViewSlots(slots?: DataViewSlots): DataViewSlots {
  return slots ?? {}
}
