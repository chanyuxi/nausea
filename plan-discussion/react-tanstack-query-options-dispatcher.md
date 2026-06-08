# React + TanStack Query OptionsDispatcher 设计文档

## 1. 背景

在中后台 React 项目中，`Select`、`TreeSelect`、`RadioGroup`、`CheckboxGroup` 等组件经常需要使用选项集，例如：

- 系统角色
- 国家 / 地区
- 商户状态
- 支付渠道
- 启用 / 禁用
- 是 / 否
- 风控等级
- 业务类型

如果每个页面都自己请求、转换、缓存这些 options，项目会逐渐出现以下问题：

1. **数据源分散**  
   同一个 options 可能在多个页面重复请求和重复转换。

2. **请求重复**  
   多个 Select 使用同一个接口时，容易产生重复请求。

3. **刷新困难**  
   新增、编辑、删除某类资源后，不清楚应该刷新哪些 Select。

4. **静态枚举和远程枚举混杂**  
   一些 options 是固定枚举，一些 options 来自接口，如果没有统一抽象，组件层会变得混乱。

5. **组件职责过重**  
   组件本应只关心展示，但实际还承担了接口请求、字段映射、缓存策略等职责。

因此可以引入一个 `OptionsDispatcher`，用于为项目中的所有 Select 提供实时、共享、可复用的 options 管理能力。

---

## 2. 核心思想

`OptionsDispatcher` 不应该自己实现一套缓存和订阅系统。

更合理的定位是：

> `OptionsDispatcher` 是 TanStack Query 之上的 options 注册层和访问层。

也就是说：

- TanStack Query 负责：
  - 缓存
  - 请求去重
  - 订阅更新
  - 失效刷新
  - 后台 refetch
  - `select` 派生

- OptionsDispatcher 负责：
  - 统一注册 options
  - 统一维护 options key
  - 统一管理静态 / 远程 / 实时选项
  - 给业务组件提供简单的 `useOptions()` API
  - 给业务逻辑提供统一的 `staleOptions()` API

整体关系如下：

```txt
业务组件
  ↓
useOptions('system_roles')
  ↓
OptionsDispatcher
  ↓
TanStack Query
  ↓
接口 / 静态枚举
```

---

## 3. 设计目标

### 3.1 统一注册

可以在一个文件中集中注册所有 options：

```ts
// src/options/registry.ts
registerOptions()
```

例如：

```ts
OptionsDispatcher.register('system_roles', {
  strategy: 'realtime',
  get: fetchSystemRoles,
})

OptionsDispatcher.register('role_status', {
  strategy: 'static',
  get: () => [
    { label: '启用', value: 'enabled' },
    { label: '禁用', value: 'disabled' },
  ],
})
```

### 3.2 任意使用

在项目任意组件中使用：

```tsx
const options = useOptions('system_roles')

return <Select options={options} />
```

### 3.3 共享缓存

多个组件使用同一个 key：

```tsx
useOptions('system_roles')
```

它们共享同一份 TanStack Query cache，不会重复维护状态。

### 3.4 主动失效

当新增、编辑、删除某类数据后：

```ts
await staleOptions('system_roles')
```

所有正在使用 `system_roles` 的组件都会感知到数据失效，并触发刷新。

### 3.5 支持派生

不同页面可以基于同一份 options 做不同过滤：

```tsx
const enabledRoles = useOptions('system_roles', {
  select: options => options.filter(item => !item.disabled),
})
```

---

## 4. 推荐目录结构

建议不要只放一个大文件，初期可以简单，后期应按职责拆分：

```txt
src/
  options/
    index.ts
    keys.ts
    types.ts
    dispatcher.ts
    registry.ts
    hooks.ts
```

职责说明：

```txt
keys.ts        统一维护 option key
types.ts       统一维护 option 类型
dispatcher.ts  封装 TanStack Query
registry.ts    统一注册所有 options
hooks.ts       对外暴露 useOptions / useOptionsQuery
index.ts       对外统一导出
```

