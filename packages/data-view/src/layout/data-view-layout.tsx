import type { DataViewLayout } from './data-view-layout-context'

export const defaultDataViewLayout: DataViewLayout = (context) => {
  const { Root } = context.components
  const { classNames, nodes } = context

  return (
    <Root className={classNames.root}>
      {nodes.header}
      {nodes.searchRegion}
      {nodes.toolbar}
      {nodes.content}
      {nodes.pagination}
      {nodes.footer}
    </Root>
  )
}
