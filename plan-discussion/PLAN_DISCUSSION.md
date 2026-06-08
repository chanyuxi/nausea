# DataView 计划讨论

## 0. 核心说明

这份文档用于持续沉淀 `DataView` 的设计计划，并作为后续代码实现的指导。当前内容不是最终 API 约束，而是基于现有构思和仓库状态整理出的第一版执行方案。

- 你的构思是方向稿，后续任何不恰当的配置方式、命名、职责划分都可以继续调整。
- 计划会随着实现推进持续补充，尤其是类型设计、插件能力、搜索表单、请求协议和布局插槽。
- 当前仓库里 `@nausea/table` 与 `@nausea/options-dispatcher` 仍处于早期占位状态，`@nausea/data-view` 可以作为组合层从零开始设计。

## 1. 产品定位

`DataView` 是一个面向中后台管理系统的列表页 / 表格页组合组件。

它不是单纯的 table，也不是业务页面生成器，而是把中后台列表页的高频结构组合起来：

- 页面头部：标题、描述、面包屑 / 返回入口可扩展。
- 搜索区域：根据 column 配置或独立 search schema 自动生成，可配置、可覆盖。
- 工具栏：刷新、批量操作、导出、新建等按钮插槽。
- 表格主体：基于 `@nausea/table`，底层使用 `@tanstack/react-table`。
- 分页与查询：结合 `@tanstack/react-query` 管理请求、缓存、刷新、错误状态。
- 布局系统：核心保持 headless，具体 DOM、样式和组件实现由 theme 提供。
- 插件系统：例如 options dispatcher、权限、URL 同步、列设置等都可作为插件扩展。

第一版目标是做一个稳定、类型友好、可组合的后台表格页面基础设施，而不是一次性覆盖所有高级场景。

## 2. 命名修正建议

草案里有一些命名建议先修正，后续实现时尽量统一。

| 当前构思                           | 推荐命名                                | 原因                                                           |
| ---------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| `queryClinet`                      | `queryClient`                           | 拼写修正。                                                     |
| `perset`                           | `theme`                                 | 当前设计中它不只是预设值，而是包含组件实现和视觉方案的主题包。 |
| `beautifulPerset`                  | `beautifulTheme`                        | 与 `theme` 概念对齐。                                          |
| `defaultPerset`                    | `defaultTheme`                          | 与 `theme` 概念对齐。                                          |
| `@nausea/options-dispacher-plugin` | `@nausea/options-dispatcher-plugin`     | 拼写修正，与 `packages/options-dispatcher` 对齐。              |
| `cell.perset`                      | `cell.renderers` 或 `cell.formats`      | cell 内部更适合表达为渲染器或格式化器。                        |
| `comps`                            | `slots` 或 `components`                 | `slots` 更贴近布局注入；`components` 更适合替换内部组件。      |
| `customComponent`                  | `slots.custom`                          | 避免把 footer / extraButtons 这类常规插槽混进 custom。         |
| `DataView key`                     | `resource` / `resourceKey` / `queryKey` | React 的 `key` 是特殊 prop，组件内部拿不到，不应作为业务参数。 |

推荐原则：

- `theme` 表示一整套组件实现、布局实现、渲染器和视觉方案。
- `slots` 表示用户给某个页面注入的内容。
- `components` 表示替换 DataView 内部使用的组件实现。
- `resourceKey` 表示当前列表资源身份，用于 query key、缓存和调试。
- `request` 表示页面级请求函数；`api` 可以保留给全局请求解析器。

## 2.1 第一版已确认决策

- `@nausea/table` 保持无样式 headless，它是对 `@tanstack/react-table` 的二次增强。
- `@nausea/data-view` 核心也保持 headless，不直接依赖 Tailwind，也不内置具体 DOM 样式。
- 具体 UI 由 `theme` 提供，例如 `beautifulTheme`、`defaultTheme`。
- `theme` 可以包含组件实现，例如 table 二次封装、search form、pagination、toolbar 等。
- 搜索表单第一版使用受控表单模型，DataView 内部维护状态，对外通过 hook 暴露操纵能力。
- 搜索表单实现建议使用 `react-hook-form`。你文中写的是 `react-form-hook`，如果没有特指其他库，后续按 npm 生态里的 `react-hook-form` 命名落地。
- `api` 不做强类型约束，由用户在 config 中自行解释、转换或定义。
- action column 保持高度自定义，确认弹窗、权限、隐藏、禁用等能力先不在第一版内置。
- 暂不提供 SSR 兼容策略。

