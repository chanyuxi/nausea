# DataView query hook

- 变更：实现 `useDataViewQuery`，接入 React Query、DataView query key、request 执行和取消信号。
- 原因：让 DataView query core 从纯函数协议推进到可被 React 组件使用的 hook。
- 影响：`@nausea/data-view` 声明 React Query / React peer，并更新 lockfile 安装状态。
- 验证：`pnpm --config.minimumReleaseAge=0 lint` 通过；本地 rollup 通过，剩余告警来自 rollup 配置缺 Node 类型和空占位包。
