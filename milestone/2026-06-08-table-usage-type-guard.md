# Table 用例与类型守门

- 新增 `UserTableExample` 编译期用例，覆盖 helper、action column、formatter、renderer 与默认 `Table`。
- 修正异构 columns 集合类型，保留单列 TValue 推导，同时允许数组汇总不同 TValue。
- 修正 formatter 示例返回 `ReactNode`，避免 `unknown` 泄漏到渲染层。
- 验证：`pnpm --config.minimumReleaseAge=0 lint` 通过；rollup 构建通过。
