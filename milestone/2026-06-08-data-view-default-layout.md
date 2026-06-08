# DataView 默认布局与主题协议

- 清理 layout/theme/component 重复声明，恢复单份实现。
- 接入区域级 `DataViewComponents`、`slots`、`classNames` 与默认布局。
- `DataViewTheme` 预留 `form` / `table` opaque slice，避免 core 绑定具体 UI 或未稳定包类型。
- 区域组件只接收必要 action/state，避免把业务搜索泛型泄漏到默认 UI 协议。
- 验证：`pnpm --config.minimumReleaseAge=0 lint` 通过；rollup 构建通过。
