import type { DataViewContentProps } from '../theme/data-view-components'

export function DataViewContent(props: DataViewContentProps) {
  let content = props.children

  if (props.isError) {
    content = props.error
  } else if (props.isLoading && !content) {
    content = 'Loading...'
  } else if (props.isEmpty) {
    content = props.empty
  }

  return (
    <section
      className={props.className}
      data-nausea-data-view="content"
    >
      {content}
    </section>
  )
}
