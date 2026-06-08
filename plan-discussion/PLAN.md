# DataView 0 到 1 实现计划

## 0. 目标

把 `nausea` 从当前的早期包骨架推进到一套可用的中后台列表页基础设施：

- `@nausea/table` 提供可靠的 headless 表格增强能力。
- `@nausea/form` 提供对象配置化表单能力，内部封装 RHF。
- `@nausea/options-dispatcher` 提供 options 注册、查询、刷新能力。
- `@nausea/options-dispatcher-plugin` 将 options 能力接入 form / DataView。
- `@nausea/data-view` 组合 table、form、query、layout、theme，形成可落地的列表页组件。

第一版目标不是覆盖所有高级后台功能，而是建立稳定边界、类型协议和最小可用工作流。

## 1. 总体路线

实现顺序遵循从底层到组合层的路径：

```txt
table
  -> form
  -> options-dispatcher
  -> data-view query
  -> data-view search
  -> options-dispatcher-plugin
  -> theme/layout
  -> docs/examples
```

不建议一开始直接写 DataView 大组件。先让底层包具备独立使用价值，再让 DataView 作为组合器自然长出来。

## 2. Phase 1: 包骨架与导出基线

目标：所有计划内包可以被 TypeScript 和 rollup 识别，导出入口稳定。

范围：

- 完成 `@nausea/form`、`@nausea/data-view`、`@nausea/options-dispatcher-plugin` 的最小 package 配置。
- 给每个包的 `src/index.ts` 建立导出骨架。
- 让空实现阶段也能清楚地区分协议、core、theme、plugin 目录。
- 校正 rollup 当前只构建包根入口的问题，后续需要支持 theme subpath entry。

验收：

- `pnpm lint` 不因空目录或导出文件报错。
- `pnpm build` 至少能构建已有根入口。
- 新包的 `package.json` 是有效 JSON。
- 不引入具体 UI 库依赖。

注意：

- 如果 `@nausea/data-view/themes/beautiful` 等 subpath 入口要发布，rollup 配置需要支持多入口构建。
- `package.json` 不要留空。

## 3. Phase 2: `@nausea/table` 最小可用

目标：table 包先独立成立，不依赖 DataView。

核心能力：

- `createTableHelper<T>()`
- column 定义辅助
- column meta 类型扩展
- cell fallback
- cell formatter / renderer 协议
- loading / empty / error 状态协议
- pagination / sorting / selection 状态类型
- action column helper

推荐目录优先级：

```txt
packages/table/src/types
packages/table/src/column
packages/table/src/actions
packages/table/src/cell
packages/table/src/core
```

验收：

- 可以用 `@nausea/table` 渲染一份静态数据表。
- action column 可以在 table 独立使用时工作。
- table 不依赖 `@nausea/data-view`。
- table 不依赖具体 UI 库。

测试重点：

- helper 类型推导。
- action column 生成结果。
- fallback / formatter / renderer 优先级。

## 4. Phase 3: `@nausea/form` 最小可用

目标：对象配置化表单先独立成立，内部自包含 RHF，但不把主 API 设计成 RHF API。

核心能力：

- `defineFormSchema()`
- object schema / field schema
- field renderer registry
- form controller
- `submit()`
- `reset()`
- `watch()`
- `setValue()`
- `getValues()`
- value transform
- 空值清理
- option field 协议

推荐目录优先级：

```txt
packages/form/src/schema
packages/form/src/core
packages/form/src/fields
packages/form/src/actions
packages/form/src/transform
packages/form/src/theme
```

验收：

- 可以通过对象 schema 渲染一组 controlled fields。
- 可以不暴露 RHF 细节完成 submit / reset / setValue。
- field renderer 可以由 theme 注入。
- `optionKey` 只作为协议存在，不直接依赖 options-dispatcher。

测试重点：

- default values。
- reset 行为。
- transform / cleanup。
- renderer registry fallback。

## 5. Phase 4: `@nausea/options-dispatcher`

目标：options 能力独立成立，解决 select 等字段的选项来源问题。

核心能力：

- `OptionsDispatcher.register()`
- `useOptions()`
- `useOptionsQuery()`
- `staleOptions()`
- static options
- remote options
- query key 标准化

验收：

- 多处调用同一个 `optionKey` 可以共享 query cache。
- `staleOptions(optionKey)` 后相关 options 可以刷新。
- options-dispatcher 不关心 UI 渲染。

测试重点：

- registry 行为。
- query key 稳定性。
- stale / refresh。

## 6. Phase 5: DataView Query Core

目标：DataView 先跑通请求、分页、表格组合，不急着接搜索表单。

核心能力：

- `DataView`
- `defineDataViewConfig()`
- `DataViewConfigProvider`
- `resourceKey`
- `api`
- page-level `request`
- global `config.api.request`
- query key 组织
- request params 标准化
- response 标准化为 `{ data, total }`
- pagination 状态
- loading / error / empty 透传

