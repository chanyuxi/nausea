import type { DataViewToolbarProps } from '../theme/data-view-components'

export function DataViewToolbar(props: DataViewToolbarProps) {
  return (
    <div
      className={props.className}
      data-nausea-data-view="toolbar"
    >
      <div>{props.left}</div>
      <div>
        {props.extra}
        <button
          type="button"
          onClick={props.actions.refresh}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
