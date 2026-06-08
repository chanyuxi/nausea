# DataView controller

- 变更：实现 DataView state/actions/context/provider 和 `DataView` 极薄组件。
- 原因：把 query core 接到可用的页面 controller，串起 resourceKey、search、pagination、sorting、filters 和请求优先级。
- 影响：`@nausea/data-view` 现在可以作为受控列表页容器使用，后续只需接入 layout/theme 即可渲染完整页面。
- 验证：`pnpm --config.minimumReleaseAge=0 lint` 通过；本地 rollup 通过，剩余只有空占位包的 empty chunk 警告。
