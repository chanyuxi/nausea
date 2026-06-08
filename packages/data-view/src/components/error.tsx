import type { DataViewErrorProps } from '../theme/data-view-components'

export function DataViewError(props: DataViewErrorProps) {
  return (
    <div
      className={props.className}
      role="alert"
      data-nausea-data-view="error"
    >
      {props.children ?? 'Something went wrong'}
    </div>
  )
}