如果项目后期 options 很多，可以继续按业务域拆分：

```txt
src/options/
  registry.ts
  registries/
    system.ts
    merchant.ts
    payment.ts
    risk.ts
```

---

## 5. Option Key 设计

不要在业务组件里到处写字符串。建议集中维护：

```ts
// src/options/keys.ts
export const optionKeys = {
  systemRoles: 'system_roles',
  roleStatus: 'role_status',
  yesNo: 'yes_no',
  countries: 'countries',
} as const

export type OptionKey = typeof optionKeys[keyof typeof optionKeys]
```

使用：

```tsx
const options = useOptions(optionKeys.systemRoles)
```

这样比直接写字符串更安全，也便于重构。

---

## 6. Option 类型设计

```ts
// src/options/types.ts
export interface BaseOption<V = string> {
  label: string
  value: V
  disabled?: boolean
}

export interface RoleOption extends BaseOption<string> {
  code: string
}

export interface CountryOption extends BaseOption<string> {
  iso2: string
}
```

为了让 key 和返回类型自动关联，可以定义 `OptionValueMap`：

```ts
export interface OptionValueMap {
  system_roles: RoleOption
  role_status: BaseOption<'enabled' | 'disabled'>
  yes_no: BaseOption<boolean>
  countries: CountryOption
}
```

这样可以实现：

```ts
const roles = useOptions('system_roles')
// 自动推导为 readonly RoleOption[]
```

---

## 7. Strategy 设计

建议使用以下策略名称：

```ts
type OptionStrategy = 'static' | 'remote' | 'realtime'
```

### 7.1 static

适用于本地固定枚举，不请求接口。

例如：

- 是 / 否
- 启用 / 禁用
- 固定状态
- 固定类型

```ts
OptionsDispatcher.register('yes_no', {
  strategy: 'static',
  get() {
    return [
      { label: '是', value: true },
      { label: '否', value: false },
    ]
  },
})
```

### 7.2 remote

适用于远程接口，但可以缓存一段时间。

例如：

- 国家列表
- 支付渠道列表
- 银行列表

```ts
OptionsDispatcher.register('countries', {
  strategy: 'remote',
  staleTime: 1000 * 60 * 60,
  get: fetchCountries,
})
```

### 7.3 realtime

适用于希望每次挂载时尽量获取最新数据的远程选项。

例如：

- 系统角色
- 可用权限
- 可选商户
- 动态业务配置

```ts
OptionsDispatcher.register('system_roles', {
  strategy: 'realtime',
  get: fetchSystemRoles,
})
```

不太建议使用 `everytime` 作为策略名，因为它容易被理解为“每次 render 都请求”。实际上更准确的语义是“每次挂载或失效后尽量获取最新数据”。

---

## 8. 核心实现示例

以下是一个可落地的 `OptionsDispatcher` 简化实现。

