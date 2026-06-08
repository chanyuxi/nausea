import type { DataViewSearchRegionProps } from '../theme/data-view-components'

export function DataViewSearchRegion(props: DataViewSearchRegionProps) {
  if (!props.before && !props.after) {
    return null
  }

  return (
    <section
      className={props.className}
      data-nausea-data-view="search-region"
    >
      {props.before}
      {props.after}
    </section>
  )
}
