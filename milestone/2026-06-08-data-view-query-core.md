# DataView query core

- 变更：补充 DataView 请求类型、响应标准化、query key、请求执行和 config helper。
- 原因：先建立 DataView query core，给后续分页、搜索和 React Query 集成提供稳定协议。
- 影响：`@nausea/data-view` 现在有可导出的请求协议骨架；UI、layout、React Query hook 仍待实现。
- 验证：直接运行本地 rollup 通过；剩余告警来自 rollup 配置缺 Node 类型和空占位包。
