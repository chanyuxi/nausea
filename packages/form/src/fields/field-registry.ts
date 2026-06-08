import type { ReactNode } from 'react'
import type {
  FieldError,
  FieldValues,
  UseFormRegisterReturn,
} from 'react-hook-form'

import type { FormController } from '../core/form-controller'
import type { FormFieldSchema } from '../schema/field-schema'

export interface FormFieldRendererProps<
  TValues extends FieldValues = FieldValues,
  TOutput = TValues,
> {
  controller: FormController<TValues, TOutput>
  error?: FieldError
  field: FormFieldSchema<TValues>
  input: UseFormRegisterReturn
  value: unknown
}

export type FormFieldRenderer<
  TValues extends FieldValues = FieldValues,
  TOutput = TValues,
> = (props: FormFieldRendererProps<TValues, TOutput>) => ReactNode

export type FormFieldRendererRegistry<
  TValues extends FieldValues = FieldValues,
  TOutput = TValues,
> = Record<string, FormFieldRenderer<TValues, TOutput>>

export interface FormFieldRegistry<
  TValues extends FieldValues = FieldValues,
  TOutput = TValues,
> {
  entries: () => FormFieldRendererRegistry<TValues, TOutput>
  register: (
    name: string,
    renderer: FormFieldRenderer<TValues, TOutput>
  ) => void
  resolve: (name: string) => FormFieldRenderer<TValues, TOutput> | undefined
}

export function createFormFieldRegistry<
  TValues extends FieldValues,
  TOutput = TValues,
>(
  initialRenderers: FormFieldRendererRegistry<TValues, TOutput> = {}
): FormFieldRegistry<TValues, TOutput> {
  const renderers = new Map<string, FormFieldRenderer<TValues, TOutput>>(
    Object.entries(initialRenderers)
  )

  return {
    entries() {
      return Object.fromEntries(renderers) as FormFieldRendererRegistry<
        TValues,
        TOutput
      >
    },
    register(name, renderer) {
      renderers.set(name, renderer)
    },
    resolve(name) {
      return renderers.get(name)
    },
  }
}
