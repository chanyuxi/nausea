# DataView 目录结构草案

## 0. 说明

这份文档描述的是基于 `PLAN_DISCUSSION.md` 的目标目录结构，不代表当前仓库已经全部实现。

核心原则：

- core 包保持 headless，不直接依赖 `nausea-ui`、Ant Design、shadcn/ui、Element UI 等具体 UI 库。
- `theme` 是 UI runtime adapter，不只是颜色皮肤。
- DataView 只组合 table、form、query、layout，不接管 table action、form field 或 UI 库状态。
- action column 放在 `@nausea/table` helper 中。
- `api` 继续保持 `unknown`，暂不增加 `defineDataViewConfig<TApi>()`。
- `beautifulTheme` 第一版作为独立入口导出，例如 `@nausea/data-view/themes/beautiful`。

## 1. 顶层包结构

```txt
packages/
  table/
  form/
  options-dispatcher/
  options-dispatcher-plugin/
  data-view/

docs/
  src/
    examples/
      data-view/
      table/
      form/

plan-discussion/
  PLAN_DISCUSSION.md
  DIRECTORY_STRUCTURE.md
```

职责方向：

```txt
@nausea/table
  -> TanStack Table

@nausea/form
  -> React Hook Form

@nausea/options-dispatcher
  -> TanStack Query

@nausea/data-view
  -> @nausea/table
  -> @nausea/form
  -> TanStack Query

@nausea/options-dispatcher-plugin
  -> @nausea/data-view
  -> @nausea/form
  -> @nausea/options-dispatcher
```

禁止反向依赖：

```txt
@nausea/table  不依赖 @nausea/data-view
@nausea/form   不依赖 @nausea/data-view
core 包        不依赖具体 UI 库
```

## 2. `@nausea/table`

底层 headless 表格增强包，负责 TanStack Table 封装、column 类型扩展、cell 协议和 action column helper。

```txt
packages/table/
  package.json
  README.md
  CHANGELOG.md
  src/
    index.ts

    core/
      create-table.ts
      table-instance.ts
      table-state.ts

    column/
      column-def.ts
      column-meta.ts
      create-table-helper.ts

    actions/
      action-column.ts
      action-types.ts
      create-action-column.ts

    cell/
      fallback.ts
      formatters.ts
      renderers.ts

    state/
      loading.ts
      empty.ts
      error.ts
      pagination.ts
      sorting.ts
      selection.ts

    theme/
      table-theme.ts
      table-components.ts
      table-class-names.ts

    types/
      column.ts
      enums.ts
      index.ts
```

说明：

- `actions/` 是 table 能力，不放入 `data-view`。
- `theme/` 只放 table theme 协议类型，不放具体 UI 库实现。
- 如果后续要提供 table 独立 UI theme，可以追加 `src/themes/default` 这类独立入口。

## 3. `@nausea/form`

对象配置化表单包，内部自包含 RHF，包外主 API 不围绕 RHF 类型设计。

```txt
packages/form/
  package.json
  README.md
  CHANGELOG.md
  src/
    index.ts

    core/
      create-form.ts
      form-controller.ts
      form-context.tsx
      form-provider.tsx

    schema/
      define-form-schema.ts
      field-schema.ts
      object-schema.ts
      normalize-schema.ts

    fields/
      field-controller.tsx
      field-renderer.tsx
      field-registry.ts
      field-state.ts

    actions/
      submit.ts
      reset.ts
      watch.ts
      values.ts

    transform/
      transform-values.ts
      cleanup-empty-values.ts

    validation/
      validation-adapter.ts
      validation-types.ts

    options/
      option-field.ts
      option-types.ts

    theme/
      form-theme.ts
      form-components.ts
      form-field-renderers.ts
      form-class-names.ts

    hooks/
      use-form-controller.ts
      use-form-field.ts
```

说明：

