import type { DataViewFooterProps } from '../theme/data-view-components'

export function DataViewFooter(props: DataViewFooterProps) {
  if (!props.children) {
    return null
  }

  return (
    <footer
      className={props.className}
      data-nausea-data-view="footer"
    >
      {props.children}
    </footer>
  )
}