## 3. 推荐包职责

建议 monorepo 中保持三层职责。

### 3.1 `@nausea/table`

底层表格增强，只关注表格本身，并保持 headless。

负责：

- TanStack Table options / instance 封装。
- column definition 类型扩展。
- cell fallback / formatter / renderer 协议。
- row action definition 与 helper。
- empty / loading / error 状态协议。
- table / row / cell 级 meta 透传，例如 className、align、width 等。

不负责：

- 页面头部。
- 搜索表单。
- React Query 请求。
- 全局布局。
- 具体 DOM 结构和视觉样式。

### 3.2 `@nausea/options-dispatcher`

选项注册与访问层，思想沿用 `react-tanstack-query-options-dispatcher.md`。

负责：

- `OptionsDispatcher.register()`
- `useOptions()`
- `useOptionsQuery()`
- `staleOptions()`
- 静态 / 远程 / realtime options 的统一访问。

不负责：

- DataView 搜索表单布局。
- Select UI 组件渲染。

### 3.3 `@nausea/data-view`

中后台列表页面组合层。

负责：

- `DataView` 组件。
- `defineDataViewConfig()` 类型辅助。
- `DataViewConfigProvider` 注入全局配置。
- `createDataViewHelper<T>()` 列定义辅助。
- 搜索 schema 生成。
- 请求协议与 query key 组织。
- layout / theme / plugin 合并。
- 插件生命周期。

## 4. 配置方式

不建议让包内部依赖隐式全局 singleton。推荐使用 `defineDataViewConfig()` 生成配置，再通过 Provider 注入。

```tsx
// src/nausea-config.ts
import { defineDataViewConfig } from '@nausea/data-view'
import { optionsDispatcherPlugin } from '@nausea/options-dispatcher-plugin'

import { queryClient } from './libs/query-client'
import { beautifulTheme } from './themes/beautiful-theme'

export const dataViewConfig = defineDataViewConfig({
  queryClient,
  theme: beautifulTheme,
  plugins: [optionsDispatcherPlugin({ queryClient })],

  table: {
    cell: {
      fallback: '-',
      formatters: {
        date({ value }) {
          return value ? new Date(value).toLocaleString() : '-'
        },
      },
      renderers: {
        status(ctx) {
          return ctx.text
        },
      },
    },
    pagination: {
      pageSizeOptions: [10, 20, 50, 100],
    },
  },

  api: {
    async request(ctx) {
      // ctx.api 不做类型约束，由用户在这里自行解释、转换或定义。
    },
  },
})
```

应用入口：

```tsx
import { DataViewConfigProvider } from '@nausea/data-view'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './libs/query-client'
import { dataViewConfig } from './nausea-config'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataViewConfigProvider config={dataViewConfig}>
        <RouterRender />
      </DataViewConfigProvider>
    </QueryClientProvider>
  )
}
```

备注：

- `defineDataViewConfig()` 主要负责类型提示，不应产生副作用。
- `queryClient` 既可以从配置传入，也可以从 `useQueryClient()` 获取；如果二者都存在，需在开发环境校验是否一致。
- 后续如果需要无 Provider 用法，可以再提供 `createDataView(config)`，但第一版优先 Provider。
- `theme` 是具体 UI 实现入口；DataView core 不应该假设 theme 内部使用 Tailwind、nausea-ui、shadcn/ui 或其他 UI 库。

## 5. DataView 使用草案