```tsx
// src/options/dispatcher.ts
import * as React from 'react'
import {
  QueryClient,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'

type Awaitable<T> = T | Promise<T>

export type OptionStrategy = 'static' | 'remote' | 'realtime'

export type OptionGetter<T> = (ctx: {
  key: string
  queryKey: readonly ['options', string]
  signal?: AbortSignal
}) => Awaitable<readonly T[]>

export interface RegisterOptions<T> {
  strategy: OptionStrategy
  get: OptionGetter<T>
  staleTime?: number
  gcTime?: number
  refetchInterval?: number | false
  refetchOnWindowFocus?: boolean | 'always'
  refetchOnReconnect?: boolean | 'always'
}

export interface UseOptionsConfig<T, R> {
  select?: (options: readonly T[]) => R
  enabled?: boolean
  placeholderData?: readonly T[]
}

interface InternalRegisterOptions<T> extends RegisterOptions<T> {
  staticData?: readonly T[]
}

const OPTIONS_QUERY_PREFIX = 'options'
const EMPTY_OPTIONS = Object.freeze([]) as readonly never[]

const registry = new Map<string, InternalRegisterOptions<any>>()

let boundQueryClient: QueryClient | null = null

function optionQueryKey(key: string) {
  return [OPTIONS_QUERY_PREFIX, key] as const
}

function isPromiseLike<T>(value: unknown): value is Promise<T> {
  return !!value && typeof (value as Promise<T>).then === 'function'
}

function freezeArray<T>(value: readonly T[]): readonly T[] {
  return Object.freeze([...value])
}

function getRegistered<T>(key: string): InternalRegisterOptions<T> {
  const item = registry.get(key)

  if (!item) {
    throw new Error(`[OptionsDispatcher] "${key}" has not been registered.`)
  }

  return item
}

function getClient(): QueryClient {
  if (!boundQueryClient) {
    throw new Error(
      '[OptionsDispatcher] QueryClient is not bound. Call OptionsDispatcher.bindQueryClient(queryClient) during app bootstrap.',
    )
  }

  return boundQueryClient
}

function materializeStaticData<T>(
  key: string,
  config: InternalRegisterOptions<T>,
): readonly T[] {
  if (config.staticData) return config.staticData

  const queryKey = optionQueryKey(key)
  const result = config.get({
    key,
    queryKey,
    signal: undefined,
  })

  if (isPromiseLike(result)) {
    throw new Error(
      `[OptionsDispatcher] static option "${key}" must return data synchronously.`,
    )
  }

  config.staticData = freezeArray(result)
  return config.staticData
}

async function runGetter<T>(
  key: string,
  config: InternalRegisterOptions<T>,
  signal?: AbortSignal,
): Promise<readonly T[]> {
  if (config.strategy === 'static') {
    return materializeStaticData(key, config)
  }

  const queryKey = optionQueryKey(key)

  const result = await config.get({
    key,
    queryKey,
    signal,
  })

  return freezeArray(result)
}

export function useOptionsQuery<T, R = readonly T[]>(
  key: string,
  config: UseOptionsConfig<T, R> = {},
): UseQueryResult<R, Error> {
  const queryClient = useQueryClient()

  React.useEffect(() => {
    if (!boundQueryClient) {
      boundQueryClient = queryClient
    }
  }, [queryClient])

  const registered = getRegistered<T>(key)

  const queryKey = optionQueryKey(key)

  const isStatic = registered.strategy === 'static'
  const isRealtime = registered.strategy === 'realtime'

  const initialData = isStatic
    ? materializeStaticData(key, registered)
    : undefined

  return useQuery<readonly T[], Error, R>({
    queryKey,
    queryFn: ({ signal }) => runGetter(key, registered, signal),

    enabled: config.enabled ?? true,

    initialData,
    placeholderData:
      config.placeholderData ?? (EMPTY_OPTIONS as readonly T[]),

    select: config.select,

    staleTime: isStatic
      ? Infinity
      : registered.staleTime ?? (isRealtime ? 0 : 1000 * 60 * 5),

    gcTime: isStatic ? Infinity : registered.gcTime,

    refetchOnMount: isStatic ? false : isRealtime ? 'always' : true,

    refetchOnWindowFocus: isStatic
      ? false
      : registered.refetchOnWindowFocus ?? isRealtime,

    refetchOnReconnect: isStatic
      ? false
      : registered.refetchOnReconnect ?? true,

    refetchInterval: registered.refetchInterval,
  })
}

export function useOptions<T, R = readonly T[]>(
  key: string,
  config: UseOptionsConfig<T, R> = {},
): R {
  const query = useOptionsQuery<T, R>(key, config)
  return query.data as R
}

class OptionsDispatcherCore {
  bindQueryClient = (queryClient: QueryClient) => {
    boundQueryClient = queryClient

    for (const [key, config] of registry) {
      if (config.strategy === 'static') {
        queryClient.setQueryData(
          optionQueryKey(key),
          materializeStaticData(key, config),
        )
      }
    }
  }

  register = <T,>(
    key: string,
    config: RegisterOptions<T>,
    options: {
      overwrite?: boolean
    } = {},
  ) => {
    if (registry.has(key) && !options.overwrite) {
      throw new Error(
        `[OptionsDispatcher] "${key}" has already been registered.`,
      )
    }

    const internalConfig: InternalRegisterOptions<T> = {
      ...config,
    }

    registry.set(key, internalConfig)

    if (config.strategy === 'static' && boundQueryClient) {
      boundQueryClient.setQueryData(
        optionQueryKey(key),
        materializeStaticData(key, internalConfig),
      )
    }
  }

  unregister = (key: string) => {
    registry.delete(key)

    boundQueryClient?.removeQueries({
      queryKey: optionQueryKey(key),
      exact: true,
    })
  }

  stale = async (key?: string) => {
    const queryClient = getClient()

    if (key) {
      await queryClient.invalidateQueries({
        queryKey: optionQueryKey(key),
        exact: true,
      })

      return
    }

    await queryClient.invalidateQueries({
      queryKey: [OPTIONS_QUERY_PREFIX],
    })
  }

  set = <T,>(key: string, options: readonly T[]) => {
    const queryClient = getClient()
    const data = freezeArray(options)

    const registered = registry.get(key)

    if (registered?.strategy === 'static') {
      registered.staticData = data
    }

    queryClient.setQueryData(optionQueryKey(key), data)
  }

  prefetch = async <T,>(key: string) => {
    const queryClient = getClient()
    const registered = getRegistered<T>(key)
    const isStatic = registered.strategy === 'static'
    const isRealtime = registered.strategy === 'realtime'

    return queryClient.fetchQuery({
      queryKey: optionQueryKey(key),
      queryFn: ({ signal }) => runGetter(key, registered, signal),
      staleTime: isStatic
        ? Infinity
        : registered.staleTime ?? (isRealtime ? 0 : 1000 * 60 * 5),
    })
  }

  has = (key: string) => {
    return registry.has(key)
  }
}

export const OptionsDispatcher = Object.assign(
  new OptionsDispatcherCore(),
  {
    use: useOptions,
    useQuery: useOptionsQuery,
  },
)

export function useOptionsDispatcher() {
  return OptionsDispatcher
}
```