- `@nausea/form` 负责字段状态和 form controller。
- DataView 只把 search 配置转换成 form schema，并管理提交后的查询状态。
- `options/` 只定义 `optionKey` / `options` 协议，不直接依赖 `@nausea/options-dispatcher`。

## 4. `@nausea/options-dispatcher`

选项注册与访问层，独立于 DataView 和 Form。

```txt
packages/options-dispatcher/
  package.json
  README.md
  CHANGELOG.md
  src/
    index.ts

    core/
      options-dispatcher.ts
      registry.ts
      stale-options.ts

    query/
      use-options.ts
      use-options-query.ts
      query-key.ts

    sources/
      static-options.ts
      remote-options.ts
      realtime-options.ts

    types/
      option.ts
      option-source.ts
      index.ts
```

说明：

- 不负责 Select UI 渲染。
- 不负责 DataView 搜索表单布局。

## 5. `@nausea/options-dispatcher-plugin`

把 `@nausea/options-dispatcher` 接入 `@nausea/data-view` / `@nausea/form` 的插件包。

```txt
packages/options-dispatcher-plugin/
  package.json
  README.md
  CHANGELOG.md
  src/
    index.ts

    data-view-plugin.ts
    form-option-renderers.ts
    resolve-option-field.ts
    option-loading-state.ts
```

说明：

- 负责识别 form field 上的 `optionKey`。
- 负责把 `useOptions(optionKey)` 接入 select / multiSelect renderer。
- 不让 DataView core 强绑定 options-dispatcher。

## 6. `@nausea/data-view`

中后台列表页组合层，负责 query、pagination、search、table、layout 和 theme 合并。

```txt
packages/data-view/
  package.json
  README.md
  CHANGELOG.md
  src/
    index.ts

    data-view.tsx

    config/
      define-data-view-config.ts
      data-view-config-provider.tsx
      resolve-data-view-config.ts
      default-config.ts

    core/
      data-view-context.tsx
      data-view-state.ts
      data-view-actions.ts
      create-data-view.ts

    query/
      data-view-query-key.ts
      data-view-request.ts
      normalize-response.ts
      use-data-view-query.ts

    search/
      collect-search-fields.ts
      create-search-form-schema.ts
      search-field.ts
      search-state.ts
      use-data-view-search-form.ts

    table/
      create-data-view-columns.ts
      use-data-view-table.ts

    layout/
      data-view-layout.tsx
      data-view-layout-context.ts
      slots.ts

    components/
      root.tsx
      header.tsx
      search-region.tsx
      toolbar.tsx
      content.tsx
      pagination.tsx
      footer.tsx
      empty.tsx
      error.tsx

    theme/
      data-view-theme.ts
      data-view-components.ts
      data-view-class-names.ts
      resolve-theme.ts

    plugins/
      plugin.ts
      plugin-context.ts
      apply-plugins.ts

    hooks/
      use-data-view.ts
      use-data-view-actions.ts
      use-data-view-state.ts

    types/
      props.ts
      request.ts
      response.ts
      slots.ts
      index.ts

    themes/
      default/
        index.ts
        default-theme.tsx
        default-layout.tsx

      beautiful/
        index.ts
        beautiful-theme.tsx
        beautiful-provider.tsx
        beautiful-data-view-theme.tsx
        beautiful-form-theme.tsx
        beautiful-table-theme.tsx
        components/
          root.tsx
          header.tsx
          search-region.tsx
          toolbar.tsx
          content.tsx
          pagination.tsx
          footer.tsx
          empty.tsx
          error.tsx

      antd/
        README.md
        index.ts
        antd-theme.tsx
        antd-provider.tsx
        antd-data-view-theme.tsx
        antd-form-theme.tsx
        antd-table-theme.tsx
```

说明：