```tsx
import {
  DataView,
  createDataViewHelper,
  useDataViewSearchForm,
} from '@nausea/data-view'

interface User {
  id: string
  name: string
  role: string
  status: 'enabled' | 'disabled'
  createdAt: string
}

function Footer() {
  return null
}

function ToolbarExtra() {
  const searchForm = useDataViewSearchForm()

  return <Button onClick={() => searchForm.submit()}>Export</Button>
}

export default function UserPage() {
  const helper = createDataViewHelper<User>()

  const columns = helper.useColumns([
    {
      accessorKey: 'id',
      header: 'ID',
      cellClassName: 'text-foreground font-medium',
      search: {
        key: 'user_id',
        render: 'input',
        props: {
          placeholder: 'Search by user ID',
        },
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Create Time',
      format: 'date',
      search: {
        key: 'created_at',
        render: 'dateRange',
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      renderer: 'status',
      search: {
        key: 'status',
        render: 'select',
        optionKey: 'user_status',
      },
    },
    helper.defineActions([
      {
        key: 'edit',
        label: 'Edit',
        onClick({ row }) {
          console.log(row.original)
        },
      },
    ]),
  ])

  return (
    <DataView
      resourceKey="users"
      title="User"
      description="System user table, recording all user information"
      columns={columns}
      api="/api/users"
      slots={{
        footer: <Footer />,
        toolbarExtra: <ToolbarExtra />,
      }}
    />
  )
}
```

## 6. Props 设计

```ts
interface DataViewProps<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
> {
  resourceKey: string
  title?: React.ReactNode
  description?: React.ReactNode
  columns: DataViewColumnDef<TData, TSearch>[]

  api?: TApi
  request?: DataViewRequest<TData, TSearch, TApi>
  queryKey?: readonly unknown[]

  defaultSearch?: Partial<TSearch>
  defaultPagination?: {
    pageIndex?: number
    pageSize?: number
  }

  slots?: DataViewSlots<TData, TSearch>
  components?: Partial<DataViewComponents>
  layout?: DataViewLayout<TData, TSearch>

  tableOptions?: Partial<TableOptions<TData>>
  queryOptions?: Partial<UseQueryOptions<DataViewResponse<TData>>>
}
```

设计原则：

- `resourceKey` 必填，用于调试、缓存 key 和插件识别。
- `api` 不做语义约束，可以是 URL、资源名、对象配置或用户自定义 key。
- 当没有传 `request` 时，`api` 交给全局 `config.api.request()` 解析。
- `request` 是页面内直接传入的请求函数，优先级高于 `api`。
- `queryKey` 允许用户覆盖 query key 前缀，但 DataView 仍会拼接搜索、分页、排序等状态。
- `key` 不进入 props 设计，因为 React 会吞掉它。

## 7. 请求协议

统一请求入参：

```ts
interface DataViewRequestParams<TSearch, TApi = unknown> {
  resourceKey: string
  api?: TApi
  search: TSearch
  pagination: {
    pageIndex: number
    pageSize: number
  }
  sorting: Array<{
    id: string
    desc: boolean
  }>
  filters: Record<string, unknown>
  signal?: AbortSignal
}
```

统一响应：

```ts
interface DataViewResponse<TData> {
  data: TData[]
  total: number
  meta?: Record<string, unknown>
}
```

推荐 query key：

```ts
const dataViewQueryKey = [
  'nausea:data-view',
  resourceKey,
  api,
  search,
  pagination,
  sorting,
  filters,
] as const
```

注意点：

- `pageIndex` 内部使用从 0 开始，传给后端时可由 `api.request()` 转换为 page number。
- `api` 不在 DataView 内部解析，DataView 只把它原样透传给 `request` 或 `config.api.request()`。
- 请求函数必须接收 `signal`，方便 React Query 取消过期请求。
- `request` 返回值必须标准化为 `{ data, total }`，不要让表格层理解各种后端结构。

## 8. Column 扩展

`DataViewColumnDef` 可以基于 `@tanstack/react-table` 的 `ColumnDef` 扩展。

```ts
interface DataViewColumnMeta<TData, TValue, TSearch> {
  cellClassName?: string | ((ctx: CellContext<TData, TValue>) => string)
  headerClassName?: string

  fallback?: React.ReactNode
  format?: string | DataViewCellFormatter<TData, TValue>
  renderer?: string | DataViewCellRenderer<TData, TValue>

  search?: DataViewSearchField<TSearch>
}
```

搜索配置：

```ts
type DataViewSearchField<TSearch> =
  | false
  | {
      key?: keyof TSearch | string
      label?: React.ReactNode
      render: string | DataViewSearchRenderer
      props?: Record<string, unknown>
      optionKey?: string
      defaultValue?: unknown
      transform?: (value: unknown) => Record<string, unknown>
    }
```

建议：

