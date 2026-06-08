import type { FormFieldRendererRegistry } from '../fields/field-registry'
import type { FormClassNames } from './form-class-names'
import type { FormComponents } from './form-components'

export interface FormTheme {
  classNames?: Partial<FormClassNames>
  components?: FormComponents
  fieldRenderers?: FormFieldRendererRegistry
  name: string
}
