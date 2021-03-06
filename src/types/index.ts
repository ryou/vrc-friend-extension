import { Color, Theme } from '@/presentations/Colors'

export type UnixTime = number

export type InstanceLocation = string

export type FavoriteType = 'world' | 'friend' | 'avatar'

export type FavoriteTag = 'group_0' | 'group_1' | 'group_2'

export type Friend = {
  id: string
  username: string
  displayName: string
  currentAvatarImageUrl: string
  currentAvatarThumbnailImageUrl: string
  location: InstanceLocation
  favorite?: Favorite
  isNew: boolean
}

export type World = {
  id: string
  name: string
  imageUrl: string
  thumbnailImageUrl: string
  capacity: number
  hardCapacity: number
}

export const InstancePermission = {
  Private: 'private',
  Public: 'public',
  Friends: 'friends',
  FriendPlus: 'friend+',
  Invite: 'invite',
  InvitePlus: 'invite+',
  Unknown: 'unknown',
} as const
export type InstancePermission = typeof InstancePermission[keyof typeof InstancePermission]

export type News = {
  title: string
  content: string
  publishedAt: UnixTime
}

export type Notification = {
  text: string
  date: UnixTime
  onClick: () => void
}

export type Setting = {
  enableNotificationSound: boolean
  theme: Theme
  mainColor: Color
}

export type Instance = {
  worldId: string
  location: InstanceLocation
  permission: InstancePermission
  isWatching: boolean
  notifyUserNum: number
  ownerId?: string
  userNum?: number
  onFindVacancy?: () => void
}

export type Favorite = {
  id: string
  favoriteId: string
  tags: FavoriteTag[]
  type: FavoriteType
}