- `search.render` 用于指定渲染器，如 `input`、`select`、`dateRange`。
- `optionKey` 对接 OptionsDispatcher，比 `meta.useOptions: ['roles']` 更直观。
- `transform` 用于 date range 拆成 `startTime` / `endTime` 这类请求字段。
- column 上的 `format` / `renderer` 只影响展示，不影响搜索值。

## 9. Search Form 设计

第一版搜索表单只做核心能力，但表单模型要明确：DataView 内部维护搜索表单状态，字段由表单控制器驱动，对外只暴露操纵 hook，不直接要求用户传入外部 state。

推荐底层使用 `react-hook-form`：

- DataView core 负责维护 search state 与 query 触发。
- theme 负责把字段渲染成具体 UI，例如基于 nausea-ui 的 input、select、date range。
- 用户通过 `useDataViewSearchForm()` 调用 `submit()`、`reset()`、`setValue()`、`getValues()` 等能力。
- 搜索组件本身应是 controlled field，由 form controller 管理值与变更。

必须支持：

- 根据 columns 自动收集 `search` 字段。
- submit / reset。
- default values。
- setValue / getValues / watch。
- 表单值进入 query key。
- 搜索后回到第一页。
- `useDataViewSearchForm()` 获取当前表单控制器。
- `slots.searchBefore` / `slots.searchAfter` 或 `toolbarExtra` 注入额外按钮。

暂缓能力：

- URL query 同步。
- 高级搜索折叠。
- 服务端保存搜索方案。

暂不建议把搜索表单设计成用户完全外部受控。外部完全受控会让 query key、reset、分页回退、URL 同步等能力变复杂；第一版先让 DataView 持有控制权，对外提供稳定 hook。

## 10. Layout 与 Slots

DataView core 不直接承诺具体 DOM 结构。它负责组装 layout context，然后交给 `theme.layout` 或页面级 `layout` 渲染。

布局上下文建议长这样：

```ts
interface DataViewLayoutContext<TData, TSearch> {
  header: React.ReactNode
  searchForm: (options?: DataViewSearchFormRenderOptions) => React.ReactNode
  toolbar: React.ReactNode
  table: React.ReactNode
  pagination: React.ReactNode
  footer: React.ReactNode
  slots: DataViewSlots<TData, TSearch>
  state: DataViewState<TSearch>
  actions: DataViewActions
}
```

`defaultTheme` 可以提供一个默认布局：

```tsx
function defaultLayout(ctx: DataViewLayoutContext<any, any>) {
  return (
    <main className="nausea-data-view">
      {ctx.header}
      {ctx.searchForm()}
      {ctx.toolbar}
      {ctx.table}
      {ctx.pagination}
      {ctx.footer}
    </main>
  )
}
```

推荐 slots：

```ts
interface DataViewSlots<TData, TSearch> {
  headerExtra?: React.ReactNode
  searchBefore?: React.ReactNode
  searchAfter?: React.ReactNode
  toolbarLeft?: React.ReactNode
  toolbarExtra?: React.ReactNode
  footer?: React.ReactNode
  empty?: React.ReactNode
  error?: React.ReactNode | ((error: unknown) => React.ReactNode)
  custom?: Record<string, React.ReactNode>
}
```

`custom` 只用于极特殊场景；常见位置应该先定义成明确 slot。

## 11. Theme 设计

`theme` 是 DataView 的具体 UI 实现集合。它可以包含布局、内部组件、搜索字段渲染器、cell 渲染器以及 className 约定。

这比 `preset` 更准确：`preset` 更像静态默认值，而当前设想里的 `beautifulTheme` / `defaultTheme` 会真正提供组件实现。

```ts
interface DataViewTheme {
  name: string
  layout?: DataViewLayout<any, any>
  components?: Partial<DataViewComponents>
  searchRenderers?: Record<string, DataViewSearchRenderer>
  cellFormatters?: Record<string, DataViewCellFormatter<any, any>>
  cellRenderers?: Record<string, DataViewCellRenderer<any, any>>
  classNames?: Partial<DataViewClassNames>
}
```

组件实现可以由 theme 提供：