- `theme/` 放 DataView theme 协议。
- `themes/` 放具体 theme 实现。
- `themes/beautiful` 可以依赖 `nausea-ui`。
- `themes/antd` 是后续可选适配入口，可以依赖 AntD。
- DataView core 不直接依赖 `nausea-ui` 或 AntD。
- Vue 生态的 Element UI / Element Plus 不能直接放进 React 版 DataView theme，除非有 React wrapper、Web Components 或单独 Vue renderer。

## 7. Theme slice 约定

DataView 的 theme 入口负责组合三个 slice：

```txt
DataViewTheme
  data-view region components
  form theme slice
  table theme slice
  optional UI Provider
```

建议类型形态：

```ts
interface DataViewTheme {
  name: string
  Provider?: React.ComponentType<{ children: React.ReactNode }>
  layout?: DataViewLayout<any, any>
  components?: Partial<DataViewComponents>
  form?: FormTheme
  table?: TableTheme
  classNames?: Partial<DataViewClassNames>
}
```

DataView components 只覆盖列表页区域：

```ts
interface DataViewComponents {
  Root: React.ComponentType<DataViewRootProps>
  Header: React.ComponentType<DataViewHeaderProps>
  SearchRegion: React.ComponentType<DataViewSearchRegionProps>
  Toolbar: React.ComponentType<DataViewToolbarProps>
  Content: React.ComponentType<DataViewContentProps>
  Pagination: React.ComponentType<DataViewPaginationProps>
  Footer: React.ComponentType<DataViewFooterProps>
  Empty: React.ComponentType<DataViewEmptyProps>
  Error: React.ComponentType<DataViewErrorProps>
}
```

不要把这些内容塞进 DataView components：

- form 的 `Label`、`Control`、`FieldError`。
- table 的 `Cell`、`HeaderCell`、`Row`。
- AntD Form / AntD Table 的内部状态控制。

## 8. 导出入口建议

### `@nausea/table`

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./helpers": "./dist/helpers/index.js"
  }
}
```

### `@nausea/form`

```json
{
  "exports": {
    ".": "./dist/index.js"
  }
}
```

### `@nausea/data-view`

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./themes/default": "./dist/themes/default/index.js",
    "./themes/beautiful": "./dist/themes/beautiful/index.js",
    "./themes/antd": "./dist/themes/antd/index.js"
  }
}
```

说明：

- `./themes/antd` 可以先保留为规划，不一定第一版实现。
- 如果 theme 入口引入具体 UI 库，相关依赖应尽量通过 peerDependencies 或独立入口隔离。

## 9. 实现阶段对应关系

```txt
Phase 1: package skeleton
  packages/data-view
  packages/form
  packages/options-dispatcher-plugin

Phase 2: table core
  packages/table/src/core
  packages/table/src/column
  packages/table/src/actions
  packages/table/src/cell

Phase 3: data-view query
  packages/data-view/src/config
  packages/data-view/src/query
  packages/data-view/src/core

Phase 4: search form
  packages/form/src/core
  packages/form/src/schema
  packages/form/src/fields
  packages/data-view/src/search

Phase 5: options dispatcher plugin
  packages/options-dispatcher/src
  packages/options-dispatcher-plugin/src

Phase 6: theme and layout
  packages/data-view/src/layout
  packages/data-view/src/theme
  packages/data-view/src/themes/default
  packages/data-view/src/themes/beautiful

Phase 7: docs and examples
  docs/src/examples/data-view
  docs/src/examples/table
  docs/src/examples/form
```

## 10. 第一版不建议创建的目录

这些目录可以后续再加，第一版先不急：

```txt
packages/data-view/src/url-state/
packages/data-view/src/permissions/
packages/data-view/src/column-settings/
packages/data-view/src/advanced-filter/
packages/data-view/src/virtual-scroll/
packages/data-view/src/batch-edit/
```

原因：

- 它们属于后续插件或高级能力。
- 太早加入会让第一版目录显得已经承诺这些功能。
- 当前重点是 table、form、query、layout、theme adapter 的稳定边界。
