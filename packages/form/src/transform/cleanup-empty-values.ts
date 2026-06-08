export function isEmptyFormValue(value: unknown): boolean {
  return (
    value === '' ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0)
  )
}

export function cleanupEmptyValues<TValues extends Record<string, unknown>>(
  values: Partial<TValues>
): Partial<TValues> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => !isEmptyFormValue(value))
  ) as Partial<TValues>
}