---

## 9. 注册示例

```ts
// src/options/registry.ts
import { OptionsDispatcher } from './dispatcher'
import { optionKeys } from './keys'
import type { BaseOption, RoleOption, CountryOption } from './types'

export function registerOptions() {
  OptionsDispatcher.register<RoleOption>(optionKeys.systemRoles, {
    strategy: 'realtime',

    async get({ signal }) {
      const response = await fetch('/api/system/roles', { signal })

      if (!response.ok) {
        throw new Error('Failed to fetch system roles.')
      }

      const roles: Array<{
        id: string
        name: string
        code: string
        enabled: boolean
      }> = await response.json()

      return roles.map((role) => ({
        label: role.name,
        value: role.id,
        code: role.code,
        disabled: !role.enabled,
      }))
    },
  })

  OptionsDispatcher.register<BaseOption<'enabled' | 'disabled'>>(
    optionKeys.roleStatus,
    {
      strategy: 'static',

      get() {
        return [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' },
        ]
      },
    },
  )

  OptionsDispatcher.register<BaseOption<boolean>>(optionKeys.yesNo, {
    strategy: 'static',

    get() {
      return [
        { label: '是', value: true },
        { label: '否', value: false },
      ]
    },
  })

  OptionsDispatcher.register<CountryOption>(optionKeys.countries, {
    strategy: 'remote',
    staleTime: 1000 * 60 * 60,

    async get({ signal }) {
      const response = await fetch('/api/countries', { signal })

      if (!response.ok) {
        throw new Error('Failed to fetch countries.')
      }

      const countries: Array<{
        name: string
        code: string
        iso2: string
      }> = await response.json()

      return countries.map((country) => ({
        label: country.name,
        value: country.code,
        iso2: country.iso2,
      }))
    },
  })
}
```

