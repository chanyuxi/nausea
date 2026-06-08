import { QueryClient } from '@tanstack/react-query'

import { createRemoteOptions } from '../sources/remote-options'
import { createStaticOptions } from '../sources/static-options'
import type { Option } from '../types/option'
import { OptionsDispatcher } from './options-dispatcher'
import { staleOptions } from './stale-options'

type UserStatus = 'disabled' | 'enabled'

interface UserStatusParams {
  tenantId: string
}

const userStatusOptions = createStaticOptions<UserStatus>([
  {
    label: 'Enabled',
    value: 'enabled',
  },
  {
    label: 'Disabled',
    value: 'disabled',
  },
])

const remoteUserStatusOptions = createRemoteOptions<
  UserStatus,
  UserStatusParams
>(async ({ params, signal }) => {
  void signal

  if (!params?.tenantId) {
    return []
  }

  return userStatusOptions.options
})

const dispatcher = new OptionsDispatcher()
  .register('user.status.static', userStatusOptions)
  .register('user.status.remote', remoteUserStatusOptions)

async function resolveUserStatusOptions() {
  const options = await dispatcher.resolve<UserStatus>({
    optionKey: 'user.status.static',
  })

  return options satisfies readonly Option<UserStatus>[]
}

function staleEveryUserStatusCache(queryClient: QueryClient) {
  return staleOptions(queryClient, 'user.status.remote')
}

void resolveUserStatusOptions
void staleEveryUserStatusCache
