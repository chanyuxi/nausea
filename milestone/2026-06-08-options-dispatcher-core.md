# Options Dispatcher Core

- 补齐 `@nausea/options-dispatcher` 根出口，开放 source helper、registry、dispatcher、query hook 和 stale helper。
- 标准化 options query key：无 params 时使用短 key，便于 `staleOptions(optionKey)` 刷新同一 optionKey 的全部缓存变体。
- 增加 `NormalizedOptionSource` 与精简的 `UseOptionsResult`，减少用户侧直接承受内部联合类型和 React Query 返回类型的成本。
- 为 hook / stale helper 补充显式返回类型，避免声明文件暴露不稳定的推断结果。
- 增加类型使用示例，验证 static / remote source 与 dispatcher 的泛型边界。