---

## 10. App 初始化

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OptionsDispatcher } from './options/dispatcher'
import { registerOptions } from './options/registry'

const queryClient = new QueryClient()

OptionsDispatcher.bindQueryClient(queryClient)
registerOptions()

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
```

注意：

```ts
registerOptions()
```

不应该放在组件内部。它应该在应用启动阶段只执行一次。

---

## 11. 对外 Hooks

```ts
// src/options/hooks.ts
import { OptionsDispatcher } from './dispatcher'

export const useOptions = OptionsDispatcher.use
export const useOptionsQuery = OptionsDispatcher.useQuery

export function useOptionsDispatcher() {
  return OptionsDispatcher
}
```

业务组件使用：

```tsx
import { Select } from 'antd'
import { useOptions } from '@/options/hooks'
import { optionKeys } from '@/options/keys'

function RoleSelect() {
  const options = useOptions(optionKeys.systemRoles)

  return <Select options={options} />
}
```

---

## 12. 使用方式

### 12.1 基础使用

```tsx
const options = useOptions(optionKeys.systemRoles)

return <Select options={options} />
```

### 12.2 使用派生数据

```tsx
const enabledRoleOptions = useOptions(optionKeys.systemRoles, {
  select: options => {
    return options.filter(item => !item.disabled)
  },
})
```

建议复杂 `select` 使用 `useCallback` 保持引用稳定：

```tsx
const enabledRoleOptions = useOptions(optionKeys.systemRoles, {
  select: React.useCallback((options) => {
    return options.filter(item => !item.disabled)
  }, []),
})
```

### 12.3 需要 loading / error 状态

```tsx
const {
  data: options = [],
  isFetching,
  error,
} = useOptionsQuery(optionKeys.systemRoles)

return (
  <Select
    options={options}
    loading={isFetching}
    status={error ? 'error' : undefined}
  />
)
```

### 12.4 主动刷新

新增角色后：

```ts
await fetch('/roles/add', {
  method: 'POST',
  body: JSON.stringify(payload),
})

await OptionsDispatcher.stale(optionKeys.systemRoles)
```

或者封装为：

```ts
export const staleOptions = OptionsDispatcher.stale
```

使用：

```ts
await staleOptions(optionKeys.systemRoles)
```

### 12.5 在 mutation 中刷新

```tsx
import { useMutation } from '@tanstack/react-query'
import { OptionsDispatcher } from '@/options/dispatcher'
import { optionKeys } from '@/options/keys'

function useCreateRole() {
  return useMutation({
    mutationFn: async (payload: { name: string; code: string }) => {
      const response = await fetch('/roles/add', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to create role.')
      }

      return response.json()
    },

    onSuccess: async () => {
      await OptionsDispatcher.stale(optionKeys.systemRoles)
    },
  })
}
```

---

## 13. 进一步类型增强

为了避免调用方手动写错泛型，可以让 `useOptions()` 根据 key 自动推导类型。

```ts
// src/options/types.ts
export interface OptionValueMap {
  system_roles: RoleOption
  role_status: BaseOption<'enabled' | 'disabled'>
  yes_no: BaseOption<boolean>
  countries: CountryOption
}
```

```ts
// src/options/hooks.ts
import { OptionsDispatcher } from './dispatcher'
import type { OptionValueMap } from './types'

export function useOptions<K extends keyof OptionValueMap>(
  key: K,
): readonly OptionValueMap[K][] {
  return OptionsDispatcher.use<OptionValueMap[K]>(key)
}

