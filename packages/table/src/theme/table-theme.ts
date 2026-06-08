import type { TableClassNames } from './table-class-names'
import type { TableComponents } from './table-components'

export interface TableTheme {
  name: string
  classNames?: Partial<TableClassNames>
  components?: TableComponents
}
