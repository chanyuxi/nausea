# Form 用例与类型守门

- 新增 `UserSearchFormExample` 编译期用例，覆盖 schema、renderer registry、Provider、FieldController、submit 与 transform。
- 示例组件保持非 public export，避免 d.ts bundler 展开复杂示例类型。
- 对示例文件局部关闭 fast-refresh 规则；该文件仅承担类型守门职责。
- 验证：rollup 构建通过；`pnpm --config.minimumReleaseAge=0 lint` 通过。
