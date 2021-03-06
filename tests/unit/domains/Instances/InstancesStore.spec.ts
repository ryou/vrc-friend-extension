import { Friend, Instance, InstancePermission, World } from '@/types'
import { IInstancesRepository } from '@/infras/Instances/IInstancesRepository'
import { InstanceApiResponse } from '@/types/ApiResponse'
import VueCompositionApi, { computed, reactive } from '@vue/composition-api'
import { createLocalVue } from '@vue/test-utils'
import { ICanGetWorldById } from '@/domains/Worlds/WorldsStore'
import { InstancesStore } from '@/domains/Instances/InstancesStore'

const localVue = createLocalVue()
localVue.use(VueCompositionApi)

const dummyFriendData: Friend = {
  location: '',
  id: '0',
  username: '0',
  displayName: '0',
  currentAvatarImageUrl: '',
  currentAvatarThumbnailImageUrl: '',
  isNew: false,
}
const dummyFriends = [
  {
    ...dummyFriendData,
    location: 'wrld_1:1',
  },
  {
    ...dummyFriendData,
    location: 'wrld_2:1',
  },
  {
    ...dummyFriendData,
    location: 'wrld_1:1',
  },
  {
    ...dummyFriendData,
    location: 'wrld_3:18',
  },
]

interface MockWorldsStore extends ICanGetWorldById {
  setWorlds(worlds: World[]): void
}
const createMockCanGetWorldById: (
  initialWorlds?: World[]
) => MockWorldsStore = (initialWorlds = []) => {
  const state = reactive<{ worlds: World[] }>({
    worlds: [],
  })

  const world = computed(() => {
    return (id: string) => {
      return state.worlds.find(world => world.id === id)
    }
  })

  const setWorlds = (worlds: World[]) => {
    state.worlds = worlds
  }

  state.worlds = initialWorlds

  return {
    world,
    setWorlds,
  }
}

describe('update', () => {
  it('フレンドのlocationを元にinstancesが更新される', async () => {
    class MockInstancesRepository implements IInstancesRepository {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      // eslint-disable-next-line
      async fetchInstance(location: string): Promise<InstanceApiResponse> {}
    }
    const mockInstancesRepository = new MockInstancesRepository()
    const mockCanGetWorldById = createMockCanGetWorldById()
    const instancesStore = new InstancesStore(
      mockInstancesRepository,
      mockCanGetWorldById
    )
    await instancesStore.updateAction(dummyFriends)

    const expectInstances: Instance[] = [
      {
        location: 'wrld_1:1',
        worldId: 'wrld_1',
        isWatching: false,
        notifyUserNum: 1,
        permission: InstancePermission.Public,
      },
      {
        location: 'wrld_2:1',
        worldId: 'wrld_2',
        isWatching: false,
        notifyUserNum: 1,
        permission: InstancePermission.Public,
      },
      {
        location: 'wrld_3:18',
        worldId: 'wrld_3',
        isWatching: false,
        notifyUserNum: 1,
        permission: InstancePermission.Public,
      },
    ]

    expect(instancesStore.instances.value).toEqual(expectInstances)
  })
})

describe('updateInstanceInfo', () => {
  it('インスタンスの状態をAPIから取得し、反映する', async () => {
    const location = 'wrld_1:1'
    class MockInstancesRepository implements IInstancesRepository {
      async fetchInstance(location: string): Promise<InstanceApiResponse> {
        return {
          location: location,
          // eslint-disable-next-line @typescript-eslint/camelcase
          n_users: 10,
          capacity: 10,
        }
      }
    }
    const mockInstancesRepository = new MockInstancesRepository()
    const mockCanGetWorldById = createMockCanGetWorldById()
    const instancesStore = new InstancesStore(
      mockInstancesRepository,
      mockCanGetWorldById
    )

    await instancesStore.updateAction(dummyFriends)
    await instancesStore.updateInstanceInfoAction(location)

    const expectInstances: Instance[] = [
      {
        location: 'wrld_1:1',
        worldId: 'wrld_1',
        isWatching: false,
        notifyUserNum: 1,
        userNum: 10,
        permission: InstancePermission.Public,
      },
      {
        location: 'wrld_2:1',
        worldId: 'wrld_2',
        isWatching: false,
        notifyUserNum: 1,
        permission: InstancePermission.Public,
      },
      {
        location: 'wrld_3:18',
        worldId: 'wrld_3',
        isWatching: false,
        notifyUserNum: 1,
        permission: InstancePermission.Public,
      },
    ]

    expect(instancesStore.instances.value).toEqual(expectInstances)
  })

  it('updateが実行された際も、以前のuserNumは保持される', async () => {
    const location = 'wrld_1:1'
    class MockInstancesRepository implements IInstancesRepository {
      async fetchInstance(location: string): Promise<InstanceApiResponse> {
        return {
          location: location,
          // eslint-disable-next-line @typescript-eslint/camelcase
          n_users: 10,
          capacity: 10,
        }
      }
    }
    const mockInstancesRepository = new MockInstancesRepository()
    const mockCanGetWorldById = createMockCanGetWorldById()
    const instancesStore = new InstancesStore(
      mockInstancesRepository,
      mockCanGetWorldById
    )

    await instancesStore.updateAction(dummyFriends)
    await instancesStore.updateInstanceInfoAction(location)
    await instancesStore.updateAction(dummyFriends)

    const expectInstances: Instance[] = [
      {
        location: 'wrld_1:1',
        worldId: 'wrld_1',
        isWatching: false,
        notifyUserNum: 1,
        permission: InstancePermission.Public,
        userNum: 10,
      },
      {
        location: 'wrld_2:1',
        worldId: 'wrld_2',
        isWatching: false,
        notifyUserNum: 1,
        permission: InstancePermission.Public,
      },
      {
        location: 'wrld_3:18',
        worldId: 'wrld_3',
        isWatching: false,
        notifyUserNum: 1,
        permission: InstancePermission.Public,
      },
    ]

    expect(instancesStore.instances.value).toEqual(expectInstances)
  })
})

