# Table 核心 helper

- `@nausea/table` 增加最小无样式 `Table` 组件，支持静态数据、loading / empty / error。
- 增加 column meta、cell fallback / formatter / renderer 协议。
- 增加 `createTableHelper<T>()` 与 table 侧 `actionColumn` helper。
- 移除 table 包对 React Query 的依赖声明，保持 table 不关心请求层。
- 验证：rollup 构建通过；`pnpm --config.minimumReleaseAge=0 lint` 通过。
