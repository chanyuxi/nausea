import type { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form'

export type FormValidationRules<
  TValues extends FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>,
> = RegisterOptions<TValues, TName>