export function useOptionsQuery<K extends keyof OptionValueMap>(
  key: K,
) {
  return OptionsDispatcher.useQuery<OptionValueMap[K]>(key)
}
```

增强后：

```tsx
const roles = useOptions('system_roles')
// roles 自动推导为 readonly RoleOption[]
```

---

## 14. 设计边界

### 14.1 registry 负责什么

`registry.ts` 适合负责：

```txt
接口请求
字段映射
基础缓存策略
基础 options 格式转换
```

例如：

```ts
return roles.map(role => ({
  label: role.name,
  value: role.id,
  code: role.code,
  disabled: !role.enabled,
}))
```

### 14.2 registry 不负责什么

`registry.ts` 不适合放入太多页面级业务逻辑，例如：

```txt
某个页面特有的过滤
某个表单字段的权限判断
某个流程中的临时拼接
某个弹窗里的特殊排序
```

这些应该放在组件的 `select` 里：

```tsx
const options = useOptions(optionKeys.systemRoles, {
  select: options => {
    return options.filter(item => canAssignRole(item.code))
  },
})
```

---

## 15. 常见风险与规避

### 15.1 registry 文件过大

初期可以统一放在 `src/options/registry.ts`。

后期应按业务域拆分：

```txt
src/options/registries/system.ts
src/options/registries/merchant.ts
src/options/registries/payment.ts
src/options/registries/risk.ts
```

然后统一注册：

```ts
export function registerOptions() {
  registerSystemOptions()
  registerMerchantOptions()
  registerPaymentOptions()
  registerRiskOptions()
}
```

### 15.2 register 被重复调用

`registerOptions()` 应只在应用启动时调用一次。

如果处于开发环境、HMR 或微前端环境，可以允许覆盖：

```ts
OptionsDispatcher.register(key, config, {
  overwrite: import.meta.env.DEV,
})
```

### 15.3 static 返回异步数据

`static` 必须同步返回固定数组。

错误示例：

```ts
OptionsDispatcher.register('roles', {
  strategy: 'static',
  async get() {
    return fetchRoles()
  },
})
```

如果来自接口，应使用 `remote` 或 `realtime`。

### 15.4 误解 realtime

`realtime` 不代表每次 render 都请求。

它的合理语义是：

```txt
每次挂载时尽量 refetch
失效后及时 refetch
多个使用方共享同一份 query cache
```

### 15.5 页面逻辑污染 registry

不要为了某个页面的特殊需求修改全局 options，否则会影响其他页面。

推荐：

```tsx
const options = useOptions(optionKeys.systemRoles, {
  select: pageSpecificFilter,
})
```

---

## 16. 最终推荐 API

### 16.1 注册

```ts
defineOptions({
  key: optionKeys.systemRoles,
  strategy: 'realtime',
  get: async ({ signal }) => {
    const roles = await roleApi.list({ signal })

    return roles.map(role => ({
      label: role.name,
      value: role.id,
      code: role.code,
      disabled: !role.enabled,
    }))
  },
})
```

### 16.2 使用

```tsx
const options = useOptions(optionKeys.systemRoles)
```

### 16.3 使用 query 状态

```tsx
const { data, isFetching, error } = useOptionsQuery(optionKeys.systemRoles)
```

### 16.4 失效刷新

```ts
await staleOptions(optionKeys.systemRoles)
```

### 16.5 预取

```ts
await prefetchOptions(optionKeys.systemRoles)
```

### 16.6 手动写入

```ts
setOptions(optionKeys.systemRoles, nextOptions)
```

---

## 17. 总体评价

这个设计是合理的，尤其适合 Select 密集的中后台项目。

它的价值在于：

1. **统一 options 数据源**
2. **减少重复请求**
3. **复用 TanStack Query 缓存能力**
4. **统一失效刷新入口**
5. **降低业务组件复杂度**
6. **让静态枚举和远程枚举有一致的访问方式**
7. **通过类型映射提升 TypeScript 安全性**

但需要明确一点：

> OptionsDispatcher 不应该成为新的状态管理库。它应该只是 options query definition 的注册表和访问层。

核心能力仍然应由 TanStack Query 提供。这样实现成本低，行为可预测，也不容易和 React Query 的机制冲突。
