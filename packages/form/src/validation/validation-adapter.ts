import type { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form'

export type FormValidationAdapter<
  TValues extends FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>,
> = (rules: RegisterOptions<TValues, TName>) => RegisterOptions<TValues, TName>

export function createValidationAdapter<
  TValues extends FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>,
>(
  adapter: FormValidationAdapter<TValues, TName>
): FormValidationAdapter<TValues, TName> {
  return adapter
}