```ts
interface DataViewComponents {
  Root: React.ComponentType<DataViewRootProps>
  Header: React.ComponentType<DataViewHeaderProps>
  SearchForm: React.ComponentType<DataViewSearchFormProps>
  Toolbar: React.ComponentType<DataViewToolbarProps>
  Table: React.ComponentType<DataViewTableProps>
  Pagination: React.ComponentType<DataViewPaginationProps>
  Empty: React.ComponentType<DataViewEmptyProps>
  Error: React.ComponentType<DataViewErrorProps>
}
```

推荐拆分：

- `@nausea/data-view`：headless core、类型、hooks、状态组织。
- `@nausea/data-view/themes/default`：默认 theme，可以很轻，只提供基础结构。
- `@nausea/data-view/themes/beautiful`：更完整的 theme，可以结合 `nausea-ui` 与 `react-hook-form`。

可行性判断：

- 这个方向是可行的，而且比在 DataView core 内写死 Tailwind 或 UI 库更稳。
- 风险是 theme 需要实现的组件协议会变复杂，因此第一版要把 `DataViewComponents` 控制得很小。
- `theme` 不应接管请求和业务状态，只接管渲染实现；请求、分页、搜索值仍由 core 管理。

优先级：

```txt
DataView props
  > page-level layout / components / slots
  > global config
  > theme
  > package default
```

## 12. Plugin 设计

插件第一版不要做太宽，先提供有限生命周期。

```ts
interface DataViewPlugin {
  name: string
  setup?: (ctx: DataViewSetupContext) => void
  extendConfig?: (config: ResolvedDataViewConfig) => ResolvedDataViewConfig
  extendSearchField?: (
    field: DataViewSearchField<any>
  ) => DataViewSearchField<any>
  beforeRequest?: (
    params: DataViewRequestParams<any>
  ) => DataViewRequestParams<any>
  afterResponse?: <TData>(
    response: DataViewResponse<TData>
  ) => DataViewResponse<TData>
}
```

`optionsDispatcherPlugin` 可以负责：

- 注册 `select` / `multiSelect` 搜索渲染器。
- 当 search field 存在 `optionKey` 时调用 `useOptions(optionKey)`。
- 暴露 options loading 状态给搜索组件。

后续可扩展插件：

- `urlStatePlugin`：搜索、分页、排序同步到 URL。
- `permissionPlugin`：按权限隐藏 action / column / toolbar button。
- `columnSettingsPlugin`：列显示隐藏、列宽、列顺序。
- `selectionPlugin`：批量操作、跨页选择。

## 13. DataView 内部状态

核心状态：

```ts
interface DataViewState<TSearch> {
  search: TSearch
  pagination: {
    pageIndex: number
    pageSize: number
  }
  sorting: SortingState
  rowSelection: RowSelectionState
  columnVisibility: VisibilityState
}
```

核心动作：

```ts
interface DataViewActions {
  submitSearch: () => void
  resetSearch: () => void
  refresh: () => void
  setPageIndex: (pageIndex: number) => void
  setPageSize: (pageSize: number) => void
}
```

状态边界：

- DataView 自己管理分页、排序等页面状态。
- 搜索表单由 DataView 内部创建的 form controller 管理，第一版建议基于 `react-hook-form`。
- React Query 管理请求、缓存和刷新。
- TanStack Table 管理表格行模型、列模型和选择状态。
- OptionsDispatcher 管理 options 数据源。

## 14. 实现顺序

### Phase 1: 基础包结构

- 创建 `packages/data-view/package.json`。
- 创建 `src/index.ts`。
- 导出 `DataView`、`defineDataViewConfig`、`DataViewConfigProvider`。
- 接入 rollup 现有自动构建流程。

验收：

- `pnpm build` 能生成 `@nausea/data-view` dist。
- docs 可以正常引入占位 DataView。

### Phase 2: Table 基础能力

- 完成 `@nausea/table` 的最小可用 headless 表格增强。
- 支持 columns / data / loading / empty。
- 支持 cell fallback。
- 支持 className / align / width 等 column meta 透传。
- 支持 action column。
- 不绑定具体 DOM 样式，只提供必要的状态、类型、渲染入口和 meta 透传。

验收：

- 可以渲染静态用户列表。
- column cell 和 action 能工作。

### Phase 3: DataView 请求与分页

