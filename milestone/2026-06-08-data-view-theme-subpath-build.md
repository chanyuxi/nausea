# DataView theme 子入口构建

- rollup 改为根据 package exports 生成入口产物，支持 nested subpath。
- `@nausea/data-view/themes/default` 与 `@nausea/data-view/themes/beautiful` 现在生成独立 JS / d.ts。
- `beautifulTheme` 先以轻量 theme bundle 落地，复用默认布局和区域组件，预留 form / table slice。
- 暂移除未实现的 `./themes/antd` package export，避免发布空适配入口。
- 验证：rollup 构建通过；`pnpm --config.minimumReleaseAge=0 lint` 通过。
