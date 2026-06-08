import { useMemo } from 'react'
import {
  type DefaultValues,
  type FieldValues,
  useForm,
  type UseFormProps,
} from 'react-hook-form'

import type { FormFieldRendererRegistry } from '../fields/field-registry'
import { normalizeFormSchema } from '../schema/normalize-schema'
import type { FormObjectSchema } from '../schema/object-schema'
import { transformFormValues } from '../transform/transform-values'
import type { FormController, FormSubmitHandler } from './form-controller'

export interface UseCreateFormOptions<
  TValues extends FieldValues,
  TOutput = TValues,
> {
  defaultValues?: DefaultValues<TValues>
  renderers?: FormFieldRendererRegistry<TValues, TOutput>
  schema: FormObjectSchema<TValues, TOutput>
  useFormOptions?: Omit<UseFormProps<TValues>, 'defaultValues'>
}

export function useCreateForm<TValues extends FieldValues, TOutput = TValues>(
  options: UseCreateFormOptions<TValues, TOutput>
): FormController<TValues, TOutput> {
  const schema = useMemo(
    () => normalizeFormSchema(options.schema),
    [options.schema]
  )
  const defaultValues = options.defaultValues ?? schema.defaultValues
  const rhf = useForm<TValues>({
    ...options.useFormOptions,
    defaultValues,
  })

  return useMemo(() => {
    const transformValues = (values: TValues = rhf.getValues()) =>
      transformFormValues(schema, values)
    const submit = async (handler?: FormSubmitHandler<TValues, TOutput>) => {
      await rhf.handleSubmit(async (values) => {
        await handler?.(transformValues(values), values)
      })()
    }

    return {
      defaultValues,
      fields: schema.fields,
      getFieldState(name) {
        return rhf.getFieldState(name, rhf.formState)
      },
      getValues: rhf.getValues,
      register: rhf.register,
      renderers: options.renderers ?? {},
      reset(values) {
        rhf.reset(values)
      },
      schema,
      setValue: rhf.setValue,
      submit,
      transformValues,
      watch: rhf.watch,
    }
  }, [defaultValues, options.renderers, rhf, schema])
}