验收：

- 可以渲染一个远程分页列表。
- 翻页会触发新的 query。
- `request` 优先级高于全局 `api.request`。
- `api` 保持 `unknown`，暂不引入 `defineDataViewConfig<TApi>()`。

测试重点：

- query key 内容。
- request 优先级。
- pageIndex 从 0 开始。
- response normalize。

## 7. Phase 6: DataView Search + Form 集成

目标：让 DataView 从 columns / search 配置生成 form schema，并通过 `@nausea/form` 管理字段状态。

核心能力：

- 从 columns 收集 `search` 字段。
- 转换为 `@nausea/form` schema。
- 建立搜索 form controller。
- `useDataViewSearchForm()`
- submit / reset。
- search values 进入 query key。
- 搜索后回到第一页。
- `search.transform` 下沉到 form transform。

验收：

- `search.render: 'input'` 可搜索。
- `search.render: 'select'` 可使用静态 options。
- `dateRange` 可以 transform 为请求字段。
- reset 后恢复默认查询。

测试重点：

- column search collection。
- submit 后 query params。
- reset 后 pagination。
- transform 输出。

## 8. Phase 7: OptionsDispatcher Plugin

目标：让 `optionKey` 通过插件接入 options-dispatcher，避免 DataView core 强绑定。

核心能力：

- `optionsDispatcherPlugin()`
- 识别 form field 上的 `optionKey`
- 将 `useOptions(optionKey)` 注入 select renderer
- 暴露 options loading / error 状态

验收：

- 多个 DataView 搜索项可以共享同一个 options cache。
- `staleOptions(optionKey)` 后搜索下拉可以刷新。
- 不使用插件时，DataView core 仍可正常工作。

测试重点：

- plugin setup。
- option field resolve。
- loading state 传递。

## 9. Phase 8: Theme 与 Layout

目标：提供可用的默认布局和 `beautifulTheme` 入口，同时验证 theme adapter 边界。

核心能力：

- `DataViewTheme`
- region-level `DataViewComponents`
- `layout(ctx)`
- `slots`
- `theme.form`
- `theme.table`
- `theme.Provider`
- `@nausea/data-view/themes/default`
- `@nausea/data-view/themes/beautiful`

DataView components 只覆盖区域：

```txt
Root
Header
SearchRegion
Toolbar
Content
Pagination
Footer
Empty
Error
```

不在 DataView components 中定义：

- form field 内部组件。
- table cell / row / header cell。
- UI 库自己的状态控制。

验收：

- 用户可以使用默认 theme 渲染完整列表页。
- 用户可以从 `@nausea/data-view/themes/beautiful` 导入 `beautifulTheme`。
- `beautifulTheme` 可以组合 form/table theme slice。
- DataView core 不导入具体 UI 库。

测试重点：

- theme merge 优先级。
- slots 注入。
- layout override。
- Provider 包裹。

## 10. Phase 9: 文档与示例

目标：让新用户可以照着文档完成一个真实列表页。

文档示例：

- 静态 table。
- table action column。
- object form。
- options-dispatcher。
- DataView 远程分页。
- DataView 搜索表单。
- DataView + options-dispatcher plugin。
- DataView + beautifulTheme。

验收：

- docs 中至少有一个完整用户管理列表页。
- README 包含安装、配置、列定义、请求、搜索、theme、plugin 示例。
- `PLAN_DISCUSSION.md` 和 `DIRECTORY_STRUCTURE.md` 与实现保持同步。

## 11. 第一版明确不做

以下能力有价值，但不进入 0 到 1：

- URL query 同步。
- 权限系统。
- 列设置持久化。
- 高级筛选构建器。
- 虚拟滚动。
- 批量编辑。
- SSR 兼容策略。
- 内置 AntD / shadcn/ui 到 core。
- Vue 生态 Element UI 适配。

## 12. 推荐完成顺序

```txt
1. 整理 package skeleton 和 index exports
2. 完成 @nausea/table helper / action column / cell 协议
3. 完成 @nausea/form schema / controller / renderer registry
4. 完成 @nausea/options-dispatcher registry / hooks
5. 完成 DataView query core
6. 完成 DataView search + form 集成
7. 完成 options-dispatcher-plugin
8. 完成 defaultTheme / beautifulTheme
9. 完成 docs examples
10. 再评估 URL state、权限、列设置等插件
```

## 13. 每个阶段的完成定义

每个阶段完成时至少满足：

- 有导出的 public API。
- 有最小示例。
- 有对应 README 或 docs 片段。
- 有关键类型测试或单元测试。
- 没有把 UI 库依赖引入 core。
- 没有让低层包依赖高层包。
