import type { ReactNode } from 'react'

import { useDataViewConfig } from './config/data-view-config-context'
import { useCreateDataViewController } from './core/create-data-view'
import { DataViewContext } from './core/data-view-context'
import type { DataViewLayout } from './layout/data-view-layout-context'
import { resolveDataViewSlots } from './layout/slots'
import { resolveDataViewTheme } from './theme/resolve-theme'
import type { DataViewProps } from './types/props'

export function DataView<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
>(props: DataViewProps<TData, TSearch, TApi>): ReactNode {
  const config = useDataViewConfig()

  const slots = resolveDataViewSlots(props.slots)
  const theme = resolveDataViewTheme(props.theme)

  const controller = useCreateDataViewController<TData, TSearch, TApi>({
    api: props.api,
    configRequest: config.api?.request,
    defaultPagination: props.defaultPagination,
    defaultSearch: props.defaultSearch,
    queryOptions: props.queryOptions,
    request: props.request,
    resourceKey: props.resourceKey,
  })

  const { components } = theme
  const { classNames } = theme

  // Theme layouts are generic renderers. The page-level DataView invocation
  // supplies the concrete controller shape used by this render pass.
  const layout = (props.layout ?? theme.layout) as DataViewLayout<
    TData,
    TSearch,
    TApi
  >

  const isEmpty =
    !controller.query.isLoading &&
    !controller.query.isError &&
    (controller.query.data?.data.length ?? 0) === 0

  const errorSlot =
    typeof slots.error === 'function'
      ? slots.error(controller.query.error)
      : slots.error

  const emptyNode = slots.empty ?? (
    <components.Empty className={classNames.empty} />
  )

  const errorNode = controller.query.error ? (
    <components.Error
      className={classNames.error}
      error={controller.query.error}
    >
      {errorSlot}
    </components.Error>
  ) : null

  const nodes = {
    content: (
      <components.Content
        className={classNames.content}
        empty={emptyNode}
        error={errorNode}
        isEmpty={isEmpty}
        isError={controller.query.isError}
        isLoading={controller.query.isLoading}
      >
        {props.children}
      </components.Content>
    ),
    footer: (
      <components.Footer className={classNames.footer}>
        {slots.footer}
      </components.Footer>
    ),
    header: (
      <components.Header
        className={classNames.header}
        description={props.description}
        extra={slots.headerExtra}
        title={props.title}
      />
    ),
    pagination: (
      <components.Pagination
        className={classNames.pagination}
        actions={controller.actions}
        state={controller.state}
        total={controller.query.data?.total}
      />
    ),
    searchRegion: (
      <components.SearchRegion
        after={slots.searchAfter}
        before={slots.searchBefore}
        className={classNames.searchRegion}
      />
    ),
    toolbar: (
      <components.Toolbar
        actions={controller.actions}
        className={classNames.toolbar}
        extra={slots.toolbarExtra}
        left={slots.toolbarLeft}
      />
    ),
  }

  const rendered = layout({
    classNames,
    components,
    controller,
    nodes,
    slots,
  })

  const content = theme.Provider ? (
    <theme.Provider>{rendered}</theme.Provider>
  ) : (
    rendered
  )

  return (
    <DataViewContext.Provider value={controller}>
      {/* DataView owns state/query context; theme owns the actual page shape. */}
      {content}
    </DataViewContext.Provider>
  )
}
