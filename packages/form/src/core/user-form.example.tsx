/* eslint-disable react-refresh/only-export-components */

import type { FormEvent, ReactNode } from 'react'

import { FieldController } from '../fields/field-controller'
import type { FormFieldRendererRegistry } from '../fields/field-registry'
import { defineFormSchema } from '../schema/define-form-schema'
import { useCreateForm } from './create-form'
import { FormProvider } from './form-provider'

interface UserSearchValues {
  keyword: string
  status?: 'enabled' | 'disabled'
}

interface UserSearchRequest {
  keyword?: string
  status?: 'enabled' | 'disabled'
}

const userSearchSchema = defineFormSchema<UserSearchValues, UserSearchRequest>({
  defaultValues: {
    keyword: '',
  },
  fields: [
    {
      label: 'Keyword',
      name: 'keyword',
      props: {
        placeholder: 'Search users',
      },
      render: 'input',
      transform(value) {
        return typeof value === 'string' ? value.trim() : value
      },
    },
    {
      label: 'Status',
      name: 'status',
      options: [
        {
          label: 'Enabled',
          value: 'enabled',
        },
        {
          label: 'Disabled',
          value: 'disabled',
        },
      ],
      render: 'select',
    },
  ],
  transform(values) {
    return {
      keyword: values.keyword,
      status: values.status,
    }
  },
})

const renderers = {
  input({ field, input }) {
    return (
      <input
        placeholder={String(field.props?.placeholder ?? '')}
        {...input}
      />
    )
  },
  select({ field, input }) {
    return (
      <select {...input}>
        <option value="" />
        {field.options?.map((option) => (
          <option
            key={String(option.value)}
            value={String(option.value)}
          >
            {option.label}
          </option>
        ))}
      </select>
    )
  },
} satisfies FormFieldRendererRegistry<UserSearchValues, UserSearchRequest>

function UserSearchFormExample(): ReactNode {
  const form = useCreateForm<UserSearchValues, UserSearchRequest>({
    renderers,
    schema: userSearchSchema,
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void form.submit((values) => {
      void values.keyword
    })
  }

  return (
    <FormProvider controller={form}>
      <form onSubmit={handleSubmit}>
        {form.fields.map((field) => (
          <FieldController<UserSearchValues, UserSearchRequest>
            key={field.name}
            field={field}
          />
        ))}
      </form>
    </FormProvider>
  )
}

void UserSearchFormExample
