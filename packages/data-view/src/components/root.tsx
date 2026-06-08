import type { DataViewRootProps } from '../theme/data-view-components'

export function DataViewRoot(props: DataViewRootProps) {
  return (
    <main
      className={props.className}
      data-nausea-data-view="root"
    >
      {props.children}
    </main>
  )
}
