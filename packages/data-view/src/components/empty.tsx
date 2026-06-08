import type { DataViewEmptyProps } from '../theme/data-view-components'

export function DataViewEmpty(props: DataViewEmptyProps) {
  return (
    <div
      className={props.className}
      data-nausea-data-view="empty"
    >
      {props.children ?? 'No data'}
    </div>
  )
}
