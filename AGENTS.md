# Nausea 项目核心目标

`nausea` 的目标是提供一套面向中后台管理系统的 React 工具包，把常见后台页面里的 table、form、options、query、layout、theme 组合成稳定、类型友好、可插拔的基础设施。

## 核心包边界

- `@nausea/table`：headless 表格增强包，基于 TanStack Table，负责 column helper、cell 协议、状态协议和 action column helper。
- `@nausea/form`：对象配置化表单包，内部封装 React Hook Form，负责 form schema、field renderer registry、form controller 和值转换。
- `@nausea/options-dispatcher`：options 注册与访问层，负责 option source、query cache、stale / refresh。
- `@nausea/options-dispatcher-plugin`：把 options-dispatcher 接入 form / DataView 的插件包。
- `@nausea/data-view`：中后台列表页组合层，组合 table、form、query、layout、theme 和 plugin。

## 架构原则

- core 包保持 headless，不直接依赖具体 UI 库。
- `theme` 是 UI runtime adapter，不只是颜色皮肤。
- DataView 只定义列表页区域级组件，不定义 form field 或 table cell 的底层组件协议。
- form field 由 `@nausea/form` 和 form theme slice 管理。
- table cell / action column 由 `@nausea/table` 和 table theme slice 管理。
- DataView 管理提交后的查询状态、分页、排序、请求触发，不接管 RHF 或 UI 库内部状态。
- `api` 保持 `unknown`，暂不增加 `defineDataViewConfig<TApi>()`。
- `beautifulTheme` 作为独立入口导出，例如 `@nausea/data-view/themes/beautiful`。

## 依赖方向

允许：

```txt
@nausea/data-view -> @nausea/table
@nausea/data-view -> @nausea/form
@nausea/data-view -> @tanstack/react-query
@nausea/form -> react-hook-form
@nausea/table -> @tanstack/react-table
@nausea/options-dispatcher -> @tanstack/react-query
```

禁止：

```txt
@nausea/table -> @nausea/data-view
@nausea/form -> @nausea/data-view
core packages -> nausea-ui / Ant Design / shadcn/ui / Element UI
```

## 实现纪律

- 不要为了 DataView 方便把通用能力塞进 DataView；能独立属于 table/form/options 的能力应放回底层包。
- 不要让 AntD Form、AntD Table 或其他 UI 库接管核心状态；UI 库只能作为 renderer / adapter。
- 不要在第一版提前实现 URL state、权限、列设置、高级筛选、虚拟滚动、批量编辑或 SSR。
- 新增目录时同步 `plan-discussion/DIRECTORY_STRUCTURE.md`。
- 变更核心路线时同步 `plan-discussion/PLAN_DISCUSSION.md` 和 `plan-discussion/PLAN.md`。
- 每次变更后写入对应的 `milestone/*.md`，内容保持精炼，只记录关键改动、原因和后续影响。
