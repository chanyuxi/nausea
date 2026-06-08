# Form schema/controller 核心

- `@nausea/form` 接入 `react-hook-form`，但公开 API 收敛为 Nausea schema/controller。
- 增加 `defineFormSchema()`、schema normalize、value transform 与 empty cleanup。
- 增加 `useCreateForm()`、`FormProvider`、controller context、field renderer registry。
- 增加默认 input renderer、`FieldRenderer`、`FieldController` 与常用 action hooks。
- 控制公开 controller 类型面，避免 RHF 巨型类型泄漏导致 d.ts 构建卡死。
- 验证：rollup 构建通过；`pnpm --config.minimumReleaseAge=0 lint` 通过。
