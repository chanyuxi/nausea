import type { FieldError } from 'react-hook-form'

export interface FormFieldState {
  error?: FieldError
  invalid: boolean
  isDirty: boolean
  isTouched: boolean
  isValidating: boolean
}