describe('watchInstance', () => {
  it('指定されたインスタンスが監視状態になる', async () => {
    const location = 'wrld_1:1'
    class MockInstancesRepository implements IInstancesRepository {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      // eslint-disable-next-line
      async fetchInstance(location: string): Promise<InstanceApiResponse> {}
    }
    const mockInstancesRepository = new MockInstancesRepository()
    const mockCanGetWorldById = createMockCanGetWorldById()
    const instancesStore = new InstancesStore(
      mockInstancesRepository,
      mockCanGetWorldById
    )

    await instancesStore.updateAction(dummyFriends)
    const onFindVacancy = jest.fn()
    await instancesStore.watchInstanceAction({
      location,
      notifyUserNum: 10,
      onFindVacancy,
    })

    const expectedInstance: Instance = {
      location: 'wrld_1:1',
      worldId: 'wrld_1',
      isWatching: true,
      permission: InstancePermission.Public,
      notifyUserNum: 10,
      onFindVacancy,
    }

    expect(instancesStore.instanceByLocation.value(location)).toEqual(
      expectedInstance
    )
  })
})

describe('unwatchInstance', () => {
  it('指定されたインスタンスが非監視状態になる', async () => {
    const location = 'wrld_1:1'
    class MockInstancesRepository implements IInstancesRepository {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      // eslint-disable-next-line
      async fetchInstance(location: string): Promise<InstanceApiResponse> {}
    }
    const mockInstancesRepository = new MockInstancesRepository()
    const mockCanGetWorldById = createMockCanGetWorldById()
    const instancesStore = new InstancesStore(
      mockInstancesRepository,
      mockCanGetWorldById
    )

    await instancesStore.updateAction(dummyFriends)

    const onFindVacancy = jest.fn()
    await instancesStore.watchInstanceAction({
      location,
      notifyUserNum: 10,
      onFindVacancy,
    })

    await instancesStore.unwatchInstanceAction(location)

    const expectedInstance: Instance = {
      location: 'wrld_1:1',
      worldId: 'wrld_1',
      isWatching: false,
      notifyUserNum: 10,
      permission: InstancePermission.Public,
      onFindVacancy,
    }

    expect(instancesStore.instanceByLocation.value(location)).toEqual(
      expectedInstance
    )
  })
})

describe('checkWatchingInstanceVacancy', () => {
  let instancesStore: any
  let mockCanGetWorldById: MockWorldsStore
  const location = 'wrld_1:1'

  beforeEach(async () => {
    class MockInstancesRepository implements IInstancesRepository {
      async fetchInstance(location: string): Promise<InstanceApiResponse> {
        return {
          location: location,
          // eslint-disable-next-line @typescript-eslint/camelcase
          n_users: 10,
          capacity: 10,
        }
      }
    }
    const mockInstancesRepository = new MockInstancesRepository()
    mockCanGetWorldById = createMockCanGetWorldById()
    instancesStore = new InstancesStore(
      mockInstancesRepository,
      mockCanGetWorldById
    )

    await instancesStore.updateAction(dummyFriends)

    const notifyUserNum = 10
    const onFindVacancy = jest.fn()
    await instancesStore.watchInstanceAction({
      location,
      notifyUserNum,
      onFindVacancy,
    })

    await instancesStore.updateInstanceInfoAction(location)
  })

  it('指定されたインスタンスに指定ギリギリの空きがあった場合、onFindVacancyが実行されisWatchingがfalseとなる', async () => {
    mockCanGetWorldById.setWorlds([
      {
        id: 'wrld_1',
        name: 'sample',
        imageUrl: '',
        thumbnailImageUrl: '',
        capacity: 10,
        hardCapacity: 20,
      },
    ])
    await instancesStore.checkWatchingInstanceVacancyAction(location)

    const instance = instancesStore.instanceByLocation.value(location)
    if (instance === undefined) {
      throw new Error('instance is undefined.')
    }

    expect(instance.isWatching).toBe(false)
    expect(instance.onFindVacancy).toHaveBeenCalled()
  })

  it('指定されたインスタンスに指定の空きより1足らなかった場合、何も変わらない', async () => {
    mockCanGetWorldById.setWorlds([
      {
        id: 'wrld_1',
        name: 'sample',
        imageUrl: '',
        thumbnailImageUrl: '',
        capacity: 10,
        hardCapacity: 19,
      },
    ])
    await instancesStore.checkWatchingInstanceVacancyAction(location)

    const instance = instancesStore.instanceByLocation.value(location)
    if (instance === undefined) {
      throw new Error('instance is undefined.')
    }

    expect(instance.isWatching).toBe(true)
    expect(instance.onFindVacancy).not.toHaveBeenCalled()
  })
})
