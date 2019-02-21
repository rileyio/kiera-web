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