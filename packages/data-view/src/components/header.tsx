import type { DataViewHeaderProps } from '../theme/data-view-components'

export function DataViewHeader(props: DataViewHeaderProps) {
  if (!props.title && !props.description && !props.extra) {
    return null
  }

  return (
    <header
      className={props.className}
      data-nausea-data-view="header"
    >
      <div>
        {props.title ? <h1>{props.title}</h1> : null}
        {props.description ? <p>{props.description}</p> : null}
      </div>
      {props.extra}
    </header>
  )
}
