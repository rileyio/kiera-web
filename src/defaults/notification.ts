export const defaultNotifications: Array<TrackedNotification> = [
  {
    _title: 'ChastiKey - KH stats lookup',
    _description: `Send a notification when someone Look's up your CK stats on this server.`,
    _discordEnabled: true,
    authorID: '',
    serverID: '',
    owner: '',
    name: 'notify-ck-stats-keyholder',
    state: false,
    where: 'Discord'
  }
]

export interface TrackedNotification {
  _title: string
  _description: string
  _discordEnabled: boolean
  authorID: string
  serverID: string
  owner: string
  name: string
  state: boolean,
  where: string
}