- DataView 接入 React Query。
- 支持 `request`。
- 支持 `api` + global `config.api.request`。
- 支持分页状态。
- 标准化响应 `{ data, total }`。

验收：

- 用户列表能请求数据。
- 翻页触发新 query。
- loading / error / empty 状态可见。

### Phase 4: Search Form

- 从 columns 收集 search fields。
- 建立基于 `react-hook-form` 的内部 form controller。
- 实现 input / select / dateRange 的基础 renderer。
- submit / reset。
- 对外提供 `useDataViewSearchForm()` 操作 hook。
- search values 加入 query key。
- 搜索后回到第一页。

验收：

- `search.render: 'input'` 可搜索。
- `search.render: 'select'` 可使用静态 options。
- reset 后恢复默认查询。

### Phase 5: OptionsDispatcher 插件

- 落地 `@nausea/options-dispatcher` 核心 API。
- 创建 options dispatcher plugin。
- DataView select renderer 支持 `optionKey`。

验收：

- 多个 DataView 搜索项共享同一个 option query cache。
- `staleOptions(optionKey)` 后搜索下拉能刷新。

### Phase 6: Theme 与 Layout

- 提供默认 theme。
- 支持 `layout(ctx)` 覆盖整体结构。
- 支持 `slots`。
- 支持 `components` 覆盖内部组件。
- 明确 `theme.components` 的最小协议。

验收：

- 用户可以把 searchForm 包进自己的 Card。
- 用户可以插入 footer / toolbarExtra。

### Phase 7: 文档与示例

- 在 docs 中加入 DataView 示例页面。
- 写 README：配置、列定义、请求、搜索、插槽、插件。
- 写 CHANGELOG。

验收：

- 新用户可以只看文档完成一个用户管理列表页。

## 15. 第一版非目标

这些能力有价值，但第一版先不做，避免设计过早复杂化。

- 虚拟滚动。
- 拖拽列排序。
- 服务端保存列设置。
- URL 状态同步。
- 高级筛选构建器。
- 批量编辑。
- 无限滚动。
- 内置权限系统。
- 内置 action 确认弹窗、权限、隐藏、禁用规则。
- 内置具体 UI 框架，如 Ant Design、shadcn/ui。
- SSR 兼容策略。

## 16. 已确认答复与剩余开放问题

已确认：

- `@nausea/table` 保持无样式 headless。
- `@nausea/data-view` core 保持无样式 headless。
- `preset` 改名为 `theme`，例如 `beautifulTheme`、`defaultTheme`。
- `theme` 可以包含 table、searchForm、pagination 等具体组件实现。
- `api` 不做类型和语义约束，由用户在 config 中自行解释。
- 搜索表单由内部 form controller 管理，对外暴露 hook 操作。
- action column 第一版只保留高度自定义入口，不内置确认、权限、隐藏、禁用规则。
- 暂不考虑 SSR。

剩余开放：

- `theme.components` 的最小组件协议如何定义，才能既强大又不笨重？
- `beautifulTheme` 是否作为独立入口导出，还是作为独立包发布？
- `@nausea/data-view` 是否要依赖 `react-hook-form`，还是让使用搜索表单的 theme 依赖它？
- action column 是放在 `@nausea/table` 的 helper 中，还是作为 DataView column helper 的能力？
- `api` 如果是 `unknown`，是否需要提供 `defineDataViewConfig<TApi>()` 来增强用户侧类型？

## 17. 当前推荐结论

第一版最稳妥的路线：

1. 先把 `@nausea/table` 做成可靠的底层表格。
2. 再让 `@nausea/data-view` 组合 table、query、search、layout。
3. `OptionsDispatcher` 作为 options 注册层，不和 DataView 强绑定，通过 plugin 集成。
4. `defineDataViewConfig()` 只做类型辅助，配置通过 Provider 注入。
5. 避免使用 React 特殊 prop `key`，改用 `resourceKey`。
6. 使用 `theme` 承载具体 UI 实现，DataView core 保持 headless。
7. 搜索表单内部使用 form controller，对外通过 hook 操作。
8. 先定义明确 slots，再把极少数特殊场景留给 `slots.custom`。

这样 DataView 会保持一个清晰边界：它是后台列表页状态与渲染协议的组合器，而不是新的状态管理库，也不是强 UI 框架。
